import express from 'express'
import { ProductController } from '../controllers/product.controller'

const productController = new ProductController()
const productRouter = express.Router()

productRouter.get('/', productController.allProducts)
productRouter.post('/', productController.createProduct)
productRouter.get('/categories', productController.allCategories)
productRouter.post('/categories', productController.createCategory)

export default productRouter