
import React, { useState, useEffect } from 'react';
import { INITIAL_ACTIVITIES } from '../constants';
import { Activity } from '../types';

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: Activity['type'][] = ['purchase', 'rfq', 'listing'];
      const locations = ['UAE', 'China', 'India', 'Germany', 'USA', 'Netherlands'];
      const crops = ['Maize', 'Soybeans', 'Rice', 'Cashews', 'Coffee'];
      
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        timestamp: 'Just now',
        message: `Buyer from ${locations[Math.floor(Math.random() * locations.length)]} ${Math.floor(Math.random() * 400 + 50)} MT ${crops[Math.floor(Math.random() * crops.length)]}`,
        details: `$${(Math.random() * 1000 + 200).toFixed(2)}/MT`
      };

      setActivities(prev => [newActivity, ...prev].slice(0, 8));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Activity['type']) => {
    switch(type) {
      case 'purchase': return '🟢';
      case 'rfq': return '🟠';
      case 'listing': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <section className="py-8 md:py-16 px-4 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          <h2 className="text-lg md:text-2xl font-bold whitespace-nowrap uppercase tracking-tighter">Market Log</h2>
          <div className="h-px bg-border flex-1 border-dashed border-t"></div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
          <span className="text-primary text-[9px] md:text-[11px] font-bold whitespace-nowrap uppercase tracking-widest">Live Uplink</span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden divide-y divide-border">
        {activities.map((act) => (
          <div key={act.id} className="p-3 md:p-4 hover:bg-surfaceHover transition-colors animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <div className="flex items-start gap-3">
                <span className="text-base leading-none pt-0.5">{getIcon(act.type)}</span>
                <div>
                   <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-textMuted text-[9px] font-mono whitespace-nowrap uppercase">{act.timestamp}</span>
                    <span className="sm:hidden text-textMuted text-[9px] font-mono">• {act.details}</span>
                  </div>
                  <p className="text-white text-[11px] md:text-sm font-semibold tracking-wide font-mono uppercase leading-tight">
                    {act.message}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 font-mono">
                <span className="text-textMuted text-[12px] whitespace-nowrap">{act.details}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 md:mt-8 text-center">
        <button className="text-textMuted hover:text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold font-mono transition-colors">
          View Protocol Log →
        </button>
      </div>
    </section>
  );
};

export default ActivityFeed;
