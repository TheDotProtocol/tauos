# Tau OS Developer SDK & App Ecosystem

Tau OS makes it easy and fun to build secure, modern apps for mobile and desktop.

## Features
- **CLI Tools (`tau-sdk`)**: Scaffold, build, package, and debug Tau OS apps
- **Language Bindings**: C, Rust, Python
- **GUI Toolkit**: GTK pre-configured for Tau OS look & feel
- **Local Emulator**: QEMU-based, runs full Tau OS images
- **App Types**: Native TauPkg, Web apps (TauWebView)
- **Permissions**: Declared in `manifest.tau`
- **Testing**: Container sandbox for safe app testing

## Installation
```
cargo install tau-sdk
# or
curl -sSL https://tauos.org/install-sdk.sh | sh
```

## CLI Reference
```
tau-sdk new <app-name>      # Scaffold a new app
	--lang <c|rust|python|web>
tau-sdk build               # Build the app

tau-sdk package             # Create a .tau-pkg

tau-sdk run                 # Run app in local sandbox

tau-sdk test                # Run tests in emulator

tau-sdk publish             # Submit to TauStore
```

## Language Bindings
- **C**: Native API headers in `/usr/include/tauos/`
- **Rust**: `tauos` crate
- **Python**: `tauos` PyPI package

## GUI Toolkit
- GTK pre-configured with Tau OS Black & Gold theme
- Simple API for launching windows, dialogs, notifications

## Emulator
- QEMU backend for local testing
- CLI: `tau-sdk emu`

## App Packaging & Permissions
- Apps must include a `manifest.tau` declaring permissions
- Use `tau-sdk package` to bundle app, manifest, and resources

## Example Workflow
```
tau-sdk new tau-editor --lang rust
cd tau-editor
# Write your app code
vim src/main.rs

tau-sdk build

tau-sdk run

tau-sdk package

tau-sdk publish
```

---

**Tau OS: Build. Test. Ship. Securely.** 