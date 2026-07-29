import { NextRequest, NextResponse } from 'next/server';
import { handleLSPRequest } from '@/lib/tauscript/lsp/server';

export async function POST(request: NextRequest) {
  try {
    const { method, params } = await request.json();
    if (!method) return NextResponse.json({ error: 'method required' }, { status: 400 });
    const result = handleLSPRequest(method, params ?? {});
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'LSP failed' }, { status: 500 });
  }
}
