import { useState, useEffect } from 'react';
import { venuesApi, emailApi, templatesApi } from '../api';
import { Venue, VenueStatus, STATUS_LABELS, STATUS_COLORS, Template } from '../types';
import VenueModal from '../components/VenueModal';
import { useToast } from '../components/Toast';
import { format } from 'date-fns';

const STATUS_ORDER: VenueStatus[] = ['not_contacted', 'sent', 'positive', 'negative', 'booked', 'played'];

interface SendModalState {
  venue: Venue;
  templates: Template[];
  templateId: string;
  subject: string;
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<VenueStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editVenue, setEditVenue] = useState<Venue | undefined>();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [sendModal, setSendModal] = useState<SendModalState | null>(null);
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await venuesApi.getAll();
      setVenues(data);
    } catch {
      showToast('Failed to load venues', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = venues.filter(v => {
    const matchStatus = filterStatus === 'all' || v.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) || (v.city || '').toLowerCase().includes(q) || (v.contactPerson || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleSave = async (data: Partial<Venue>) => {
    try {
      setSaving(true);
      if (editVenue) {
        await venuesApi.update(editVenue._id, data);
        showToast('Venue updated', 'success');
      } else {
        await venuesApi.create(data);
        showToast('Venue added', 'success');
      }
      setModalOpen(false);
      setEditVenue(undefined);
      await load();
    } catch {
      showToast('Failed to save venue', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await venuesApi.delete(id);
      showToast('Venue deleted', 'success');
      setConfirmDelete(null);
      await load();
    } catch {
      showToast('Failed to delete venue', 'error');
    }
  };

  const openSendModal = async (venue: Venue) => {
    try {
      const templates = await templatesApi.getAll();
      const lang = venue.preferredLanguage || 'da';
      const langTemplates = templates.filter(t => t.language === lang);
      const defaultTpl = langTemplates.find(t => t.isDefault) || langTemplates[0];
      setSendModal({
        venue,
        templates,
        templateId: defaultTpl?._id || '',
        subject: defaultTpl?.subject || '',
      });
    } catch {
      showToast('Failed to load templates', 'error');
    }
  };

  const handleSendEmail = async () => {
    if (!sendModal) return;
    try {
      setSending(true);
      await emailApi.send(sendModal.venue._id, sendModal.templateId || undefined, sendModal.subject || undefined);
      showToast(`Email sent to ${sendModal.venue.name}!`, 'success');
      setSendModal(null);
      await load();
    } catch (err: any) {
      const msg = err?.response?.data?.details || err?.response?.data?.error || 'Failed to send email';
      showToast(msg, 'error');
    } finally {
      setSending(false);
    }
  };

  const openAdd = () => { setEditVenue(undefined); setModalOpen(true); };
  const openEdit = (v: Venue) => { setEditVenue(v); setModalOpen(true); };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Venues <span>&amp; Outreach</span></h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Venue</button>
      </div>

      <div className="filters">
        <input
          className="form-control"
          placeholder="Search venues..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value as VenueStatus | 'all')}>
          <option value="all">All Statuses</option>
          {STATUS_ORDER.map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <span className="venue-count">{filtered.length} venue{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="empty-state"><p>Loading...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No venues found.</p>
          <button className="btn btn-primary" onClick={openAdd}>Add your first venue</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Venue</th>
                <th>City</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Lang</th>
                <th>Status</th>
                <th>Sent At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong>{v.name}</strong>
                      {v.website && (
                        <a href={v.website} target="_blank" rel="noreferrer" title={`Visit ${v.name} website`} style={{ color: 'var(--gold)', fontSize: 13, lineHeight: 1 }}>
                          ↗
                        </a>
                      )}
                    </div>
                    {v.responseNote && (
                      <div className="response-note">&ldquo;{v.responseNote}&rdquo;</div>
                    )}
                  </td>
                  <td>{v.city || '—'}</td>
                  <td>{v.contactPerson || '—'}</td>
                  <td><a href={`mailto:${v.email}`}>{v.email}</a></td>
                  <td><span className="lang-badge">{v.preferredLanguage.toUpperCase()}</span></td>
                  <td>
                    <span className="status-badge" style={{ background: STATUS_COLORS[v.status] + '22', color: STATUS_COLORS[v.status], border: `1px solid ${STATUS_COLORS[v.status]}44` }}>
                      {STATUS_LABELS[v.status]}
                    </span>
                  </td>
                  <td>{v.emailSentAt ? format(new Date(v.emailSentAt), 'dd MMM yyyy') : '—'}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openSendModal(v)}
                        title="Send booking email"
                      >
                        Send Email
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(v)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(v._id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <VenueModal
          venue={editVenue}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditVenue(undefined); }}
          loading={saving}
        />
      )}

      {sendModal && (
        <div className="modal-overlay" onClick={() => setSendModal(null)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send Email — <span style={{ color: 'var(--gold)' }}>{sendModal.venue.name}</span></h2>
              <button className="btn-close" onClick={() => setSendModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Template</label>
                <select
                  className="form-control"
                  value={sendModal.templateId}
                  onChange={e => {
                    const tpl = sendModal.templates.find(t => t._id === e.target.value);
                    setSendModal(prev => prev ? { ...prev, templateId: e.target.value, subject: tpl?.subject || prev.subject } : null);
                  }}
                >
                  <option value="">— Default (built-in) —</option>
                  {sendModal.templates.map(t => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.language.toUpperCase()}){t.isDefault ? ' ★' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  className="form-control"
                  value={sendModal.subject}
                  onChange={e => setSendModal(prev => prev ? { ...prev, subject: e.target.value } : null)}
                  placeholder="Leave blank to use template subject"
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {sendModal.templateId ? (
                  <a
                    href={emailApi.previewTemplateUrl(sendModal.templateId, sendModal.venue.contactPerson || sendModal.venue.name)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    Preview Template ↗
                  </a>
                ) : (
                  <a
                    href={emailApi.previewUrl(sendModal.venue._id)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    Preview Email ↗
                  </a>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSendModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSendEmail} disabled={sending}>
                {sending ? 'Sending...' : `Send to ${sendModal.venue.email}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Venue</h2>
              <button className="btn-close" onClick={() => setConfirmDelete(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this venue? This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
