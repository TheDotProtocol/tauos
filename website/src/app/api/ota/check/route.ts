import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Mock update database (in production, use real database)
const updates = {
  '1.0.0': {
    version: '1.0.1',
    available: true,
    size: '15.2MB',
    description: 'Security patches and performance improvements',
    changelog: [
      'Fixed security vulnerability in kernel module',
      'Improved Wi-Fi driver compatibility',
      'Enhanced desktop performance',
      'Updated TauScript runtime'
    ],
    checksum: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
    download_url: '/api/ota/download/1.0.1'
  },
  '1.0.1': {
    version: '1.0.2',
    available: true,
    size: '12.8MB',
    description: 'Bug fixes and new features',
    changelog: [
      'Fixed installation wizard language detection',
      'Added support for ARM64 devices',
      'Improved TauMail performance',
      'Enhanced security hardening'
    ],
    checksum: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
    download_url: '/api/ota/download/1.0.2'
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentVersion = searchParams.get('version') || '1.0.0';
    
    console.log(`🔄 OTA Check: Version ${currentVersion}`);
    
    const updateInfo = updates[currentVersion];
    
    if (updateInfo && updateInfo.available) {
      console.log(`📦 Update available: ${currentVersion} -> ${updateInfo.version}`);
      
      return NextResponse.json({
        update_available: true,
        version: updateInfo.version,
        size: updateInfo.size,
        description: updateInfo.description,
        changelog: updateInfo.changelog,
        download_url: updateInfo.download_url,
        checksum: updateInfo.checksum
      });
    } else {
      console.log(`✅ System up to date: ${currentVersion}`);
      
      return NextResponse.json({
        update_available: false,
        message: 'No updates available',
        current_version: currentVersion
      });
    }
    
  } catch (error) {
    console.error('❌ OTA Check Error:', error);
    
    return NextResponse.json({
      error: 'Failed to check for updates',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
