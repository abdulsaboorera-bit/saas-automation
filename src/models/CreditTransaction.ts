import mongoose, { Schema, Document } from 'mongoose';

export interface ICreditTransaction extends Document {
  organizationId: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId | null;
  type: 'GRANT' | 'REVOKE' | 'USAGE';
  creditType: 'AI' | 'IMAGE' | 'POST';
  amount: number;
  reason: string;
  createdAt: Date;
}

const CreditTransactionSchema = new Schema<ICreditTransaction>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  type: {
    type: String,
    enum: ['GRANT', 'REVOKE', 'USAGE'],
    required: true,
  },
  creditType: {
    type: String,
    enum: ['AI', 'IMAGE', 'POST'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false },
});

CreditTransactionSchema.index({ organizationId: 1, createdAt: -1 });

export const CreditTransaction = mongoose.models.CreditTransaction || mongoose.model<ICreditTransaction>('CreditTransaction', CreditTransactionSchema);
