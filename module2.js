'use strict';

/* ================================================================
   MATRICE — Module 2 : Mantra du jour
   Affichage mot-par-mot, shuffle sans répétition, favoris
   ================================================================ */

const Module2 = (() => {

  const STORAGE_FAVORITES = 'matrice_favorites';
  const STORAGE_SEEN      = 'matrice_mantras_seen';

  // ── État ──────────────────────────────────────────────────────
  let currentMantra   = null;
  let currentCategory = null;
  let animTimeout     = null;
  let wordTimeouts    = [];

  // ── Persistence : mantras déjà vus ───────────────────────────
  function getSeenIndices(cat) {
    try {
      const raw = localStorage.getItem(STORAGE_SEEN);
      return raw ? (JSON.parse(raw)[cat] || []) : [];
    } catch { return []; }
  }

  function saveSeenIndex(cat, idx) {
    try {
      const raw = localStorage.getItem(STORAGE_SEEN);
      const data = raw ? JSON.parse(raw) : {};
      data[cat] = data[cat] || [];
      data[cat].push(idx);
      // Réinitialise si tout vu
      if (data[cat].length >= MANTRAS[cat].length) data[cat] = [idx];
      localStorage.setItem(STORAGE_SEEN, JSON.stringify(data));
    } catch {}
  }

  // ── Favoris ───────────────────────────────────────────────────
  function getFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function isFavorite(text) {
    return getFavorites().includes(text);
  }

  function toggleFavorite(text) {
    const favs = getFavorites();
    const idx  = favs.indexOf(text);
    if (idx === -1) {
      favs.push(text);
    } else {
      favs.splice(idx, 1);
    }
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(favs));
    return idx === -1; // true = maintenant favori
  }

  // ── Sélection du mantra ───────────────────────────────────────
  function pickMantra() {
    // Choisit une catégorie au hasard, pondérée par taille
    const allTexts = [];
    for (const cat of MANTRAS_CATEGORIES) {
      const seen = getSeenIndices(cat);
      const unseen = MANTRAS[cat]
        .map((text, i) => ({ text, cat, i }))
        .filter(({ i }) => !seen.includes(i));
      allTexts.push(...unseen);
    }

    // Si tout vu, on repart de zéro
    if (allTexts.length === 0) {
      localStorage.removeItem(STORAGE_SEEN);
      return pickMantra();
    }

    const pick = allTexts[Math.floor(Math.random() * allTexts.length)];
    saveSeenIndex(pick.cat, pick.i);
    return { text: pick.text, category: pick.cat };
  }

  // ── Animation mot-par-mot ─────────────────────────────────────
  function animateWords(text, container) {
    wordTimeouts.forEach(clearTimeout);
    wordTimeouts = [];
    container.innerHTML = '';

    const words = text.split(' ');
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'm2-word';
      span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
      container.appendChild(span);

      const t = setTimeout(() => {
        span.classList.add('m2-word--visible');
      }, 120 + i * 90);
      wordTimeouts.push(t);
    });
  }

  // ── Affiche un mantra ─────────────────────────────────────────
  function displayMantra(mantra, animate = true) {
    currentMantra   = mantra.text;
    currentCategory = mantra.category;

    // Sauvegarde dans l'état global du rituel
    if (typeof RITUAL_STATE !== 'undefined') {
      RITUAL_STATE.mantra        = mantra.text;
      RITUAL_STATE.mantraCategory = mantra.category;
    }

    const textEl  = document.getElementById('m2-mantra-text');
    const catEl   = document.getElementById('m2-category');
    const starEl  = document.getElementById('m2-star-btn');

    if (!textEl) return;

    // Mise à jour catégorie
    if (catEl) catEl.textContent = mantra.category;

    // Mise à jour étoile
    if (starEl) {
      const fav = isFavorite(mantra.text);
      starEl.classList.toggle('m2-star--active', fav);
      starEl.setAttribute('aria-pressed', fav ? 'true' : 'false');
    }

    if (animate) {
      // Fade out → mot par mot
      textEl.classList.remove('m2-text--visible');
      if (animTimeout) clearTimeout(animTimeout);
      animTimeout = setTimeout(() => {
        animateWords(mantra.text, textEl);
        textEl.classList.add('m2-text--visible');
      }, 280);
    } else {
      animateWords(mantra.text, textEl);
      textEl.classList.add('m2-text--visible');
    }
  }

  // ── Liaison des événements ────────────────────────────────────
  function bindEvents() {
    // "Tirer un autre mantra"
    document.getElementById('m2-next-mantra-btn')
      ?.addEventListener('click', () => {
        displayMantra(pickMantra(), true);
      });

    // Favori
    document.getElementById('m2-star-btn')
      ?.addEventListener('click', () => {
        if (!currentMantra) return;
        const nowFav = toggleFavorite(currentMantra);
        const btn = document.getElementById('m2-star-btn');
        btn?.classList.toggle('m2-star--active', nowFav);
        btn?.setAttribute('aria-pressed', nowFav ? 'true' : 'false');
        // Micro-animation
        btn?.classList.add('m2-star--pulse');
        setTimeout(() => btn?.classList.remove('m2-star--pulse'), 400);
      });

    // Module suivant
    document.getElementById('m2-next-btn')
      ?.addEventListener('click', () => navigateTo('m3'));
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    const textEl = document.getElementById('m2-mantra-text');
    if (textEl) {
      textEl.classList.remove('m2-text--visible');
      textEl.innerHTML = '';
    }
    setTimeout(() => {
      displayMantra(pickMantra(), true);
    }, 200);
  }

  function onLeave() {
    wordTimeouts.forEach(clearTimeout);
    wordTimeouts = [];
    if (animTimeout) { clearTimeout(animTimeout); animTimeout = null; }
  }

  // ── Enregistrement du hook ─────────────────────────────────────
  bindEvents();
  screenHooks.m2 = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
