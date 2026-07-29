import { NextResponse } from 'next/server';
import { runTests } from '@/lib/tauscript/test-runner';
import { withTauScriptGuard } from '@/lib/tau-ide/server/route-guard';

export const POST = withTauScriptGuard(async (_request, body) => {
  const { code } = body;
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });
  return NextResponse.json(runTests(String(code)));
}, 'tauscript.test');
