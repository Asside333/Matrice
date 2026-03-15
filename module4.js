'use strict';

/* ================================================================
   MATRICE — Module 4 : Magnétisme & Visualisation
   Chips d'intention, texte libre, visualisation guidée mot-par-mot
   ================================================================ */

const Module4 = (() => {

  // ── État ──────────────────────────────────────────────────────
  let selectedChips  = [];
  let wordTimeouts   = [];
  let lastVizText    = null;

  const CHIP_LABELS = ['Confiance', 'Abondance', 'Connexion', 'Créativité', 'Paix', 'Puissance'];

  // ── Phases ────────────────────────────────────────────────────
  function showChipsPhase() {
    const chips = document.getElementById('m4-chips-phase');
    const viz   = document.getElementById('m4-viz-phase');
    const footer = document.getElementById('m4-footer');
    if (chips) { chips.style.opacity = '1'; chips.style.pointerEvents = 'auto'; chips.style.transform = 'translateY(0)'; }
    if (viz)   { viz.style.opacity   = '0'; viz.style.pointerEvents   = 'none'; }
    if (footer) footer.classList.remove('m4-footer--visible');

    // Reset sélection
    selectedChips = [];
    document.querySelectorAll('.m4-chip').forEach(c => c.classList.remove('m4-chip--active'));
    const ta = document.getElementById('m4-custom-input');
    if (ta) ta.value = '';
  }

  function showVizPhase(vizText) {
    const chips = document.getElementById('m4-chips-phase');
    const viz   = document.getElementById('m4-viz-phase');

    if (chips) {
      chips.style.opacity      = '0';
      chips.style.pointerEvents = 'none';
      chips.style.transform    = 'translateY(-18px)';
    }

    setTimeout(() => {
      if (viz) {
        viz.style.opacity      = '1';
        viz.style.pointerEvents = 'auto';
      }
      renderViz(vizText);
    }, 420);
  }

  // ── Rendu mot-par-mot ─────────────────────────────────────────
  function renderViz(text) {
    const container = document.getElementById('m4-viz-text');
    if (!container) return;

    wordTimeouts.forEach(clearTimeout);
    wordTimeouts = [];
    container.innerHTML = '';
    container.style.opacity = '0';

    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'm4-word';
      span.textContent = w + (i < words.length - 1 ? '\u00A0' : '');
      container.appendChild(span);
    });

    container.style.transition = 'opacity 0.4s';
    setTimeout(() => { container.style.opacity = '1'; }, 50);

    words.forEach((_, i) => {
      const t = setTimeout(() => {
        const spans = container.querySelectorAll('.m4-word');
        if (spans[i]) spans[i].classList.add('m4-word--visible');
        // footer après le dernier mot
        if (i === words.length - 1) {
          setTimeout(() => {
            document.getElementById('m4-footer')?.classList.add('m4-footer--visible');
          }, 800);
        }
      }, 100 + i * 70);
      wordTimeouts.push(t);
    });
  }

  // ── Visualiser ────────────────────────────────────────────────
  function startVisualization() {
    const customInput = (document.getElementById('m4-custom-input')?.value || '').trim();

    // Sauvegarde dans RITUAL_STATE
    if (typeof RITUAL_STATE !== 'undefined') {
      RITUAL_STATE.intentions      = [...selectedChips];
      RITUAL_STATE.customIntention = customInput;
    }

    const text = pickVisualization(selectedChips, lastVizText);
    lastVizText = text;
    if (typeof RITUAL_STATE !== 'undefined') RITUAL_STATE.visualization = text;

    showVizPhase(text);
  }

  // ── Autre visualisation ───────────────────────────────────────
  function reVisualize() {
    const footer = document.getElementById('m4-footer');
    if (footer) footer.classList.remove('m4-footer--visible');

    const text = pickVisualization(selectedChips, lastVizText);
    lastVizText = text;
    if (typeof RITUAL_STATE !== 'undefined') RITUAL_STATE.visualization = text;
    renderViz(text);
  }

  // ── Liaison des événements ────────────────────────────────────
  function bindEvents() {
    // Chips
    document.querySelectorAll('.m4-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const label = chip.dataset.intention;
        const isActive = chip.classList.toggle('m4-chip--active');
        if (isActive) {
          if (!selectedChips.includes(label)) selectedChips.push(label);
        } else {
          selectedChips = selectedChips.filter(c => c !== label);
        }
      });
    });

    // Bouton Visualiser
    document.getElementById('m4-visualize-btn')
      ?.addEventListener('click', () => {
        const customInput = (document.getElementById('m4-custom-input')?.value || '').trim();
        if (selectedChips.length === 0 && customInput.length < 2) {
          // Secoue le conteneur de chips
          const chipsWrap = document.getElementById('m4-chips-phase');
          chipsWrap?.classList.add('m4-shake');
          setTimeout(() => chipsWrap?.classList.remove('m4-shake'), 400);
          return;
        }
        startVisualization();
      });

    // Autre visualisation
    document.getElementById('m4-reviz-btn')
      ?.addEventListener('click', reVisualize);

    // Module suivant
    document.getElementById('m4-next-btn')
      ?.addEventListener('click', () => navigateTo('m5'));
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    showChipsPhase();
  }

  function onLeave() {
    wordTimeouts.forEach(clearTimeout);
    wordTimeouts = [];
    // Neutralise les pointer-events inline pour ne pas bloquer d'autres écrans
    const viz = document.getElementById('m4-viz-phase');
    if (viz) viz.style.pointerEvents = 'none';
    const chips = document.getElementById('m4-chips-phase');
    if (chips) chips.style.pointerEvents = 'none';
  }

  bindEvents();
  screenHooks.m4 = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
