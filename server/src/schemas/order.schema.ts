import { Schema, model, Document, Types } from 'mongoose';

export type OrderFulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';
export type CarrierType = 'usps' | 'fedex' | 'ups' | 'dhl' | 'other';

export type OrderTrackingInfo = {
  carrier: CarrierType;
  carrierName: string;
  trackingNumber: string;
  trackingUrl?: string;
  trackingHistory: Array<{
    event: string;
    location?: string;
    timestamp: Date;
    description: string;
    isCarrierEvent: boolean;
  }>;
  estimatedDelivery?: Date;
}

export interface IOrderItem {
  productId: Types.ObjectId;
  productSnapshot: {
    title: string;
    basePrice: number;
    discountPrice?: number;
    imgs: Array<{ url: string; altText: string }>;
  };
  variantSnapshot: {
    sizeCode: string;
    priceAdjustment: number;
  };
  quantity: number;
  unitPrice: number;      // Price at time of purchase (basePrice + adjustment)
  totalPrice: number;     // unitPrice * quantity
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  items: IOrderItem[];
  
  // Pricing breakdown
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingCost: number;
  grandTotal: number;
  currency: string;
  
  // Customer info
  customerInfo: {
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
  };
  
  // Addresses
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Payment
  paymentMethod: 'credit_card' | 'paypal' | 'stripe' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentDetails?: {
    transactionId?: string;
    paymentGateway?: string;
    paidAt?: Date;
    refundId?: string;
    refundedAt?: Date;
  };
  
  // Fulfillment (simplified)
  fulfillmentStatus: OrderFulfillmentStatus;
  shippingMethod: 'standard' | 'expedited' | 'overnight' | 'pickup';
  trackingInfo?: OrderTrackingInfo;

  statusTimestamps: {
    orderd: Date;
    pending?: Date;
    processing?: Date;
    shipped?: Date;
    out_for_delivery?: Date;
    delivered?: Date;
    cancelled?: Date;
    refunded?: Date;
  };
  
  // Metadata
  notes?: string;
  cancelledAt?: Date;  // Only needed for cancelled/refunded orders
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
  productSnapshot: {
    title: { type: String, required: true },
    basePrice: { type: Number, required: true },
    discountPrice: Number,
    imgs: [{ url: String, altText: String }]
  },
  variantSnapshot: {
    sizeCode: { type: String, required: true },
    priceAdjustment: { type: Number, default: 0 }
  },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  items: [OrderItemSchema],
  
  subtotal: { type: Number, required: true },
  discountTotal: { type: Number, default: 0 },
  taxTotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  
  customerInfo: {
    email: { type: String, required: true },
    phone: String,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  billingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  paymentMethod: { 
    type: String, 
    enum: ['credit_card', 'paypal', 'stripe', 'cod'],
    required: true 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paidAt: Date,
    refundId: String,
    refundedAt: Date
  },
  
  fulfillmentStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },

  shippingMethod: {
    type: String,
    enum: ['standard', 'expedited', 'overnight', 'pickup'],
    default: 'standard'
  },

  trackingInfo: {
    carrier: {
      type: String,
      enum: ['usps', 'fedex', 'ups', 'dhl', 'other']
    },
    carrierName: String,
    trackingNumber: String,
    trackingUrl: String,
    trackingHistory: [{
      event: String,
      location: String,
      timestamp: Date,
      description: String,
      isCarrierEvent: Boolean
    }],
    estimatedDelivery: Date
  },
  
  statusTimestamps: {
    ordered: Date,
    pending: Date,
    processing: Date,
    shipped: Date,
    out_for_delivery: Date,
    delivered: Date,
    cancelled: Date,
    refunded: Date
  },

  notes: String,
  cancelledAt: Date
  
}, { timestamps: true });

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ fulfillmentStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });

export const Order = model<IOrder>('orders', OrderSchema);