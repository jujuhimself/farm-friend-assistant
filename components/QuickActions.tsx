
import React from 'react';
import { ViewType } from '../App';

interface QuickActionsProps {
  onViewChange: (view: ViewType) => void;
}

const ACTIONS = [
  { id: 'marketplace', icon: '🔍', title: 'Marketplace', desc: 'Browse crops & verified suppliers.' },
  { id: 'rfq', icon: '📝', title: 'Request Quote', desc: 'Submit sourcing requests.' },
  { id: 'orders', icon: '🚢', title: 'My Orders', desc: 'Track shipments & logistics.' },
  { id: 'alerts', icon: '🔔', title: 'Price Alerts', desc: 'Set price notifications.' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onViewChange }) => {
  return (
    <section className="py-8 md:py-16 px-4 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-4 mb-6 md:mb-10">
        <h2 className="text-lg md:text-2xl font-bold whitespace-nowrap uppercase tracking-tighter">Quick Actions</h2>
        <div className="h-px bg-border border-dashed border-t flex-1"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {ACTIONS.map((action) => (
          <div 
            key={action.id} 
            onClick={() => onViewChange(action.id as ViewType)}
            className="bg-surface border border-border p-4 md:p-6 rounded-xl hover:border-primary/50 transition-all group cursor-pointer"
          >
            <div className="text-2xl md:text-4xl mb-3 md:mb-4">{action.icon}</div>
            <h3 className="text-xs md:text-sm font-bold mb-1 md:mb-2 text-textPrimary group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-textMuted text-[10px] md:text-xs leading-tight">
              {action.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
