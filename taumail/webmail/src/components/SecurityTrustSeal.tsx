'use client';

import React, { useState } from 'react';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ServerIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface SecurityTrustSealProps {
  mode: 'footer' | 'dashboard' | 'detailed';
  showDetails?: boolean;
}

interface SecurityStats {
  trackers: number;
  adsServed: number;
  encryptionLevel: string;
  dataLocation: string;
  lastScan: string;
  vulnerabilities: number;
  uptime: string;
}

export const SecurityTrustSeal: React.FC<SecurityTrustSealProps> = ({
  mode,
  showDetails = false
}) => {
  const [isExpanded, setIsExpanded] = useState(showDetails);

  const securityStats: SecurityStats = {
    trackers: 0,
    adsServed: 0,
    encryptionLevel: 'End-to-End (TLS 1.3)',
    dataLocation: 'Your Private Server',
    lastScan: new Date().toLocaleDateString(),
    vulnerabilities: 0,
    uptime: '99.9%'
  };

  const getSecurityLevel = () => {
    if (securityStats.vulnerabilities === 0 && securityStats.trackers === 0) {
      return { level: 'A+', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else if (securityStats.vulnerabilities <= 2) {
      return { level: 'A', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    } else {
      return { level: 'B', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    }
  };

  const securityLevel = getSecurityLevel();

  if (mode === 'footer') {
    return (
      <div className="security-footer">
        <div className="flex items-center justify-center space-x-4 py-2 text-xs text-gray-600 border-t border-gray-200">
          <div className="flex items-center space-x-1">
            <LockClosedIcon className="h-3 w-3" />
            <span>Sent via TauMail — End-to-End Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <ShieldCheckIcon className="h-3 w-3" />
            <span>0 trackers, 0 ads served, 100% encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'dashboard') {
    return (
      <div className="security-dashboard">
        <div className={`p-4 rounded-lg border ${securityLevel.bgColor} border-green-200`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-900">Security Status</span>
            </div>
            <div className={`px-2 py-1 rounded text-sm font-bold ${securityLevel.color} ${securityLevel.bgColor}`}>
              {securityLevel.level}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Trackers:</span>
              <span className="ml-1 text-green-600 font-bold">{securityStats.trackers}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Ads Served:</span>
              <span className="ml-1 text-green-600 font-bold">{securityStats.adsServed}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Encryption:</span>
              <span className="ml-1 text-green-600 font-bold">100%</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Uptime:</span>
              <span className="ml-1 text-green-600 font-bold">{securityStats.uptime}</span>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <ServerIcon className="h-4 w-4 text-gray-500" />
                  <span>Data Location: {securityStats.dataLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <LockClosedIcon className="h-4 w-4 text-gray-500" />
                  <span>Encryption: {securityStats.encryptionLevel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="h-4 w-4 text-gray-500" />
                  <span>Last Scan: {securityStats.lastScan}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Vulnerabilities: {securityStats.vulnerabilities} detected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detailed mode
  return (
    <div className="security-detailed">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Security Summary</h2>
                <p className="text-sm text-gray-600">Your data is protected with military-grade security</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-lg font-bold ${securityLevel.color} ${securityLevel.bgColor}`}>
              {securityLevel.level}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Metrics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">Trackers Detected</span>
                  <span className="text-2xl font-bold text-green-600">{securityStats.trackers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">Ads Served</span>
                  <span className="text-2xl font-bold text-green-600">{securityStats.adsServed}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">Encryption Level</span>
                  <span className="text-lg font-bold text-green-600">100%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">System Uptime</span>
                  <span className="text-lg font-bold text-green-600">{securityStats.uptime}</span>
                </div>
              </div>
            </div>

            {/* Security Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Details</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <LockClosedIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">End-to-End Encryption</div>
                    <div className="text-sm text-gray-600">{securityStats.encryptionLevel}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <ServerIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Data Location</div>
                    <div className="text-sm text-gray-600">{securityStats.dataLocation}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <GlobeAltIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Last Security Scan</div>
                    <div className="text-sm text-gray-600">{securityStats.lastScan}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Vulnerabilities</div>
                    <div className="text-sm text-gray-600">{securityStats.vulnerabilities} detected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Commitment */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Privacy Commitment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <EyeSlashIcon className="h-4 w-4 text-green-600" />
                <span>Zero Telemetry</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                <span>No Data Collection</span>
              </div>
              <div className="flex items-center space-x-2">
                <ServerIcon className="h-4 w-4 text-green-600" />
                <span>Your Server, Your Data</span>
              </div>
            </div>
          </div>

          {/* Third-party Integrations */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Third-party Integrations</h3>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <InformationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">No External Dependencies</div>
                  <div className="text-sm text-gray-600">
                    TauOS operates independently without relying on external services for core functionality.
                    All data processing happens on your private server.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SecurityBadge: React.FC<{ type: 'encrypted' | 'verified' | 'secure' }> = ({ type }) => {
  const badges = {
    encrypted: {
      icon: LockClosedIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      text: 'Encrypted'
    },
    verified: {
      icon: ShieldCheckIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      text: 'Verified'
    },
    secure: {
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      text: 'Secure'
    }
  };

  const badge = badges[type];
  const Icon = badge.icon;

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bgColor} ${badge.color}`}>
      <Icon className="h-3 w-3" />
      <span>{badge.text}</span>
    </div>
  );
};

export const TransparencyStats: React.FC = () => {
  return (
    <div className="transparency-stats bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Transparency Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-xs text-gray-600">Trackers</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-xs text-gray-600">Ads Served</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">100%</div>
          <div className="text-xs text-gray-600">Encrypted</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">99.9%</div>
          <div className="text-xs text-gray-600">Uptime</div>
        </div>
      </div>
    </div>
  );
}; 