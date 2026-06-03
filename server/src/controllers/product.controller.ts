import { Response, Request } from "express";
import { imageType, IProduct, IVariant, Product } from "../schemas/product.schema";
import { isValidObjectId, Types } from "mongoose";
import { ObjectId } from "mongodb";
import { Fitting } from "../schemas/fitting.schema";
import { Gender } from "../schemas/gender.schema";
import { Category, ICategory } from "../schemas/category.schema";
import { findProducts } from "../services/search.service";
import { ICollection } from "../schemas/collection.schema";
import { ImageService } from '../services/image.service';
import path from 'path';
import fs from 'fs';

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
            res.status(201).json({product, success: true})
        }).catch((error)=>{
            res.status(500).json({message: 'Database operation failed', error, success: false})
        })
    }
    
    async allCategories(req: Request, res: Response){
        const categories =  await Category.find()

        res.status(201).json({categories, success: true});
    }

    async searchProducts(req: Request, res: Response){
        try{
            const {products, totalCount, filters} = await findProducts(req)
            res.json({
                products,
                totalCount,
                filters,
                success: true
            });
            
        }catch(error){
            res.status(500).json({ 
                message: 'Search failed',
                error: error instanceof Error ? error.message : 'Unknown error',
                success: false
            });
        }
    }

    async createFitting(req: Request, res: Response){
        const { name, code } = req.body
        const fitting = new Fitting({ name, code })

        await fitting.save().then(()=>{
            res.status(201).json({fitting, success: true})
        }).catch((error)=>{
            res.status(500).json({message: 'Database operation failed', error, success: false})
        })

    }
    
    async createGender(req: Request, res: Response){
        const { name, code } = req.body
        const gender = new Gender({ name, code })

        await gender.save().then(()=>{
            res.status(201).json({gender, success: true})
        }).catch((error)=>{
            res.status(500).json({message: 'Database operation failed', error, success: false})
        })
    }

    async allProducts(req: Request, res: Response){
        const products =  await Product.find()

        res.json({products, success: true});
    }

    async featuredProducts(req: Request, res: Response){
        const products =  await Product.find().limit(4)

        res.json({products, success: true});
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
        // const categories = await Category.find()

        const relatedProducts = await Product.find({
            categories: { $in: categoryIds }
        })
        .populate('categories')
        .exec()
        // console.log({relatedProducts})

        if(relatedProducts.length<4){
            const fillRelated = await Product.find().limit(4-relatedProducts.length)
            relatedProducts.push(...fillRelated)
        }

        res.json({relatedProducts, success:true})
    }

    async createVariant(req: Request, res: Response){
        try {
            const { productId } = req.params;

            if (!isValidObjectId(productId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid product ID format',
                });
                return;
            }
            
            const { sizeCode, inventory, priceAdjustment } = req.body;

            // Validate required fields
            if (!sizeCode || !inventory?.stock === undefined || !inventory?.barcode) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: sizeCode, inventory.stock, inventory.barcode',
                });
                return;
            }

            const product = await Product.findById(productId);

            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
                return;
            }

            // Check for duplicate sizeCode within the same product
            const duplicateVariant = product.variants.some(
                (variant) => variant.sizeCode === sizeCode
            );

            if (duplicateVariant) {
                res.status(409).json({
                    success: false,
                    message: `Variant with sizeCode "${sizeCode}" already exists for this product`,
                });
                return;
            }

            const newVariant = {
                sizeCode,
                inventory: {
                    stock: inventory.stock,
                    barcode: inventory.barcode,
                    reserved: inventory.reserved ?? 0,
                    ...(inventory.warehouseLocation && {
                    warehouseLocation: inventory.warehouseLocation,
                    }),
                },
                priceAdjustment: priceAdjustment ?? 0,
            };

            product.variants.push(newVariant);
            await product.save();

            const createdVariant = product.variants[product.variants.length - 1];

            res.status(201).json({
                success: true,
                message: 'Variant created successfully',
                data: createdVariant,
            });
        } catch (error) {
            console.error('[createProductVariant] Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    async removeVariant(req: Request, res: Response){
        try {
            const { productId, variantId } = req.params;

            if (!isValidObjectId(productId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid product ID format',
                });
                return;
            }

            if (!isValidObjectId(variantId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid variant ID format',
                });
                return;
            }

            const product = await Product.findById(productId);

            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
                return;
            }

            // Check for duplicate sizeCode within the same product
            const variantExists = product.variants.some(
                (variant) => variant._id?.toString() === variantId
            );

            if (!variantExists) {
                res.status(404).json({
                    success: false,
                    message: `Variant not found for this product`,
                });
                return;
            }

            product.variants = product.variants.filter(variant=>variant._id?.toString()!==variantId);
            
            await product.save();

            res.status(201).json({
                success: true,
                message: 'Variant removed successfully',
            });
        } catch (error) {
            console.error('[createProductVariant] Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    async removeCategoryFromProduct(req: Request, res: Response){
        try{
            const {productId, categoryId} = req.params
            
            if (!isValidObjectId(productId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid product ID format',
                });
                return;
            }
            
            if (!isValidObjectId(categoryId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid category ID format',
                });
                return;
            }

            
            const product = await Product.findById(productId);

            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
                return;
            }

            const category = product.categories.some(
                (category)=>category._id.toString()===categoryId
            )

            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Category not associated to product',
                });
                return;
            }

            product.categories = product.categories.filter(category=>category._id.toString()!==categoryId)

            await product.save()

            res.status(201).json({
                success: true,
                message: 'Category removed successfully',
                data: product,
            });

        } catch (error) {
            console.error('[RemoveProductCategory] Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    async setProductImagePrimary(req: Request, res: Response){
        try{
            const {productId, imageId} = req.params
            
            if (!isValidObjectId(productId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid product ID format',
                });
                return;
            }
            
            if (!isValidObjectId(imageId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid image ID format',
                });
                return;
            }
            
            const product = await Product.findById(productId);

            if (!product) {
                res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
                return;
            }

            const image = product.imgs.some(
                (image)=>image._id?.toString()===imageId
            )

            if (!image) {
                res.status(404).json({
                    success: false,
                    message: 'Image not found for this product',
                });
                return;
            }

            product.imgs = product.imgs.map(
                image=>
                    image._id?.toString()===imageId?
                    {...image, isPrimary: true}
                    :
                    {...image, isPrimary: false}
            )

            await product.save()

            res.status(201).json({
                success: true,
                message: 'Image set primary successfully',
                data: product,
            });

        } catch (error) {
            console.error('[setPrimaryImage] Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };

    async updateProduct(req: Request, res: Response){
        const {productId} = req.params;
        const updates = req.body;

        if (!isValidObjectId(productId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid product ID format',
            });
            return;
        }

        try {
            const result = await Product.updateOne(
                { _id: new ObjectId(productId as string) },
                { $set: updates }
            );

            if (result.matchedCount === 0) {
                res.status(404).send({ message: "Product not found", success: false });
                return 
            }

            res.send({ message: "Update product successfully", success: true });
        } catch (error) {
            res.status(500).send(error);
        }
    }   

    
  // Upload images for a product
  async uploadImages(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
      }
      
      const product = await Product.findById(productId);
      if (!product) {
        // Clean up uploaded files
        files.forEach(file => fs.unlinkSync(file.path));
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      const uploadedImages = [];
      
      for (const file of files) {
        // Process image (resize, optimize)
        const processedPath = file.path.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '_processed.jpg');
        await ImageService.processImage(file.path, processedPath);
        
        const filename = path.basename(processedPath);

        // Generate public URL
        const imageUrl = `/uploads/products/${filename}`;
        
        // Create image object
        const newImage = {
          url: imageUrl,
          altText: file.originalname,
          isPrimary: product.imgs.length === 0 // First image becomes primary
        };
        
        product.imgs.push(newImage);
        uploadedImages.push(newImage);
      }
      
      await product.save();
      
    //   // Generate full URLs for response
    //   const imagesWithFullUrl = uploadedImages.map(img => ({
    //     ...img,
    //     url: ImageService.getImageUrl(req, img.url.split('/').pop())
    //   }));
      
      return res.status(200).json({
        success: true,
        message: `Successfully uploaded ${files.length} image(s)`,
        data: { images: uploadedImages }
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
    }
  }
  
    // Delete image
    async deleteImage(req: Request, res: Response) {
        try {
            const { productId, imageId } = req.params;
            
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            
            const imageIndex = product.imgs.findIndex(img => img._id?.toString() === imageId);

            if (imageIndex === -1) {
                return res.status(404).json({ success: false, message: 'Image not found' });
            }
            
            // Delete file from filesystem
            const image = product.imgs[imageIndex];
            const filename = image.url.split('/').pop();
            if (filename) {
                const filePath = path.join(__dirname, '../../uploads/products', filename);
                if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                }
            }
            
            // Remove from database
            product.imgs.splice(imageIndex, 1);
            
            // If deleted image was primary, set a new primary
            if (image.isPrimary && product.imgs.length > 0) {
                product.imgs[0].isPrimary = true;
            }
            
            await product.save();
            
            return res.status(200).json({
                success: true,
                message: 'Image deleted successfully'
            });    
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                message: 'Delete failed', 
                error: error.message 
            });
        }
    }
    
}