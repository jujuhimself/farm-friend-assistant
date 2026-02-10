
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

interface MatchedSupplier {
  name: string;
  confidence: number;
  reason: string;
  location: string;
  reliability: string;
}

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
  const [isMatching, setIsMatching] = useState(false);
  const [matchedSuppliers, setMatchedSuppliers] = useState<MatchedSupplier[]>([]);

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

  const handleRunMatching = async () => {
    if (!formData.volume || !formData.destination) {
      alert("PLEASE COMPLETE RFQ SPECIFICATIONS BEFORE RUNNING MATCH ENGINE.");
      return;
    }

    setIsMatching(true);
    setMatchedSuppliers([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as the Grain X Sourcing Engine. Match this RFQ to the top 5 Tanzanian suppliers.
        
        RFQ DATA:
        Crop: ${formData.crop}
        Volume: ${formData.volume} MT
        Destination: ${formData.destination}
        Terms: ${formData.incoterm}
        Specs: ${formData.instructions}

        SUPPLIER DATABASE MOCK:
        - Mazaohub (Mbeya): High Maize/Soy volume, 98% reliability.
        - Kilimanjaro Agro (Arusha): Premium Coffee/Cashews, 95% reliability.
        - Southern Collective (Lindi/Mtwara): Cashew/Sesame specialists.
        - Kilombero Agro (Morogoro): High Rice capacity.
        - Mbeya Traders Co: General grains, competitive pricing.
        - Coastal Exports: Port-proximate warehouse, high efficiency.

        Return a JSON array of 5 objects with these keys:
        - name: Supplier Name
        - confidence: Number (0-100)
        - reason: Technical reason for match (max 15 words, ALL CAPS)
        - location: Region in Tanzania
        - reliability: String (e.g. "98% OTD")
        
        Sort by confidence descending.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                reason: { type: Type.STRING },
                location: { type: Type.STRING },
                reliability: { type: Type.STRING }
              },
              required: ["name", "confidence", "reason", "location", "reliability"]
            }
          }
        }
      });

      const results = JSON.parse(response.text || '[]');
      setMatchedSuppliers(results);
    } catch (e) {
      console.error("MATCHING ENGINE FAILURE", e);
    } finally {
      setIsMatching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('RFQ SUBMITTED TO CORE MATRIX. MATCHED SUPPLIERS NOTIFIED VIA SECURE UPLINK.');
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
          {/* AI Matching Protocol Section */}
          <div className="bg-primary/5 border border-primary/30 p-8 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-tight">AI Matching Protocol</h3>
              <button 
                onClick={handleRunMatching}
                disabled={isMatching}
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded border transition-all ${
                  isMatching ? 'border-primary bg-primary/20 text-primary' : 'border-primary/50 text-primary hover:bg-primary hover:text-black'
                }`}
              >
                {isMatching ? 'SYNCING...' : 'RUN_MATCH_ENGINE'}
              </button>
            </div>
            
            <p className="text-[10px] text-textSecondary leading-relaxed mb-8 font-mono uppercase tracking-widest">
              UPLINK ANALYZING VERIFIED INVENTORY, OTD SCORES, PROXIMITY, AND QUALITY PASS PROBABILITY.
            </p>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {isMatching ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center justify-center gap-4"
                  >
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[9px] font-black text-primary uppercase animate-pulse">Scanning_Global_Nodes...</span>
                  </motion.div>
                ) : matchedSuppliers.length > 0 ? (
                  matchedSuppliers.map((sup, i) => (
                    <motion.div 
                      key={sup.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-background/50 border border-border rounded-xl group hover:border-primary/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-white uppercase">{sup.name}</span>
                        <span className="text-[10px] font-black text-primary">{sup.confidence}% MATCH</span>
                      </div>
                      <div className="w-full h-1 bg-surface rounded-full overflow-hidden mb-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${sup.confidence}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[8px] text-textMuted uppercase font-black mb-1">{sup.location} // {sup.reliability}</p>
                          <p className="text-[9px] text-textSecondary font-mono uppercase leading-tight italic">{sup.reason}</p>
                        </div>
                        <button className="text-[8px] font-black text-primary uppercase border border-primary/20 px-2 py-1 rounded hover:bg-primary hover:text-black transition-all">VIEW_DNA</button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center opacity-30 border-2 border-dashed border-border rounded-xl">
                    <p className="text-[9px] font-black uppercase tracking-widest">Awaiting Command...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl">
            <h3 className="text-[11px] font-black text-white mb-6 uppercase tracking-widest border-b border-border pb-4">Recent Protocol Logs</h3>
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
