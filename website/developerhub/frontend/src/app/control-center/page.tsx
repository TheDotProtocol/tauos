'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Home, 
  Mail, 
  Cloud, 
  Shield, 
  Brain, 
  Settings, 
  Users, 
  FileText,
  Calendar,
  Bell,
  Star,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function ControlCenter() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data for general users
  const stats = [
    {
      title: 'My Projects',
      value: '8',
      change: '+2 this month',
      changeType: 'positive' as const,
      icon: Home,
      description: 'Active projects'
    },
    {
      title: 'Emails',
      value: '24',
      change: '+5 today',
      changeType: 'positive' as const,
      icon: Mail,
      description: 'Unread messages'
    },
    {
      title: 'Storage Used',
      value: '2.4 GB',
      change: '+0.3 GB this week',
      changeType: 'neutral' as const,
      icon: Cloud,
      description: 'Of 10 GB total'
    },
    {
      title: 'Security Score',
      value: '98%',
      change: '+2% this week',
      changeType: 'positive' as const,
      icon: Shield,
      description: 'Privacy protection'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'email',
      title: 'New email from Sarah',
      description: 'Project proposal for mobile app',
      time: '2 minutes ago',
      icon: Mail,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'project',
      title: 'Project "Website Redesign" updated',
      description: 'New files uploaded to TauCloud',
      time: '1 hour ago',
      icon: Cloud,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'ai',
      title: 'TauAI completed analysis',
      description: 'Code review finished for mobile app',
      time: '3 hours ago',
      icon: Brain,
      color: 'text-purple-500'
    },
    {
      id: 4,
      type: 'security',
      title: 'Security scan completed',
      description: 'No threats detected in your projects',
      time: '1 day ago',
      icon: Shield,
      color: 'text-green-500'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Start a new project with templates',
      icon: Plus,
      color: 'from-yellow-400 to-orange-500',
      href: '/projects/new',
      internal: true
    },
    {
      title: 'Check Email',
      description: 'View your TauMail inbox',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      href: 'https://tauos.org/taumail',
      internal: false
    },
    {
      title: 'Access Files',
      description: 'Open your TauCloud storage',
      icon: Cloud,
      color: 'from-green-500 to-emerald-500',
      href: 'https://tauos.org/taucloud',
      internal: false
    },
    {
      title: 'Ask TauAI',
      description: 'Get help from AI assistant',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      href: 'https://tauos.org/tauai',
      internal: false
    }
  ];

  const ecosystemApps = [
    {
      name: 'TauMail',
      description: 'Private email with end-to-end encryption',
      status: 'active',
      icon: Mail,
      color: 'bg-blue-500',
      href: '/taumail'
    },
    {
      name: 'TauCloud',
      description: 'Secure cloud storage and file sharing',
      status: 'active',
      icon: Cloud,
      color: 'bg-green-500',
      href: '/taucloud'
    },
    {
      name: 'TauAI',
      description: 'AI assistant for productivity and creativity',
      status: 'active',
      icon: Brain,
      color: 'bg-purple-500',
      href: '/tauai'
    },
    {
      name: 'TauID',
      description: 'Decentralized identity management',
      status: 'beta',
      icon: Shield,
      color: 'bg-orange-500',
      href: '/tauid'
    },
    {
      name: 'TauStore',
      description: 'Privacy-first app marketplace',
      status: 'coming-soon',
      icon: Star,
      color: 'bg-yellow-500',
      href: '/taustore'
    },
    {
      name: 'TauBrowser',
      description: 'Privacy-focused web browser',
      status: 'coming-soon',
      icon: FileText,
      color: 'bg-indigo-500',
      href: '/taubrowser'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to TauCore™ Control Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your personal command center for privacy-first productivity and creativity.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <a
                        key={index}
                        href={action.href}
                        target={action.internal ? undefined : '_blank'}
                        rel={action.internal ? undefined : 'noopener noreferrer'}
                        className="group p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:border-yellow-400/50"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <action.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {action.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 ${activity.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                          <activity.icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium">
                    View all activity
                  </button>
                </div>
              </div>
            </div>

            {/* Ecosystem Apps */}
            <div className="mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    TauCore™ Ecosystem
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your privacy-first productivity suite
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ecosystemApps.map((app, index) => (
                    <a
                      key={index}
                      href={app.href}
                      className="group p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:border-yellow-400/50"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${app.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <app.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                              {app.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              app.status === 'active' 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                                : app.status === 'beta'
                                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                            }`}>
                              {app.status === 'active' ? 'Active' : 
                               app.status === 'beta' ? 'Beta' : 'Coming Soon'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {app.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Getting Started with TauCore™
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      New to TauCore™? Follow our quick setup guide to get the most out of your privacy-first experience.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                        Start Setup Guide
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        Watch Tutorial
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
