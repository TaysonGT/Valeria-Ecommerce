import { Document, model, Schema, Types } from "mongoose";

interface Image {
  url: string;
  altText: string;
}

interface Category extends Document {
  name: string;
  parentId?: Types.ObjectId;
  path: string;
  bannerImage?: Image;
}

const CategorySchema = new Schema<Category>({
    name: {type: String, required: true},
    parentId: Types.ObjectId,
    path: {type: String, required: true},
    bannerImage: {
        url: {type: String, required: true},
        altText: {type: String, required: String},
    }
})

export const Category = model<Category>('categories', CategorySchema)