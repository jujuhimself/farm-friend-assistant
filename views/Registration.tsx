
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationProps {
  onComplete: (role: 'buyer' | 'supplier') => void;
  onCancel: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'persona' | 'details' | 'verifying'>('persona');
  const [persona, setPersona] = useState<'buyer' | 'supplier' | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    country: '',
    regId: ''
  });

  const handleFinalize = () => {
    setStep('verifying');
    setTimeout(() => {
      if (persona) onComplete(persona);
    }, 3000);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background HUD Graphics */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#00ff88_1px,_transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'persona' && (
          <motion.div 
            key="persona"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
          >
            <div className="md:col-span-2 text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 glow-text">Initialize Persona</h1>
              <p className="text-textMuted font-mono text-sm uppercase tracking-widest">Select your operational node type to continue</p>
            </div>

            <button 
              onClick={() => { setPersona('buyer'); setStep('details'); }}
              className="bg-surface border-2 border-border p-10 rounded-3xl group hover:border-primary transition-all text-left relative overflow-hidden"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">Global Sourcing Node</h3>
              <p className="text-xs text-textSecondary leading-relaxed font-mono uppercase">For international buying houses, processors, and importers seeking verified Tanzanian supply chains.</p>
              <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                 <span className="text-[10px] font-black text-primary tracking-widest uppercase">Select Node</span>
                 <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </button>

            <button 
              onClick={() => { setPersona('supplier'); setStep('details'); }}
              className="bg-surface border-2 border-border p-10 rounded-3xl group hover:border-warning transition-all text-left relative overflow-hidden"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🚜</div>
              <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">Regional Aggregator Node</h3>
              <p className="text-xs text-textSecondary leading-relaxed font-mono uppercase">For Tanzanian cooperatives, farm aggregators, and warehouses seeking global market access.</p>
              <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                 <span className="text-[10px] font-black text-warning tracking-widest uppercase">Select Node</span>
                 <span className="text-warning opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </button>

            <div className="md:col-span-2 text-center mt-8">
              <button onClick={onCancel} className="text-textMuted hover:text-white font-mono text-xs uppercase tracking-widest">Abort Protocol</button>
            </div>
          </motion.div>
        )}

        {step === 'details' && (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-surface border border-border p-10 rounded-[40px] relative z-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
               <div>
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">Node Registration</h2>
                 <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Persona: {persona?.toUpperCase()}</p>
               </div>
               <button onClick={() => setStep('persona')} className="text-textMuted hover:text-white">←</button>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">Corporate Identity (Company Name)</label>
                 <input 
                  type="text" 
                  className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-mono text-white outline-none focus:border-primary transition-all uppercase"
                  placeholder="ENTER COMPANY NAME..."
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">Terminal Communications (Email)</label>
                 <input 
                  type="email" 
                  className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-mono text-white outline-none focus:border-primary transition-all"
                  placeholder="NAME@CORP.COM"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">Base Region</label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-mono text-white outline-none focus:border-primary transition-all uppercase"
                      placeholder="COUNTRY"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">Registration ID</label>
                    <input 
                      type="text" 
                      className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-mono text-white outline-none focus:border-primary transition-all uppercase"
                      placeholder="REG-000-X"
                      value={formData.regId}
                      onChange={(e) => setFormData({...formData, regId: e.target.value})}
                    />
                  </div>
               </div>

               <div className="pt-6">
                  <button 
                    onClick={handleFinalize}
                    className="w-full py-5 bg-primary text-black font-black uppercase text-xs rounded-2xl tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    Execute Handshake →
                  </button>
               </div>
            </div>
          </motion.div>
        )}

        {step === 'verifying' && (
          <motion.div 
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-8"
          >
            <div className="relative w-32 h-32 mx-auto">
               <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center text-4xl">📡</div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Syncing with Node</h2>
              <p className="text-[10px] text-primary font-mono animate-pulse tracking-[0.4em] uppercase">Encrypting_Credentials // Establishing_Uplink</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Registration;
