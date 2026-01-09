
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectState, FileNode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-3-pro-preview';

/**
 * Analyzes the user's intent and generates a structured project blueprint.
 */
export async function analyzeProjectIntent(prompt: string) {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Analyze this software project request: "${prompt}". 
    Create a project architecture blueprint. Respond ONLY in JSON format.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          architecture: {
            type: Type.OBJECT,
            properties: {
              modules: { type: Type.ARRAY, items: { type: Type.STRING } },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              endpoints: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          summary: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

/**
 * Helper to convert a flat list of file paths into a tree structure.
 */
function buildFileTree(files: { path: string; content: string; type: 'file' | 'directory' }[]): FileNode[] {
  const root: FileNode[] = [];

  files.forEach(file => {
    const parts = file.path.split('/').filter(p => p);
    let currentLevel = root;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      let existing = currentLevel.find(node => node.name === part);

      if (!existing) {
        existing = {
          name: part,
          type: isLast ? file.type : 'directory',
          content: isLast ? file.content : undefined,
          children: isLast ? undefined : []
        };
        currentLevel.push(existing);
      }

      if (!isLast && existing.children) {
        currentLevel = existing.children;
      }
    });
  });

  return root;
}

/**
 * Generates the full file tree for a project using a flat structure for maximum JSON reliability.
 */
export async function generateProjectFiles(blueprint: any): Promise<FileNode[]> {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Based on this blueprint: ${JSON.stringify(blueprint)}, generate a complete project file structure. 
    Provide a FLAT list of objects with "path" (e.g., "src/App.tsx"), "type" ('file' or 'directory'), and "content".
    Include essential files for a working React + Node.js project. 
    Respond ONLY in JSON format.`,
    config: {
      thinkingConfig: { thinkingBudget: 12000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            path: { type: Type.STRING, description: "Full path including filename, e.g. src/components/Header.tsx" },
            type: { type: Type.STRING, enum: ["file", "directory"] },
            content: { type: Type.STRING, description: "Full source code or empty string for directories" }
          },
          required: ["path", "type"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    const flatFiles = JSON.parse(text);
    return buildFileTree(flatFiles);
  } catch (e) {
    console.error("JSON Parse Error at content:", text);
    throw e;
  }
}

/**
 * Chat interaction for editing the project.
 */
export async function chatWithArchitect(messages: { role: string; content: string }[], project: ProjectState) {
  const context = `Current Project: ${project.name}. Description: ${project.description}. Tech: ${project.architecture?.techStack.join(', ')}.`;
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      { text: `You are a Lead Software Architect. Context: ${context}. Help the user refine their project.` },
      ...messages.map(m => ({ text: `${m.role.toUpperCase()}: ${m.content}` }))
    ]
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
}
