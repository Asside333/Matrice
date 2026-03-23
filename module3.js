'use strict';

/* ================================================================
   MATRICE — Module 3 : Intégration du sombre
   Plume de Maât, Yin Yang, transmutation contextuelle
   Animation « Grand Œuvre » — cosmic heartbeat, dissolution
   en particules dorées, silence visuel, matérialisation sacrée
   ================================================================ */

const Module3 = (() => {

  // ── État ──────────────────────────────────────────────────────
  let featherAnim = null;
  let lastTransmutation = null;
  let wordTimeouts = [];
  let transitionTimeouts = [];
  let particleContainer = null;

  // ── Animation de la Plume (flottement) ───────────────────────
  function startFeatherFloat() {
    stopFeatherFloat();
    const feather = document.getElementById('m3-feather');
    if (!feather) return;
    let t = 0;
    const step = () => {
      t += 0.012;
      const y  = Math.sin(t) * 6;
      const rx = Math.sin(t * 0.7) * 2.5;
      feather.style.transform = `translateY(${y}px) rotate(${rx}deg)`;
      featherAnim = requestAnimationFrame(step);
    };
    featherAnim = requestAnimationFrame(step);
  }

  function stopFeatherFloat() {
    if (featherAnim) { cancelAnimationFrame(featherAnim); featherAnim = null; }
  }

  // ── Particules dorées (dissolution du texte) ─────────────────
  function ensureParticleContainer() {
    if (particleContainer) return particleContainer;
    particleContainer = document.createElement('div');
    particleContainer.className = 'm3-particles';
    particleContainer.setAttribute('aria-hidden', 'true');
    const screen = document.getElementById('screen-m3');
    if (screen) screen.appendChild(particleContainer);
    return particleContainer;
  }

  function spawnParticles(originX, originY, count) {
    const container = ensureParticleContainer();
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'm3-particle';
      // Position de départ autour de l'origine
      const ox = originX + (Math.random() - 0.5) * 40;
      const oy = originY + (Math.random() - 0.5) * 10;
      p.style.left = ox + 'px';
      p.style.top  = oy + 'px';
      // Variables CSS custom pour trajectoire unique
      const dx = (Math.random() - 0.5) * 120;
      const dy = -(60 + Math.random() * 140);
      const dur = 0.8 + Math.random() * 1.2;
      const delay = Math.random() * 0.3;
      const size = 2 + Math.random() * 3;
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDuration  = dur + 's';
      p.style.animationDelay     = delay + 's';
      container.appendChild(p);
      // Auto-remove
      setTimeout(() => p.remove(), (dur + delay) * 1000 + 100);
    }
  }

  function clearParticles() {
    if (particleContainer) particleContainer.innerHTML = '';
  }

  // ── Dissolution lettre par lettre vers le haut ────────────────
  function dissolveText(element, callback) {
    const text = element.textContent || '';
    if (!text.trim()) { if (callback) callback(); return; }

    // Éclater le texte en lettres individuelles
    element.innerHTML = '';
    const letters = [];
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.className = 'm3-dissolve-letter';
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      element.appendChild(span);
      letters.push(span);
    }

    // Dissolution séquentielle avec particules
    const interval = Math.min(50, 800 / Math.max(letters.length, 1));
    letters.forEach((letter, i) => {
      const t = setTimeout(() => {
        // Position pour les particules
        const rect = letter.getBoundingClientRect();
        const screenRect = document.getElementById('screen-m3')?.getBoundingClientRect();
        if (rect.width > 0 && screenRect) {
          spawnParticles(
            rect.left - screenRect.left + rect.width / 2,
            rect.top - screenRect.top,
            3
          );
        }
        letter.classList.add('m3-dissolve-letter--gone');
      }, i * interval);
      transitionTimeouts.push(t);
    });

    // Callback après fin de dissolution
    const totalTime = letters.length * interval + 600;
    if (callback) {
      const t = setTimeout(callback, totalTime);
      transitionTimeouts.push(t);
    }
  }

  // ── Gestion des écrans input / result ────────────────────────
  function showInputPhase() {
    const input  = document.getElementById('m3-input-phase');
    const result = document.getElementById('m3-result-phase');
    const footer = document.getElementById('m3-footer');
    const screen = document.getElementById('screen-m3');

    if (input) {
      input.classList.remove('m3-phase--dissolve');
      input.classList.add('m3-phase--visible');
    }
    if (result) {
      result.classList.remove('m3-phase--visible');
    }
    if (footer) footer.classList.remove('m3-footer--visible');

    // Reset textarea
    const ta = document.getElementById('m3-textarea');
    if (ta) ta.value = '';

    // Reset transmutation
    const tText = document.getElementById('m3-transmutation-text');
    if (tText) { tText.innerHTML = ''; tText.classList.remove('m3-ttext--visible'); }

    // Reset result box
    const box = document.getElementById('m3-result-box');
    if (box) { box.classList.remove('m3-result--lit', 'm3-result--sweep'); }

    // Reset yin yang rotation additive
    const yy = document.getElementById('m3-yinyang');
    if (yy) { yy.classList.remove('m3-yy--flash', 'm3-yy--quarter'); }

    // Reset feather
    document.getElementById('m3-feather')?.classList.remove('m3-feather--lit');

    // Reset teal overlay
    screen?.classList.remove('m3-teal-glow');

    clearParticles();
  }

  // ── Animation de transmutation — Grand Œuvre ────────────────
  function transmute(userText) {
    const pool = detectPool(userText);
    const transmText = pickTransmutation(pool, lastTransmutation);
    lastTransmutation = transmText;

    const screen   = document.getElementById('screen-m3');
    const input    = document.getElementById('m3-input-phase');
    const result   = document.getElementById('m3-result-phase');
    const footer   = document.getElementById('m3-footer');
    const feather  = document.getElementById('m3-feather');
    const yinyang  = document.getElementById('m3-yinyang');
    const userDisp = document.getElementById('m3-user-text-display');
    const tText    = document.getElementById('m3-transmutation-text');
    const box      = document.getElementById('m3-result-box');
    const ta       = document.getElementById('m3-textarea');

    // Annuler timeouts précédents
    transitionTimeouts.forEach(clearTimeout);
    transitionTimeouts = [];
    wordTimeouts.forEach(clearTimeout);
    wordTimeouts = [];
    clearParticles();

    const at = (ms, fn) => {
      const t = setTimeout(fn, ms);
      transitionTimeouts.push(t);
      return t;
    };

    // Pré-remplir le texte utilisateur dans la zone résultat
    if (userDisp) userDisp.textContent = `"${userText}"`;

    // Préparer la boîte résultat
    if (tText) { tText.innerHTML = ''; tText.classList.remove('m3-ttext--visible'); }
    box?.classList.remove('m3-result--lit', 'm3-result--sweep');

    // ══════════════════════════════════════════════════════════
    //  PHASE 1 — Cosmic Heartbeat (0ms)
    //  Le fond pulse une fois, lentement, profondément
    // ══════════════════════════════════════════════════════════
    screen?.classList.add('m3-pulse');
    at(1200, () => screen?.classList.remove('m3-pulse'));

    // ══════════════════════════════════════════════════════════
    //  PHASE 2 — Plume de Maât brille intensément (200ms)
    // ══════════════════════════════════════════════════════════
    at(200, () => {
      feather?.classList.add('m3-feather--lit');
      // La plume reste illuminée 2s
      at(2200, () => feather?.classList.remove('m3-feather--lit'));
    });

    // ══════════════════════════════════════════════════════════
    //  PHASE 3 — Yin Yang quart de rotation fluide (400ms)
    // ══════════════════════════════════════════════════════════
    at(400, () => {
      if (yinyang) {
        yinyang.classList.add('m3-yy--flash', 'm3-yy--quarter');
        at(1500, () => yinyang.classList.remove('m3-yy--flash'));
      }
    });

    // ══════════════════════════════════════════════════════════
    //  PHASE 4 — Dissolution du texte utilisateur (600ms)
    //  Chaque lettre s'élève et se dissout en particules dorées
    // ══════════════════════════════════════════════════════════
    at(600, () => {
      if (ta) {
        // Créer un élément visuel temporaire avec le texte saisi
        // positionné sur la textarea pour la dissolution
        const dissolveEl = document.createElement('div');
        dissolveEl.className = 'm3-dissolve-overlay';
        dissolveEl.textContent = userText;
        const taRect = ta.getBoundingClientRect();
        const screenRect = screen?.getBoundingClientRect();
        if (screenRect) {
          dissolveEl.style.top  = (taRect.top - screenRect.top) + 'px';
          dissolveEl.style.left = (taRect.left - screenRect.left) + 'px';
          dissolveEl.style.width = taRect.width + 'px';
        }
        screen?.appendChild(dissolveEl);

        // Cacher l'input original
        input?.classList.add('m3-phase--fading');

        // Lancer la dissolution lettre par lettre
        dissolveText(dissolveEl, () => {
          dissolveEl.remove();
        });
      }

      // Masquer complètement l'input après la dissolution
      at(900, () => {
        if (input) {
          input.classList.remove('m3-phase--visible', 'm3-phase--fading');
        }
      });
    });

    // ══════════════════════════════════════════════════════════
    //  PHASE 5 — Silence visuel (500ms de vide sacré)
    //  L'écran respire, seuls la plume et le yin yang vivent
    // ══════════════════════════════════════════════════════════
    // (implicite : gap entre disparition input et apparition résultat)

    // ══════════════════════════════════════════════════════════
    //  PHASE 6 — Teal background fade-in (2000ms)
    // ══════════════════════════════════════════════════════════
    at(2000, () => {
      screen?.classList.add('m3-teal-glow');
    });

    // ══════════════════════════════════════════════════════════
    //  PHASE 7 — Matérialisation de la transmutation (2200ms)
    //  La phase résultat apparaît, texte mot par mot au centre
    // ══════════════════════════════════════════════════════════
    at(2200, () => {
      result?.classList.add('m3-phase--visible');
    });

    // La boîte s'illumine
    at(2400, () => {
      box?.classList.add('m3-result--lit');
    });

    // Sweep de lumière
    at(2600, () => {
      box?.classList.add('m3-result--sweep');
    });

    // Texte émerge mot par mot avec glow
    at(2700, () => {
      if (!tText) return;
      tText.style.cssText = "text-align:center; max-width:85vw; margin:0 auto; padding:20px; word-break:normal; hyphens:none;";
      const words = transmText.split(' ');
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'm3-word';
        span.textContent = w;
        tText.appendChild(span);
        if (i < words.length - 1) tText.appendChild(document.createTextNode(' '));

        const tAppear = setTimeout(() => {
          span.classList.add('m3-word--visible');
          setTimeout(() => span.classList.add('m3-word--settled'), 800);
        }, i * 90);
        wordTimeouts.push(tAppear);
      });
      tText.classList.add('m3-ttext--visible');
    });

    // ── Footer après matérialisation complète ──
    const wordDelay = transmText.split(' ').length * 90;
    at(2700 + wordDelay + 800, () => {
      footer?.classList.add('m3-footer--visible');
    });
  }

  // ── Liaison des événements ────────────────────────────────────
  function bindEvents() {
    // Bouton "Transmuter"
    document.getElementById('m3-transmute-btn')
      ?.addEventListener('click', () => {
        const ta = document.getElementById('m3-textarea');
        const text = (ta?.value || '').trim();
        if (text.length < 2) {
          ta?.classList.add('m3-ta--shake');
          setTimeout(() => ta?.classList.remove('m3-ta--shake'), 400);
          return;
        }
        transmute(text);
      });

    // Recommencer
    document.getElementById('m3-reset-btn')
      ?.addEventListener('click', showInputPhase);

    // Module suivant
    document.getElementById('m3-next-btn')
      ?.addEventListener('click', () => navigateTo('m4'));
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    showInputPhase();
    startFeatherFloat();
  }

  function onLeave() {
    stopFeatherFloat();
    transitionTimeouts.forEach(clearTimeout);
    transitionTimeouts = [];
    wordTimeouts.forEach(clearTimeout);
    wordTimeouts = [];
    clearParticles();
    document.getElementById('screen-m3')?.classList.remove('m3-teal-glow');
  }

  bindEvents();
  screenHooks.m3 = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
