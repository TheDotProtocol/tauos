'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  CheckCircle,
  Copy,
  ArrowRight,
  ArrowLeft,
  Monitor,
  Laptop,
  Server,
  Rocket,
} from 'lucide-react';
import {
  pickBestArtifact,
  formatBytes,
  type DownloadManifest,
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
      'Run the downloaded installer',
      'Accept the Tau Core EULA in the setup wizard',
      'Connect to Wi‑Fi, create your Tau ID, then use the desktop',
    ];
  }
  if (platform === 'windows') {
    return [
      'Run the downloaded Setup.exe',
      'Accept the EULA and follow the installer wizard',
      'Boot from USB or launch Tau Core — complete setup (Wi‑Fi, Tau ID)',
    ];
  }
  return [
    'Install: sudo dpkg -i tauos-*.deb (Debian/Ubuntu)',
    'Or run the AppImage with execute permission',
    'On first boot: EULA → Wi‑Fi → Tau ID → desktop',
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
      className="mb-12 rounded-xl border border-[#d4af37]/30 bg-[#171717] p-6 sm:p-8 shadow-[0_12px_24px_rgba(212,175,55,0.06)]"
    >
      <div className="mb-6 flex items-center gap-2">
        <Rocket className="size-5 text-[#d4af37]" />
        <h2 className="text-xl font-bold text-white">One-click install wizard</h2>
        <span className="ml-auto rounded-full bg-[#3a3114] px-2 py-0.5 text-xs font-semibold text-[#d4af37]">
          Public Beta
        </span>
      </div>

      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-[#d4af37]' : 'bg-[#2a2a2a]'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="mb-2 text-lg font-semibold text-white">Step 1 — Detect platform</h3>
            <p className="mb-4 text-sm text-[#8e8e93]">
              We detected your system automatically. Confirm or pick another build below.
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-[#2a2820] bg-[#0f0f0f] p-4">
              <Icon className="size-8 text-[#d4af37]" />
              <div>
                <p className="font-medium text-white">{detected?.label ?? 'Unknown platform'}</p>
                <p className="text-xs text-[#666]">Version {manifest.version}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-6 flex items-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3 font-semibold text-[#0f0f0f] hover:bg-[#e0bc4a]"
            >
              Continue <ArrowRight className="size-4" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="mb-2 text-lg font-semibold text-white">Step 2 — Download</h3>
            {artifact?.available ? (
              <>
                <p className="mb-4 text-sm text-[#8e8e93]">
                  Recommended: <strong className="text-white">{artifact.label}</strong> (
                  {formatBytes(artifact.size)})
                </p>
                <a
                  href={artifact.url}
                  download={artifact.filename}
                  className="mb-4 inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3 font-semibold text-[#0f0f0f] hover:bg-[#e0bc4a]"
                >
                  <Download className="size-5" /> Download {artifact.label}
                </a>
                {artifact.sha256 ? (
                  <div className="flex items-center gap-2 break-all font-mono text-xs text-[#666]">
                    SHA256: {artifact.sha256.slice(0, 24)}…
                    <button
                      type="button"
                      onClick={copySha}
                      className="p-1 hover:text-[#d4af37]"
                      title="Copy SHA256"
                    >
                      {copied ? (
                        <CheckCircle className="size-4 text-emerald-400" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mb-4 text-sm text-[#d4af37]">
                No installer available for {detected?.label}. Choose another platform from the list below.
              </p>
            )}
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 rounded-lg border border-[#2a2820] bg-[#0f0f0f] px-4 py-2 hover:border-[#d4af37]"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1 rounded-lg bg-[#d4af37] px-6 py-2 font-semibold text-[#0f0f0f] hover:bg-[#e0bc4a]"
              >
                Continue <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="mb-2 text-lg font-semibold text-white">Step 3 — Install</h3>
            <ol className="mb-6 list-inside list-decimal space-y-2 text-sm text-[#a0a0a0]">
              {installInstructions(artifact?.platform ?? detected?.platform ?? 'linux').map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1 rounded-lg border border-[#2a2820] bg-[#0f0f0f] px-4 py-2 hover:border-[#d4af37]"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-1 rounded-lg bg-[#d4af37] px-6 py-2 font-semibold text-[#0f0f0f] hover:bg-[#e0bc4a]"
              >
                Continue <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="mb-2 text-lg font-semibold text-white">Step 4 — Launch Tau Core</h3>
            <p className="mb-4 text-sm text-[#8e8e93]">Sign up for Tau ID, then open your apps:</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                  className="rounded-lg border border-[#2a2820] bg-[#0f0f0f] p-3 text-center text-sm text-white transition-colors hover:border-[#d4af37] hover:text-[#d4af37]"
                >
                  {label}
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="mt-6 flex items-center gap-1 rounded-lg border border-[#2a2820] bg-[#0f0f0f] px-4 py-2 hover:border-[#d4af37]"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
