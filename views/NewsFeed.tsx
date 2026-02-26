
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
    <div className="min-h-screen bg-background animate-in fade-in duration-500">
      
      {/* Compact Header */}
      <div className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
          <button onClick={onBack} className="text-primary font-mono text-[10px] uppercase tracking-widest mb-4 hover:translate-x-[-4px] transition-transform flex items-center gap-2">
            ← BACK
          </button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">The Wire</h1>
              <p className="text-textMuted font-mono text-[10px] uppercase tracking-[0.3em] mt-1">Field Intelligence & Policy Reports</p>
            </div>
            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 md:px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                    activeCategory === cat 
                      ? 'bg-primary text-background' 
                      : 'bg-surface border border-border text-textMuted hover:text-white hover:border-border-hover'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-12">

        {/* Featured Article - Hero Card */}
        {activeCategory === 'ALL' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedArticle(featuredArticle)}
            className="relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group mb-8 md:mb-12"
          >
            <div className="aspect-[16/9] md:aspect-[21/9]">
              <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] md:text-[10px] font-black bg-primary text-background px-2 py-0.5 rounded uppercase">{featuredArticle.category}</span>
                <span className="text-[9px] md:text-[10px] text-textMuted font-mono">{featuredArticle.date}</span>
                <span className="text-[9px] md:text-[10px] text-textMuted font-mono">{featuredArticle.readTime}</span>
              </div>
              <h2 className="text-xl md:text-4xl font-black uppercase tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors max-w-3xl">
                {featuredArticle.title}
              </h2>
              <p className="text-xs md:text-sm text-textSecondary max-w-2xl line-clamp-2 hidden md:block">{featuredArticle.summary}</p>
            </div>
          </motion.div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredNews.map((article, i) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedArticle(article)}
              className="bg-surface border border-border rounded-xl md:rounded-2xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
            >
              {article.image && (
                <div className="aspect-video overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
              )}
              <div className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                    article.category === 'POLICY' ? 'bg-warning/10 text-warning' :
                    article.category === 'MARKET' ? 'bg-primary/10 text-primary' :
                    article.category === 'LOGISTICS' ? 'bg-info/10 text-info' :
                    'bg-danger/10 text-danger'
                  }`}>
                    {article.category}
                  </span>
                  <span className="text-[9px] text-textMuted font-mono">{article.date}</span>
                </div>
                <h3 className="text-sm md:text-base font-black group-hover:text-primary transition-colors leading-tight mb-2 uppercase tracking-tight">
                  {article.title}
                </h3>
                <p className="text-[11px] text-textSecondary line-clamp-2 leading-relaxed mb-3">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-textMuted font-bold uppercase">{article.author}</span>
                  <span className="text-[9px] text-textMuted font-mono">{article.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Article Full View Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedArticle(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full md:max-w-[800px] bg-surface border border-border md:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] md:max-h-[85vh]"
            >
              {/* Article Header Image */}
              <div className="h-[200px] md:h-[300px] relative shrink-0">
                <img src={selectedArticle.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all text-sm z-20">✕</button>
              </div>
              
              {/* Article Content */}
              <div className="p-5 md:p-10 overflow-y-auto flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                    selectedArticle.category === 'POLICY' ? 'bg-warning/10 text-warning' :
                    selectedArticle.category === 'MARKET' ? 'bg-primary/10 text-primary' :
                    selectedArticle.category === 'LOGISTICS' ? 'bg-info/10 text-info' :
                    'bg-danger/10 text-danger'
                  }`}>
                    {selectedArticle.category}
                  </span>
                  <span className="text-[10px] text-textMuted font-mono">{selectedArticle.date}</span>
                  <span className="text-[10px] text-textMuted font-mono">{selectedArticle.readTime}</span>
                </div>
                
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-4">{selectedArticle.title}</h2>
                
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                  <span className="text-[10px] text-textMuted font-bold uppercase">By {selectedArticle.author}</span>
                </div>
                
                <div className="space-y-4 text-sm text-textSecondary leading-relaxed">
                  <p className="text-base font-semibold text-white">{selectedArticle.summary}</p>
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
