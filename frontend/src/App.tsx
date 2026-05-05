import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import VenuesPage from './pages/VenuesPage';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import TemplatesPage from './pages/TemplatesPage';
import TriviaPage from './pages/TriviaPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import { ToastProvider } from './components/Toast';
import { authApi } from './api';
import './App.css';

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

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
          <nav className="sidebar">
            <div className="sidebar-logo">
              <span className="logo-text">ELECTRIC</span>
              <span className="logo-sub">POULTRY</span>
            </div>
            <ul className="nav-links">
              <li>
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="nav-icon">&#9632;</span> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/venues" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="nav-icon">&#9632;</span> Venues
                </NavLink>
              </li>
              <li>
                <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="nav-icon">&#9632;</span> Calendar
                </NavLink>
              </li>
              <li>
                <NavLink to="/templates" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="nav-icon">&#9632;</span> Templates
                </NavLink>
              </li>
              <li>
                <NavLink to="/trivia" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="nav-icon">&#9632;</span> Trivia
                </NavLink>
              </li>
              <li>
                <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
                  <span className="nav-icon">&#9632;</span> Users
                </NavLink>
              </li>
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
