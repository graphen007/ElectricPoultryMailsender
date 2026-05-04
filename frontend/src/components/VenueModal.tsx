import { useState } from 'react';
import { Venue, VenueStatus, STATUS_LABELS } from '../types';

interface Props {
  venue?: Venue;
  onSave: (data: Partial<Venue>) => void;
  onClose: () => void;
  loading?: boolean;
}

const EMPTY: Partial<Venue> = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  city: '',
  website: '',
  notes: '',
  status: 'not_contacted',
  preferredLanguage: 'da',
  responseNote: '',
};

export default function VenueModal({ venue, onSave, onClose, loading }: Props) {
  const [form, setForm] = useState<Partial<Venue>>(venue ? { ...venue } : { ...EMPTY });

  const set = (field: keyof Venue, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const statuses: VenueStatus[] = ['not_contacted', 'sent', 'positive', 'negative', 'booked', 'played'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{venue ? 'Edit Venue' : 'Add Venue'}</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row-2">
              <div className="form-group">
                <label>Venue Name *</label>
                <input className="form-control" value={form.name || ''} onChange={e => set('name', e.target.value)} required placeholder="e.g. Radar, Voxhall" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input className="form-control" value={form.city || ''} onChange={e => set('city', e.target.value)} placeholder="e.g. Aarhus" />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Contact Person</label>
                <input className="form-control" value={form.contactPerson || ''} onChange={e => set('contactPerson', e.target.value)} placeholder="Booking manager name" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input className="form-control" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} required placeholder="booking@venue.dk" />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Phone</label>
                <input className="form-control" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+45 xx xx xx xx" />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input className="form-control" type="url" value={form.website || ''} onChange={e => set('website', e.target.value)} placeholder="https://venue.dk" />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Email Language</label>
                <select className="form-control" value={form.preferredLanguage || 'da'} onChange={e => set('preferredLanguage', e.target.value)}>
                  <option value="da">Danish</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.status || 'not_contacted'} onChange={e => set('status', e.target.value)}>
                {statuses.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            {(form.status === 'positive' || form.status === 'negative') && (
              <div className="form-group">
                <label>Response Note</label>
                <textarea className="form-control" value={form.responseNote || ''} onChange={e => set('responseNote', e.target.value)} placeholder="What did they say?" rows={3} />
              </div>
            )}
            <div className="form-group">
              <label>Notes</label>
              <textarea className="form-control" value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Internal notes about this venue..." rows={3} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (venue ? 'Save Changes' : 'Add Venue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
