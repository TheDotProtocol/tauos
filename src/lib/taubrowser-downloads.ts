export type PlatformId = 'windows' | 'macos' | 'macos-arm' | 'linux' | 'android' | 'ios';

export type DownloadTarget = {
  id: PlatformId;
  label: string;
  description: string;
  format: string;
  url: string;
  version: string;
  available: boolean;
};

const VERSION = '1.0.0-beta.2';
const RELEASE_BASE =
  process.env.TAUBROWSER_RELEASE_BASE ??
  'https://github.com/TheDotProtocol/tauos/releases/download/taubrowser-v1.0.0-beta.2';

/** Artifact URLs — populated by GitHub Actions release builds. */
export const DOWNLOAD_TARGETS: DownloadTarget[] = [
  {
    id: 'windows',
    label: 'Windows',
    description: 'Windows 10/11 (64-bit)',
    format: '.exe',
    url: `${RELEASE_BASE}/TauBrowser_${VERSION}_x64-setup.exe`,
    version: VERSION,
    available: true,
  },
  {
    id: 'macos-arm',
    label: 'macOS (Apple Silicon)',
    description: 'macOS 12+ — M1/M2/M3/M4',
    format: '.dmg',
    url: `${RELEASE_BASE}/TauBrowser_${VERSION}_aarch64.dmg`,
    version: VERSION,
    available: true,
  },
  {
    id: 'macos',
    label: 'macOS (Intel)',
    description: 'macOS 12+ — Intel Macs',
    format: '.dmg',
    url: `${RELEASE_BASE}/TauBrowser_${VERSION}_x64.dmg`,
    version: VERSION,
    available: true,
  },
  {
    id: 'linux',
    label: 'Linux',
    description: 'Ubuntu, Debian, Fedora, Arch',
    format: '.AppImage',
    url: `${RELEASE_BASE}/TauBrowser_${VERSION}_amd64.AppImage`,
    version: VERSION,
    available: true,
  },
  {
    id: 'android',
    label: 'Android',
    description: 'Android 10+ (APK)',
    format: '.apk',
    url: `${RELEASE_BASE}/TauBrowser_${VERSION}_universal.apk`,
    version: VERSION,
    available: true,
  },
  {
    id: 'ios',
    label: 'iOS',
    description: 'iPhone & iPad — TestFlight / App Store',
    format: 'TestFlight',
    url: 'https://testflight.apple.com/join/taubrowser',
    version: VERSION,
    available: false,
  },
];

export function detectPlatform(userAgent: string): PlatformId {
  const ua = userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
  if (ua.includes('mac os') || ua.includes('macintosh')) {
    return ua.includes('arm') || ua.includes('aarch64') ? 'macos-arm' : 'macos-arm';
  }
  if (ua.includes('win')) return 'windows';
  if (ua.includes('linux')) return 'linux';
  return 'linux';
}

export function getDownloadsForAgent(userAgent: string) {
  const detected = detectPlatform(userAgent);
  const recommended = DOWNLOAD_TARGETS.find((t) => t.id === detected) ?? DOWNLOAD_TARGETS[3];
  return {
    version: VERSION,
    detected,
    recommended,
    all: DOWNLOAD_TARGETS,
    domains: ['browser.tauos.org', 'taubrowser.com', 'www.tauos.org/taubrowser'],
  };
}
