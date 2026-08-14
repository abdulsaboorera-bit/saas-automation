import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialAccount extends Document {
  user_id: mongoose.Types.ObjectId;
  platform: 'instagram' | 'facebook' | 'linkedin';
  platform_account_id: string;
  account_name: string;
  username: string | null;
  profile_image_url: string | null;
  access_token_encrypted: string;
  refresh_token_encrypted: string | null;
  token_expires_at: Date | null;
  metadata: Record<string, unknown> | null;
  status: 'active' | 'expired' | 'disconnected';
  created_at: Date;
  updated_at: Date;
}

const SocialAccountSchema = new Schema<ISocialAccount>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'linkedin'],
    required: true,
  },
  platform_account_id: {
    type: String,
    required: true,
  },
  account_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: null,
  },
  profile_image_url: {
    type: String,
    default: null,
  },
  access_token_encrypted: {
    type: String,
    required: true,
  },
  refresh_token_encrypted: {
    type: String,
    default: null,
  },
  token_expires_at: {
    type: Date,
    default: null,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'disconnected'],
    default: 'active',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

SocialAccountSchema.index({ user_id: 1, platform: 1, platform_account_id: 1 }, { unique: true });

export const SocialAccount = mongoose.models.SocialAccount || mongoose.model<ISocialAccount>('SocialAccount', SocialAccountSchema);
