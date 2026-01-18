
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SupplierDashboard: React.FC<{ onSwitchRole: () => void }> = ({ onSwitchRole }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'rfqs' | 'orders' | 'performance'>('inventory');
  const [showAddListing, setShowAddListing] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);

  const mockInventory = [
    { id: 'L-1', crop: 'YELLOW MAIZE', volume: '1,200 MT', price: 272, status: 'ACTIVE' },
    { id: 'L-2', crop: 'SOYBEANS', volume: '450 MT', price: 438, status: 'ACTIVE' },
    { id: 'L-3', crop: 'LONG GRAIN RICE', volume: '0 MT', price: 615, status: 'SOLD' },
  ];

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
    { 
      id: 'ORD-98221', 
      crop: 'YELLOW MAIZE', 
      volume: '150 MT', 
      buyer: 'AgriCorp UAE', 
      status: 'SHIPPED', 
      payment: 'ESCROWED',
      docs: ['Commercial Invoice', 'Packing List'],
      required: ['Phytosanitary Cert', 'Bill of Lading']
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12 flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">Supplier Workspace</h1>
          <p className="text-warning font-mono text-xs md:text-sm uppercase tracking-widest">AGGREGATOR_NODE: MAZAOHUB // VERIFIED_SOURCE</p>
        </div>
        <button onClick={onSwitchRole} className="text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-white transition-colors underline">Exit Supplier Portal</button>
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto scrollbar-hide">
        {(['inventory', 'rfqs', 'orders', 'performance'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeTab === tab ? 'bg-warning text-black border-warning' : 'bg-surface text-textMuted border-border hover:border-textMuted'
            }`}
          >
            {tab === 'rfqs' ? 'PENDING RFQs (2)' : tab === 'performance' ? 'ANALYTICS' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4">
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
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-black uppercase text-white tracking-widest">Active Stock Listings</h3>
             <button 
              onClick={() => setShowAddListing(true)}
              className="bg-primary text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
             >
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
                {mockInventory.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-textSecondary">{item.id}</td>
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
        </div>
      )}

      {activeTab === 'rfqs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-8">
           {mockSupplierOrders.map(order => (
             <div key={order.id} className="bg-surface border border-border p-8 rounded-2xl">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-border/30 pb-6">
                    <div>
                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{order.id} // {order.crop}</h4>
                      <p className="text-xs text-textMuted font-mono uppercase tracking-widest">Buyer: {order.buyer} • Volume: {order.volume}</p>
                    </div>
                    <button className="bg-primary text-black text-[10px] font-black uppercase px-6 py-3 rounded-xl">Mark Shipped</button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Add Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowAddListing(false)}></div>
          <div className="relative w-full max-w-[700px] bg-surface border-2 border-primary/30 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 border-b border-border pb-4">Protocol: New Inventory Listing</h2>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowAddListing(false); }}>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Commodity Type</label>
                    <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono text-white outline-none uppercase">
                      <option>YELLOW MAIZE</option>
                      <option>SOYBEANS</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Volume (MT)</label>
                    <input type="number" placeholder="E.G. 200" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono text-white outline-none" />
                  </div>
               </div>
               <button type="submit" className="w-full py-4 bg-primary text-black font-black uppercase text-xs rounded-xl">Execute Listing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
