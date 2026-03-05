
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { useRFQs } from '../hooks/useRFQs';
import PageShell from '../components/PageShell';

interface MatchedSupplier {
  name: string;
  confidence: number;
  reason: string;
  location: string;
  reliability: string;
}

const RFQManager: React.FC = () => {
  const { rfqs, submitting, submitRFQ } = useRFQs();
  const [formData, setFormData] = useState({
    crop: 'MAIZE', volume: '', incoterm: 'FOB', destination: '', timeline: '30 DAYS', instructions: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'auth_error'>('idle');
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
        contents: `Generate a structured JSON object for an agricultural RFQ based on this request: "${aiPrompt}". Return only valid JSON with these keys: crop (uppercase name), volume (number string), incoterm (EXW, FOB, or CIF), destination, timeline, and instructions (technical specs).`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      setFormData({ crop: data.crop || 'MAIZE', volume: data.volume || '', incoterm: data.incoterm || 'FOB', destination: data.destination || '', timeline: data.timeline || '30 DAYS', instructions: data.instructions || '' });
      setAiPrompt('');
    } catch (e) { console.error("AI GENERATION FAILED", e); }
    finally { setIsGenerating(false); }
  };

  const handleRunMatching = async () => {
    if (!formData.volume || !formData.destination) { alert("Complete specs before matching."); return; }
    setIsMatching(true);
    setMatchedSuppliers([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as Grain X Sourcing Engine. Match this RFQ to top 5 Tanzanian suppliers. Crop: ${formData.crop}, Volume: ${formData.volume} MT, Dest: ${formData.destination}, Terms: ${formData.incoterm}, Specs: ${formData.instructions}. Return JSON array with: name, confidence (0-100), reason (15 words max, ALL CAPS), location, reliability. Sort by confidence desc.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING }, confidence: { type: Type.NUMBER },
                reason: { type: Type.STRING }, location: { type: Type.STRING }, reliability: { type: Type.STRING }
              },
              required: ["name", "confidence", "reason", "location", "reliability"]
            }
          }
        }
      });
      setMatchedSuppliers(JSON.parse(response.text || '[]'));
    } catch (e) { console.error("MATCHING FAILED", e); }
    finally { setIsMatching(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    try {
      await submitRFQ({ crop: formData.crop, volume: formData.volume, incoterm: formData.incoterm, destination: formData.destination, timeline: formData.timeline, instructions: formData.instructions });
      setSubmitStatus('success');
      setFormData({ crop: 'MAIZE', volume: '', incoterm: 'FOB', destination: '', timeline: '30 DAYS', instructions: '' });
      setTimeout(() => setSubmitStatus('idle'), 4000);
    } catch (err: any) {
      setSubmitStatus('auth_error');
    }
  };

  return (
    <PageShell title="Initiate RFQ Protocol" subtitle="SECURE SOURCE BIDDING // AI_MATCHING_ENGINE">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* AI Assist */}
          <div className="bg-primary/5 border border-primary/20 p-4 md:p-5 rounded-xl relative overflow-hidden">
            <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-3">AI Sourcing Assistant</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.G. '200 MT YELLOW MAIZE TO ROTTERDAM BY MARCH'..."
                className="flex-1 bg-background border border-primary/30 rounded-lg px-3 py-2.5 text-[10px] font-mono focus:border-primary outline-none text-white uppercase"
              />
              <button onClick={handleAiGenerate} disabled={isGenerating} className="bg-primary text-background font-black px-5 py-2.5 rounded-lg text-[9px] uppercase tracking-widest hover:bg-primary-hover transition-all disabled:opacity-50 flex-shrink-0">
                {isGenerating ? 'PARSING...' : 'GENERATE'}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-surface border border-border p-4 md:p-6 rounded-xl space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Commodity', type: 'select', key: 'crop', options: ['MAIZE', 'RICE', 'SOYBEANS', 'SESAME', 'CASHEWS', 'COFFEE'] },
                { label: 'Volume (MT)', type: 'number', key: 'volume', placeholder: '500' },
                { label: 'Incoterm', type: 'select', key: 'incoterm', options: ['EXW', 'FOB', 'CIF'] },
                { label: 'Destination', type: 'text', key: 'destination', placeholder: 'ROTTERDAM, NL' },
              ].map(field => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-mono focus:border-primary outline-none appearance-none uppercase text-white"
                      value={(formData as any)[field.key]}
                      onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    >
                      {field.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type} placeholder={field.placeholder}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-mono focus:border-primary outline-none text-white uppercase"
                      value={(formData as any)[field.key]}
                      onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Technical Specs</label>
              <textarea
                rows={3} placeholder="MOISTURE, PURITY, AFLATOXIN LIMITS, CERTS..."
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-mono focus:border-primary outline-none resize-none text-white uppercase leading-relaxed"
                value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
              <button type="submit" disabled={submitting} className="flex-1 py-3 bg-primary text-background font-black uppercase text-[10px] rounded-lg hover:bg-primary-hover transition-all tracking-widest disabled:opacity-50">
                {submitting ? 'TRANSMITTING...' : 'EXECUTE RFQ →'}
              </button>
              <button type="button" className="py-3 px-6 border border-border text-text-secondary font-bold uppercase text-[10px] rounded-lg hover:bg-white/5 transition-all tracking-widest">SAVE DRAFT</button>
            </div>
            {submitStatus === 'success' && (
              <div className="text-center py-2.5 bg-primary/10 border border-primary/30 rounded-lg text-[9px] font-black text-primary uppercase tracking-widest">✓ RFQ BROADCAST — SUPPLIERS NOTIFIED</div>
            )}
            {submitStatus === 'auth_error' && (
              <div className="text-center py-2.5 bg-danger/10 border border-danger/30 rounded-lg text-[9px] font-black text-danger uppercase tracking-widest">AUTH REQUIRED — LOG IN TO SUBMIT</div>
            )}
          </form>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Matching */}
          <div className="bg-primary/5 border border-primary/30 p-4 md:p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-white uppercase tracking-tight">AI Match</h3>
              <button onClick={handleRunMatching} disabled={isMatching} className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded border transition-all ${isMatching ? 'border-primary bg-primary/20 text-primary' : 'border-primary/50 text-primary hover:bg-primary hover:text-background'}`}>
                {isMatching ? 'SYNCING...' : 'RUN MATCH'}
              </button>
            </div>
            <p className="text-[9px] text-text-secondary leading-relaxed mb-4 font-mono uppercase tracking-widest">Analyzing verified inventory, OTD scores & proximity.</p>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {isMatching ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10 flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-[8px] font-black text-primary uppercase animate-pulse">Scanning...</span>
                  </motion.div>
                ) : matchedSuppliers.length > 0 ? (
                  matchedSuppliers.map((sup, i) => (
                    <motion.div key={sup.name} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="p-3 bg-background/50 border border-border rounded-lg hover:border-primary/50 transition-all">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[9px] font-black text-white uppercase truncate">{sup.name}</span>
                        <span className="text-[9px] font-black text-primary flex-shrink-0 ml-2">{sup.confidence}%</span>
                      </div>
                      <div className="w-full h-1 bg-surface rounded-full overflow-hidden mb-2">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${sup.confidence}%` }} transition={{ duration: 0.8, delay: i * 0.08 }} className="h-full bg-primary" />
                      </div>
                      <p className="text-[7px] text-text-muted uppercase font-black mb-0.5">{sup.location} // {sup.reliability}</p>
                      <p className="text-[8px] text-text-secondary font-mono uppercase leading-tight italic truncate">{sup.reason}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-10 text-center opacity-30 border-2 border-dashed border-border rounded-lg">
                    <p className="text-[8px] font-black uppercase tracking-widest">Awaiting Command...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Recent RFQs */}
          <div className="bg-surface border border-border p-4 md:p-5 rounded-xl">
            <h3 className="text-[10px] font-black text-white mb-4 uppercase tracking-widest border-b border-border pb-3">Recent Logs</h3>
            <div className="space-y-2">
              {rfqs.length === 0 ? (
                <div className="py-6 text-center border-2 border-dashed border-border rounded-lg opacity-40">
                  <p className="text-[8px] font-black uppercase tracking-widest">No history</p>
                </div>
              ) : rfqs.slice(0, 5).map(rfq => (
                <div key={rfq.id} className="flex justify-between items-center p-3 border border-border rounded-lg bg-background hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-white uppercase truncate">{rfq.crop}</p>
                    <p className="text-[8px] text-text-muted font-mono uppercase">{rfq.volume} MT • {new Date(rfq.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[7px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase flex-shrink-0 ${rfq.status === 'OPEN' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>{rfq.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default RFQManager;
