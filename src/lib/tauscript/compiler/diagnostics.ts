export type DiagnosticSeverity = 'error' | 'warning' | 'info' | 'hint';

export type Diagnostic = {
  severity: DiagnosticSeverity;
  message: string;
  line: number;
  column: number;
  code?: string;
  source?: string;
};

export class DiagnosticCollector {
  private items: Diagnostic[] = [];

  error(message: string, line = 1, column = 1, code?: string) {
    this.items.push({ severity: 'error', message, line, column, code, source: 'tauscript' });
  }

  warning(message: string, line = 1, column = 1, code?: string) {
    this.items.push({ severity: 'warning', message, line, column, code, source: 'tauscript' });
  }

  info(message: string, line = 1, column = 1, code?: string) {
    this.items.push({ severity: 'info', message, line, column, code, source: 'tauscript' });
  }

  merge(other: Diagnostic[]) {
    this.items.push(...other);
  }

  getAll(): Diagnostic[] {
    return [...this.items];
  }

  hasErrors(): boolean {
    return this.items.some((d) => d.severity === 'error');
  }

  format(): string {
    return this.items
      .map((d) => `${d.severity} [${d.line}:${d.column}] ${d.message}${d.code ? ` (${d.code})` : ''}`)
      .join('\n');
  }
}
