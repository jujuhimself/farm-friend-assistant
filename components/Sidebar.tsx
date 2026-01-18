
import React from 'react';
import { ViewType, UserRole } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAiToggle: () => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onAiToggle, userRole }) => {
  const BUYER_GROUPS = [
    {
      title: 'OPERATIONS HUB',
      items: [
        { id: 'dashboard', icon: '📊', label: 'DASHBOARD' },
        { id: 'marketplace', icon: '🔍', label: 'MARKETPLACE' },
        { id: 'orders', icon: '🚢', label: 'ORDERS' },
      ]
    },
    {
      title: 'SOURCING',
      items: [
        { id: 'rfq', icon: '📝', label: 'REQUEST QUOTE' },
        { id: 'intel', icon: '💡', label: 'MARKET INTEL' },
        { id: 'alerts', icon: '🔔', label: 'PRICE ALERTS' },
      ]
    }
  ];

  const SUPPLIER_GROUPS = [
    {
      title: 'SUPPLY HUB',
      items: [
        { id: 'inventory', icon: '🚜', label: 'MY INVENTORY' },
        { id: 'rfqs', icon: '📨', label: 'PENDING RFQS' },
        { id: 'orders', icon: '📦', label: 'ACTIVE ORDERS' },
      ]
    }
  ];

  const ADMIN_GROUPS = [
    {
      title: 'PLATFORM ADMIN',
      items: [
        { id: 'verification', icon: '🛡️', label: 'VERIFICATIONS' },
        { id: 'transactions', icon: '📈', label: 'GLOBAL STATS' },
        { id: 'disputes', icon: '⚖️', label: 'DISPUTE LOG' },
      ]
    }
  ];

  const groups = userRole === 'admin' ? ADMIN_GROUPS : userRole === 'supplier' ? SUPPLIER_GROUPS : BUYER_GROUPS;

  return (
    <aside className="fixed top-[60px] left-0 bottom-0 w-[240px] bg-background border-r border-border hidden lg:flex flex-col z-40">
      <div className="flex-1 overflow-y-auto py-8">
        <div className="px-6 mb-8">
           <div className={`text-[10px] font-black uppercase px-2 py-1 rounded inline-block ${
             userRole === 'admin' ? 'bg-danger/20 text-danger' : userRole === 'supplier' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
           }`}>
             MODE: {userRole}
           </div>
        </div>
        
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="mb-10">
            <h4 className="px-6 text-[11px] font-bold text-textMuted uppercase tracking-widest mb-6">{group.title}</h4>
            <nav className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as ViewType)}
                  className={`w-full flex items-center gap-4 px-6 py-3 transition-all group border-l-4 ${
                    currentView === item.id 
                      ? 'text-primary border-primary bg-primary/5' 
                      : 'text-textMuted border-transparent hover:text-white hover:bg-surface'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-bold font-mono tracking-tight uppercase">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        ))}

        <div className="px-4 mt-4">
          <button 
            onClick={onAiToggle}
            className="w-full flex items-center gap-3 px-4 py-4 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all rounded-lg font-bold text-xs font-mono group"
          >
            <span className="animate-pulse">✨</span> 
            <span>GRAIN AI ASSIST</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <button 
          onClick={() => onViewChange('profile')}
          className="w-full flex items-center gap-3 px-4 py-3 text-textMuted hover:text-white transition-colors text-[10px] font-bold font-mono uppercase"
        >
          <span>👤</span> PROFILE
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-textMuted hover:text-white transition-colors text-[10px] font-bold font-mono uppercase">
          <span>⚙️</span> SETTINGS
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
