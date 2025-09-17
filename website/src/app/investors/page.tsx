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
  Info
} from 'lucide-react';

export default function InvestorsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(2025);

  // Financial data based on the Python script output
  const financialData = {
    2025: {
      totalRevenue: 65,
      deviceRevenue: 22.0,
      softwareRevenue: 43.0,
      ebitda: 2.6,
      ebitdaMargin: 4.0,
      taubookUnits: 20,
      tauphoneUnits: 35,
      valuation: {
        '5x': 13.0,
        '7x': 18.2,
        '10x': 26.0
      }
    },
    2026: {
      totalRevenue: 150,
      deviceRevenue: 50.4,
      softwareRevenue: 99.6,
      ebitda: 15.0,
      ebitdaMargin: 10.0,
      taubookUnits: 45,
      tauphoneUnits: 90,
      valuation: {
        '5x': 75.0,
        '7x': 105.0,
        '10x': 150.0
      }
    },
    2027: {
      totalRevenue: 300,
      deviceRevenue: 100.8,
      softwareRevenue: 199.2,
      ebitda: 45.0,
      ebitdaMargin: 15.0,
      taubookUnits: 90,
      tauphoneUnits: 175,
      valuation: {
        '5x': 225.0,
        '7x': 315.0,
        '10x': 450.0
      }
    },
    2028: {
      totalRevenue: 500,
      deviceRevenue: 168.0,
      softwareRevenue: 332.0,
      ebitda: 100.0,
      ebitdaMargin: 20.0,
      taubookUnits: 150,
      tauphoneUnits: 300,
      valuation: {
        '5x': 500.0,
        '7x': 700.0,
        '10x': 1000.0
      }
    },
    2029: {
      totalRevenue: 750,
      deviceRevenue: 252.0,
      softwareRevenue: 498.0,
      ebitda: 187.5,
      ebitdaMargin: 25.0,
      taubookUnits: 225,
      tauphoneUnits: 450,
      valuation: {
        '5x': 937.5,
        '7x': 1312.5,
        '10x': 1875.0
      }
    }
  };

  const years = [2025, 2026, 2027, 2028, 2029];
  const currentData = financialData[selectedYear as keyof typeof financialData];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Investors
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Tomorrow's Intelligence, Today — Powered by Tau OS
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span>2126 Market Street, San Francisco, CA 94114</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Founded 2024</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'financials', label: 'Financials', icon: DollarSign },
            { id: 'devices', label: 'Device Sales', icon: Smartphone },
            { id: 'valuation', label: 'Valuation', icon: TrendingUp },
            { id: 'scenarios', label: 'Scenarios', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">
                    ${currentData.totalRevenue}M
                  </span>
                </div>
                <div className="text-sm text-gray-400">Total Revenue {selectedYear}</div>
                <div className="text-xs text-green-400 mt-1">+{((currentData.totalRevenue - 65) / 65 * 100).toFixed(0)}% vs 2025</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">
                    {currentData.ebitdaMargin}%
                  </span>
                </div>
                <div className="text-sm text-gray-400">EBITDA Margin</div>
                <div className="text-xs text-green-400 mt-1">Improving efficiency</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-400">
                    {currentData.taubookUnits + currentData.tauphoneUnits}K
                  </span>
                </div>
                <div className="text-sm text-gray-400">Device Units Sold</div>
                <div className="text-xs text-blue-400 mt-1">TauBook + TauPhone</div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="w-8 h-8 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">
                    {currentData.softwareRevenue}M
                  </span>
                </div>
                <div className="text-sm text-gray-400">Software Revenue</div>
                <div className="text-xs text-purple-400 mt-1">Recurring revenue</div>
              </div>
            </div>

            {/* Business Model */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Business Model</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-yellow-400" />
                    Device Sales
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      TauBook: $1,099 (OEM: $650)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      TauPhone: $899 (OEM: $420)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      High-margin hardware business
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Software & Services
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      TauMail & TauCloud subscriptions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Enterprise MDM & OTA solutions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Recurring revenue model
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Competitive Advantages */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Competitive Advantages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Privacy-First</h4>
                  <p className="text-gray-400 text-sm">Zero telemetry, end-to-end encryption, local AI processing</p>
                </div>
                <div className="text-center">
                  <Lock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Enterprise Ready</h4>
                  <p className="text-gray-400 text-sm">MDM, OTA, compliance, self-hosted options</p>
                </div>
                <div className="text-center">
                  <Eye className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">Open Source</h4>
                  <p className="text-gray-400 text-sm">Transparent, auditable, community-driven development</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Financials Tab */}
        {activeTab === 'financials' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Year Selector */}
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedYear === year
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">
                Financial Summary - {selectedYear}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    ${currentData.totalRevenue}M
                  </div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    ${currentData.ebitda}M
                  </div>
                  <div className="text-sm text-gray-400">EBITDA</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    ${currentData.deviceRevenue}M
                  </div>
                  <div className="text-sm text-gray-400">Device Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    ${currentData.softwareRevenue}M
                  </div>
                  <div className="text-sm text-gray-400">Software Revenue</div>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown Chart */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Revenue Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Device Revenue</span>
                  <div className="flex items-center gap-4">
                    <div className="w-48 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-yellow-400 h-3 rounded-full" 
                        style={{ width: `${(currentData.deviceRevenue / currentData.totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold">${currentData.deviceRevenue}M</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Software Revenue</span>
                  <div className="flex items-center gap-4">
                    <div className="w-48 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-green-400 h-3 rounded-full" 
                        style={{ width: `${(currentData.softwareRevenue / currentData.totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-semibold">${currentData.softwareRevenue}M</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Device Sales Tab */}
        {activeTab === 'devices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Year Selector */}
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedYear === year
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Device Sales Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-yellow-400 flex items-center gap-2">
                  <Laptop className="w-6 h-6" />
                  TauBook Sales
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Units Sold</span>
                    <span className="text-2xl font-bold text-white">{currentData.taubookUnits}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Price per Unit</span>
                    <span className="text-lg font-semibold text-yellow-400">$1,099</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Revenue</span>
                    <span className="text-lg font-semibold text-green-400">
                      ${(currentData.taubookUnits * 1.099).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gross Margin</span>
                    <span className="text-lg font-semibold text-blue-400">40.8%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-yellow-400 flex items-center gap-2">
                  <Smartphone className="w-6 h-6" />
                  TauPhone Sales
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Units Sold</span>
                    <span className="text-2xl font-bold text-white">{currentData.tauphoneUnits}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Price per Unit</span>
                    <span className="text-lg font-semibold text-yellow-400">$899</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Revenue</span>
                    <span className="text-lg font-semibold text-green-400">
                      ${(currentData.tauphoneUnits * 0.899).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gross Margin</span>
                    <span className="text-lg font-semibold text-blue-400">53.3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Projection */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Growth Projection</h3>
              <div className="space-y-4">
                {years.map((year, index) => {
                  const data = financialData[year as keyof typeof financialData];
                  const prevData = index > 0 ? financialData[years[index - 1] as keyof typeof financialData] : null;
                  const growth = prevData ? ((data.totalRevenue - prevData.totalRevenue) / prevData.totalRevenue * 100) : 0;
                  
                  return (
                    <div key={year} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-white">{year}</span>
                        <span className="text-gray-400">
                          {data.taubookUnits + data.tauphoneUnits}K units
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-yellow-400">
                          ${data.totalRevenue}M
                        </span>
                        {growth > 0 && (
                          <span className="text-sm text-green-400 flex items-center gap-1">
                            <ArrowUpRight className="w-4 h-4" />
                            +{growth.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Valuation Tab */}
        {activeTab === 'valuation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Year Selector */}
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedYear === year
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Valuation Multiples */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">
                Valuation Multiples - {selectedYear}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(currentData.valuation).map(([multiple, value]) => (
                  <div key={multiple} className="text-center p-6 bg-gray-800/50 rounded-lg">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${value}M
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      {multiple} EBITDA Multiple
                    </div>
                    <div className="text-xs text-yellow-400">
                      Based on ${currentData.ebitda}M EBITDA
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DCF Analysis */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">DCF Analysis (Base Case)</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-white">Key Assumptions</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex justify-between">
                        <span>Discount Rate</span>
                        <span className="text-yellow-400">10%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Terminal Growth</span>
                        <span className="text-yellow-400">3%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>FCF Conversion</span>
                        <span className="text-yellow-400">70%</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-white">Implied Valuation</h4>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      $2.1B
                    </div>
                    <div className="text-sm text-gray-400">
                      Present Value of Free Cash Flows + Terminal Value
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Comparables */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Market Comparables</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-gray-300">Company</th>
                      <th className="text-left py-3 text-gray-300">Market Cap</th>
                      <th className="text-left py-3 text-gray-300">Revenue Multiple</th>
                      <th className="text-left py-3 text-gray-300">EBITDA Multiple</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-white">Apple</td>
                      <td className="py-3 text-gray-300">$3.2T</td>
                      <td className="py-3 text-gray-300">7.2x</td>
                      <td className="py-3 text-gray-300">18.5x</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-white">Microsoft</td>
                      <td className="py-3 text-gray-300">$2.8T</td>
                      <td className="py-3 text-gray-300">11.4x</td>
                      <td className="py-3 text-gray-300">22.1x</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-white">Google</td>
                      <td className="py-3 text-gray-300">$1.7T</td>
                      <td className="py-3 text-gray-300">6.8x</td>
                      <td className="py-3 text-gray-300">15.3x</td>
                    </tr>
                    <tr className="bg-yellow-400/10">
                      <td className="py-3 text-yellow-400 font-semibold">TauOS (2029)</td>
                      <td className="py-3 text-yellow-400 font-semibold">$1.9B</td>
                      <td className="py-3 text-yellow-400 font-semibold">2.5x</td>
                      <td className="py-3 text-yellow-400 font-semibold">10.0x</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Scenario Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-red-400">Bear Case</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">2029 Revenue</span>
                    <span className="text-red-400 font-semibold">$600M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">2029 EBITDA</span>
                    <span className="text-red-400 font-semibold">$90M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Valuation (10x)</span>
                    <span className="text-red-400 font-semibold">$900M</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Base Case</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">2029 Revenue</span>
                    <span className="text-yellow-400 font-semibold">$750M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">2029 EBITDA</span>
                    <span className="text-yellow-400 font-semibold">$188M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Valuation (10x)</span>
                    <span className="text-yellow-400 font-semibold">$1.9B</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-900/20 border border-green-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-green-400">Bull Case</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">2029 Revenue</span>
                    <span className="text-green-400 font-semibold">$1.1B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">2029 EBITDA</span>
                    <span className="text-green-400 font-semibold">$330M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Valuation (10x)</span>
                    <span className="text-green-400 font-semibold">$3.3B</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Key Risk Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Market Risks
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Competition from established players</li>
                    <li>• Market adoption of privacy-first solutions</li>
                    <li>• Economic downturn affecting device sales</li>
                    <li>• Regulatory changes in privacy laws</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-orange-400 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Operational Risks
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Supply chain disruptions</li>
                    <li>• Talent acquisition and retention</li>
                    <li>• Technology development delays</li>
                    <li>• Scaling manufacturing capacity</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Download Section */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-xl p-8 mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Download Financial Reports</h3>
            <p className="text-gray-300 mb-6">
              Access detailed financial models, projections, and investor materials
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                <Download className="w-4 h-4" />
                Financial Model (Excel)
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4" />
                Investor Deck (PDF)
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4" />
                Business Plan (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
