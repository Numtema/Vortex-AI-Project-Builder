
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Settings, 
  Layout, 
  MessageSquare, 
  Download, 
  Rocket, 
  Box,
  Layers,
  Sparkles,
  Plus,
  X,
  Package
} from 'lucide-react';
import { AppMode, ChatMessage, ProjectState, FileNode } from './types';
import { ChatPanel } from './components/ChatPanel';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { PreviewFrame } from './components/PreviewFrame';
import { StrategyDeck } from './components/StrategyDeck';
import { analyzeProjectIntent, generateProjectFiles } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('conversation');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  const [project, setProject] = useState<ProjectState>({
    id: 'vortex-init',
    name: 'untitled project',
    description: '',
    files: [],
    selectedFilePath: null,
    status: 'idle'
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentFileContent, setCurrentFileContent] = useState<string>('');

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role, content, timestamp: Date.now() }]);
  };

  const handleProjectGeneration = async (prompt: string) => {
    setIsGenerating(true);
    setGenerationStep(0);
    setStatusMessage('Analyzing UX Intent...');
    
    try {
      const blueprint = await analyzeProjectIntent(prompt);
      await new Promise(r => setTimeout(r, 1500));
      setGenerationStep(1);
      setStatusMessage('Persona Analysis...');
      await new Promise(r => setTimeout(r, 1500));
      setGenerationStep(2);
      setStatusMessage('Synthesizing Visual UI...');
      const files = await generateProjectFiles(blueprint);
      
      setProject(prev => ({
        ...prev,
        name: blueprint.name || 'untitled project',
        description: blueprint.description,
        architecture: blueprint.architecture,
        files: files,
        status: 'ready'
      }));

      setStatusMessage('');
      setIsGenerating(false);
      setMode('workspace');
      addMessage('assistant', `Synthesis complete. Your projection of "${blueprint.name}" is now live.`);
    } catch (error) {
      setIsGenerating(false);
      setStatusMessage('Synthesis Failed');
      addMessage('assistant', "The neural path was blocked. Please refine your intent.");
    }
  };

  const handleSendMessage = (text: string) => {
    addMessage('user', text);
    if (project.status === 'idle') {
      handleProjectGeneration(text);
    } else {
      addMessage('assistant', "Acknowledged. Updating architectural projections...");
    }
  };

  const handleFileSelect = (path: string, content: string) => {
    setProject(prev => ({ ...prev, selectedFilePath: path }));
    setCurrentFileContent(content);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden select-none bg-slate-50">
      {/* Sidebar - Mobile Responsive Overlay */}
      {isSidebarOpen && window.innerWidth <= 1024 && (
        <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - Navigation Rail */}
      <aside className={`bg-slate-950 flex flex-col items-center py-8 gap-8 border-r border-white/5 transition-all duration-500 z-[70] fixed inset-y-0 left-0 md:relative ${isSidebarOpen ? 'w-24' : 'w-0 -translate-x-full md:translate-x-0 overflow-hidden opacity-0'}`}>
        <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-110 transition-transform cursor-pointer shrink-0">
          <Layers size={28} />
        </div>
        
        <div className="flex flex-col gap-6 flex-1">
          <button onClick={() => { setMode('conversation'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} className={`p-4 rounded-[1.5rem] transition-all group relative ${mode === 'conversation' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
             <MessageSquare size={24} />
          </button>
          <button onClick={() => { setMode('workspace'); if(window.innerWidth <= 1024) setIsSidebarOpen(false); }} className={`p-4 rounded-[1.5rem] transition-all group relative ${mode === 'workspace' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
             <Layout size={24} />
          </button>
          <button className={`p-4 rounded-[1.5rem] transition-all group relative text-slate-500 hover:text-slate-300`}>
            <Package size={24} />
            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity font-bold tracking-widest uppercase">Artifacts</div>
          </button>
        </div>

        <button className="p-4 text-slate-500 hover:text-white transition-colors">
          <Settings size={24} />
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-transparent w-full">
        {/* Top Header */}
        <header className="h-20 px-4 md:px-10 border-b border-slate-200 bg-white/60 backdrop-blur-md flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center gap-2 md:gap-6 overflow-hidden">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 shrink-0">
              {isSidebarOpen && window.innerWidth <= 1024 ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
              <h1 className="font-extrabold text-slate-900 tracking-tight text-base md:text-xl truncate max-w-[120px] md:max-w-sm lowercase">
                {project.name}
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-white rounded-full shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-soft"></div>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Ready</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-2xl hover:bg-indigo-100 transition-all">
              <Download size={14} className="md:w-4 md:h-4" /> Export Spec
            </button>
            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-900 text-white rounded-xl md:rounded-2xl hover:bg-slate-800 shadow-xl transition-all shrink-0">
              <Plus size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {mode === 'conversation' ? (
            <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden">
              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 md:space-y-12 overflow-y-auto no-scrollbar">
                   <div className="text-center animate-pulse">
                     <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">Synthesizing Projection...</h2>
                     <p className="text-xs md:text-sm text-slate-500 font-medium">{statusMessage}</p>
                   </div>
                   <div className="w-full max-w-7xl">
                     <StrategyDeck activeStep={generationStep} />
                   </div>
                </div>
              ) : (
                <div className="flex-1 max-w-5xl mx-auto w-full h-full">
                  <ChatPanel messages={messages} onSendMessage={handleSendMessage} isProcessing={isGenerating} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
              {/* Workspace View - Full Screen Split */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="hidden lg:block w-72 border-r bg-white/80 border-slate-200 overflow-hidden flex-shrink-0">
                  <FileExplorer files={project.files} onFileSelect={handleFileSelect} selectedPath={project.selectedFilePath} />
                </div>
                <div className="flex-1 flex flex-col min-w-0 border-b md:border-b-0">
                  <CodeEditor fileName={project.selectedFilePath} content={currentFileContent} onContentChange={setCurrentFileContent} />
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 border-t md:border-t-0 md:border-l bg-slate-50/50 flex-shrink-0">
                  <PreviewFrame projectTitle={project.name} files={project.files} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Quick Switcher - Segmented Pill UI as seen in screenshot */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200 p-1 flex items-center z-[100] scale-90 md:scale-100">
          <button 
            onClick={() => setMode('conversation')} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${mode === 'conversation' ? 'bg-[#0f172a] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <MessageSquare size={16} /> CHAT
          </button>
          <button 
            onClick={() => setMode('workspace')} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${mode === 'workspace' ? 'bg-[#0f172a] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Layout size={16} /> IDE
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
