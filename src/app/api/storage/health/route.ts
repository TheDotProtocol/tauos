import { NextResponse } from 'next/server';
import { checkStorageHealth } from '@/lib/supabase-storage';

export async function GET() {
  const health = await checkStorageHealth();
  return NextResponse.json(health);
}
