import { useState, useEffect } from 'react';
import { gigsApi } from '../api';
import { Gig } from '../types';
import GigModal from '../components/GigModal';
import { useToast } from '../components/Toast';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, isSameMonth, isSameDay, parseISO, isToday
} from 'date-fns';

export default function CalendarPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editGig, setEditGig] = useState<Gig | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [listView, setListView] = useState(false);
  const { showToast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await gigsApi.getAll();
      setGigs(data);
    } catch {
      showToast('Failed to load gigs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Partial<Gig>) => {
    try {
      setSaving(true);
      if (editGig) {
        await gigsApi.update(editGig._id, data);
        showToast('Gig updated', 'success');
      } else {
        await gigsApi.create(data);
        showToast('Gig added', 'success');
      }
      setModalOpen(false);
      setEditGig(undefined);
      await load();
    } catch {
      showToast('Failed to save gig', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await gigsApi.delete(id);
      showToast('Gig deleted', 'success');
      setConfirmDelete(null);
      await load();
    } catch {
      showToast('Failed to delete gig', 'error');
    }
  };

  const openAdd = (date?: string) => {
    setEditGig(undefined);
    setSelectedDate(date || null);
    setModalOpen(true);
  };
  const openEdit = (g: Gig) => { setEditGig(g); setModalOpen(true); };

  // Calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) {
    days.push(d);
    d = new Date(d.getTime() + 86400000);
  }

  const gigsForDay = (day: Date) =>
    gigs.filter(g => isSameDay(parseISO(g.date), day));

  const upcomingGigs = [...gigs]
    .filter(g => new Date(g.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Gig <span>Calendar</span></h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className={`btn btn-ghost btn-sm`} onClick={() => setListView(!listView)}>
            {listView ? 'Calendar View' : 'List View'}
          </button>
          <button className="btn btn-primary" onClick={() => openAdd()}>+ Add Gig</button>
        </div>
      </div>

      {!listView ? (
        <div className="calendar-wrapper">
          <div className="calendar-nav">
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>&#8592; Prev</button>
            <h2 className="calendar-month">{format(currentDate, 'MMMM yyyy').toUpperCase()}</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>Next &#8594;</button>
          </div>
          <div className="calendar-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="cal-weekday">{day}</div>
            ))}
            {days.map((day, i) => {
              const dayGigs = gigsForDay(day);
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);
              return (
                <div
                  key={i}
                  className={`cal-day ${!inMonth ? 'cal-day-outside' : ''} ${today ? 'cal-day-today' : ''}`}
                  onClick={() => inMonth && openAdd(format(day, 'yyyy-MM-dd'))}
                >
                  <span className="cal-day-num">{format(day, 'd')}</span>
                  {dayGigs.map(g => (
                    <div
                      key={g._id}
                      className={`cal-gig ${g.confirmed ? 'cal-gig-confirmed' : 'cal-gig-pending'}`}
                      onClick={e => { e.stopPropagation(); openEdit(g); }}
                      title={`${g.venue}${g.startTime ? ' ' + g.startTime : ''}${g.confirmed ? ' (confirmed)' : ''}`}
                    >
                      {g.venue}
                      {!g.confirmed && <span className="cal-gig-unconfirmed-dot" title="Unconfirmed" />}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="section-heading">All Gigs</div>
          {loading ? (
            <div className="empty-state"><p>Loading...</p></div>
          ) : gigs.length === 0 ? (
            <div className="empty-state"><p>No gigs yet.</p><button className="btn btn-primary" onClick={() => openAdd()}>Add your first gig</button></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Venue</th>
                    <th>City</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...gigs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(g => (
                    <tr key={g._id}>
                      <td><strong>{format(parseISO(g.date), 'EEE dd MMM yyyy')}</strong></td>
                      <td>{g.title}</td>
                      <td>{g.venue}</td>
                      <td>{g.city || '—'}</td>
                      <td>{g.startTime ? `${g.startTime}${g.endTime ? '–' + g.endTime : ''}` : '—'}</td>
                      <td>
                        <span className="status-badge" style={{
                          background: g.confirmed ? '#4caf5022' : '#c8a84b22',
                          color: g.confirmed ? '#4caf50' : '#c8a84b',
                          border: `1px solid ${g.confirmed ? '#4caf5044' : '#c8a84b44'}`
                        }}>
                          {g.confirmed ? 'Confirmed' : 'Unconfirmed'}
                        </span>
                      </td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.notes || '—'}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(g)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(g._id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {upcomingGigs.length > 0 && !listView && (
        <div style={{ marginTop: 32 }}>
          <div className="section-heading">Upcoming Gigs</div>
          <div className="upcoming-gigs">
            {upcomingGigs.slice(0, 5).map(g => (
              <div key={g._id} className="upcoming-gig-card" onClick={() => openEdit(g)}>
                <div className="upcoming-gig-date">{format(parseISO(g.date), 'EEE dd MMM')}</div>
                <div className="upcoming-gig-info">
                  <strong>{g.venue}</strong>
                  {g.city && <span> &bull; {g.city}</span>}
                  {g.startTime && <span> &bull; {g.startTime}</span>}
                </div>
                <span className="status-badge" style={{
                  background: g.confirmed ? '#4caf5022' : '#c8a84b22',
                  color: g.confirmed ? '#4caf50' : '#c8a84b',
                  border: `1px solid ${g.confirmed ? '#4caf5044' : '#c8a84b44'}`,
                  fontSize: 10,
                }}>
                  {g.confirmed ? 'Confirmed' : 'Unconfirmed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalOpen && (
        <GigModal
          gig={editGig}
          onSave={data => handleSave(selectedDate && !editGig ? { ...data, date: selectedDate } : data)}
          onClose={() => { setModalOpen(false); setEditGig(undefined); setSelectedDate(null); }}
          loading={saving}
        />
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Gig</h2>
              <button className="btn-close" onClick={() => setConfirmDelete(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this gig?</p>
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
