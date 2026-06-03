import { AuthenticatedRequest } from '../middlewares/auth.middleware'
import { Response } from 'express';
import { CartItem, OrderService } from '../services/order.service'
import { OrderTrackingService } from '../services/order-tracking.service';

const orderService = new OrderService()
const orderTrackingService = new OrderTrackingService()

interface OrderQuery {
  page?: string;
  status?: string;
}

export class OrderController {

  async createOrder(req: AuthenticatedRequest, res: Response) {
    const { cart, paymentMethod, paymentDetails, customerInfo, shippingAddress, billingAddress } = req.body as {
      cart: CartItem[];
      paymentMethod: string;
      paymentDetails: { cardNumber: string; expiry: string; cvv: string };
      customerInfo: { firstName: string; lastName: string; email: string; phone?: string };
      shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string };
      billingAddress: { street: string; city: string; state: string; zipCode: string; country: string };
    }
    
    try{
      const {order, payment: paymentResult} = await orderService.createOrder({
        cartItems: cart,
        userId: req.user.id,
        paymentMethod,
        paymentDetails,
        customerInfo,
        shippingAddress,
        billingAddress
      })
      return res.status(201).json({ order, success: true, payment: paymentResult })
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message })
    } 
  }

  async getMyOrders (req: AuthenticatedRequest, res: Response) {
    try {
      const { page = '1', status = 'upcoming' }: OrderQuery = req.query;

      const {
        orders, 
        statusCounts, 
        totalPages, 
        totalFilteredCount, 
        limit
      } = await orderService.getOrdersByUserId({ userId: req.user.id, page: parseInt(page), status});

      return res.status(200).json({
        success: true,
        message: `Orders fetched successfully for status: ${status}`,
        orders,
        currentStatus: status,
        statusCounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalFilteredCount,
          itemsPerPage: limit,
          hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
      });
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }
  };

  async getAllOrders (req: AuthenticatedRequest, res: Response) {
    try {
      const { page = '1', status = 'upcoming' }: OrderQuery = req.query;

      const {totalPages, counts, orders, totalFilteredCount, limit} = await orderService.getAllOrders(status, parseInt(page));
      
      return res.status(200).json({
        success: true,
        message: `Orders fetched successfully for status: ${status}`,
        orders,
        currentStatus: status,
        statusCounts: counts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalFilteredCount,
          itemsPerPage: limit,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      });
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }
  };

  async getOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderId } = req.params
      const order = await orderService.getOrderById(orderId as string, req.user.id)
      
      return res.json({ success: true, order })
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderId } = req.params
      const { newStatus } = req.body

      const updatedOrder = await orderTrackingService.updateOrderStatus(orderId as string, newStatus)

      return res.json({ success: true, order: updatedOrder })
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }
  
  async bulkUpdateOrderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { orderIds, newStatus } = req.body

      const results = await orderTrackingService.bulkUpdateOrderStatus(orderIds, newStatus, req.user.id)

      return res.json({ success: true, results })
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }
}
