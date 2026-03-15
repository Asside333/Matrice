'use strict';

/* ================================================================
   MATRICE — app.js
   Instrument de calibration personnelle
   ================================================================ */

// ── Constantes ────────────────────────────────────────────────────
const NS = 'http://www.w3.org/2000/svg';
const STORAGE_STREAK = 'matrice_streak';
const STORAGE_LAST_RITUAL = 'matrice_last_ritual';

// Hooks de cycle de vie par écran — populé par chaque module
const screenHooks = {};

// ── État global du rituel ─────────────────────────────────────
const RITUAL_STATE = {
  mantra:        null,
  mantraCategory: null,
  intentions:    [],
  customIntention: '',
  visualization: null,
  element:       null,
  elementKey:    null,
  sort:          null,
  hexagram:      null,
  hexagramName:  null,
};

// Métatron : géométrie
const CX = 160, CY = 160;
const R_CIRCLE = 28;
const D_INNER = 64;
const D_OUTER = 128;

// ════════════════════════════════════════════════════════════════
// THÈME ADAPTATIF
// ════════════════════════════════════════════════════════════════

function getTheme() {
  const h = new Date().getHours();
  return (h >= 7 && h < 19) ? 'light' : 'dark';
}

function applyTheme() {
  const isLight = getTheme() === 'light';
  document.body.classList.toggle('light-mode', isLight);

  const metaTheme = document.getElementById('meta-theme');
  if (metaTheme) {
    metaTheme.setAttribute('content', isLight ? '#9A6E0A' : '#B8860B');
  }
}

// ════════════════════════════════════════════════════════════════
// NAVIGATION ENTRE ÉCRANS
// ════════════════════════════════════════════════════════════════

let currentScreen = 'accueil';

function navigateTo(screenId) {
  if (screenId === currentScreen) return;

  const prev = document.getElementById(`screen-${currentScreen}`);
  const next = document.getElementById(`screen-${screenId}`);
  if (!next) return;

  // Hook de sortie de l'écran courant
  screenHooks[currentScreen]?.onLeave?.();

  // Fade-out
  prev?.classList.remove('active');

  // Fade-in avec léger décalage
  setTimeout(() => {
    next.classList.add('active');
    currentScreen = screenId;
    updateNavState(screenId);
    updateSOSVisibility(screenId);
    updateNavVisibility(screenId);
    // Hook d'entrée du nouvel écran
    screenHooks[screenId]?.onEnter?.();
  }, 180);
}

function updateNavState(screenId) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenId);
  });
}

function updateSOSVisibility(screenId) {
  const sos = document.getElementById('btn-sos');
  if (!sos) return;
  sos.classList.toggle('hidden', screenId === 'sos');
}

function updateNavVisibility(screenId) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const hideNav = ['rituel', 'm2', 'm3', 'm4', 'm5', 'm6', 'cloture'].includes(screenId);
  nav.style.opacity = hideNav ? '0' : '1';
  nav.style.pointerEvents = hideNav ? 'none' : 'auto';
  // Repositionner le bouton SOS selon présence de la nav
  const sos = document.getElementById('btn-sos');
  if (sos) {
    sos.style.bottom = hideNav
      ? '24px'
      : 'calc(var(--nav-height) + 16px)';
  }
}

// ════════════════════════════════════════════════════════════════
// CUBE DE MÉTATRON — Construction SVG
// ════════════════════════════════════════════════════════════════

/**
 * Calcule les 13 centres du Cube de Métatron.
 * Fruit de Vie : 1 centre + 6 cercles intérieurs + 6 cercles extérieurs.
 * Les 78 lignes connectent tous les centres entre eux.
 */
function computeMetatronPoints() {
  const pts = [{ x: CX, y: CY, ring: 'center' }];

  // Anneau intérieur — 6 points à D_INNER (0°, 60°, 120°, 180°, 240°, 300°)
  for (let i = 0; i < 6; i++) {
    const a = (i * 60) * Math.PI / 180;
    pts.push({
      x: CX + D_INNER * Math.cos(a),
      y: CY + D_INNER * Math.sin(a),
      ring: 'inner'
    });
  }

  // Anneau extérieur — 6 points à D_OUTER (30°, 90°, 150°, 210°, 270°, 330°)
  for (let i = 0; i < 6; i++) {
    const a = (30 + i * 60) * Math.PI / 180;
    pts.push({
      x: CX + D_OUTER * Math.cos(a),
      y: CY + D_OUTER * Math.sin(a),
      ring: 'outer'
    });
  }

  return pts;
}

/**
 * Détermine la classe CSS d'une ligne selon les anneaux des deux points.
 */
function lineClass(ringA, ringB) {
  const key = [ringA, ringB].sort().join('-');
  const map = {
    'center-center': 'line-cc',
    'center-inner':  'line-ci',
    'center-outer':  'line-co',
    'inner-inner':   'line-ii',
    'inner-outer':   'line-io',
    'outer-outer':   'line-oo',
  };
  return map[key] || '';
}

function buildMetatronCube() {
  const svg = document.getElementById('metatron-svg');
  if (!svg) return;

  const pts = computeMetatronPoints();

  // ── Groupe des lignes (78 au total) ──────────────────────────
  const gLines = document.createElementNS(NS, 'g');
  gLines.setAttribute('class', 'mcube-lines');

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', pts[i].x.toFixed(2));
      line.setAttribute('y1', pts[i].y.toFixed(2));
      line.setAttribute('x2', pts[j].x.toFixed(2));
      line.setAttribute('y2', pts[j].y.toFixed(2));
      line.setAttribute('class', lineClass(pts[i].ring, pts[j].ring));
      gLines.appendChild(line);
    }
  }

  // ── Groupe des 13 cercles ─────────────────────────────────────
  const gCircles = document.createElementNS(NS, 'g');
  gCircles.setAttribute('class', 'mcube-circles');

  pts.forEach(({ x, y, ring }) => {
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', x.toFixed(2));
    circle.setAttribute('cy', y.toFixed(2));
    circle.setAttribute('r', R_CIRCLE);
    circle.setAttribute('class', `mcube-${ring}`);
    gCircles.appendChild(circle);
  });

  // ── Easter egg 333 — texte imperceptible au centre ────────────
  const t333 = document.createElementNS(NS, 'text');
  t333.setAttribute('x', CX);
  t333.setAttribute('y', CY + 4);
  t333.setAttribute('class', 'mcube-333');
  t333.textContent = '3 · 3 · 3';

  svg.appendChild(gLines);
  svg.appendChild(gCircles);
  svg.appendChild(t333);
}

// ════════════════════════════════════════════════════════════════
// STREAK
// ════════════════════════════════════════════════════════════════

function loadStreak() {
  const streak = parseInt(localStorage.getItem(STORAGE_STREAK) || '0', 10);
  const el = document.getElementById('streak-number');
  if (el) el.textContent = streak;

  // Easter eggs sur streak 33 et 333
  if (streak === 33 || streak === 333) {
    document.body.classList.add('easter-333');
  }
}

// ════════════════════════════════════════════════════════════════
// PHASE LUNAIRE
// ════════════════════════════════════════════════════════════════

const PHASES_LUNAIRES = [
  { emoji: '🌑', nom: 'Nouvelle Lune' },
  { emoji: '🌒', nom: 'Croissant croissant' },
  { emoji: '🌓', nom: 'Premier Quartier' },
  { emoji: '🌔', nom: 'Gibbeuse croissante' },
  { emoji: '🌕', nom: 'Pleine Lune' },
  { emoji: '🌖', nom: 'Gibbeuse décroissante' },
  { emoji: '🌗', nom: 'Dernier Quartier' },
  { emoji: '🌘', nom: 'Dernier Croissant' },
];

function getPhaseLunaire() {
  // Référence : nouvelle lune connue du 6 janvier 2000 à 18h14 UTC
  const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);
  const SYNODIC_MS = 29.530588853 * 24 * 60 * 60 * 1000; // ms par cycle lunaire

  const elapsed = (Date.now() - REF_NEW_MOON) % SYNODIC_MS;
  const phase = (elapsed + SYNODIC_MS) % SYNODIC_MS / SYNODIC_MS; // 0..1

  return PHASES_LUNAIRES[Math.floor(phase * 8) % 8];
}

function displayPhaseLunaire() {
  const { emoji, nom } = getPhaseLunaire();

  const emojiEl = document.getElementById('moon-emoji');
  const blockEl = document.getElementById('moon-block');

  if (emojiEl) emojiEl.textContent = emoji;
  if (blockEl) blockEl.setAttribute('title', nom);
}

// ════════════════════════════════════════════════════════════════
// SPLASH — Écran de chargement
// ════════════════════════════════════════════════════════════════

function hideSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  setTimeout(() => {
    splash.classList.add('fade-out');
    // Suppression du DOM après la transition
    setTimeout(() => splash.remove(), 1000);
  }, 1600);
}

// ════════════════════════════════════════════════════════════════
// ÉVÉNEMENTS
// ════════════════════════════════════════════════════════════════

function bindEvents() {
  // Navigation principale (barre du bas)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
  });

  // Bouton "Commencer le rituel"
  document.getElementById('btn-rituel')
    ?.addEventListener('click', () => navigateTo('rituel'));

  // Bouton SOS global
  document.getElementById('btn-sos')
    ?.addEventListener('click', () => navigateTo('sos'));

  // Boutons retour sur écrans secondaires
  document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.target));
  });

  // Geste swipe bas pour revenir (optionnel, accueil uniquement)
  let touchStartY = 0;
  document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Swipe bas de plus de 80px sur un écran secondaire → retour
    if (dy > 80 && currentScreen !== 'accueil') {
      navigateTo('accueil');
    }
  }, { passive: true });
}

// ════════════════════════════════════════════════════════════════
// INITIALISATION
// ════════════════════════════════════════════════════════════════

function init() {
  // 1. Thème (avant tout rendu visible)
  applyTheme();

  // 2. Construction du Cube de Métatron
  buildMetatronCube();

  // 3. Données persistées
  loadStreak();
  displayPhaseLunaire();

  // 4. Événements
  bindEvents();

  // 5. Masquer le splash
  hideSplash();

  // 6. Vérification du thème toutes les minutes
  setInterval(applyTheme, 60_000);
}

// Lancement à la fin du chargement du DOM
document.addEventListener('DOMContentLoaded', init);

// ════════════════════════════════════════════════════════════════
// SERVICE WORKER
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// MODULE 1 — SOUFFLE & FRÉQUENCES
// ════════════════════════════════════════════════════════════════

const Module1 = (() => {

  // ── Patterns de respiration ────────────────────────────────────
  const PATTERNS = {
    coherence: [
      { id: 'inspire',  label: 'Inspire', secs: 5 },
      { id: 'expire',   label: 'Expire',  secs: 5 },
    ],
    carre: [
      { id: 'inspire',  label: 'Inspire', secs: 4 },
      { id: 'hold-in',  label: 'Retiens', secs: 2 },
      { id: 'expire',   label: 'Expire',  secs: 4 },
      { id: 'hold-out', label: 'Retiens', secs: 2 },
    ],
    relaxant: [
      { id: 'inspire',  label: 'Inspire', secs: 4 },
      { id: 'hold-in',  label: 'Retiens', secs: 7 },
      { id: 'expire',   label: 'Expire',  secs: 8 },
    ],
  };

  // ── Couleurs par phase ─────────────────────────────────────────
  const PHASE_COLOR = {
    'inspire':  { stroke: '#AFA9EC', halo: 'rgba(175,169,236,0.16)', text: '#AFA9EC', blur: 6 },
    'hold-in':  { stroke: '#B8860B', halo: 'rgba(184,134,11,0.16)',  text: '#B8860B', blur: 4 },
    'expire':   { stroke: '#5DCAA5', halo: 'rgba(93,202,165,0.13)',  text: '#5DCAA5', blur: 3 },
    'hold-out': { stroke: '#5DCAA5', halo: 'rgba(93,202,165,0.07)',  text: '#5DCAA5', blur: 2 },
  };

  // ── Fréquences binaurales ──────────────────────────────────────
  const BINAURAL_DEF = {
    theta: { carrier: 200, beat: 6  },
    alpha: { carrier: 200, beat: 10 },
    gamma: { carrier: 200, beat: 40 },
  };

  // ── Géométrie Graine de Vie ────────────────────────────────────
  const GDV_CX = 120, GDV_CY = 120;
  const GDV_R  = 54;   // rayon de chaque cercle = distance centre-à-centre
  const SPREAD = 22;   // étalement max sur inspire (px) — bien perceptible
  const R_GROW = 11;   // croissance max du rayon (px)

  // ── État ──────────────────────────────────────────────────────
  let running      = false;
  let pattern      = 'coherence';
  let phaseIdx     = 0;
  let phaseStart   = 0;   // timestamp (ms) début phase courante
  let sessionStart = 0;   // timestamp (ms) début session
  let totalSecs    = 120; // durée totale en secondes
  let currentFreq  = 'theta';
  let currentAmb   = 'silence';
  let animFrameId  = null;
  let seedCircles  = [];  // références <circle> SVG

  // ── Audio ──────────────────────────────────────────────────────
  let audioCtx     = null;
  let binNodes     = null;  // { oscL, oscR, gainNode }
  let ambNodes     = null;  // { sources[], masterGain }

  function ctx() {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // ── Binauraux ─────────────────────────────────────────────────
  function startBinaural(freqKey) {
    stopBinaural();
    const ac = ctx();
    const { carrier, beat } = BINAURAL_DEF[freqKey];

    const gainNode = ac.createGain();
    const sliderBin = document.getElementById('m1-vol-binaural');
    const targetBin = sliderBin ? parseFloat(sliderBin.value) * 0.002 : 0.08;
    gainNode.gain.setValueAtTime(0, ac.currentTime);
    gainNode.gain.linearRampToValueAtTime(targetBin, ac.currentTime + 1.8);
    gainNode.connect(ac.destination);

    const panL = ac.createStereoPanner(); panL.pan.value = -1;
    const panR = ac.createStereoPanner(); panR.pan.value =  1;

    const oscL = ac.createOscillator();
    oscL.type = 'sine'; oscL.frequency.value = carrier;
    oscL.connect(panL).connect(gainNode);

    const oscR = ac.createOscillator();
    oscR.type = 'sine'; oscR.frequency.value = carrier + beat;
    oscR.connect(panR).connect(gainNode);

    oscL.start(); oscR.start();
    binNodes = { oscL, oscR, gainNode };
    showToastCasque();
  }

  function stopBinaural() {
    if (!binNodes) return;
    try {
      const ac = ctx();
      binNodes.gainNode.gain.linearRampToValueAtTime(0, ac.currentTime + 0.6);
      const snap = binNodes;
      setTimeout(() => {
        try { snap.oscL.stop(); snap.oscR.stop(); } catch {}
      }, 700);
    } catch {}
    binNodes = null;
  }

  function switchBinaural(freqKey) {
    if (!binNodes) { startBinaural(freqKey); return; }
    const ac = ctx();
    const { carrier, beat } = BINAURAL_DEF[freqKey];
    binNodes.oscL.frequency.linearRampToValueAtTime(carrier,        ac.currentTime + 0.6);
    binNodes.oscR.frequency.linearRampToValueAtTime(carrier + beat, ac.currentTime + 0.6);
  }

  // ── Ambiance ──────────────────────────────────────────────────
  function startAmbiance(type) {
    stopAmbiance();
    if (type === 'silence') return;

    const ac = ctx();
    const masterGain = ac.createGain();
    const sliderAmb = document.getElementById('m1-vol-ambiance');
    const targetAmb = sliderAmb ? parseFloat(sliderAmb.value) * 0.003 : 0.15;
    masterGain.gain.setValueAtTime(0, ac.currentTime);
    masterGain.gain.linearRampToValueAtTime(targetAmb, ac.currentTime + 2.5);
    masterGain.connect(ac.destination);
    const sources = [];

    if (type === 'pluie') {
      // Bruit blanc filtré passe-bas — simule la pluie
      const SR = ac.sampleRate;
      const buf = ac.createBuffer(2, SR * 4, SR);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const noise = ac.createBufferSource();
      noise.buffer = buf; noise.loop = true;
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 650; lp.Q.value = 0.4;
      noise.connect(lp).connect(masterGain);
      noise.start();
      sources.push(noise);

    } else if (type === 'bols') {
      // Harmoniques sinusoïdales avec trémolo — bols tibétains
      [220, 275, 330, 440, 660].forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = 'sine'; osc.frequency.value = freq;
        const g = ac.createGain(); g.gain.value = 0.055 / (i + 1);
        // LFO de trémolo lent
        const lfo = ac.createOscillator(); lfo.frequency.value = 0.25 + i * 0.07;
        const lfoG = ac.createGain(); lfoG.gain.value = g.gain.value * 0.35;
        lfo.connect(lfoG).connect(g.gain);
        osc.connect(g).connect(masterGain);
        osc.start(); lfo.start();
        sources.push(osc, lfo);
      });

    } else if (type === 'drone') {
      // Drone grave avec couches détunées
      [55, 82.5, 110, 165].forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = 'sine'; osc.frequency.value = freq;
        if (i > 0) osc.detune.value = (i % 2 === 0 ? 1 : -1) * 7;
        const g = ac.createGain(); g.gain.value = 0.10 / (i + 1);
        osc.connect(g).connect(masterGain);
        osc.start();
        sources.push(osc);
      });
    }

    ambNodes = { sources, masterGain };
  }

  function stopAmbiance() {
    if (!ambNodes) return;
    try {
      const ac = ctx();
      ambNodes.masterGain.gain.linearRampToValueAtTime(0, ac.currentTime + 1.2);
      const snap = ambNodes.sources;
      setTimeout(() => snap.forEach(n => { try { n.stop(); } catch {} }), 1400);
    } catch {}
    ambNodes = null;
  }

  // ── Toast casque ───────────────────────────────────────────────
  function showToastCasque() {
    if (localStorage.getItem('matrice_casque_shown')) return;
    localStorage.setItem('matrice_casque_shown', '1');
    const t = document.getElementById('m1-toast');
    if (!t) return;
    t.classList.add('visible');
    setTimeout(() => t.classList.remove('visible'), 4500);
  }

  // ── Graine de Vie — Construction SVG ──────────────────────────
  function buildSeedOfLife() {
    const svg = document.getElementById('m1-seed-svg');
    if (!svg || seedCircles.length > 0) return;

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'gdv-circles');
    g.setAttribute('filter', 'url(#seed-glow-f)');

    // Cercle central
    const center = document.createElementNS(NS, 'circle');
    center.setAttribute('cx', GDV_CX);
    center.setAttribute('cy', GDV_CY);
    center.setAttribute('r',  GDV_R);
    center.dataset.idx = '0';
    g.appendChild(center);
    seedCircles.push(center);

    // 6 cercles extérieurs
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60) * Math.PI / 180;
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (GDV_CX + GDV_R * Math.cos(angle)).toFixed(3));
      c.setAttribute('cy', (GDV_CY + GDV_R * Math.sin(angle)).toFixed(3));
      c.setAttribute('r',  GDV_R);
      c.dataset.idx   = String(i + 1);
      c.dataset.angle = String(angle);
      g.appendChild(c);
      seedCircles.push(c);
    }

    svg.appendChild(g);
  }

  // ── Animation — easing ─────────────────────────────────────────
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ── Animation — mise à jour SVG ────────────────────────────────
  function updateSeed(breathAmt, phaseId, ts) {
    const col = PHASE_COLOR[phaseId] || PHASE_COLOR['inspire'];

    const r = GDV_R + R_GROW * breathAmt;
    const d = GDV_R + SPREAD * breathAmt;

    seedCircles.forEach((c, i) => {
      if (i === 0) {
        // Centre : micro-pulsation indépendante
        const micro = Math.sin(ts / 900) * 1.2 * breathAmt;
        c.setAttribute('r', (r + micro).toFixed(3));
      } else {
        const angle = parseFloat(c.dataset.angle);
        // Ripple subtil par cercle (déphasage)
        const ripple = Math.sin(ts / 1400 + i * 1.047) * 1.8 * breathAmt;
        c.setAttribute('cx', (GDV_CX + (d + ripple) * Math.cos(angle)).toFixed(3));
        c.setAttribute('cy', (GDV_CY + (d + ripple) * Math.sin(angle)).toFixed(3));
        c.setAttribute('r', (r + ripple * 0.3).toFixed(3));
      }
    });

    // Stroke-width : s'épaissit à l'inspire
    const sw = (0.7 + breathAmt * 0.8).toFixed(2);
    seedCircles.forEach(c => c.setAttribute('stroke-width', sw));

    // Couleur via custom property sur le SVG parent
    const svg = document.getElementById('m1-seed-svg');
    if (svg) svg.style.setProperty('--gdv-stroke', col.stroke);

    // Blur du filtre glow — plus intense à l'inspire
    const blurEl = document.getElementById('seed-blur-el');
    if (blurEl) blurEl.setAttribute('stdDeviation', (col.blur * breathAmt + 1.5).toFixed(1));

    // Halo
    const halo = document.getElementById('m1-halo');
    if (halo) halo.style.background =
      `radial-gradient(ellipse at center, ${col.halo} 0%, transparent 68%)`;

    // Couleur du texte de phase
    const root = document.documentElement;
    root.style.setProperty('--breath-text', col.text);
  }

  // ── Boucle principale ──────────────────────────────────────────
  function loop(ts) {
    if (!running) return;
    if (!sessionStart) sessionStart = ts;
    if (!phaseStart)   phaseStart   = ts;

    const totalElapsed = (ts - sessionStart) / 1000;
    const remaining    = totalSecs - totalElapsed;
    updateTimerDisplay(Math.max(0, remaining));

    if (remaining <= 0) { onEnd(); return; }

    const phases      = PATTERNS[pattern];
    const phase       = phases[phaseIdx];
    const phaseElapsed = (ts - phaseStart) / 1000;
    const progress    = Math.min(phaseElapsed / phase.secs, 1);

    // Countdown entier
    const countdown = Math.max(1, Math.ceil(phase.secs - phaseElapsed));
    const cEl = document.getElementById('m1-phase-count');
    if (cEl && cEl.textContent !== String(countdown)) cEl.textContent = countdown;

    // breathAmt : 0 = contracté, 1 = épanoui
    let breathAmt;
    switch (phase.id) {
      case 'inspire':  breathAmt = easeInOutCubic(progress);     break;
      case 'hold-in':  breathAmt = 1;                            break;
      case 'expire':   breathAmt = easeInOutCubic(1 - progress); break;
      case 'hold-out': breathAmt = 0;                            break;
      default:         breathAmt = 0;
    }

    updateSeed(breathAmt, phase.id, ts);

    // Passage à la phase suivante
    if (phaseElapsed >= phase.secs) {
      phaseIdx  = (phaseIdx + 1) % phases.length;
      phaseStart = ts;
      setPhaseLabel(phases[phaseIdx]);
    }

    animFrameId = requestAnimationFrame(loop);
  }

  // ── Helpers UI ─────────────────────────────────────────────────
  function updateTimerDisplay(secs) {
    const el = document.getElementById('m1-timer');
    if (!el) return;
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    el.classList.toggle('urgent', secs < 30 && secs > 0);
  }

  function setPhaseLabel(phase) {
    const lEl = document.getElementById('m1-phase-label');
    const cEl = document.getElementById('m1-phase-count');
    if (lEl) {
      lEl.style.opacity = '0';
      setTimeout(() => { lEl.textContent = phase.label; lEl.style.opacity = '1'; }, 120);
    }
    if (cEl) cEl.textContent = Math.ceil(phase.secs);
  }

  // ── Consignes d'entrée ─────────────────────────────────────────
  function showConsigne() {
    const overlay = document.getElementById('m1-consigne');
    const textEl  = document.getElementById('m1-consigne-text');
    if (!overlay || !textEl) return;

    const lines = [
      'Mâchoire relâchée. Épaules lourdes. Bassin posé.',
      'Suis la Graine de Vie. Descends dans le corps.',
    ];

    let i = 0;
    const show = () => {
      textEl.textContent = lines[i];
      overlay.classList.add('visible');
      setTimeout(() => {
        overlay.classList.remove('visible');
        i++;
        if (i < lines.length) setTimeout(show, 900);
      }, 3200);
    };
    setTimeout(show, 500);
  }

  // ── Fin de session ─────────────────────────────────────────────
  function onEnd() {
    running = false;
    cancelAnimationFrame(animFrameId);
    const btn = document.getElementById('m1-next-btn');
    if (btn) {
      btn.innerHTML = '✓ Complété — Module suivant <span class="m1-next-arrow">→</span>';
      btn.style.color = 'var(--gold)';
    }
  }

  // ── Liaison des événements UI ──────────────────────────────────
  function bindEvents() {
    // Patterns
    document.querySelectorAll('.m1-pattern-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.dataset.pattern;
        if (p === pattern) return;
        pattern  = p;
        phaseIdx = 0;
        phaseStart = performance.now();
        setPhaseLabel(PATTERNS[p][0]);
        document.querySelectorAll('.m1-pattern-btn').forEach(b => {
          b.classList.toggle('m1-pattern-btn--active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    // Binauraux
    document.querySelectorAll('.m1-freq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.freq;
        const isActive = btn.classList.contains('m1-freq-btn--active');
        if (isActive) {
          // Toggle off
          stopBinaural(); currentFreq = null;
          document.querySelectorAll('.m1-freq-btn').forEach(b => {
            b.classList.remove('m1-freq-btn--active');
            b.setAttribute('aria-pressed', 'false');
          });
        } else {
          currentFreq = f;
          switchBinaural(f);
          document.querySelectorAll('.m1-freq-btn').forEach(b => {
            b.classList.toggle('m1-freq-btn--active', b === btn);
            b.setAttribute('aria-pressed', String(b === btn));
          });
        }
      });
    });

    // Ambiance
    document.querySelectorAll('.m1-amb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = btn.dataset.amb;
        currentAmb = a;
        startAmbiance(a);
        document.querySelectorAll('.m1-amb-btn').forEach(b => {
          b.classList.toggle('m1-amb-btn--active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    // Timer −
    document.getElementById('m1-timer-minus')?.addEventListener('click', () => {
      const elapsed = sessionStart ? (performance.now() - sessionStart) / 1000 : 0;
      totalSecs = Math.max(90, totalSecs - 30);
      if (totalSecs < elapsed + 10) totalSecs = elapsed + 30;
      updateTimerDisplay(Math.max(0, totalSecs - elapsed));
    });

    // Timer +
    document.getElementById('m1-timer-plus')?.addEventListener('click', () => {
      totalSecs = Math.min(900, totalSecs + 30);
      const elapsed = sessionStart ? (performance.now() - sessionStart) / 1000 : 0;
      updateTimerDisplay(totalSecs - elapsed);
    });

    // Slider volume binauraux
    document.getElementById('m1-vol-binaural')?.addEventListener('input', e => {
      const vol = parseFloat(e.target.value) * 0.002; // 0–100 → 0–0.20
      if (binNodes) binNodes.gainNode.gain.setValueAtTime(vol, ctx().currentTime);
    });

    // Slider volume ambiance
    document.getElementById('m1-vol-ambiance')?.addEventListener('input', e => {
      const vol = parseFloat(e.target.value) * 0.003; // 0–100 → 0–0.30
      if (ambNodes) ambNodes.masterGain.gain.setValueAtTime(vol, ctx().currentTime);
    });

    // Module suivant → Module 2
    document.getElementById('m1-next-btn')?.addEventListener('click', () => {
      navigateTo('m2');
    });
  }

  // ── Start / Stop ───────────────────────────────────────────────
  function start() {
    buildSeedOfLife();

    // Reset état
    running      = true;
    phaseIdx     = 0;
    phaseStart   = 0;
    sessionStart = 0;
    totalSecs    = 120;

    updateTimerDisplay(totalSecs);
    setPhaseLabel(PATTERNS[pattern][0]);
    showConsigne();

    // Démarrer binaural Theta par défaut
    startBinaural(currentFreq || 'theta');

    animFrameId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(animFrameId);
    stopBinaural();
    stopAmbiance();
    // Réinitialiser les cercles pour prochain démarrage
    seedCircles.forEach(c => {
      const i = parseInt(c.dataset.idx);
      if (i === 0) {
        c.setAttribute('r', GDV_R);
      } else {
        const a = parseFloat(c.dataset.angle);
        c.setAttribute('cx', (GDV_CX + GDV_R * Math.cos(a)).toFixed(3));
        c.setAttribute('cy', (GDV_CY + GDV_R * Math.sin(a)).toFixed(3));
        c.setAttribute('r', GDV_R);
      }
    });
  }

  // Enregistrement du hook de cycle de vie
  screenHooks.rituel = { onEnter: start, onLeave: stop };

  // Liaison des événements au chargement du DOM
  document.addEventListener('DOMContentLoaded', bindEvents);

  return { start, stop };

})();

// ════════════════════════════════════════════════════════════════

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then(reg => {
        console.debug('[MATRICE] Service Worker enregistré :', reg.scope);
      })
      .catch(err => {
        console.warn('[MATRICE] Service Worker — échec :', err);
      });
  });
}
