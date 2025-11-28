import { Document, model, Schema, Types } from "mongoose";

export interface Image {
  url: string;
  altText: string;
}

export interface ICategory extends Document {
  _id: string;
  name: string;
  parentId?: Types.ObjectId;
  path: string;
  bannerImage?: Image;
}

const CategorySchema = new Schema<ICategory>({
    name: {type: String, required: true},
    parentId: Types.ObjectId,
    path: {type: String, required: true},
    bannerImage: {
        url: {type: String, required: true},
        altText: {type: String, required: String},
    }
})

export const Category = model<ICategory>('categories', CategorySchema)