# TauPkg: Tau OS Package Manager

TauPkg is the official package manager for Tau OS, designed for speed, security, and simplicity.

## Features
- Install, remove, update, search, and list packages
- Local package cache and remote repository sync
- Package signature verification
- Handles dependencies and conflicts
- Modular, secure, and extensible

## Usage
```
tau-pkg install <package>
tau-pkg remove <package>
tau-pkg update [<package>]
tau-pkg search <query>
tau-pkg list

# Options
-v, --verbose   Verbose output
-q, --quiet     Quiet mode
```

## Example
```
tau-pkg install tau-editor
```

## Package Manifest Format
TauPkg supports TOML or JSON manifests. Example:

```toml
name = "tau-editor"
version = "1.0.0"
description = "A lightweight text editor for Tau OS."
dependencies = ["gtk4"]
permissions = ["filesystem:ro", "network"]
```

## Build & Install
```
cd pkgmgr
cargo build --release
cp target/release/tau-pkg /usr/bin/
```

## Security
- All packages are signature-verified
- Permission hooks for sandboxing
- Handles dependencies and conflicts gracefully

## Future Plans
- Delta updates
- GUI frontend
- Flatpak/OCI integration
- More advanced dependency resolution

---

**TauPkg: Fast, Secure, and Simple.** 