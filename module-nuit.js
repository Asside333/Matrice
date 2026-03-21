'use strict';

/* ================================================================
   MATRICE — Module Nuit
   Config rapide → session : Graine de Vie 4-7-8, binaural delta,
   drone grave, timer configurable, fade-out progressif.
   ================================================================ */

const ModuleNuit = (() => {

  // ── Config state ─────────────────────────────────────────────
  let cfgMins      = 20;
  let cfgBin       = true;
  let cfgDrone     = true;

  // ── Session state ─────────────────────────────────────────────
  let running       = false;
  let totalSecs     = 20 * 60;
  let elapsed       = 0;
  let timerInterval = null;
  let animFrameId   = null;
  let phaseStart    = 0;
  let phaseIdx      = 0;
  let audioCtx      = null;
  let binNodes      = null;
  let droneNodes    = null;

  const PATTERN_478 = [
    { label: 'INSPIRE',  secs: 4 },
    { label: 'RETIENS',  secs: 7 },
    { label: 'EXPIRE',   secs: 8 },
  ];

  // ── Wake Lock ─────────────────────────────────────────────────
  let wakeLock = null;

  async function requestWakeLock() {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (_) {
      try {
        const vid = document.createElement('video');
        vid.setAttribute('loop', ''); vid.setAttribute('muted', ''); vid.setAttribute('playsinline', '');
        vid.style.cssText = 'position:fixed;top:-100px;opacity:0;pointer-events:none;';
        const src = document.createElement('source');
        src.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA=';
        src.type = 'video/mp4';
        vid.appendChild(src);
        document.body.appendChild(vid);
        vid.play().catch(() => {});
        wakeLock = { _vid: vid, release: () => { vid.pause(); vid.remove(); } };
      } catch (_) {}
    }
  }

  function releaseWakeLock() {
    try { wakeLock?.release(); } catch (_) {}
    wakeLock = null;
  }

  // ── Audio ────────────────────────────────────────────────────

  function getCtx() {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function startAudio() {
    stopAudio();
    try {
      const ac = getCtx();

      if (cfgBin) {
        const binGain = ac.createGain();
        binGain.gain.setValueAtTime(0, ac.currentTime);
        binGain.gain.linearRampToValueAtTime(0.05, ac.currentTime + 4);
        binGain.connect(ac.destination);

        const panL = ac.createStereoPanner(); panL.pan.value = -1;
        const panR = ac.createStereoPanner(); panR.pan.value =  1;

        const oscL = ac.createOscillator();
        oscL.type = 'sine'; oscL.frequency.value = 200;
        oscL.connect(panL).connect(binGain);

        const oscR = ac.createOscillator();
        oscR.type = 'sine'; oscR.frequency.value = 202;
        oscR.connect(panR).connect(binGain);

        oscL.start(); oscR.start();
        binNodes = { oscL, oscR, gain: binGain };
      }

      if (cfgDrone) {
        const droneGain = ac.createGain();
        droneGain.gain.setValueAtTime(0, ac.currentTime);
        droneGain.gain.linearRampToValueAtTime(0.04, ac.currentTime + 6);
        droneGain.connect(ac.destination);

        const droneOsc = ac.createOscillator();
        droneOsc.type = 'sine'; droneOsc.frequency.value = 60;
        droneOsc.connect(droneGain);
        droneOsc.start();

        droneNodes = { osc: droneOsc, gain: droneGain };
      }
    } catch (_) {}
  }

  function fadeOutAudio(durationSec) {
    if (!audioCtx) return;
    const ac = audioCtx;
    const now = ac.currentTime;
    try {
      if (binNodes) binNodes.gain.gain.linearRampToValueAtTime(0, now + durationSec);
      if (droneNodes) droneNodes.gain.gain.linearRampToValueAtTime(0, now + durationSec);
    } catch (_) {}
  }

  function stopAudio() {
    try { if (binNodes) { binNodes.oscL.stop(); binNodes.oscR.stop(); } } catch (_) {}
    try { if (droneNodes) droneNodes.osc.stop(); } catch (_) {}
    binNodes   = null;
    droneNodes = null;
  }

  // ── Graine de Vie SVG ────────────────────────────────────────

  function buildSeedSVG() {
    const svg = document.getElementById('nuit-seed-svg');
    if (!svg) return;
    svg.innerHTML = '';
    const NS = 'http://www.w3.org/2000/svg';
    const cx = 120, cy = 120, r = 54;

    const centers = [
      [cx, cy],
      [cx + r, cy],
      [cx - r, cy],
      [cx + r / 2, cy - r * Math.sin(Math.PI / 3)],
      [cx - r / 2, cy - r * Math.sin(Math.PI / 3)],
      [cx + r / 2, cy + r * Math.sin(Math.PI / 3)],
      [cx - r / 2, cy + r * Math.sin(Math.PI / 3)],
    ];

    const defs = document.createElementNS(NS, 'defs');
    const filt = document.createElementNS(NS, 'filter');
    filt.setAttribute('id', 'nuit-glow'); filt.setAttribute('x', '-50%'); filt.setAttribute('y', '-50%');
    filt.setAttribute('width', '200%'); filt.setAttribute('height', '200%');
    const blur = document.createElementNS(NS, 'feGaussianBlur');
    blur.setAttribute('in', 'SourceGraphic'); blur.setAttribute('stdDeviation', '2.5'); blur.setAttribute('result', 'blur');
    const merge = document.createElementNS(NS, 'feMerge');
    const mn1 = document.createElementNS(NS, 'feMergeNode'); mn1.setAttribute('in', 'blur');
    const mn2 = document.createElementNS(NS, 'feMergeNode'); mn2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(mn1); merge.appendChild(mn2);
    filt.appendChild(blur); filt.appendChild(merge); defs.appendChild(filt);
    svg.appendChild(defs);

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('filter', 'url(#nuit-glow)');
    centers.forEach(([x, y]) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r);
      c.setAttribute('fill', 'none'); c.setAttribute('stroke', '#B8860B');
      c.setAttribute('stroke-width', '0.5'); c.setAttribute('opacity', '0.4');
      g.appendChild(c);
    });
    svg.appendChild(g);
  }

  function animateSeed() {
    if (!running) return;
    animFrameId = requestAnimationFrame(animateSeed);

    const elapsed_ms = performance.now() - phaseStart;
    const phase = PATTERN_478[phaseIdx];
    const t = Math.min(elapsed_ms / (phase.secs * 1000), 1);

    let scale;
    if (phaseIdx === 0)      scale = 0.86 + t * 0.20;
    else if (phaseIdx === 1) scale = 1.06;
    else                     scale = 1.06 - t * 0.20;

    const svg = document.getElementById('nuit-seed-svg');
    if (svg) svg.style.transform = `scale(${scale.toFixed(4)})`;

    if (elapsed_ms >= phase.secs * 1000) {
      phaseIdx = (phaseIdx + 1) % 3;
      phaseStart = performance.now();
      const lblEl = document.getElementById('nuit-breath-label');
      if (lblEl) {
        lblEl.style.opacity = '0';
        const nextLabel = PATTERN_478[phaseIdx].label;
        setTimeout(() => {
          if (running) { lblEl.textContent = nextLabel; lblEl.style.opacity = '0.4'; }
        }, 400);
      }
    }
  }

  // ── Timer ────────────────────────────────────────────────────

  function formatTime(s) {
    const m = Math.floor(s / 60);
    return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function updateTimerDisplay() {
    const el = document.getElementById('nuit-timer');
    if (el) el.textContent = formatTime(Math.max(0, totalSecs - elapsed));
  }

  function startTimer() {
    elapsed = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      elapsed++;
      updateTimerDisplay();
      const remaining = totalSecs - elapsed;
      if (remaining === 30) fadeOutAudio(28);
      if (remaining <= 0) stopSession(true);
    }, 1000);
  }

  // ── Phase config UI ──────────────────────────────────────────

  function showConfig() {
    const cfg = document.getElementById('nuit-config');
    const ses = document.getElementById('nuit-session');
    if (cfg) cfg.style.display = '';
    if (ses) ses.style.display = 'none';
    // Reset dur buttons
    document.querySelectorAll('.nuit-dur-btn').forEach(btn => {
      const m = parseInt(btn.dataset.min, 10);
      btn.classList.toggle('nuit-dur-btn--on', m === cfgMins);
    });
    // Reset toggles
    updateToggle('nuit-bin-toggle', cfgBin);
    updateToggle('nuit-drone-toggle', cfgDrone);
    // Reset timer display
    const el = document.getElementById('nuit-timer');
    if (el) el.textContent = formatTime(cfgMins * 60);
  }

  function showSession() {
    const cfg = document.getElementById('nuit-config');
    const ses = document.getElementById('nuit-session');
    if (cfg) cfg.style.display = 'none';
    if (ses) ses.style.display = '';
  }

  function updateToggle(id, on) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('nuit-toggle--on', on);
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  // ── Session ──────────────────────────────────────────────────

  function startSession() {
    if (running) return;
    totalSecs  = cfgMins * 60;
    running    = true;
    phaseIdx   = 0;
    phaseStart = performance.now();

    showSession();
    buildSeedSVG();
    startAudio();

    // "Laisse-toi porter" disparaît après 5s
    const phrase = document.getElementById('nuit-phrase');
    if (phrase) {
      phrase.classList.remove('nuit-phrase--fade');
      setTimeout(() => phrase.classList.add('nuit-phrase--fade'), 5000);
    }

    // Label de respiration avec fondu initial
    const lblEl = document.getElementById('nuit-breath-label');
    if (lblEl) {
      lblEl.textContent = PATTERN_478[0].label;
      lblEl.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => { lblEl.style.opacity = '0.4'; }));
    }

    // Plein écran + Wake Lock
    setTimeout(async () => {
      try { await document.documentElement.requestFullscreen?.(); } catch (_) {}
      await requestWakeLock();
    }, 250);

    animateSeed();
    startTimer();
  }

  function stopSession(auto = false) {
    running = false;
    clearInterval(timerInterval);
    cancelAnimationFrame(animFrameId);
    if (!auto) stopAudio();

    const svg = document.getElementById('nuit-seed-svg');
    if (svg) svg.style.transform = 'scale(1)';

    try { if (document.fullscreenElement) document.exitFullscreen?.(); } catch (_) {}
    releaseWakeLock();

    setTimeout(() => {
      if (typeof navigateTo === 'function') navigateTo('accueil');
    }, auto ? 1200 : 0);
  }

  // ── Événements ───────────────────────────────────────────────

  function bindEvents() {
    // Bouton retour (dans la config)
    document.getElementById('nuit-back-btn')
      ?.addEventListener('click', () => navigateTo('accueil'));

    // Choix durée
    document.querySelectorAll('.nuit-dur-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cfgMins = parseInt(btn.dataset.min, 10);
        document.querySelectorAll('.nuit-dur-btn').forEach(b =>
          b.classList.toggle('nuit-dur-btn--on', b === btn)
        );
        // Mettre à jour l'affichage du timer dans la config
        const el = document.getElementById('nuit-timer');
        if (el) el.textContent = formatTime(cfgMins * 60);
      });
    });

    // Toggles audio
    document.getElementById('nuit-bin-toggle')?.addEventListener('click', () => {
      cfgBin = !cfgBin;
      updateToggle('nuit-bin-toggle', cfgBin);
    });
    document.getElementById('nuit-drone-toggle')?.addEventListener('click', () => {
      cfgDrone = !cfgDrone;
      updateToggle('nuit-drone-toggle', cfgDrone);
    });

    // Lancer
    document.getElementById('nuit-launch-btn')
      ?.addEventListener('click', startSession);

    // Arrêter
    document.getElementById('nuit-stop-btn')
      ?.addEventListener('click', () => stopSession(false));
  }

  // ── Lifecycle ─────────────────────────────────────────────────

  function onEnter() {
    if (running) stopSession(false);
    showConfig();
  }

  function onLeave() {
    if (running) stopSession(false);
  }

  bindEvents();
  screenHooks.nuit = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
