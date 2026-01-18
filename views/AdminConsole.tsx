
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AdminConsole: React.FC<{ onSwitchRole: () => void }> = ({ onSwitchRole }) => {
  const [activeTab, setActiveTab] = useState<'verification' | 'transactions' | 'disputes'>('verification');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const pendingVerifications = [
    { id: 'U-902', name: 'Coastal Exports Ltd', type: 'SUPPLIER', country: 'Tanzania', docs: ['Business License', 'Tax ID', 'Warehouse Cert'], region: 'Mtwara' },
    { id: 'U-899', name: 'AgriFlow GMBH', type: 'BUYER', country: 'Germany', docs: ['VAT Registry', 'Trade License'], region: 'Hamburg' },
  ];

  const recentTransactions = [
    { id: 'TR-1102', buyer: 'AgriCorp UAE', supplier: 'Mazaohub', amount: 42300, status: 'ESCROWED', crop: 'Maize' },
    { id: 'TR-1101', buyer: 'IndoFood', supplier: 'Lindi Collective', amount: 89000, status: 'COMPLETED', crop: 'Sesame' },
    { id: 'TR-1099', buyer: 'GlobalNuts', supplier: 'Coastal Exports', amount: 12500, status: 'RELEASED', crop: 'Cashews' },
  ];

  const disputes = [
    { id: 'DIS-04', order: 'ORD-8821', user: 'AgriCorp UAE', reason: 'Delayed Inspection', priority: 'HIGH' },
  ];

  const handleAiDocReview = async (user: any) => {
    setIsAiAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze verification risk for ${user.name} (${user.type}). 
        DOCUMENTS UPLOADED: ${user.docs.join(', ')}. 
        REGION: ${user.region}.
        Provide a concise technical risk assessment summary. Mention any common discrepancies for this region/type.`,
      });
      setAiAnalysis(response.text || "ANALYSIS_FAILED.");
    } catch (e) {
      setAiAnalysis("ERR: AI_NODE_TIMEOUT");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12 flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase leading-none">Admin Command Center</h1>
          <p className="text-danger font-mono text-xs md:text-sm uppercase tracking-widest">SYSTEM_ADMIN_ACCESS // LEVEL_05_CLEARANCE</p>
        </div>
        <button onClick={onSwitchRole} className="text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-white transition-colors underline">Exit Admin Terminal</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface border border-border p-6 rounded-xl">
           <p className="text-[9px] font-black text-textMuted uppercase mb-2">Total platform GMV</p>
           <p className="text-2xl font-black text-white">$1,420,900</p>
           <p className="text-[10px] text-primary font-bold">▲ 12.4% MONTHLY</p>
        </div>
        <div className="bg-surface border border-border p-6 rounded-xl">
           <p className="text-[9px] font-black text-textMuted uppercase mb-2">Pending Verifications</p>
           <p className="text-2xl font-black text-warning">14</p>
           <p className="text-[10px] text-warning font-bold uppercase tracking-widest animate-pulse">Action Required</p>
        </div>
        <div className="bg-surface border border-border p-6 rounded-xl">
           <p className="text-[9px] font-black text-textMuted uppercase mb-2">Active Disputes</p>
           <p className="text-2xl font-black text-danger">{disputes.length}</p>
           <p className="text-[10px] text-textMuted font-bold uppercase">Stable Operations</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex border-b border-border">
          {(['verification', 'transactions', 'disputes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white/5 text-primary border-b-2 border-primary' : 'text-textMuted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8">
           {activeTab === 'verification' && (
             <div className="space-y-6">
                {pendingVerifications.map(user => (
                  <div key={user.id} className="bg-background border border-border p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-surface border border-border rounded flex items-center justify-center text-xl">
                         {user.type === 'SUPPLIER' ? '🚜' : '🏢'}
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">{user.name}</h4>
                          <p className="text-[9px] text-textMuted font-mono uppercase tracking-widest">{user.type} • {user.country}</p>
                       </div>
                    </div>
                    
                    <div className="text-center md:text-left">
                       <p className="text-[10px] text-textSecondary font-mono uppercase mb-1">Documents for Review</p>
                       <div className="flex gap-2">
                         {user.docs.map(d => (
                           <span key={d} className="text-[8px] bg-white/5 border border-border px-2 py-0.5 rounded text-info uppercase font-black">{d}</span>
                         ))}
                       </div>
                    </div>

                    <div className="flex gap-3">
                       <button 
                        onClick={() => { setSelectedUser(user); handleAiDocReview(user); }}
                        className="bg-info/10 border border-info/50 text-info px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-info hover:text-white transition-all"
                       >
                         Review Protocol
                       </button>
                       <button className="bg-primary text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Verify</button>
                    </div>
                  </div>
                ))}
             </div>
           )}

           {activeTab === 'transactions' && (
             <div className="space-y-4 overflow-x-auto">
                <table className="w-full font-mono text-[11px] text-left min-w-[600px]">
                  <thead className="bg-background/50 text-textMuted uppercase border-b border-border">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Parties</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentTransactions.map(tr => (
                      <tr key={tr.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-textMuted">{tr.id}</td>
                        <td className="px-6 py-4">
                           <span className="text-white font-bold">{tr.buyer}</span>
                           <span className="mx-2 text-textMuted">→</span>
                           <span className="text-primary">{tr.supplier}</span>
                        </td>
                        <td className="px-6 py-4 text-white font-black">${tr.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${tr.status === 'COMPLETED' ? 'bg-primary/10 text-primary' : 'bg-info/10 text-info'}`}>
                              {tr.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-info font-black uppercase tracking-widest">Logs</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           )}

           {activeTab === 'disputes' && (
             <div className="space-y-6">
                {disputes.map(dis => (
                    <div key={dis.id} className="bg-danger/5 border border-danger/30 p-6 rounded-xl flex justify-between items-center group">
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="text-[9px] font-black bg-danger/20 text-danger px-2 py-0.5 rounded tracking-widest">{dis.priority}_PRIORITY</span>
                             <span className="text-[9px] font-black text-textMuted uppercase font-mono">{dis.id} // {dis.order}</span>
                          </div>
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">{dis.user} - {dis.reason}</h4>
                       </div>
                       <button className="bg-danger text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-danger/80 transition-all">Mediate Dispute</button>
                    </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* KYC Review Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => { setSelectedUser(null); setAiAnalysis(null); }}></div>
          <div className="relative w-full max-w-[800px] bg-surface border-2 border-info/30 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-8 border-b border-border pb-6">
               <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Verification Protocol: {selectedUser.name}</h2>
                  <p className="text-xs font-mono text-textMuted uppercase">{selectedUser.id} // REGION: {selectedUser.region}, TZ</p>
               </div>
               <button onClick={() => setSelectedUser(null)} className="text-textMuted hover:text-white transition-colors">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-widest border-l-2 border-info pl-3">Asset Inventory</h3>
                  <div className="space-y-3">
                     {selectedUser.docs.map((doc: string) => (
                       <div key={doc} className="flex items-center justify-between p-4 bg-background border border-border rounded-xl group hover:border-info/30 transition-colors">
                          <span className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">{doc}</span>
                          <span className="text-info text-[9px] font-black uppercase tracking-widest cursor-pointer">[PREVIEW]</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-info/5 border border-info/20 p-6 rounded-xl">
                  <h3 className="text-[10px] font-black text-info uppercase tracking-widest mb-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-info rounded-full animate-pulse"></span> AI_RISK_ASSESSMENT
                  </h3>
                  {isAiAnalyzing ? (
                    <div className="py-10 text-center space-y-3">
                       <div className="w-8 h-8 border-2 border-info border-t-transparent rounded-full animate-spin mx-auto"></div>
                       <p className="text-[9px] font-mono text-info uppercase tracking-widest">Scanning_Uplink...</p>
                    </div>
                  ) : (
                    <div className="text-[11px] font-mono text-textSecondary leading-relaxed uppercase whitespace-pre-wrap">
                       {aiAnalysis || "NO_DATA_FETCHED"}
                    </div>
                  )}
               </div>
            </div>

            <div className="flex gap-4 mt-10 pt-6 border-t border-border">
               <button className="flex-1 py-4 bg-primary text-black font-black uppercase text-xs rounded-xl hover:bg-primaryHover transition-all tracking-widest">Approve Account</button>
               <button className="px-8 py-4 border border-danger text-danger font-black uppercase text-xs rounded-xl hover:bg-danger/10 transition-all">Flag Conflict</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsole;
