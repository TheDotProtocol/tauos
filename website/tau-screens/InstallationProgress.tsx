import React, { useState, useEffect } from 'react';
import { Button } from '../tau-components/Button';

interface InstallationStep {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  estimatedTime: number;
}

const InstallationProgress: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(true);
  const [installationComplete, setInstallationComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const [steps, setSteps] = useState<InstallationStep[]>([
    {
      id: 'kernel',
      name: 'Installing Kernel',
      description: 'Setting up TauCore™ kernel and core system',
      progress: 0,
      status: 'pending',
      estimatedTime: 45
    },
    {
      id: 'drivers',
      name: 'Installing Drivers',
      description: 'Configuring hardware drivers and device support',
      progress: 0,
      status: 'pending',
      estimatedTime: 30
    },
    {
      id: 'desktop',
      name: 'Setting up Desktop',
      description: 'Installing desktop environment and UI components',
      progress: 0,
      status: 'pending',
      estimatedTime: 25
    },
    {
      id: 'apps',
      name: 'Installing Applications',
      description: 'Setting up TauMail, TauCloud, and core applications',
      progress: 0,
      status: 'pending',
      estimatedTime: 20
    },
    {
      id: 'security',
      name: 'Configuring Security',
      description: 'Setting up security framework and permissions',
      progress: 0,
      status: 'pending',
      estimatedTime: 15
    },
    {
      id: 'finalize',
      name: 'Finalizing Installation',
      description: 'Completing setup and preparing system for first boot',
      progress: 0,
      status: 'pending',
      estimatedTime: 10
    }
  ]);

  useEffect(() => {
    if (!isInstalling) return;

    const totalTime = steps.reduce((acc, step) => acc + step.estimatedTime, 0);
    setTimeRemaining(totalTime);

    const interval = setInterval(() => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        let currentStepIndex = currentStep;
        let stepComplete = false;

        // Update current step progress
        if (currentStepIndex < newSteps.length) {
          const currentStepData = newSteps[currentStepIndex];
          if (currentStepData.status === 'in-progress') {
            const progressIncrement = Math.random() * 15 + 5; // 5-20% per update
            newSteps[currentStepIndex] = {
              ...currentStepData,
              progress: Math.min(100, currentStepData.progress + progressIncrement)
            };

            if (newSteps[currentStepIndex].progress >= 100) {
              newSteps[currentStepIndex] = {
                ...currentStepData,
                progress: 100,
                status: 'completed'
              };
              stepComplete = true;
            }
          } else if (currentStepData.status === 'pending') {
            newSteps[currentStepIndex] = {
              ...currentStepData,
              status: 'in-progress'
            };
          }
        }

        // Move to next step if current is complete
        if (stepComplete && currentStepIndex < newSteps.length - 1) {
          setCurrentStep(currentStepIndex + 1);
        } else if (stepComplete && currentStepIndex === newSteps.length - 1) {
          // All steps complete
          setIsInstalling(false);
          setInstallationComplete(true);
          setTimeRemaining(0);
        }

        return newSteps;
      });

      // Update overall progress
      const completedSteps = newSteps.filter(step => step.status === 'completed').length;
      const inProgressStep = newSteps.find(step => step.status === 'in-progress');
      const currentStepProgress = inProgressStep ? inProgressStep.progress : 0;
      const overall = ((completedSteps + (currentStepProgress / 100)) / newSteps.length) * 100;
      setOverallProgress(overall);

      // Update time remaining
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, isInstalling]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'in-progress':
        return (
          <div className="animate-spin w-5 h-5 border-2 border-tau-gold-500 border-t-transparent rounded-full"></div>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <div className="w-5 h-5 border-2 border-tau-gray-600 rounded-full"></div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-tau-bg-primary flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-tau-white-primary mb-2">
            {installationComplete ? 'Installation Complete!' : 'Installing TauCore™'}
          </h1>
          <p className="text-tau-gray-400">
            {installationComplete 
              ? 'Your system is ready to use. Welcome to TauCore™!'
              : 'Please wait while we set up your system...'
            }
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-tau-bg-surface rounded-lg border border-tau-gray-600 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-tau-white-primary">
              Installation Progress
            </h2>
            <div className="text-tau-gray-400">
              {Math.round(overallProgress)}% Complete
            </div>
          </div>
          <div className="w-full bg-tau-gray-700 rounded-full h-3 mb-2">
            <div 
              className="bg-tau-gold-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          {!installationComplete && (
            <div className="flex items-center justify-between text-sm text-tau-gray-400">
              <span>Estimated time remaining: {formatTime(timeRemaining)}</span>
              <span>Step {currentStep + 1} of {steps.length}</span>
            </div>
          )}
        </div>

        {/* Installation Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-tau-bg-surface rounded-lg border p-4 transition-all duration-300 ${
                step.status === 'in-progress' 
                  ? 'border-tau-gold-500 bg-tau-gold-500 bg-opacity-5'
                  : step.status === 'completed'
                  ? 'border-green-500 bg-green-500 bg-opacity-5'
                  : 'border-tau-gray-600'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-tau-white-primary font-medium">
                      {step.name}
                    </h3>
                    <span className="text-tau-gray-400 text-sm">
                      {step.progress}%
                    </span>
                  </div>
                  <p className="text-tau-gray-400 text-sm mb-2">
                    {step.description}
                  </p>
                  {step.status === 'in-progress' && (
                    <div className="w-full bg-tau-gray-700 rounded-full h-2">
                      <div 
                        className="bg-tau-gold-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {!installationComplete && (
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => {
                setIsInstalling(false);
                setInstallationComplete(true);
              }}
            >
              Skip Installation
            </Button>
          )}
          <Button 
            variant="primary" 
            className="flex-1"
            disabled={!installationComplete}
          >
            {installationComplete ? 'Finish & Restart' : 'Installing...'}
          </Button>
        </div>

        {/* Installation Complete Message */}
        {installationComplete && (
          <div className="mt-8 bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-green-400 font-semibold text-lg mb-2">
              Welcome to TauCore™!
            </h3>
            <p className="text-tau-gray-300">
              Your privacy-first operating system is now ready. You can start using all the features 
              and applications that come with TauCore™.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallationProgress;
