
import React from 'react';
import { motion } from 'framer-motion';

const Profile: React.FC<{ userRole: string, onLogout: () => void }> = ({ userRole, onLogout }) => {
  return (
    <div className="p-6 md:p-12 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-24 lg:pb-12">
      <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border pb-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter glow-text leading-none">Corporate DNA</h1>
          <p className="text-textMuted font-mono text-xs uppercase tracking-widest">
            TERMINAL_AUTH: ACTIVE // NODE_v8.4 // PERSONA: {userRole.toUpperCase()}
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="px-8 py-3 bg-danger/10 text-danger border border-danger/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all"
        >
          Terminate Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Identity Matrix */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface border border-border p-10 rounded-[40px] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 font-mono text-5xl font-black pointer-events-none uppercase">ID_MATRIX</div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Core Credentials
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-mono">
              <div className="space-y-1">
                <p className="text-[9px] text-textMuted font-black uppercase tracking-widest">Corporate Entity</p>
                <p className="text-xl font-black text-white uppercase tracking-tight">AgriCorp Global GMBH</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-textMuted font-black uppercase tracking-widest">Verification Tier</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-primary">GOLD_VERIFIED</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">AAA</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-textMuted font-black uppercase tracking-widest">Registered Headquarters</p>
                <p className="text-lg font-black text-white uppercase">Hamburg, DE // Terminal_Node_4</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-textMuted font-black uppercase tracking-widest">Auth Account Email</p>
                <p className="text-lg font-black text-white">sourcing@agricorp-global.com</p>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-border flex flex-wrap gap-12">
               <div>
                  <p className="text-[9px] text-textMuted font-black uppercase mb-2">Trade Trust Score</p>
                  <p className="text-3xl font-black text-white tracking-tighter">98.4<span className="text-primary text-sm ml-1">/100</span></p>
               </div>
               <div>
                  <p className="text-[9px] text-textMuted font-black uppercase mb-2">Platform Seniority</p>
                  <p className="text-3xl font-black text-white tracking-tighter">24<span className="text-textMuted text-sm ml-1">MONTHS</span></p>
               </div>
               <div>
                  <p className="text-[9px] text-textMuted font-black uppercase mb-2">Audit Compliance</p>
                  <p className="text-3xl font-black text-primary tracking-tighter">100%</p>
               </div>
            </div>
          </div>

          <div className="bg-surface border border-border p-10 rounded-[40px]">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8">Platform Ledger (Mocked)</h3>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-background p-8 rounded-3xl border border-border">
               <div>
                 <p className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-1">Escrowed Balance</p>
                 <p className="text-5xl font-black text-white tracking-tighter">$42,300.00</p>
               </div>
               <div className="flex gap-4">
                  <button className="px-8 py-3 bg-white text-black font-black uppercase text-[10px] rounded-xl hover:bg-primary transition-colors">Deposit</button>
                  <button className="px-8 py-3 border border-border text-white font-black uppercase text-[10px] rounded-xl hover:border-white transition-colors">Logs</button>
               </div>
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-primary/5 border border-primary/20 p-8 rounded-[40px]">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-6">Active Node Status</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Uplink Integrity', status: 'Optimal', color: 'text-primary' },
                   { label: 'Latency Node', status: '42ms', color: 'text-primary' },
                   { label: 'Encryption Protocol', status: 'AES-256-GCM', color: 'text-primary' },
                   { label: 'Sourcing Clearance', status: 'Level_4', color: 'text-info' },
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-border pb-4 last:border-0">
                     <span className="text-[10px] font-mono text-textMuted uppercase tracking-widest">{stat.label}</span>
                     <span className={`text-[10px] font-black uppercase ${stat.color}`}>{stat.status}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-surface border border-border p-8 rounded-[40px]">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Recent Log Access</h3>
              <div className="space-y-4">
                 {[
                   { event: 'SECURITY_LOGIN', time: '2H AGO', details: 'IP: 192.168.1.1' },
                   { event: 'TRADE_LOCK_EXEC', time: '1D AGO', details: 'ORD-98221' },
                   { event: 'DOC_UPLOAD_VERIFY', time: '3D AGO', details: 'SGS_REPORT_MAZ' },
                 ].map((log, i) => (
                   <div key={i} className="font-mono text-[10px] p-4 bg-background border border-border rounded-xl">
                      <div className="flex justify-between mb-1">
                        <span className="text-primary font-bold">{log.event}</span>
                        <span className="text-textMuted">{log.time}</span>
                      </div>
                      <p className="text-textSecondary opacity-60">{log.details}</p>
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
