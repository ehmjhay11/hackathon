import mongoose, { Document, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IPayment extends Document {
  payment_id: string;
  userId: string;
  serviceName: string;
  amount: number;
  paymentMethod: string;
  timestamp: Date;
}

const PaymentSchema = new Schema<IPayment>({
  payment_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `pay_${nanoid(8)}`
  },
  userId: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'payment'
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema, 'payment');