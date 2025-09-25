import React, { useState, useEffect } from 'react';
import { Button } from '../tau-components/Button';

const InstallerStart: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing TauCore™...');

  useEffect(() => {
    const steps = [
      { progress: 20, status: 'Checking system requirements...' },
      { progress: 40, status: 'Preparing installation environment...' },
      { progress: 60, status: 'Downloading core components...' },
      { progress: 80, status: 'Validating package integrity...' },
      { progress: 100, status: 'Ready to install!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        setStatus(steps[currentStep].status);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-tau-bg-primary flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-tau-gold-500 rounded-full flex items-center justify-center">
            <span className="text-tau-black-900 text-2xl font-bold">τ</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-tau-white-primary mb-2">
            TauCore™
          </h1>
          <p className="text-tau-gray-400">
            Privacy-First Operating System
          </p>
        </div>

        {/* Progress */}
        <div className="bg-tau-bg-surface rounded-lg p-6 mb-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-tau-gray-400 mb-2">
              <span>Installation Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-tau-gray-700 rounded-full h-2">
              <div 
                className="bg-tau-gold-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-tau-white-primary text-sm">{status}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button 
            variant="secondary" 
            className="flex-1"
            disabled={progress < 100}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            className="flex-1"
            disabled={progress < 100}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallerStart;
