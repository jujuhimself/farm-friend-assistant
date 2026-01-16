
import React, { useState, useEffect } from 'react';
import { ViewType } from '../App';

interface CommandPaletteProps {
  onViewChange: (view: ViewType) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (view: ViewType) => {
    onViewChange(view);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
      <div className="relative w-full max-w-[600px] bg-surface border border-primary/50 rounded-2xl shadow-2xl shadow-primary/10 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-border bg-background/50">
          <input 
            autoFocus
            type="text" 
            placeholder="TYPE COMMAND (e.g. 'go marketplace', 'track order')..." 
            className="w-full bg-transparent border-none outline-none text-xl font-mono text-primary placeholder:text-textMuted uppercase"
          />
        </div>
        
        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <h5 className="text-[10px] font-bold text-textMuted uppercase mb-3 px-2 tracking-[0.3em]">Operational Access</h5>
            <div className="space-y-1">
              {[
                { label: 'DASHBOARD CONTROL', key: '⌘1', id: 'dashboard', icon: '📊' },
                { label: 'GLOBAL MARKETPLACE', key: '⌘2', id: 'marketplace', icon: '🔍' },
                { label: 'ORDER TRACKING', key: '⌘3', id: 'orders', icon: '🚢' },
                { label: 'SUBMIT RFQ', key: '⌘4', id: 'rfq', icon: '📝' },
                { label: 'MARKET INTELLIGENCE', key: '⌘5', id: 'intel', icon: '💡' },
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => navigate(item.id as ViewType)}
                  className="w-full text-left px-3 py-4 hover:bg-primary/10 hover:text-primary rounded-xl text-sm transition-all flex justify-between items-center group font-mono"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl opacity-50 group-hover:opacity-100">{item.icon}</span>
                    <span className="font-bold tracking-tight uppercase">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-textMuted bg-background border border-border px-2 py-1 rounded-md">{item.key}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border bg-background/50 text-[9px] text-textMuted flex justify-between uppercase font-black tracking-widest">
          <span>ARROWS_NAV // ENTER_SELECT</span>
          <span>ESC_CLOSE</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
