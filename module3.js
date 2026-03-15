'use strict';

/* ================================================================
   MATRICE — Module 3 : Intégration du sombre
   Plume de Maât, Yin Yang, transmutation contextuelle
   ================================================================ */

const Module3 = (() => {

  // ── État ──────────────────────────────────────────────────────
  let featherAnim = null;
  let lastTransmutation = null;
  let wordTimeouts = [];
  let transitionTimeouts = [];

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

  // ── Gestion des écrans input / result ────────────────────────
  function showInputPhase() {
    const input  = document.getElementById('m3-input-phase');
    const result = document.getElementById('m3-result-phase');
    const footer = document.getElementById('m3-footer');

    if (input)  {
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

    // Reset yin yang (pas de transform inline — laisser la CSS animation gérer)
    const yy = document.getElementById('m3-yinyang');
    if (yy) { yy.classList.remove('m3-yy--flash'); }
  }

  // ── Animation de transmutation ────────────────────────────────
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

    // Annuler timeouts précédents
    transitionTimeouts.forEach(clearTimeout);
    transitionTimeouts = [];
    wordTimeouts.forEach(clearTimeout);
    wordTimeouts = [];

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

    // ── 0ms : double battement de cœur ────────────────────────
    screen?.classList.add('m3-pulse');
    at(800, () => screen?.classList.remove('m3-pulse'));

    // ── 200ms : illumination intense de la Plume ──────────────
    at(200, () => feather?.classList.add('m3-feather--lit'));

    // ── 400ms : Yin Yang flash de lumière ─────────────────────
    at(400, () => {
      if (yinyang) {
        yinyang.classList.add('m3-yy--flash');
        setTimeout(() => yinyang.classList.remove('m3-yy--flash'), 1100);
      }
    });

    // ── 600ms : le texte de l'utilisateur se dissout vers le haut
    at(600, () => {
      if (input) {
        input.classList.remove('m3-phase--visible');
        input.classList.add('m3-phase--dissolve');
      }
    });

    // ── 1050ms : input masqué, résultat apparaît (fade-in depuis opacity:0)
    at(1050, () => {
      input?.classList.remove('m3-phase--dissolve'); // retour à opacity:0 (base)
      // Petit délai pour que le reflow enregistre l'état initial avant transition
      at(30, () => result?.classList.add('m3-phase--visible'));
    });

    // ── 1200ms : la boîte s'illumine du sombre vers le teal/or ──
    at(1200, () => {
      box?.classList.add('m3-result--lit');
    });

    // ── 1400ms : sweep de lumière sur la boîte ────────────────
    at(1400, () => {
      box?.classList.add('m3-result--sweep');
    });

    // ── 1500ms : texte émerge mot par mot avec glow ───────────
    at(1500, () => {
      if (!tText) return;
      const words = transmText.split(' ');
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'm3-word';
        span.textContent = w + (i < words.length - 1 ? '\u00A0' : '');
        tText.appendChild(span);

        // Apparition avec glow
        const tAppear = setTimeout(() => {
          span.classList.add('m3-word--visible');
          // Glow s'estompe 600ms après l'apparition
          setTimeout(() => span.classList.add('m3-word--settled'), 600);
        }, i * 75);
        wordTimeouts.push(tAppear);
      });
      tText.classList.add('m3-ttext--visible');
    });

    // ── Après les mots + 700ms : footer "Clôturer" apparaît ──
    const wordDelay = transmText.split(' ').length * 75;
    at(1500 + wordDelay + 700, () => {
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
      ?.addEventListener('click', () => navigateTo('accueil'));
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    // Reset complet avant de démarrer
    showInputPhase();
    document.getElementById('m3-feather')?.classList.remove('m3-feather--lit');
    startFeatherFloat();
  }

  function onLeave() {
    stopFeatherFloat();
    transitionTimeouts.forEach(clearTimeout);
    transitionTimeouts = [];
    wordTimeouts.forEach(clearTimeout);
    wordTimeouts = [];
  }

  bindEvents();
  screenHooks.m3 = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
