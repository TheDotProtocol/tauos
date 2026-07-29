import { NextRequest, NextResponse } from 'next/server';
import { runTests } from '@/lib/tauscript/test-runner';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });
    return NextResponse.json(runTests(code));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Test failed' }, { status: 500 });
  }
}
