import mongoose, { Schema, Document } from 'mongoose';

export interface IUsageRecord extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'AI_REQUEST' | 'IMAGE_GENERATION' | 'POST_PUBLISH' | 'STORAGE' | 'API_CALL';
  provider: string | null;
  modelName: string | null;
  tokens: number | null;
  estimatedCost: number;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

const UsageRecordSchema = new Schema<IUsageRecord>({
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
    enum: ['AI_REQUEST', 'IMAGE_GENERATION', 'POST_PUBLISH', 'STORAGE', 'API_CALL'],
    required: true,
    index: true,
  },
  provider: {
    type: String,
    default: null,
  },
  modelName: {
    type: String,
    default: null,
  },
  tokens: {
    type: Number,
    default: null,
  },
  estimatedCost: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: null,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false },
});

UsageRecordSchema.index({ organizationId: 1, type: 1, createdAt: -1 });
UsageRecordSchema.index({ createdAt: -1 });

export const UsageRecord = mongoose.models.UsageRecord || mongoose.model<IUsageRecord>('UsageRecord', UsageRecordSchema);
