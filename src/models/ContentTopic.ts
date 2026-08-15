import mongoose, { Schema, Document } from 'mongoose';

export interface IContentTopic extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  topic: string;
  status: 'PENDING' | 'PROCESSING' | 'PUBLISHED' | 'FAILED' | 'SKIPPED' | 'CANCELLED';
  postId: mongoose.Types.ObjectId | null;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  csvRowNumber: number | null;
  csvFileName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const ContentTopicSchema = new Schema<IContentTopic>({
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
    index: true,
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'SKIPPED', 'CANCELLED'],
    default: 'PENDING',
    index: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    default: null,
  },
  scheduledAt: {
    type: Date,
    default: null,
    index: true,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  csvRowNumber: {
    type: Number,
    default: null,
  },
  csvFileName: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

ContentTopicSchema.index({ organizationId: 1, status: 1 });

export const ContentTopic = mongoose.models.ContentTopic || mongoose.model<IContentTopic>('ContentTopic', ContentTopicSchema);
