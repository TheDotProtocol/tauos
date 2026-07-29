import { NextRequest, NextResponse } from 'next/server';
import { compile } from '@/lib/tauscript/compiler/pipeline';

export async function POST(request: NextRequest) {
  try {
    const { code, target = 'ir', optimize = true } = await request.json();
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });
    const result = compile(code, { target, optimize });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Compile failed' }, { status: 500 });
  }
}
