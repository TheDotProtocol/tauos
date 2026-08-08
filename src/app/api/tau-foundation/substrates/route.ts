import { NextResponse } from 'next/server';
import { listProductSubstrateStatuses } from '@/lib/tau-ai-app/substrate-service';

export async function GET() {
  const substrates = listProductSubstrateStatuses();
  return NextResponse.json({
    success: true,
    substrates,
    timestamp: new Date().toISOString(),
  });
}
