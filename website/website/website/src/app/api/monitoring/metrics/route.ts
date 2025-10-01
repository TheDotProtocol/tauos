import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getMetrics, calculateAverageResponseTime } from '../../middleware/metrics';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Database connection for health checks
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.tviqcormikopltejomkc:Ak1233%40%405@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=disable',
  ssl: false
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Get current timestamp
    const timestamp = Date.now();
    
    // Test database connection
    let dbStatus = 'healthy';
    let dbResponseTime = 0;
    
    try {
      const dbStartTime = Date.now();
      await pool.query('SELECT 1');
      dbResponseTime = Date.now() - dbStartTime;
    } catch (error) {
      dbStatus = 'unhealthy';
      console.error('Database health check failed:', error);
    }

    // Get system metrics
    const systemMetrics = {
      timestamp,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid
    };

    // Get shared metrics
    const sharedMetrics = getMetrics();
    
    // Get app-specific metrics
    const appMetrics = {
      taumail: {
        status: 'healthy',
        lastCheck: timestamp,
        endpoints: ['/api/taumail/auth/register', '/api/taumail/auth/login', '/api/taumail/emails/send', '/api/taumail/emails/inbox'],
        requests: sharedMetrics.requests.get('taumail') || 0,
        errors: sharedMetrics.errors.get('taumail') || 0,
        avgResponseTime: calculateAverageResponseTime('taumail')
      },
      taucloud: {
        status: 'healthy',
        lastCheck: timestamp,
        endpoints: ['/api/taucloud/auth/register', '/api/taucloud/auth/login', '/api/taucloud/files/list', '/api/taucloud/files/upload'],
        requests: sharedMetrics.requests.get('taucloud') || 0,
        errors: sharedMetrics.errors.get('taucloud') || 0,
        avgResponseTime: calculateAverageResponseTime('taucloud')
      },
      tauid: {
        status: 'healthy',
        lastCheck: timestamp,
        endpoints: ['/api/tauid/auth/register', '/api/tauid/auth/login', '/api/tauid/user/profile'],
        requests: sharedMetrics.requests.get('tauid') || 0,
        errors: sharedMetrics.errors.get('tauid') || 0,
        avgResponseTime: calculateAverageResponseTime('tauid')
      },
      taustore: {
        status: 'healthy',
        lastCheck: timestamp,
        endpoints: ['/api/taustore/apps/featured', '/api/taustore/apps/search'],
        requests: sharedMetrics.requests.get('taustore') || 0,
        errors: sharedMetrics.errors.get('taustore') || 0,
        avgResponseTime: calculateAverageResponseTime('taustore')
      },
      taubrowser: {
        status: 'healthy',
        lastCheck: timestamp,
        endpoints: ['/api/taubrowser/auth/register', '/api/taubrowser/auth/login'],
        requests: sharedMetrics.requests.get('taubrowser') || 0,
        errors: sharedMetrics.errors.get('taubrowser') || 0,
        avgResponseTime: calculateAverageResponseTime('taubrowser')
      },
      tauai: {
        status: 'healthy',
        lastCheck: timestamp,
        endpoints: ['/api/tauai', '/api/tauai/status', '/api/tauai/voice'],
        requests: sharedMetrics.requests.get('tauai') || 0,
        errors: sharedMetrics.errors.get('tauai') || 0,
        avgResponseTime: calculateAverageResponseTime('tauai')
      }
    };

    // Overall system health
    const overallHealth = {
      status: dbStatus === 'healthy' ? 'healthy' : 'unhealthy',
      database: {
        status: dbStatus,
        responseTime: dbResponseTime
      },
      apps: appMetrics,
      system: systemMetrics,
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        DATABASE_URL: !!process.env.DATABASE_URL,
        JWT_SECRET: !!process.env.JWT_SECRET,
        SENDGRID_API_KEY: !!process.env.SENDGRID_API_KEY
      }
    };

    if (format === 'prometheus') {
      // Return Prometheus format
      const prometheusMetrics = generatePrometheusMetrics(overallHealth);
      return new NextResponse(prometheusMetrics, {
        headers: {
          'Content-Type': 'text/plain; version=0.0.4; charset=utf-8'
        }
      });
    }

    return NextResponse.json(overallHealth);

  } catch (error) {
    console.error('Monitoring metrics error:', error);
    return NextResponse.json({ error: 'Failed to get metrics' }, { status: 500 });
  }
}

function generatePrometheusMetrics(health: any): string {
  const timestamp = Date.now();
  let metrics = '';

  // System metrics
  metrics += `# HELP tauos_system_uptime_seconds System uptime in seconds\n`;
  metrics += `# TYPE tauos_system_uptime_seconds gauge\n`;
  metrics += `tauos_system_uptime_seconds ${health.system.uptime} ${timestamp}\n\n`;

  // Memory metrics
  metrics += `# HELP tauos_system_memory_bytes System memory usage in bytes\n`;
  metrics += `# TYPE tauos_system_memory_bytes gauge\n`;
  metrics += `tauos_system_memory_bytes{type="rss"} ${health.system.memory.rss} ${timestamp}\n`;
  metrics += `tauos_system_memory_bytes{type="heapTotal"} ${health.system.memory.heapTotal} ${timestamp}\n`;
  metrics += `tauos_system_memory_bytes{type="heapUsed"} ${health.system.memory.heapUsed} ${timestamp}\n\n`;

  // Database metrics
  metrics += `# HELP tauos_database_status Database connection status\n`;
  metrics += `# TYPE tauos_database_status gauge\n`;
  metrics += `tauos_database_status ${health.database.status === 'healthy' ? 1 : 0} ${timestamp}\n`;
  metrics += `# HELP tauos_database_response_time_seconds Database response time in seconds\n`;
  metrics += `# TYPE tauos_database_response_time_seconds gauge\n`;
  metrics += `tauos_database_response_time_seconds ${health.database.responseTime / 1000} ${timestamp}\n\n`;

  // App metrics
  Object.entries(health.apps).forEach(([appName, appData]: [string, any]) => {
    metrics += `# HELP tauos_app_requests_total Total requests for ${appName}\n`;
    metrics += `# TYPE tauos_app_requests_total counter\n`;
    metrics += `tauos_app_requests_total{app="${appName}"} ${appData.requests} ${timestamp}\n`;

    metrics += `# HELP tauos_app_errors_total Total errors for ${appName}\n`;
    metrics += `# TYPE tauos_app_errors_total counter\n`;
    metrics += `tauos_app_errors_total{app="${appName}"} ${appData.errors} ${timestamp}\n`;

    metrics += `# HELP tauos_app_response_time_seconds Average response time for ${appName}\n`;
    metrics += `# TYPE tauos_app_response_time_seconds gauge\n`;
    metrics += `tauos_app_response_time_seconds{app="${appName}"} ${appData.avgResponseTime / 1000} ${timestamp}\n`;

    metrics += `# HELP tauos_app_status Application status for ${appName}\n`;
    metrics += `# TYPE tauos_app_status gauge\n`;
    metrics += `tauos_app_status{app="${appName}"} ${appData.status === 'healthy' ? 1 : 0} ${timestamp}\n\n`;
  });

  return metrics;
}

// Note: trackMetrics function moved to middleware/metrics.ts
// This route file only exports HTTP handlers (GET, POST, etc.)
