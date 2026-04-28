import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, UserMinus } from 'lucide-react';
import { fetchWithAuth } from '../../services/api';

export default function UpdateMembership() {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({ _id: '', memNumber: '', startDate: '', endDate: '', extension: 'six_months', remove: false });

  const fetchMembers = async () => {
    try {
      const res = await fetchWithAuth('/api/memberships');
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      toast.error("Failed to load members");
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleEdit = (mem) => {
    setFormData({
      _id: mem._id,
      memNumber: mem.membershipNumber,
      startDate: mem.startDate?.split('T')[0] || '',
      endDate: mem.endDate?.split('T')[0] || '',
      extension: mem.membershipType,
      remove: false
    });
    setSearch(mem.firstName + ' ' + mem.lastName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.memNumber && !formData._id) {
      toast.error("Select a member first.");
      return;
    }
    
    try {
      let targetId = formData._id;
      if (!targetId) {
        const targetMem = members.find(m => m.membershipNumber === formData.memNumber);
        if (!targetMem) return toast.error("Membership not found");
        targetId = targetMem._id;
      }
      
      if (formData.remove) {
        const confirmDelete = window.confirm("Are you sure you want to remove this membership?");
        if (!confirmDelete) return;
        
        const res = await fetchWithAuth('/api/memberships/' + targetId, { method: 'DELETE' });
        if (res.ok) {
          toast.success("Membership Removed!");
          fetchMembers();
          setFormData({ _id: '', memNumber: '', startDate: '', endDate: '', extension: 'six_months', remove: false });
          setSearch('');
        } else {
          toast.error("Failed to remove");
        }
        return;
      }
      
      const res = await fetchWithAuth('/api/memberships/' + targetId, {
        method: 'PUT',
        body: JSON.stringify({
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          membershipType: formData.extension
        })
      });
      
      if(res.ok) {
        toast.success("Membership Updated!");
        fetchMembers();
      } else {
        toast.error("Failed to update");
      }
    } catch(err) {
      toast.error("Server error");
    }
  };

  const filteredMembers = members.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) || 
    m.membershipNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div className="glass-card">
        <h2 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Update Membership</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Search Member (Name or ID)</label>
            <input 
              type="text" 
              className="form-control" 
              value={search} 
              onChange={e => {
                setSearch(e.target.value);
                if (!e.target.value) setFormData({ ...formData, _id: '', memNumber: '' });
              }} 
              placeholder="Start typing name or MEM-ID..." 
            />
          </div>
          
          {formData._id && (
            <div className="animate-in">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group"><label className="form-label">New Start Date</label><input type="date" className="form-control" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">New End Date</label><input type="date" className="form-control" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Extension Period</label>
                <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                  <label className="radio-group"><input type="radio" name="ext" checked={formData.extension === 'six_months'} onChange={() => setFormData({...formData, extension: 'six_months'})} /> 6 Months</label>
                  <label className="radio-group"><input type="radio" name="ext" checked={formData.extension === 'one_year'} onChange={() => setFormData({...formData, extension: 'one_year'})} /> 1 Year</label>
                  <label className="radio-group"><input type="radio" name="ext" checked={formData.extension === 'two_years'} onChange={() => setFormData({...formData, extension: 'two_years'})} /> 2 Years</label>
                </div>
              </div>

              <div style={{ marginTop: '32px', padding: '20px', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '24px' }}>
                <label className="checkbox-group" style={{ color: '#e11d48', fontWeight: '600' }}>
                  <input type="checkbox" checked={formData.remove} onChange={e => setFormData({...formData, remove: e.target.checked})} /> 
                  Permanently remove this membership
                </label>
              </div>
              <button type="submit" className={`btn ${formData.remove ? 'btn-outline' : 'btn-primary'}`} style={{ width: '100%', color: formData.remove ? '#e11d48' : '' }}>
                {formData.remove ? <><UserMinus size={18} /> Delete Member</> : <><Save size={18} /> Update Membership</>}
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>All Memberships</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--outline-variant)' }}>
                <th style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>ID</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(m => (
                <tr key={m._id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                  <td style={{ padding: '12px', fontSize: '0.9rem' }}>{m.membershipNumber}</td>
                  <td style={{ padding: '12px', fontSize: '0.9rem' }}>{m.firstName} {m.lastName}</td>
                  <td style={{ padding: '12px', fontSize: '0.9rem' }}>{m.membershipType.replace('_', ' ')}</td>
                  <td style={{ padding: '12px', fontSize: '0.8rem' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', background: m.active ? '#dcfce7' : '#f3f4f6', color: m.active ? '#166534' : '#4b5563' }}>
                      {m.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEdit(m)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Edit</button>
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
