import mongoose, { Document, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IUserDocument extends Document {
  user_id: string;
  username: string;
  email: string;
  password: string;
  membershipLevel: 'basic' | 'premium' | 'lifetime';
  joinDate: Date;
  isActive: boolean;
}

const UserSchema = new Schema<IUserDocument>({
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
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  membershipLevel: {
    type: String,
    enum: ['basic', 'premium', 'lifetime'],
    default: 'basic',
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: true,
  collection: 'users'
});

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema, 'users');