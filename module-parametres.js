'use strict';

/* ================================================================
   MATRICE — Module Paramètres
   Réinitialiser le streak, gérer les mantras favoris,
   configurer les notifications
   ================================================================ */

const ModuleParametres = (() => {

  // ── Notifications ─────────────────────────────────────────────

  const NOTIF_KEY = 'matrice_notif_settings';

  const MORNING_MSGS = [
    "C'est le moment de calibrer ton champ. Le rituel t'attend.",
    "Un nouveau matin. Commence-le depuis l'intérieur.",
    "Ta pratique du matin façonne ta journée. Commençons.",
    "Avant que le bruit du monde entre — prends ce moment pour toi.",
    "Chaque matin qui commence ici change quelque chose.",
  ];

  const EVENING_MSGS = [
    "La journée s'achève. Prends un moment pour la sceller.",
    "Ce soir, quelques mots suffisent. Qu'est-ce que tu gardes de cette journée ?",
    "Avant de dormir — un instant de gratitude.",
    "Le journal du soir t'attend. Pose ta journée.",
    "Scelle cette journée avant de laisser entrer le sommeil.",
  ];

  function getNotifSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(NOTIF_KEY) || 'null');
      if (s && typeof s === 'object') return s;
    } catch (_) {}
    return { enabled: false, morningHour: 7, eveningHour: 21 };
  }

  function saveNotifSettings(s) {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(s));
  }

  function scheduleNotifications(s) {
    // Les notifications web ne permettent pas de planifier à l'avance sans SW push.
    // On utilise un polling via setTimeout calculé sur le prochain heure cible.
    if (!s.enabled || Notification?.permission !== 'granted') return;
    scheduleNext(s.morningHour, MORNING_MSGS, 'morning');
    scheduleNext(s.eveningHour, EVENING_MSGS, 'evening');
  }

  function scheduleNext(targetHour, msgs, type) {
    const now = new Date();
    const next = new Date(now);
    next.setHours(targetHour, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const delay = next - now;
    setTimeout(() => {
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      try {
        new Notification('MATRICE', { body: msg, icon: './icons/icon-192.png' });
      } catch (_) {}
      scheduleNext(targetHour, msgs, type); // Replanifier pour le lendemain
    }, Math.min(delay, 2147483647)); // max safe setTimeout
  }

  function requestNotifPermission(callback) {
    if (!('Notification' in window)) {
      callback(false); return;
    }
    if (Notification.permission === 'granted') {
      callback(true); return;
    }
    if (Notification.permission === 'denied') {
      callback(false); return;
    }
    Notification.requestPermission().then(perm => callback(perm === 'granted'));
  }

  function renderNotifSection() {
    const container = document.getElementById('pm-notif-section');
    if (!container) return;

    const s = getNotifSettings();
    const granted = Notification?.permission === 'granted';

    container.innerHTML = `
      <div class="pm-notif-row">
        <span class="pm-notif-label">Notifications</span>
        <button class="pm-notif-toggle ${s.enabled && granted ? 'pm-notif-toggle--on' : ''}"
                id="pm-notif-toggle" aria-pressed="${s.enabled && granted}"></button>
      </div>
      <div class="pm-notif-row">
        <span class="pm-notif-label">Matin</span>
        <div class="pm-notif-time">
          <input type="number" class="pm-notif-time-input" id="pm-notif-morning"
                 value="${s.morningHour}" min="0" max="23" aria-label="Heure matin">h
        </div>
      </div>
      <div class="pm-notif-row">
        <span class="pm-notif-label">Soir</span>
        <div class="pm-notif-time">
          <input type="number" class="pm-notif-time-input" id="pm-notif-evening"
                 value="${s.eveningHour}" min="0" max="23" aria-label="Heure soir">h
        </div>
      </div>
      <p class="pm-notif-hint">Les notifications nécessitent l'autorisation du navigateur et que l'app reste ouverte.</p>
    `;

    document.getElementById('pm-notif-toggle')?.addEventListener('click', () => {
      const settings = getNotifSettings();
      if (settings.enabled) {
        settings.enabled = false;
        saveNotifSettings(settings);
        renderNotifSection();
      } else {
        requestNotifPermission(ok => {
          settings.enabled = ok;
          saveNotifSettings(settings);
          if (ok) scheduleNotifications(settings);
          renderNotifSection();
        });
      }
    });

    const saveHours = () => {
      const s2 = getNotifSettings();
      const morn = parseInt(document.getElementById('pm-notif-morning')?.value, 10);
      const eve  = parseInt(document.getElementById('pm-notif-evening')?.value, 10);
      if (!isNaN(morn) && morn >= 0 && morn <= 23) s2.morningHour = morn;
      if (!isNaN(eve) && eve >= 0 && eve <= 23) s2.eveningHour = eve;
      saveNotifSettings(s2);
    };

    document.getElementById('pm-notif-morning')?.addEventListener('change', saveHours);
    document.getElementById('pm-notif-evening')?.addEventListener('change', saveHours);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Favoris ────────────────────────────────────────────────────

  function renderFavorites() {
    const list = document.getElementById('pm-favs-list');
    if (!list) return;

    const favs = MatriceStorage.getFavorites();
    if (favs.length === 0) {
      list.innerHTML = '<p class="pm-empty">Aucun mantra favori pour l\'instant.</p>';
      return;
    }

    list.innerHTML = '';
    favs.forEach(text => {
      const item = document.createElement('div');
      item.className = 'pm-fav-item';

      item.innerHTML = `
        <span class="pm-fav-text">"${escapeHtml(text)}"</span>
        <button class="pm-fav-remove" aria-label="Retirer des favoris">×</button>
      `;

      item.querySelector('.pm-fav-remove').addEventListener('click', () => {
        MatriceStorage.toggleFavorite(text);
        renderFavorites();
      });

      list.appendChild(item);
    });
  }

  // ── Thème ──────────────────────────────────────────────────────

  function renderThemeSection() {
    const container = document.getElementById('pm-theme-section');
    if (!container) return;

    const current = localStorage.getItem('matrice_theme') || 'auto';

    const options = [
      { key: 'auto',  label: 'Automatique', hint: 'Sombre la nuit, clair le jour' },
      { key: 'dark',  label: 'Toujours sombre', hint: '' },
      { key: 'light', label: 'Toujours clair',  hint: '' },
    ];

    container.innerHTML = options.map(o => `
      <button class="pm-theme-btn ${o.key === current ? 'pm-theme-btn--on' : ''}"
              data-theme="${o.key}">
        <span class="pm-theme-btn-label">${o.label}</span>
        ${o.hint ? `<span class="pm-theme-btn-hint">${o.hint}</span>` : ''}
      </button>
    `).join('');

    container.querySelectorAll('.pm-theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.theme;
        localStorage.setItem('matrice_theme', choice);
        if (typeof applyTheme === 'function') applyTheme();
        renderThemeSection();
      });
    });
  }

  // ── Événements ─────────────────────────────────────────────────

  function bindEvents() {
    document.getElementById('pm-back-btn')
      ?.addEventListener('click', () => navigateTo('accueil'));

    const resetBtn   = document.getElementById('pm-reset-streak-btn');
    const confirmEl  = document.getElementById('pm-reset-confirm');

    resetBtn?.addEventListener('click', () => {
      if (confirmEl) confirmEl.hidden = false;
      if (resetBtn)  resetBtn.style.opacity = '0.4';
    });

    document.getElementById('pm-reset-yes')?.addEventListener('click', () => {
      // Réinitialiser le calendrier ET l'ancien streak
      localStorage.removeItem('matrice_calendar');
      localStorage.setItem('matrice_streak', JSON.stringify({ count: 0, lastDate: null }));
      // Rebuild spiral sur l'accueil
      if (typeof buildAccueilSpiral === 'function') buildAccueilSpiral();
      // Reset confirm UI
      if (confirmEl) confirmEl.hidden = true;
      if (resetBtn) {
        resetBtn.style.opacity = '';
        resetBtn.textContent = 'Streak réinitialisé ✓';
        setTimeout(() => { resetBtn.textContent = 'Réinitialiser le streak'; }, 2500);
      }
    });

    document.getElementById('pm-reset-no')?.addEventListener('click', () => {
      if (confirmEl) confirmEl.hidden = true;
      if (resetBtn) resetBtn.style.opacity = '';
    });
  }

  // ── Lifecycle ──────────────────────────────────────────────────

  function onEnter() {
    const confirmEl = document.getElementById('pm-reset-confirm');
    if (confirmEl) confirmEl.hidden = true;
    const resetBtn = document.getElementById('pm-reset-streak-btn');
    if (resetBtn) {
      resetBtn.style.opacity = '';
      resetBtn.textContent = 'Réinitialiser le streak';
    }
    renderFavorites();
    renderThemeSection();
    renderNotifSection();
  }

  function onLeave() {}

  bindEvents();
  screenHooks.parametres = { onEnter, onLeave };
  return { onEnter, onLeave };
})();
