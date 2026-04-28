import { Link, useNavigate } from 'react-router-dom';
import { Settings, FileText, Repeat, LogOut, BookOpen, Users, Video } from 'lucide-react';

export default function AdminHome() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Maintenance',
      icon: <Settings size={40} color="var(--primary)" />,
      desc: 'Add and update books, users, and memberships.',
      path: '/admin/maintenance',
      subLinks: ['Membership', 'Books', 'User Management']
    },
    {
      title: 'Transactions',
      icon: <Repeat size={40} color="var(--primary)" />,
      desc: 'Issue, return, and fine management for library items.',
      path: '/transactions',
      subLinks: ['Book Issue', 'Return Book', 'Pay Fine']
    },
    {
      title: 'Reports',
      icon: <FileText size={40} color="var(--primary)" />,
      desc: 'View master lists, active issues, and overdue returns.',
      path: '/reports',
      subLinks: ['Master Lists', 'Active Issues', 'Pending Requests']
    }
  ];

  return (
    <div style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }} className="animate-in">
        <div>
          <h1 className="heading-primary">Admin Console</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Management Gateway for the Archival System.</p>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            navigate('/admin/login');
          }} 
          className="btn btn-outline"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px' }}>
        {modules.map((mod, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '32px', color: 'var(--primary)' }}>{mod.icon}</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '16px' }}>{mod.title}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', flexGrow: 1, lineHeight: '1.6' }}>{mod.desc}</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '40px' }}>
              {mod.subLinks.map((link, i) => (
                <span key={i} className="metadata-tag" style={{ background: 'var(--surface-low)', padding: '6px 12px' }}>
                  {link}
                </span>
              ))}
            </div>
            
            <Link to={mod.path} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
              Enter Module
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
