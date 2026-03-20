import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  phone: string;
  email: string;
  productId?: string;
  productName: {
    en: string;
    hi: string;
    mr: string;
  };
  customization: {
    size?: string;
    material?: string;
    quantity?: number;
    notes?: string;
  };
  fileUrl?: string;
  fileName?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: {
      en: { type: String, required: true },
      hi: { type: String, required: true },
      mr: { type: String, required: true },
    },
    customization: {
      size: { type: String },
      material: { type: String },
      quantity: { type: Number },
      notes: { type: String },
    },
    fileUrl: { type: String },
    fileName: { type: String },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
