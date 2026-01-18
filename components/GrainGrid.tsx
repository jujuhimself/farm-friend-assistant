
import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { COMMODITIES } from '../constants';

const CommodityCard: React.FC<{ commodity: any, onDetails: (item: any) => void }> = ({ commodity, onDetails }) => {
  return (
    <div 
      onClick={() => onDetails(commodity)}
      className="bg-surface border border-border rounded-xl p-3 md:p-6 hover:border-primary/50 hover:-translate-y-1 transition-all group cursor-pointer h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2 md:mb-4">
          <span className="text-[9px] md:text-[11px] font-mono font-bold px-1.5 py-0.5 bg-background rounded text-textMuted">[{commodity.ticker}]</span>
          <span className={`text-[9px] md:text-xs font-bold ${commodity.change >= 0 ? 'text-primary' : 'text-danger'}`}>
            {commodity.change >= 0 ? '▲' : '▼'}{Math.abs(commodity.change)}%
          </span>
        </div>
        
        <h4 className="text-xs md:text-lg font-bold mb-3 md:mb-6 text-white uppercase tracking-wider group-hover:text-primary transition-colors leading-tight">
          {commodity.name}
        </h4>
      </div>
      
      <div className="h-12 md:h-20 w-full mb-3 md:mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={commodity.history}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={commodity.change >= 0 ? '#00ff88' : '#ff3366'} 
              strokeWidth={2} 
              dot={false} 
            />
            <YAxis hide domain={['dataMin', 'dataMax']} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-end">
        <div className="overflow-hidden">
          <p className="text-sm md:text-2xl font-mono font-bold text-white leading-none mb-1 whitespace-nowrap">{commodity.price.toLocaleString()}</p>
          <p className="text-[8px] md:text-xs text-textMuted uppercase font-bold">USD/MT</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDetails(commodity); }}
          className="text-[8px] md:text-[11px] font-bold text-primary border border-primary/30 px-2 py-1 rounded hover:bg-primary hover:text-black transition-all flex-shrink-0 ml-1"
        >
          ANALYZE
        </button>
      </div>
    </div>
  );
};

interface GrainGridProps {
  onViewDetails: (item: any) => void;
}

const GrainGrid: React.FC<GrainGridProps> = ({ onViewDetails }) => {
  return (
    <section className="py-8 md:py-16 px-4 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
        <h2 className="text-lg md:text-2xl font-bold whitespace-nowrap uppercase tracking-tight">Grain Index</h2>
        <div className="h-px bg-border border-dashed border-t flex-1"></div>
        <span className="text-textMuted text-[8px] md:text-[10px] uppercase tracking-widest hidden sm:inline">V4.2 // AGRI_MESH</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
        {COMMODITIES.map(c => <CommodityCard key={c.ticker} commodity={c} onDetails={onViewDetails} />)}
      </div>

      <div className="text-center">
        <button className="text-primary hover:underline font-bold text-xs md:text-sm flex items-center justify-center gap-2 mx-auto transition-all uppercase tracking-widest">
          Expand Full Matrix <span className="text-lg">→</span>
        </button>
      </div>
    </section>
  );
};

export default GrainGrid;
