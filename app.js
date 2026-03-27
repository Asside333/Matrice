'use strict';

/* ================================================================
   MATRICE — app.js
   Instrument de calibration personnelle
   ================================================================ */

// ── Constantes ────────────────────────────────────────────────────
const NS = 'http://www.w3.org/2000/svg';

// ── Spirale d'or — utilitaire partagé ────────────────────────────
// r(t) = a · exp(B · t)   où B = ln(φ) / (π/2)  ← vraie spirale d'or
const SpiralGold = (() => {
  const B = Math.log(1.618) / (Math.PI / 2); // ≈ 0.3063

  /** Points [x,y] du tracé lisse de la spirale (nPts segments) */
  function path(cx, cy, a, tStart, tEnd, nPts) {
    const pts = [];
    for (let i = 0; i <= nPts; i++) {
      const t = tStart + (i / nPts) * (tEnd - tStart);
      const r = a * Math.exp(B * t);
      pts.push([cx + r * Math.cos(t), cy - r * Math.sin(t)]);
    }
    return pts;
  }

  /** Position [x,y] pour le jour i sur n jours total */
  function dayPos(cx, cy, a, tStart, tEnd, i, n) {
    const t = tStart + (i / Math.max(n - 1, 1)) * (tEnd - tStart);
    const r = a * Math.exp(B * t);
    return [cx + r * Math.cos(t), cy - r * Math.sin(t)];
  }

  return { path, dayPos };
})();

// Paramètres spirale grande — Parcours (viewBox 280×280)
const SP = { cx: 140, cy: 140, a: 2, tStart: 1.0, tEnd: 12.0 };
// Paramètres spirale mini — Accueil (viewBox 120×120, affichée 110×110px)
const SP_MINI = { cx: 60, cy: 60, a: 0.85, tStart: 1.0, tEnd: 12.0 };
// Couleurs humeur : 1=gris foncé  2=gris  3=or sombre  4=or  5=or vif
const MOOD_COLS = ['', '#5a5a62', '#888899', '#B8860B', '#DAA520', '#FFD700'];

// Hooks de cycle de vie par écran — populé par chaque module
const screenHooks = {};

// ── État global du rituel ─────────────────────────────────────
const RITUAL_STATE = {
  humeur:        null,
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
// HAPTIC FEEDBACK — vibration légère
// ════════════════════════════════════════════════════════════════

function haptic(pattern) {
  try { navigator.vibrate?.(pattern); } catch (_) {}
}

// ════════════════════════════════════════════════════════════════
// CLOCHE 528Hz — sine avec fast decay
// ════════════════════════════════════════════════════════════════

let bellCtx = null;
function playBell() {
  if (!isSoundsEnabled()) return;
  try {
    if (!bellCtx || bellCtx.state === 'closed') {
      bellCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (bellCtx.state === 'suspended') bellCtx.resume();
    const now = bellCtx.currentTime;

    const osc = bellCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now);

    const gain = bellCtx.createGain();
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc.connect(gain);
    gain.connect(bellCtx.destination);
    osc.start(now);
    osc.stop(now + 3);
  } catch (_) {}
}

// ════════════════════════════════════════════════════════════════
// SONS RITUELS — système audio sacré
// ════════════════════════════════════════════════════════════════

function isSoundsEnabled() {
  try { return localStorage.getItem('matrice_sounds') !== 'off'; } catch { return true; }
}

/** Clôture : 528Hz + 396Hz, decay 3s */
function playBellCloture() {
  if (!isSoundsEnabled()) return;
  try {
    if (!bellCtx || bellCtx.state === 'closed') {
      bellCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (bellCtx.state === 'suspended') bellCtx.resume();
    const now = bellCtx.currentTime;
    [528, 396].forEach(freq => {
      const osc = bellCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      const g = bellCtx.createGain();
      g.gain.setValueAtTime(0.025, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 3);
      osc.connect(g); g.connect(bellCtx.destination);
      osc.start(now); osc.stop(now + 3.5);
    });
  } catch (_) {}
}

/** SOS : 136.1Hz Om + vibrato LFO 4Hz, decay 4s */
function playOmSos() {
  if (!isSoundsEnabled()) return;
  try {
    if (!bellCtx || bellCtx.state === 'closed') {
      bellCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (bellCtx.state === 'suspended') bellCtx.resume();
    const now = bellCtx.currentTime;
    const osc = bellCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(136.1, now);
    const lfo = bellCtx.createOscillator();
    lfo.frequency.setValueAtTime(4, now);
    const lfoGain = bellCtx.createGain();
    lfoGain.gain.setValueAtTime(3, now);
    lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
    const g = bellCtx.createGain();
    g.gain.setValueAtTime(0.035, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 4);
    osc.connect(g); g.connect(bellCtx.destination);
    osc.start(now); lfo.start(now);
    osc.stop(now + 4.5); lfo.stop(now + 4.5);
  } catch (_) {}
}

/** Yi King : 3 clics brefs (bruit blanc filtré 2000-4000Hz) */
function playYiKingCoins() {
  if (!isSoundsEnabled()) return;
  try {
    if (!bellCtx || bellCtx.state === 'closed') {
      bellCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (bellCtx.state === 'suspended') bellCtx.resume();
    const now = bellCtx.currentTime;
    for (let i = 0; i < 3; i++) {
      const t = now + i * 0.12;
      const bufSize = bellCtx.sampleRate * 0.06;
      const buf = bellCtx.createBuffer(1, bufSize, bellCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < bufSize; j++) data[j] = (Math.random() * 2 - 1);
      const src = bellCtx.createBufferSource();
      src.buffer = buf;
      const bp = bellCtx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 1.5;
      const g = bellCtx.createGain();
      g.gain.setValueAtTime(0.04, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      src.connect(bp); bp.connect(g); g.connect(bellCtx.destination);
      src.start(t); src.stop(t + 0.1);
    }
  } catch (_) {}
}

// ════════════════════════════════════════════════════════════════
// THÈME ADAPTATIF
// ════════════════════════════════════════════════════════════════

function getTheme() {
  const saved = localStorage.getItem('matrice_theme');
  if (saved === 'dark') return 'dark';
  if (saved === 'light') return 'light';
  const h = new Date().getHours();
  return (h >= 7 && h < 19) ? 'light' : 'dark';
}

function applyTheme() {
  const isLight = getTheme() === 'light';
  document.body.classList.toggle('light-mode', isLight);

  const metaTheme = document.getElementById('meta-theme');
  if (metaTheme) {
    metaTheme.setAttribute('content', isLight ? '#946A0A' : '#B8860B');
  }

  updateThemeToggleBtn();
}

// SVG soleil (mode sombre → clic → mode clair)
const SVG_SUN = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

// SVG lune (mode clair → clic → mode sombre)
const SVG_MOON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

function updateThemeToggleBtn() {
  const btn = document.getElementById('btn-theme-toggle');
  if (!btn) return;
  const isLight = document.body.classList.contains('light-mode');
  // En mode sombre → affiche soleil (clic = passer en clair)
  // En mode clair → affiche lune (clic = passer en sombre)
  btn.innerHTML = isLight ? SVG_MOON : SVG_SUN;
  btn.setAttribute('aria-label', isLight ? 'Passer en mode sombre' : 'Passer en mode clair');
}

// ════════════════════════════════════════════════════════════════
// NAVIGATION ENTRE ÉCRANS
// ════════════════════════════════════════════════════════════════

let currentScreen = 'accueil';
let _navTransitioning = false;
let _navLastTime = 0;

const RITUAL_SCREENS = new Set(['rituel', 'rituel-session', 'm2', 'm3', 'm4', 'm5', 'm6', 'cloture']);

function navigateTo(screenId) {
  const now = performance.now();
  if (screenId === currentScreen || _navTransitioning || (now - _navLastTime < 300)) return;
  _navTransitioning = true;
  _navLastTime = now;

  const prev = document.getElementById(`screen-${currentScreen}`);
  const next = document.getElementById(`screen-${screenId}`);
  if (!next) { _navTransitioning = false; return; }

  // Arrêt binaural + wake lock quand on quitte complètement le rituel
  if (RITUAL_SCREENS.has(currentScreen) && !RITUAL_SCREENS.has(screenId)) {
    if (typeof Module1 !== 'undefined') {
      Module1.stopBinaural();
      Module1.releaseWakeLock();
    }
  }

  // Hook de sortie de l'écran courant
  screenHooks[currentScreen]?.onLeave?.();

  // Phase 1 — Écran sortant monte + disparaît
  if (prev) {
    prev.classList.add('screen--leaving');
    prev.classList.remove('active');
  }

  // Phase 2 — Pause 150ms puis nouvel écran émerge du bas
  setTimeout(() => {
    if (prev) prev.classList.remove('screen--leaving');
    next.classList.add('active');
    currentScreen = screenId;
    _navTransitioning = false;
    updateNavState(screenId);
    updateSOSVisibility(screenId);
    updateNavVisibility(screenId);

    // Animer les dots de progression du module (si présents)
    animateModuleDots(next);

    // Hook d'entrée du nouvel écran
    screenHooks[screenId]?.onEnter?.();
  }, 150);
}

/**
 * Anime les dots de progression des modules (cascade d'apparition).
 */
function animateModuleDots(screenEl) {
  const dots = screenEl.querySelectorAll('.m1-dot');
  if (!dots.length) return;
  dots.forEach((dot, i) => {
    dot.classList.remove('m1-dot--spring');
    dot.style.opacity = '0';
    dot.style.transform = 'scale(0.3)';
    dot.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dot.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        dot.style.transitionDelay = (i * 60) + 'ms';
        dot.style.opacity = '1';
        dot.style.transform = 'scale(1)';
        // Spring sur le dot actif
        if (dot.classList.contains('m1-dot--active')) {
          setTimeout(() => dot.classList.add('m1-dot--spring'), i * 60 + 260);
        }
      });
    });
  });
}

function updateNavState(screenId) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenId);
  });
}

function updateSOSVisibility(screenId) {
  // SOS dans la nav : caché uniquement sur l'écran SOS lui-même
  const navSos = document.getElementById('nav-sos-btn');
  if (navSos) navSos.classList.toggle('hidden', screenId === 'sos');

  // SOS flottant (gauche) : visible uniquement pendant les modules du rituel
  const sos = document.getElementById('btn-sos');
  if (!sos) return;
  const ritualScreens = ['rituel', 'rituel-session', 'm2', 'm3', 'm4', 'm5', 'm6'];
  // Bouton binaural flottant : pas affiché en mode Studio (Studio gère son propre stop)
  sos.classList.toggle('hidden', !ritualScreens.includes(screenId));

  // Bouton binaural persistant : visible pendant la session et les modules suivants
  const binBtn = document.getElementById('ritual-bin-btn');
  if (binBtn) {
    const showBin = ['rituel-session', 'm2', 'm3', 'm4', 'm5', 'm6'].includes(screenId);
    binBtn.hidden = !showBin;
  }
}

function updateNavVisibility(screenId) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const hideNav = ['humeur', 'rituel', 'rituel-session', 'libre-session', 'm2', 'm3', 'm4', 'm5', 'm6', 'cloture', 'parametres', 'nuit'].includes(screenId);
  nav.style.opacity = hideNav ? '0' : '1';
  nav.style.pointerEvents = hideNav ? 'none' : 'auto';
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

  // ── Particules lumineuses voyageant le long des lignes ────────
  startMetatronParticles(svg, pts);

  // ── Touch interaction — pulse au tap ─────────────────────────
  svg.addEventListener('click', (e) => {
    const circles = svg.querySelectorAll('.mcube-circles circle');
    circles.forEach(c => {
      c.classList.add('mcube-touch-pulse');
      setTimeout(() => c.classList.remove('mcube-touch-pulse'), 600);
    });
  });
}

/**
 * Anime des particules de lumière voyageant le long des lignes du Cube.
 * Sélectionne aléatoirement des lignes et y fait glisser un point lumineux.
 */
let metatronParticleTimer = null;
function startMetatronParticles(svg, pts) {
  if (metatronParticleTimer) clearInterval(metatronParticleTimer);

  // Groupe dédié aux particules
  let gParticles = svg.querySelector('.mcube-light-particles');
  if (!gParticles) {
    gParticles = document.createElementNS(NS, 'g');
    gParticles.setAttribute('class', 'mcube-light-particles');
    svg.appendChild(gParticles);
  }

  function spawnLightParticle() {
    // Choisir 2 points aléatoires
    const a = pts[Math.floor(Math.random() * pts.length)];
    const b = pts[Math.floor(Math.random() * pts.length)];
    if (a === b) return;

    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('r', '1.2');
    circle.setAttribute('fill', 'var(--gold)');
    circle.setAttribute('opacity', '0');
    circle.setAttribute('class', 'mcube-light-dot');
    gParticles.appendChild(circle);

    const dur = 2000 + Math.random() * 2000;
    const start = performance.now();

    function animate(now) {
      const t = Math.min((now - start) / dur, 1);
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      // Fade in/out
      const op = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
      circle.setAttribute('cx', x.toFixed(1));
      circle.setAttribute('cy', y.toFixed(1));
      circle.setAttribute('opacity', (op * 0.7).toFixed(2));
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        circle.remove();
      }
    }
    requestAnimationFrame(animate);
  }

  // Spawn une particule toutes les ~800ms
  metatronParticleTimer = setInterval(spawnLightParticle, 800);
  // Spawn immédiatement quelques-unes
  for (let i = 0; i < 3; i++) setTimeout(spawnLightParticle, i * 200);
}

// ════════════════════════════════════════════════════════════════
// STREAK + SPIRALE — Accueil
// ════════════════════════════════════════════════════════════════

function loadStreak() {
  const { streakConsecutif } = MatriceStorage.getStreakData();

  // Easter eggs
  if (streakConsecutif > 0 && streakConsecutif % 3 === 0) {
    document.body.classList.add('streak-multiple-3');
  } else {
    document.body.classList.remove('streak-multiple-3');
  }
  if (streakConsecutif === 33) {
    setTimeout(() => {
      document.body.classList.add('easter-33');
      haptic([50, 80, 50, 80, 50]); // triple pulse
      setTimeout(() => document.body.classList.remove('easter-33'), 2000);
    }, 800);
  }
  if (streakConsecutif === 333) {
    document.body.classList.add('easter-333');
    haptic([200, 100, 200, 100, 200]); // longue vibration triple
    setTimeout(() => document.body.classList.remove('easter-333'), 3500);
  }

  buildAccueilSpiral();
}

function buildAccueilSpiral() {
  const svg = document.getElementById('accueil-spiral-svg');
  if (!svg) return;
  svg.innerHTML = '';

  const { streakConsecutif, streakSaison, season, seasonDays } = MatriceStorage.getStreakData();
  const cal   = MatriceStorage.getCalendar();
  const today = new Date().toISOString().slice(0, 10);
  const n     = seasonDays.length; // total jours de la saison

  // ══════════════════════════════════════════════════════════════
  // SPIRALE DE FIBONACCI — série d'arcs de quart de cercle
  // Rayons : 1, 1, 2, 3, 5, 8, 13, 21  (suite de Fibonacci)
  // Chaque arc sweeps 90° dans le sens horaire (CW)
  // Coordonnées normalisées : x droite, y haut. Début en (0,0).
  // Arc data : [rayon, cx_norm, cy_norm, angle_départ_deg]
  // ══════════════════════════════════════════════════════════════
  const FIB_ARCS = [
    [ 1,   0,   1,  270],  // (0,0)  → (-1, 1)
    [ 1,  -2,   1,    0],  // (-1,1) → (-2, 0)
    [ 2,  -2,  -2,   90],  // (-2,0) → ( 0,-2)
    [ 3,   3,  -2,  180],  // (0,-2) → ( 3, 1)
    [ 5,   3,   6,  270],  // (3, 1) → (-2, 6)
    [ 8, -10,   6,    0],  // (-2,6) → (-10,-2)
    [13, -10, -15,   90],  // (-10,-2)→(3,-15)
    [21,  24, -15,  180],  // (3,-15) → (24, 6)
  ];

  // Début de la spirale ancré au centre du SVG (60,60)
  // Scale 2.5 → la spirale s'étend de x=[35,120] y=[45,97] dans le SVG
  const OX = 60, OY = 60, SCALE = 2.5;
  const toSVG = (nx, ny) => [OX + nx * SCALE, OY - ny * SCALE];

  // ── Générer tous les points de la spirale ──────────────────────
  const pts = [];
  for (const [r, nx, ny, deg0] of FIB_ARCS) {
    const segs = Math.max(16, r * 12); // plus de segments pour les grands arcs
    for (let j = 0; j <= segs; j++) {
      const a = (deg0 - (j / segs) * 90) * Math.PI / 180;
      pts.push(toSVG(nx + r * Math.cos(a), ny + r * Math.sin(a)));
    }
  }

  // ── Tracé SVG ─────────────────────────────────────────────────
  const d = 'M' + pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L');
  const spiralPath = document.createElementNS(NS, 'path');
  spiralPath.setAttribute('d', d);
  spiralPath.setAttribute('stroke', season.colorTrace);
  spiralPath.setAttribute('stroke-width', '1.2');
  spiralPath.setAttribute('fill', 'none');
  spiralPath.setAttribute('opacity', '0.65');
  spiralPath.setAttribute('stroke-linecap', 'round');
  svg.appendChild(spiralPath);

  // ── Déploiement progressif jusqu'au dernier jour complété ──────
  // Chaque jour de la saison a SA place fixe sur la spirale :
  // jour 0 = centre (début), jour N-1 = extrémité (fin)
  // La spirale se révèle seulement jusqu'où on en est dans la saison.
  let lastCompletedIdx = -1;
  const done = [];
  seasonDays.forEach((dateStr, i) => {
    if (dateStr > today) return;
    const entry = cal[dateStr];
    if (entry?.completed) { done.push({ dateStr, entry, i }); lastCompletedIdx = i; }
  });

  // fraction de la spirale à révéler (minimum 1% pour montrer l'amorce)
  const revealFrac = lastCompletedIdx < 0
    ? 0.01
    : Math.max(0.01, (lastCompletedIdx + 1) / Math.max(n, 1));

  try {
    const len = spiralPath.getTotalLength();
    spiralPath.style.strokeDasharray  = len;
    spiralPath.style.strokeDashoffset = len; // caché au départ
    spiralPath.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      spiralPath.style.strokeDashoffset = len * (1 - revealFrac);
    }));
  } catch (_) {}

  // ── Points : chaque jour a sa position fixe sur la spirale ────
  // La position est proportionnelle à l'index du jour dans la saison.
  // Jour 1 = centre, jour N = extrémité — la suite se déploie.
  const T = pts.length - 1;
  const dotDelay = 1200 / Math.max(done.length, 1);

  done.forEach(({ dateStr, entry, i }, idx) => {
    const frac     = n > 1 ? i / (n - 1) : 0;
    const [px, py] = pts[Math.round(frac * T)];
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', px.toFixed(2));
    dot.setAttribute('cy', py.toFixed(2));
    dot.setAttribute('r', dateStr === today ? '3.0' : '2.2');
    dot.setAttribute('fill', MOOD_COLS[entry.mood] || MOOD_COLS[3]);
    dot.style.opacity = '0';
    dot.style.transition = 'opacity 0.25s ease';
    setTimeout(() => { dot.style.opacity = '1'; }, 1800 + idx * dotDelay);
    svg.appendChild(dot);
  });

  // ── Streak — affiché au cœur de la spirale (origine) ──────────
  const tCount = document.createElementNS(NS, 'text');
  tCount.setAttribute('x', OX); tCount.setAttribute('y', OY + 1);
  tCount.setAttribute('text-anchor', 'middle');
  tCount.setAttribute('dominant-baseline', 'middle');
  tCount.setAttribute('fill', '#B8860B');
  tCount.setAttribute('font-family', "'Cormorant Garamond', Georgia, serif");
  tCount.setAttribute('font-size', '26');
  tCount.setAttribute('font-weight', '300');
  tCount.textContent = streakConsecutif;
  svg.appendChild(tCount);

  const tLabel = document.createElementNS(NS, 'text');
  tLabel.setAttribute('x', OX); tLabel.setAttribute('y', OY + 14);
  tLabel.setAttribute('text-anchor', 'middle');
  tLabel.setAttribute('fill', 'rgba(184,134,11,0.60)');
  tLabel.setAttribute('font-family', "'DM Sans', sans-serif");
  tLabel.setAttribute('font-size', '7');
  tLabel.setAttribute('letter-spacing', '1.8');
  tLabel.textContent = 'JOURS';
  svg.appendChild(tLabel);

  // ── Label saison ───────────────────────────────────────────────
  const saison = document.getElementById('accueil-spiral-saison');
  if (saison) saison.textContent = `${season.name} : ${streakSaison}/${n}`;
}

// ════════════════════════════════════════════════════════════════
// PHASE LUNAIRE
// ════════════════════════════════════════════════════════════════

function displayPhaseLunaire() {
  const phase   = MoonSystem.getMoonPhase(new Date());
  const iconSvg = MoonSystem.drawMoonIcon(phase.key, 26);
  const blockEl = document.getElementById('moon-block');
  if (blockEl) {
    blockEl.innerHTML =
      `<span class="moon-icon">${iconSvg}</span>` +
      `<span class="moon-block-name">${phase.name}</span>`;
    blockEl.setAttribute('title', phase.name);
  }
}

// ════════════════════════════════════════════════════════════════
// SPLASH — Écran de chargement
// ════════════════════════════════════════════════════════════════

function hideSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  const digits333  = document.getElementById('splash-333-anim');
  const seedSvg    = document.getElementById('splash-seed');
  const particles  = document.getElementById('splash-particles');
  const chars      = digits333 ? digits333.querySelectorAll('.sp-char') : [];
  const circles    = seedSvg?.querySelectorAll('.splash-circle') || [];

  // Phase 0 — tout caché
  if (seedSvg) seedSvg.style.opacity = '0';

  // Phase 1 — Caractères "3 · 3 · 3" apparaissent un par un
  // 3 fade 300ms → · fade 200ms → 3 fade 300ms → · fade 200ms → 3 fade 300ms
  let t = 0;
  const delays = [300, 200, 300, 200, 300]; // durée entre chaque apparition
  chars.forEach((ch, i) => {
    setTimeout(() => ch.classList.add('sp-visible'), t);
    t += delays[i] || 300;
  });

  // Hold 1s après dernier caractère, puis dissolution + particules
  const dissolveStart = t + 1000;

  setTimeout(() => {
    // Dissolution du texte 3·3·3
    if (digits333) digits333.classList.add('sp-dissolving');

    // Spawner des particules dorées
    if (particles) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'sp-particle';
        const angle = Math.random() * Math.PI * 2;
        const dist  = 30 + Math.random() * 60;
        p.style.setProperty('--sp-dx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--sp-dy', `${Math.sin(angle) * dist}px`);
        p.style.left = `${90 + (Math.random() - 0.5) * 80}px`;
        p.style.top  = `${25 + (Math.random() - 0.5) * 20}px`;
        p.style.animationDelay = `${Math.random() * 0.3}s`;
        particles.appendChild(p);
      }
    }
  }, dissolveStart);

  // Phase 2 — Graine de Vie, cercle par cercle (150ms chacun)
  const seedStart = dissolveStart + 700;
  setTimeout(() => {
    if (seedSvg) {
      seedSvg.style.transition = 'opacity 0.3s ease';
      seedSvg.style.opacity = '1';
    }
    circles.forEach((c, i) => {
      setTimeout(() => { c.style.opacity = '0.9'; }, i * 150);
    });

    // Pulse unique après tous les cercles
    const pulseMoment = circles.length * 150 + 100;
    setTimeout(() => {
      if (seedSvg) seedSvg.classList.add('sp-pulse');
    }, pulseMoment);
  }, seedStart);

  // Phase 3 — Transition fluide vers accueil
  const totalAnim = seedStart + circles.length * 150 + 800;
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => splash.remove(), 1000);
  }, totalAnim);
}

// ════════════════════════════════════════════════════════════════
// ÉVÉNEMENTS
// ════════════════════════════════════════════════════════════════

function bindEvents() {
  // Navigation principale (barre du bas)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // L'onglet Rituel passe par le check-in humeur
      const target = btn.dataset.screen === 'rituel' ? 'humeur' : btn.dataset.screen;
      navigateTo(target);
    });
  });

  // Bouton "Commencer le rituel" → check-in humeur d'abord
  document.getElementById('btn-rituel')
    ?.addEventListener('click', () => navigateTo('humeur'));

  // Lune accueil → check-in humeur (navigation directe)
  document.getElementById('moon-block')
    ?.addEventListener('click', () => {
      if (typeof MoonOverlay !== 'undefined') MoonOverlay.show();
    });

  // Toggle thème rapide sur l'accueil (soleil/lune)
  document.getElementById('btn-theme-toggle')
    ?.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      try { localStorage.setItem('matrice_theme', isLight ? 'dark' : 'light'); } catch {}
      applyTheme();
    });

  // Icône paramètres sur l'accueil
  document.getElementById('btn-settings')
    ?.addEventListener('click', () => navigateTo('parametres'));

  // Bouton Mode Nuit sur l'accueil
  document.getElementById('btn-nuit')
    ?.addEventListener('click', () => navigateTo('nuit'));

  // Mini spirale accueil → parcours (avec pulse)
  const spiralMini = document.querySelector('.accueil-spiral-mini');
  if (spiralMini) {
    const goToParcours = () => {
      spiralMini.classList.remove('spiral-pulsing');
      void spiralMini.offsetWidth; // reflow pour relancer l'anim
      spiralMini.classList.add('spiral-pulsing');
      setTimeout(() => {
        spiralMini.classList.remove('spiral-pulsing');
        navigateTo('parcours');
      }, 450);
    };
    spiralMini.addEventListener('touchstart', (e) => {
      e.preventDefault();
      goToParcours();
    }, { passive: false });
    spiralMini.addEventListener('click', goToParcours);
    spiralMini.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToParcours(); }
    });
  }

  // Bouton SOS dans la nav
  document.getElementById('nav-sos-btn')
    ?.addEventListener('click', () => navigateTo('sos'));

  // Bouton SOS flottant (rituel)
  document.getElementById('btn-sos')
    ?.addEventListener('click', () => navigateTo('sos'));

  // Bouton retour check-in humeur → accueil
  document.getElementById('hm-back-btn')
    ?.addEventListener('click', () => navigateTo('accueil'));

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

  // 3. Migration calendrier + archivage des saisons passées
  MatriceStorage.migrateFromLogs();
  MatriceStorage.archiveSeasonIfNeeded();

  // 4. Hook accueil — rebuild spiral quand on revient à l'accueil
  screenHooks.accueil = {
    onEnter: () => {
      loadStreak();
      if (!metatronParticleTimer) {
        const svg = document.getElementById('metatron-svg');
        if (svg) {
          const pts = computeMetatronPoints();
          startMetatronParticles(svg, pts);
        }
      }
    },
    onLeave: () => {
      if (metatronParticleTimer) {
        clearInterval(metatronParticleTimer);
        metatronParticleTimer = null;
      }
    }
  };

  // 5. Données persistées
  loadStreak();
  displayPhaseLunaire();

  // Activer le streak breathing sur la spirale accueil
  const spiralEl = document.querySelector('.accueil-spiral-mini');
  if (spiralEl) spiralEl.classList.add('streak-breathing');

  // 6. Événements
  bindEvents();

  // 5. Masquer le splash
  hideSplash();

  // 7. Vérification du thème toutes les minutes
  setInterval(applyTheme, 60_000);

  // 8. Relancer les notifications si déjà configurées
  setTimeout(() => {
    try {
      const s = JSON.parse(localStorage.getItem('matrice_notif_settings') || 'null');
      if (s?.enabled && Notification?.permission === 'granted') {
        // ModuleParametres expose scheduleNotifications via onEnter — on replanifie ici
        // en reconstruisant la logique minimale pour ne pas coupler les modules
        const MORNING_MSGS = ["C'est le moment de calibrer ton champ.", "Un nouveau matin. Commence-le depuis l'intérieur.", "Ta pratique du matin façonne ta journée.", "Avant que le bruit du monde entre — prends ce moment pour toi.", "Chaque matin qui commence ici change quelque chose."];
        const EVENING_MSGS = ["La journée s'achève. Prends un moment pour la sceller.", "Ce soir, quelques mots suffisent.", "Avant de dormir — un instant de gratitude.", "Le journal du soir t'attend.", "Scelle cette journée avant de laisser entrer le sommeil."];
        function scheduleOnce(hour, msgs) {
          const now = new Date();
          const next = new Date(now);
          next.setHours(hour, 0, 0, 0);
          if (next <= now) next.setDate(next.getDate() + 1);
          setTimeout(() => {
            try { new Notification('MATRICE', { body: msgs[Math.floor(Math.random() * msgs.length)], icon: './icons/icon-192.png' }); } catch(_) {}
            scheduleOnce(hour, msgs);
          }, Math.min(next - now, 2147483647));
        }
        scheduleOnce(s.morningHour ?? 7, MORNING_MSGS);
        scheduleOnce(s.eveningHour ?? 21, EVENING_MSGS);
      }
    } catch (_) {}
  }, 1000);
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
    profond: [
      { id: 'inspire',  label: 'Inspire', secs: 6 },
      { id: 'expire',   label: 'Expire',  secs: 6 },
    ],
    wimhof: [
      { id: 'inspire',  label: 'Inspire', secs: 2 },
      { id: 'expire',   label: 'Expire',  secs: 2 },
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

  const FREQ_LABELS = { theta: '6Hz', alpha: '10Hz', gamma: '40Hz', none: '—' };

  // ── Géométrie Graine de Vie ────────────────────────────────────
  const GDV_CX = 120, GDV_CY = 120;
  const GDV_R  = 54;
  const SPREAD = 38;
  const R_GROW = 14;

  // ── Config (écran préparation) ─────────────────────────────────
  let cfgFreq     = 'theta';
  let cfgPattern  = 'coherence';
  let cfgAmb      = 'silence';
  let cfgSecs     = 120;

  // ── État session ───────────────────────────────────────────────
  let running      = false;
  let pattern      = 'coherence';
  let phaseIdx     = 0;
  let phaseStart   = 0;
  let sessionStart = 0;
  let totalSecs    = 120;
  let animFrameId  = null;
  let seedCircles  = [];

  // ── Wake Lock ─────────────────────────────────────────────────
  let wakeLock = null;

  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) { startNoSleep(); return; }
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch {
      startNoSleep();
    }
  }

  // Fallback NoSleep : vidéo invisible en boucle
  let noSleepVideo = null;
  function startNoSleep() {
    if (noSleepVideo) return;
    noSleepVideo = document.createElement('video');
    noSleepVideo.setAttribute('playsinline', '');
    noSleepVideo.setAttribute('muted', '');
    noSleepVideo.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none';
    // Vidéo vide 1x1 pixel, loop
    noSleepVideo.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAA';
    noSleepVideo.loop = true;
    document.body.appendChild(noSleepVideo);
    noSleepVideo.play().catch(() => {});
  }

  function releaseWakeLock() {
    if (wakeLock) { try { wakeLock.release(); } catch {} wakeLock = null; }
    if (noSleepVideo) { noSleepVideo.pause(); noSleepVideo.remove(); noSleepVideo = null; }
  }

  // ── Audio ──────────────────────────────────────────────────────
  let audioCtx = null;
  let binNodes = null;
  let ambNodes = null;
  let binMuted = false;

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
    if (!freqKey || freqKey === 'none') return;
    const ac = ctx();
    const { carrier, beat } = BINAURAL_DEF[freqKey];

    const gainNode = ac.createGain();
    gainNode.gain.setValueAtTime(0, ac.currentTime);
    gainNode.gain.linearRampToValueAtTime(binMuted ? 0 : 0.08, ac.currentTime + 1.8);
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
    updateBinBtn();
  }

  function stopBinaural() {
    if (!binNodes) return;
    try {
      const ac = ctx();
      binNodes.gainNode.gain.linearRampToValueAtTime(0, ac.currentTime + 0.6);
      const snap = binNodes;
      setTimeout(() => { try { snap.oscL.stop(); snap.oscR.stop(); } catch {} }, 700);
    } catch {}
    binNodes = null;
  }

  function fadeOutBinaural(secs) {
    if (!binNodes) return;
    try {
      const ac = ctx();
      const now = ac.currentTime;
      binNodes.gainNode.gain.cancelScheduledValues(now);
      binNodes.gainNode.gain.setValueAtTime(binNodes.gainNode.gain.value, now);
      binNodes.gainNode.gain.linearRampToValueAtTime(0, now + secs);
      const snap = binNodes;
      binNodes = null;
      setTimeout(() => { try { snap.oscL.stop(); snap.oscR.stop(); } catch {} }, (secs + 0.3) * 1000);
    } catch {
      binNodes = null;
    }
  }

  function toggleBinMute() {
    if (!binNodes) return;
    binMuted = !binMuted;
    const ac = ctx();
    binNodes.gainNode.gain.linearRampToValueAtTime(
      binMuted ? 0 : 0.08, ac.currentTime + 0.3
    );
    updateBinBtn();
  }

  function updateBinBtn() {
    const btn = document.getElementById('ritual-bin-btn');
    const lbl = document.getElementById('ritual-bin-label');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(binMuted));
    btn.classList.toggle('ritual-bin-btn--muted', binMuted);
    if (lbl) lbl.textContent = binMuted ? 'Muet' : (FREQ_LABELS[cfgFreq] || '');
  }

  // ── Ambiance ──────────────────────────────────────────────────
  function startAmbiance(type) {
    stopAmbiance();
    if (type === 'silence') return;

    const ac = ctx();
    const masterGain = ac.createGain();
    masterGain.gain.setValueAtTime(0, ac.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.15, ac.currentTime + 2.5);
    masterGain.connect(ac.destination);
    const sources = [];

    if (type === 'pluie') {
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
      [220, 275, 330, 440, 660].forEach((freq, i) => {
        const osc = ac.createOscillator();
        osc.type = 'sine'; osc.frequency.value = freq;
        const g = ac.createGain(); g.gain.value = 0.055 / (i + 1);
        const lfo = ac.createOscillator(); lfo.frequency.value = 0.25 + i * 0.07;
        const lfoG = ac.createGain(); lfoG.gain.value = g.gain.value * 0.35;
        lfo.connect(lfoG).connect(g.gain);
        osc.connect(g).connect(masterGain);
        osc.start(); lfo.start();
        sources.push(osc, lfo);
      });

    } else if (type === 'drone') {
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
    try { localStorage.setItem('matrice_casque_shown', '1'); } catch {}
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

    const center = document.createElementNS(NS, 'circle');
    center.setAttribute('cx', GDV_CX);
    center.setAttribute('cy', GDV_CY);
    center.setAttribute('r',  GDV_R);
    center.dataset.idx = '0';
    g.appendChild(center);
    seedCircles.push(center);

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

    // ── Firefly particles dorées (6-8 particules flottantes) ──────
    const gFireflies = document.createElementNS(NS, 'g');
    gFireflies.setAttribute('class', 'gdv-fireflies');
    for (let i = 0; i < 7; i++) {
      const ff = document.createElementNS(NS, 'circle');
      ff.setAttribute('r', (1 + Math.random() * 1.5).toFixed(1));
      ff.setAttribute('fill', 'var(--gold)');
      ff.setAttribute('opacity', '0');
      ff.setAttribute('class', 'gdv-firefly');
      ff.dataset.phase = String(Math.random() * Math.PI * 2);
      ff.dataset.rx = String(30 + Math.random() * 50);
      ff.dataset.ry = String(30 + Math.random() * 50);
      ff.dataset.speed = String(0.0005 + Math.random() * 0.001);
      gFireflies.appendChild(ff);
    }
    svg.appendChild(gFireflies);
  }

  // ── Animation fireflies — appelée depuis updateSeed ────────────
  function updateFireflies(ts) {
    const svg = document.getElementById('m1-seed-svg');
    if (!svg) return;
    const fireflies = svg.querySelectorAll('.gdv-firefly');
    fireflies.forEach(ff => {
      const phase = parseFloat(ff.dataset.phase);
      const rx    = parseFloat(ff.dataset.rx);
      const ry    = parseFloat(ff.dataset.ry);
      const speed = parseFloat(ff.dataset.speed);
      const t     = ts * speed + phase;
      const x = GDV_CX + rx * Math.sin(t) * Math.cos(t * 0.7);
      const y = GDV_CY + ry * Math.cos(t) * Math.sin(t * 0.5);
      const op = 0.15 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.3));
      ff.setAttribute('cx', x.toFixed(1));
      ff.setAttribute('cy', y.toFixed(1));
      ff.setAttribute('opacity', op.toFixed(2));
    });
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

    // Opacité globale : 0.6 au repos → 1.0 sur inspire
    const globalOp = phaseId === 'inspire'
      ? (0.6 + 0.4 * breathAmt)
      : phaseId === 'hold-in'
        ? (0.85 + 0.15 * Math.sin(ts / 1500))
        : (0.6 + 0.2 * (1 - breathAmt));

    seedCircles.forEach((c, i) => {
      if (i === 0) {
        const micro = Math.sin(ts / 900) * 1.5 * breathAmt;
        c.setAttribute('r', (r + micro).toFixed(3));
        c.setAttribute('opacity', Math.min(1, globalOp + 0.1).toFixed(2));
      } else {
        const angle = parseFloat(c.dataset.angle);
        const ripple = Math.sin(ts / 1400 + i * 1.047) * 2.4 * breathAmt;
        c.setAttribute('cx', (GDV_CX + (d + ripple) * Math.cos(angle)).toFixed(3));
        c.setAttribute('cy', (GDV_CY + (d + ripple) * Math.sin(angle)).toFixed(3));
        c.setAttribute('r', (r + ripple * 0.3).toFixed(3));
        const wave = Math.sin(ts / (1800 + i * 300) + i * 0.8) * 0.15;
        c.setAttribute('opacity', Math.min(1, globalOp + wave).toFixed(2));
      }
    });

    // Stroke-width : centre 2px, extérieurs 1.2px
    seedCircles.forEach((c, i) => {
      const baseSw = i === 0 ? 2 : 1.2;
      const breathSw = baseSw + breathAmt * 0.5;
      c.setAttribute('stroke-width', breathSw.toFixed(2));
    });

    // Trace résiduelle sur expire — léger afterglow
    if (phaseId === 'expire') {
      seedCircles.forEach(c => {
        c.setAttribute('filter', 'url(#seed-glow-f)');
      });
    }

    const svg = document.getElementById('m1-seed-svg');
    if (svg) svg.style.setProperty('--gdv-stroke', col.stroke);

    const blurEl = document.getElementById('seed-blur-el');
    if (blurEl) blurEl.setAttribute('stdDeviation', (col.blur * breathAmt + 1.5).toFixed(1));

    updateFireflies(ts);

    const halo = document.getElementById('m1-halo');
    if (halo) {
      const haloOp = (0.15 + 0.35 * breathAmt).toFixed(2);
      const haloCol = col.stroke;
      halo.style.background =
        `radial-gradient(ellipse at center, ${haloCol.replace(')', `, ${haloOp})`).replace('rgb', 'rgba').replace('#', '')} 0%, transparent 68%)`;
      // Simplified: use col.halo which already has alpha
      halo.style.background =
        `radial-gradient(ellipse at center, ${col.halo} 0%, transparent 65%)`;
      halo.style.opacity = (0.4 + 0.6 * breathAmt).toFixed(2);
    }

    document.documentElement.style.setProperty('--breath-text', col.text);
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

    const phases       = PATTERNS[pattern];
    const phase        = phases[phaseIdx];
    const phaseElapsed = (ts - phaseStart) / 1000;
    const progress     = Math.min(phaseElapsed / phase.secs, 1);

    const countdown = Math.max(1, Math.ceil(phase.secs - phaseElapsed));
    const cEl = document.getElementById('m1-phase-count');
    if (cEl && cEl.textContent !== String(countdown)) cEl.textContent = countdown;

    let breathAmt;
    switch (phase.id) {
      case 'inspire':  breathAmt = easeInOutCubic(progress);     break;
      case 'hold-in':  breathAmt = 1;                            break;
      case 'expire':   breathAmt = easeInOutCubic(1 - progress); break;
      case 'hold-out': breathAmt = 0;                            break;
      default:         breathAmt = 0;
    }

    updateSeed(breathAmt, phase.id, ts);

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
      setTimeout(() => { lEl.textContent = phase.label.toUpperCase(); lEl.style.opacity = '1'; }, 120);
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
    exitFullscreen();
    navigateTo('m2');
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

  // ── Config timer display ───────────────────────────────────────
  function updateCfgTimerDisplay() {
    const el = document.getElementById('m1-cfg-timer');
    if (!el) return;
    const m = Math.floor(cfgSecs / 60);
    const s = cfgSecs % 60;
    el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }

  // ── Démarrer la session (depuis config) ───────────────────────
  function startSession() {
    if (running) return;
    pattern      = cfgPattern;
    totalSecs    = cfgSecs;
    running      = true;
    phaseIdx     = 0;
    phaseStart   = 0;
    sessionStart = 0;
    binMuted     = false;

    buildSeedOfLife();
    updateTimerDisplay(totalSecs);
    setPhaseLabel(PATTERNS[pattern][0]);

    // Lancer audio
    if (cfgFreq && cfgFreq !== 'none') startBinaural(cfgFreq);
    startAmbiance(cfgAmb);

    // Naviguer vers l'écran session
    navigateTo('rituel-session');

    // Plein écran + Wake Lock (après transition)
    setTimeout(() => {
      enterFullscreen();
      requestWakeLock();
      showConsigne();
      if (cfgFreq !== 'none') showToastCasque();
    }, 250);

    animFrameId = requestAnimationFrame(loop);
  }

  // ── Stop session (leave hook) ──────────────────────────────────
  function stopSession() {
    running = false;
    cancelAnimationFrame(animFrameId);
    stopAmbiance();
    exitFullscreen();
    // Binaural ne s'arrête PAS ici — persiste jusqu'à la clôture
    // Wake Lock relâché seulement à la clôture du rituel complet
    resetSeedCircles();
  }

  function resetSeedCircles() {
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

  // ── Événements config ─────────────────────────────────────────
  function bindConfigEvents() {
    // Patterns
    document.querySelectorAll('.m1-pattern-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cfgPattern = btn.dataset.pattern;
        document.querySelectorAll('.m1-pattern-btn').forEach(b => {
          b.classList.toggle('m1-pattern-btn--active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    // Binauraux
    document.querySelectorAll('.m1-freq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cfgFreq = btn.dataset.freq;
        document.querySelectorAll('.m1-freq-btn').forEach(b => {
          b.classList.toggle('m1-freq-btn--active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    // Ambiance
    document.querySelectorAll('.m1-amb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cfgAmb = btn.dataset.amb;
        document.querySelectorAll('.m1-amb-btn').forEach(b => {
          b.classList.toggle('m1-amb-btn--active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });
      });
    });

    // Config timer
    document.getElementById('m1-cfg-minus')?.addEventListener('click', () => {
      cfgSecs = Math.max(60, cfgSecs - 30);
      updateCfgTimerDisplay();
    });
    document.getElementById('m1-cfg-plus')?.addEventListener('click', () => {
      cfgSecs = Math.min(900, cfgSecs + 30);
      updateCfgTimerDisplay();
    });

    // Commencer
    document.getElementById('m1-start-btn')?.addEventListener('click', startSession);
  }

  // ── Événements session ─────────────────────────────────────────
  function bindSessionEvents() {
    // Timer en session
    document.getElementById('m1-timer-minus')?.addEventListener('click', () => {
      const elapsed = sessionStart ? (performance.now() - sessionStart) / 1000 : 0;
      totalSecs = Math.max(30, totalSecs - 30);
      if (totalSecs < elapsed + 10) totalSecs = elapsed + 30;
      updateTimerDisplay(Math.max(0, totalSecs - elapsed));
    });
    document.getElementById('m1-timer-plus')?.addEventListener('click', () => {
      totalSecs = Math.min(900, totalSecs + 30);
      const elapsed = sessionStart ? (performance.now() - sessionStart) / 1000 : 0;
      updateTimerDisplay(totalSecs - elapsed);
    });

    // Bouton binaural flottant
    document.getElementById('ritual-bin-btn')?.addEventListener('click', toggleBinMute);
  }

  // ── Init config screen ─────────────────────────────────────────
  function initConfig() {
    updateCfgTimerDisplay();
    updateBinBtn();
    // Reset sélection visuelle
    document.querySelectorAll('.m1-freq-btn').forEach(b => {
      const active = b.dataset.freq === cfgFreq;
      b.classList.toggle('m1-freq-btn--active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('.m1-pattern-btn').forEach(b => {
      const active = b.dataset.pattern === cfgPattern;
      b.classList.toggle('m1-pattern-btn--active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('.m1-amb-btn').forEach(b => {
      const active = b.dataset.amb === cfgAmb;
      b.classList.toggle('m1-amb-btn--active', active);
      b.setAttribute('aria-pressed', String(active));
    });
  }

  // Enregistrement des hooks de cycle de vie
  screenHooks.rituel = { onEnter: initConfig, onLeave: () => {} };
  screenHooks['rituel-session'] = { onEnter: () => {}, onLeave: stopSession };

  // Wake Lock relâché quand on quitte le rituel (détecté dans navigateTo)

  // Liaison des événements au chargement du DOM
  document.addEventListener('DOMContentLoaded', () => {
    bindConfigEvents();
    bindSessionEvents();
  });

  return { startBinaural, stopBinaural, fadeOutBinaural, toggleBinMute, releaseWakeLock };

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
