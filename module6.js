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

    // Haptic feedback
    if (typeof haptic === 'function') haptic(50);

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
      setTimeout(() => btn?.classList.remove('m6-throw-btn--flash'), 450);
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

  // ── Icônes éléments ───────────────────────────────────────────
  function buildElemIcon(key, size) {
    if (key === 'air') {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 9Q9 6.5 15 9Q19 10.5 21 9"/><path d="M3 13Q9 10.5 15 13Q19 14.5 21 13"/></svg>`;
    }
    if (key === 'terre') {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 19L9 8L13 14L17 9L21 19"/><line x1="3" y1="19" x2="21" y2="19"/></svg>`;
    }
    const P = {
      feu:   'M12 3C10 7 7 10 7 14.5C7 18 9.2 21 12 21C14.8 21 17 18 17 14.5C17 10 14 7 12 3Z',
      eau:   'M12 3C12 3 5 11 5 15.5C5 19.1 8.1 22 12 22C15.9 22 19 19.1 19 15.5C19 11 12 3 12 3Z',
      ether: 'M12 2l2.09 4.26L18.5 7.27l-3.25 3.17.77 4.48L12 12.77l-4.02 2.15.77-4.48L5.5 7.27l4.41-.01z',
    };
    const p = P[key];
    if (!p) return '';
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${p}"/></svg>`;
  }

  // ── Mini hexagramme SVG ───────────────────────────────────────
  function buildHexMini(traits) {
    if (!traits || !traits.length) return '';
    const lines = [];
    for (let i = 5; i >= 0; i--) {
      const yang = traits[i] === 1;
      const y    = 2 + (5 - i) * 8;
      if (yang) {
        lines.push(`<rect x="2" y="${y}" width="20" height="5" rx="0.5" fill="currentColor" opacity="0.85"/>`);
      } else {
        lines.push(`<rect x="2" y="${y}" width="8" height="5" rx="0.5" fill="currentColor" opacity="0.85"/>`);
        lines.push(`<rect x="14" y="${y}" width="8" height="5" rx="0.5" fill="currentColor" opacity="0.85"/>`);
      }
    }
    return `<svg viewBox="0 0 24 47" width="13" height="26" xmlns="http://www.w3.org/2000/svg">${lines.join('')}</svg>`;
  }

  function buildSummary() {
    const state = (typeof RITUAL_STATE !== 'undefined') ? RITUAL_STATE : {};
    const HUMEUR_COLORS = ['','#3a3a42','#5c5c6e','#9A7A2E','#C8952A','#FFD700'];
    const HUMEUR_LABELS = ['','Difficile','Peu en forme','Neutre','Bien','Excellent'];

    // ── Humeur
    const dot       = document.getElementById('cl-sum-dot');
    const humeurTxt = document.getElementById('cl-sum-humeur-text');
    if (dot) dot.style.background = HUMEUR_COLORS[state.humeur] || 'rgba(255,255,255,0.18)';
    if (humeurTxt) {
      humeurTxt.textContent = state.humeur
        ? `${state.humeur} / 5 — ${HUMEUR_LABELS[state.humeur] || ''}`
        : '—';
    }

    // ── Mantra (6 premiers mots)
    const mantraEl = document.getElementById('cl-mantra-val');
    if (mantraEl) {
      mantraEl.textContent = state.mantra || '—';
    }

    // ── Élément + icône + sort (5 premiers mots)
    const elemIcon = document.getElementById('cl-elem-icon');
    const elemText = document.getElementById('cl-element-val');
    if (elemIcon) elemIcon.innerHTML = state.elementKey ? buildElemIcon(state.elementKey, 16) : '';
    if (elemText) {
      const sortSnippet = state.sort
        ? state.sort.split(' ').slice(0, 5).join(' ') + '\u202F…' : '';
      elemText.textContent = state.element
        ? (sortSnippet ? `${state.element} · ${sortSnippet}` : state.element)
        : '—';
    }

    // ── Hexagramme mini
    const hexMiniEl = document.getElementById('cl-hex-mini');
    const hexText   = document.getElementById('cl-hex-val');
    if (hexMiniEl && state.hexagram && typeof HEXAGRAMS !== 'undefined') {
      const hex = HEXAGRAMS.find(h => h.number === state.hexagram);
      hexMiniEl.innerHTML = hex ? buildHexMini(hex.traits) : '';
    }
    if (hexText) {
      hexText.textContent = state.hexagramName
        ? `${state.hexagram} — ${state.hexagramName}` : '—';
    }

    // ── Phrase de clôture
    const closingEl = document.getElementById('cl-closing');
    const closing = (typeof pickClosing === 'function') ? pickClosing(state.elementKey || null) : '';
    if (closingEl) closingEl.textContent = closing;

    // ── Citation philosophique
    const citation = (typeof pickCitation === 'function') ? pickCitation() : null;
    const citWrap  = document.getElementById('cl-citation-wrap');
    const citText  = document.getElementById('cl-citation-text');
    const citAuth  = document.getElementById('cl-citation-author');
    if (citation && citWrap) {
      if (citText) citText.textContent = '« ' + citation.texte + ' »';
      if (citAuth) citAuth.textContent = '— ' + citation.auteur;
      citWrap.hidden = false;
    } else if (citWrap) {
      citWrap.hidden = true;
    }

    // ── Insight lunaire
    const moonWrap   = document.getElementById('cl-moon-wrap');
    const moonIconEl = document.getElementById('cl-moon-icon');
    const moonInsEl  = document.getElementById('cl-moon-insight');
    const sepMoon    = document.getElementById('cl-sep-moon');
    if (moonWrap && typeof MoonSystem !== 'undefined') {
      const phase = MoonSystem.getMoonPhase(new Date());
      if (moonIconEl) moonIconEl.innerHTML = MoonSystem.drawMoonIcon(phase.key, 22);
      if (moonInsEl)  moonInsEl.textContent  = phase.insight;
      moonWrap.hidden = false;
      if (sepMoon) sepMoon.hidden = false;
    }

    // ── Streak
    const streak   = MatriceStorage.incrementStreak(state.humeur || 3);
    const streakEl = document.getElementById('cl-streak');
    if (streakEl) streakEl.textContent = streak;

    // ── Sauvegarde
    MatriceStorage.saveRitualLog({
      date:           new Date().toISOString().slice(0, 10),
      humeur:         state.humeur         || null,
      mantra:         state.mantra         || null,
      mantraCategory: state.mantraCategory  || null,
      intentions:     state.intentions     || [],
      element:        state.element        || null,
      elementKey:     state.elementKey     || null,
      hexagram:       state.hexagram       || null,
      hexagramName:   state.hexagramName   || null,
    });
  }

  function bindEvents() {
    document.getElementById('cl-finish-btn')
      ?.addEventListener('click', () => navigateTo('accueil'));
  }

  let clTimers = [];

  function onEnter() {
    buildSummary();
    document.getElementById('cl-scroll')?.scrollTo(0, 0);
    if (typeof Module1 !== 'undefined') Module1.fadeOutBinaural(3);
    // Haptic triple pulse — rituel scellé
    if (typeof haptic === 'function') haptic([50, 50, 50]);
    // Cloche 528Hz — clôture
    if (typeof playBell === 'function') playBell();

    // ── Reveal séquentiel — cérémonie de clôture ──────────────
    const elements = [
      { sel: '.cl-title',         delay: 0,    halo: true },
      { sel: '.cl-summary .cl-sum-row:nth-child(1)', delay: 1300 },
      { sel: '.cl-summary .cl-sum-row:nth-child(2)', delay: 1600 },
      { sel: '.cl-summary .cl-sum-row:nth-child(3)', delay: 1900 },
      { sel: '.cl-summary .cl-sum-row:nth-child(4)', delay: 2200 },
      { sel: '.cl-closing',       delay: 2800 },
      { sel: '.cl-citation-wrap', delay: 3400 },
      { sel: '.cl-moon-wrap',     delay: 4000 },
      { sel: '.cl-streak-block',  delay: 4600, spiral: true },
      { sel: '.cl-finish-btn',    delay: 5200 },
    ];

    const screen = document.getElementById('screen-cloture');
    if (!screen) return;

    // Masquer tous les éléments
    elements.forEach(({ sel }) => {
      const el = screen.querySelector(sel);
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(12px)';
        el.style.transition = 'none';
      }
    });

    // Masquer aussi les séparateurs
    screen.querySelectorAll('.cl-sep').forEach(s => {
      s.style.opacity = '0';
      s.style.transition = 'none';
    });

    // Reveal séquentiel
    elements.forEach(({ sel, delay, halo, spiral }) => {
      const t = setTimeout(() => {
        const el = screen.querySelector(sel);
        if (!el || el.hidden) return;

        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';

        // Halo doré sur le titre
        if (halo) {
          el.classList.add('cl-title--halo');
          setTimeout(() => el.classList.remove('cl-title--halo'), 2500);
        }

        // Animation spirale sur le streak
        if (spiral) {
          const spiralSvg = el.querySelector('.cl-streak-spiral');
          if (spiralSvg) spiralSvg.classList.add('cl-spiral--animate');
        }
      }, delay);
      clTimers.push(t);
    });

    // Reveal séparateurs
    screen.querySelectorAll('.cl-sep').forEach((s, i) => {
      const t = setTimeout(() => {
        s.style.transition = 'opacity 0.4s ease';
        s.style.opacity = '1';
      }, 2600 + i * 600);
      clTimers.push(t);
    });
  }

  function onLeave() {
    clTimers.forEach(clearTimeout);
    clTimers = [];
  }

  bindEvents();
  screenHooks.cloture = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
