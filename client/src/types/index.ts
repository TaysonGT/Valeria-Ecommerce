export type CartItem = {
  product: productType, 
  quantity: number, 
  variant: variantType
}

export enum PaymentMethodType { credit_card = 'Credit Card', paypal = 'Paypal', stripe = 'Stripe', cod = 'COD'}
export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface productType {
  _id: string;
  title: string;
  description: string;
  basePrice: number;
  publicationStatus: 'active'|'inactive'
  createdAt: Date;
  discountPrice?: number;
  currency: string;
  variants: variantType[];
  categories: categoryRefType[];
  collections: collectionRefType[];
  imgs: imageType[];
}

export interface variantType {
  _id: string;
  sizeCode: string;
  inventory: {
    stock: number;
    barcode: string;
    reserved: number;
    warehouseLocation?: string;
  }
  priceAdjustment?: number;
}

export interface categoryRefType {
  categoryId: string;
  name: string;
}

export interface collectionRefType {
  collectionId: string;
  title: string;
}

export interface imageType {
  url: string;
  altText: string;
  isPrimary?: boolean;
}

export type UserType = {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  role: string;
  avatarUrl?: string;
  paymentDetails?: {
    cardBrand: string;
    last4: string;
    expiry: string;
    billingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
}

export type AuthContextType = {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<UserType>;
  register: (payload: SignupDataType) => Promise<UserType>;
  logout: () => void;
  refreshCurrentUser: () => void;
  refreshToken: () => void;
  resetAuth: () => void;
  checkAuth: () => void;
};

export type SignupDataType = {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  validPassword: string;
  email: string;
  gender: string;
}


export interface IOrderItem {
  _id: string;
  productId: string;
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
  unitPrice: number;
  totalPrice: number;
}

export type FulfillmentStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  productId: string;
  productSnapshot: { title: string; basePrice: number; discountPrice?: number; imgs: { url: string; altText: string }[] };
  variantSnapshot: { sizeCode: string; priceAdjustment: number };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingCost: number;
  grandTotal: number;
  currency: string;
  customerInfo: { email: string; phone?: string; firstName: string; lastName: string };
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  paymentDetails?: any;
  fulfillmentStatus: FulfillmentStatus;
  shippingMethod: string;
  trackingInfo?: TrackingInfo;
  notes?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Address {
  street: string; city: string; state: string; zipCode: string; country: string;
}

interface TrackingInfo {
  carrier: string;
  carrierName: string;
  trackingNumber: string;
  trackingUrl?: string;
  trackingHistory: Array<{ status: string; location?: string; timestamp: string; description: string }>;
  estimatedDelivery?: string;
}