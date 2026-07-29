import { NextRequest, NextResponse } from 'next/server';
import { format } from '@/lib/tauscript/formatter';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });
    return NextResponse.json({ formatted: format(code) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Format failed' }, { status: 500 });
  }
}
