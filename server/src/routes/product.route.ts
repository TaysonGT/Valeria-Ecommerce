import express from 'express'
import { ProductController } from '../controllers/product.controller'
import { auth, isPermitted } from '../middlewares/auth.middleware'

const productController = new ProductController()
const productRouter = express.Router()

productRouter.get('/', productController.allProducts)
productRouter.get('/search', productController.searchProducts)
productRouter.get('/categories', productController.allCategories)
productRouter.get('/featured', productController.featuredProducts)
productRouter.get('/related/:id', productController.relatedProducts)
productRouter.get('/:id', productController.singleProduct)

productRouter.post('/', auth, isPermitted('admin'), productController.createProduct)
productRouter.post('/:id/images', auth, isPermitted('admin'), productController.addImagesToProduct)
productRouter.post('/:productId/variants', auth, isPermitted('admin'), productController.createVariant)

productRouter.patch('/:productId', productController.updateProduct)
productRouter.patch('/:productId/variants/:variantId', productController.patchVariant)
productRouter.put('/:productId/deactivate', productController.deactivateProduct)
productRouter.put('/:productId/activate', productController.activateProduct)
productRouter.put('/:productId/images/:imageId/set-primary', productController.setProductImagePrimary)

productRouter.delete('/:productId/variants/:variantId', productController.removeVariant)
productRouter.delete('/:productId/images/:imageId', productController.removeImage)
productRouter.delete('/:productId/categories/:categoryId', productController.removeCategoryFromProduct)

productRouter.post('/fittings', auth, isPermitted('admin'), productController.createFitting)


// productRouter.post('/categories', productController.createCategory)

export default productRouter