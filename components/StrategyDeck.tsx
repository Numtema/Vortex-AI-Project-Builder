
import React from 'react';
import { Layout, Users, Monitor, ExternalLink, MousePointer2 } from 'lucide-react';

interface StrategyCardProps {
  icon: React.ReactNode;
  title: string;
  role: string;
  content: string;
  confidence: string;
  isActive?: boolean;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ icon, title, role, content, confidence, isActive }) => (
  <div className={`flex flex-col w-full max-w-sm rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border transition-all duration-500 shrink-0 md:shrink ${
    isActive ? 'bg-indigo-600 text-white border-indigo-500 shadow-2xl scale-[1.02]' : 'bg-white text-slate-800 border-slate-200 shadow-xl opacity-60'
  }`}>
    <div className="flex items-center justify-between mb-4 md:mb-8">
      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
        {icon}
      </div>
      <ExternalLink size={18} className={isActive ? 'text-white/40' : 'text-slate-300'} />
    </div>

    <div className="mb-4 md:mb-6">
      <h3 className="text-lg md:text-xl font-extrabold tracking-tight">{title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>{role}</span>
        <span className={`px-2 py-0.5 rounded text-[8px] md:text-[9px] font-bold ${isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>CONF: {confidence}</span>
      </div>
    </div>

    <div className={`flex-1 rounded-[1rem] md:rounded-[1.5rem] p-4 md:p-6 mb-4 md:mb-8 italic text-xs md:text-sm leading-relaxed ${isActive ? 'bg-indigo-700/50 text-indigo-50' : 'bg-slate-50 text-slate-600'}`}>
      "{content}"
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-current/10">
      <div className="flex -space-x-2">
        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white flex items-center justify-center text-[7px] md:text-[8px] font-bold ${isActive ? 'bg-indigo-400' : 'bg-slate-200 text-slate-500'}`}>A1</div>
        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white flex items-center justify-center text-[7px] md:text-[8px] font-bold ${isActive ? 'bg-indigo-300' : 'bg-slate-100 text-slate-400'}`}>A2</div>
      </div>
      <button className="flex items-center gap-2 text-[9px] md:text-[11px] font-black uppercase tracking-widest group">
        Inspect 
        <MousePointer2 size={10} className="group-hover:translate-x-1 transition-transform md:w-[12px]" />
      </button>
    </div>
  </div>
);

export const StrategyDeck: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  return (
    <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-4 md:gap-6 overflow-x-auto md:overflow-visible no-scrollbar px-4 pb-4 animate-in fade-in zoom-in duration-700">
      <StrategyCard 
        icon={<Layout size={24} />}
        title="UX Expert Strategy"
        role="UX ARCHITECT"
        confidence="95%"
        isActive={activeStep === 0}
        content="This journey leverages an A2A-driven architecture to transition users seamlessly from natural language intent to a fully technical project."
      />
      <StrategyCard 
        icon={<Users size={24} />}
        title="Persona Specialist"
        role="AGENT ANALYST"
        confidence="98%"
        isActive={activeStep === 1}
        content="Expert analysis performed successfully. Logic gates mapped to user stories and edge-case handling protocols established for the modules."
      />
      <StrategyCard 
        icon={<Monitor size={24} />}
        title="UI Expert Strategy"
        role="VISUAL ENGINEER"
        confidence="96%"
        isActive={activeStep === 2}
        content="The proposed dashboard utilizes a high-density, three-pane Material Design layout that balances a persistent agentic chat interface."
      />
    </div>
  );
};
