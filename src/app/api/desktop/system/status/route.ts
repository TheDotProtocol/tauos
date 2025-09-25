import { NextRequest, NextResponse } from 'next/server';

// Desktop System Status API - Returns system information
export async function GET(request: NextRequest) {
  try {
    const systemStatus = {
      os: {
        name: 'TauCore',
        version: '1.0.0',
        build: '2025.09.20',
        architecture: 'x64'
      },
      hardware: {
        cpu: 'Intel Core i7-12700K',
        memory: '32 GB DDR4',
        storage: '1 TB NVMe SSD',
        gpu: 'NVIDIA RTX 4070'
      },
      performance: {
        cpuUsage: Math.floor(Math.random() * 30) + 10, // 10-40%
        memoryUsage: Math.floor(Math.random() * 40) + 20, // 20-60%
        storageUsage: Math.floor(Math.random() * 20) + 30, // 30-50%
        networkSpeed: '1 Gbps'
      },
      security: {
        firewall: 'Active',
        antivirus: 'TauGuard Active',
        encryption: 'Enabled',
        privacyMode: 'High'
      },
      uptime: {
        days: Math.floor(Math.random() * 30) + 1,
        hours: Math.floor(Math.random() * 24),
        minutes: Math.floor(Math.random() * 60)
      }
    };

    return NextResponse.json({
      success: true,
      status: systemStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Desktop System Status Error:', error);
    return NextResponse.json({ error: 'Failed to get system status' }, { status: 500 });
  }
}
