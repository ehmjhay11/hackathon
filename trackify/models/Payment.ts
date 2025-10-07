import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  payment_id: string;
  name: string;
  date: Date;
  tools: string;
  amount: number;
}

const PaymentSchema = new Schema<IPayment>({
  payment_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  tools: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'payment'
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema, 'payment');