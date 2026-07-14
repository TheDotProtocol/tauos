'use client';

import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  Play,
  Sparkles,
  Mic,
  Eye,
  Brain,
  RefreshCw,
  Shield,
  ArrowRight,
  Check,
  Star,
  Zap,
  Lock,
  Users,
  Globe,
  Settings,
  Terminal,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Clock,
  Volume2,
  ChevronDown,
  Plus,
  Minus,
  RotateCcw,
  Power,
  Bot,
  MessageCircle,
  Image,
  FileText,
  BarChart3,
  Activity
} from 'lucide-react';

export default function TauAIPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const aiModules = [
    {
      id: 'tauai',
      name: 'TauAI Assistant',
      description: 'Voice-activated AI assistant with "Tau" wake word',
      icon: Bot,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      features: ['Voice Commands', 'Natural Language', 'Real-time Response', 'Privacy-First']
    },
    {
      id: 'tauvision',
      name: 'TauVision',
      description: 'Computer vision and image analysis',
      icon: Eye,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      features: ['Object Recognition', 'OCR', 'Image Analysis', 'Real-time Processing']
    },
    {
      id: 'taumind',
      name: 'TauMind',
      description: 'Predictive intelligence and analytics',
      icon: Brain,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      features: ['Predictive Analytics', 'Sentiment Analysis', 'Pattern Recognition', 'Smart Insights']
    },
    {
      id: 'tausync',
      name: 'TauSync',
      description: 'Intelligent data synchronization',
      icon: RefreshCw,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      features: ['Smart Sync', 'Conflict Resolution', 'Data Integrity', 'Cross-Platform']
    },
    {
      id: 'tauguard',
      name: 'TauGuard',
      description: 'AI-powered security monitoring',
      icon: Shield,
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      features: ['Threat Detection', 'Anomaly Detection', 'Security Analysis', 'Real-time Alerts']
    }
  ];

  const features = [
    {
      icon: Mic,
      title: 'Voice-First Interface',
      description: 'Just say "Tau" to activate your AI assistant. No wake words, no complex commands.',
      color: 'text-yellow-400'
    },
    {
      icon: Lock,
      title: 'Privacy-Native',
      description: 'All AI processing happens locally on your device. Your data never leaves your control.',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Lightning-fast responses with 60fps animations and instant voice recognition.',
      color: 'text-blue-400'
    },
    {
      icon: Users,
      title: 'Enterprise Ready',
      description: 'Built for organizations that demand privacy and control over their AI systems.',
      color: 'text-purple-400'
    }
  ];

  const handleVoiceCommand = async () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setTranscript('(microphone unavailable)');
        setResponse('Your browser does not support microphone access. Type in the chat demo instead.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        recorder.start();
        setTimeout(() => recorder.stop(), 4000);
      });

      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: 'audio/webm' });

      const form = new FormData();
      form.append('audio', blob, 'voice.webm');
      form.append('followUp', 'true');

      const voiceRes = await fetch('/api/tauai/voice', { method: 'POST', body: form });
      const voiceData = await voiceRes.json();

      if (voiceData.useClientStt && 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        const clientText = await new Promise<string>((resolve) => {
          recognition.onresult = (ev: any) => resolve(ev.results[0][0].transcript);
          recognition.onerror = () => resolve('');
          recognition.start();
        });
        if (clientText) {
          setTranscript(clientText);
          const chatRes = await fetch('/api/tauai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'user', content: clientText }] }),
          });
          const chatData = await chatRes.json();
          setResponse(chatData.message || chatData.response || 'No response');
          return;
        }
      }

      setTranscript(voiceData.transcription || '(no speech detected)');
      setResponse(voiceData.response || voiceData.message || 'Tau AI is ready — connect an API key for full responses.');
    } catch (error) {
      console.error('TauAI Voice Error:', error);
      setTranscript('Voice capture failed');
      setResponse('Try again or use the text chat at /api/tauai/chat.');
    } finally {
      setIsListening(false);
    }
  };

  if (isLoading) {
    return (
      <MarketingPageShell title="Tau AI" subtitle="On-device intelligence that serves you — not advertisers." hero={false}>
        <div className="flex items-center justify-center min-h-[50vh] px-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Initializing AI system…</p>
          </motion.div>
        </div>
      </MarketingPageShell>
    );
  }

  return (
    <MarketingPageShell title="Tau AI" subtitle="On-device intelligence that serves you — not advertisers." hero={false}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-500/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              TauAI
            </h1>
            <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              The world's first privacy-native AI operating system. 
              Just say "Tau" and experience the future of computing.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button 
                onClick={handleVoiceCommand}
                className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                }`}
              >
                <Mic className="w-5 h-5" />
                {isListening ? 'Listening...' : 'Try "Tau" Wake Word'}
              </button>
              <button className="flex items-center gap-2 px-8 py-4 border border-yellow-400 text-yellow-400 rounded-lg font-semibold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-200">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-purple-400/25 transition-all duration-200"
              >
                <Terminal className="w-5 h-5" />
                {showDemo ? 'Hide AI Interface' : 'Try AI Interface'}
              </button>
            </div>

            {/* Voice Demo Section */}
            {(transcript || response) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-xl font-bold mb-6 text-yellow-400">Live AI Demo</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">U</span>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 flex-1">
                      <p className="text-white">{transcript}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-black" />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 flex-1">
                      <p className="text-white">{response}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* AI Interface Demo */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <div className="h-8 bg-gray-800 flex items-center px-4 space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="h-[600px]">
              <iframe
                src="/tauai/enhanced-tauai.html"
                className="w-full h-full border-0"
                title="TauAI Interface Demo"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Modules Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Complete AI Ecosystem</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five powerful AI modules working together to create the most intelligent and private computing experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {aiModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-yellow-400/30 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 ${module.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <module.icon className={`w-8 h-8 ${module.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{module.name}</h3>
              <p className="text-gray-400 mb-6">{module.description}</p>
              <div className="space-y-2">
                {module.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Why TauAI Changes Everything</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Unlike Big Tech AI that harvests your data, TauAI processes everything locally on your device.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <feature.icon className={`w-16 h-16 ${feature.color} mx-auto mb-6`} />
                <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">TauAI vs. Big Tech</h2>
          <p className="text-xl text-gray-300">See how we stack up against the competition</p>
        </motion.div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-yellow-400">TauAI</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">Apple Siri</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">Google Assistant</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-400">Microsoft Copilot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-300">Privacy</td>
                  <td className="px-6 py-4 text-center text-sm text-green-400">✅ Local Processing</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ Cloud Processing</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ Data Harvesting</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ Microsoft Servers</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-300">Wake Word</td>
                  <td className="px-6 py-4 text-center text-sm text-green-400">✅ "Tau"</td>
                  <td className="px-6 py-4 text-center text-sm text-yellow-400">⚠️ "Hey Siri"</td>
                  <td className="px-6 py-4 text-center text-sm text-yellow-400">⚠️ "Hey Google"</td>
                  <td className="px-6 py-4 text-center text-sm text-yellow-400">⚠️ "Hey Copilot"</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-300">Customization</td>
                  <td className="px-6 py-4 text-center text-sm text-green-400">✅ Full Control</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ Limited</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ No Control</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ No Control</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-300">Open Source</td>
                  <td className="px-6 py-4 text-center text-sm text-green-400">✅ Fully Open</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ Proprietary</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ Proprietary</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ Proprietary</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-300">Enterprise Ready</td>
                  <td className="px-6 py-4 text-center text-sm text-green-400">✅ Built-in</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ Consumer Only</td>
                  <td className="px-6 py-4 text-center text-sm text-red-400">❌ Consumer Only</td>
                  <td className="px-6 py-4 text-center text-sm text-yellow-400">⚠️ Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border-t border-yellow-400/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Ready to Experience the Future?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Download Tau OS today and be among the first to experience privacy-native AI computing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-200">
                <Download className="w-5 h-5" />
                Download Tau OS Desktop
              </button>
              <button className="flex items-center gap-2 px-8 py-4 border border-yellow-400 text-yellow-400 rounded-lg font-semibold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-200">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </MarketingPageShell>
  );
}
