import { Schema, Document, model } from "mongoose";

export interface FittingType extends Document {
  name: string;
  code: string;
}

const FittingSchema = new Schema<FittingType>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, lowercase: true }
});


export const Fitting = model<FittingType>('fittings', FittingSchema);