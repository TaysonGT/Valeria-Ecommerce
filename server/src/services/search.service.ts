import { Request } from 'express'
import { Product, IProduct } from '../schemas/product.schema';
import { PipelineStage } from 'mongoose';

const filterCache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL = 30_000; // 30 seconds

// type filterOption = {code: string, name: string, count: number}

// type filterType = {
//     title: string,
//     opts: filterOption[]
// }

interface SearchParams {
  q?: string;
  gender?: string;
  fitting?: string;
  availability?: string;
  page?: string;
  pagination?: string;
  sort?: string;
  order?: string;
}

export const getSearchFilters = async(req: Request, productFilter: any)=> {
    // let filters: filterType[] = []
    const cacheKey = JSON.stringify(productFilter) || 'default'; // Use the filter, not just q
    const cached = filterCache.get(cacheKey);

    // Check cache based on the filter conditions
    if (cached && cached.expiresAt > Date.now()) {
        return cached.data;
    }
    
    const aggregatedFilters = await Product.aggregate([
        { $match: productFilter },
        {
            $facet: {
                genders: [ { $group: { _id: "$gender", count: { $sum: 1 } } } ],
                fittings: [ { $group: { _id: "$fitting", count: { $sum: 1 } } } ],
                availability: [ { $group: { _id: "$hasStock", count: { $sum: 1 } } } ]
            }
        },
        {
            // Map the grouped facets into your exact title and opts structure
            $project: {
                filters: [
                    {
                        title: "Gender",
                        opts: {
                            $map: {
                                input: "$genders",
                                as: "g",
                                in: { code: { $toString: "$$g._id" }, name: { $toString: "$$g._id" }, count: "$$g.count" }
                            }
                        }
                    },
                    {
                        title: "Fitting",
                        opts: {
                            $map: {
                                input: "$fittings",
                                as: "f",
                                in: { code: { $toString: "$$f._id" }, name: { $toString: "$$f._id" }, count: "$$f.count" }
                            }
                        }
                    },
                    {
                        title: "Availability",
                        opts: {
                            $map: {
                                input: "$availability",
                                as: "a",
                                in: { 
                                    code: { $cond: { if: { $eq: ["$$a._id", true] }, then: "in", else: "out" }}, 
                                    // Handles boolean true/false to readable text string
                                    name: { $cond: { if: { $eq: ["$$a._id", true] }, then: "In Stock", else: "Out of Stock" } }, 
                                    count: "$$a.count" 
                                }
                            }
                        }
                    }
                ]
            }
        }
    ])

    
    // aggregatedFilters[0].availability.length&& filters.push({title: "Availability", opts: aggregatedFilters[0].availability})
    // aggregatedFilters[0].genders.length&& filters.push({title: "Gender", opts: aggregatedFilters[0].genders})
    // aggregatedFilters[0].fittings.length&& filters.push({title: "Fitting", opts: aggregatedFilters[0].fittings})
    
    // console.log({
    //     aggregatedFilters: aggregatedFilters[0]?.filters,
    //     opts: aggregatedFilters[0]?.filters?.flatMap((f:any)=>f.opts),
    //     availability: aggregatedFilters[0].availability
    // })

    // Cache the filters
    filterCache.set(cacheKey, {
        data: aggregatedFilters[0]?.filters,
        expiresAt: Date.now() + CACHE_TTL
    });


    return aggregatedFilters[0]?.filters
}

export const findProducts = async (req: Request) => {
    const { q, gender, fitting, availability, page = '1', pagination = '10', sort='none', order='asc' }: SearchParams = req.query;

    // Build the aggregation pipeline
    const pipeline: PipelineStage[] = [];
    const productFilter: any = {};  // <-- THIS gets built below
    let sortStage: PipelineStage = { $sort: { createdAt: -1 } };

    // Text search handling - this ADDS to productFilter
    if (q) {
        const searchTerms = q.trim().split(/\s+/);
        
        if (searchTerms.length <= 2) {
            // Partial matching with regex
            productFilter.$or = searchTerms.map(term => ({
                $or: [
                    { title: { $regex: term, $options: 'i' } },
                    { description: { $regex: term, $options: 'i' } },
                    { 'variants.sizeCode': { $regex: term, $options: 'i' } }
                ]
            }));
        } else {
            // Full-text search
            productFilter.$text = { 
                $search: searchTerms.join(' '),
                $language: 'english'
            };
            sortStage = { $sort: { score: { $meta: 'textScore' } } };
        }
    }

    // Gender filter - this ADDS to productFilter
    if (gender) {
        const codes = gender.split(',');
        productFilter.gender = { $in: codes };
    }
    
    // Fitting filter - this ADDS to productFilter
    if (fitting) {
        const codes = fitting.split(',');
        productFilter.fitting = { $in: codes };
    }
    
    // Availability filter - this ADDS to productFilter
    if (availability) {
        const statuses = availability.split(',');
        
        if (statuses.includes('in') && statuses.includes('out')) {
            // Both - no filter needed
        } else if (statuses.includes('in')) {
            productFilter['variants.inventory.stock'] = { $gt: 0 };
        } else if (statuses.includes('out')) {
            productFilter.hasStock = false;  // uses the index, no pipeline stage needed
        }
    }

    // ✅ CRITICAL: Call getSearchFilters HERE with the productFilter we just built
    // This ensures filters are based on currently applied search/filters
    const filters = await getSearchFilters(req, productFilter);

    // Add $match stage if we have any filters in productFilter
    if (Object.keys(productFilter).length > 0) {
        pipeline.unshift({ $match: productFilter });
    }

    // Handle sorting
    if (sort !== 'none') {
        switch (sort) {
            case 'price':
                pipeline.push(
                    { $addFields: { effectivePrice: { $ifNull: ["$discountPrice", "$basePrice"] } } },
                );
                if(order === 'asc') pipeline.push(
                    { $sort: { effectivePrice: 1 } }
                );
                else pipeline.push(
                    { $sort: { effectivePrice: -1 } }
                );
                break;
            case 'name':
                if(order === 'asc') pipeline.push(
                    { $sort: { title: 1 } }
                );
                else pipeline.push(
                    { $sort: { title: -1 } }
                );
                break;
        }
    } else {
        pipeline.push(sortStage);
    }

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(pagination);
    // pipeline.push(
    //     { $skip: skip },
    //     { $limit: parseInt(pagination) }
    // );

    // Execute aggregation
    // const [products, totalCount] = await Promise.all([
    //     Product.aggregate(pipeline),
    //     Product.countDocuments(productFilter)  // ← Uses the SAME productFilter
    // ]);

    const [{products, total}] = await Product.aggregate([
        ...pipeline,
        {
            $facet: {
                products: [ { $skip: skip }, { $limit: parseInt(pagination) } ],
                total: [ { $count: "count" } ]
            }
        },
    ])

    console.log({totalCount: total})

    return {
        products: products as IProduct[],
        totalCount: total,
        filters,  // ← Return the filters too
        searchFilter: productFilter
    };
};