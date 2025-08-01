# TauVoice - Privacy-First Voice Assistant

## Overview

TauVoice is a lightweight, offline-first voice assistant integrated into TauOS. It provides speech-to-text (STT), text-to-speech (TTS), and AI-powered conversation capabilities while maintaining complete privacy.

## Features

- **Offline STT/TTS**: Local speech recognition and synthesis
- **Privacy-First**: No cloud dependencies, all processing local
- **TauOS Integration**: Seamless desktop integration
- **Hotkey Activation**: Trigger via Cmd+Shift+V or Alt+V
- **OpenRouter Fallback**: Online LLM when needed
- **Voice Commands**: System control and application launching

## Architecture

```
TauVoice System
├── Speech Recognition (Vosk/Coqui)
├── Text-to-Speech (Offline TTS)
├── Local LLM Processing
├── OpenRouter API Integration
├── Voice Command System
└── TauOS Desktop Integration
```

## Components

### 1. Speech Recognition (STT)
- **Vosk**: Offline speech recognition
- **Coqui**: Alternative STT engine
- **Language Support**: English, Spanish, French, German
- **Noise Reduction**: Built-in audio processing

### 2. Text-to-Speech (TTS)
- **Offline TTS**: Local speech synthesis
- **Voice Options**: Multiple voice personalities
- **Speed Control**: Adjustable speech rate
- **Quality**: High-quality audio output

### 3. AI Assistant
- **Local Processing**: Basic commands handled locally
- **OpenRouter Integration**: Advanced AI via API
- **Context Awareness**: Conversation memory
- **System Integration**: Control TauOS features

### 4. Voice Commands
```bash
# System Commands
"Open browser" → Launch Tau Browser
"Open settings" → Launch Tau Settings
"Open mail" → Launch TauMail
"Open cloud" → Launch TauCloud

# File Operations
"Create document" → Open text editor
"Show files" → Open Tau Explorer
"Search for..." → File search

# System Control
"Volume up/down" → Adjust system volume
"Brightness up/down" → Adjust screen brightness
"Lock screen" → Lock TauOS
"Shutdown" → System shutdown

# Web Commands
"Search for..." → Web search
"Open website..." → Navigate to URL
"Email to..." → Compose email
```

## Implementation

### Prerequisites
- Python 3.9+
- Node.js 18+
- Audio libraries (ALSA/PulseAudio)
- Docker & Docker Compose

### Quick Start

1. **Clone and Setup**:
```bash
cd tauos/tauvoice
pip install -r requirements.txt
npm install
```

2. **Environment Configuration**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Audio Setup**:
```bash
# Check audio devices
python scripts/audio_setup.py

# Test microphone
python scripts/test_mic.py

# Test speakers
python scripts/test_speakers.py
```

4. **Start TauVoice**:
```bash
python tauvoice.py
```

5. **Hotkey Setup**:
- Press `Cmd+Shift+V` (macOS) or `Alt+V` (Linux/Windows)
- Say "Hello TauOS" to activate

## Configuration

### Audio Settings
```yaml
audio:
  input_device: "default"
  output_device: "default"
  sample_rate: 16000
  channels: 1
  chunk_size: 1024
```

### Voice Settings
```yaml
voice:
  language: "en-US"
  voice_model: "vosk-model-small-en-us"
  tts_engine: "espeak"
  speech_rate: 1.0
  volume: 0.8
```

### AI Settings
```yaml
ai:
  local_model: "gpt4all"
  openrouter_api_key: "your_api_key"
  openrouter_model: "anthropic/claude-3.5-sonnet"
  max_tokens: 1000
  temperature: 0.7
```

## API Endpoints

### Voice Processing
- `POST /api/voice/stt` - Speech to text
- `POST /api/voice/tts` - Text to speech
- `POST /api/voice/command` - Process voice command

### AI Assistant
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/command` - Execute AI command
- `GET /api/ai/status` - AI service status

### System Integration
- `POST /api/system/launch` - Launch application
- `POST /api/system/control` - System control
- `GET /api/system/status` - System status

## Security Features

- **Offline Processing**: No data sent to cloud
- **Local Storage**: All data stored locally
- **Encrypted Communication**: Secure API calls
- **No Telemetry**: Zero tracking or analytics
- **GDPR Compliant**: Full privacy compliance

## Integration with TauOS

### Desktop Integration
- System-wide hotkey support
- Application launching
- File operations
- System settings control

### Service Integration
- TauMail voice commands
- TauCloud file operations
- Tau Store app management
- System monitoring

## Development

### Local Development
```bash
python tauvoice.py --dev
npm run dev
```

### Testing
```bash
python -m pytest tests/
npm test
```

### Building
```bash
python setup.py build
npm run build
```

## Deployment

### Production Deployment
```bash
./deploy.sh
```

### Docker Deployment
```bash
docker-compose up -d
```

### Environment Variables
- `TAUVOICE_OPENROUTER_API_KEY` - OpenRouter API key
- `TAUVOICE_AUDIO_DEVICE` - Audio device configuration
- `TAUVOICE_LANGUAGE` - Speech recognition language
- `TAUVOICE_MODEL_PATH` - Path to STT model

## Monitoring

- **Health Checks**: `/health` endpoint
- **Audio Monitoring**: Real-time audio levels
- **Performance Metrics**: Response times
- **Error Logging**: Detailed error tracking

## Troubleshooting

### Common Issues

1. **No Audio Input**:
```bash
# Check audio devices
python scripts/audio_setup.py

# Test microphone
python scripts/test_mic.py
```

2. **Poor Recognition**:
```bash
# Update language model
python scripts/update_model.py

# Adjust audio settings
python scripts/configure_audio.py
```

3. **High CPU Usage**:
```bash
# Use smaller model
export TAUVOICE_MODEL=vosk-model-small-en-us

# Enable GPU acceleration
export TAUVOICE_GPU=true
```

## Support

- **Documentation**: https://docs.tauos.org/tauvoice
- **Issues**: GitHub Issues
- **Community**: Discord #tauvoice
- **Email**: tauvoice@tauos.org

## License

MIT License - See LICENSE file for details. 