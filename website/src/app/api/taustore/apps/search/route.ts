import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sort') || 'rating';

    // Mock apps data
    const allApps = [
      {
        id: '1',
        name: 'TauMail',
        description: 'Secure email client with privacy-first design',
        price: 0,
        category: 'Productivity',
        rating: 4.8,
        download_count: 15000,
        developer: 'TauCore Inc.',
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
        developer: 'TauCore Inc.',
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
        developer: 'TauCore Inc.',
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
        developer: 'TauCore Inc.',
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
        developer: 'TauCore Inc.',
        version: '1.0.0',
        privacy_score: 96,
        icon_url: '/icons/tauai-icon.svg',
        screenshots: ['/screenshots/tauai-1.png', '/screenshots/tauai-2.png'],
        is_featured: true,
        featured_order: 5
      },
      {
        id: '6',
        name: 'TauNotes',
        description: 'Secure note-taking application',
        price: 0,
        category: 'Productivity',
        rating: 4.5,
        download_count: 5000,
        developer: 'TauCore Inc.',
        version: '1.0.0',
        privacy_score: 94,
        icon_url: '/icons/taunotes-icon.svg',
        screenshots: ['/screenshots/taunotes-1.png'],
        is_featured: false,
        featured_order: 0
      },
      {
        id: '7',
        name: 'TauCalendar',
        description: 'Privacy-focused calendar app',
        price: 0,
        category: 'Productivity',
        rating: 4.4,
        download_count: 3000,
        developer: 'TauCore Inc.',
        version: '1.0.0',
        privacy_score: 93,
        icon_url: '/icons/taucalendar-icon.svg',
        screenshots: ['/screenshots/taucalendar-1.png'],
        is_featured: false,
        featured_order: 0
      }
    ];

    // Filter apps based on search query and category
    let filteredApps = allApps;

    if (query) {
      filteredApps = filteredApps.filter(app => 
        app.name.toLowerCase().includes(query.toLowerCase()) ||
        app.description.toLowerCase().includes(query.toLowerCase()) ||
        app.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category) {
      filteredApps = filteredApps.filter(app => 
        app.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort apps
    switch (sortBy) {
      case 'rating':
        filteredApps.sort((a, b) => b.rating - a.rating);
        break;
      case 'downloads':
        filteredApps.sort((a, b) => b.download_count - a.download_count);
        break;
      case 'name':
        filteredApps.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price':
        filteredApps.sort((a, b) => a.price - b.price);
        break;
      default:
        filteredApps.sort((a, b) => b.rating - a.rating);
    }

    return NextResponse.json({
      success: true,
      apps: filteredApps,
      total: filteredApps.length,
      query,
      category,
      sortBy
    });

  } catch (error) {
    console.error('TauStore Search Error:', error);
    return NextResponse.json({ error: 'Failed to search apps' }, { status: 500 });
  }
}