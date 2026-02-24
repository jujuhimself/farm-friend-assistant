
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useListings } from '../hooks/useListings';
import { useOrders } from '../hooks/useOrders';
import { supabase } from '../src/integrations/supabase/client';

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

  // Fetch open RFQs visible to suppliers
  useEffect(() => {
    const fetchRfqs = async () => {
      const { data } = await (supabase as any)
        .from('rfqs')
        .select('*')
        .eq('status', 'OPEN')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setOpenRfqs(data);
    };
    fetchRfqs();

    const channel = supabase
      .channel('supplier-rfqs')
      .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'rfqs' }, fetchRfqs)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Fetch supplier's own profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setSupplierProfile(data);
    };
    fetchProfile();
  }, []);

  const inventory = dbListings;

  // Filter orders where current user is supplier
  const supplierOrders = dbOrders;

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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await (supabase as any)
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const ORDER_NEXT_STATUS: Record<string, string> = {
    'ORDER CONFIRMED': 'AWAITING PAYMENT',
    'AWAITING PAYMENT': 'PAYMENT ESCROWED',
    'PAYMENT ESCROWED': 'INSPECTION SCHEDULED',
    'INSPECTION SCHEDULED': 'INSPECTION PASSED',
    'INSPECTION PASSED': 'GOODS PACKED',
    'GOODS PACKED': 'GOODS SHIPPED',
    'GOODS SHIPPED': 'IN TRANSIT',
    'IN TRANSIT': 'CUSTOMS CLEARANCE',
    'CUSTOMS CLEARANCE': 'ARRIVED AT DESTINATION',
    'ARRIVED AT DESTINATION': 'DELIVERED & CONFIRMED',
  };

  // Compute performance from real orders
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
    { icon: '🛡️', label: 'Verified Origin', color: 'primary' },
    { icon: '🚀', label: 'Fast Shipper', color: 'info' },
    { icon: '💎', label: 'Top Rated', color: 'warning' },
    { icon: '📦', label: 'Bulk Specialist', color: 'white' },
  ];

  return (
    <div className="p-4 md:p-12 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12 flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">Supplier Workspace</h1>
          <p className="text-warning font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]">
            {supplierProfile?.company_name || 'SUPPLIER'} // {inventory.length} LISTINGS · {supplierOrders.length} ORDERS
          </p>
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
            {tab === 'rfqs' ? `RFQs (${openRfqs.length})` : tab === 'performance' ? 'Analytics' : tab}
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
                  <div className="h-full flex items-center justify-center text-textMuted text-xs uppercase font-mono">No order data yet</div>
                )}
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-background border border-border p-6 rounded-xl">
                <p className="text-[9px] font-black text-textMuted uppercase mb-2">Trust Score</p>
                <p className="text-3xl font-black text-warning">{supplierProfile?.trust_score || 0} / 100</p>
                <p className="text-[10px] text-primary font-bold mt-2 uppercase">{supplierProfile?.verified ? 'VERIFIED' : 'PENDING VERIFICATION'}</p>
              </div>
              <div className="bg-background border border-border p-6 rounded-xl">
                <p className="text-[9px] font-black text-textMuted uppercase mb-2">Total Revenue</p>
                <p className="text-3xl font-black text-white">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-background border border-border p-6 rounded-xl">
                <p className="text-[9px] font-black text-textMuted uppercase mb-2">Total Volume</p>
                <p className="text-3xl font-black text-white">{totalVolume.toLocaleString()} MT</p>
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
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Supplier DNA // {supplierProfile?.verified ? 'Verified' : 'Unverified'}</p>
                    <h2 className="text-7xl font-black text-white tracking-tighter mb-2">{supplierProfile?.trust_score || 0}</h2>
                    <p className="text-xs text-textMuted font-mono uppercase">Trust Score</p>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-6 relative z-10">
                    <div className="p-4 bg-background/50 border border-border rounded-xl">
                      <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Total Orders</p>
                      <p className="text-xl font-black text-white">{supplierOrders.length}</p>
                    </div>
                    <div className="p-4 bg-background/50 border border-border rounded-xl">
                      <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Active Listings</p>
                      <p className="text-xl font-black text-primary">{inventory.filter((i: any) => i.status === 'ACTIVE').length}</p>
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
                    {supplierOrders.length > 0 ? (
                      <table className="w-full text-[10px] font-mono uppercase">
                        <thead className="bg-background/50 border-b border-border">
                          <tr>
                            <th className="px-6 py-4 text-left text-textMuted">Date</th>
                            <th className="px-6 py-4 text-left text-textMuted">Ref</th>
                            <th className="px-6 py-4 text-left text-textMuted">Commodity</th>
                            <th className="px-6 py-4 text-right text-textMuted">Value (USD)</th>
                            <th className="px-6 py-4 text-right text-textMuted">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {supplierOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 text-textMuted">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-white font-bold">{o.id.slice(0, 8)}</td>
                              <td className="px-6 py-4 text-textSecondary">{o.crop}</td>
                              <td className="px-6 py-4 text-right text-white font-black">${(o.price * (parseInt(o.volume) || 0)).toLocaleString()}</td>
                              <td className="px-6 py-4 text-right">
                                <span className={`font-black tracking-widest ${o.status === 'DELIVERED & CONFIRMED' ? 'text-primary' : 'text-warning'}`}>{o.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-12 text-center text-textMuted text-xs uppercase font-mono">No orders yet</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-2xl">
                  <p className="text-[10px] font-black text-black uppercase tracking-widest mb-4">Company Bio</p>
                  <p className="text-[11px] text-black leading-relaxed font-mono font-bold uppercase">
                    {supplierProfile?.bio || supplierProfile?.company_name || 'No bio set. Update your profile to add a description.'}
                  </p>
                </div>
                <div className="bg-surface border border-border p-6 rounded-2xl space-y-4">
                  <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest">Protocol Stats</h4>
                  {[
                    { label: 'Member Since', val: supplierProfile?.created_at ? new Date(supplierProfile.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : '—' },
                    { label: 'Active Listings', val: `${inventory.filter((i: any) => i.status === 'ACTIVE').length}` },
                    { label: 'Total Volume Moved', val: `${totalVolume.toLocaleString()} MT` },
                    { label: 'Country', val: supplierProfile?.country || '—' },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-[10px] text-textSecondary font-mono">{s.label}</span>
                      <span className="text-[10px] font-black text-white">{s.val}</span>
                    </div>
                  ))}
                </div>
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
            {inventory.length > 0 ? (
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
            ) : (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-textMuted text-xs uppercase font-mono mb-4">No listings yet</p>
                <button onClick={() => setShowAddListing(true)} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Create your first listing →</button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'rfqs' && (
          <motion.div key="rfqs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {openRfqs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {openRfqs.map(rfq => (
                  <div key={rfq.id} className="bg-surface border border-border p-8 rounded-2xl hover:border-warning/50 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">{rfq.crop}</h4>
                        <p className="text-[10px] text-textMuted font-mono uppercase tracking-widest">{rfq.id.slice(0, 8)} // {rfq.origin || 'ANY ORIGIN'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-warning tracking-tighter">{rfq.volume}</p>
                        <p className="text-[9px] text-textMuted uppercase font-black">{rfq.delivery_timeline || '30 DAYS'}</p>
                      </div>
                    </div>
                    {rfq.notes && <p className="text-[10px] text-textSecondary mb-4 font-mono uppercase">{rfq.notes}</p>}
                    <div className="flex gap-4">
                      <button onClick={() => setSelectedRfq(rfq)} className="flex-1 py-3 bg-warning text-black font-black uppercase text-[10px] rounded-xl hover:bg-white transition-all tracking-widest">Submit Quote</button>
                      <button className="flex-1 py-3 border border-border text-textMuted font-black uppercase text-[10px] rounded-xl hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-all">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-textMuted text-xs uppercase font-mono">No open RFQs at this time</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            {supplierOrders.length > 0 ? supplierOrders.map(order => (
              <div key={order.id} className="bg-surface border border-border p-8 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-border/30 pb-6">
                  <div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{order.id.slice(0, 8)} // {order.crop}</h4>
                    <p className="text-xs text-textMuted font-mono uppercase tracking-widest">Volume: {order.volume} • Status: {order.status}</p>
                  </div>
                  {ORDER_NEXT_STATUS[order.status || ''] && (
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, ORDER_NEXT_STATUS[order.status || ''])}
                      disabled={updatingStatus === order.id}
                      className="bg-primary text-black text-[10px] font-black uppercase px-6 py-3 rounded-xl disabled:opacity-50"
                    >
                      {updatingStatus === order.id ? 'Updating...' : `→ ${ORDER_NEXT_STATUS[order.status || '']}`}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Price</p>
                    <p className="text-xs font-bold text-white">${order.price}/MT</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Destination</p>
                    <p className="text-xs font-bold text-white">{order.destination || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Incoterm</p>
                    <p className="text-xs font-bold text-white">{order.incoterm || 'FOB'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-textMuted font-bold uppercase mb-1">Payment</p>
                    <p className="text-xs font-bold text-warning">{(order as any).payment_status || 'PENDING'}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl">
                <p className="text-textMuted text-xs uppercase font-mono">No orders assigned to you yet</p>
              </div>
            )}
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
            <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 border-b border-border pb-4">Submit Quote: {selectedRfq.id.slice(0, 8)}</h2>
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
                <span className="text-white font-bold">{selectedRfq.delivery_timeline || '30 DAYS'}</span>
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
