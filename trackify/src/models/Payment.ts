import mongoose, { Document, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IPayment extends Document {
  payment_id: string;
  userId: string;
  serviceName: string;
  description?: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'paypal';
  status: 'pending' | 'completed' | 'failed';
  serviceDate: Date;
  serviceDetails?: Record<string, unknown>; // For storing specific service data like PrinterPaymentData, etc.
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
  description: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'paypal'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
    required: true
  },
  serviceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  serviceDetails: {
    type: Schema.Types.Mixed,
    required: false
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'payments'
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema, 'payments');