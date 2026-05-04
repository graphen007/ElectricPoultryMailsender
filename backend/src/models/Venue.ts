import mongoose, { Document, Schema } from 'mongoose';

export type VenueStatus = 'not_contacted' | 'sent' | 'positive' | 'negative' | 'booked' | 'played';

export interface IVenue extends Document {
  name: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  city?: string;
  website?: string;
  notes?: string;
  status: VenueStatus;
  emailSentAt?: Date;
  responseReceivedAt?: Date;
  responseNote?: string;
  preferredLanguage: 'da' | 'en';
  createdAt: Date;
  updatedAt: Date;
}

const VenueSchema = new Schema<IVenue>(
  {
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    city: { type: String, trim: true },
    website: { type: String, trim: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['not_contacted', 'sent', 'positive', 'negative', 'booked', 'played'],
      default: 'not_contacted',
    },
    emailSentAt: { type: Date },
    responseReceivedAt: { type: Date },
    responseNote: { type: String },
    preferredLanguage: { type: String, enum: ['da', 'en'], default: 'da' },
  },
  { timestamps: true }
);

export default mongoose.model<IVenue>('Venue', VenueSchema);
