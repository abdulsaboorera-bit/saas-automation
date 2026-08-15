import mongoose, { Schema, Document } from 'mongoose';

export interface IAutomationSettings extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'PAUSED' | 'ADMIN_PAUSED' | 'SUSPENDED';
  postsPerWeek: number;
  nextRunAt: Date | null;
  lastRunAt: Date | null;
  lastError: string | null;
  topicsRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationSettingsSchema = new Schema<IAutomationSettings>({
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
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'ADMIN_PAUSED', 'SUSPENDED'],
    default: 'PAUSED',
    index: true,
  },
  postsPerWeek: {
    type: Number,
    default: 7,
    min: 1,
  },
  nextRunAt: {
    type: Date,
    default: null,
  },
  lastRunAt: {
    type: Date,
    default: null,
  },
  lastError: {
    type: String,
    default: null,
  },
  topicsRemaining: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export const AutomationSettings = mongoose.models.AutomationSettings || mongoose.model<IAutomationSettings>('AutomationSettings', AutomationSettingsSchema);
