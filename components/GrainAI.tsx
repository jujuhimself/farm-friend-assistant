
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface GrainAIProps {
  isOpen: boolean;
  onClose: () => void;
}

const GrainAI: React.FC<GrainAIProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
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
          systemInstruction: `You are Grain X Agent, a world-class agricultural export assistant. Keep responses concise and technical.`,
        },
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.text || 'ERROR.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'ERROR: UPLINK FAILED.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:inset-y-0 md:right-0 w-full md:max-w-[400px] bg-surface border-l border-primary/30 z-[60] flex flex-col shadow-[0_0_30px_rgba(0,255,136,0.1)]">
      {/* Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-background flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-primary tracking-[0.15em] uppercase font-mono">Agent V4</span>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-white transition-colors p-1 text-sm">✕</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[10px] leading-relaxed min-h-0">
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase opacity-30 tracking-widest">[{m.role}]</span>
            <div className={`p-3 rounded-lg ${m.role === 'ai' ? 'bg-primary/5 border border-primary/20 text-primary' : 'bg-white/5 border border-white/10 text-text-primary'}`}>
              <div className="whitespace-pre-wrap break-words">{m.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-primary text-[9px] font-black tracking-widest px-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
            PROCESSING...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-background/80 backdrop-blur-md flex-shrink-0">
        <div className="relative">
          <input 
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enter command..."
            className="w-full bg-surface border border-primary/20 rounded-lg px-4 py-3 text-[10px] font-mono focus:border-primary focus:outline-none pr-10 text-white uppercase tracking-wider"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-1.5 disabled:opacity-30"
          >
            ↵
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrainAI;
