import { NextRequest, NextResponse } from 'next/server';

// Investors Metrics API - Returns key performance indicators
export async function GET(request: NextRequest) {
  try {
    const metrics = {
      traction: {
        alphaUsers: 4200,
        pilotDevices: 1200,
        enterprisePilots: 1,
        developerSignups: 156,
        appDownloads: 8900,
        monthlyActiveUsers: 3800
      },
      financial: {
        burnRate: 125000, // monthly
        runway: 18, // months
        grossMargin: 47.2,
        ebitda: -15.8,
        cashOnHand: 2250000
      },
      product: {
        uptime: 99.9,
        responseTime: 180, // ms
        securityScore: 95,
        privacyScore: 98,
        userSatisfaction: 4.7
      },
      market: {
        totalAddressableMarket: 45000000000, // $45B
        serviceableAddressableMarket: 8500000000, // $8.5B
        serviceableObtainableMarket: 1200000000, // $1.2B
        marketShare: 0.0036
      },
      team: {
        employees: 12,
        engineers: 8,
        advisors: 4,
        boardMembers: 3,
        diversityScore: 67
      },
      technology: {
        patents: 3,
        trademarks: 8,
        openSourceProjects: 12,
        securityAudits: 2,
        complianceCertifications: 4
      }
    };

    return NextResponse.json({
      success: true,
      metrics: metrics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Investors Metrics Error:', error);
    return NextResponse.json({ error: 'Failed to get metrics' }, { status: 500 });
  }
}
