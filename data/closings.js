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
  ],

  terre: [
    "Ce que tu plantes ce matin germe dans le silence. Fais confiance au processus.",
    "La montagne ne craint pas la tempête. Sois cette montagne.",
    "Tu repars avec les pieds ancrés et les mains ouvertes. C'est tout ce qu'il faut.",
    "Le rituel est terminé. Le travail continue, mais différemment — depuis le calme.",
  ],

  air: [
    "Emporte avec toi la clarté de ce matin. Reviens-y chaque fois que la confusion monte.",
    "Les idées d'aujourd'hui ont de l'espace pour voler. Laisse-les.",
    "Tu as respiré, tu as vu, tu as entendu. C'est suffisant pour changer la direction d'une journée.",
    "Ce qui doit se dire se dira. Ce qui doit s'entendre s'entendra. Fais confiance au flux.",
  ],

  eau: [
    "La rivière sait toujours où aller. Laisse la tienne couler.",
    "Tout ce que tu as posé ce matin dans l'eau de la conscience — ça infuse. Sois patient.",
    "Tu n'as pas besoin de savoir comment. Tu as besoin d'avancer en direction de ce que tu sais.",
    "Le lâcher-prise n'est pas une faiblesse. C'est la seule façon de vraiment tenir quelque chose.",
  ],

  ether: [
    "Ce silence que tu as touché ce matin — il est toujours là, sous tout le reste.",
    "Tu es plus vaste que tes problèmes. Rappelle-toi-en une fois par heure.",
    "Tout est déjà là. Tu apprends à le voir.",
    "Le rituel se termine. La présence, elle, reste.",
  ],

  generic: [
    "Tu arrives à cette journée calibré. Ce n'est pas rien.",
    "Tu as pris le temps pour toi ce matin. C'est un acte de résistance et d'amour.",
    "Reviens ici demain. L'instrument se perfectionne par la pratique.",
    "Chaque rituel est une couche. Les couches s'accumulent. Le champ se renforce.",
    "Tu n'avais pas besoin d'être parfait ce matin. Tu avais juste besoin d'être là.",
    "Va. Reviens. C'est la seule promesse que tu dois tenir.",
    "Ce matin tu t'es choisi. Continue de te choisir tout au long de la journée.",
  ],
};

/**
 * Retourne une phrase de clôture pour un élément donné.
 * @param {string} [elementKey] — clé d'élément ou null pour générique
 * @returns {string}
 */
function pickClosing(elementKey = null) {
  const pool = (elementKey && CLOSINGS[elementKey])
    ? [...CLOSINGS[elementKey], ...CLOSINGS.generic]
    : CLOSINGS.generic;
  return pool[Math.floor(Math.random() * pool.length)];
}
