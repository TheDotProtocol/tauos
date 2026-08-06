/**
 * Tau Core Setup Wizard — Figma-aligned first-boot flow
 * Flow: boot → loading → welcome → EULA → language → region → accessibility →
 *       wifi → updates → install → tau-id → privacy → personalization → complete → desktop
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'tau-core-setup';
  const API_BASE = '';

  const state = {
    step: 0,
    language: 'en',
    region: 'US',
    keyboard: 'us',
    accessibility: { largeText: false, highContrast: false, screenReader: false, reduceMotion: false },
    wifi: { ssid: '', password: '', connected: false },
    updates: { automatic: true },
    privacy: { level: 'balanced', analytics: false, location: false, crashes: true, suggestions: false },
    tauId: { email: '', password: '', created: false, skipped: false },
    personalization: { wallpaper: 'default', appearance: 'dark', accent: 'gold' },
    eulaAccepted: false,
    installProgress: 0,
  };

  const steps = [
    { id: 'welcome', label: 'Welcome', stepNum: null },
    { id: 'eula', label: 'License Agreement', stepNum: null },
    { id: 'language', label: 'Choose Your Language', stepNum: '1 of 8' },
    { id: 'region', label: 'Region & Keyboard', stepNum: '2 of 8' },
    { id: 'accessibility', label: 'Accessibility', stepNum: '3 of 8' },
    { id: 'wifi', label: 'Connect to Wi-Fi', stepNum: '4 of 8' },
    { id: 'updates', label: 'Software Updates', stepNum: '5 of 8' },
    { id: 'install', label: 'Setting Things Up', stepNum: null },
    { id: 'tauid', label: 'Sign in with Tau ID', stepNum: '6 of 8' },
    { id: 'privacy', label: 'Your Privacy', stepNum: '7 of 8' },
    { id: 'personalization', label: 'Make It Yours', stepNum: '8 of 8' },
    { id: 'complete', label: 'All Set', stepNum: 'Complete' },
  ];

  const languages = [
    { id: 'en', name: 'English', sub: 'English' },
    { id: 'es', name: 'Español', sub: 'Spanish' },
    { id: 'fr', name: 'Français', sub: 'French' },
    { id: 'de', name: 'Deutsch', sub: 'German' },
    { id: 'ja', name: '日本語', sub: 'Japanese' },
    { id: 'zh', name: '中文', sub: 'Chinese' },
    { id: 'ar', name: 'العربية', sub: 'Arabic' },
    { id: 'pt', name: 'Português', sub: 'Portuguese' },
  ];

  const wifiNetworks = [
    { ssid: 'Tau_Studio_5G', secured: true, strength: 3 },
    { ssid: 'Guest_Air', secured: false, strength: 2 },
    { ssid: 'Office_Network_Secure', secured: true, strength: 2 },
    { ssid: 'Cafe_Community', secured: false, strength: 1 },
  ];

  const installTasks = [
    'Configuring system locale',
    'Installing language packs',
    'Setting up desktop environment',
    'Installing Tau applications',
    'Applying privacy preferences',
    'Finalizing configuration',
  ];

  const els = {
    boot: document.getElementById('boot-splash'),
    loading: document.getElementById('loading-screen'),
    loadingFill: document.getElementById('loading-fill'),
    loadingStatus: document.getElementById('loading-status'),
    wizard: document.getElementById('wizard'),
    header: document.getElementById('wizard-header'),
    badge: document.getElementById('step-badge'),
    main: document.getElementById('wizard-main'),
    footer: document.getElementById('wizard-footer'),
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) Object.assign(state, JSON.parse(saved));
    } catch (_) { /* ignore */ }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) { /* ignore */ }
  }

  function signalBars(strength) {
    return [1, 2, 3].map((n) =>
      `<span class="${n <= strength ? 'on' : ''}"></span>`
    ).join('');
  }

  function renderWelcome() {
    els.header.classList.add('hidden');
    els.footer.innerHTML = '';
    els.main.innerHTML = `
      <div class="center-content">
        <div class="brand" style="justify-content:center;margin-bottom:48px;">
          <img src="../assets/tau-logomark.png" alt="" width="20" height="20">
          <span>Tau Core</span>
        </div>
        <h1 class="wizard-title hero">Welcome to <span class="gold">Tau</span> Core</h1>
        <p class="wizard-subtitle">A calm, thoughtful operating system designed around you.</p>
        <button class="btn btn-primary btn-lg" id="btn-get-started">
          Get Started
          <img src="../assets/arrow-right.svg" alt="" width="16" height="16">
        </button>
        <p class="sign-off" style="margin-top:80px;">REDEFINING PERSONAL COMPUTING</p>
      </div>`;
    document.getElementById('btn-get-started').onclick = () => go(1);
  }

  function renderEula() {
    els.header.classList.remove('hidden');
    els.badge.textContent = 'License';
    els.main.innerHTML = `
      <h1 class="wizard-title">End User License Agreement</h1>
      <p class="wizard-subtitle">Please read and accept the Tau Core EULA to continue installation.</p>
      <div class="eula-panel" id="eula-text">Loading agreement...</div>
      <label class="eula-accept">
        <input type="checkbox" id="eula-check" ${state.eulaAccepted ? 'checked' : ''}>
        <span>I have read and agree to the Tau Core End User License Agreement, including the privacy and monitoring terms described above.</span>
      </label>
      <div class="privacy-levels" style="margin-top:24px;">
        <p style="font-size:13px;font-weight:600;color:var(--tau-muted);margin-bottom:8px;">Choose your privacy level</p>
        ${['maximum', 'balanced', 'enhanced'].map((level) => `
          <div class="privacy-option ${state.privacy.level === level ? 'selected' : ''}" data-level="${level}">
            <h4>${level === 'maximum' ? 'Maximum Privacy' : level === 'balanced' ? 'Balanced Privacy' : 'Enhanced Safety'}${level === 'balanced' ? ' (Recommended)' : ''}</h4>
            <p>${level === 'maximum' ? 'No system monitoring. Zero telemetry.' : level === 'balanced' ? 'System-level security events only. No personal data access.' : 'Extended threat and stability monitoring.'}</p>
          </div>`).join('')}
      </div>`;
    els.footer.innerHTML = `
      <button class="btn btn-back" id="btn-back">Back</button>
      <button class="btn btn-primary" id="btn-continue" disabled>Accept & Continue</button>`;

    fetch('../legal/TauCore-EULA.md')
      .then((r) => r.text())
      .then((md) => {
        document.getElementById('eula-text').innerHTML = md
          .replace(/^# (.+)$/gm, '<h2>$1</h2>')
          .replace(/^## (.+)$/gm, '<h3>$1</h3>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>');
      })
      .catch(() => {
        document.getElementById('eula-text').textContent =
          'Tau Core EULA — Privacy-first operating system. By continuing you accept our terms at tauos.org/legal.';
      });

    const check = document.getElementById('eula-check');
    const btn = document.getElementById('btn-continue');
    check.onchange = () => { btn.disabled = !check.checked; };
    btn.disabled = !check.checked;
    btn.onclick = () => {
      if (!check.checked) return;
      state.eulaAccepted = true;
      saveState();
      go(2);
    };
    document.getElementById('btn-back').onclick = () => go(0);
    document.querySelectorAll('.privacy-option').forEach((el) => {
      el.onclick = () => {
        state.privacy.level = el.dataset.level;
        document.querySelectorAll('.privacy-option').forEach((o) => o.classList.remove('selected'));
        el.classList.add('selected');
        saveState();
      };
    });
  }

  function renderLanguage() {
    els.badge.textContent = 'Step 1 of 8';
    els.main.innerHTML = `
      <h1 class="wizard-title">${steps[2].label}</h1>
      <div class="panel">${languages.map((l) => `
        <div class="panel-row ${state.language === l.id ? 'selected' : ''}" data-lang="${l.id}">
          <div><span class="label">${l.name}</span> <span class="sublabel">— ${l.sub}</span></div>
          <div class="radio"></div>
        </div>`).join('')}</div>`;
    renderNav(2, 3);
    document.querySelectorAll('.panel-row').forEach((row) => {
      row.onclick = () => {
        state.language = row.dataset.lang;
        saveState();
        render();
      };
    });
  }

  function renderRegion() {
    els.badge.textContent = 'Step 2 of 8';
    els.main.innerHTML = `
      <h1 class="wizard-title">${steps[3].label}</h1>
      <div class="field-row">
        <div class="field-group">
          <label>Your Region</label>
          <select id="region-select">
            <option value="US" ${state.region === 'US' ? 'selected' : ''}>United States</option>
            <option value="GB" ${state.region === 'GB' ? 'selected' : ''}>United Kingdom</option>
            <option value="DE" ${state.region === 'DE' ? 'selected' : ''}>Germany</option>
            <option value="IN" ${state.region === 'IN' ? 'selected' : ''}>India</option>
            <option value="JP" ${state.region === 'JP' ? 'selected' : ''}>Japan</option>
          </select>
        </div>
        <div class="field-group">
          <label>Keyboard Layout</label>
          <select id="keyboard-select">
            <option value="us" ${state.keyboard === 'us' ? 'selected' : ''}>US English (QWERTY)</option>
            <option value="uk" ${state.keyboard === 'uk' ? 'selected' : ''}>UK English</option>
            <option value="de" ${state.keyboard === 'de' ? 'selected' : ''}>German</option>
            <option value="fr" ${state.keyboard === 'fr' ? 'selected' : ''}>French (AZERTY)</option>
          </select>
        </div>
      </div>`;
    renderNav(3, 4);
    document.getElementById('region-select').onchange = (e) => { state.region = e.target.value; saveState(); };
    document.getElementById('keyboard-select').onchange = (e) => { state.keyboard = e.target.value; saveState(); };
  }

  function renderAccessibility() {
    els.badge.textContent = 'Step 3 of 8';
    const opts = [
      { key: 'largeText', title: 'Large Text', desc: 'Increase display text size across all system menus and apps.' },
      { key: 'highContrast', title: 'High Contrast', desc: 'Enhance readability by maximizing dark/light color boundaries.' },
      { key: 'screenReader', title: 'Screen Reader', desc: 'Spoken feedback describes elements on the screen audibly.' },
      { key: 'reduceMotion', title: 'Reduce Motion', desc: 'Minimize animations and transitions for a static interaction state.' },
    ];
    els.main.innerHTML = `
      <h1 class="wizard-title">${steps[4].label}</h1>
      <p class="wizard-desc">Tau Core adapts to you. Adjust these now or anytime in Settings.</p>
      ${opts.map((o) => `
        <div class="toggle-card">
          <div><h3>${o.title}</h3><p>${o.desc}</p></div>
          <div class="toggle ${state.accessibility[o.key] ? 'on' : ''}" data-key="${o.key}"></div>
        </div>`).join('')}`;
    renderNav(4, 5);
    document.querySelectorAll('.toggle').forEach((t) => {
      t.onclick = () => {
        const key = t.dataset.key;
        state.accessibility[key] = !state.accessibility[key];
        t.classList.toggle('on', state.accessibility[key]);
        saveState();
      };
    });
  }

  function renderWifi() {
    els.badge.textContent = 'Step 4 of 8';
    els.main.innerHTML = `
      <h1 class="wizard-title">${steps[5].label}</h1>
      <div class="panel">${wifiNetworks.map((w) => `
        <div class="panel-row wifi-row ${state.wifi.ssid === w.ssid ? 'selected' : ''}" data-ssid="${w.ssid}" data-secured="${w.secured}">
          <div>
            <div class="wifi-row-header">
              <div class="wifi-name">
                <div class="signal-bars">${signalBars(w.strength)}</div>
                ${w.ssid}
              </div>
              ${w.secured ? '🔒' : ''}
            </div>
            <div class="wifi-password-block">
              <label style="font-size:13px;font-weight:600;color:var(--tau-muted);">Enter Network Password</label>
              <div class="wifi-input-row">
                <input type="password" placeholder="Password" id="wifi-pass-${w.ssid}" value="${state.wifi.ssid === w.ssid ? state.wifi.password : ''}">
                <button class="btn btn-primary wifi-connect-btn" data-ssid="${w.ssid}">Connect</button>
              </div>
            </div>
          </div>
        </div>`).join('')}</div>`;
    els.footer.innerHTML = `
      <button class="btn btn-secondary" id="btn-skip-wifi">Skip for now</button>
      <button class="btn btn-primary" id="btn-continue">Continue <img src="../assets/arrow-right.svg" alt="" width="16" height="16"></button>`;
    document.getElementById('btn-skip-wifi').onclick = () => go(6);
    document.getElementById('btn-continue').onclick = () => go(6);
    document.querySelectorAll('.wifi-row').forEach((row) => {
      row.onclick = (e) => {
        if (e.target.closest('.wifi-connect-btn') || e.target.closest('input')) return;
        state.wifi.ssid = row.dataset.ssid;
        saveState();
        render();
      };
    });
    document.querySelectorAll('.wifi-connect-btn').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const ssid = btn.dataset.ssid;
        const pass = document.getElementById(`wifi-pass-${ssid}`)?.value || '';
        state.wifi = { ssid, password: pass, connected: true };
        saveState();
        scanWifiReal(ssid, pass);
        render();
      };
    });
  }

  async function scanWifiReal(ssid, password) {
    try {
      await fetch(`${API_BASE}/api/setup/wifi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssid, password }),
      });
    } catch (_) { /* offline demo */ }
  }

  function renderUpdates() {
    els.badge.textContent = 'Step 5 of 8';
    els.main.innerHTML = `
      <h1 class="wizard-title">${steps[6].label}</h1>
      <p class="wizard-subtitle">Keeping Tau Core current keeps you safe.</p>
      <div style="text-align:center;margin:32px 0;color:var(--tau-muted);">Checking for updates...</div>
      <div class="toggle-card">
        <div><h3>Automatic Updates</h3><p>Keep Tau Core up to date automatically as patches release.</p></div>
        <div class="toggle ${state.updates.automatic ? 'on' : ''}" id="toggle-updates"></div>
      </div>`;
    renderNav(6, 7);
    document.getElementById('toggle-updates').onclick = (e) => {
      state.updates.automatic = !state.updates.automatic;
      e.target.classList.toggle('on', state.updates.automatic);
      saveState();
    };
  }

  function renderInstall() {
    els.badge.textContent = 'Installing';
    els.footer.innerHTML = '<p class="sign-off" style="width:100%;text-align:center;">This may take a few minutes</p>';
    const circumference = 2 * Math.PI * 76;
    els.main.innerHTML = `
      <h1 class="wizard-title">${steps[7].label}</h1>
      <div class="progress-ring-wrap">
        <svg class="progress-ring" width="200" height="200" viewBox="0 0 200 200">
          <circle class="track" cx="100" cy="100" r="76"/>
          <circle class="fill" id="ring-fill" cx="100" cy="100" r="76"
            stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"/>
        </svg>
        <div class="progress-percent" id="progress-percent">0%</div>
      </div>
      <p id="install-status" style="text-align:center;color:var(--tau-muted);">${installTasks[0]}...</p>
      <div class="completed-steps" id="completed-steps"></div>`;

    let progress = 0;
    let taskIdx = 0;
    const ring = document.getElementById('ring-fill');
    const pct = document.getElementById('progress-percent');
    const status = document.getElementById('install-status');
    const completed = document.getElementById('completed-steps');

    const interval = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 8 + 2);
      state.installProgress = Math.round(progress);
      const offset = circumference - (progress / 100) * circumference;
      ring.style.strokeDashoffset = offset;
      pct.textContent = `${Math.round(progress)}%`;

      if (progress > (taskIdx + 1) * (100 / installTasks.length) && taskIdx < installTasks.length) {
        completed.innerHTML += `<div class="completed-step done"><span class="check-icon">✓</span>${installTasks[taskIdx]}</div>`;
        taskIdx++;
        status.textContent = installTasks[taskIdx] ? `${installTasks[taskIdx]}...` : 'Complete!';
      }

      if (progress >= 100) {
        clearInterval(interval);
        saveState();
        setTimeout(() => go(8), 800);
      }
    }, 400);
  }

  function renderTauId() {
    els.badge.textContent = 'Step 6 of 8';
    els.main.innerHTML = `
      <h1 class="wizard-title">${steps[8].label}</h1>
      <p class="wizard-subtitle">Sync your preferences, files, and apps securely across all your devices.</p>
      <div class="split-panels">
        <div class="auth-card">
          <h3>Sign In</h3>
          <div class="field-group"><label>Email Address</label><input type="email" id="tauid-email" placeholder="name@example.com" value="${state.tauId.email}"></div>
          <div class="field-group"><label>Password</label><input type="password" id="tauid-password" placeholder="••••••••••••"></div>
          <button class="btn btn-primary" id="btn-signin" style="margin-top:8px;">Sign In</button>
        </div>
        <div class="split-or">or</div>
        <div class="auth-card">
          <h3>Create Tau ID</h3>
          <p style="color:var(--tau-muted);font-size:14px;line-height:1.5;margin-bottom:20px;">
            Don't have a Tau ID yet? Create one now to receive 5GB of free secure cloud backup, profile sync, and seamless recovery.
          </p>
          <button class="btn btn-primary" id="btn-create">Create Account</button>
        </div>
      </div>`;
    els.footer.innerHTML = `
      <button class="btn btn-secondary" id="btn-skip-tauid">Skip</button>
      <button class="btn btn-primary" id="btn-continue">Continue <img src="../assets/arrow-right.svg" alt="" width="16" height="16"></button>`;

    document.getElementById('btn-signin').onclick = async () => {
      const email = document.getElementById('tauid-email').value;
      const password = document.getElementById('tauid-password').value;
      state.tauId = { email, password, created: false, skipped: false };
      try {
        await fetch(`${API_BASE}/api/tauid/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } catch (_) { /* demo mode */ }
      saveState();
      go(9);
    };
    document.getElementById('btn-create').onclick = () => {
      window.open('https://www.tauos.org/tauid/register', '_blank');
      state.tauId.created = true;
      saveState();
    };
    document.getElementById('btn-skip-tauid').onclick = () => { state.tauId.skipped = true; saveState(); go(9); };
    document.getElementById('btn-continue').onclick = () => go(9);
  }

  function renderPrivacy() {
    els.badge.textContent = 'Step 7 of 8';
    const cards = [
      { key: 'analytics', title: 'Analytics', desc: 'Help improve Tau Core by sharing anonymous usage data with our core engineering team.' },
      { key: 'location', title: 'Location Services', desc: 'Allow built-in apps and widgets to request secure access to your geographic location.' },
      { key: 'crashes', title: 'Crash Reports', desc: 'Automatically send vital diagnostic information when a system element behaves unexpectedly.' },
      { key: 'suggestions', title: 'Personalized Suggestions', desc: 'Use secure local indexing to suggest helpful actions without sending data to servers.' },
    ];
    els.main.innerHTML = `
      <h1 class="wizard-title">Your Privacy</h1>
      <p class="wizard-subtitle">You control your data. Always.</p>
      ${cards.map((c) => `
        <div class="toggle-card">
          <div><h3>${c.title}</h3><p>${c.desc}</p></div>
          <div class="toggle ${state.privacy[c.key] ? 'on' : ''}" data-key="${c.key}"></div>
        </div>`).join('')}`;
    renderNav(9, 10);
    document.querySelectorAll('.toggle').forEach((t) => {
      t.onclick = () => {
        const key = t.dataset.key;
        state.privacy[key] = !state.privacy[key];
        t.classList.toggle('on', state.privacy[key]);
        saveState();
      };
    });
  }

  function renderPersonalization() {
    els.badge.textContent = 'Step 8 of 8';
    els.main.innerHTML = `
      <h1 class="wizard-title">${steps[10].label}</h1>
      <div class="toggle-card" style="flex-direction:column;align-items:flex-start;">
        <h3 style="margin-bottom:12px;">Wallpaper</h3>
        <div class="wallpaper-row">
          ${['default', 'warm', 'cool', 'minimal', 'gold'].map((w) => `
            <div class="wallpaper-thumb ${state.personalization.wallpaper === w ? 'selected' : ''}" data-wall="${w}">
              <div style="width:100%;height:100%;background:linear-gradient(135deg,${w === 'gold' ? '#c9a84c,#1c1a17' : w === 'cool' ? '#1c1a17,#2a3a4a' : w === 'warm' ? '#3a332b,#1c1a17' : w === 'minimal' ? '#faf8f5,#eae5df' : '#1c1a17,#3a332b'});"></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="toggle-card" style="flex-direction:column;align-items:flex-start;margin-top:16px;">
        <h3 style="margin-bottom:12px;">Appearance Mode</h3>
        <div class="appearance-row">
          ${['light', 'dark', 'auto'].map((a) => `
            <div class="appearance-card ${state.personalization.appearance === a ? 'selected' : ''}" data-appearance="${a}">
              <div class="appearance-preview ${a === 'dark' || a === 'auto' ? 'dark' : ''}"></div>
              ${a.charAt(0).toUpperCase() + a.slice(1)}
            </div>`).join('')}
        </div>
      </div>`;
    els.footer.innerHTML = `
      <button class="btn btn-back" id="btn-back">Back</button>
      <button class="btn btn-primary" id="btn-finish">Finish Setup <img src="../assets/arrow-right.svg" alt="" width="16" height="16"></button>`;
    document.getElementById('btn-back').onclick = () => go(9);
    document.getElementById('btn-finish').onclick = () => go(11);
    document.querySelectorAll('.wallpaper-thumb').forEach((el) => {
      el.onclick = () => {
        state.personalization.wallpaper = el.dataset.wall;
        saveState();
        render();
      };
    });
    document.querySelectorAll('.appearance-card').forEach((el) => {
      el.onclick = () => {
        state.personalization.appearance = el.dataset.appearance;
        saveState();
        render();
      };
    });
  }

  function renderComplete() {
    els.badge.textContent = 'Complete';
    els.main.innerHTML = `
      <div class="center-content">
        <h1 class="wizard-title hero">You're All Set</h1>
        <p class="wizard-subtitle">Tau Core is ready. Your calm, powerful workspace awaits.</p>
        <div style="width:480px;max-width:90vw;height:200px;margin:32px auto;border-radius:12px;background:linear-gradient(135deg,#1c1a17,#3a332b);border:1px solid #3a3835;position:relative;overflow:hidden;">
          <div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:8px;padding:8px 16px;background:rgba(28,26,23,0.7);border-radius:20px;border:1px solid #3a3835;">
            ${[1,2,3,4,5,6,7].map(() => '<div style="width:8px;height:8px;border-radius:2px;background:#c9a84c;"></div>').join('')}
          </div>
        </div>
        <button class="btn btn-primary btn-lg" id="btn-start-desktop">
          Start Using Tau Core
          <img src="../assets/arrow-right.svg" alt="" width="16" height="16">
        </button>
        <p class="sign-off" style="margin-top:48px;">REDEFINING PERSONAL COMPUTING</p>
      </div>`;
    els.footer.innerHTML = '';
    document.getElementById('btn-start-desktop').onclick = finishSetup;
  }

  function renderNav(backIdx, nextIdx) {
    els.footer.innerHTML = `
      <button class="btn btn-back" id="btn-back">Back</button>
      <button class="btn btn-primary" id="btn-continue">Continue <img src="../assets/arrow-right.svg" alt="" width="16" height="16"></button>`;
    document.getElementById('btn-back').onclick = () => go(backIdx);
    document.getElementById('btn-continue').onclick = () => go(nextIdx);
  }

  function render() {
    const fns = [
      renderWelcome, renderEula, renderLanguage, renderRegion, renderAccessibility,
      renderWifi, renderUpdates, renderInstall, renderTauId, renderPrivacy,
      renderPersonalization, renderComplete,
    ];
    if (fns[state.step]) fns[state.step]();
  }

  function go(step) {
    state.step = step;
    saveState();
    render();
  }

  async function finishSetup() {
    localStorage.setItem('tau-core-setup-complete', 'true');
    try {
      await fetch(`${API_BASE}/api/setup/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
    } catch (_) { /* offline */ }
    window.location.href = '../desktop/';
  }

  function runBootSequence() {
    setTimeout(() => {
      els.boot.classList.add('hidden');
      els.loading.classList.remove('hidden');
      let p = 0;
      const msgs = ['Checking system...', 'Loading Tau Core...', 'Preparing setup wizard...'];
      const iv = setInterval(() => {
        p += 12;
        els.loadingFill.style.width = `${Math.min(p, 100)}%`;
        els.loadingStatus.textContent = msgs[Math.min(Math.floor(p / 35), msgs.length - 1)];
        if (p >= 100) {
          clearInterval(iv);
          els.loading.classList.add('hidden');
          els.wizard.classList.remove('hidden');
          if (localStorage.getItem('tau-core-setup-complete') === 'true') {
            window.location.href = '../desktop/';
            return;
          }
          render();
        }
      }, 280);
    }, 1500);
  }

  loadState();
  runBootSequence();
})();
