
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";

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

  if (!item) return null;

  const handleSuggestCounterOffer = async () => {
    setIsThinking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional commodity trade negotiator for Grain X. 
        Analyze this trade and suggest a specific counter-offer and negotiation strategy in a technical terminal style.
        
        DATA POINT:
        Commodity: ${item.crop || item.name}
        Current Price: $${item.price}/MT
        Supplier: ${item.supplier}
        Origin: ${item.origin}
        Market Context: 2% below current asking index.
        Supplier Reputation: 4.9 Trust Score.
        
        Focus on volume-based discounts, payment speed incentives, or lead time adjustments. 
        Keep the response strictly under 100 words and use ALL CAPS for key directives.`,
      });

      setAiSuggestion(response.text || "UNABLE_TO_GENERATE_STRATEGY.");
    } catch (error) {
      console.error("AI NEGOTIATION ERROR:", error);
      setAiSuggestion("UPLINK_FAILURE: AI_NEGOTIATOR_OFFLINE.");
    } finally {
      setIsThinking(false);
    }
  };

  // Mocked DNA data for terminal feel
  const dnaSpecs = [
    { label: 'MOISTURE CONTENT', value: '12.5% max', status: 'optimal' },
    { label: 'PURITY LEVEL', value: '98.5% min', status: 'optimal' },
    { label: 'TEST WEIGHT', value: '72kg/hl', status: 'optimal' },
    { label: 'AFLATOXIN', value: '<10ppb', status: 'safe' },
    { label: 'BROKEN GRAINS', value: '2.0% max', status: 'good' },
    { label: 'FOREIGN MATTER', value: '0.5% max', status: 'optimal' },
  ];

  const photos = [
    `https://picsum.photos/seed/${item.id}1/800/600`,
    `https://picsum.photos/seed/${item.id}2/800/600`,
    `https://picsum.photos/seed/${item.id}3/800/600`,
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-border pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-surface border border-border flex items-center justify-center rounded-xl hover:text-primary hover:border-primary transition-all font-black"
          >
            ←
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded tracking-widest uppercase font-mono">
                REFERENCE: {item.ticker || `TZ-${item.id}`}
              </span>
              <span className="text-[10px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded tracking-widest uppercase font-mono">
                VERIFIED SOURCE
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">{item.crop || item.name}</h1>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => onAddToCart(item)}
            className="flex-1 md:px-8 py-4 border border-primary/30 text-primary font-black text-xs uppercase rounded-xl hover:bg-primary/10 transition-all tracking-widest"
          >
            BUFFER_TRADE
          </button>
          <button 
            onClick={() => onBuyNow(item)}
            className="flex-1 md:px-12 py-4 bg-primary text-black font-black text-xs uppercase rounded-xl hover:bg-primaryHover transition-all shadow-xl shadow-primary/20 tracking-widest"
          >
            EXECUTE_ORDER
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visuals & DNA */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Visual Carousel */}
          <div className="bg-surface border border-border rounded-2xl overflow-hidden aspect-video relative group">
            <img 
              src={photos[activePhoto]} 
              alt="Commodity view" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="flex gap-2">
                {photos.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${activePhoto === i ? 'border-primary scale-110' : 'border-border opacity-60'}`}
                  >
                    <img src={photos[i]} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold text-white bg-black/40 px-3 py-1.5 rounded-full backdrop-blur font-mono">
                IMAGE {activePhoto + 1}/{photos.length} // ORIGIN: {item.origin || 'TANZANIA'}
              </p>
            </div>
          </div>

          {/* Buyer Network Insights Section */}
          <div className="bg-info/5 border border-info/20 p-8 rounded-2xl">
            <h3 className="text-sm font-black text-info uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span className="text-info text-xl">👥</span> VERIFIED_BUYER_INSIGHTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono uppercase">
               <div className="bg-background/40 p-5 rounded-xl border border-info/10">
                  <p className="text-[9px] text-info font-bold uppercase tracking-widest mb-3">Regional Norms (Anonymized)</p>
                  <p className="text-[11px] text-textSecondary leading-relaxed">
                    MOST BUYERS FROM <span className="text-white font-bold">UAE</span> TYPICALLY ORDER <span className="text-white font-bold">50-100 MT</span> PER MONTH FOR THIS CATEGORY. GRADE A PREFERENCE: <span className="text-primary font-bold">94%</span>.
                  </p>
               </div>
               <div className="bg-background/40 p-5 rounded-xl border border-info/10">
                  <p className="text-[9px] text-info font-bold uppercase tracking-widest mb-3">Sourcing Patterns</p>
                  <p className="text-[11px] text-textSecondary leading-relaxed">
                    INDIA-BASED PROCESSORS PREFER GRADE B FOR FEED USE. AVG. LEAD TIME ACCEPTANCE: <span className="text-white font-bold">18 DAYS</span>.
                  </p>
               </div>
            </div>
          </div>

          {/* AI Negotiation Assistant */}
          <div className="bg-warning/5 border border-warning/20 p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="text-4xl">💼</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="text-sm font-black text-warning uppercase tracking-[0.3em] flex items-center gap-3">
                Price Negotiation Assistant
              </h3>
              <button 
                onClick={handleSuggestCounterOffer}
                disabled={isThinking}
                className="text-[9px] font-black uppercase tracking-widest bg-warning text-black px-4 py-2 rounded-lg hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isThinking ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
                    CALCULATING_LEVERAGE...
                  </>
                ) : (
                  <>SUGGEST COUNTER-OFFER</>
                )}
              </button>
            </div>

            {aiSuggestion ? (
              <div className="bg-background/60 border border-warning/30 p-5 rounded-xl mb-6 animate-in slide-in-from-top-4 duration-500 font-mono text-[11px] leading-relaxed text-warning">
                <div className="flex items-center gap-2 mb-3 border-b border-warning/20 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span>
                  <span className="font-black">NEGOTIATION_STRATEGY_PROTOCOL</span>
                </div>
                {aiSuggestion}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
               <div className="space-y-4">
                  <p className="text-[10px] text-warning font-bold uppercase tracking-widest">Tactical Sourcing Outlook</p>
                  <p className="text-[11px] text-textSecondary leading-relaxed uppercase">
                    THIS SUPPLIER TYPICALLY ACCEPTS <span className="text-white font-bold">3-5% BELOW ASKING</span> FOR VOLUMES {'>'} 100 MT. CURRENT MARKET INDEX IS 2% BELOW ASKING — YOU HAVE A <span className="text-primary font-bold">STRONG NEGOTIATING POSITION</span>.
                  </p>
               </div>
               <div className="bg-background/40 p-4 rounded-xl border border-warning/10">
                  <p className="text-[9px] text-textMuted font-bold uppercase mb-2">Confidence Signal</p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-warning">82%</span>
                    <span className="text-[10px] text-textSecondary uppercase leading-tight">HISTORICAL ACCURACY ON PRICING FORECASTS FOR THIS SECTOR.</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Commodity DNA */}
          <div className="bg-surface border border-border p-8 rounded-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-border pb-4 flex items-center gap-3">
              <span className="text-primary text-xl">🧬</span> COMMODITY_DNA / QUALITY_PROFILE
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {dnaSpecs.map((spec, i) => (
                <div key={i} className="bg-background border border-border/50 p-4 rounded-xl hover:border-primary/30 transition-colors">
                  <p className="text-[9px] font-black text-textMuted uppercase tracking-widest mb-1">{spec.label}</p>
                  <p className="text-lg font-bold text-white font-mono">{spec.value}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="text-[8px] font-bold text-primary uppercase">{spec.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Technical Stats & Market Data */}
        <div className="lg:col-span-5 space-y-8">
          {/* Price Tracking Terminal */}
          <div className="bg-background border-2 border-primary/20 p-8 rounded-2xl glow-border">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Current Trading Price</p>
                <p className="text-5xl font-black text-white tracking-tighter">${item.price}</p>
                <p className="text-xs text-textMuted font-bold uppercase tracking-widest mt-1">USD per Metric Ton</p>
              </div>
              <div className={`text-right ${item.change >= 0 ? 'text-primary' : 'text-danger'} font-mono`}>
                <p className="text-2xl font-bold">{item.change >= 0 ? '▲' : '▼'}{Math.abs(item.change)}%</p>
                <p className="text-[10px] font-bold uppercase">24H PERFORMANCE</p>
              </div>
            </div>

            <div className="h-[200px] w-full mb-8 border border-border/50 rounded-xl p-4 bg-surface/30">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={item.history || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                  <XAxis hide />
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid #2a2a2a', fontSize: '10px', color: '#fff' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00ff88" 
                    strokeWidth={3} 
                    dot={false}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-surface/50 p-4 rounded-xl border border-border">
                <p className="text-[9px] font-black text-textMuted uppercase mb-1">Volume Ready</p>
                <p className="text-xl font-bold text-white font-mono">{item.volume || '500 MT'}</p>
               </div>
               <div className="bg-surface/50 p-4 rounded-xl border border-border">
                <p className="text-[9px] font-black text-textMuted uppercase mb-1">Lead Time</p>
                <p className="text-xl font-bold text-white font-mono">7-12 DAYS</p>
               </div>
            </div>
          </div>

          {/* Supplier Reliability & Community Feedback */}
          <div className="bg-surface border border-border p-8 rounded-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-6 flex justify-between items-center">
               <span>Supplier Verification</span>
               <span className="text-[9px] font-mono text-primary font-bold">REPUTATION_HUB</span>
            </h3>
            <div className="flex items-center gap-6 mb-8">
               <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center text-3xl">
                 🏢
               </div>
               <div>
                  <h4 className="text-lg font-bold text-white uppercase tracking-tight">{item.supplier || 'MAZAOHUB'}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-warning">★★★★★</span>
                    <span className="text-[10px] font-mono text-textMuted">(4.9 TRUST SCORE)</span>
                  </div>
               </div>
            </div>

            <div className="bg-background/50 border border-border rounded-xl p-4 mb-8">
               <p className="text-[9px] font-black text-textMuted uppercase mb-3 tracking-widest">AI Feedback Summary</p>
               <div className="flex gap-3 mb-4">
                  <span className="text-primary text-lg">⭐</span>
                  <p className="text-[10px] text-textSecondary font-mono uppercase leading-relaxed">
                     SUPPLIER CONSISTENTLY RATED <span className="text-white">5-STARS</span> BY EUROPEAN BUYERS. KNOWN FOR EXCEPTIONAL COMMUNICATION AND DOCS ACCURACY.
                  </p>
               </div>
               <div className="flex justify-between items-center text-[9px] font-mono opacity-60">
                  <span className="uppercase">Avg Delivery Rating: 4.8</span>
                  <span className="uppercase">Avg Quality Rating: 5.0</span>
               </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-textSecondary font-mono uppercase">Successful Exports</span>
                 <span className="text-white font-bold">428 SHIPMENTS</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-textSecondary font-mono uppercase">Quality Pass Rate</span>
                 <span className="text-primary font-bold">99.4%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-textSecondary font-mono uppercase">KYC Status</span>
                 <span className="text-info font-bold">GOLD_VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-surface border border-border p-8 rounded-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-6">Certifications / Docs</h3>
            <div className="grid grid-cols-1 gap-3">
              {['Phytosanitary Cert', 'Cert of Origin', 'Quality Insp (SGS)', 'Fumigation Report'].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <span className="text-info">📄</span>
                    <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest group-hover:text-white transition-colors">{doc}</span>
                  </div>
                  <span className="text-primary text-[10px] font-mono">[VIEW]</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommodityDetails;
