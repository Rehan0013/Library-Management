import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import AdminHome from './pages/AdminHome';
import UserHome from './pages/UserHome';
import Maintenance from './pages/Maintenance';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          borderRadius: '2px',
          background: '#000',
          color: '#fff',
          fontSize: '0.8rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '16px 24px',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
        }
      }} />
      <Routes>
        <Route path="/" element={<Navigate to="/user/login" />} />
        <Route path="/admin/login" element={<Login role="admin" />} />
        <Route path="/user/login" element={<Login role="user" />} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminHome /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute allowedRoles={['user']}><UserHome /></ProtectedRoute>} />
        <Route path="/admin/maintenance" element={<ProtectedRoute allowedRoles={['admin']}><Maintenance /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute allowedRoles={['admin', 'user']}><Transactions /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin', 'user']}><Reports /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
