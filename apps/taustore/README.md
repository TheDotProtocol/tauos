# Tau Store - Privacy-First Application Marketplace

## Overview

Tau Store is a modern, privacy-focused application marketplace for TauOS. Built with GTK4 and Rust, it provides a seamless experience for discovering, installing, and managing applications while prioritizing user privacy and security.

## Features

### 🛍️ **App Discovery**
- **Browse by Category**: Internet, Communication, Productivity, Multimedia, Graphics, Development
- **Search & Filter**: Find apps by name, description, or category
- **Advanced Filters**: Installed only, Open source only, Privacy score filtering
- **Sort Options**: By name, rating, privacy score, or size

### 🛡️ **Privacy-First Design**
- **Privacy Badges**: Visual indicators for app privacy scores (0-100)
- **Telemetry Tracking**: Clear indicators for apps that collect data
- **Permission Transparency**: Detailed permission requirements for each app
- **Open Source Indicators**: Highlight open source applications

### 📱 **Modern Interface**
- **Responsive Design**: Adapts to different screen sizes
- **Dark Theme**: Consistent with TauOS design language
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: Full keyboard navigation and screen reader support

### 🔧 **App Management**
- **One-Click Install**: Streamlined installation process
- **Update Management**: Automatic and manual update notifications
- **Uninstall**: Easy app removal with cleanup
- **Installation Progress**: Real-time progress indicators

### 📊 **App Information**
- **Detailed Descriptions**: Comprehensive app information
- **Developer Information**: Clear attribution and contact details
- **Version History**: Track app updates and changes
- **User Reviews**: Community ratings and feedback

## Installation

### Prerequisites
- Rust 1.70+ and Cargo
- GTK4 development libraries
- TauOS development environment

### Build Instructions

```bash
# Navigate to the Tau Store directory
cd tauos/apps/taustore

# Build the application
cargo build --release

# Run the application
cargo run
```

### Dependencies

Add to `Cargo.toml`:
```toml
[dependencies]
gtk = { version = "0.7", features = ["v4_8"] }
glib = "0.18"
gio = "0.18"
adw = "0.5"
gdk = "0.7"
gdk-pixbuf = "0.18"
cairo-rs = "0.18"
pango = "0.18"
```

## Usage

### Basic Navigation

1. **Launch Tau Store**: Access from TauOS desktop or terminal
2. **Browse Categories**: Use the sidebar to filter by category
3. **Search Apps**: Use the search bar to find specific applications
4. **View Details**: Click "Details" for comprehensive app information
5. **Install Apps**: Click "Install" to download and install applications

### Privacy Features

- **Privacy Score**: Each app displays a privacy score (0-100)
  - 90-100: Excellent privacy (Green badge)
  - 70-89: Good privacy (Yellow badge)
  - 0-69: Poor privacy (Red badge)

- **Telemetry Indicators**: Clear labels for apps that collect data
- **Permission Transparency**: Detailed breakdown of app permissions
- **Open Source Filter**: Filter to show only open source applications

### Advanced Features

- **Sort Options**: Sort apps by name, rating, privacy score, or size
- **Filter Combinations**: Combine multiple filters for precise results
- **Installation Queue**: Manage multiple app installations
- **Update Notifications**: Get notified when updates are available

## App Categories

### 🌐 **Internet**
- Web browsers (Tau Browser, Firefox)
- Email clients (TauMail)
- Communication tools

### 💬 **Communication**
- Email applications
- Messaging platforms
- Video conferencing tools

### 📊 **Productivity**
- Office suites (LibreOffice)
- Cloud storage (TauCloud)
- Task management tools

### 🎵 **Multimedia**
- Media players (Tau Media Player, VLC)
- Audio editing software
- Video editing tools

### 🎨 **Graphics**
- Image editors (GIMP)
- Vector graphics software
- Photo management tools

### 🔧 **Development**
- Code editors
- IDEs and development tools
- Version control applications

## Privacy Scoring System

The privacy score is calculated based on several factors:

### **High Privacy (90-100)**
- No telemetry or data collection
- Open source code
- Minimal permissions required
- Local data processing
- No third-party dependencies

### **Good Privacy (70-89)**
- Limited telemetry (optional)
- Open source with some closed components
- Reasonable permission requirements
- Transparent data handling

### **Poor Privacy (0-69)**
- Extensive telemetry
- Closed source
- Excessive permissions
- Third-party data sharing

## Development

### Architecture

```
tauos/apps/taustore/
├── src/
│   ├── main.rs          # Main application entry point
│   └── taustore.css     # Custom styling
├── Cargo.toml           # Dependencies and build config
└── README.md           # This file
```

### Key Components

- **TauStore**: Main application state management
- **App**: Individual application data structure
- **UI Components**: GTK4 widgets and layouts
- **CSS Styling**: Custom TauOS theme integration

### Adding New Apps

To add a new application to the store:

1. **Update App Data**: Add app information to the `apps` vector in `main.rs`
2. **Create Icon**: Add app icon to the icons directory
3. **Set Privacy Score**: Calculate and assign privacy score
4. **Test Installation**: Verify installation process works correctly

### Example App Entry

```rust
App {
    id: "app-name".to_string(),
    name: "App Display Name".to_string(),
    description: "Detailed app description".to_string(),
    category: "Category".to_string(),
    version: "1.0.0".to_string(),
    size: "50 MB".to_string(),
    rating: 4.5,
    privacy_score: 85,
    is_installed: false,
    icon_path: Some("icons/app-icon.png".to_string()),
    developer: "Developer Name".to_string(),
    price: "Free".to_string(),
    open_source: true,
    telemetry: false,
    permissions: vec!["Permission 1".to_string(), "Permission 2".to_string()],
}
```

## Integration with TauOS

### **TauPkg Integration**
- Automatic package management
- Dependency resolution
- Update notifications
- Installation progress tracking

### **System Integration**
- Desktop notifications
- System tray integration
- File association management
- Default app settings

### **Privacy Integration**
- TauID authentication
- Privacy settings sync
- Permission management
- Data collection controls

## Security Features

### **App Verification**
- Digital signature verification
- Checksum validation
- Source code review process
- Security audit requirements

### **Installation Security**
- Sandboxed installations
- Permission isolation
- Malware scanning
- Update integrity checks

### **Privacy Protection**
- No user tracking
- Local data processing
- Transparent permissions
- Privacy-first defaults

## Performance

### **Optimization Features**
- Lazy loading of app data
- Efficient search algorithms
- Cached app information
- Background update checks

### **Resource Usage**
- Minimal memory footprint
- Efficient UI rendering
- Optimized network requests
- Smart caching strategies

## Accessibility

### **Keyboard Navigation**
- Full keyboard support
- Customizable shortcuts
- Focus management
- Screen reader compatibility

### **Visual Accessibility**
- High contrast mode support
- Scalable text sizes
- Color blind friendly design
- Reduced motion options

## Troubleshooting

### **Common Issues**

1. **App Not Installing**
   - Check network connection
   - Verify package repository
   - Check system permissions
   - Review error logs

2. **Search Not Working**
   - Clear search cache
   - Restart application
   - Check app database
   - Verify indexing

3. **Performance Issues**
   - Clear application cache
   - Restart Tau Store
   - Check system resources
   - Update application

### **Debug Mode**

Enable debug logging:
```bash
RUST_LOG=debug cargo run
```

## Contributing

### **Development Setup**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

### **Code Style**

- Follow Rust conventions
- Use meaningful variable names
- Add comprehensive comments
- Include error handling
- Write unit tests

### **Testing**

```bash
# Run unit tests
cargo test

# Run integration tests
cargo test --test integration

# Run with coverage
cargo tarpaulin
```

## License

Tau Store is licensed under the MIT License. See LICENSE file for details.

## Support

### **Documentation**
- [TauOS Documentation](https://tauos.org/docs)
- [Developer Guide](https://tauos.org/dev)
- [API Reference](https://tauos.org/api)

### **Community**
- [Discord Server](https://discord.gg/tauos)
- [GitHub Issues](https://github.com/TheDotProtocol/tauos/issues)
- [Reddit Community](https://reddit.com/r/tauos)

### **Contact**
- Email: support@tauos.org
- Twitter: @tauos_org
- GitHub: @TheDotProtocol

---

**Tau Store** - Privacy-First Application Marketplace for TauOS 