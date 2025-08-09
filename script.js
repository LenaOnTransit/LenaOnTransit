// ===== Utilities =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const storage = {
  get(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

// ===== Nav: mobile + theme =====
(function navAndTheme() {
  const btn = $('.nav-toggle');
  const menu = $('#nav-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  // Theme toggle
  const themeBtn = $('#theme-toggle');
  const savedTheme = storage.get('theme'); // 'dark' | 'light'
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  syncThemeLabel();

  themeBtn?.addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    storage.set('theme', next);
    syncThemeLabel();
  });

  function syncThemeLabel() {
    const mode = document.documentElement.getAttribute('data-theme') || 'dark';
    const btn = $('#theme-toggle');
    if (!btn) return;
    btn.textContent = mode === 'dark' ? 'Dark' : 'Light';
    btn.setAttribute('aria-pressed', String(mode === 'dark'));
  }
})();

// ===== Milestone: date, countdown, progress =====
(function milestone() {
  const dateEl = $('#milestone-date');
  const saveBtn = $('#save-milestone');
  const clearBtn = $('#clear-milestone');
  const labelEl = $('#milestone1');
  const countdownEl = $('#countdown-timer');
  const bar = $('#progress-bar');

  // Load
  const saved = storage.get('milestone'); // { dateISO, createdISO }
  if (saved?.dateISO) {
    dateEl.value = saved.dateISO;
    labelEl.textContent = new Date(saved.dateISO).toLocaleDateString();
  }

  // Establish "created" date for progress baseline
  const createdISO = saved?.createdISO || new Date().toISOString();
  if (!saved?.createdISO) storage.set('milestone', { ...saved, createdISO });

  saveBtn?.addEventListener('click', () => {
    if (!dateEl.value) return;
    storage.set('milestone', { dateISO: dateEl.value, createdISO });
    labelEl.textContent = new Date(dateEl.value).toLocaleDateString();
    tick();
  });

  clearBtn?.addEventListener('click', () => {
    storage.set('milestone', { dateISO: null, createdISO });
    dateEl.value = '';
    labelEl.textContent = '—';
    countdownEl.textContent = '—';
    bar.style.width = '0%';
  });

  function formatDelta(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${d}d ${h}h ${m}m ${ss}s`;
  }

  function tick() {
    const data = storage.get('milestone');
    if (!data?.dateISO) return;

    const target = new Date(data.dateISO + 'T00:00:00');
    const now = new Date();
    const delta = target - now;

    if (delta <= 0) {
      countdownEl.textContent = 'It’s here! 🌟';
      bar.style.width = '100%';
      return;
    }

    countdownEl.textContent = formatDelta(delta);

    // Progress from createdISO -> target
    const start = new Date(createdISO);
    const total = +target - +start;
    const progressed = +now - +start;
    const pct = Math.max(0, Math.min(100, (progressed / total) * 100));
    bar.style.width = `${pct}%`;
  }

  tick();
  setInterval(tick, 1000);
})();

// ===== Hugs: counter with persistence =====
(function hugs() {
  const btn = $('#hug-button');
  const reset = $('#hug-reset');
  const countEl = $('#hug-count');

  let count = Number(storage.get('hugCount', 0)) || 0;
  countEl.textContent = count;

  btn?.addEventListener('click', () => {
    count += 1;
    countEl.textContent = count;
    storage.set('hugCount', count);
    microPop(btn);
  });

  reset?.addEventListener('click', () => {
    count = 0;
    countEl.textContent = count;
    storage.set('hugCount', count);
  });

  function microPop(el) {
    el.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.07)' }, { transform: 'scale(1)' }],
      { duration: 150, easing: 'ease-out' }
    );
  }
})();
