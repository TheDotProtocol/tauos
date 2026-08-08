/**
 * Metadata-only tool audit log (AI-6).
 */

import type { ToolAuditEntry } from './types';

const FORBIDDEN_KEYS = ['input', 'output', 'content', 'secret', 'password', 'token', 'payload'];

export class ToolAuditLog {
  private entries: ToolAuditEntry[] = [];

  append(entry: ToolAuditEntry): void {
    this.assertNoSensitiveContent(entry);
    this.entries.push(entry);
  }

  list(): ToolAuditEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }

  assertNoSensitiveContent(entry: ToolAuditEntry): void {
    if (entry.metadata) {
      for (const key of Object.keys(entry.metadata)) {
        if (FORBIDDEN_KEYS.some((f) => key.toLowerCase().includes(f))) {
          throw new Error(`Tool audit must not include sensitive field: ${key}`);
        }
      }
    }
  }
}

export function createToolAuditLog(): ToolAuditLog {
  return new ToolAuditLog();
}
