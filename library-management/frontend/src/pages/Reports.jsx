import { useState, useEffect } from 'react';
import { 
  Book, 
  Users, 
  ClipboardList, 
  AlertTriangle, 
  Film,
  CreditCard
} from 'lucide-react';
import SidebarLayout from '../components/layout/SidebarLayout';
import { fetchWithAuth } from '../services/api';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('books');
  const [data, setData] = useState({
    books: [],
    movies: [],
    memberships: [],
    active_issues: [],
    overdue: [],
    fine_history: [],
    requests: []
  });

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    try {
      if (tab === 'books') {
        const res = await fetchWithAuth('/api/books');
        const books = await res.json();
        if (Array.isArray(books)) {
          setData(prev => ({...prev, books: books.map(b => [b.serialNumber || '-', b.name || '-', b.author || '-', b.status || '-', b.cost ? `₹${b.cost}` : '-', b.procurementDate ? new Date(b.procurementDate).toLocaleDateString() : '-'])}));
        }
      } else if (tab === 'movies') {
        const res = await fetchWithAuth('/api/movies');
        const movies = await res.json();
        if (Array.isArray(movies)) {
          setData(prev => ({...prev, movies: movies.map(m => [m.serialNumber || '-', m.name || '-', m.director || '-', m.status || '-', m.cost ? `₹${m.cost}` : '-', m.procurementDate ? new Date(m.procurementDate).toLocaleDateString() : '-'])}));
        }
      } else if (tab === 'memberships') {
        const res = await fetchWithAuth('/api/memberships');
        const mems = await res.json();
        if (Array.isArray(mems)) {
          setData(prev => ({...prev, memberships: mems.map(m => [m.membershipNumber || '-', (m.firstName || '') + ' ' + (m.lastName || ''), m.aadhar || '-', m.startDate ? new Date(m.startDate).toLocaleDateString() : '-', m.endDate ? new Date(m.endDate).toLocaleDateString() : '-', m.active ? 'Active' : 'Inactive'])}));
        }
      } else if (tab === 'active_issues') {
        const res = await fetchWithAuth('/api/transactions?status=Issued');
        const txs = await res.json();
        if (Array.isArray(txs)) {
          setData(prev => ({...prev, active_issues: txs.map(t => [t.book?.serialNumber || t.movie?.serialNumber || '-', t.book?.name || t.movie?.name || '-', t.membership?.membershipNumber || '-', t.issueDate ? new Date(t.issueDate).toLocaleDateString() : '-', t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'])}));
        }
      } else if (tab === 'overdue') {
        const res = await fetchWithAuth('/api/transactions/overdue');
        const txs = await res.json();
        if (Array.isArray(txs)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const overdue = txs.map(t => {
            const dueDate = new Date(t.returnDate);
            dueDate.setHours(0, 0, 0, 0);
            const diffTime = today - dueDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const fine = diffDays * 50;
            
            return [
              t.book?.serialNumber || t.movie?.serialNumber || '-',
              t.book?.name || t.movie?.name || '-',
              t.membership?.membershipNumber || '-',
              t.issueDate ? new Date(t.issueDate).toLocaleDateString() : '-',
              dueDate.toLocaleDateString(),
              `₹${fine} (${diffDays} days)`
            ];
          });
          setData(prev => ({...prev, overdue}));
        }
      } else if (tab === 'fine_history') {
        const res = await fetchWithAuth('/api/transactions?status=Returned');
        const txs = await res.json();
        if (Array.isArray(txs)) {
          const history = txs.filter(t => t.fineCalculated > 0).map(t => [
            t.book?.serialNumber || t.movie?.serialNumber || '-',
            t.book?.name || t.movie?.name || '-',
            t.membership?.membershipNumber || '-',
            t.issueDate ? new Date(t.issueDate).toLocaleDateString() : '-',
            t.actualReturnDate ? new Date(t.actualReturnDate).toLocaleDateString() : '-',
            `₹${t.fineCalculated}`
          ]);
          setData(prev => ({...prev, fine_history: history}));
        }
      }
    } catch(err) {
      console.error(err);
    }
  };

  const menuItems = [
    { id: 'books', label: 'Books Catalog', icon: <Book size={18} /> },
    { id: 'movies', label: 'Movies Catalog', icon: <Film size={18} /> },
    { id: 'memberships', label: 'Memberships', icon: <Users size={18} /> },
    { id: 'active_issues', label: 'Active Issues', icon: <ClipboardList size={18} /> },
    { id: 'overdue', label: 'Overdue Returns', icon: <AlertTriangle size={18} /> },
    { id: 'fine_history', label: 'Fine History', icon: <CreditCard size={18} /> },
  ];

  return (
    <SidebarLayout 
      title="Reports" 
      menuItems={menuItems} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      <div className="animate-in">
        {activeTab === 'books' && <ReportTable title="Books Master List" columns={['Serial No', 'Title', 'Author', 'Status', 'Cost', 'Procured On']} data={data.books} />}
        {activeTab === 'movies' && <ReportTable title="Movies Master List" columns={['Serial No', 'Title', 'Director', 'Status', 'Cost', 'Procured On']} data={data.movies} />}
        {activeTab === 'memberships' && <ReportTable title="Memberships List" columns={['ID', 'Member Name', 'Aadhar', 'Starts', 'Ends', 'Status']} data={data.memberships} />}
        {activeTab === 'active_issues' && <ReportTable title="Active Issues" columns={['Serial No', 'Title', 'Member ID', 'Issued On', 'Due Date']} data={data.active_issues} />}
        {activeTab === 'overdue' && <ReportTable title="Overdue Returns" columns={['Serial No', 'Title', 'Member ID', 'Issued On', 'Due Date', 'Estimated Fine']} data={data.overdue} />}
        {activeTab === 'fine_history' && <ReportTable title="Fine Collection History" columns={['Serial No', 'Title', 'Member ID', 'Issued On', 'Returned On', 'Fine Paid']} data={data.fine_history} />}
      </div>
    </SidebarLayout>
  );
}

function ReportTable({ title, columns, data }) {
  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem' }}>{title}</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', padding: '6px 12px', background: '#f1f5f9', borderRadius: '20px' }}>
          {data.length} Records Found
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '12px 16px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} style={{ padding: '16px', color: 'var(--text-main)', fontSize: '0.95rem', borderBottom: '1px solid #f1f5f9' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={columns.length} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No records found in this category.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
