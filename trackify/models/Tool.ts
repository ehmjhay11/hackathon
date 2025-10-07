import mongoose, { Document, Schema } from 'mongoose';

export interface ITool extends Document {
  tool_id: string;
  name: string;
  quantity: number;
  amount: number;
}

const ToolSchema = new Schema<ITool>({
  tool_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'tools'
});

export default mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema, 'tools');