'use client';

import { useState } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Lock,
  Unlock,
  Download,
  ExternalLink
} from 'lucide-react';

interface EULAAcceptanceProps {
  onAccept: (accepted: boolean, privacyLevel: string) => void;
  onBack: () => void;
}

export default function EULAAcceptance({ onAccept, onBack }: EULAAcceptanceProps) {
  const [accepted, setAccepted] = useState(false);
  const [showFullEULA, setShowFullEULA] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState('balanced');

  const privacyLevels = [
    {
      id: 'maximum',
      name: 'Maximum Privacy',
      description: 'No system monitoring, complete privacy protection',
      icon: Lock,
      color: 'text-green-600 bg-green-100',
      features: [
        'No system monitoring',
        'Complete privacy protection',
        'No data collection',
        'Zero telemetry'
      ],
      recommended: false
    },
    {
      id: 'balanced',
      name: 'Balanced Privacy',
      description: 'Basic security monitoring without personal data access',
      icon: Shield,
      color: 'text-blue-600 bg-blue-100',
      features: [
        'Basic security monitoring',
        'System protection',
        'No personal data access',
        'Threat detection'
      ],
      recommended: true
    },
    {
      id: 'enhanced',
      name: 'Enhanced Safety',
      description: 'Comprehensive security monitoring for maximum protection',
      icon: Unlock,
      color: 'text-orange-600 bg-orange-100',
      features: [
        'Comprehensive monitoring',
        'Advanced threat protection',
        'System health monitoring',
        'Enterprise-grade security'
      ],
      recommended: false
    }
  ];

  const handleAccept = () => {
    if (accepted) {
      onAccept(true, privacyLevel);
    }
  };

  const handleDownloadEULA = () => {
    // Create and download EULA PDF
    const eulaContent = `
# TauCore™ End User License Agreement
## "Transparent Privacy, User-Controlled Safety"

Version 1.0 - Effective Date: January 15, 2025

## PRIVACY FIRST PRINCIPLES

TauCore™ is designed with privacy as a fundamental principle. We believe your digital life should remain private and under your control.

### WHAT WE PROTECT
- Your files and documents - Never accessed or transmitted
- Your communications - Messages, emails, calls remain private
- Your browsing history - Web activity is not monitored
- Your personal data - No collection, storage, or transmission
- Your application usage - What you do with your apps is private

### WHAT WE NEVER DO
- We do not collect personal information
- We do not track your activities
- We do not monitor your communications
- We do not share your data with third parties
- We do not participate in surveillance programs

## OPTIONAL SAFETY MONITORING

To protect your system from threats, you may choose to enable optional security monitoring. This monitoring is limited to system-level events and does not access personal data.

### WHAT WE MONITOR (SYSTEM-LEVEL ONLY)
- System performance - CPU, memory, disk usage
- Security events - Failed login attempts, malware detection
- Network anomalies - Unusual traffic patterns
- System stability - Crashes, errors, hardware health
- Threat detection - Malware, viruses, security breaches

### WHAT WE NEVER MONITOR
- File contents or personal documents
- Messages, emails, or communications
- Browsing history or web activity
- Application usage patterns
- Personal behavior or activities

## YOUR PRIVACY CHOICES

You have complete control over your privacy level:

### MAXIMUM PRIVACY
- No system monitoring
- Complete privacy protection
- No data collection
- Recommended for: Privacy-conscious users

### BALANCED PRIVACY
- Basic security monitoring
- System protection without personal data access
- Optional threat detection
- Recommended for: Most users

### ENHANCED SAFETY
- Comprehensive security monitoring
- Advanced threat protection
- System health monitoring
- Recommended for: Enterprise users

## TRANSPARENT MONITORING

If you choose monitoring, you can see exactly what we monitor:

- Real-time dashboard - View current monitoring status
- Data retention policy - How long data is kept
- Monitoring controls - Enable/disable specific features
- Data export - Download your monitoring data
- Complete transparency - No hidden surveillance

## GOVERNMENT COMPLIANCE

TauCore™ complies with international privacy laws:

- GDPR - European data protection
- CCPA - California privacy rights
- SOX - Corporate compliance
- HIPAA - Healthcare privacy (when applicable)
- Local laws - Country-specific requirements

## AUDIT TRAIL

For legal and compliance purposes:

- EULA acceptance - Documented and timestamped
- Privacy choices - Recorded and stored securely
- Email confirmation - Sent to your registered email
- Audit logs - Available for compliance review
- Data retention - Governed by applicable laws

## YOUR RIGHTS

You have the right to:

- Control your privacy level - Change settings anytime
- Access your data - View what we monitor
- Export your data - Download monitoring information
- Delete your data - Remove monitoring information
- Opt out - Disable monitoring completely
- Transparency - See exactly what we monitor

## DATA SECURITY

Your data is protected by:

- End-to-end encryption - All data encrypted in transit
- Zero-knowledge architecture - We cannot access your data
- Secure storage - Encrypted at rest
- Regular audits - Security testing and validation
- Privacy by design - Built-in privacy protection

## CONTACT & SUPPORT

Questions about privacy or monitoring?

- Privacy Team: privacy@tauos.org
- Security Team: security@tauos.org
- Legal Team: legal@tauos.org
- Support: support@tauos.org

## ACCEPTANCE

By clicking "I Accept" below, you acknowledge that:

1. You have read and understood this EULA
2. You agree to the privacy and monitoring terms
3. You understand your privacy choices
4. You consent to the audit trail process
5. You accept the legal terms and conditions

TauCore™ - Privacy First, Safety by Choice

© 2025 TauCore™ / AR Holdings. All rights reserved.
TauCore™ is a trademark of AR Holdings.
    `;
    
    const blob = new Blob([eulaContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TauCore-EULA.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">TauCore™ EULA Agreement</h1>
                <p className="text-yellow-100">Transparent Privacy, User-Controlled Safety</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* EULA Summary */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Privacy & Safety Agreement
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    What We Protect
                  </h3>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Your files and documents</li>
                    <li>• Your communications</li>
                    <li>• Your browsing history</li>
                    <li>• Your personal data</li>
                    <li>• Your application usage</li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    What We Never Do
                  </h3>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Collect personal information</li>
                    <li>• Track your activities</li>
                    <li>• Monitor communications</li>
                    <li>• Share data with third parties</li>
                    <li>• Participate in surveillance</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Optional Safety Monitoring
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  To protect your system from threats, you may choose to enable optional security monitoring. 
                  This monitoring is limited to system-level events and does not access personal data.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-blue-800 dark:text-blue-200">We Monitor:</strong>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• System performance</li>
                      <li>• Security events</li>
                      <li>• Network anomalies</li>
                      <li>• System stability</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-blue-800 dark:text-blue-200">We Never Monitor:</strong>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• File contents</li>
                      <li>• Messages</li>
                      <li>• Browsing history</li>
                      <li>• Personal activities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Level Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Choose Your Privacy Level
              </h3>
              
              <div className="space-y-3">
                {privacyLevels.map((level) => (
                  <div
                    key={level.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      privacyLevel === level.id
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setPrivacyLevel(level.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${level.color}`}>
                        <level.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {level.name}
                          </h4>
                          {level.recommended && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {level.description}
                        </p>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {level.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex-shrink-0">
                        <input
                          type="radio"
                          name="privacyLevel"
                          value={level.id}
                          checked={privacyLevel === level.id}
                          onChange={() => setPrivacyLevel(level.id)}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EULA Actions */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFullEULA(!showFullEULA)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {showFullEULA ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      {showFullEULA ? 'Hide' : 'Show'} Full EULA
                    </span>
                  </button>
                  
                  <button
                    onClick={handleDownloadEULA}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-medium">Download EULA</span>
                  </button>
                </div>
              </div>

              {showFullEULA && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg max-h-96 overflow-y-auto">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Full End User License Agreement
                    </h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <p>
                        <strong>Privacy First Principles:</strong> TauCore™ is designed with privacy as a fundamental principle. 
                        We believe your digital life should remain private and under your control.
                      </p>
                      <p>
                        <strong>Optional Safety Monitoring:</strong> To protect your system from threats, you may choose to 
                        enable optional security monitoring. This monitoring is limited to system-level events and does not 
                        access personal data.
                      </p>
                      <p>
                        <strong>Your Privacy Choices:</strong> You have complete control over your privacy level. You can 
                        choose between Maximum Privacy, Balanced Privacy, or Enhanced Safety monitoring.
                      </p>
                      <p>
                        <strong>Transparent Monitoring:</strong> If you choose monitoring, you can see exactly what we monitor 
                        through our real-time dashboard and have complete control over your privacy settings.
                      </p>
                      <p>
                        <strong>Government Compliance:</strong> TauCore™ complies with international privacy laws including 
                        GDPR, CCPA, SOX, and local country-specific requirements.
                      </p>
                      <p>
                        <strong>Your Rights:</strong> You have the right to control your privacy level, access your data, 
                        export your data, delete your data, opt out completely, and have complete transparency about what we monitor.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Acceptance Checkbox */}
            <div className="mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">
                    I have read and agree to the TauCore™ End User License Agreement
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    By checking this box, you acknowledge that you have read and understood the EULA, 
                    agree to the privacy and monitoring terms, understand your privacy choices, 
                    consent to the audit trail process, and accept the legal terms and conditions.
                  </p>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Privacy Level: <span className="font-medium capitalize">{privacyLevel}</span>
                </span>
                <button
                  onClick={handleAccept}
                  disabled={!accepted}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Accept & Continue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
