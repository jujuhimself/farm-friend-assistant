
import React, { useState } from 'react';
import PageShell from '../components/PageShell';

interface ProfileProps {
  userRole: string;
  onLogout: () => void;
  profile: any;
  onUpdateProfile: (updates: Record<string, any>) => Promise<void>;
}

const Profile: React.FC<ProfileProps> = ({ userRole, onLogout, profile, onUpdateProfile }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    company_name: profile?.company_name || '',
    display_name: profile?.display_name || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    address: profile?.address || '',
    bio: profile?.bio || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try { await onUpdateProfile(form); setEditing(false); }
    catch (e) { console.error('Profile update failed:', e); }
    finally { setSaving(false); }
  };

  const email = profile?.email || '';

  return (
    <PageShell
      title="My Profile"
      subtitle={`Role: ${userRole.toUpperCase()} · ${profile?.verified ? 'Verified ✓' : 'Unverified'}`}
      rightContent={
        <div className="flex gap-2">
          {!editing && (
            <button onClick={() => setEditing(true)} className="px-4 py-2 bg-surface border border-border text-text-secondary rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">Edit</button>
          )}
          <button onClick={onLogout} className="px-4 py-2 bg-danger/10 text-danger border border-danger/30 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all">Sign Out</button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface border border-border p-4 md:p-6 rounded-xl">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Company Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Company Name', key: 'company_name', value: form.company_name },
                { label: 'Display Name', key: 'display_name', value: form.display_name },
                { label: 'Email', key: 'email', value: email, readOnly: true },
                { label: 'Phone', key: 'phone', value: form.phone },
                { label: 'Country', key: 'country', value: form.country },
                { label: 'Address', key: 'address', value: form.address },
              ].map(field => (
                <div key={field.key} className="space-y-1.5">
                  <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">{field.label}</p>
                  {editing && !field.readOnly ? (
                    <input type="text" value={field.value} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-mono text-white outline-none focus:border-primary transition-all" />
                  ) : (
                    <p className="text-sm font-bold text-white truncate">{field.value || '—'}</p>
                  )}
                </div>
              ))}
            </div>
            {editing && (
              <div className="space-y-1.5 mt-4">
                <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">Bio</p>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-mono text-white outline-none focus:border-primary transition-all resize-none" />
              </div>
            )}
            {editing && (
              <div className="mt-4 flex gap-3">
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-primary text-background font-black uppercase text-[10px] rounded-lg hover:bg-primary-hover transition-all tracking-widest disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => setEditing(false)} className="px-6 py-2.5 border border-border text-text-muted font-black uppercase text-[10px] rounded-lg hover:bg-surface transition-all">Cancel</button>
              </div>
            )}
          </div>

          <div className="bg-surface border border-border p-4 md:p-6 rounded-xl">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-5">Account Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[9px] text-text-muted font-black uppercase mb-1">Trust Score</p>
                <p className="text-2xl font-black text-white tracking-tighter">{profile?.trust_score || 0}<span className="text-primary text-xs ml-0.5">/100</span></p>
              </div>
              <div>
                <p className="text-[9px] text-text-muted font-black uppercase mb-1">Since</p>
                <p className="text-2xl font-black text-white tracking-tighter">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-text-muted font-black uppercase mb-1">Status</p>
                <p className={`text-2xl font-black tracking-tighter ${profile?.verified ? 'text-primary' : 'text-warning'}`}>
                  {profile?.verified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-primary/5 border border-primary/20 p-4 md:p-5 rounded-xl">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Account Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Role', value: userRole.toUpperCase(), color: 'text-primary' },
                { label: 'Email Verified', value: profile?.email ? 'Yes' : 'No', color: 'text-primary' },
                { label: 'Profile Complete', value: profile?.company_name ? 'Yes' : 'No', color: profile?.company_name ? 'text-primary' : 'text-warning' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center border-b border-border pb-2 last:border-0">
                  <span className="text-[9px] font-mono text-text-muted uppercase">{stat.label}</span>
                  <span className={`text-[9px] font-black uppercase ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Profile;
