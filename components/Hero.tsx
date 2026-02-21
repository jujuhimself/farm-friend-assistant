
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  onRfqClick?: () => void;
  onBuyClick?: () => void;
}

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=2070&auto=format&fit=crop',
    crop: 'GRADE A YELLOW MAIZE',
    region: 'MBEYA HIGHLANDS',
    price: '$272/MT',
    tag: 'NOW AVAILABLE',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1992&auto=format&fit=crop',
    crop: 'LONG GRAIN RICE',
    region: 'MOROGORO BASIN',
    price: '$615/MT',
    tag: 'EXPORT READY',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2070&auto=format&fit=crop',
    crop: 'PREMIUM CASHEWS',
    region: 'MTWARA COAST',
    price: '$1240/MT',
    tag: 'HIGH DEMAND',
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
    <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden flex items-end md:items-center">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30 z-10" />
          <img 
            src={SLIDES[currentSlide].image} 
            alt={SLIDES[currentSlide].crop}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 px-4 md:px-12 lg:px-20 pb-10 md:pb-0 max-w-[1400px] mx-auto w-full">
        <div className="max-w-[700px]">
          <motion.div
            key={`tag-${currentSlide}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-[10px] md:text-xs font-bold tracking-widest uppercase">
              {SLIDES[currentSlide].tag}
            </span>
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 md:mb-6 tracking-tighter uppercase leading-[0.9]"
          >
            {SLIDES[currentSlide].crop}
          </motion.h1>

          <motion.div
            key={`data-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6 md:gap-8 mb-6 md:mb-10"
          >
            <div>
              <p className="text-textMuted text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-1">Region</p>
              <p className="text-sm md:text-lg font-bold">{SLIDES[currentSlide].region}</p>
            </div>
            <div>
              <p className="text-textMuted text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-1">Price</p>
              <p className="text-primary text-sm md:text-lg font-bold">{SLIDES[currentSlide].price}</p>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onBuyClick}
              className="px-6 md:px-10 py-3 md:py-4 bg-primary text-background font-bold rounded-lg hover:bg-primaryHover transition-all text-xs md:text-sm tracking-wider uppercase"
            >
              Browse Marketplace
            </button>
            <button 
              onClick={onRfqClick}
              className="px-6 md:px-10 py-3 md:py-4 border border-border text-textPrimary font-bold rounded-lg hover:bg-surface transition-all text-xs md:text-sm tracking-wider uppercase backdrop-blur-md"
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-primary' : 'w-3 bg-textMuted/40'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
