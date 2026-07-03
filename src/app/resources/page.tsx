'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  FileText,
  Code,
  BookOpen,
  Shield,
  Users,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Globe,
  Lock,
  Zap,
  Brain,
  Database,
  Server,
  Smartphone,
  Monitor,
  Laptop
} from 'lucide-react';

export default function ResourceCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredDocs, setFilteredDocs] = useState([]);

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen, count: 0 },
    { id: 'developer', name: 'Developer', icon: Code, count: 0 },
    { id: 'api', name: 'API Documentation', icon: Database, count: 0 },
    { id: 'security', name: 'Security', icon: Shield, count: 0 },
    { id: 'business', name: 'Business', icon: Users, count: 0 },
    { id: 'technical', name: 'Technical', icon: Server, count: 0 }
  ];

  const documents = [
    {
      id: 'developer-guide',
      title: 'Tau OS Developer Guide',
      description: 'Complete guide for developers building on Tau OS platform',
      category: 'developer',
      type: 'PDF',
      size: '2.4 MB',
      downloads: 1247,
      rating: 4.8,
      lastUpdated: '2025-01-20',
      icon: Code,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      downloadUrl: '/downloads/Tau OS_Developer_Guide.pdf'
    },
    {
      id: 'api-guide',
      title: 'API Documentation',
      description: 'Comprehensive API reference for all Tau OS services',
      category: 'api',
      type: 'PDF',
      size: '1.8 MB',
      downloads: 892,
      rating: 4.9,
      lastUpdated: '2025-01-20',
      icon: Database,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      downloadUrl: '/downloads/Tau OS_API_Guide.pdf'
    },
    {
      id: 'soc-audit',
      title: 'SOC 2 & SOC 3 Audit Report',
      description: 'Security and compliance audit report for enterprise customers',
      category: 'security',
      type: 'PDF',
      size: '3.2 MB',
      downloads: 456,
      rating: 4.7,
      lastUpdated: '2025-01-20',
      icon: Shield,
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      downloadUrl: '/downloads/Tau OS_SOC_Audit_Report.pdf'
    },
    {
      id: 'swot-analysis',
      title: 'SWOT Analysis',
      description: 'Strategic analysis of Tau OS market position and opportunities',
      category: 'business',
      type: 'Excel',
      size: '1.1 MB',
      downloads: 234,
      rating: 4.6,
      lastUpdated: '2025-01-20',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      downloadUrl: '/downloads/Tau OS_SWOT_Analysis.xlsx'
    },
    {
      id: 'system-architecture',
      title: 'System Architecture',
      description: 'Technical architecture documentation and system design',
      category: 'technical',
      type: 'PDF',
      size: '4.1 MB',
      downloads: 678,
      rating: 4.8,
      lastUpdated: '2025-01-20',
      icon: Server,
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
      downloadUrl: '/downloads/Tau OS_System_Architecture.pdf'
    },
    {
      id: 'contributor-guide',
      title: 'Contributor Guidelines',
      description: 'How to contribute to Tau OS open source project',
      category: 'developer',
      type: 'PDF',
      size: '1.5 MB',
      downloads: 345,
      rating: 4.7,
      lastUpdated: '2025-01-20',
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20',
      downloadUrl: '/downloads/Tau OS_Contributor_Guide.pdf'
    },
    {
      id: 'privacy-whitepaper',
      title: 'Privacy Whitepaper',
      description: 'Deep dive into Tau OS privacy-first architecture',
      category: 'security',
      type: 'PDF',
      size: '2.8 MB',
      downloads: 567,
      rating: 4.9,
      lastUpdated: '2025-01-20',
      icon: Lock,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/20',
      downloadUrl: '/downloads/Tau OS_Privacy_Whitepaper.pdf'
    },
    {
      id: 'mobile-development',
      title: 'Mobile Development Guide',
      description: 'Building mobile applications for Tau OS platform',
      category: 'developer',
      type: 'PDF',
      size: '2.2 MB',
      downloads: 289,
      rating: 4.5,
      lastUpdated: '2025-01-20',
      icon: Smartphone,
      color: 'text-pink-400',
      bg: 'bg-pink-500/20',
      downloadUrl: '/downloads/Tau OS_Mobile_Development.pdf'
    }
  ];

  // Calculate category counts
  useEffect(() => {
    const counts = categories.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? documents.length : documents.filter(doc => doc.category === cat.id).length
    }));
    setFilteredDocs(documents);
  }, []);

  // Filter documents
  useEffect(() => {
    let filtered = documents;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDocs(filtered);
  }, [searchQuery, selectedCategory]);

  const handleDownload = (doc) => {
    // Track download
    console.log(`Downloading: ${doc.title}`);
    // In production, this would track analytics
  };

  return (
    <MarketingPageShell
      title="Resources"
      subtitle="Documentation, downloads, and learning materials."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Resource Center
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Comprehensive documentation, guides, and resources for developers, 
            businesses, and contributors building on the Tau OS platform.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Results count */}
          <p className="text-gray-400">
            Showing {filteredDocs.length} of {documents.length} resources
          </p>
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDocs.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-yellow-400/30 transition-all duration-300 group"
            >
              {/* Document Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${doc.bg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <doc.icon className={`w-6 h-6 ${doc.color}`} />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                    {doc.type}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {doc.size}
                  </span>
                </div>
              </div>

              {/* Document Info */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                {doc.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {doc.description}
              </p>

              {/* Document Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{doc.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{doc.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{doc.lastUpdated}</span>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(doc)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200 group"
              >
                <Download className="w-4 h-4" />
                <span>Download {doc.type}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredDocs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gray-900/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/developers"
              className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <Code className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Developer Portal</h3>
                <p className="text-sm text-gray-400">Start building</p>
              </div>
            </a>
            <a
              href="/api"
              className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <Database className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">API Reference</h3>
                <p className="text-sm text-gray-400">Explore APIs</p>
              </div>
            </a>
            <a
              href="/security"
              className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <Shield className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors">Security</h3>
                <p className="text-sm text-gray-400">Learn more</p>
              </div>
            </a>
            <a
              href="/support"
              className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <Users className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Support</h3>
                <p className="text-sm text-gray-400">Get help</p>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </MarketingPageShell>
  );
}
