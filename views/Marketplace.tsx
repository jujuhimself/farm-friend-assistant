import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import SampleRequestModal from '../components/SampleRequestModal';
import { PRODUCT_CATALOG } from '../constants';
import { useListings } from '../hooks/useListings';

interface MarketplaceProps {
  onAddToCart: (item: any) => void;
  onBuyNow: (item: any) => void;
  onViewDetails: (item: any) => void;
}

const CATEGORIES = ['All', 'Cereal Grains', 'Legume Grains', 'Nuts & Oilseeds', 'Root & Tubers'];
const ORIGINS = ['All Regions', 'Dar es Salaam', 'Morogoro', 'Mwanza', 'Kilimanjaro', 'Mtwara'];

const Marketplace: React.FC<MarketplaceProps> = ({ onAddToCart, onBuyNow, onViewDetails }) => {
  const { listings: dbListings, loading } = useListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOrigin, setSelectedOrigin] = useState('All Regions');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [selectedItemForSample, setSelectedItemForSample] = useState<any | null>(null);

  // Merge DB listings with static catalog, preferring DB data
  const allProducts = useMemo(() => {
    if (dbListings.length > 0) {
      const dbProducts = dbListings.map(l => {
        const catalogMatch = PRODUCT_CATALOG.find(p => p.crop.toLowerCase() === l.crop.toLowerCase());
        return {
          ...(catalogMatch || {}),
          id: l.id,
          crop: l.crop,
          category: (l as any).category || catalogMatch?.category || 'Cereal Grains',
          origin: l.origin,
          region: (l as any).region || l.origin,
          volume: l.volume,
          price: l.price,
          priceUnit: (l as any).price_unit || 'USD/MT',
          grade: l.grade || 'A',
          supplier: l.supplier || 'Verified Supplier',
          image: (l as any).image || catalogMatch?.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop',
          stockPeriod: (l as any).stock_period || catalogMatch?.stockPeriod || 'Available Now',
          harvestSeason: (l as any).harvest_season || catalogMatch?.harvestSeason || '—',
          description: l.description || catalogMatch?.description || '',
        };
      });
      const dbCrops = new Set(dbListings.map(l => l.crop.toLowerCase()));
      const catalogOnly = PRODUCT_CATALOG.filter(p => !dbCrops.has(p.crop.toLowerCase()));
      return [...dbProducts, ...catalogOnly];
    }
    return PRODUCT_CATALOG;
  }, [dbListings]);

  const filtered = useMemo(() => {
    let items = allProducts.filter(item => {
      const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.category || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesOrigin = selectedOrigin === 'All Regions' || item.origin === selectedOrigin;
      return matchesSearch && matchesCategory && matchesOrigin;
    });
    
    if (sortBy === 'price-asc') items.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') items.sort((a, b) => b.price - a.price);
    
    return items;
  }, [searchTerm, selectedCategory, selectedOrigin, sortBy, allProducts]);

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none mb-2">Commodity Marketplace</h1>
        <p className="text-textMuted text-[10px] md:text-xs font-mono uppercase tracking-widest">
          {filtered.length} products available · Verified Tanzanian Origin
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-6 md:mb-10">
        <input 
          type="text" 
          placeholder="Search crops, origin, category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 md:py-4 focus:border-primary focus:outline-none transition-all text-sm placeholder:text-textMuted"
        />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-2 rounded-lg text-[10px] md:text-xs font-bold border transition-all whitespace-nowrap ${
                  selectedCategory === c 
                    ? 'bg-primary text-background border-primary' 
                    : 'bg-surface text-textMuted border-border hover:border-textSecondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <select 
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-[10px] md:text-xs text-textSecondary focus:outline-none focus:border-primary"
            >
              {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-[10px] md:text-xs text-textSecondary focus:outline-none focus:border-primary"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all group cursor-pointer flex flex-col"
          >
            <div 
              onClick={() => onViewDetails(item)} 
              className="relative aspect-[4/3] overflow-hidden bg-background"
            >
              <img 
                src={item.image} 
                alt={item.crop}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop'; }}
              />
              <div className="absolute top-3 left-3">
                <span className="bg-background/80 backdrop-blur-sm text-textSecondary text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                  {item.category}
                </span>
              </div>
              {item.grade === 'A' && (
                <div className="absolute top-3 right-3">
                  <span className="bg-primary/90 text-background text-[9px] font-bold px-2 py-1 rounded-md">
                    GRADE A
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col" onClick={() => onViewDetails(item)}>
              <h3 className="text-sm md:text-base font-bold text-textPrimary mb-3 group-hover:text-primary transition-colors leading-tight">
                {item.crop}
              </h3>
              
              <div className="space-y-2 text-[11px] md:text-xs text-textSecondary mb-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-primary">📦</span>
                  <span className="font-semibold">{item.volume}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-danger">📍</span>
                  <span>{item.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💰</span>
                  <span className="font-bold text-textPrimary">${item.price.toLocaleString()} <span className="text-textMuted font-normal">{item.priceUnit}</span></span>
                </div>
              </div>
              
              <div className="text-[10px] text-textMuted mb-4">
                <span className="font-semibold">Stock Period:</span>
                <br />
                <span className="font-bold text-textSecondary">{item.stockPeriod}</span>
              </div>
            </div>

            <div className="px-4 pb-4 space-y-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onBuyNow(item); }}
                className="w-full py-3 bg-primary text-background rounded-xl text-xs font-bold hover:bg-primaryHover transition-all"
              >
                Buy Now
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onViewDetails(item); }}
                  className="py-2.5 border border-border text-textSecondary rounded-xl text-[10px] font-bold hover:bg-surface-hover transition-all"
                >
                  View Details
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedItemForSample(item); }}
                  className="py-2.5 border border-border text-textSecondary rounded-xl text-[10px] font-bold hover:bg-surface-hover transition-all"
                >
                  Get Quote
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-textMuted text-sm">No products match your search.</p>
        </div>
      )}

      <SampleRequestModal 
        isOpen={!!selectedItemForSample} 
        onClose={() => setSelectedItemForSample(null)} 
        item={selectedItemForSample}
      />
    </div>
  );
};

export default Marketplace;
