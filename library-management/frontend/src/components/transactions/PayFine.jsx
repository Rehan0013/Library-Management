import { useState } from 'react';
import toast from 'react-hot-toast';
import { Search, CreditCard, AlertCircle } from 'lucide-react';
import { fetchWithAuth } from '../../services/api';

export default function PayFine() {
  const [serial, setSerial] = useState('');
  const [txInfo, setTxInfo] = useState(null);
  const [fine, setFine] = useState(0);
  const [daysOverdue, setDaysOverdue] = useState(0);
  const [loading, setLoading] = useState(false);

  const checkFine = async () => {
    if (!serial) return toast.error("Enter serial number");
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/transactions?status=Issued');
      const txs = await res.json();
      const tx = txs.find(t => {
        const input = serial.trim().toLowerCase();
        const bookSN = t.book?.serialNumber?.toLowerCase();
        const movieSN = t.movie?.serialNumber?.toLowerCase();
        return bookSN === input || movieSN === input;
      });
      
      if (tx) {
        setTxInfo(tx);
        const dueDate = new Date(tx.returnDate);
        dueDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (today > dueDate) {
          const diffTime = today - dueDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          setDaysOverdue(diffDays);
          setFine(diffDays * 50);
        } else {
          setFine(0);
          setDaysOverdue(0);
        }
      } else {
        setTxInfo(null);
        setFine(0);
        setDaysOverdue(0);
        toast.error("No active issue found for this serial number");
      }
    } catch (err) {
      toast.error("Failed to fetch transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '32px', fontSize: '1.5rem' }}>Check Overdue Fine</h2>
      
      <div className="form-group">
        <label className="form-label">Item Serial Number</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="SNB-1234..."
            value={serial} 
            onChange={e => setSerial(e.target.value)} 
          />
          <button className="btn btn-primary" onClick={checkFine} disabled={loading}>
            <Search size={18} /> {loading ? 'Checking...' : 'Check Fine'}
          </button>
        </div>
      </div>

      {txInfo && (
        <div className="animate-in" style={{ marginTop: '32px' }}>
          <div style={{ padding: '24px', background: 'var(--surface-low)', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{txInfo.book?.name || txInfo.movie?.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Issued to: {txInfo.membership?.firstName} {txInfo.membership?.lastName}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="metadata-tag">Due Date</div>
                <div style={{ fontWeight: '700' }}>{new Date(txInfo.returnDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ 
              marginTop: '24px', 
              padding: '20px', 
              background: fine > 0 ? '#fff7ed' : '#f0fdf4', 
              borderRadius: '8px',
              border: `1px solid ${fine > 0 ? '#ffedd5' : '#dcfce7'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ color: fine > 0 ? '#c2410c' : '#15803d', fontWeight: '800', fontSize: '1.25rem' }}>
                  {fine > 0 ? `₹${fine}` : 'No Fine Due'}
                </div>
                <p style={{ fontSize: '0.8rem', color: fine > 0 ? '#9a3412' : '#166534', marginTop: '4px' }}>
                  {fine > 0 ? (
                    <><strong>{daysOverdue} days</strong> overdue (at ₹50/day)</>
                  ) : (
                    'Item is within return period'
                  )}
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <AlertCircle size={20} color="#64748b" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
              Fines are settled during the item return process. Use the <strong>Return Item</strong> module to pay the fine and complete the return.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
