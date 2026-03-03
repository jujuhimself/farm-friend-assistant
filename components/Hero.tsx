
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

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img 
            src={slide.image} 
            alt={slide.crop}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />

      {/* Content - positioned relative to flow naturally */}
      <div className="relative z-20 px-4 md:px-8 pt-[30vh] md:pt-[35vh] pb-10 md:pb-14">
        <div className="max-w-[500px]">
          <motion.div
            key={`tag-${currentSlide}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 mb-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-[9px] md:text-[10px] font-bold tracking-widest uppercase">
              {slide.tag}
            </span>
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl lg:text-4xl font-black mb-4 tracking-tighter uppercase leading-tight"
          >
            {slide.crop}
          </motion.h1>

          <motion.div
            key={`data-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6 mb-5"
          >
            <div>
              <p className="text-text-muted text-[8px] md:text-[9px] uppercase font-bold tracking-widest mb-0.5">Region</p>
              <p className="text-xs md:text-sm font-bold">{slide.region}</p>
            </div>
            <div>
              <p className="text-text-muted text-[8px] md:text-[9px] uppercase font-bold tracking-widest mb-0.5">Price</p>
              <p className="text-primary text-xs md:text-sm font-bold">{slide.price}</p>
            </div>
          </motion.div>

          <div className="flex gap-2 md:gap-3">
            <button 
              onClick={onBuyClick}
              className="px-5 md:px-8 py-2.5 md:py-3 bg-primary text-background font-bold rounded-lg hover:bg-primaryHover transition-all text-[10px] md:text-xs tracking-wider uppercase"
            >
              Browse Market
            </button>
            <button 
              onClick={onRfqClick}
              className="px-5 md:px-8 py-2.5 md:py-3 border border-border text-textPrimary font-bold rounded-lg hover:bg-surface transition-all text-[10px] md:text-xs tracking-wider uppercase backdrop-blur-md"
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1 rounded-full transition-all ${currentSlide === i ? 'w-6 bg-primary' : 'w-2 bg-textMuted/40'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
