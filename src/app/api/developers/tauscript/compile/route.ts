import { NextResponse } from 'next/server';
import { compile } from '@/lib/tauscript/compiler/pipeline';
import { withTauScriptGuard } from '@/lib/tau-ide/server/route-guard';

export const POST = withTauScriptGuard(async (_request, body) => {
  const { code, target = 'ir', optimize = true } = body;
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });
  if (typeof code === 'string' && code.length > 200_000) {
    return NextResponse.json({ error: 'Code exceeds maximum size' }, { status: 413 });
  }
  const result = compile(String(code), { target: target as 'ir' | 'js' | 'interpret', optimize: Boolean(optimize) });
  return NextResponse.json(result);
}, 'tauscript.compile');
