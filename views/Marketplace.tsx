
import React, { useState } from 'react';
import SampleRequestModal from '../components/SampleRequestModal';
import { useListings } from '../hooks/useListings';

interface MarketplaceProps {
  onAddToCart: (item: any) => void;
  onBuyNow: (item: any) => void;
  onViewDetails: (item: any) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onAddToCart, onBuyNow, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedItemForSample, setSelectedItemForSample] = useState<any | null>(null);
  const { listings, loading } = useListings();

  const crops = ['ALL', 'MAIZE', 'RICE', 'SOYBEANS', 'SESAME', 'COFFEE', 'CASHEWS', 'AVOCADOS', 'VANILLA'];

  const filtered = listings.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.supplier || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'ALL' || item.crop.includes(selectedCrop);
    return matchesSearch && matchesCrop;
  });

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-black mb-2 md:mb-4 tracking-tighter uppercase leading-none">Commodity Marketplace</h1>
        <p className="text-textMuted font-mono text-xs md:text-sm uppercase tracking-widest">Global Sourcing Matrix // Verified Origin</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8 md:mb-12">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="FIND CROP, ORIGIN, OR SUPPLIER..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-5 py-3 md:py-4 focus:border-primary focus:outline-none transition-all font-mono text-xs md:text-sm uppercase tracking-wider"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {crops.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-black border transition-all whitespace-nowrap uppercase tracking-widest ${
                selectedCrop === c ? 'bg-primary text-black border-primary' : 'bg-surface text-textMuted border-border hover:border-textMuted'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-surface border border-border p-5 md:p-6 rounded-2xl h-[320px] animate-pulse">
              <div className="h-4 bg-border rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-border rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-border rounded w-full mb-2"></div>
              <div className="h-4 bg-border rounded w-full mb-2"></div>
              <div className="h-4 bg-border rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map(item => (
            <div key={item.id} className="bg-surface border border-border p-5 md:p-6 rounded-2xl hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col justify-between">
              <div onClick={() => onViewDetails(item)} className="cursor-pointer">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div>
                    <span className="text-[9px] md:text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded tracking-widest uppercase mb-2 inline-block">GRADE {item.grade}</span>
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{item.crop}</h3>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-xl md:text-2xl font-black text-white">${item.price}</p>
                    <p className="text-[9px] md:text-[10px] text-textMuted font-black uppercase tracking-widest">USD/MT</p>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-xs md:text-sm font-mono uppercase tracking-wide">
                  <div className="flex justify-between border-b border-border/50 pb-1">
                    <span className="text-textMuted text-[9px] md:text-[10px] font-bold">Origin</span>
                    <span className="text-white">{item.origin}, TZ</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1">
                    <span className="text-textMuted text-[9px] md:text-[10px] font-bold">Stock</span>
                    <span className="text-white">{item.volume}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-1">
                    <span className="text-textMuted text-[9px] md:text-[10px] font-bold">Seller</span>
                    <span className="text-primary">{item.supplier || 'Verified Supplier'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-3 relative z-10">
                <button 
                  onClick={() => onViewDetails(item)}
                  className="w-full py-2.5 md:py-3 bg-white/5 border border-primary/20 text-primary rounded-xl text-[10px] md:text-xs font-black uppercase hover:bg-primary/10 transition-all flex items-center justify-center gap-2 tracking-widest"
                >
                  <span>[i]</span> VIEW DNA & SPECS
                </button>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <button 
                    onClick={() => setSelectedItemForSample(item)}
                    className="py-2.5 md:py-3 border border-border text-textSecondary rounded-xl text-[10px] md:text-xs font-black uppercase hover:bg-white/5 transition-all tracking-widest"
                  >
                    REQ_SAMPLE
                  </button>
                  <button 
                    onClick={() => onBuyNow(item)}
                    className="py-2.5 md:py-3 bg-primary text-black rounded-xl text-[10px] md:text-xs font-black uppercase hover:bg-primaryHover transition-all shadow-lg shadow-primary/10 tracking-widest"
                  >
                    BUY_NOW
                  </button>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 text-primary opacity-[0.03] text-6xl md:text-8xl font-black pointer-events-none group-hover:opacity-[0.07] transition-opacity uppercase font-mono">
                {String(item.id).slice(-2).padStart(2, '0')}
              </div>
            </div>
          ))}
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
