import { Order, IOrder, OrderFulfillmentStatus } from "../schemas/order.schema";

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

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export class OrderService {

  /**
   * Update order status with full validation and audit trail
   */
  async getAllOrders(
    status: string,
    page: number,
  ): Promise<{ totalPages: number; counts: any; orders: IOrder[], totalFilteredCount: number; limit: number }> {
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
    const skip = (page - 1) * limit;
    
    // Base query - only get orders for this user
    const baseQuery = {};
    
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

  // ==================== PRIVATE HELPER METHODS ====================
}

// Export a singleton instance
export const orderService = new OrderService();