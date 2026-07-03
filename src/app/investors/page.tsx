'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
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
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function InvestorsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [financialData, setFinancialData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInvestorData = async () => {
      try {
        // Load financial data
        const financialResponse = await fetch('/api/investors/financials');
        const financialData = await financialResponse.json();
        if (financialData.success) {
          setFinancialData(financialData.data);
        }

        // Load metrics
        const metricsResponse = await fetch('/api/investors/metrics');
        const metricsData = await metricsResponse.json();
        if (metricsData.success) {
          setMetrics(metricsData.metrics);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load investor data:', error);
        setIsLoading(false);
      }
    };

    loadInvestorData();
  }, []);

  // Executive TL;DR - Key highlights
  const executiveTLDR = {
    tagline: "Tomorrow's Intelligence, Today - Powered by Tau OS.",
    keyPoints: [
      "Raise: $1.5M Seed Round — extends runway ~18 months to key milestones.",
      "Target: IPO (NASDAQ/NYSE) 2029–2030; $1B+ IPO target.",
      "Blended Device ASP: ~$400 (combination of OEM licensing + direct retail).",
      "2026 Forecast (projection): $43M revenue; 55,000 units forecast.",
      "Why Invest: Privacy-native AI + hybrid OS + hardware stack = scalable recurring SaaS + device margins."
    ]
  };

  // Leadership Team
  const leadershipTeam = [
    {
      name: "Saleena Thamani",
      role: "Chief Executive Officer",
      description: "Visionary leader with enterprise systems and blockchain expertise"
    },
    {
      name: "Kelsey Morgan", 
      role: "Chief Technology Officer",
      description: "Technical architect driving AI-native OS development"
    },
    {
      name: "Rudra Narayanan",
      role: "Head of Business & Strategy", 
      description: "Strategic partnerships and go-to-market execution"
    },
    {
      name: "Timothy Burton",
      role: "Chairman",
      description: "Industry veteran providing strategic guidance"
    }
  ];

  // Use of Funds
  const useOfFunds = [
    { category: "Product R&D & Engineering", amount: 500000, percentage: 33 },
    { category: "Manufacturing samples & tooling", amount: 300000, percentage: 20 },
    { category: "Security Audit & Compliance", amount: 100000, percentage: 7 },
    { category: "Sales & BD (enterprise)", amount: 200000, percentage: 13 },
    { category: "Marketing & Pre-order Campaign", amount: 150000, percentage: 10 },
    { category: "Legal, IP & Ops", amount: 100000, percentage: 7 },
    { category: "Contingency", amount: 150000, percentage: 10 }
  ];

  // Key Milestones
  const milestones = [
    { quarter: "Q1-Q2 2026", milestone: "Ship 5,000 TauBooks (pilot)" },
    { quarter: "Q3 2026", milestone: "Launch TauCloud beta + public SDK" },
    { quarter: "Q4 2026", milestone: "Complete security audit; sign 2 MDM enterprise contracts" },
    { quarter: "2027", milestone: "Mass production ramp; 55k units sold; $65M run-rate" }
  ];

  // Financial Summary
  const financialSummary = {
    "2026": { revenue: 43, device: 23, software: 15, enterprise: 5 },
    "2030": { revenue: 750, device: 400, software: 300, enterprise: 50 }
  };

  return (
    <MarketingPageShell
      title="Investors"
      subtitle="Tau Core Inc. — building the TAU CORE platform."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
          >
            Tau OS Investor Hub
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Tomorrow's Intelligence, Today - Powered by Tau OS.
          </motion.p>
        </div>

        {/* Executive TL;DR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">Executive TL;DR</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {executiveTLDR.keyPoints.slice(0, 3).map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-100">{point}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {executiveTLDR.keyPoints.slice(3).map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-100">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4 text-red-400">The Problem</h3>
            <p className="text-gray-300">
              Large incumbents monetize users' data. AI is cloud-dependent and privacy-invasive. 
              Enterprises need compliant, AI-enabled OS that protects users and scales.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4 text-green-400">The Solution: Tau OS</h3>
            <p className="text-gray-300 mb-4">
              Tau OS is the world's first <strong>AI-native, privacy-first hybrid OS</strong> across devices and cloud.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">TauAI — Local, privacy-preserving assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">TauVision — On-device visual intelligence</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">TauGuard — AI-first threat protection</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leadership Team */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((member, index) => (
              <div key={index} className="bg-gray-900 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{member.name}</h3>
                <p className="text-yellow-400 font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-gray-400">{member.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Financial Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Financial Summary</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-6 text-green-400">2026 Projection</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Revenue</span>
                  <span className="text-2xl font-bold text-white">$43M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Device Revenue</span>
                  <span className="text-xl text-white">$23M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Software & Cloud</span>
                  <span className="text-xl text-white">$15M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Enterprise</span>
                  <span className="text-xl text-white">$5M</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-6 text-blue-400">5-Year Target (2030)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Revenue</span>
                  <span className="text-2xl font-bold text-white">$750M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Device Revenue</span>
                  <span className="text-xl text-white">$400M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Software & Cloud</span>
                  <span className="text-xl text-white">$300M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Enterprise</span>
                  <span className="text-xl text-white">$50M</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Use of Funds */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Use of Funds (Seed $1.5M)</h2>
          <div className="bg-gray-900 rounded-xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {useOfFunds.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">{item.category}</span>
                  <div className="text-right">
                    <div className="text-white font-semibold">${(item.amount / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-400">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Milestones */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Key Milestones</h2>
          <div className="bg-gray-900 rounded-xl p-8">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-yellow-400 font-semibold">{milestone.quarter}</div>
                    <div className="text-gray-300">{milestone.milestone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Download Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Download Investor Materials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a 
              href="/Tau OS_Investor_Deck.pdf" 
              download
              className="bg-white text-black px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Investor Deck (PDF)</span>
            </a>
            <a 
              href="/Tau OS_Financial_Model.xlsx" 
              download
              className="bg-white text-black px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Financial Model (Excel)</span>
            </a>
            <a 
              href="/Tau OS_Investor_Snapshot.pdf" 
              download
              className="bg-white text-black px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Investor Snapshot (PDF)</span>
            </a>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Invest?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join us in building the future of privacy-native AI operating systems. 
            Schedule a call with our leadership team to learn more about investment opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:investors@tauos.org"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Investors</span>
            </a>
            <a 
              href="mailto:investors@tauos.org?subject=Schedule Investor Call"
              className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule Call</span>
            </a>
          </div>
        </motion.div>

        {/* Company Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16 pt-8 border-t border-gray-800 text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">AR Holdings Group Corporation — Tau Core Inc. / Tau Core Inc.</span>
          </div>
          <p className="text-gray-500">2126 Market Street, San Francisco, CA 94114, USA</p>
        </motion.div>
      </div>
    </MarketingPageShell>
  );
}
