
import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Shield, Maximize2, Terminal } from 'lucide-react';

interface PreviewFrameProps {
  projectTitle: string;
  files: any[];
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ projectTitle, files }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Starting Vortex Preview Server...",
    "[SYSTEM] Mounting file system...",
    "[SYSTEM] Running npm install...",
    "[VORTEX] Project compiled successfully.",
    "[VORTEX] Running on port 3000."
  ]);

  const handleRefresh = () => {
    setIsLoading(true);
    setLogs(prev => [...prev, `[SYSTEM] Rebuilding ${new Date().toLocaleTimeString()}...`]);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 p-4 gap-4 overflow-hidden">
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{projectTitle}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Preview Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-lg hover:bg-slate-50 text-slate-400 transition-all ${isLoading ? 'animate-spin text-indigo-500' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400">
            <ExternalLink size={18} />
          </button>
          <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border shadow-inner overflow-hidden relative group">
        {isLoading ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-indigo-600 animate-pulse uppercase tracking-widest">Building Artifacts...</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
             <div className="max-w-md text-center p-8 space-y-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-indigo-600 rounded-3xl rotate-12 flex items-center justify-center shadow-xl">
                    <Shield size={48} className="text-white -rotate-12" />
                  </div>
                </div>
                <div>
                   <h4 className="text-2xl font-black text-slate-800 italic">{projectTitle}</h4>
                   <p className="text-slate-500 mt-2 leading-relaxed">Your application frontend preview will render here once the architectural synthesis is finalized.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                   <span className="px-3 py-1 bg-white border rounded-full text-[10px] font-bold text-slate-400">REACT 18</span>
                   <span className="px-3 py-1 bg-white border rounded-full text-[10px] font-bold text-slate-400">TAILWIND 3</span>
                   <span className="px-3 py-1 bg-white border rounded-full text-[10px] font-bold text-slate-400">LUCIDE</span>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="h-1/4 bg-slate-900 rounded-3xl border border-white/5 p-4 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-2 text-slate-500">
          <Terminal size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Output & Logs</span>
        </div>
        <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1 text-slate-400 no-scrollbar">
          {logs.map((log, i) => (
            <div key={i} className={log.includes('[SYSTEM]') ? 'text-indigo-400' : ''}>{log}</div>
          ))}
          <div className="animate-pulse">_</div>
        </div>
      </div>
    </div>
  );
};
