
import React, { useState } from 'react';

const RFQManager: React.FC = () => {
  const [formData, setFormData] = useState({
    crop: 'MAIZE',
    volume: '',
    incoterm: 'FOB',
    destination: '',
    timeline: '30 DAYS',
    instructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('RFQ SUBMITTED TO CORE MATRIX. 5 MATCHED SUPPLIERS NOTIFIED.');
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase">Initiate RFQ</h1>
        <p className="text-textMuted font-mono text-sm">SECURE SOURCE BIDDING SYSTEM // DIRECT ORIGIN MATCHING</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-surface border border-border p-8 rounded-2xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-textMuted uppercase tracking-widest">Select Commodity</label>
                <select 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all appearance-none"
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
                <label className="text-[11px] font-bold text-textMuted uppercase tracking-widest">Target Volume (MT)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all"
                  value={formData.volume}
                  onChange={(e) => setFormData({...formData, volume: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-textMuted uppercase tracking-widest">Incoterm</label>
                <select 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all appearance-none"
                  value={formData.incoterm}
                  onChange={(e) => setFormData({...formData, incoterm: e.target.value})}
                >
                  <option>EXW (EX WORKS)</option>
                  <option>FOB (FREE ON BOARD)</option>
                  <option>CIF (COST, INS., FREIGHT)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-textMuted uppercase tracking-widest">Destination Country/Port</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mumbai, India"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-textMuted uppercase tracking-widest">Special Instructions / Quality Requirements</label>
              <textarea 
                rows={4}
                placeholder="Specify moisture content, purity levels, certifications needed..."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all resize-none"
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
              ></textarea>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all shadow-xl shadow-primary/10 tracking-widest"
              >
                EXECUTE RFQ BROADCAST →
              </button>
              <button 
                type="button"
                className="px-8 py-4 border border-border text-textSecondary font-bold uppercase text-xs rounded-xl hover:bg-white/5 transition-all"
              >
                SAVE DRAFT
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-tight">AI Matching Protocol</h3>
            <p className="text-xs text-textSecondary leading-relaxed mb-6 font-mono">
              The Grain X Matching Engine will automatically identify the top 5 suppliers based on:
            </p>
            <ul className="space-y-3 text-[10px] font-bold text-primary tracking-widest uppercase">
              <li>✓ VERIFIED INVENTORY LEVELS</li>
              <li>✓ ON-TIME DELIVERY SCORE</li>
              <li>✓ REGIONAL PROXIMITY</li>
              <li>✓ HISTORICAL PRICING DATA</li>
            </ul>
          </div>

          <div className="bg-surface border border-border p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-tight">Recent RFQs</h3>
            <div className="space-y-4">
              {[
                { crop: 'SESAME', vol: '200 MT', status: 'QUOTED (3)' },
                { crop: 'CASHEWS', vol: '100 MT', status: 'PENDING' }
              ].map((rfq, i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-border rounded-lg bg-background">
                  <div>
                    <p className="text-xs font-bold text-white">{rfq.crop}</p>
                    <p className="text-[10px] text-textMuted">{rfq.vol}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${rfq.status.includes('QUOTED') ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
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
