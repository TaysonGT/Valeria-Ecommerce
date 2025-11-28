import express from 'express'
import { ProductController } from '../controllers/product.controller'

const productController = new ProductController()
const productRouter = express.Router()

productRouter.get('/all', productController.allProducts)
productRouter.get('/search', productController.searchProducts)
productRouter.get('/categories', productController.allCategories)
productRouter.get('/featured', productController.featuredProducts)
productRouter.get('/related/:id', productController.relatedProducts)
productRouter.get('/:id', productController.singleProduct)
productRouter.post('/', productController.createProduct)
productRouter.post('/fittings', productController.createFitting)
productRouter.post('/genders', productController.createGender)
// productRouter.post('/categories', productController.createCategory)

export default productRouter