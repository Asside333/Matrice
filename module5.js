'use strict';

/* ================================================================
   MATRICE — Module 5 : Sort du jour
   Élément, Solide de Platon SVG, Sort avec geste, Phase lunaire
   ================================================================ */

const Module5 = (() => {

  // ── État ──────────────────────────────────────────────────────
  let currentElement = null;
  let currentSort    = null;
  let sortRevealTimeout = null;

  // ── SVGs des Solides de Platon (filaires) ─────────────────────
  const SOLID_SVGS = {
    feu: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="m5-solid-svg">
      <!-- Tétraèdre / Feu -->
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="100,28 172,152 28,152" stroke-width="1.2" opacity="0.7"/>
        <line x1="100" y1="28" x2="100" y2="152" stroke-width="0.7" opacity="0.4"/>
        <line x1="172" y1="152" x2="100" y2="105" stroke-width="0.7" opacity="0.4"/>
        <line x1="28" y1="152" x2="100" y2="105" stroke-width="0.7" opacity="0.4"/>
        <circle cx="100" cy="105" r="2.5" fill="currentColor" opacity="0.5"/>
        <circle cx="100" cy="28" r="2" fill="currentColor" opacity="0.6"/>
        <circle cx="172" cy="152" r="2" fill="currentColor" opacity="0.6"/>
        <circle cx="28" cy="152" r="2" fill="currentColor" opacity="0.6"/>
      </g>
    </svg>`,

    terre: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="m5-solid-svg">
      <!-- Cube / Terre -->
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Face avant -->
        <rect x="55" y="75" width="80" height="80" stroke-width="1.2" opacity="0.7"/>
        <!-- Face arrière projetée -->
        <rect x="72" y="55" width="80" height="80" stroke-width="0.6" opacity="0.35"/>
        <!-- Arêtes de liaison -->
        <line x1="55" y1="75" x2="72" y2="55" stroke-width="0.7" opacity="0.5"/>
        <line x1="135" y1="75" x2="152" y2="55" stroke-width="0.7" opacity="0.5"/>
        <line x1="135" y1="155" x2="152" y2="135" stroke-width="0.7" opacity="0.5"/>
        <line x1="55" y1="155" x2="72" y2="135" stroke-width="0.7" opacity="0.5"/>
      </g>
    </svg>`,

    air: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="m5-solid-svg">
      <!-- Octaèdre / Air -->
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Équateur -->
        <polygon points="100,80 152,124 100,168 48,124" stroke-width="1.2" opacity="0.7"/>
        <!-- Sommet et nadir -->
        <line x1="100" y1="38" x2="152" y2="124" stroke-width="0.9" opacity="0.6"/>
        <line x1="100" y1="38" x2="100" y2="80" stroke-width="0.9" opacity="0.6"/>
        <line x1="100" y1="38" x2="48" y2="124" stroke-width="0.9" opacity="0.6"/>
        <line x1="100" y1="172" x2="152" y2="124" stroke-width="0.7" opacity="0.4"/>
        <line x1="100" y1="172" x2="100" y2="168" stroke-width="0.7" opacity="0.4"/>
        <line x1="100" y1="172" x2="48" y2="124" stroke-width="0.7" opacity="0.4"/>
        <!-- Arête centrale cachée -->
        <line x1="100" y1="80" x2="100" y2="168" stroke-width="0.5" opacity="0.2" stroke-dasharray="4,3"/>
        <circle cx="100" cy="38" r="2.5" fill="currentColor" opacity="0.6"/>
      </g>
    </svg>`,

    eau: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="m5-solid-svg">
      <!-- Icosaèdre simplifié / Eau -->
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Bande équatoriale -->
        <polygon points="100,42 148,72 134,118 66,118 52,72" stroke-width="1.2" opacity="0.65"/>
        <!-- Triangle du bas -->
        <polygon points="66,118 134,118 100,158" stroke-width="1.0" opacity="0.6"/>
        <!-- Sommet -->
        <line x1="100" y1="42" x2="100" y2="158" stroke-width="0.5" opacity="0.2" stroke-dasharray="4,3"/>
        <line x1="148" y1="72" x2="134" y2="118" stroke-width="0.8" opacity="0.5"/>
        <line x1="52" y1="72" x2="66" y2="118" stroke-width="0.8" opacity="0.5"/>
        <line x1="100" y1="42" x2="66" y2="118" stroke-width="0.7" opacity="0.4"/>
        <line x1="100" y1="42" x2="134" y2="118" stroke-width="0.7" opacity="0.4"/>
        <line x1="52" y1="72" x2="100" y2="158" stroke-width="0.6" opacity="0.35"/>
        <line x1="148" y1="72" x2="100" y2="158" stroke-width="0.6" opacity="0.35"/>
        <circle cx="100" cy="42" r="2" fill="currentColor" opacity="0.6"/>
        <circle cx="100" cy="158" r="2" fill="currentColor" opacity="0.6"/>
      </g>
    </svg>`,

    ether: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="m5-solid-svg">
      <!-- Dodécaèdre projeté / Éther -->
      <g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <!-- Pentagone central -->
        <polygon points="100,52 132,76 120,114 80,114 68,76" stroke-width="1.2" opacity="0.7"/>
        <!-- Pentagone externe (projeté) -->
        <polygon points="100,28 152,62 136,128 64,128 48,62" stroke-width="0.7" opacity="0.4"/>
        <!-- Connexions -->
        <line x1="100" y1="28" x2="100" y2="52" stroke-width="0.6" opacity="0.4"/>
        <line x1="152" y1="62" x2="132" y2="76" stroke-width="0.6" opacity="0.4"/>
        <line x1="136" y1="128" x2="120" y2="114" stroke-width="0.6" opacity="0.4"/>
        <line x1="64" y1="128" x2="80" y2="114" stroke-width="0.6" opacity="0.4"/>
        <line x1="48" y1="62" x2="68" y2="76" stroke-width="0.6" opacity="0.4"/>
        <!-- Face du bas -->
        <polygon points="80,148 120,148 136,128 100,140 64,128" stroke-width="0.6" opacity="0.3"/>
        <line x1="80" y1="148" x2="80" y2="114" stroke-width="0.5" opacity="0.3"/>
        <line x1="120" y1="148" x2="120" y2="114" stroke-width="0.5" opacity="0.3"/>
        <circle cx="100" cy="52" r="1.5" fill="currentColor" opacity="0.5"/>
      </g>
    </svg>`,
  };

  // ── Affichage élément ─────────────────────────────────────────
  function displayElement(elementKey) {
    currentElement = elementKey;
    const el = ELEMENTS[elementKey];
    if (!el) return;

    // Mise à jour du badge élément
    const badge = document.getElementById('m5-element-badge');
    if (badge) {
      badge.textContent = `${el.emoji} ${el.nom}`;
      badge.style.setProperty('--el-color', el.couleur);
    }

    // Solide de Platon
    const solidWrap = document.getElementById('m5-solid-wrap');
    if (solidWrap) solidWrap.innerHTML = SOLID_SVGS[elementKey] || '';

    // Coloration
    document.getElementById('screen-m5')?.style.setProperty('--m5-color', el.couleur);
    document.getElementById('screen-m5')?.style.setProperty('--m5-color2', el.secondaire);

    // Boutons d'élément : actif
    document.querySelectorAll('.m5-el-btn').forEach(btn => {
      btn.classList.toggle('m5-el-btn--active', btn.dataset.element === elementKey);
    });

    // Sauvegarder dans RITUAL_STATE
    if (typeof RITUAL_STATE !== 'undefined') {
      RITUAL_STATE.element    = el.nom;
      RITUAL_STATE.elementKey = elementKey;
    }

    // Tirer le sort
    revealSort();
  }

  // ── Révéler un sort ──────────────────────────────────────────
  function revealSort() {
    const sort = pickSort(currentElement, currentSort?.texte);
    currentSort = sort;
    if (typeof RITUAL_STATE !== 'undefined') RITUAL_STATE.sort = sort.texte;

    const titreEl  = document.getElementById('m5-sort-titre');
    const texteEl  = document.getElementById('m5-sort-texte');
    const gesteEl  = document.getElementById('m5-sort-geste');
    const sortBox  = document.getElementById('m5-sort-box');

    if (!titreEl) return;

    if (sortBox) {
      sortBox.style.opacity = '0';
      sortBox.style.transform = 'translateY(12px)';
    }

    clearTimeout(sortRevealTimeout);
    sortRevealTimeout = setTimeout(() => {
      if (titreEl) titreEl.textContent = sort.titre;
      if (texteEl) texteEl.textContent = sort.texte;
      if (gesteEl) gesteEl.textContent = `✦ ${sort.geste}`;
      if (sortBox) {
        sortBox.style.transition = 'opacity 0.55s, transform 0.55s';
        sortBox.style.opacity    = '1';
        sortBox.style.transform  = 'translateY(0)';
      }
    }, 80);
  }

  // ── Phase lunaire ─────────────────────────────────────────────
  function displayMoonPhase() {
    const { emoji, nom } = getPhaseLunaire();
    const el = document.getElementById('m5-moon');
    if (el) el.textContent = `${emoji} ${nom}`;
  }

  // ── Liaison des événements ─────────────────────────────────────
  function bindEvents() {
    // Boutons d'élément
    document.querySelectorAll('.m5-el-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        displayElement(btn.dataset.element);
      });
    });

    // Autre sort (même élément)
    document.getElementById('m5-reshuffle-btn')
      ?.addEventListener('click', () => {
        const btn = document.getElementById('m5-reshuffle-btn');
        if (btn) {
          btn.style.opacity = '0.4';
          setTimeout(() => { btn.style.opacity = ''; }, 600);
        }
        revealSort();
      });

    // Module suivant
    document.getElementById('m5-next-btn')
      ?.addEventListener('click', () => navigateTo('m6'));
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    displayMoonPhase();
    const todayKey = getTodayElement();
    displayElement(todayKey);
    document.getElementById('m5-footer')?.classList.remove('m5-footer--hidden');
  }

  function onLeave() {
    clearTimeout(sortRevealTimeout);
  }

  bindEvents();
  screenHooks.m5 = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
