'use strict';

/* ================================================================
   MATRICE — Module Libre / Studio
   Config screen → Session plein écran immersive
   ================================================================ */

const ModuleLibre = (() => {

  const NS     = 'http://www.w3.org/2000/svg';
  const GDV_CX = 120, GDV_CY = 120, GDV_R = 46;
  const SPREAD = 16, R_GROW = 9;

  // ── Patterns ──────────────────────────────────────────────────
  const PATTERNS = {
    '5-5':     [{ p: 'inspire', ms: 5000 }, { p: 'expire',   ms: 5000 }],
    '4-2-4-2': [{ p: 'inspire', ms: 4000 }, { p: 'hold-in',  ms: 2000 },
                { p: 'expire',  ms: 4000 }, { p: 'hold-out', ms: 2000 }],
    '4-7-8':   [{ p: 'inspire', ms: 4000 }, { p: 'hold-in',  ms: 7000 },
                { p: 'expire',  ms: 8000 }],
    '6-6':     [{ p: 'inspire', ms: 6000 }, { p: 'expire',   ms: 6000 }],
    '2-2':     [{ p: 'inspire', ms: 2000 }, { p: 'expire',   ms: 2000 }],
  };

  const PHASE_LABELS = {
    'inspire':  'INSPIRE',
    'hold-in':  'RETIENS',
    'expire':   'EXPIRE',
    'hold-out': 'RETIENS',
  };

  const PHASE_COLOR = {
    'inspire':  { stroke: '#AFA9EC', halo: 'rgba(175,169,236,0.16)', text: '#AFA9EC', blur: 6 },
    'hold-in':  { stroke: '#B8860B', halo: 'rgba(184,134,11,0.16)',  text: '#B8860B', blur: 4 },
    'expire':   { stroke: '#5DCAA5', halo: 'rgba(93,202,165,0.13)',  text: '#5DCAA5', blur: 3 },
    'hold-out': { stroke: '#5DCAA5', halo: 'rgba(93,202,165,0.07)',  text: '#5DCAA5', blur: 2 },
  };

  const BIN_DEF = {
    theta: { carrier: 200, beat: 6  },
    alpha: { carrier: 200, beat: 10 },
    gamma: { carrier: 200, beat: 40 },
  };

  // ── Config state ───────────────────────────────────────────────
  let cfgFreq    = 'none';
  let cfgPattern = '5-5';
  let cfgAmb     = 'silence';
  let cfgMins    = 0;   // 0 = libre (pas de timer)

  // ── Session state ──────────────────────────────────────────────
  let running    = false;
  let breathRaf  = null;
  let phaseIdx   = 0;
  let phaseStart = null;
  let seedCircles = [];

  // Timer session
  let timerInterval = null;
  let timerSecs     = 0;    // 0 = libre
  let sessionStart  = 0;

  // ── Audio ──────────────────────────────────────────────────────
  let audioCtx = null;
  let binNodes = null;
  let ambNodes = null;

  function ac() {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function startBin(key) {
    stopBin();
    if (!key || key === 'none') return;
    const a = ac();
    const { carrier, beat } = BIN_DEF[key];
    const gainNode = a.createGain();
    gainNode.gain.setValueAtTime(0, a.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, a.currentTime + 1.5);
    gainNode.connect(a.destination);
    const panL = a.createStereoPanner(); panL.pan.value = -1;
    const panR = a.createStereoPanner(); panR.pan.value =  1;
    const oscL = a.createOscillator(); oscL.type = 'sine'; oscL.frequency.value = carrier;
    oscL.connect(panL).connect(gainNode);
    const oscR = a.createOscillator(); oscR.type = 'sine'; oscR.frequency.value = carrier + beat;
    oscR.connect(panR).connect(gainNode);
    oscL.start(); oscR.start();
    binNodes = { oscL, oscR, gainNode };
  }

  function stopBin() {
    if (!binNodes) return;
    try {
      const a = ac();
      binNodes.gainNode.gain.linearRampToValueAtTime(0, a.currentTime + 0.6);
      const snap = binNodes;
      setTimeout(() => { try { snap.oscL.stop(); snap.oscR.stop(); } catch {} }, 700);
    } catch {}
    binNodes = null;
  }

  function startAmb(type) {
    stopAmb();
    if (type === 'silence') return;
    const a = ac();
    const masterGain = a.createGain();
    masterGain.gain.setValueAtTime(0, a.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.15, a.currentTime + 2.5);
    masterGain.connect(a.destination);
    const sources = [];
    if (type === 'pluie') {
      const SR = a.sampleRate;
      const buf = a.createBuffer(2, SR * 4, SR);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const noise = a.createBufferSource(); noise.buffer = buf; noise.loop = true;
      const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 650; lp.Q.value = 0.4;
      noise.connect(lp).connect(masterGain); noise.start(); sources.push(noise);
    } else if (type === 'bols') {
      [220, 275, 330, 440, 660].forEach((freq, i) => {
        const osc = a.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
        const g = a.createGain(); g.gain.value = 0.055 / (i + 1);
        const lfo = a.createOscillator(); lfo.frequency.value = 0.25 + i * 0.07;
        const lfoG = a.createGain(); lfoG.gain.value = g.gain.value * 0.35;
        lfo.connect(lfoG).connect(g.gain); osc.connect(g).connect(masterGain);
        osc.start(); lfo.start(); sources.push(osc, lfo);
      });
    } else if (type === 'drone') {
      [55, 82.5, 110, 165].forEach((freq, i) => {
        const osc = a.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
        if (i > 0) osc.detune.value = (i % 2 === 0 ? 1 : -1) * 7;
        const g = a.createGain(); g.gain.value = 0.10 / (i + 1);
        osc.connect(g).connect(masterGain); osc.start(); sources.push(osc);
      });
    }
    ambNodes = { sources, masterGain };
  }

  function stopAmb() {
    if (!ambNodes) return;
    try {
      const a = ac();
      ambNodes.masterGain.gain.linearRampToValueAtTime(0, a.currentTime + 1.2);
      const snap = ambNodes.sources;
      setTimeout(() => snap.forEach(n => { try { n.stop(); } catch {} }), 1400);
    } catch {}
    ambNodes = null;
  }

  // ── Wake Lock ─────────────────────────────────────────────────
  let wakeLock = null;
  let noSleepVideo = null;

  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) { startNoSleep(); return; }
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch { startNoSleep(); }
  }

  function startNoSleep() {
    if (noSleepVideo) return;
    noSleepVideo = document.createElement('video');
    noSleepVideo.setAttribute('playsinline', '');
    noSleepVideo.setAttribute('muted', '');
    noSleepVideo.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none';
    noSleepVideo.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAA';
    noSleepVideo.loop = true;
    document.body.appendChild(noSleepVideo);
    noSleepVideo.play().catch(() => {});
  }

  function releaseWakeLock() {
    if (wakeLock) { try { wakeLock.release(); } catch {} wakeLock = null; }
    if (noSleepVideo) { noSleepVideo.pause(); noSleepVideo.remove(); noSleepVideo = null; }
  }

  // ── Fullscreen ────────────────────────────────────────────────
  function enterFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }

  function exitFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  // ── Graine de Vie ─────────────────────────────────────────────
  function buildSeed() {
    const g = document.querySelector('#sl-seed-svg .sl-seed-circles');
    if (!g || seedCircles.length > 0) return;
    const center = document.createElementNS(NS, 'circle');
    center.setAttribute('cx', GDV_CX); center.setAttribute('cy', GDV_CY);
    center.setAttribute('r', GDV_R);
    g.appendChild(center);
    seedCircles.push({ el: center, angle: null });
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * Math.PI / 180;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (GDV_CX + GDV_R * Math.cos(angle)).toFixed(3));
      c.setAttribute('cy', (GDV_CY + GDV_R * Math.sin(angle)).toFixed(3));
      c.setAttribute('r', GDV_R);
      g.appendChild(c);
      seedCircles.push({ el: c, angle });
    }
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function updateSeed(amt, phaseId, ts) {
    const col = PHASE_COLOR[phaseId] || PHASE_COLOR['inspire'];
    const r = GDV_R + R_GROW * amt;
    const d = GDV_R + SPREAD * amt;
    seedCircles.forEach(({ el, angle }, i) => {
      if (i === 0) {
        el.setAttribute('r', (r + Math.sin(ts / 900) * 1.5 * amt).toFixed(2));
      } else {
        const ripple = Math.sin(ts / 1400 + i * 1.047) * 2 * amt;
        el.setAttribute('cx', (GDV_CX + (d + ripple) * Math.cos(angle)).toFixed(2));
        el.setAttribute('cy', (GDV_CY + (d + ripple) * Math.sin(angle)).toFixed(2));
        el.setAttribute('r',  (r + ripple * 0.3).toFixed(2));
      }
    });
    const sw = (0.5 + amt * 1.1).toFixed(2);
    seedCircles.forEach(({ el }) => el.setAttribute('stroke-width', sw));

    const svg = document.getElementById('sl-seed-svg');
    if (svg) svg.style.setProperty('--gdv-stroke', col.stroke);

    const blurEl = document.getElementById('sl-blur-el');
    if (blurEl) blurEl.setAttribute('stdDeviation', (amt * 3 + 1).toFixed(1));

    const halo = document.getElementById('sl-session-halo');
    if (halo) halo.style.background =
      `radial-gradient(ellipse at center, ${col.halo} 0%, transparent 68%)`;

    document.documentElement.style.setProperty('--sl-breath-text', col.text);
  }

  // ── Boucle session ────────────────────────────────────────────
  function breathLoop(ts) {
    if (!running) return;
    if (phaseStart === null) phaseStart = ts;

    const phases    = PATTERNS[cfgPattern];
    const { p, ms } = phases[phaseIdx];
    const elapsed   = ts - phaseStart;
    const t         = Math.min(elapsed / ms, 1);

    let amt;
    if (p === 'inspire')   amt = easeInOut(t);
    else if (p === 'expire')    amt = easeInOut(1 - t);
    else if (p === 'hold-in')   amt = 1;
    else                         amt = 0;

    updateSeed(amt, p, ts);

    // Countdown phase
    const countdown = Math.max(1, Math.ceil((ms - elapsed) / 1000));
    const cEl = document.getElementById('sl-session-count');
    if (cEl && cEl.textContent !== String(countdown)) cEl.textContent = countdown;

    // Phase label
    const label = PHASE_LABELS[p];
    const lEl = document.getElementById('sl-session-phase');
    if (lEl && lEl.textContent !== label) {
      lEl.style.opacity = '0';
      setTimeout(() => { lEl.textContent = label; lEl.style.opacity = '1'; }, 100);
    }

    if (t >= 1) {
      phaseIdx  = (phaseIdx + 1) % phases.length;
      phaseStart = ts;
    }

    breathRaf = requestAnimationFrame(breathLoop);
  }

  // ── Timer session ─────────────────────────────────────────────
  function startSessionTimer() {
    if (timerInterval) clearInterval(timerInterval);
    if (cfgMins <= 0) {
      // Libre : affiche le temps écoulé
      sessionStart = Date.now();
      timerInterval = setInterval(renderSessionTimer, 1000);
      renderSessionTimer();
      return;
    }
    timerSecs = cfgMins * 60;
    renderSessionTimer();
    timerInterval = setInterval(() => {
      timerSecs--;
      renderSessionTimer();
      if (timerSecs <= 0) { onTimerEnd(); }
    }, 1000);
  }

  function renderSessionTimer() {
    const el = document.getElementById('sl-timer-display');
    if (!el) return;
    if (cfgMins <= 0) {
      // Affiche temps écoulé
      const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = String(elapsed % 60).padStart(2, '0');
      el.textContent = `${m}:${s}`;
    } else {
      const secs = Math.max(0, timerSecs);
      const m = Math.floor(secs / 60);
      const s = String(secs % 60).padStart(2, '0');
      el.textContent = `${m}:${s}`;
      el.classList.toggle('urgent', secs < 30 && secs > 0);
    }
  }

  function onTimerEnd() {
    stopSession();
    navigateTo('libre');
  }

  // ── Démarrer la session ───────────────────────────────────────
  function startSession() {
    running   = true;
    phaseIdx  = 0;
    phaseStart = null;

    buildSeed();
    updateSeed(0, 'inspire', 0);

    startBin(cfgFreq);
    startAmb(cfgAmb);
    startSessionTimer();

    navigateTo('libre-session');

    setTimeout(() => {
      enterFullscreen();
      requestWakeLock();
    }, 250);

    breathRaf = requestAnimationFrame(breathLoop);
  }

  // ── Arrêter la session ────────────────────────────────────────
  function stopSession() {
    running = false;
    if (breathRaf) { cancelAnimationFrame(breathRaf); breathRaf = null; }
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    stopBin();
    stopAmb();
    exitFullscreen();
    releaseWakeLock();
    // Reset graine
    updateSeed(0, 'inspire', 0);
  }

  // ── Yi King ───────────────────────────────────────────────────
  let ykThrows = [];

  function ykThrowCoins() {
    const coins = [0, 0, 0].map(() => Math.random() < 0.5 ? 2 : 3);
    const sum   = coins.reduce((a, b) => a + b, 0);
    return sum % 2 === 0 ? 0 : 1;
  }

  function ykUpdateUI() {
    for (let i = 0; i < 6; i++) {
      const el = document.getElementById(`sl-yk-line-${i}`);
      if (!el) continue;
      if (i < ykThrows.length) {
        el.className = 'sl-yk-trait ' + (ykThrows[i] === 1 ? 'sl-yk-trait--yang' : 'sl-yk-trait--yin');
      } else {
        el.className = 'sl-yk-trait sl-yk-trait--pending';
      }
    }
    const cnt = document.getElementById('sl-yk-count');
    if (cnt) cnt.textContent = `${ykThrows.length} / 6`;
  }

  function ykDoThrow() {
    if (ykThrows.length >= 6) return;
    ykThrows.push(ykThrowCoins());
    if (navigator.vibrate) navigator.vibrate(30);
    ykUpdateUI();
    const btn = document.getElementById('sl-yk-throw-btn');
    if (ykThrows.length === 6) {
      if (btn) btn.textContent = 'Révélation...';
      setTimeout(ykReveal, 500);
    } else {
      btn?.classList.add('sl-yk-flash');
      setTimeout(() => btn?.classList.remove('sl-yk-flash'), 300);
    }
  }

  function ykBuildSVG(traits) {
    const lines = [];
    for (let i = 5; i >= 0; i--) {
      const yang = traits[i] === 1;
      const y    = 8 + (5 - i) * 20;
      if (yang) {
        lines.push(`<rect x="12" y="${y}" width="76" height="8" rx="1" fill="currentColor" opacity="0.85"/>`);
      } else {
        lines.push(`<rect x="12" y="${y}" width="30" height="8" rx="1" fill="currentColor" opacity="0.85"/>`);
        lines.push(`<rect x="58" y="${y}" width="30" height="8" rx="1" fill="currentColor" opacity="0.85"/>`);
      }
    }
    return `<svg viewBox="0 0 100 128" xmlns="http://www.w3.org/2000/svg" class="sl-yk-svg">${lines.join('')}</svg>`;
  }

  function ykReveal() {
    const hex = (typeof getHexagramByTraits === 'function') ? getHexagramByTraits(ykThrows) : null;
    const throwZone  = document.getElementById('sl-yk-throw-zone');
    const resultZone = document.getElementById('sl-yk-result-zone');
    if (!throwZone || !resultZone) return;
    throwZone.style.transition = 'opacity 0.4s';
    throwZone.style.opacity    = '0';
    setTimeout(() => {
      throwZone.style.display  = 'none';
      resultZone.style.display = 'flex';
      void resultZone.offsetWidth;
      resultZone.style.transition = 'opacity 0.5s';
      resultZone.style.opacity    = '1';
      const svgWrap = document.getElementById('sl-yk-hex-svg-wrap');
      if (svgWrap) svgWrap.innerHTML = ykBuildSVG(ykThrows);
      if (hex) {
        const numEl  = document.getElementById('sl-yk-hex-num');
        const nameEl = document.getElementById('sl-yk-hex-name');
        const advEl  = document.getElementById('sl-yk-hex-advice');
        if (numEl)  numEl.textContent  = `N° ${hex.number}`;
        if (nameEl) nameEl.textContent = `${hex.nameChinese} — ${hex.nameFrench}`;
        if (advEl)  advEl.textContent  = hex.shortAdvice || '';
      }
    }, 420);
  }

  function ykReset() {
    ykThrows = [];
    ykUpdateUI();
    const throwZone  = document.getElementById('sl-yk-throw-zone');
    const resultZone = document.getElementById('sl-yk-result-zone');
    if (throwZone)  { throwZone.style.display = 'block'; throwZone.style.opacity = '1'; }
    if (resultZone) { resultZone.style.display = 'none'; resultZone.style.opacity = '0'; }
    const btn = document.getElementById('sl-yk-throw-btn');
    if (btn) btn.textContent = 'Lancer les pièces';
  }

  function openOverlay(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('sl-overlay--off');
    void el.offsetWidth;
    el.classList.add('sl-overlay--in');
  }

  function closeOverlay(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('sl-overlay--in');
    setTimeout(() => el.classList.add('sl-overlay--off'), 280);
  }

  // ── Événements ────────────────────────────────────────────────
  function bindEvents() {

    // Binauraux (config)
    document.querySelectorAll('[data-slfreq]').forEach(btn => {
      btn.addEventListener('click', () => {
        cfgFreq = btn.dataset.slfreq;
        document.querySelectorAll('[data-slfreq]').forEach(b => {
          b.classList.toggle('m1-freq-btn--active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    // Patterns (config)
    document.querySelectorAll('[data-slpattern]').forEach(btn => {
      btn.addEventListener('click', () => {
        cfgPattern = btn.dataset.slpattern;
        document.querySelectorAll('[data-slpattern]').forEach(b => {
          b.classList.toggle('m1-pattern-btn--active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    // Ambiance (config)
    document.querySelectorAll('[data-slamb]').forEach(btn => {
      btn.addEventListener('click', () => {
        cfgAmb = btn.dataset.slamb;
        document.querySelectorAll('[data-slamb]').forEach(b => {
          b.classList.toggle('m1-amb-btn--active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    // Durée (config)
    document.querySelectorAll('[data-slmin]').forEach(btn => {
      btn.addEventListener('click', () => {
        cfgMins = parseInt(btn.dataset.slmin, 10);
        document.querySelectorAll('[data-slmin]').forEach(b => {
          b.classList.toggle('sl-dur-btn--active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    // Commencer
    document.getElementById('sl-start-btn')?.addEventListener('click', startSession);

    // Timer +/- en session
    document.getElementById('sl-timer-minus')?.addEventListener('click', () => {
      if (cfgMins <= 0) return; // mode libre, pas de soustraction
      timerSecs = Math.max(30, timerSecs - 60);
      renderSessionTimer();
    });
    document.getElementById('sl-timer-plus')?.addEventListener('click', () => {
      if (cfgMins <= 0) {
        // Passer en mode compté depuis maintenant + 5min
        cfgMins = 1;
        timerSecs = 300;
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          timerSecs--;
          renderSessionTimer();
          if (timerSecs <= 0) onTimerEnd();
        }, 1000);
      } else {
        timerSecs = Math.min(5400, timerSecs + 60);
      }
      renderSessionTimer();
    });

    // Arrêter
    document.getElementById('sl-stop-btn')?.addEventListener('click', () => {
      stopSession();
      navigateTo('libre');
    });

    // Yi King
    document.getElementById('sl-yiking-btn')?.addEventListener('click', () => {
      ykReset();
      openOverlay('sl-yk-overlay');
    });
    document.getElementById('sl-yk-close')?.addEventListener('click', () => closeOverlay('sl-yk-overlay'));
    document.getElementById('sl-yk-throw-btn')?.addEventListener('click', ykDoThrow);
    document.getElementById('sl-yk-retry-btn')?.addEventListener('click', ykReset);
    document.querySelectorAll('.sl-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeOverlay(overlay.id);
      });
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    buildSeed();
  }

  function onLeave() {
    // Rien : le leave de la config ne stoppe pas la session
  }

  function onSessionLeave() {
    // Appelé si on navigue hors de la session par un autre moyen
    if (running) stopSession();
  }

  bindEvents();
  screenHooks.libre = { onEnter, onLeave };
  screenHooks['libre-session'] = { onEnter: () => {}, onLeave: onSessionLeave };

  return { onEnter, onLeave };
})();
