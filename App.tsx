
import React, { useState } from 'react';
import { TRADE_NEWS } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
import GrainGrid from './components/GrainGrid';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
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
import { useAuth } from './hooks/useAuth';

export type ViewType = 'dashboard' | 'marketplace' | 'orders' | 'rfq' | 'profile' | 'checkout' | 'details' | 'inventory' | 'admin' | 'alerts' | 'news' | 'registration' | 'settings';
export type UserRole = 'buyer' | 'supplier' | 'admin' | 'guest';

function App() {
  const auth = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [pendingView, setPendingView] = useState<ViewType | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<any | null>(null);

  const userRole: UserRole = auth.isAuthenticated ? auth.role : 'guest';

  const addToCart = (item: any) => {
    setCart(prev => [...prev, item]);
  };

  const protectedNavigate = (view: ViewType, item?: any) => {
    if (!auth.isAuthenticated && ['rfq', 'orders', 'checkout', 'profile', 'settings', 'alerts'].includes(view)) {
      setPendingView(view);
      if (item) setActiveItem(item);
      setCurrentView('registration');
    } else {
      if (item) setActiveItem(item);
      setCurrentView(view);
    }
  };

  const handleAuthSuccess = (role: UserRole) => {
    if (pendingView) {
      setCurrentView(pendingView);
      setPendingView(null);
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setCurrentView('dashboard');
  };

  const showDetails = (item: any) => {
    setActiveItem(item);
    setCurrentView('details');
  };

  const renderView = () => {
    if (userRole === 'supplier' && currentView === 'dashboard') {
      return <SupplierDashboard onSwitchRole={() => setCurrentView('dashboard')} />;
    }
    if (userRole === 'admin' && currentView === 'dashboard') {
      return <AdminConsole onSwitchRole={() => setCurrentView('dashboard')} />;
    }

    switch (currentView) {
      case 'registration':
        return <Registration onComplete={handleAuthSuccess} onCancel={() => setCurrentView('dashboard')} authActions={{ signUp: auth.signUp, signIn: auth.signIn }} />;
      case 'marketplace':
        return <Marketplace onAddToCart={addToCart} onBuyNow={(item) => protectedNavigate('checkout', item)} onViewDetails={showDetails} />;
      case 'details':
        return <CommodityDetails item={activeItem} onBack={() => setCurrentView('marketplace')} onBuyNow={(item) => protectedNavigate('checkout', item)} onAddToCart={addToCart} />;
      case 'checkout':
        return <Checkout item={activeItem} onComplete={() => setCurrentView('orders')} onCancel={() => setCurrentView('marketplace')} isAuthenticated={auth.isAuthenticated} onRequireAuth={() => setCurrentView('registration')} />;
      case 'orders':
        return <Orders />;
      case 'rfq':
        return <RFQManager />;
      case 'news':
        return <NewsFeed onBack={() => setCurrentView('dashboard')} />;
      case 'alerts':
        return <PriceAlerts />;
      case 'profile':
        return <Profile userRole={userRole} onLogout={handleLogout} profile={auth.profile} onUpdateProfile={auth.updateProfile} />;
      case 'settings':
        return <Settings profile={auth.profile} onUpdateProfile={auth.updateProfile} />;
      case 'admin':
        return <AdminConsole onSwitchRole={() => setCurrentView('dashboard')} />;
      case 'dashboard':
      default:
        return (
          <>
            <Hero onRfqClick={() => protectedNavigate('rfq')} onBuyClick={() => setCurrentView('marketplace')} />
            <GrainGrid onViewDetails={showDetails} />
            <ActivityFeed />
            <QuickActions onViewChange={(v) => protectedNavigate(v as ViewType)} />
            <section className="py-8 md:py-16 px-4 max-w-[1400px] mx-auto">
              <div className="flex items-center gap-4 mb-6 md:mb-10">
                <h2 className="text-lg md:text-2xl font-bold whitespace-nowrap uppercase tracking-tighter">Latest News</h2>
                <div className="h-px bg-border border-dashed border-t flex-1"></div>
                <button onClick={() => setCurrentView('news')} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline whitespace-nowrap">
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {TRADE_NEWS.slice(0, 3).map((article: any) => (
                  <div key={article.id} onClick={() => setCurrentView('news')} className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group">
                    {article.image && (
                      <div className="aspect-video overflow-hidden">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold text-primary uppercase">#{article.category}</span>
                        <span className="text-[9px] text-textMuted">{article.date}</span>
                      </div>
                      <h3 className="text-sm font-bold group-hover:text-primary transition-colors leading-tight mb-2">{article.title}</h3>
                      <p className="text-[11px] text-textMuted line-clamp-2">{article.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
    }
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-textMuted text-xs font-mono uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-mono selection:bg-primary/30 text-textPrimary overflow-x-hidden">
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

      <div className="fixed bottom-[88px] lg:bottom-8 right-4 z-40">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAiOpen(true)}
          className="w-12 h-12 md:w-14 md:h-14 bg-primary text-background rounded-full shadow-[0_0_30px_rgba(0,255,136,0.3)] flex items-center justify-center text-lg md:text-xl transition-transform"
        >
          ✨
        </motion.button>
      </div>

      <GrainAI isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}

export default App;
