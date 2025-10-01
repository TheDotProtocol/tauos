import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'Test webhook endpoint is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test webhook received:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test webhook POST is working',
      received: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
