'use strict';

/* ================================================================
   MATRICE — Module SOS : Flux automatique
   Étapes séquentielles sans intervention de l'utilisateur
   ================================================================ */

const ModuleSOS = (() => {

  // ── Constantes ────────────────────────────────────────────────
  const NS          = 'http://www.w3.org/2000/svg';
  const INSPIRE_MS  = 4000;
  const EXPIRE_MS   = 8000;
  const INPUT_MS    = 15000;     // étape 3 = 15 s
  const GDV_CX = 120, GDV_CY = 120, GDV_R = 46;
  const SPREAD = 15, R_GROW = 8;

  // ── État ──────────────────────────────────────────────────────
  const BREATH_TOTAL_MS = 60000; // étape 2 = 60 s
  let timers      = [];
  let breathRaf   = null;
  let breathPhase = 'inspire'; // 'inspire' | 'expire'
  let breathStart = null;
  let audioCtx    = null;
  let binNodes    = null;
  let binActive   = false;
  let sosCircles  = [];
  let progStart   = null;
  let progRaf     = null;

  // ── Helpers timing ────────────────────────────────────────────
  function after(ms, fn) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function clearAll() {
    timers.forEach(clearTimeout);
    timers = [];
    stopBreath();
    stopProg();
    stopBinaural();
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ── Flash blanc "crack" entre phases ──────────────────────────
  function flashCrack() {
    const screen = document.getElementById('screen-sos');
    if (!screen) return;
    const flash = document.createElement('div');
    flash.className = 'sos-flash-crack';
    screen.appendChild(flash);
    after(500, () => flash.remove());
  }

  // ── Effet typewriter pour texte SOS ──────────────────────────
  function typewriterEffect(element, text, charDelay, callback) {
    if (!element) { callback?.(); return; }
    element.textContent = '';
    element.style.opacity = '1';
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
        const t = setTimeout(type, charDelay);
        timers.push(t);
      } else {
        callback?.();
      }
    }
    type();
  }

  // ── Pulse écran subtil entre phases ─────────────────────────
  function screenPulse() {
    const screen = document.getElementById('screen-sos');
    if (!screen) return;
    screen.classList.add('sos-screen-pulse');
    after(800, () => screen.classList.remove('sos-screen-pulse'));
  }

  // ── Transition entre étapes ───────────────────────────────────
  function gotoStep(fromId, toId, done) {
    const fromEl = document.getElementById(fromId);
    const toEl   = document.getElementById(toId);
    if (!fromEl || !toEl) { done?.(); return; }

    // Flash blanc "crack" à la transition
    flashCrack();
    screenPulse();

    // Fade-out de l'étape actuelle
    fromEl.style.transition = 'opacity 0.7s ease';
    fromEl.style.opacity    = '0';

    after(700, () => {
      fromEl.classList.add('sos-step--off');
      fromEl.style.display = 'none';
      fromEl.style.opacity = '1';

      toEl.classList.remove('sos-step--off');
      toEl.style.display   = 'flex';
      toEl.style.opacity   = '0';
      toEl.style.transition = 'opacity 0.9s ease';

      // Force reflow
      void toEl.offsetWidth;

      toEl.style.opacity = '1';
      after(900, () => done?.());
    });
  }

  // ── Audio binaural ────────────────────────────────────────────
  function getAC() {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function startBinaural() {
    stopBinaural();
    const ac   = getAC();
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ac.currentTime + 1.5);
    gain.connect(ac.destination);

    const panL = ac.createStereoPanner(); panL.pan.value = -1;
    const panR = ac.createStereoPanner(); panR.pan.value =  1;

    const oscL = ac.createOscillator();
    oscL.type = 'sine'; oscL.frequency.value = 100;
    oscL.connect(panL).connect(gain);

    const oscR = ac.createOscillator();
    oscR.type = 'sine'; oscR.frequency.value = 106; // beat Theta 6 Hz
    oscR.connect(panR).connect(gain);

    oscL.start(); oscR.start();
    binNodes = { oscL, oscR, gain };
  }

  function stopBinaural() {
    if (!binNodes) return;
    try {
      const ac = getAC();
      binNodes.gain.gain.linearRampToValueAtTime(0, ac.currentTime + 0.5);
      const snap = binNodes;
      setTimeout(() => { try { snap.oscL.stop(); snap.oscR.stop(); } catch {} }, 650);
    } catch {}
    binNodes = null;
  }

  function updateBinBtn() {
    const btn = document.getElementById('sos-ctrl-bin');
    if (!btn) return;
    btn.classList.toggle('sos-ctrl-bin--active', binActive);
    btn.setAttribute('aria-pressed', String(binActive));
  }

  function toggleBin() {
    if (binActive) { stopBinaural(); binActive = false; }
    else           { startBinaural(); binActive = true; }
    updateBinBtn();
  }

  // ── Graine de Vie ─────────────────────────────────────────────
  function buildSeed() {
    const g = document.querySelector('#sos-seed-svg .sos-seed-circles');
    if (!g || sosCircles.length > 0) return;

    const center = document.createElementNS(NS, 'circle');
    center.setAttribute('cx', GDV_CX);
    center.setAttribute('cy', GDV_CY);
    center.setAttribute('r',  GDV_R);
    g.appendChild(center);
    sosCircles.push({ el: center, angle: null });

    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * Math.PI / 180;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (GDV_CX + GDV_R * Math.cos(angle)).toFixed(3));
      c.setAttribute('cy', (GDV_CY + GDV_R * Math.sin(angle)).toFixed(3));
      c.setAttribute('r',  GDV_R);
      g.appendChild(c);
      sosCircles.push({ el: c, angle });
    }
  }

  function updateSeed(amt, ts) {
    const r = GDV_R + R_GROW * amt;
    const d = GDV_R + SPREAD * amt;
    sosCircles.forEach(({ el, angle }, i) => {
      if (i === 0) {
        el.setAttribute('r', (r + Math.sin(ts / 900) * 1.2 * amt).toFixed(2));
      } else {
        const ripple = Math.sin(ts / 1400 + i * 1.047) * 1.5 * amt;
        el.setAttribute('cx', (GDV_CX + (d + ripple) * Math.cos(angle)).toFixed(2));
        el.setAttribute('cy', (GDV_CY + (d + ripple) * Math.sin(angle)).toFixed(2));
        el.setAttribute('r',  (r + ripple * 0.3).toFixed(2));
      }
    });
    const sw = (0.5 + amt * 1).toFixed(2);
    sosCircles.forEach(({ el }) => el.setAttribute('stroke-width', sw));

    const blurEl = document.getElementById('sos-blur-el');
    if (blurEl) blurEl.setAttribute('stdDeviation', (amt * 2.5 + 1).toFixed(1));
  }

  // ── Boucle de respiration (inspire 4s / expire 8s) ───────────
  function breathLoop(ts) {
    if (!breathStart) breathStart = ts;

    const duration = breathPhase === 'inspire' ? INSPIRE_MS : EXPIRE_MS;
    const elapsed  = ts - breathStart;
    const t        = Math.min(elapsed / duration, 1);
    const amt      = breathPhase === 'inspire' ? easeInOut(t) : easeInOut(1 - t);

    updateSeed(amt, ts);

    // Barre de respiration
    const fill = document.getElementById('sos-breath-fill');
    if (fill) fill.style.transform = `scaleX(${amt.toFixed(3)})`;

    // Label
    const label  = breathPhase === 'inspire' ? 'Inspirez...' : 'Expirez...';
    const labelEl = document.getElementById('sos-breath-label');
    if (labelEl && labelEl.textContent !== label) labelEl.textContent = label;

    if (t >= 1) {
      // Changer de phase
      breathPhase = breathPhase === 'inspire' ? 'expire' : 'inspire';
      breathStart = ts;
    }

    breathRaf = requestAnimationFrame(breathLoop);
  }

  function startBreath() {
    breathPhase = 'inspire';
    breathStart = null;
    breathRaf   = requestAnimationFrame(breathLoop);
  }

  function stopBreath() {
    if (breathRaf) { cancelAnimationFrame(breathRaf); breathRaf = null; }
  }

  // ── Barre de progression (étape 3) ────────────────────────────
  function startProg(durationMs) {
    progStart = null;
    const fill = document.getElementById('sos-prog-fill');

    function loop(ts) {
      if (!progStart) progStart = ts;
      const t = Math.min((ts - progStart) / durationMs, 1);
      if (fill) fill.style.transform = `scaleX(${t.toFixed(4)})`;
      if (t < 1) progRaf = requestAnimationFrame(loop);
    }
    progRaf = requestAnimationFrame(loop);
  }

  function stopProg() {
    if (progRaf) { cancelAnimationFrame(progRaf); progRaf = null; }
  }

  // ── Réponse transmutation / ancrage ───────────────────────────
  function getResponse(word) {
    if (word && word.length > 0) {
      const pool = (typeof detectPool === 'function') ? detectPool(word) : 'general';
      if (typeof pickTransmutation === 'function') {
        return pickTransmutation(pool, null);
      }
    }
    // Pas de mot → mantra ANCRAGE
    const pool = (typeof MANTRAS !== 'undefined' && MANTRAS.ANCRAGE)
      ? MANTRAS.ANCRAGE
      : ['Mon corps tient. Ma respiration tient. Je tiens.'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ── Flux principal ────────────────────────────────────────────
  function runFlow() {
    // Typewriter pour le texte d'entrée
    const s1text = document.getElementById('sos-s1-text');
    if (s1text) {
      s1text.innerHTML = '';
      typewriterEffect(s1text, 'Serre les poings. Fort.', 30);
    }

    // Étape 1 — Corps (8 s)
    after(5000, () => {
      const el = document.getElementById('sos-s1-text');
      if (el) {
        el.style.transition = 'opacity 0.6s ease';
        el.style.opacity = '0';
        after(600, () => {
          if (el) typewriterEffect(el, 'Relâche.', 30);
        });
      }
    });

    after(8000, () => {
      // Révéler le bouton binaural
      const bin = document.getElementById('sos-ctrl-bin');
      if (bin) bin.style.opacity = '1';

      gotoStep('sos-s1', 'sos-s2', () => {
        buildSeed();
        startBreath();

        // Étape 2 — Respiration (60 s)
        after(BREATH_TOTAL_MS, () => {
          stopBreath();

          gotoStep('sos-s2', 'sos-s3', () => {
            // Étape 3 — Nommer (15 s)
            startProg(INPUT_MS);
            const ta = document.getElementById('sos-textarea');
            if (ta) { ta.value = ''; try { ta.focus(); } catch {} }

            after(INPUT_MS, () => {
              stopProg();
              const word = (document.getElementById('sos-textarea')?.value || '').trim();
              const response = getResponse(word);

              gotoStep('sos-s3', 'sos-s4', () => {
                // Étape 4 — Réponse avec typewriter (10 s)
                const s4 = document.getElementById('sos-s4-text');
                typewriterEffect(s4, response, 30);

                after(10000, () => {
                  gotoStep('sos-s4', 'sos-s5', () => {
                    // Étape 5 — Victoire
                    after(10000, () => {
                      // Faire apparaître les boutons
                      const btns = document.getElementById('sos-end-btns');
                      if (btns) {
                        btns.classList.remove('sos-end-btns--off');
                        btns.style.transition = 'opacity 1.2s ease';
                        btns.style.opacity = '0';
                        void btns.offsetWidth;
                        btns.style.opacity = '1';
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  // ── Quitter ───────────────────────────────────────────────────
  function quitSOS() {
    clearAll();
    binActive = false;
    updateBinBtn();
    navigateTo('accueil');
  }

  // ── Réinitialiser l'affichage ─────────────────────────────────
  function resetSteps() {
    ['sos-s1', 'sos-s2', 'sos-s3', 'sos-s4', 'sos-s5'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.transition = 'none';
      el.style.opacity    = '1';
      if (i === 0) {
        el.classList.remove('sos-step--off');
        el.style.display = 'flex';
      } else {
        el.classList.add('sos-step--off');
        el.style.display = 'none';
      }
    });

    // Texte étape 1
    const s1text = document.getElementById('sos-s1-text');
    if (s1text) { s1text.style.transition = 'none'; s1text.style.opacity = '1'; s1text.innerHTML = 'Serre les poings.<br>Fort.'; }

    // SVG seed
    const g = document.querySelector('#sos-seed-svg .sos-seed-circles');
    if (g) g.innerHTML = '';
    sosCircles = [];

    // Bouton binaural caché au départ
    const bin = document.getElementById('sos-ctrl-bin');
    if (bin) bin.style.opacity = '0';

    // Boutons fin cachés
    const btns = document.getElementById('sos-end-btns');
    if (btns) {
      btns.classList.add('sos-end-btns--off');
      btns.style.transition = 'none';
      btns.style.opacity    = '0';
    }

    // Barre breath
    const bf = document.getElementById('sos-breath-fill');
    if (bf) bf.style.transform = 'scaleX(0)';

    // Barre prog
    const pf = document.getElementById('sos-prog-fill');
    if (pf) pf.style.transform = 'scaleX(0)';
  }

  // ── Liaison des événements ────────────────────────────────────
  function bindEvents() {
    document.getElementById('sos-ctrl-quit')
      ?.addEventListener('click', quitSOS);
    document.getElementById('sos-ctrl-bin')
      ?.addEventListener('click', toggleBin);
    document.getElementById('sos-btn-home')
      ?.addEventListener('click', quitSOS);
    document.getElementById('sos-btn-more')
      ?.addEventListener('click', () => { clearAll(); navigateTo('libre'); });
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    clearAll();
    binActive = false;
    updateBinBtn();
    resetSteps();
    // Haptic fort + Om 136.1Hz — urgence SOS
    if (typeof haptic === 'function') haptic(100);
    if (typeof playOmSos === 'function') playOmSos();
    runFlow();
  }

  function onLeave() {
    clearAll();
    binActive = false;
    updateBinBtn();
  }

  bindEvents();
  screenHooks.sos = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
