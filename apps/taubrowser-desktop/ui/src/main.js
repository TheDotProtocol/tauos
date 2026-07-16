const API_BASE = window.__TAU_API__ || 'https://www.tauos.org';
const HOMEPAGE = 'https://www.tauos.org';

let blocklist = { domains: [] };
let blockedSession = 0;
let settings = { homepage: HOMEPAGE, https_only: true };
let spaces = [];
let tabs = [];
let activeSpaceId = null;
let activeTabId = null;
let authToken = localStorage.getItem('tauos_token') || '';
let nativeBrowser = Boolean(window.__TAURI__?.core?.invoke);
const invoke = nativeBrowser ? window.__TAURI__.core.invoke.bind(window.__TAURI__.core) : null;

const urlInput = document.getElementById('url-input');
const blockedCount = document.getElementById('blocked-count');
const statusText = document.getElementById('status-text');
const syncStatus = document.getElementById('sync-status');
const webviewContainer = document.getElementById('webview-container');
const chromeTop = document.getElementById('chrome-top');
const statusBar = document.getElementById('status-bar');
const spaceBar = document.getElementById('space-bar');
const tabBar = document.getElementById('tab-bar');
const btnNewTab = document.getElementById('btn-new-tab');

async function syncChromeInsets() {
  if (!nativeBrowser || !chromeTop || !statusBar) return;
  const top = chromeTop.getBoundingClientRect().height;
  const bottom = statusBar.getBoundingClientRect().height;
  try {
    await invoke('set_chrome_insets', { top, bottom });
  } catch {
    /* layout will use defaults */
  }
}

function authHeaders() {
  return {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };
}

function activeSpace() {
  return spaces.find((s) => s.id === activeSpaceId) ?? spaces[0];
}

function tabsInActiveSpace() {
  return tabs.filter((t) => t.space_id === activeSpaceId);
}

function activeTab() {
  return tabs.find((t) => t.id === activeTabId) ?? tabsInActiveSpace().find((t) => t.is_active);
}

async function loadBlocklist() {
  try {
    if (nativeBrowser) {
      const data = await invoke('get_blocklist');
      blocklist = data || { domains: [] };
    } else {
      const res = await fetch(`${API_BASE}/api/taubrowser/privacy/blocklist`);
      const data = await res.json();
      blocklist = data.blocklist || { domains: [] };
    }
    statusText.textContent = `Shield active — ${blocklist.domains?.length || blocklist.count || 0} domains blocked`;
  } catch {
    statusText.textContent = 'Shield active (offline list)';
  }
}

function isBlocked(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (blocklist.domains || []).some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

function normalizeUrl(input) {
  let url = input.trim();
  const home = activeSpace()?.homepage || settings.homepage || HOMEPAGE;
  if (!url) return home;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('.') && !url.includes(' ')) {
      url = 'https://' + url;
    } else {
      url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
    }
  }
  if (url.startsWith('http://') && settings.https_only !== false) {
    url = 'https://' + url.slice(7);
  }
  return url;
}

function renderSpaces() {
  if (!spaceBar) return;
  spaceBar.innerHTML = '';
  spaces.forEach((space) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'space-pill' + (space.id === activeSpaceId ? ' active' : '');
    btn.innerHTML = `<span>${space.icon || '🌐'}</span><span>${space.name}</span>`;
    btn.addEventListener('click', () => switchSpace(space.id));
    spaceBar.appendChild(btn);
  });
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'space-pill add-space';
  add.textContent = '+ Space';
  add.addEventListener('click', createSpace);
  spaceBar.appendChild(add);
  requestAnimationFrame(syncChromeInsets);
}

function renderTabs() {
  if (!tabBar || !btnNewTab) return;
  tabBar.querySelectorAll('.tab-pill').forEach((el) => el.remove());
  tabsInActiveSpace().forEach((tab) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-pill' + (tab.id === activeTabId ? ' active' : '');
    const title = tab.title || new URL(tab.url).hostname;
    btn.innerHTML = `<span>${title}</span><span class="tab-close" data-id="${tab.id}">×</span>`;
    btn.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-close')) {
        e.stopPropagation();
        closeTab(e.target.dataset.id);
      } else {
        switchTab(tab.id);
      }
    });
    tabBar.insertBefore(btn, btnNewTab);
  });
  requestAnimationFrame(syncChromeInsets);
}

async function switchSpace(spaceId) {
  activeSpaceId = spaceId;
  const spaceTabs = tabs.filter((t) => t.space_id === spaceId);
  const active = spaceTabs.find((t) => t.is_active) ?? spaceTabs[0];
  activeTabId = active?.id ?? null;
  renderSpaces();
  renderTabs();
  if (active?.url) {
    urlInput.value = active.url;
    await loadUrlInWebview(active.url, false);
  }
}

async function switchTab(tabId) {
  activeTabId = tabId;
  tabs = tabs.map((t) => ({
    ...t,
    is_active: t.space_id === activeSpaceId && t.id === tabId,
  }));
  const tab = tabs.find((t) => t.id === tabId);
  renderTabs();
  if (tab?.url) {
    urlInput.value = tab.url;
    await loadUrlInWebview(tab.url, false);
  }
  if (authToken && tab) {
    fetch(`${API_BASE}/api/taubrowser/tabs`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ id: tab.id, is_active: true }),
    }).catch(() => {});
  }
}

async function createSpace() {
  const name = prompt('Space name:', 'Work') || 'Work';
  if (authToken) {
    const res = await fetch(`${API_BASE}/api/taubrowser/spaces`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (data.space) {
      await pullSync();
      await switchSpace(data.space.id);
      return;
    }
  }
  const local = {
    id: `local-${Date.now()}`,
    name,
    icon: '🌐',
    homepage: HOMEPAGE,
  };
  spaces.push(local);
  tabs.push({
    id: `tab-${Date.now()}`,
    space_id: local.id,
    url: HOMEPAGE,
    title: 'New Tab',
    is_active: true,
  });
  activeSpaceId = local.id;
  activeTabId = tabs[tabs.length - 1].id;
  renderSpaces();
  renderTabs();
  navigate(HOMEPAGE);
}

async function createTab() {
  if (!activeSpaceId) return;
  if (authToken) {
    const res = await fetch(`${API_BASE}/api/taubrowser/tabs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ space_id: activeSpaceId }),
    });
    const data = await res.json();
    if (data.tab) {
      await pullSync();
      await switchTab(data.tab.id);
      return;
    }
  }
  const tab = {
    id: `tab-${Date.now()}`,
    space_id: activeSpaceId,
    url: activeSpace()?.homepage || HOMEPAGE,
    title: 'New Tab',
    is_active: true,
  };
  tabs.forEach((t) => {
    if (t.space_id === activeSpaceId) t.is_active = false;
  });
  tabs.push(tab);
  activeTabId = tab.id;
  renderTabs();
  navigate(tab.url);
}

async function closeTab(tabId) {
  if (authToken) {
    await fetch(`${API_BASE}/api/taubrowser/tabs?id=${encodeURIComponent(tabId)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).catch(() => {});
    await pullSync();
    const next = tabsInActiveSpace().find((t) => t.is_active) ?? tabsInActiveSpace()[0];
    if (next) await switchTab(next.id);
    return;
  }
  tabs = tabs.filter((t) => t.id !== tabId);
  if (activeTabId === tabId) {
    const next = tabsInActiveSpace()[0];
    activeTabId = next?.id ?? null;
    if (next) await switchTab(next.id);
  }
  renderTabs();
}

async function loadUrlInWebview(url, pushHistory = true) {
  const target = normalizeUrl(url);
  if (isBlocked(target)) {
    blockedSession++;
    blockedCount.textContent = `${blockedSession} blocked`;
    statusText.textContent = `Blocked: ${new URL(target).hostname}`;
    reportBlock();
    return;
  }
  if (nativeBrowser) {
    await invoke('browser_navigate', { url: target });
  } else if (webviewContainer) {
    let frame = document.getElementById('browser-frame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'browser-frame';
      frame.setAttribute(
        'sandbox',
        'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads'
      );
      frame.style.cssText = 'width:100%;height:100%;border:none';
      webviewContainer.appendChild(frame);
    }
    frame.src = target;
  }
  urlInput.value = target;
  const tab = activeTab();
  if (tab) {
    tab.url = target;
    tab.title = new URL(target).hostname;
    renderTabs();
    if (authToken) {
      fetch(`${API_BASE}/api/taubrowser/tabs`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ id: tab.id, url: target, title: tab.title }),
      }).catch(() => {});
    }
  }
  if (pushHistory) syncHistory(target);
}

async function navigate(url, pushHistory = true) {
  await loadUrlInWebview(url, pushHistory);
}

async function syncHistory(url) {
  if (!authToken) return;
  try {
    await fetch(`${API_BASE}/api/taubrowser/history`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ url, title: url }),
    });
  } catch { /* offline */ }
}

async function reportBlock() {
  if (!authToken) return;
  try {
    await fetch(`${API_BASE}/api/taubrowser/privacy/stats`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ ads: 1, trackers: 1, requests: 1, bytes: 2048 }),
    });
  } catch { /* offline */ }
}

async function pullSync() {
  if (!authToken) {
    if (spaces.length === 0) {
      spaces = [{ id: 'local-personal', name: 'Personal', icon: '🌐', homepage: HOMEPAGE }];
      tabs = [{
        id: 'local-tab-1',
        space_id: 'local-personal',
        url: HOMEPAGE,
        title: 'New Tab',
        is_active: true,
      }];
      activeSpaceId = spaces[0].id;
      activeTabId = tabs[0].id;
    }
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/taubrowser/sync`, { headers: authHeaders() });
    if (!res.ok) return;
    const data = await res.json();
    settings = data.settings || settings;
    spaces = data.spaces?.length ? data.spaces : spaces;
    tabs = data.tabs?.length ? data.tabs : tabs;
    activeSpaceId = spaces[0]?.id ?? activeSpaceId;
    activeTabId = tabs.find((t) => t.is_active)?.id ?? tabs[0]?.id ?? activeTabId;
    syncStatus.textContent = 'Synced with Tau ID';
    syncStatus.classList.add('connected');
  } catch {
    syncStatus.textContent = 'Sync offline';
  }
}

document.getElementById('url-form').addEventListener('submit', (e) => {
  e.preventDefault();
  navigate(urlInput.value);
});

document.getElementById('btn-back').addEventListener('click', async () => {
  if (nativeBrowser) await invoke('browser_back');
});

document.getElementById('btn-forward').addEventListener('click', async () => {
  if (nativeBrowser) await invoke('browser_forward');
});

document.getElementById('btn-reload').addEventListener('click', async () => {
  if (nativeBrowser) await invoke('browser_reload');
});

document.getElementById('btn-home').addEventListener('click', () => {
  navigate(activeSpace()?.homepage || settings.homepage || HOMEPAGE);
});

document.getElementById('btn-bookmark').addEventListener('click', async () => {
  let url = urlInput.value;
  if (nativeBrowser) {
    try {
      url = await invoke('browser_current_url');
    } catch { /* use url bar */ }
  }
  const title = prompt('Bookmark title:', url) || url;
  if (!authToken) {
    alert('Sign in at tauos.org/taubrowser to save bookmarks');
    return;
  }
  await fetch(`${API_BASE}/api/taubrowser/bookmarks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ title, url }),
  });
  statusText.textContent = 'Bookmark saved';
});

document.getElementById('btn-privacy').addEventListener('click', () => {
  alert(
    `Tau Browser Privacy Shield (Public Beta)\n\n` +
      `• ${blocklist.domains?.length || blocklist.count || 0} tracker/ad domains blocked on navigation\n` +
      `• ${blockedSession} blocked this session\n` +
      `• Native WebView — Google, Gmail, YouTube supported\n` +
      `• Spaces & tabs sync with Tau ID`
  );
});

btnNewTab?.addEventListener('click', () => createTab());

async function boot() {
  await loadBlocklist();
  await pullSync();
  renderSpaces();
  renderTabs();
  const tab = activeTab();
  const startUrl = tab?.url || settings.homepage || HOMEPAGE;
  urlInput.value = startUrl;
  if (nativeBrowser) {
    statusText.textContent = 'Tau Browser Public Beta — native WebView ready';
    requestAnimationFrame(syncChromeInsets);
    window.addEventListener('resize', syncChromeInsets);
  }
  await navigate(startUrl, false);
}

boot();
