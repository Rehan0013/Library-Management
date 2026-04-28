import { useState } from 'react';
import { Search, Book, Film, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchWithAuth } from '../../services/api';

export default function ItemAvailability() {
  const [type, setType] = useState('book');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const endpoint = type === 'book' ? `/api/books?name=${query}` : `/api/movies?name=${query}`;
      const res = await fetchWithAuth(endpoint);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Check Availability</h2>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button 
          className={`btn ${type === 'book' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setType('book'); setResults([]); }}
          style={{ flex: 1 }}
        >
          <Book size={18} /> Books
        </button>
        <button 
          className={`btn ${type === 'movie' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setType('movie'); setResults([]); }}
          style={{ flex: 1 }}
        >
          <Film size={18} /> Movies
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder={`Search ${type}s by name...`}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <Search size={18} /> Search
        </button>
      </form>

      <div style={{ display: 'grid', gap: '16px' }}>
        {results.map(item => (
          <div key={item._id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{item.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {type === 'book' ? `Author: ${item.author}` : `Director: ${item.director}`} • SN: {item.serialNumber}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.status === 'Available' ? (
                <span style={{ color: '#10b981', background: '#ecfdf5', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Available
                </span>
              ) : (
                <span style={{ color: '#ef4444', background: '#fef2f2', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} /> {item.status}
                </span>
              )}
            </div>
          </div>
        ))}
        {results.length === 0 && !loading && query && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No {type}s found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
