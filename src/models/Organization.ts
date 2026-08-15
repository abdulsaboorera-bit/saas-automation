import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DELETED';
  timezone: string;
  planId: mongoose.Types.ObjectId | null;
  automationStatus: 'ACTIVE' | 'PAUSED' | 'ADMIN_PAUSED' | 'SUSPENDED';
  globalAutomationPaused: boolean;
  globalPublishingStopped: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'BLOCKED', 'DELETED'],
    default: 'ACTIVE',
    index: true,
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    default: null,
  },
  automationStatus: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'ADMIN_PAUSED', 'SUSPENDED'],
    default: 'PAUSED',
  },
  globalAutomationPaused: {
    type: Boolean,
    default: false,
  },
  globalPublishingStopped: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export const Organization = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);
