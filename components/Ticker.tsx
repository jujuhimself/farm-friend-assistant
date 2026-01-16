
import React from 'react';
import { COMMODITIES } from '../constants';

interface TickerProps {
  cartCount?: number;
}

const Ticker: React.FC<TickerProps> = ({ cartCount = 0 }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[50px] md:h-[60px] bg-background border-b border-border flex items-center overflow-hidden px-2 md:px-4">
      <div className="flex items-center space-x-1.5 mr-4 md:mr-8 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
        <span className="text-[9px] md:text-xs font-bold text-primary tracking-widest uppercase hidden sm:inline">UPLINK: STABLE</span>
        <span className="text-[9px] font-bold text-primary tracking-widest uppercase sm:hidden">STABLE</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="flex whitespace-nowrap ticker-animation hover:pause">
          {[...COMMODITIES, ...COMMODITIES].map((c, i) => (
            <div key={i} className="inline-flex items-center mx-3 md:mx-6 text-[11px] md:text-[13px] font-semibold font-mono">
              <span className="text-textMuted mr-1.5">[{c.ticker}]</span>
              <span className="text-textPrimary mr-1.5">{c.price.toLocaleString()}</span>
              <span className={c.change >= 0 ? 'text-primary' : 'text-danger'}>
                {c.change >= 0 ? '▲' : '▼'}{Math.abs(c.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center ml-2 md:ml-8 flex-shrink-0 gap-3 md:gap-6">
        <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 px-2 md:px-3 py-1 rounded-md">
          <span className="text-primary text-[9px] md:text-[11px] font-bold tracking-tighter uppercase hidden xs:inline">Buffer</span>
          <span className="text-primary font-mono font-bold text-xs md:text-sm">[{cartCount.toString().padStart(2, '0')}]</span>
        </div>

        <div className="text-right hidden lg:block">
          <p className="text-[11px] font-bold text-textPrimary uppercase">GBIT_SYS</p>
          <p className="text-[10px] text-textMuted font-mono">9823-TX</p>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-surface border border-border flex items-center justify-center hover:border-primary cursor-pointer transition-colors overflow-hidden flex-shrink-0">
          <img src="https://picsum.photos/40/40" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Ticker;
