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
        "Le noir de la nouvelle lune est le noir de la terre avant la graine. Quelque chose pousse déjà que tu ne vois pas.",
        "Cette nuit sans lune est un studio d'enregistrement — le silence parfait avant le premier beat.",
        "L'absence de lumière n'est pas l'absence de vie. C'est la vie qui se concentre avant d'exploser.",
        "La nouvelle lune est un coffre-fort vide. Ce que tu y déposes ce soir, tu le retrouveras multiplié dans 14 jours.",
        "Ce noir est le même noir que celui d'avant ta naissance. Il n'est pas hostile — il est originel. Repose-toi dedans.",
        "Quand la lune disparaît, les étoiles prennent leur revanche. Regarde ce qui brille quand le principal s'efface.",
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
        "Le croissant est une lame. Il coupe le superflu pour ne garder que l'intention. Que gardes-tu ?",
        "Un archer ne bande pas son arc à moitié. Le premier croissant est ta flèche qui se prépare.",
        "Cette lumière est si fine qu'elle pourrait passer inaperçue. Comme les premiers signes d'un changement profond.",
        "Le premier croissant est un ongle de lumière sur la joue du ciel. Petit, oui. Mais il contient la pleine lune en promesse.",
        "Ce soir, la lune chuchote. Demain elle parlera. Après-demain elle chantera. Le crescendo a commencé.",
        "La graine qui vient d'être plantée ne ressemble pas à l'arbre. Le croissant ne ressemble pas à la pleine lune. Fais confiance au processus.",
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
        "La moitié est éclairée, l'autre dans l'ombre. Comme toi. Et c'est exactement ce qui fait ta force.",
        "Le premier quartier est un ring. L'obstacle est là — et toi aussi. Qui recule en premier ?",
        "Ce qui résiste ce soir n'est pas un mur. C'est un test. La lune te demande si tu es sérieux.",
        "Le premier quartier est un sparring partner. Il ne te frappe pas pour te blesser — il te frappe pour te montrer tes failles.",
        "Moitié lumière, moitié ombre. Comme un beat qui alterne kick et silence. Le groove naît de cette tension.",
        "Ce soir tu es à la croisée. Le facile est à gauche, le nécessaire est à droite. La lune ne choisit pas pour toi.",
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
        "La gibbeuse croissante est l'artisan qui ponce avant la finition. Le gros oeuvre est fait — maintenant, les détails.",
        "Tu sens que c'est proche. Ne gâche pas ce moment en accélérant. Le dernier kilomètre se court au même rythme.",
        "La lumière est presque complète. Ce qui manque encore n'est pas un défaut — c'est de l'espace pour la surprise.",
        "La gibbeuse croissante est le mixdown avant le mastering. Le gros est fait. Maintenant, les détails qui changent tout.",
        "Tu es à 80%. Les 20% restants ne demandent pas plus d'effort — ils demandent plus de précision. Affine.",
        "Ce soir, ne cherche pas le parfait. Cherche le prêt. La différence entre les deux, c'est le courage de finir.",
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
        "La pleine lune ne ment pas. Ce que tu vois ce soir — en toi, chez les autres — est la vérité nue. Accepte-la.",
        "Ce soir, l'eau monte. Les émotions sont au plus haut. Ne les combats pas — surfe dessus.",
        "La pleine lune est un projecteur braqué sur ta vie. Ce qui brille mérite ta fierté. Ce qui fait mal mérite ta compassion.",
        "La pleine lune est un drop. Tout ce que tu as construit depuis la nouvelle lune culmine ici. Laisse le son remplir la salle.",
        "Ce soir, la marée est haute. Les émotions débordent du cadre habituel. Ne construis pas de digue — surfe.",
        "La pleine lune révèle les contours de tout ce que tu as semé. Regarde le champ. Il est plus riche que tu ne le pensais.",
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
        "La gibbeuse décroissante est le moment de récolter les leçons avant qu'elles ne se perdent. Écris-les.",
        "Ce que tu as vécu ce cycle est déjà en train de devenir sagesse. Tu ne le sens pas encore — mais ton corps, lui, l'intègre.",
        "Le fruit est mûr. Il tombe de lui-même. Tu n'as rien à forcer ce soir.",
        "La gibbeuse décroissante est le lendemain du concert. L'écho vibre encore, mais la scène se démonte. Laisse le souvenir se solidifier.",
        "Ce que tu n'as pas pu dire pendant la pleine lune, tu peux l'écrire maintenant. L'encre est plus patiente que la voix.",
        "Moins ne veut pas dire moins bien. La lune qui décroît affine. Elle retire le superflu pour ne garder que l'os.",
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
        "Le dernier quartier est un tri sacré. Ce que tu gardes dans la valise pour le prochain cycle — choisis bien.",
        "Défais les noeuds ce soir. Pas avec violence — avec patience. Les noeuds se défont par la douceur.",
        "Ce qui encombre ta vie a une date de péremption. Ce soir, vérifie les étiquettes.",
        "Le dernier quartier est un filtre. Ce qui passe à travers est essentiel. Le reste, laisse-le partir sans cérémonie.",
        "Ce soir, fais le tri — pas dans tes affaires, dans tes pensées. Lesquelles emmènes-tu dans le prochain cycle ? Choisis peu.",
        "La terre sous tes pieds absorbe ce que tu lâches. Elle sait quoi en faire. Toi, tu n'as qu'à ouvrir les mains.",
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
        "Le dernier croissant est un murmure. Approche ton oreille. La lune te dit quelque chose que tu es le seul à pouvoir entendre.",
        "Presque rien. Presque invisible. Comme les choses les plus importantes de ta vie — celles que personne ne voit mais qui te portent.",
        "Cette fine lame de lumière est une signature. Le cycle signe son oeuvre. Toi aussi.",
        "Le dernier croissant est un point de suspension, pas un point final. La phrase continue — ailleurs, autrement.",
        "Ce soir, l'obscurité n'est pas une menace. C'est une couverture. Elle protège ce qui germe dans le noir.",
        "Le dernier croissant est le souffle entre deux phrases de musique. Sans lui, la mélodie n'a pas de sens. Respecte la pause.",
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
    const total = phase.insights.length;
    let pool = Array.from({length: total}, (_, i) => i).filter(i => !used.includes(i));
    if (pool.length === 0) { used = []; pool = Array.from({length: total}, (_, i) => i); }
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
