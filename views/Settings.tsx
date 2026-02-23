
import React, { useState } from 'react';

interface SettingsProps {
  profile: any;
  onUpdateProfile: (updates: Record<string, any>) => Promise<void>;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdateProfile }) => {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    shipmentUpdates: true,
    newRfqs: true,
    newsletter: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, save notification preferences to a separate table
      // For now just trigger a profile touch
      await onUpdateProfile({ updated_at: new Date().toISOString() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-primary/30' : 'bg-border'}`}>
      <div className={`w-4 h-4 rounded-full transition-all ${checked ? 'bg-primary translate-x-6' : 'bg-textMuted translate-x-0'}`}></div>
    </button>
  );

  return (
    <div className="p-6 md:p-12 max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-24 lg:pb-12">
      <div className="mb-12 border-b border-border pb-10">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Settings</h1>
        <p className="text-textMuted font-mono text-xs uppercase tracking-widest mt-2">Manage your preferences</p>
      </div>

      <div className="space-y-10">
        {/* Notifications */}
        <section className="bg-surface border border-border p-8 md:p-10 rounded-2xl">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 border-b border-border pb-6 flex items-center gap-3">
            <span className="text-info">📡</span> Notifications
          </h3>
          <div className="space-y-6">
            {[
              { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when crop prices hit your targets' },
              { key: 'shipmentUpdates', label: 'Shipment Updates', desc: 'Alerts for port arrival and inspection status' },
              { key: 'newRfqs', label: 'New RFQ Notifications', desc: 'Be notified of new sourcing requests' },
              { key: 'newsletter', label: 'Weekly Market Report', desc: 'Receive weekly market intelligence digest' },
            ].map(item => (
              <div key={item.key} className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-bold text-sm uppercase mb-1">{item.label}</h4>
                  <p className="text-[10px] text-textMuted uppercase font-mono">{item.desc}</p>
                </div>
                <Toggle 
                  checked={notifications[item.key as keyof typeof notifications]} 
                  onChange={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof notifications] }))} 
                />
              </div>
            ))}
          </div>
        </section>

        {/* Account Security */}
        <section className="bg-surface border border-border p-8 md:p-10 rounded-2xl">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 border-b border-border pb-6 flex items-center gap-3">
            <span className="text-danger">🛡️</span> Security
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-background rounded-xl border border-border">
              <p className="text-[10px] text-textMuted uppercase mb-3 font-bold">Email</p>
              <p className="text-sm text-white font-bold">{profile?.email || '—'}</p>
            </div>
            <div className="p-5 bg-background rounded-xl border border-border">
              <p className="text-[10px] text-textMuted uppercase mb-3 font-bold">Password</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">••••••••</span>
                <button className="text-[10px] text-primary font-bold uppercase hover:underline">Change</button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-10 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:scale-[1.02] transition-transform tracking-widest disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
