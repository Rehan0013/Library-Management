import { useState } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard 
} from 'lucide-react';
import SidebarLayout from '../components/layout/SidebarLayout';
import ItemAvailability from '../components/transactions/ItemAvailability';
import ItemIssue from '../components/transactions/ItemIssue';
import ItemReturn from '../components/transactions/ItemReturn';
import PayFine from '../components/transactions/PayFine';

export default function Transactions() {
  const [activeTab, setActiveTab] = useState('availability');

  const menuItems = [
    { id: 'availability', label: 'Availability', icon: <Search size={18} /> },
    { id: 'issue', label: 'Issue Item', icon: <ArrowUpRight size={18} /> },
    { id: 'return', label: 'Return Item', icon: <ArrowDownLeft size={18} /> },
    { id: 'pay-fine', label: 'Check Fine', icon: <CreditCard size={18} /> },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'availability': return <ItemAvailability />;
      case 'issue': return <ItemIssue />;
      case 'return': return <ItemReturn />;
      case 'pay-fine': return <PayFine />;
      default: return <ItemAvailability />;
    }
  };

  return (
    <SidebarLayout 
      title="Transactions" 
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
