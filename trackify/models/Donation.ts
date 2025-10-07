import mongoose, { Document, Schema } from 'mongoose';

export interface IDonation extends Document {
  donation_id: string;
  name?: string;
  date: Date;
  amount: number;
  tool: string;
}

const DonationSchema = new Schema<IDonation>({
  donation_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: false
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
  },
  tool: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'donation'
});

export default mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema, 'donation');