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

const Marketplace: React.FC<MarketplaceProps> = ({ onAddToCart, onBuyNow, onViewDetails }) => {
  const { listings: dbListings, loading } = useListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest');
  const [selectedItemForSample, setSelectedItemForSample] = useState<any | null>(null);

  const allProducts = useMemo(() => {
    if (dbListings.length > 0) {
      const dbProducts = dbListings.map(l => {
        const catalogMatch = PRODUCT_CATALOG.find(p => p.crop.toLowerCase() === l.crop.toLowerCase());
        return {
          ...(catalogMatch || {}),
          id: l.id, crop: l.crop,
          category: (l as any).category || catalogMatch?.category || 'Cereal Grains',
          origin: l.origin, region: (l as any).region || l.origin,
          volume: l.volume, price: l.price,
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
                            item.origin.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    if (sortBy === 'price-asc') items.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') items.sort((a, b) => b.price - a.price);
    return items;
  }, [searchTerm, selectedCategory, sortBy, allProducts]);

  return (
    <div className="px-3 md:px-6 py-4 md:py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase leading-none mb-1">Marketplace</h1>
        <p className="text-text-muted text-[9px] md:text-[10px] font-mono uppercase tracking-widest">
          {filtered.length} products · Verified Origin
        </p>
      </div>

      {/* Search */}
      <input 
        type="text" 
        placeholder="Search crops, origin..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 md:py-3 focus:border-primary focus:outline-none transition-all text-xs placeholder:text-text-muted mb-3"
      />
      
      {/* Filters */}
      <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-2.5 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold border transition-all whitespace-nowrap flex-shrink-0 ${
              selectedCategory === c 
                ? 'bg-primary text-background border-primary' 
                : 'bg-surface text-text-muted border-border'
            }`}
          >
            {c}
          </button>
        ))}
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-surface border border-border rounded-lg px-2 py-1.5 text-[9px] text-text-secondary focus:outline-none flex-shrink-0 ml-auto"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all group cursor-pointer flex flex-col"
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
              {item.grade === 'A' && (
                <div className="absolute top-2 right-2">
                  <span className="bg-primary/90 text-background text-[7px] md:text-[8px] font-bold px-1.5 py-0.5 rounded">
                    A
                  </span>
                </div>
              )}
            </div>

            <div className="p-2.5 md:p-3 flex-1 flex flex-col" onClick={() => onViewDetails(item)}>
              <h3 className="text-[11px] md:text-sm font-bold text-text-primary mb-1 group-hover:text-primary transition-colors leading-tight">
                {item.crop}
              </h3>
              
              <div className="text-[9px] md:text-[10px] text-text-secondary space-y-0.5 mb-2 flex-1">
                <p>📦 {item.volume}</p>
                <p>📍 {item.origin}</p>
              </div>
              
              <p className="text-xs md:text-sm font-black text-primary mb-2">${item.price.toLocaleString()} <span className="text-text-muted text-[8px] font-normal">{item.priceUnit}</span></p>
            </div>

            <div className="px-2.5 pb-2.5 md:px-3 md:pb-3 space-y-1.5">
              <button 
                onClick={(e) => { e.stopPropagation(); onBuyNow(item); }}
                className="w-full py-2 md:py-2.5 bg-primary text-background rounded-lg text-[10px] font-bold hover:bg-primary-hover transition-all"
              >
                Buy Now
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedItemForSample(item); }}
                className="w-full py-1.5 md:py-2 border border-border text-text-secondary rounded-lg text-[9px] font-bold hover:bg-surface-hover transition-all"
              >
                Get Quote
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-text-muted text-xs">No products match your search.</p>
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
