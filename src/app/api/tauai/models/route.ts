import { NextResponse } from 'next/server';
import { listAvailableModels } from '@/lib/ai-gateway';

export async function GET() {
  const models = listAvailableModels();
  return NextResponse.json({
    gateway: 'multi-model',
    version: '2.0.0',
    models,
    defaultProvider: process.env.OPENAI_API_KEY
      ? 'openai'
      : process.env.ANTHROPIC_API_KEY
        ? 'anthropic'
        : process.env.OLLAMA_BASE_URL
          ? 'ollama'
          : 'fallback',
    privacy: {
      logging: process.env.AI_LOG_CONVERSATIONS === 'true' ? 'enabled' : 'minimal',
      ephemeralSupported: true,
    },
    timestamp: new Date().toISOString(),
  });
}
