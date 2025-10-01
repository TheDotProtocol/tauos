'use client';

import { useState } from 'react';
import EULAAcceptance from '@/components/installer/EULAAcceptance';
import { 
  Shield, 
  Globe, 
  Wifi, 
  User, 
  Download, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Home,
  Settings,
  Terminal,
  FileText,
  Mail,
  Cloud,
  Store,
  Browser,
  Monitor
} from 'lucide-react';

interface InstallerStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  component?: any;
}

export default function InstallerPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [acceptedEULA, setAcceptedEULA] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState('balanced');
  const [installerData, setInstallerData] = useState({
    language: 'en',
    eulaAccepted: false,
    privacyLevel: 'balanced',
    wifiConfigured: false,
    userCreated: false,
    installationComplete: false
  });

  const steps: InstallerStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to TauCore™',
      description: 'The privacy-first operating system',
      icon: Shield
    },
    {
      id: 'language',
      title: 'Language Selection',
      description: 'Choose your preferred language',
      icon: Globe
    },
    {
      id: 'eula',
      title: 'EULA & Privacy Agreement',
      description: 'Review and accept the End User License Agreement',
      icon: FileText
    },
    {
      id: 'wifi',
      title: 'Wi-Fi Setup',
      description: 'Configure your network connection',
      icon: Wifi
    },
    {
      id: 'user',
      title: 'Create User Account',
      description: 'Set up your TauCore™ account',
      icon: User
    },
    {
      id: 'install',
      title: 'Installation Progress',
      description: 'Installing TauCore™ on your system',
      icon: Download
    },
    {
      id: 'complete',
      title: 'Installation Complete',
      description: 'Welcome to TauCore™!',
      icon: CheckCircle
    }
  ];

  const handleEULAAccept = (accepted: boolean, privacyLevel: string) => {
    setAcceptedEULA(accepted);
    setPrivacyLevel(privacyLevel);
    setInstallerData(prev => ({
      ...prev,
      eulaAccepted: accepted,
      privacyLevel: privacyLevel
    }));
    if (accepted) {
      setCurrentStep(3); // Move to Wi-Fi setup
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Welcome to TauCore™
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The privacy-first operating system that puts you in control. 
                Experience security without surveillance, freedom without compromise.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Privacy First
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data stays yours. No tracking, no surveillance, no compromise.
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Settings className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  User Control
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You choose your privacy level. Transparent monitoring, not surveillance.
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Terminal className="h-8 w-8 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Developer Ready
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built for developers, with TauScript and modern tools.
                </p>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Choose Your Language
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select your preferred language for TauCore™
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'es', name: 'Español', flag: '🇪🇸' },
                { code: 'fr', name: 'Français', flag: '🇫🇷' },
                { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
                { code: 'it', name: 'Italiano', flag: '🇮🇹' },
                { code: 'pt', name: 'Português', flag: '🇵🇹' },
                { code: 'ru', name: 'Русский', flag: '🇷🇺' },
                { code: 'ja', name: '日本語', flag: '🇯🇵' },
                { code: 'ko', name: '한국어', flag: '🇰🇷' },
                { code: 'zh', name: '中文', flag: '🇨🇳' },
                { code: 'ar', name: 'العربية', flag: '🇸🇦' },
                { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setInstallerData(prev => ({ ...prev, language: lang.code }))}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    installerData.language === lang.code
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {lang.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {lang.code.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'eula':
        return (
          <EULAAcceptance
            onAccept={handleEULAAccept}
            onBack={handleBack}
          />
        );

      case 'wifi':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Wi-Fi Setup
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Connect to your wireless network
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  placeholder="Enter your Wi-Fi network name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your Wi-Fi password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
                  Remember this network
                </label>
              </div>
            </div>
          </div>
        );

      case 'user':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create User Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Set up your TauCore™ account
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Choose a username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 'install':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Installing TauCore™
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we install TauCore™ on your system
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                <div className="bg-yellow-500 h-4 rounded-full transition-all duration-1000" style={{ width: '75%' }} />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Downloading system files...</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Installing core components...</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Configuring privacy settings...</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-700 dark:text-gray-300">Setting up user account...</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                  <span className="text-gray-500 dark:text-gray-400">Finalizing installation...</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Installation Complete!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Welcome to TauCore™! Your privacy-first operating system is ready to use.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Home className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Desktop Environment
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Modern, intuitive desktop with privacy controls
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Store className="h-8 w-8 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  TauStore
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover and install privacy-focused applications
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Terminal className="h-8 w-8 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Developer Tools
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  TauScript, Git integration, and modern development tools
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              TauCore™ Installer
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={`flex-1 p-3 rounded-lg text-left transition-all ${
                  index === currentStep
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-500'
                    : index < currentStep
                    ? 'bg-green-100 dark:bg-green-900/20 border-2 border-green-500'
                    : 'bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <step.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      {steps[currentStep].id !== 'eula' && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {steps[currentStep].description}
              </div>
              
              <button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
