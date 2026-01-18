
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const RFQManager: React.FC = () => {
  const [formData, setFormData] = useState({
    crop: 'MAIZE',
    volume: '',
    incoterm: 'FOB',
    destination: '',
    timeline: '30 DAYS',
    instructions: ''
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a structured JSON object for an agricultural RFQ based on this request: "${aiPrompt}". 
        Return only valid JSON with these keys: crop (uppercase name), volume (number string), incoterm (EXW, FOB, or CIF), destination, timeline, and instructions (technical specs).`,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      setFormData({
        crop: data.crop || 'MAIZE',
        volume: data.volume || '',
        incoterm: data.incoterm || 'FOB',
        destination: data.destination || '',
        timeline: data.timeline || '30 DAYS',
        instructions: data.instructions || ''
      });
      setAiPrompt('');
    } catch (e) {
      console.error("AI GENERATION FAILED", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('RFQ SUBMITTED TO CORE MATRIX. 5 MATCHED SUPPLIERS NOTIFIED.');
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12 border-l-4 border-primary pl-6">
        <h1 className="text-2xl md:text-4xl font-black mb-2 tracking-tighter uppercase">Initiate RFQ Protocol</h1>
        <p className="text-textMuted font-mono text-[10px] md:text-xs uppercase tracking-widest">SECURE SOURCE BIDDING // AI_MATCHING_ENGINE</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* AI Assist Input */}
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="text-5xl">✨</span>
            </div>
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">AI RFQ Sourcing Assistant</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.G. 'I NEED 200 MT YELLOW MAIZE TO ROTTERDAM BY MARCH WITH SGS CERT'..."
                className="flex-1 bg-background border border-primary/30 rounded-xl px-4 py-3 text-xs font-mono focus:border-primary outline-none text-white uppercase"
              />
              <button 
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="bg-primary text-black font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-primaryHover transition-all disabled:opacity-50"
              >
                {isGenerating ? 'PARSING...' : 'GENERATE_DRAFT'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-border p-6 md:p-8 rounded-2xl space-y-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Target Commodity</label>
                <select 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono focus:border-primary outline-none appearance-none uppercase text-white"
                  value={formData.crop}
                  onChange={(e) => setFormData({...formData, crop: e.target.value})}
                >
                  <option>MAIZE</option>
                  <option>RICE</option>
                  <option>SOYBEANS</option>
                  <option>SESAME</option>
                  <option>CASHEWS</option>
                  <option>COFFEE</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Volume (Metric Tons)</label>
                <input 
                  type="number" 
                  placeholder="E.G. 500"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono focus:border-primary outline-none text-white"
                  value={formData.volume}
                  onChange={(e) => setFormData({...formData, volume: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Trade Terms (Incoterm)</label>
                <select 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono focus:border-primary outline-none appearance-none uppercase text-white"
                  value={formData.incoterm}
                  onChange={(e) => setFormData({...formData, incoterm: e.target.value})}
                >
                  <option>EXW (EX WORKS)</option>
                  <option>FOB (FREE ON BOARD)</option>
                  <option>CIF (COST, INS., FREIGHT)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Discharge Port / Destination</label>
                <input 
                  type="text" 
                  placeholder="E.G. ROTTERDAM, NL"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono focus:border-primary outline-none text-white uppercase"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Technical Specs / Special Instructions</label>
              <textarea 
                rows={4}
                placeholder="SPECIFY MOISTURE, PURITY, AFLATOXIN LIMITS, CERTIFICATIONS..."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono focus:border-primary outline-none resize-none text-white uppercase leading-relaxed"
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                type="submit"
                className="w-full sm:flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] md:text-xs rounded-xl hover:bg-primaryHover transition-all shadow-xl shadow-primary/10 tracking-widest"
              >
                EXECUTE RFQ BROADCAST →
              </button>
              <button 
                type="button"
                className="w-full sm:w-auto px-10 py-4 border border-border text-textSecondary font-bold uppercase text-[10px] md:text-xs rounded-xl hover:bg-white/5 transition-all tracking-widest"
              >
                SAVE_DRAFT
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl">
            <h3 className="text-sm md:text-lg font-black text-white mb-4 uppercase tracking-tight">AI Matching Protocol</h3>
            <p className="text-[10px] text-textSecondary leading-relaxed mb-6 font-mono">
              THE GRAIN X MATCHING ENGINE IDENTIFIES TOP 5 SUPPLIERS BASED ON:
            </p>
            <ul className="space-y-4 text-[9px] font-bold text-primary tracking-widest uppercase font-mono">
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> VERIFIED INVENTORY LEVELS</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> ON-TIME DELIVERY SCORE</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> REGIONAL PROXIMITY</li>
              <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> QUALITY PASS PROBABILITY</li>
            </ul>
          </div>

          <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl">
            <h3 className="text-[11px] font-black text-white mb-6 uppercase tracking-widest border-b border-border pb-4">Active RFQ Matrix</h3>
            <div className="space-y-4">
              {[
                { crop: 'SESAME', vol: '200 MT', status: 'QUOTED (3)', time: '2h ago' },
                { crop: 'CASHEWS', vol: '100 MT', status: 'MATCHING', time: '5m ago' }
              ].map((rfq, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-border rounded-xl bg-background hover:border-primary/30 transition-colors cursor-pointer group">
                  <div>
                    <p className="text-[10px] font-black text-white uppercase group-hover:text-primary transition-colors">{rfq.crop}</p>
                    <p className="text-[9px] text-textMuted font-mono uppercase">{rfq.vol} • {rfq.time}</p>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-1 rounded tracking-widest uppercase ${rfq.status.includes('QUOTED') ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning animate-pulse'}`}>
                    {rfq.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQManager;
