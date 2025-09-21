import { NextRequest, NextResponse } from 'next/server';

// Mobile UI Apps API - Returns available mobile applications
export async function GET(request: NextRequest) {
  try {
    const apps = [
      {
        id: 'taumail-mobile',
        name: 'TauMail',
        description: 'Email on the go',
        icon: '/brand/tauos-logo.svg',
        url: '/taumail',
        category: 'productivity',
        isInstalled: true,
        version: '1.0.0',
        size: '28.5 MB',
        notifications: 3
      },
      {
        id: 'taucloud-mobile',
        name: 'TauCloud',
        description: 'Cloud storage',
        icon: '/brand/tauos-logo.svg',
        url: '/taucloud',
        category: 'storage',
        isInstalled: true,
        version: '1.0.0',
        size: '19.2 MB',
        notifications: 0
      },
      {
        id: 'tauid-mobile',
        name: 'TauID',
        description: 'Digital identity',
        icon: '/brand/tauos-logo.svg',
        url: '/tauid',
        category: 'security',
        isInstalled: true,
        version: '1.0.0',
        size: '15.8 MB',
        notifications: 1
      },
      {
        id: 'taustore-mobile',
        name: 'TauStore',
        description: 'App store',
        icon: '/brand/tauos-logo.svg',
        url: '/taustore',
        category: 'marketplace',
        isInstalled: true,
        version: '1.0.0',
        size: '24.3 MB',
        notifications: 0
      },
      {
        id: 'taubrowser-mobile',
        name: 'TauBrowser',
        description: 'Private browsing',
        icon: '/brand/tauos-logo.svg',
        url: '/taubrowser',
        category: 'browser',
        isInstalled: true,
        version: '1.0.0',
        size: '42.1 MB',
        notifications: 0
      },
      {
        id: 'tauai-mobile',
        name: 'TauAI',
        description: 'AI assistant',
        icon: '/brand/tauos-logo.svg',
        url: '/tauai',
        category: 'ai',
        isInstalled: true,
        version: '1.0.0',
        size: '89.7 MB',
        notifications: 2
      },
      {
        id: 'camera',
        name: 'Camera',
        description: 'Photo & video capture',
        icon: '/brand/tauos-logo.svg',
        url: '#',
        category: 'media',
        isInstalled: true,
        version: '1.0.0',
        size: '12.4 MB',
        notifications: 0
      },
      {
        id: 'messages',
        name: 'Messages',
        description: 'Secure messaging',
        icon: '/brand/tauos-logo.svg',
        url: '#',
        category: 'communication',
        isInstalled: true,
        version: '1.0.0',
        size: '18.6 MB',
        notifications: 5
      },
      {
        id: 'phone',
        name: 'Phone',
        description: 'Voice calls',
        icon: '/brand/tauos-logo.svg',
        url: '#',
        category: 'communication',
        isInstalled: true,
        version: '1.0.0',
        size: '8.9 MB',
        notifications: 0
      },
      {
        id: 'maps',
        name: 'Maps',
        description: 'Navigation',
        icon: '/brand/tauos-logo.svg',
        url: '#',
        category: 'navigation',
        isInstalled: true,
        version: '1.0.0',
        size: '35.2 MB',
        notifications: 0
      },
      {
        id: 'weather',
        name: 'Weather',
        description: 'Weather forecast',
        icon: '/brand/tauos-logo.svg',
        url: '#',
        category: 'utilities',
        isInstalled: true,
        version: '1.0.0',
        size: '6.7 MB',
        notifications: 0
      },
      {
        id: 'notes',
        name: 'Notes',
        description: 'Note taking',
        icon: '/brand/tauos-logo.svg',
        url: '#',
        category: 'productivity',
        isInstalled: true,
        version: '1.0.0',
        size: '11.3 MB',
        notifications: 0
      }
    ];

    return NextResponse.json({
      success: true,
      apps: apps,
      total: apps.length
    });

  } catch (error) {
    console.error('Mobile Apps API Error:', error);
    return NextResponse.json({ error: 'Failed to get mobile apps' }, { status: 500 });
  }
}
