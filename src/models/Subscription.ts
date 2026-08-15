import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  organizationId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  status: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  startDate: Date;
  renewalDate: Date | null;
  amount: number;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'TRIAL', 'PAST_DUE', 'CANCELLED', 'EXPIRED'],
    default: 'TRIAL',
    index: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  renewalDate: {
    type: Date,
    default: null,
  },
  amount: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    default: 'pending',
  },
}, {
  timestamps: true,
});

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
