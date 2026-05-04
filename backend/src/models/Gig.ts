import mongoose, { Document, Schema } from 'mongoose';

export interface IGig extends Document {
  title: string;
  venue: string;
  venueRef?: mongoose.Types.ObjectId;
  date: Date;
  startTime?: string;
  endTime?: string;
  city?: string;
  notes?: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GigSchema = new Schema<IGig>(
  {
    title: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    venueRef: { type: Schema.Types.ObjectId, ref: 'Venue' },
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    city: { type: String, trim: true },
    notes: { type: String },
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IGig>('Gig', GigSchema);
