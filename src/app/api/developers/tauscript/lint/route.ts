import { NextResponse } from 'next/server';
import { lint, aiCodeReview } from '@/lib/tauscript/linter';
import { withTauScriptGuard } from '@/lib/tau-ide/server/route-guard';

export const POST = withTauScriptGuard(async (_request, body) => {
  const { code, aiReview = false } = body;
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });
  const lintResult = lint(String(code));
  const response: Record<string, unknown> = { ...lintResult };
  if (aiReview) response.aiReview = await aiCodeReview(String(code));
  return NextResponse.json(response);
}, 'tauscript.lint');
