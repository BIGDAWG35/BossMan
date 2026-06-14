import { NextResponse } from 'next/server';

/**
 * Health check endpoint — Boss Hub probe target.
 * Returns 200 + {status:"ok"} when service is healthy.
 * Returns 503 + {status:"degraded"} when any core dependency is down.
 */
export async function GET() {
  const checks = {
    uptime: process.uptime(),
    node_env: process.env.NODE_ENV || 'development',
  };

  // TODO: add real dependency checks once dependencies are identified.
  const allHealthy = true; // placeholder — replace with real checks

  if (allHealthy) {
    return NextResponse.json(
      { status: 'ok', ...checks },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { status: 'degraded', ...checks },
      { status: 503 }
    );
  }
}
