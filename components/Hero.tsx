
import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface HeroProps {
  onRfqClick?: () => void;
  onBuyClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onRfqClick, onBuyClick }) => {
  const [timeLeft, setTimeLeft] = useState('04:32:15');
  
  useEffect(() => {
    const timer = setInterval(() => {
      const parts = timeLeft.split(':').map(Number);
      let s = parts[2], m = parts[1], h = parts[0];
      if (s > 0) s--; else if (m > 0) { m--; s = 59; } else if (h > 0) { h--; m = 59; s = 59; }
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const sparklineData = Array.from({length: 10}, (_, i) => ({ value: 300 - (i * 3) + Math.random() * 5 }));

  return (
    <section className="py-8 md:py-20 px-4 max-w-[1400px] mx-auto">
      <div className="text-center mb-6 md:mb-8">
        <h3 className="text-warning text-[10px] md:text-sm uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2">
          ⚡ LIVE MARKET OPPORTUNITY // EXPIRES IN {timeLeft}
        </h3>
      </div>

      <div className="max-w-[900px] mx-auto relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-info/30 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative bg-surface border-2 border-border p-6 md:p-12 rounded-2xl glow-border">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1 w-full">
              <span className="inline-block px-2 md:px-3 py-1 border border-danger text-danger text-[9px] md:text-[11px] font-bold rounded mb-4 md:mb-6 animate-pulse uppercase tracking-widest">
                [HIGH-DEMAND ALERT]
              </span>
              <h1 className="text-xl md:text-4xl font-extrabold mb-4 leading-tight uppercase tracking-tighter">
                Grade A Yellow Maize — Mbeya Region
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-lg mb-6 md:mb-8 font-mono">
                <span className="text-textPrimary font-bold">500 MT</span>
                <span className="text-textMuted">•</span>
                <span className="text-textPrimary font-bold">$272/MT</span>
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs md:text-base font-bold whitespace-nowrap">-12% AVG</span>
              </div>
              
              <div className="space-y-3 mb-8 text-xs md:text-sm font-mono text-textSecondary">
                <p className="flex items-center gap-3">
                  <span className="text-primary font-bold">✓</span> Direct-from-origin pricing
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-primary font-bold">✓</span> High purity (98.5%) Organic
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-primary font-bold">✓</span> Fast-tracked shipping log
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button 
                  onClick={onRfqClick}
                  className="w-full sm:w-48 h-12 md:h-14 border-2 border-primary text-primary font-black rounded-lg hover:bg-primary hover:text-black transition-all text-[10px] md:text-xs tracking-widest uppercase"
                >
                  REQUEST QUOTE
                </button>
                <button 
                  onClick={onBuyClick}
                  className="w-full sm:w-48 h-12 md:h-14 bg-primary text-black font-black rounded-lg hover:bg-primaryHover transition-all shadow-lg shadow-primary/20 text-[10px] md:text-xs tracking-widest uppercase"
                >
                  BUY NOW
                </button>
              </div>
            </div>

            <div className="w-full md:w-[250px] bg-background/50 border border-border p-4 md:p-6 rounded-xl">
              <div className="mb-4 md:mb-6">
                <p className="text-textMuted text-[9px] md:text-[10px] uppercase mb-1 font-bold tracking-widest">Trust Index</p>
                <p className="text-white font-bold text-sm md:text-lg mb-1 tracking-tight">Mazaohub Aggregator</p>
                <div className="flex items-center gap-1 text-warning mb-2">
                  <span className="text-[10px] md:text-xs">★★★★★</span>
                  <span className="text-textMuted text-[10px] ml-2 font-mono">4.9</span>
                </div>
                <span className="text-[9px] md:text-[10px] bg-primary/10 text-primary px-2 py-0.5 border border-primary/30 rounded font-black uppercase tracking-widest">Verified Origin</span>
              </div>

              <div>
                <p className="text-textMuted text-[9px] md:text-[10px] uppercase mb-2 md:mb-3 font-bold tracking-widest">Price History</p>
                <div className="h-[40px] md:h-[60px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                      <Line type="monotone" dataKey="value" stroke="#00ff88" strokeWidth={2} dot={false} />
                      <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 pt-4 md:mt-6 md:pt-6 border-t border-border">
                <p className="text-textMuted text-[9px] md:text-[10px] uppercase mb-1 font-bold tracking-widest">Lead Time</p>
                <p className="text-white font-semibold text-[10px] md:text-xs font-mono uppercase">7-10 DAYS TO PORT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
