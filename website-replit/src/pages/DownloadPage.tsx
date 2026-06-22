import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  Monitor,
  Laptop,
  Server,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  HardDrive,
  AlertCircle,
  Copy,
} from "lucide-react";
import SubPageLayout from "@/layouts/SubPageLayout";
import {
  detectPlatform,
  pickBestArtifact,
  pickIsoArtifact,
  formatBytes,
  type DownloadManifest,
  type DownloadArtifact,
  type DetectedPlatform,
} from "@/lib/downloads";

async function enrichMacArch(detected: DetectedPlatform): Promise<DetectedPlatform> {
  if (detected.platform !== "macos") return detected;
  const nav = navigator as Navigator & {
    userAgentData?: { getHighEntropyValues?: (h: string[]) => Promise<{ architecture?: string }> };
  };
  try {
    const values = await nav.userAgentData?.getHighEntropyValues?.(["architecture"]);
    if (values?.architecture === "arm") {
      return { ...detected, arch: "arm64", label: "macOS (Apple Silicon)" };
    }
    if (values?.architecture === "x86") {
      return { ...detected, arch: "x64", label: "macOS (Intel)" };
    }
  } catch {
    /* keep heuristic */
  }
  return detected;
}

function platformIcon(platform: string) {
  if (platform === "windows") return Monitor;
  if (platform === "macos") return Laptop;
  return Server;
}

function ArtifactRow({ artifact, highlighted }: { artifact: DownloadArtifact; highlighted?: boolean }) {
  const Icon = platformIcon(artifact.platform);

  if (!artifact.available) {
    return (
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg opacity-60">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-gray-400 font-medium">{artifact.label}</p>
            <p className="text-xs text-gray-500">{artifact.description}</p>
          </div>
        </div>
        <span className="text-xs text-primary/80 uppercase tracking-wide">Wave 2</span>
      </div>
    );
  }

  const href = artifact.url.startsWith("http")
    ? artifact.url
    : `https://www.tauos.org${artifact.url.startsWith("/") ? artifact.url : `/${artifact.url}`}`;

  return (
    <a
      href={href}
      download={artifact.filename}
      className={`flex items-center justify-between p-4 rounded-lg border transition-all group ${
        highlighted
          ? "bg-primary/10 border-primary/40 hover:border-primary"
          : "bg-white/5 border-white/10 hover:border-primary/30"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Icon className={`w-5 h-5 shrink-0 ${highlighted ? "text-primary" : "text-gray-400"}`} />
        <div className="min-w-0">
          <p className="text-white font-medium truncate">{artifact.label}</p>
          <p className="text-xs text-gray-400">
            {formatBytes(artifact.size)} · {artifact.arch.toUpperCase()} · {artifact.kind}
          </p>
        </div>
      </div>
      <Download className="w-5 h-5 text-gray-400 group-hover:text-primary shrink-0 ml-2" />
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
    fetch("/downloads/manifest.json")
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
    const order: Array<DownloadArtifact["platform"]> = ["windows", "macos", "linux"];
    return order.map((platform) => ({
      platform,
      label: platform === "windows" ? "Windows" : platform === "macos" ? "macOS" : "Linux",
      items: manifest.artifacts.filter((a) => a.platform === platform && a.kind !== "iso"),
    }));
  }, [manifest]);

  const copySha = async (sha: string) => {
    await navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const DetectedIcon = detected ? platformIcon(detected.platform) : Monitor;

  return (
    <SubPageLayout className="pt-0 bg-black text-white p-0 min-h-screen">
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-6">
              TauOS Desktop Beta 1.0
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Download <span className="text-primary">TauOS</span>
            </h1>
            <p className="text-xl text-gray-400 mb-4 max-w-3xl mx-auto">
              Real bootable ISO for Intel/AMD PCs — Linux 6.14 kernel, Debian Bookworm base, verified SHA256.
            </p>
            <Link to="/beta" className="text-primary hover:underline text-base">
              Beta scope, known issues, and install steps →
            </Link>
            {manifest?.updatedAt && (
              <p className="text-sm text-gray-500 mt-4">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-white/10 bg-white/5 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <DetectedIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Recommended for your system</h2>
                <p className="text-gray-400">{detected ? detected.label : "Detecting platform…"}</p>
              </div>
            </div>

            {recommended?.available ? (
              <a
                href={
                  recommended.url.startsWith("http")
                    ? recommended.url
                    : `https://www.tauos.org${recommended.url}`
                }
                download={recommended.filename}
                className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download {recommended.label} ({formatBytes(recommended.size)})
                <ArrowRight className="w-5 h-5" />
              </a>
            ) : (
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl text-gray-200 text-sm">
                No native USB wizard for {detected?.label ?? "your platform"} yet. Use the bootable ISO
                below (x86_64 PC required).
              </div>
            )}

            {recommended?.available && recommended.sha256 && (
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-mono flex-wrap">
                <span className="break-all">SHA256: {recommended.sha256}</span>
                <button type="button" onClick={() => copySha(recommended.sha256)} className="p-1 hover:text-primary">
                  {copiedSha === recommended.sha256 ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </motion.div>

          {iso?.available && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-primary/30 bg-primary/5 rounded-2xl p-8 mb-8"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <HardDrive className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Bootable TauOS Desktop ISO</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {iso.description}. Flash with Balena Etcher, Rufus, or dd. Live session user{" "}
                    <code className="text-primary">tau</code> — change password before networking.
                  </p>
                </div>
              </div>
              <a
                href={iso.url}
                download={iso.filename}
                className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 hover:bg-primary/20 text-white px-6 py-3 rounded-lg font-medium"
              >
                <Download className="w-5 h-5" />
                {iso.label} ({formatBytes(iso.size)})
              </a>
              <p className="mt-3 text-xs text-gray-500 font-mono break-all">SHA256: {iso.sha256}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-white/10 rounded-xl p-8 mb-12"
          >
            <h3 className="text-xl font-bold mb-2">USB wizards &amp; packages</h3>
            <p className="text-gray-400 text-sm mb-6">
              Platform installers create a bootable USB from macOS, Windows, or Linux.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {grouped.map(({ platform, label, items }) => (
                <div key={platform}>
                  <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">{label}</h4>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Shield,
                title: "Privacy-first base",
                desc: "Debian Bookworm with TauOS services, NetworkManager, and hardened defaults.",
              },
              {
                icon: Zap,
                title: "Verified artifacts",
                desc: "Manifest-driven downloads with published SHA256 checksums.",
              },
              {
                icon: HardDrive,
                title: "Real OS pipeline",
                desc: "Linux 6.14 kernel compiled from source — not a demo image.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-white/10 bg-white/5 rounded-xl p-6">
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="border border-white/10 rounded-xl p-8 text-sm text-gray-400">
            <h3 className="text-xl font-bold text-white mb-4">Installation</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-white font-semibold mb-2">Path A — Bootable ISO</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Download the x86_64 ISO</li>
                  <li>Flash to USB (Etcher / Rufus / dd)</li>
                  <li>Boot and run <code className="text-primary">sudo tauos-install</code> for disk install</li>
                </ol>
              </div>
              <div>
                <p className="text-white font-semibold mb-2">Path B — USB wizard</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Download the installer for your OS above</li>
                  <li>Run the TauOS USB wizard</li>
                  <li>Select drive — wizard writes the bootable image</li>
                </ol>
              </div>
            </div>
            <p className="mt-6 text-primary/90">
              Tau Mobile OS is Wave 2 — not included in this download. Use Tau Mail and Tau Cloud in your browser on
              any device today.
            </p>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
}
