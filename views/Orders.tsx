
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import LiveTrackingMap from '../components/LiveTrackingMap';
import { useOrders } from '../hooks/useOrders';

const MOCK_ORDERS = [
  { 
    id: 'ORD-98221', 
    crop: 'YELLOW MAIZE', 
    volume: '150 MT', 
    status: 'SHIPPED', 
    statusIndex: 3, 
    date: '2024-03-12', 
    destination: 'Dubai, UAE',
    vessel: 'MAERSK NAIROBI',
    container: 'MSKU-892341-0',
    eta: '2024-03-25',
    confidence: 87,
    risk: 'LOW',
    telemetry: { temp: '22.4°C', humidity: '11.8%', lat: '5.2341', lng: '39.8231' }
  },
  { 
    id: 'ORD-98215', 
    crop: 'CASHEWS', 
    volume: '80 MT', 
    status: 'INSPECTED', 
    statusIndex: 2, 
    date: '2024-03-15', 
    destination: 'Hamburg, DE',
    vessel: 'MSC ILONA',
    container: 'MSCU-112233-4',
    risk: 'MEDIUM',
    riskReason: 'PORT CONGESTION @ DAR',
    confidence: 65,
    eta: '2024-04-02',
    telemetry: { temp: '18.2°C', humidity: '65.4%', lat: '-6.8234', lng: '39.2694' }
  },
  { 
    id: 'ORD-98204', 
    crop: 'MAIZE', 
    volume: '200 MT', 
    status: 'DELIVERED', 
    statusIndex: 4, 
    date: '2024-03-01', 
    destination: 'Mombasa, KE',
    vessel: 'K-LINE HORIZON',
    container: 'KLUU-778899-1',
    risk: 'LOW',
    confidence: 100,
    eta: '2024-03-05',
    telemetry: { temp: '31.1°C', humidity: '72.0%', lat: '-4.0435', lng: '39.6682' },
    rated: false
  },
];

const PIPELINE = ['CONFIRMED', 'PAID', 'INSPECTED', 'SHIPPED', 'DELIVERED'];

const Orders: React.FC = () => {
  const { orders: dbOrders, loading: ordersLoading } = useOrders();
  
  // Use real orders if available, fall back to mock for demo
  const displayOrders = dbOrders.length > 0 ? dbOrders.map(o => ({
    ...o,
    statusIndex: PIPELINE.indexOf(o.status),
    risk: o.risk_level,
    riskReason: o.risk_reason,
  })) : MOCK_ORDERS;

  const [selectedOrder, setSelectedOrder] = useState<any>(MOCK_ORDERS[0]);
  const [isVerifyingDocs, setIsVerifyingDocs] = useState(false);
  const [docFeedback, setDocFeedback] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [logisticsIntel, setLogisticsIntel] = useState<string | null>(null);
  const [isGeneratingIntel, setIsGeneratingIntel] = useState(false);

  // Fetch AI-driven Logistics Intelligence when order changes
  useEffect(() => {
    const fetchLogisticsIntel = async () => {
      setIsGeneratingIntel(true);
      setLogisticsIntel(null);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Act as an ML-powered logistics analyst for Grain X. 
          Order ID: ${selectedOrder.id}
          Status: ${selectedOrder.status}
          Vessel: ${selectedOrder.vessel}
          Destination: ${selectedOrder.destination}
          Current Confidence: ${selectedOrder.confidence}%
          
          Generate a "Technical Logistics Intelligence Briefing". 
          Include a status string like "Shipment on track — ${selectedOrder.confidence}% confidence of delivery by ${selectedOrder.eta}". 
          If status is not DELIVERED, mention potential risks like "Port congestion detected @ Dar Es Salaam — delivery likely delayed 2-3 days" or "Weather patterns stable across Indian Ocean".
          Use technical terminal style, ALL CAPS for emphasis. Keep it under 60 words.`,
        });
        setLogisticsIntel(response.text || "INTEL_LINK_ERROR");
      } catch (e) {
        setLogisticsIntel("UPLINK_FAILURE: LOGISTICS_AI_NODE_OFFLINE");
      } finally {
        setIsGeneratingIntel(false);
      }
    };

    if (selectedOrder.status !== 'DELIVERED') {
      fetchLogisticsIntel();
    } else {
      setLogisticsIntel("DELIVERY_SUCCESS: MISSION_COMPLETE. ALL NODES VERIFIED.");
    }
  }, [selectedOrder.id]);

  const handleVerifyDocuments = async () => {
    setIsVerifyingDocs(true);
    setDocFeedback(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the technical inspection protocol for order ${selectedOrder.id} (${selectedOrder.crop}). 
        Simulate a Claude Vision extraction of the 'SGS Quality Report'. 
        If crop is Maize, check for Aflatoxin < 10ppb and Moisture < 13%. 
        Provide a technical 'PASS' or 'FAIL' summary in terminal style.`,
      });
      setDocFeedback(response.text || "VERIFICATION_ERROR");
    } catch (e) {
      setDocFeedback("UPLINK_FAILURE: VISION_NODE_OFFLINE");
    } finally {
      setIsVerifyingDocs(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">Global Logistics Terminal</h1>
          <p className="text-textMuted font-mono text-xs md:text-sm uppercase tracking-widest">AI_DRIVEN_SHIPMENT_INTELLIGENCE // REAL_TIME_TRACKING</p>
        </div>
        <div className="flex gap-4 font-mono">
          <div className="text-right border-r border-border pr-6">
            <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">Avg Transit Efficiency</p>
            <p className="text-2xl font-black text-primary">94.2%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">Active Containers</p>
            <p className="text-2xl font-black text-white">08</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          {displayOrders.map(order => (
            <div 
              key={order.id} 
              onClick={() => { setSelectedOrder(order); setDocFeedback(null); }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                selectedOrder.id === order.id 
                  ? 'bg-surface border-primary/50 shadow-lg shadow-primary/5' 
                  : 'bg-surface/50 border-border hover:border-borderHover'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase ${
                  order.risk === 'LOW' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                }`}>
                  RISK_{order.risk}
                </span>
                <span className="text-[10px] text-textMuted font-mono uppercase">{order.date}</span>
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1 group-hover:text-primary transition-colors">{order.id}</h3>
              <p className="text-xs text-textSecondary uppercase font-bold tracking-widest mb-4">{order.volume} {order.crop}</p>
              
              <div className="flex items-center gap-2">
                 <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(order.statusIndex / (PIPELINE.length - 1)) * 100}%` }}></div>
                 </div>
                 <span className="text-[9px] font-black text-textMuted uppercase">{PIPELINE[order.statusIndex]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-surface border border-border p-8 rounded-2xl relative overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-border pb-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 mb-2">
                     <span className="text-4xl">🚢</span>
                     <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedOrder.id} // LOGISTICS_REPORT</h2>
                        <p className="text-xs text-primary font-mono font-bold tracking-widest uppercase">{selectedOrder.volume} {selectedOrder.crop} → {selectedOrder.destination}</p>
                     </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 font-mono">
                  {selectedOrder.status === 'DELIVERED' && !selectedOrder.rated && (
                    <button 
                      onClick={() => setShowRatingModal(true)}
                      className="bg-primary text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Rate Transaction
                    </button>
                  )}
                  <div className="text-right">
                    <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">Predictive Arrival</p>
                    <p className="text-xl font-black text-white">{selectedOrder.eta}</p>
                    <p className="text-[9px] text-primary font-black uppercase tracking-widest">({selectedOrder.confidence}% CONFIDENCE)</p>
                  </div>
                </div>
             </div>

             {/* Predictive Intelligence Briefing Card */}
             <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <span className="text-4xl">📡</span>
                </div>
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Predictive Logistics Intel</h4>
                   </div>
                   
                   {isGeneratingIntel ? (
                     <div className="py-4 space-y-2">
                        <div className="h-4 bg-primary/10 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-primary/10 rounded animate-pulse w-1/2"></div>
                     </div>
                   ) : (
                     <p className="text-[11px] md:text-xs text-textSecondary font-mono leading-relaxed uppercase">
                       {logisticsIntel || "FETCHING_DATA_FROM_FREIGHT_FORWARDER_APIS..."}
                     </p>
                   )}

                   <div className="flex flex-wrap gap-4 mt-2">
                      <div className="bg-background/40 border border-border px-3 py-2 rounded-lg">
                        <p className="text-[8px] text-textMuted font-black uppercase mb-1">ML Confidence Model</p>
                        <p className={`text-xs font-black font-mono ${selectedOrder.confidence > 80 ? 'text-primary' : 'text-warning'}`}>{selectedOrder.confidence}% RELIABILITY</p>
                      </div>
                      <div className="bg-background/40 border border-border px-3 py-2 rounded-lg">
                        <p className="text-[8px] text-textMuted font-black uppercase mb-1">Vessel Status</p>
                        <p className="text-xs font-black text-white font-mono">{selectedOrder.vessel} // ON_WATCH</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-info/5 border-2 border-info/20 p-6 rounded-xl mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="flex items-center gap-4">
                      <div className="text-3xl">🛡️</div>
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">AI Document Verification</h4>
                        <p className="text-[10px] text-textSecondary uppercase font-mono">OCR + Vision validation for inspection certificates.</p>
                      </div>
                   </div>
                   <button 
                    onClick={handleVerifyDocuments}
                    disabled={isVerifyingDocs}
                    className="bg-info text-white font-black px-6 py-3 rounded-lg text-[10px] uppercase tracking-widest hover:bg-info/80 transition-all disabled:opacity-50"
                   >
                     {isVerifyingDocs ? 'SCANNING_PROTOCOLS...' : 'RUN_VISION_VERIFY'}
                   </button>
                </div>
                {docFeedback && (
                  <div className="mt-6 bg-background/60 p-5 rounded-xl border border-info/30 font-mono text-[11px] text-info leading-relaxed animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-3 border-b border-info/20 pb-2">
                       <span className="w-2 h-2 rounded-full bg-info animate-pulse"></span>
                       <span className="font-black uppercase tracking-widest">Extracted_Data_Sync_Report</span>
                    </div>
                    {docFeedback}
                  </div>
                )}
             </div>

             {/* Dynamic Live Tracking Map */}
             <div className="mb-8">
                <LiveTrackingMap 
                  orderId={selectedOrder.id} 
                  destination={selectedOrder.destination} 
                  status={selectedOrder.status}
                />
             </div>

             <div className="relative pt-10 pb-16 px-4">
                <div className="absolute top-[52px] left-0 right-0 h-0.5 bg-background border-b border-border border-dashed"></div>
                <div 
                  className="absolute top-[52px] left-0 h-1 bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                  style={{ width: `${(selectedOrder.statusIndex / (PIPELINE.length - 1)) * 100}%` }}
                ></div>
                
                <div className="flex justify-between relative">
                  {PIPELINE.map((step, i) => (
                    <div key={step} className="flex flex-col items-center group">
                      <div className={`w-6 h-6 rounded-full border-4 mb-4 z-10 transition-all flex items-center justify-center ${
                        i <= selectedOrder.statusIndex ? 'bg-primary border-primary shadow-[0_0_15px_rgba(0,255,136,0.5)]' : 'bg-background border-border group-hover:border-textMuted'
                      }`}>
                         {i <= selectedOrder.statusIndex && <span className="text-black text-[10px] font-black">✓</span>}
                      </div>
                      <span className={`text-[10px] font-black tracking-widest transition-colors ${
                        i <= selectedOrder.statusIndex ? 'text-white' : 'text-textMuted'
                      }`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-background border border-border p-6 rounded-xl space-y-6">
                   <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> CONTAINER_TELEMETRY
                   </h4>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] text-textMuted font-bold uppercase tracking-widest">Internal Temp</p>
                        <p className="text-lg font-bold text-white font-mono">{selectedOrder.telemetry?.temp || '--'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-textMuted font-bold uppercase tracking-widest">Rel. Humidity</p>
                        <p className="text-lg font-bold text-white font-mono">{selectedOrder.telemetry?.humidity || '--'}</p>
                      </div>
                   </div>
                </div>
                <div className="bg-background border border-border p-6 rounded-xl space-y-6">
                   <h4 className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-info animate-pulse"></span> ASSET_GEOLOCATION
                   </h4>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[9px] text-textMuted font-bold uppercase tracking-widest">Lat Vector</p>
                        <p className="text-xs font-bold text-white font-mono">{selectedOrder.telemetry?.lat || '--'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-textMuted font-bold uppercase tracking-widest">Long Vector</p>
                        <p className="text-xs font-bold text-white font-mono">{selectedOrder.telemetry?.lng || '--'}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {showRatingModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowRatingModal(false)}></div>
          <div className="relative w-full max-w-[500px] bg-surface border-2 border-primary/30 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
             <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 border-b border-border pb-4">Trade Evaluation Protocol</h2>
             <div className="space-y-8 py-4">
                <div className="space-y-3">
                   <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Supplier Communication</label>
                   <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} className="text-2xl hover:scale-125 transition-transform">⭐</button>
                      ))}
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Product Quality (Actual vs Spec)</label>
                   <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} className="text-2xl hover:scale-125 transition-transform">⭐</button>
                      ))}
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-textMuted uppercase tracking-widest">Comments (Terminal Log)</label>
                   <textarea rows={3} placeholder="ENTER FEEDBACK..." className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs font-mono text-white focus:border-primary outline-none resize-none uppercase"></textarea>
                </div>
             </div>
             <div className="flex gap-4 mt-8">
                <button onClick={() => setShowRatingModal(false)} className="flex-1 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all tracking-widest">Execute Rating</button>
                <button onClick={() => setShowRatingModal(false)} className="px-8 py-4 border border-border text-textMuted font-black uppercase text-xs rounded-xl hover:text-white transition-all">Skip</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
