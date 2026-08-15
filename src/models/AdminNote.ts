import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminNote extends Document {
  adminId: mongoose.Types.ObjectId;
  targetType: string;
  targetId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminNoteSchema = new Schema<IAdminNote>({
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String,
    required: true,
    index: true,
  },
  targetId: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

AdminNoteSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export const AdminNote = mongoose.models.AdminNote || mongoose.model<IAdminNote>('AdminNote', AdminNoteSchema);
