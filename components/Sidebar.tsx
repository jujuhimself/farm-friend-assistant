
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
      title: 'OPERATIONS',
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
        { id: 'intel', icon: '🧠', label: 'INTEL' },
        { id: 'alerts', icon: '🔔', label: 'ALERTS' },
        { id: 'news', icon: '📰', label: 'NEWS' },
      ]
    }
  ];

  const SUPPLIER_GROUPS = [
    {
      title: 'SUPPLY HUB',
      items: [
        { id: 'inventory', icon: '🚜', label: 'INVENTORY' },
        { id: 'rfqs', icon: '📨', label: 'RFQS' },
        { id: 'orders', icon: '📦', label: 'ORDERS' },
      ]
    }
  ];

  const ADMIN_GROUPS = [
    {
      title: 'ADMIN',
      items: [
        { id: 'verification', icon: '🛡️', label: 'VERIFICATIONS' },
        { id: 'transactions', icon: '📈', label: 'STATS' },
        { id: 'disputes', icon: '⚖️', label: 'DISPUTES' },
      ]
    }
  ];

  const GUEST_GROUPS = [
    {
      title: 'EXPLORE',
      items: [
        { id: 'dashboard', icon: '📊', label: 'OVERVIEW' },
        { id: 'marketplace', icon: '🔍', label: 'MARKETPLACE' },
        { id: 'intel', icon: '🧠', label: 'INTEL' },
        { id: 'news', icon: '📰', label: 'NEWS' },
      ]
    }
  ];

  const groups = userRole === 'admin' ? ADMIN_GROUPS : userRole === 'supplier' ? SUPPLIER_GROUPS : userRole === 'guest' ? GUEST_GROUPS : BUYER_GROUPS;

  return (
    <aside className="fixed top-12 md:top-14 left-0 bottom-0 w-[200px] lg:w-[220px] bg-background border-r border-border hidden lg:flex flex-col z-40">
      <div className="flex-1 overflow-y-auto py-6">
        <div className="px-4 mb-6">
          <div className={`text-[9px] font-black uppercase px-2 py-1 rounded inline-block ${
            userRole === 'admin' ? 'bg-danger/20 text-danger' : 
            userRole === 'supplier' ? 'bg-warning/20 text-warning' : 
            userRole === 'guest' ? 'bg-surface text-text-muted' : 'bg-primary/20 text-primary'
          }`}>
            {userRole.toUpperCase()}
          </div>
        </div>
        
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="mb-8">
            <h4 className="px-4 text-[9px] font-bold text-text-muted uppercase tracking-widest mb-3">{group.title}</h4>
            <nav className="space-y-0.5">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as ViewType)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all border-l-2 text-left ${
                    currentView === item.id 
                      ? 'text-primary border-primary bg-primary/5' 
                      : 'text-text-muted border-transparent hover:text-white hover:bg-surface'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[10px] font-bold font-mono tracking-tight uppercase">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        ))}

        <div className="px-3 mt-2">
          <button 
            onClick={onAiToggle}
            className="w-full flex items-center gap-2 px-3 py-3 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all rounded-lg font-bold text-[10px] font-mono"
          >
            <span className="animate-pulse">✨</span> 
            <span>AI ASSIST</span>
          </button>
        </div>
      </div>

      <div className="p-3 border-t border-border space-y-1">
        <button 
          onClick={() => onViewChange('profile')}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-[10px] font-bold font-mono uppercase ${
            currentView === 'profile' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-white hover:bg-surface'
          }`}
        >
          <span>👤</span> PROFILE
        </button>
        <button 
          onClick={() => onViewChange('settings')}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all text-[10px] font-bold font-mono uppercase ${
            currentView === 'settings' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-white hover:bg-surface'
          }`}
        >
          <span>⚙️</span> SETTINGS
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
