
import React, { useState, useEffect } from 'react';
import { COMMODITIES } from '../constants';

interface CheckoutProps {
  item: any | null;
  onComplete: () => void;
  onCancel: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ item, onComplete, onCancel }) => {
  const [incoterm, setIncoterm] = useState('FOB');
  const [quantity, setQuantity] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!item) {
    useEffect(() => onCancel(), []);
    return null;
  }

  // Business Model Pricing
  const basePrice = item.price * quantity;
  const shippingCost = incoterm === 'CIF' ? quantity * 45 : 0;
  const docFee = 1250; // Export facilitation fee
  const platformFee = basePrice * 0.035; // 3.5% transaction fee
  const total = basePrice + shippingCost + docFee + platformFee;

  const handleExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2500);
  };

  const recommendations = COMMODITIES.filter(c => c.ticker !== item.ticker).slice(0, 2);

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 md:mb-12 border-l-4 border-primary pl-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-4xl font-black mb-2 tracking-tighter uppercase">Trade Finalization</h1>
          <p className="text-textMuted font-mono text-xs md:text-sm uppercase tracking-widest">Escrow Execution Protocol // SECURE_LINE</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-bold text-primary uppercase">AI_TRUST_SCORE</p>
          <p className="text-xl font-black text-white">98.4%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Configuration & Intelligence */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface border border-border p-6 rounded-2xl">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-6 border-b border-border pb-4 flex items-center gap-2">
              <span className="text-primary text-lg">⚙️</span> ORDER_CONFIG
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Trade Volume (MT)</label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-24 bg-background border border-primary/30 rounded-lg px-3 py-2 text-primary font-mono font-bold focus:outline-none focus:border-primary"
                    />
                    <span className="text-xs text-textSecondary uppercase font-bold tracking-widest">Metric Tons</span>
                  </div>
                  <input 
                    type="range" min="1" max="1000" step="5" 
                    value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 rounded-full"
                  />
                  <p className="text-[9px] text-textMuted font-mono italic">MIN: 1 MT // MAX: 1,000 MT CAP</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Delivery Term (Incoterm)</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    {['EXW', 'FOB', 'CIF'].map(term => (
                      <button
                        key={term}
                        onClick={() => setIncoterm(term)}
                        className={`flex-1 py-3 text-[10px] font-black border transition-all rounded-xl tracking-widest ${
                          incoterm === term ? 'bg-primary text-black border-primary' : 'bg-background text-textMuted border-border hover:border-textMuted'
                        }`}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-textMuted font-mono">
                    {incoterm === 'CIF' ? 'INCLUDES SHIPPING & INSURANCE TO PORT' : 'EXCLUDES INTERNATIONAL FREIGHT'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6">
               <div className="space-y-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Final Destination / Discharge Port</label>
                <input 
                  type="text" placeholder="ENTER PORT NAME OR WAREHOUSE COORDS..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-4 text-xs font-mono focus:border-primary outline-none uppercase tracking-wider text-white"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-3 bg-background border border-border px-4 py-3 rounded-xl cursor-pointer flex-1 group hover:border-primary/50 transition-colors">
                  <input type="checkbox" className="accent-primary w-4 h-4" defaultChecked />
                  <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest group-hover:text-white">Request Quality Inspection</span>
                </label>
                <label className="flex items-center gap-3 bg-background border border-border px-4 py-3 rounded-xl cursor-pointer flex-1 group hover:border-info/50 transition-colors">
                  <input type="checkbox" className="accent-info w-4 h-4" />
                  <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest group-hover:text-white">Include Fumigation Cert</span>
                </label>
              </div>
            </div>
          </div>

          {/* Shipment Intelligence Pre-Check */}
          <div className="bg-info/5 border border-info/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
               <span className="text-[9px] bg-info text-white px-2 py-0.5 rounded font-bold uppercase tracking-widest animate-pulse">Live Predictive</span>
            </div>
            <h3 className="text-[11px] font-black text-info uppercase tracking-[0.2em] mb-4">Shipment Intelligence Report</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono">
              <div className="space-y-2">
                <p className="text-[9px] text-textMuted font-bold uppercase tracking-widest">Est. Transit Confidence</p>
                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: '92%' }}></div>
                </div>
                <p className="text-[10px] text-white">92% ON-TIME PROJECTION</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] text-textMuted font-bold uppercase tracking-widest">Route Analysis</p>
                <p className="text-[10px] text-warning uppercase">MODERATE CONGESTION @ DAR PORT (+1 DAY)</p>
              </div>
            </div>
          </div>

          {/* AI Cross-Sourcing Suggestions */}
          <div className="bg-surface border border-border p-6 rounded-2xl">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="text-warning">✨</span> AI_SOURCING_RECOMMENDATIONS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map(c => (
                <div key={c.ticker} className="flex items-center gap-4 bg-background border border-border p-3 rounded-xl hover:border-primary/50 cursor-pointer transition-colors group">
                   <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">📦</div>
                   <div>
                     <p className="text-[10px] font-black text-white uppercase">{c.name}</p>
                     <p className="text-[9px] text-primary uppercase font-bold tracking-widest">Add to buffer @ ${c.price}/MT</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface border-2 border-primary/40 p-8 rounded-2xl relative overflow-hidden shadow-2xl shadow-primary/10 sticky top-[80px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
            
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-border pb-4">Trade Execution Matrix</h3>
            
            <div className="space-y-5 font-mono text-xs">
              <div className="flex justify-between items-end">
                <span className="text-textMuted uppercase tracking-widest">Commodity Stock</span>
                <span className="text-white text-right uppercase font-bold">{item.crop} <br/> <span className="text-[9px] font-normal text-textMuted">ORIGIN: {item.origin}</span></span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-4">
                <span className="text-textMuted uppercase tracking-widest">Contract Unit</span>
                <span className="text-white font-bold">${item.price}/MT</span>
              </div>
              
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-textMuted">BASE ORDER VALUE</span>
                  <span className="text-white font-bold">${basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">LOGISTICS CAP ({incoterm})</span>
                  <span className="text-white font-bold">${shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">EXPORT FACILITATION</span>
                  <span className="text-white font-bold">${docFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textMuted">PLATFORM FEE (3.5%)</span>
                  <span className="text-white font-bold">${platformFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t-2 border-primary border-double flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Final Transaction Value</p>
                  <p className="text-[9px] text-textMuted font-bold uppercase mt-1">Net Escrow Amount (USD)</p>
                </div>
                <div className="text-right">
                   <p className="text-4xl font-black text-white tracking-tighter">${total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <button 
                onClick={handleExecute}
                disabled={isProcessing}
                className="w-full py-5 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all shadow-xl shadow-primary/20 tracking-[0.2em] disabled:opacity-50 relative overflow-hidden group"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
                    SYNCING_UPLINK...
                  </span>
                ) : (
                  <span className="relative z-10">EXECUTE SECURE TRADE →</span>
                )}
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none"></div>
              </button>

              <button 
                onClick={onCancel}
                className="w-full py-3 text-[10px] font-black text-textMuted uppercase tracking-widest hover:text-danger transition-colors font-mono"
              >
                // TERMINATE_PROTOCOL
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-4 border-t border-border pt-6 opacity-40">
               <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4 filter grayscale invert" />
               <div className="h-4 w-px bg-border"></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-white">SECURE_ESCROW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
