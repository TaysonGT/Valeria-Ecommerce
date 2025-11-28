import { Request } from 'express'
import { Product, IProduct } from '../schemas/product.schema';
import { PipelineStage } from 'mongoose';

type filterOption = {code: string, name: string, count: number}

type filterType = {
    title: string,
    opts: filterOption[]
}

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
    const {q} = req.query

    let filters: filterType[] = []
    const cacheKey = q || 'default';

    if (!req.app.locals.filterCache || req.app.locals.filterCache.key !== cacheKey) {
        const [genders, fittings, availabilityList] = await Promise.all([
            Product.aggregate([
                {$match: productFilter},
                {
                    $group: {
                        _id: "$gender",
                        count: {$sum:1}
                    }
                },
                {
                    $lookup: {
                        from: 'genders',
                        localField: '_id',
                        foreignField: 'code',
                        as: 'genderInfo'
                    }
                },
                { $unwind: "$genderInfo" },
                {
                    $project:{
                        code: "$_id",
                        name: "$genderInfo.name",
                        count: 1,
                        _id: 0
                    }
                }
            ]),
            Product.aggregate([
                { $match: productFilter },
                {
                    $group: {
                        _id: "$fitting",
                        count: { $sum: 1 }
                    }
                },
                { 
                    $lookup: {
                        from: 'fittings',
                        localField: '_id',
                        foreignField: 'code',
                        as: 'fittingInfo'
                    } 
                },
                { $unwind: "$fittingInfo" },
                {
                    $project:{
                        code: "$_id",
                        name: "$fittingInfo.name",
                        count: 1,
                        _id: 0
                    }
                }

            ]),
            Product.aggregate([
                { $match: productFilter },
                { $unwind: "$variants" }, // Break down variants
                {
                $group: {
                    _id: "$_id", // Group back by product
                    hasStock: {
                        $max: { $gt: ["$variants.inventory.stock", 0] } // At least one variant has stock
                    }
                }
                },
                {
                $group: {
                    _id: {
                    $cond: [
                        "$hasStock",
                        "in",
                        "out"
                    ]
                    },
                    count: { $sum: 1 }
                }
                },
                {
                    $project: {
                        code: "$_id",
                        name: {
                            $switch: {
                                branches: [
                                { case: { $eq: ["$_id", "in"] }, then: "In Stock" },
                                { case: { $eq: ["$_id", "out"] }, then: "Out of Stock" }
                                ]
                            }
                        },
                        count: 1,
                        _id: 0
                    }
                }
            ])
        ])
            
        // Cache the filters
        req.app.locals.filterCache = {
            key: cacheKey,
            data: filters
        };

        availabilityList.length&& filters.push({title: "Availability", opts: availabilityList})
        genders.length&& filters.push({title: "Gender", opts: genders})
        fittings.length&& filters.push({title: "Fitting", opts: fittings})

    } else {
        filters = req.app.locals.filterCache.data;
    }


    return filters
}

export const findProducts = async (req: Request) => {
    const { q, gender, fitting, availability, page = '1', pagination = '10', sort='none', order='asc' }: SearchParams = req.query;

    // Build the aggregation pipeline
    const pipeline: PipelineStage[] = [];
    const productFilter: any = {};
    let sortStage: PipelineStage = { $sort: { createdAt: -1 } };

    // Text search handling
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

    // Additional filters
    if (gender) {
        const codes = gender.split(',');
        productFilter.gender = { $in: codes };
    }
    
    if (fitting) {
        const codes = fitting.split(',');
        productFilter.fitting = { $in: codes };
    }
    
    if (availability) {
        const statuses = availability.split(',');
        const stockConditions = [];
        
        if (statuses.includes('in')) {
            stockConditions.push({
                $expr: {
                    $gt: [
                        { $max: "$variants.inventory.stock" },
                        0
                    ]
                }
            });
        }
        
        if (statuses.includes('out')) {
            stockConditions.push({
                $expr: {
                    $lte: [
                        { $max: "$variants.inventory.stock" },
                        0
                    ]
                }
            });
        }

        productFilter.$or = stockConditions;
    }

    // Add $match stage if we have any filters
    if (Object.keys(productFilter).length > 0) {
        pipeline.push({ $match: productFilter });
    }

    // Handle sorting
    if (sort !== 'none') {
        switch (sort) {
            case 'price':
                // Add effective price calculation and sort by it
                pipeline.push(
                    { $addFields: { effectivePrice: { $ifNull: ["$discountPrice", "$basePrice"] } }},
                );
                if(order==='asc') pipeline.push(
                    { $sort: { effectivePrice: 1 } }
                );
                else pipeline.push(
                    { $sort: { effectivePrice: -1 } }
                );
                
                break;
            case 'name':
                if(order==='asc') pipeline.push(
                    { $sort: { title: 1 } }
                );
                else pipeline.push(
                    { $sort: { title: -1 } }
                );
                break;
        }
    } else {
        // Default sort (either textScore or createdAt)
        pipeline.push(sortStage);
    }

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(pagination);
    pipeline.push(
        { $skip: skip },
        { $limit: parseInt(pagination) }
    );

    // Execute aggregation
    const [products, totalCount] = await Promise.all([
        Product.aggregate(pipeline),
        Product.countDocuments(productFilter)
    ]);

    return {
        products: products as IProduct[],
        totalCount,
        searchFilter: productFilter
    };
};