import mongoose, { Document, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IComponent extends Document {
  component_id: string;
  componentName: string;
  category: string;
  quantity: number;
  unit: string;
  storageLocation: string;
}

const ComponentSchema = new Schema<IComponent>({
  component_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `comp_${nanoid(8)}`
  },
  componentName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  storageLocation: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'component'
});

export default mongoose.models.Component || mongoose.model<IComponent>('Component', ComponentSchema, 'component');