import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { fetchWithAuth } from '../../services/api';

export default function UpdateBook() {
  const [serial, setSerial] = useState('');
  const [formData, setFormData] = useState({ _id: '', status: 'Available', date: '' });
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await fetchWithAuth('/api/books');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      toast.error("Failed to load books");
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleEdit = (book) => {
    setSerial(book.serialNumber);
    setFormData({ _id: book._id, status: book.status, date: book.procurementDate?.split('T')[0] || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData._id && !serial) return toast.error("Select a book first");
    
    try {
      let targetId = formData._id;
      if (!targetId) {
        const targetBook = books.find(b => b.serialNumber.trim().toLowerCase() === serial.trim().toLowerCase());
        if (!targetBook) return toast.error("Book not found");
        targetId = targetBook._id;
      }
      
      const res = await fetchWithAuth('/api/books/' + targetId, {
        method: 'PUT',
        body: JSON.stringify({
          status: formData.status,
          procurementDate: formData.date || undefined
        })
      });
      
      if(res.ok) {
        toast.success("Book Updated Successfully!");
        fetchBooks();
        setFormData({ _id: '', status: 'Available', date: '' });
        setSerial('');
      } else {
        toast.error("Failed to update");
      }
    } catch(err) {
      toast.error("Server error");
    }
  };

  const filteredBooks = books.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.serialNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div className="glass-card">
        <h2 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Update Book Status</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Serial Number</label>
            <input type="text" className="form-control" value={serial} onChange={e => setSerial(e.target.value)} placeholder="SNB-1234" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Procurement Date</label>
              <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
            <Save size={18} /> Update Book
          </button>
        </form>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Current Collection</h2>
        <input 
          type="text" 
          className="form-control" 
          style={{ marginBottom: '24px' }} 
          placeholder="Search books..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid var(--outline-variant)', borderRadius: '4px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--surface-low)', position: 'sticky', top: 0 }}>
              <tr>
                <th style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Serial</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(b => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                  <td style={{ padding: '12px', fontSize: '0.9rem' }}>{b.serialNumber}</td>
                  <td style={{ padding: '12px', fontSize: '0.9rem' }}>{b.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem',
                      background: b.status === 'Available' ? '#dcfce7' : '#fef2f2',
                      color: b.status === 'Available' ? '#166534' : '#991b1b'
                    }}>{b.status}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEdit(b)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
