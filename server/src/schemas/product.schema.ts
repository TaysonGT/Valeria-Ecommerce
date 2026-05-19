import { Document } from 'mongoose';
import { Schema, model } from 'mongoose';
import { ICategory } from './category.schema';
import { ICollection } from './collection.schema';

export interface IProduct extends Document {
  title: string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  currency: string;
  fitting: string;
  gender: string;
  variants: IVariant[];
  categories: ICategory[];
  collections: ICollection[];
  publicationStatus: 'active'|'inactive';
  imgs: imageType[];
}

export interface IVariant {
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

export interface imageType {
  url: string;
  altText: string;
  isPrimary?: boolean;
}

export const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  discountPrice: Number,
  publicationStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  currency: { type: String, default: 'USD' },
  fitting: { type: String, required: true },
  gender: { type: String, required: true },
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
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
  }],
  collections: [{
    _id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true }
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