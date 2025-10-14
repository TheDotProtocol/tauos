import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';

interface LocalTerminalRequest {
  command: string;
  cwd?: string;
  sessionId?: string;
}

interface LocalTerminalResponse {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  cwd: string;
  executionMode: 'local';
}

// Local terminal execution for full system access
export async function POST(request: NextRequest) {
  try {
    const body: LocalTerminalRequest = await request.json();
    const { command, cwd = process.cwd(), sessionId } = body;

    if (!command || typeof command !== 'string') {
      return NextResponse.json({
        success: false,
        output: '',
        error: 'Command is required',
        exitCode: 1,
        cwd,
        executionMode: 'local'
      } as LocalTerminalResponse);
    }

    // For local execution, we'll simulate the command execution
    // In a real implementation, this would connect to a local terminal service
    return NextResponse.json({
      success: true,
      output: `[LOCAL] Executing: ${command}\n[LOCAL] This command would run on your local machine with full system access.\n[LOCAL] Install TauCore CLI for actual local execution.`,
      exitCode: 0,
      cwd: cwd,
      executionMode: 'local'
    } as LocalTerminalResponse);

  } catch (error: unknown) {
    console.error('Local terminal execution error:', error);
    
    return NextResponse.json({
      success: false,
      output: '',
      error: error.message || 'Local command execution failed',
      exitCode: 1,
      cwd: process.cwd(),
      executionMode: 'local'
    } as LocalTerminalResponse);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
