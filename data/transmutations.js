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
    "La fatigue physique du chantier est honnête. Elle dit que tu as donné quelque chose de réel aujourd'hui. Ton corps est fatigué parce qu'il a servi. C'est noble.",
    "La fierté des mains qui travaillent ne se discute pas. Ce que tu construis avec tes mains existe dans le monde réel — pas dans une abstraction. Chaque câble tiré, chaque tableau posé est une signature.",
    "Les gens difficiles sont des meules à aiguiser. Ils ne savent pas qu'ils t'entraînent, mais c'est exactement ce qu'ils font. Chaque interaction tendue te rend plus précis dans tes limites.",
    "La monotonie n'est pas l'absence de sens. C'est le tempo de fond sur lequel tu construis. Le DJ le sait : le kick répétitif est ce qui permet au break de tout exploser. Ta routine est le kick. Le break arrive.",
    "Quand ton corps dit stop, ce n'est pas de la faiblesse. C'est de l'intelligence brute. Ton corps ne ment jamais — il n'a pas appris. Écoute-le avant qu'il te force à l'écouter.",
    "Le client impossible te montre exactement où tu poses tes limites. Chaque interaction avec lui est un exercice de positionnement. Tu ne le changes pas — tu te définis face à lui.",
  ],

  corps: [
    "Ce corps a traversé tout ce que tu as traversé. Il n'est pas ton ennemi — il est ton allié le plus ancien.",
    "La honte corporelle est un mensonge qu'on a gravé sur toi. À chaque souffle libre, tu l'effaces un peu plus.",
    "Ton corps n'est pas une contamination. Il est le vaisseau de tout ce que tu crées. Honore-le.",
    "Ce que tu ressens dans ton corps est un signal, pas une condamnation. Écoute-le sans le juger.",
    "Le corps qui te porte ce matin est le même qui escalade, qui crée, qui tient debout. Il mérite ton respect.",
    "Chaque inspiration est la preuve que ton corps te choisit. Chaque jour. Malgré tout.",
    "Ton corps porte la mémoire de tout ce que tu as surmonté. Chaque muscle, chaque souffle est un testament de résilience.",
    "L'acceptation du corps n'est pas un événement. C'est un chemin. Ce matin tu fais un pas de plus dessus. Tu n'as pas besoin d'arriver — tu as besoin de marcher.",
    "Chaque mouvement que tu fais est une reconquête. Monter un escalier, porter un sac, respirer profondément. Ton corps te répond quand tu lui parles avec respect.",
    "Le sport n'est pas une punition pour ton corps. C'est une conversation avec lui. Aujourd'hui, demande-lui ce qu'il veut bouger, et écoute.",
    "Le miroir n'est pas un tribunal. C'est un allié. Regarde-toi dedans comme tu regarderais un ami qui a tout traversé — avec respect, pas avec jugement.",
    "Prendre de la place n'est pas de l'arrogance. C'est une correction. On t'a appris à te rétrécir. Ton corps a besoin de tout son espace pour respirer, créer et vivre.",
    "La sueur est un baptême quotidien. Chaque goutte qui sort de ton corps emporte un mensonge avec elle. Après l'effort, tu es plus propre à l'intérieur qu'avant.",
  ],

  deuil: [
    "Le manque que tu ressens est la mesure de l'amour. Il ne diminuera pas — mais il peut devenir un moteur au lieu d'une ancre.",
    "Vivre pleinement n'est pas une trahison. C'est le plus bel hommage que tu puisses rendre à ceux qui ne sont plus là.",
    "Tu portes Émilie avec toi dans tout ce que tu construis. Elle n'est pas absente — elle est tissée dans chacun de tes actes de courage.",
    "Le deuil n'a pas de calendrier. Ce matin il pèse. Demain il portera. Les deux sont vrais.",
    "Tu as bâti la vie qu'elle aurait voulu vivre. C'est la preuve : tu mérites d'être ici.",
    "La douleur de la perte prouve la profondeur du lien. Ce lien ne s'est pas brisé — il a changé de forme.",
    "Ceux qui sont partis ne demandent pas ta tristesse. Ils demandent ta lumière. Brille pour eux.",
    "La mémoire d'Émilie ne se fige pas dans la douleur. Elle se transforme en élan. Chaque chose belle que tu vis porte sa trace — pas comme un poids, comme un souffle.",
    "Tu as le droit de rire. Tu as le droit de jouir de cette vie. Ce n'est pas un manque de respect envers ceux qui sont partis — c'est la preuve que leur amour a porté des fruits.",
    "Vivre pleinement est le plus grand hommage. Pas la douleur constante — la vie vécue avec l'intensité qu'ils méritaient.",
    "Les dates anniversaires ne sont pas des pièges. Ce sont des rendez-vous. Émilie te retrouve à ces endroits du calendrier. Viens-y sans armure.",
    "Parler aux morts n'est pas de la folie. C'est de la fidélité. Ce que tu leur dis à voix haute, ils l'entendent dans la version d'eux que tu portes. Et cette version est vivante.",
    "Tu portes une lumière qui vient d'elle. Pas comme un fardeau — comme un relais. La flamme que tu portes ne t'alourdit pas. Elle éclaire ta route.",
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
    "L'insomnie est le mental qui refuse de lâcher le volant. Tu n'as pas à piloter dans le noir. Pose le volant. Laisse le corps reprendre les commandes.",
    "La comparaison est un poison lent. Tu ne connais pas le chemin de l'autre — seulement le highlight reel. Ton chemin est incomparable parce qu'il n'existe qu'une fois.",
    "Le syndrome de l'imposteur est la preuve que tu joues dans une ligue supérieure. Ceux qui ne progressent pas ne ressentent jamais ça. Ce malaise est un bon signe.",
    "Le perfectionnisme est la peur déguisée en exigence. Ce qui est fini vaut toujours mieux que ce qui est parfait dans ta tête. Lâche le fichier. Exporte le track. Envoie le message.",
    "La peur de devenir fou est la preuve que tu es sain. Les vrais déséquilibrés ne se posent pas la question. Ta lucidité est intacte — c'est elle qui s'inquiète.",
    "Le bruit constant dans ta tête n'est pas un défaut de câblage. C'est un moteur qui tourne à vide. Donne-lui une direction — un projet, un souffle, un geste — et le bruit devient du signal.",
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
    "L'ennui n'est pas le vide. C'est le silence avant que quelque chose de neuf ne germe. Ne le remplis pas trop vite — il travaille pour toi.",
    "L'attente est une forme de force que personne ne reconnaît. Tu ne stagnes pas en attendant. Tu mûris. Le fruit tombe quand il est prêt, pas quand on tire dessus.",
    "Le sentiment d'être en retard est un mensonge. Tu es exactement dans ton timing. Ce que tu vois chez les autres est leur surface, pas leur horloge interne.",
    "La peur du bonheur est réelle. Quand tout va bien, une partie de toi attend la catastrophe. C'est un vieux réflexe de survie. Mais tu n'es plus en danger. Tu as le droit de rester heureux.",
    "La culpabilité de bien aller quand d'autres souffrent est un piège. Ta lumière ne vole rien à personne. Au contraire — elle éclaire le chemin pour ceux qui cherchent encore le leur.",
    "La saturation émotionnelle n'est pas un bug. C'est un signal de trop-plein. Tu as absorbé plus que ta dose. Ce soir, vide. Demain, tu auras de la place pour du neuf.",
  ],
};

/* ----------------------------------------------------------------
   Mots-clés par pool
   ---------------------------------------------------------------- */
const POOL_KEYWORDS = {
  pro:    ['travail', 'boulot', 'collègue', 'patron', 'mission', 'intérim', 'chantier', 'client', 'entreprise', 'bureau', 'job', 'chef', 'monotonie', 'routine', 'répétitif'],
  corps:  ['corps', 'honte', 'souffle', 'odeur', 'peau', 'poids', 'sueur', 'laid', 'gros', 'moche', 'ventre', 'physique', 'douleur', 'miroir', 'place', 'espace'],
  deuil:  ['émilie', 'sœur', 'mort', 'deuil', 'perte', 'partie', 'absente', 'disparue', 'manque', 'perdu', 'décès', 'absence'],
  mental: ['peur', 'angoisse', 'tribunal', 'voix', 'boucle', 'pensée', 'fou', 'spirale', 'tête', 'cerveau', 'mental', 'anxiété', 'doute', 'rumination', 'insomnie', 'dormir', 'sommeil', 'comparaison', 'imposteur', 'jaloux', 'perfectionnisme', 'parfait', 'bruit', 'saturation', 'trop'],
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
