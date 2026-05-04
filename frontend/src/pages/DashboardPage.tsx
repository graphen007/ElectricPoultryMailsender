import { useState, useEffect } from 'react';
import { venuesApi, gigsApi } from '../api';
import { Venue, Gig, STATUS_LABELS, STATUS_COLORS, VenueStatus } from '../types';
import { format, parseISO, isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([venuesApi.getAll(), gigsApi.getAll()])
      .then(([v, g]) => { setVenues(v); setGigs(g); })
      .finally(() => setLoading(false));
  }, []);

  const statusCounts = venues.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<VenueStatus, number>);

  const upcomingGigs = gigs
    .filter(g => isAfter(parseISO(g.date), new Date()) || format(parseISO(g.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentVenues = [...venues]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const statBlocks: { label: string; value: number; color: string }[] = [
    { label: 'Total Venues', value: venues.length, color: 'var(--gold)' },
    { label: 'Emails Sent', value: statusCounts['sent'] || 0, color: '#c8a84b' },
    { label: 'Positive Replies', value: statusCounts['positive'] || 0, color: 'var(--green)' },
    { label: 'Booked', value: statusCounts['booked'] || 0, color: 'var(--blue)' },
    { label: 'Played', value: statusCounts['played'] || 0, color: 'var(--purple)' },
    { label: 'Upcoming Gigs', value: upcomingGigs.length, color: 'var(--gold)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Electric <span>Poultry</span></h1>
      </div>

      <p className="dashboard-tagline">Band Management &mdash; Fear the Chicken.</p>

      {loading ? (
        <div className="empty-state"><p>Loading...</p></div>
      ) : (
        <>
          <div className="stats-grid">
            {statBlocks.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="dashboard-columns">
            <div>
              <div className="section-heading">Upcoming Gigs</div>
              {upcomingGigs.length === 0 ? (
                <div className="empty-state" style={{ padding: '24px 0' }}>
                  <p>No upcoming gigs.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/calendar')}>Add a Gig</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {upcomingGigs.map(g => (
                    <div key={g._id} className="dashboard-gig-card" onClick={() => navigate('/calendar')}>
                      <div className="dashboard-gig-date">{format(parseISO(g.date), 'EEE dd MMM yyyy')}</div>
                      <div className="dashboard-gig-venue">{g.venue}{g.city ? ` — ${g.city}` : ''}</div>
                      {g.startTime && <div className="dashboard-gig-time">{g.startTime}{g.endTime ? `–${g.endTime}` : ''}</div>}
                      <span className="status-badge" style={{
                        background: g.confirmed ? '#4caf5022' : '#c8a84b22',
                        color: g.confirmed ? '#4caf50' : '#c8a84b',
                        border: `1px solid ${g.confirmed ? '#4caf5044' : '#c8a84b44'}`,
                        fontSize: 10, marginTop: 4, display: 'inline-block'
                      }}>
                        {g.confirmed ? 'Confirmed' : 'Unconfirmed'}
                      </span>
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/calendar')} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                    View all gigs &rarr;
                  </button>
                </div>
              )}
            </div>

            <div>
              <div className="section-heading">Recent Venue Activity</div>
              {recentVenues.length === 0 ? (
                <div className="empty-state" style={{ padding: '24px 0' }}>
                  <p>No venues yet.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/venues')}>Add a Venue</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recentVenues.map(v => (
                    <div key={v._id} className="dashboard-venue-row" onClick={() => navigate('/venues')}>
                      <div>
                        <strong>{v.name}</strong>
                        {v.city && <span style={{ color: 'var(--text-muted)', fontSize: 13 }}> &bull; {v.city}</span>}
                      </div>
                      <span className="status-badge" style={{
                        background: STATUS_COLORS[v.status] + '22',
                        color: STATUS_COLORS[v.status],
                        border: `1px solid ${STATUS_COLORS[v.status]}44`,
                        fontSize: 10,
                      }}>
                        {STATUS_LABELS[v.status]}
                      </span>
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/venues')} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                    Manage venues &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <div className="section-heading">Outreach Summary</div>
            <div className="status-breakdown">
              {(Object.entries(statusCounts) as [VenueStatus, number][]).map(([status, count]) => (
                <div key={status} className="status-breakdown-item">
                  <div className="status-breakdown-bar-wrap">
                    <div
                      className="status-breakdown-bar"
                      style={{
                        width: venues.length ? `${(count / venues.length) * 100}%` : '0%',
                        background: STATUS_COLORS[status],
                      }}
                    />
                  </div>
                  <div className="status-breakdown-label">
                    <span className="status-badge" style={{
                      background: STATUS_COLORS[status] + '22',
                      color: STATUS_COLORS[status],
                      border: `1px solid ${STATUS_COLORS[status]}44`,
                      fontSize: 10
                    }}>
                      {STATUS_LABELS[status]}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
