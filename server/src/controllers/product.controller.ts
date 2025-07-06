import { Response, Request } from "express";
import { categoryRefType, collectionRefType, imageType, Product, variantType } from "../schemas/product.schema";
import { Types } from "mongoose";

export class ProductController {
    async createProduct(req: Request, res: Response){
        const data = req.body

        const dataForm = {
            title: data.title,
            description: data.description,
            basePrice: data.basePrice,
            discountPrice: data.discountPrice,
            currency: data.currency,
            variants: data.variants.map((v:variantType)=>({
                sizeCode: v.sizeCode,
                inventory: {
                    stock: v.inventory.stock,
                    barcode: v.inventory.stock,
                    reserved: v.inventory.reserved
                }
            })),
            categories: data.categories.map((c: categoryRefType)=>({
                categoryId: new Types.ObjectId(c.categoryId),
                name: c.name
            })),
            collections: data.collections.map((c: collectionRefType)=>({
                collectionId: new Types.ObjectId(c.collectionId),
                title: c.title 
            })),
            imgs: data.imgs.map((i: imageType)=>({
                url: i.url,
                isPrimary: i.isPrimary,
                altText: i.altText
            }))
        }
        console.log(dataForm)
        const product = new Product(dataForm)
        await product.save().then(()=>{
            res.status(201).json(product)
        }).catch((error)=>{
            res.status(500).json({message: 'Database operation failed', error})
        })
    }

    async createCategory(req: Request, res: Response){
        

        try{
            // await categoryRepo.save(category)
            res.status(201).json("category")
        }catch(error) {
            res.status(500).json({message: 'Database operation failed', error})
        }
    }
    
    async allCategories(req: Request, res: Response){
        // const categories =  await categoryRepo.find()

        res.status(201).json('categories');
    }
    
    async allProducts(req: Request, res: Response){
        const products =  await Product.find()

        res.status(201).json({products});
    }
}