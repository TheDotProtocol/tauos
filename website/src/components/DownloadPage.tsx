'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Monitor,
  Laptop,
  Server,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  HardDrive,
  AlertCircle,
  Copy,
} from 'lucide-react';
import {
  detectPlatform,
  pickBestArtifact,
  pickIsoArtifact,
  formatBytes,
  type DownloadManifest,
  type DownloadArtifact,
  type DetectedPlatform,
} from '@/lib/downloads';

async function enrichMacArch(detected: DetectedPlatform): Promise<DetectedPlatform> {
  if (detected.platform !== 'macos') return detected;
  const nav = navigator as Navigator & {
    userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> };
  };
  try {
    const values = await nav.userAgentData?.getHighEntropyValues?.(['architecture']);
    if (values?.architecture === 'arm') {
      return { ...detected, arch: 'arm64', label: 'macOS (Apple Silicon)' };
    }
    if (values?.architecture === 'x86') {
      return { ...detected, arch: 'x64', label: 'macOS (Intel)' };
    }
  } catch {
    /* keep heuristic result */
  }
  return detected;
}

function platformIcon(platform: string) {
  if (platform === 'windows') return Monitor;
  if (platform === 'macos') return Laptop;
  return Server;
}

function ArtifactRow({
  artifact,
  highlighted,
}: {
  artifact: DownloadArtifact;
  highlighted?: boolean;
}) {
  const Icon = platformIcon(artifact.platform);

  if (!artifact.available) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg opacity-60">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-gray-400 font-medium">{artifact.label}</p>
            <p className="text-xs text-gray-500">{artifact.description}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wide">Coming soon</span>
      </div>
    );
  }

  return (
    <a
      href={artifact.url}
      download={artifact.filename}
      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 group ${
        highlighted
          ? 'bg-purple-500/10 border-purple-500/40 hover:border-purple-400'
          : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon className={`w-5 h-5 shrink-0 ${highlighted ? 'text-purple-400' : 'text-gray-400'}`} />
        <div className="min-w-0">
          <p className="text-white font-medium truncate">{artifact.label}</p>
          <p className="text-xs text-gray-400">
            {formatBytes(artifact.size)} · {artifact.arch.toUpperCase()} · {artifact.kind}
          </p>
        </div>
      </div>
      <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-400 shrink-0 ml-2" />
    </a>
  );
}

export default function DownloadPage() {
  const [manifest, setManifest] = useState<DownloadManifest | null>(null);
  const [detected, setDetected] = useState<DetectedPlatform | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const base = detectPlatform();
      const enriched = await enrichMacArch(base);
      if (!cancelled) setDetected(enriched);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    fetch('/downloads/manifest.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Manifest HTTP ${r.status}`);
        return r.json();
      })
      .then((data: DownloadManifest) => setManifest(data))
      .catch((e: Error) => setLoadError(e.message));
  }, []);

  const recommended = useMemo(() => {
    if (!manifest || !detected) return null;
    return pickBestArtifact(manifest, detected);
  }, [manifest, detected]);

  const iso = useMemo(() => (manifest ? pickIsoArtifact(manifest) : null), [manifest]);

  const grouped = useMemo(() => {
    if (!manifest) return [];
    const order: Array<DownloadArtifact['platform']> = ['windows', 'macos', 'linux'];
    return order.map((platform) => ({
      platform,
      label: platform === 'windows' ? 'Windows' : platform === 'macos' ? 'macOS' : 'Linux',
      items: manifest.artifacts.filter((a) => a.platform === platform && a.kind !== 'iso'),
    }));
  }, [manifest]);

  const copySha = async (sha: string) => {
    await navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const DetectedIcon = detected ? platformIcon(detected.platform) : Monitor;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/brand/tauos-logo.svg" alt="TauOS" className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold text-white">TauOS</h1>
                <p className="text-sm text-gray-400">Download</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/beta" className="text-sm text-amber-400 hover:text-amber-300 font-medium">
                Beta 1.0 info →
              </Link>
              <span className="text-sm text-gray-300">v{manifest?.version ?? '1.0.0-beta.1'}</span>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-sm text-amber-400">Beta</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Download{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              TauOS
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-4 max-w-3xl mx-auto">
            Bootable desktop ISO for PCs, plus platform installers to create a USB boot drive.
            <Link href="/beta" className="block mt-2 text-amber-400 hover:text-amber-300 text-base">
              Read Beta 1.0 scope, known issues, and install steps →
            </Link>
          </p>
          {manifest?.updatedAt && (
            <p className="text-sm text-gray-500">
              Artifacts updated {new Date(manifest.updatedAt).toLocaleString()}
            </p>
          )}
        </motion.div>

        {loadError && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Could not load download manifest: {loadError}</span>
          </div>
        )}

        {/* Auto-detected recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <DetectedIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Recommended for your system</h2>
                <p className="text-gray-400">
                  {detected ? detected.label : 'Detecting platform…'}
                </p>
              </div>
            </div>
          </div>

          {recommended?.available ? (
            <a
              href={recommended.url}
              download={recommended.filename}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <Download className="w-5 h-5" />
              <span>
                Download {recommended.label} ({formatBytes(recommended.size)})
              </span>
              <ArrowRight className="w-5 h-5" />
            </a>
          ) : (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm">
              No native installer for {detected?.label ?? 'your platform'} yet. Use the bootable ISO
              below, or pick another platform from the list.
            </div>
          )}

          {recommended?.available && recommended.sha256 && (
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-mono flex-wrap">
              <span className="truncate max-w-full">SHA256: {recommended.sha256}</span>
              <button
                type="button"
                onClick={() => copySha(recommended.sha256)}
                className="p-1 hover:text-purple-400"
                aria-label="Copy checksum"
              >
                {copiedSha === recommended.sha256 ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Bootable ISO — always shown */}
        {iso?.available && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <HardDrive className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Bootable TauOS Desktop ISO</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {iso.description} — write to USB with Balena Etcher, Rufus, or dd. x86_64 PCs
                  (Intel/AMD).
                </p>
              </div>
            </div>
            <a
              href={iso.url}
              download={iso.filename}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              {iso.label} ({formatBytes(iso.size)})
            </a>
            <p className="mt-3 text-xs text-gray-500 font-mono break-all">SHA256: {iso.sha256}</p>
          </motion.div>
        )}

        {/* Platform matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-8 mb-12"
        >
          <h3 className="text-xl font-bold text-white mb-2">All downloads</h3>
          <p className="text-gray-400 text-sm mb-6">
            Mac Intel vs Apple Silicon, Windows x64 vs ARM, and Linux packages — pick the build that
            matches your machine.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {grouped.map(({ platform, label, items }) => (
              <div key={platform}>
                <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-3">
                  {label}
                </h4>
                <div className="space-y-3">
                  {items.map((artifact) => (
                    <ArtifactRow
                      key={artifact.id}
                      artifact={artifact}
                      highlighted={recommended?.id === artifact.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Shield,
              title: 'Security hardened',
              desc: 'Privacy-first design with hardened defaults.',
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: Zap,
              title: 'Real artifacts',
              desc: 'Manifest-driven downloads with verified SHA256 checksums.',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: Star,
              title: 'Linux 6.14 + GNOME',
              desc: 'Bootable x86_64 ISO built from the real TauOS pipeline.',
              color: 'from-purple-500 to-pink-500',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Install steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/30 border border-gray-800 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Installation paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400">
            <div>
              <p className="text-white font-semibold mb-2">Path A — Bootable ISO (PC install)</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Download the x86_64 ISO above</li>
                <li>Flash to USB (Etcher / Rufus / dd)</li>
                <li>Boot from USB and follow the on-screen installer</li>
              </ol>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Path B — USB wizard (from macOS/Windows/Linux)</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Download the installer for your OS</li>
                <li>Run the TauOS USB wizard</li>
                <li>Select a drive — the wizard writes the bootable image</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
