
import React, { useState } from 'react';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
import GrainGrid from './components/GrainGrid';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import MarketIntelligence from './components/MarketIntelligence';
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import Marketplace from './views/Marketplace';
import Orders from './views/Orders';
import RFQManager from './views/RFQManager';
import GrainAI from './components/GrainAI';
import BottomNav from './components/BottomNav';

export type ViewType = 'dashboard' | 'marketplace' | 'orders' | 'rfq' | 'intel' | 'profile';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCart(prev => [...prev, item]);
    console.log(`[SYSTEM] ITEM ADDED TO BUFFER: ${item.crop}`);
  };

  const renderView = () => {
    switch (currentView) {
      case 'marketplace':
        return <Marketplace onAddToCart={addToCart} />;
      case 'orders':
        return <Orders />;
      case 'rfq':
        return <RFQManager />;
      case 'intel':
        return <MarketIntelligence />;
      case 'profile':
        return (
          <div className="p-8 text-center mt-20 font-mono">
            <h1 className="text-2xl font-black mb-4">USER_PROFILE [GBIT-9823]</h1>
            <p className="text-textMuted uppercase text-sm">Access Restricted in Demo Mode</p>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <>
            <Hero onRfqClick={() => setCurrentView('rfq')} onBuyClick={() => setCurrentView('marketplace')} />
            <GrainGrid />
            <ActivityFeed />
            <QuickActions onViewChange={setCurrentView} />
            <MarketIntelligence />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background font-mono selection:bg-primary/30 text-white overflow-x-hidden">
      <Ticker cartCount={cart.length} />
      
      {/* Desktop Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} onAiToggle={() => setIsAiOpen(true)} />
      
      <CommandPalette onViewChange={setCurrentView} />
      
      {/* Mobile Bottom Navigation */}
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />

      <main className="lg:ml-[240px] pt-[60px] relative pb-24 lg:pb-0">
        <div className="max-w-full overflow-hidden">
          {renderView()}

          {/* Footer - Optimized for mobile: hidden on small views to save space, or simplified */}
          <footer className="py-16 px-4 md:px-8 border-t border-border mt-20 max-w-[1400px] mx-auto hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-black text-white mb-6 tracking-tighter">GRAIN X</h2>
                <p className="text-textMuted text-xs leading-relaxed max-w-xs font-mono mx-auto md:mx-0">
                  TERMINAL ACCESS // B2B EXPORT AGGREGATOR. 
                  DIRECT SOURCE: MBEYA, MOROGORO, DODOMA.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="text-[11px] font-bold text-white uppercase tracking-widest mb-6">Operations</h5>
                  <ul className="space-y-3 text-xs text-textMuted font-mono">
                    <li onClick={() => setCurrentView('marketplace')} className="hover:text-primary cursor-pointer transition-colors">Marketplace</li>
                    <li onClick={() => setCurrentView('rfq')} className="hover:text-primary cursor-pointer transition-colors">Submit RFQ</li>
                    <li onClick={() => setCurrentView('orders')} className="hover:text-primary cursor-pointer transition-colors">Track Orders</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-white uppercase tracking-widest mb-6">Security</h5>
                  <ul className="space-y-3 text-xs text-textMuted font-mono">
                    <li className="hover:text-primary cursor-pointer transition-colors">Escrow Protection</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">KYC Verification</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Certificates</li>
                  </ul>
                </div>
              </div>

              <div>
                <h5 className="text-[11px] font-bold text-white uppercase tracking-widest mb-6">System Status</h5>
                <div className="space-y-3 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-textMuted">Uptime</span>
                    <span className="text-primary font-bold">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-textMuted">Latency</span>
                    <span className="text-primary font-bold">~42ms</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-textMuted">Protocol</span>
                    <span className="text-textPrimary font-bold">V4.2/SECURE</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-textMuted font-bold uppercase tracking-widest">
              <div className="flex items-center gap-4">
                <span>© 2026 GRAIN X CONTROL</span>
                <span>•</span>
                <span>ORIGIN: TZ</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="hover:text-primary cursor-pointer transition-colors">DATAFEED</span>
                <span className="hover:text-primary cursor-pointer transition-colors">API_DOCS</span>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Floating AI Action on Mobile */}
      <div className="fixed bottom-24 right-4 z-[45] lg:hidden">
        <button 
          onClick={() => setIsAiOpen(true)}
          className="w-14 h-14 bg-primary text-black rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-xl animate-bounce"
        >
          ✨
        </button>
      </div>

      <GrainAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}

export default App;
