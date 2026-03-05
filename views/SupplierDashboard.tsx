
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useListings } from '../hooks/useListings';
import { useOrders } from '../hooks/useOrders';
import { supabase } from '../src/integrations/supabase/client';
import PageShell from '../components/PageShell';

type SupplierTab = 'inventory' | 'rfqs' | 'orders' | 'performance' | 'profile';

const SupplierDashboard: React.FC<{ onSwitchRole: () => void }> = ({ onSwitchRole }) => {
  const { listings: dbListings, createListing } = useListings();
  const { orders: dbOrders } = useOrders();
  const [activeTab, setActiveTab] = useState<SupplierTab>('inventory');
  const [showAddListing, setShowAddListing] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);
  const [newListing, setNewListing] = useState({ crop: 'YELLOW MAIZE', origin: '', volume: '', price: '' });
  const [addingListing, setAddingListing] = useState(false);
  const [openRfqs, setOpenRfqs] = useState<any[]>([]);
  const [supplierProfile, setSupplierProfile] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        const { data } = await (supabase as any).from('rfqs').select('*').eq('status', 'OPEN').order('created_at', { ascending: false }).limit(10);
        if (data) setOpenRfqs(data);
      } catch (err) { console.error('RFQ fetch failed:', err); }
    };
    fetchRfqs();
    const channel = supabase.channel('supplier-rfqs').on('postgres_changes' as any, { event: '*', schema: 'public', table: 'rfqs' }, fetchRfqs).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await (supabase as any).from('profiles').select('*').eq('user_id', user.id).maybeSingle();
        if (data) setSupplierProfile(data);
      } catch (err) { console.error('Profile fetch failed:', err); }
    };
    fetchProfile();
  }, []);

  const inventory = dbListings;
  const supplierOrders = dbOrders;

  const handleAddListing = async () => {
    if (!newListing.origin || !newListing.volume || !newListing.price) return;
    setAddingListing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('NOT_AUTHENTICATED');
      await createListing({ supplier_id: user.id, crop: newListing.crop, origin: newListing.origin, volume: `${newListing.volume} MT`, price: parseFloat(newListing.price), grade: 'A', status: 'ACTIVE' });
      setNewListing({ crop: 'YELLOW MAIZE', origin: '', volume: '', price: '' });
      setShowAddListing(false);
    } catch (err) { console.error('Add listing failed:', err); }
    finally { setAddingListing(false); }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try { await (supabase as any).from('orders').update({ status: newStatus }).eq('id', orderId); }
    catch (err) { console.error('Status update failed:', err); }
    finally { setUpdatingStatus(null); }
  };

  const ORDER_NEXT_STATUS: Record<string, string> = {
    'ORDER CONFIRMED': 'AWAITING PAYMENT', 'AWAITING PAYMENT': 'PAYMENT ESCROWED',
    'PAYMENT ESCROWED': 'INSPECTION SCHEDULED', 'INSPECTION SCHEDULED': 'INSPECTION PASSED',
    'INSPECTION PASSED': 'GOODS PACKED', 'GOODS PACKED': 'GOODS SHIPPED',
    'GOODS SHIPPED': 'IN TRANSIT', 'IN TRANSIT': 'CUSTOMS CLEARANCE',
    'CUSTOMS CLEARANCE': 'ARRIVED AT DESTINATION', 'ARRIVED AT DESTINATION': 'DELIVERED & CONFIRMED',
  };

  const performanceData = (() => {
    const months: Record<string, { volume: number; revenue: number }> = {};
    supplierOrders.forEach(o => {
      const m = new Date(o.created_at).toLocaleString('en', { month: 'short' }).toUpperCase();
      if (!months[m]) months[m] = { volume: 0, revenue: 0 };
      const vol = parseInt(o.volume) || 0;
      months[m].volume += vol;
      months[m].revenue += o.price * vol;
    });
    return Object.entries(months).map(([month, d]) => ({ month, ...d }));
  })();

  const totalRevenue = supplierOrders.reduce((sum, o) => sum + (o.price * (parseInt(o.volume) || 0)), 0);
  const totalVolume = supplierOrders.reduce((sum, o) => sum + (parseInt(o.volume) || 0), 0);

  const badges = [
    { icon: '🛡️', label: 'Verified Origin' },
    { icon: '🚀', label: 'Fast Shipper' },
    { icon: '💎', label: 'Top Rated' },
    { icon: '📦', label: 'Bulk Specialist' },
  ];

  return (
    <PageShell
      title="Supplier Workspace"
      subtitle={`${supplierProfile?.company_name || 'SUPPLIER'} // ${inventory.length} LISTINGS · ${supplierOrders.length} ORDERS`}
      titleColor="text-warning"
      rightContent={
        <button onClick={onSwitchRole} className="text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors underline">Exit Portal</button>
      }
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1 -mx-3 px-3 md:mx-0 md:px-0 border-b border-border">
        {(['inventory', 'rfqs', 'orders', 'performance', 'profile'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 md:px-5 py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 border-b-2 ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-white'
            }`}
          >
            {tab === 'rfqs' ? `RFQs (${openRfqs.length})` : tab === 'performance' ? 'Analytics' : tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* PERFORMANCE */}
        {activeTab === 'performance' && (
          <motion.div key="performance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            <div className="lg:col-span-8 bg-surface border border-border p-4 md:p-6 rounded-xl">
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="text-warning">📈</span> Export Volume (MT)
              </h3>
              <div style={{ width: '100%', height: 260, minWidth: 0 }}>
                {performanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                      <XAxis dataKey="month" stroke="#666" fontSize={10} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ backgroundColor: '#141414', border: '1px solid #2a2a2a', fontSize: '10px' }} />
                      <Bar dataKey="volume" fill="#ffaa00" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-text-muted text-xs uppercase font-mono">No order data yet</div>
                )}
              </div>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="bg-background border border-border p-4 rounded-xl">
                <p className="text-[8px] font-black text-text-muted uppercase mb-1">Trust Score</p>
                <p className="text-2xl font-black text-warning">{supplierProfile?.trust_score || 0}/100</p>
                <p className="text-[9px] text-primary font-bold mt-1 uppercase">{supplierProfile?.verified ? 'VERIFIED' : 'PENDING'}</p>
              </div>
              <div className="bg-background border border-border p-4 rounded-xl">
                <p className="text-[8px] font-black text-text-muted uppercase mb-1">Revenue</p>
                <p className="text-2xl font-black text-white">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-background border border-border p-4 rounded-xl col-span-2 lg:col-span-1">
                <p className="text-[8px] font-black text-text-muted uppercase mb-1">Volume</p>
                <p className="text-2xl font-black text-white">{totalVolume.toLocaleString()} MT</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
              <div className="md:col-span-8 space-y-4">
                {/* DNA Card */}
                <div className="bg-surface border border-border p-5 md:p-8 rounded-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                  <div className="text-center md:text-left">
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2">Supplier DNA</p>
                    <p className="text-5xl md:text-6xl font-black text-white tracking-tighter">{supplierProfile?.trust_score || 0}</p>
                    <p className="text-[10px] text-text-muted font-mono uppercase">Trust Score</p>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-background/50 border border-border rounded-lg">
                      <p className="text-[8px] text-text-muted font-bold uppercase mb-0.5">Orders</p>
                      <p className="text-lg font-black text-white">{supplierOrders.length}</p>
                    </div>
                    <div className="p-3 bg-background/50 border border-border rounded-lg">
                      <p className="text-[8px] text-text-muted font-bold uppercase mb-0.5">Listings</p>
                      <p className="text-lg font-black text-primary">{inventory.filter((i: any) => i.status === 'ACTIVE').length}</p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {badges.map((b, i) => (
                    <div key={i} className="bg-surface border border-border p-4 rounded-lg flex flex-col items-center text-center group hover:border-white transition-all">
                      <span className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">{b.icon}</span>
                      <span className="text-[9px] font-black uppercase text-white tracking-widest">{b.label}</span>
                    </div>
                  ))}
                </div>

                {/* Trade Ledger - mobile cards, desktop table */}
                <div>
                  <h3 className="text-[10px] font-black uppercase text-white tracking-[0.2em] mb-3">Trade Ledger</h3>
                  {supplierOrders.length > 0 ? (
                    <>
                      <div className="hidden md:block bg-surface border border-border rounded-xl overflow-x-auto">
                        <table className="w-full text-[10px] font-mono uppercase">
                          <thead className="bg-background/50 border-b border-border">
                            <tr>
                              <th className="px-4 py-3 text-left text-text-muted">Date</th>
                              <th className="px-4 py-3 text-left text-text-muted">Ref</th>
                              <th className="px-4 py-3 text-left text-text-muted">Commodity</th>
                              <th className="px-4 py-3 text-right text-text-muted">Value</th>
                              <th className="px-4 py-3 text-right text-text-muted">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {supplierOrders.map(o => (
                              <tr key={o.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 text-text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-white font-bold">{o.id.slice(0, 8)}</td>
                                <td className="px-4 py-3 text-text-secondary">{o.crop}</td>
                                <td className="px-4 py-3 text-right text-white font-black">${(o.price * (parseInt(o.volume) || 0)).toLocaleString()}</td>
                                <td className="px-4 py-3 text-right">
                                  <span className={`font-black ${o.status === 'DELIVERED & CONFIRMED' ? 'text-primary' : 'text-warning'}`}>{o.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="md:hidden space-y-2">
                        {supplierOrders.map(o => (
                          <div key={o.id} className="bg-surface border border-border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[10px] font-black text-white truncate">{o.crop}</p>
                              <span className={`text-[8px] font-black flex-shrink-0 ml-2 ${o.status === 'DELIVERED & CONFIRMED' ? 'text-primary' : 'text-warning'}`}>{o.status}</span>
                            </div>
                            <div className="flex justify-between text-[9px]">
                              <span className="text-text-muted">{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}</span>
                              <span className="text-white font-black">${(o.price * (parseInt(o.volume) || 0)).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-text-muted text-xs uppercase font-mono border-2 border-dashed border-border rounded-xl">No orders yet</div>
                  )}
                </div>
              </div>

              <div className="md:col-span-4 space-y-4">
                <div className="bg-white p-4 rounded-xl">
                  <p className="text-[9px] font-black text-black uppercase tracking-widest mb-2">Company Bio</p>
                  <p className="text-[10px] text-black leading-relaxed font-mono font-bold uppercase">
                    {supplierProfile?.bio || supplierProfile?.company_name || 'No bio set.'}
                  </p>
                </div>
                <div className="bg-surface border border-border p-4 rounded-xl space-y-3">
                  <h4 className="text-[9px] font-black text-text-muted uppercase tracking-widest">Stats</h4>
                  {[
                    { label: 'Since', val: supplierProfile?.created_at ? new Date(supplierProfile.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : '—' },
                    { label: 'Active', val: `${inventory.filter((i: any) => i.status === 'ACTIVE').length}` },
                    { label: 'Volume', val: `${totalVolume.toLocaleString()} MT` },
                    { label: 'Country', val: supplierProfile?.country || '—' },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                      <span className="text-[9px] text-text-secondary font-mono">{s.label}</span>
                      <span className="text-[9px] font-black text-white">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* INVENTORY */}
        {activeTab === 'inventory' && (
          <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase text-white tracking-widest">Active Stock</h3>
              <button onClick={() => setShowAddListing(true)} className="bg-primary text-background px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform">+ Add</button>
            </div>
            {inventory.length > 0 ? (
              <>
                {/* Desktop table */}
                <div className="hidden md:block bg-surface border border-border rounded-xl overflow-x-auto">
                  <table className="w-full font-mono text-xs">
                    <thead className="bg-background/50 text-text-muted uppercase border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left">Ref</th>
                        <th className="px-4 py-3 text-left">Commodity</th>
                        <th className="px-4 py-3 text-left">Volume</th>
                        <th className="px-4 py-3 text-left">Price/MT</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {inventory.map((item: any) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-text-secondary">{typeof item.id === 'string' && item.id.length > 10 ? item.id.slice(0, 8) + '...' : item.id}</td>
                          <td className="px-4 py-3 text-white font-bold">{item.crop}</td>
                          <td className="px-4 py-3 text-text-secondary">{item.volume}</td>
                          <td className="px-4 py-3 text-white font-bold">${item.price}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${item.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>{item.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="md:hidden space-y-2">
                  {inventory.map((item: any) => (
                    <div key={item.id} className="bg-surface border border-border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-black text-white truncate">{item.crop}</p>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded flex-shrink-0 ${item.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>{item.status}</span>
                      </div>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-text-muted">{item.volume}</span>
                        <span className="text-white font-bold">${item.price}/MT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                <p className="text-text-muted text-xs uppercase font-mono mb-3">No listings yet</p>
                <button onClick={() => setShowAddListing(true)} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Create first listing →</button>
              </div>
            )}
          </motion.div>
        )}

        {/* RFQs */}
        {activeTab === 'rfqs' && (
          <motion.div key="rfqs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {openRfqs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {openRfqs.map(rfq => (
                  <div key={rfq.id} className="bg-surface border border-border p-4 md:p-6 rounded-xl hover:border-warning/50 transition-all">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{rfq.crop}</h4>
                        <p className="text-[9px] text-text-muted font-mono uppercase truncate">{rfq.id.slice(0, 8)} // {rfq.origin || 'ANY'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-black text-warning">{rfq.volume}</p>
                        <p className="text-[8px] text-text-muted uppercase font-black">{rfq.delivery_timeline || '30 DAYS'}</p>
                      </div>
                    </div>
                    {rfq.notes && <p className="text-[9px] text-text-secondary mb-3 font-mono uppercase truncate">{rfq.notes}</p>}
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedRfq(rfq)} className="flex-1 py-2.5 bg-warning text-background font-black uppercase text-[9px] rounded-lg hover:bg-white transition-all tracking-widest">Quote</button>
                      <button className="flex-1 py-2.5 border border-border text-text-muted font-black uppercase text-[9px] rounded-lg hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-all">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                <p className="text-text-muted text-xs uppercase font-mono">No open RFQs</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {supplierOrders.length > 0 ? supplierOrders.map(order => (
              <div key={order.id} className="bg-surface border border-border p-4 md:p-6 rounded-xl">
                <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4 border-b border-border/30 pb-4">
                  <div className="min-w-0">
                    <h4 className="text-sm md:text-lg font-black text-white uppercase tracking-tighter truncate">{order.id.slice(0, 8)} // {order.crop}</h4>
                    <p className="text-[9px] text-text-muted font-mono uppercase">Vol: {order.volume} • {order.status}</p>
                  </div>
                  {ORDER_NEXT_STATUS[order.status || ''] && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, ORDER_NEXT_STATUS[order.status || ''])}
                      disabled={updatingStatus === order.id}
                      className="bg-primary text-background text-[9px] font-black uppercase px-4 py-2 rounded-lg disabled:opacity-50 flex-shrink-0"
                    >
                      {updatingStatus === order.id ? '...' : `→ ${ORDER_NEXT_STATUS[order.status || '']}`}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Price', value: `$${order.price}/MT` },
                    { label: 'Destination', value: order.destination || '—' },
                    { label: 'Incoterm', value: order.incoterm || 'FOB' },
                    { label: 'Payment', value: (order as any).payment_status || 'PENDING' },
                  ].map((f, i) => (
                    <div key={i}>
                      <p className="text-[8px] text-text-muted font-bold uppercase mb-0.5">{f.label}</p>
                      <p className="text-[10px] font-bold text-white truncate">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )) : (
              <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                <p className="text-text-muted text-xs uppercase font-mono">No orders yet</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowAddListing(false)} />
          <div className="relative w-full max-w-[600px] bg-surface border-2 border-primary/30 rounded-xl p-5 md:p-8 shadow-2xl">
            <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter mb-6 border-b border-border pb-3">New Listing</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddListing(); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Commodity</label>
                  <select value={newListing.crop} onChange={e => setNewListing({...newListing, crop: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-mono text-white uppercase outline-none focus:border-primary">
                    {['YELLOW MAIZE', 'LONG GRAIN RICE', 'SOYBEANS', 'SESAME', 'CASHEWS', 'HASS AVOCADOS', 'VANILLA BEANS'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Origin</label>
                  <input type="text" placeholder="MBEYA" value={newListing.origin} onChange={e => setNewListing({...newListing, origin: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-mono text-white uppercase outline-none focus:border-primary" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Volume (MT)</label>
                  <input type="number" placeholder="500" value={newListing.volume} onChange={e => setNewListing({...newListing, volume: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-mono text-white outline-none focus:border-primary" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Price/MT (USD)</label>
                  <input type="number" step="0.01" placeholder="272" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-mono text-white outline-none focus:border-primary" required />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={addingListing} className="flex-1 py-3 bg-primary text-background font-black uppercase text-[10px] rounded-lg hover:bg-primary-hover disabled:opacity-50 tracking-widest">
                  {addingListing ? 'Publishing...' : 'Publish →'}
                </button>
                <button type="button" onClick={() => setShowAddListing(false)} className="px-6 py-3 border border-border text-text-muted font-black uppercase text-[10px] rounded-lg hover:bg-white/5 tracking-widest">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {selectedRfq && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedRfq(null)} />
          <div className="relative w-full max-w-[420px] bg-surface border-2 border-warning/30 rounded-xl p-5 md:p-8 shadow-2xl">
            <h2 className="text-lg font-black text-white uppercase tracking-tighter mb-4 border-b border-border pb-3">Quote: {selectedRfq.id.slice(0, 8)}</h2>
            <div className="space-y-3 mb-4">
              {[
                ['Crop', selectedRfq.crop],
                ['Volume', selectedRfq.volume],
                ['Timeline', selectedRfq.delivery_timeline || '30 DAYS'],
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between text-xs font-mono uppercase">
                  <span className="text-text-muted">{label}</span>
                  <span className="text-white font-bold">{val}</span>
                </div>
              ))}
              <div className="space-y-1.5 pt-2">
                <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Your Price (USD/MT)</label>
                <input type="number" placeholder="1850" className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-mono text-white outline-none focus:border-warning" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedRfq(null)} className="flex-1 py-2.5 bg-warning text-background font-black uppercase text-[10px] rounded-lg hover:bg-white transition-all tracking-widest">Submit</button>
              <button onClick={() => setSelectedRfq(null)} className="px-5 py-2.5 border border-border text-text-muted font-black uppercase text-[10px] rounded-lg hover:bg-white/5 tracking-widest">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default SupplierDashboard;
