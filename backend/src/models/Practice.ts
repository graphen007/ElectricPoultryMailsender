import mongoose, { Document, Schema } from 'mongoose';

export interface IPractice extends Document {
  date: Date;
  username: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeSchema = new Schema<IPractice>(
  {
    date: { type: Date, required: true },
    username: { type: String, required: true, trim: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// One availability entry per user per date
PracticeSchema.index({ date: 1, userId: 1 }, { unique: true });

export default mongoose.model<IPractice>('Practice', PracticeSchema);
