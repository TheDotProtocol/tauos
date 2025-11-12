/**
 * Terminal Session Management API
 * Handles session restoration and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@/lib/session';
import type { TerminalSessionState } from '@/types/session';

export const dynamic = 'force-dynamic';

interface SessionRequest {
  sessionId: string;
  action?: 'restore' | 'delete' | 'get';
}

interface SessionResponse {
  success: boolean;
  session?: TerminalSessionState;
  error?: string;
}

/**
 * GET - Restore session
 * POST - Create/update session
 * DELETE - Delete session
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      } as SessionResponse);
    }

    const session = await sessionService.loadTerminalSession(sessionId);
    
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Session not found'
      } as SessionResponse);
    }

    return NextResponse.json({
      success: true,
      session
    } as SessionResponse);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to restore session';
    return NextResponse.json({
      success: false,
      error: errorMessage
    } as SessionResponse);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SessionRequest = await request.json();
    const { sessionId, action = 'restore' } = body;

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      } as SessionResponse);
    }

    if (action === 'restore') {
      const session = await sessionService.loadTerminalSession(sessionId);
      
      if (!session) {
        return NextResponse.json({
          success: false,
          error: 'Session not found'
        } as SessionResponse);
      }

      return NextResponse.json({
        success: true,
        session
      } as SessionResponse);
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    } as SessionResponse);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process session request';
    return NextResponse.json({
      success: false,
      error: errorMessage
    } as SessionResponse);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required'
      } as SessionResponse);
    }

    const deleted = await sessionService.deleteSession(sessionId, 'terminal');
    
    return NextResponse.json({
      success: deleted,
      error: deleted ? undefined : 'Failed to delete session'
    } as SessionResponse);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete session';
    return NextResponse.json({
      success: false,
      error: errorMessage
    } as SessionResponse);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

