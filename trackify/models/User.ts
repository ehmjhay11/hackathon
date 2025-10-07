import mongoose, { Document, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IUser extends Document {
  user_id: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  user_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `user_${nanoid(8)}`
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'user'
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema, 'user');