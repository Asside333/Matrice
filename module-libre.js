'use strict';

/* ================================================================
   MATRICE — Module Libre / Studio
   Respiration, binauraux, ambiance, timer, Yi King — tout à la volée
   ================================================================ */

const ModuleLibre = (() => {

  // ── Constantes ────────────────────────────────────────────────
  const NS      = 'http://www.w3.org/2000/svg';
  const GDV_CX  = 120, GDV_CY = 120, GDV_R = 46;
  const SPREAD  = 16, R_GROW = 9;

  const PATTERNS = {
    '5-5':     [{ p: 'inspire', ms: 5000 }, { p: 'expire',    ms: 5000 }],
    '4-2-4-2': [{ p: 'inspire', ms: 4000 }, { p: 'hold-in',  ms: 2000 },
                { p: 'expire',  ms: 4000 }, { p: 'hold-out', ms: 2000 }],
    '4-7-8':   [{ p: 'inspire', ms: 4000 }, { p: 'hold-in',  ms: 7000 },
                { p: 'expire',  ms: 8000 }],
  };

  const PHASE_LABELS = {
    'inspire':  'Inspirez...',
    'hold-in':  'Retenez...',
    'expire':   'Expirez...',
    'hold-out': 'Pause...',
  };

  const BIN_DEF = {
    theta: { carrier: 200, beat: 6  },
    alpha: { carrier: 200, beat: 10 },
    gamma: { carrier: 200, beat: 40 },
  };

  // ── État ──────────────────────────────────────────────────────
  let breathRunning = false;
  let breathRaf     = null;
  let phaseIdx      = 0;
  let phaseStart    = null;
  let currentPattern = '5-5';
  let seedCircles   = [];

  let audioCtx = null;
  let binNodes = null;
  let ambNodes = null;
  let currentBin = null;

  let timerInterval = null;
  let timerSecs     = 0;

  let ykThrows = [];

  // ── Audio context ─────────────────────────────────────────────
  function ac() {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // ── Binauraux ─────────────────────────────────────────────────
  function startBin(key) {
    stopBin();
    const a = ac();
    const { carrier, beat } = BIN_DEF[key];

    const gainNode = a.createGain();
    const vol = parseFloat(document.getElementById('sl-vol-bin')?.value ?? 40) * 0.002;
    gainNode.gain.setValueAtTime(0, a.currentTime);
    gainNode.gain.linearRampToValueAtTime(vol, a.currentTime + 1.5);
    gainNode.connect(a.destination);

    const panL = a.createStereoPanner(); panL.pan.value = -1;
    const panR = a.createStereoPanner(); panR.pan.value =  1;

    const oscL = a.createOscillator(); oscL.type = 'sine';
    oscL.frequency.value = carrier;
    oscL.connect(panL).connect(gainNode);

    const oscR = a.createOscillator(); oscR.type = 'sine';
    oscR.frequency.value = carrier + beat;
    oscR.connect(panR).connect(gainNode);

    oscL.start(); oscR.start();
    binNodes = { oscL, oscR, gainNode };
    currentBin = key;
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
    currentBin = null;
  }

  function setBinVol(v) {
    if (!binNodes) return;
    try {
      const a = ac();
      binNodes.gainNode.gain.linearRampToValueAtTime(v * 0.002, a.currentTime + 0.1);
    } catch {}
  }

  // ── Ambiance ──────────────────────────────────────────────────
  function startAmb(type) {
    stopAmb();
    if (type === 'silence') return;

    const a = ac();
    const masterGain = a.createGain();
    const vol = parseFloat(document.getElementById('sl-vol-amb')?.value ?? 50) * 0.003;
    masterGain.gain.setValueAtTime(0, a.currentTime);
    masterGain.gain.linearRampToValueAtTime(vol, a.currentTime + 2.5);
    masterGain.connect(a.destination);
    const sources = [];

    if (type === 'pluie') {
      const SR  = a.sampleRate;
      const buf = a.createBuffer(2, SR * 4, SR);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const noise = a.createBufferSource();
      noise.buffer = buf; noise.loop = true;
      const lp = a.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 650; lp.Q.value = 0.4;
      noise.connect(lp).connect(masterGain);
      noise.start();
      sources.push(noise);

    } else if (type === 'bols') {
      [220, 275, 330, 440, 660].forEach((freq, i) => {
        const osc = a.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
        const g = a.createGain(); g.gain.value = 0.055 / (i + 1);
        const lfo = a.createOscillator(); lfo.frequency.value = 0.25 + i * 0.07;
        const lfoG = a.createGain(); lfoG.gain.value = g.gain.value * 0.35;
        lfo.connect(lfoG).connect(g.gain);
        osc.connect(g).connect(masterGain);
        osc.start(); lfo.start();
        sources.push(osc, lfo);
      });

    } else if (type === 'drone') {
      [55, 82.5, 110, 165].forEach((freq, i) => {
        const osc = a.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
        if (i > 0) osc.detune.value = (i % 2 === 0 ? 1 : -1) * 7;
        const g = a.createGain(); g.gain.value = 0.10 / (i + 1);
        osc.connect(g).connect(masterGain);
        osc.start();
        sources.push(osc);
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

  function setAmbVol(v) {
    if (!ambNodes) return;
    try {
      const a = ac();
      ambNodes.masterGain.gain.linearRampToValueAtTime(v * 0.003, a.currentTime + 0.1);
    } catch {}
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

  function updateSeed(amt, ts) {
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
    const blurEl = document.getElementById('sl-blur-el');
    if (blurEl) blurEl.setAttribute('stdDeviation', (amt * 3 + 1).toFixed(1));
  }

  // ── Easing ────────────────────────────────────────────────────
  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ── Boucle de respiration ─────────────────────────────────────
  function breathLoop(ts) {
    if (!breathRunning) return;
    if (phaseStart === null) phaseStart = ts;

    const phases   = PATTERNS[currentPattern];
    const { p, ms } = phases[phaseIdx];
    const elapsed  = ts - phaseStart;
    const t        = Math.min(elapsed / ms, 1);

    // Calcul de amt selon la phase
    let amt;
    if (p === 'inspire')   amt = easeInOut(t);
    else if (p === 'expire')    amt = easeInOut(1 - t);
    else if (p === 'hold-in')   amt = 1;
    else                         amt = 0; // hold-out

    updateSeed(amt, ts);

    // Label
    const labelEl = document.getElementById('sl-breath-label');
    const label   = PHASE_LABELS[p];
    if (labelEl && labelEl.textContent !== label) labelEl.textContent = label;

    // Passer à la phase suivante
    if (t >= 1) {
      phaseIdx  = (phaseIdx + 1) % phases.length;
      phaseStart = ts;
    }

    breathRaf = requestAnimationFrame(breathLoop);
  }

  function startBreath() {
    breathRunning = true;
    phaseIdx      = 0;
    phaseStart    = null;
    buildSeed();
    breathRaf = requestAnimationFrame(breathLoop);
    updatePlayBtn(true);
    const labelEl = document.getElementById('sl-breath-label');
    if (labelEl) labelEl.textContent = PHASE_LABELS['inspire'];
  }

  function stopBreath() {
    breathRunning = false;
    if (breathRaf) { cancelAnimationFrame(breathRaf); breathRaf = null; }
    updatePlayBtn(false);
    // Ramener la graine à son état neutre (amt=0)
    updateSeed(0, 0);
    const labelEl = document.getElementById('sl-breath-label');
    if (labelEl) labelEl.textContent = '—';
  }

  function updatePlayBtn(playing) {
    const icon = document.getElementById('sl-play-icon');
    if (!icon) return;
    if (playing) {
      icon.innerHTML = '<rect x="5" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="15" y="4" width="4" height="16" rx="1" fill="currentColor"/>';
    } else {
      icon.innerHTML = '<polygon points="6,4 20,12 6,20" fill="currentColor"/>';
    }
  }

  // ── Timer ─────────────────────────────────────────────────────
  function startTimer(minutes) {
    stopTimer();
    timerSecs = minutes * 60;
    renderTimer();

    const bar = document.getElementById('sl-timer-bar');
    if (bar) bar.classList.remove('sl-timer-bar--off');

    timerInterval = setInterval(() => {
      timerSecs--;
      renderTimer();
      if (timerSecs <= 0) {
        stopTimer();
        onTimerEnd();
      }
    }, 1000);
  }

  function renderTimer() {
    const el = document.getElementById('sl-timer-remaining');
    if (!el) return;
    const m = Math.floor(Math.max(0, timerSecs) / 60);
    const s = String(Math.max(0, timerSecs) % 60).padStart(2, '0');
    el.textContent = `${m}:${s}`;
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    const bar = document.getElementById('sl-timer-bar');
    if (bar) bar.classList.add('sl-timer-bar--off');
  }

  function onTimerEnd() {
    stopBreath();
    stopBin();
    stopAmb();
    resetAudioBtns();
    // Signal visuel discret
    const bar = document.getElementById('sl-timer-bar');
    if (bar) {
      bar.classList.remove('sl-timer-bar--off');
      const el = document.getElementById('sl-timer-remaining');
      if (el) el.textContent = 'Terminé ✓';
      setTimeout(() => bar.classList.add('sl-timer-bar--off'), 3000);
    }
  }

  function resetAudioBtns() {
    document.querySelectorAll('.sl-audio-btn[data-bin]').forEach(b => {
      b.classList.remove('sl-audio-btn--on');
      b.setAttribute('aria-pressed', 'false');
    });
    document.querySelectorAll('.sl-audio-btn[data-amb]').forEach(b => {
      const isSilence = b.dataset.amb === 'silence';
      b.classList.toggle('sl-audio-btn--on', isSilence);
      b.setAttribute('aria-pressed', isSilence ? 'true' : 'false');
    });
  }

  // ── Slider fill visual ────────────────────────────────────────
  function updateSliderFill(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min) * 100).toFixed(1);
    slider.style.background = `linear-gradient(to right, var(--sl-accent) 0%, var(--sl-accent) ${pct}%, var(--sl-accent-dim) ${pct}%)`;
  }

  // ── Overlays ──────────────────────────────────────────────────
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

  // ── Yi King ───────────────────────────────────────────────────
  function ykThrowCoins() {
    const coins = [0, 0, 0].map(() => Math.random() < 0.5 ? 2 : 3);
    const sum   = coins.reduce((a, b) => a + b, 0);
    return sum % 2 === 0 ? 0 : 1; // 0=yin, 1=yang
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
    const hex = (typeof getHexagramByTraits === 'function')
      ? getHexagramByTraits(ykThrows)
      : null;

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

  // ── Liaison des événements ────────────────────────────────────
  function bindEvents() {

    // Play / pause respiration
    document.getElementById('sl-play-btn')?.addEventListener('click', () => {
      if (breathRunning) stopBreath();
      else               startBreath();
    });

    // Sélection du pattern
    document.querySelectorAll('.sl-pattern-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sl-pattern-btn').forEach(b => b.classList.remove('sl-pattern-btn--on'));
        btn.classList.add('sl-pattern-btn--on');
        currentPattern = btn.dataset.pattern;
        // Redémarrer si la respiration tourne
        if (breathRunning) { stopBreath(); startBreath(); }
      });
    });

    // Boutons binauraux
    document.querySelectorAll('.sl-audio-btn[data-bin]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.bin;
        const isOn = btn.classList.contains('sl-audio-btn--on');

        document.querySelectorAll('.sl-audio-btn[data-bin]').forEach(b => {
          b.classList.remove('sl-audio-btn--on');
          b.setAttribute('aria-pressed', 'false');
        });

        if (isOn) {
          stopBin();
        } else {
          startBin(key);
          btn.classList.add('sl-audio-btn--on');
          btn.setAttribute('aria-pressed', 'true');
        }
      });
    });

    // Slider volume binauraux
    document.getElementById('sl-vol-bin')?.addEventListener('input', e => {
      setBinVol(parseFloat(e.target.value));
      updateSliderFill(e.target);
    });

    // Boutons ambiance
    document.querySelectorAll('.sl-audio-btn[data-amb]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.amb;
        document.querySelectorAll('.sl-audio-btn[data-amb]').forEach(b => {
          b.classList.remove('sl-audio-btn--on');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('sl-audio-btn--on');
        btn.setAttribute('aria-pressed', 'true');
        startAmb(type);
      });
    });

    // Slider volume ambiance
    document.getElementById('sl-vol-amb')?.addEventListener('input', e => {
      setAmbVol(parseFloat(e.target.value));
      updateSliderFill(e.target);
    });

    // Timer — ouvrir picker
    document.getElementById('sl-timer-btn')?.addEventListener('click', () => {
      openOverlay('sl-timer-overlay');
    });

    // Timer — choisir durée
    document.querySelectorAll('.sl-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        closeOverlay('sl-timer-overlay');
        startTimer(parseInt(btn.dataset.min, 10));
      });
    });

    // Timer — annuler picker
    document.getElementById('sl-timer-overlay-cancel')?.addEventListener('click', () => {
      closeOverlay('sl-timer-overlay');
    });

    // Timer — arrêter
    document.getElementById('sl-timer-stop')?.addEventListener('click', stopTimer);

    // Yi King — ouvrir
    document.getElementById('sl-yiking-btn')?.addEventListener('click', () => {
      ykReset();
      openOverlay('sl-yk-overlay');
    });

    // Yi King — fermer
    document.getElementById('sl-yk-close')?.addEventListener('click', () => {
      closeOverlay('sl-yk-overlay');
    });

    // Yi King — lancer
    document.getElementById('sl-yk-throw-btn')?.addEventListener('click', ykDoThrow);

    // Yi King — nouveau tirage
    document.getElementById('sl-yk-retry-btn')?.addEventListener('click', ykReset);

    // Fermer overlay en cliquant sur le fond
    document.querySelectorAll('.sl-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeOverlay(overlay.id);
      });
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    buildSeed();
    updateSeed(0, 0);
    const labelEl = document.getElementById('sl-breath-label');
    if (labelEl) labelEl.textContent = '—';
    // Init slider fills
    const slBin = document.getElementById('sl-vol-bin');
    const slAmb = document.getElementById('sl-vol-amb');
    if (slBin) updateSliderFill(slBin);
    if (slAmb) updateSliderFill(slAmb);
  }

  function onLeave() {
    stopBreath();
    stopBin();
    stopAmb();
    stopTimer();
    closeOverlay('sl-yk-overlay');
    closeOverlay('sl-timer-overlay');
  }

  bindEvents();
  screenHooks.libre = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
