
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationProps {
  onComplete: (role: 'buyer' | 'supplier') => void;
  onCancel: () => void;
  authActions: {
    signUp: (email: string, password: string, role: any, company: string, country: string) => Promise<any>;
    signIn: (email: string, password: string) => Promise<any>;
  };
}

const Registration: React.FC<RegistrationProps> = ({ onComplete, onCancel, authActions }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'persona' | 'details' | 'verifying'>('details');
  const [persona, setPersona] = useState<'buyer' | 'supplier'>('buyer');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    password: '',
    country: '',
  });

  const handleLogin = async () => {
    setError('');
    if (!formData.email || !formData.password) { setError('Email and password required'); return; }
    setStep('verifying');
    try {
      await authActions.signIn(formData.email, formData.password);
      // Auth state change in useAuth will handle the rest
      setTimeout(() => onComplete('buyer'), 500);
    } catch (e: any) {
      setError(e.message || 'Login failed');
      setStep('details');
    }
  };

  const handleSignup = async () => {
    setError('');
    if (!formData.email || !formData.password || !formData.company) { 
      setError('All fields required'); return; 
    }
    if (formData.password.length < 6) { setError('Password must be 6+ characters'); return; }
    setStep('verifying');
    try {
      await authActions.signUp(formData.email, formData.password, persona, formData.company, formData.country);
      setTimeout(() => onComplete(persona), 500);
    } catch (e: any) {
      setError(e.message || 'Signup failed');
      setStep('details');
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#00ff88_1px,_transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'verifying' ? (
          <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">📡</div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">
                {mode === 'login' ? 'Authenticating' : 'Creating Account'}
              </h2>
              <p className="text-[10px] text-primary font-mono animate-pulse tracking-[0.4em] uppercase">
                Establishing Secure Connection...
              </p>
            </div>
          </motion.div>
        ) : mode === 'signup' && step === 'persona' ? (
          <motion.div key="persona" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="md:col-span-2 text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 glow-text">Select Your Role</h1>
              <p className="text-textMuted font-mono text-sm uppercase tracking-widest">Choose how you'll use the platform</p>
            </div>
            <button onClick={() => { setPersona('buyer'); setStep('details'); }} className="bg-surface border-2 border-border p-10 rounded-3xl group hover:border-primary transition-all text-left">
              <div className="text-5xl mb-6">🏢</div>
              <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">International Buyer</h3>
              <p className="text-xs text-textSecondary leading-relaxed font-mono uppercase">Source verified Tanzanian crops for your global supply chain.</p>
              <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                <span className="text-[10px] font-black text-primary tracking-widest uppercase">Select</span>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </button>
            <button onClick={() => { setPersona('supplier'); setStep('details'); }} className="bg-surface border-2 border-border p-10 rounded-3xl group hover:border-warning transition-all text-left">
              <div className="text-5xl mb-6">🚜</div>
              <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">Tanzanian Supplier</h3>
              <p className="text-xs text-textSecondary leading-relaxed font-mono uppercase">List your inventory and reach global markets.</p>
              <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                <span className="text-[10px] font-black text-warning tracking-widest uppercase">Select</span>
                <span className="text-warning opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </button>
            <div className="md:col-span-2 text-center mt-4">
              <button onClick={onCancel} className="text-textMuted hover:text-white font-mono text-xs uppercase tracking-widest">Cancel</button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-lg bg-surface border border-border p-8 md:p-10 rounded-3xl relative z-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
                {mode === 'signup' && (
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                    Role: {persona.toUpperCase()}
                  </p>
                )}
              </div>
              {mode === 'signup' && step === 'details' && (
                <button onClick={() => setStep('persona')} className="text-textMuted hover:text-white text-sm">← Role</button>
              )}
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger text-xs font-bold p-3 rounded-xl mb-6 uppercase">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {mode === 'signup' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">Company Name</label>
                    <input type="text" className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-mono text-white outline-none focus:border-primary transition-all" placeholder="Your Company Ltd" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">Country</label>
                    <input type="text" className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-mono text-white outline-none focus:border-primary transition-all" placeholder="Tanzania" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">Email</label>
                <input type="email" className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-mono text-white outline-none focus:border-primary transition-all" placeholder="you@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-textMuted uppercase tracking-widest">Password</label>
                <input type="password" className="w-full bg-background border border-border rounded-xl px-5 py-4 text-sm font-mono text-white outline-none focus:border-primary transition-all" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>

              <button 
                onClick={mode === 'login' ? handleLogin : handleSignup}
                className="w-full py-5 bg-primary text-black font-black uppercase text-xs rounded-2xl tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {mode === 'login' ? 'Sign In →' : 'Create Account →'}
              </button>

              <div className="text-center pt-2">
                <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setStep(mode === 'login' ? 'persona' : 'details'); setError(''); }} className="text-xs text-textMuted hover:text-primary transition-colors font-mono uppercase tracking-widest">
                  {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={onCancel} className="text-textMuted hover:text-white font-mono text-[10px] uppercase tracking-widest">
                Continue as Guest
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Registration;
