
import React from 'react';
import { Copy, Save, Share, Play } from 'lucide-react';

interface CodeEditorProps {
  fileName: string | null;
  content: string;
  onContentChange: (newContent: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ fileName, content, onContentChange }) => {
  if (!fileName) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900">
        <div className="mb-4 opacity-20">
          <Save size={64} />
        </div>
        <p className="text-sm">Select a file from the explorer to view code</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-slate-300 font-mono">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black/20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
          <span className="text-xs font-medium text-slate-400 tracking-wider uppercase">{fileName.split('/').pop()}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white transition-colors uppercase font-bold tracking-tighter">
            <Copy size={14} /> Copy
          </button>
          <button className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors uppercase font-bold tracking-tighter">
            <Save size={14} /> Save
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {/* Line numbers gutter */}
        <div className="absolute top-0 left-0 w-10 h-full bg-[#1e1e1e] border-r border-white/5 flex flex-col items-end px-2 pt-4 select-none opacity-30 text-[11px]">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="h-6">{i + 1}</div>
          ))}
        </div>
        
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          spellCheck={false}
          className="w-full h-full bg-transparent outline-none resize-none p-4 pl-12 text-sm leading-6 custom-scrollbar text-slate-200"
        />
      </div>

      <div className="px-4 py-1 bg-indigo-600 text-white flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span>TypeScript JSX</span>
        </div>
        <div className="flex items-center gap-2">
          <Play size={10} />
          <span>Vortex Engine v1.0</span>
        </div>
      </div>
    </div>
  );
};
