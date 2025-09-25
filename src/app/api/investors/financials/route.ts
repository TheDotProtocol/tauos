import { NextRequest, NextResponse } from 'next/server';

// Investors Financial Data API - Returns financial metrics
export async function GET(request: NextRequest) {
  try {
    const financialData = {
      overview: {
        currentRevenue: 43000000, // $43M
        targetRevenue: 750000000, // $750M
        growthRate: 85.2,
        userCount: 4200,
        deviceCount: 1200,
        fundingRaised: 1500000, // $1.5M
        fundingTarget: 1500000, // $1.5M
        runway: 18 // months
      },
      revenue: {
        device: {
          current: 23000000, // $23M
          projected: 450000000, // $450M
          growth: 95.7
        },
        software: {
          current: 15000000, // $15M
          projected: 200000000, // $200M
          growth: 78.3
        },
        enterprise: {
          current: 5000000, // $5M
          projected: 100000000, // $100M
          growth: 65.8
        }
      },
      devices: {
        tauphone: {
          units: 35000,
          asp: 399,
          revenue: 13965000,
          margin: 53.3
        },
        taubook: {
          units: 20000,
          asp: 699,
          revenue: 13980000,
          margin: 40.8
        }
      },
      metrics: {
        customerAcquisitionCost: 45,
        lifetimeValue: 1250,
        churnRate: 2.1,
        netPromoterScore: 78
      },
      projections: {
        year2025: {
          revenue: 65000000,
          users: 15000,
          devices: 55000
        },
        year2026: {
          revenue: 150000000,
          users: 45000,
          devices: 125000
        },
        year2027: {
          revenue: 300000000,
          users: 120000,
          devices: 280000
        },
        year2028: {
          revenue: 500000000,
          users: 250000,
          devices: 450000
        },
        year2029: {
          revenue: 750000000,
          users: 500000,
          devices: 750000
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: financialData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Investors Financial Data Error:', error);
    return NextResponse.json({ error: 'Failed to get financial data' }, { status: 500 });
  }
}
