import mongoose, { Schema, Document } from 'mongoose';

export interface IAutomationJob extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'CONTENT_GENERATION' | 'IMAGE_GENERATION' | 'PUBLISH_POST' | 'CSV_IMPORT' | 'TOPIC_PROCESSING';
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'RETRYING';
  topicId: mongoose.Types.ObjectId | null;
  postId: mongoose.Types.ObjectId | null;
  scheduledAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  attempts: number;
  maxAttempts: number;
  error: string | null;
  errorClassification: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationJobSchema = new Schema<IAutomationJob>({
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
  type: {
    type: String,
    enum: ['CONTENT_GENERATION', 'IMAGE_GENERATION', 'PUBLISH_POST', 'CSV_IMPORT', 'TOPIC_PROCESSING'],
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'RETRYING'],
    default: 'QUEUED',
    index: true,
  },
  topicId: {
    type: Schema.Types.ObjectId,
    ref: 'ContentTopic',
    default: null,
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
  startedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  maxAttempts: {
    type: Number,
    default: 3,
  },
  error: {
    type: String,
    default: null,
  },
  errorClassification: {
    type: String,
    enum: ['AUTH_ERROR', 'RATE_LIMIT', 'AI_ERROR', 'IMAGE_ERROR', 'PLATFORM_ERROR', 'NETWORK_ERROR', 'INVALID_REQUEST', 'INVALID_MEDIA', 'UNKNOWN'],
    default: null,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: null,
  },
}, {
  timestamps: true,
});

AutomationJobSchema.index({ status: 1, scheduledAt: 1 });

export const AutomationJob = mongoose.models.AutomationJob || mongoose.model<IAutomationJob>('AutomationJob', AutomationJobSchema);
