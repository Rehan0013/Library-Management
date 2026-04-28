import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, UserPlus, UserCog } from 'lucide-react';
import { fetchWithAuth } from '../../services/api';

export default function UserManagement() {
  const [formData, setFormData] = useState({ type: 'new', selectedUserId: '', name: '', password: '', active: true, admin: false });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (formData.type === 'existing') {
      fetchWithAuth('/api/users')
        .then(res => res.json())
        .then(data => setUsers(data));
    }
  }, [formData.type]);

  const handleUserSelect = (id) => {
    const user = users.find(u => u._id === id);
    if (user) {
      setFormData({
        ...formData,
        selectedUserId: id,
        name: user.name,
        active: user.active,
        admin: user.role === 'admin',
        password: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Name is mandatory.");
      return;
    }
    try {
      if (formData.type === 'new') {
        const res = await fetchWithAuth('/api/users', {
          method: 'POST',
          body: JSON.stringify({
            userId: formData.name.toLowerCase().replace(/\s+/g, ''),
            password: formData.password || 'password123',
            name: formData.name,
            role: formData.admin ? 'admin' : 'user',
            active: formData.active
          })
        });
        if(res.ok) {
          toast.success("User Created Successfully!");
          setFormData({ type: 'new', selectedUserId: '', name: '', password: '', active: true, admin: false });
        } else {
          toast.error("Failed to create user");
        }
      } else {
        if (!formData.selectedUserId) return toast.error("Select a user first");
        const payload = {
          name: formData.name,
          role: formData.admin ? 'admin' : 'user',
          active: formData.active
        };
        if (formData.password) payload.password = formData.password;

        const res = await fetchWithAuth('/api/users/' + formData.selectedUserId, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          toast.success("User Updated Successfully!");
          // Refresh list
          const uRes = await fetchWithAuth('/api/users');
          const uData = await uRes.json();
          setUsers(uData);
        } else {
          toast.error("Failed to update user");
        }
      }
    } catch(err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>User Administration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Action Type</label>
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
            <label className="radio-group"><input type="radio" name="type" checked={formData.type === 'new'} onChange={() => setFormData({...formData, type: 'new', selectedUserId: '', name: '', password: ''})} /> Create New</label>
            <label className="radio-group"><input type="radio" name="type" checked={formData.type === 'existing'} onChange={() => setFormData({...formData, type: 'existing'})} /> Update Existing</label>
          </div>
        </div>

        {formData.type === 'existing' && (
          <div className="form-group">
            <label className="form-label">Select User</label>
            <select 
              className="form-control" 
              value={formData.selectedUserId}
              onChange={e => handleUserSelect(e.target.value)}
            >
              <option value="">Choose a user...</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.userId})</option>)}
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Smith" />
        </div>

        <div className="form-group">
          <label className="form-label">Password {formData.type === 'existing' && '(Leave blank to keep current)'}</label>
          <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', marginBottom: '32px', padding: '24px', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <label className="checkbox-group" style={{ fontWeight: '600' }}>
            <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} /> 
            Account Active
          </label>
          <label className="checkbox-group" style={{ fontWeight: '600' }}>
            <input type="checkbox" checked={formData.admin} onChange={e => setFormData({...formData, admin: e.target.checked})} /> 
            Grant Administrator Privileges
          </label>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
          {formData.type === 'new' ? <><UserPlus size={18} /> Create Account</> : <><UserCog size={18} /> Update Permissions</>}
        </button>
      </form>
    </div>
  );
}
