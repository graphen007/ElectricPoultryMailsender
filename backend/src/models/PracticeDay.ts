import mongoose, { Document, Schema } from 'mongoose';

export interface IPracticeDay extends Document {
  date: Date;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeDaySchema = new Schema<IPracticeDay>(
  {
    date: { type: Date, required: true, unique: true },
    notes: { type: String },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPracticeDay>('PracticeDay', PracticeDaySchema);
