# Tau Core — Public Website & Apps

The public face of Tau OS: marketing site, product apps, and the Tau Core desktop UI preview.

**Download installers:** [tauos.org/download](https://www.tauos.org/download) · [GitHub Releases](https://github.com/TheDotProtocol/tauos/releases)

## Quick start

```bash
git clone https://github.com/TheDotProtocol/tauos.git
cd tauos
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Tau Core Desktop UI preview

- Setup wizard: [/tau-core/setup/](http://localhost:3000/tau-core/setup/)
- Desktop shell: [/tau-core/desktop/](http://localhost:3000/tau-core/desktop/)

## What's in this repo

| Path | Purpose |
|------|---------|
| `src/` | Next.js website + Tau Mail, Talk, Cloud, Browser, ID, Developer Platform |
| `public/tau-core/` | Figma-aligned desktop setup wizard + homescreen |
| `public/downloads/manifest.json` | Download checksums (binaries on GitHub Releases) |

## OS kernel & ISO builds

Kernel, rootfs, ISO pipelines, and Electron installer **source** live in the private companion repo:

**[TheDotProtocol/tauos-core](https://github.com/TheDotProtocol/tauos-core)** (maintainers only)

## Verify downloads

Checksums: [manifest.json](public/downloads/manifest.json) or [/download#checksums](https://www.tauos.org/download#checksums)

## License

See [LICENSE](LICENSE) if present, or contact foundation@tauos.org.
