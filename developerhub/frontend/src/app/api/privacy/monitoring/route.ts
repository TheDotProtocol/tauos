import { NextRequest, NextResponse } from 'next/server';

interface MonitoringData {
  systemPerformance: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  securityEvents: {
    failedLogins: number;
    malwareDetected: number;
    suspiciousActivity: number;
    blockedThreats: number;
  };
  systemHealth: {
    temperature: number;
    battery: number;
    uptime: string;
    errors: number;
  };
  networkActivity: {
    connections: number;
    dataTransferred: number;
    anomalies: number;
    blockedConnections: number;
  };
}

// Simulate monitoring data
function generateMonitoringData(): MonitoringData {
  const now = new Date();
  const uptime = Math.floor((now.getTime() - (now.getTime() - Math.random() * 86400000 * 2)) / 1000);
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);

  return {
    systemPerformance: {
      cpu: Math.max(0, Math.min(100, 45 + (Math.random() - 0.5) * 20)),
      memory: Math.max(0, Math.min(100, 67 + (Math.random() - 0.5) * 10)),
      disk: Math.max(0, Math.min(100, 23 + (Math.random() - 0.5) * 5)),
      network: Math.max(0, Math.min(100, 12 + (Math.random() - 0.5) * 15))
    },
    securityEvents: {
      failedLogins: Math.floor(Math.random() * 5),
      malwareDetected: Math.floor(Math.random() * 2),
      suspiciousActivity: Math.floor(Math.random() * 3),
      blockedThreats: Math.floor(Math.random() * 8)
    },
    systemHealth: {
      temperature: Math.max(30, Math.min(80, 42 + (Math.random() - 0.5) * 10)),
      battery: Math.max(0, Math.min(100, 85 - Math.random() * 10)),
      uptime: `${days}d ${hours}h ${minutes}m`,
      errors: Math.floor(Math.random() * 3)
    },
    networkActivity: {
      connections: Math.max(0, Math.floor(15 + (Math.random() - 0.5) * 10)),
      dataTransferred: Math.floor(1024 + Math.random() * 500),
      anomalies: Math.floor(Math.random() * 2),
      blockedConnections: Math.floor(Math.random() * 5)
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const realTime = searchParams.get('realTime') === 'true';
    
    if (realTime) {
      // Generate fresh data for real-time updates
      const data = generateMonitoringData();
      return NextResponse.json({ 
        success: true, 
        data,
        timestamp: new Date().toISOString()
      });
    } else {
      // Return cached data
      const data = generateMonitoringData();
      return NextResponse.json({ 
        success: true, 
        data,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch monitoring data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'export':
        // Export monitoring data
        const exportData = {
          timestamp: new Date().toISOString(),
          data: generateMonitoringData(),
          exportReason: 'User requested data export',
          privacyLevel: 'balanced' // This would come from user settings
        };
        
        return NextResponse.json({ 
          success: true, 
          message: 'Monitoring data exported successfully',
          data: exportData
        });

      case 'delete':
        // Delete monitoring data
        console.log('Monitoring data deleted:', {
          timestamp: new Date().toISOString(),
          reason: 'User requested data deletion'
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Monitoring data deleted successfully'
        });

      case 'reset':
        // Reset monitoring data
        console.log('Monitoring data reset:', {
          timestamp: new Date().toISOString(),
          reason: 'User requested data reset'
        });
        
        return NextResponse.json({ 
          success: true, 
          message: 'Monitoring data reset successfully'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process monitoring data request' },
      { status: 500 }
    );
  }
}
