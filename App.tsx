
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import Checkout from './views/Checkout';
import CommodityDetails from './views/CommodityDetails';
import SupplierDashboard from './views/SupplierDashboard';
import AdminConsole from './views/AdminConsole';
import PriceAlerts from './views/PriceAlerts';
import GrainAI from './components/GrainAI';
import BottomNav from './components/BottomNav';

export type ViewType = 'dashboard' | 'marketplace' | 'orders' | 'rfq' | 'intel' | 'profile' | 'checkout' | 'details' | 'inventory' | 'admin' | 'alerts';
export type UserRole = 'buyer' | 'supplier' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const addToCart = (item: any) => {
    setCart(prev => [...prev, item]);
  };

  const startCheckout = (item: any) => {
    setActiveItem(item);
    setCurrentView('checkout');
  };

  const showDetails = (item: any) => {
    setActiveItem(item);
    setCurrentView('details');
  };

  const renderView = () => {
    if (userRole === 'supplier') {
      return <SupplierDashboard onSwitchRole={() => setUserRole('buyer')} />;
    }
    if (userRole === 'admin') {
      return <AdminConsole onSwitchRole={() => setUserRole('buyer')} />;
    }

    switch (currentView) {
      case 'marketplace':
        return <Marketplace onAddToCart={addToCart} onBuyNow={startCheckout} onViewDetails={showDetails} />;
      case 'details':
        return <CommodityDetails item={activeItem} onBack={() => setCurrentView('marketplace')} onBuyNow={startCheckout} onAddToCart={addToCart} />;
      case 'checkout':
        return <Checkout item={activeItem} onComplete={() => setCurrentView('orders')} onCancel={() => setCurrentView('marketplace')} />;
      case 'orders':
        return <Orders />;
      case 'rfq':
        return <RFQManager />;
      case 'intel':
        return <MarketIntelligence />;
      case 'alerts':
        return <PriceAlerts />;
      case 'profile':
        return (
          <div className="p-8 max-w-[1000px] mx-auto">
            <div className="mb-12 border-b border-border pb-8">
              <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase leading-none">Corporate DNA</h1>
              <p className="text-primary font-mono text-xs uppercase tracking-widest">USER_NODE: GBIT-9823 // AUTHENTICATED</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-surface border border-border p-8 rounded-2xl">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-border pb-4">Identity Matrix</h3>
                  <div className="space-y-6 font-mono text-xs">
                     <div className="flex justify-between">
                        <span className="text-textMuted uppercase">Company Name</span>
                        <span className="text-white font-bold">AgriCorp Global GMBH</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-textMuted uppercase">Headquarters</span>
                        <span className="text-white font-bold">Hamburg, DE</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-textMuted uppercase">Verification Status</span>
                        <span className="text-primary font-bold">VERIFIED_GOLD</span>
                     </div>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="bg-info/5 border border-info/20 p-8 rounded-2xl">
                     <h3 className="text-xs font-black text-info uppercase tracking-widest mb-2">Switch Operational Persona</h3>
                     <p className="text-[10px] text-textSecondary uppercase font-mono mb-6">Switch view to simulate other platform actors.</p>
                     <div className="grid grid-cols-1 gap-3">
                        <button onClick={() => setUserRole('supplier')} className="px-6 py-3 bg-warning text-black font-black uppercase text-[10px] rounded-xl hover:bg-white transition-all tracking-widest">Access Supplier Terminal</button>
                        <button onClick={() => setUserRole('admin')} className="px-6 py-3 bg-danger text-white font-black uppercase text-[10px] rounded-xl hover:bg-white/10 transition-all tracking-widest">Access Admin Terminal</button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <>
            <Hero onRfqClick={() => setCurrentView('rfq')} onBuyClick={() => setCurrentView('marketplace')} />
            <GrainGrid onViewDetails={showDetails} />
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
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onAiToggle={() => setIsAiOpen(true)} 
        userRole={userRole}
      />
      <CommandPalette onViewChange={setCurrentView} />
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />

      <main className={`lg:ml-[240px] ${currentView === 'dashboard' ? 'pt-0' : 'pt-[60px]'} relative pb-24 lg:pb-0`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + userRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-24 lg:bottom-8 right-4 z-[45]">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAiOpen(true)}
          className="w-14 h-14 bg-primary text-black rounded-full shadow-[0_0_30px_rgba(0,255,136,0.3)] flex items-center justify-center text-xl transition-transform group"
        >
          <span>✨</span>
        </motion.button>
      </div>

      <GrainAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}

export default App;
