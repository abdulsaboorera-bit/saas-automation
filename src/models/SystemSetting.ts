import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemSetting extends Document {
  key: string;
  value: string;
  description: string | null;
  updatedAt: Date;
}

const SystemSettingSchema = new Schema<ISystemSetting>({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  value: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
}, {
  timestamps: { createdAt: false, updatedAt: 'updatedAt' },
});

export const SystemSetting = mongoose.models.SystemSetting || mongoose.model<ISystemSetting>('SystemSetting', SystemSettingSchema);
