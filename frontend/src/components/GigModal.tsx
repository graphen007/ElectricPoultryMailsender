import { useState } from 'react';
import { Gig } from '../types';

interface Props {
  gig?: Gig;
  onSave: (data: Partial<Gig>) => void;
  onClose: () => void;
  loading?: boolean;
}

const EMPTY: Partial<Gig> = {
  title: '',
  venue: '',
  date: '',
  startTime: '',
  endTime: '',
  city: '',
  notes: '',
  confirmed: false,
};

export default function GigModal({ gig, onSave, onClose, loading }: Props) {
  const [form, setForm] = useState<Partial<Gig>>(
    gig
      ? { ...gig, date: gig.date ? gig.date.slice(0, 10) : '' }
      : { ...EMPTY }
  );

  const set = (field: keyof Gig, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{gig ? 'Edit Gig' : 'Add Gig'}</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Gig Title *</label>
              <input className="form-control" value={form.title || ''} onChange={e => set('title', e.target.value)} required placeholder="e.g. Saturday Night at Radar" />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Venue *</label>
                <input className="form-control" value={form.venue || ''} onChange={e => set('venue', e.target.value)} required placeholder="Venue name" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input className="form-control" value={form.city || ''} onChange={e => set('city', e.target.value)} placeholder="e.g. Aarhus" />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Date *</label>
                <input className="form-control" type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input className="form-control" type="time" value={form.startTime || ''} onChange={e => set('startTime', e.target.value)} />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input className="form-control" type="time" value={form.endTime || ''} onChange={e => set('endTime', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea className="form-control" value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Stage time, equipment, contacts..." rows={3} />
            </div>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                id="confirmed"
                checked={!!form.confirmed}
                onChange={e => set('confirmed', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
              <label htmlFor="confirmed" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer' }}>
                Gig is confirmed
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (gig ? 'Save Changes' : 'Add Gig')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
