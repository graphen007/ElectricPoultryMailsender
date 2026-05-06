import { useState, useEffect, useCallback, useRef } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, isSameMonth, isSameDay, parseISO, isToday,
} from 'date-fns';
import { practiceApi } from '../api';
import { Practice, PracticeDay } from '../types';
import { useToast } from '../components/Toast';

interface Props {
  currentUsername: string;
}

function initials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

const AVATAR_COLOURS = [
  '#c8a84b', '#e53935', '#2196f3', '#4caf50', '#9c27b0',
  '#ff9800', '#00bcd4', '#f06292',
];
function avatarColour(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}

// ── Schedule Practice modal ────────────────────────────────────────────────
interface ScheduleModalProps {
  dateStr: string;
  dateLabel: string;
  existingDay?: PracticeDay;
  onSave: (notes: string) => void;
  onDelete?: () => void;
  onClose: () => void;
  saving: boolean;
}

function ScheduleModal({ dateLabel, existingDay, onSave, onDelete, onClose, saving }: Omit<ScheduleModalProps, 'dateStr'> & { dateStr?: string }) {
  const [notes, setNotes] = useState(existingDay?.notes ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(notes);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="schedule-modal-title">
            {existingDay ? 'Practice Session' : 'Schedule Practice'}
          </h2>
          <button className="btn-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Date</label>
              <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)', fontSize: 16, letterSpacing: 1 }}>
                {dateLabel}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="practice-notes">Notes (optional)</label>
              <textarea
                id="practice-notes"
                className="form-control"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Location, time, what to rehearse..."
                rows={3}
              />
            </div>
          </div>
          <div className="modal-footer">
            {existingDay && onDelete && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={onDelete}
                disabled={saving}
                style={{ marginRight: 'auto' }}
                aria-label="Remove this practice session"
              >
                Remove
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : (existingDay ? 'Update' : 'Schedule')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function PracticePage({ currentUsername }: Props) {
  const [entries, setEntries] = useState<Practice[]>([]);
  const [practiceDays, setPracticeDays] = useState<PracticeDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [scheduleModal, setScheduleModal] = useState<{ dateStr: string; dateLabel: string } | null>(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { showToast } = useToast();
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = (msg: string) => {
    if (liveRegionRef.current) liveRegionRef.current.textContent = msg;
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [avail, days] = await Promise.all([
        practiceApi.getByMonth(currentDate.getFullYear(), currentDate.getMonth() + 1),
        practiceApi.getDaysByMonth(currentDate.getFullYear(), currentDate.getMonth() + 1),
      ]);
      setEntries(avail);
      setPracticeDays(days);
    } catch {
      showToast('Failed to load practice data', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  // ── Availability toggle (optimistic) ──────────────────────────────────────
  const handleToggle = async (dateStr: string, dateLabel: string) => {
    if (toggling) return;

    const iAmIn = entries.some(e => e.date.slice(0, 10) === dateStr && e.username === currentUsername);
    const tempId = `optimistic-${dateStr}`;

    if (iAmIn) {
      setEntries(prev => prev.filter(e => !(e.date.slice(0, 10) === dateStr && e.username === currentUsername)));
    } else {
      const optimistic: Practice = {
        _id: tempId,
        date: `${dateStr}T00:00:00.000Z`,
        username: currentUsername,
        userId: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setEntries(prev => [...prev, optimistic]);
    }

    try {
      setToggling(dateStr);
      const result = await practiceApi.toggle(dateStr);
      if (result.action === 'added' && result.entry) {
        setEntries(prev => prev.map(e => e._id === tempId ? result.entry! : e));
      }
      announce(result.action === 'added'
        ? `You are now available on ${dateLabel}`
        : `You removed your availability on ${dateLabel}`);
      showToast(result.action === 'added'
        ? `Marked as available on ${dateLabel}`
        : `Removed availability on ${dateLabel}`,
        result.action === 'added' ? 'success' : 'info');
    } catch {
      if (iAmIn) await load();
      else setEntries(prev => prev.filter(e => e._id !== tempId));
      showToast('Failed to update availability', 'error');
    } finally {
      setToggling(null);
    }
  };

  // ── Schedule / update practice day ────────────────────────────────────────
  const handleSchedule = async (notes: string) => {
    if (!scheduleModal) return;
    setModalSaving(true);
    try {
      const saved = await practiceApi.scheduleDay(scheduleModal.dateStr, notes);
      setPracticeDays(prev => {
        const without = prev.filter(d => d.date.slice(0, 10) !== scheduleModal.dateStr);
        return [...without, saved];
      });
      showToast(`Practice scheduled for ${scheduleModal.dateLabel}`, 'success');
      announce(`Practice session scheduled for ${scheduleModal.dateLabel}`);
      setScheduleModal(null);
    } catch {
      showToast('Failed to schedule practice', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  // ── Remove practice day ───────────────────────────────────────────────────
  const handleRemoveDay = async () => {
    if (!scheduleModal) return;
    const existing = practiceDays.find(d => d.date.slice(0, 10) === scheduleModal.dateStr);
    if (!existing) return;
    setModalSaving(true);
    try {
      await practiceApi.removeDay(existing._id);
      setPracticeDays(prev => prev.filter(d => d._id !== existing._id));
      showToast('Practice session removed', 'info');
      announce(`Practice session on ${scheduleModal.dateLabel} removed`);
      setScheduleModal(null);
    } catch {
      showToast('Failed to remove practice session', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  // ── Calendar helpers ──────────────────────────────────────────────────────
  const entriesForDay = (day: Date) => entries.filter(e => isSameDay(parseISO(e.date), day));
  const isAvailable = (day: Date) => entries.some(e => isSameDay(parseISO(e.date), day) && e.username === currentUsername);
  const practiceDayFor = (day: Date) => practiceDays.find(d => isSameDay(parseISO(d.date), day));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) { days.push(d); d = new Date(d.getTime() + 86400000); }

  const monthLabel = format(currentDate, 'MMMM yyyy').toUpperCase();

  // Upcoming list
  const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
  const upcomingMap = [...entries]
    .filter(e => new Date(e.date) >= todayMidnight)
    .reduce<Record<string, Practice[]>>((acc, e) => {
      const k = e.date.slice(0, 10);
      (acc[k] = acc[k] || []).push(e);
      return acc;
    }, {});
  const upcomingDates = Object.entries(upcomingMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 6);

  const scheduleModalDay = scheduleModal
    ? practiceDays.find(d => d.date.slice(0, 10) === scheduleModal.dateStr)
    : undefined;

  return (
    <div className="page">
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      />

      <div className="page-header">
        <h1 className="page-title">Practice <span>Availability</span></h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>
        Click a date to mark yourself as available. When someone is available, use the
        <strong style={{ color: 'var(--gold)' }}> Schedule </strong>
        button to confirm a practice session.
      </p>

      <div className="calendar-wrapper" style={{ marginBottom: 32 }}>
        <div className="calendar-nav">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            aria-label={`Previous month, go to ${format(subMonths(currentDate, 1), 'MMMM yyyy')}`}
          >
            ← Prev
          </button>
          <h2 className="calendar-month" aria-live="polite" aria-atomic="true">{monthLabel}</h2>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            aria-label={`Next month, go to ${format(addMonths(currentDate, 1), 'MMMM yyyy')}`}
          >
            Next →
          </button>
        </div>

        {loading ? (
          <div className="empty-state" role="status" aria-busy="true"><p>Loading...</p></div>
        ) : (
          <div className="calendar-grid" role="grid" aria-label={`Practice calendar for ${monthLabel}`}>
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day, i) => (
              <div key={day} className="cal-weekday" role="columnheader" aria-label={day}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
              </div>
            ))}

            {days.map((day, i) => {
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);
              const dayEntries = entriesForDay(day);
              const iAmAvailable = isAvailable(day);
              const practiceDay = practiceDayFor(day);
              const dateStr = format(day, 'yyyy-MM-dd');
              const dateLabel = format(day, 'EEEE, MMMM d yyyy');
              const isBusy = toggling === dateStr;
              const availableNames = dayEntries.map(e => e.username).join(', ');
              const hasAvailability = dayEntries.length > 0;

              const ariaLabel = inMonth
                ? [
                    dateLabel,
                    practiceDay ? 'Practice session scheduled.' : '',
                    dayEntries.length === 0 ? 'No one available.' : `${dayEntries.length} available: ${availableNames}.`,
                    iAmAvailable ? 'You are available.' : 'You are not marked as available.',
                    'Press Enter or Space to toggle your availability.',
                    hasAvailability && !practiceDay ? 'Tab to Schedule button to confirm a practice session.' : '',
                  ].filter(Boolean).join(' ')
                : `${dateLabel}, outside current month`;

              return (
                <div
                  key={i}
                  role="gridcell"
                  className={[
                    'cal-day',
                    !inMonth ? 'cal-day-outside' : '',
                    today ? 'cal-day-today' : '',
                    iAmAvailable ? 'practice-day-mine' : '',
                    practiceDay ? 'practice-day-scheduled' : '',
                  ].filter(Boolean).join(' ')}
                  tabIndex={inMonth ? 0 : -1}
                  aria-label={ariaLabel}
                  aria-pressed={inMonth ? iAmAvailable : undefined}
                  aria-disabled={!inMonth || isBusy}
                  aria-busy={isBusy}
                  onClick={() => inMonth && !isBusy && handleToggle(dateStr, format(day, 'MMMM d'))}
                  onKeyDown={e => {
                    if (inMonth && !isBusy && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleToggle(dateStr, format(day, 'MMMM d'));
                    }
                  }}
                  style={{ cursor: inMonth ? 'pointer' : 'default', outline: 'none' }}
                >
                  <span className="cal-day-num">{format(day, 'd')}</span>

                  {/* Confirmed practice banner */}
                  {practiceDay && (
                    <button
                      className="practice-scheduled-badge"
                      onClick={e => {
                        e.stopPropagation();
                        setScheduleModal({ dateStr, dateLabel: format(day, 'EEEE, MMMM d yyyy') });
                      }}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); setScheduleModal({ dateStr, dateLabel: format(day, 'EEEE, MMMM d yyyy') }); } }}
                      aria-label={`Practice session confirmed${practiceDay.notes ? `: ${practiceDay.notes}` : ''}. Press Enter to edit or remove.`}
                      tabIndex={inMonth ? 0 : -1}
                    >
                      &#9654; PRACTICE
                    </button>
                  )}

                  {/* Availability avatars */}
                  {dayEntries.length > 0 && (
                    <div className="practice-avatars" aria-hidden="true">
                      {dayEntries.map(e => (
                        <span
                          key={e._id}
                          className="practice-avatar"
                          style={{ background: avatarColour(e.username) }}
                          title={e.username}
                        >
                          {initials(e.username)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Schedule button — only on dates with availability and no session yet */}
                  {inMonth && hasAvailability && !practiceDay && (
                    <button
                      className="practice-schedule-btn"
                      onClick={e => {
                        e.stopPropagation();
                        setScheduleModal({ dateStr, dateLabel: format(day, 'EEEE, MMMM d yyyy') });
                      }}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); setScheduleModal({ dateStr, dateLabel: format(day, 'EEEE, MMMM d yyyy') }); } }}
                      aria-label={`Schedule a practice session on ${dateLabel}`}
                      tabIndex={inMonth ? 0 : -1}
                    >
                      + Schedule
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming availability list */}
      {upcomingDates.length > 0 && (
        <section aria-labelledby="upcoming-practice-heading">
          <div className="section-heading" id="upcoming-practice-heading">Upcoming Available Dates</div>
          <ul className="upcoming-gigs" style={{ listStyle: 'none' }}>
            {upcomingDates.map(([dateKey, dayEntries]) => {
              const dateObj = parseISO(dateKey);
              const youreIn = dayEntries.some(e => e.username === currentUsername);
              const hasSession = practiceDays.some(d => d.date.slice(0, 10) === dateKey);
              return (
                <li
                  key={dateKey}
                  className="upcoming-gig-card"
                  aria-label={`${format(dateObj, 'EEEE MMMM d')} — ${dayEntries.map(e => e.username).join(', ')} available${youreIn ? '. You are available.' : ''}${hasSession ? ' Practice session confirmed.' : ''}`}
                  style={{ borderLeftColor: hasSession ? 'var(--green)' : youreIn ? 'var(--gold)' : 'var(--border-light)' }}
                >
                  <div className="upcoming-gig-date">{format(dateObj, 'EEE dd MMM')}</div>
                  <div className="upcoming-gig-info" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    {dayEntries.map(e => (
                      <span key={e._id} className="practice-avatar" style={{ background: avatarColour(e.username) }} title={e.username} aria-label={e.username}>
                        {initials(e.username)}
                      </span>
                    ))}
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 4 }}>
                      {dayEntries.map(e => e.username).join(', ')}
                    </span>
                  </div>
                  {hasSession && (
                    <span className="status-badge" style={{ background: 'rgba(76,175,80,0.15)', color: 'var(--green)', border: '1px solid rgba(76,175,80,0.3)', fontSize: 10 }}>
                      Scheduled
                    </span>
                  )}
                  {!hasSession && youreIn && (
                    <span className="status-badge" style={{ background: 'rgba(200,168,75,0.15)', color: 'var(--gold)', border: '1px solid rgba(200,168,75,0.3)', fontSize: 10 }}>
                      You're in
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {scheduleModal && (
        <ScheduleModal
          dateStr={scheduleModal.dateStr}
          dateLabel={scheduleModal.dateLabel}
          existingDay={scheduleModalDay}
          onSave={handleSchedule}
          onDelete={scheduleModalDay ? handleRemoveDay : undefined}
          onClose={() => setScheduleModal(null)}
          saving={modalSaving}
        />
      )}
    </div>
  );
}
