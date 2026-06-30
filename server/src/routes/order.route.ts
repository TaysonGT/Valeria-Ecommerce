import express from 'express'
import { OrderController } from '../controllers/order.controller'
import { auth, isPermitted } from '../middlewares/auth.middleware'

const orderRouter = express.Router()
const orderController = new OrderController()


// ==================== ADMIN ROUTES ====================
// All admin routes require admin role

// Admin: Get all orders
orderRouter.get('/admin',
  auth, 
  isPermitted('admin'), 
  (req, res, next) => {
    void orderController.getAllOrders(req as any, res).catch(next)
  }
)

// Admin: Bulk update order status
orderRouter.post('/admin/bulk-update-status', 
  auth, 
  isPermitted('admin'), 
  (req, res, next) => {
    void orderController.bulkUpdateOrderStatus(req as any, res).catch(next)
  }
)

// Admin: Update any order status (general)
orderRouter.put('/admin/:orderId/status', 
  auth, 
  isPermitted('admin'), 
  (req, res, next) => {
    void orderController.updateOrderStatus(req as any, res).catch(next)
  }
)

// Admin: Set order to processing
orderRouter.put('/admin/:orderId/processing', 
  auth, 
  isPermitted('admin'), 
  (req, res, next) => {
    void orderController.setOrderProcessing(req as any, res).catch(next)
  }
)

// Admin: Mark order as shipped (with carrier or in-house delivery)
orderRouter.put('/admin/:orderId/ship', 
  auth, 
  isPermitted('admin'), 
  (req, res, next) => {
    void orderController.setAsShipped(req as any, res).catch(next)
  }
)

// Admin: Mark order as out for delivery
orderRouter.put('/admin/:orderId/out-for-delivery', 
  auth, 
  isPermitted('admin'), 
  (req, res, next) => {
    void orderController.setAsOutForDelivery(req as any, res).catch(next)
  }
)

// Admin: Mark order as delivered
orderRouter.put('/admin/:orderId/deliver', 
  auth, 
  isPermitted('admin'), 
  (req, res, next) => {
    void orderController.setAsDelivered(req as any, res).catch(next)
  }
)

// Admin: Add tracking event (carrier update, admin note, etc.)
orderRouter.post('/admin/:orderId/tracking-event', 
  auth, 
  isPermitted('admin'), 
  (req, res, next) => {
    void orderController.addTrackingEvent(req as any, res).catch(next)
  }
)

// Admin: Get single order (full details)
orderRouter.get('/admin/:orderId', 
  auth, 
  isPermitted('admin'), 
  (req, res, next) => {
    void orderController.getOrder(req as any, res).catch(next)
  }
)

// ==================== CUSTOMER ROUTES ====================
// All customer routes require authentication
orderRouter.use(auth)

// Customer: Create order
orderRouter.post('/create', (req, res, next) => {
  void orderController.createOrder(req as any, res).catch(next)
})

// Customer: Get my orders
orderRouter.get('/latest', (req, res, next) => {
  void orderController.getLatestOrders(req as any, res).catch(next)
})

// Customer: Get my orders
orderRouter.get('/my-orders', (req, res, next) => {
  void orderController.getMyOrders(req as any, res).catch(next)
})

// Customer: Cancel my own order
orderRouter.put('/:orderId/cancel', (req, res, next) => {
  void orderController.cancelOrder(req as any, res).catch(next)
})

// Customer: Get single order (their own)
orderRouter.get('/:orderId', (req, res, next) => {
  void orderController.getOrder(req as any, res).catch(next)
})


export default orderRouter
