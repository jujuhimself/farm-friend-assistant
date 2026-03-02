
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
    { id: 'profile', icon: '👤', label: 'Me' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around px-1 z-50 lg:hidden safe-area-bottom">
      {items.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-lg transition-all relative ${
              isActive ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <span className={`text-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-tight font-mono ${isActive ? 'opacity-100' : 'opacity-50'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
