import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content?: string;
  venue?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    venue: { type: Schema.Types.ObjectId, ref: 'Venue' },
  },
  { timestamps: true }
);

export default mongoose.model<INote>('Note', NoteSchema);
