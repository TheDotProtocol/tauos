#!/usr/bin/env node
/**
 * Verify download manifest URLs return HTTP 200 (or 302 for GitHub).
 * Usage: npm run verify:downloads [-- --base=https://www.tauos.org]
 */
const base =
  process.argv.find((a) => a.startsWith('--base='))?.split('=')[1] ??
  'https://www.tauos.org';

async function checkUrl(label, url) {
  if (!url) return { label, ok: false, error: 'empty url' };
  const full = url.startsWith('http') ? url : `${base.replace(/\/$/, '')}${url}`;
  try {
    const res = await fetch(full, { method: 'HEAD', redirect: 'follow' });
    const ok = res.ok || res.status === 302;
    return { label, url: full, ok, status: res.status };
  } catch (err) {
    return { label, url: full, ok: false, error: err.message };
  }
}

async function main() {
  const manifestUrl = `${base.replace(/\/$/, '')}/downloads/manifest.json`;
  const res = await fetch(manifestUrl);
  if (!res.ok) {
    console.error(`Failed to load manifest: ${res.status}`);
    process.exit(1);
  }
  const manifest = await res.json();
  console.log(`\nVerify downloads — manifest ${manifest.version} @ ${base}\n`);

  const available = manifest.artifacts.filter((a) => a.available);
  let failed = 0;
  for (const a of available) {
    const r = await checkUrl(a.label, a.url);
    if (r.ok) {
      console.log(`  ✓ ${a.label} (${r.status})`);
    } else {
      failed++;
      console.error(`  ✗ ${a.label}: ${r.error || r.status} — ${r.url}`);
    }
  }

  const browserBase =
    'https://github.com/TheDotProtocol/tauos/releases/download/taubrowser-v1.0.0-beta.2';
  for (const name of [
    'TauBrowser_1.0.0-beta.2_x64-setup.exe',
    'TauBrowser_1.0.0-beta.2_aarch64.dmg',
    'TauBrowser_1.0.0-beta.2_x64.dmg',
    'TauBrowser_1.0.0-beta.2_amd64.AppImage',
  ]) {
    const r = await checkUrl(`Tau Browser ${name}`, `${browserBase}/${name}`);
    if (r.ok) console.log(`  ✓ Tau Browser ${name} (${r.status})`);
    else console.log(`  ○ Tau Browser ${name} — pending release (${r.error || r.status})`);
  }

  console.log(`\n${available.length - failed}/${available.length} OS artifacts OK\n`);
  if (failed) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
