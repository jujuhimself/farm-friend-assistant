
import React from 'react';
import { ViewType } from '../App';

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'marketplace', icon: '📊', label: 'Market' },
    { id: 'rfq', icon: '📝', label: 'RFQ' },
    { id: 'orders', icon: '🚢', label: 'Track' },
    { id: 'profile', icon: '👤', label: 'User' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-background border-t border-border flex items-center justify-around px-2 z-50 lg:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      {items.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 py-1 rounded-xl ${
              isActive ? 'text-primary' : 'text-textMuted hover:text-white'
            }`}
          >
            <span className={`text-xl transition-transform ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-tight font-mono ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute top-0 w-8 h-[2px] bg-primary rounded-full blur-[1px]"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
