import mongoose, { Schema, Document } from 'mongoose';

export interface IOAuthState extends Document {
  user_id: mongoose.Types.ObjectId;
  platform: 'instagram' | 'facebook' | 'linkedin';
  state_token: string;
  redirect_url: string | null;
  expires_at: Date;
  created_at: Date;
}

const OAuthStateSchema = new Schema<IOAuthState>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'linkedin'],
    required: true,
  },
  state_token: {
    type: String,
    required: true,
    unique: true,
  },
  redirect_url: {
    type: String,
    default: null,
  },
  expires_at: {
    type: Date,
    required: true,
  },
}, {
  timestamps: { createdAt: 'created_at' },
});

OAuthStateSchema.index({ state_token: 1 }, { unique: true });
OAuthStateSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const OAuthState = mongoose.models.OAuthState || mongoose.model<IOAuthState>('OAuthState', OAuthStateSchema);
