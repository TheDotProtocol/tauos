import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock featured apps data
    const apps = [
      {
        id: '1',
        name: 'TauMail',
        description: 'Secure email client with privacy-first design',
        price: 0,
        category: 'Productivity',
        rating: 4.8,
        download_count: 15000,
        developer: 'TauOS Inc.',
        version: '1.0.0',
        privacy_score: 95,
        icon_url: '/icons/taumail-icon.svg',
        screenshots: ['/screenshots/taumail-1.png', '/screenshots/taumail-2.png'],
        is_featured: true,
        featured_order: 1
      },
      {
        id: '2',
        name: 'TauCloud',
        description: 'Encrypted cloud storage solution',
        price: 0,
        category: 'Storage',
        rating: 4.7,
        download_count: 12000,
        developer: 'TauOS Inc.',
        version: '1.0.0',
        privacy_score: 98,
        icon_url: '/icons/taucloud-icon.svg',
        screenshots: ['/screenshots/taucloud-1.png', '/screenshots/taucloud-2.png'],
        is_featured: true,
        featured_order: 2
      },
      {
        id: '3',
        name: 'TauID',
        description: 'Digital identity management system',
        price: 0,
        category: 'Security',
        rating: 4.9,
        download_count: 8000,
        developer: 'TauOS Inc.',
        version: '1.0.0',
        privacy_score: 99,
        icon_url: '/icons/tauid-icon.svg',
        screenshots: ['/screenshots/tauid-1.png', '/screenshots/tauid-2.png'],
        is_featured: true,
        featured_order: 3
      },
      {
        id: '4',
        name: 'TauBrowser',
        description: 'Privacy-focused web browser',
        price: 0,
        category: 'Internet',
        rating: 4.6,
        download_count: 20000,
        developer: 'TauOS Inc.',
        version: '1.0.0',
        privacy_score: 92,
        icon_url: '/icons/taubrowser-icon.svg',
        screenshots: ['/screenshots/taubrowser-1.png', '/screenshots/taubrowser-2.png'],
        is_featured: true,
        featured_order: 4
      },
      {
        id: '5',
        name: 'TauAI',
        description: 'AI assistant with local processing',
        price: 0,
        category: 'AI',
        rating: 4.8,
        download_count: 18000,
        developer: 'TauOS Inc.',
        version: '1.0.0',
        privacy_score: 96,
        icon_url: '/icons/tauai-icon.svg',
        screenshots: ['/screenshots/tauai-1.png', '/screenshots/tauai-2.png'],
        is_featured: true,
        featured_order: 5
      }
    ];

    return NextResponse.json({
      success: true,
      apps
    });

  } catch (error) {
    console.error('TauStore Featured Apps Error:', error);
    return NextResponse.json({ error: 'Failed to get featured apps' }, { status: 500 });
  }
}