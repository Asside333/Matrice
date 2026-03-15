'use strict';

/* ================================================================
   MATRICE — Sorts du jour (Module 5)
   25+ sorts avec gestes physiques réels — 5 par élément
   ================================================================ */

const SORTS = {
  feu: [
    {
      titre: "Allume l'étincelle",
      texte: "Ce que tu touches aujourd'hui prend feu. Pas l'incendie qui dévore — la flamme qui éclaire. Tu commences par le plus difficile, et tu le fais avec toute ta chaleur.",
      geste: "Frotte tes paumes l'une contre l'autre pendant 10 secondes. Sens la chaleur. Pose-les sur ton sternum.",
    },
    {
      titre: "Brûle ce qui freine",
      texte: "Il y a quelque chose que tu gardes par habitude, pas par choix. Aujourd'hui, tu le laisses brûler. Ce qui doit partir est déjà en cendres. Ce qui reste est or.",
      geste: "Inspire profondément. À l'expire, souffle fort — une seule fois — comme si tu éteignais une bougie. Répète trois fois.",
    },
    {
      titre: "Le Phénix prend forme",
      texte: "Tu n'es pas en train de recommencer à zéro. Tu es en train de te transformer. Chaque recommencement porte la mémoire de tout ce que tu as été. C'est ça, la puissance du feu.",
      geste: "Lève les bras au-dessus de la tête, paumes vers le ciel. Reste 3 respirations dans cette posture d'ouverture.",
    },
    {
      titre: "La forge intérieure",
      texte: "Le feu ne détruit pas. Il révèle. Sous la pression et la chaleur, ce qui est vrai dans ta nature apparaît. Laisse aujourd'hui révéler ce que tu es capable de faire.",
      geste: "Serre les poings et relâche, trois fois de suite. Laisse la tension partir à chaque relâchement.",
    },
    {
      titre: "Sol Invictus",
      texte: "Le soleil ne demande pas la permission de se lever. Tu n'as pas besoin d'être invité pour occuper ta place. Aujourd'hui, tu entres dans chaque espace avec la certitude de ce que tu apportes.",
      geste: "Tiens-toi droit, les pieds à largeur d'épaules. Pose une main sur ton plexus. Respire en gonflant le ventre. Reste une minute dans cette posture.",
    },
    {
      titre: "L'Embrasement",
      texte: "Il y a des journées où tu n'as pas envie de commencer. Le feu commence souvent par une petite étincelle, pas une explosion. Agis sur la plus petite chose aujourd'hui — et regarde comme ça s'embrase.",
      geste: "Claque deux fois dans tes mains. Fort. Sens la vibration dans ta paume. Tu viens de produire de la chaleur. L'énergie est déjà là.",
    },
    {
      titre: "Le Soleil Intérieur",
      texte: "Il y a un soleil au centre de ta poitrine. Pas métaphoriquement — une source de chaleur réelle, une vitalité qui ne demande qu'à rayonner. Aujourd'hui, tu ne te caches pas. Tu brilles là où tu te trouves.",
      geste: "Pose les deux mains sur ton sternum. Imagine une chaleur dorée s'étendant de là vers tout ton corps. Reste 3 respirations dans cette sensation.",
    },
  ],

  terre: [
    {
      titre: "Racines profondes",
      texte: "Plus tu es enraciné, plus tu peux t'étirer vers le ciel sans te perdre. Aujourd'hui, tu construis sur du solide. Chaque action est un fondement.",
      geste: "Pieds nus ou chaussés, sens le sol sous tes pieds. Appuie chaque orteil. Garde cette conscience tout au long de la journée.",
    },
    {
      titre: "Le Corps est temple",
      texte: "Ce que tu nourris pousse. Ce que tu négliges se rétrécit. Aujourd'hui, honore ton corps — ce qu'il ingère, comment il bouge, comment il se repose.",
      geste: "Bois un grand verre d'eau lentement, avec attention. Sens l'eau descendre. Remercie ton corps pour ce qu'il fait chaque jour sans que tu le remarques.",
    },
    {
      titre: "Patience de la montagne",
      texte: "La montagne ne se hâte pas. Elle est simplement là, immuable. Certaines choses dans ta vie demandent du temps — pas plus d'effort, juste de la constance.",
      geste: "Assieds-toi les pieds à plat sur le sol. Ferme les yeux. Imagine des racines descendre de tes pieds dans la terre. Reste immobile 60 secondes.",
    },
    {
      titre: "Semence d'intention",
      texte: "Aujourd'hui tu plantes. Tu ne verras peut-être pas le fruit aujourd'hui, ni demain. Mais chaque geste juste est une semence. La terre garde tout ce qu'on lui confie.",
      geste: "Joins tes mains en coupe devant toi. Imagine y poser ton intention la plus importante du jour. Ferme doucement les mains sur elle.",
    },
    {
      titre: "La Solidité qui sert",
      texte: "Tu es un ancre pour les gens qui t'entourent. Ta stabilité n'est pas rigidité — elle est ressource. Aujourd'hui, quelqu'un a besoin de ton calme, de ta constance, de ta présence.",
      geste: "Place une main sur le bas-ventre. Respire lentement en gonflant cette zone. Trois respirations. Laisse descendre la sérénité.",
    },
    {
      titre: "Mains dans la Terre",
      texte: "Tes ancêtres travaillaient la terre pour vivre. Cette mémoire est dans tes mains. Aujourd'hui, chaque tâche accomplie nourrit quelque chose — en toi, autour de toi. Le travail humble est une forme de prière.",
      geste: "Frotte tes mains ensemble lentement, comme si tu pétrissais de la terre. Sense le poids imaginaire entre tes paumes. Puis dépose-le.",
    },
    {
      titre: "Le Chêne et la Tempête",
      texte: "Le chêne ne plie pas parce qu'il est rigide. Il plie parce qu'il est vivant — et ses racines sont si profondes qu'elles lui permettent tout. Aujourd'hui, tu peux te laisser affecter sans te perdre.",
      geste: "Debout, pieds écartés. Laisse ton haut du corps se balancer légèrement à droite, à gauche. Observe que tes pieds restent stables. C'est ça, l'enracinement.",
    },
  ],

  air: [
    {
      titre: "Pensée claire",
      texte: "L'air emporte le brouillard. Aujourd'hui, les idées sont nettes. Tu vois les connexions que tu ne voyais pas hier. Ce qui semblait complexe se simplifie.",
      geste: "Expire tout l'air lentement par la bouche. Attends 3 secondes poumons vides. Inspire lentement par le nez. Répète 4 fois.",
    },
    {
      titre: "Le Messager ailé",
      texte: "Ce que tu exprimes aujourd'hui atteint exactement qui doit l'entendre. Tes mots ont de la portée. Prends le temps de choisir ceux qui servent vraiment.",
      geste: "Place une main sur ta gorge. Dis à voix haute : 'Ce que j'ai à dire a de la valeur.' Même si tu ne le crois pas encore.",
    },
    {
      titre: "Légèreté gagnée",
      texte: "La légèreté n'est pas l'irresponsabilité. C'est l'art de ne pas rendre les choses plus lourdes qu'elles ne sont. Aujourd'hui, tu fais face à ce qui est sans y ajouter d'histoire.",
      geste: "Hausse les épaules vers les oreilles, tiens 3 secondes, puis laisse-les tomber d'un coup. Répète deux fois. Sens la différence.",
    },
    {
      titre: "Vent de renouveau",
      texte: "Il y a un courant d'air frais qui entre dans ta vie en ce moment. Pas une tempête — une brise. Elle apporte du nouveau. Tu n'as pas besoin de savoir exactement quoi. Tu dois juste laisser la fenêtre ouverte.",
      geste: "Ouvre une fenêtre ou sors dehors quelques secondes. Sens l'air sur ton visage. Laisse-le entrer.",
    },
    {
      titre: "L'Espace entre les mots",
      texte: "Tout ce que tu penses n'a pas besoin d'être dit. Tout ce qui doit être dit n'a pas besoin d'être dit maintenant. Aujourd'hui, tu utilises le silence comme outil.",
      geste: "Avant de parler lors de ta prochaine interaction importante, prends une seconde de pause consciente. Une seule. Ça change tout.",
    },
    {
      titre: "La Plume de Maât",
      texte: "Maât, déesse de la vérité, pesait les âmes contre une plume. Aujourd'hui, pèse tes paroles à cette aune : sont-elles vraies, utiles, bienveillantes ? Si la réponse est non, garde-les.",
      geste: "Souffle longuement, comme si tu soufflais sur une plume pour la faire flotter. Légèreté. Précision. Vérité.",
    },
    {
      titre: "Mercure en Éveil",
      texte: "Mercure gouverne les communications, les voyages, les connexions. Aujourd'hui, chaque échange est une opportunité. Reste alerte aux messages inattendus — dans une conversation, dans une coïncidence, dans un silence.",
      geste: "Touche tes tempes du bout des doigts. Prends conscience de ton cerveau actif. Remercie-le pour tout ce qu'il traite en ce moment sans que tu le demandes.",
    },
  ],

  eau: [
    {
      titre: "Flux et lâcher-prise",
      texte: "L'eau ne lutte pas contre les rochers. Elle les contourne, les poli, les transforme avec le temps. Aujourd'hui, tu t'adaptes sans te perdre. Tu trouves le chemin.",
      geste: "Bois de l'eau lentement, conscient. Sens l'eau couler dans ton corps. Tu es composé à 70% d'eau — elle fait partie de toi.",
    },
    {
      titre: "Profondeur calme",
      texte: "En surface, la mer peut être agitée. En profondeur, elle est toujours calme. Tu as cette profondeur en toi. Les événements d'aujourd'hui ne peuvent pas l'atteindre si tu restes ancré là-dedans.",
      geste: "Assieds-toi. Ferme les yeux. Imagine descendre lentement dans des eaux claires et profondes. Plus tu descends, plus c'est calme. Reste 3 respirations en bas.",
    },
    {
      titre: "La Marée revient",
      texte: "Chaque creux est suivi d'une vague. Ce que tu vis en ce moment — le découragement, la fatigue, le doute — fait partie du cycle. La marée revient toujours.",
      geste: "Allonge-toi si possible, ou recule ton dos dans ta chaise. Laisse ton corps être lourd. Ne contrôle rien pendant 60 secondes.",
    },
    {
      titre: "Intuition liquide",
      texte: "Ton intuition est comme l'eau : elle prend la forme du contenant et trouve toujours une sortie. Aujourd'hui, fais confiance à ce qui monte sans raison apparente. Ce n'est pas de la superstition — c'est de l'intelligence intégrée.",
      geste: "Pose une main sur ton ventre. Pose l'autre sur ton cœur. Demande-toi : 'Qu'est-ce que je sais, que je n'ai pas encore admis ?' Attends. Ne force pas.",
    },
    {
      titre: "Guérison douce",
      texte: "L'eau guérit. Elle nettoie, elle apaise, elle renouvelle. Aujourd'hui, prends soin de toi avec la même douceur que tu aurais pour quelqu'un que tu aimes. Tu mérites cette tendresse.",
      geste: "Passe de l'eau fraîche sur ton visage ou tes poignets. Sens la fraîcheur. Reviens dans ton corps.",
    },
    {
      titre: "La Source Intérieure",
      texte: "Tu n'as pas besoin de chercher l'énergie à l'extérieur. Il y a une source en toi qui ne s'épuise pas. Elle coule en dessous de la fatigue, en dessous du doute. Tu n'as qu'à descendre jusque-là.",
      geste: "Assieds-toi. Ferme les yeux. Écoute le silence intérieur. Après 30 secondes, demande-toi : 'De quoi ai-je vraiment besoin maintenant ?'",
    },
    {
      titre: "Argent Vif",
      texte: "Le mercure liquide — argent vif — suit toujours la pente naturelle des choses. Aujourd'hui, ne force rien. Repère le chemin de moindre résistance et suis-le. Non pas par lâcheté — par intelligence.",
      geste: "Ferme les paumes. Imagine tenir de l'eau entre tes mains. Laisse-la couler à travers tes doigts. Sens la fluidité. Emporte-la dans ta journée.",
    },
  ],

  ether: [
    {
      titre: "L'Espace qui contient tout",
      texte: "Avant le bruit, il y a le silence. Avant la forme, il y a l'espace. Tu n'as rien à faire maintenant. Sois simplement le témoin de ce moment, sans te confondre avec lui.",
      geste: "Assieds-toi en silence. Écoute tous les sons autour de toi — sans les nommer, sans les juger. Juste entendre. Pendant 2 minutes.",
    },
    {
      titre: "Le Témoin impassible",
      texte: "Il y a une partie de toi qui n'est jamais blessée, jamais perdue, jamais emportée. Elle observe. Elle sait. Aujourd'hui, reviens à ce témoin quand tout devient trop.",
      geste: "Ferme les yeux. Demande-toi : 'Qui observe en ce moment ?' Sans chercher de réponse. Reste dans la question.",
    },
    {
      titre: "Le Vide fertile",
      texte: "Tu n'as pas besoin de remplir chaque moment. Le vide n'est pas un manque — c'est un espace de possibilité. Ce qui vient de toi dans ces espaces vides est souvent ce qui compte le plus.",
      geste: "Ne fais rien pendant 3 minutes. Pas de téléphone, pas de musique. Juste être. C'est tout.",
    },
    {
      titre: "Conscience pure",
      texte: "Tu n'es pas seulement tes pensées, tes émotions, ton corps. Tu es ce qui les contient. Plus grand que tout ça. Aujourd'hui, souviens-toi de cette dimension — même une seconde.",
      geste: "Regarde le ciel ou le plafond. Regarde vraiment. Sens l'espace entre toi et ce que tu regardes. Sens que cet espace est aussi en toi.",
    },
    {
      titre: "Écoute de l'espace",
      texte: "Entre chaque son, il y a du silence. Entre chaque pensée, il y a un espace. C'est dans cet espace que tu trouves ce dont tu as besoin. Pas dans le bruit.",
      geste: "Écoute le silence entre tes battements de cœur. Place une main sur ta poitrine. Après chaque battement, note le bref silence. C'est là que tu habites.",
    },
    {
      titre: "Le Passage",
      texte: "L'éther est le cinquième élément — celui qui relie et transcende les quatre autres. Aujourd'hui, tu es un pont entre les mondes : entre ce qui est et ce qui sera, entre toi et les autres, entre le connu et l'inconnu.",
      geste: "Étends les bras sur les côtés, paumes vers le ciel. Reste 10 secondes dans cette ouverture. Tu reçois et tu transmets en même temps.",
    },
    {
      titre: "Kether — La Couronne",
      texte: "Au sommet de l'arbre de vie, Kether est la couronne — la source de tout. Quelque chose de pur et d'originel est en toi. En dessous de tous les conditionnements, il y a une lumière intacte. Souviens-t'en aujourd'hui.",
      geste: "Touche le sommet de ta tête du bout des doigts. Imagine une lumière blanche entrer par là. Laisse-la descendre lentement jusqu'au bas de ton dos.",
    },
  ],
};

const ELEMENTS = {
  feu:   { nom: 'Feu',   emoji: '🔥', couleur: '#C0392B', secondaire: '#E67E22' },
  terre: { nom: 'Terre', emoji: '🌿', couleur: '#27AE60', secondaire: '#2E7D32' },
  air:   { nom: 'Air',   emoji: '🌬', couleur: '#AFA9EC', secondaire: '#7986CB' },
  eau:   { nom: 'Eau',   emoji: '💧', couleur: '#2980B9', secondaire: '#1565C0' },
  ether: { nom: 'Éther', emoji: '✨', couleur: '#8E44AD', secondaire: '#4527A0' },
};

const ELEMENT_KEYS = ['feu', 'terre', 'air', 'eau', 'ether'];

/**
 * Retourne l'élément proposé pour aujourd'hui (rotation basée sur le jour de l'année).
 * @returns {string} clé d'élément
 */
function getTodayElement() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return ELEMENT_KEYS[dayOfYear % 5];
}

/**
 * Retourne un sort sans répétition jusqu'à épuisement du pool.
 * @param {string} elementKey
 * @returns {object} { titre, texte, geste }
 */
function pickSort(elementKey) {
  const key  = SORTS[elementKey] ? elementKey : 'ether';
  return MatriceStorage.pickUnique(SORTS[key], 'sorts.' + key);
}
