import mongoose, { Document, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface ITool extends Document {
  tool_id: string;
  toolName: string;
  description: string;
  status: 'available' | 'in-use' | 'maintenance' | 'broken';
  lastMaintenance: Date;
  location: string;
}

const ToolSchema = new Schema<ITool>({
  tool_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `tool_${nanoid(8)}`
  },
  toolName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'in-use', 'maintenance', 'broken'],
    default: 'available'
  },
  lastMaintenance: {
    type: Date,
    required: true,
    default: Date.now
  },
  location: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'tools'
});

export default mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema, 'tools');