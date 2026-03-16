'use strict';

/* ================================================================
   MATRICE — Module Humeur : Check-in matinal
   5 cercles gradués (gris foncé → or lumineux), tap → rituel
   ================================================================ */

const ModuleHumeur = (() => {

  // ── Sélection ─────────────────────────────────────────────────
  function onSelect(score) {
    // Feedback visuel immédiat
    document.querySelectorAll('.hm-dot').forEach(btn => {
      btn.classList.toggle('hm-dot--selected', parseInt(btn.dataset.humeur) === score);
    });

    // Mise à jour de l'état global
    if (typeof RITUAL_STATE !== 'undefined') {
      RITUAL_STATE.humeur = score;
    }

    // Persistance
    MatriceStorage.saveHumeur(score);

    // Navigation vers le rituel après un bref feedback visuel
    setTimeout(() => navigateTo('rituel'), 350);
  }

  // ── Liaison des événements ────────────────────────────────────
  function bindEvents() {
    document.querySelectorAll('.hm-dot').forEach(btn => {
      btn.addEventListener('click', () => onSelect(parseInt(btn.dataset.humeur, 10)));
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────
  function onEnter() {
    // Réinitialiser la sélection visuelle
    document.querySelectorAll('.hm-dot').forEach(btn => btn.classList.remove('hm-dot--selected'));
    // Réinitialiser l'humeur dans RITUAL_STATE pour forcer un nouveau choix
    if (typeof RITUAL_STATE !== 'undefined') RITUAL_STATE.humeur = null;

    // Phase lunaire subtile sous la question
    const moonEl = document.getElementById('hm-moon-phase');
    if (moonEl && typeof MoonSystem !== 'undefined') {
      const phase = MoonSystem.getMoonPhase(new Date());
      moonEl.innerHTML = MoonSystem.drawMoonIcon(phase.key, 16) +
        `<span class="hm-moon-name">${phase.name}</span>`;
    }
  }

  function onLeave() {}

  bindEvents();
  screenHooks.humeur = { onEnter, onLeave };

  return { onEnter, onLeave };
})();
