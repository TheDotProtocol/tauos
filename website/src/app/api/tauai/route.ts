import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    // For now, return a mock response
    // In production, this would integrate with OpenAI API
    const response = {
      message: `TauAI Response: I understand you said "${message}". This is a demo response. In production, this would be powered by OpenAI's GPT models for real AI assistance.`,
      timestamp: new Date().toISOString(),
      status: 'success'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('TauAI API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'TauAI API is running',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
