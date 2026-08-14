import mongoose, { Schema, Document } from 'mongoose';

export interface IPostPlatform extends Document {
  post_id: mongoose.Types.ObjectId;
  social_account_id: mongoose.Types.ObjectId;
  platform: 'instagram' | 'facebook' | 'linkedin';
  status: 'pending' | 'processing' | 'published' | 'failed' | 'cancelled';
  platform_post_id: string | null;
  published_at: Date | null;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
}

const PostPlatformSchema = new Schema<IPostPlatform>({
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true,
  },
  social_account_id: {
    type: Schema.Types.ObjectId,
    ref: 'SocialAccount',
    required: true,
    index: true,
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'linkedin'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'published', 'failed', 'cancelled'],
    default: 'pending',
  },
  platform_post_id: {
    type: String,
    default: null,
  },
  published_at: {
    type: Date,
    default: null,
  },
  error_message: {
    type: String,
    default: null,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export const PostPlatform = mongoose.models.PostPlatform || mongoose.model<IPostPlatform>('PostPlatform', PostPlatformSchema);
