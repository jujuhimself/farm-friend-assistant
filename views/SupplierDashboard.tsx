
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useListings } from '../hooks/useListings';
import { supabase } from '../src/integrations/supabase/client';

type SupplierTab = 'inventory' | 'rfqs' | 'orders' | 'performance' | 'profile';

const SupplierDashboard: React.FC<{ onSwitchRole: () => void }> = ({ onSwitchRole }) => {
  const { listings: dbListings, createListing } = useListings();
  const [activeTab, setActiveTab] = useState<SupplierTab>('inventory');
  const [showAddListing, setShowAddListing] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);
  const [newListing, setNewListing] = useState({ crop: 'YELLOW MAIZE', origin: '', volume: '', price: '' });
  const [addingListing, setAddingListing] = useState(false);

  const mockInventory = [
    { id: 'L-1', crop: 'YELLOW MAIZE', volume: '1,200 MT', price: 272, status: 'ACTIVE' },
    { id: 'L-2', crop: 'SOYBEANS', volume: '450 MT', price: 438, status: 'ACTIVE' },
    { id: 'L-3', crop: 'LONG GRAIN RICE', volume: '0 MT', price: 615, status: 'SOLD' },
  ];

  const inventory = dbListings.length > 0 ? dbListings : mockInventory;

  const handleAddListing = async () => {
    if (!newListing.origin || !newListing.volume || !newListing.price) return;
    setAddingListing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('NOT_AUTHENTICATED');
      await createListing({
        supplier_id: user.id,
        crop: newListing.crop,
        origin: newListing.origin,
        volume: `${newListing.volume} MT`,
        price: parseFloat(newListing.price),
        grade: 'A',
        status: 'ACTIVE',
      });
      setNewListing({ crop: 'YELLOW MAIZE', origin: '', volume: '', price: '' });
      setShowAddListing(false);
    } catch (err) {
      console.error('Add listing failed:', err);
    } finally {
      setAddingListing(false);
    }
  };

  const performanceData = [
    { month: 'JAN', volume: 120, revenue: 32000 },
    { month: 'FEB', volume: 150, revenue: 41000 },
    { month: 'MAR', volume: 220, revenue: 58000 },
    { month: 'APR', volume: 190, revenue: 49000 },
  ];

  const mockRfqs = [
    { id: 'RFQ-882', buyer: 'AgriCorp UAE', crop: 'SESAME', volume: '200 MT', timeline: '14 DAYS' },
    { id: 'RFQ-879', buyer: 'IndoFood Trading', crop: 'MAIZE', volume: '500 MT', timeline: '30 DAYS' },
  ];

  const mockSupplierOrders = [
    { id: 'ORD-98221', crop: 'YELLOW MAIZE', volume: '150 MT', buyer: 'AgriCorp UAE', status: 'SHIPPED', payment: 'ESCROWED', docs: ['Commercial Invoice', 'Packing List'], required: ['Phytosanitary Cert', 'Bill of Lading'] },
  ];

  const badges = [
    { icon: '🛡️', label: 'Verified Origin', color: 'primary' },
    { icon: '🚀', label: 'Fast Shipper', color: 'info' },
    { icon: '💎', label: 'Top Rated', color: 'warning' },
    { icon: '📦', label: 'Bulk Specialist', color: 'white' },
  ];

  const transactionHistory = [
    { date: 'Oct 21, 2024', orderId: 'ORD-9712', amount: 32400, crop: 'Maize', status: 'PAID' },
    { date: 'Nov 07, 2024', orderId: 'ORD-9755', amount: 12500, crop: 'Soybeans', status: 'PAID' },
    { date: 'Nov 23, 2024', orderId: 'ORD-9810', amount: 45000, crop: 'Sesame', status: 'PAID' },
    { date: 'Dec 11, 2024', orderId: 'ORD-9822', amount: 28500, crop: 'Rice', status: 'PAID' },
  ];

  return (
    <div className="p-4 md:p-12 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12 flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">Supplier Workspace</h1>
          <p className="text-warning font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]">Node: MAZAOHUB_TERMINAL // SECURITY_LEVEL_04</p>
        </div>
        <button onClick={onSwitchRole} className="text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-white transition-colors underline">Exit Supplier Portal</button>
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto scrollbar-hide border-b border-border pb-4">
        {(['inventory', 'rfqs', 'orders', 'performance', 'profile'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white text-black' : 'text-textMuted hover:text-white'
            }`}
          >
            {tab === 'rfqs' ? 'RFQs (2)' : tab === 'performance' ? 'Analytics' : tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'performance' && (
          <motion.div key="performance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-surface border border-border p-8 rounded-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="text-warning">📈</span> Export Volume History (MT)
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                    <XAxis dataKey="month" stroke="#666" fontSize={10} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #2a2a2a', fontSize: '10px' }} />
                    <Bar dataKey="volume" fill="#ffaa00" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-background border border-border p-6 rounded-xl">
                <p className="text-[9px] font-black text-textMuted uppercase mb-2">Platform Trust Score</p>
                <p className="text-3xl font-black text-warning">4.9 / 5.0</p>
                <p className="text-[10px] text-primary font-bold mt-2 uppercase">GOLD_TIER_FIRM</p>
              </div>
              <div className="bg-background border border-border p-6 rounded-xl">
                <p className="text-[9px] font-black text-textMuted uppercase mb-2">Quality Pass Rate</p>
                <p className="text-3xl font-black text-white">99.4%</p>
                <div className="w-full bg-surface h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '99.4%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-8 space-y-8">
                <div className="bg-surface border border-border p-10 rounded-2xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-6xl pointer-events-none uppercase">RELIABILITY</div>
                  <div className="text-center md:text-left relative z-10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Supplier DNA // Verified</p>
                    <h2 className="text-7xl font-black text-white tracking-tighter mb-2">99.2%</h2>
                    <p className="text-xs text-textMuted font-mono uppercase">Avg Reliability Score (Last 12 Months)</p>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-6 relative z-10">
                    <div className="p-4 bg-background/50 border border-border rounded-xl">
                      <p className="text-[9px] text-textMuted font-bold uppercase mb-1">On-Time Delivery</p>
                      <p className="text-xl font-black text-white">100%</p>
                    </div>
                    <div className="p-4 bg-background/50 border border-border rounded-xl">
                      <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Claim Rate</p>
                      <p className="text-xl font-black text-primary">0.05%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase text-white tracking-[0.3em] mb-6">Earned Accreditations</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {badges.map((b, i) => (
                      <div key={i} className="bg-surface border border-border p-6 rounded-xl flex flex-col items-center text-center group hover:border-white transition-all">
                        <span className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{b.icon}</span>
                        <span className="text-[10px] font-black uppercase text-white tracking-widest">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase text-white tracking-[0.3em] mb-6">Historical Trade Ledger</h3>
                  <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                    <table className="w-full text-[10px] font-mono uppercase">
                      <thead className="bg-background/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left text-textMuted">Date</th>
                          <th className="px-6 py-4 text-left text-textMuted">Ref</th>
                          <th className="px-6 py-4 text-left text-textMuted">Commodity</th>
                          <th className="px-6 py-4 text-right text-textMuted">Value (USD)</th>
                          <th className="px-6 py-4 text-right text-textMuted">Finality</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {transactionHistory.map((tr, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-textMuted">{tr.date}</td>
                            <td className="px-6 py-4 text-white font-bold">{tr.orderId}</td>
                            <td className="px-6 py-4 text-textSecondary">{tr.crop}</td>
                            <td className="px-6 py-4 text-right text-white font-black">${tr.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-primary font-black tracking-widest">SUCCESS</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-2xl">
                  <p className="text-[10px] font-black text-black uppercase tracking-widest mb-4">Node Bio</p>
                  <p className="text-[11px] text-black leading-relaxed font-mono font-bold uppercase">
                    Mazaohub is a Tier-1 aggregator based in Mbeya, specializing in Grade-A Yellow Maize and Soybeans. Operational since 2019 with a focus on UAE and EU export standards.
                  </p>
                </div>
                <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest">Protocol Stats</h4>
                  {[
                    { label: 'Platform Seniority', val: '24 MONTHS' },
                    { label: 'Active Listings', val: `${inventory.filter((i: any) => i.status === 'ACTIVE').length}` },
                    { label: 'Total Volume Moved', val: '4,200 MT' },
                    { label: 'Avg Lead Time', val: '48H' },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-[10px] text-textSecondary font-mono">{s.label}</span>
                      <span className="text-[10px] font-black text-white">{s.val}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 border-2 border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-white transition-all">
                  Preview Public Storefront
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase text-white tracking-widest">Active Stock Listings</h3>
              <button onClick={() => setShowAddListing(true)} className="bg-primary text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                + Add New Listing
              </button>
            </div>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <table className="w-full font-mono text-xs">
                <thead className="bg-background/50 text-textMuted uppercase border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left">Ref</th>
                    <th className="px-6 py-4 text-left">Commodity</th>
                    <th className="px-6 py-4 text-left">Volume</th>
                    <th className="px-6 py-4 text-left">Price (MT)</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inventory.map((item: any) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 text-textSecondary">{typeof item.id === 'string' && item.id.length > 10 ? item.id.slice(0, 8) + '...' : item.id}</td>
                      <td className="px-6 py-4 text-white font-bold">{item.crop}</td>
                      <td className="px-6 py-4 text-textSecondary">{item.volume}</td>
                      <td className="px-6 py-4 text-white font-bold">${item.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${item.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase font-black text-[10px] tracking-widest">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'rfqs' && (
          <motion.div key="rfqs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockRfqs.map(rfq => (
              <div key={rfq.id} className="bg-surface border border-border p-8 rounded-2xl hover:border-warning/50 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{rfq.buyer}</h4>
                    <p className="text-[10px] text-textMuted font-mono uppercase tracking-widest">{rfq.id} // URGENT_BID</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-warning tracking-tighter">{rfq.volume}</p>
                    <p className="text-[9px] text-textMuted uppercase font-black">{rfq.crop}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setSelectedRfq(rfq)} className="flex-1 py-3 bg-warning text-black font-black uppercase text-[10px] rounded-xl hover:bg-white transition-all tracking-widest">Submit Quote</button>
                  <button className="flex-1 py-3 border border-border text-textMuted font-black uppercase text-[10px] rounded-xl hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-all">Decline</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            {mockSupplierOrders.map(order => (
              <div key={order.id} className="bg-surface border border-border p-8 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-border/30 pb-6">
                  <div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{order.id} // {order.crop}</h4>
                    <p className="text-xs text-textMuted font-mono uppercase tracking-widest">Buyer: {order.buyer} • Volume: {order.volume}</p>
                  </div>
                  <button className="bg-primary text-black text-[10px] font-black uppercase px-6 py-3 rounded-xl">Mark Shipped</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-[9px] font-black text-textMuted uppercase tracking-widest mb-3">Uploaded Documents</h5>
                    <div className="space-y-2">
                      {order.docs.map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                          <span className="text-primary text-xs">✓</span>
                          <span className="text-[10px] font-mono text-white uppercase">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black text-textMuted uppercase tracking-widest mb-3">Required Documents</h5>
                    <div className="space-y-2">
                      {order.required.map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg border border-warning/20">
                          <span className="text-warning text-xs">⚠</span>
                          <span className="text-[10px] font-mono text-textMuted uppercase">{doc}</span>
                          <button className="ml-auto text-[9px] font-black text-primary uppercase border border-primary/20 px-2 py-0.5 rounded">Upload</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowAddListing(false)}></div>
          <div className="relative w-full max-w-[700px] bg-surface border-2 border-primary/30 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 border-b border-border pb-4">Protocol: New Inventory Listing</h2>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleAddListing(); }}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Commodity</label>
                  <select value={newListing.crop} onChange={e => setNewListing({...newListing, crop: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono text-white uppercase outline-none focus:border-primary">
                    {['YELLOW MAIZE', 'LONG GRAIN RICE', 'SOYBEANS', 'SESAME', 'CASHEWS', 'HASS AVOCADOS', 'VANILLA BEANS'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Origin Region</label>
                  <input type="text" placeholder="E.G. MBEYA" value={newListing.origin} onChange={e => setNewListing({...newListing, origin: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono text-white uppercase outline-none focus:border-primary" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Available Volume (MT)</label>
                  <input type="number" placeholder="E.G. 500" value={newListing.volume} onChange={e => setNewListing({...newListing, volume: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono text-white outline-none focus:border-primary" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Price per MT (USD)</label>
                  <input type="number" step="0.01" placeholder="E.G. 272" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono text-white outline-none focus:border-primary" required />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={addingListing} className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] rounded-xl hover:bg-primaryHover disabled:opacity-50 tracking-widest">
                  {addingListing ? 'BROADCASTING...' : 'PUBLISH LISTING →'}
                </button>
                <button type="button" onClick={() => setShowAddListing(false)} className="px-8 py-4 border border-border text-textMuted font-black uppercase text-[10px] rounded-xl hover:bg-white/5 tracking-widest">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Quote Modal */}
      {selectedRfq && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedRfq(null)}></div>
          <div className="relative w-full max-w-[500px] bg-surface border-2 border-warning/30 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 border-b border-border pb-4">Submit Quote: {selectedRfq.id}</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-xs font-mono uppercase">
                <span className="text-textMuted">Crop</span>
                <span className="text-white font-bold">{selectedRfq.crop}</span>
              </div>
              <div className="flex justify-between text-xs font-mono uppercase">
                <span className="text-textMuted">Volume Requested</span>
                <span className="text-warning font-bold">{selectedRfq.volume}</span>
              </div>
              <div className="flex justify-between text-xs font-mono uppercase">
                <span className="text-textMuted">Delivery Timeline</span>
                <span className="text-white font-bold">{selectedRfq.timeline}</span>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Your Quote Price (USD/MT)</label>
                <input type="number" placeholder="E.G. 1850" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono text-white outline-none focus:border-warning" />
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setSelectedRfq(null)} className="flex-1 py-3 bg-warning text-black font-black uppercase text-[10px] rounded-xl hover:bg-white transition-all tracking-widest">Submit Quote</button>
              <button onClick={() => setSelectedRfq(null)} className="px-6 py-3 border border-border text-textMuted font-black uppercase text-[10px] rounded-xl hover:bg-white/5 tracking-widest">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
