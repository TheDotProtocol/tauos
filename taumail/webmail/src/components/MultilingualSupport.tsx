'use client';

import React, { useState, useEffect } from 'react';
import { 
  GlobeAltIcon,
  SpeakerWaveIcon,
  EyeIcon,
  CogIcon,
  TranslateIcon
} from '@heroicons/react/24/outline';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface MultilingualSupportProps {
  onLanguageChange: (language: string) => void;
  onAccessibilityChange: (settings: AccessibilitySettings) => void;
}

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  voiceEnabled: boolean;
  reducedMotion: boolean;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭' }
];

const translations = {
  en: {
    welcome: 'Welcome to TauOS',
    email: 'Email',
    calendar: 'Calendar',
    files: 'Files',
    settings: 'Settings',
    compose: 'Compose',
    inbox: 'Inbox',
    sent: 'Sent',
    drafts: 'Drafts',
    archive: 'Archive',
    trash: 'Trash',
    search: 'Search',
    security: 'Security',
    help: 'Help'
  },
  es: {
    welcome: 'Bienvenido a TauOS',
    email: 'Correo',
    calendar: 'Calendario',
    files: 'Archivos',
    settings: 'Configuración',
    compose: 'Redactar',
    inbox: 'Bandeja de entrada',
    sent: 'Enviados',
    drafts: 'Borradores',
    archive: 'Archivo',
    trash: 'Papelera',
    search: 'Buscar',
    security: 'Seguridad',
    help: 'Ayuda'
  },
  th: {
    welcome: 'ยินดีต้อนรับสู่ TauOS',
    email: 'อีเมล',
    calendar: 'ปฏิทิน',
    files: 'ไฟล์',
    settings: 'การตั้งค่า',
    compose: 'เขียน',
    inbox: 'กล่องจดหมาย',
    sent: 'ส่งแล้ว',
    drafts: 'ฉบับร่าง',
    archive: 'เก็บถาวร',
    trash: 'ถังขยะ',
    search: 'ค้นหา',
    security: 'ความปลอดภัย',
    help: 'ช่วยเหลือ'
  },
  hi: {
    welcome: 'TauOS में आपका स्वागत है',
    email: 'ईमेल',
    calendar: 'कैलेंडर',
    files: 'फ़ाइलें',
    settings: 'सेटिंग्स',
    compose: 'लिखें',
    inbox: 'इनबॉक्स',
    sent: 'भेजे गए',
    drafts: 'मसौदे',
    archive: 'संग्रह',
    trash: 'कचरा',
    search: 'खोजें',
    security: 'सुरक्षा',
    help: 'मदद'
  },
  fr: {
    welcome: 'Bienvenue sur TauOS',
    email: 'Email',
    calendar: 'Calendrier',
    files: 'Fichiers',
    settings: 'Paramètres',
    compose: 'Composer',
    inbox: 'Boîte de réception',
    sent: 'Envoyés',
    drafts: 'Brouillons',
    archive: 'Archives',
    trash: 'Corbeille',
    search: 'Rechercher',
    security: 'Sécurité',
    help: 'Aide'
  },
  km: {
    welcome: 'សូមស្វាគមន៍មកកាន់ TauOS',
    email: 'អ៊ីមែល',
    calendar: 'ប្រតិទិន',
    files: 'ឯកសារ',
    settings: 'ការកំណត់',
    compose: 'សរសេរ',
    inbox: 'ប្រអប់ចូល',
    sent: 'បានផ្ញើ',
    drafts: 'ពង្រាយ',
    archive: 'ឯកសារ',
    trash: 'ធុងសំរាម',
    search: 'ស្វែងរក',
    security: 'សុវត្ថិភាព',
    help: 'ជំនួយ'
  }
};

export const MultilingualSupport: React.FC<MultilingualSupportProps> = ({
  onLanguageChange,
  onAccessibilityChange
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    fontSize: 16,
    highContrast: false,
    voiceEnabled: false,
    reducedMotion: false
  });

  useEffect(() => {
    // Apply accessibility settings
    document.documentElement.style.fontSize = `${accessibilitySettings.fontSize}px`;
    
    if (accessibilitySettings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (accessibilitySettings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    onAccessibilityChange(accessibilitySettings);
  }, [accessibilitySettings, onAccessibilityChange]);

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  const handleAccessibilityChange = (setting: keyof AccessibilitySettings, value: any) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const speak = (text: string) => {
    if (accessibilitySettings.voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="multilingual-support">
      {/* Language Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <GlobeAltIcon className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium">
            {languages.find(l => l.code === currentLanguage)?.flag} {currentLanguage.toUpperCase()}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Language & Accessibility
              </h3>
              
              {/* Language Selection */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Language</h4>
                <div className="space-y-1">
                  {languages.map(language => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                        currentLanguage === language.code
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {language.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {language.nativeName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessibility Settings */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Accessibility</h4>
                
                {/* Font Size */}
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Text Size</label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAccessibilityChange('fontSize', Math.max(12, accessibilitySettings.fontSize - 2))}
                      className="px-2 py-1 bg-gray-200 rounded text-sm"
                    >
                      A-
                    </button>
                    <span className="text-sm font-medium min-w-[3rem] text-center">
                      {accessibilitySettings.fontSize}px
                    </span>
                    <button
                      onClick={() => handleAccessibilityChange('fontSize', Math.min(32, accessibilitySettings.fontSize + 2))}
                      className="px-2 py-1 bg-gray-200 rounded text-sm"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* High Contrast */}
                <div className="mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.highContrast}
                      onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">High Contrast</span>
                  </label>
                </div>

                {/* Voice Enabled */}
                <div className="mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.voiceEnabled}
                      onChange={(e) => handleAccessibilityChange('voiceEnabled', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Voice Assistance</span>
                  </label>
                </div>

                {/* Reduced Motion */}
                <div className="mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.reducedMotion}
                      onChange={(e) => handleAccessibilityChange('reducedMotion', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Reduced Motion</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Assistant Button */}
      {accessibilitySettings.voiceEnabled && (
        <button
          onClick={() => speak('Voice assistance is ready. How can I help you?')}
          className="fixed bottom-4 left-4 bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors z-40"
        >
          <SpeakerWaveIcon className="h-6 w-6" />
        </button>
      )}

      <style jsx>{`
        .multilingual-support {
          --current-language: ${currentLanguage};
        }
        
        .high-contrast {
          background: #000000 !important;
          color: #ffffff !important;
        }
        
        .high-contrast * {
          background: #000000 !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
        }
        
        .reduced-motion * {
          animation: none !important;
          transition: none !important;
        }
        
        .reduced-motion .tutorial-step {
          animation: none !important;
        }
      `}</style>
    </div>
  );
};

export const useTranslation = (language: string) => {
  return (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };
};

export const VoiceAssistant: React.FC<{ enabled: boolean; language: string }> = ({
  enabled,
  language
}) => {
  const [isListening, setIsListening] = useState(false);

  const speak = (text: string) => {
    if (enabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      speechSynthesis.speak(utterance);
    }
  };

  const listen = () => {
    if (enabled && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // Handle voice commands here
        console.log('Voice command:', transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  if (!enabled) return null;

  return (
    <div className="voice-assistant">
      <button
        onClick={listen}
        className={`fixed bottom-4 left-4 p-3 rounded-full shadow-lg transition-colors z-40 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        <SpeakerWaveIcon className="h-6 w-6" />
      </button>
      
      {isListening && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-pulse">
              <SpeakerWaveIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Listening...</p>
              <p className="text-sm text-gray-600">Speak your command</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 