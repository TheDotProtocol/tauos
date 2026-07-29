import { NextRequest, NextResponse } from 'next/server';
import { TauDebugger } from '@/lib/tauscript/debugger';

export async function POST(request: NextRequest) {
  try {
    const { code, action, line, expr } = await request.json();
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

    const dbg = new TauDebugger(code);

    switch (action) {
      case 'start':
        return NextResponse.json(await dbg.start());
      case 'stepOver':
        return NextResponse.json(await dbg.stepOver());
      case 'stepInto':
        return NextResponse.json(await dbg.stepInto());
      case 'stepOut':
        return NextResponse.json(await dbg.stepOut());
      case 'continue':
        return NextResponse.json(dbg.continue());
      case 'setBreakpoint':
        dbg.setBreakpoint(line ?? 1);
        return NextResponse.json(dbg.getState());
      case 'addWatch':
        dbg.addWatch(expr ?? '');
        return NextResponse.json(dbg.getState());
      default:
        return NextResponse.json(dbg.getState());
    }
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Debug failed' }, { status: 500 });
  }
}
