import { useState } from 'react';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '../../services/api';

export default function ItemReturn() {
  const [formData, setFormData] = useState({
    serialNumber: '',
    returnDate: new Date().toISOString().split('T')[0],
    remarks: '',
    finePaid: false
  });
  const [fineDue, setFineDue] = useState(0);
  const [daysOverdue, setDaysOverdue] = useState(0);
  const [itemInfo, setItemInfo] = useState(null);

  const calculateFine = (dueDate, actualDate) => {
    const retDate = new Date(dueDate);
    retDate.setHours(0, 0, 0, 0);
    const actRetDate = new Date(actualDate);
    actRetDate.setHours(0, 0, 0, 0);
    
    if (actRetDate > retDate) {
      const diffTime = actRetDate - retDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      setDaysOverdue(diffDays);
      setFineDue(diffDays * 50);
    } else {
      setDaysOverdue(0);
      setFineDue(0);
    }
  };

  const checkItem = async () => {
    if (!formData.serialNumber) return;
    try {
      const res = await fetchWithAuth('/api/transactions?status=Issued');
      const txs = await res.json();
      const tx = txs.find(t => {
        const input = formData.serialNumber.trim().toLowerCase();
        const bookSN = t.book?.serialNumber?.toLowerCase();
        const movieSN = t.movie?.serialNumber?.toLowerCase();
        return bookSN === input || movieSN === input;
      });
      
      if (tx) {
        setItemInfo(tx);
        calculateFine(tx.returnDate, formData.returnDate);
      } else {
        setItemInfo(null);
        setFineDue(0);
        setDaysOverdue(0);
      }
    } catch (err) {
      toast.error("Failed to check item");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth('/api/transactions/return', {
        method: 'POST',
        body: JSON.stringify({
          serialNumber: formData.serialNumber,
          actualReturnDate: formData.returnDate,
          remarks: formData.remarks,
          finePaid: fineDue > 0 ? formData.finePaid : false
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Return successful!");
        setFormData({ serialNumber: '', returnDate: new Date().toISOString().split('T')[0], remarks: '', finePaid: false });
        setItemInfo(null);
        setFineDue(0);
      } else {
        toast.error(data.message || "Error processing return");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Return Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Serial Number</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="SNB-1234 or SNM-1234"
              value={formData.serialNumber}
              onChange={e => setFormData({...formData, serialNumber: e.target.value})}
            />
            <button type="button" className="btn btn-outline" onClick={checkItem}>Verify</button>
          </div>
        </div>

        {itemInfo && (
          <div style={{ padding: '16px', background: 'var(--surface-low)', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ fontWeight: '700', marginBottom: '4px' }}>{itemInfo.book?.name || itemInfo.movie?.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Issued to: {itemInfo.membership?.firstName} {itemInfo.membership?.lastName} ({itemInfo.membership?.membershipNumber})
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Due Date: {new Date(itemInfo.returnDate).toLocaleDateString()}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Actual Return Date</label>
          <input type="date" className="form-control" value={formData.returnDate} onChange={e => {
            setFormData({...formData, returnDate: e.target.value});
            if (itemInfo) {
              calculateFine(itemInfo.returnDate, e.target.value);
            }
          }} />
        </div>

        {fineDue > 0 && (
          <div style={{ padding: '20px', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#c2410c', fontWeight: '800', fontSize: '1.2rem' }}>Fine Overdue: ₹{fineDue}</div>
                <div style={{ fontSize: '0.85rem', color: '#9a3412', marginTop: '4px' }}>
                  <strong>{daysOverdue} days</strong> overdue (at ₹50/day)
                </div>
              </div>
              <label className="checkbox-group" style={{ color: '#c2410c', fontWeight: '700' }}>
                <input type="checkbox" checked={formData.finePaid} onChange={e => setFormData({...formData, finePaid: e.target.checked})} />
                Mark as Paid
              </label>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Remarks</label>
          <textarea className="form-control" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>Process Return</button>
      </form>
    </div>
  );
}
