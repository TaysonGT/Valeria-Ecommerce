import { Schema, model, Document } from 'mongoose';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface Image {
  url: string;
  altText: string;
}

export interface ICollection extends Document {
  _id: string;
  title: string;
  handle: string;
  activeDates: DateRange;
  featuredImage: Image;
}

const CollectionSchema = new Schema<ICollection>({
  title: { type: String, required: true },
  handle: { type: String, required: true, unique: true },
  activeDates: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  featuredImage: {
    url: { type: String, required: true },
    altText: { type: String, required: true }
  }
}, { timestamps: true });

// Indexes
CollectionSchema.index({ handle: 1 });
CollectionSchema.index({ 'activeDates.startDate': 1, 'activeDates.endDate': 1 });

export const CollectionModel = model<ICollection>('collections', CollectionSchema);