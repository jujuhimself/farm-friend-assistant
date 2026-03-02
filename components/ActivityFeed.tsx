
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

      setActivities(prev => [newActivity, ...prev].slice(0, 6));
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
    <section className="py-6 md:py-12 px-4 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <h2 className="text-base md:text-xl font-black whitespace-nowrap uppercase tracking-tighter">Market Log</h2>
        <div className="h-px bg-border flex-1" />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <span className="text-primary text-[8px] md:text-[10px] font-bold whitespace-nowrap uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden divide-y divide-border">
        {activities.map((act) => (
          <div key={act.id} className="p-3 md:p-4 hover:bg-surface-hover transition-colors">
            <div className="flex items-start gap-2 md:gap-3">
              <span className="text-sm leading-none pt-0.5">{getIcon(act.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-text-muted text-[8px] font-mono uppercase">{act.timestamp}</span>
                  <span className="text-text-muted text-[8px] font-mono">{act.details}</span>
                </div>
                <p className="text-white text-[10px] md:text-xs font-semibold font-mono uppercase leading-tight truncate">
                  {act.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActivityFeed;
