
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { COMMODITIES } from '../constants';

const CommodityCard: React.FC<{ commodity: any, onDetails: (item: any) => void }> = ({ commodity, onDetails }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => onDetails(commodity)}
      className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group cursor-pointer h-[240px] md:h-[280px] flex flex-col justify-between relative overflow-hidden shrink-0 w-[280px] md:w-full"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-5xl font-black select-none pointer-events-none">
        {commodity.ticker}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-mono font-bold px-2 py-1 bg-background border border-border rounded text-textMuted">
            {commodity.ticker}
          </span>
          <span className={`text-xs font-bold ${commodity.change >= 0 ? 'text-primary' : 'text-danger'}`}>
            {commodity.change >= 0 ? '▲' : '▼'}{Math.abs(commodity.change)}%
          </span>
        </div>
        
        <h4 className="text-lg font-black mb-1 text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
          {commodity.name}
        </h4>
        <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">Global Index Sync</p>
      </div>
      
      <div className="h-16 w-full mb-4">
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

      <div className="flex justify-between items-end relative z-10">
        <div>
          <p className="text-2xl font-mono font-black text-white leading-none mb-1">${commodity.price.toLocaleString()}</p>
          <p className="text-[9px] text-textMuted uppercase font-black tracking-widest">USD PER MT</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDetails(commodity); }}
          className="text-[10px] font-black text-primary border border-primary/30 px-4 py-2 rounded hover:bg-primary hover:text-black transition-all uppercase tracking-widest"
        >
          ANALYZE
        </button>
      </div>
    </motion.div>
  );
};

interface GrainGridProps {
  onViewDetails: (item: any) => void;
}

const GrainGrid: React.FC<GrainGridProps> = ({ onViewDetails }) => {
  return (
    <section className="py-20 px-4 md:px-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-6 mb-12">
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Market Index</h2>
          <p className="text-textMuted font-mono text-xs uppercase tracking-widest">Real-time Commodity DNA</p>
        </div>
        <div className="h-px bg-border flex-1 border-dashed border-t"></div>
      </div>

      {/* Mobile Carousel / Desktop Grid Container */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-8 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 scroll-snap-x">
        {COMMODITIES.map((c, i) => (
          <CommodityCard key={c.ticker} commodity={c} onDetails={onViewDetails} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="inline-flex items-center gap-4 text-textMuted hover:text-primary transition-all group">
          <span className="h-px w-12 bg-textMuted group-hover:bg-primary transition-all"></span>
          <span className="text-xs font-black uppercase tracking-[0.4em]">Expand Terminal View</span>
          <span className="h-px w-12 bg-textMuted group-hover:bg-primary transition-all"></span>
        </button>
      </div>
    </section>
  );
};

export default GrainGrid;
