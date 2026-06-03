// shipment.controller.ts
import { Request, Response } from 'express';
import { Order, OrderTrackingInfo } from '../schemas/order.schema';

export class ShipmentController {
  
  // Admin: Create shipment for an order
  async createShipment(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { carrier, trackingNumber, shippingMethod } = req.body;
      
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Verify order is in correct state
      if (!['cancelled', 'processing'].includes(order.fulfillmentStatus)) {
        return res.status(400).json({ 
          message: `Cannot ship order with status: ${order.fulfillmentStatus}` 
        });
      }
      
      // Generate tracking URL based on carrier
      const trackingUrl = this.generateTrackingUrl(carrier, trackingNumber);
      
      // Update order with tracking info
      order.trackingInfo = {
        carrier,
        carrierName: this.getCarrierDisplayName(carrier),
        trackingNumber,
        trackingUrl,
        trackingHistory: [{
          event: 'shipped',
          timestamp: new Date(),
          location: '',
          description: `Shipment created with ${carrier}, tracking #${trackingNumber}`,
          isCarrierEvent: false
        }],
        estimatedDelivery: this.calculateEstimatedDelivery(shippingMethod)
      };
      
      order.fulfillmentStatus = 'shipped';
      order.shippingMethod = shippingMethod;
      
      await order.save();
      
      // Send notification to customer
      await this.notifyCustomerShipment(order);
      
      return res.json({
        success: true,
        message: 'Shipment created successfully',
        data: {
          trackingNumber,
          trackingUrl,
          estimatedDelivery: order.trackingInfo?.estimatedDelivery
        }
      });
      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  // Admin: Update tracking information
  async updateTracking(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { trackingNumber, carrier, status, location, description, carrierName } = req.body;
      
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const updatedTrackingInfo:OrderTrackingInfo = {
        ...order.trackingInfo,
        carrierName: carrierName || order.trackingInfo?.carrierName || this.getCarrierDisplayName(carrier || order.trackingInfo?.carrier || ''),
        carrier: carrier || order.trackingInfo?.carrier,
        trackingNumber: trackingNumber || order.trackingInfo?.trackingNumber,
        trackingUrl: carrier ? this.generateTrackingUrl(carrier, trackingNumber || order.trackingInfo?.trackingNumber) : order.trackingInfo?.trackingUrl,
        trackingHistory: [...order.trackingInfo?.trackingHistory||[]]
      }
      
      // Update tracking info
      if (trackingNumber) updatedTrackingInfo.trackingNumber = trackingNumber;
      if (carrier) {
        updatedTrackingInfo.carrier = carrier;
        updatedTrackingInfo.trackingUrl = this.generateTrackingUrl(carrier, updatedTrackingInfo.trackingNumber);
      }
      
      // Add to tracking history
      updatedTrackingInfo.trackingHistory.push({
        event: status || order.fulfillmentStatus,
        location,
        timestamp: new Date(),
        description,
        isCarrierEvent: true
      });

      order.trackingInfo = updatedTrackingInfo
      
      // Update order status if needed
      if (status === 'delivered' && order.fulfillmentStatus !== 'delivered') {
        order.fulfillmentStatus = 'delivered';
      } else if (status === 'out_for_delivery') {
        order.fulfillmentStatus = 'out_for_delivery';
      }
      
      await order.save();
      
      return res.json({
        success: true,
        message: 'Tracking information updated'
      });
      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  // Helper: Generate tracking URL
  private generateTrackingUrl(carrier: string, trackingNumber: string): string {
    const trackingUrls: Record<string, string> = {
      'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      'fedex': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
    };
    return trackingUrls[carrier] || '';
  }
  
  // Helper: Calculate estimated delivery
  private calculateEstimatedDelivery(shippingMethod: string): Date {
    const now = new Date();
    const days = { standard: 7, expedited: 3, overnight: 1 };
    const deliveryDays = days[shippingMethod as keyof typeof days] || 7;
    
    const estimated = new Date(now);
    estimated.setDate(now.getDate() + deliveryDays);
    return estimated;
  }
  
  // Helper: Get carrier display name
  private getCarrierDisplayName(carrier: string): string {
    const names: Record<string, string> = {
      'usps': 'USPS',
      'fedex': 'FedEx',
      'ups': 'UPS',
      'dhl': 'DHL Express'
    };
    return names[carrier] || carrier.toUpperCase();
  }
  
  // Helper: Send notification
  private async notifyCustomerShipment(order: any) {
    // Implementation would send email/SMS
    console.log(`📧 Shipment notification sent for order ${order.orderNumber}`);
  }
}