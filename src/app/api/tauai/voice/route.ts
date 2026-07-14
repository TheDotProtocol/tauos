import { NextRequest, NextResponse } from 'next/server';
import { runAiChat } from '@/lib/ai-gateway';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const audio = form.get('audio') as File | null;
      const followUp = form.get('followUp') === 'true';

      if (!audio) {
        return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
      }

      let transcription = '';
      const openaiKey = process.env.OPENAI_API_KEY;

      if (openaiKey) {
        const whisperForm = new FormData();
        whisperForm.append('file', audio, 'voice.webm');
        whisperForm.append('model', 'whisper-1');
        whisperForm.append('language', 'en');

        const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${openaiKey}` },
          body: whisperForm,
        });

        if (whisperRes.ok) {
          const data = await whisperRes.json();
          transcription = data.text?.trim() ?? '';
        }
      }

      if (!transcription) {
        return NextResponse.json({
          transcription: '',
          useClientStt: true,
          message: 'Set OPENAI_API_KEY for server STT, or use browser SpeechRecognition',
        });
      }

      if (!followUp) {
        return NextResponse.json({
          transcription,
          confidence: 0.9,
          language: 'en-US',
          timestamp: new Date().toISOString(),
        });
      }

      const chat = await runAiChat({
        messages: [
          { role: 'system', content: 'You are Tau AI, a helpful privacy-first assistant for Tau OS.' },
          { role: 'user', content: transcription },
        ],
      });

      return NextResponse.json({
        transcription,
        response: chat.message,
        provider: chat.provider,
        model: chat.model,
        timestamp: new Date().toISOString(),
      });
    }

    const { audioData, followUp } = await request.json();
    if (!audioData) {
      return NextResponse.json({ error: 'No audio data provided' }, { status: 400 });
    }

    return NextResponse.json({
      transcription: '',
      useClientStt: true,
      followUp: Boolean(followUp),
      message: 'Send audio as multipart/form-data field "audio" for Whisper STT',
    });
  } catch (error) {
    console.error('TauAI Voice API Error:', error);
    return NextResponse.json({ error: 'Failed to process voice input' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'TauAI Voice API — Public Beta',
    status: 'active',
    stt: process.env.OPENAI_API_KEY ? 'openai-whisper' : 'client-fallback',
    pipeline: 'STT → /api/tauai/chat',
    supportedFormats: ['webm', 'wav', 'mp3', 'ogg'],
    maxDuration: 30,
    timestamp: new Date().toISOString(),
  });
}
