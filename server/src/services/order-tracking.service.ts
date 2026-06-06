// order.service.ts
import { Order, IOrder, OrderFulfillmentStatus, CarrierType } from "../schemas/order.schema";
import mongoose from 'mongoose';
import { User } from "../schemas/user.schema";

export interface StatusUpdatePayload {
  newStatus: OrderFulfillmentStatus;
  actorId?: string;
  location?: string;
  notes?: string;
  metadata?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    deliveryAgentName?: string, 
    deliveryAgentPhone?: string, 
    deliveryNotes?: string,
    deliveryAssignedAt?: string,
    deliveryType?: 'carrier' | 'in_house'
    [key: string]: any;
  };
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export class OrderTrackingService {
  
  // Status transition rules - who can do what
  private allowedTransitions: Record<OrderFulfillmentStatus, OrderFulfillmentStatus[]> = {
    'pending': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['out_for_delivery', 'delivered', 'cancelled'],
    'out_for_delivery': ['delivered', 'cancelled'],
    'delivered': ['refunded'],
    'cancelled': [],
    'refunded': []
  };

  // Role-based permissions
  private rolePermissions: Record<string, OrderFulfillmentStatus[]> = {
    'customer': ['cancelled'],
    'admin': ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
    'warehouse': ['processing', 'shipped'],
    'carrier': ['shipped', 'out_for_delivery', 'delivered'],
    'system': ['pending', 'processing', 'cancelled']
  };

  // Status display order for UI
  private statusOrder: OrderFulfillmentStatus[] = [
    'pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'
  ];

  /**
   * Update order status with full validation and audit trail
   */
  async updateOrderStatus(
    orderId: string,
    payload: StatusUpdatePayload,
    // userId: string
  ): Promise<IOrder> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        throw new Error('Order not found');
      }
      
      const user = await User.findById(payload.actorId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // Validate the transition
      const validation = await this.validateTransition(order, payload, user.role);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const oldStatus = order.fulfillmentStatus;
      const newStatus = payload.newStatus;

      // Update order status
      order.fulfillmentStatus = newStatus;

      // Update status timestamps (canonical timeline)
      if (!order.statusTimestamps) {
        order.statusTimestamps = {} as any;
      }
      order.statusTimestamps[newStatus] = new Date();

      // Add to tracking history (for user visibility)
      if (!order.trackingInfo) {
        order.trackingInfo = {
          carrier: 'other',
          carrierName: '',
          trackingNumber: '',
          trackingHistory: []
        };
      }

      const shippingStatuses = ['shipped', 'out_for_delivery', 'delivered'];
      if (shippingStatuses.includes(newStatus)) {
        if (!order.trackingInfo) {
          order.trackingInfo = {
            carrier: 'other',
            carrierName: '',
            trackingNumber: '',
            trackingHistory: []
          };
        }
        
        order.trackingInfo.trackingHistory.push({
          event: newStatus,
          location: payload.location,
          timestamp: new Date(),
          description: this.getShippingEventDescription(newStatus, payload),
          isCarrierEvent: false
        });
      }

      // Handle side effects based on status change
      await this.handleStatusSideEffects(order, oldStatus, newStatus, payload, session);

      // Handle terminal status timestamps
      if (newStatus === 'cancelled') {
        order.cancelledAt = new Date();
      }

      await order.save({ session });
      await session.commitTransaction();

      // Trigger async notifications (don't await - fire and forget)
      this.sendStatusUpdateNotification(order, oldStatus, newStatus, payload);

      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Add carrier/operational event WITHOUT changing order status
   * This is for detailed tracking like "Arrived at facility"
   */
  async addTrackingEvent(
    orderId: string,
    payload: {
      event: string;
      location?: string;
      description: string;
      timestamp?: Date;
      actor: 'carrier' | 'admin' | 'system';
      actorId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (!payload.actorId&&payload.actor==='admin') throw new Error('Actor ID should be provided');

    if (!order.trackingInfo) {
      order.trackingInfo = {
        carrier: 'other',
        carrierName: '',
        trackingNumber: '',
        trackingHistory: []
      };
    }

    order.trackingInfo.trackingHistory.push({
      event: payload.event,
      location: payload.location,
      timestamp: payload.timestamp || new Date(),
      description: payload.description,
      isCarrierEvent: payload.actor === 'carrier'
    });

    await order.save();
    return order;
  }

  private getShippingEventDescription(status: OrderFulfillmentStatus, payload: StatusUpdatePayload): string {
    switch (status) {
      case 'shipped':
        if (payload.metadata?.trackingNumber) {
          return `Shipped via ${payload.metadata.carrier || 'carrier'}. Tracking: ${payload.metadata.trackingNumber}`;
        }
        return `Order has been shipped`;
      case 'out_for_delivery':
        return `Out for delivery today`;
      case 'delivered':
        return `Order delivered successfully`;
      default:
        return payload.notes || `Status changed to ${status}`;
    }
  }

  /**
   * Validate if a status transition is allowed
   */
  private async validateTransition(
    order: IOrder,
    payload: StatusUpdatePayload,
    role: 'customer' | 'admin' | 'warehouse' | 'carrier'
  ): Promise<ValidationResult> {
    const { newStatus, metadata } = payload;
    const currentStatus = order.fulfillmentStatus;

    // Check if actor is allowed to perform this transition
    if (!this.rolePermissions[role]?.includes(newStatus)) {
      return {
        valid: false,
        error: `You are not allowed to change status to "${newStatus}"`
      };
    }

    // Check if transition is allowed from current status
    if (!this.allowedTransitions[currentStatus]?.includes(newStatus)) {
      return {
        valid: false,
        error: `Cannot transition from ${currentStatus} to ${newStatus}`
      };
    }

    // Business rule: Require tracking number when shipping
    if (newStatus === 'shipped') {
      if (payload.metadata?.deliveryType === 'carrier') {
        if (!metadata?.trackingNumber) {
          return {
            valid: false,
            error: 'Tracking number required for carrier delivery'
          }
        }
        
        // Validate tracking number format based on carrier
        if (metadata.carrier && !this.isValidTrackingNumber(metadata.trackingNumber, metadata.carrier)) {
          return {
            valid: false,
            error: `Invalid tracking number format for ${metadata.carrier}`
          };
        }

      } else if (payload.metadata?.deliveryType === 'in_house') {
        // In-house delivery - no tracking number required
        // But might need delivery agent info
        if (!metadata?.deliveryAgentName || !metadata?.deliveryAgentPhone) {
          console.warn(`Missing agent info for order ${order.orderNumber}`);
          return {
            valid: false,
            error: 'Delivery agent name and phone are required for in-house delivery'
          };
        }
      } else {
        return {
          valid: false,
          error: 'deliveryType must be specified when marking order as shipped (carrier or in_house)'
        };
      }
    }

    // Business rule: Can't cancel paid order after shipping
    if (newStatus === 'cancelled') {
      if (order.paymentStatus === 'paid' && currentStatus !== 'pending') {
        return {
          valid: false,
          error: 'Cannot cancel order after payment has been processed'
        };
      }
    }

    // Business rule: Can't mark as delivered without shipping
    if (newStatus === 'delivered' && currentStatus === 'processing') {
      return {
        valid: false,
        error: 'Order must be shipped before it can be marked as delivered'
      };
    }

    // Payment validation for delivery
    if (newStatus === 'delivered' && order.paymentStatus !== 'paid') {
      return {
        valid: false,
        error: 'Cannot mark order as delivered when payment is not completed'
      };
    }
    
    // Payment validation for delivery
    if (newStatus === 'processing' && order.paymentStatus !== 'paid' && order.paymentMethod ==='cod') {
      return {
        valid: false,
        error: `Cannot mark order as processing when payment is not completed for method: ${order.paymentMethod}`
      };
    }

    return { valid: true };
  }

  /**
   * Handle side effects when status changes
   */
  private async handleStatusSideEffects(
    order: IOrder,
    oldStatus: OrderFulfillmentStatus,
    newStatus: OrderFulfillmentStatus,
    payload: StatusUpdatePayload,
    session: mongoose.ClientSession
  ): Promise<void> {
    switch (newStatus) {
      case 'shipped':
         if (payload.metadata?.deliveryType === 'in_house') {
          // In-house delivery - store agent info
          order.deliveryType = 'in_house';
          order.deliveryAgent = {
            name: payload.metadata?.deliveryAgentName || 'Unknown',
            phone: payload.metadata?.deliveryAgentPhone || 'Unknown',
            assignedAt: payload.metadata?.deliveryAssignedAt? 
              new Date(payload.metadata.deliveryAssignedAt) 
              : new Date(),
            notes: payload.metadata?.deliveryNotes || ''
          };
        }else if (payload.metadata?.deliveryType === 'carrier') {
          // Carrier delivery - store tracking info
          order.deliveryType = 'carrier'
          if (payload.metadata?.trackingNumber) {
            order.trackingInfo = {
              ...order.trackingInfo,
              carrier: payload.metadata.carrier as CarrierType || 'other',
              carrierName: this.getCarrierDisplayName(payload.metadata.carrier || 'other'),
              trackingNumber: payload.metadata.trackingNumber,
              trackingUrl: this.generateTrackingUrl(
                payload.metadata.carrier || 'other',
                payload.metadata.trackingNumber
              ),
              trackingHistory: [
                ...order.trackingInfo?.trackingHistory||[]
              ],
              estimatedDelivery: payload.metadata.estimatedDelivery
            };
          }
        }

        break;

      case 'cancelled':
        // Release inventory if order is cancelled
        await this.releaseInventory(order, session);
        break;

      case 'refunded':
        // Update payment status
        order.paymentStatus = 'refunded';
        if (!order.paymentDetails) {
          order.paymentDetails = {};
        }
        order.paymentDetails.refundedAt = new Date();
        break;

      case 'delivered':
        // Could trigger satisfaction survey, review request, etc.
        break;
    }
  }

  /**
   * Get order with full timeline
   */
  async getOrderWithTimeline(orderId: string): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    return {
      order,
      timeline: this.buildTimeline(order),
      availableActions: this.getAvailableActions(order)
    };
  }

  /**
   * Build user-friendly timeline from status timestamps
   */
  private buildTimeline(order: IOrder) {
    const timeline = [];
    
    for (let i = 0; i < this.statusOrder.length; i++) {
      const status = this.statusOrder[i];
      const timestamp = order.statusTimestamps?.[status];
      
      timeline.push({
        status,
        label: this.getStatusLabel(status),
        description: this.getStatusDescription(status),
        completed: !!timestamp,
        timestamp: timestamp || null,
        isCurrent: order.fulfillmentStatus === status,
        icon: this.getStatusIcon(status)
      });
    }

    // Handle terminal statuses
    if (order.fulfillmentStatus === 'cancelled') {
      timeline.push({
        status: 'cancelled',
        label: 'Cancelled',
        description: order.notes || 'Order has been cancelled',
        completed: true,
        timestamp: order.cancelledAt,
        isCurrent: true,
        icon: '❌'
      });
    }

    if (order.fulfillmentStatus === 'refunded') {
      timeline.push({
        status: 'refunded',
        label: 'Refunded',
        description: 'Payment has been refunded',
        completed: true,
        timestamp: order.paymentDetails?.refundedAt,
        isCurrent: true,
        icon: '💰'
      });
    }

    return timeline;
  }

  /**
   * Get available actions based on user role and current status
   */
  getAvailableActions(order: IOrder, userRole: string = 'customer'): Array<{
    action: OrderFulfillmentStatus;
    label: string;
    requiresInput?: boolean;
    inputType?: 'tracking' | 'none';
  }> {
    const currentStatus = order.fulfillmentStatus;
    const actions = [];

    // Check if user role can perform any transitions from current status
    const possibleTransitions = this.allowedTransitions[currentStatus] || [];
    
    for (const newStatus of possibleTransitions) {
      if (this.rolePermissions[userRole]?.includes(newStatus)) {
        const action = {
          action: newStatus,
          label: this.getActionLabel(newStatus),
          requiresInput: newStatus === 'shipped',
          inputType: newStatus === 'shipped' ? 'tracking' as const : 'none' as const
        };
        actions.push(action);
      }
    }

    return actions;
  }

  /**
   * Bulk update order statuses (admin utility)
   */
  async bulkUpdateOrderStatus(
    orderIds: string[],
    newStatus: OrderFulfillmentStatus,
    actor: string,
    actorId?: string
  ): Promise<{ success: string[]; failed: { id: string; error: string }[] }> {
    const results = { success: [] as string[], failed: [] as { id: string; error: string }[] };

    for (const orderId of orderIds) {
      try {
        await this.updateOrderStatus(orderId, {
          newStatus,
          actorId,
          notes: `Bulk update by ${actor}`
        });
        results.success.push(orderId);
      } catch (error: any) {
        results.failed.push({ id: orderId, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get status statistics for dashboard
   */
  async getStatusStatistics(userId?: string): Promise<Record<OrderFulfillmentStatus, number>> {
    const match: any = {};
    if (userId) {
      match.userId = new mongoose.Types.ObjectId(userId);
    }

    const stats = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$fulfillmentStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    const result: Record<OrderFulfillmentStatus, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
      refunded: 0
    };

    stats.forEach(stat => {
      if (result.hasOwnProperty(stat._id)) {
        result[stat._id as OrderFulfillmentStatus] = stat.count;
      }
    });

    return result;
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private async releaseInventory(order: IOrder, session: mongoose.ClientSession): Promise<void> {
    // Implementation depends on your inventory system
    console.log(`Releasing inventory for order ${order.orderNumber}`);
    // This would restore stock levels for cancelled orders
  }

  private async sendStatusUpdateNotification(
    order: IOrder,
    oldStatus: OrderFulfillmentStatus,
    newStatus: OrderFulfillmentStatus,
    payload: StatusUpdatePayload
  ): Promise<void> {
    // Fire and forget - implement with your email/SMS service
    console.log(`📧 Notification: Order ${order.orderNumber} changed from ${oldStatus} to ${newStatus}`);
    // Example: await emailService.sendStatusUpdate(order.customerInfo.email, order, newStatus);
  }

  private isValidTrackingNumber(trackingNumber: string, carrier: string): boolean {
    // Simple validation - can be expanded
    if (!trackingNumber || trackingNumber.length < 5) return false;
    
    const patterns: Record<string, RegExp> = {
      usps: /^[0-9]{20,30}$|^[A-Z]{2}[0-9]{9}[A-Z]{2}$/,
      fedex: /^[0-9]{12,15}$/,
      ups: /^1Z[A-Z0-9]{16}$|^[0-9]{18}$/,
      dhl: /^[0-9]{10,11}$/
    };
    
    const pattern = patterns[carrier];
    return pattern ? pattern.test(trackingNumber) : true;
  }

  private generateTrackingUrl(carrier: string, trackingNumber: string): string {
    const urls: Record<string, string> = {
      usps: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      fedex: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      ups: `https://www.ups.com/track?tracknum=${trackingNumber}`,
      dhl: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
    };
    return urls[carrier] || '';
  }

  private getCarrierDisplayName(carrier: string): string {
    const names: Record<string, string> = {
      usps: 'USPS',
      fedex: 'FedEx',
      ups: 'UPS',
      dhl: 'DHL Express',
      other: 'Other Carrier'
    };
    return names[carrier] || carrier;
  }

  private getStatusLabel(status: OrderFulfillmentStatus): string {
    const labels: Record<OrderFulfillmentStatus, string> = {
      pending: 'Order Placed',
      processing: 'Processing',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };
    return labels[status];
  }

  private getStatusDescription(status: OrderFulfillmentStatus): string {
    const descriptions: Record<OrderFulfillmentStatus, string> = {
      pending: 'Your order has been received and payment is being verified',
      processing: 'Your order is being prepared for shipment',
      shipped: 'Your order is on its way',
      out_for_delivery: 'Your order is out for delivery today',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled',
      refunded: 'Your payment has been refunded'
    };
    return descriptions[status];
  }

  private getStatusIcon(status: OrderFulfillmentStatus): string {
    const icons: Record<OrderFulfillmentStatus, string> = {
      pending: '📋',
      processing: '🔧',
      shipped: '🚚',
      out_for_delivery: '🚛',
      delivered: '📦',
      cancelled: '❌',
      refunded: '💰'
    };
    return icons[status];
  }

  private getActionLabel(status: OrderFulfillmentStatus): string {
    const labels: Record<OrderFulfillmentStatus, string> = {
      pending: 'Start Processing',
      processing: 'Mark as Shipped',
      shipped: 'Mark as Out for Delivery',
      out_for_delivery: 'Mark as Delivered',
      delivered: 'Process Refund',
      cancelled: 'Cancel Order',
      refunded: 'Refund Order'
    };
    return labels[status];
  }
}

// Export a singleton instance
export const orderTrackingService = new OrderTrackingService();