
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="p-6 md:p-12 max-w-[1000px] mx-auto animate-in fade-in duration-500 pb-24 lg:pb-12">
      <div className="mb-16 border-b border-border pb-12">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none glow-text">System Tuning</h1>
        <p className="text-textMuted font-mono text-xs uppercase tracking-widest mt-2">Personalize your sourcing node protocol</p>
      </div>

      <div className="space-y-12">
        {/* Terminal Aesthetics */}
        <section className="bg-surface border border-border p-10 rounded-[40px]">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-10 border-b border-border pb-6 flex items-center gap-3">
             <span className="text-primary">🎨</span> Interface Visual Matrix
          </h3>
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white font-black text-sm uppercase mb-1">High-Contrast Scanlines</h4>
                <p className="text-[10px] text-textMuted uppercase font-mono">Simulate CRT terminal visual distortion layer</p>
              </div>
              <div className="w-12 h-6 bg-primary/20 rounded-full p-1 cursor-pointer">
                 <div className="w-4 h-4 bg-primary rounded-full float-right"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white font-black text-sm uppercase mb-1">Monospaced Clarity Mode</h4>
                <p className="text-[10px] text-textMuted uppercase font-mono">Optimize typography for high-density data reading</p>
              </div>
              <div className="w-12 h-6 bg-border rounded-full p-1 cursor-pointer">
                 <div className="w-4 h-4 bg-textMuted rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Routing */}
        <section className="bg-surface border border-border p-10 rounded-[40px]">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-10 border-b border-border pb-6 flex items-center gap-3">
             <span className="text-info">📡</span> Signal Routing Protocols
          </h3>
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white font-black text-sm uppercase mb-1">Instant Price Alerts</h4>
                <p className="text-[10px] text-textMuted uppercase font-mono">Direct push notifications when crop targets are met</p>
              </div>
              <div className="w-12 h-6 bg-primary/20 rounded-full p-1 cursor-pointer">
                 <div className="w-4 h-4 bg-primary rounded-full float-right"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white font-black text-sm uppercase mb-1">Shipment Telemetry</h4>
                <p className="text-[10px] text-textMuted uppercase font-mono">Alerts for port arrival and inspection passes</p>
              </div>
              <div className="w-12 h-6 bg-primary/20 rounded-full p-1 cursor-pointer">
                 <div className="w-4 h-4 bg-primary rounded-full float-right"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Matrix */}
        <section className="bg-surface border border-border p-10 rounded-[40px]">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-10 border-b border-border pb-6 flex items-center gap-3">
             <span className="text-danger">🛡️</span> Security Clearance Node
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
             <div className="p-6 bg-background rounded-2xl border border-border">
                <p className="text-[9px] text-textMuted uppercase mb-4">Master Terminal Key</p>
                <div className="flex items-center justify-between">
                   <span className="text-white text-xs">••••••••••••••••</span>
                   <button className="text-[9px] text-primary font-bold uppercase hover:underline">Revoke</button>
                </div>
             </div>
             <div className="p-6 bg-background rounded-2xl border border-border">
                <p className="text-[9px] text-textMuted uppercase mb-4">Biometric Verification</p>
                <div className="flex items-center justify-between">
                   <span className="text-danger text-xs font-bold uppercase">UNCONFIGURED</span>
                   <button className="text-[9px] text-primary font-bold uppercase hover:underline">Setup</button>
                </div>
             </div>
          </div>
        </section>

        <div className="pt-10 flex justify-end gap-6">
           <button className="px-10 py-4 border border-border text-textMuted font-black uppercase text-xs rounded-xl hover:text-white transition-colors tracking-widest">Restore Defaults</button>
           <button className="px-10 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:scale-105 transition-transform tracking-widest">Apply Tuning</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
