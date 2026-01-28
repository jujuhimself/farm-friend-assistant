
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  onRfqClick?: () => void;
  onBuyClick?: () => void;
}

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=2070&auto=format&fit=crop', // Maize Field Drone
    crop: 'GRADE A YELLOW MAIZE',
    region: 'MBEYA HIGHLANDS',
    price: '$272/MT',
    telemetry: 'ALT_1700M // TEMP_22C // HUM_65%',
    tag: '[SATELLITE_LINK_ACTIVE]'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1992&auto=format&fit=crop', // Grain silos/warehouse
    crop: 'LONG GRAIN RICE',
    region: 'MOROGORO BASIN',
    price: '$615/MT',
    telemetry: 'STOCK_READY // GRADE_A+ // VOL_800MT',
    tag: '[WAREHOUSE_SCAN_READY]'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070&auto=format&fit=crop', // Cashews close up
    crop: 'PREMIUM CASHEWS',
    region: 'MTWARA COAST',
    price: '$1240/MT',
    telemetry: 'EXPORT_READY // LCL_AVAILABLE',
    tag: '[LOGISTICS_OPTIMIZED]'
  }
];

const Hero: React.FC<HeroProps> = ({ onRfqClick, onBuyClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] md:h-screen w-full overflow-hidden flex items-center">
      {/* Background Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img 
            src={SLIDES[currentSlide].image} 
            alt="Ag landscape" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* HUD Elements */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5"></div>
        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/5"></div>
        
        {/* Corners */}
        <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-primary/30"></div>
        <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-primary/30"></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-primary/30"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-primary/30"></div>

        {/* Floating Data Nodes */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-20 text-[9px] font-mono text-primary/60 space-y-1 hidden lg:block"
        >
          <p>UPLINK_STRENGTH: 98%</p>
          <p>LAT: -6.7924</p>
          <p>LNG: 39.2026</p>
          <p>ROT: 45.2°</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-30 px-6 md:px-20 max-w-[1400px] mx-auto w-full">
        <div className="max-w-[800px]">
          <motion.div
            key={`tag-${currentSlide}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-[10px] md:text-xs font-black tracking-[0.3em] uppercase">
              {SLIDES[currentSlide].tag}
            </span>
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-[0.9] glow-text"
          >
            {SLIDES[currentSlide].crop}
          </motion.h1>

          <motion.div
            key={`data-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-8 mb-10 font-mono"
          >
            <div>
              <p className="text-textMuted text-[10px] uppercase font-bold tracking-widest mb-1">Origin Node</p>
              <p className="text-white text-lg font-bold">{SLIDES[currentSlide].region}</p>
            </div>
            <div>
              <p className="text-textMuted text-[10px] uppercase font-bold tracking-widest mb-1">Index Price</p>
              <p className="text-primary text-lg font-bold">{SLIDES[currentSlide].price}</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-textMuted text-[10px] uppercase font-bold tracking-widest mb-1">Telemetry</p>
              <p className="text-white text-lg font-bold">{SLIDES[currentSlide].telemetry}</p>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onRfqClick}
              className="px-10 py-5 bg-primary text-black font-black rounded-lg hover:scale-105 transition-all text-xs tracking-widest uppercase shadow-[0_0_30px_rgba(0,255,136,0.4)]"
            >
              INITIATE_RFQ
            </button>
            <button 
              onClick={onBuyClick}
              className="px-10 py-5 border-2 border-white/20 text-white font-black rounded-lg hover:bg-white hover:text-black transition-all text-xs tracking-widest uppercase backdrop-blur-md"
            >
              DIRECT_ACCESS
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1 transition-all ${currentSlide === i ? 'w-12 bg-primary' : 'w-4 bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
