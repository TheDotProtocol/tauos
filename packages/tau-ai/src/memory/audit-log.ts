/**
 * Metadata-only memory audit log (AI-5).
 *
 * Never logs memory content.
 */

import type { MemoryAuditEntry } from './types';

export class MemoryAuditLog {
  private entries: MemoryAuditEntry[] = [];

  append(entry: MemoryAuditEntry): void {
    this.assertNoContent(entry);
    this.entries.push(entry);
  }

  list(): MemoryAuditEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries = [];
  }

  /** Verify no entry contains raw memory content fields. */
  assertNoContent(entry: MemoryAuditEntry): void {
    const forbidden = ['content', 'message', 'body', 'text'];
    if (entry.metadata) {
      for (const key of Object.keys(entry.metadata)) {
        if (forbidden.includes(key.toLowerCase())) {
          throw new Error(`Memory audit log must not include content field: ${key}`);
        }
      }
    }
  }
}

export function createMemoryAuditLog(): MemoryAuditLog {
  return new MemoryAuditLog();
}
