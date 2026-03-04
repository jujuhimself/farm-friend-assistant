
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { COMMODITIES, PRODUCT_CATALOG } from '../constants';

const COMMODITY_PRODUCT_MAP: Record<string, string> = {
  'MAZ': 'P-002',
  'RIC': 'P-001',
  'CSW': 'P-012',
  'SOY': 'P-004',
  'SES': 'P-006',
  'AVO': 'P-010',
  'VNL': 'P-008',
};

const CommodityCard: React.FC<{ commodity: any, onDetails: (item: any) => void }> = ({ commodity, onDetails }) => {
  const handleClick = () => {
    const productId = COMMODITY_PRODUCT_MAP[commodity.ticker];
    const product = productId ? PRODUCT_CATALOG.find(p => p.id === productId) : null;
    if (product) {
      onDetails({ ...product, ...commodity, id: product.id });
    } else {
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
        description: `${commodity.name} — tracked on the GrainX global commodity index.`,
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
      whileHover={{ y: -3 }}
      onClick={handleClick}
      className="bg-surface border border-border rounded-xl p-4 md:p-5 hover:border-primary/50 transition-all group cursor-pointer flex flex-col justify-between relative overflow-hidden w-[180px] md:w-auto h-[200px] md:h-[240px] shrink-0 md:shrink"
    >
      <div className="absolute top-0 right-0 p-3 opacity-[0.04] text-3xl md:text-4xl font-black select-none pointer-events-none">
        {commodity.ticker}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-background border border-border rounded text-text-muted">
            {commodity.ticker}
          </span>
          <span className={`text-[10px] font-bold ${commodity.change >= 0 ? 'text-primary' : 'text-danger'}`}>
            {commodity.change >= 0 ? '▲' : '▼'}{Math.abs(commodity.change)}%
          </span>
        </div>
        
        <h4 className="text-sm md:text-base font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
          {commodity.name}
        </h4>
        <p className="text-[8px] md:text-[9px] text-text-muted font-bold uppercase tracking-widest">Index</p>
      </div>
      
      <div className="my-2" style={{ width: '100%', height: 56, minWidth: 0, minHeight: 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={commodity.history}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={commodity.change >= 0 ? '#00ff88' : '#ff3366'} 
              strokeWidth={1.5} 
              dot={false} 
            />
            <YAxis hide domain={['dataMin', 'dataMax']} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div>
          <p className="text-lg md:text-xl font-mono font-black text-white leading-none">${commodity.price.toLocaleString()}</p>
          <p className="text-[7px] md:text-[8px] text-text-muted uppercase font-black tracking-widest">USD/MT</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          className="text-[8px] md:text-[9px] font-black text-primary border border-primary/30 px-2 md:px-3 py-1 md:py-1.5 rounded hover:bg-primary hover:text-black transition-all uppercase tracking-wider"
        >
          VIEW
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
    <section className="py-8 md:py-16 px-4 md:px-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-6 md:mb-10">
        <div>
          <h2 className="text-base md:text-xl lg:text-2xl font-black uppercase tracking-tighter">Market Index</h2>
          <p className="text-text-muted font-mono text-[9px] md:text-[10px] uppercase tracking-widest">Real-time Pricing</p>
        </div>
        <div className="h-px bg-border flex-1" />
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {COMMODITIES.map((c) => (
          <div key={c.ticker} className="snap-start">
            <CommodityCard commodity={c} onDetails={onViewDetails} />
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMMODITIES.map((c) => (
          <CommodityCard key={c.ticker} commodity={c} onDetails={onViewDetails} />
        ))}
      </div>
    </section>
  );
};

export default GrainGrid;
