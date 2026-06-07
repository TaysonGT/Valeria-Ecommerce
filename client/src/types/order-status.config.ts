// types/order-status.config.ts
import { FulfillmentStatus } from './';

interface StatusField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'tel';
  label: string;
  required?: boolean;
  dependsOn?: { field: string; value: string }; // Conditional fields
  options?: { value: string; label: string }[]; // For select fields
}

interface StatusTransition {
  from: FulfillmentStatus;
  to: FulfillmentStatus;
  fields: StatusField[];
  label: string;
  buttonText: string;
}

export const statusTransitions: Record<string, StatusTransition> = {
  'pending->processing': {
    from: 'pending',
    to: 'processing',
    label: 'Start Processing',
    buttonText: 'Confirm & Process',
    fields: [
      { name: 'notes', type: 'textarea', label: 'Internal Notes', required: false }
    ]
  },
  
  'processing->shipped': {
    from: 'processing',
    to: 'shipped',
    label: 'Mark as Shipped',
    buttonText: 'Mark Shipped',
    fields: [
      { name: 'deliveryType', type: 'select', label: 'Delivery Type', required: true,
        options: [
          { value: 'carrier', label: 'Carrier (UPS, FedEx, etc.)' },
          { value: 'in_house', label: 'In-house Delivery' }
        ]
      },
      // Carrier fields (shown when deliveryType === 'carrier')
      { name: 'trackingNumber', type: 'text', label: 'Tracking Number', 
        required: true, dependsOn: { field: 'deliveryType', value: 'carrier' } },
      { name: 'carrier', type: 'select', label: 'Carrier',
        options: [
          { value: 'ups', label: 'UPS' },
          { value: 'fedex', label: 'FedEx' },
          { value: 'usps', label: 'USPS' },
          { value: 'dhl', label: 'DHL' },
          { value: 'other', label: 'Other' }
        ],
        dependsOn: { field: 'deliveryType', value: 'carrier' }
      },
      { name: 'estimatedDelivery', type: 'date', label: 'Estimated Delivery',
        dependsOn: { field: 'deliveryType', value: 'carrier' }
      },
      // In-house fields (shown when deliveryType === 'in_house')
      { name: 'deliveryAgentName', type: 'text', label: 'Agent Name',
        required: true, dependsOn: { field: 'deliveryType', value: 'in_house' } },
      { name: 'deliveryAgentPhone', type: 'tel', label: 'Agent Phone',
        required: true, dependsOn: { field: 'deliveryType', value: 'in_house' } },
      { name: 'deliveryNotes', type: 'textarea', label: 'Delivery Instructions',
        dependsOn: { field: 'deliveryType', value: 'in_house' }
      },
      { name: 'location', type: 'text', label: 'Shipping Location', required: false }
    ]
  },
  
  'shipped->out_for_delivery': {
    from: 'shipped',
    to: 'out_for_delivery',
    label: 'Out for Delivery',
    buttonText: 'Mark Out for Delivery',
    fields: [
      { name: 'notes', type: 'textarea', label: 'Notes', required: false }
    ]
  },
  
  'out_for_delivery->delivered': {
    from: 'out_for_delivery',
    to: 'delivered',
    label: 'Mark Delivered',
    buttonText: 'Confirm Delivery',
    fields: [
      { name: 'notes', type: 'textarea', label: 'Delivery Notes', required: false },
      { name: 'location', type: 'text', label: 'Delivery Location', required: false }
    ]
  },
  
  'pending->cancelled': {
    from: 'pending',
    to: 'cancelled',
    label: 'Cancel Order',
    buttonText: 'Confirm Cancellation',
    fields: [
      { name: 'notes', type: 'textarea', label: 'Cancellation Reason', required: true }
    ]
  }
};