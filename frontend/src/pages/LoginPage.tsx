import { useState, FormEvent } from 'react';
import { authApi } from '../api';

interface Props {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, username: user } = await authApi.login(username, password);
      localStorage.setItem('token', token);
      onLogin(user);
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(170deg,#060202 0%,#1e0a07 35%,#471812 70%,#7b2920 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#0f0f0f',
        border: '1px solid #2a2a2a',
        padding: '2.5rem 2.8rem',
        width: '100%',
        maxWidth: '380px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ color: '#fff', fontFamily: 'serif', fontSize: '1.5rem', letterSpacing: '6px', textTransform: 'uppercase' }}>
            ELECTRIC
          </div>
          <div style={{ color: '#ffd600', fontSize: '0.7rem', letterSpacing: '5px', textTransform: 'uppercase', marginTop: '2px' }}>
            POULTRY
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            style={{
              background: '#181818',
              border: '1px solid #333',
              color: '#e0e0e0',
              padding: '0.65rem 0.9rem',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              background: '#181818',
              border: '1px solid #333',
              color: '#e0e0e0',
              padding: '0.65rem 0.9rem',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
          {error && (
            <div style={{ color: '#e53935', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#7b2920',
              color: '#fff',
              border: 'none',
              padding: '0.7rem',
              fontSize: '0.9rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
