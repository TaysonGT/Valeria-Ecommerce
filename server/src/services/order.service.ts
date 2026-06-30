import { ObjectId } from "mongodb";
import { Order, IOrder, OrderFulfillmentStatus, IOrderItem } from "../schemas/order.schema";
import { IProduct, IVariant, Product } from "../schemas/product.schema";
import mongoose from "mongoose";
import { processPayment } from "./payment.service";

export interface StatusUpdatePayload {
  newStatus: OrderFulfillmentStatus;
  actor: 'customer' | 'admin' | 'system' | 'warehouse' | 'carrier';
  actorId?: string;
  location?: string;
  notes?: string;
  metadata?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    [key: string]: any;
  };
}

export type CartItem = {
  product: IProduct,
  quantity: number,
  variant: IVariant
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export class OrderService {

  /**
   * Update order status with full validation and audit trail
   */
  async getOrdersByStatus(
    {status, page, limit=10}:{status?: string, page: number, limit?: number})
  : Promise<{ 
    totalPages: number; 
    counts: any; 
    orders: IOrder[], 
    totalFilteredCount: number; 
    limit: number 
  }> {
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    // const filterStatus = validStatuses.includes(status) ? status : 'pending';
    
    let statusArray: string[];
    
    statusArray = validStatuses.filter(s=>s!=='delivered'&&s!=='cancelled');
    
    if(status&&validStatuses.includes(status)){
      statusArray = [status]
    }
    
    // Pagination settings
    const skip = (page - 1) * limit;
    
    // Base query - only get orders for this user
    const baseQuery = {};
    
    // Get paginated orders with status filter
    const orders = await Order.find({ 
      ...baseQuery,
      ...status&&{fulfillmentStatus: { $in: statusArray }}
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
    
    // Get total counts for each status type
    const statusCounts = await Order.aggregate([
    // { $match: {userId: new ObjectId(req.user.id)} },
    {
        $group: {
        _id: "$fulfillmentStatus",
        count: { $sum: 1 }
        }
    }
    ]);
    
    // Format status counts with default 0 for missing statuses
    const counts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };
    
    statusCounts.forEach(item => {
    if (counts.hasOwnProperty(item._id)) {
        counts[item._id as keyof typeof counts] = item.count;
    }
    });
    
    // Get total count for current filtered status (for pagination)
    const totalFilteredCount = await Order.countDocuments({
    ...baseQuery,
    fulfillmentStatus: { $in: statusArray }
    });
    
    const totalPages = Math.ceil(totalFilteredCount / limit)
    
    return {totalPages, counts, orders, totalFilteredCount, limit};  
  }

  async getAllOrders(
    {status, page, limit=10}:{status?: string, page: number, limit?: number})
  : Promise<{ 
    totalPages: number; 
    counts: any; 
    orders: IOrder[], 
    totalFilteredCount: number; 
    limit: number 
  }> {
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    // const filterStatus = validStatuses.includes(status) ? status : 'pending';
    
    let statusArray: string[];
    
    statusArray = validStatuses.filter(s=>s!=='delivered'&&s!=='cancelled');
    
    if(status&&validStatuses.includes(status)){
      statusArray = [status]
    }
    
    // Pagination settings
    const skip = (page - 1) * limit;
    
    // Base query - only get orders for this user
    const baseQuery = {};
    
    // Get paginated orders with status filter
    const orders = await Order.find({ 
      ...baseQuery,
      ...status&&{fulfillmentStatus: { $in: statusArray }}
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
    
    // Get total counts for each status type
    const statusCounts = await Order.aggregate([
    // { $match: {userId: new ObjectId(req.user.id)} },
    {
        $group: {
        _id: "$fulfillmentStatus",
        count: { $sum: 1 }
        }
    }
    ]);
    
    // Format status counts with default 0 for missing statuses
    const counts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };
    
    statusCounts.forEach(item => {
    if (counts.hasOwnProperty(item._id)) {
        counts[item._id as keyof typeof counts] = item.count;
    }
    });
    
    // Get total count for current filtered status (for pagination)
    const totalFilteredCount = await Order.countDocuments({
    ...baseQuery,
    fulfillmentStatus: { $in: statusArray }
    });
    
    const totalPages = Math.ceil(totalFilteredCount / limit)
    
    return {totalPages, counts, orders, totalFilteredCount, limit};  
  }

  async createOrder({cartItems, userId, customerInfo,paymentMethod,paymentDetails,shippingAddress,billingAddress}
    :{
      cartItems: CartItem[],
      userId: string,
      paymentMethod: string;
      paymentDetails: { cardNumber: string; expiry: string; cvv: string };
      customerInfo: { firstName: string; lastName: string; email: string; phone?: string };
      shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string };
      billingAddress: { street: string; city: string; state: string; zipCode: string; country: string }
    }): Promise<{order: IOrder, payment: any}> {

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('Cart cannot be empty')
      }

      for (const item of cartItems) {
        const product = await Product.findById(item.product._id)
        if (!product) {
          throw new Error(`Product ${item.product.title} was not found`)
        }

        const variant = product.variants.find((variant) => variant.sizeCode === item.variant.sizeCode)
        if (!variant) {
          throw new Error(`Variant ${item.variant.sizeCode} not found for ${product.title}`)
        }

        if (variant.inventory.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.title} - ${variant.sizeCode}`)
        }
      }

      const orderItems: IOrderItem[] = []
      let subtotal = 0

      for (const cartItem of cartItems) {
        const product = cartItem.product
        const unitPrice = product.basePrice + (cartItem.variant.priceAdjustment || 0)
        const totalPrice = unitPrice * cartItem.quantity

        const productRecord = await Product.findById(product._id)
        const variantRecord = productRecord?.variants.find((variant) => variant.sizeCode === cartItem.variant.sizeCode)
        if (variantRecord) {
          variantRecord.inventory.stock = Math.max(variantRecord.inventory.stock - cartItem.quantity, 0)
          if (productRecord) {
            await productRecord.save()
          }
        }

        orderItems.push({
          productId: product._id as ObjectId,
          productSnapshot: {
            title: product.title,
            basePrice: product.basePrice,
            discountPrice: product.discountPrice,
            imgs: product.imgs.filter((img) => img.isPrimary).slice(0, 1),
          },
          variantSnapshot: {
            sizeCode: cartItem.variant.sizeCode,
            priceAdjustment: cartItem.variant.priceAdjustment || 0,
          },
          quantity: cartItem.quantity,
          unitPrice,
          totalPrice,
        })

        subtotal += totalPrice
      }

      const tax = this.calculateTax(subtotal)
      const shippingCost = this.calculateShipping(shippingAddress.state || 'ALX')

      const order = new Order({
        orderNumber: this.generateOrderNumber(),
        userId: userId,
        items: orderItems,
        subtotal,
        taxTotal: tax,
        shippingCost,
        grandTotal: subtotal + tax + shippingCost,
        currency: 'USD',
        customerInfo: {
          email: customerInfo.email,
          phone: customerInfo.phone,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
        },
        shippingAddress,
        billingAddress,
        paymentMethod: (paymentMethod || 'credit_card') as any,
        paymentStatus: 'pending',
        statusTimestamps: {
          // ordered: new Date(),
          pending: new Date(),
        }
      })

      const paymentResult = await processPayment(order, paymentMethod, paymentDetails)
      if (paymentResult.success) {
        order.paymentStatus = 'paid'
        order.paymentDetails = {
          transactionId: paymentResult.transactionId,
          paymentGateway: paymentResult.paymentGateway,
          paidAt: new Date(),
        }
      }

      await order.save()
      await session.commitTransaction()
      return {order, payment: paymentResult}
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async getOrderById(orderId: string, userId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, userId }).exec()
    if (!order) {
      throw new Error('Order not found')
    }
    return order
  }

  async getOrdersByUserId(
    {userId, page, status = 'upcoming'}:
    {userId: string, page: number, status: string})
    : Promise<{
      orders:IOrder[], 
      statusCounts: { 
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
      }, totalPages: number, 
      totalFilteredCount: number, 
      limit: number
    }> {

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    let statusArray: string[];
    
    statusArray = validStatuses.filter(s=>s!=='delivered'&&s!=='cancelled');
    
    if(validStatuses.includes(status)){
      statusArray = [status]
    }
    
    // Pagination settings
    const limit = 10;
    const skip = (page - 1) * limit;
    
    // Base query - only get orders for this user
    const baseQuery = { userId };
    
    // Get paginated orders with status filter
    const orders = await Order.find({ 
      ...baseQuery, 
      fulfillmentStatus: { $in: statusArray }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    // Get total counts for each status type
    const statusCountsArray = await Order.aggregate([
      { $match: {userId: new ObjectId(userId)} },
      {
        $group: {
          _id: "$fulfillmentStatus",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format status counts with default 0 for missing statuses
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    
    statusCountsArray.forEach(item => {
      if (statusCounts.hasOwnProperty(item._id)) {
        statusCounts[item._id as keyof typeof statusCounts] = item.count;
      }
    });
    
    // Get total count for current filtered status (for pagination)
    const totalFilteredCount = await Order.countDocuments({
      ...baseQuery,
      fulfillmentStatus: { $in: statusArray }
    });
    
    const totalPages = Math.ceil(totalFilteredCount / limit);
    return { orders, statusCounts, totalPages, totalFilteredCount, limit }
  }

  // private async createOrderFromCart(cartItems: CartItem[], userId: string) {
  //   const orderItems: IOrderItem[] = []
  //   let subtotal = 0

  //   for (const cartItem of cartItems) {
  //     const product = cartItem.product
  //     const unitPrice = product.basePrice + (cartItem.variant.priceAdjustment || 0)
  //     const totalPrice = unitPrice * cartItem.quantity

  //     orderItems.push({
  //       productId: product._id as ObjectId,
  //       productSnapshot: {
  //         title: product.title,
  //         basePrice: product.basePrice,
  //         discountPrice: product.discountPrice,
  //         imgs: product.imgs.filter((img) => img.isPrimary).slice(0, 1),
  //       },
  //       variantSnapshot: {
  //         sizeCode: cartItem.variant.sizeCode,
  //         priceAdjustment: cartItem.variant.priceAdjustment || 0,
  //       },
  //       quantity: cartItem.quantity,
  //       unitPrice,
  //       totalPrice,
  //     })

  //     subtotal += totalPrice

  //     const variant = product.variants.find((v) => v.sizeCode === cartItem.variant.sizeCode)
  //     if (variant) {
  //       variant.inventory.stock = Math.max(variant.inventory.stock - cartItem.quantity, 0)
  //       await product.save()
  //     }
  //   }

  //   const tax = this.calculateTax(subtotal)
  //   const shippingCost = this.calculateShipping('ALX')

  //   const order = new Order({
  //     orderNumber: this.generateOrderNumber(),
  //     userId,
  //     items: orderItems,
  //     subtotal,
  //     taxTotal: tax,
  //     shippingCost,
  //     grandTotal: subtotal + tax + shippingCost,
  //     currency: 'USD',
  //     customerInfo: {
  //       email: '',
  //       firstName: '',
  //       lastName: '',
  //     },
  //     shippingAddress: {
  //       street: '',
  //       city: '',
  //       state: '',
  //       zipCode: '',
  //       country: '',
  //     },
  //     billingAddress: {
  //       street: '',
  //       city: '',
  //       state: '',
  //       zipCode: '',
  //       country: '',
  //     },
  //     paymentMethod: 'credit_card',
  //   })

  //   return await order.save()
  // }

  private  calculateTax = (amount: number) => {
    const VAT_RATIO = 0.14
    return Math.round(amount * VAT_RATIO)
  }
  
  private calculateShipping = (state: string) => {
    return state?.toUpperCase() === 'ALX' ? 50 : 70
  }
  
  private generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 900) + 100}`
  }
  
}

// Export a singleton instance
export const orderService = new OrderService();