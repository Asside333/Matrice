'use strict';

/* ================================================================
   MATRICE — app.js
   Instrument de calibration personnelle
   ================================================================ */

// ── Constantes ────────────────────────────────────────────────────
const NS = 'http://www.w3.org/2000/svg';
const STORAGE_STREAK = 'matrice_streak';
const STORAGE_LAST_RITUAL = 'matrice_last_ritual';

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

  // Fade-out de l'écran actuel
  prev?.classList.remove('active');

  // Fade-in du nouvel écran avec léger décalage
  setTimeout(() => {
    next.classList.add('active');
    currentScreen = screenId;
    updateNavState(screenId);
    updateSOSVisibility(screenId);
    updateNavVisibility(screenId);
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
  // La nav reste visible sur tous les écrans en Phase 1 (placeholder)
  // Elle sera masquée dans les phases suivantes pour rituel/SOS actifs
  nav.style.opacity = '1';
  nav.style.pointerEvents = 'auto';
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
