'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Shield, 
  User, 
  HardDrive, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Download,
  Lock,
  FileText,
  Settings
} from 'lucide-react';

interface InstallationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallationWizard({ isOpen, onClose }: InstallationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [acceptedEULA, setAcceptedEULA] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [installationPath, setInstallationPath] = useState('/tauos');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installationProgress, setInstallationProgress] = useState(0);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const steps = [
    { id: 1, title: 'Language', icon: Globe },
    { id: 2, title: 'EULA & Legal', icon: FileText },
    { id: 3, title: 'TauID Setup', icon: User },
    { id: 4, title: 'Installation', icon: HardDrive },
    { id: 5, title: 'Complete', icon: CheckCircle },
  ];

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startInstallation = () => {
    setIsInstalling(true);
    setInstallationProgress(0);
    
    const interval = setInterval(() => {
      setInstallationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInstalling(false);
          setCurrentStep(5);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold text-white">TauOS Installation Wizard</h2>
                <p className="text-gray-400">Set up your privacy-first operating system</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-purple-500' : isCompleted ? 'bg-green-500' : 'bg-gray-700'
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Language Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Select Language</h3>
                  <p className="text-gray-400">Choose your preferred language for TauOS</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.name)}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        selectedLanguage === lang.name
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-2">{lang.flag}</div>
                      <div className="text-white font-medium">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: EULA & Legal */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Terms & Legal</h3>
                  <p className="text-gray-400">Please review and accept the terms of service</p>
                </div>
                
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h4 className="text-lg font-semibold text-white mb-3">TauOS End User License Agreement</h4>
                  <div className="text-gray-300 text-sm space-y-3">
                    <p>
                      <strong>1. Privacy First:</strong> TauOS is designed with privacy as the core principle. 
                      We do not collect, store, or transmit any personal data without your explicit consent.
                    </p>
                    <p>
                      <strong>2. Zero Telemetry:</strong> TauOS operates with zero telemetry. No usage data, 
                      crash reports, or analytics are sent to external servers.
                    </p>
                    <p>
                      <strong>3. Open Source:</strong> TauOS is built on open-source principles. 
                      Source code is available for audit and modification.
                    </p>
                    <p>
                      <strong>4. Security:</strong> TauOS includes comprehensive security hardening 
                      with 100% pen test audit compliance.
                    </p>
                    <p>
                      <strong>5. Support:</strong> Community support is available through our forums. 
                      Commercial support available for enterprise users.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="eula"
                    checked={acceptedEULA}
                    onChange={(e) => setAcceptedEULA(e.target.checked)}
                    className="w-4 h-4 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="eula" className="text-gray-300">
                    I have read and agree to the End User License Agreement and Privacy Policy
                  </label>
                </div>
              </motion.div>
            )}

            {/* Step 3: TauID Setup */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Create Your TauID</h3>
                  <p className="text-gray-400">Set up your TauOS account for secure access</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Installation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Installation Settings</h3>
                  <p className="text-gray-400">Configure your TauOS installation</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Installation Path
                    </label>
                    <input
                      type="text"
                      value={installationPath}
                      onChange={(e) => setInstallationPath(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Installation Summary</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>Language:</span>
                        <span className="text-white">{selectedLanguage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Username:</span>
                        <span className="text-white">{username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Installation Path:</span>
                        <span className="text-white">{installationPath}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Disk Space Required:</span>
                        <span className="text-white">8.5 GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Installation Complete!</h3>
                  <p className="text-gray-400">TauOS has been successfully installed on your system</p>
                </div>
                
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">What's Next?</h4>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>System will restart to complete setup</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>OTA updates will be checked automatically</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Desktop environment will be configured</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Universal drivers will be installed</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-4">
              {currentStep === 4 && !isInstalling && (
                <button
                  onClick={startInstallation}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Start Installation</span>
                </button>
              )}
              
              {currentStep < 4 && (
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 2 && !acceptedEULA) ||
                    (currentStep === 3 && (!username || !password || password !== confirmPassword))
                  }
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              
              {currentStep === 5 && (
                <button
                  onClick={onClose}
                  className="flex items-center space-x-2 bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300"
                >
                  <span>Finish</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
