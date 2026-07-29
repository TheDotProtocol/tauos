import { compile } from './compiler/pipeline';
import type { Diagnostic } from './compiler/diagnostics';

export type LintResult = {
  diagnostics: Diagnostic[];
  score: number;
  suggestions: string[];
};

const BEST_PRACTICES: Array<{ pattern: RegExp; message: string; code: string }> = [
  { pattern: /var\s/, message: 'Use let/const instead of var', code: 'LINT001' },
  { pattern: /print\s*\(\s*""\s*\)/, message: 'Empty print statement', code: 'LINT002' },
  { pattern: /fn\s+\w+\([^)]{80,}\)/, message: 'Function has too many parameters — consider a struct', code: 'LINT003' },
  { pattern: /while\s*\(\s*true\s*\)/, message: 'Infinite loop — ensure break condition exists', code: 'LINT004' },
];

export function lint(source: string): LintResult {
  const result = compile(source);
  const diagnostics = [...result.diagnostics];
  const suggestions: string[] = [];
  const lines = source.split('\n');

  lines.forEach((line, i) => {
    for (const rule of BEST_PRACTICES) {
      if (rule.pattern.test(line)) {
        diagnostics.push({
          severity: 'warning',
          message: rule.message,
          line: i + 1,
          column: 1,
          code: rule.code,
          source: 'tauscript-lint',
        });
      }
    }
    if (line.trim().startsWith('import ') && !line.includes('from')) {
      diagnostics.push({
        severity: 'error',
        message: 'Invalid import syntax',
        line: i + 1,
        column: 1,
        code: 'LINT005',
        source: 'tauscript-lint',
      });
    }
  });

  // Dead code: unreachable after return
  for (let i = 0; i < lines.length - 1; i++) {
    if (/^\s*return\b/.test(lines[i]) && lines[i + 1].trim() && !lines[i + 1].trim().startsWith('}')) {
      diagnostics.push({
        severity: 'warning',
        message: 'Unreachable code after return',
        line: i + 2,
        column: 1,
        code: 'LINT006',
        source: 'tauscript-lint',
      });
    }
  }

  // Complexity
  const fnCount = (source.match(/\bfn\s+\w+/g) ?? []).length;
  if (fnCount > 30) suggestions.push('Consider splitting into multiple modules');

  const errorCount = diagnostics.filter((d) => d.severity === 'error').length;
  const warnCount = diagnostics.filter((d) => d.severity === 'warning').length;
  const score = Math.max(0, 100 - errorCount * 15 - warnCount * 5);

  return { diagnostics, score, suggestions };
}

export async function aiCodeReview(source: string): Promise<{ review: string; issues: string[] }> {
  const lintResult = lint(source);
  const issues = lintResult.diagnostics.map((d) => `[${d.severity}] Line ${d.line}: ${d.message}`);
  const review = [
    `Code Quality Score: ${lintResult.score}/100`,
    '',
    issues.length ? 'Issues found:' : 'No critical issues found.',
    ...issues.slice(0, 10),
    '',
    ...lintResult.suggestions.map((s) => `Suggestion: ${s}`),
  ].join('\n');
  return { review, issues };
}
