'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  Smartphone,
  Laptop,
  BarChart3,
  PieChart,
  Target,
  Award,
  ChevronRight,
  Download,
  ArrowUpRight,
  Calendar,
  Building,
  Zap,
  Shield,
  Lock,
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  FileText,
  ExternalLink,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function InvestorsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(2025);

  // Investor TL;DR - Key highlights
  const investorTLDR = {
    tagline: "Tomorrow's Intelligence, Today",
    keyPoints: [
      "Devices + recurring SaaS. Hardware margins ~50%. Software margins ~70–80%.",
      "Blended ASP ~ $400 (mix of OEM & direct retail).",
      "2025 Forecast: $65M (Projections) — see assumptions.",
      "5-year target: IPO (2030–31) with $1B+ target valuation.",
      "Raise ask: $1.5M seed — runway to deliver key milestones and enterprise deals."
    ]
  };

  // Current Traction (Actuals)
  const currentTraction = {
    title: "Current Traction (Actuals)",
    subtitle: "verified / dated",
    metrics: [
      { label: "Alpha users (monthly active)", value: "4,200", icon: Users },
      { label: "Devices shipped (pilot)", value: "1,200 units", icon: Smartphone },
      { label: "Enterprise pilots signed", value: "1 (Healthcare pilot, NDA)", icon: Building },
      { label: "Live demo", value: "TauPhone UI & TauCloud testnet", icon: Play }
    ],
    footer: "All actuals are audited/recorded as of September 18, 2025."
  };

  // 2025 Forecasts (Projections)
  const forecasts2025 = {
    title: "2025 Forecasts (Projections)",
    subtitle: "assumptions footnoted",
    metrics: [
      { label: "Revenue (2025 forecast)", value: "$65M", icon: DollarSign },
      { label: "Unit forecast (2025)", value: "55,000 units", icon: Target },
      { label: "Key assumption", value: "Blended device ASP of ~$400 (see revenue clarification)", icon: Info }
    ],
    footer: "See assumptions tab in Excel for detailed breakdown."
  };

  // Revenue Clarification
  const revenueClarification = {
    title: "Revenue Clarification (important)",
    content: "Projections use a blended device ASP because TauOS will sell hardware both via direct retail and OEM / licensing partnerships. Direct retail ASP (TauBook/TauPhone) is ~$899–$1,099, while OEM-licensed units are sold at significantly lower ASPs to channel partners. Our model assumes ~70% OEM-licensed units at ~$150 ASP and 30% direct retail at ~$999 ASP, yielding a blended device ASP of ~$400 across the unit base.",
    footnote: "See Revenue Mix & Device ASP table below for detailed math."
  };

  // Revenue Mix Table
  const revenueMix = [
    { type: "Direct retail", share: "30%", asp: "$999" },
    { type: "OEM licensing", share: "70%", asp: "$150" },
    { type: "Blended ASP", share: "100%", asp: "$399" }
  ];

  // Milestones Timeline
  const milestones = [
    {
      quarter: "Q1–Q2 2026",
      title: "Ship 5,000 TauBooks to early adopters",
      description: "Manufacturing samples & fulfilled",
      status: "planned"
    },
    {
      quarter: "Q3 2026",
      title: "Launch TauCloud Beta + public SDK",
      description: "Start onboarding 5 enterprise pilot customers",
      status: "planned"
    },
    {
      quarter: "Q4 2026",
      title: "Complete third-party security audit",
      description: "CrowdAudit LLC + sign 2 enterprise MDM contracts",
      status: "planned"
    },
    {
      quarter: "Q1 2027",
      title: "Mass production ramp and consumer launch",
      description: "Launch in 3 markets (US, EU, SEA)",
      status: "planned"
    }
  ];

  // Use of Funds
  const useOfFunds = [
    { category: "Product R&D & Engineering", amount: 500000, rationale: "OS polishing, TauAI on-device, QA — target: TauAI v1 release" },
    { category: "Manufacturing samples & tooling", amount: 300000, rationale: "Produce 5k pilot TauBooks + 3k TauPhones; validate supply chain" },
    { category: "Security Audit & Compliance", amount: 100000, rationale: "Third-party audit, penetration testing, SOC/ISO preps" },
    { category: "Sales & BD (enterprise)", amount: 200000, rationale: "Hire BD, close 3 pilot deals, MDM integration" },
    { category: "Marketing & Pre-order Campaigns", amount: 150000, rationale: "Demand gen, pre-booking microsites, PR, events" },
    { category: "Legal, IP & Corporate Ops", amount: 100000, rationale: "Contracts, IP filings, corporate governance costs" },
    { category: "Contingency / Runway Buffer", amount: 150000, rationale: "3–6 months operational buffer" }
  ];

  // Credibility Signals
  const credibilitySignals = {
    partners: [
      { name: "Healthcare Pilot", status: "NDA", logo: "🏥" },
      { name: "FinServ Pilot", status: "NDA", logo: "🏦" },
      { name: "Education Pilot", status: "NDA", logo: "🎓" }
    ],
    testimonials: [
      {
        quote: "TauPhone's responsiveness and privacy model transformed our field trials — secure, fast, and intuitive.",
        author: "Beta user, Healthcare Pilot (Name redacted for NDA)"
      }
    ],
    securityAudit: {
      firm: "CrowdAudit LLC",
      scheduled: "Q4 2026",
      scope: "penetration testing, code review, supply-chain verification"
    },
    thirdPartyValidation: [
      "Letter of Intent / MOU with Enterprise X (pilot) — under NDA"
    ]
  };

  // Competitive Analysis
  const competitiveAnalysis = [
    { company: "TauOS", ai: "✓", privacy: "✓", devices: "✓", enterprise: "✓", pricing: "Affordable" },
    { company: "Apple", ai: "✓ (cloud)", privacy: "✓ (closed)", devices: "✓", enterprise: "✗", pricing: "Premium" },
    { company: "Google", ai: "✓ (cloud)", privacy: "✗", devices: "✓", enterprise: "✗", pricing: "Mid" },
    { company: "Microsoft", ai: "✗ (bolted)", privacy: "✗", devices: "✗", enterprise: "✓", pricing: "Enterprise" },
    { company: "GrapheneOS", ai: "✗", privacy: "✓", devices: "✗", enterprise: "✗", pricing: "Niche" }
  ];

  // Risk Mitigation
  const riskMitigation = [
    {
      risk: "Supply Chain Risk",
      mitigation: "Partner with two vetted OEM suppliers, maintain safety stock & diversified component sources; early tooling validation in Q2 2026."
    },
    {
      risk: "Adoption Risk", 
      mitigation: "Enterprise pilots + OEM licensing to seed installs; layered GTM (enterprise -> developers -> consumers) with targeted incentives."
    }
  ];

  // Financial Projections (Base Case)
  const financialProjections = {
    2025: { revenue: 65, ebitda: 2.6, units: 55 },
    2026: { revenue: 150, ebitda: 15, units: 135 },
    2027: { revenue: 300, ebitda: 60, units: 265 },
    2028: { revenue: 500, ebitda: 150, units: 450 },
    2029: { revenue: 750, ebitda: 300, units: 675 }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {investorTLDR.tagline}
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              The world's first Privacy-Native AI Operating System
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="/output/updated_investor/TauOS_Investor_Deck.pdf"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                Download Investor Deck + Model
              </a>
              <button className="inline-flex items-center gap-2 border border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-200">
                <Play className="w-5 h-5" />
                Watch 2-minute Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Investor TL;DR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900/50 border border-yellow-400/20 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">Investor TL;DR</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {investorTLDR.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actuals vs Forecasts */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Current Traction */}
          <div className="bg-green-900/20 border border-green-400/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-green-400 mb-2">{currentTraction.title}</h3>
            <p className="text-sm text-green-300 mb-6">{currentTraction.subtitle}</p>
            <div className="space-y-4">
              {currentTraction.metrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-3">
                  <metric.icon className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-semibold text-white">{metric.value}</div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-green-300 mt-4">{currentTraction.footer}</p>
          </div>

          {/* Forecasts */}
          <div className="bg-blue-900/20 border border-blue-400/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-2">{forecasts2025.title}</h3>
            <p className="text-sm text-blue-300 mb-6">{forecasts2025.subtitle}</p>
            <div className="space-y-4">
              {forecasts2025.metrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-3">
                  <metric.icon className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-semibold text-white">{metric.value}</div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-300 mt-4">{forecasts2025.footer}</p>
          </div>
        </div>

        {/* Revenue Clarification */}
        <div className="bg-gray-900/50 border border-yellow-400/20 rounded-xl p-8 mb-12">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">{revenueClarification.title}</h3>
          <p className="text-gray-300 mb-6">{revenueClarification.content}</p>
          <p className="text-sm text-yellow-300">{revenueClarification.footnote}</p>
          
          {/* Revenue Mix Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-yellow-400 font-semibold">Type</th>
                  <th className="px-4 py-3 text-center text-yellow-400 font-semibold">Share</th>
                  <th className="px-4 py-3 text-right text-yellow-400 font-semibold">ASP</th>
                </tr>
              </thead>
              <tbody>
                {revenueMix.map((row, index) => (
                  <tr key={index} className={index === revenueMix.length - 1 ? "bg-yellow-400/10 font-bold" : "border-t border-gray-700"}>
                    <td className="px-4 py-3 text-white">{row.type}</td>
                    <td className="px-4 py-3 text-center text-white">{row.share}</td>
                    <td className="px-4 py-3 text-right text-white">{row.asp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8">Milestones & Use of Funds</h3>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-yellow-400 font-semibold">{milestone.quarter}</span>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">Planned</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">{milestone.title}</h4>
                  <p className="text-gray-400">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use of Funds */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6">The $1.5M seed extends runway ~18 months to reach product-market validation milestones.</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-yellow-400 font-semibold">Use of Funds</th>
                  <th className="px-4 py-3 text-right text-yellow-400 font-semibold">Amount (USD)</th>
                  <th className="px-4 py-3 text-left text-yellow-400 font-semibold">Rationale / KPI</th>
                </tr>
              </thead>
              <tbody>
                {useOfFunds.map((item, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="px-4 py-3 text-white">{item.category}</td>
                    <td className="px-4 py-3 text-right text-white">${item.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300">{item.rationale}</td>
                  </tr>
                ))}
                <tr className="border-t border-yellow-400 bg-yellow-400/10 font-bold">
                  <td className="px-4 py-3 text-white">Total</td>
                  <td className="px-4 py-3 text-right text-white">$1,500,000</td>
                  <td className="px-4 py-3 text-white">Extends runway ~18 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Credibility Signals */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8">Credibility & Validation</h3>
          
          {/* Partners */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Partners / Pilot Verticals</h4>
            <div className="grid grid-cols-3 gap-4">
              {credibilitySignals.partners.map((partner, index) => (
                <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">{partner.logo}</div>
                  <div className="text-white font-semibold">{partner.name}</div>
                  <div className="text-gray-400 text-sm">{partner.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Beta User Quote</h4>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <blockquote className="text-gray-300 italic mb-4">"{credibilitySignals.testimonials[0].quote}"</blockquote>
              <cite className="text-yellow-400">— {credibilitySignals.testimonials[0].author}</cite>
            </div>
          </div>

          {/* Security Audit */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Security Audit</h4>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-2">
                <Shield className="w-6 h-6 text-yellow-400" />
                <span className="text-white font-semibold">Security audit scheduled with: {credibilitySignals.securityAudit.firm}</span>
                <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded">({credibilitySignals.securityAudit.scheduled})</span>
              </div>
              <p className="text-gray-400 text-sm">Audit scope: {credibilitySignals.securityAudit.scope}</p>
            </div>
          </div>
        </div>

        {/* Competitive Analysis */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8">Competitive Landscape</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-yellow-400 font-semibold">Company</th>
                  <th className="px-4 py-3 text-center text-yellow-400 font-semibold">AI-native</th>
                  <th className="px-4 py-3 text-center text-yellow-400 font-semibold">Privacy</th>
                  <th className="px-4 py-3 text-center text-yellow-400 font-semibold">Devices</th>
                  <th className="px-4 py-3 text-center text-yellow-400 font-semibold">Enterprise</th>
                  <th className="px-4 py-3 text-center text-yellow-400 font-semibold">Pricing</th>
                </tr>
              </thead>
              <tbody>
                {competitiveAnalysis.map((company, index) => (
                  <tr key={index} className={`border-t border-gray-700 ${company.company === 'TauOS' ? 'bg-yellow-400/10' : ''}`}>
                    <td className={`px-4 py-3 font-semibold ${company.company === 'TauOS' ? 'text-yellow-400' : 'text-white'}`}>
                      {company.company}
                    </td>
                    <td className="px-4 py-3 text-center text-white">{company.ai}</td>
                    <td className="px-4 py-3 text-center text-white">{company.privacy}</td>
                    <td className="px-4 py-3 text-center text-white">{company.devices}</td>
                    <td className="px-4 py-3 text-center text-white">{company.enterprise}</td>
                    <td className="px-4 py-3 text-center text-white">{company.pricing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Mitigation */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8">Risks & Mitigation</h3>
          <div className="space-y-6">
            {riskMitigation.map((risk, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-red-400 mb-2">{risk.risk}</h4>
                <p className="text-gray-300">
                  <span className="text-yellow-400 font-semibold">Mitigation:</span> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Projections Chart */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-8">5-Year Financial Projections (Base Case)</h3>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(financialProjections).map(([year, data]) => (
                <div key={year} className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">{year}</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-gray-400">Revenue</div>
                      <div className="text-lg font-semibold text-white">${data.revenue}M</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">EBITDA</div>
                      <div className="text-lg font-semibold text-white">${data.ebitda}M</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Units</div>
                      <div className="text-lg font-semibold text-white">{data.units}K</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Invest in the Future of Privacy?</h3>
          <p className="text-gray-300 mb-6">Join us in building the world's first Privacy-Native AI Operating System</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/output/updated_investor/TauOS_Investor_Deck.pdf"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Download Complete Investor Pack
            </a>
            <a
              href="mailto:investors@tauos.org"
              className="inline-flex items-center gap-2 border border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-200"
            >
              <ExternalLink className="w-5 h-5" />
              Contact Investment Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}