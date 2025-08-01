# Tau Media Player

A privacy-first, modern media player for TauOS with support for audio and video playback, playlist management, and seamless integration with the TauOS ecosystem.

## Features

### 🎵 Media Playback
- **Audio Support**: MP3, WAV, FLAC, OGG, AAC
- **Video Support**: MP4, AVI, MKV, MOV, WebM
- **High-Quality Playback**: Hardware acceleration support
- **Streaming Support**: HTTP/HTTPS media streams
- **Format Detection**: Automatic codec detection and handling

### 🎛️ Player Controls
- **Play/Pause**: Spacebar or click controls
- **Seek Control**: Clickable progress bar with time display
- **Volume Control**: Slider with visual feedback
- **Previous/Next**: Track navigation
- **Fullscreen Mode**: F11 or double-click video
- **Mini Player**: Compact mode for background playback

### 📋 Playlist Management
- **Drag & Drop**: Intuitive file addition
- **Multiple Formats**: Mixed audio and video files
- **Playlist Persistence**: Save and load playlists
- **Smart Organization**: Auto-sort by type, name, or date
- **Search & Filter**: Quick playlist navigation

### 🎨 Modern Interface
- **TauOS Design Language**: Consistent with system theme
- **Dark Mode**: Eye-friendly dark interface
- **Glassmorphism Effects**: Modern visual styling
- **Responsive Design**: Adapts to window size
- **Accessibility**: Screen reader and keyboard navigation

### 🔒 Privacy & Security
- **Zero Telemetry**: No data collection or analytics
- **Local Playback**: No cloud dependencies
- **Privacy-First**: No tracking or user profiling
- **Secure File Handling**: Safe media file processing

## Installation

### Prerequisites
```bash
# Install system dependencies
sudo apt-get update
sudo apt-get install -y \
    libgtk-4-dev \
    libgstreamer1.0-dev \
    libgstreamer-plugins-base1.0-dev \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    gstreamer1.0-tools
```

### Build from Source
```bash
# Navigate to the Tau Media Player directory
cd tauos/apps/taumedia

# Build the application
cargo build --release

# Install (optional)
cargo install --path .
```

### Run the Application
```bash
# Run from source
cargo run

# Or run the binary
./target/release/taumedia
```

## Usage

### Basic Controls
- **Spacebar**: Play/Pause
- **Left/Right Arrow**: Seek backward/forward
- **Up/Down Arrow**: Volume up/down
- **F11**: Toggle fullscreen
- **Escape**: Close application
- **Ctrl+O**: Open files
- **Ctrl+L**: Open playlist

### Adding Media Files
1. Click "Add Files" button in the sidebar
2. Select one or more media files
3. Files are automatically added to the playlist
4. Click on any file to start playback

### Playlist Management
- **Drag & Drop**: Drag files directly into the playlist
- **Context Menu**: Right-click for additional options
- **Keyboard Navigation**: Use arrow keys to navigate playlist
- **Search**: Type to filter playlist items

### Advanced Features
- **Audio Visualization**: Real-time audio spectrum display
- **Subtitle Support**: Load external subtitle files
- **Audio Track Selection**: Multiple audio track support
- **Video Filters**: Basic video enhancement options
- **Playback Speed**: Adjust playback speed (0.5x - 2x)

## Configuration

### Settings File
The application stores settings in `~/.config/tauos/taumedia/config.toml`:

```toml
[playback]
default_volume = 50
autoplay = false
repeat_mode = "none"  # none, one, all
shuffle = false

[interface]
theme = "dark"  # dark, light, auto
show_visualization = true
mini_player_enabled = false

[privacy]
remember_playlists = true
save_playback_position = true
analytics_enabled = false
```

### Keyboard Shortcuts
```bash
# Playback Controls
Space          - Play/Pause
Left Arrow     - Seek -10s
Right Arrow    - Seek +10s
Up Arrow       - Volume +10%
Down Arrow     - Volume -10%

# Navigation
Ctrl+O         - Open Files
Ctrl+L         - Open Playlist
Ctrl+S         - Save Playlist
Ctrl+Q         - Quit

# Interface
F11            - Toggle Fullscreen
Ctrl+M         - Toggle Mini Player
Ctrl+T         - Toggle Theme
```

## Integration

### TauOS Desktop Integration
- **App Launcher**: Accessible from τ launcher
- **File Associations**: Default media player for supported formats
- **System Tray**: Background playback controls
- **Media Keys**: Hardware media key support

### TauCloud Integration
- **Cloud Storage**: Direct playback from TauCloud
- **Sync Playlists**: Cloud-synced playlist management
- **Offline Mode**: Cached media for offline playback

### System Integration
- **Audio Mixer**: Integration with system volume controls
- **Power Management**: Automatic pause on system sleep
- **Notifications**: Playback status notifications
- **File Manager**: Right-click "Open with Tau Media Player"

## Development

### Project Structure
```
taumedia/
├── src/
│   ├── main.rs              # Main application entry
│   ├── media_player.css     # Media player specific styles
│   ├── player.rs            # Media player backend
│   ├── playlist.rs          # Playlist management
│   ├── ui.rs                # User interface components
│   └── utils.rs             # Utility functions
├── Cargo.toml               # Dependencies and build config
├── README.md                # This file
└── assets/                  # Icons and resources
```

### Building for Development
```bash
# Install development dependencies
cargo install cargo-watch

# Run with hot reload
cargo watch -x run

# Run tests
cargo test

# Check code quality
cargo clippy
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Troubleshooting

### Common Issues

**No Audio Output**
```bash
# Check audio system
pulseaudio --check
# Or for ALSA
alsamixer
```

**Video Not Playing**
```bash
# Install additional codecs
sudo apt-get install ubuntu-restricted-extras
```

**Application Won't Start**
```bash
# Check GTK4 installation
pkg-config --modversion gtk4
# Check GStreamer
gst-inspect-1.0 --version
```

### Debug Mode
```bash
# Run with debug output
RUST_LOG=debug cargo run

# Check GStreamer debug
GST_DEBUG=3 cargo run
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **GStreamer**: Media playback engine
- **GTK4**: User interface framework
- **TauOS Team**: Design and development
- **Open Source Community**: Various dependencies and tools

---

*Tau Media Player - Privacy-first media playback for TauOS* 