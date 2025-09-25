import { NextRequest, NextResponse } from 'next/server';

// Desktop UI Apps API - Returns available desktop applications
export async function GET(request: NextRequest) {
  try {
    const apps = [
      {
        id: 'taumail',
        name: 'TauMail',
        description: 'Privacy-first email client',
        icon: '/brand/tauos-logo.svg',
        url: '/taumail',
        category: 'productivity',
        isInstalled: true,
        version: '1.0.0',
        size: '45.2 MB',
        lastUsed: new Date().toISOString()
      },
      {
        id: 'taucloud',
        name: 'TauCloud',
        description: 'Encrypted cloud storage',
        icon: '/brand/tauos-logo.svg',
        url: '/taucloud',
        category: 'storage',
        isInstalled: true,
        version: '1.0.0',
        size: '32.1 MB',
        lastUsed: new Date().toISOString()
      },
      {
        id: 'tauid',
        name: 'TauID',
        description: 'Identity management',
        icon: '/brand/tauos-logo.svg',
        url: '/tauid',
        category: 'security',
        isInstalled: true,
        version: '1.0.0',
        size: '28.7 MB',
        lastUsed: new Date().toISOString()
      },
      {
        id: 'taustore',
        name: 'TauStore',
        description: 'App marketplace',
        icon: '/brand/tauos-logo.svg',
        url: '/taustore',
        category: 'marketplace',
        isInstalled: true,
        version: '1.0.0',
        size: '38.9 MB',
        lastUsed: new Date().toISOString()
      },
      {
        id: 'taubrowser',
        name: 'TauBrowser',
        description: 'Privacy browser',
        icon: '/brand/tauos-logo.svg',
        url: '/taubrowser',
        category: 'browser',
        isInstalled: true,
        version: '1.0.0',
        size: '67.3 MB',
        lastUsed: new Date().toISOString()
      },
      {
        id: 'tauai',
        name: 'TauAI',
        description: 'AI assistant',
        icon: '/brand/tauos-logo.svg',
        url: '/tauai',
        category: 'ai',
        isInstalled: true,
        version: '1.0.0',
        size: '156.8 MB',
        lastUsed: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      success: true,
      apps: apps,
      total: apps.length
    });

  } catch (error) {
    console.error('Desktop Apps API Error:', error);
    return NextResponse.json({ error: 'Failed to get desktop apps' }, { status: 500 });
  }
}
