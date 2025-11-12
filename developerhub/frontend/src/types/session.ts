/**
 * Session Types for Terminal and IDE State Persistence
 */

export interface TerminalSessionState {
  sessionId: string;
  userId?: string;
  history: string[];
  cwd: string;
  environment: Record<string, string>;
  lastActivity: number;
  createdAt: number;
}

export interface IDESessionState {
  sessionId: string;
  userId?: string;
  openFiles: Array<{
    path: string;
    content: string;
    cursorPosition?: { line: number; column: number };
  }>;
  activeFile?: string;
  terminalHistory: string[];
  terminalCwd: string;
  replContext: REPLContext;
  lastActivity: number;
  createdAt: number;
}

export interface REPLContext {
  variables: Record<string, unknown>;
  functions: Record<string, (...args: unknown[]) => unknown>;
  lastResult?: unknown;
}

export interface SessionMetadata {
  sessionId: string;
  userId?: string;
  type: 'terminal' | 'ide';
  lastActivity: number;
  createdAt: number;
  ttl?: number; // Time to live in seconds
}

