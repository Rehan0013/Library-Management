import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '../../services/api';

export default function AddMembership() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', contactNo: '', contactAddress: '', aadhar: '', startDate: '', endDate: '', membershipType: 'six_months' });

  useEffect(() => {
    if (formData.startDate && formData.membershipType) {
      const start = new Date(formData.startDate);
      let end = new Date(start);
      if (formData.membershipType === 'six_months') end.setMonth(end.getMonth() + 6);
      else if (formData.membershipType === 'one_year') end.setFullYear(end.getFullYear() + 1);
      else if (formData.membershipType === 'two_years') end.setFullYear(end.getFullYear() + 2);
      setFormData(prev => ({ ...prev, endDate: end.toISOString().split('T')[0] }));
    }
  }, [formData.startDate, formData.membershipType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.firstName || !formData.lastName || !formData.contactNo || !formData.contactAddress || !formData.aadhar || !formData.startDate || !formData.endDate) {
      toast.error("All fields are required.");
      return;
    }
    if(formData.contactNo.length !== 10) {
      toast.error("Contact Number must be exactly 10 digits.");
      return;
    }
    if(formData.aadhar.length !== 12) {
      toast.error("Aadhar Number must be exactly 12 digits.");
      return;
    }
    try {
      const res = await fetchWithAuth('/api/memberships', {
        method: 'POST',
        body: JSON.stringify({
          membershipNumber: 'MEM-' + Math.floor(Math.random() * 10000),
          ...formData
        })
      });
      if(res.ok) {
        toast.success("Membership Added Successfully!");
        setFormData({ firstName: '', lastName: '', contactNo: '', contactAddress: '', aadhar: '', startDate: '', endDate: '', membershipType: 'six_months' });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add membership");
      }
    } catch(err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="glass-card">
      <h2 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Add New Membership</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group"><label className="form-label">First Name</label><input type="text" className="form-control" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="John" /></div>
          <div className="form-group"><label className="form-label">Last Name</label><input type="text" className="form-control" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" /></div>
        </div>
        <div className="form-group"><label className="form-label">Contact No.</label><input type="text" className="form-control" value={formData.contactNo} onChange={e => setFormData({...formData, contactNo: e.target.value.replace(/\D/g, '').slice(0, 10)})} placeholder="10-digit Phone Number" /></div>
        <div className="form-group"><label className="form-label">Contact Address</label><input type="text" className="form-control" value={formData.contactAddress} onChange={e => setFormData({...formData, contactAddress: e.target.value})} placeholder="Residential Address" /></div>
        <div className="form-group"><label className="form-label">Aadhar Card No</label><input type="text" className="form-control" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value.replace(/\D/g, '').slice(0, 12)})} placeholder="12-digit Aadhar Number" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group"><label className="form-label">Start Date</label><input type="date" className="form-control" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">End Date</label><input type="date" className="form-control" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} /></div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Membership Duration</label>
          <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
            <label className="radio-group"><input type="radio" name="duration" checked={formData.membershipType === 'six_months'} onChange={() => setFormData({...formData, membershipType: 'six_months'})} /> 6 Months</label>
            <label className="radio-group"><input type="radio" name="duration" checked={formData.membershipType === 'one_year'} onChange={() => setFormData({...formData, membershipType: 'one_year'})} /> 1 Year</label>
            <label className="radio-group"><input type="radio" name="duration" checked={formData.membershipType === 'two_years'} onChange={() => setFormData({...formData, membershipType: 'two_years'})} /> 2 Years</label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
          Add Membership
        </button>
      </form>
    </div>
  );
}
