
import React, { useState } from 'react';
import { COMMODITIES } from '../constants';
import { supabase } from '../src/integrations/supabase/client';

interface CheckoutProps {
  item: any | null;
  onComplete: () => void;
  onCancel: () => void;
  isAuthenticated: boolean;
  onRequireAuth: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ item, onComplete, onCancel, isAuthenticated, onRequireAuth }) => {
  const [incoterm, setIncoterm] = useState('FOB');
  const [quantity, setQuantity] = useState(10);
  const [destination, setDestination] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!item) return null;

  const basePrice = item.price * quantity;
  const shippingCost = incoterm === 'CIF' ? quantity * 45 : 0;
  const docFee = 1250;
  const platformFee = basePrice * 0.035;
  const total = basePrice + shippingCost + docFee + platformFee;

  const handleExecute = async () => {
    if (!isAuthenticated) { onRequireAuth(); return; }
    if (!destination) { setError('Destination is required'); return; }
    
    setIsProcessing(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: insertError } = await (supabase as any).from('orders').insert([{
        buyer_id: user.id,
        supplier_id: null,
        listing_id: item.id?.startsWith('P-') ? null : item.id,
        crop: item.crop,
        volume: `${quantity} MT`,
        price: item.price,
        total: Math.round(total * 100) / 100,
        incoterm,
        destination,
        status: 'ORDER CONFIRMED',
        payment_status: 'PENDING',
      }]);

      if (insertError) throw insertError;
      setTimeout(() => onComplete(), 1000);
    } catch (e: any) {
      setError(e.message || 'Order failed');
      setIsProcessing(false);
    }
  };

  const recommendations = COMMODITIES.filter(c => c.ticker !== item.ticker).slice(0, 2);

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 md:mb-12 border-l-4 border-primary pl-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-4xl font-black mb-2 tracking-tighter uppercase">Checkout</h1>
          <p className="text-textMuted font-mono text-xs uppercase tracking-widest">Secure Trade Execution</p>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-xs font-bold p-4 rounded-xl mb-6 uppercase">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface border border-border p-6 rounded-2xl">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-6 border-b border-border pb-4">Order Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Quantity (MT)</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="w-24 bg-background border border-primary/30 rounded-lg px-3 py-2 text-primary font-mono font-bold focus:outline-none focus:border-primary" />
                <input type="range" min="1" max="1000" step="5" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full accent-primary h-1.5 rounded-full" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Incoterm</label>
                <div className="flex gap-2">
                  {['EXW', 'FOB', 'CIF'].map(term => (
                    <button key={term} onClick={() => setIncoterm(term)} className={`flex-1 py-3 text-[10px] font-black border transition-all rounded-xl tracking-widest ${incoterm === term ? 'bg-primary text-black border-primary' : 'bg-background text-textMuted border-border hover:border-textMuted'}`}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-2">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Destination Port / Warehouse</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Dubai, UAE" className="w-full bg-background border border-border rounded-xl px-4 py-4 text-xs font-mono focus:border-primary outline-none text-white" />
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-surface border border-border p-6 rounded-2xl">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="text-warning">✨</span> You Might Also Need
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map(c => (
                <div key={c.ticker} className="flex items-center gap-4 bg-background border border-border p-3 rounded-xl hover:border-primary/50 cursor-pointer transition-colors group">
                  <div className="text-2xl opacity-50 group-hover:opacity-100">📦</div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase">{c.name}</p>
                    <p className="text-[9px] text-primary uppercase font-bold">${c.price}/MT</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-surface border-2 border-primary/40 p-8 rounded-2xl relative overflow-hidden shadow-2xl shadow-primary/10 sticky top-[80px]">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-8 border-b border-border pb-4">Order Summary</h3>
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-end">
                <span className="text-textMuted uppercase">Product</span>
                <span className="text-white font-bold uppercase">{item.crop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMuted uppercase">Origin</span>
                <span className="text-white font-bold">{item.origin}</span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-4">
                <span className="text-textMuted uppercase">Unit Price</span>
                <span className="text-white font-bold">${item.price}/{item.priceUnit?.split('/')[1] || 'MT'}</span>
              </div>
              <div className="flex justify-between"><span className="text-textMuted">Base Value</span><span className="text-white font-bold">${basePrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-textMuted">Logistics ({incoterm})</span><span className="text-white font-bold">${shippingCost.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-textMuted">Export Fee</span><span className="text-white font-bold">${docFee.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-textMuted">Platform (3.5%)</span><span className="text-white font-bold">${platformFee.toLocaleString()}</span></div>
              <div className="mt-6 pt-6 border-t-2 border-primary border-double flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase">Total</p>
                </div>
                <p className="text-3xl font-black text-white tracking-tighter">${total.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button onClick={handleExecute} disabled={isProcessing} className="w-full py-5 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all shadow-xl shadow-primary/20 tracking-[0.2em] disabled:opacity-50">
                {isProcessing ? 'Processing...' : 'Place Order →'}
              </button>
              <button onClick={onCancel} className="w-full py-3 text-[10px] font-black text-textMuted uppercase tracking-widest hover:text-danger transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
