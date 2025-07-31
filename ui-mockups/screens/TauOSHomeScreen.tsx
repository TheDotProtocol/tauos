import React from 'react'
import { 
  CloudIcon, 
  EnvelopeIcon, 
  CommandLineIcon, 
  ShoppingBagIcon, 
  Cog6ToothIcon,
  WifiIcon,
  Battery100Icon,
  ClockIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  PhotoIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline'
import { TauOSCard, TauOSButton, TauOSIcon } from '../components/TauOSTheme'

const TauOSHomeScreen: React.FC = () => {
  const apps = [
    { name: 'TauMail', icon: EnvelopeIcon, color: 'text-blue-400' },
    { name: 'TauCloud', icon: CloudIcon, color: 'text-purple-400' },
    { name: 'Terminal', icon: CommandLineIcon, color: 'text-green-400' },
    { name: 'TauStore', icon: ShoppingBagIcon, color: 'text-yellow-400' },
    { name: 'Settings', icon: Cog6ToothIcon, color: 'text-gray-400' },
    { name: 'Files', icon: FolderIcon, color: 'text-cyan-400' },
    { name: 'Photos', icon: PhotoIcon, color: 'text-pink-400' },
    { name: 'Documents', icon: DocumentTextIcon, color: 'text-orange-400' },
    { name: 'Videos', icon: VideoCameraIcon, color: 'text-red-400' },
    { name: 'Music', icon: MusicalNoteIcon, color: 'text-indigo-400' },
  ]

  return (
    <div className="w-full h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Desktop Icons */}
      <div className="relative z-10 p-8">
        <div className="grid grid-cols-5 gap-8 max-w-4xl mx-auto">
          {apps.map((app, index) => (
            <div
              key={app.name}
              className="flex flex-col items-center group cursor-pointer transform hover:scale-110 transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 bg-neutral-800 rounded-2xl border border-neutral-700 flex items-center justify-center mb-2 group-hover:border-primary-500 group-hover:shadow-glow transition-all duration-200 ${app.color}`}>
                <app.icon className="w-8 h-8" />
              </div>
              <span className="text-sm text-neutral-300 font-medium group-hover:text-white transition-colors duration-200">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-800">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Start Button */}
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-glow hover:shadow-glow-lg transition-all duration-200">
              <div className="w-6 h-6 text-white font-bold text-lg">τ</div>
            </button>
            
            {/* Quick Search */}
            <div className="flex items-center bg-neutral-800 rounded-lg px-3 py-2 border border-neutral-700">
              <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search apps, files, and settings..."
                className="bg-transparent text-neutral-300 placeholder-neutral-500 outline-none text-sm w-64"
              />
            </div>
          </div>

          {/* System Icons */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-neutral-300 text-sm">
              <WifiIcon className="w-4 h-4" />
              <span>Connected</span>
            </div>
            
            <div className="flex items-center space-x-2 text-neutral-300 text-sm">
              <Battery100Icon className="w-4 h-4 text-green-400" />
              <span>87%</span>
            </div>
            
            <div className="flex items-center space-x-2 text-neutral-300 text-sm">
              <ClockIcon className="w-4 h-4" />
              <span>14:32</span>
            </div>
            
            <div className="w-px h-6 bg-neutral-700"></div>
            
            <button className="flex items-center space-x-2 text-neutral-300 hover:text-white transition-colors duration-200">
              <UserCircleIcon className="w-6 h-6" />
              <span className="text-sm font-medium">admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Start Menu (Hidden by default, shown on hover) */}
      <div className="absolute bottom-16 left-6 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700 rounded-xl shadow-2xl w-80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-white font-semibold mb-2">Quick Access</h3>
            <div className="grid grid-cols-4 gap-2">
              {apps.slice(0, 8).map((app) => (
                <button
                  key={app.name}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-neutral-800 transition-colors duration-200"
                >
                  <app.icon className={`w-6 h-6 mb-1 ${app.color}`} />
                  <span className="text-xs text-neutral-300">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-neutral-700 pt-4">
            <h3 className="text-white font-semibold mb-2">System</h3>
            <div className="space-y-1">
              <button className="flex items-center w-full p-2 rounded-lg hover:bg-neutral-800 transition-colors duration-200">
                <Cog6ToothIcon className="w-4 h-4 text-neutral-400 mr-3" />
                <span className="text-sm text-neutral-300">Settings</span>
              </button>
              <button className="flex items-center w-full p-2 rounded-lg hover:bg-neutral-800 transition-colors duration-200">
                <CommandLineIcon className="w-4 h-4 text-neutral-400 mr-3" />
                <span className="text-sm text-neutral-300">Terminal</span>
              </button>
              <button className="flex items-center w-full p-2 rounded-lg hover:bg-neutral-800 transition-colors duration-200">
                <UserCircleIcon className="w-4 h-4 text-neutral-400 mr-3" />
                <span className="text-sm text-neutral-300">User Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="absolute top-8 right-8">
        <TauOSCard glow className="w-80">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to TauOS</h2>
            <p className="text-neutral-400 text-sm mb-4">
              Your privacy-first operating system is ready
            </p>
            <div className="flex space-x-2">
              <TauOSButton size="sm" variant="primary">
                Get Started
              </TauOSButton>
              <TauOSButton size="sm" variant="ghost">
                Skip
              </TauOSButton>
            </div>
          </div>
        </TauOSCard>
      </div>

      {/* System Status Indicator */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center space-x-2 bg-neutral-800/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-neutral-700">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-neutral-300">System Ready</span>
        </div>
      </div>
    </div>
  )
}

export default TauOSHomeScreen 