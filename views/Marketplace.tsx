
import React, { useState } from 'react';
import SampleRequestModal from '../components/SampleRequestModal';

const LISTINGS = [
  { id: '1', crop: 'YELLOW MAIZE', origin: 'Mbeya', volume: '1,200 MT', price: 272, grade: 'A', supplier: 'Mazaohub' },
  { id: '2', crop: 'LONG GRAIN RICE', origin: 'Morogoro', volume: '800 MT', price: 615, grade: 'A', supplier: 'Kilombero Agro' },
  { id: '3', crop: 'SOYBEANS', origin: 'Iringa', volume: '450 MT', price: 438, grade: 'B', supplier: 'Mbeya Traders' },
  { id: '4', crop: 'SESAME', origin: 'Lindi', volume: '300 MT', price: 1845, grade: 'A', supplier: 'Southern Collective' },
  { id: '5', crop: 'COFFEE (ARABICA)', origin: 'Kilimanjaro', volume: '150 MT', price: 2420, grade: 'A', supplier: 'Kilimanjaro Estates' },
  { id: '6', crop: 'CASHEWS', origin: 'Mtwara', volume: '2,000 MT', price: 1240, grade: 'A', supplier: 'Coastal Exports' },
];

interface MarketplaceProps {
  onAddToCart: (item: any) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [selectedItemForSample, setSelectedItemForSample] = useState<any | null>(null);

  const crops = ['ALL', 'MAIZE', 'RICE', 'SOYBEANS', 'SESAME', 'COFFEE', 'CASHEWS'];

  const filtered = LISTINGS.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'ALL' || item.crop.includes(selectedCrop);
    return matchesSearch && matchesCrop;
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tighter">COMMODITY MARKETPLACE</h1>
        <p className="text-textMuted font-mono text-sm uppercase">REAL-TIME ACCESS TO VERIFIED TANZANIAN ORIGIN STOCK</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search by crop, origin, or supplier..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-6 py-4 focus:border-primary focus:outline-none transition-all font-mono"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {crops.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
                selectedCrop === c ? 'bg-primary text-black border-primary' : 'bg-surface text-textMuted border-border hover:border-textMuted'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(item => (
          <div key={item.id} className="bg-surface border border-border p-6 rounded-2xl hover:border-primary/50 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded tracking-widest uppercase mb-2 inline-block">GRADE {item.grade}</span>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.crop}</h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">${item.price}</p>
                <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">USD/MT</p>
              </div>
            </div>

            <div className="space-y-3 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="text-textMuted uppercase text-[10px] font-bold">Origin</span>
                <span className="text-white font-mono">{item.origin}, TZ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMuted uppercase text-[10px] font-bold">Available</span>
                <span className="text-white font-mono">{item.volume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMuted uppercase text-[10px] font-bold">Supplier</span>
                <span className="text-primary font-mono text-xs">{item.supplier}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onAddToCart(item)}
                className="w-full py-3 bg-white/5 border border-primary/30 text-primary rounded-xl text-xs font-bold uppercase hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
              >
                <span>[+]</span> ADD TO CART
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setSelectedItemForSample(item)}
                  className="py-3 border border-border text-textSecondary rounded-xl text-xs font-bold uppercase hover:bg-white/5 transition-all"
                >
                  REQ SAMPLE
                </button>
                <button className="py-3 bg-primary text-black rounded-xl text-xs font-bold uppercase hover:bg-primaryHover transition-all shadow-lg shadow-primary/10">
                  BUY NOW
                </button>
              </div>
            </div>

            {/* Hover Decor */}
            <div className="absolute -bottom-4 -right-4 text-primary opacity-[0.03] text-8xl font-black pointer-events-none group-hover:opacity-[0.07] transition-opacity uppercase font-mono">
              {item.id.padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl">
          <p className="text-textMuted font-mono text-lg uppercase tracking-widest">No listings match your search parameters.</p>
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
