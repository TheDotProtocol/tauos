'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  Activity,
  Users,
  Settings,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  Clock,
  Bell,
  User,
  ChevronRight,
  ChevronDown,
  Play,
  MoreHorizontal,
  X,
  Check,
  Info,
  AlertTriangle,
  Zap,
  Key,
  Database,
  Server,
  Globe,
  Network,
  HardDrive,
  Cpu,
  Battery,
  Wifi,
  Signal,
  MapPin,
  FileText,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  XCircle as XCircleIcon,
  BarChart3 as BarChart3Icon,
  Activity as ActivityIcon,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Plus as PlusIcon,
  Edit3 as Edit3Icon,
  Trash2 as Trash2Icon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  RefreshCw as RefreshCwIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Bell as BellIcon,
  User as UserIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon,
  MoreHorizontal as MoreHorizontalIcon,
  X as XIcon,
  Check as CheckIcon,
  Info as InfoIcon,
  AlertTriangle as WarningIcon,
  Zap as ZapIcon,
  Key as KeyIcon,
  Database as DatabaseIcon,
  Server as ServerIcon,
  Globe as GlobeIcon,
  Network as NetworkIcon,
  HardDrive as HardDriveIcon,
  Cpu as CpuIcon,
  Battery as BatteryIcon,
  Wifi as WifiIcon,
  Signal as SignalIcon,
  MapPin as MapPinIcon,
  FileText as FileTextIcon
} from 'lucide-react';

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [securityMetrics, setSecurityMetrics] = useState({
    overallScore: 0,
    complianceRate: 0,
    activeThreats: 0,
    lastScan: 'Live API',
    devicesProtected: 0,
    policiesActive: 0,
  });

  const [complianceFrameworks, setComplianceFrameworks] = useState([
    {
      id: '1',
      name: 'GDPR',
      status: 'in_progress',
      score: 0,
      lastAudit: '—',
      nextAudit: '—',
      requirements: 6,
      met: 0,
      pending: 6,
    },
  ]);

  useEffect(() => {
    fetch('/api/enterprise/compliance-status')
      .then((r) => r.json())
      .then((data) => {
        if (data.frameworks) setComplianceFrameworks(data.frameworks);
        if (data.overallScore) {
          setSecurityMetrics((m) => ({
            ...m,
            overallScore: data.overallScore,
            complianceRate: Math.round((data.implementedControls / data.totalControls) * 100),
          }));
        }
      })
      .catch(() => {});
  }, []);

  const securityEvents: Array<{
    id: string;
    type: string;
    severity: string;
    description: string;
    device: string;
    location: string;
    timestamp: string;
    status: string;
    risk: string;
  }> = [];

  // Audit trails — populated from audit_log post-beta SIEM
  const auditTrails: Array<{
    id: string;
    action: string;
    user: string;
    resource: string;
    timestamp: string;
    ip: string;
    status: string;
  }> = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-400 bg-green-400/10';
      case 'in_progress': return 'text-yellow-400 bg-yellow-400/10';
      case 'non_compliant': return 'text-red-400 bg-red-400/10';
      case 'investigating': return 'text-yellow-400 bg-yellow-400/10';
      case 'resolved': return 'text-green-400 bg-green-400/10';
      case 'contained': return 'text-orange-400 bg-orange-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'success': return 'text-green-400 bg-green-400/10';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <MarketingPageShell
      title="Enterprise Security"
      subtitle="Compliance, threat monitoring, and audit controls for TAU CORE™ deployments."
      hero={false}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Security Score</p>
                <p className="text-3xl font-bold text-white">{securityMetrics.overallScore}/100</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${securityMetrics.overallScore}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Compliance Rate</p>
                <p className="text-3xl font-bold text-white">{securityMetrics.complianceRate}%</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>All frameworks compliant</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Threats</p>
                <p className="text-3xl font-bold text-white">{securityMetrics.activeThreats}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-yellow-400">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>2 being investigated</span>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'compliance', label: 'Compliance', icon: CheckCircle },
            { id: 'threats', label: 'Threats', icon: AlertCircle },
            { id: 'audit', label: 'Audit Trail', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  TauOS Enterprise Security
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Advanced security monitoring and threat protection for enterprise environments. 
                  Comprehensive compliance and audit tools to keep your organization secure.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                    <Download className="w-4 h-4" />
                    Start Free Trial
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 border border-yellow-400 text-yellow-400 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-200">
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <Shield className="w-12 h-12 text-green-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-white">Threat Detection</h3>
                  <p className="text-gray-400">
                    Real-time threat monitoring and AI-powered security analysis to detect and prevent attacks.
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <CheckCircle className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-white">Compliance Management</h3>
                  <p className="text-gray-400">
                    Automated compliance monitoring for GDPR, HIPAA, SOC 2, and other regulatory requirements.
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <FileText className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-white">Audit Trail</h3>
                  <p className="text-gray-400">
                    Comprehensive logging and audit trails for complete security event tracking and analysis.
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <Lock className="w-12 h-12 text-red-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-white">Access Control</h3>
                  <p className="text-gray-400">
                    Role-based access control and identity management for secure user authentication.
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <Activity className="w-12 h-12 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-white">Security Analytics</h3>
                  <p className="text-gray-400">
                    Advanced analytics and reporting to track security metrics and identify trends.
                  </p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <Zap className="w-12 h-12 text-orange-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-white">Incident Response</h3>
                  <p className="text-gray-400">
                    Automated incident response and security workflow automation for rapid threat mitigation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Security Events */}
                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Recent Security Events</h3>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
                  </div>
                  <div className="space-y-4">
                    {securityEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getRiskColor(event.risk).replace('text-', 'bg-')}`}></div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{event.description}</p>
                          <p className="text-gray-400 text-xs">{event.device} • {event.timestamp}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-700/50 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2">
                        <RefreshCw className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">Run Security Scan</p>
                      <p className="text-gray-400 text-xs">Scan all devices</p>
                    </button>
                    <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-700/50 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-2">
                        <Download className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">Export Report</p>
                      <p className="text-gray-400 text-xs">Generate compliance report</p>
                    </button>
                    <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-700/50 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-2">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">Update Policies</p>
                      <p className="text-gray-400 text-xs">Modify security policies</p>
                    </button>
                    <button className="p-4 bg-gray-800/50 rounded-lg text-left hover:bg-gray-700/50 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white text-sm font-medium">User Access</p>
                      <p className="text-gray-400 text-xs">Manage permissions</p>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Compliance Frameworks</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                  <Plus className="w-4 h-4" />
                  <span>Add Framework</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complianceFrameworks.map((framework) => (
                  <div key={framework.id} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{framework.name}</h3>
                        <p className="text-gray-400 text-sm">Compliance Framework</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(framework.status)}`}>
                        {framework.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Compliance Score</span>
                        <span className="text-white font-semibold">{framework.score}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            framework.score >= 90 ? 'bg-green-500' : 
                            framework.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${framework.score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-400">Requirements</p>
                        <p className="text-white font-semibold">{framework.requirements}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Met</p>
                        <p className="text-green-400 font-semibold">{framework.met}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Pending</p>
                        <p className="text-yellow-400 font-semibold">{framework.pending}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Next Audit</p>
                        <p className="text-white font-semibold">{framework.nextAudit}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 transition-colors">
                        Generate Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'threats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Security Threats</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search threats..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50"
                    />
                  </div>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {securityEvents.map((event) => (
                  <div key={event.id} className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          event.severity === 'critical' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                          event.severity === 'high' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                          event.severity === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}>
                          <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-white">{event.description}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                              {event.severity}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">Device: {event.device}</p>
                          <p className="text-gray-400 text-sm mb-2">Location: {event.location}</p>
                          <p className="text-gray-500 text-sm">{event.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getRiskColor(event.risk)}`}>
                          Risk: {event.risk}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Audit Trail</h2>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                    <Download className="w-4 h-4" />
                    <span>Export Logs</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Action</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Resource</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">IP Address</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Timestamp</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {auditTrails.map((audit) => (
                        <tr key={audit.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{audit.action}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{audit.user}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{audit.resource}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{audit.ip}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{audit.timestamp}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                              {audit.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </MarketingPageShell>
  );
}
