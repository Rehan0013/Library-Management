import { useState } from 'react';
import { 
  Users, 
  BookPlus, 
  Film, 
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import SidebarLayout from '../components/layout/SidebarLayout';
import AddMembership from '../components/maintenance/AddMembership';
import UpdateMembership from '../components/maintenance/UpdateMembership';
import AddBook from '../components/maintenance/AddBook';
import UpdateBook from '../components/maintenance/UpdateBook';
import AddMovie from '../components/maintenance/AddMovie';
import UpdateMovie from '../components/maintenance/UpdateMovie';
import UserManagement from '../components/maintenance/UserManagement';

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState('add-membership');

  const menuItems = [
    { id: 'add-membership', label: 'New Membership', icon: <UserPlus size={18} /> },
    { id: 'update-membership', label: 'Update Membership', icon: <Users size={18} /> },
    { id: 'add-book', label: 'New Book', icon: <BookPlus size={18} /> },
    { id: 'update-book', label: 'Update Book', icon: <BookPlus size={18} /> },
    { id: 'add-movie', label: 'New Movie', icon: <Film size={18} /> },
    { id: 'update-movie', label: 'Update Movie', icon: <Film size={18} /> },
    { id: 'user-management', label: 'User Admin', icon: <ShieldCheck size={18} /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'add-membership': return <AddMembership />;
      case 'update-membership': return <UpdateMembership />;
      case 'add-book': return <AddBook />;
      case 'update-book': return <UpdateBook />;
      case 'add-movie': return <AddMovie />;
      case 'update-movie': return <UpdateMovie />;
      case 'user-management': return <UserManagement />;
      default: return <AddMembership />;
    }
  };

  return (
    <SidebarLayout 
      title="Maintenance" 
      menuItems={menuItems} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      <div className="animate-in">
        {renderContent()}
      </div>
    </SidebarLayout>
  );
}
