import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandProfile extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  brandName: string;
  industry: string | null;
  tone: string | null;
  targetAudience: string | null;
  keywords: string[];
  guidelines: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const BrandProfileSchema = new Schema<IBrandProfile>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  brandName: {
    type: String,
    required: true,
    trim: true,
  },
  industry: {
    type: String,
    default: null,
  },
  tone: {
    type: String,
    default: null,
  },
  targetAudience: {
    type: String,
    default: null,
  },
  keywords: [{
    type: String,
  }],
  guidelines: {
    type: String,
    default: null,
  },
  logoUrl: {
    type: String,
    default: null,
  },
  websiteUrl: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

export const BrandProfile = mongoose.models.BrandProfile || mongoose.model<IBrandProfile>('BrandProfile', BrandProfileSchema);
