
import React from 'react';
import { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAiToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onAiToggle }) => {
  const NAV_GROUPS = [
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
      ]
    }
  ];

  return (
    <aside className="fixed top-[60px] left-0 bottom-0 w-[240px] bg-background border-r border-border hidden lg:flex flex-col z-40">
      <div className="flex-1 overflow-y-auto py-8">
        {NAV_GROUPS.map((group, gIdx) => (
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
        <button className="w-full flex items-center gap-3 px-4 py-3 text-textMuted hover:text-white transition-colors text-[10px] font-bold font-mono uppercase">
          <span>⚙️</span> SETTINGS
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger/10 transition-colors text-[10px] font-bold font-mono uppercase">
          <span>🚪</span> LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
