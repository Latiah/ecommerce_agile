import { NextResponse } from 'next/server';

/**
 * Basic health endpoint for monitoring.
 * Returns 200 with a status payload as long as the app is up and can
 * respond to a request. Kept deliberately simple (no external calls)
 * so it can be hit by an uptime check without adding load to Supabase.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'ecommerce-agile',
    timestamp: new Date().toISOString(),
  });
}
