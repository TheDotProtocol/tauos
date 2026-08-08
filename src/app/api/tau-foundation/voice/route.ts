import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-server';
import {
  getVoicePipelineStatus,
  processVoiceTurn,
} from '@/lib/tau-ai-app/voice-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    ...getVoicePipelineStatus(),
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Send audio as multipart/form-data with field "audio"' },
        { status: 400 },
      );
    }

    const form = await request.formData();
    const audio = form.get('audio');
    if (!(audio instanceof Blob) || audio.size === 0) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const clientTranscription = form.get('transcription');
    const threadId = form.get('threadId');
    const privacyMode = form.get('privacyMode') === 'true';

    const result = await processVoiceTurn({
      audio,
      userId: String(auth.userId),
      threadId: typeof threadId === 'string' ? threadId : undefined,
      privacyMode,
      clientTranscription:
        typeof clientTranscription === 'string' ? clientTranscription : undefined,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[tau-foundation/voice]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Voice processing failed' },
      { status: 500 },
    );
  }
}
