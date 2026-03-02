
import React from 'react';
import { ViewType } from '../App';

interface QuickActionsProps {
  onViewChange: (view: ViewType) => void;
}

const ACTIONS = [
  { id: 'marketplace', icon: '🔍', title: 'Marketplace', desc: 'Browse crops & suppliers' },
  { id: 'rfq', icon: '📝', title: 'Request Quote', desc: 'Submit sourcing needs' },
  { id: 'orders', icon: '🚢', title: 'My Orders', desc: 'Track shipments' },
  { id: 'alerts', icon: '🔔', title: 'Price Alerts', desc: 'Set notifications' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onViewChange }) => {
  return (
    <section className="py-6 md:py-12 px-4 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-4 md:mb-8">
        <h2 className="text-base md:text-xl font-black whitespace-nowrap uppercase tracking-tighter">Quick Actions</h2>
        <div className="h-px bg-border flex-1" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {ACTIONS.map((action) => (
          <div 
            key={action.id} 
            onClick={() => onViewChange(action.id as ViewType)}
            className="bg-surface border border-border p-3 md:p-5 rounded-xl hover:border-primary/50 transition-all group cursor-pointer active:scale-[0.98]"
          >
            <div className="text-xl md:text-3xl mb-2 md:mb-3">{action.icon}</div>
            <h3 className="text-[11px] md:text-sm font-bold mb-0.5 text-text-primary group-hover:text-primary transition-colors">
              {action.title}
            </h3>
            <p className="text-text-muted text-[9px] md:text-[10px] leading-tight">
              {action.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
