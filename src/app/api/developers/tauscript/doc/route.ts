import { NextRequest, NextResponse } from 'next/server';
import { generateDocs } from '@/lib/tauscript/docgen';

export async function POST(request: NextRequest) {
  try {
    const { code, title } = await request.json();
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });
    return NextResponse.json(generateDocs(code, title));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Doc gen failed' }, { status: 500 });
  }
}
