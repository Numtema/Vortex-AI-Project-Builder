
export type AppMode = 'conversation' | 'workspace';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
  language?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'typing' | 'done';
}

export interface ProjectState {
  id: string;
  name: string;
  description: string;
  architecture?: {
    modules: string[];
    techStack: string[];
    endpoints: string[];
  };
  files: FileNode[];
  selectedFilePath: string | null;
  status: 'idle' | 'analyzing' | 'generating' | 'ready' | 'error';
}

export interface ProjectContext {
  messages: ChatMessage[];
  project: ProjectState;
}
