
import React, { useState, useEffect } from 'react';
import { COMMODITIES } from '../constants';
import { supabase } from '../src/integrations/supabase/client';

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

  const [newAlert, setNewAlert] = useState({
    crop: 'MAZ',
    condition: 'BELOW',
    target: '',
  });

  const fetchAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await (supabase as any)
      .from('price_alerts')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .order('created_at', { ascending: false });
    if (data) setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAddAlert = async () => {
    if (!newAlert.target) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const cropObj = COMMODITIES.find(c => c.ticker === newAlert.crop);
    const { data, error } = await (supabase as any)
      .from('price_alerts')
      .insert([{
        user_id: user.id,
        crop: cropObj?.name || 'UNKNOWN',
        condition: newAlert.condition,
        target_price: parseFloat(newAlert.target),
        active: true,
      }])
      .select()
      .single();

    if (!error && data) {
      setAlerts(prev => [data, ...prev]);
      setNewAlert({ crop: 'MAZ', condition: 'BELOW', target: '' });
    }
  };

  const removeAlert = async (id: string) => {
    await (supabase as any).from('price_alerts').delete().eq('id', id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12 border-l-4 border-primary pl-6">
        <h1 className="text-2xl md:text-4xl font-black mb-2 tracking-tighter uppercase">Price Alert Matrix</h1>
        <p className="text-textMuted font-mono text-[10px] md:text-xs uppercase tracking-widest">Real-Time Trigger Management // Sourcing Node</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Creation Panel */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-surface border border-border p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-5xl">🔔</span>
              </div>
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-border pb-4">Initialize Trigger</h3>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Select Protocol</label>
                    <select 
                      value={newAlert.crop}
                      onChange={(e) => setNewAlert({...newAlert, crop: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-4 text-xs font-mono text-white focus:border-primary outline-none appearance-none uppercase"
                    >
                      {COMMODITIES.map(c => (
                        <option key={c.ticker} value={c.ticker}>{c.name}</option>
                      ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Condition Vector</label>
                    <div className="flex gap-2">
                       {['BELOW', 'ABOVE'].map(cond => (
                         <button
                           key={cond}
                           onClick={() => setNewAlert({...newAlert, condition: cond})}
                           className={`flex-1 py-3 text-[10px] font-black border transition-all rounded-xl tracking-widest ${
                             newAlert.condition === cond ? 'bg-primary text-black border-primary' : 'bg-background text-textMuted border-border hover:border-textMuted'
                           }`}
                         >
                           {cond}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Target Threshold (USD/MT)</label>
                    <input 
                      type="number"
                      value={newAlert.target}
                      onChange={(e) => setNewAlert({...newAlert, target: e.target.value})}
                      placeholder="ENTER VALUE..."
                      className="w-full bg-background border border-border rounded-xl px-4 py-4 text-xs font-mono focus:border-primary outline-none text-white uppercase"
                    />
                 </div>

                 <button 
                  onClick={handleAddAlert}
                  className="w-full py-5 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all shadow-xl shadow-primary/20 tracking-[0.2em]"
                 >
                   ARM_ALERT_NODE →
                 </button>
              </div>
           </div>
        </div>

        {/* Alerts List */}
        <div className="lg:col-span-8 space-y-6">
           <h3 className="text-sm font-black uppercase text-white tracking-widest border-l-4 border-primary pl-4">Active Sourcing Triggers</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 py-12 text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : alerts.length === 0 ? (
                <div className="col-span-2 py-20 text-center opacity-30 font-mono text-xs uppercase tracking-widest border border-dashed border-border rounded-2xl">
                   No Triggers Initialized
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="bg-surface border border-border p-6 rounded-2xl group hover:border-primary/50 transition-all relative overflow-hidden">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <h4 className="text-lg font-black text-white uppercase tracking-tight">{alert.crop}</h4>
                           <p className="text-[10px] text-textMuted font-mono uppercase tracking-widest">Status: Monitoring</p>
                        </div>
                        <button 
                          onClick={() => removeAlert(alert.id)}
                          className="text-textMuted hover:text-danger p-2 transition-colors"
                        >
                          ✕
                        </button>
                     </div>
                     
                     <div className="flex items-center gap-4 bg-background border border-border/50 p-4 rounded-xl">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${alert.condition === 'BELOW' ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'}`}>
                           {alert.condition === 'BELOW' ? '📉' : '📈'}
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-textMuted uppercase tracking-widest mb-1">Trigger condition</p>
                           <p className="text-[11px] font-black text-white uppercase">Notify if price goes {alert.condition} <span className="text-primary">${alert.target_price}/MT</span></p>
                        </div>
                     </div>

                     <div className="mt-6 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Uplink Active // Scanning Market Depth</span>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAlerts;
