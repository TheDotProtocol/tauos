import React, { useState } from 'react';
import { Button } from '../tau-components/Button';

const EULAPrivacy: React.FC = () => {
  const [acceptedEULA, setAcceptedEULA] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showFullEULA, setShowFullEULA] = useState(false);
  const [showFullPrivacy, setShowFullPrivacy] = useState(false);

  const canContinue = acceptedEULA && acceptedPrivacy;

  return (
    <div className="min-h-screen bg-tau-bg-primary flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-tau-white-primary mb-2">
            License Agreement & Privacy Policy
          </h1>
          <p className="text-tau-gray-400">
            Please review and accept the terms to continue with TauCore™ installation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* EULA Section */}
          <div className="bg-tau-bg-surface rounded-lg border border-tau-gray-600 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-tau-white-primary">
                End User License Agreement
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullEULA(!showFullEULA)}
              >
                {showFullEULA ? 'Show Less' : 'Show Full'}
              </Button>
            </div>
            
            <div className="mb-4">
              {showFullEULA ? (
                <div className="text-tau-gray-300 text-sm max-h-64 overflow-y-auto">
                  <p className="mb-4">
                    <strong>1. Grant of License</strong><br/>
                    TauCore™ grants you a non-exclusive, non-transferable license to use the software.
                  </p>
                  <p className="mb-4">
                    <strong>2. Restrictions</strong><br/>
                    You may not reverse engineer, decompile, or disassemble the software.
                  </p>
                  <p className="mb-4">
                    <strong>3. Privacy</strong><br/>
                    TauCore™ collects no personal data and operates with zero telemetry.
                  </p>
                  <p className="mb-4">
                    <strong>4. Warranty</strong><br/>
                    Software is provided "as is" without warranty of any kind.
                  </p>
                  <p className="mb-4">
                    <strong>5. Limitation of Liability</strong><br/>
                    TauCore™ shall not be liable for any damages arising from use of the software.
                  </p>
                </div>
              ) : (
                <div className="text-tau-gray-300 text-sm">
                  <p className="mb-2">
                    By installing TauCore™, you agree to the End User License Agreement.
                  </p>
                  <p className="mb-2">
                    Key points:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Non-exclusive license for personal use</li>
                    <li>No reverse engineering or redistribution</li>
                    <li>Zero telemetry and data collection</li>
                    <li>Software provided "as is"</li>
                  </ul>
                </div>
              )}
            </div>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedEULA}
                onChange={(e) => setAcceptedEULA(e.target.checked)}
                className="w-4 h-4 text-tau-gold-500 bg-tau-gray-700 border-tau-gray-600 rounded focus:ring-tau-gold-500 focus:ring-2"
              />
              <span className="text-tau-white-primary text-sm">
                I have read and agree to the End User License Agreement
              </span>
            </label>
          </div>

          {/* Privacy Policy Section */}
          <div className="bg-tau-bg-surface rounded-lg border border-tau-gray-600 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-tau-white-primary">
                Privacy Policy
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullPrivacy(!showFullPrivacy)}
              >
                {showFullPrivacy ? 'Show Less' : 'Show Full'}
              </Button>
            </div>
            
            <div className="mb-4">
              {showFullPrivacy ? (
                <div className="text-tau-gray-300 text-sm max-h-64 overflow-y-auto">
                  <p className="mb-4">
                    <strong>1. Data Collection</strong><br/>
                    TauCore™ collects absolutely no personal data, usage statistics, or telemetry.
                  </p>
                  <p className="mb-4">
                    <strong>2. Local Storage</strong><br/>
                    All data is stored locally on your device. No cloud synchronization without explicit consent.
                  </p>
                  <p className="mb-4">
                    <strong>3. Network Communication</strong><br/>
                    Network requests are only made for essential system updates and user-initiated actions.
                  </p>
                  <p className="mb-4">
                    <strong>4. Third-Party Services</strong><br/>
                    Optional third-party integrations are clearly marked and require explicit user consent.
                  </p>
                  <p className="mb-4">
                    <strong>5. Your Rights</strong><br/>
                    You have complete control over your data and can delete it at any time.
                  </p>
                </div>
              ) : (
                <div className="text-tau-gray-300 text-sm">
                  <p className="mb-2">
                    TauCore™ is designed with privacy as the core principle.
                  </p>
                  <p className="mb-2">
                    Key privacy features:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Zero telemetry and data collection</li>
                    <li>All data stored locally on your device</li>
                    <li>No tracking or analytics</li>
                    <li>Complete user control over data</li>
                  </ul>
                </div>
              )}
            </div>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                className="w-4 h-4 text-tau-gold-500 bg-tau-gray-700 border-tau-gray-600 rounded focus:ring-tau-gold-500 focus:ring-2"
              />
              <span className="text-tau-white-primary text-sm">
                I have read and agree to the Privacy Policy
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-8">
          <Button variant="secondary" className="flex-1">
            Back
          </Button>
          <Button 
            variant="primary" 
            className="flex-1"
            disabled={!canContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EULAPrivacy;
