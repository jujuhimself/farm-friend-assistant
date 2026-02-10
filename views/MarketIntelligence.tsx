
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LISTINGS, CROP_INTEL_EXTENDED, EXPORT_GUIDELINES } from '../constants';

const MarketIntelligence: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropKey, setSelectedCropKey] = useState<string | null>(null);
  const [activeChartRange, setActiveChartRange] = useState('1Y');

  const selectedCrop = useMemo(() => {
    return selectedCropKey ? CROP_INTEL_EXTENDED[selectedCropKey] : null;
  }, [selectedCropKey]);

  const activeListings = useMemo(() => {
    if (!selectedCropKey) return [];
    // Basic fuzzy match for listings
    return LISTINGS.filter(l => l.crop.toUpperCase().includes(selectedCropKey.toUpperCase()) || selectedCropKey.toUpperCase().includes(l.crop.toUpperCase()));
  }, [selectedCropKey]);

  const searchResults = Object.keys(CROP_INTEL_EXTENDED).filter(k => 
    k.toLowerCase().includes(searchTerm.toLowerCase()) || 
    CROP_INTEL_EXTENDED[k].name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mockChartData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      price: (selectedCrop ? parseFloat(selectedCrop.lastSale.replace(/[^0-9.]/g, '')) : 100) * (0.9 + Math.random() * 0.2)
    }));
  }, [selectedCrop]);

  return (
    <div className="min-h-screen bg-background text-white pb-32">
      {/* Search Header - Bloomberg Style */}
      <section className="pt-20 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto text-center border-b border-border">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">Commodity Intel</h1>
          <p className="text-textMuted font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] mb-12">Search Tanzanian Crop DNA & Export Analytics</p>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-textMuted text-xl">🔍</div>
            <input 
              type="text"
              placeholder="SEARCH ANY CROP (e.g. Avocado, Vanilla, Maize)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border-2 border-border rounded-2xl px-16 py-6 text-xl font-mono outline-none focus:border-primary transition-all text-white placeholder:text-textMuted shadow-2xl"
            />
            <AnimatePresence>
              {searchTerm && !selectedCropKey && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="absolute top-full left-0 right-0 mt-3 bg-surface border border-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                >
                  {searchResults.map(k => (
                    <button 
                      key={k}
                      onClick={() => { setSelectedCropKey(k); setSearchTerm(''); }}
                      className="w-full text-left px-8 py-5 hover:bg-white/5 border-b border-border last:border-0 flex justify-between items-center group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-background border border-border overflow-hidden">
                           <img src={CROP_INTEL_EXTENDED[k].image} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="font-black text-sm uppercase group-hover:text-primary transition-colors">{CROP_INTEL_EXTENDED[k].name}</span>
                      </div>
                      <span className="text-[10px] text-textMuted font-mono">CODE_{CROP_INTEL_EXTENDED[k].ticker}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      <AnimatePresence mode="wait">
        {!selectedCrop ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[1400px] mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Featured Cards for Layman discovery */}
            {['AVOCADOS', 'VANILLA', 'MAIZE'].map(k => (
              <div 
                key={k}
                onClick={() => setSelectedCropKey(k)}
                className="bg-surface border border-border rounded-[40px] p-10 hover:border-primary transition-all cursor-pointer group relative overflow-hidden h-[400px] flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-9xl font-black group-hover:opacity-[0.08] transition-opacity uppercase">{CROP_INTEL_EXTENDED[k].ticker}</div>
                <div>
                   <p className="text-[10px] font-black text-primary uppercase mb-4 tracking-[0.3em]">{CROP_INTEL_EXTENDED[k].sentiment} SENTIMENT</p>
                   <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter leading-none">{CROP_INTEL_EXTENDED[k].name}</h3>
                   <p className="text-xs text-textSecondary font-mono line-clamp-3 uppercase leading-relaxed">{CROP_INTEL_EXTENDED[k].description}</p>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] text-textMuted font-black uppercase mb-1">Index Price</p>
                      <p className="text-2xl font-black text-white">{CROP_INTEL_EXTENDED[k].lastSale}</p>
                   </div>
                   <button className="text-[10px] font-black text-white border border-border px-6 py-3 rounded-xl group-hover:bg-primary group-hover:text-black transition-all uppercase tracking-widest">Enter Node</button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-[1400px] mx-auto px-6 space-y-12 py-12"
          >
            {/* Stock Profile Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-border pb-12">
               <div className="space-y-4">
                  <button onClick={() => setSelectedCropKey(null)} className="text-[10px] text-textMuted hover:text-white uppercase font-black flex items-center gap-2 mb-4 tracking-widest">← Back to Global Matrix</button>
                  <div className="flex items-center gap-6 flex-wrap">
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none glow-text">{selectedCrop.name}</h2>
                    <span className={`px-4 py-2 rounded-xl border border-current text-[11px] font-black tracking-[0.2em] uppercase ${selectedCrop.sentiment === 'BULLISH' ? 'text-primary' : 'text-danger'}`}>
                      {selectedCrop.sentiment} SIGNAL
                    </span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 font-mono">
                  <div className="text-right">
                    <p className="text-[10px] text-textMuted font-black uppercase tracking-widest mb-1">Index Last</p>
                    <p className="text-3xl font-black text-white">{selectedCrop.lastSale}</p>
                    <p className={`text-[11px] font-bold ${selectedCrop.change.startsWith('+') ? 'text-primary' : 'text-danger'}`}>{selectedCrop.change}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-textMuted font-black uppercase tracking-widest mb-1">Est. Market Cap</p>
                    <p className="text-3xl font-black text-white">{selectedCrop.marketCap}</p>
                    <p className="text-[11px] text-textMuted font-bold">ANNUAL EXPORT</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-textMuted font-black uppercase tracking-widest mb-1">Availability</p>
                    <p className="text-3xl font-black text-primary">HIGH</p>
                    <p className="text-[11px] text-textMuted font-bold uppercase">PEAK_CYCLE</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* Left Column: Analytics & Visualization */}
               <div className="lg:col-span-8 space-y-12">
                  
                  {/* 1. Price History Chart */}
                  <div className="bg-surface border border-border p-10 rounded-[40px] relative overflow-hidden">
                     <div className="flex justify-between items-center mb-10 relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-textMuted">Historical Export Performance</h4>
                        <div className="flex gap-2 bg-background p-1.5 rounded-xl border border-border">
                          {['1M', '3M', '6M', '1Y', 'ALL'].map(t => (
                            <button 
                              key={t} 
                              onClick={() => setActiveChartRange(t)}
                              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${activeChartRange === t ? 'bg-surface text-primary border border-primary/20' : 'text-textMuted hover:text-white'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                     </div>
                     <div className="h-[350px] w-full">
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
                              <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #1a1a1a', borderRadius: '16px' }} />
                              <Area type="monotone" dataKey="price" stroke="#00ff88" strokeWidth={4} fill="url(#colorPrice)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* 2. Regional Depth Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-surface border border-border p-10 rounded-[40px]">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-textMuted mb-8">Production Depth By Region</h4>
                        <div className="space-y-6">
                           {selectedCrop.regions.map((r: any) => (
                             <div key={r.name} className="flex justify-between items-end border-b border-border/50 pb-5 last:border-0 group">
                                <div>
                                   <p className="text-base font-black text-white uppercase group-hover:text-primary transition-colors">{r.name}</p>
                                   <p className="text-[10px] font-mono text-textMuted uppercase mt-1">Available Depth: {r.volume}</p>
                                   <p className="text-[9px] text-textMuted uppercase mt-1">Elevation: {r.elevation}</p>
                                </div>
                                <div className="text-right font-mono">
                                   <p className="text-lg font-black text-white">{r.price}</p>
                                   <p className="text-[9px] font-black text-primary uppercase">{r.quality} GRADE</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     {/* 3. Harvest Calendar */}
                     <div className="bg-surface border border-border p-10 rounded-[40px]">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-textMuted mb-8">Harvest & Buying Window</h4>
                        <div className="grid grid-cols-3 gap-3">
                           {selectedCrop.seasonality.map((s: any) => (
                             <div key={s.month} className="p-4 bg-background border border-border rounded-2xl flex flex-col items-center justify-center text-center group hover:border-white transition-all">
                                <span className="text-[10px] font-black text-textMuted uppercase mb-1">{s.month}</span>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${
                                  s.status.includes('Harvest') || s.status.includes('Peak') ? 'text-primary' : 
                                  s.status.includes('Export') ? 'text-info' : 'text-textMuted opacity-50'
                                }`}>
                                  {s.status}
                                </span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* 4. Live Depth Section */}
                  <div className="bg-surface border border-border p-10 rounded-[40px]">
                     <div className="flex justify-between items-center mb-10">
                        <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white">Live Marketplace Depth</h4>
                        <span className="text-[10px] text-textMuted font-mono uppercase tracking-widest">[{activeListings.length}] Active Lots Found</span>
                     </div>
                     <div className="space-y-4">
                        {activeListings.map((l: any) => (
                          <div key={l.id} className="flex flex-col md:flex-row justify-between items-center bg-background border border-border p-6 rounded-3xl hover:border-primary/50 transition-all cursor-pointer group">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📦</div>
                                <div>
                                   <h5 className="text-sm font-black text-white uppercase tracking-tight">{l.supplier}</h5>
                                   <p className="text-[10px] text-textMuted font-mono uppercase tracking-widest">{l.origin} // Grade {l.grade}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-12 text-right mt-4 md:mt-0">
                                <div>
                                   <p className="text-[10px] text-textMuted font-black uppercase mb-1">Lot Volume</p>
                                   <p className="text-sm font-black text-white">{l.volume}</p>
                                </div>
                                <div className="border-l border-border pl-12">
                                   <p className="text-[10px] text-primary font-black uppercase mb-1">Bid Now</p>
                                   <p className="text-xl font-black text-white">${l.price}</p>
                                </div>
                                <button className="bg-primary text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Execute Order</button>
                             </div>
                          </div>
                        ))}
                        {activeListings.length === 0 && (
                          <div className="py-20 text-center opacity-30 border-2 border-dashed border-border rounded-[32px]">
                             <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Active Inventory Depth Found For This Cycle</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Right Column: Importer Intelligence Matrix */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-surface border border-border p-10 rounded-[40px] sticky top-24">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10 border-b border-border pb-6">Global Sourcing Matrix</h4>
                     
                     <div className="space-y-12">
                        {/* Importer Context Selection */}
                        <div className="space-y-4">
                           <p className="text-[10px] text-textMuted font-black uppercase tracking-widest">Destination Corridor</p>
                           <div className="grid grid-cols-2 gap-2">
                              {EXPORT_GUIDELINES.map(g => (
                                <button key={g.country} className="px-4 py-3 bg-background border border-border rounded-xl text-[10px] font-black uppercase text-textMuted hover:text-white hover:border-primary transition-all">
                                  {g.country} Node
                                </button>
                              ))}
                           </div>
                        </div>

                        {/* Logistics Matrix */}
                        <div className="space-y-6">
                           <div className="p-6 bg-background border border-border rounded-2xl">
                              <p className="text-[9px] text-textMuted font-black uppercase mb-2">Transit (To Ireland / China)</p>
                              <div className="flex justify-between items-center py-2 border-b border-border/50">
                                <span className="text-[10px] font-mono text-white">SHANGHAI HUB</span>
                                <span className="text-[10px] font-black text-primary">{selectedCrop.logistics.china.transit}</span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-[10px] font-mono text-white">ROTTERDAM / DUBLIN</span>
                                <span className="text-[10px] font-black text-primary">{selectedCrop.logistics.ireland.transit}</span>
                              </div>
                           </div>

                           <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                              <p className="text-[9px] text-primary font-black uppercase mb-2 tracking-widest">International Demand Signals</p>
                              <div className="flex justify-between items-center py-1">
                                <span className="text-[10px] font-mono text-white">CHINA HUB</span>
                                <span className="text-[10px] font-black text-primary">{selectedCrop.logistics.china.demand}</span>
                              </div>
                              <div className="flex justify-between items-center py-1">
                                <span className="text-[10px] font-mono text-white">EU REGION</span>
                                <span className="text-[10px] font-black text-primary">{selectedCrop.logistics.ireland.demand}</span>
                              </div>
                           </div>
                        </div>

                        {/* Mandatory Compliance */}
                        <div className="space-y-4">
                           <p className="text-[10px] text-textMuted font-black uppercase tracking-widest">Compliance Protocol</p>
                           <ul className="space-y-3">
                              {['SGS Pre-Shipment Audit', 'Phytosanitary Clearance', 'EUR1 / GACC Registry', 'Aflatoxin Lab Pass (Maize Only)'].map(doc => (
                                <li key={doc} className="flex items-center gap-3 text-[10px] font-mono text-textSecondary uppercase">
                                   <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> {doc}
                                </li>
                              ))}
                           </ul>
                        </div>

                        <div className="pt-8 border-t border-border">
                           <button className="w-full py-5 bg-white text-black font-black uppercase text-xs rounded-2xl hover:bg-primary transition-all shadow-xl shadow-primary/20 tracking-[0.2em]">
                             Download Sourcing Report (PDF)
                           </button>
                           <p className="text-center text-[9px] text-textMuted font-mono uppercase mt-4 italic tracking-widest">Network Status: Dar_Terminal_v4.2</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketIntelligence;
