
import React, { useState } from 'react';
import { AI_INSIGHTS, TRADE_NEWS, COMMODITIES, COLLECTIVE_STATS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

const MarketIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signals' | 'forecast' | 'competitive' | 'community'>('signals');
  const topMovers = [...COMMODITIES].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);

  // Mock forecast data for Maize (ticker: MAZ)
  const forecastData = [
    { day: -30, price: 260, type: 'actual' },
    { day: -15, price: 275, type: 'actual' },
    { day: 0, price: 285, type: 'actual' },
    { day: 30, price: 272, type: 'forecast', upper: 280, lower: 265 },
    { day: 60, price: 255, type: 'forecast', upper: 270, lower: 240 },
    { day: 90, price: 250, type: 'forecast', upper: 275, lower: 225 },
  ];

  return (
    <section className="py-16 px-4 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-black whitespace-nowrap uppercase tracking-tighter">Predictive Intelligence</h2>
          <p className="text-textMuted font-mono text-[10px] uppercase tracking-widest mt-1">Global Trade Signals // ML_FORECAST_V4</p>
        </div>
        <div className="flex bg-surface p-1 rounded-xl border border-border overflow-x-auto scrollbar-hide">
          {(['signals', 'forecast', 'competitive', 'community'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-primary text-black' : 'text-textMuted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          {activeTab === 'forecast' && (
            <div className="bg-surface border border-border p-8 rounded-2xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Price Prediction Model: MAIZE [MAZ]</h3>
                  <p className="text-[10px] text-textMuted font-mono">MODEL ACCURACY: 94.2% // LAST TRAINING: 2H AGO</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-danger uppercase tracking-widest bg-danger/10 px-3 py-1 rounded">-12.3% OVER 90D</span>
                </div>
              </div>

              <div className="h-[350px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="day" stroke="#444" fontSize={10} tickFormatter={(v) => v === 0 ? 'NOW' : `${v}D`} />
                    <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #222', fontSize: '10px' }}
                      labelStyle={{ color: '#00ff88' }}
                    />
                    <ReferenceArea x1={0} x2={90} fill="rgba(0, 255, 136, 0.05)" />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#00ff88" 
                      strokeWidth={3} 
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        return payload.type === 'actual' ? <circle cx={cx} cy={cy} r={4} fill="#00ff88" stroke="none" /> : null;
                      }}
                      strokeDasharray={(payload: any) => payload?.type === 'forecast' ? '5 5' : '0'}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 font-mono">
                {[
                  { label: '30-DAY FORECAST', val: '$272', delta: '-4.5%' },
                  { label: '60-DAY FORECAST', val: '$255', delta: '-10.5%' },
                  { label: '90-DAY FORECAST', val: '$250', delta: '-12.3%' }
                ].map((f, i) => (
                  <div key={i} className="bg-background border border-border p-4 rounded-xl">
                    <p className="text-[9px] text-textMuted font-bold uppercase mb-1">{f.label}</p>
                    <p className="text-xl font-black text-white">{f.val}</p>
                    <p className="text-[10px] text-danger font-bold uppercase">{f.delta}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border p-6 rounded-xl">
                <h3 className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="text-info">📡</span> SUPPLY & DEMAND SIGNALS
                </h3>
                <div className="space-y-6">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-xs font-bold text-white uppercase mb-1">Export Policy Shift</p>
                    <p className="text-[10px] text-textSecondary leading-relaxed uppercase">Tanzania export ban on maize lifted — expect 20% increase in regional supply by Q2.</p>
                  </div>
                  <div className="border-l-2 border-warning pl-4">
                    <p className="text-xs font-bold text-white uppercase mb-1">Weather Impact: Southern Highlands</p>
                    <p className="text-[10px] text-textSecondary leading-relaxed uppercase">Heavy rains in Mbeya delaying harvest by 14 days. Current spot pricing volatile.</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface border border-border p-6 rounded-xl">
                <h3 className="text-[10px] font-black text-textMuted uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="text-warning">🌍</span> GLOBAL MARKET SHOCKS
                </h3>
                <div className="space-y-6">
                  <div className="border-l-2 border-danger pl-4">
                    <p className="text-xs font-bold text-white uppercase mb-1">Sesame Demand Spike (India)</p>
                    <p className="text-[10px] text-textSecondary leading-relaxed uppercase">Drought in Myanmar driving Indian importers to Tanzania. Buy now before 15% price correction.</p>
                  </div>
                  <div className="border-l-2 border-info pl-4">
                    <p className="text-xs font-bold text-white uppercase mb-1">Wheat Substitution Effect</p>
                    <p className="text-[10px] text-textSecondary leading-relaxed uppercase">Ukraine wheat exports resuming — likely to soften Maize demand in East African corridors.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'competitive' && (
            <div className="bg-surface border border-border p-8 rounded-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 border-b border-border pb-4">Competitive Landscape Intel</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6 bg-background p-4 rounded-xl border border-border">
                  <div className="text-3xl">👤</div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase">High Volume Entry</p>
                    <p className="text-[10px] text-textSecondary uppercase">3 New buyers from UAE entered platform this hour — focusing on sesame [SES].</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 bg-background p-4 rounded-xl border border-border">
                  <div className="text-3xl">📦</div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase">Supplier Inventory Alert</p>
                    <p className="text-[10px] text-textSecondary uppercase">Mazaohub [MBEYA] just cleared 500 MT Rice — current reserves at 15% capacity.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface border border-border p-6 rounded-xl">
                  <p className="text-[9px] font-black text-textMuted uppercase mb-2 tracking-widest">Total Traded (Weekly)</p>
                  <p className="text-2xl font-black text-primary">{COLLECTIVE_STATS.weeklyVolumeMT} MT</p>
                  <p className="text-[10px] text-primary font-bold">▲ {COLLECTIVE_STATS.volumeGrowth}%</p>
                </div>
                <div className="bg-surface border border-border p-6 rounded-xl">
                  <p className="text-[9px] font-black text-textMuted uppercase mb-2 tracking-widest">Avg Order Size</p>
                  <p className="text-2xl font-black text-white">{COLLECTIVE_STATS.avgOrderSizeMT} MT</p>
                  <p className="text-[10px] text-textMuted font-bold uppercase">Standard Protocol</p>
                </div>
                <div className="bg-surface border border-border p-6 rounded-xl">
                  <p className="text-[9px] font-black text-textMuted uppercase mb-2 tracking-widest">Hot Destination</p>
                  <p className="text-2xl font-black text-info">{COLLECTIVE_STATS.topGrowingDestination}</p>
                  <p className="text-[10px] text-info font-bold uppercase">▲ {COLLECTIVE_STATS.destinationGrowth}% Demand</p>
                </div>
              </div>

              <div className="bg-surface border border-border p-8 rounded-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 border-b border-border pb-4 flex items-center gap-2">
                  <span className="text-xl">🤝</span> VERIFIED BUYER NETWORK BEHAVIOR
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono uppercase">
                  {COLLECTIVE_STATS.activeBuyerRegions.map((region, i) => (
                    <div key={i} className="bg-background border border-border p-5 rounded-xl hover:border-primary/30 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black text-white">{region.region} CLUSTER</span>
                        <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded">ACTIVE</span>
                      </div>
                      <p className="text-[10px] text-textSecondary mb-2 font-bold">{region.behavior}</p>
                      <p className="text-[9px] text-textMuted">NORM: {region.norm}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Intelligence */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
            <h4 className="text-[11px] font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="animate-pulse">✨</span> AI MARKET ADVISORY
            </h4>
            <div className="space-y-4">
              {AI_INSIGHTS.map((insight, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-lg">{insight.icon}</span>
                  <div>
                    <h5 className="text-[10px] font-bold text-white mb-1 uppercase">{insight.title}</h5>
                    <p className="text-[9px] text-textSecondary leading-relaxed uppercase">{insight.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl">
            <h4 className="text-[11px] font-black text-textMuted uppercase tracking-widest mb-4">MARKET NEWS FEED</h4>
            <div className="space-y-4">
              {TRADE_NEWS.map((news, i) => (
                <div key={i} className="group cursor-pointer border-b border-border/50 pb-4 last:border-0">
                  <h5 className="text-[11px] font-bold text-white uppercase group-hover:text-primary transition-colors mb-1">{news.title}</h5>
                  <p className="text-[9px] text-textMuted uppercase leading-relaxed">{news.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded-xl">
            <h4 className="text-[11px] font-black text-textMuted uppercase tracking-widest mb-4">MOVERS & SHAKERS</h4>
            <div className="space-y-3">
              {topMovers.map(c => (
                <div key={c.ticker} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors border-b border-border/50 pb-2">
                  <div className="flex items-center gap-3">
                    <span className={c.change >= 0 ? 'text-primary' : 'text-danger'}>{c.change >= 0 ? '▲' : '▼'}</span>
                    <span className="font-bold text-[10px] uppercase text-white font-mono">{c.name}</span>
                  </div>
                  <span className={`font-mono text-[10px] ${c.change >= 0 ? 'text-primary' : 'text-danger'}`}>
                    {c.change >= 0 ? '+' : ''}{c.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketIntelligence;
