'use strict';

/* ================================================================
   MATRICE — Module 2 : Mantra du jour
   Affichage mot-par-mot, shuffle sans répétition, favoris
   ================================================================ */

const Module2 = (() => {

  // ── État ──────────────────────────────────────────────────────
  let currentMantra   = null;
  let currentCategory = null;
  let animTimeout     = null;
  let wordTimeouts    = [];

  // ── Sélection du mantra ───────────────────────────────────────
  // Traverse toutes les catégories, pondérée par nombre de non-vus.
  // L'humeur oriente la catégorie : 1-2 → ANCRAGE, 4-5 → ÉLAN.
  function pickMantra() {
    const humeur = (typeof RITUAL_STATE !== 'undefined') ? RITUAL_STATE.humeur : null;

    if (humeur !== null && humeur <= 2 && MANTRAS.ANCRAGE) {
      return { text: MatriceStorage.pickUnique(MANTRAS.ANCRAGE, 'mantras.ANCRAGE'), category: 'ANCRAGE' };
    }
    if (humeur !== null && humeur >= 4 && MANTRAS['ÉLAN']) {
      return { text: MatriceStorage.pickUnique(MANTRAS['ÉLAN'], 'mantras.ÉLAN'), category: 'ÉLAN' };
    }

    const allTexts = [];
    for (const cat of MANTRAS_CATEGORIES) {
      const seen = MatriceStorage.getSeen('mantras.' + cat);
      MANTRAS[cat]
        .map((text, i) => ({ text, cat, i }))
        .filter(({ i }) => !seen.includes(i))
        .forEach(item => allTexts.push(item));
    }

    // Si tout vu, réinitialiser et recommencer
    if (allTexts.length === 0) {
      for (const cat of MANTRAS_CATEGORIES) {
        MatriceStorage.saveSeen('mantras.' + cat, []);
      }
      return pickMantra();
    }

    const pick = allTexts[Math.floor(Math.random() * allTexts.length)];

    // Mettre à jour seen pour cette catégorie (garder le dernier si tout vu)
    const seen = MatriceStorage.getSeen('mantras.' + pick.cat);
    seen.push(pick.i);
    if (seen.length >= MANTRAS[pick.cat].length) {
      MatriceStorage.saveSeen('mantras.' + pick.cat, [pick.i]);
    } else {
      MatriceStorage.saveSeen('mantras.' + pick.cat, seen);
    }

    return { text: pick.text, category: pick.cat };
  }

  // ── Favoris (délégués à MatriceStorage) ──────────────────────
  const isFavorite    = text => MatriceStorage.isFavorite(text);
  const toggleFavorite = text => MatriceStorage.toggleFavorite(text);

  // ── Animation mot-par-mot ─────────────────────────────────────
  function animateWords(text, container) {
    wordTimeouts.forEach(clearTimeout);
    wordTimeouts = [];
    container.innerHTML = '';

    const words = text.split(' ');
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'm2-word';
      span.textContent = word;
      container.appendChild(span);
      if (i < words.length - 1) container.appendChild(document.createTextNode(' '));

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
