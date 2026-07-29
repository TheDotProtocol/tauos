import { NextResponse } from 'next/server';
import { TauDebugger } from '@/lib/tauscript/debugger';
import { withTauScriptGuard } from '@/lib/tau-ide/server/route-guard';

export const POST = withTauScriptGuard(async (_request, body) => {
  const { code, action, line, expr } = body;
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

  const dbg = new TauDebugger(String(code));
  switch (action) {
    case 'start': return NextResponse.json(await dbg.start());
    case 'stepOver': return NextResponse.json(await dbg.stepOver());
    case 'stepInto': return NextResponse.json(await dbg.stepInto());
    case 'stepOut': return NextResponse.json(await dbg.stepOut());
    case 'continue': return NextResponse.json(dbg.continue());
    case 'setBreakpoint':
      dbg.setBreakpoint(Number(line) || 1);
      return NextResponse.json(dbg.getState());
    case 'addWatch':
      dbg.addWatch(String(expr ?? ''));
      return NextResponse.json(dbg.getState());
    default:
      return NextResponse.json(dbg.getState());
  }
}, 'tauscript.debug');
