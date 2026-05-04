import { useState, useEffect } from 'react';
import { templatesApi, emailApi } from '../api';
import { Template } from '../types';
import { useToast } from '../components/Toast';

const EMPTY_TEMPLATE: Partial<Template> = {
  name: '',
  language: 'da',
  subject: '',
  htmlBody: '',
  textBody: '',
  isDefault: false,
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Template | null>(null);
  const [form, setForm] = useState<Partial<Template>>({ ...EMPTY_TEMPLATE });
  const [isNew, setIsNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await templatesApi.getAll();
      setTemplates(data);
    } catch {
      showToast('Failed to load templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const selectTemplate = (t: Template) => {
    setSelected(t);
    setForm({ ...t });
    setIsNew(false);
  };

  const startNew = () => {
    setSelected(null);
    setForm({ ...EMPTY_TEMPLATE });
    setIsNew(true);
  };

  const set = (field: keyof Template, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isNew) {
        const created = await templatesApi.create(form);
        showToast('Template created', 'success');
        await load();
        setSelected(created);
        setForm({ ...created });
        setIsNew(false);
      } else if (selected) {
        const updated = await templatesApi.update(selected._id, form);
        showToast('Template saved', 'success');
        await load();
        setSelected(updated);
        setForm({ ...updated });
      }
    } catch {
      showToast('Failed to save template', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await templatesApi.delete(id);
      showToast('Template deleted', 'success');
      setConfirmDelete(null);
      if (selected?._id === id) { setSelected(null); setForm({ ...EMPTY_TEMPLATE }); setIsNew(false); }
      await load();
    } catch {
      showToast('Failed to delete template', 'error');
    }
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(selected ? { ...selected } : EMPTY_TEMPLATE);

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <h1 className="page-title">Email <span>Templates</span></h1>
        <button className="btn btn-primary" onClick={startNew}>+ New Template</button>
      </div>

      <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>
        {/* Template list */}
        <div style={{ width: 260, flexShrink: 0 }}>
          {loading ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          ) : templates.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p>No templates yet.</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Run the seed script to create defaults.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {templates.map(t => (
                <li
                  key={t._id}
                  onClick={() => selectTemplate(t)}
                  style={{
                    padding: '12px 14px',
                    marginBottom: 6,
                    background: selected?._id === t._id ? 'var(--surface-2)' : 'var(--surface)',
                    border: `1px solid ${selected?._id === t._id ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{t.name}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                    <span className="lang-badge">{t.language.toUpperCase()}</span>
                    {t.isDefault && <span style={{ fontSize: 11, color: 'var(--gold)' }}>★ Default</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Editor panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {(!selected && !isNew) ? (
            <div className="empty-state">
              <p>Select a template to edit, or create a new one.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-row-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Template Name *</label>
                  <input
                    className="form-control"
                    value={form.name || ''}
                    onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Booking Henvendelse (Dansk)"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Language</label>
                  <select className="form-control" value={form.language || 'da'} onChange={e => set('language', e.target.value)}>
                    <option value="da">Danish (DA)</option>
                    <option value="en">English (EN)</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Email Subject *</label>
                <input
                  className="form-control"
                  value={form.subject || ''}
                  onChange={e => set('subject', e.target.value)}
                  placeholder="e.g. Electric Poultry - Vi vil gerne spille for jer!"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={form.isDefault || false}
                    onChange={e => set('isDefault', e.target.checked)}
                  />
                  Mark as default template for this language
                </label>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>(used when sending without picking a template)</span>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ margin: 0 }}>HTML Body</label>
                  <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>Use <code style={{ background: 'var(--surface-2)', padding: '1px 4px', borderRadius: 3 }}>{'{{recipientName}}'}</code> as placeholder for venue/contact name</span>
                    {(selected || isNew) && form.htmlBody && (
                      <a
                        href={selected
                          ? emailApi.previewTemplateUrl(selected._id)
                          : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '2px 8px', fontSize: 12 }}
                        onClick={e => { if (isNew) { e.preventDefault(); showToast('Save template first to preview', 'info'); } }}
                      >
                        Preview ↗
                      </a>
                    )}
                  </div>
                </div>
                <textarea
                  className="form-control"
                  value={form.htmlBody || ''}
                  onChange={e => set('htmlBody', e.target.value)}
                  rows={18}
                  style={{ fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                  placeholder="Paste or write HTML email body here..."
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Plain Text Body</label>
                <textarea
                  className="form-control"
                  value={form.textBody || ''}
                  onChange={e => set('textBody', e.target.value)}
                  rows={8}
                  style={{ fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
                  placeholder="Plain text fallback for email clients that don't support HTML..."
                />
              </div>

              <div style={{ display: 'flex', gap: 10, paddingBottom: 24 }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : (isNew ? 'Create Template' : 'Save Changes')}
                </button>
                {isDirty && !isNew && (
                  <button className="btn btn-ghost" onClick={() => { if (selected) setForm({ ...selected }); }}>
                    Discard Changes
                  </button>
                )}
                {selected && (
                  <button className="btn btn-danger" style={{ marginLeft: 'auto' }} onClick={() => setConfirmDelete(selected._id)}>
                    Delete Template
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Template</h2>
              <button className="btn-close" onClick={() => setConfirmDelete(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this template? This cannot be undone.</p>
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
