import { Order, OrderFulfillmentStatus } from "../schemas/order.schema";

// order.service.ts
export class OrderTrackingService {
  
  // Status transition rules
  private allowedTransitions: Record<string, string[]> = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['out_for_delivery', 'delivered'],
    'out_for_delivery': ['delivered'],
    'delivered': ['refunded'],
    'cancelled': [],
    'refunded': []
  };

  // Update order status with validation
  async updateOrderStatus(orderId: string, payload: {newStatus: OrderFulfillmentStatus, userId: string, location?:string, notes?: string}) {
    const order = await Order.findById(orderId);
    
    if (!order) throw new Error('Order not found');
    
    // Check if transition is allowed
    if (!this.allowedTransitions[order.fulfillmentStatus]?.includes(payload.newStatus)) {
      throw new Error(`Cannot transition from ${order.fulfillmentStatus} to ${payload.newStatus}`);
    }
    
    // Update status and timestamps
    order.fulfillmentStatus = payload.newStatus;
    
    // Add audit log
    order.trackingInfo?.trackingHistory.push({
        status: payload.newStatus,
        location: payload.location,
        timestamp: new Date(),
        description: payload.notes || `Order status updated to ${payload.newStatus} by ${payload.userId}`
    });
    
    await order.save();
    
    // Trigger notifications
    // await this.sendStatusUpdateNotification(order, payload.newStatus);
    
    return order;
  }
}