/**
 * Tau Core Desktop Shell — Figma-aligned homescreen
 */
(function () {
  'use strict';

  const APPS = [
    { id: 'files', name: 'Files', icon: '../assets/icon-folder.svg', url: 'https://www.tauos.org/taucloud' },
    { id: 'browser', name: 'TauBrowser', icon: '../assets/icon-globe.svg', url: 'https://www.tauos.org/taubrowser' },
    { id: 'mail', name: 'TauMail', icon: '../assets/icon-mail.svg', url: 'https://www.tauos.org/taumail' },
    { id: 'talk', name: 'TauTalk', icon: '../assets/icon-chat.svg', url: 'https://www.tauos.org/tautalk' },
    { id: 'store', name: 'TauStore', icon: '../assets/icon-store.svg', url: 'https://www.tauos.org/taustore' },
    { id: 'settings', name: 'Settings', icon: '../assets/icon-settings.svg', url: null },
    { id: 'terminal', name: 'Terminal', icon: '../assets/icon-terminal.svg', url: null },
    { id: 'launcher', name: 'All Apps', icon: '../assets/icon-grid.svg', url: null },
  ];

  const els = {
    bg: document.getElementById('desktop-bg'),
    datetime: document.getElementById('datetime'),
    dock: document.getElementById('bottom-dock'),
    toast: document.getElementById('welcome-toast'),
    toastClose: document.getElementById('toast-close'),
    overlay: document.getElementById('app-overlay'),
    windowTitle: document.getElementById('window-title'),
    appFrame: document.getElementById('app-frame'),
    windowClose: document.getElementById('window-close'),
    activities: document.getElementById('activities-btn'),
    userAvatar: document.getElementById('user-avatar'),
  };

  function applyPersonalization() {
    try {
      const raw = localStorage.getItem('tau-core-setup');
      if (!raw) return;
      const setup = JSON.parse(raw);
      const wp = setup.personalization?.wallpaper || 'default';
      els.bg.className = `desktop-bg wallpaper-${wp}`;
      if (setup.personalization?.appearance === 'light') {
        document.body.style.color = '#1c1a17';
      }
    } catch (_) { /* defaults */ }
  }

  function updateClock() {
    const now = new Date();
    els.datetime.textContent = now.toLocaleString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function renderDock() {
    els.dock.innerHTML = APPS.map((app) => `
      <button type="button" class="dock-item" data-app="${app.id}" title="${app.name}">
        <span class="dock-icon"><img src="${app.icon}" alt=""></span>
      </button>`).join('');

    els.dock.querySelectorAll('.dock-item').forEach((btn) => {
      btn.onclick = () => openApp(btn.dataset.app);
    });
  }

  function openApp(appId) {
    const app = APPS.find((a) => a.id === appId);
    if (!app) return;

    if (appId === 'launcher') {
      openApp('browser');
      return;
    }

    if (appId === 'settings') {
      els.windowTitle.textContent = 'Settings';
      els.appFrame.srcdoc = `<html><body style="font-family:system-ui;padding:24px;background:#faf8f5;color:#1c1a17;">
        <h2>Tau Core Settings</h2>
        <p>System preferences will open here. Visit <a href="https://www.tauos.org">tauos.org</a> for cloud settings.</p>
        <p><a href="../setup/">Re-run Setup Wizard</a></p>
      </body></html>`;
      els.overlay.classList.remove('hidden');
      return;
    }

    if (appId === 'terminal') {
      els.windowTitle.textContent = 'Terminal';
      els.appFrame.srcdoc = `<html><body style="font-family:monospace;background:#1c1a17;color:#c9a84c;padding:16px;">
        <pre>Tau Core Terminal (preview)
$ uname -a
Linux tau-core ${navigator.userAgent.includes('Linux') ? 'x86_64' : 'host'} GNU/Linux

$ tau --version
Tau Core 1.0.0-beta.2

$ _
</pre></body></html>`;
      els.overlay.classList.remove('hidden');
      return;
    }

    if (app.url) {
      els.windowTitle.textContent = app.name;
      els.appFrame.src = app.url;
      els.overlay.classList.remove('hidden');
    }
  }

  function closeWindow() {
    els.overlay.classList.add('hidden');
    els.appFrame.src = 'about:blank';
    els.appFrame.srcdoc = '';
  }

  function checkFirstRun() {
    if (localStorage.getItem('tau-core-setup-complete') !== 'true') {
      window.location.href = '../setup/';
      return false;
    }
    const seen = sessionStorage.getItem('tau-welcome-seen');
    if (!seen) {
      els.toast.classList.remove('hidden');
      sessionStorage.setItem('tau-welcome-seen', '1');
    }
    return true;
  }

  els.toastClose.onclick = () => els.toast.classList.add('hidden');
  els.windowClose.onclick = closeWindow;
  els.overlay.onclick = (e) => { if (e.target === els.overlay) closeWindow(); };
  els.activities.onclick = () => openApp('launcher');
  els.userAvatar.onclick = () => openApp('mail');

  if (checkFirstRun()) {
    applyPersonalization();
    renderDock();
    updateClock();
    setInterval(updateClock, 30000);

    fetch('/api/system-info')
      .then((r) => r.json())
      .then((info) => {
        if (info.version) document.title = `Tau Core ${info.version}`;
      })
      .catch(() => { /* offline */ });
  }
})();
