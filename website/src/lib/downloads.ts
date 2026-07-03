export type DownloadPlatform = 'macos' | 'windows' | 'linux';
export type DownloadArch = 'x64' | 'arm64' | 'universal';
export type DownloadKind = 'installer' | 'iso' | 'package';

export interface DownloadArtifact {
  id: string;
  label: string;
  platform: DownloadPlatform;
  arch: DownloadArch;
  kind: DownloadKind;
  filename: string;
  url: string;
  size: number;
  sha256: string;
  available: boolean;
  description?: string;
}

export interface DownloadManifest {
  version: string;
  updatedAt: string;
  artifacts: DownloadArtifact[];
}

export interface DetectedPlatform {
  platform: DownloadPlatform;
  arch: DownloadArch;
  label: string;
  userAgent: string;
}

/** Client-side OS + CPU detection for download routing */
export function detectPlatform(): DetectedPlatform {
  if (typeof navigator === 'undefined') {
    return { platform: 'linux', arch: 'x64', label: 'Linux x64', userAgent: '' };
  }

  const ua = navigator.userAgent;
  const platformStr = navigator.platform || '';

  if (/Win/i.test(platformStr) || ua.includes('Windows')) {
    const arch: DownloadArch = /ARM64|aarch64/i.test(ua) ? 'arm64' : 'x64';
    return {
      platform: 'windows',
      arch,
      label: arch === 'arm64' ? 'Windows on ARM' : 'Windows x64',
      userAgent: ua,
    };
  }

  if (/Mac/i.test(platformStr) || ua.includes('Macintosh')) {
    const arch = detectMacArch(ua);
    return {
      platform: 'macos',
      arch,
      label:
        arch === 'arm64'
          ? 'macOS (Apple Silicon)'
          : arch === 'universal'
            ? 'macOS (Universal)'
            : 'macOS (Intel)',
      userAgent: ua,
    };
  }

  if (/Linux/i.test(platformStr) || ua.includes('Linux')) {
    const arch: DownloadArch = /aarch64|arm64|ARM64/i.test(ua) ? 'arm64' : 'x64';
    return {
      platform: 'linux',
      arch,
      label: arch === 'arm64' ? 'Linux ARM64' : 'Linux x64',
      userAgent: ua,
    };
  }

  return { platform: 'linux', arch: 'x64', label: 'Unknown (Linux x64 fallback)', userAgent: ua };
}

function detectMacArch(ua: string): DownloadArch {
  if (/Mac OS X.*ARM64|Apple Silicon|aarch64/i.test(ua)) return 'arm64';
  if (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1) {
    return 'arm64';
  }
  return 'x64';
}

export function pickBestArtifact(
  manifest: DownloadManifest,
  detected: DetectedPlatform
): DownloadArtifact | null {
  const { platform, arch } = detected;
  const available = manifest.artifacts.filter((a) => a.available);

  const rank = (a: DownloadArtifact): number => {
    if (a.platform !== platform) return 100;
    if (a.kind === 'installer' || a.kind === 'package') {
      if (a.arch === arch) return 0;
      if (a.arch === 'universal') return 1;
      if (arch === 'arm64' && a.arch === 'x64') return 3;
      if (arch === 'x64' && a.arch === 'arm64') return 3;
      return 2;
    }
    if (a.kind === 'iso') return 4;
    return 5;
  };

  const sorted = [...available].sort((a, b) => rank(a) - rank(b));
  return sorted[0] ?? null;
}

export function pickIsoArtifact(manifest: DownloadManifest): DownloadArtifact | null {
  return manifest.artifacts.find((a) => a.kind === 'iso' && a.available) ?? null;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(0)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}
