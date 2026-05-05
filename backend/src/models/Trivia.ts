import mongoose, { Document, Schema } from 'mongoose';

export interface ITrivia extends Document {
  text: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TriviaSchema = new Schema<ITrivia>(
  {
    text: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITrivia>('Trivia', TriviaSchema);
