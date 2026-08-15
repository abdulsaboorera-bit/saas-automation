import mongoose, { Schema, Document } from 'mongoose';

export interface IFeatureFlag extends Document {
  name: string;
  enabled: boolean;
  organizationId: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureFlagSchema = new Schema<IFeatureFlag>({
  name: {
    type: String,
    required: true,
    index: true,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    default: null,
  },
}, {
  timestamps: true,
});

FeatureFlagSchema.index({ name: 1, organizationId: 1 }, { unique: true, partialFilterExpression: { organizationId: { $ne: null } } });

export const FeatureFlag = mongoose.models.FeatureFlag || mongoose.model<IFeatureFlag>('FeatureFlag', FeatureFlagSchema);
