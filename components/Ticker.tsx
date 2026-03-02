
import React from 'react';
import { COMMODITIES } from '../constants';

interface TickerProps {
  cartCount?: number;
}

const Ticker: React.FC<TickerProps> = ({ cartCount = 0 }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-12 md:h-14 bg-background border-b border-border flex items-center overflow-hidden">
      {/* Logo / Status */}
      <div className="flex items-center gap-1.5 px-3 md:px-4 flex-shrink-0 border-r border-border h-full">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[9px] md:text-[10px] font-black text-primary tracking-widest uppercase font-mono">GX</span>
      </div>
      
      {/* Ticker Tape */}
      <div className="flex-1 overflow-hidden relative min-w-0">
        <div className="flex whitespace-nowrap ticker-animation">
          {[...COMMODITIES, ...COMMODITIES].map((c, i) => (
            <div key={i} className="inline-flex items-center mx-2 md:mx-4 text-[10px] md:text-[12px] font-semibold font-mono">
              <span className="text-text-muted mr-1">{c.ticker}</span>
              <span className="text-text-primary mr-1">{c.price.toLocaleString()}</span>
              <span className={c.change >= 0 ? 'text-primary' : 'text-danger'}>
                {c.change >= 0 ? '▲' : '▼'}{Math.abs(c.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart + Avatar */}
      <div className="flex items-center flex-shrink-0 gap-2 px-2 md:px-4 border-l border-border h-full">
        <div className="flex items-center gap-1 bg-primary/10 border border-primary/30 px-2 py-1 rounded">
          <span className="text-primary font-mono font-bold text-[10px]">[{cartCount.toString().padStart(2, '0')}]</span>
        </div>
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-surface border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src="https://picsum.photos/40/40" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Ticker;
