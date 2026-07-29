import { NextResponse } from 'next/server';
import { generateDocs } from '@/lib/tauscript/docgen';
import { withTauScriptGuard } from '@/lib/tau-ide/server/route-guard';

export const POST = withTauScriptGuard(async (_request, body) => {
  const { code, title } = body;
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });
  return NextResponse.json(generateDocs(String(code), title ? String(title) : undefined));
}, 'tauscript.doc');
