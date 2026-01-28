
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { COMMODITIES, TRADE_NEWS, AI_INSIGHTS, EXPORT_GUIDELINES, SUPPLY_SIGNALS } from '../constants';
import { TradeNews } from '../types';

const NewsCard: React.FC<{ news: TradeNews, onClick: () => void }> = ({ news, onClick }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-surface border border-border rounded-2xl overflow-hidden cursor-pointer group flex flex-col h-full"
  >
    <div className="h-40 overflow-hidden relative">
      <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-4 left-4">
        <span className={`text-[8px] font-black px-2 py-1 rounded tracking-[0.2em] uppercase ${
          news.category === 'POLICY' ? 'bg-info text-white' :
          news.category === 'WEATHER' ? 'bg-warning text-black' :
          'bg-primary text-black'
        }`}>
          #{news.category}
        </span>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <p className="text-[9px] font-mono text-textMuted uppercase mb-3">{news.date} // {news.author}</p>
      <h4 className="text-lg font-black text-white uppercase tracking-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
        {news.title}
      </h4>
      <p className="text-xs text-textSecondary uppercase font-mono leading-relaxed line-clamp-3 mb-6 flex-1">
        {news.summary}
      </p>
      <div className="flex justify-between items-center pt-4 border-t border-border/50">
        <span className="text-[9px] font-black text-textMuted uppercase tracking-widest">{news.readTime} READ</span>
        <span className="text-primary text-[10px] font-black tracking-widest uppercase group-hover:translate-x-1 transition-transform">
          Full Intel →
        </span>
      </div>
    </div>
  </motion.div>
);

const MarketIntelligence: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState(COMMODITIES[0]);
  const [selectedNews, setSelectedNews] = useState<TradeNews | null>(null);
  const [forecastDays, setForecastDays] = useState(30);
  const [showArchive, setShowArchive] = useState(false);

  // Dynamic forecast logic
  const getForecastData = (basePrice: number, days: number) => {
    const data = [];
    for (let i = -15; i <= days; i += 5) {
      data.push({
        day: i,
        price: i <= 0 ? basePrice * (0.95 + Math.random() * 0.1) : basePrice * (1 + (Math.random() * 0.15 * (i / days))),
        type: i <= 0 ? 'actual' : 'forecast'
      });
    }
    return data;
  };

  const forecastData = getForecastData(selectedCrop.price, forecastDays);

  return (
    <section className="py-12 md:py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
      
      {/* 1. Intelligence Command (Header) */}
      <div className="mb-16 border-b border-border pb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
             <span className="text-primary text-xs font-black tracking-[0.4em] uppercase font-mono">Satellite Uplink: Active</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase glow-text">Intelligence Command</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full lg:w-auto">
          {[
            { label: 'Global Volatility', value: '4.2%', status: 'STABLE', color: 'text-primary' },
            { label: 'Supply Momentum', value: 'HIGH', status: '▲ 12%', color: 'text-primary' },
            { label: 'AI Sourcing Signal', value: 'BULLISH', status: 'ACTIVE', color: 'text-info' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface border border-border p-5 rounded-2xl min-w-[180px]">
              <p className="text-[9px] font-black text-textMuted uppercase mb-2 tracking-widest">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-white">{stat.value}</span>
                <span className={`text-[10px] font-bold mb-1 uppercase ${stat.color}`}>{stat.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. The Wire (Blog Grid) */}
      <div className="mb-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6 flex-1">
             <h3 className="text-2xl font-black uppercase tracking-tight">The Wire // Technical Reports</h3>
             <div className="h-px bg-border flex-1 border-dashed border-t"></div>
          </div>
          <button 
            onClick={() => setShowArchive(!showArchive)}
            className="ml-6 px-6 py-2 border border-border rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-primary hover:border-primary transition-all"
          >
            {showArchive ? 'Close Archive' : 'Access Archive'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRADE_NEWS.map(news => (
            <NewsCard key={news.id} news={news} onClick={() => setSelectedNews(news)} />
          ))}
          {showArchive && TRADE_NEWS.map(news => (
            <NewsCard key={`${news.id}-arch`} news={news} onClick={() => setSelectedNews(news)} />
          ))}
        </div>
      </div>

      {/* 3. The Projection Desk & Supply Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        {/* Price Analytics */}
        <div className="lg:col-span-8 bg-surface border border-border p-8 rounded-3xl relative">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
            <div>
              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
                {COMMODITIES.slice(0, 4).map(c => (
                  <button 
                    key={c.ticker}
                    onClick={() => setSelectedCrop(c)}
                    className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                      selectedCrop.ticker === c.ticker ? 'bg-primary text-black border-primary' : 'bg-background text-textMuted border-border hover:border-white'
                    }`}
                  >
                    {c.ticker}
                  </button>
                ))}
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight">{selectedCrop.name} Analytics</h3>
              <p className="text-[10px] text-textMuted font-mono uppercase mt-1">Global Index Tracking // Accuracy: 96.4%</p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex gap-2 mb-4 bg-background p-1.5 rounded-xl border border-border">
                {[30, 60, 90].map(d => (
                  <button 
                    key={d}
                    onClick={() => setForecastDays(d)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                      forecastDays === d ? 'bg-surface text-primary shadow-lg shadow-black' : 'text-textMuted hover:text-white'
                    }`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
              <p className="text-4xl font-black text-white tracking-tighter">${selectedCrop.price.toLocaleString()}</p>
              <p className={`text-[10px] font-black uppercase ${selectedCrop.change >= 0 ? 'text-primary' : 'text-danger'}`}>
                {selectedCrop.change >= 0 ? '▲' : '▼'} {Math.abs(selectedCrop.change)}% WEEKLY
              </p>
            </div>
          </div>

          <div className="h-[400px] w-full">
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
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#00ff88' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00ff88" 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  strokeWidth={4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Signals */}
        <div className="lg:col-span-4 space-y-8">
           <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-4">Supply/Demand Matrix</h3>
           <div className="space-y-4">
              {SUPPLY_SIGNALS.map((signal, i) => (
                <div key={i} className="bg-surface border border-border p-6 rounded-2xl group hover:border-primary/40 transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-1">{signal.region}</p>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">{signal.crop}</h4>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-1 rounded tracking-widest ${
                        signal.signal === 'BULLISH' ? 'bg-primary/10 text-primary' : 
                        signal.signal === 'BEARISH' ? 'bg-danger/10 text-danger' : 
                        'bg-info/10 text-info'
                      }`}>
                        {signal.signal}
                      </span>
                   </div>
                   <div className="flex justify-between items-end border-t border-border/50 pt-4">
                      <span className="text-[9px] text-textMuted uppercase font-bold tracking-widest">REGIONAL STATUS</span>
                      <span className="text-white text-xs font-black uppercase font-mono">{signal.status}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 4. Export Guide */}
      <div className="bg-surface border border-border p-12 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 -mr-48 -mt-48 rounded-full blur-[100px]"></div>
        <div className="flex flex-col lg:flex-row gap-16 relative z-10">
          <div className="lg:w-1/3">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">Global Export Guide</h3>
            <p className="text-sm text-textSecondary uppercase font-mono leading-relaxed mb-8">
              Real-time documentation requirements and transit logistics by destination country. Use this to optimize your export protocol.
            </p>
            <div className="space-y-4">
               {AI_INSIGHTS.slice(0, 2).map((insight, i) => (
                 <div key={i} className="flex gap-4 p-4 bg-background border border-border rounded-xl">
                    <span className="text-xl">{insight.icon}</span>
                    <p className="text-[10px] text-white font-mono uppercase leading-tight">{insight.content}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
             {EXPORT_GUIDELINES.map((guide, i) => (
               <div key={i} className="bg-background border border-border p-8 rounded-3xl hover:border-info/40 transition-all">
                  <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{guide.country}</h4>
                    <span className="text-[9px] font-black text-info uppercase tracking-widest">{guide.transit} AVG</span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-3">Mandatory Protocol</p>
                    <div className="flex flex-wrap gap-2">
                       {guide.docs.map(doc => (
                         <span key={doc} className="text-[9px] bg-surface border border-border px-3 py-1 rounded text-textSecondary uppercase font-bold tracking-widest">
                           {doc}
                         </span>
                       ))}
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[1000px] bg-surface border-2 border-border rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="h-64 sm:h-96 relative">
                <img src={selectedNews.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-8 right-8 w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                >
                  ✕
                </button>
              </div>
              <div className="p-8 sm:p-16 -mt-12 relative z-10 bg-surface rounded-t-[40px]">
                 <div className="flex items-center gap-6 mb-8 text-[10px] font-mono font-black uppercase text-textMuted tracking-widest">
                   <span className="text-primary">{selectedNews.category}</span>
                   <span>{selectedNews.date}</span>
                   <span>BY {selectedNews.author}</span>
                   <span>{selectedNews.readTime} READ</span>
                 </div>
                 <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-10 leading-none">
                    {selectedNews.title}
                 </h2>
                 <div className="prose prose-invert max-w-none text-textSecondary font-mono text-sm sm:text-base leading-relaxed uppercase">
                    <p className="mb-6">{selectedNews.content}</p>
                    <p className="border-t border-border pt-6 text-[11px] text-textMuted">
                       SYSTEM_NOTE: This report is dynamically synthesized from regional satellite data and verified ministry policy alerts.
                    </p>
                 </div>
                 <div className="mt-12 flex justify-end">
                    <button 
                      onClick={() => setSelectedNews(null)}
                      className="px-10 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl tracking-widest hover:scale-105 transition-transform"
                    >
                      Acknowledge Report
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MarketIntelligence;
