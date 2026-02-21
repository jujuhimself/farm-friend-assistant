
import React, { useState, useMemo } from 'react';
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

  // Find full product data from catalog
  const product = PRODUCT_CATALOG.find(p => p.id === item.id) || item;
  const relatedProducts = PRODUCT_CATALOG.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const currentMonth = new Date().toLocaleString('en', { month: 'short' });
  const currentSeasonStatus = product.seasonality?.find((s: any) => s.month === currentMonth)?.status || 'N/A';

  return (
    <div className="min-h-screen bg-background text-textPrimary pb-24">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex items-center gap-2 text-[11px] text-textMuted">
        <button onClick={onBack} className="hover:text-primary transition-colors">Marketplace</button>
        <span>/</span>
        <span className="text-textSecondary">{product.category}</span>
        <span>/</span>
        <span className="text-textPrimary font-semibold">{product.crop}</span>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          {/* Left: Product Image */}
          <div className="lg:col-span-7">
            <div className="bg-surface rounded-2xl overflow-hidden border border-border aspect-[4/3] md:aspect-[16/10]">
              <img 
                src={product.image} 
                alt={product.crop}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop'; }}
              />
            </div>
            
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="bg-surface border border-border p-3 md:p-4 rounded-xl">
                <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Origin</p>
                <p className="text-xs md:text-sm font-bold">{product.origin}</p>
              </div>
              <div className="bg-surface border border-border p-3 md:p-4 rounded-xl">
                <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Grade</p>
                <p className="text-xs md:text-sm font-bold text-primary">Grade {product.grade}</p>
              </div>
              <div className="bg-surface border border-border p-3 md:p-4 rounded-xl">
                <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Harvest</p>
                <p className="text-xs md:text-sm font-bold">{product.harvestSeason || 'N/A'}</p>
              </div>
              <div className="bg-surface border border-border p-3 md:p-4 rounded-xl">
                <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Season Now</p>
                <p className={`text-xs md:text-sm font-bold ${currentSeasonStatus.includes('Harvest') || currentSeasonStatus.includes('Peak') ? 'text-primary' : 'text-textSecondary'}`}>
                  {currentSeasonStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Buy Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-surface border border-border p-5 md:p-8 rounded-2xl">
              <span className="text-[10px] font-bold text-textMuted uppercase tracking-wider">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-black mt-1 mb-2 leading-tight">{product.crop}</h1>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl md:text-4xl font-black text-primary">${product.price.toLocaleString()}</span>
                <span className="text-xs text-textMuted font-semibold">{product.priceUnit}</span>
              </div>

              <div className="space-y-3 text-xs border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-textMuted">Available Stock</span>
                  <span className="font-bold">{product.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">Min. Order</span>
                  <span className="font-bold">{product.logistics?.minOrder || 'Inquire'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">Stock Period</span>
                  <span className="font-bold">{product.stockPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">Supplier</span>
                  <span className="font-bold text-primary">{product.supplier}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => onBuyNow(product)}
                  className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-primaryHover transition-all text-sm"
                >
                  Buy Now — ${product.price.toLocaleString()}/{product.priceUnit?.split('/')[1]}
                </button>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full py-3 border border-border text-textSecondary font-bold rounded-xl hover:bg-surface-hover transition-all text-xs"
                >
                  Request Quotation
                </button>
              </div>
            </div>

            {/* Certifications */}
            {product.certifications && (
              <div className="bg-surface border border-border p-4 md:p-5 rounded-2xl">
                <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-3">Required Certifications</h4>
                <div className="space-y-2">
                  {product.certifications.map((cert: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-primary">✓</span>
                      <span className="text-textSecondary">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logistics Quick View */}
            {product.logistics && (
              <div className="bg-surface border border-border p-4 md:p-5 rounded-2xl">
                <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-wider mb-3">Logistics Overview</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-textMuted">Export Port</span>
                    <span className="font-semibold">{product.logistics.portOfExport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">To Dubai</span>
                    <span className="font-semibold">{product.logistics.transitToDubai}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">To Europe</span>
                    <span className="font-semibold">{product.logistics.transitToEurope}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">To China</span>
                    <span className="font-semibold">{product.logistics.transitToChina}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">Container</span>
                    <span className="font-semibold">{product.logistics.containerType}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-10 md:mt-16">
          <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
            {(['overview', 'regions', 'logistics', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-textMuted hover:text-textSecondary'
                }`}
              >
                {tab === 'overview' ? 'Description' : tab === 'regions' ? 'Growing Regions' : tab === 'logistics' ? 'Logistics & Export' : 'Price History'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                  <div>
                    <h3 className="text-lg font-bold mb-4">About This Product</h3>
                    <p className="text-sm text-textSecondary leading-relaxed mb-6">
                      {product.description}
                    </p>
                    <div className="bg-surface border border-border p-5 rounded-xl">
                      <h4 className="text-xs font-bold text-textMuted uppercase mb-3">Product Specs</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div><span className="text-textMuted block mb-1">Category</span><span className="font-semibold">{product.category}</span></div>
                        <div><span className="text-textMuted block mb-1">Grade</span><span className="font-semibold">Grade {product.grade}</span></div>
                        <div><span className="text-textMuted block mb-1">Region</span><span className="font-semibold">{product.region}</span></div>
                        <div><span className="text-textMuted block mb-1">Available</span><span className="font-semibold">{product.volume}</span></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Harvest Calendar */}
                  {product.seasonality && (
                    <div>
                      <h3 className="text-lg font-bold mb-4">Harvest Calendar</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {product.seasonality.map((s: any) => (
                          <div key={s.month} className={`p-3 rounded-xl border text-center ${
                            s.status.includes('Harvest') || s.status.includes('Peak') 
                              ? 'border-primary/30 bg-primary/5' 
                              : s.status.includes('Export') || s.status.includes('Available')
                                ? 'border-info/20 bg-info/5'
                                : 'border-border bg-surface'
                          }`}>
                            <span className="text-[10px] font-bold text-textMuted block">{s.month}</span>
                            <span className={`text-[9px] font-bold uppercase ${
                              s.status.includes('Harvest') || s.status.includes('Peak') ? 'text-primary' : 
                              s.status.includes('Export') || s.status.includes('Available') ? 'text-info' : 'text-textMuted'
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
                <div className="space-y-8">
                  <h3 className="text-lg font-bold">Regional Price Comparison</h3>
                  
                  {/* Price comparison bar chart */}
                  <div className="bg-surface border border-border p-6 rounded-2xl">
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={product.growingRegions}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                          <XAxis dataKey="name" stroke="#555" fontSize={11} />
                          <YAxis stroke="#555" fontSize={10} tickFormatter={(v: number) => `$${v}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px', fontSize: '11px' }}
                            formatter={(value: number) => [`$${value}`, 'Price']}
                          />
                          <Bar dataKey="price" fill="#00ff88" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Region Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.growingRegions.map((r: any) => (
                      <div key={r.name} className="bg-surface border border-border p-5 rounded-xl hover:border-primary/30 transition-all">
                        <h4 className="text-base font-bold mb-3">{r.name}</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-textMuted">Price</span>
                            <span className="font-bold text-primary">${typeof r.price === 'string' ? r.price.replace('$', '') : r.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-textMuted">Volume</span>
                            <span className="font-semibold">{r.volume}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-textMuted">Quality</span>
                            <span className="font-semibold">{r.quality}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-textMuted">Elevation</span>
                            <span className="font-semibold">{r.elevation}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'logistics' && product.logistics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Export & Shipping</h3>
                    <div className="bg-surface border border-border p-5 rounded-xl space-y-4">
                      <div className="text-xs space-y-3">
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-textMuted">Port of Export</span>
                          <span className="font-bold">{product.logistics.portOfExport}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-textMuted">Transit to Dubai</span>
                          <span className="font-bold">{product.logistics.transitToDubai}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-textMuted">Transit to Europe</span>
                          <span className="font-bold">{product.logistics.transitToEurope}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-textMuted">Transit to China</span>
                          <span className="font-bold">{product.logistics.transitToChina}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-textMuted">Container Type</span>
                          <span className="font-bold">{product.logistics.containerType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4">Required Documentation</h3>
                    <div className="space-y-3">
                      {product.certifications?.map((cert: string, i: number) => (
                        <div key={i} className="bg-surface border border-border p-4 rounded-xl flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 bg-info/5 border border-info/20 p-4 rounded-xl">
                      <p className="text-[10px] text-info font-bold uppercase mb-1">Note</p>
                      <p className="text-xs text-textSecondary">
                        GrainX handles all export documentation and customs clearance. Certificates are provided with every shipment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && product.priceHistory && (
                <div className="space-y-8">
                  <h3 className="text-lg font-bold">12-Month Price History</h3>
                  <div className="bg-surface border border-border p-6 md:p-10 rounded-2xl">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={product.priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                          <XAxis dataKey="month" stroke="#555" fontSize={10} />
                          <YAxis stroke="#555" fontSize={10} tickFormatter={(v: number) => `$${v}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px', fontSize: '11px' }}
                            formatter={(value: number) => [`$${Number(value).toFixed(2)}`, 'Price']}
                          />
                          <Line type="monotone" dataKey="price" stroke="#00ff88" strokeWidth={2} dot={{ fill: '#00ff88', r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: '12M High', value: `$${Math.max(...product.priceHistory.map((h: any) => h.price)).toFixed(2)}` },
                      { label: '12M Low', value: `$${Math.min(...product.priceHistory.map((h: any) => h.price)).toFixed(2)}` },
                      { label: 'Avg Price', value: `$${(product.priceHistory.reduce((sum: number, h: any) => sum + h.price, 0) / product.priceHistory.length).toFixed(2)}` },
                      { label: 'Current', value: `$${product.price.toLocaleString()}` },
                    ].map((stat, i) => (
                      <div key={i} className="bg-surface border border-border p-4 rounded-xl">
                        <p className="text-[10px] text-textMuted font-bold uppercase mb-1">{stat.label}</p>
                        <p className="text-lg font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h3 className="text-lg font-bold mb-6">Related Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <div className="p-3">
                    <p className="text-xs font-bold truncate">{p.crop}</p>
                    <p className="text-xs font-bold text-primary mt-1">${p.price.toLocaleString()}</p>
                    <p className="text-[9px] text-textMuted">{p.origin}</p>
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
