
import React, { useState, useEffect } from 'react';
import { COMMODITIES } from '../constants';
import { supabase } from '../src/integrations/supabase/client';
import PageShell from '../components/PageShell';

interface PriceAlert {
  id: string;
  crop: string;
  condition: string;
  target_price: number;
  active: boolean;
}

const PriceAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAlert, setNewAlert] = useState({ crop: 'MAZ', condition: 'BELOW', target: '' });

  const fetchAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await (supabase as any).from('price_alerts').select('*').eq('user_id', user.id).eq('active', true).order('created_at', { ascending: false });
      if (data) setAlerts(data);
    } catch (err) { console.error('Alert fetch failed:', err); }
    setLoading(false);
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleAddAlert = async () => {
    if (!newAlert.target) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const cropObj = COMMODITIES.find(c => c.ticker === newAlert.crop);
      const { data, error } = await (supabase as any).from('price_alerts').insert([{
        user_id: user.id, crop: cropObj?.name || 'UNKNOWN', condition: newAlert.condition, target_price: parseFloat(newAlert.target), active: true,
      }]).select().single();
      if (!error && data) { setAlerts(prev => [data, ...prev]); setNewAlert({ crop: 'MAZ', condition: 'BELOW', target: '' }); }
    } catch (err) { console.error('Add alert failed:', err); }
  };

  const removeAlert = async (id: string) => {
    await (supabase as any).from('price_alerts').delete().eq('id', id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <PageShell title="Price Alert Matrix" subtitle="Real-Time Trigger Management // Sourcing Node">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
        {/* Creation */}
        <div className="lg:col-span-4">
          <div className="bg-surface border border-border p-4 md:p-6 rounded-xl space-y-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] border-b border-border pb-3">Initialize Trigger</h3>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Commodity</label>
              <select value={newAlert.crop} onChange={(e) => setNewAlert({...newAlert, crop: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-3 text-xs font-mono text-white focus:border-primary outline-none appearance-none uppercase">
                {COMMODITIES.map(c => <option key={c.ticker} value={c.ticker}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Condition</label>
              <div className="flex gap-2">
                {['BELOW', 'ABOVE'].map(cond => (
                  <button key={cond} onClick={() => setNewAlert({...newAlert, condition: cond})} className={`flex-1 py-2.5 text-[10px] font-black border transition-all rounded-lg tracking-widest ${newAlert.condition === cond ? 'bg-primary text-background border-primary' : 'bg-background text-text-muted border-border hover:border-text-muted'}`}>{cond}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Target (USD/MT)</label>
              <input type="number" value={newAlert.target} onChange={(e) => setNewAlert({...newAlert, target: e.target.value})} placeholder="ENTER VALUE..." className="w-full bg-background border border-border rounded-lg px-3 py-3 text-xs font-mono focus:border-primary outline-none text-white uppercase" />
            </div>
            <button onClick={handleAddAlert} className="w-full py-3 bg-primary text-background font-black uppercase text-[10px] rounded-lg hover:bg-primary-hover transition-all tracking-[0.15em]">ARM ALERT →</button>
          </div>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-[10px] font-black uppercase text-white tracking-widest border-l-4 border-primary pl-3">Active Triggers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {loading ? (
              <div className="col-span-2 py-10 text-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : alerts.length === 0 ? (
              <div className="col-span-2 py-14 text-center opacity-30 font-mono text-xs uppercase tracking-widest border border-dashed border-border rounded-xl">No Triggers</div>
            ) : alerts.map(alert => (
              <div key={alert.id} className="bg-surface border border-border p-4 rounded-xl hover:border-primary/50 transition-all relative">
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">{alert.crop}</h4>
                    <p className="text-[9px] text-text-muted font-mono uppercase">Monitoring</p>
                  </div>
                  <button onClick={() => removeAlert(alert.id)} className="text-text-muted hover:text-danger p-1 transition-colors flex-shrink-0">✕</button>
                </div>
                <div className="flex items-center gap-3 bg-background border border-border/50 p-3 rounded-lg">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${alert.condition === 'BELOW' ? 'bg-primary/10' : 'bg-info/10'}`}>
                    {alert.condition === 'BELOW' ? '📉' : '📈'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-0.5">Trigger</p>
                    <p className="text-[10px] font-black text-white uppercase truncate">If {alert.condition} <span className="text-primary">${alert.target_price}/MT</span></p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[8px] font-black text-primary uppercase tracking-widest">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default PriceAlerts;
