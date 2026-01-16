
import React from 'react';
import { AI_INSIGHTS, TRADE_NEWS, COMMODITIES } from '../constants';

const MarketIntelligence: React.FC = () => {
  const topMovers = [...COMMODITIES].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);

  return (
    <section className="py-16 px-4 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-2xl font-bold whitespace-nowrap uppercase">Market Intelligence</h2>
        <div className="h-px bg-border border-dashed border-t flex-1"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* TOP MOVERS */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-textSecondary uppercase tracking-widest mb-6 border-b border-border pb-4">Top Movers (24H)</h3>
          <div className="space-y-4">
            {topMovers.map(c => (
              <div key={c.ticker} className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                <div className="flex items-center gap-3">
                  <span className={c.change >= 0 ? 'text-primary' : 'text-danger'}>{c.change >= 0 ? '▲' : '▼'}</span>
                  <span className="font-bold text-sm">{c.name}</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-sm">
                  <span className={c.change >= 0 ? 'text-primary' : 'text-danger'}>{c.change >= 0 ? '+' : ''}{c.change}%</span>
                  <span className="text-textPrimary">${c.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUPPLY & DEMAND */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-textSecondary uppercase tracking-widest mb-6 border-b border-border pb-4">Supply & Demand</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-danger font-bold text-[11px] mb-3 uppercase tracking-tighter">High Demand</p>
              <ul className="space-y-2 text-sm text-textSecondary">
                <li>• Sesame (UAE, India)</li>
                <li>• Yellow Maize (EU, China)</li>
                <li>• Soybeans (Spain, Portugal)</li>
              </ul>
            </div>
            <div>
              <p className="text-primary font-bold text-[11px] mb-3 uppercase tracking-tighter">High Supply</p>
              <ul className="space-y-2 text-sm text-textSecondary">
                <li>• Maize (Mbeya) — 12k MT</li>
                <li>• Rice (Morogoro) — 8.5k MT</li>
                <li>• Tea (Iringa) — 5k MT</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-textSecondary uppercase tracking-widest mb-6 border-b border-border pb-4">AI Market Insights</h3>
          <div className="space-y-6">
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <h4 className="text-[11px] font-bold text-white mb-1 tracking-widest uppercase">{insight.title}</h4>
                  <p className="text-xs text-textSecondary leading-relaxed">{insight.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT NEWS */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-textSecondary uppercase tracking-widest mb-6 border-b border-border pb-4">Recent Trade News</h3>
          <div className="space-y-6">
            {TRADE_NEWS.map((news, i) => (
              <div key={i} className="group cursor-pointer">
                <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors mb-2 tracking-wide">• {news.title}</h4>
                <p className="text-xs text-textMuted ml-4">{news.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-white/5 border border-border rounded-lg text-primary text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
          View Full Market Intelligence Report →
        </button>
      </div>
    </section>
  );
};

export default MarketIntelligence;
