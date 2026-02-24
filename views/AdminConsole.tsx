
import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';

const AdminConsole: React.FC<{ onSwitchRole: () => void }> = ({ onSwitchRole }) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'transactions' | 'disputes' | 'users'>('verification');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [profilesRes, ordersRes] = await Promise.all([
        (supabase as any).from('profiles').select('*').order('created_at', { ascending: false }),
        (supabase as any).from('orders').select('*').order('created_at', { ascending: false }).limit(50),
      ]);
      if (profilesRes.data) setProfiles(profilesRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const pendingVerifications = profiles.filter(p => !p.verified);
  const verifiedUsers = profiles.filter(p => p.verified);
  const totalGMV = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleVerify = async (userId: string) => {
    await (supabase as any).from('profiles').update({ verified: true, trust_score: 50 }).eq('user_id', userId);
    setProfiles(prev => prev.map(p => p.user_id === userId ? { ...p, verified: true, trust_score: 50 } : p));
    setSelectedUser(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12 flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">Admin Command Center</h1>
          <p className="text-danger font-mono text-xs md:text-sm uppercase tracking-widest">SYSTEM_ADMIN_ACCESS // LEVEL_05_CLEARANCE</p>
        </div>
        <button onClick={onSwitchRole} className="text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-white transition-colors underline">Exit Admin Terminal</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface border border-border p-6 rounded-xl">
          <p className="text-[9px] font-black text-textMuted uppercase mb-2">Total Platform GMV</p>
          <p className="text-2xl font-black text-white">${totalGMV.toLocaleString()}</p>
        </div>
        <div className="bg-surface border border-border p-6 rounded-xl">
          <p className="text-[9px] font-black text-textMuted uppercase mb-2">Total Users</p>
          <p className="text-2xl font-black text-white">{profiles.length}</p>
        </div>
        <div className="bg-surface border border-border p-6 rounded-xl">
          <p className="text-[9px] font-black text-textMuted uppercase mb-2">Pending Verifications</p>
          <p className="text-2xl font-black text-warning">{pendingVerifications.length}</p>
          {pendingVerifications.length > 0 && <p className="text-[10px] text-warning font-bold uppercase tracking-widest animate-pulse">Action Required</p>}
        </div>
        <div className="bg-surface border border-border p-6 rounded-xl">
          <p className="text-[9px] font-black text-textMuted uppercase mb-2">Total Orders</p>
          <p className="text-2xl font-black text-primary">{orders.length}</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex border-b border-border overflow-x-auto">
          {(['verification', 'transactions', 'users'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-white/5 text-primary border-b-2 border-primary' : 'text-textMuted hover:text-white'
              }`}
            >
              {tab === 'verification' ? `Verification (${pendingVerifications.length})` : tab}
            </button>
          ))}
        </div>

        <div className="p-8">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-textMuted text-xs uppercase font-mono">Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'verification' && (
                <div className="space-y-6">
                  {pendingVerifications.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                      <p className="text-textMuted text-xs uppercase font-mono">All users verified ✓</p>
                    </div>
                  ) : pendingVerifications.map(user => (
                    <div key={user.id} className="bg-background border border-border p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-surface border border-border rounded flex items-center justify-center text-xl">
                          🏢
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">{user.company_name || user.display_name || user.email}</h4>
                          <p className="text-[9px] text-textMuted font-mono uppercase tracking-widest">{user.country || 'Unknown'} • {user.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="bg-info/10 border border-info/50 text-info px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-info hover:text-white transition-all"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleVerify(user.user_id)}
                          className="bg-primary text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-4 overflow-x-auto">
                  {orders.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                      <p className="text-textMuted text-xs uppercase font-mono">No transactions yet</p>
                    </div>
                  ) : (
                    <table className="w-full font-mono text-[11px] text-left min-w-[600px]">
                      <thead className="bg-background/50 text-textMuted uppercase border-b border-border">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Crop</th>
                          <th className="px-6 py-4">Volume</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.map(o => (
                          <tr key={o.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-textMuted">{o.id.slice(0, 8)}</td>
                            <td className="px-6 py-4 text-white font-bold">{o.crop}</td>
                            <td className="px-6 py-4 text-textSecondary">{o.volume}</td>
                            <td className="px-6 py-4 text-white font-black">${(o.total || 0).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${
                                o.status === 'DELIVERED & CONFIRMED' ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-textMuted">{new Date(o.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-4 overflow-x-auto">
                  <table className="w-full font-mono text-[11px] text-left min-w-[600px]">
                    <thead className="bg-background/50 text-textMuted uppercase border-b border-border">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Country</th>
                        <th className="px-6 py-4">Trust</th>
                        <th className="px-6 py-4">Verified</th>
                        <th className="px-6 py-4">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {profiles.map(p => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-white font-bold">{p.company_name || p.display_name || '—'}</td>
                          <td className="px-6 py-4 text-textSecondary">{p.email}</td>
                          <td className="px-6 py-4 text-textSecondary">{p.country || '—'}</td>
                          <td className="px-6 py-4 text-white font-black">{p.trust_score || 0}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[9px] font-black ${p.verified ? 'text-primary' : 'text-warning'}`}>
                              {p.verified ? 'YES' : 'NO'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-textMuted">{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Review Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedUser(null)}></div>
          <div className="relative w-full max-w-[600px] bg-surface border-2 border-info/30 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-8 border-b border-border pb-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedUser.company_name || selectedUser.display_name || 'User'}</h2>
                <p className="text-xs font-mono text-textMuted uppercase">{selectedUser.email} · {selectedUser.country || 'Unknown'}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-textMuted hover:text-white transition-colors">✕</button>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { label: 'Phone', value: selectedUser.phone },
                { label: 'Address', value: selectedUser.address },
                { label: 'Bio', value: selectedUser.bio },
                { label: 'Registration ID', value: selectedUser.registration_id },
                { label: 'Member Since', value: new Date(selectedUser.created_at).toLocaleDateString() },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-background rounded-lg border border-border">
                  <span className="text-[10px] font-bold text-textMuted uppercase">{item.label}</span>
                  <span className="text-[10px] font-bold text-white">{item.value || '—'}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => handleVerify(selectedUser.user_id)} className="flex-1 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all tracking-widest">Approve Account</button>
              <button onClick={() => setSelectedUser(null)} className="px-8 py-4 border border-danger text-danger font-black uppercase text-xs rounded-xl hover:bg-danger/10 transition-all">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsole;
