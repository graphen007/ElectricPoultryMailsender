export type VenueStatus = 'not_contacted' | 'sent' | 'positive' | 'negative' | 'booked' | 'played';

export interface Venue {
  _id: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  city?: string;
  website?: string;
  notes?: string;
  status: VenueStatus;
  emailSentAt?: string;
  responseReceivedAt?: string;
  responseNote?: string;
  preferredLanguage: 'da' | 'en';
  createdAt: string;
  updatedAt: string;
}

export interface Gig {
  _id: string;
  title: string;
  venue: string;
  venueRef?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  city?: string;
  notes?: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Trivia {
  _id: string;
  text: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  _id: string;
  name: string;
  language: 'da' | 'en';
  subject: string;
  htmlBody: string;
  textBody: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<VenueStatus, string> = {
  not_contacted: 'Not Contacted',
  sent: 'Email Sent',
  positive: 'Positive Response',
  negative: 'Negative Response',
  booked: 'Booked',
  played: 'Played',
};

export const STATUS_COLORS: Record<VenueStatus, string> = {
  not_contacted: '#555',
  sent: '#c8a84b',
  positive: '#4caf50',
  negative: '#e53935',
  booked: '#2196f3',
  played: '#9c27b0',
};
