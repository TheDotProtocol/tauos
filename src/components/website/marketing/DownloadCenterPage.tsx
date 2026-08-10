'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductPageLayout from '@/components/website/product/shared/ProductPageLayout';
import JourneyNav from '@/components/website/marketing/shared/JourneyNav';
import JourneyFooter from '@/components/website/marketing/shared/JourneyFooter';
import { inter } from '@/lib/website/fonts';
import { marketingAssets } from '@/lib/website/marketing-assets';
import {
  detectPlatform,
  formatBytes,
  pickBestArtifact,
  pickIsoArtifact,
  type DownloadArtifact,
  type DownloadManifest,
} from '@/lib/downloads';
import InstallWizard from '@/components/InstallWizard';
import TauMailMobileDownloadSection from '@/components/website/product/shared/TauMailMobileDownloadSection';
import { tauMailMobileDownloads } from '@/lib/taumail-mobile-downloads';
import { websiteRoutes } from '@/lib/website/routes';

const PLATFORM_MATRIX = [
  { platform: 'Windows', arch: 'x64', key: 'installer-windows-x64' },
  { platform: 'Windows', arch: 'ARM64', key: 'installer-windows-arm64' },
  { platform: 'macOS', arch: 'Intel', key: 'installer-macos-x64' },
  { platform: 'macOS', arch: 'Apple Silicon', key: 'installer-macos-arm64' },
  { platform: 'macOS', arch: 'Universal', key: 'installer-macos-universal' },
  { platform: 'Linux', arch: 'x64 (.deb)', key: 'installer-linux-x64-deb' },
  { platform: 'Linux', arch: 'x64 (AppImage)', key: 'installer-linux-x64-appimage' },
  { platform: 'Linux', arch: 'ARM64 (AppImage)', key: 'installer-linux-arm64-appimage' },
  { platform: 'Bootable ISO', arch: 'x86_64', key: 'iso-desktop-x64' },
  { platform: 'Bootable ISO', arch: 'ARM64', key: 'iso-desktop-arm64' },
] as const;

function StatusBadge({ available }: { available: boolean }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
        available ? 'bg-emerald-900/40 text-emerald-400' : 'bg-[#222] text-[#666]'
      }`}
    >
      {available ? 'Available' : 'Coming soon'}
    </span>
  );
}

function DownloadRow({
  artifact,
  highlighted,
}: {
  artifact: DownloadArtifact | undefined;
  highlighted?: boolean;
}) {
  if (!artifact) return <span className="text-[#555]">—</span>;

  return (
    <div className={`flex flex-col gap-1 ${highlighted ? 'text-[#d4af37]' : ''}`}>
      <StatusBadge available={artifact.available} />
      {artifact.available && artifact.url ? (
        <a
          href={artifact.url}
          className="text-[12px] underline hover:text-[#d4af37]"
          download={artifact.filename || undefined}
        >
          Download
        </a>
      ) : (
        <span className="text-[11px] text-[#555]">{artifact.description}</span>
      )}
    </div>
  );
}

export default function DownloadCenterPage() {
  const [manifest, setManifest] = useState<DownloadManifest | null>(null);
  const [detected, setDetected] = useState<ReturnType<typeof detectPlatform> | null>(null);

  useEffect(() => {
    setDetected(detectPlatform());
    fetch('/downloads/manifest.json')
      .then((r) => r.json())
      .then(setManifest)
      .catch(() => setManifest(null));
  }, []);

  const artifactMap = useMemo(() => {
    const map = new Map<string, DownloadArtifact>();
    manifest?.artifacts.forEach((a) => map.set(a.id, a));
    return map;
  }, [manifest]);

  const recommended = manifest && detected ? pickBestArtifact(manifest, detected) : null;
  const iso = manifest ? pickIsoArtifact(manifest) : null;

  return (
    <ProductPageLayout>
      <JourneyNav active="download" />

      <section className={`${inter.className} px-6 pb-16 pt-20 text-center md:px-20`}>
        <p className="text-xs font-bold uppercase text-[#d4af37]">Get Started</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight md:text-6xl">Download Tau Core</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8e8e93]">
          Install Tau Core on Windows (x64 &amp; ARM64), macOS (Intel &amp; Apple Silicon), and Linux.
          Download the installer, accept the EULA, connect to Wi‑Fi, create your Tau ID, and start using your desktop.
        </p>
        {detected && (
          <p className="mt-3 text-sm text-[#8e8e93]">
            Detected: <span className="text-[#d4af37]">{detected.label}</span>
          </p>
        )}
      </section>

      {recommended && (
        <section className={`${inter.className} px-6 pb-12 md:px-20`}>
          <div className="mx-auto flex max-w-[900px] flex-col gap-6 rounded-xl border border-[#d4af37]/30 bg-[#171717] p-8 md:flex-row md:items-center md:justify-between">
            <div className="text-left">
              <p className="text-xs font-bold uppercase text-[#d4af37]">Recommended for your device</p>
              <h2 className="mt-2 text-2xl font-bold">{recommended.label}</h2>
              <p className="mt-2 text-sm text-[#8e8e93]">{recommended.description}</p>
              {recommended.size > 0 && (
                <p className="mt-1 text-xs text-[#555]">Size: {formatBytes(recommended.size)}</p>
              )}
            </div>
            {recommended.available && recommended.url ? (
              <a
                href={recommended.url}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#d4af37] px-8 text-sm font-bold text-[#0f0f0f]"
                download={recommended.filename || undefined}
              >
                <Image src={marketingAssets.download.download} alt="" width={16} height={16} />
                Download Installer
              </a>
            ) : (
              <span className="text-sm text-[#666]">Build pending for your architecture</span>
            )}
          </div>
        </section>
      )}

      <TauMailMobileDownloadSection id="taumail-mobile" />

      <section className={`${inter.className} px-6 pb-12 md:px-20`}>
        <div className="mx-auto max-w-[900px] rounded-lg border border-[#2a2820] bg-[#171717] p-8">
          <h3 className="text-lg font-bold">Tau ecosystem mobile apps</h3>
          <p className="mt-2 text-sm text-[#8e8e93]">
            Tau Mail runs natively on Android and iOS. Use webmail in the browser anytime at taumail.org.
          </p>
          <div className="mt-6 overflow-x-auto rounded-lg border border-[#2a2a2a]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#0f0f0f] text-[11px] font-bold uppercase text-[#d4af37]">
                  <th className="px-4 py-3">App</th>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Download</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#2a2a2a]">
                  <td className="px-4 py-3 font-semibold">Tau Mail</td>
                  <td className="px-4 py-3 text-[#8e8e93]">Android (APK)</td>
                  <td className="px-4 py-3">
                    <StatusBadge available={tauMailMobileDownloads.android.available} />
                  </td>
                  <td className="px-4 py-3">
                    {tauMailMobileDownloads.android.available ? (
                      <a
                        href={tauMailMobileDownloads.android.url}
                        className="font-semibold text-[#d4af37] underline"
                        download={tauMailMobileDownloads.android.filename}
                      >
                        {tauMailMobileDownloads.android.buttonLabel}
                      </a>
                    ) : (
                      <span className="text-[#666]">{tauMailMobileDownloads.android.buttonLabel} — release pending</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-[#2a2a2a]">
                  <td className="px-4 py-3 font-semibold">Tau Mail</td>
                  <td className="px-4 py-3 text-[#8e8e93]">iOS</td>
                  <td className="px-4 py-3">
                    <StatusBadge available={tauMailMobileDownloads.ios.available} />
                  </td>
                  <td className="px-4 py-3">
                    {tauMailMobileDownloads.ios.available ? (
                      <a
                        href={tauMailMobileDownloads.ios.url}
                        className="font-semibold text-[#d4af37] underline"
                        download={tauMailMobileDownloads.ios.filename}
                      >
                        {tauMailMobileDownloads.ios.buttonLabel}
                      </a>
                    ) : (
                      <span className="text-[#666]">{tauMailMobileDownloads.ios.buttonLabel} — release pending</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">TauTalk</td>
                  <td className="px-4 py-3 text-[#8e8e93]">Android (APK)</td>
                  <td className="px-4 py-3">
                    <StatusBadge available={Boolean(artifactMap.get('tautalk-android-apk')?.available)} />
                  </td>
                  <td className="px-4 py-3">
                    {artifactMap.get('tautalk-android-apk')?.available ? (
                      <a
                        href={artifactMap.get('tautalk-android-apk')!.url}
                        className="font-semibold text-[#d4af37] underline"
                        download
                      >
                        Download for Android
                      </a>
                    ) : (
                      <span className="text-[#666]">—</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <a href="/taumail#mobile-apps" className="mt-4 inline-block text-sm font-semibold text-[#d4af37] underline">
            Tau Mail product page →
          </a>
        </div>
      </section>

      <section className={`${inter.className} px-6 pb-12 md:px-20`}>
        <div className="mx-auto max-w-[900px]">
          <InstallWizard manifest={manifest} detected={detected} />
        </div>
      </section>

      {iso && (
        <section className={`${inter.className} px-6 pb-12 md:px-20`}>
          <div className="mx-auto max-w-[900px] rounded-lg border border-[#2a2a2a] bg-[#171717] p-6">
            <h3 className="text-lg font-bold">Bootable ISO (direct install on PC / VM)</h3>
            <p className="mt-2 text-sm text-[#8e8e93]">
              For bare-metal or virtual machine installs. Flash to USB with the platform installer or{' '}
              <code className="text-[#d4af37]">dd</code> on Linux.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <StatusBadge available={iso.available} />
              {iso.available && iso.url && (
                <a href={iso.url} className="text-sm font-semibold text-[#d4af37] underline" download>
                  {iso.filename} ({formatBytes(iso.size)})
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <section className={`${inter.className} border-t border-[#2a2a2a] px-6 pb-24 md:px-20`}>
        <div className="mx-auto max-w-[1280px]">
          <h2 className="text-2xl font-extrabold">Platform Matrix</h2>
          <p className="mt-2 text-sm text-[#8e8e93]">
            Version {manifest?.version ?? '…'} · Updated {manifest?.updatedAt ? new Date(manifest.updatedAt).toLocaleDateString() : '…'}
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-[#2a2a2a]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#171717] text-[11px] font-bold uppercase text-[#d4af37]">
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-4 py-4">Architecture</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORM_MATRIX.map((row) => {
                  const artifact = artifactMap.get(row.key);
                  const isHighlight =
                    recommended?.id === row.key ||
                    (detected?.platform === 'windows' && row.platform === 'Windows') ||
                    (detected?.platform === 'macos' && row.platform === 'macOS') ||
                    (detected?.platform === 'linux' && row.platform === 'Linux' && row.key.includes('linux'));
                  return (
                    <tr key={row.key} className="border-b border-[#2a2a2a] last:border-0">
                      <td className="px-6 py-4 font-semibold">{row.platform}</td>
                      <td className="px-4 py-4 text-[#8e8e93]">{row.arch}</td>
                      <td className="px-4 py-4">
                        <DownloadRow artifact={artifact} highlighted={isHighlight} />
                      </td>
                      <td className="px-6 py-4 text-[#8e8e93]">
                        {artifact?.available && artifact.url ? (
                          <a href={artifact.url} className="text-[#d4af37] underline" download>
                            {artifact.filename}
                          </a>
                        ) : (
                          artifact?.description ?? '—'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-12 rounded-lg border border-[#2a2a2a] bg-[#171717] p-8">
            <h3 className="text-lg font-bold">Tau Core Desktop UI</h3>
            <p className="mt-2 text-sm text-[#8e8e93]">
              Every installer ships the Figma-aligned first-boot wizard and homescreen — EULA, Wi‑Fi setup, Tau ID, and desktop shell.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <a href="/tau-core/setup/" className="text-sm font-semibold text-[#d4af37] underline">
                Preview setup wizard
              </a>
              <a href="/tau-core/desktop/" className="text-sm font-semibold text-[#d4af37] underline">
                Preview desktop shell
              </a>
              <Link href={websiteRoutes.tauCoreEula} className="text-sm font-semibold text-[#d4af37] underline">
                Tau Core EULA
              </Link>
            </div>
          </div>

          <div id="checksums" className="mt-12 rounded-lg border border-[#2a2a2a] bg-[#171717] p-8">
            <h3 className="text-lg font-bold">Checksums (SHA256)</h3>
            <p className="mt-2 text-sm text-[#8e8e93]">
              Verify downloads from{' '}
              <a
                href="https://github.com/TheDotProtocol/tauos/releases/tag/tauos-v1.0.0"
                className="text-[#d4af37] underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Release tauos-v1.0.0
              </a>
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-[11px] font-bold uppercase text-[#d4af37]">
                    <th className="px-4 py-3">File</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">SHA256</th>
                  </tr>
                </thead>
                <tbody>
                  {manifest?.artifacts
                    .filter((a) => a.available && a.sha256)
                    .map((a) => (
                      <tr key={a.id} className="border-b border-[#2a2a2a] last:border-0">
                        <td className="px-4 py-3 font-mono text-[#ccc]">{a.filename}</td>
                        <td className="px-4 py-3 text-[#8e8e93]">{formatBytes(a.size)}</td>
                        <td className="px-4 py-3 font-mono text-[#666] break-all">{a.sha256}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 rounded-lg border border-[#2a2a2a] bg-[#171717] p-8">
            <h3 className="text-lg font-bold">Installation flow</h3>
            <ol className="mt-4 grid gap-3 text-sm text-[#8e8e93] md:grid-cols-2">
              <li>1. Download the installer or ISO for your platform</li>
              <li>2. Run the Tau Core Setup Wizard</li>
              <li>3. Accept the End User License Agreement (EULA)</li>
              <li>4. Connect to Wi‑Fi and configure preferences</li>
              <li>5. Complete system installation</li>
              <li>6. Create or sign in with Tau ID</li>
              <li>7. Arrive at the Tau Core homescreen</li>
            </ol>
            <Link href={websiteRoutes.tauCoreEula} className="mt-4 inline-block text-sm text-[#d4af37] underline">
              Read the Tau Core EULA
            </Link>
          </div>
        </div>
      </section>

      <JourneyFooter />
    </ProductPageLayout>
  );
}
