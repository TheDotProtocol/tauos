import React, { useState } from 'react'
import { 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  FingerPrintIcon,
  UserCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { TauOSCard, TauOSButton, TauOSIcon } from '../components/TauOSTheme'

const TauOSLoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authMethod, setAuthMethod] = useState<'password' | 'biometric' | 'tauid'>('password')

  const handleLogin = () => {
    setIsAuthenticating(true)
    // Simulate authentication
    setTimeout(() => {
      setIsAuthenticating(false)
    }, 2000)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* System Status */}
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center space-x-2 bg-neutral-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-neutral-700">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-neutral-300">System Secure</span>
        </div>
      </div>

      {/* Time and Date */}
      <div className="absolute top-6 right-6 z-10 text-right">
        <div className="text-white">
          <div className="text-4xl font-light">14:32</div>
          <div className="text-sm text-neutral-400">Wednesday, January 15, 2025</div>
        </div>
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <TauOSCard glow className="w-96 p-8">
          {/* TauOS Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
              <div className="text-white font-bold text-3xl">τ</div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to TauOS</h1>
            <p className="text-neutral-400 text-sm">Privacy-First Operating System</p>
          </div>

          {/* Authentication Methods */}
          <div className="mb-6">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setAuthMethod('password')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  authMethod === 'password'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <KeyIcon className="w-4 h-4 inline mr-2" />
                Password
              </button>
              <button
                onClick={() => setAuthMethod('biometric')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  authMethod === 'biometric'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <FingerPrintIcon className="w-4 h-4 inline mr-2" />
                Biometric
              </button>
              <button
                onClick={() => setAuthMethod('tauid')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  authMethod === 'tauid'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <ShieldCheckIcon className="w-4 h-4 inline mr-2" />
                TauID
              </button>
            </div>
          </div>

          {/* Password Authentication */}
          {authMethod === 'password' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Username</label>
                <div className="relative">
                  <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    defaultValue="admin"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    defaultValue="••••••••"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                    placeholder="Enter password"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <TauOSButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleLogin}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Login</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </div>
                )}
              </TauOSButton>
            </div>
          )}

          {/* Biometric Authentication */}
          {authMethod === 'biometric' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto shadow-glow animate-pulse">
                <FingerPrintIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Biometric Authentication</h3>
                <p className="text-neutral-400 text-sm">Place your finger on the sensor</p>
              </div>
              <TauOSButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleLogin}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? 'Authenticating...' : 'Use Biometric'}
              </TauOSButton>
            </div>
          )}

          {/* TauID Authentication */}
          {authMethod === 'tauid' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">TauID</label>
                <div className="relative">
                  <ShieldCheckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                    placeholder="Enter your TauID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Passphrase</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="password"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors duration-200"
                    placeholder="Enter your passphrase"
                  />
                </div>
              </div>

              <TauOSButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleLogin}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? 'Authenticating...' : 'Login with TauID'}
              </TauOSButton>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <ShieldCheckIcon className="w-4 h-4 text-green-400" />
              <span>All authentication is encrypted and secure</span>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <div className="flex justify-center space-x-4 text-sm">
              <button className="text-neutral-400 hover:text-white transition-colors duration-200">
                Forgot Password?
              </button>
              <span className="text-neutral-600">•</span>
              <button className="text-neutral-400 hover:text-white transition-colors duration-200">
                Help
              </button>
            </div>
          </div>
        </TauOSCard>
      </div>

      {/* Security Features Indicator */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-neutral-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-neutral-700">
            <LockClosedIcon className="w-4 h-4 text-green-400" />
            <span className="text-xs text-neutral-300">Disk Encrypted</span>
          </div>
          <div className="flex items-center space-x-2 bg-neutral-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-neutral-700">
            <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-neutral-300">Secure Boot</span>
          </div>
        </div>
      </div>

      {/* Network Status */}
      <div className="absolute bottom-6 right-6 z-10">
        <div className="flex items-center space-x-2 bg-neutral-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-neutral-700">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-neutral-300">Connected</span>
        </div>
      </div>
    </div>
  )
}

export default TauOSLoginScreen 