'use client';

import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  PlayIcon, 
  PauseIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  animation: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  feature: 'taumail' | 'taumeet' | 'taudrive' | 'general';
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  isOpen,
  onClose,
  onComplete,
  feature
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const tutorials = {
    taumail: [
      {
        id: 'welcome',
        title: 'Welcome to TauMail!',
        description: 'Your secure, private email experience starts here. Let\'s get you set up in under 2 minutes.',
        animation: 'fade-in',
        target: 'body',
        position: 'top'
      },
      {
        id: 'compose',
        title: 'Compose Email',
        description: 'Click the "Compose" button to start writing a new email. It\'s as easy as Gmail!',
        animation: 'slide-up',
        target: '.compose-button',
        position: 'bottom',
        action: 'Click Compose'
      },
      {
        id: 'drag-drop',
        title: 'Drag & Drop Organization',
        description: 'Drag emails to organize them into folders. Just like organizing papers on your desk!',
        animation: 'bounce',
        target: '.email-list',
        position: 'right',
        action: 'Try dragging an email'
      },
      {
        id: 'smart-groups',
        title: 'Smart Email Groups',
        description: 'Emails are automatically grouped: Family, School, Finance, Health. Find what matters most!',
        animation: 'pulse',
        target: '.smart-groups',
        position: 'left'
      },
      {
        id: 'security',
        title: 'Military-Grade Security',
        description: 'Every email is end-to-end encrypted. See the lock icon? That means your privacy is protected.',
        animation: 'glow',
        target: '.security-indicator',
        position: 'top'
      }
    ],
    taumeet: [
      {
        id: 'welcome-meet',
        title: 'Welcome to TauMeet!',
        description: 'Secure video calls with zero tracking. Your conversations stay private.',
        animation: 'fade-in',
        target: 'body',
        position: 'top'
      },
      {
        id: 'start-call',
        title: 'Start a Call',
        description: 'Click "New Call" to start a secure video conversation. No account needed!',
        animation: 'slide-up',
        target: '.new-call-button',
        position: 'bottom',
        action: 'Click New Call'
      },
      {
        id: 'screen-share',
        title: 'Share Your Screen',
        description: 'Click the screen icon to share your screen during calls. Perfect for presentations!',
        animation: 'bounce',
        target: '.screen-share-button',
        position: 'right',
        action: 'Try screen sharing'
      }
    ],
    taudrive: [
      {
        id: 'welcome-drive',
        title: 'Welcome to TauDrive!',
        description: 'Your private cloud storage. Files are encrypted and stored on your own server.',
        animation: 'fade-in',
        target: 'body',
        position: 'top'
      },
      {
        id: 'upload',
        title: 'Upload Files',
        description: 'Drag files here or click "Upload" to store them securely in your private cloud.',
        animation: 'slide-up',
        target: '.upload-area',
        position: 'bottom',
        action: 'Try uploading a file'
      },
      {
        id: 'share',
        title: 'Share Securely',
        description: 'Click "Share" to create secure links. Only people you invite can access your files.',
        animation: 'pulse',
        target: '.share-button',
        position: 'right',
        action: 'Share a file'
      }
    ],
    general: [
      {
        id: 'welcome-general',
        title: 'Welcome to TauOS!',
        description: 'The most secure yet user-friendly operating system. Let\'s get you started!',
        animation: 'fade-in',
        target: 'body',
        position: 'top'
      },
      {
        id: 'accessibility',
        title: 'Accessibility Modes',
        description: 'Choose your interface: Standard, Parental (for kids), or Senior Assist (large text & voice).',
        animation: 'slide-up',
        target: '.accessibility-selector',
        position: 'bottom'
      },
      {
        id: 'migration',
        title: 'Import from Google',
        description: 'Click "Import" to bring your emails, contacts, and files from Gmail in under 15 minutes.',
        animation: 'bounce',
        target: '.import-button',
        position: 'right',
        action: 'Start import'
      }
    ]
  };

  const currentTutorial = tutorials[feature];
  const currentStepData = currentTutorial[currentStep];

  useEffect(() => {
    if (isOpen && isPlaying) {
      const timer = setTimeout(() => {
        if (currentStep < currentTutorial.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setIsPlaying(false);
          onComplete();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying, isOpen, currentTutorial.length, onComplete]);

  const handleStepComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
    
    if (currentStep < currentTutorial.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <LightBulbIcon className="h-6 w-6 text-yellow-500" />
            <span className="font-semibold text-gray-900">Tutorial</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 py-2 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Step {currentStep + 1} of {currentTutorial.length}</span>
            <div className="flex space-x-1">
              {currentTutorial.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`tutorial-step ${currentStepData.animation}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentStepData.description}
            </p>

            {currentStepData.action && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-700 font-medium">
                    {currentStepData.action}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isPlaying ? (
                  <>
                    <PauseIcon className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    <span>Auto-play</span>
                  </>
                )}
              </button>

              <button
                onClick={handleStepComplete}
                className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <span>{currentStep === currentTutorial.length - 1 ? 'Finish' : 'Next'}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Skip */}
          <div className="mt-4 text-center">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip tutorial
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tutorial-step {
          transition: all 0.3s ease;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        
        .slide-up {
          animation: slideUp 0.5s ease-out;
        }
        
        .bounce {
          animation: bounce 1s ease-in-out;
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        .glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes glow {
          from { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          to { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
        }
      `}</style>
    </div>
  );
};

export const QuickHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpTopics = [
    {
      title: 'How to send an email?',
      content: 'Click the "Compose" button, fill in the recipient and subject, write your message, and click "Send".'
    },
    {
      title: 'How to organize emails?',
      content: 'Drag emails to folders or use the "Move to" button. Emails are also automatically grouped by type.'
    },
    {
      title: 'Is my data secure?',
      content: 'Yes! All emails are end-to-end encrypted and stored on your private server. No one else can access your data.'
    },
    {
      title: 'How to import from Gmail?',
      content: 'Click "Import" in settings, enter your Gmail credentials, and we\'ll migrate everything automatically.'
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40"
      >
        <QuestionMarkCircleIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Quick Help</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4">
              {helpTopics.map((topic, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {topic.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 