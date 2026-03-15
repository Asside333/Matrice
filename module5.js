'use strict';

/* ================================================================
   MATRICE — Module 5 : Sort du jour
   Solides de Platon 3D animés (canvas), icônes SVG élégantes,
   sort avec geste physique, phase lunaire
   ================================================================ */

const Module5 = (() => {

  // ════════════════════════════════════════════════════════════════
  // SOLIDES DE PLATON — Géométrie 3D & Rendu Canvas
  // ════════════════════════════════════════════════════════════════

  const PHI = (1 + Math.sqrt(5)) / 2; // Nombre d'or

  // ── Normalise les sommets sur la sphère unitaire ───────────────
  function normVerts(verts) {
    const maxR = Math.max(...verts.map(v =>
      Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
    ));
    return verts.map(v => [v[0] / maxR, v[1] / maxR, v[2] / maxR]);
  }

  // ── Détecte les arêtes par distance minimale ───────────────────
  function edgesByMinDist(verts) {
    let minD2 = Infinity;
    for (let i = 0; i < verts.length; i++) {
      for (let j = i + 1; j < verts.length; j++) {
        const dx = verts[i][0] - verts[j][0];
        const dy = verts[i][1] - verts[j][1];
        const dz = verts[i][2] - verts[j][2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < minD2) minD2 = d2;
      }
    }
    const edges = [];
    const thresh = minD2 * 1.18; // tolérance 18%
    for (let i = 0; i < verts.length; i++) {
      for (let j = i + 1; j < verts.length; j++) {
        const dx = verts[i][0] - verts[j][0];
        const dy = verts[i][1] - verts[j][1];
        const dz = verts[i][2] - verts[j][2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 <= thresh) edges.push([i, j]);
      }
    }
    return edges;
  }

  // ── Sommets bruts des 5 solides ────────────────────────────────
  const SOLID_VERTS_RAW = {
    // Tétraèdre — 4 sommets, 6 arêtes
    feu: [
      [ 1,  1,  1], [ 1, -1, -1],
      [-1,  1, -1], [-1, -1,  1],
    ],

    // Cube (hexaèdre) — 8 sommets, 12 arêtes
    terre: [
      [-1, -1, -1], [-1, -1,  1], [-1,  1, -1], [-1,  1,  1],
      [ 1, -1, -1], [ 1, -1,  1], [ 1,  1, -1], [ 1,  1,  1],
    ],

    // Octaèdre — 6 sommets, 12 arêtes
    air: [
      [ 1,  0,  0], [-1,  0,  0],
      [ 0,  1,  0], [ 0, -1,  0],
      [ 0,  0,  1], [ 0,  0, -1],
    ],

    // Icosaèdre — 12 sommets, 30 arêtes
    eau: [
      [ 0,  1,  PHI], [ 0,  1, -PHI],
      [ 0, -1,  PHI], [ 0, -1, -PHI],
      [ 1,  PHI,  0], [ 1, -PHI,  0],
      [-1,  PHI,  0], [-1, -PHI,  0],
      [ PHI,  0,  1], [ PHI,  0, -1],
      [-PHI,  0,  1], [-PHI,  0, -1],
    ],

    // Dodécaèdre — 20 sommets, 30 arêtes
    ether: [
      // Cube intérieur (8)
      [ 1,  1,  1], [ 1,  1, -1], [ 1, -1,  1], [ 1, -1, -1],
      [-1,  1,  1], [-1,  1, -1], [-1, -1,  1], [-1, -1, -1],
      // Rectangles sur les faces (12)
      [ 0,  PHI,  1/PHI], [ 0,  PHI, -1/PHI],
      [ 0, -PHI,  1/PHI], [ 0, -PHI, -1/PHI],
      [ 1/PHI,  0,  PHI], [-1/PHI,  0,  PHI],
      [ 1/PHI,  0, -PHI], [-1/PHI,  0, -PHI],
      [ PHI,  1/PHI,  0], [ PHI, -1/PHI,  0],
      [-PHI,  1/PHI,  0], [-PHI, -1/PHI,  0],
    ],
  };

  // ── Pré-calcul normalisé + arêtes ─────────────────────────────
  const SOLID_DATA = {};
  for (const key of Object.keys(SOLID_VERTS_RAW)) {
    const verts = normVerts(SOLID_VERTS_RAW[key]);
    const edges = edgesByMinDist(verts);
    SOLID_DATA[key] = { verts, edges };
  }

  // ── Animation State ────────────────────────────────────────────
  let solidCanvas   = null;
  let solidCtx      = null;
  let solidRafId    = null;
  let solidKey      = null;
  let angleX        = 0.3;
  let angleY        = 0;
  let lastTs        = 0;

  // ── Initialise le canvas ───────────────────────────────────────
  function initSolidCanvas() {
    const wrap = document.getElementById('m5-solid-wrap');
    if (!wrap) return;

    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const size = 160;

    solidCanvas = document.createElement('canvas');
    solidCanvas.width  = size * dpr;
    solidCanvas.height = size * dpr;
    solidCanvas.style.width  = size + 'px';
    solidCanvas.style.height = size + 'px';
    solidCanvas.className = 'm5-solid-canvas';

    wrap.innerHTML = '';
    wrap.appendChild(solidCanvas);

    solidCtx = solidCanvas.getContext('2d');
    solidCtx.scale(dpr, dpr);
  }

  // ── Rotation 3D (axes X et Y) ─────────────────────────────────
  function rotatePt(v, ax, ay) {
    const [x, y, z] = v;
    // Rotation Y
    const x1 =  x * Math.cos(ay) + z * Math.sin(ay);
    const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
    // Rotation X
    const y2 = y * Math.cos(ax) - z1 * Math.sin(ax);
    const z2 = y * Math.sin(ax) + z1 * Math.cos(ax);
    return [x1, y2, z2];
  }

  // ── Projection perspective ─────────────────────────────────────
  function projectPt(v, size) {
    const fov  = 2.6;
    const z    = v[2] + fov;
    const s    = (fov / z) * (size * 0.40);
    return [v[0] * s + size / 2, v[1] * s + size / 2, v[2]];
  }

  // ── Boucle d'animation ─────────────────────────────────────────
  function drawFrame(ts) {
    if (!solidCtx || !solidKey) return;

    const dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;

    // Rotation lente sur deux axes
    angleY += 0.35 * dt;
    angleX  = 0.28 + Math.sin(ts * 0.00018) * 0.22;

    const { verts, edges } = SOLID_DATA[solidKey];
    const el   = ELEMENTS[solidKey];
    const size = 160;

    solidCtx.clearRect(0, 0, size, size);

    // Rotation + projection
    const rotated   = verts.map(v => rotatePt(v, angleX, angleY));
    const projected = rotated.map(v => projectPt(v, size));

    // Trier les arêtes par profondeur (back-to-front)
    const sortedEdges = [...edges].sort((a, b) => {
      const zA = (projected[a[0]][2] + projected[a[1]][2]) / 2;
      const zB = (projected[b[0]][2] + projected[b[1]][2]) / 2;
      return zA - zB;
    });

    solidCtx.lineCap = 'round';

    for (const [i, j] of sortedEdges) {
      const [ax, ay, az] = projected[i];
      const [bx, by, bz] = projected[j];
      const midZ  = (az + bz) / 2;              // −1..+1
      const depth = (midZ + 1) / 2;             //  0..1 (0=arrière)
      const alpha = 0.15 + 0.70 * depth;
      const lw    = 0.5  + 1.0  * depth;

      solidCtx.globalAlpha = alpha;
      solidCtx.lineWidth   = lw;
      solidCtx.strokeStyle = el.couleur;

      solidCtx.beginPath();
      solidCtx.moveTo(ax, ay);
      solidCtx.lineTo(bx, by);
      solidCtx.stroke();
    }

    solidCtx.globalAlpha = 1;
    solidRafId = requestAnimationFrame(drawFrame);
  }

  function startSolidAnim(key) {
    if (solidRafId) cancelAnimationFrame(solidRafId);
    solidKey = key;
    angleY = 0;
    lastTs = 0;
    solidRafId = requestAnimationFrame(drawFrame);
  }

  function stopSolidAnim() {
    if (solidRafId) {
      cancelAnimationFrame(solidRafId);
      solidRafId = null;
    }
    solidKey = null;
  }

  // ════════════════════════════════════════════════════════════════
  // ICÔNES SVG DES ÉLÉMENTS
  // ════════════════════════════════════════════════════════════════

  const ELEMENT_ICONS = {
    feu: `<svg class="m5-badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3C10 7 7 10 7 14.5C7 18 9.2 21 12 21C14.8 21 17 18 17 14.5C17 10 14 7 12 3Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9.5 16.5C9.5 18 10.6 19 12 19" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity="0.6"/>
    </svg>`,

    terre: `<svg class="m5-badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 19L9 8L13 14L17 9L21 19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="3" y1="19" x2="21" y2="19" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,

    air: `<svg class="m5-badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9Q9 6.5 15 9Q19 10.5 21 9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M3 13Q9 10.5 15 13Q19 14.5 21 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M3 17Q8 14.5 13 17Q16 18.5 18 17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,

    eau: `<svg class="m5-badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3C12 3 5 11 5 15.5C5 19.1 8.1 22 12 22C15.9 22 19 19.1 19 15.5C19 11 12 3 12 3Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 16.5C9 18 10.3 19 12 19" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity="0.55"/>
    </svg>`,

    ether: `<svg class="m5-badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,3 15.5,9.5 22.5,9.5 16.8,14.2 19.1,21 12,17 4.9,21 7.2,14.2 1.5,9.5 8.5,9.5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    </svg>`,
  };

  // ════════════════════════════════════════════════════════════════
  // ÉTAT & LOGIQUE DU MODULE
  // ════════════════════════════════════════════════════════════════

  let currentElement    = null;
  let currentSort       = null;
  let sortRevealTimeout = null;

  // ── Affichage de l'élément ────────────────────────────────────
  function displayElement(elementKey) {
    currentElement = elementKey;
    const el = ELEMENTS[elementKey];
    if (!el) return;

    // Badge avec icône SVG
    const badge = document.getElementById('m5-element-badge');
    if (badge) {
      badge.innerHTML = `${ELEMENT_ICONS[elementKey] || ''}<span>${el.nom}</span>`;
      badge.style.color = el.couleur;
    }

    // Couleur CSS pour l'écran
    const screen = document.getElementById('screen-m5');
    if (screen) {
      screen.style.setProperty('--m5-color',  el.couleur);
      screen.style.setProperty('--m5-color2', el.secondaire);
    }

    // Boutons actif/inactif
    document.querySelectorAll('.m5-el-btn').forEach(btn => {
      const isActive = btn.dataset.element === elementKey;
      btn.classList.toggle('m5-el-btn--active', isActive);
      btn.style.color = isActive ? el.couleur : '';
    });

    // Sauvegarde RITUAL_STATE
    if (typeof RITUAL_STATE !== 'undefined') {
      RITUAL_STATE.element    = el.nom;
      RITUAL_STATE.elementKey = elementKey;
    }

    // Lance l'animation 3D du nouveau solide
    startSolidAnim(elementKey);

    // Tire le sort
    revealSort();
  }

  // ── Révéler un sort ───────────────────────────────────────────
  function revealSort() {
    const sort = pickSort(currentElement, currentSort ? currentSort.texte : null);
    currentSort = sort;
    if (typeof RITUAL_STATE !== 'undefined') RITUAL_STATE.sort = sort.texte;

    const titreEl = document.getElementById('m5-sort-titre');
    const texteEl = document.getElementById('m5-sort-texte');
    const gesteEl = document.getElementById('m5-sort-geste');
    const sortBox = document.getElementById('m5-sort-box');

    if (!titreEl) return;

    // Fade out
    if (sortBox) {
      sortBox.style.transition = 'opacity 0.3s, transform 0.3s';
      sortBox.style.opacity    = '0';
      sortBox.style.transform  = 'translateY(8px)';
    }

    clearTimeout(sortRevealTimeout);
    sortRevealTimeout = setTimeout(() => {
      if (titreEl) titreEl.textContent = sort.titre;
      if (texteEl) texteEl.textContent = sort.texte;
      if (gesteEl) gesteEl.textContent = `✦ ${sort.geste}`;
      if (sortBox) {
        sortBox.style.transition = 'opacity 0.5s, transform 0.5s';
        sortBox.style.opacity    = '1';
        sortBox.style.transform  = 'translateY(0)';
      }
    }, 200);
  }

  // ── Phase lunaire ─────────────────────────────────────────────
  function displayMoonPhase() {
    const { emoji, nom } = getPhaseLunaire();
    const el = document.getElementById('m5-moon');
    if (el) el.textContent = `${emoji}  ${nom}`;
  }

  // ── Liaison des événements ────────────────────────────────────
  function bindEvents() {
    document.querySelectorAll('.m5-el-btn').forEach(btn => {
      btn.addEventListener('click', () => displayElement(btn.dataset.element));
    });

    document.getElementById('m5-reshuffle-btn')
      ?.addEventListener('click', () => {
        const btn = document.getElementById('m5-reshuffle-btn');
        if (btn) { btn.style.opacity = '0.35'; setTimeout(() => { btn.style.opacity = ''; }, 500); }
        revealSort();
      });

    document.getElementById('m5-next-btn')
      ?.addEventListener('click', () => navigateTo('m6'));
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    if (!solidCanvas) initSolidCanvas();
    displayMoonPhase();
    displayElement(getTodayElement());
  }

  function onLeave() {
    stopSolidAnim();
    clearTimeout(sortRevealTimeout);
  }

  bindEvents();
  screenHooks.m5 = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
