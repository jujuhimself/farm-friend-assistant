
import React, { useState } from 'react';
import PageShell from '../components/PageShell';

interface SettingsProps {
  profile: any;
  onUpdateProfile: (updates: Record<string, any>) => Promise<void>;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdateProfile }) => {
  const [notifications, setNotifications] = useState({ priceAlerts: true, shipmentUpdates: true, newRfqs: true, newsletter: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdateProfile({ updated_at: new Date().toISOString() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-11 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${checked ? 'bg-primary/30' : 'bg-border'}`}>
      <div className={`w-4 h-4 rounded-full transition-all ${checked ? 'bg-primary translate-x-5' : 'bg-text-muted translate-x-0'}`} />
    </button>
  );

  return (
    <PageShell title="Settings" subtitle="Manage your preferences" maxWidth="1000px">
      <div className="space-y-4 md:space-y-6">
        <section className="bg-surface border border-border p-4 md:p-6 rounded-xl">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-5 border-b border-border pb-4 flex items-center gap-2">
            <span className="text-info">📡</span> Notifications
          </h3>
          <div className="space-y-4">
            {[
              { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when prices hit targets' },
              { key: 'shipmentUpdates', label: 'Shipment Updates', desc: 'Port arrival and inspection alerts' },
              { key: 'newRfqs', label: 'New RFQs', desc: 'Be notified of sourcing requests' },
              { key: 'newsletter', label: 'Weekly Report', desc: 'Weekly market intelligence digest' },
            ].map(item => (
              <div key={item.key} className="flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <h4 className="text-white font-bold text-xs uppercase mb-0.5">{item.label}</h4>
                  <p className="text-[9px] text-text-muted uppercase font-mono truncate">{item.desc}</p>
                </div>
                <Toggle checked={notifications[item.key as keyof typeof notifications]} onChange={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof notifications] }))} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface border border-border p-4 md:p-6 rounded-xl">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-5 border-b border-border pb-4 flex items-center gap-2">
            <span className="text-danger">🛡️</span> Security
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="text-[9px] text-text-muted uppercase mb-2 font-bold">Email</p>
              <p className="text-xs text-white font-bold truncate">{profile?.email || '—'}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="text-[9px] text-text-muted uppercase mb-2 font-bold">Password</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white">••••••••</span>
                <button className="text-[9px] text-primary font-bold uppercase hover:underline">Change</button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-primary text-background font-black uppercase text-[10px] rounded-lg hover:scale-[1.02] transition-transform tracking-widest disabled:opacity-50">
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Settings'}
          </button>
        </div>
      </div>
    </PageShell>
  );
};

export default Settings;
