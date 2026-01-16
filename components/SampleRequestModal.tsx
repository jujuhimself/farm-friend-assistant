
import React, { useState } from 'react';

interface SampleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any | null;
}

const SampleRequestModal: React.FC<SampleRequestModalProps> = ({ isOpen, onClose, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    address: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      console.log(`[SYSTEM] SAMPLE REQUEST INITIATED FOR ${item.crop} (${item.id})`);
      console.log(`[SYSTEM] DESTINATION: ${formData.address}`);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative w-full max-w-[500px] bg-surface border-2 border-primary p-8 rounded-2xl text-center">
          <div className="text-5xl mb-6">📦</div>
          <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-tighter">Request Transmitted</h2>
          <p className="text-textSecondary font-mono text-sm mb-8">
            YOUR SAMPLE REQUEST FOR <span className="text-white">[{item.crop}]</span> HAS BEEN LOGGED. 
            A TRACKING NUMBER WILL BE ISSUED ONCE DISPATCHED BY <span className="text-white">{item.supplier}</span>.
          </p>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all tracking-widest"
          >
            RETURN TO TERMINAL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-[600px] bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="h-[60px] border-b border-border flex items-center justify-between px-6 bg-background">
          <div className="flex items-center gap-3">
            <span className="text-primary">📦</span>
            <span className="text-xs font-bold text-white tracking-widest uppercase font-mono">Sample Request // {item.crop}</span>
          </div>
          <button onClick={onClose} className="text-textMuted hover:text-white transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl mb-6">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Stock Reference</p>
            <p className="text-xs text-white font-mono">{item.id} • {item.crop} • {item.origin}, TZ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Full Name</label>
              <input 
                required
                type="text"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all font-mono text-white"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Company</label>
              <input 
                required
                type="text"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all font-mono text-white"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Shipping Address (Full Details)</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all font-mono text-white resize-none"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Contact Phone</label>
              <input 
                required
                type="tel"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all font-mono text-white"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Contact Email</label>
              <input 
                required
                type="email"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all font-mono text-white"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all shadow-xl shadow-primary/10 tracking-widest disabled:opacity-50"
            >
              {isSubmitting ? 'TRANSMITTING...' : 'INITIATE REQUEST →'}
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 border border-border text-textSecondary font-bold uppercase text-xs rounded-xl hover:bg-white/5 transition-all"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SampleRequestModal;
