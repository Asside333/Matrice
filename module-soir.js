'use strict';

/* ================================================================
   MATRICE — Module Soir : Gratitude nocturne
   Formats Rapide et Complet, phrase de clôture, historique
   ================================================================ */

const ModuleSoir = (() => {

  // ── Clés localStorage ─────────────────────────────────────────
  const KEY_ENTRIES = 'matrice_soir_entries';

  // ── État ──────────────────────────────────────────────────────
  let format = 'rapide'; // 'rapide' | 'complet'
  let _twTimers = []; // typewriter timers to cleanup

  // ── Sélection de phrase sans répétition ──────────────────────
  function pickPhrase() {
    const pool = typeof SOIR_PHRASES !== 'undefined' ? SOIR_PHRASES : [
      'La journée est terminée. Repose-toi.',
    ];
    return MatriceStorage.pickUnique(pool, 'evening_closings');
  }

  // ── Persistance des entrées ───────────────────────────────────
  function loadEntries() {
    try { return JSON.parse(localStorage.getItem(KEY_ENTRIES) || '[]'); } catch { return []; }
  }

  function saveEntry(entry) {
    const entries = loadEntries();
    entries.unshift(entry); // plus récent en premier
    try { localStorage.setItem(KEY_ENTRIES, JSON.stringify(entries)); } catch {}
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function formatDateLabel(dateKey) {
    try {
      const [y, m, d] = dateKey.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch { return dateKey; }
  }

  // ── Toggle format ─────────────────────────────────────────────
  function setFormat(f) {
    format = f;
    document.querySelectorAll('.sv-toggle-btn').forEach(b => {
      b.classList.toggle('sv-toggle-btn--on', b.dataset.format === f);
    });
    document.getElementById('sv-form-rapide')?.classList.toggle('sv-form--off', f !== 'rapide');
    document.getElementById('sv-form-complet')?.classList.toggle('sv-form--off', f !== 'complet');
    hideSealedZone();
  }

  // ── Scellement ────────────────────────────────────────────────
  function doSeal(f) {
    const phrase = pickPhrase();
    const now    = todayKey();
    let entry;

    if (f === 'rapide') {
      const text = (document.getElementById('sv-ta-rapide')?.value || '').trim();
      if (!text) { shakeEl('sv-ta-rapide'); return; }
      entry = { date: now, format: 'rapide', gratitude: text, phrase };

    } else {
      const grat  = (document.getElementById('sv-ta-gratitude')?.value || '').trim();
      const act   = (document.getElementById('sv-ta-action')?.value || '').trim();
      const lach  = (document.getElementById('sv-ta-lacher')?.value || '').trim();
      if (!grat && !act && !lach) { shakeEl('sv-ta-gratitude'); return; }
      entry = { date: now, format: 'complet', gratitude: grat, action: act, lacher: lach, phrase };
    }

    saveEntry(entry);
    if (typeof haptic === 'function') haptic(80);
    showSealedZone(phrase);
  }

  function shakeEl(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('sv-shake');
    setTimeout(() => el.classList.remove('sv-shake'), 400);
  }

  // ── Zone scellée — animation sacrée ──────────────────────────
  function showSealedZone(phrase) {
    // Masquer les formulaires
    document.getElementById('sv-form-rapide')?.classList.add('sv-form--off');
    document.getElementById('sv-form-complet')?.classList.add('sv-form--off');

    const zone    = document.getElementById('sv-sealed');
    const closing = document.getElementById('sv-closing');
    const screen  = document.getElementById('screen-soir');
    if (!zone || !closing) return;

    // Pulse Graine de Vie + halo
    screen?.classList.add('sv-sealing');

    // Éclairer les étoiles
    document.querySelectorAll('.sv-star-pt').forEach(s => {
      s.style.opacity = '1';
      s.style.transform = 'scale(1.4)';
    });

    closing.textContent = '';
    zone.classList.remove('sv-sealed--off');

    // Animation d'entrée : opacity
    zone.style.transition = 'none';
    zone.style.opacity    = '0';
    void zone.offsetWidth;
    zone.style.transition = 'opacity 1.2s ease';
    zone.style.opacity    = '1';

    // Phrase lettre par lettre (typewriter sacré)
    setTimeout(() => {
      typewritePhrase(closing, phrase);
    }, 800);
  }

  function typewritePhrase(el, text) {
    el.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    _twTimers.push(interval);
  }

  function hideSealedZone() {
    const zone = document.getElementById('sv-sealed');
    if (zone) { zone.classList.add('sv-sealed--off'); zone.style.opacity = '0'; }
    document.getElementById('screen-soir')?.classList.remove('sv-sealing');
    document.querySelectorAll('.sv-star-pt').forEach(s => {
      s.style.opacity = '';
      s.style.transform = '';
    });
  }

  function resetForm() {
    hideSealedZone();

    // Vider les champs
    ['sv-ta-rapide','sv-ta-gratitude','sv-ta-action','sv-ta-lacher'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    // Ré-afficher le formulaire actif
    document.getElementById('sv-form-rapide')?.classList.toggle('sv-form--off', format !== 'rapide');
    document.getElementById('sv-form-complet')?.classList.toggle('sv-form--off', format !== 'complet');
  }

  // ── Historique overlay ────────────────────────────────────────
  function openHistory() {
    renderHistory();
    const overlay = document.getElementById('sv-history-overlay');
    if (!overlay) return;
    overlay.classList.remove('sv-overlay--off');
    void overlay.offsetWidth;
    overlay.classList.add('sv-overlay--in');
  }

  function closeHistory() {
    const overlay = document.getElementById('sv-history-overlay');
    if (!overlay) return;
    overlay.classList.remove('sv-overlay--in');
    setTimeout(() => overlay.classList.add('sv-overlay--off'), 280);
  }

  function renderHistory() {
    const list = document.getElementById('sv-history-list');
    if (!list) return;

    const entries = loadEntries();
    if (entries.length === 0) {
      list.innerHTML = '<p class="sv-hist-empty">Aucune entrée pour l\'instant.</p>';
      return;
    }

    // Regrouper par date
    const byDate = {};
    entries.forEach(e => {
      if (!byDate[e.date]) byDate[e.date] = [];
      byDate[e.date].push(e);
    });

    list.innerHTML = '';

    Object.keys(byDate).forEach(dateKey => {
      // En-tête de date
      const dayEl = document.createElement('p');
      dayEl.className = 'sv-hist-date';
      dayEl.textContent = formatDateLabel(dateKey);
      list.appendChild(dayEl);

      byDate[dateKey].forEach(entry => {
        const card = document.createElement('div');
        card.className = 'sv-hist-card';

        let html = '';
        if (entry.format === 'rapide') {
          html += fieldHtml('Gratitude', entry.gratitude);
        } else {
          if (entry.gratitude) html += fieldHtml('Gratitude', entry.gratitude);
          if (entry.action)    html += fieldHtml('Action',    entry.action);
          if (entry.lacher)    html += fieldHtml('Lâcher',    entry.lacher);
        }
        if (entry.phrase) {
          html += `<p class="sv-hist-phrase">"${escapeHtml(entry.phrase)}"</p>`;
        }

        card.innerHTML = html;
        list.appendChild(card);
      });
    });
  }

  function fieldHtml(label, text) {
    if (!text) return '';
    return `<p class="sv-hist-label">${escapeHtml(label)}</p><p class="sv-hist-text">${escapeHtml(text)}</p>`;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Liaison des événements ────────────────────────────────────
  function bindEvents() {

    // Toggle Rapide / Complet
    document.querySelectorAll('.sv-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => setFormat(btn.dataset.format));
    });

    // Sceller — Rapide
    document.getElementById('sv-seal-rapide')
      ?.addEventListener('click', () => doSeal('rapide'));

    // Sceller — Complet
    document.getElementById('sv-seal-complet')
      ?.addEventListener('click', () => doSeal('complet'));

    // Nouvelle entrée
    document.getElementById('sv-new-btn')
      ?.addEventListener('click', resetForm);

    // Historique — ouvrir
    document.getElementById('sv-history-btn')
      ?.addEventListener('click', openHistory);

    // Historique — fermer
    document.getElementById('sv-history-close')
      ?.addEventListener('click', closeHistory);

    // Fermer l'overlay en cliquant sur le fond
    document.getElementById('sv-history-overlay')
      ?.addEventListener('click', e => {
        if (e.target.id === 'sv-history-overlay') closeHistory();
      });
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function createStars() {
    const container = document.getElementById('sv-stars');
    if (!container || container.children.length > 0) return;
    for (let i = 0; i < 35; i++) {
      const star = document.createElement('div');
      star.className = 'sv-star-pt';
      star.style.left = (5 + Math.random() * 90) + '%';
      star.style.top  = (3 + Math.random() * 50) + '%';
      star.style.animationDelay = (Math.random() * 4).toFixed(1) + 's';
      star.style.animationDuration = (2.5 + Math.random() * 2).toFixed(1) + 's';
      const size = 1.5 + Math.random() * 1.5;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      container.appendChild(star);
    }
  }

  function typewritePrompt() {
    const el = document.getElementById('sv-prompt-rapide');
    if (!el) return;
    const fullText = 'Qu\u2019est-ce que tu retiens de cette journ\u00E9e ?';
    el.textContent = '';
    el.style.visibility = 'visible';
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        el.textContent += fullText[i];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    _twTimers.push(interval);
  }

  function onEnter() {
    resetForm();
    setFormat('rapide');

    // Retirer l'état sealing
    document.getElementById('screen-soir')?.classList.remove('sv-sealing');

    // Créer les étoiles
    createStars();

    // Prompt lettre par lettre
    setTimeout(typewritePrompt, 400);

    // Phase lunaire en grand (48px) dans le header
    const moonEl = document.getElementById('sv-moon-phase');
    if (moonEl && typeof MoonSystem !== 'undefined') {
      const phase = MoonSystem.getMoonPhase(new Date());
      moonEl.innerHTML = MoonSystem.drawMoonIcon(phase.key, 80) +
        `<span class="sv-moon-name">${phase.name}</span>`;
    }
  }

  function onLeave() {
    closeHistory();
    _twTimers.forEach(t => clearInterval(t));
    _twTimers = [];
  }

  bindEvents();
  screenHooks.soir = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
