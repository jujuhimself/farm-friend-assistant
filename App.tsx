
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
import NewsFeed from './views/NewsFeed';
import Profile from './views/Profile';
import Settings from './views/Settings';
import Registration from './views/Registration';
import GrainAI from './components/GrainAI';
import BottomNav from './components/BottomNav';

export type ViewType = 'dashboard' | 'marketplace' | 'orders' | 'rfq' | 'intel' | 'profile' | 'checkout' | 'details' | 'inventory' | 'admin' | 'alerts' | 'news' | 'registration' | 'settings';
export type UserRole = 'buyer' | 'supplier' | 'admin' | 'guest';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // DEV_MODE: Set to 'buyer' or 'supplier' and true to bypass registration flow
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  const [pendingView, setPendingView] = useState<ViewType | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const addToCart = (item: any) => {
    setCart(prev => [...prev, item]);
  };

  const protectedNavigate = (view: ViewType, item?: any) => {
    // Check bypassed for easier development as per user request
    if (!isAuthenticated) {
      setPendingView(view);
      if (item) setActiveItem(item);
      setCurrentView('registration');
    } else {
      if (item) setActiveItem(item);
      setCurrentView(view);
    }
  };

  const handleAuthSuccess = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
    } else {
      setCurrentView('dashboard');
    }
  };

  const showDetails = (item: any) => {
    setActiveItem(item);
    setCurrentView('details');
  };

  const renderView = () => {
    if (userRole === 'supplier' && currentView === 'dashboard') {
      return <SupplierDashboard onSwitchRole={() => setUserRole('buyer')} />;
    }
    if (userRole === 'admin') {
      return <AdminConsole onSwitchRole={() => setUserRole('buyer')} />;
    }

    switch (currentView) {
      case 'registration':
        return <Registration onComplete={handleAuthSuccess} onCancel={() => setCurrentView('dashboard')} />;
      case 'marketplace':
        return <Marketplace onAddToCart={addToCart} onBuyNow={(item) => protectedNavigate('checkout', item)} onViewDetails={showDetails} />;
      case 'details':
        return <CommodityDetails item={activeItem} onBack={() => setCurrentView('marketplace')} onBuyNow={(item) => protectedNavigate('checkout', item)} onAddToCart={addToCart} />;
      case 'checkout':
        return <Checkout item={activeItem} onComplete={() => setCurrentView('orders')} onCancel={() => setCurrentView('marketplace')} />;
      case 'orders':
        return <Orders />;
      case 'rfq':
        return <RFQManager />;
      case 'intel':
        return <MarketIntelligence onViewChange={(v) => protectedNavigate(v as ViewType)} />;
      case 'news':
        return <NewsFeed onBack={() => setCurrentView('intel')} />;
      case 'alerts':
        return <PriceAlerts />;
      case 'profile':
        return <Profile userRole={userRole} onLogout={() => { setIsAuthenticated(false); setUserRole('guest'); setCurrentView('dashboard'); }} />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return (
          <>
            <Hero onRfqClick={() => protectedNavigate('rfq')} onBuyClick={() => setCurrentView('marketplace')} />
            <GrainGrid onViewDetails={showDetails} />
            <ActivityFeed />
            <QuickActions onViewChange={(v) => protectedNavigate(v as ViewType)} />
            <MarketIntelligence onViewChange={(v) => protectedNavigate(v as ViewType)} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background font-mono selection:bg-primary/30 text-white overflow-x-hidden">
      <Ticker cartCount={cart.length} />
      <Sidebar 
        currentView={currentView} 
        onViewChange={(v) => protectedNavigate(v as ViewType)} 
        onAiToggle={() => setIsAiOpen(true)} 
        userRole={userRole}
      />
      <CommandPalette onViewChange={(v) => protectedNavigate(v as ViewType)} />
      <BottomNav currentView={currentView} onViewChange={(v) => protectedNavigate(v as ViewType)} />

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
