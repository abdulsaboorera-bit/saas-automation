import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  organizationId: mongoose.Types.ObjectId | null;
  userId: mongoose.Types.ObjectId | null;
  type: 'GLOBAL_ANNOUNCEMENT' | 'ORG_ANNOUNCEMENT' | 'INDIVIDUAL_MESSAGE';
  channel: 'IN_APP' | 'EMAIL' | 'BOTH';
  title: string;
  message: string;
  sentBy: mongoose.Types.ObjectId | null;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    default: null,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  type: {
    type: String,
    enum: ['GLOBAL_ANNOUNCEMENT', 'ORG_ANNOUNCEMENT', 'INDIVIDUAL_MESSAGE'],
    required: true,
  },
  channel: {
    type: String,
    enum: ['IN_APP', 'EMAIL', 'BOTH'],
    default: 'IN_APP',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false },
});

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ organizationId: 1, createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
