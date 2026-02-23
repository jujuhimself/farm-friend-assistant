
import React, { useState } from 'react';

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
    try {
      await onUpdateProfile(form);
      setEditing(false);
    } catch (e) {
      console.error('Profile update failed:', e);
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.company_name || profile?.display_name || profile?.email || 'User';
  const email = profile?.email || '';

  return (
    <div className="p-6 md:p-12 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-24 lg:pb-12">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border pb-10">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">My Profile</h1>
          <p className="text-textMuted font-mono text-xs uppercase tracking-widest">
            Role: {userRole.toUpperCase()} · {profile?.verified ? 'Verified ✓' : 'Unverified'}
          </p>
        </div>
        <div className="flex gap-3">
          {!editing && (
            <button onClick={() => setEditing(true)} className="px-6 py-3 bg-surface border border-border text-textSecondary rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
              Edit Profile
            </button>
          )}
          <button onClick={onLogout} className="px-6 py-3 bg-danger/10 text-danger border border-danger/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all">
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface border border-border p-8 md:p-10 rounded-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Company Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Company Name', key: 'company_name', value: form.company_name },
                { label: 'Display Name', key: 'display_name', value: form.display_name },
                { label: 'Email', key: 'email', value: email, readOnly: true },
                { label: 'Phone', key: 'phone', value: form.phone },
                { label: 'Country', key: 'country', value: form.country },
                { label: 'Address', key: 'address', value: form.address },
              ].map(field => (
                <div key={field.key} className="space-y-2">
                  <p className="text-[10px] text-textMuted font-black uppercase tracking-widest">{field.label}</p>
                  {editing && !field.readOnly ? (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-primary transition-all"
                    />
                  ) : (
                    <p className="text-base font-bold text-white">{field.value || '—'}</p>
                  )}
                </div>
              ))}
            </div>

            {editing && (
              <div className="space-y-2 mt-8">
                <p className="text-[10px] text-textMuted font-black uppercase tracking-widest">Bio</p>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono text-white outline-none focus:border-primary transition-all resize-none"
                />
              </div>
            )}

            {editing && (
              <div className="mt-8 flex gap-4">
                <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-primary text-black font-black uppercase text-[10px] rounded-xl hover:bg-primaryHover transition-all tracking-widest disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditing(false)} className="px-8 py-3 border border-border text-textMuted font-black uppercase text-[10px] rounded-xl hover:bg-surface transition-all">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Platform Stats */}
          <div className="bg-surface border border-border p-8 md:p-10 rounded-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8">Account Overview</h3>
            <div className="flex flex-wrap gap-12">
              <div>
                <p className="text-[10px] text-textMuted font-black uppercase mb-2">Trust Score</p>
                <p className="text-3xl font-black text-white tracking-tighter">{profile?.trust_score || 0}<span className="text-primary text-sm ml-1">/100</span></p>
              </div>
              <div>
                <p className="text-[10px] text-textMuted font-black uppercase mb-2">Member Since</p>
                <p className="text-3xl font-black text-white tracking-tighter">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-textMuted font-black uppercase mb-2">Verification</p>
                <p className={`text-3xl font-black tracking-tighter ${profile?.verified ? 'text-primary' : 'text-warning'}`}>
                  {profile?.verified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-6">Account Status</h3>
            <div className="space-y-4">
              {[
                { label: 'Role', value: userRole.toUpperCase(), color: 'text-primary' },
                { label: 'Email Verified', value: profile?.email ? 'Yes' : 'No', color: 'text-primary' },
                { label: 'Profile Complete', value: profile?.company_name ? 'Yes' : 'No', color: profile?.company_name ? 'text-primary' : 'text-warning' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                  <span className="text-[10px] font-mono text-textMuted uppercase tracking-widest">{stat.label}</span>
                  <span className={`text-[10px] font-black uppercase ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
