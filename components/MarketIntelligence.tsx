
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { COMMODITIES, TRADE_NEWS, AI_INSIGHTS, EXPORT_GUIDELINES, SUPPLY_SIGNALS, REGIONS } from '../constants';
import { TradeNews } from '../types';

interface MarketIntelligenceProps {
  onViewChange?: (view: any) => void;
}

const IntelligenceReportCard: React.FC<{ news: TradeNews, onClick: () => void }> = ({ news, onClick }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-surface border border-border rounded-2xl overflow-hidden cursor-pointer group flex flex-col h-full min-w-[280px]"
  >
    <div className="h-32 overflow-hidden relative">
      <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-2">#{news.category}</span>
      <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
        {news.title}
      </h4>
      <p className="text-[10px] text-textMuted uppercase font-mono tracking-widest mt-auto">{news.readTime} READ</p>
    </div>
  </motion.div>
);

const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ onViewChange }) => {
  const [selectedCrop, setSelectedCrop] = useState(COMMODITIES[0]);
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [forecastDays, setForecastDays] = useState(30);
  const [selectedCountry, setSelectedCountry] = useState(EXPORT_GUIDELINES[0]);

  const getForecastData = (basePrice: number, days: number, region: string) => {
    const data = [];
    const regionalFactor = region === 'ALL REGIONS' ? 1 : 0.95 + (Math.random() * 0.1);
    const adjustedBase = basePrice * regionalFactor;
    for (let i = -15; i <= days; i += 5) {
      data.push({
        day: i,
        price: i <= 0 ? adjustedBase * (0.98 + Math.random() * 0.04) : adjustedBase * (1 + (Math.random() * 0.1 * (i / days))),
        type: i <= 0 ? 'actual' : 'forecast'
      });
    }
    return data;
  };

  const forecastData = getForecastData(selectedCrop.price, forecastDays, selectedRegion);

  return (
    <section className="py-12 md:py-24 px-6 md:px-12 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* 1. Intelligence Command (Header) */}
      <div className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-border pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
             <span className="text-primary text-xs font-black tracking-[0.4em] uppercase font-mono">Satellite Briefing: LIVE</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase glow-text leading-[0.85]">Technical Briefing</h2>
          <p className="text-textMuted font-mono text-xs uppercase tracking-[0.4em]">Integrated Sourcing Synthesis // Node: Dar_Terminal</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full lg:w-auto">
          {[
            { label: 'Global Volatility', value: '4.2%', status: 'STABLE' },
            { label: 'Supply Momentum', value: 'HIGH', status: '▲ 15%' },
            { label: 'Risk Rating', value: 'AAA', status: 'VERIFIED' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface border border-border p-6 rounded-2xl min-w-[180px]">
              <p className="text-[9px] font-black text-textMuted uppercase mb-2 tracking-[0.2em]">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-white">{stat.value}</span>
                <span className="text-[10px] font-bold mb-1 uppercase text-primary">{stat.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. The Wire: Quick Intel (Moved up) */}
      <div className="mb-24">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black uppercase tracking-[0.3em]">The Wire // Active Briefs</h3>
          <button 
            onClick={() => onViewChange?.('news')}
            className="px-6 py-2 border-2 border-primary/20 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
          >
            Access All Field Reports →
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {TRADE_NEWS.map(news => (
            <IntelligenceReportCard key={news.id} news={news} onClick={() => onViewChange?.('news')} />
          ))}
        </div>
      </div>

      {/* 3. Analytics Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        <div className="lg:col-span-8 bg-surface border border-border p-10 rounded-[40px] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12 relative z-10">
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                {COMMODITIES.slice(0, 4).map(c => (
                  <button 
                    key={c.ticker}
                    onClick={() => setSelectedCrop(c)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      selectedCrop.ticker === c.ticker ? 'bg-primary text-black border-primary' : 'bg-background text-textMuted border-border hover:border-white'
                    }`}
                  >
                    {c.ticker}
                  </button>
                ))}
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">{selectedCrop.name} Price Tracking</h3>
              <div className="flex items-center gap-4">
                  <select 
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-transparent border-none text-primary font-mono text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer"
                  >
                    {REGIONS.map(r => <option key={r} value={r} className="bg-surface">{r}</option>)}
                  </select>
                  <span className="text-textMuted text-[10px] font-mono tracking-widest uppercase">// SECURE_UPLINK_SYNC</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-4">
              <div className="flex gap-1 bg-background p-1.5 rounded-xl border border-border">
                {[30, 60, 90].map(d => (
                  <button 
                    key={d}
                    onClick={() => setForecastDays(d)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                      forecastDays === d ? 'bg-surface text-primary' : 'text-textMuted hover:text-white'
                    }`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
              <p className="text-5xl font-black text-white tracking-tighter">${selectedCrop.price.toLocaleString()}</p>
              <p className={`text-[11px] font-black uppercase ${selectedCrop.change >= 0 ? 'text-primary' : 'text-danger'}`}>
                {selectedCrop.change >= 0 ? '▲' : '▼'} {Math.abs(selectedCrop.change)}% WEEKLY
              </p>
            </div>
          </div>

          <div className="h-[450px] w-full mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#444" 
                  fontSize={10} 
                  tickFormatter={(v) => v === 0 ? 'TODAY' : v > 0 ? `+${v}D` : `${v}D`}
                />
                <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="price" stroke="#00ff88" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signals Panel */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-surface border border-border p-10 rounded-[40px] flex-1">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8">Supply Hotspots</h3>
              <div className="space-y-6">
                {SUPPLY_SIGNALS.map((signal, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">{signal.region}</span>
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-widest ${
                         signal.signal === 'BULLISH' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'
                       }`}>
                         {signal.signal}
                       </span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="text-lg font-black text-white uppercase tracking-tight">{signal.crop}</h4>
                       <p className="text-[10px] font-mono text-textMuted">{signal.status}</p>
                    </div>
                    <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                       <div className={`h-full ${signal.signal === 'BULLISH' ? 'bg-primary' : 'bg-danger'}`} style={{ width: signal.signal === 'BULLISH' ? '85%' : '35%' }} />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-info/10 border border-info/30 p-10 rounded-[40px]">
              <h4 className="text-xs font-black text-info uppercase tracking-widest mb-4">Tactical Tip</h4>
              <p className="text-[10px] text-textSecondary leading-relaxed uppercase font-mono">
                Maize prices in Mbeya reaching harvest peak lows. Suggest bulk acquisition now for late-Q3 UAE delivery.
              </p>
           </div>
        </div>
      </div>

      {/* 4. Export Protocol Guide */}
      <div className="bg-surface border border-border p-12 md:p-16 rounded-[60px] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-16 relative z-10">
          <div className="lg:w-1/3">
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">Global Export Protocol</h3>
            <p className="text-sm text-textSecondary uppercase font-mono leading-relaxed mb-10 max-w-sm">
              Documentation requirements and transit tracking for primary trade corridors.
            </p>
            <div className="flex flex-wrap gap-2">
               {EXPORT_GUIDELINES.map(g => (
                 <button 
                  key={g.country}
                  onClick={() => setSelectedCountry(g)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    selectedCountry.country === g.country ? 'bg-info text-white border-info' : 'bg-background text-textMuted border-border'
                  }`}
                 >
                   {g.country}
                 </button>
               ))}
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-background border border-border p-10 rounded-[32px]">
                <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight">{selectedCountry.country}</h4>
                  <span className="text-[10px] font-black text-info uppercase tracking-widest">{selectedCountry.transit} AVG</span>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-textMuted uppercase tracking-widest">Mandatory Documentation</p>
                  <div className="flex flex-wrap gap-2">
                     {selectedCountry.docs.map(doc => (
                       <span key={doc} className="text-[9px] bg-surface border border-border px-3 py-1 rounded text-white uppercase font-bold tracking-widest">
                         {doc}
                       </span>
                     ))}
                  </div>
                </div>
             </div>
             <div className="space-y-6">
                {AI_INSIGHTS.map((insight, i) => (
                  <div key={i} className="bg-surface border border-border p-6 rounded-2xl">
                    <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-2">{insight.title}</h5>
                    <p className="text-[10px] text-textSecondary uppercase font-mono">{insight.content}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketIntelligence;
