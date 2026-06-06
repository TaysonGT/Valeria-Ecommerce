// services/carrier-polling.service.ts
import cron from 'node-cron';
import { IOrder, Order, OrderFulfillmentStatus } from '../schemas/order.schema';
import { orderTrackingService } from './order-tracking.service';

export type CarrierStatus = {
    status: string,
    location: string,
    description: string
}

export class CarrierPollingService {
  
  async pollAllCarriers() {
    const orders = await Order.find({
      fulfillmentStatus: { $in: ['shipped', 'out_for_delivery'] },
      'trackingInfo.trackingNumber': { $exists: true, $ne: '' },
      'trackingInfo.carrier': { $ne: 'other' } // Only for real carriers
    });
    
    for (const order of orders) {
      await this.pollOrderStatus(order);
    }
  }
  
  private async pollOrderStatus(order: IOrder) {
    try {
      if(!order.trackingInfo) throw new Error('This order is not trackable')
      const { trackingNumber, carrier } = order.trackingInfo;
      // Call carrier-specific API
      const carrierStatus = await this.fetchCarrierStatus(carrier, trackingNumber);
      
      if (!carrierStatus) return;
      
      // Map carrier status to your statuses
      const newStatus = this.mapCarrierStatus(carrierStatus.status);
      
      // Update if status changed
      if (newStatus && newStatus !== order.fulfillmentStatus) {
        await orderTrackingService.updateOrderStatus(order._id.toString(), {
          newStatus,
          actorId: 'system',
          notes: `Auto-updated via ${carrier} API: ${carrierStatus.status}`,
          location: carrierStatus.location
        });
      } else {
        // Just add tracking event
        await orderTrackingService.addTrackingEvent(order._id.toString(), {
          event: carrierStatus.status,
          location: carrierStatus.location,
          description: carrierStatus.description,
          actor: 'carrier'
        });
      }
    } catch (error) {
      console.error(`Failed to poll carrier for order ${order.orderNumber}:`, error);
    }
  }
  
  private async fetchCarrierStatus(carrier: string, trackingNumber: string):Promise<CarrierStatus> {
    // Implement carrier-specific API calls
    switch (carrier) {
      case 'ups':
        return this.fetchUPSStatus(trackingNumber);
      case 'fedex':
        return this.fetchFedExStatus(trackingNumber);
      case 'usps':
        return this.fetchUSPSStatus(trackingNumber);
      default:
        return {
            status: '',
            location: '',
            description: ''
        };
    }
  }
  
  private mapCarrierStatus(carrierStatus: string): OrderFulfillmentStatus | null {
    const map: Record<string, OrderFulfillmentStatus> = {
      'IN_TRANSIT': 'shipped',
      'OUT_FOR_DELIVERY': 'out_for_delivery',
      'DELIVERED': 'delivered'
    };
    return map[carrierStatus] || null;
  }

  private async fetchUPSStatus(trackingNumber: string){
    return {
        status: '',
        location: '',
        description: ''
    }
  }

  private async fetchFedExStatus(trackingNumber: string){
    return {
        status: '',
        location: '',
        description: ''
    }
  }

  private async fetchUSPSStatus(trackingNumber: string){
    return {
        status: '',
        location: '',
        description: ''
    }
  }
}

// Start polling job (runs every 4 hours)
cron.schedule('0 */4 * * *', () => {
  new CarrierPollingService().pollAllCarriers();
});