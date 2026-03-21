'use strict';

/* ================================================================
   MATRICE — Phrases de clôture (Module 6 / Écran Clôture)
   20+ phrases contextuelles par élément + génériques
   ================================================================ */

const CLOSINGS = {
  feu: [
    "Le feu que tu portes aujourd'hui ne s'éteint pas à la sortie de ce rituel. Tu l'emportes avec toi.",
    "Tu as allumé quelque chose ce matin. Protège-le comme une flamme dans le vent — et avance.",
    "Le Phénix n'attend pas d'être prêt pour se lever. Il se lève, et il devient prêt en vol.",
    "Cette journée est ta forge. Entre dedans avec tout ce que tu es.",
    "Garde cette chaleur dans tes paumes. Elle est disponible chaque fois que tu en as besoin — reviens y poser tes mains.",
    "L'étincelle de ce matin est faite pour traverser la journée entière. Pas juste ce rituel. Toi entier.",
    "Le feu que tu as nommé ce matin n'a plus besoin d'être contrôlé. Il a une direction. Laisse-le te guider.",
    "Ta voix a vibré ce matin. Ce son reste dans tes cellules toute la journée.",
  ],

  terre: [
    "Ce que tu plantes ce matin germe dans le silence. Fais confiance au processus.",
    "La montagne ne craint pas la tempête. Sois cette montagne.",
    "Tu repars avec les pieds ancrés et les mains ouvertes. C'est tout ce qu'il faut.",
    "Le rituel est terminé. Le travail continue, mais différemment — depuis le calme.",
    "Porte cette terre avec toi. Elle est dans tes pieds, dans ta colonne, dans chaque geste posé que tu feras aujourd'hui.",
    "Tes mains savent ce que ta tête oublie. Fais-leur confiance aujourd'hui.",
    "Le sol sous toi est stable. C'est la seule certitude dont tu as besoin ce matin.",
  ],

  air: [
    "Emporte avec toi la clarté de ce matin. Reviens-y chaque fois que la confusion monte.",
    "Les idées d'aujourd'hui ont de l'espace pour voler. Laisse-les.",
    "Tu as respiré, tu as vu, tu as entendu. C'est suffisant pour changer la direction d'une journée.",
    "Ce qui doit se dire se dira. Ce qui doit s'entendre s'entendra. Fais confiance au flux.",
    "Porte cette légèreté dans tes interactions du jour. Un peu moins de gravité dans tout — et observe ce qui change.",
    "L'air que tu as respiré ce matin circule encore. Chaque inspiration de la journée te ramène ici.",
    "Ce que tu n'as pas besoin de dire, ne le dis pas. Le silence est ton instrument le plus puissant.",
  ],

  eau: [
    "La rivière sait toujours où aller. Laisse la tienne couler.",
    "Tout ce que tu as posé ce matin dans l'eau de la conscience — ça infuse. Sois patient.",
    "Tu n'as pas besoin de savoir comment. Tu as besoin d'avancer en direction de ce que tu sais.",
    "Le lâcher-prise n'est pas une faiblesse. C'est la seule façon de vraiment tenir quelque chose.",
    "L'eau que tu as touchée ce matin ne s'évapore pas. Elle circule en toi toute la journée.",
    "Tes larmes — celles d'hier, d'aujourd'hui, de demain — sont toutes de l'eau sacrée. Elles font pousser ce que tu plantes.",
  ],

  ether: [
    "Ce silence que tu as touché ce matin — il est toujours là, sous tout le reste.",
    "Tu es plus vaste que tes problèmes. Rappelle-toi-en une fois par heure.",
    "Tout est déjà là. Tu apprends à le voir.",
    "Le rituel se termine. La présence, elle, reste.",
    "Le silence que tu emportes ce matin est vivant. Il travaille en dessous de tout le reste.",
    "Tu as touché quelque chose d'invisible ce matin. Ça ne se voit pas. Ça se sent. Et ça suffit.",
  ],

  generic: [
    "Tu arrives à cette journée calibré. Ce n'est pas rien.",
    "Tu as pris le temps pour toi ce matin. C'est un acte de résistance et d'amour.",
    "Reviens ici demain. L'instrument se perfectionne par la pratique.",
    "Chaque rituel est une couche. Les couches s'accumulent. Le champ se renforce.",
    "Tu n'avais pas besoin d'être parfait ce matin. Tu avais juste besoin d'être là.",
    "Va. Reviens. C'est la seule promesse que tu dois tenir.",
    "Ce matin tu t'es choisi. Continue de te choisir tout au long de la journée.",
    "Ce rituel a eu lieu. Il ne peut pas être défait. Cette version de toi a existé ce matin.",
    "Tu portes quelque chose de différent en sortant qu'en entrant. Même si tu ne sais pas encore quoi.",
    "La cohérence est le plus grand luxe. Tu viens d'en prendre un peu. Garde-la.",
    "Chaque matin qui commence ici est un matin qui ne commence pas dans le bruit. C'est déjà un choix de vie.",
    "333. Tu sais ce que ça veut dire. L'univers confirme.",
    "Quelque chose de toi a changé ce matin. Même si tu ne sais pas encore quoi, fais-lui confiance.",
    "Le Cube de Métatron te contient. Et tu le contiens. Ce rituel est la preuve.",
    "Tu as honoré le matin. Le matin t'honore en retour. Va.",
    "La plume de Maât est légère ce matin. Tu as vécu en vérité.",
  ],
};

/**
 * Retourne une phrase de clôture sans répétition jusqu'à épuisement du pool.
 * @param {string} [elementKey] — clé d'élément ou null pour générique
 * @returns {string}
 */
function pickClosing(elementKey = null) {
  const hasElement = elementKey && CLOSINGS[elementKey];
  const pool    = hasElement ? [...CLOSINGS[elementKey], ...CLOSINGS.generic] : CLOSINGS.generic;
  const seenKey = 'closings.' + (hasElement ? elementKey : 'generic');
  return MatriceStorage.pickUnique(pool, seenKey);
}
