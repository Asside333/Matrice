'use strict';

/* ================================================================
   MATRICE — Citations philosophiques
   Affichées sur l'écran de clôture après la phrase contextuelle
   100+ citations : Lao Tseu, Stoïciens, Rumi, Bouddha, Taoïstes,
   Gibran, Thich Nhat Hanh, Alan Watts, Héraclite,
   Proverbes africains, Sagesse égyptienne, Proverbes zen
   ================================================================ */

const CITATIONS = [
  // ── Lao Tseu ──────────────────────────────────────────────────
  { texte: "Un voyage de mille lieues commence par un pas.", auteur: "Lao Tseu" },
  { texte: "Connais les autres, c'est la sagesse. Se connaître soi-même, c'est l'éveil.", auteur: "Lao Tseu" },
  { texte: "La force du bois mort est dans ses racines.", auteur: "Lao Tseu" },
  { texte: "Agir sans agir, c'est la voie du sage.", auteur: "Lao Tseu" },
  { texte: "Qui sait ne parle pas. Qui parle ne sait pas.", auteur: "Lao Tseu" },
  { texte: "L'eau est la chose la plus douce qui soit, et pourtant elle érode la pierre.", auteur: "Lao Tseu" },
  { texte: "Sois attentif à tes pensées, elles deviennent tes mots. Sois attentif à tes mots, ils deviennent tes actes.", auteur: "Lao Tseu" },
  { texte: "Se maîtriser soi-même est la vraie puissance.", auteur: "Lao Tseu" },
  { texte: "Le vide est ce qui donne leur utilité aux choses.", auteur: "Lao Tseu" },
  { texte: "Nature ne se presse pas, et pourtant tout s'accomplit.", auteur: "Lao Tseu" },
  { texte: "Celui qui se bat avec l'ombre s'épuise.", auteur: "Lao Tseu" },
  { texte: "Le sage n'accumule pas. Plus il aide les autres, plus il possède. Plus il donne, plus il a.", auteur: "Lao Tseu" },
  { texte: "Si tu réalises que tu n'as pas besoin de tout, tout te revient.", auteur: "Lao Tseu" },
  { texte: "Sois simple. Sois patient. Sois compatissant.", auteur: "Lao Tseu" },
  { texte: "Les grandes réalisations semblent toujours imparfaites, pourtant leur utilité ne diminue pas.", auteur: "Lao Tseu" },

  // ── Stoïciens ─────────────────────────────────────────────────
  { texte: "Ce n'est pas les choses qui troublent les hommes, mais les opinions qu'ils ont des choses.", auteur: "Épictète" },
  { texte: "Souffrir, c'est n'être d'accord qu'avec soi-même.", auteur: "Marc Aurèle" },
  { texte: "Ce qui ne me tue pas me rend plus fort.", auteur: "Marc Aurèle" },
  { texte: "Perde du temps pour en gagner. Hâte-toi lentement.", auteur: "Sénèque" },
  { texte: "Tu as le pouvoir sur ton esprit, pas sur les événements extérieurs. Réalise cela et tu trouveras la force.", auteur: "Marc Aurèle" },
  { texte: "Commence à vivre et considère chaque journée comme une vie complète.", auteur: "Sénèque" },
  { texte: "La vie n'est pas courte — c'est nous qui la gaspillons.", auteur: "Sénèque" },
  { texte: "Chaque nouvelle aurore est une invitation à recommencer.", auteur: "Marc Aurèle" },
  { texte: "On souffre plus en imagination qu'en réalité.", auteur: "Sénèque" },
  { texte: "Le sage est content en toutes circonstances.", auteur: "Épictète" },
  { texte: "Demande-toi si tu es en accord avec ta nature profonde.", auteur: "Marc Aurèle" },
  { texte: "Ce qui dépend de nous, ce sont nos jugements, nos désirs, nos aversions.", auteur: "Épictète" },
  { texte: "Occupe-toi de tes propres affaires.", auteur: "Épictète" },
  { texte: "Nulle part n'est-il possible de trouver la paix, sauf au-dedans de soi.", auteur: "Marc Aurèle" },
  { texte: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas. C'est parce que nous n'osons pas qu'elles sont difficiles.", auteur: "Sénèque" },

  // ── Rumi ──────────────────────────────────────────────────────
  { texte: "Vit ce qui te traverse. Deviens la lumière qui brûle en toi.", auteur: "Rumi" },
  { texte: "La blessure est l'endroit par où la lumière entre en toi.", auteur: "Rumi" },
  { texte: "Voyageur, fais silence. Ne demande pas ton chemin à quelqu'un qui connaît le sien.", auteur: "Rumi" },
  { texte: "Tu n'es pas une goutte dans l'océan. Tu es l'océan entier dans une goutte.", auteur: "Rumi" },
  { texte: "Brûle ta maison — tu vivras alors sous les étoiles.", auteur: "Rumi" },
  { texte: "Ce que tu cherches te cherche aussi.", auteur: "Rumi" },
  { texte: "Vends ta ruse. Achète de l'étonnement.", auteur: "Rumi" },
  { texte: "Le silence est l'océan de la connaissance. La parole en est l'écume.", auteur: "Rumi" },
  { texte: "Hier j'étais intelligent, je voulais changer le monde. Aujourd'hui je suis sage, je me change moi-même.", auteur: "Rumi" },
  { texte: "Danse — dans le déchirement. Danse — dans les larmes.", auteur: "Rumi" },

  // ── Bouddha ───────────────────────────────────────────────────
  { texte: "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur.", auteur: "Bouddha" },
  { texte: "Votre souffrance est ma souffrance, votre bonheur est mon bonheur.", auteur: "Bouddha" },
  { texte: "Ce que tu es est ce que tu as été. Ce que tu seras est ce que tu fais maintenant.", auteur: "Bouddha" },
  { texte: "Trois choses ne peuvent être longtemps cachées : le soleil, la lune et la vérité.", auteur: "Bouddha" },
  { texte: "En vous réside le maître.", auteur: "Bouddha" },
  { texte: "Un moment peut changer un jour. Un jour peut changer une vie. Une vie peut changer le monde.", auteur: "Bouddha" },
  { texte: "La santé est le cadeau le plus précieux, la satisfaction la plus grande richesse, la confiance le meilleur ami.", auteur: "Bouddha" },
  { texte: "Il n'y a pas de chemin vers le bonheur. Le bonheur est le chemin.", auteur: "Bouddha" },
  { texte: "L'esprit est tout. Ce que tu penses, tu le deviens.", auteur: "Bouddha" },
  { texte: "Ce qui nous cause de la peine, c'est notre désir que les choses soient autrement qu'elles ne sont.", auteur: "Bouddha" },

  // ── Taoïstes ──────────────────────────────────────────────────
  { texte: "L'arbre qui touche le ciel pousse depuis une semence minuscule.", auteur: "Zhuangzi" },
  { texte: "La grenouille dans le puits ne connaît pas l'océan.", auteur: "Zhuangzi" },
  { texte: "Le chemin du Tao, c'est le retour.", auteur: "Zhuangzi" },
  { texte: "Quand tu réalises qu'il n'y a rien qui manque, le monde entier t'appartient.", auteur: "Lao Tseu / Tao Te Ching" },
  { texte: "Une rivière ne boit pas son eau. Un arbre ne mange pas ses fruits. Nuage ne boit pas sa pluie. La grandeur consiste à donner aux autres.", auteur: "Sagesse taoïste" },
  { texte: "Le sage gouverne en vidant les cœurs et en remplissant les ventres.", auteur: "Tao Te Ching" },
  { texte: "Dans la contrainte de l'immobilité, agir sans effort.", auteur: "Zhuangzi" },
  { texte: "Le bonheur est l'absence du désir de bonheur.", auteur: "Zhuangzi" },
  { texte: "Ce que le ver de soie tisse pour une nuit, le papillon défait au matin.", auteur: "Sagesse taoïste" },
  { texte: "Gouverner un grand pays est comme faire cuire un petit poisson — avec légèreté.", auteur: "Lao Tseu" },

  // ── Khalil Gibran ──────────────────────────────────────────────
  { texte: "Et si tu ne peux pas être le soleil, sois une étoile. La grandeur ne se mesure pas à la taille — mais à ce que tu es.", auteur: "Khalil Gibran" },
  { texte: "Ta douleur est la rupture de la coque qui entoure ta compréhension.", auteur: "Khalil Gibran" },
  { texte: "Vos enfants ne sont pas vos enfants. Ils sont les fils et les filles de l'appel de la Vie à elle-même.", auteur: "Khalil Gibran" },
  { texte: "Ne dites pas : j'ai trouvé la vérité. Dites plutôt : j'ai trouvé une vérité.", auteur: "Khalil Gibran" },
  { texte: "Le travail, c'est l'amour rendu visible.", auteur: "Khalil Gibran" },
  { texte: "Pour comprendre le cœur et l'esprit d'une personne, ne regardez pas ce qu'il a accompli, mais ce à quoi il aspire.", auteur: "Khalil Gibran" },
  { texte: "Souviens-toi que le sol sur lequel tu marches était autrefois l'os des guerriers.", auteur: "Khalil Gibran" },
  { texte: "Si tu as soif, bois la mer. Si tu as faim, mange la montagne.", auteur: "Khalil Gibran" },

  // ── Thich Nhat Hanh ───────────────────────────────────────────
  { texte: "La présence est le cadeau le plus précieux que tu puisses offrir.", auteur: "Thich Nhat Hanh" },
  { texte: "Boire son thé en silence est déjà une forme de méditation profonde.", auteur: "Thich Nhat Hanh" },
  { texte: "Prends soin du moment présent — le futur en aura soin de lui-même.", auteur: "Thich Nhat Hanh" },
  { texte: "L'avenir n'est pas encore là. Le passé est déjà parti. Seul le présent est vivant.", auteur: "Thich Nhat Hanh" },
  { texte: "Parfois, sourire est la meilleure méditation.", auteur: "Thich Nhat Hanh" },
  { texte: "La compréhension est l'autre nom de l'amour.", auteur: "Thich Nhat Hanh" },
  { texte: "Chaque pas que tu fais dans la conscience est une fleur que tu plantes sur la terre.", auteur: "Thich Nhat Hanh" },

  // ── Alan Watts ────────────────────────────────────────────────
  { texte: "Tu es l'univers qui se fait l'expérience de lui-même.", auteur: "Alan Watts" },
  { texte: "Si tu veux rester en bonne santé, sois simplement toi-même.", auteur: "Alan Watts" },
  { texte: "Le problème des gens qui prennent tout au sérieux, c'est qu'ils sont facilement honteux.", auteur: "Alan Watts" },
  { texte: "La seule façon de donner un sens à l'existence, c'est de prendre le risque d'exister.", auteur: "Alan Watts" },
  { texte: "Ce moment sera toujours avoir été.", auteur: "Alan Watts" },

  // ── Héraclite ─────────────────────────────────────────────────
  { texte: "On ne se baigne jamais deux fois dans le même fleuve.", auteur: "Héraclite" },
  { texte: "Le caractère est le destin.", auteur: "Héraclite" },
  { texte: "Ce qui s'oppose coopère. Ce qui diverge converge.", auteur: "Héraclite" },
  { texte: "Les yeux sont de meilleurs témoins que les oreilles.", auteur: "Héraclite" },
  { texte: "L'opposition est la mère de toutes choses.", auteur: "Héraclite" },

  // ── Proverbes africains ───────────────────────────────────────
  { texte: "Si tu veux aller vite, marche seul. Si tu veux aller loin, marche ensemble.", auteur: "Proverbe africain" },
  { texte: "Un enfant qui n'a pas été élevé par le village deviendra un ennemi du village.", auteur: "Proverbe africain" },
  { texte: "L'herbe ne pousse pas plus vite si on tire dessus.", auteur: "Proverbe africain" },
  { texte: "Connais-toi toi-même et tu connaîtras les dieux.", auteur: "Proverbe africain" },
  { texte: "La précipitation vient de l'ennemi. La patience vient de Dieu.", auteur: "Proverbe africain" },

  // ── Sagesse égyptienne ────────────────────────────────────────
  { texte: "Le silence est d'or là où la parole serait d'argent.", auteur: "Sagesse égyptienne" },
  { texte: "Connais-toi toi-même et tu connaîtras l'univers et les dieux.", auteur: "Temple de Louxor" },
  { texte: "Ce que tu fais revient vers toi — tel est le secret de Maât.", auteur: "Sagesse égyptienne" },
  { texte: "Écoute sans juger. Apprends sans te hâter. Enseigne sans dominer.", auteur: "Sagesse égyptienne" },
  { texte: "Ton cœur est plus lourd que la plume si tu n'as pas vécu en vérité.", auteur: "Livre des Morts égyptien" },

  // ── Proverbes zen ─────────────────────────────────────────────
  { texte: "Avant l'éveil, couper du bois, porter de l'eau. Après l'éveil, couper du bois, porter de l'eau.", auteur: "Proverbe zen" },
  { texte: "Le maître et l'élève apprennent ensemble.", auteur: "Proverbe zen" },
  { texte: "Si tu comprends, les choses sont telles qu'elles sont. Si tu ne comprends pas, les choses sont telles qu'elles sont.", auteur: "Proverbe zen" },
  { texte: "Assieds-toi. Ne fais rien. Regarde.", auteur: "Proverbe zen" },
  { texte: "Le meilleur moment pour planter un arbre, c'était il y a vingt ans. Le second meilleur moment, c'est maintenant.", auteur: "Proverbe zen" },
];

/**
 * Retourne une citation sans répétition jusqu'à épuisement du pool.
 * @returns {{ texte: string, auteur: string }}
 */
function pickCitation() {
  return MatriceStorage.pickUnique(CITATIONS, 'citations');
}
