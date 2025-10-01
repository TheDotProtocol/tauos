import React, { useState, useMemo } from 'react';
import { Button } from '../tau-components/Button';
import { Input } from '../tau-components/Input';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
];

const LanguageSelection: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    return languages.filter(lang => 
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-tau-bg-primary flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-tau-white-primary mb-2">
            Choose Your Language
          </h1>
          <p className="text-tau-gray-400">
            Select your preferred language for TauCore™
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        {/* Language List */}
        <div className="bg-tau-bg-surface rounded-lg border border-tau-gray-600 max-h-96 overflow-y-auto">
          {filteredLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => setSelectedLanguage(language)}
              className={`w-full px-4 py-3 text-left hover:bg-tau-gray-800 transition-colors border-b border-tau-gray-700 last:border-b-0 ${
                selectedLanguage.code === language.code 
                  ? 'bg-tau-gold-500 bg-opacity-10 border-l-4 border-l-tau-gold-500' 
                  : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{language.flag}</span>
                <div>
                  <div className="text-tau-white-primary font-medium">
                    {language.nativeName}
                  </div>
                  <div className="text-tau-gray-400 text-sm">
                    {language.name}
                  </div>
                </div>
                {selectedLanguage.code === language.code && (
                  <div className="ml-auto">
                    <svg className="w-5 h-5 text-tau-gold-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <Button variant="secondary" className="flex-1">
            Back
          </Button>
          <Button variant="primary" className="flex-1">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
