import mongoose, { Document, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IDonatedItem {
  name: string;
  quantity: number;
  description?: string;
}

export interface IDonation extends Document {
  donation_id: string;
  donorName: string;
  type: 'monetary' | 'item';
  amount?: number; // Only for monetary donations
  items?: IDonatedItem[]; // Only for item donations
  itemDescription?: string; // Legacy field for backward compatibility
  dateReceived: Date;
}

const DonationSchema = new Schema<IDonation>({
  donation_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `don_${nanoid(8)}`
  },
  donorName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['monetary', 'item']
  },
  amount: {
    type: Number,
    required: function(this: IDonation) { return this.type === 'monetary'; },
    min: 0
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    description: {
      type: String,
      required: false
    }
  }],
  itemDescription: {
    type: String,
    required: false // Made optional for backward compatibility
  },
  dateReceived: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'donation'
});

export default mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema, 'donation');