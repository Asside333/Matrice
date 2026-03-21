'use strict';

/* ================================================================
   MATRICE — data/transmutations.js
   Pools de transmutation par contexte + détection mots-clés
   ================================================================ */

const TRANSMUTATIONS = {
  pro: [
    "Ce collègue, ce patron, cette tension — c'est ton terrain d'entraînement, pas ta prison. Tu y apprends ce qu'aucun livre ne t'enseignera.",
    "Le travail qui pèse ce matin finance la liberté que tu construis. Chaque jour sur ce chantier est un pas vers ce que tu veux vraiment.",
    "La difficulté professionnelle est un miroir. Ce qui t'irrite te montre où tu grandis. Regarde bien.",
    "Tu tiens debout dans un environnement hostile. Il y a 18 mois, tu aurais fui. Aujourd'hui tu es encore là. C'est ça, la force.",
    "Ce boulot n'est pas ta vie. C'est un outil. Utilise-le, ne le laisse pas t'utiliser.",
    "La friction au travail aiguise quelque chose en toi. Tu ne le vois pas encore, mais tu es en train de forger exactement ce dont tu as besoin.",
    "L'incompétence autour de toi n'est pas un obstacle — c'est une donnée. Tu l'intègres sans te perdre dedans. Tu continues à faire du bon travail indépendamment du contexte.",
    "Certains matins, le simple fait de s'habiller et de partir est un acte de courage. C'est en être un aujourd'hui. Et c'est suffisant.",
    "Ce que tu construis au travail n'est pas juste un salaire. C'est une preuve vivante de ta capacité à créer dans l'adversité.",
    "Tu n'es pas prisonnier de cet environnement. Tu es un visiteur conscient qui en extrait ce dont il a besoin pour la suite.",
  ],

  corps: [
    "Ce corps a traversé tout ce que tu as traversé. Il n'est pas ton ennemi — il est ton allié le plus ancien.",
    "La honte corporelle est un mensonge qu'on a gravé sur toi. À chaque souffle libre, tu l'effaces un peu plus.",
    "Ton corps n'est pas une contamination. Il est le vaisseau de tout ce que tu crées. Honore-le.",
    "Ce que tu ressens dans ton corps est un signal, pas une condamnation. Écoute-le sans le juger.",
    "Le corps qui te porte ce matin est le même qui escalade, qui crée, qui tient debout. Il mérite ton respect.",
    "Chaque inspiration est la preuve que ton corps te choisit. Chaque jour. Malgré tout.",
    "Ton corps porte la mémoire de tout ce que tu as surmonté. Chaque muscle, chaque souffle est un testament de résilience.",
  ],

  deuil: [
    "Le manque que tu ressens est la mesure de l'amour. Il ne diminuera pas — mais il peut devenir un moteur au lieu d'une ancre.",
    "Vivre pleinement n'est pas une trahison. C'est le plus bel hommage que tu puisses rendre à ceux qui ne sont plus là.",
    "Tu portes Émilie avec toi dans tout ce que tu construis. Elle n'est pas absente — elle est tissée dans chacun de tes actes de courage.",
    "Le deuil n'a pas de calendrier. Ce matin il pèse. Demain il portera. Les deux sont vrais.",
    "Tu as bâti la vie qu'elle aurait voulu vivre. C'est la preuve : tu mérites d'être ici.",
    "La douleur de la perte prouve la profondeur du lien. Ce lien ne s'est pas brisé — il a changé de forme.",
    "Ceux qui sont partis ne demandent pas ta tristesse. Ils demandent ta lumière. Brille pour eux.",
  ],

  mental: [
    "Les pensées en boucle sont un circuit fermé. Tu viens de l'ouvrir en les nommant. Le circuit est brisé.",
    "Le tribunal intérieur siège sans preuves. Tu as le droit de te lever et de quitter la salle.",
    "Cette voix qui t'attaque n'est pas la tienne. C'est un écho ancien. Tu n'es plus l'enfant qui devait l'écouter.",
    "L'angoisse est de l'énergie sans direction. Tu viens de lui donner un nom. Maintenant donne-lui une sortie.",
    "La peur dit 'danger'. Vérifie : y a-t-il un danger réel, maintenant, ici ? Non. Alors c'est un souvenir, pas une réalité.",
    "Le mental qui s'emballe cherche à te protéger. Remercie-le. Puis reprends le volant.",
    "Les pensées ne sont pas des faits. Elles sont des nuages. Tu es le ciel.",
    "Le doute est un gardien dépassé. Tu n'as plus besoin de sa protection.",
  ],

  general: [
    "Ce poids est un signal, pas une sentence. Il te montre où diriger ton énergie.",
    "Tu l'as nommé. Il n'a plus de pouvoir anonyme. Maintenant, avance avec.",
    "Ce qui pèse ce matin est la preuve que tu ressens. Et ressentir, c'est être vivant.",
    "La lourdeur est un ancrage mal orienté. Redirige-la vers ce que tu veux construire.",
    "Tu n'as pas besoin de résoudre ça maintenant. Tu as besoin de le voir — et c'est fait.",
    "Ce qui est nommé perd son emprise. Ce qui est vu ne peut plus agir dans l'ombre.",
    "Chaque matin lourd est un matin où tu as quand même ouvert cette app. C'est déjà un acte de force.",
    "Le sombre nourrit les racines. Pas de racines profondes sans obscurité traversée.",
    "Ce que tu portes n'est pas un défaut de caractère. C'est la preuve que tu t'en soucies. L'indifférent ne ressent pas ce poids.",
    "Quelque chose en toi sait que ça peut changer. Cette partie-là a raison.",
    "Tu n'as pas à tout résoudre. Tu as juste à traverser cette journée un pas à la fois. C'est déjà beaucoup.",
    "Ce qui t'a amené ici ce matin, malgré tout, c'est quelque chose de fort. Honore-le.",
    "Même les jours gris font partie du cycle. Tu n'es pas bloqué — tu es en transit.",
    "Le fait que tu sois ici, à chercher de la lumière dans le sombre, dit tout sur qui tu es vraiment.",
    "Ce poids n'est pas une faiblesse. C'est la gravité qui accompagne ceux qui portent quelque chose de vrai.",
    "Tu n'as pas besoin d'être réparé. Tu es en train de te révéler.",
    "Le chaos que tu ressens est la matière première de ta prochaine transformation.",
  ],
};

/* ----------------------------------------------------------------
   Mots-clés par pool
   ---------------------------------------------------------------- */
const POOL_KEYWORDS = {
  pro:    ['travail', 'boulot', 'collègue', 'patron', 'mission', 'intérim', 'chantier', 'client', 'entreprise', 'bureau', 'job', 'chef'],
  corps:  ['corps', 'honte', 'souffle', 'odeur', 'peau', 'poids', 'sueur', 'laid', 'gros', 'moche', 'ventre', 'physique', 'douleur'],
  deuil:  ['émilie', 'sœur', 'mort', 'deuil', 'perte', 'partie', 'absente', 'disparue', 'manque', 'perdu', 'décès', 'absence'],
  mental: ['peur', 'angoisse', 'tribunal', 'voix', 'boucle', 'pensée', 'fou', 'spirale', 'tête', 'cerveau', 'mental', 'anxiété', 'doute', 'rumination'],
};

/**
 * Détecte le pool approprié à partir du texte utilisateur.
 * Retourne une clé de TRANSMUTATIONS.
 * @param {string} text
 * @returns {string}
 */
function detectPool(text) {
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Comptage des hits par pool
  const scores = {};
  for (const [pool, keywords] of Object.entries(POOL_KEYWORDS)) {
    scores[pool] = 0;
    for (const kw of keywords) {
      const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (lower.includes(kwNorm)) scores[pool]++;
    }
  }

  // Pool avec le score max (> 0) ; sinon general
  let best = 'general';
  let bestScore = 0;
  for (const [pool, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = pool;
    }
  }
  return best;
}

/**
 * Retourne une transmutation sans répétition jusqu'à épuisement du pool.
 * @param {string} pool — clé de TRANSMUTATIONS (ex: 'pro', 'general')
 * @returns {string}
 */
function pickTransmutation(pool) {
  const list = TRANSMUTATIONS[pool] || TRANSMUTATIONS.general;
  return MatriceStorage.pickUnique(list, 'transmutations.' + (TRANSMUTATIONS[pool] ? pool : 'general'));
}
