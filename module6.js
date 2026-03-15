'use strict';

/* ================================================================
   MATRICE — Module 6 : Yi King & Clôture
   Simulation lancer 3 pièces × 6, hexagramme SVG, résumé rituel
   ================================================================ */

const Module6 = (() => {

  // ── État ──────────────────────────────────────────────────────
  let throws   = [];   // résultats des 6 lancers (0=yin, 1=yang)
  let hexagram = null; // objet hexagramme courant
  let overlayOpen = false;

  // ── Simulation 3 pièces ───────────────────────────────────────
  function throwCoins() {
    // 3 pièces : pile=2 (yin), face=3 (yang)
    // Somme : 6,7,8,9 → yin si 6/8, yang si 7/9
    const coins = [0, 0, 0].map(() => Math.random() < 0.5 ? 2 : 3);
    const sum   = coins.reduce((a, b) => a + b, 0);
    // 6=yin vieux, 7=yang, 8=yin, 9=yang vieux — on simplifie : pair=yin, impair=yang
    return sum % 2 === 0 ? 0 : 1;
  }

  // ── Mise à jour de l'UI de lancer ────────────────────────────
  function updateThrowUI() {
    for (let i = 0; i < 6; i++) {
      const lineEl = document.getElementById(`m6-line-${i}`);
      if (!lineEl) continue;
      if (i < throws.length) {
        lineEl.className = 'm6-trait ' + (throws[i] === 1 ? 'm6-trait--yang' : 'm6-trait--yin');
        lineEl.classList.add('m6-trait--appear');
      } else {
        lineEl.className = 'm6-trait m6-trait--pending';
      }
    }
  }

  // ── Ajouter un lancer ─────────────────────────────────────────
  function addThrow() {
    if (throws.length >= 6) return;
    const result = throwCoins();
    throws.push(result);
    updateThrowUI();

    // Vibration mobile
    if (navigator.vibrate) navigator.vibrate(30);

    // Mettre à jour le compteur
    const cntEl = document.getElementById('m6-throw-count');
    if (cntEl) cntEl.textContent = `${throws.length} / 6`;

    const btn = document.getElementById('m6-throw-btn');

    if (throws.length === 6) {
      // Hexagramme complet
      btn?.classList.add('m6-throw-btn--done');
      if (btn) btn.textContent = 'Révèle l\'hexagramme ✦';
      setTimeout(revealHexagram, 600);
    } else {
      // Animation de flash sur le bouton
      btn?.classList.add('m6-throw-btn--flash');
      setTimeout(() => btn?.classList.remove('m6-throw-btn--flash'), 300);
    }
  }

  // ── SVG de l'hexagramme ───────────────────────────────────────
  function buildHexagramSVG(traits) {
    // traits[0] = bas, traits[5] = haut
    // On affiche de haut en bas (index 5 en premier dans le SVG)
    const lines = [];
    for (let i = 5; i >= 0; i--) {
      const yang = traits[i] === 1;
      const y    = 10 + (5 - i) * 24;
      if (yang) {
        // Trait plein
        lines.push(`<rect x="16" y="${y}" width="88" height="10" rx="1" fill="currentColor" opacity="0.85"/>`);
      } else {
        // Trait brisé (deux segments)
        lines.push(`<rect x="16" y="${y}" width="38" height="10" rx="1" fill="currentColor" opacity="0.85"/>`);
        lines.push(`<rect x="66" y="${y}" width="38" height="10" rx="1" fill="currentColor" opacity="0.85"/>`);
      }
    }
    return `<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" class="m6-hex-svg">${lines.join('')}</svg>`;
  }

  // ── Révélation de l'hexagramme ────────────────────────────────
  function revealHexagram() {
    hexagram = getHexagramByTraits(throws);
    if (typeof RITUAL_STATE !== 'undefined') {
      RITUAL_STATE.hexagram     = hexagram.number;
      RITUAL_STATE.hexagramName = hexagram.nameFrench;
    }

    // Cache zone de lancer, montre zone résultat
    const throwZone  = document.getElementById('m6-throw-zone');
    const resultZone = document.getElementById('m6-result-zone');
    if (throwZone) {
      throwZone.style.transition = 'opacity 0.4s';
      throwZone.style.opacity    = '0';
      setTimeout(() => {
        throwZone.style.display = 'none';
        resultZone.style.display = 'flex';
        setTimeout(() => {
          resultZone.style.opacity = '1';
        }, 30);
        displayHexagramResult();
      }, 420);
    }
  }

  function displayHexagramResult() {
    if (!hexagram) return;

    const svgWrap     = document.getElementById('m6-hex-svg-wrap');
    const numEl       = document.getElementById('m6-hex-number');
    const nameChEl    = document.getElementById('m6-hex-name-ch');
    const nameFrEl    = document.getElementById('m6-hex-name-fr');
    const adviceEl    = document.getElementById('m6-hex-advice');
    const footer      = document.getElementById('m6-footer');

    if (svgWrap) svgWrap.innerHTML = buildHexagramSVG(hexagram.traits);
    if (numEl)   numEl.textContent   = `Hexagramme ${hexagram.number}`;
    if (nameChEl) nameChEl.textContent = hexagram.nameChinese;
    if (nameFrEl) nameFrEl.textContent = hexagram.nameFrench;
    if (adviceEl) adviceEl.textContent = hexagram.shortAdvice;

    setTimeout(() => {
      footer?.classList.add('m6-footer--visible');
    }, 800);
  }

  // ── Overlay interprétation ────────────────────────────────────
  function openOverlay() {
    if (!hexagram) return;
    overlayOpen = true;
    const overlay = document.getElementById('m6-overlay');
    const titleEl = document.getElementById('m6-overlay-title');
    const textEl  = document.getElementById('m6-overlay-text');
    if (titleEl) titleEl.textContent = `${hexagram.nameFrench} — ${hexagram.nameChinese}`;
    if (textEl)  textEl.textContent  = hexagram.fullInterpretation;
    if (overlay) {
      overlay.style.display = 'flex';
      setTimeout(() => { overlay.style.opacity = '1'; }, 20);
    }
  }

  function closeOverlay() {
    overlayOpen = false;
    const overlay = document.getElementById('m6-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 350);
    }
  }

  // ── Reset pour prochain usage ─────────────────────────────────
  function resetModule() {
    throws   = [];
    hexagram = null;
    overlayOpen = false;

    const throwZone  = document.getElementById('m6-throw-zone');
    const resultZone = document.getElementById('m6-result-zone');
    if (throwZone)  { throwZone.style.display = 'flex'; throwZone.style.opacity = '1'; }
    if (resultZone) { resultZone.style.display = 'none'; resultZone.style.opacity = '0'; }

    const btn = document.getElementById('m6-throw-btn');
    if (btn) {
      btn.textContent = 'Lancer les pièces';
      btn.classList.remove('m6-throw-btn--done', 'm6-throw-btn--flash');
    }
    const cntEl = document.getElementById('m6-throw-count');
    if (cntEl) cntEl.textContent = '0 / 6';

    document.getElementById('m6-footer')?.classList.remove('m6-footer--visible');
    updateThrowUI();
  }

  // ── Liaison des événements ────────────────────────────────────
  function bindEvents() {
    document.getElementById('m6-throw-btn')
      ?.addEventListener('click', () => {
        if (throws.length < 6) addThrow();
      });

    document.getElementById('m6-full-btn')
      ?.addEventListener('click', openOverlay);

    document.getElementById('m6-overlay-close')
      ?.addEventListener('click', closeOverlay);

    document.getElementById('m6-overlay')
      ?.addEventListener('click', e => {
        if (e.target === document.getElementById('m6-overlay')) closeOverlay();
      });

    document.getElementById('m6-next-btn')
      ?.addEventListener('click', () => navigateTo('cloture'));
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    resetModule();
  }

  function onLeave() {
    closeOverlay();
  }

  bindEvents();
  screenHooks.m6 = { onEnter, onLeave };

  return { onEnter, onLeave };
})();


/* ================================================================
   ÉCRAN CLÔTURE
   ================================================================ */

const ScreenCloture = (() => {

  function buildSummary() {
    const state = (typeof RITUAL_STATE !== 'undefined') ? RITUAL_STATE : {};

    const mantraEl  = document.getElementById('cl-mantra-val');
    const elementEl = document.getElementById('cl-element-val');
    const hexEl     = document.getElementById('cl-hex-val');
    const closingEl = document.getElementById('cl-closing');
    const streakEl  = document.getElementById('cl-streak');

    if (mantraEl)  mantraEl.textContent  = state.mantra       || '—';
    if (elementEl) elementEl.textContent = state.element      || '—';
    if (hexEl)     hexEl.textContent     = state.hexagramName
      ? `${state.hexagram} — ${state.hexagramName}`
      : '—';

    // Phrase de clôture
    const closing = pickClosing(state.elementKey || null);
    if (closingEl) closingEl.textContent = closing;

    // Streak
    incrementStreak();
    const streak = parseInt(localStorage.getItem('matrice_streak') || '0', 10);
    if (streakEl) streakEl.textContent = streak;

    // Mise à jour streak sur l'accueil
    const mainStreak = document.getElementById('streak-number');
    if (mainStreak) mainStreak.textContent = streak;
  }

  function incrementStreak() {
    const today    = new Date().toDateString();
    const lastDay  = localStorage.getItem('matrice_last_ritual');
    if (lastDay === today) return; // déjà incrémenté aujourd'hui

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let streak = parseInt(localStorage.getItem('matrice_streak') || '0', 10);

    if (lastDay === yesterday) {
      streak += 1;
    } else {
      streak = 1; // streak brisé
    }

    localStorage.setItem('matrice_streak', String(streak));
    localStorage.setItem('matrice_last_ritual', today);
  }

  function bindEvents() {
    document.getElementById('cl-finish-btn')
      ?.addEventListener('click', () => navigateTo('accueil'));
  }

  function onEnter() {
    buildSummary();
    // Animation d'entrée sur la clôture
    document.getElementById('screen-cloture')?.classList.add('cloture-reveal');
  }

  function onLeave() {}

  bindEvents();
  screenHooks.cloture = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
