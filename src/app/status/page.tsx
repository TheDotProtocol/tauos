'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { motion } from 'framer-motion';
import {
  Activity, CheckCircle, XCircle, AlertTriangle, Clock, Server, Globe, Shield,
  ArrowRight, ExternalLink, RefreshCw, Zap, Lock, Users, Monitor
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // Mock status data - in production, this would come from an API
  const services = [
    {
      name: "Tau OS Website",
      status: "operational",
      uptime: "99.9%",
      responseTime: "45ms",
      description: "Main website and landing pages"
    },
    {
      name: "TauMail Service",
      status: "operational",
      uptime: "99.8%",
      responseTime: "120ms",
      description: "Email service and @tauos.org accounts"
    },
    {
      name: "TauCloud Storage",
      status: "operational",
      uptime: "99.7%",
      responseTime: "200ms",
      description: "Encrypted cloud storage and file sync"
    },
    {
      name: "TauID Identity",
      status: "operational",
      uptime: "99.9%",
      responseTime: "80ms",
      description: "Decentralized identity management"
    },
    {
      name: "TauStore Marketplace",
      status: "operational",
      uptime: "99.6%",
      responseTime: "150ms",
      description: "App marketplace and distribution"
    },
    {
      name: "TauBrowser",
      status: "operational",
      uptime: "99.8%",
      responseTime: "90ms",
      description: "Privacy-first web browser"
    },
    {
      name: "Database Services",
      status: "operational",
      uptime: "99.9%",
      responseTime: "25ms",
      description: "PostgreSQL and data storage"
    },
    {
      name: "API Gateway",
      status: "operational",
      uptime: "99.8%",
      responseTime: "60ms",
      description: "API routing and authentication"
    }
  ];

  const incidents = [
    {
      title: "Scheduled Maintenance - Database Optimization",
      status: "scheduled",
      date: "2025-09-15 02:00 UTC",
      description: "Planned maintenance to optimize database performance. Expected downtime: 30 minutes."
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'outage':
        return 'text-red-400';
      case 'scheduled':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <MarketingPageShell
      title="System Status"
      subtitle="Live status for Tau Core Inc. services."
    >
      {/* Overall Status */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <CheckCircle className="w-12 h-12 text-green-400" />
                <h2 className="text-4xl font-bold text-white">All Systems Operational</h2>
              </div>
              <p className="text-xl text-gray-300 mb-6">
                All Tau OS services are running normally with excellent performance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">99.8%</div>
                  <div className="text-gray-400">Overall Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">45ms</div>
                  <div className="text-gray-400">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">0</div>
                  <div className="text-gray-400">Active Incidents</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Server className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Service Status
              </span>
            </h2>
            <div className="flex items-center justify-center space-x-4">
              <p className="text-gray-300">Last updated: {lastUpdated.toLocaleString()}</p>
              <button
                onClick={refreshStatus}
                disabled={isRefreshing}
                className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  </div>
                  <span className={`text-sm font-semibold ${getStatusColor(service.status)}`}>
                    {service.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4">{service.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-white ml-2">{service.uptime}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Response:</span>
                    <span className="text-white ml-2">{service.responseTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Incidents Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Incidents & Maintenance
              </span>
            </h2>
          </motion.div>

          {incidents.length > 0 ? (
            <div className="space-y-6">
              {incidents.map((incident, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(incident.status)}
                      <h3 className="text-xl font-bold text-white">{incident.title}</h3>
                    </div>
                    <span className={`text-sm font-semibold ${getStatusColor(incident.status)}`}>
                      {incident.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2">{incident.description}</p>
                  <p className="text-sm text-gray-400">Scheduled for: {incident.date}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-2xl mx-auto">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Active Incidents</h3>
                <p className="text-gray-300">All systems are running smoothly with no reported issues.</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Activity className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Performance Metrics
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Availability",
                value: "99.8%",
                description: "Uptime across all regions"
              },
              {
                icon: Zap,
                title: "Response Time",
                value: "45ms",
                description: "Average API response time"
              },
              {
                icon: Users,
                title: "Active Users",
                value: "2.5K",
                description: "Concurrent users online"
              },
              {
                icon: Shield,
                title: "Security Score",
                value: "A+",
                description: "SSL Labs security rating"
              }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 text-center"
              >
                <metric.icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{metric.title}</h3>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{metric.value}</div>
                <p className="text-gray-300 text-sm">{metric.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <Monitor className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Status Notifications
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Stay informed about service status and incidents. Subscribe to notifications.
            </p>
            
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Email Notifications</h3>
                  <p className="text-gray-300 mb-2">Get notified about incidents and maintenance</p>
                  <p className="text-gray-300 mb-4">Email: <a href="mailto:status@tauos.org" className="text-yellow-400 hover:text-yellow-300">status@tauos.org</a></p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">RSS Feed</h3>
                  <p className="text-gray-300 mb-2">Subscribe to our status RSS feed</p>
                  <p className="text-gray-300 mb-4">URL: <a href="/status.rss" className="text-yellow-400 hover:text-yellow-300">status.tauos.org/rss</a></p>
                </div>
              </div>
            </div>

            <a
              href="mailto:status@tauos.org"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              <Monitor className="w-5 h-5" />
              <span>Subscribe to Updates</span>
            </a>
          </motion.div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
