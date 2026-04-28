import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { fetchWithAuth } from '../../services/api';

export default function AddMovie() {
  const [formData, setFormData] = useState({ name: '', date: '', director: '', cost: '0' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.name || !formData.date) {
      toast.error("Name and Date are required.");
      return;
    }
    try {
      const res = await fetchWithAuth('/api/movies', {
        method: 'POST',
        body: JSON.stringify({
          serialNumber: 'SNM-' + Math.floor(Math.random() * 10000),
          name: formData.name,
          director: formData.director || 'Unknown',
          procurementDate: formData.date,
          cost: formData.cost
        })
      });
      if(res.ok) {
        toast.success("Movie Added Successfully!");
        setFormData({ name: '', date: '', director: '', cost: '0' });
      } else {
        toast.error("Failed to add movie");
      }
    } catch(err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Add New Movie</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label className="form-label">Movie Title</label><input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Inception" /></div>
        <div className="form-group"><label className="form-label">Director</label><input type="text" className="form-control" value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})} placeholder="Christopher Nolan" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group"><label className="form-label">Procurement Date</label><input type="date" className="form-control" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Cost</label><input type="number" className="form-control" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} /></div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
          <Save size={18} /> Add Movie to Catalog
        </button>
      </form>
    </div>
  );
}
