
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRADE_NEWS } from '../constants';
import { TradeNews } from '../types';

const NewsFeed: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedArticle, setSelectedArticle] = useState<TradeNews | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'POLICY', 'MARKET', 'LOGISTICS', 'WEATHER'];
  
  const filteredNews = activeCategory === 'ALL' 
    ? TRADE_NEWS 
    : TRADE_NEWS.filter(n => n.category === activeCategory);

  const featuredArticle = TRADE_NEWS[0];

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-4 md:py-8">
          <button onClick={onBack} className="text-primary font-mono text-[9px] uppercase tracking-widest mb-3 hover:translate-x-[-2px] transition-transform flex items-center gap-1">
            ← BACK
          </button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">The Wire</h1>
              <p className="text-text-muted font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5">Intelligence & Reports</p>
            </div>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
                    activeCategory === cat 
                      ? 'bg-primary text-background' 
                      : 'bg-surface border border-border text-text-muted'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-4 md:py-8">

        {/* Featured */}
        {activeCategory === 'ALL' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedArticle(featuredArticle)}
            className="relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group mb-4 md:mb-8"
          >
            <div className="aspect-[16/9] md:aspect-[21/9]">
              <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[8px] md:text-[9px] font-black bg-primary text-background px-1.5 py-0.5 rounded uppercase">{featuredArticle.category}</span>
                <span className="text-[8px] md:text-[9px] text-text-muted font-mono">{featuredArticle.date}</span>
              </div>
              <h2 className="text-base md:text-3xl font-black uppercase tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors max-w-2xl">
                {featuredArticle.title}
              </h2>
              <p className="text-[10px] md:text-xs text-text-secondary max-w-xl line-clamp-2 hidden md:block">{featuredArticle.summary}</p>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredNews.map((article, i) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelectedArticle(article)}
              className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
            >
              {article.image && (
                <div className="aspect-video overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              )}
              <div className="p-3 md:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                    article.category === 'POLICY' ? 'bg-warning/10 text-warning' :
                    article.category === 'MARKET' ? 'bg-primary/10 text-primary' :
                    article.category === 'LOGISTICS' ? 'bg-info/10 text-info' :
                    'bg-danger/10 text-danger'
                  }`}>
                    {article.category}
                  </span>
                  <span className="text-[8px] text-text-muted font-mono">{article.date}</span>
                </div>
                <h3 className="text-xs md:text-sm font-black group-hover:text-primary transition-colors leading-tight mb-1.5 uppercase tracking-tight">
                  {article.title}
                </h3>
                <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed mb-2">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-text-muted font-bold uppercase">{article.author}</span>
                  <span className="text-[8px] text-text-muted font-mono">{article.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Article Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedArticle(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full md:max-w-[700px] bg-surface border border-border md:rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] md:max-h-[80vh]"
            >
              <div className="h-[160px] md:h-[250px] relative flex-shrink-0">
                <img src={selectedArticle.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                <button onClick={() => setSelectedArticle(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white text-xs z-20">✕</button>
              </div>
              
              <div className="p-4 md:p-8 overflow-y-auto flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                    selectedArticle.category === 'POLICY' ? 'bg-warning/10 text-warning' :
                    selectedArticle.category === 'MARKET' ? 'bg-primary/10 text-primary' :
                    'bg-info/10 text-info'
                  }`}>
                    {selectedArticle.category}
                  </span>
                  <span className="text-[9px] text-text-muted font-mono">{selectedArticle.date} · {selectedArticle.readTime}</span>
                </div>
                
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight leading-tight mb-3">{selectedArticle.title}</h2>
                <p className="text-[9px] text-text-muted font-bold uppercase mb-4 pb-3 border-b border-border">By {selectedArticle.author}</p>
                
                <div className="space-y-3 text-xs md:text-sm text-text-secondary leading-relaxed">
                  <p className="text-sm font-semibold text-white">{selectedArticle.summary}</p>
                  <p>{selectedArticle.content}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsFeed;
