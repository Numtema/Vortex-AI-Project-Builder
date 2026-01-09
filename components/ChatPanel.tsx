
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Code, Terminal, Layers } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  statusMessage?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isProcessing, statusMessage }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-xl md:rounded-[3rem] border-x md:border border-slate-200 shadow-2xl overflow-hidden relative">
      <div className="p-4 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white/80 shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <Bot size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight">Vortex Maestro</h2>
            <p className="text-[9px] md:text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Neural Link</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 no-scrollbar pb-32 md:pb-40">
        {messages.length === 0 && !isProcessing && (
           <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
             <Sparkles size={48} className="text-indigo-200" />
             <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Initialize Sequence</p>
           </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] md:max-w-[80%] p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-sm leading-relaxed shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white font-medium rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className={`text-[9px] mt-3 block font-bold opacity-40 uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : ''}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input area positioned absolutely to avoid push-up issues, with bottom offset for switcher */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 md:gap-4 p-1.5 md:p-2 bg-slate-100 rounded-full border border-slate-200 focus-within:ring-4 ring-indigo-100 transition-all shadow-lg mb-8 md:mb-10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
              placeholder="Type your project intent..."
              className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-transparent outline-none disabled:opacity-50 text-sm font-medium placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isProcessing || !input.trim()}
              className="p-3 md:p-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0"
            >
              <Send size={18} className="md:w-5 md:h-5" />
            </button>
          </form>
          
          <div className="hidden md:flex gap-6 justify-center">
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              <Code size={12} /> Full Stack
            </span>
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              <Terminal size={12} /> Neural Synthesis
            </span>
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              <Layers size={12} /> Auto-Dev
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
