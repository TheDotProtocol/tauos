/**
 * Metadata-only execution audit log (AI-7).
 */

import type { ExecutionAuditEntry } from './types';

const FORBIDDEN = ['input', 'output', 'payload', 'secret', 'password', 'token', 'content'];

export class ExecutionAuditLog {
  private entries: ExecutionAuditEntry[] = [];

  append(entry: ExecutionAuditEntry): void {
    if (entry.metadata) {
      for (const key of Object.keys(entry.metadata)) {
        if (FORBIDDEN.some((f) => key.toLowerCase().includes(f))) {
          throw new Error(`Execution audit must not include sensitive field: ${key}`);
        }
      }
    }
    this.entries.push(entry);
  }

  list(): ExecutionAuditEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }
}

export function createExecutionAuditLog(): ExecutionAuditLog {
  return new ExecutionAuditLog();
}
