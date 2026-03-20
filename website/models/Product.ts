import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  description: {
    en: string;
    hi: string;
    mr: string;
  };
  category: string;
  images: string[];
  customizationOptions: {
    sizes: string[];
    materials: string[];
  };
  basePrice?: number;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      mr: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      mr: { type: String, required: true },
    },
    category: { type: String, required: true },
    images: [{ type: String }],
    customizationOptions: {
      sizes: [{ type: String }],
      materials: [{ type: String }],
    },
    basePrice: { type: Number },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
