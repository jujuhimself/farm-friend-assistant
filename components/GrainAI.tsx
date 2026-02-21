
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface GrainAIProps {
  isOpen: boolean;
  onClose: () => void;
}

const GrainAI: React.FC<GrainAIProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; structured?: any }[]>([
    { role: 'ai', content: 'SYSTEM INITIALIZED. I AM GRAIN X AGENT V4. HOW CAN I OPTIMIZE YOUR SOURCING STRATEGY TODAY?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are Grain X Agent, a world-class agricultural export assistant. 
          When a user describes a sourcing need (e.g., volume, destination, crop), act as a "Smart Sourcing Assistant":
          1. ANALYZE: Available inventory (assume Tanzanian origins like Mbeya, Morogoro).
          2. RANK: Provide 2-3 ranked supplier options with a "Why" section (e.g., "Mazaohub has lower base price but higher logistics cost").
          3. NEGOTIATE: Offer a tip for the specific crop based on seasonality.
          Keep responses concise, technical, and in ALL CAPS for emphasis where needed. Use Markdown for layout.`,
        },
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.text || 'CORE_COMM_ERROR.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'ERROR: UPLINK FAILED. PLEASE RETRY.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-[450px] bg-surface border-l-2 border-primary/30 z-[60] flex flex-col shadow-[0_0_50px_rgba(0,255,136,0.15)] animate-in slide-in-from-right duration-300">
      <div className="h-[60px] border-b border-border flex items-center justify-between px-6 bg-background">
        <div className="flex items-center gap-3">
          <div className="relative">
             <span className="w-2.5 h-2.5 rounded-full bg-primary block"></span>
             <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
          </div>
          <span className="text-xs font-black text-primary tracking-[0.2em] uppercase font-mono">Grain X // Agent V4</span>
        </div>
        <button onClick={onClose} className="text-textMuted hover:text-white transition-colors p-2">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-[11px] leading-relaxed custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`${m.role === 'ai' ? 'text-primary' : 'text-textPrimary'} flex flex-col gap-2`}>
            <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">[{m.role}_NODE]</span>
            <div className={`p-4 rounded-xl relative overflow-hidden ${m.role === 'ai' ? 'bg-primary/5 border border-primary/20' : 'bg-white/5 border border-white/10'}`}>
              <div className="relative z-10 whitespace-pre-wrap">{m.content}</div>
              {m.role === 'ai' && <div className="absolute top-0 right-0 p-1 opacity-5 text-4xl">🤖</div>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 text-primary text-[10px] font-black tracking-widest px-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
            UPLINK_PROCESSING_AGENT_LOGIC...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-background/80 backdrop-blur-md">
        <div className="relative">
          <input 
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="ENTER COMMAND OR SOURCING REQUEST..."
            className="w-full bg-surface border border-primary/20 rounded-xl px-5 py-4 text-xs font-mono focus:border-primary focus:outline-none transition-all pr-14 text-white uppercase tracking-wider shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary p-2 hover:scale-125 transition-transform disabled:opacity-30"
          >
            ↵
          </button>
        </div>
        <div className="mt-3 flex justify-between px-2 opacity-30">
           <span className="text-[8px] font-black uppercase tracking-widest text-textMuted">Prot: Gemini-3-Flash</span>
           <span className="text-[8px] font-black uppercase tracking-widest text-textMuted">Enc: AES-256</span>
        </div>
      </div>
    </div>
  );
};

export default GrainAI;
