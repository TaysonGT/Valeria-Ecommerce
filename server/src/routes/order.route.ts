import express from 'express'
import { OrderController } from '../controllers/order.controller'
import { auth } from '../middlewares/auth.middleware'

const orderRouter = express.Router()
const orderController = new OrderController()

orderRouter.post('/create', auth, (req, res, next) => {
  void orderController.createOrder(req as any, res).catch(next)
})
orderRouter.get('/my-orders', auth, (req, res, next) => {
  void orderController.getOrders(req as any, res).catch(next)
})
orderRouter.get('/:orderId', auth, (req, res, next) => {
  void orderController.getOrder(req as any, res).catch(next)
})

export default orderRouter
