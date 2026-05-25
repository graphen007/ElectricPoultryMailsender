import { useState, useEffect, useRef } from 'react';
import { gigsApi, practiceApi } from '../api';
import { Gig, PracticeDay } from '../types';
import GigModal from '../components/GigModal';
import { useToast } from '../components/Toast';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, isSameMonth, isSameDay, parseISO, isToday
} from 'date-fns';

function useIcalUrl() {
  const base = window.location.origin; // e.g. http://localhost:5173 or https://...fly.dev
  // In dev the API is proxied; in production Express serves everything on the same origin
  return `${base}/api/public/calendar.ics`;
}

export default function CalendarPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [practiceDays, setPracticeDays] = useState<PracticeDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editGig, setEditGig] = useState<Gig | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [listView, setListView] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const liveRef = useRef<HTMLDivElement>(null);
  const icalUrl = useIcalUrl();
  const webcalUrl = icalUrl.replace(/^https?/, 'webcal');
  const googleUrl = `https://www.google.com/calendar/r/settings/addbyurl?url=${encodeURIComponent(icalUrl)}`;

  const announce = (msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg;
  };

  const load = async () => {
    try {
      setLoading(true);
      const [gigsData, practiceData] = await Promise.all([
        gigsApi.getAll(),
        practiceApi.getDaysByMonth(currentDate.getFullYear(), currentDate.getMonth() + 1),
      ]);
      setGigs(gigsData);
      setPracticeDays(practiceData);
    } catch {
      showToast('Failed to load calendar data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [currentDate]);

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

  function copyIcalUrl() {
    navigator.clipboard.writeText(icalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

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

  const practiceDayFor = (day: Date) =>
    practiceDays.find(pd => isSameDay(parseISO(pd.date), day));

  const upcomingGigs = [...gigs]
    .filter(g => new Date(g.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="page">
      {/* Screen-reader live region */}
      <div
        ref={liveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      />

      <div className="page-header">
        <h1 className="page-title">Gig <span>Calendar</span></h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setListView(!listView)}>
            {listView ? 'Calendar View' : 'List View'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSubscribeOpen(o => !o)}>
            📅 Subscribe
          </button>
          <button className="btn btn-primary" onClick={() => openAdd()}>+ Add Gig</button>
        </div>
      </div>

      {subscribeOpen && (
        <div style={{
          background: '#141414', border: '1px solid #2a2a2a',
          padding: '1.25rem 1.5rem', marginBottom: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
        }}>
          <div style={{ color: '#ffd600', fontFamily: 'Oswald, sans-serif', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
            Subscribe to Calendar
          </div>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
            Add this feed to your calendar app — confirmed gigs and practice sessions update automatically.
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <code style={{ background: '#0f0f0f', border: '1px solid #333', color: '#aaa', padding: '0.35rem 0.6rem', fontSize: '0.78rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {icalUrl}
            </code>
            <button className="btn btn-ghost btn-sm" onClick={copyIcalUrl} style={{ flexShrink: 0 }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a
              href={googleUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ textDecoration: 'none' }}
            >
              + Google Calendar
            </a>
            <a
              href={webcalUrl}
              className="btn btn-secondary btn-sm"
              style={{ textDecoration: 'none' }}
            >
              + Apple / Outlook
            </a>
            <a
              href={icalUrl}
              download="electric-poultry.ics"
              className="btn btn-ghost btn-sm"
              style={{ textDecoration: 'none' }}
            >
              ↓ Download .ics
            </a>
          </div>
        </div>
      )}

      {!listView ? (
        <div className="calendar-wrapper">
          <div className="calendar-nav">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setCurrentDate(subMonths(currentDate, 1)); announce(`Navigated to ${format(subMonths(currentDate, 1), 'MMMM yyyy')}`); }}
              aria-label={`Previous month, go to ${format(subMonths(currentDate, 1), 'MMMM yyyy')}`}
            >
              ← Prev
            </button>
            <h2
              className="calendar-month"
              aria-live="polite"
              aria-atomic="true"
            >
              {format(currentDate, 'MMMM yyyy').toUpperCase()}
            </h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setCurrentDate(addMonths(currentDate, 1)); announce(`Navigated to ${format(addMonths(currentDate, 1), 'MMMM yyyy')}`); }}
              aria-label={`Next month, go to ${format(addMonths(currentDate, 1), 'MMMM yyyy')}`}
            >
              Next →
            </button>
          </div>

          <div
            className="calendar-grid"
            role="grid"
            aria-label={`Gig calendar for ${format(currentDate, 'MMMM yyyy')}`}
          >
            {(['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']).map((fullDay, i) => (
              <div
                key={fullDay}
                className="cal-weekday"
                role="columnheader"
                aria-label={fullDay}
              >
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
              </div>
            ))}

            {days.map((day, i) => {
              const dayGigs = gigsForDay(day);
              const practiceDay = practiceDayFor(day);
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);
              const dateLabel = format(day, 'EEEE, MMMM d yyyy');

              // Build a full description for screen readers
              const parts: string[] = [dateLabel];
              if (today) parts.push('Today.');
              if (practiceDay) parts.push(`Practice session scheduled${practiceDay.notes ? ': ' + practiceDay.notes : ''}.`);
              if (dayGigs.length === 0 && !practiceDay) parts.push('No events.');
              dayGigs.forEach(g => {
                parts.push(`Gig: ${g.title} at ${g.venue}${g.startTime ? ', ' + g.startTime : ''}. ${g.confirmed ? 'Confirmed.' : 'Unconfirmed.'}`);
              });
              if (inMonth) parts.push('Press Enter or Space to add a gig.');
              const cellAriaLabel = parts.join(' ');

              return (
                <div
                  key={i}
                  role="gridcell"
                  className={`cal-day ${!inMonth ? 'cal-day-outside' : ''} ${today ? 'cal-day-today' : ''}`}
                  tabIndex={inMonth ? 0 : -1}
                  aria-label={cellAriaLabel}
                  aria-disabled={!inMonth}
                  onClick={() => inMonth && openAdd(format(day, 'yyyy-MM-dd'))}
                  onKeyDown={e => {
                    if (inMonth && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      openAdd(format(day, 'yyyy-MM-dd'));
                    }
                  }}
                  style={{ outline: 'none', cursor: inMonth ? 'pointer' : 'default' }}
                >
                  <span className="cal-day-num" aria-hidden="true">{format(day, 'd')}</span>

                  {practiceDay && (
                    <div
                      className="cal-practice-day"
                      aria-hidden="true"
                      title={practiceDay.notes ? `Practice: ${practiceDay.notes}` : 'Practice session'}
                    >
                      ♩ Practice
                    </div>
                  )}

                  {dayGigs.map(g => (
                    <button
                      key={g._id}
                      className={`cal-gig ${g.confirmed ? 'cal-gig-confirmed' : 'cal-gig-pending'}`}
                      onClick={e => { e.stopPropagation(); openEdit(g); }}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); openEdit(g); } }}
                      aria-label={`Edit gig: ${g.title} at ${g.venue}${g.startTime ? ', ' + g.startTime : ''}. ${g.confirmed ? 'Confirmed' : 'Unconfirmed'}.`}
                      style={{ display: 'flex', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {g.venue}
                      </span>
                      {!g.confirmed && <span className="cal-gig-unconfirmed-dot" aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="section-heading" id="list-heading">All Events</div>
          {loading ? (
            <div className="empty-state" role="status" aria-busy="true"><p>Loading...</p></div>
          ) : gigs.length === 0 && practiceDays.length === 0 ? (
            <div className="empty-state"><p>No gigs yet.</p><button className="btn btn-primary" onClick={() => openAdd()}>Add your first gig</button></div>
          ) : (
            <div className="table-wrapper">
              <table aria-labelledby="list-heading">
                <caption className="sr-only">All gigs and practice sessions sorted by date</caption>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Type</th>
                    <th scope="col">Title / Venue</th>
                    <th scope="col">City</th>
                    <th scope="col">Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">Notes</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...[...gigs].map(g => ({ kind: 'gig' as const, date: g.date, item: g })),
                    ...[...practiceDays].map(pd => ({ kind: 'practice' as const, date: pd.date, item: pd })),
                  ]
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(row => {
                      if (row.kind === 'gig') {
                        const g = row.item as Gig;
                        return (
                          <tr key={`gig-${g._id}`}>
                            <td><strong>{format(parseISO(g.date), 'EEE dd MMM yyyy')}</strong></td>
                            <td><span className="status-badge" style={{ background: '#2196f322', color: '#64b5f6', border: '1px solid #2196f344', fontSize: 10 }}>Gig</span></td>
                            <td>{g.title} — <span style={{ color: 'var(--text-secondary)' }}>{g.venue}</span></td>
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
                        );
                      } else {
                        const pd = row.item as PracticeDay;
                        return (
                          <tr key={`practice-${pd._id}`} style={{ background: 'rgba(76,175,80,0.04)' }}>
                            <td><strong>{format(parseISO(pd.date), 'EEE dd MMM yyyy')}</strong></td>
                            <td><span className="status-badge" style={{ background: 'rgba(76,175,80,0.15)', color: '#81c784', border: '1px solid rgba(76,175,80,0.3)', fontSize: 10 }}>Practice</span></td>
                            <td style={{ color: '#81c784' }}>&#9835; Practice Session</td>
                            <td>—</td>
                            <td>—</td>
                            <td><span className="status-badge" style={{ background: 'rgba(76,175,80,0.15)', color: '#81c784', border: '1px solid rgba(76,175,80,0.3)' }}>Scheduled</span></td>
                            <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pd.notes || '—'}</td>
                            <td>—</td>
                          </tr>
                        );
                      }
                    })
                  }
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
