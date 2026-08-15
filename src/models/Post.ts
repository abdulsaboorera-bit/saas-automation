import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  user_id: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  caption: string;
  media_url: string | null;
  status: 'draft' | 'scheduled' | 'processing' | 'published' | 'partial' | 'failed' | 'cancelled';
  scheduled_at: Date | null;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

const PostSchema = new Schema<IPost>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  caption: {
    type: String,
    required: true,
  },
  media_url: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'processing', 'published', 'partial', 'failed', 'cancelled'],
    default: 'draft',
    index: true,
  },
  scheduled_at: {
    type: Date,
    default: null,
    index: true,
  },
  published_at: {
    type: Date,
    default: null,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
