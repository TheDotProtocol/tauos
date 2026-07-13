import { NextRequest, NextResponse } from 'next/server';
import { runAiChat } from '@/lib/ai-gateway';

// TauAI — keyword fallback when gateway unavailable
const processCommand = (message: string) => {
  const lowerMessage = message.toLowerCase();
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      message: "Heya! I'm Tau, your AI assistant! 🤖✨ How can I help you today?",
      type: 'greeting',
      suggestions: ['Check my emails', 'Open TauCloud', 'Tell me a joke', 'What can you do?']
    };
  }
  
  // Help command
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return {
      message: "I can help you with:\n• Managing your TauCore apps (TauMail, TauCloud, etc.)\n• Answering questions about privacy and security\n• Telling jokes and having fun conversations\n• Providing emotional support when you need it\n• Helping with productivity tasks\n\nJust ask me anything! 😊",
      type: 'help',
      suggestions: ['Open TauMail', 'Check my files', 'Tell me a joke', 'I need support']
    };
  }
  
  // Joke command
  if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
    const jokes = [
      "Why don't privacy advocates ever get lost? Because they always know where their data is! 😄",
      "What do you call a secure AI? A 'Tau-tally' private assistant! 🤖",
      "Why did the TauCore user break up with their old OS? It was too 'open' about everything! 😂",
      "What's a TauCore user's favorite type of music? En-crypt-ed! 🎵"
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    return {
      message: randomJoke,
      type: 'joke',
      suggestions: ['Another joke!', 'That was terrible', 'Tell me about TauCore', 'Help me with something']
    };
  }
  
  // Emotional support
  if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
    return {
      message: "I'm here for you! 💙 Sometimes we all feel down, and that's completely okay. Remember that you're not alone, and things will get better. Would you like to talk about what's on your mind, or would you prefer a distraction? I'm always here to listen and help however I can.",
      type: 'support',
      suggestions: ['Tell me a joke', 'Help me with work', 'I want to talk', 'Show me my apps']
    };
  }
  
  // App management
  if (lowerMessage.includes('email') || lowerMessage.includes('taumail')) {
    return {
      message: "I can help you with TauMail! 📧 You can check your inbox, compose new emails, or manage your email settings. Would you like me to open TauMail for you?",
      type: 'app',
      action: 'open_taumail',
      suggestions: ['Open TauMail', 'Check my inbox', 'Compose email', 'Email settings']
    };
  }
  
  if (lowerMessage.includes('cloud') || lowerMessage.includes('files')) {
    return {
      message: "TauCloud is your secure file storage! ☁️ I can help you upload files, organize folders, or share documents. Your files are encrypted and private. What would you like to do?",
      type: 'app',
      action: 'open_taucloud',
      suggestions: ['Open TauCloud', 'Upload files', 'View my files', 'Share a file']
    };
  }
  
  // Default response
  return {
    message: `I understand you said "${message}". I'm here to help with your TauCore experience! Whether you need assistance with apps, want to chat, or need emotional support, I'm ready to help. What would you like to do?`,
    type: 'general',
    suggestions: ['Help me with apps', 'Tell me a joke', 'I need support', 'What can you do?']
  };
};

export async function POST(request: NextRequest) {
  try {
    const { message, userId, messages, provider, model, privacyMode } = await request.json();

    if (!message && !messages?.length) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    // Prefer multi-model gateway (Phase 0)
    try {
      const chatMessages =
        messages ??
        [{ role: 'user' as const, content: String(message) }];

      const gateway = await runAiChat({
        messages: chatMessages,
        provider: provider ?? 'auto',
        model,
        privacyMode,
      });

      if (gateway.provider !== 'fallback' || process.env.AI_ALLOW_KEYWORD_FALLBACK !== 'false') {
        return NextResponse.json({
          message: gateway.message,
          type: 'ai',
          provider: gateway.provider,
          model: gateway.model,
          timestamp: new Date().toISOString(),
          status: 'success',
          userId: userId || 'anonymous',
        });
      }
    } catch (gatewayErr) {
      console.warn('[tauai] gateway fallback:', gatewayErr);
    }

    const response = processCommand(String(message));
    
    const result = {
      ...response,
      timestamp: new Date().toISOString(),
      status: 'success',
      userId: userId || 'anonymous'
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('TauAI API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'TauAI API is running',
    status: 'active',
    timestamp: new Date().toISOString()
  });
}
