
import React, { useState, useEffect } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import PageShell from '../components/PageShell';

const AdminConsole: React.FC<{ onSwitchRole: () => void }> = ({ onSwitchRole }) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'transactions' | 'users'>('verification');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profilesRes, ordersRes] = await Promise.all([
          (supabase as any).from('profiles').select('*').order('created_at', { ascending: false }),
          (supabase as any).from('orders').select('*').order('created_at', { ascending: false }).limit(50),
        ]);
        if (profilesRes.data) setProfiles(profilesRes.data);
        if (ordersRes.data) setOrders(ordersRes.data);
      } catch (err) {
        console.error('Admin data fetch failed:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const pendingVerifications = profiles.filter(p => !p.verified);
  const totalGMV = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleVerify = async (userId: string) => {
    await (supabase as any).from('profiles').update({ verified: true, trust_score: 50 }).eq('user_id', userId);
    setProfiles(prev => prev.map(p => p.user_id === userId ? { ...p, verified: true, trust_score: 50 } : p));
    setSelectedUser(null);
  };

  return (
    <PageShell
      title="Admin Command Center"
      subtitle="SYSTEM_ADMIN_ACCESS // LEVEL_05_CLEARANCE"
      titleColor="text-danger"
      rightContent={
        <button onClick={onSwitchRole} className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors underline">
          Exit Admin
        </button>
      }
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-10">
        {[
          { label: 'Platform GMV', value: `$${totalGMV.toLocaleString()}`, color: '' },
          { label: 'Total Users', value: profiles.length.toString(), color: '' },
          { label: 'Pending Verify', value: pendingVerifications.length.toString(), color: 'text-warning', pulse: pendingVerifications.length > 0 },
          { label: 'Total Orders', value: orders.length.toString(), color: 'text-primary' },
        ].map((s, i) => (
          <div key={i} className="bg-surface border border-border p-3 md:p-5 rounded-xl">
            <p className="text-[8px] md:text-[9px] font-black text-text-muted uppercase mb-1">{s.label}</p>
            <p className={`text-lg md:text-2xl font-black ${s.color}`}>{s.value}</p>
            {s.pulse && <p className="text-[9px] text-warning font-bold uppercase tracking-widest animate-pulse">Action Required</p>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
          {(['verification', 'transactions', 'users'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab ? 'bg-white/5 text-primary border-b-2 border-primary' : 'text-text-muted hover:text-white'
              }`}
            >
              {tab === 'verification' ? `Verify (${pendingVerifications.length})` : tab}
            </button>
          ))}
        </div>

        <div className="p-3 md:p-6">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-muted text-xs uppercase font-mono">Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'verification' && (
                <div className="space-y-3">
                  {pendingVerifications.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                      <p className="text-text-muted text-xs uppercase font-mono">All users verified ✓</p>
                    </div>
                  ) : pendingVerifications.map(user => (
                    <div key={user.id} className="bg-background border border-border p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-surface border border-border rounded flex items-center justify-center text-lg flex-shrink-0">🏢</div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-white uppercase tracking-tight truncate">{user.company_name || user.display_name || user.email}</h4>
                          <p className="text-[8px] text-text-muted font-mono uppercase tracking-widest truncate">{user.country || 'Unknown'} • {user.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                        <button onClick={() => setSelectedUser(user)} className="flex-1 sm:flex-none bg-info/10 border border-info/50 text-info px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-info hover:text-white transition-all">Review</button>
                        <button onClick={() => handleVerify(user.user_id)} className="flex-1 sm:flex-none bg-primary text-background px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Verify</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-2">
                  {orders.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
                      <p className="text-text-muted text-xs uppercase font-mono">No transactions yet</p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop table */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full font-mono text-[11px] text-left">
                          <thead className="bg-background/50 text-text-muted uppercase border-b border-border">
                            <tr>
                              <th className="px-4 py-3">ID</th>
                              <th className="px-4 py-3">Crop</th>
                              <th className="px-4 py-3">Volume</th>
                              <th className="px-4 py-3">Total</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {orders.map(o => (
                              <tr key={o.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 text-text-muted">{o.id.slice(0, 8)}</td>
                                <td className="px-4 py-3 text-white font-bold">{o.crop}</td>
                                <td className="px-4 py-3 text-text-secondary">{o.volume}</td>
                                <td className="px-4 py-3 text-white font-black">${(o.total || 0).toLocaleString()}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${o.status === 'DELIVERED & CONFIRMED' ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'}`}>{o.status}</span>
                                </td>
                                <td className="px-4 py-3 text-text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Mobile cards */}
                      <div className="md:hidden space-y-2">
                        {orders.map(o => (
                          <div key={o.id} className="bg-background border border-border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-white truncate">{o.crop}</p>
                                <p className="text-[8px] text-text-muted font-mono">{o.id.slice(0, 8)} · {o.volume}</p>
                              </div>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded flex-shrink-0 ${o.status === 'DELIVERED & CONFIRMED' ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'}`}>{o.status}</span>
                            </div>
                            <div className="flex justify-between text-[9px]">
                              <span className="text-text-muted">{new Date(o.created_at).toLocaleDateString()}</span>
                              <span className="text-white font-black">${(o.total || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-2">
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full font-mono text-[11px] text-left">
                      <thead className="bg-background/50 text-text-muted uppercase border-b border-border">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Country</th>
                          <th className="px-4 py-3">Trust</th>
                          <th className="px-4 py-3">Verified</th>
                          <th className="px-4 py-3">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {profiles.map(p => (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-white font-bold">{p.company_name || p.display_name || '—'}</td>
                            <td className="px-4 py-3 text-text-secondary">{p.email}</td>
                            <td className="px-4 py-3 text-text-secondary">{p.country || '—'}</td>
                            <td className="px-4 py-3 text-white font-black">{p.trust_score || 0}</td>
                            <td className="px-4 py-3">
                              <span className={`text-[9px] font-black ${p.verified ? 'text-primary' : 'text-warning'}`}>{p.verified ? 'YES' : 'NO'}</span>
                            </td>
                            <td className="px-4 py-3 text-text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile cards */}
                  <div className="md:hidden space-y-2">
                    {profiles.map(p => (
                      <div key={p.id} className="bg-background border border-border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-black text-white truncate min-w-0">{p.company_name || p.display_name || '—'}</p>
                          <span className={`text-[8px] font-black flex-shrink-0 ${p.verified ? 'text-primary' : 'text-warning'}`}>{p.verified ? 'VERIFIED' : 'PENDING'}</span>
                        </div>
                        <p className="text-[8px] text-text-muted font-mono truncate">{p.email}</p>
                        <div className="flex justify-between text-[9px] mt-1.5">
                          <span className="text-text-muted">{p.country || '—'}</span>
                          <span className="text-white font-bold">Trust: {p.trust_score || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Review Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-[500px] bg-surface border-2 border-info/30 rounded-xl p-5 md:p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6 border-b border-border pb-4">
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter truncate">{selectedUser.company_name || selectedUser.display_name || 'User'}</h2>
                <p className="text-[9px] font-mono text-text-muted uppercase truncate">{selectedUser.email} · {selectedUser.country || 'Unknown'}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-text-muted hover:text-white transition-colors flex-shrink-0 ml-2">✕</button>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Phone', value: selectedUser.phone },
                { label: 'Address', value: selectedUser.address },
                { label: 'Bio', value: selectedUser.bio },
                { label: 'Reg ID', value: selectedUser.registration_id },
                { label: 'Joined', value: new Date(selectedUser.created_at).toLocaleDateString() },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-background rounded-lg border border-border gap-2">
                  <span className="text-[9px] font-bold text-text-muted uppercase flex-shrink-0">{item.label}</span>
                  <span className="text-[9px] font-bold text-white truncate text-right">{item.value || '—'}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => handleVerify(selectedUser.user_id)} className="flex-1 py-3 bg-primary text-background font-black uppercase text-[10px] rounded-xl hover:bg-primary-hover transition-all tracking-widest">Approve</button>
              <button onClick={() => setSelectedUser(null)} className="px-6 py-3 border border-danger text-danger font-black uppercase text-[10px] rounded-xl hover:bg-danger/10 transition-all">Close</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default AdminConsole;
