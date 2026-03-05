
import React, { useState } from 'react';
import { COMMODITIES } from '../constants';
import { supabase } from '../src/integrations/supabase/client';
import PageShell from '../components/PageShell';

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
        buyer_id: user.id, supplier_id: null, listing_id: item.id?.startsWith('P-') ? null : item.id,
        crop: item.crop, volume: `${quantity} MT`, price: item.price, total: Math.round(total * 100) / 100,
        incoterm, destination, status: 'ORDER CONFIRMED', payment_status: 'PENDING',
      }]);
      if (insertError) throw insertError;
      setTimeout(() => onComplete(), 1000);
    } catch (e: any) { setError(e.message || 'Order failed'); setIsProcessing(false); }
  };

  const recommendations = COMMODITIES.filter(c => c.ticker !== item.ticker).slice(0, 2);

  return (
    <PageShell title="Checkout" subtitle="Secure Trade Execution">
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-xs font-bold p-3 rounded-lg mb-4 uppercase">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface border border-border p-4 md:p-5 rounded-xl">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-4 border-b border-border pb-3">Order Config</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Qty (MT)</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} className="w-20 bg-background border border-primary/30 rounded-lg px-3 py-2 text-primary font-mono font-bold focus:outline-none focus:border-primary" />
                <input type="range" min="1" max="1000" step="5" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full accent-primary h-1.5 rounded-full" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Incoterm</label>
                <div className="flex gap-2">
                  {['EXW', 'FOB', 'CIF'].map(term => (
                    <button key={term} onClick={() => setIncoterm(term)} className={`flex-1 py-2.5 text-[10px] font-black border transition-all rounded-lg tracking-widest ${incoterm === term ? 'bg-primary text-background border-primary' : 'bg-background text-text-muted border-border'}`}>{term}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Destination</label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Dubai, UAE" className="w-full bg-background border border-border rounded-lg px-3 py-3 text-xs font-mono focus:border-primary outline-none text-white" />
            </div>
          </div>

          <div className="bg-surface border border-border p-4 rounded-xl">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
              <span className="text-warning">✨</span> You May Also Need
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendations.map(c => (
                <div key={c.ticker} className="flex items-center gap-3 bg-background border border-border p-3 rounded-lg hover:border-primary/50 cursor-pointer transition-colors">
                  <div className="text-xl opacity-50">📦</div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-white uppercase truncate">{c.name}</p>
                    <p className="text-[8px] text-primary uppercase font-bold">${c.price}/MT</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="bg-surface border-2 border-primary/40 p-5 md:p-6 rounded-xl sticky top-[80px]">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em] mb-5 border-b border-border pb-3">Summary</h3>
            <div className="space-y-3 font-mono text-xs">
              {[
                ['Product', item.crop],
                ['Origin', item.origin],
                ['Unit Price', `$${item.price}/${item.priceUnit?.split('/')[1] || 'MT'}`],
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between"><span className="text-text-muted uppercase">{label}</span><span className="text-white font-bold">{val}</span></div>
              ))}
              <div className="border-t border-border/30 pt-3 space-y-2">
                {[
                  ['Base Value', `$${basePrice.toLocaleString()}`],
                  [`Logistics (${incoterm})`, `$${shippingCost.toLocaleString()}`],
                  ['Export Fee', `$${docFee.toLocaleString()}`],
                  ['Platform (3.5%)', `$${platformFee.toLocaleString()}`],
                ].map(([label, val], i) => (
                  <div key={i} className="flex justify-between"><span className="text-text-muted">{label}</span><span className="text-white font-bold">{val}</span></div>
                ))}
              </div>
              <div className="pt-4 border-t-2 border-primary border-double flex justify-between items-end">
                <p className="text-[9px] font-black text-primary uppercase">Total</p>
                <p className="text-2xl font-black text-white tracking-tighter">${total.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button onClick={handleExecute} disabled={isProcessing} className="w-full py-4 bg-primary text-background font-black uppercase text-xs rounded-lg hover:bg-primary-hover transition-all tracking-[0.15em] disabled:opacity-50">
                {isProcessing ? 'Processing...' : 'Place Order →'}
              </button>
              <button onClick={onCancel} className="w-full py-2 text-[9px] font-black text-text-muted uppercase tracking-widest hover:text-danger transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Checkout;
