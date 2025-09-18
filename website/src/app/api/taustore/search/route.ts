import { NextRequest, NextResponse } from 'next/server';

// Mock app data for TauStore
const mockApps = [
  {
    id: 1,
    name: "TauMail",
    description: "Privacy-first email client with end-to-end encryption",
    version: "1.0.0",
    category: "Productivity",
    rating: 4.8,
    downloads: 12500,
    price: "Free",
    icon: "📧",
    features: ["End-to-end encryption", "Zero tracking", "Cross-platform sync"]
  },
  {
    id: 2,
    name: "TauCloud",
    description: "Secure cloud storage with zero-knowledge architecture",
    version: "1.2.0",
    category: "Storage",
    rating: 4.9,
    downloads: 8900,
    price: "Free",
    icon: "☁️",
    features: ["Zero-knowledge encryption", "File sharing", "Version control"]
  },
  {
    id: 3,
    name: "TauBrowser",
    description: "Privacy-first web browser with built-in ad blocking",
    version: "2.1.0",
    category: "Internet",
    rating: 4.7,
    downloads: 15600,
    price: "Free",
    icon: "🌐",
    features: ["Ad blocking", "Tracking protection", "Private browsing"]
  },
  {
    id: 4,
    name: "TauAI",
    description: "On-device AI assistant with privacy protection",
    version: "1.5.0",
    category: "AI",
    rating: 4.9,
    downloads: 22000,
    price: "Free",
    icon: "🤖",
    features: ["On-device processing", "Voice commands", "Smart suggestions"]
  },
  {
    id: 5,
    name: "TauGuard",
    description: "Advanced security suite with real-time protection",
    version: "1.3.0",
    category: "Security",
    rating: 4.8,
    downloads: 9800,
    price: "Free",
    icon: "🛡️",
    features: ["Real-time scanning", "Firewall", "Threat detection"]
  },
  {
    id: 6,
    name: "TauSync",
    description: "Intelligent file synchronization across devices",
    version: "1.1.0",
    category: "Productivity",
    rating: 4.6,
    downloads: 7300,
    price: "Free",
    icon: "🔄",
    features: ["Cross-device sync", "Conflict resolution", "Bandwidth optimization"]
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';

    let filteredApps = mockApps;

    // Filter by search query
    if (query) {
      filteredApps = filteredApps.filter(app => 
        app.name.toLowerCase().includes(query.toLowerCase()) ||
        app.description.toLowerCase().includes(query.toLowerCase()) ||
        app.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filteredApps = filteredApps.filter(app => 
        app.category.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      apps: filteredApps,
      total: filteredApps.length,
      query,
      category
    });

  } catch (error) {
    console.error('TauStore Search Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
