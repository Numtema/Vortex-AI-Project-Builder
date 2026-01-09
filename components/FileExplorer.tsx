
import React, { useState } from 'react';
import { File, Folder, ChevronRight, ChevronDown, FileCode, FileText, Database, Globe } from 'lucide-react';
import { FileNode } from '../types';

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (path: string, content: string) => void;
  selectedPath: string | null;
}

const FileIcon = ({ name }: { name: string }) => {
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return <FileCode size={14} className="text-blue-500" />;
  if (name.endsWith('.js') || name.endsWith('.jsx')) return <FileCode size={14} className="text-yellow-500" />;
  if (name.endsWith('.html')) return <Globe size={14} className="text-orange-500" />;
  if (name.endsWith('.json')) return <Database size={14} className="text-emerald-500" />;
  if (name.endsWith('.css')) return <FileText size={14} className="text-indigo-500" />;
  return <File size={14} className="text-slate-400" />;
};

const TreeNode: React.FC<{ node: FileNode; path: string; onFileSelect: (path: string, content: string) => void; selectedPath: string | null }> = ({ node, path, onFileSelect, selectedPath }) => {
  const [isOpen, setIsOpen] = useState(true);
  const currentPath = `${path}/${node.name}`;
  const isSelected = selectedPath === currentPath;

  if (node.type === 'file') {
    return (
      <div 
        onClick={() => onFileSelect(currentPath, node.content || '')}
        className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md text-sm transition-colors group ${
          isSelected ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-100 text-slate-600'
        }`}
      >
        <FileIcon name={node.name} />
        <span className="truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div className="select-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md hover:bg-slate-100 text-sm text-slate-700 group transition-colors"
      >
        {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
        <Folder size={14} className="text-indigo-400 fill-indigo-400/10" />
        <span className="font-medium">{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div className="ml-4 pl-2 border-l border-slate-200 mt-0.5 space-y-0.5">
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} path={currentPath} onFileSelect={onFileSelect} selectedPath={selectedPath} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect, selectedPath }) => {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Explorer</h3>
        <button className="text-slate-400 hover:text-slate-600 p-1">
          <Folder size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {files.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            No project files generated yet.
          </div>
        ) : (
          files.map((node, i) => (
            <TreeNode key={i} node={node} path="" onFileSelect={onFileSelect} selectedPath={selectedPath} />
          ))
        )}
      </div>
    </div>
  );
};
