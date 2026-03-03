
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCT_CATALOG } from '../constants';

interface CommodityDetailsProps {
  item: any | null;
  onBack: () => void;
  onBuyNow: (item: any) => void;
  onAddToCart: (item: any) => void;
}

const CommodityDetails: React.FC<CommodityDetailsProps> = ({ item, onBack, onBuyNow, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'regions' | 'logistics' | 'history'>('overview');

  if (!item) return null;

  const product = PRODUCT_CATALOG.find(p => p.id === item.id) || item;
  const relatedProducts = PRODUCT_CATALOG.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const currentMonth = new Date().toLocaleString('en', { month: 'short' });
  const currentSeasonStatus = product.seasonality?.find((s: any) => s.month === currentMonth)?.status || 'N/A';

  return (
    <div className="min-h-screen bg-background text-text-primary pb-20 lg:pb-8">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-3 flex items-center gap-2 text-[10px] text-text-muted">
        <button onClick={onBack} className="hover:text-primary transition-colors">← Back</button>
        <span>/</span>
        <span className="text-text-secondary truncate">{product.crop}</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-3 md:px-6">
        {/* Mobile: Stack / Desktop: Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          
          {/* Image */}
          <div className="lg:col-span-7">
            <div className="bg-surface rounded-xl overflow-hidden border border-border aspect-[4/3] md:aspect-[16/10]">
              <img 
                src={product.image} 
                alt={product.crop}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop'; }}
              />
            </div>
            
            {/* Quick Info */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[
                { label: 'Origin', value: product.origin },
                { label: 'Grade', value: `Grade ${product.grade}`, highlight: true },
                { label: 'Harvest', value: product.harvestSeason || 'N/A' },
                { label: 'Now', value: currentSeasonStatus },
              ].map((info, i) => (
                <div key={i} className="bg-surface border border-border p-2 md:p-3 rounded-lg">
                  <p className="text-[7px] md:text-[8px] text-text-muted font-bold uppercase mb-0.5">{info.label}</p>
                  <p className={`text-[9px] md:text-[10px] font-bold ${info.highlight ? 'text-primary' : ''} truncate`}>{info.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Buy Card */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-surface border border-border p-4 md:p-6 rounded-xl">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">{product.category}</span>
              <h1 className="text-lg md:text-2xl font-black mt-1 mb-2 leading-tight">{product.crop}</h1>
              
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl md:text-3xl font-black text-primary">${product.price.toLocaleString()}</span>
                <span className="text-[10px] text-text-muted font-semibold">{product.priceUnit}</span>
              </div>

              <div className="space-y-2 text-[10px] md:text-xs border-t border-border pt-3 mb-4">
                {[
                  ['Stock', product.volume],
                  ['Min. Order', product.logistics?.minOrder || 'Inquire'],
                  ['Period', product.stockPeriod],
                  ['Supplier', product.supplier],
                ].map(([label, val], i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-text-muted">{label}</span>
                    <span className="font-bold">{val}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => onBuyNow(product)}
                  className="w-full py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary-hover transition-all text-xs"
                >
                  Buy Now — ${product.price.toLocaleString()}/{product.priceUnit?.split('/')[1]}
                </button>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full py-2.5 border border-border text-text-secondary font-bold rounded-lg hover:bg-surface-hover transition-all text-[10px]"
                >
                  Request Quotation
                </button>
              </div>
            </div>

            {/* Certifications */}
            {product.certifications && (
              <div className="bg-surface border border-border p-3 md:p-4 rounded-xl">
                <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-2">Certifications</h4>
                <div className="space-y-1">
                  {product.certifications.map((cert: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <span className="text-primary text-[8px]">✓</span>
                      <span className="text-text-secondary">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logistics */}
            {product.logistics && (
              <div className="bg-surface border border-border p-3 md:p-4 rounded-xl">
                <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-2">Logistics</h4>
                <div className="space-y-1.5 text-[10px]">
                  {[
                    ['Port', product.logistics.portOfExport],
                    ['→ Dubai', product.logistics.transitToDubai],
                    ['→ Europe', product.logistics.transitToEurope],
                    ['→ China', product.logistics.transitToChina],
                    ['Container', product.logistics.containerType],
                  ].map(([label, val], i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-text-muted">{label}</span>
                      <span className="font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 md:mt-12">
          <div className="flex gap-0 border-b border-border mb-6 overflow-x-auto scrollbar-hide">
            {(['overview', 'regions', 'logistics', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 md:px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 flex-shrink-0 ${
                  activeTab === tab 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-text-muted'
                }`}
              >
                {tab === 'overview' ? 'About' : tab === 'regions' ? 'Regions' : tab === 'logistics' ? 'Export' : 'Prices'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm md:text-base font-bold mb-3">About</h3>
                    <p className="text-xs text-text-secondary leading-relaxed mb-4">{product.description}</p>
                    <div className="bg-surface border border-border p-4 rounded-xl">
                      <div className="grid grid-cols-2 gap-3 text-[10px]">
                        {[
                          ['Category', product.category],
                          ['Grade', `Grade ${product.grade}`],
                          ['Region', product.region],
                          ['Volume', product.volume],
                        ].map(([label, val], i) => (
                          <div key={i}>
                            <span className="text-text-muted block mb-0.5">{label}</span>
                            <span className="font-semibold">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {product.seasonality && (
                    <div>
                      <h3 className="text-sm md:text-base font-bold mb-3">Harvest Calendar</h3>
                      <div className="grid grid-cols-4 md:grid-cols-4 gap-1.5">
                        {product.seasonality.map((s: any) => (
                          <div key={s.month} className={`p-2 rounded-lg border text-center ${
                            s.status.includes('Harvest') || s.status.includes('Peak') 
                              ? 'border-primary/30 bg-primary/5' 
                              : s.status.includes('Export') || s.status.includes('Available')
                                ? 'border-info/20 bg-info/5'
                                : 'border-border bg-surface'
                          }`}>
                            <span className="text-[9px] font-bold text-text-muted block">{s.month}</span>
                            <span className={`text-[7px] md:text-[8px] font-bold uppercase ${
                              s.status.includes('Harvest') || s.status.includes('Peak') ? 'text-primary' : 
                              s.status.includes('Export') || s.status.includes('Available') ? 'text-info' : 'text-text-muted'
                            }`}>
                              {s.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'regions' && product.growingRegions && (
                <div className="space-y-6">
                  <div className="bg-surface border border-border p-4 rounded-xl">
                    <div className="h-[200px] md:h-[250px] w-full" style={{ minWidth: 0, minHeight: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={product.growingRegions}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                          <XAxis dataKey="name" stroke="#555" fontSize={9} />
                          <YAxis stroke="#555" fontSize={9} tickFormatter={(v: number) => `$${v}`} />
                          <Tooltip contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '10px' }} />
                          <Bar dataKey="price" fill="#00ff88" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {product.growingRegions.map((r: any) => (
                      <div key={r.name} className="bg-surface border border-border p-4 rounded-xl">
                        <h4 className="text-sm font-bold mb-2">{r.name}</h4>
                        <div className="space-y-1.5 text-[10px]">
                          {[['Price', `$${typeof r.price === 'string' ? r.price.replace('$', '') : r.price}`], ['Volume', r.volume], ['Quality', r.quality], ['Elevation', r.elevation]].map(([l, v], i) => (
                            <div key={i} className="flex justify-between">
                              <span className="text-text-muted">{l}</span>
                              <span className="font-bold">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'logistics' && product.logistics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-surface border border-border p-4 rounded-xl space-y-3 text-xs">
                    <h3 className="text-sm font-bold mb-2">Export & Shipping</h3>
                    {[
                      ['Port of Export', product.logistics.portOfExport],
                      ['Transit to Dubai', product.logistics.transitToDubai],
                      ['Transit to Europe', product.logistics.transitToEurope],
                      ['Transit to China', product.logistics.transitToChina],
                      ['Container', product.logistics.containerType],
                    ].map(([label, val], i) => (
                      <div key={i} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
                        <span className="text-text-muted">{label}</span>
                        <span className="font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                  
                  {product.certifications && (
                    <div>
                      <h3 className="text-sm font-bold mb-3">Documentation</h3>
                      <div className="space-y-2">
                        {product.certifications.map((cert: string, i: number) => (
                          <div key={i} className="bg-surface border border-border p-3 rounded-lg flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary text-[9px] font-bold flex-shrink-0">
                              {i + 1}
                            </div>
                            <span className="text-xs">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && product.priceHistory && (
                <div className="space-y-4">
                  <div className="bg-surface border border-border p-4 md:p-6 rounded-xl">
                    <div className="h-[220px] md:h-[280px] w-full" style={{ minWidth: 0, minHeight: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={product.priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                          <XAxis dataKey="month" stroke="#555" fontSize={9} />
                          <YAxis stroke="#555" fontSize={9} tickFormatter={(v: number) => `$${v}`} />
                          <Tooltip contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '10px' }} />
                          <Line type="monotone" dataKey="price" stroke="#00ff88" strokeWidth={2} dot={{ fill: '#00ff88', r: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { label: '12M High', value: `$${Math.max(...product.priceHistory.map((h: any) => h.price)).toFixed(2)}` },
                      { label: '12M Low', value: `$${Math.min(...product.priceHistory.map((h: any) => h.price)).toFixed(2)}` },
                      { label: 'Avg', value: `$${(product.priceHistory.reduce((sum: number, h: any) => sum + h.price, 0) / product.priceHistory.length).toFixed(2)}` },
                      { label: 'Current', value: `$${product.price.toLocaleString()}` },
                    ].map((stat, i) => (
                      <div key={i} className="bg-surface border border-border p-3 rounded-lg">
                        <p className="text-[8px] text-text-muted font-bold uppercase mb-0.5">{stat.label}</p>
                        <p className="text-sm font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 border-t border-border pt-6">
            <h3 className="text-sm font-bold mb-4">Related Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {relatedProducts.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => onBuyNow(p)} 
                  className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt={p.crop} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop'; }}
                    />
                  </div>
                  <div className="p-2 md:p-3">
                    <p className="text-[10px] md:text-xs font-bold truncate">{p.crop}</p>
                    <p className="text-[10px] font-bold text-primary mt-0.5">${p.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommodityDetails;
