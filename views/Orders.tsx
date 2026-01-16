
import React from 'react';

const MOCK_ORDERS = [
  { id: 'ORD-98221', crop: 'YELLOW MAIZE', volume: '150 MT', status: 'SHIPPED', statusIndex: 3, date: '2024-03-12', destination: 'Dubai, UAE' },
  { id: 'ORD-98215', crop: 'CASHEWS', volume: '80 MT', status: 'INSPECTED', statusIndex: 2, date: '2024-03-15', destination: 'Hamburg, DE' },
  { id: 'ORD-98204', crop: 'LONG GRAIN RICE', volume: '200 MT', status: 'PAID', statusIndex: 1, date: '2024-03-18', destination: 'Mombasa, KE' },
];

const PIPELINE = ['CONFIRMED', 'PAID', 'INSPECTED', 'SHIPPED', 'DELIVERED'];

const Orders: React.FC = () => {
  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tighter">ORDER TRACKING</h1>
        <p className="text-textMuted font-mono text-sm uppercase">Active shipment pipeline & document control center</p>
      </div>

      <div className="space-y-8">
        {MOCK_ORDERS.map(order => (
          <div key={order.id} className="bg-surface border border-border rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-info bg-info/10 px-2 py-0.5 rounded uppercase">{order.id}</span>
                  <span className="text-textMuted text-xs font-mono">{order.date}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-1 uppercase tracking-tight">{order.volume} {order.crop}</h3>
                <p className="text-textSecondary text-sm font-mono tracking-wide">DESTINATION: {order.destination}</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 border border-border rounded-xl text-xs font-bold uppercase hover:bg-white/5 transition-all text-textSecondary">
                  VIEW DOCS
                </button>
                <button className="px-6 py-3 bg-white/5 border border-primary/30 text-primary rounded-xl text-xs font-bold uppercase hover:bg-primary hover:text-black transition-all">
                  CONTACT SUPPORT
                </button>
              </div>
            </div>

            <div className="relative pt-8 pb-4">
              <div className="absolute top-[34px] left-0 right-0 h-0.5 bg-border"></div>
              <div 
                className="absolute top-[34px] left-0 h-0.5 bg-primary transition-all duration-1000"
                style={{ width: `${(order.statusIndex / (PIPELINE.length - 1)) * 100}%` }}
              ></div>
              
              <div className="flex justify-between relative">
                {PIPELINE.map((step, i) => (
                  <div key={step} className="flex flex-col items-center group">
                    <div className={`w-4 h-4 rounded-full border-4 mb-3 z-10 transition-all ${
                      i <= order.statusIndex ? 'bg-primary border-primary shadow-[0_0_10px_rgba(0,255,136,0.5)]' : 'bg-background border-border group-hover:border-textMuted'
                    }`}></div>
                    <span className={`text-[10px] font-bold tracking-widest transition-colors ${
                      i <= order.statusIndex ? 'text-white' : 'text-textMuted'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {order.status === 'SHIPPED' && (
              <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xl">🚢</span>
                  <div>
                    <p className="text-xs font-bold text-white uppercase mb-1">In Transit // Vessel: MAERSK NAIROBI</p>
                    <p className="text-[10px] text-textMuted font-mono">ETA: MARCH 25, 2024</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-primary animate-pulse font-bold tracking-widest">LIVE DATA FEED ACTIVE</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
