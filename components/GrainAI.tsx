
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface GrainAIProps {
  isOpen: boolean;
  onClose: () => void;
}

const GrainAI: React.FC<GrainAIProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'SYSTEM INITIALIZED. I am Grain X AI. How can I assist with your commodity sourcing today?' }
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
          systemInstruction: `You are Grain X AI, a terminal-based sourcing assistant for an agricultural export platform in Tanzania. 
          Your tone is efficient, technical, and helpful. You know about crops like Maize, Rice, Cashews, Soybeans, Sesame, Tea, Coffee.
          You help buyers find listings, explain Incoterms (EXW, FOB, CIF), and offer market intelligence based on the user's query.
          Keep responses concise and formatted for a terminal UI (use caps for emphasis, avoid flowery language).`,
        },
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.text || 'NO RESPONSE FROM CORE.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'ERROR: UPLINK FAILED. PLEASE RETRY.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-[400px] bg-surface border-l border-primary/30 z-[60] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="h-[60px] border-b border-border flex items-center justify-between px-6 bg-background">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Grain AI Terminal</span>
        </div>
        <button onClick={onClose} className="text-textMuted hover:text-white">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`${m.role === 'ai' ? 'text-primary' : 'text-textPrimary'} flex flex-col gap-1`}>
            <span className="text-[10px] font-bold uppercase opacity-50">[{m.role}]</span>
            <div className={`p-3 rounded-lg ${m.role === 'ai' ? 'bg-primary/5 border border-primary/20' : 'bg-white/5 border border-white/10'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-primary animate-pulse text-[10px] font-bold">
            PROCESSING_UPLINK...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-background">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type command..."
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors pr-12"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-2"
          >
            ↵
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrainAI;
