'use strict';

/* ================================================================
   MATRICE — Système lunaire
   Calcul de phase, icône SVG géométrique, insights anti-répétition
   ================================================================ */

const MoonSystem = (() => {

  // ── Données des 8 phases ──────────────────────────────────────
  const MOON_PHASES = [
    {
      key: 'nouvelle_lune', name: 'Nouvelle Lune', idx: 0,
      elementKey: 'ether',
      insights: [
        "Ce silence est un commencement. Plante une intention dans ce vide.",
        "La lune disparaît pour mieux revenir. Tu fais pareil.",
        "Nouvelle lune : le champ est vierge. Qu'est-ce que tu veux magnétiser ?",
        "Dans l'obscurité totale, les étoiles parlent plus fort.",
        "Ce soir, rien ne doit être prouvé. Sois seulement.",
      ],
    },
    {
      key: 'premier_croissant', name: 'Premier Croissant', idx: 1,
      elementKey: 'feu',
      insights: [
        "Le croissant s'allume. Tes intentions commencent à prendre forme.",
        "Un mince filet de lumière suffit pour voir où aller.",
        "Commence. Même petit. Le mouvement appelle le mouvement.",
        "Le feu est encore bas — souffle doucement dessus.",
        "Ce que tu inities maintenant porte la trace de la lune naissante.",
      ],
    },
    {
      key: 'premier_quartier', name: 'Premier Quartier', idx: 2,
      elementKey: 'air',
      insights: [
        "La lune tranche le ciel en deux. Choisis ton camp.",
        "Mi-chemin entre le rien et le tout — c'est là que ça résiste.",
        "L'obstacle n'est pas un signe d'arrêt. C'est un test de cohérence.",
        "Premier quartier : décide et avance. La clarté viendra après.",
        "Tu n'as pas besoin de voir tout le chemin, juste le prochain pas.",
      ],
    },
    {
      key: 'gibbeuse_croissante', name: 'Gibbeuse Croissante', idx: 3,
      elementKey: 'feu',
      insights: [
        "La lumière déborde presque. Affine, ajuste, peaufine.",
        "Tu es presque là. Ce moment demande de la précision.",
        "Gibbeuse croissante : perfectionne sans te perdre dans le détail.",
        "L'énergie monte — utilise-la pour cibler, pas pour disperser.",
        "Ce que tu construis prend corps. Reste concentré.",
      ],
    },
    {
      key: 'pleine_lune', name: 'Pleine Lune', idx: 4,
      elementKey: 'eau',
      insights: [
        "Pleine lune : tout est amplifié. Ce que tu ressens est réel.",
        "Le sommet du cycle — lâche ce qui n'a plus de place ici.",
        "La lumière totale révèle ce qui était caché. Regarde.",
        "Pleine lune : culminer, pas forcer. Être dans le flot, pas contre.",
        "Ce soir, la gratitude est une force, pas une politesse.",
      ],
    },
    {
      key: 'gibbeuse_decroissante', name: 'Gibbeuse Décroissante', idx: 5,
      elementKey: 'eau',
      insights: [
        "Le cycle tourne. Commence à lâcher ce qui ne sert plus.",
        "Gibbeuse décroissante : intègre ce que tu as vécu.",
        "La descente est aussi un mouvement. Laisse partir.",
        "Qu'est-ce que ce cycle t'a appris ? Note-le avant d'oublier.",
        "Moins d'action, plus de digestion. Le vide qui vient est fertile.",
      ],
    },
    {
      key: 'dernier_quartier', name: 'Dernier Quartier', idx: 6,
      elementKey: 'terre',
      insights: [
        "Dernier quartier : libère ce qui encombre ton champ.",
        "Tu reviens au centre. L'essentiel se révèle dans la réduction.",
        "Ce qui doit partir, laisse-le partir sans cérémonie.",
        "Mi-chemin vers le vide — c'est là que le courage est réel.",
        "Terre : ancre-toi avant la prochaine naissance.",
      ],
    },
    {
      key: 'dernier_croissant', name: 'Dernier Croissant', idx: 7,
      elementKey: 'ether',
      insights: [
        "Le dernier croissant : presque rien, et pourtant encore là.",
        "Repos, silence, préparation. La prochaine lune se prépare en toi.",
        "Ce qui reste est ce qui compte vraiment.",
        "Laisse le cycle se terminer pleinement avant d'en commencer un autre.",
        "L'obscurité qui vient n'est pas une absence — c'est une gestation.",
      ],
    },
  ];

  // ── Calcul de la phase ─────────────────────────────────────────
  // Référence : nouvelle lune du 6 janvier 2000 à 18h14 UTC
  const REF_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);
  const SYNODIC_MS      = 29.530588853 * 24 * 60 * 60 * 1000;

  /**
   * getMoonPhase(date) → { key, name, idx, elementKey, fraction, insight }
   * date : Date ou string "YYYY-MM-DD" (midi UTC si string)
   */
  function getMoonPhase(date) {
    let d;
    if (typeof date === 'string') {
      const [y, m, day] = date.split('-').map(Number);
      d = new Date(Date.UTC(y, m - 1, day, 12, 0, 0));
    } else {
      d = date instanceof Date ? date : new Date();
    }

    const elapsed  = d.getTime() - REF_NEW_MOON_MS;
    const fraction = ((elapsed % SYNODIC_MS) + SYNODIC_MS) % SYNODIC_MS / SYNODIC_MS;
    const idx      = Math.floor(fraction * 8) % 8;
    const phase    = MOON_PHASES[idx];

    // Insight anti-répétition par phase
    const storageKey = 'matrice_moon_insight_' + phase.key;
    let used = [];
    try { used = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch {}
    let pool = [0, 1, 2, 3, 4].filter(i => !used.includes(i));
    if (pool.length === 0) { used = []; pool = [0, 1, 2, 3, 4]; }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    used.push(pick);
    try { localStorage.setItem(storageKey, JSON.stringify(used)); } catch {}

    return {
      key:        phase.key,
      name:       phase.name,
      idx,
      elementKey: phase.elementKey,
      fraction,
      insight:    phase.insights[pick],
    };
  }

  // ── Icône SVG géométrique ──────────────────────────────────────
  /**
   * drawMoonIcon(phaseKey, size) → string HTML (SVG)
   * Utilise la géométrie d'arc SVG : limbe externe + terminateur elliptique.
   * Hémisphère nord : croissant = éclairé à droite, décroissant = éclairé à gauche.
   */
  function drawMoonIcon(phaseKey, size) {
    const s  = size || 32;
    const cx = s / 2;
    const cy = s / 2;
    const r  = s * 0.40;
    const idx = MOON_PHASES.findIndex(p => p.key === phaseKey);
    if (idx < 0) return '';

    const topY = cy - r;
    const botY = cy + r;
    const fmt  = n => n.toFixed(2);

    // ── Nouvelle lune : cercle vide ────────────────────────────
    if (idx === 0) {
      return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" class="moon-icon" aria-hidden="true">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>
</svg>`;
    }

    // ── Pleine lune : cercle plein + halo ─────────────────────
    if (idx === 4) {
      return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" class="moon-icon" aria-hidden="true">
  <circle cx="${cx}" cy="${cy}" r="${fmt(r * 1.22)}" fill="currentColor" opacity="0.08"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor" opacity="0.88"/>
</svg>`;
    }

    // ── Quartiers : demi-cercle + ligne droite ─────────────────
    if (idx === 2) {
      // Premier quartier : côté droit éclairé
      return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" class="moon-icon" aria-hidden="true">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="1" opacity="0.25"/>
  <path d="M ${fmt(cx)},${fmt(topY)} A ${fmt(r)},${fmt(r)} 0 0,1 ${fmt(cx)},${fmt(botY)} L ${fmt(cx)},${fmt(topY)} Z"
        fill="currentColor" opacity="0.88"/>
</svg>`;
    }

    if (idx === 6) {
      // Dernier quartier : côté gauche éclairé
      return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" class="moon-icon" aria-hidden="true">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="1" opacity="0.25"/>
  <path d="M ${fmt(cx)},${fmt(topY)} A ${fmt(r)},${fmt(r)} 0 0,0 ${fmt(cx)},${fmt(botY)} L ${fmt(cx)},${fmt(topY)} Z"
        fill="currentColor" opacity="0.88"/>
</svg>`;
    }

    // ── Croissants & gibbeuses ────────────────────────────────
    // limbSweep=1 (CW) pour waxing, 0 (CCW) pour waning
    // rxRaw = r * cos(idx * 2π/8) → positif=croissant, négatif=gibbeuse
    // tSweep = rxRaw < 0 ? 1 : 0
    const isWaning  = idx > 4;
    const limbSweep = isWaning ? 0 : 1;
    const angle     = (idx / 8) * 2 * Math.PI;
    const rxRaw     = r * Math.cos(angle);
    const absRx     = Math.abs(rxRaw);
    const tSweep    = rxRaw < 0 ? 1 : 0;

    const path = [
      `M ${fmt(cx)},${fmt(topY)}`,
      `A ${fmt(r)},${fmt(r)} 0 0,${limbSweep} ${fmt(cx)},${fmt(botY)}`,
      `A ${fmt(absRx)},${fmt(r)} 0 0,${tSweep} ${fmt(cx)},${fmt(topY)}`,
      'Z',
    ].join(' ');

    return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" class="moon-icon" aria-hidden="true">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/>
  <path d="${path}" fill="currentColor" opacity="0.88"/>
</svg>`;
  }

  // ── Accès aux phases ──────────────────────────────────────────
  function getPhaseByKey(key) {
    return MOON_PHASES.find(p => p.key === key) || null;
  }

  return { getMoonPhase, drawMoonIcon, getPhaseByKey, MOON_PHASES };
})();
