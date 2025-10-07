import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase extends Document {
  purchase_id: string;
  tool_id: string;
  date: Date;
  amount: number;
}

const PurchaseSchema = new Schema<IPurchase>({
  purchase_id: {
    type: String,
    required: true,
    unique: true
  },
  tool_id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'purchase'
});

export default mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema, 'purchase');