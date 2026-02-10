
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { COMMODITIES } from '../constants';

interface CommodityDetailsProps {
  item: any | null;
  onBack: () => void;
  onBuyNow: (item: any) => void;
  onAddToCart: (item: any) => void;
}

const CommodityDetails: React.FC<CommodityDetailsProps> = ({ item, onBack, onBuyNow, onAddToCart }) => {
  const [activePhoto, setActivePhoto] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('process');

  if (!item) return null;

  const handleSuggestCounterOffer = async () => {
    setIsThinking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a B2B trade negotiator. Suggest a professional counter-offer for ${item.crop || item.name} at $${item.price}/MT. Focus on volume and payment terms. Max 60 words.`,
      });
      setAiSuggestion(response.text || "PROTOCOL_OFFLINE");
    } catch (error) {
      setAiSuggestion("CONNECTION_ERROR");
    } finally {
      setIsThinking(false);
    }
  };

  const relatedProducts = COMMODITIES.filter(c => c.ticker !== item.ticker).slice(0, 5);

  const stats = [
    { label: 'Style', value: item.ticker || 'G-X-2025' },
    { label: 'Colorway', value: 'Natural / Export Grade' },
    { label: 'Retail Price', value: `$${item.price - 15}` },
    { label: 'Release Date', value: '01/01/2025' },
    { label: 'Restock Date', value: '01/09/2026' },
  ];

  return (
    <div className="bg-background min-h-screen text-white pb-20">
      {/* Top Nav Breadcrumbs */}
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-mono text-textMuted uppercase tracking-wider">
          <button onClick={onBack} className="hover:text-white">Home</button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-white">Marketplace</button>
          <span>/</span>
          <span className="text-white font-bold">{item.crop || item.name}</span>
        </div>
        <div className="flex gap-4">
          <button className="text-textMuted hover:text-white">♡</button>
          <button className="text-textMuted hover:text-white">⎗</button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
        
        {/* Left Column: Product Hero */}
        <div className="lg:col-span-7">
          <div className="bg-surface rounded-xl overflow-hidden aspect-square flex items-center justify-center relative border border-border">
             <motion.img 
              key={activePhoto}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={`https://picsum.photos/seed/${item.id}${activePhoto}/800/800`}
              className="w-full h-full object-contain p-12"
             />
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white" 
                  initial={{ width: 0 }} 
                  animate={{ width: '100%' }} 
                  transition={{ duration: 5, repeat: Infinity }}
                />
             </div>
          </div>
          
          {/* Related Products Carousel (StockX style) */}
          <div className="mt-16">
            <h3 className="text-lg font-bold mb-6">Related Products</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
              {relatedProducts.map((p, i) => (
                <div key={i} className="min-w-[180px] bg-surface border border-border rounded-xl p-4 hover:border-primary transition-all cursor-pointer">
                  <img src={`https://picsum.photos/seed/${p.ticker}/300/300`} className="w-full aspect-square object-contain mb-4 rounded-lg" />
                  <p className="text-[10px] font-bold uppercase truncate">{p.name}</p>
                  <p className="text-xs font-black mt-1">${p.price}</p>
                  <p className="text-[9px] text-textMuted mt-1">Last Sale: ${p.price - 5}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Buying Matrix */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tight">{item.crop || item.name}</h1>
            <p className="text-textMuted text-sm font-mono uppercase tracking-widest">Grade A Harvest (2025)</p>
          </div>

          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map(i => (
              <button key={i} onClick={() => setActivePhoto(i)} className={`w-16 h-12 rounded border-2 transition-all ${activePhoto === i ? 'border-white' : 'border-transparent'}`}>
                <img src={`https://picsum.photos/seed/${item.id}${i}/100/100`} className="w-full h-full object-cover rounded" />
              </button>
            ))}
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-textMuted uppercase tracking-widest">Sourcing Quantity:</span>
              <div className="flex items-center gap-4">
                 <span className="text-white font-bold">ALL</span>
                 <span className="text-textMuted cursor-pointer">▼</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background border border-border p-4 rounded-xl">
                    <p className="text-[10px] text-textMuted uppercase font-bold tracking-widest mb-1">Buy Now for</p>
                    <p className="text-2xl font-black">${item.price}</p>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <p className="text-[11px] font-black text-primary uppercase">769 Sold</p>
                      <p className="text-[9px] text-primary/70 uppercase">In Last 3 Days!</p>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleSuggestCounterOffer}
                    className="py-4 border-2 border-white text-white font-black uppercase text-xs rounded-xl hover:bg-white hover:text-black transition-all"
                  >
                    {isThinking ? 'Calculating...' : 'Make Offer'}
                  </button>
                  <button 
                    onClick={() => onBuyNow(item)}
                    className="py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all shadow-xl shadow-primary/10"
                  >
                    Buy Now
                  </button>
               </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border/50 text-xs font-mono">
               <div className="text-textMuted">Last Sale: <span className="text-white">${item.price - 8}</span></div>
               <button className="text-primary hover:underline uppercase font-bold tracking-widest text-[10px]">View Market Data</button>
            </div>
          </div>

          {aiSuggestion && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-info/10 border border-info/30 p-5 rounded-xl text-[11px] font-mono text-info uppercase leading-relaxed"
            >
              <span className="font-black block mb-2">AI Strategy:</span>
              {aiSuggestion}
            </motion.div>
          )}

          {/* Accordion Info (StockX style) */}
          <div className="space-y-1 pt-6">
            {[
              { id: 'worry', title: 'Worry Free Sourcing', content: 'Verified Tanzanian origins with SGS certification standards applied at every node.' },
              { id: 'promise', title: 'Buyer Promise', content: 'Our trade escrow ensures funds are only released upon successful quality pass at destination port.' },
              { id: 'process', title: 'Our Process', content: 'Stock is verified via real-time warehouse telemetry before listing. No ghost inventory permitted.' }
            ].map(acc => (
              <div key={acc.id} className="border-t border-border last:border-b">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === acc.id ? null : acc.id)}
                  className="w-full py-4 flex justify-between items-center text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {acc.title}
                  <span>{activeAccordion === acc.id ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {activeAccordion === acc.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4 text-[11px] text-textMuted font-mono leading-relaxed"
                    >
                      {acc.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="pt-4">
             <button className="w-full flex justify-between items-center text-[11px] font-black uppercase text-textMuted hover:text-white transition-colors">
                <span>Condition: New</span>
                <span>▼</span>
             </button>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="max-w-[1200px] mx-auto px-6 mt-24 pt-24 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Product Details</h3>
          <div className="grid grid-cols-2 gap-y-6">
             {stats.map(s => (
               <div key={s.label}>
                 <p className="text-[10px] text-textMuted font-black uppercase tracking-widest mb-1">{s.label}</p>
                 <p className="text-sm font-bold">{s.value}</p>
               </div>
             ))}
          </div>
        </div>
        <div>
           <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Product Description</h3>
           <p className="text-sm text-textSecondary font-mono leading-relaxed uppercase">
             This {item.crop || item.name} harvest (2025) makes its return as one of the most striking commodity releases in the Grain X archive. 
             Cultivated in the Southern Highlands, this grade-A stock is recognized for its consistency and export-standard purity.
           </p>
           <button className="text-primary font-black uppercase text-[10px] mt-4 hover:underline">Read More ▼</button>
        </div>
      </div>

      {/* Price History Section */}
      <div className="max-w-[1200px] mx-auto px-6 mt-24">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-12">Price History</h3>
        <div className="bg-surface border border-border p-10 rounded-2xl">
          <div className="flex gap-4 mb-8">
            {['1M', '3M', '6M', 'YTD', '1Y', 'ALL'].map(t => (
              <button key={t} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${t === 'ALL' ? 'bg-white text-black' : 'text-textMuted hover:text-white'}`}>{t}</button>
            ))}
            <button className="ml-auto text-primary text-[10px] font-black uppercase tracking-widest">View Sales →</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={item.history || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#444" fontSize={10} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0c0c0c', border: '1px solid #1a1a1a', borderRadius: '12px' }} />
                <Line type="stepAfter" dataKey="value" stroke="#00ff88" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
           {[
             { label: 'Price Range', value: '$285 - $299', sub: 'Last 12 Months' },
             { label: 'Volatility', value: '11%', sub: 'Last 3 Months' },
             { label: 'Price Premium', value: '24%', sub: 'Last Sale' },
             { label: 'Number of Sales', value: '38,896', sub: 'Last 3 Months' },
           ].map((stat, i) => (
             <div key={i} className="bg-surface border border-border p-6 rounded-xl">
               <p className="text-lg font-black">{stat.value}</p>
               <p className="text-[10px] text-textMuted font-black uppercase tracking-widest mt-1">{stat.label} | <span className="font-normal">{stat.sub}</span></p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default CommodityDetails;
