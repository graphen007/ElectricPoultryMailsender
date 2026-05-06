import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import VenuesPage from './pages/VenuesPage';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import TemplatesPage from './pages/TemplatesPage';
import TriviaPage from './pages/TriviaPage';
import UsersPage from './pages/UsersPage';
import PracticePage from './pages/PracticePage';
import LoginPage from './pages/LoginPage';
import { ToastProvider } from './components/Toast';
import { authApi } from './api';
import './App.css';

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setChecking(false); return; }
    authApi.me()
      .then(({ username }) => setUser(username))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setChecking(false));
  }, []);

  function handleLogin(username: string) { setUser(username); }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  if (checking) return null;

  if (!user) {
    return (
      <ToastProvider>
        <LoginPage onLogin={handleLogin} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="app-layout">

          {/* Mobile top bar */}
          <div className="mobile-topbar" aria-label="Mobile navigation bar">
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
              aria-controls="sidebar"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
            <span className="mobile-logo">ELECTRIC <span style={{ color: 'var(--gold)' }}>POULTRY</span></span>
          </div>

          {/* Sidebar backdrop (mobile) */}
          {sidebarOpen && (
            <div
              className="sidebar-backdrop"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <nav
            id="sidebar"
            className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}
            aria-label="Main navigation"
          >
            <div className="sidebar-logo">
              <span className="logo-text">ELECTRIC</span>
              <span className="logo-sub">POULTRY</span>
            </div>
            <ul className="nav-links">
              {[
                { to: '/', label: 'Dashboard', end: true },
                { to: '/venues', label: 'Venues' },
                { to: '/calendar', label: 'Calendar' },
                { to: '/practice', label: 'Practice' },
                { to: '/templates', label: 'Templates' },
                { to: '/trivia', label: 'Trivia' },
                { to: '/users', label: 'Users' },
              ].map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="nav-icon">&#9632;</span> {label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="sidebar-footer">
              <div style={{ color: '#777', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{user}</div>
              <button onClick={handleLogout} style={{
                background: 'none', border: '1px solid #333', color: '#888',
                padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.75rem',
                letterSpacing: '1px',
              }}>
                Sign out
              </button>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/venues" element={<VenuesPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/practice" element={<PracticePage currentUsername={user} />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/trivia" element={<TriviaPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
