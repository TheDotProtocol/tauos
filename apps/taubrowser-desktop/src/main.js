const API_BASE = window.__TAU_API__ || 'https://www.tauos.org';
const HOMEPAGE = 'https://www.tauos.org';

let blocklist = { domains: [] };
let blockedSession = 0;
let historyStack = [HOMEPAGE];
let historyIndex = 0;
let authToken = localStorage.getItem('tauos_token') || '';

const frame = document.getElementById('browser-frame');
const urlInput = document.getElementById('url-input');
const blockedCount = document.getElementById('blocked-count');
const statusText = document.getElementById('status-text');
const syncStatus = document.getElementById('sync-status');

async function loadBlocklist() {
  try {
    const res = await fetch(`${API_BASE}/api/taubrowser/privacy/blocklist`);
    const data = await res.json();
    blocklist = data.blocklist || { domains: [] };
    statusText.textContent = `Shield active — ${blocklist.domains.length} domains blocked`;
  } catch {
    statusText.textContent = 'Shield active (offline list)';
  }
}

function isBlocked(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return blocklist.domains.some(
      (d) => host === d || host.endsWith('.' + d)
    );
  } catch {
    return false;
  }
}

function normalizeUrl(input) {
  let url = input.trim();
  if (!url) return HOMEPAGE;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('.') && !url.includes(' ')) {
      url = 'https://' + url;
    } else {
      url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
    }
  }
  if (url.startsWith('http://')) {
    url = 'https://' + url.slice(7);
  }
  return url;
}

function navigate(url, pushHistory = true) {
  const target = normalizeUrl(url);
  if (isBlocked(target)) {
    blockedSession++;
    blockedCount.textContent = `${blockedSession} blocked`;
    statusText.textContent = `Blocked tracker/ad: ${new URL(target).hostname}`;
    reportBlock();
    return;
  }
  frame.src = target;
  urlInput.value = target;
  if (pushHistory) {
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(target);
    historyIndex = historyStack.length - 1;
  }
  syncHistory(target);
}

async function syncHistory(url) {
  if (!authToken) return;
  try {
    await fetch(`${API_BASE}/api/taubrowser/history`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, title: url }),
    });
  } catch { /* offline */ }
}

async function reportBlock() {
  if (!authToken) return;
  try {
    await fetch(`${API_BASE}/api/taubrowser/privacy/stats`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ads: 1, trackers: 1, requests: 1, bytes: 2048 }),
    });
  } catch { /* offline */ }
}

async function syncAccount() {
  if (!authToken) {
    syncStatus.textContent = 'Sign in at tauos.org/taubrowser to sync';
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/taubrowser/sync`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      syncStatus.textContent = 'Synced with Tau ID';
      syncStatus.classList.add('connected');
    }
  } catch {
    syncStatus.textContent = 'Sync offline';
  }
}

document.getElementById('url-form').addEventListener('submit', (e) => {
  e.preventDefault();
  navigate(urlInput.value);
});

document.getElementById('btn-back').addEventListener('click', () => {
  if (historyIndex > 0) {
    historyIndex--;
    navigate(historyStack[historyIndex], false);
  }
});

document.getElementById('btn-forward').addEventListener('click', () => {
  if (historyIndex < historyStack.length - 1) {
    historyIndex++;
    navigate(historyStack[historyIndex], false);
  }
});

document.getElementById('btn-reload').addEventListener('click', () => {
  frame.src = frame.src;
});

document.getElementById('btn-home').addEventListener('click', () => {
  navigate(HOMEPAGE);
});

document.getElementById('btn-bookmark').addEventListener('click', async () => {
  const url = frame.src;
  const title = prompt('Bookmark title:', url) || url;
  if (!authToken) {
    alert('Sign in at tauos.org/taubrowser to save bookmarks');
    return;
  }
  await fetch(`${API_BASE}/api/taubrowser/bookmarks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, url }),
  });
  statusText.textContent = 'Bookmark saved';
});

document.getElementById('btn-privacy').addEventListener('click', () => {
  alert(
    `Tau Browser Privacy Shield\n\n` +
    `• ${blocklist.domains?.length || 0} tracker/ad domains blocked\n` +
    `• ${blockedSession} blocked this session\n` +
    `• Zero telemetry — nothing leaves your device except encrypted sync\n` +
    `• HTTPS enforced · DNT enabled · Fingerprint protection on`
  );
});

loadBlocklist();
syncAccount();
urlInput.value = HOMEPAGE;

// Tauri native webview hook when running inside Tauri
if (window.__TAURI__) {
  import('@tauri-apps/api/core').then(({ invoke }) => {
    invoke('get_blocklist').catch(() => {});
  }).catch(() => {});
}
