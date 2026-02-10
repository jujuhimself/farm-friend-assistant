
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRADE_NEWS } from '../constants';
import { TradeNews } from '../types';

const NewsFeed: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedArticle, setSelectedArticle] = useState<TradeNews | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = TRADE_NEWS.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* 1. Header & Navigation */}
      <div className="mb-16 border-b border-border pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="space-y-4">
          <button onClick={onBack} className="text-primary font-mono text-[10px] uppercase tracking-widest mb-4 hover:translate-x-[-4px] transition-transform flex items-center gap-2">
            ← BACK TO TERMINAL
          </button>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">The Wire</h1>
          <p className="text-textMuted font-mono text-xs uppercase tracking-[0.4em]">Agricultural Field Intelligence & Policy Reports</p>
        </div>
        
        <div className="w-full md:w-96">
          <input 
            type="text" 
            placeholder="SEARCH INTEL..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-6 py-4 focus:border-primary outline-none font-mono text-xs uppercase tracking-widest text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* 2. Main Feed (Left) */}
        <div className="lg:col-span-8 space-y-16">
          {filteredNews.map((article) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="group cursor-pointer border-b border-border pb-16"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden rounded-3xl shrink-0">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">#{article.category}</span>
                      <span className="text-[10px] text-textMuted font-mono uppercase">{article.date}</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-6 group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h2>
                    <p className="text-sm text-textSecondary uppercase font-mono leading-relaxed mb-8">
                      {article.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[9px] font-black text-textMuted uppercase tracking-widest">BY {article.author}</span>
                    <span className="text-[9px] font-black text-textMuted uppercase tracking-widest">{article.readTime} READ</span>
                    <span className="text-primary text-[10px] font-black tracking-widest uppercase group-hover:translate-x-2 transition-transform ml-auto">
                      READ FULL REPORT →
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* 3. Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-surface border border-border p-10 rounded-[40px]">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-border pb-4">Most Read Briefs</h3>
            <div className="space-y-8">
              {TRADE_NEWS.slice(0, 3).map((n, i) => (
                <div key={i} className="group cursor-pointer" onClick={() => setSelectedArticle(n)}>
                  <p className="text-[9px] font-black text-primary uppercase mb-2">0{i+1} // {n.category}</p>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                    {n.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-10 rounded-[40px]">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Subscription Protocol</h3>
            <p className="text-[10px] text-textSecondary leading-relaxed uppercase font-mono mb-8">
              Receive live policy alerts and market synthesis directly to your sourcing terminal.
            </p>
            <input type="email" placeholder="ENTER TERMINAL EMAIL..." className="w-full bg-background border border-primary/20 rounded-xl px-4 py-3 text-[10px] font-mono text-white mb-4 outline-none focus:border-primary" />
            <button className="w-full py-4 bg-primary text-black font-black uppercase text-[10px] rounded-xl hover:bg-white transition-all">ENABLE_ALERTS</button>
          </div>
        </div>
      </div>

      {/* Article Full View Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedArticle(null)} className="absolute inset-0 bg-black/98 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 50 }} className="relative w-full max-w-[1100px] bg-surface border border-border rounded-[48px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="h-[400px] relative shrink-0">
                <img src={selectedArticle.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                <button onClick={() => setSelectedArticle(null)} className="absolute top-10 right-10 w-14 h-14 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all text-xl z-20">✕</button>
                <div className="absolute bottom-10 left-10">
                   <span className="text-[10px] bg-primary text-black font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-xl">#{selectedArticle.category}</span>
                   <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter max-w-2xl leading-[0.9]">{selectedArticle.title}</h2>
                </div>
              </div>
              <div className="p-12 md:p-20 overflow-y-auto flex-1 bg-surface">
                 <div className="flex flex-wrap items-center gap-10 mb-12 text-[10px] font-mono font-black uppercase text-textMuted tracking-widest border-b border-border pb-8">
                   <div><span className="text-primary opacity-50 block mb-1">PUBLISHED</span><span className="text-white">{selectedArticle.date}</span></div>
                   <div><span className="text-primary opacity-50 block mb-1">AUTHOR</span><span className="text-white">{selectedArticle.author}</span></div>
                   <div><span className="text-primary opacity-50 block mb-1">READ_TIME</span><span className="text-white">{selectedArticle.readTime}</span></div>
                 </div>
                 <div className="prose prose-invert max-w-none text-textSecondary font-mono text-base md:text-lg leading-relaxed uppercase">
                    <p className="mb-8 whitespace-pre-wrap">{selectedArticle.content}</p>
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
