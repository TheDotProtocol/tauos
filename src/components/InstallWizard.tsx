'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, CheckCircle, Copy, ArrowRight, ArrowLeft, Monitor, Laptop, Server, Rocket,
} from 'lucide-react';
import {
  detectPlatform,
  pickBestArtifact,
  formatBytes,
  type DownloadManifest,
  type DownloadArtifact,
  type DetectedPlatform,
} from '@/lib/downloads';

type Step = 1 | 2 | 3 | 4;

function platformIcon(platform: string) {
  if (platform === 'windows') return Monitor;
  if (platform === 'macos') return Laptop;
  return Server;
}

function installInstructions(platform: string): string[] {
  if (platform === 'macos') {
    return [
      'Open the downloaded .dmg file',
      'Drag TauOS to Applications',
      'Launch from Applications — allow if Gatekeeper prompts',
    ];
  }
  if (platform === 'windows') {
    return [
      'Run the downloaded Setup.exe',
      'Follow the installer wizard',
      'Launch TauOS from Start menu',
    ];
  }
  return [
    'Install: sudo dpkg -i tauos-*.deb (Debian/Ubuntu)',
    'Or: sudo rpm -i tauos-*.rpm (Fedora/RHEL)',
    'Launch TauOS from your app menu',
  ];
}

type Props = {
  manifest: DownloadManifest | null;
  detected: DetectedPlatform | null;
};

export default function InstallWizard({ manifest, detected }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [copied, setCopied] = useState(false);

  const artifact = useMemo(() => {
    if (!manifest || !detected) return null;
    return pickBestArtifact(manifest, detected);
  }, [manifest, detected]);

  const Icon = artifact ? platformIcon(artifact.platform) : Monitor;

  const copySha = async () => {
    if (!artifact?.sha256) return;
    await navigator.clipboard.writeText(artifact.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!manifest) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 bg-gradient-to-br from-purple-900/20 to-gray-900/40 border border-purple-500/30 rounded-2xl p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Rocket className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white">One-click install wizard</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 ml-auto">
          Public Beta
        </span>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-purple-500' : 'bg-gray-700'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="text-lg font-semibold text-white mb-2">Step 1 — Detect platform</h3>
            <p className="text-gray-400 text-sm mb-4">
              We detected your system automatically. Confirm or pick another build below.
            </p>
            <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <Icon className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-white font-medium">{detected?.label ?? 'Unknown platform'}</p>
                <p className="text-xs text-gray-500">Version {manifest.version}</p>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="text-lg font-semibold text-white mb-2">Step 2 — Download</h3>
            {artifact?.available ? (
              <>
                <p className="text-gray-400 text-sm mb-4">
                  Recommended: <strong className="text-white">{artifact.label}</strong> ({formatBytes(artifact.size)})
                </p>
                <a
                  href={artifact.url}
                  download={artifact.filename}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold mb-4"
                >
                  <Download className="w-5 h-5" /> Download {artifact.label}
                </a>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono break-all">
                  SHA256: {artifact.sha256.slice(0, 24)}…
                  <button onClick={copySha} className="p-1 hover:text-white" title="Copy SHA256">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-amber-400 text-sm mb-4">
                No installer available for {detected?.label}. Choose another platform from the list below.
              </p>
            )}
            <div className="flex gap-2 mt-6">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 px-4 py-2 bg-gray-700 rounded-lg">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(3)} className="flex items-center gap-1 px-6 py-2 bg-purple-500 rounded-lg font-semibold">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="text-lg font-semibold text-white mb-2">Step 3 — Install</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm mb-6">
              {installInstructions(artifact?.platform ?? detected?.platform ?? 'linux').map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex items-center gap-1 px-4 py-2 bg-gray-700 rounded-lg">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(4)} className="flex items-center gap-1 px-6 py-2 bg-purple-500 rounded-lg font-semibold">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="text-lg font-semibold text-white mb-2">Step 4 — Launch TAU CORE</h3>
            <p className="text-gray-400 text-sm mb-4">Sign up for Tau ID, then open your apps:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: '/tauid/register', label: 'Tau ID' },
                { href: '/taumail', label: 'Tau Mail' },
                { href: '/taucloud', label: 'Tau Cloud' },
                { href: '/taubrowser', label: 'Tau Browser' },
                { href: '/tautalk', label: 'Tau Talk' },
                { href: '/developers/ide', label: 'TauScript IDE' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="p-3 text-center bg-gray-800/60 border border-gray-700 rounded-lg text-sm text-white hover:border-purple-400 transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="mt-6 flex items-center gap-1 px-4 py-2 bg-gray-700 rounded-lg">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
