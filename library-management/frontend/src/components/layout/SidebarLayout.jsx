import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';

export default function SidebarLayout({ children, title, menuItems, activeTab, onTabChange }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const role = localStorage.getItem('userRole');
    localStorage.clear();
    if (role === 'admin') navigate('/admin/login');
    else navigate('/user/login');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100vh', background: 'var(--surface)' }}>
      {/* Sidebar */}
      <aside style={{ 
        background: '#fff', 
        color: '#000', 
        padding: '40px 24px', 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        borderRight: '1px solid var(--outline-variant)'
      }}>
        <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: '#000', borderRadius: '4px' }}></div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#000' }}>LIBRARY.OS</h1>
        </div>
        
        <nav style={{ flex: 1 }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '8px',
                background: activeTab === item.id ? 'var(--surface-low)' : 'transparent',
                border: 'none',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                fontWeight: activeTab === item.id ? '700' : '500'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'grid', gap: '12px' }}>
          {localStorage.getItem('userRole') === 'admin' ? (
            <Link to="/admin" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <Home size={18} /> Admin Dashboard
            </Link>
          ) : (
            <Link to="/user" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <Home size={18} /> Home
            </Link>
          )}
          <button onClick={handleLogout} className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ padding: '48px 64px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em' }}>{title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your library system efficiently.</p>
        </header>
        {children}
      </main>
    </div>
  );
}
