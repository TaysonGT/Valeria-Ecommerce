import { Schema, model } from 'mongoose';

export interface productType {
  title: string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  currency: string;
  variants: variantType[];
  categories: categoryRefType[];
  collections: collectionRefType[];
  imgs: imageType[];
}

export interface variantType {
  _id: Schema.Types.ObjectId;
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

export const ProductSchema = new Schema<productType>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  discountPrice: Number,
  currency: { type: String, default: 'USD' },
  variants: [{
    _id: { type: Schema.Types.ObjectId, auto: true },
    sizeCode: {type: String, required: true},
    inventory: {
      stock: { type: Number, required: true },
      barcode: { type: String, required: true },
      reserved: { type: Number, default: 0 },
      warehouseLocation: String
    },
    priceAdjustment: { type: Number, default: 0 }
  }],
  categories: [{
    categoryId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
  }],
  collections: [{
    collectionId: String,
    title: String
  }],
  imgs: [{
    url: {type: String, required: true},
    altText: {type: String, require: true},
    isPrimary: { type: Boolean, default: false }
  }]
}, { 
  timestamps: true // Auto-manage createdAt/updatedAt
});

// Indexes
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ 'variants.sizeCode': 1 });
ProductSchema.index({ 'categories.categoryId': 1 });

export const Product = model('products', ProductSchema);