
import React from 'react';
import { ViewType } from '../App';

interface QuickActionsProps {
  onViewChange: (view: ViewType) => void;
}

const ACTIONS = [
  { id: 'marketplace', icon: '🔍', title: 'Marketplace', desc: 'Browse crops & verified suppliers.', color: 'primary' },
  { id: 'rfq', icon: '📝', title: 'Init RFQ', desc: 'Sourcing bid protocols.', color: 'info' },
  { id: 'intel', icon: '📊', title: 'Intelligence', desc: 'AI price forecasting.', color: 'warning' },
  { id: 'orders', icon: '🚢', title: 'Logistics', desc: 'Track port shipments.', color: 'primary' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onViewChange }) => {
  return (
    <section className="py-8 md:py-16 px-4 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-4 mb-6 md:mb-10">
        <h2 className="text-lg md:text-2xl font-bold whitespace-nowrap uppercase tracking-tighter">Quick Operations</h2>
        <div className="h-px bg-border border-dashed border-t flex-1"></div>
      </div>

      {/* 2x2 grid on mobile, 4x1 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {ACTIONS.map((action, i) => (
          <div 
            key={i} 
            onClick={() => onViewChange(action.id as ViewType)}
            className="bg-surface border border-border p-5 md:p-8 rounded-xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl md:text-5xl mb-4 md:mb-6">{action.icon}</div>
              <h3 className="text-xs md:text-lg font-bold mb-2 md:mb-4 tracking-wider text-white group-hover:text-primary transition-colors uppercase">
                {action.title}
              </h3>
              <p className="text-textMuted text-[10px] md:text-xs leading-tight mb-6 h-8 md:h-12 overflow-hidden font-mono uppercase tracking-wide">
                {action.desc}
              </p>
            </div>
            <button 
              className="w-full py-2 md:py-3 border border-border rounded-lg text-primary text-[8px] md:text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all"
            >
              RUN →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
