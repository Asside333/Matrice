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
    metaTheme.setAttribute('content', isLight ? '#9A6E0A' : '#B8860B');
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
  // SOS dans la nav : caché uniquement sur l'écran SOS lui-même
  const navSos = document.getElementById('nav-sos-btn');
  if (navSos) navSos.classList.toggle('hidden', screenId === 'sos');

  // SOS flottant (gauche) : visible uniquement pendant les modules du rituel
  const sos = document.getElementById('btn-sos');
  if (!sos) return;
  const ritualScreens = ['rituel', 'm2', 'm3', 'm4', 'm5', 'm6'];
  sos.classList.toggle('hidden', !ritualScreens.includes(screenId));
}

function updateNavVisibility(screenId) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const hideNav = ['humeur', 'rituel', 'm2', 'm3', 'm4', 'm5', 'm6', 'cloture', 'parametres', 'nuit'].includes(screenId);
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
      setTimeout(() => document.body.classList.remove('easter-33'), 2000);
    }, 800);
  }
  if (streakConsecutif === 333) {
    document.body.classList.add('easter-333');
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
  const { cx, cy, a, tStart, tEnd } = SP_MINI; // viewBox 120×120, affiché 110px
  const n = seasonDays.length;
  // scale ≈ 110/120 = 0.917 → font-size SVG × 0.917 = px rendus

  // ── Tracé de la spirale ──
  const pathPts = SpiralGold.path(cx, cy, a, tStart, tEnd, 280);
  const d = 'M' + pathPts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L');
  const spiralPath = document.createElementNS(NS, 'path');
  spiralPath.setAttribute('d', d);
  spiralPath.setAttribute('stroke', season.colorTrace);
  spiralPath.setAttribute('stroke-width', '1.1');
  spiralPath.setAttribute('fill', 'none');
  spiralPath.setAttribute('opacity', '0.55');
  spiralPath.setAttribute('stroke-linecap', 'round');
  svg.appendChild(spiralPath);

  // ── Points des jours complétés ──
  const todayIdx = seasonDays.indexOf(today);
  seasonDays.forEach((dateStr, i) => {
    if (dateStr > today) return;
    const entry = cal[dateStr];
    if (!entry?.completed) return;
    const [x, y] = SpiralGold.dayPos(cx, cy, a, tStart, tEnd, i, n);
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', x.toFixed(2));
    dot.setAttribute('cy', y.toFixed(2));
    dot.setAttribute('r', i === todayIdx ? '2.8' : '2.0');
    dot.setAttribute('fill', MOOD_COLS[entry.mood] || MOOD_COLS[3]);
    svg.appendChild(dot);
  });

  // ── Streak au centre ──
  // font-size 28 × 0.917 ≈ 25.7px rendu → bien lisible
  const tCount = document.createElementNS(NS, 'text');
  tCount.setAttribute('x', cx); tCount.setAttribute('y', cy + 1);
  tCount.setAttribute('text-anchor', 'middle');
  tCount.setAttribute('dominant-baseline', 'middle');
  tCount.setAttribute('fill', '#B8860B');
  tCount.setAttribute('font-family', "'Cormorant Garamond', Georgia, serif");
  tCount.setAttribute('font-size', '28');
  tCount.setAttribute('font-weight', '300');
  tCount.textContent = streakConsecutif;
  svg.appendChild(tCount);

  // font-size 8 × 0.917 ≈ 7.3px → lisible
  const tLabel = document.createElementNS(NS, 'text');
  tLabel.setAttribute('x', cx); tLabel.setAttribute('y', cy + 15);
  tLabel.setAttribute('text-anchor', 'middle');
  tLabel.setAttribute('fill', 'rgba(184,134,11,0.60)');
  tLabel.setAttribute('font-family', "'DM Sans', sans-serif");
  tLabel.setAttribute('font-size', '8');
  tLabel.setAttribute('letter-spacing', '1.8');
  tLabel.textContent = 'JOURS';
  svg.appendChild(tLabel);

  // ── Texte saison (HTML span en dessous du SVG) ──
  const saison = document.getElementById('accueil-spiral-saison');
  if (saison) saison.textContent = `${season.name} : ${streakSaison}/${n}`;
}

// ════════════════════════════════════════════════════════════════
// PHASE LUNAIRE
// ════════════════════════════════════════════════════════════════

function displayPhaseLunaire() {
  const phase   = MoonSystem.getMoonPhase(new Date());
  const iconSvg = MoonSystem.drawMoonIcon(phase.key, 22);

  const iconEl  = document.getElementById('moon-icon');
  const blockEl = document.getElementById('moon-block');

  if (iconEl)  iconEl.innerHTML = iconSvg;
  if (blockEl) blockEl.setAttribute('title', phase.name);
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
    btn.addEventListener('click', () => {
      // L'onglet Rituel passe par le check-in humeur
      const target = btn.dataset.screen === 'rituel' ? 'humeur' : btn.dataset.screen;
      navigateTo(target);
    });
  });

  // Bouton "Commencer le rituel" → check-in humeur d'abord
  document.getElementById('btn-rituel')
    ?.addEventListener('click', () => navigateTo('humeur'));

  // Toggle thème rapide sur l'accueil (soleil/lune)
  document.getElementById('btn-theme-toggle')
    ?.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('matrice_theme', isLight ? 'dark' : 'light');
      applyTheme();
    });

  // Icône paramètres sur l'accueil
  document.getElementById('btn-settings')
    ?.addEventListener('click', () => navigateTo('parametres'));

  // Bouton Mode Nuit sur l'accueil
  document.getElementById('btn-nuit')
    ?.addEventListener('click', () => navigateTo('nuit'));

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
  screenHooks.accueil = { onEnter: loadStreak };

  // 5. Données persistées
  loadStreak();
  displayPhaseLunaire();

  // 4. Événements
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

  function setDuration(mins) {
    // Ne pas changer si session en cours
    if (running) return;
    totalSecs = Math.max(90, Math.min(900, mins * 60));
    updateTimerDisplay(totalSecs);
  }

  return { start, stop, setDuration };

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
