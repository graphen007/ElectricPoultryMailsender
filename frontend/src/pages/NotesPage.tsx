import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useSearchParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { notesApi, venuesApi } from '../api';
import { useToast } from '../components/Toast';
import type { Note, Venue } from '../types';

const EDITOR_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [venueId, setVenueId] = useState('');
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([notesApi.getAll(), venuesApi.getAll()])
      .then(([noteData, venueData]) => {
        setNotes(noteData);
        setVenues(venueData);
      })
      .catch(() => showToast('Failed to load notes', 'error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const noteId = searchParams.get('edit');
    const note = notes.find(item => item._id === noteId);
    if (note && !editorOpen) startEditing(note);
  }, [notes, searchParams, editorOpen]);

  function resetForm() {
    setTitle('');
    setContent('');
    setVenueId('');
    setEditingNote(null);
    setEditorOpen(false);
    setSearchParams({}, { replace: true });
  }

  function startAdding() {
    setTitle('');
    setContent('');
    setVenueId('');
    setEditingNote(null);
    setEditorOpen(true);
    setSearchParams({}, { replace: true });
  }

  function startEditing(note: Note) {
    setEditingNote(note);
    setEditorOpen(true);
    setSearchParams({ edit: note._id }, { replace: true });
    setTitle(note.title);
    setContent(note.content || '');
    setVenueId(note.venue?._id || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const data = {
        title: title.trim(),
        content,
        ...(venueId ? { venue: venueId } : {}),
      };
      const saved = editingNote
        ? await notesApi.update(editingNote._id, data)
        : await notesApi.create(data);

      setNotes(prev => editingNote
        ? prev.map(note => note._id === saved._id ? saved : note)
        : [saved, ...prev]);
      resetForm();
      showToast(editingNote ? 'Note updated' : 'Note added', 'success');
    } catch {
      showToast(editingNote ? 'Failed to update note' : 'Failed to add note', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this note?')) return;
    try {
      await notesApi.delete(id);
      setNotes(prev => prev.filter(note => note._id !== id));
      if (editingNote?._id === id) resetForm();
      showToast('Note deleted', 'success');
    } catch {
      showToast('Failed to delete note', 'error');
    }
  }

  const query = search.trim().toLowerCase();
  const filteredNotes = notes.filter(note =>
    !query ||
    note.title.toLowerCase().includes(query) ||
    (note.content || '').toLowerCase().includes(query) ||
    (note.venue?.name || '').toLowerCase().includes(query)
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Notes</h1>
        <button className="btn btn-primary" onClick={startAdding}>+ Add Note</button>
      </div>

      {editorOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <form className="modal notes-form notes-modal" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
            <div className="notes-form-header">
              <h2>{editingNote ? 'Edit Note' : 'Add Note'}</h2>
              <button type="button" className="btn-close" onClick={resetForm} aria-label="Close note editor">&times;</button>
            </div>
            <div className="form-group">
              <label htmlFor="note-title">Note title *</label>
              <input
                id="note-title"
                className="form-control"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What do you need to remember?"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="note-venue">Venue (optional)</label>
              <select id="note-venue" className="form-control" value={venueId} onChange={e => setVenueId(e.target.value)}>
                <option value="">No venue</option>
                {venues.map(venue => <option key={venue._id} value={venue._id}>{venue.name}</option>)}
              </select>
            </div>
            <div className="form-group notes-editor-group">
              <label>Note content</label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={EDITOR_MODULES}
                placeholder="Write your note..."
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>
              <button className="btn btn-primary" type="submit" disabled={saving || !title.trim()}>
                {saving ? 'Saving...' : editingNote ? 'Save Changes' : '+ Add Note'}
              </button>
            </div>
          </form>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="notes-search">
          <input
            className="form-control"
            type="search"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search notes"
          />
          <span className="venue-count">{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {loading ? (
        <div className="empty-state"><p>Loading...</p></div>
      ) : notes.length === 0 ? (
        <div className="empty-state"><p>No notes yet. Add one with the button above.</p></div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-state"><p>No notes match your search.</p></div>
      ) : (
        <div className="notes-list">
          {filteredNotes.map(note => (
            <div className="card note-item" key={note._id}>
              <div className="note-content">
                <strong>{note.title}</strong>
                {note.venue && <div className="note-venue">Venue: {note.venue.name}</div>}
                {note.content && (
                  <ReactQuill
                    className="note-preview"
                    theme="snow"
                    value={note.content}
                    readOnly
                    modules={{ toolbar: false }}
                  />
                )}
              </div>
              <div className="note-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => startEditing(note)}>Edit</button>
                <button className="btn btn-ghost btn-sm" style={{ color: '#c44' }} onClick={() => handleDelete(note._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
