import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import VenuesPage from './pages/VenuesPage';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import TemplatesPage from './pages/TemplatesPage';
import { ToastProvider } from './components/Toast';
import './App.css';

function App() {
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
            </ul>
            <div className="sidebar-footer">
              <span>Fear the Chicken.</span>
            </div>
          </nav>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/venues" element={<VenuesPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
