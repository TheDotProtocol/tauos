import { NextResponse } from 'next/server';
import { handleLSPRequest } from '@/lib/tauscript/lsp/server';
import { withTauScriptGuard } from '@/lib/tau-ide/server/route-guard';

export const POST = withTauScriptGuard(async (_request, body) => {
  const { method, params } = body;
  if (!method) return NextResponse.json({ error: 'method required' }, { status: 400 });
  const result = handleLSPRequest(String(method), (params ?? {}) as Record<string, unknown>);
  return NextResponse.json(result);
}, 'tauscript.lsp');
