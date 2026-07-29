import { NextRequest, NextResponse } from 'next/server';
import { lint, aiCodeReview } from '@/lib/tauscript/linter';

export async function POST(request: NextRequest) {
  try {
    const { code, aiReview = false } = await request.json();
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });
    const lintResult = lint(code);
    const response: Record<string, unknown> = { ...lintResult };
    if (aiReview) response.aiReview = await aiCodeReview(code);
    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Lint failed' }, { status: 500 });
  }
}
