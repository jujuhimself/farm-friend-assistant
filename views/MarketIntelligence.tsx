
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CROP_INTEL_EXTENDED, SUPPLY_SIGNALS, EXPORT_GUIDELINES, COMMODITIES } from '../constants';

const MarketIntelligence: React.FC = () => {
  const [selectedCropKey, setSelectedCropKey] = useState<string | null>(null);

  const selectedCrop = useMemo(() => {
    return selectedCropKey ? CROP_INTEL_EXTENDED[selectedCropKey] : null;
  }, [selectedCropKey]);

  const cropKeys = Object.keys(CROP_INTEL_EXTENDED);

  const mockChartData = useMemo(() => {
    const base = selectedCrop ? parseFloat(selectedCrop.lastSale.replace(/[^0-9.]/g, '')) : 100;
    return Array.from({ length: 12 }, (_, i) => ({
      name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      price: +(base * (0.85 + Math.random() * 0.3)).toFixed(2)
    }));
  }, [selectedCrop]);

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-14">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-2">Commodity Intel</h1>
          <p className="text-textMuted font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]">Tanzanian Crop DNA & Export Analytics</p>
        </div>
      </section>

      {/* Supply Signals Ribbon */}
      <section className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">Live Supply Signals</span>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 md:mx-0 md:px-0">
            {SUPPLY_SIGNALS.map((s, i) => (
              <div key={i} className="flex-shrink-0 bg-surface border border-border rounded-xl px-4 py-3 min-w-[200px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-white uppercase">{s.crop}</span>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${s.signal === 'BULLISH' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                    {s.signal}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-textMuted font-mono uppercase">{s.region}</span>
                  <span className="text-[9px] text-textSecondary font-mono uppercase">{s.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {!selectedCrop ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              
              {/* Crop Discovery Grid */}
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight whitespace-nowrap">Deep Dive</h2>
                <div className="h-px bg-border flex-1"></div>
                <span className="text-[10px] text-textMuted font-mono uppercase">{cropKeys.length} CROPS INDEXED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                {cropKeys.map((k) => {
                  const crop = CROP_INTEL_EXTENDED[k];
                  return (
                    <motion.div
                      key={k}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedCropKey(k)}
                      className="bg-surface border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-6xl md:text-7xl font-black group-hover:opacity-[0.08] transition-opacity uppercase">{crop.ticker}</div>
                      
                      <div className="flex items-start justify-between mb-4">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${crop.sentiment === 'BULLISH' ? 'bg-primary/10 text-primary' : crop.sentiment === 'BEARISH' ? 'bg-danger/10 text-danger' : 'bg-white/5 text-textMuted'}`}>
                          {crop.sentiment}
                        </span>
                        <span className={`text-xs font-bold ${crop.change.startsWith('+') ? 'text-primary' : 'text-danger'}`}>
                          {crop.change}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black mb-2 uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{crop.name}</h3>
                      <p className="text-[10px] text-textSecondary line-clamp-2 mb-6 leading-relaxed">{crop.description}</p>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] text-textMuted font-black uppercase mb-1">Index Price</p>
                          <p className="text-xl font-black text-white">{crop.lastSale}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-textMuted font-black uppercase mb-1">Market Cap</p>
                          <p className="text-xs font-bold text-textSecondary">{crop.marketCap}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Export Corridors Quick View */}
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight whitespace-nowrap">Export Corridors</h2>
                <div className="h-px bg-border flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {EXPORT_GUIDELINES.map(g => (
                  <div key={g.country} className="bg-surface border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-black uppercase">{g.country}</h4>
                      <span className="text-[10px] font-mono text-primary font-bold">{g.transit}</span>
                    </div>
                    <div className="space-y-2">
                      {g.docs.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] text-textSecondary">
                          <span className="text-primary text-[8px]">●</span>
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Commodity Ticker Summary */}
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-tight whitespace-nowrap">Index Snapshot</h2>
                  <div className="h-px bg-border flex-1"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                  {COMMODITIES.map(c => (
                    <div key={c.ticker} className="bg-surface border border-border rounded-xl p-3 md:p-4 text-center hover:border-primary/30 transition-all">
                      <p className="text-[10px] font-mono text-textMuted mb-1">{c.ticker}</p>
                      <p className="text-sm font-black">${c.price.toLocaleString()}</p>
                      <p className={`text-[10px] font-bold ${c.change >= 0 ? 'text-primary' : 'text-danger'}`}>
                        {c.change >= 0 ? '+' : ''}{c.change}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              
              {/* Back + Header */}
              <button onClick={() => setSelectedCropKey(null)} className="text-[10px] text-textMuted hover:text-white uppercase font-black flex items-center gap-2 mb-6 tracking-widest">
                ← Back to Intel Matrix
              </button>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none glow-text">{selectedCrop.name}</h2>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${selectedCrop.sentiment === 'BULLISH' ? 'border-primary/30 text-primary' : selectedCrop.sentiment === 'BEARISH' ? 'border-danger/30 text-danger' : 'border-border text-textMuted'}`}>
                      {selectedCrop.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-textSecondary max-w-xl">{selectedCrop.description}</p>
                </div>
                
                <div className="flex gap-8 font-mono">
                  <div className="text-right">
                    <p className="text-[9px] text-textMuted font-black uppercase mb-1">Last</p>
                    <p className="text-2xl font-black">{selectedCrop.lastSale}</p>
                    <p className={`text-[10px] font-bold ${selectedCrop.change.startsWith('+') ? 'text-primary' : 'text-danger'}`}>{selectedCrop.change}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-textMuted font-black uppercase mb-1">Market Cap</p>
                    <p className="text-2xl font-black">{selectedCrop.marketCap}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                {/* Left: Charts & Regions */}
                <div className="lg:col-span-8 space-y-6 md:space-y-8">
                  
                  {/* Price Chart */}
                  <div className="bg-surface border border-border p-5 md:p-8 rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-textMuted mb-6">12-Month Export Performance</h4>
                    <div className="h-[250px] md:h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockChartData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                          <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                          <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #1a1a1a', borderRadius: '12px', fontSize: '11px' }} />
                          <Area type="monotone" dataKey="price" stroke="#00ff88" strokeWidth={3} fill="url(#colorPrice)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Regional Depth */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-surface border border-border p-5 md:p-6 rounded-2xl">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-textMuted mb-5">Regional Depth</h4>
                      <div className="space-y-4">
                        {selectedCrop.regions.map((r: any) => (
                          <div key={r.name} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0">
                            <div>
                              <p className="text-sm font-black uppercase">{r.name}</p>
                              <p className="text-[9px] text-textMuted font-mono">{r.volume} · {r.elevation}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black">{r.price}</p>
                              <p className="text-[9px] text-primary font-bold uppercase">{r.quality}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Harvest Calendar */}
                    <div className="bg-surface border border-border p-5 md:p-6 rounded-2xl">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-textMuted mb-5">Harvest Window</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedCrop.seasonality.map((s: any) => (
                          <div key={s.month} className={`p-2.5 rounded-lg border text-center ${
                            s.status.includes('Harvest') || s.status.includes('Peak') 
                              ? 'border-primary/30 bg-primary/5' 
                              : s.status.includes('Export') 
                                ? 'border-info/20 bg-info/5'
                                : 'border-border bg-background'
                          }`}>
                            <span className="text-[10px] font-black text-textMuted block">{s.month}</span>
                            <span className={`text-[8px] font-black uppercase ${
                              s.status.includes('Harvest') || s.status.includes('Peak') ? 'text-primary' : 
                              s.status.includes('Export') ? 'text-info' : 'text-textMuted'
                            }`}>
                              {s.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Export Matrix */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-surface border border-border p-5 md:p-6 rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-textMuted mb-5">Export Corridors</h4>
                    <div className="space-y-4">
                      {selectedCrop.logistics && Object.entries(selectedCrop.logistics).map(([dest, data]: [string, any]) => (
                        <div key={dest} className="bg-background border border-border rounded-xl p-4">
                          <p className="text-xs font-black uppercase mb-3">{dest}</p>
                          <div className="space-y-2 text-[10px]">
                            <div className="flex justify-between">
                              <span className="text-textMuted">Transit</span>
                              <span className="font-bold">{data.transit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-textMuted">Demand</span>
                              <span className={`font-bold ${data.demand === 'EXTREME' || data.demand === 'HIGH' ? 'text-primary' : 'text-textSecondary'}`}>{data.demand}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-textMuted">Risk</span>
                              <span className={`font-bold ${data.risk === 'LOW' ? 'text-primary' : 'text-warning'}`}>{data.risk}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-primary/5 border border-primary/20 p-5 md:p-6 rounded-2xl">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Quick Facts</h4>
                    <div className="space-y-3 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-textMuted">Regions Active</span>
                        <span className="font-bold text-white">{selectedCrop.regions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-textMuted">Peak Months</span>
                        <span className="font-bold text-white">
                          {selectedCrop.seasonality.filter((s: any) => s.status.includes('Harvest') || s.status.includes('Peak')).map((s: any) => s.month).join(', ') || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-textMuted">Ticker</span>
                        <span className="font-bold text-primary font-mono">{selectedCrop.ticker}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MarketIntelligence;
