'use strict';

/* ================================================================
   MATRICE — Overlay Lune
   Cliquable sur toutes les lunes de l'app → fiche complète de phase
   ================================================================ */

const MoonOverlay = (() => {

  const ELEMENT_NAMES = { feu: 'Feu', terre: 'Terre', air: 'Air', eau: 'Eau', ether: 'Éther' };

  function elementIconHTML(key, size) {
    size = size || 18;
    if (key === 'air') {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 9Q9 6.5 15 9Q19 10.5 21 9"/><path d="M3 13Q9 10.5 15 13Q19 14.5 21 13"/></svg>`;
    }
    if (key === 'terre') {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 19L9 8L13 14L17 9L21 19"/><line x1="3" y1="19" x2="21" y2="19"/></svg>`;
    }
    const paths = {
      feu:   'M12 3C10 7 7 10 7 14.5C7 18 9.2 21 12 21C14.8 21 17 18 17 14.5C17 10 14 7 12 3Z',
      eau:   'M12 3C12 3 5 11 5 15.5C5 19.1 8.1 22 12 22C15.9 22 19 19.1 19 15.5C19 11 12 3 12 3Z',
      ether: 'M12 2l2.09 4.26L18.5 7.27l-3.25 3.17.77 4.48L12 12.77l-4.02 2.15.77-4.48L5.5 7.27l4.41-.01z',
    };
    const p = paths[key];
    if (!p) return '';
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${p}"/></svg>`;
  }

  function nextMoonDate(targetFraction, currentFraction) {
    const SYNODIC_MS = 29.530588853 * 24 * 60 * 60 * 1000;
    let diff = targetFraction - currentFraction;
    if (diff <= 0.01) diff += 1;
    const date = new Date(Date.now() + diff * SYNODIC_MS);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  }

  function show() {
    const phase = MoonSystem.getMoonPhase(new Date());

    const ov        = document.getElementById('moon-ov');
    const iconEl    = document.getElementById('moon-ov-icon');
    const phaseEl   = document.getElementById('moon-ov-phase');
    const insightEl = document.getElementById('moon-ov-insight');
    const elemEl    = document.getElementById('moon-ov-element');
    const datesEl   = document.getElementById('moon-ov-dates');
    if (!ov) return;

    if (iconEl)    iconEl.innerHTML     = MoonSystem.drawMoonIcon(phase.key, 52);
    if (phaseEl)   phaseEl.textContent  = phase.name;
    if (insightEl) insightEl.textContent = phase.insight;

    if (elemEl) {
      const name = ELEMENT_NAMES[phase.elementKey] || '';
      elemEl.innerHTML = elementIconHTML(phase.elementKey) + `<span>${name}</span>`;
    }

    if (datesEl) {
      const nextNew  = nextMoonDate(0,   phase.fraction);
      const nextFull = nextMoonDate(0.5, phase.fraction);
      datesEl.innerHTML = `
        <div class="moon-ov-date-block">
          <span class="moon-ov-date-label">Nouvelle Lune</span>
          <span class="moon-ov-date-val">${nextNew}</span>
        </div>
        <div class="moon-ov-date-block">
          <span class="moon-ov-date-label">Pleine Lune</span>
          <span class="moon-ov-date-val">${nextFull}</span>
        </div>`;
    }

    ov.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function hide() {
    const ov = document.getElementById('moon-ov');
    if (ov) ov.hidden = true;
    document.body.style.overflow = '';
  }

  // ── Liaison au chargement ─────────────────────────────────────
  function bindAll() {
    // Éléments lune cliquables dans toute l'app
    const ids = [
      // 'moon-block' → navigation directe sur accueil (géré dans app.js)
      'hm-moon-phase',  // check-in humeur
      'sv-moon-phase',  // soir
      'm5-moon',        // module 5
      'cl-moon-wrap',   // cloture
    ];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.cursor = 'pointer';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.addEventListener('click', show);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
    });

    // Fermeture
    const closeBtn = document.getElementById('moon-ov-close');
    if (closeBtn) closeBtn.addEventListener('click', hide);

    const ov = document.getElementById('moon-ov');
    if (ov) {
      ov.addEventListener('click', e => { if (e.target === ov) hide(); });
      ov.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
    }
  }

  bindAll();
  return { show, hide };
})();
