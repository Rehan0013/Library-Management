import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Repeat,
  LogOut,
  ArrowRight,
  LayoutDashboard,
  Lock,
  Save,
  X
} from 'lucide-react';
import { fetchWithAuth } from '../services/api';

export default function UserHome() {
  const navigate = useNavigate();
  const [showPassModal, setShowPassModal] = useState(false);
  const [newPass, setNewPass] = useState('');

  const modules = [
    {
      title: 'Transactions',
      icon: <Repeat size={28} />,
      desc: 'Issue books & movies, process returns, and check your pending fines.',
      path: '/transactions',
      color: 'var(--primary)'
    },
    {
      title: 'Reports',
      icon: <FileText size={28} />,
      desc: 'Browse our extensive catalog of books and movies available for issue.',
      path: '/reports',
      color: 'var(--text-muted)'
    }
  ];

  const handlePassUpdate = async (e) => {
    e.preventDefault();
    if (!newPass) return;
    try {
      const id = localStorage.getItem('userId');
      const res = await fetchWithAuth(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ password: newPass })
      });
      if (res.ok) {
        toast.success("Password updated successfully!");
        setShowPassModal(false);
        setNewPass('');
      } else {
        toast.error("Failed to update password");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '80px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }} className="animate-in">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--primary)', color: 'var(--on-primary)', padding: '10px', borderRadius: '2px' }}>
                <LayoutDashboard size={24} />
              </div>
              <span className="metadata-tag">
                {localStorage.getItem('userName') || 'Member'} • Member Portal
              </span>
            </div>
            <h1 className="heading-primary">The Archive</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
              Interact with the permanent record. Explore the collection and manage your archival requests with precision.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowPassModal(true)}
              className="btn btn-outline"
            >
              <Lock size={18} />
              Password
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userId');
                localStorage.removeItem('userName');
                navigate('/user/login');
              }}
              className="btn btn-outline"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </header>

        {showPassModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
              <button onClick={() => setShowPassModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              <h2 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Update Password</h2>
              <form onSubmit={handlePassUpdate}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Save size={18} /> Update
                </button>
              </form>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {modules.map((mod, idx) => (
            <Link key={idx} to={mod.path} style={{ textDecoration: 'none' }} className="animate-in">
              <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '2px',
                  background: mod.color,
                  color: 'var(--on-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '32px'
                }}>
                  {mod.icon}
                </div>

                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '16px' }}>{mod.title}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1rem', flexGrow: 1 }}>{mod.desc}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Proceed to Module
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
