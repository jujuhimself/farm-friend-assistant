
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    <div className="min-h-screen bg-background text-white pb-20 lg:pb-8">
      
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-6 md:py-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-1">Commodity Intel</h1>
          <p className="text-text-muted font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em]">Crop DNA & Export Analytics</p>
        </div>
      </section>

      {/* Supply Signals */}
      <section className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-3 md:py-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Supply Signals</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-3 px-3 md:mx-0 md:px-0">
            {SUPPLY_SIGNALS.map((s, i) => (
              <div key={i} className="flex-shrink-0 bg-surface border border-border rounded-lg px-3 py-2 min-w-[160px] md:min-w-[190px]">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] font-black text-white uppercase">{s.crop}</span>
                  <span className={`text-[8px] font-black uppercase px-1 py-0.5 rounded ${s.signal === 'BULLISH' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                    {s.signal}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-text-muted font-mono uppercase">{s.region}</span>
                  <span className="text-[8px] text-text-secondary font-mono uppercase">{s.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-6 md:py-10">
        <AnimatePresence mode="wait">
          {!selectedCrop ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              
              {/* Crop Grid */}
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <h2 className="text-sm md:text-lg font-black uppercase tracking-tight whitespace-nowrap">Deep Dive</h2>
                <div className="h-px bg-border flex-1" />
                <span className="text-[9px] text-text-muted font-mono uppercase">{cropKeys.length} INDEXED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
                {cropKeys.map((k) => {
                  const crop = CROP_INTEL_EXTENDED[k];
                  return (
                    <motion.div
                      key={k}
                      whileHover={{ y: -3 }}
                      onClick={() => setSelectedCropKey(k)}
                      className="bg-surface border border-border rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-4xl md:text-5xl font-black group-hover:opacity-[0.06] transition-opacity uppercase">{crop.ticker}</div>
                      
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${crop.sentiment === 'BULLISH' ? 'bg-primary/10 text-primary' : crop.sentiment === 'BEARISH' ? 'bg-danger/10 text-danger' : 'bg-surface text-text-muted'}`}>
                          {crop.sentiment}
                        </span>
                        <span className={`text-[10px] font-bold ${crop.change.startsWith('+') ? 'text-primary' : 'text-danger'}`}>
                          {crop.change}
                        </span>
                      </div>

                      <h3 className="text-base md:text-lg font-black mb-1 uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{crop.name}</h3>
                      <p className="text-[9px] text-text-secondary line-clamp-2 mb-4 leading-relaxed">{crop.description}</p>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[8px] text-text-muted font-black uppercase mb-0.5">Price</p>
                          <p className="text-lg font-black text-white">{crop.lastSale}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] text-text-muted font-black uppercase mb-0.5">Cap</p>
                          <p className="text-[10px] font-bold text-text-secondary">{crop.marketCap}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Export Corridors */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm md:text-lg font-black uppercase tracking-tight whitespace-nowrap">Export Corridors</h2>
                <div className="h-px bg-border flex-1" />
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-8">
                {EXPORT_GUIDELINES.map(g => (
                  <div key={g.country} className="bg-surface border border-border rounded-lg p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs md:text-sm font-black uppercase">{g.country}</h4>
                      <span className="text-[8px] font-mono text-primary font-bold">{g.transit}</span>
                    </div>
                    <div className="space-y-1">
                      {g.docs.map((d, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[8px] md:text-[9px] text-text-secondary">
                          <span className="text-primary text-[6px]">●</span>
                          <span className="truncate">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Index Snapshot */}
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm md:text-lg font-black uppercase tracking-tight whitespace-nowrap">Index Snapshot</h2>
                <div className="h-px bg-border flex-1" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {COMMODITIES.map(c => (
                  <div key={c.ticker} className="bg-surface border border-border rounded-lg p-2 md:p-3 text-center">
                    <p className="text-[9px] font-mono text-text-muted mb-0.5">{c.ticker}</p>
                    <p className="text-xs font-black">${c.price.toLocaleString()}</p>
                    <p className={`text-[9px] font-bold ${c.change >= 0 ? 'text-primary' : 'text-danger'}`}>
                      {c.change >= 0 ? '+' : ''}{c.change}%
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="detail" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              
              <button onClick={() => setSelectedCropKey(null)} className="text-[9px] text-text-muted hover:text-white uppercase font-black flex items-center gap-1 mb-4 tracking-widest">
                ← Back
              </button>

              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none glow-text">{selectedCrop.name}</h2>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${selectedCrop.sentiment === 'BULLISH' ? 'border-primary/30 text-primary' : selectedCrop.sentiment === 'BEARISH' ? 'border-danger/30 text-danger' : 'border-border text-text-muted'}`}>
                      {selectedCrop.sentiment}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-secondary max-w-md">{selectedCrop.description}</p>
                </div>
                
                <div className="flex gap-6 font-mono">
                  <div>
                    <p className="text-[8px] text-text-muted font-black uppercase mb-0.5">Last</p>
                    <p className="text-xl font-black">{selectedCrop.lastSale}</p>
                    <p className={`text-[9px] font-bold ${selectedCrop.change.startsWith('+') ? 'text-primary' : 'text-danger'}`}>{selectedCrop.change}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-text-muted font-black uppercase mb-0.5">Cap</p>
                    <p className="text-xl font-black">{selectedCrop.marketCap}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* Chart */}
                  <div className="bg-surface border border-border p-4 md:p-6 rounded-xl">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-4">12-Month Performance</h4>
                    <div style={{ width: '100%', height: 240, minWidth: 0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockChartData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                          <XAxis dataKey="name" stroke="#444" fontSize={9} axisLine={false} tickLine={false} />
                          <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                          <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '10px' }} />
                          <Area type="monotone" dataKey="price" stroke="#00ff88" strokeWidth={2} fill="url(#colorPrice)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Regions & Calendar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-surface border border-border p-4 rounded-xl">
                      <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-3">Regional Depth</h4>
                      <div className="space-y-3">
                        {selectedCrop.regions.map((r: any) => (
                          <div key={r.name} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0">
                            <div>
                              <p className="text-xs font-black uppercase">{r.name}</p>
                              <p className="text-[8px] text-text-muted font-mono">{r.volume} · {r.elevation}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-black">{r.price}</p>
                              <p className="text-[8px] text-primary font-bold uppercase">{r.quality}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-surface border border-border p-4 rounded-xl">
                      <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-3">Harvest Window</h4>
                      <div className="grid grid-cols-3 gap-1.5">
                        {selectedCrop.seasonality.map((s: any) => (
                          <div key={s.month} className={`p-2 rounded-lg border text-center ${
                            s.status.includes('Harvest') || s.status.includes('Peak') 
                              ? 'border-primary/30 bg-primary/5' 
                              : s.status.includes('Export') 
                                ? 'border-info/20 bg-info/5'
                                : 'border-border bg-background'
                          }`}>
                            <span className="text-[9px] font-black text-text-muted block">{s.month}</span>
                            <span className={`text-[7px] font-black uppercase ${
                              s.status.includes('Harvest') || s.status.includes('Peak') ? 'text-primary' : 
                              s.status.includes('Export') ? 'text-info' : 'text-text-muted'
                            }`}>
                              {s.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-surface border border-border p-4 rounded-xl">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted mb-3">Export Corridors</h4>
                    <div className="space-y-3">
                      {selectedCrop.logistics && Object.entries(selectedCrop.logistics).map(([dest, data]: [string, any]) => (
                        <div key={dest} className="bg-background border border-border rounded-lg p-3">
                          <p className="text-[10px] font-black uppercase mb-2">{dest}</p>
                          <div className="space-y-1.5 text-[9px]">
                            {[['Transit', data.transit], ['Demand', data.demand], ['Risk', data.risk]].map(([label, val]: any, i) => (
                              <div key={i} className="flex justify-between">
                                <span className="text-text-muted">{label}</span>
                                <span className={`font-bold ${
                                  label === 'Demand' && (val === 'EXTREME' || val === 'HIGH') ? 'text-primary' :
                                  label === 'Risk' && val === 'LOW' ? 'text-primary' :
                                  label === 'Risk' ? 'text-warning' : 'text-text-secondary'
                                }`}>{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                    <h4 className="text-[9px] font-black text-primary uppercase tracking-widest mb-3">Quick Facts</h4>
                    <div className="space-y-2 text-[10px]">
                      {[
                        ['Regions', selectedCrop.regions.length.toString()],
                        ['Peak', selectedCrop.seasonality.filter((s: any) => s.status.includes('Harvest') || s.status.includes('Peak')).map((s: any) => s.month).join(', ') || 'N/A'],
                        ['Ticker', selectedCrop.ticker],
                      ].map(([label, val], i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-text-muted">{label}</span>
                          <span className="font-bold text-white">{val}</span>
                        </div>
                      ))}
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
