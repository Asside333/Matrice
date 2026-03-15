'use strict';

/* ================================================================
   MATRICE — Visualisations guidées (Module 4)
   15+ textes contextuels par intention
   ================================================================ */

const VISUALISATIONS = {
  Confiance: [
    "Tu te tiens debout dans une lumière dorée. Chaque respiration ancre tes pieds plus profondément dans la terre. Autour de toi, tout ce que tu as traversé — chaque doute, chaque chute — s'est transformé en racine. Tu n'as pas besoin de tout contrôler. Tu as confiance en ce qui arrive, parce que tu as confiance en toi.",
    "Imagine que tu parles à la version de toi dans dix ans. Elle te regarde avec des yeux doux. Elle sait ce que tu as construit. Elle sait que les moments de doute ont forgé quelque chose de solide. Tu n'es pas en train de te perdre — tu es en train de te trouver. Laisse cette certitude descendre dans tes épaules.",
    "Il y a en toi un axe que personne ne peut briser. Une colonne de lumière silencieuse qui traverse ton corps du bas du ventre jusqu'au sommet du crâne. Même quand tout doute, cet axe tient. Place une main sur ton sternum. Sens-le. C'est ça, ta confiance — pas une performance. Une présence.",
  ],

  Abondance: [
    "Tu te vois dans un espace où tout ce dont tu as besoin est déjà là. Pas l'excès — la juste mesure. La table est mise. Le travail que tu fais résonne plus loin que tu ne le vois. L'argent, l'énergie, les connexions — tout circule. Tu n'attrapes pas. Tu accueilles. Tu te détends et tu reçois.",
    "Visualise une rivière claire qui coule à travers ta poitrine. Rien ne se bloque. Ce que tu donnes revient transformé. Les opportunités que tu ignores encore existent déjà, quelque part dans ce flux. Tu n'es pas en train de manquer quelque chose — tu es en train de t'ouvrir à ce qui vient.",
    "Pose une main sur ton ventre. Respire doucement dans cet espace. L'abondance n'est pas là-haut dans le futur. Elle est dans ce souffle, dans ce corps qui fonctionne, dans cette journée entière qui s'étend devant toi. Tu as assez. Tu es assez. Le reste vient.",
  ],

  Connexion: [
    "Tu vois tous ceux que tu aimes dispersés dans la lumière. Chacun porte sa propre lutte, ses propres peurs — mais aussi sa propre force. Un fil invisible relie vos cœurs. Quand tu te sens seul, ce fil vibre encore. Tu n'es jamais vraiment seul. Tu fais partie de quelque chose de plus grand que ce que tu vois.",
    "Imagine une personne avec qui tu veux tisser un lien plus profond. Tu la regardes sans projection, sans attente — juste avec curiosité. Tu vois quelque chose de toi en elle. Elle voit quelque chose d'elle en toi. C'est ça, la vraie connexion : la reconnaissance. Laisse-la exister.",
    "Place ta conscience dans ton cœur. Sens-le battre. Chaque battement est une transmission — vers les gens proches, vers la ville, vers la planète. Tu n'es pas un individu isolé. Tu es un nœud dans un réseau vivant. Ce que tu rayonnes compte. Ce que tu reçois aussi.",
  ],

  Créativité: [
    "Il y a en toi une source qui n'est jamais à sec. Elle n'a pas besoin d'être parfaite. Elle a besoin d'être ouverte. Imagine une porte entrouverte dans ta poitrine et derrière elle — de la lumière en mouvement. Des formes, des mots, des sons. Tout ça t'appartient. Tu n'inventes pas. Tu te souviens.",
    "Tu es assis devant une feuille blanche, et au lieu de la peur, tu ressens de la curiosité. Que se passe-t-il si tu commences juste ? Juste par le premier mot, le premier trait, la première note ? La créativité ne demande pas la perfection — elle demande l'honnêteté. Ose être maladroit. C'est là que ça vit.",
    "Tes meilleures idées ne viennent pas quand tu les cherches. Elles arrivent dans les espaces : sous la douche, en marchant, juste avant de dormir. Aujourd'hui, crée ces espaces. Laisse ta tête se vider. La source coule seule quand tu arrêtes de la bloquer.",
  ],

  Paix: [
    "Tu es assis au bord d'un lac sans vent. La surface est parfaitement lisse. Elle reflète le ciel. Tu n'as rien à résoudre maintenant. Rien à réparer. Tu peux simplement être là, au bord de cette eau immobile, et laisser le silence faire son travail. La paix n'est pas l'absence de problème — c'est l'espace entre toi et le problème.",
    "Imagine que tu poses tous les fardeaux que tu portes — les inquiétudes, les listes, les conversations que tu n'as pas encore eues. Tu les poses délicatement sur le sol. Ils seront encore là quand tu reviendras les chercher, si tu le veux. Mais là, maintenant, tu as les mains libres. Comment c'est, les mains libres ?",
    "Descends dans ton corps. Ton ventre. Tes cuisses. Tes pieds sur le sol. Plus tu es dans le corps, moins tu es dans la tête. La paix habite le corps. Elle est toujours là, sous le bruit. Une respiration lente. Encore une. La surface du lac s'apaise.",
  ],

  Puissance: [
    "Tu te vois debout, la colonne droite, les yeux clairs. Pas arrogant — ancré. Tu connais ce que tu vaux. Tu sais ce que tu es capable de faire. La puissance ne crie pas. Elle n'a pas besoin de se justifier. Elle occupe simplement l'espace qui lui revient. Occupe le tien, entièrement, aujourd'hui.",
    "Rappelle-toi un moment où tu as fait quelque chose de difficile et où tu t'en es sorti. Pas forcément brillamment — mais tu t'en es sorti. Cette version de toi est encore là. Elle n'est pas partie. Elle est prête. Tu es plus capable que tu ne te souviens de l'être quand tu doutes.",
    "Il y a une flamme dans ton ventre. Pas de la rage — de l'intention. Une direction. Quelque chose que tu veux construire, ou défendre, ou créer. Sens cette flamme. Elle ne demande pas la permission. Elle ne s'excuse pas d'exister. Aujourd'hui, laisse-la guider tes pas.",
  ],
};

/**
 * Retourne une visualisation basée sur les intentions sélectionnées.
 * Si plusieurs intentions, choisit la première aléatoirement.
 * Évite de répéter le dernier texte affiché.
 *
 * @param {string[]} intentions — liste des intentions choisies
 * @param {string} [lastText] — dernier texte affiché (pour anti-répétition)
 * @returns {string}
 */
function pickVisualization(intentions, lastText = null) {
  const validIntentions = (intentions || []).filter(i => VISUALISATIONS[i]);

  let pool;
  if (validIntentions.length === 0) {
    // Fallback : Confiance
    pool = VISUALISATIONS.Confiance;
  } else {
    // Choisit une intention au hasard parmi les sélectionnées
    const key = validIntentions[Math.floor(Math.random() * validIntentions.length)];
    pool = VISUALISATIONS[key];
  }

  const candidates = pool.filter(t => t !== lastText);
  return candidates.length > 0
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : pool[Math.floor(Math.random() * pool.length)];
}
