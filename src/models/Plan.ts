import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  price: number;
  postsPerMonth: number;
  aiGenerations: number;
  imageGenerations: number;
  connectedAccounts: number;
  topics: number;
  storage: number;
  users: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  postsPerMonth: {
    type: Number,
    required: true,
    min: 0,
  },
  aiGenerations: {
    type: Number,
    required: true,
    min: 0,
  },
  imageGenerations: {
    type: Number,
    required: true,
    min: 0,
  },
  connectedAccounts: {
    type: Number,
    required: true,
    min: 0,
  },
  topics: {
    type: Number,
    required: true,
    min: 0,
  },
  storage: {
    type: Number,
    required: true,
    min: 0,
  },
  users: {
    type: Number,
    required: true,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const Plan = mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);
