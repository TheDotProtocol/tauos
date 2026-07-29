import type { ArchitectPhaseId } from './phases';
import type { AgentRole } from './agents';
import { apiFetch } from '@/lib/tau-ide/sync-client';

export type ProjectMemory = {
  projectId: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  goals: string[];
  businessRules: string[];
  architectureDecisions: { decision: string; rationale: string; timestamp: string }[];
  technologyChoices: { category: string; choice: string; rationale: string }[];
  userPreferences: { mode: 'beginner' | 'professional'; language?: string; framework?: string };
  conversationSummary: string;
  currentPhase: ArchitectPhaseId;
  deliverables: Record<string, string>;
  activeAgents: AgentRole[];
  tasks: ProjectTask[];
};

export type ProjectTask = {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  agent?: AgentRole;
  file?: string;
};

const MEMORY_KEY = 'tau-architect-memory';

export function createEmptyMemory(projectId: string): ProjectMemory {
  return {
    projectId,
    projectName: 'Untitled Project',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    goals: [],
    businessRules: [],
    architectureDecisions: [],
    technologyChoices: [],
    userPreferences: { mode: 'beginner' },
    conversationSummary: '',
    currentPhase: 'discovery',
    deliverables: {},
    activeAgents: ['product-manager', 'software-architect'],
    tasks: [],
  };
}

export function loadMemoryLocal(projectId: string): ProjectMemory {
  if (typeof window === 'undefined') return createEmptyMemory(projectId);
  try {
    const raw = localStorage.getItem(`${MEMORY_KEY}-${projectId}`);
    if (!raw) return createEmptyMemory(projectId);
    return JSON.parse(raw) as ProjectMemory;
  } catch {
    return createEmptyMemory(projectId);
  }
}

export function saveMemoryLocal(memory: ProjectMemory) {
  memory.updatedAt = new Date().toISOString();
  localStorage.setItem(`${MEMORY_KEY}-${memory.projectId}`, JSON.stringify(memory));
}

export async function loadMemory(projectId: string): Promise<ProjectMemory> {
  try {
    const data = await apiFetch<{ memory: ProjectMemory | null }>(`/api/tau-ide/projects/${projectId}/memory`);
    if (data.memory) {
      saveMemoryLocal(data.memory);
      return data.memory;
    }
  } catch { /* fallback */ }
  return loadMemoryLocal(projectId);
}

export async function saveMemory(memory: ProjectMemory) {
  saveMemoryLocal(memory);
  try {
    await apiFetch(`/api/tau-ide/projects/${memory.projectId}/memory`, {
      method: 'PUT',
      body: JSON.stringify({ memory }),
    });
  } catch { /* local saved */ }
}

export async function appendConversation(projectId: string, msg: { role: string; content: string; phase?: string; provider?: string }) {
  try {
    await apiFetch(`/api/tau-ide/projects/${projectId}/conversations`, {
      method: 'POST',
      body: JSON.stringify(msg),
    });
  } catch { /* skip */ }
}

export function updateMemoryFromResponse(memory: ProjectMemory, phase: ArchitectPhaseId, content: string): ProjectMemory {
  memory.currentPhase = phase;
  memory.deliverables[phase] = content;

  if (phase === 'discovery') {
    const goalMatch = content.match(/(?:goal|problem|solve)[:\s]+(.+)/gi);
    if (goalMatch) memory.goals = Array.from(new Set([...memory.goals, ...goalMatch.slice(0, 5)]));
  }

  const decisionPattern = /(?:decision|chose|selected|recommend)[:\s]+(.+)/gi;
  let match;
  while ((match = decisionPattern.exec(content)) !== null) {
    const decision = match[1].trim().slice(0, 200);
    if (!memory.architectureDecisions.some((d) => d.decision === decision)) {
      memory.architectureDecisions.push({ decision, rationale: 'From architect conversation', timestamp: new Date().toISOString() });
    }
  }

  const mermaidMatch = content.match(/```mermaid\n([\s\S]*?)```/);
  if (mermaidMatch) memory.deliverables[`${phase}-diagram`] = mermaidMatch[1];

  const taskMatches = Array.from(content.matchAll(/```tau-task\n([\s\S]*?)```/g));
  for (const tm of taskMatches) {
    try {
      const task = JSON.parse(tm[1]) as ProjectTask;
      const idx = memory.tasks.findIndex((t) => t.id === task.id);
      if (idx >= 0) memory.tasks[idx] = task;
      else memory.tasks.push(task);
    } catch { /* skip */ }
  }

  void saveMemory(memory);
  return memory;
}

export function buildMemoryContext(memory: ProjectMemory): string {
  const parts: string[] = [];
  if (memory.projectName) parts.push(`Project: ${memory.projectName}`);
  if (memory.goals.length) parts.push(`Goals: ${memory.goals.join('; ')}`);
  if (memory.businessRules.length) parts.push(`Business rules: ${memory.businessRules.join('; ')}`);
  if (memory.technologyChoices.length) {
    parts.push(`Tech choices: ${memory.technologyChoices.map((t) => `${t.category}=${t.choice}`).join(', ')}`);
  }
  if (memory.architectureDecisions.length) {
    parts.push(`Decisions: ${memory.architectureDecisions.slice(-5).map((d) => d.decision).join('; ')}`);
  }
  if (memory.conversationSummary) parts.push(`Summary: ${memory.conversationSummary}`);
  for (const [phase, content] of Object.entries(memory.deliverables)) {
    if (!phase.includes('diagram') && content.length > 50) {
      parts.push(`${phase} (saved): ${content.slice(0, 400)}...`);
    }
  }
  return parts.length ? `\n\nPROJECT CONTEXT (persistent memory):\n${parts.join('\n')}` : '';
}

// Backward compat sync aliases
export { loadMemoryLocal as loadMemorySync, saveMemoryLocal as saveMemorySync };
