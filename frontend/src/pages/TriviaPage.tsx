import { useState, useEffect } from 'react';
import { triviaApi } from '../api';
import { useToast } from '../components/Toast';
import type { Trivia as TriviaItem } from '../types';

export default function TriviaPage() {
  const [items, setItems] = useState<TriviaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    triviaApi.getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!newText.trim()) return;
    setAdding(true);
    try {
      const item = await triviaApi.create(newText.trim());
      setItems(prev => [item, ...prev]);
      setNewText('');
      showToast('Trivia added!', 'success');
    } catch {
      showToast('Failed to add trivia', 'error');
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(item: TriviaItem) {
    try {
      const updated = await triviaApi.update(item._id, { active: !item.active });
      setItems(prev => prev.map(i => i._id === item._id ? updated : i));
    } catch {
      showToast('Failed to update', 'error');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this trivia item?')) return;
    try {
      await triviaApi.delete(id);
      setItems(prev => prev.filter(i => i._id !== id));
      showToast('Deleted', 'success');
    } catch {
      showToast('Failed to delete', 'error');
    }
  }

  async function handleEdit(id: string) {
    if (!editText.trim()) return;
    try {
      const updated = await triviaApi.update(id, { text: editText.trim() });
      setItems(prev => prev.map(i => i._id === id ? updated : i));
      setEditId(null);
      showToast('Updated!', 'success');
    } catch {
      showToast('Failed to update', 'error');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Chicken <span>Trivia</span></h1>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        These appear in the chicken popups on the band website. Active items are shown randomly.
      </p>

      {/* Add new */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Write a trivia or quote..."
          rows={2}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(); } }}
          style={{
            flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text)', padding: '0.6rem 0.8rem', borderRadius: 4,
            fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit',
          }}
        />
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={adding || !newText.trim()}
          style={{ whiteSpace: 'nowrap' }}
        >
          {adding ? 'Adding…' : '+ Add'}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="empty-state"><p>Loading…</p></div>
      ) : items.length === 0 ? (
        <div className="empty-state"><p>No trivia yet. Add one above!</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {items.map(item => (
            <div
              key={item._id}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${item.active ? 'var(--border)' : '#2a2a2a'}`,
                borderRadius: 6,
                padding: '0.75rem 1rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                opacity: item.active ? 1 : 0.45,
              }}
            >
              {/* Active toggle */}
              <button
                title={item.active ? 'Disable' : 'Enable'}
                onClick={() => handleToggle(item)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '1.1rem', padding: '0', marginTop: '2px', flexShrink: 0,
                }}
              >
                {item.active ? '🟡' : '⚫'}
              </button>

              {/* Text / edit */}
              {editId === item._id ? (
                <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={2}
                    style={{
                      flex: 1, background: 'var(--surface-2, #1a1a1a)', border: '1px solid var(--gold)',
                      color: 'var(--text)', padding: '0.4rem 0.6rem', borderRadius: 4,
                      fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(item._id)}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <span style={{ flex: 1, color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {item.text}
                </span>
              )}

              {/* Actions */}
              {editId !== item._id && (
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setEditId(item._id); setEditText(item.text); }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: '#c44' }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
