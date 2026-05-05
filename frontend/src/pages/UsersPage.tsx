import { useEffect, useState } from 'react';
import { usersApi } from '../api';

interface User { _id: string; username: string; createdAt: string; }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwEdit, setPwEdit] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setUsers(await usersApi.getAll());
  }

  useEffect(() => { load(); }, []);

  function flash(m: string, isErr = false) {
    if (isErr) setError(m); else setMsg(m);
    setTimeout(() => { setMsg(''); setError(''); }, 3000);
  }

  async function addUser() {
    if (!newUsername || !newPassword) return flash('Fill in both fields', true);
    try {
      await usersApi.create(newUsername, newPassword);
      setNewUsername(''); setNewPassword('');
      flash('User created');
      load();
    } catch (e: any) {
      flash(e.response?.data?.error || 'Failed to create user', true);
    }
  }

  async function changePassword(id: string) {
    const pw = pwEdit[id];
    if (!pw) return flash('Enter a new password', true);
    await usersApi.changePassword(id, pw);
    setPwEdit(p => ({ ...p, [id]: '' }));
    flash('Password updated');
  }

  async function deleteUser(id: string, username: string) {
    if (!confirm(`Delete user "${username}"?`)) return;
    await usersApi.delete(id);
    flash('User deleted');
    load();
  }

  const inputStyle: React.CSSProperties = {
    background: '#1a1a1a', border: '1px solid #333', color: '#e0e0e0',
    padding: '0.5rem 0.75rem', fontSize: '0.9rem', flex: 1,
  };
  const btnStyle: React.CSSProperties = {
    background: '#7b2920', color: '#fff', border: 'none',
    padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem',
    letterSpacing: '1px',
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '640px' }}>
      <h1 style={{ color: '#ffd600', marginBottom: '2rem', letterSpacing: '2px' }}>Users</h1>

      {msg && <div style={{ color: '#4caf50', marginBottom: '1rem' }}>{msg}</div>}
      {error && <div style={{ color: '#e53935', marginBottom: '1rem' }}>{error}</div>}

      {/* Add user */}
      <div style={{ background: '#141414', border: '1px solid #222', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ color: '#ccc', margin: '0 0 1rem', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Add User
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input style={inputStyle} placeholder="Username" value={newUsername}
            onChange={e => setNewUsername(e.target.value)} />
          <input style={inputStyle} placeholder="Password" value={newPassword}
            onChange={e => setNewPassword(e.target.value)} />
          <button style={btnStyle} onClick={addUser}>Add</button>
        </div>
      </div>

      {/* User list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {users.map(u => (
          <div key={u._id} style={{ background: '#141414', border: '1px solid #222', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ color: '#e0e0e0', fontWeight: 600 }}>{u.username}</span>
              <button style={{ ...btnStyle, background: '#3a0f0a', fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
                onClick={() => deleteUser(u._id, u.username)}>
                Delete
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="New password"
                value={pwEdit[u._id] || ''}
                onChange={e => setPwEdit(p => ({ ...p, [u._id]: e.target.value }))}
              />
              <button style={btnStyle} onClick={() => changePassword(u._id)}>Change Password</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
