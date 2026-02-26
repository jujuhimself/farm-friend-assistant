
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { COMMODITIES, PRODUCT_CATALOG } from '../constants';

// Map each commodity ticker to a matching PRODUCT_CATALOG item for deep linking
const COMMODITY_PRODUCT_MAP: Record<string, string> = {
  'MAZ': 'P-002', // Yellow Maize
  'RIC': 'P-001', // Long Grain Rice
  'CSW': 'P-012', // Cashew Nuts
  'SOY': 'P-004', // Groundnuts (closest)
  'SES': 'P-006', // Mung Beans (closest oilseed)
  'AVO': 'P-010', // Green Peas (placeholder — avocados not in catalog)
  'VNL': 'P-008', // Yellow Beans (placeholder)
};

const CommodityCard: React.FC<{ commodity: any, onDetails: (item: any) => void }> = ({ commodity, onDetails }) => {
  const handleClick = () => {
    const productId = COMMODITY_PRODUCT_MAP[commodity.ticker];
    const product = productId ? PRODUCT_CATALOG.find(p => p.id === productId) : null;
    if (product) {
      onDetails({ ...product, ...commodity, id: product.id });
    } else {
      // Fallback: create a synthetic product from commodity data
      onDetails({
        id: commodity.ticker,
        crop: commodity.name,
        category: 'Commodity Index',
        origin: 'Tanzania',
        region: 'Multiple Regions',
        volume: 'Market Index',
        price: commodity.price,
        priceUnit: 'USD/MT',
        grade: 'A',
        supplier: 'Multiple Suppliers',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
        stockPeriod: 'Ongoing',
        harvestSeason: 'Varies',
        description: `${commodity.name} — tracked on the GrainX global commodity index. Current market price reflects aggregated spot prices across Tanzanian growing regions.`,
        growingRegions: [],
        seasonality: [],
        logistics: { portOfExport: 'Dar es Salaam Port', transitToDubai: '12-14 days', transitToEurope: '22-26 days', transitToChina: '28-32 days', containerType: '20ft / 40ft FCL', minOrder: 'Inquire' },
        certifications: ['Phytosanitary Certificate', 'Certificate of Origin'],
        priceHistory: commodity.history.map((h: any, i: number) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i % 12], price: h.value })),
      });
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={handleClick}
      className="bg-surface border border-border rounded-2xl p-5 md:p-6 hover:border-primary/50 transition-all group cursor-pointer h-[220px] md:h-[280px] flex flex-col justify-between relative overflow-hidden shrink-0 w-[260px] md:w-full"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-4xl md:text-5xl font-black select-none pointer-events-none">
        {commodity.ticker}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <span className="text-[10px] font-mono font-bold px-2 py-1 bg-background border border-border rounded text-textMuted">
            {commodity.ticker}
          </span>
          <span className={`text-xs font-bold ${commodity.change >= 0 ? 'text-primary' : 'text-danger'}`}>
            {commodity.change >= 0 ? '▲' : '▼'}{Math.abs(commodity.change)}%
          </span>
        </div>
        
        <h4 className="text-base md:text-lg font-black mb-1 text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
          {commodity.name}
        </h4>
        <p className="text-[9px] md:text-[10px] text-textMuted font-bold uppercase tracking-widest">Global Index Sync</p>
      </div>
      
      <div className="h-12 md:h-16 w-full mb-3 md:mb-4">
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
          <p className="text-xl md:text-2xl font-mono font-black text-white leading-none mb-1">${commodity.price.toLocaleString()}</p>
          <p className="text-[8px] md:text-[9px] text-textMuted uppercase font-black tracking-widest">USD PER MT</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          className="text-[9px] md:text-[10px] font-black text-primary border border-primary/30 px-3 md:px-4 py-1.5 md:py-2 rounded hover:bg-primary hover:text-black transition-all uppercase tracking-widest"
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
    <section className="py-12 md:py-20 px-4 md:px-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
        <div className="flex flex-col">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tighter">Market Index</h2>
          <p className="text-textMuted font-mono text-[10px] md:text-xs uppercase tracking-widest">Real-time Commodity DNA</p>
        </div>
        <div className="h-px bg-border flex-1 border-dashed border-t"></div>
      </div>

      {/* Mobile Carousel / Desktop Grid Container */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
        {COMMODITIES.map((c) => (
          <div key={c.ticker} className="snap-start">
            <CommodityCard commodity={c} onDetails={onViewDetails} />
          </div>
        ))}
      </div>

      <div className="mt-8 md:mt-12 text-center">
        <button className="inline-flex items-center gap-3 md:gap-4 text-textMuted hover:text-primary transition-all group">
          <span className="h-px w-8 md:w-12 bg-textMuted group-hover:bg-primary transition-all"></span>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Expand Terminal View</span>
          <span className="h-px w-8 md:w-12 bg-textMuted group-hover:bg-primary transition-all"></span>
        </button>
      </div>
    </section>
  );
};

export default GrainGrid;
