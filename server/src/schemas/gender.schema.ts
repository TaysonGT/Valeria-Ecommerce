import { Schema, Document, model } from "mongoose";

export interface GenderType extends Document {
  name: string;
  code: string;
}

const GenderSchema = new Schema<GenderType>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, lowercase: true }
});


export const Gender = model<GenderType>('genders', GenderSchema);