import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  role: 'customer' | 'admin' | 'warehouse' | 'carrier';
  passwordHash: string;
  passwordSalt: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['customer', 'admin', 'warehouse', 'carrier'], 
      default: 'customer' 
    },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    paymentDetails: {
      cardBrand: String,
      last4: String,
      expiry: String,
      billingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
  },
  { timestamps: true }
)

export const User = model<IUser>('users', UserSchema)
