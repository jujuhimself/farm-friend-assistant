
import React, { useState, useEffect } from 'react';
import { ViewType } from '../App';
import { COMMODITIES } from '../constants';

interface CommandPaletteProps {
  onViewChange: (view: ViewType) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

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
    setQuery('');
  };

  if (!isOpen) return null;

  const NAVIGATION_ITEMS = [
    { label: 'DASHBOARD CONTROL', id: 'dashboard', icon: '📊' },
    { label: 'GLOBAL MARKETPLACE', id: 'marketplace', icon: '🔍' },
    { label: 'ORDER TRACKING', id: 'orders', icon: '🚢' },
    { label: 'SUBMIT RFQ', id: 'rfq', icon: '📝' },
    { label: 'MARKET INTELLIGENCE', id: 'intel', icon: '💡' },
    { label: 'PRICE ALERTS', id: 'alerts', icon: '🔔' },
  ];

  const filteredNav = NAVIGATION_ITEMS.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCommodities = COMMODITIES.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.ticker.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
      <div className="relative w-full max-w-[600px] bg-surface border border-primary/50 rounded-2xl shadow-2xl shadow-primary/10 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-border bg-background/50">
          <input 
            autoFocus
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH TERMINAL (e.g. 'go marketplace', 'maize')..." 
            className="w-full bg-transparent border-none outline-none text-xl font-mono text-primary placeholder:text-textMuted uppercase"
          />
        </div>
        
        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {filteredNav.length > 0 && (
            <div className="mb-6">
              <h5 className="text-[10px] font-bold text-textMuted uppercase mb-3 px-2 tracking-[0.3em]">Operational Access</h5>
              <div className="space-y-1">
                {filteredNav.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => navigate(item.id as ViewType)}
                    className="w-full text-left px-3 py-4 hover:bg-primary/10 hover:text-primary rounded-xl text-sm transition-all flex justify-between items-center group font-mono"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl opacity-50 group-hover:opacity-100">{item.icon}</span>
                      <span className="font-bold tracking-tight uppercase">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredCommodities.length > 0 && (
            <div className="mb-6">
              <h5 className="text-[10px] font-bold text-textMuted uppercase mb-3 px-2 tracking-[0.3em]">Commodity DNA Search</h5>
              <div className="space-y-1">
                {filteredCommodities.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => navigate('marketplace')}
                    className="w-full text-left px-3 py-4 hover:bg-white/5 rounded-xl text-sm transition-all flex justify-between items-center group font-mono"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl opacity-50 group-hover:opacity-100">📦</span>
                      <span className="font-bold tracking-tight uppercase">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-textMuted bg-background border border-border px-2 py-1 rounded-md">{item.ticker}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredCommodities.length === 0 && (
             <div className="py-10 text-center opacity-30 font-mono text-xs uppercase tracking-widest">
               No Protocols Found For "{query}"
             </div>
          )}
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
