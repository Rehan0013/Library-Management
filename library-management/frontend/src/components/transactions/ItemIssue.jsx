import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '../../services/api';

export default function ItemIssue() {
  const [type, setType] = useState('book');
  const [items, setItems] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [formData, setFormData] = useState({
    itemId: '',
    membershipId: '',
    issueDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    remarks: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemRes, memRes] = await Promise.all([
          fetchWithAuth(type === 'book' ? '/api/books' : '/api/movies'),
          fetchWithAuth('/api/memberships')
        ]);
        const itemData = await itemRes.json();
        const memData = await memRes.json();
        
        if (Array.isArray(itemData)) {
          setItems(itemData.filter(i => i.status === 'Available'));
        } else {
          setItems([]);
        }
        
        if (Array.isArray(memData)) {
          setMemberships(memData.filter(m => m.active));
        } else {
          setMemberships([]);
        }
      } catch (err) {
        toast.error("Failed to load data");
      }
    };
    loadData();
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemId || !formData.membershipId || !formData.returnDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        membershipId: formData.membershipId,
        issueDate: formData.issueDate,
        returnDate: formData.returnDate,
        remarks: formData.remarks
      };
      if (type === 'book') payload.bookId = formData.itemId;
      else payload.movieId = formData.itemId;

      const res = await fetchWithAuth('/api/transactions/issue', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Transaction successful!");
        setFormData({ ...formData, itemId: '', remarks: '' });
        const itemRes = await fetchWithAuth(type === 'book' ? '/api/books' : '/api/movies');
        const itemData = await itemRes.json();
        setItems(itemData.filter(i => i.status === 'Available'));
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to issue item");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const [itemSearch, setItemSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(itemSearch.toLowerCase()) || 
    i.serialNumber.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const filteredMembers = memberships.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.membershipNumber.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Issue {type === 'book' ? 'Book' : 'Movie'}</h2>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button className={`btn ${type === 'book' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setType('book'); setItemSearch(''); setFormData({...formData, itemId: ''}); }} style={{ flex: 1 }}>Book</button>
        <button className={`btn ${type === 'movie' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setType('movie'); setItemSearch(''); setFormData({...formData, itemId: ''}); }} style={{ flex: 1 }}>Movie</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <div className="form-group">
              <label className="form-label">Search {type === 'book' ? 'Book' : 'Movie'}</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name or serial..." 
                value={itemSearch}
                onChange={e => setItemSearch(e.target.value)}
              />
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '8px', border: '1px solid var(--outline-variant)', borderRadius: '4px' }}>
                {filteredItems.map(i => (
                  <div 
                    key={i._id} 
                    onClick={() => { setFormData({...formData, itemId: i._id}); setItemSearch(i.name); }}
                    style={{ 
                      padding: '10px 12px', 
                      cursor: 'pointer', 
                      background: formData.itemId === i._id ? 'var(--surface-low)' : 'transparent',
                      borderBottom: '1px solid var(--outline-variant)'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{i.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {type === 'book' ? `Author: ${i.author}` : `Director: ${i.director}`} • SN: {i.serialNumber}
                    </div>
                  </div>
                ))}
                {filteredItems.length === 0 && <div style={{ padding: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No items found</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Search Member</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name or ID..." 
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '8px', border: '1px solid var(--outline-variant)', borderRadius: '4px' }}>
                {filteredMembers.map(m => (
                  <div 
                    key={m._id} 
                    onClick={() => { setFormData({...formData, membershipId: m._id}); setMemberSearch(`${m.firstName} ${m.lastName}`); }}
                    style={{ 
                      padding: '10px 12px', 
                      cursor: 'pointer', 
                      background: formData.membershipId === m._id ? 'var(--surface-low)' : 'transparent',
                      borderBottom: '1px solid var(--outline-variant)'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{m.firstName} {m.lastName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {m.membershipNumber}</div>
                  </div>
                ))}
                {filteredMembers.length === 0 && <div style={{ padding: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>No members found</div>}
              </div>
            </div>
          </div>

          <div>
            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input type="date" className="form-control" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-control" value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <textarea className="form-control" style={{ height: '80px' }} value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '16px' }}>Confirm Issue</button>
      </form>
    </div>
  );
}
