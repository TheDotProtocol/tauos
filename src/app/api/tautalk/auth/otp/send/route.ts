import { NextRequest, NextResponse } from 'next/server';
import { sendEmailOtp, sendPhoneOtp } from '@/lib/tautalk-otp';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const channel = body.channel as string;

    if (channel === 'email') {
      const email = typeof body.email === 'string' ? body.email : '';
      if (!email.trim()) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
      }
      const extra = await sendEmailOtp(email);
      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email',
        ...(extra.devCode ? { devCode: extra.devCode } : {}),
      });
    }

    if (channel === 'phone') {
      const phone = typeof body.phone === 'string' ? body.phone : '';
      if (!phone.trim()) {
        return NextResponse.json({ error: 'Phone required' }, { status: 400 });
      }
      const extra = await sendPhoneOtp(phone);
      return NextResponse.json({
        success: true,
        message: 'Verification code sent via SMS',
        ...(extra.devCode ? { devCode: extra.devCode } : {}),
      });
    }

    return NextResponse.json({ error: 'channel must be email or phone' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not send code';
    const status = message.includes('already exists') ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
