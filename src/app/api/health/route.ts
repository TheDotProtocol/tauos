import { getPool, getJwtSecret } from '@/lib/db-pool';
import { NextRequest, NextResponse } from 'next/server';

// Database connection - production ready


export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Test database connection
    let dbStatus = 'healthy';
    let dbResponseTime = 0;
    
    try {
      const dbStartTime = Date.now();
      await getPool().query('SELECT 1');
      dbResponseTime = Date.now() - dbStartTime;
    } catch (error) {
      dbStatus = 'unhealthy';
      console.error('Database health check failed:', error);
    }

    const totalResponseTime = Date.now() - startTime;

    // Check environment variables
    const envStatus = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY,
      NODE_ENV: process.env.NODE_ENV || 'development'
    };

    const overallStatus = dbStatus === 'healthy' ? 'healthy' : 'unhealthy';

    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
          responseTime: `${dbResponseTime}ms`
        },
        api: {
          status: 'healthy',
          responseTime: `${totalResponseTime}ms`
        }
      },
      environment: envStatus,
      version: '1.0.0',
      uptime: process.uptime()
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      services: {
        database: { status: 'unknown' },
        api: { status: 'unhealthy' }
      }
    }, { status: 500 });
  }
}
