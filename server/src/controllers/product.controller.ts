import { Response, Request } from "express";
import { imageType, IProduct, IVariant, Product } from "../schemas/product.schema";
import { Types } from "mongoose";
import { Fitting } from "../schemas/fitting.schema";
import { Gender } from "../schemas/gender.schema";
import { Category, ICategory } from "../schemas/category.schema";
import { findProducts } from "../services/search.service";
import { ICollection } from "../schemas/collection.schema";


export class ProductController {
    async createProduct(req: Request, res: Response){
        const data = req.body

        const dataForm: Partial<IProduct> = {
            title: data.title,
            description: data.description,
            basePrice: data.basePrice,
            discountPrice: data.discountPrice,
            currency: data.currency,
            fitting: data.fitting,
            gender: data.gender,
            variants: data.variants.map((v: IVariant)=>({
                sizeCode: v.sizeCode,
                inventory: {
                    stock: v.inventory.stock,
                    barcode: v.inventory.stock,
                    reserved: v.inventory.reserved
                }
            })),
            categories: data.categories.map((c: ICategory)=>({
                categoryId: new Types.ObjectId(c._id),
                name: c.name
            })),
            collections: data.collections.map((c: ICollection)=>({
                collectionId: new Types.ObjectId(c._id),
                title: c.title 
            })),
            imgs: data.imgs.map((i: imageType)=>({
                url: i.url,
                isPrimary: i.isPrimary,
                altText: i.altText
            }))
        }

        const product = new Product(dataForm)

        await product.save().then(()=>{
            res.status(201).json({product})
        }).catch((error)=>{
            res.status(500).json({message: 'Database operation failed', error})
        })
    }
    
    async allCategories(req: Request, res: Response){
        const categories =  await Category.find()

        res.status(201).json({categories});
    }

    async searchProducts(req: Request, res: Response){
        try{
            const {products, totalCount, filters} = await findProducts(req)
            res.json({
                products,
                totalCount,
                filters
            });
            
        }catch(error){
            res.status(500).json({ 
                message: 'Search failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async createFitting(req: Request, res: Response){
        const { name, code } = req.body
        const fitting = new Fitting({ name, code })

        await fitting.save().then(()=>{
            res.status(201).json({fitting})
        }).catch((error)=>{
            res.status(500).json({message: 'Database operation failed', error})
        })

    }
    
    async createGender(req: Request, res: Response){
        const { name, code } = req.body
        const gender = new Gender({ name, code })

        await gender.save().then(()=>{
            res.status(201).json({gender})
        }).catch((error)=>{
            res.status(500).json({message: 'Database operation failed', error})
        })
    }

    async allProducts(req: Request, res: Response){
        const products =  await Product.find()

        res.json({products});
    }

    async featuredProducts(req: Request, res: Response){
        const products =  await Product.find().limit(4)

        res.json({products});
    }
    
    async singleProduct(req: Request, res: Response){
        const {id} = req.params
        const product = await Product.findById(id)
        
        if(!product){
            res.status(404).json({message: "Product not found", success: false});
            return;
        }

        res.json({product, success:true})
    }
    
    async relatedProducts(req: Request, res: Response){
        const {id} = req.params
        const product = await Product.findById(id)
        
        if(!product){
            res.status(404).json({message: "Product not found", success: false});
            return;
        }

        const categoryIds = product.categories.map(category=>category._id)
        const categories = await Category.find()

        console.log({categoryIds, categoriesRel:product.categories, categories})
        
        const relatedProducts = await Product.find({
            categories: { $in: categoryIds }
        })
        .populate('categories')
        .exec()
        // const relatedProducts = await Product.aggregate([
        //     {
        //         $match: {
        //             categories: {
        //                 $in: categoryIds
        //             }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'categories',
        //             localField: 'categories',
        //             foreignField: '_id',
        //             as: 'categoryDetails'
        //         }
        //     },
        //     {
        //         $addFields: {
        //             matchingCategories: {
        //                 $filter: {
        //                     input: '$categoryDetails',
        //                     as: 'category',
        //                     cond: { $in: ['$$category._id', categoryIds] }
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             title: 1,
        //             categories: 1,
        //             categoryDetails: 1,
        //             matchingCategories: 1,
        //             matchingCount: { $size: '$matchingCategories' }
        //         }
        //     },
        //     {
        //         $sort: { matchingCount: -1 }
        //     }
        // ])

        // const relatedProducts = [...categoryRelated, ...collectionRelated]
        console.log({relatedProducts})

        if(relatedProducts.length<4){
            const fillRelated = await Product.find().limit(4-relatedProducts.length)
            relatedProducts.push(...fillRelated)
        }

        res.json({relatedProducts, success:true})
    }
}