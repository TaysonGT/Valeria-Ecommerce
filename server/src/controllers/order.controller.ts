import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import { IOrderItem, Order } from '../schemas/order.schema'
import { IProduct, IVariant, Product } from '../schemas/product.schema'
import { AuthenticatedRequest } from '../middlewares/auth.middleware'
import { processPayment } from '../services/payment.service'
import { Response } from 'express';

interface OrderQuery {
  page?: string;
  status?: string;
}

export type CartItem = {
  product: IProduct,
  quantity: number,
  variant: IVariant
}

const calculateTax = (amount: number) => {
  const VAT_RATIO = 0.14
  return Math.round(amount * VAT_RATIO)
}

const calculateShipping = (state: string) => {
  return state?.toUpperCase() === 'ALX' ? 50 : 70
}

const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 900) + 100}`
}

export class OrderController {
  async createOrderFromCart(cartItems: CartItem[], userId: string) {
    const orderItems: IOrderItem[] = []
    let subtotal = 0

    for (const cartItem of cartItems) {
      const product = cartItem.product
      const unitPrice = product.basePrice + (cartItem.variant.priceAdjustment || 0)
      const totalPrice = unitPrice * cartItem.quantity

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

      const variant = product.variants.find((v) => v.sizeCode === cartItem.variant.sizeCode)
      if (variant) {
        variant.inventory.stock = Math.max(variant.inventory.stock - cartItem.quantity, 0)
        await product.save()
      }
    }

    const tax = calculateTax(subtotal)
    const shippingCost = calculateShipping('ALX')

    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId,
      items: orderItems,
      subtotal,
      taxTotal: tax,
      shippingCost,
      grandTotal: subtotal + tax + shippingCost,
      currency: 'USD',
      customerInfo: {
        email: '',
        firstName: '',
        lastName: '',
      },
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      paymentMethod: 'credit_card',
    })

    return await order.save()
  }

  async createOrder(req: AuthenticatedRequest, res: Response) {
    const { cart, paymentMethod, paymentDetails, customerInfo, shippingAddress, billingAddress } = req.body as {
      cart: CartItem[];
      paymentMethod: string;
      paymentDetails: { cardNumber: string; expiry: string; cvv: string };
      customerInfo: { firstName: string; lastName: string; email: string; phone?: string };
      shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string };
      billingAddress: { street: string; city: string; state: string; zipCode: string; country: string };
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      if (!cart || !Array.isArray(cart) || cart.length === 0) {
        throw new Error('Cart cannot be empty')
      }

      for (const item of cart) {
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

      for (const cartItem of cart) {
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

      const tax = calculateTax(subtotal)
      const shippingCost = calculateShipping(shippingAddress.state || 'ALX')

      const order = new Order({
        orderNumber: generateOrderNumber(),
        userId: req.user.id,
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

      return res.status(201).json({ order, success: true, payment: paymentResult })
    } catch (error: any) {
      await session.abortTransaction()
      return res.status(400).json({ success: false, message: error.message })
    } finally {
      session.endSession()
    }
  }

  async getOrders (req: AuthenticatedRequest, res: Response) {
    try {
      const { page = '1', status = 'upcoming' }: OrderQuery = req.query;
      
      // Validate status
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      // const filterStatus = validStatuses.includes(status) ? status : 'pending';
      
      let statusArray: string[];
      
      statusArray = validStatuses.filter(s=>s!=='delivered'&&s!=='cancelled');
      
      if(validStatuses.includes(status)){
        statusArray = [status]
      }
      
      // Pagination settings
      const limit = 10;
      const skip = (parseInt(page) - 1) * limit;
      
      // Base query - only get orders for this user
      const baseQuery = { userId: req.user.id };
      
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
      const statusCounts = await Order.aggregate([
        { $match: {userId: new ObjectId(req.user.id)} },
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
      
      const totalPages = Math.ceil(totalFilteredCount / limit);
      
      return res.status(200).json({
        success: true,
        message: `Orders fetched successfully for status: ${status}`,
        data: {
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

  // Optional: Alternative with more detailed response including payment status
   async getOrdersDetailed (req: AuthenticatedRequest, res: Response) {
    try {
      const { page = '1', status = 'pending' }: OrderQuery = req.query;
      
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      // const filterStatus = validStatuses.includes(status) ? status : 'pending';

      let statusArray: string[];
      
      statusArray = validStatuses.filter(s=>s!=='delivered'&&s!=='cancelled');
      
      if(validStatuses.includes(status)){
        statusArray = [status]
      }
      
      const limit = 10;
      const skip = (parseInt(page) - 1) * limit;
      const baseQuery = { userId: req.user.id };
      
      // Get orders with pagination
      const orders = await Order.find({ 
        ...baseQuery, 
        fulfillmentStatus: { $in: statusArray }
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      
      // Get comprehensive statistics
      const stats = await Order.aggregate([
        { $match: baseQuery },
        {
          $facet: {
            fulfillmentBreakdown: [
              {
                $group: {
                  _id: "$fulfillmentStatus",
                  count: { $sum: 1 },
                  orders: { $push: "$$ROOT" }
                }
              }
            ],
            paymentBreakdown: [
              {
                $group: {
                  _id: "$paymentStatus",
                  count: { $sum: 1 }
                }
              }
            ],
            totalSpent: [
              {
                $group: {
                  _id: null,
                  total: { $sum: "$grandTotal" }
                }
              }
            ]
          }
        }
      ]);
      
      // Format fulfillment counts
      const fulfillmentCounts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };
      
      stats[0]?.fulfillmentBreakdown.forEach((item:any) => {
        if (fulfillmentCounts.hasOwnProperty(item._id)) {
          fulfillmentCounts[item._id as keyof typeof fulfillmentCounts] = item.count;
        }
      });
      
      // Format payment counts
      const paymentCounts = {
        pending: 0,
        paid: 0,
        failed: 0,
        refunded: 0
      };
      
      stats[0]?.paymentBreakdown.forEach((item:any) => {
        if (paymentCounts.hasOwnProperty(item._id)) {
          paymentCounts[item._id as keyof typeof paymentCounts] = item.count;
        }
      });
      
      const totalFilteredCount = await Order.countDocuments({
        ...baseQuery,
        fulfillmentStatus: { $in: statusArray }
      });
      
      const totalPages = Math.ceil(totalFilteredCount / limit);
      
      return res.status(200).json({
        success: true,
        message: `Orders fetched successfully for status: ${status}`,
        data: {
          orders,
          summary: {
            currentStatus: status,
            fulfillmentStatusCounts: fulfillmentCounts,
            paymentStatusCounts: paymentCounts,
            totalSpent: stats[0]?.totalSpent[0]?.total || 0
          },
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalFilteredCount,
            itemsPerPage: limit,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
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
      const order = await Order.findOne({ _id: orderId, userId: req.user.id }).exec()
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' })
      }
      return res.json({ success: true, order })
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }
}
