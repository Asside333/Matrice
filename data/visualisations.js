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
    "Vois-toi marcher dans une pièce inconnue et y entrer sans t'excuser. Pas arrogant — simplement présent. Tu prends ta place naturellement. Les gens te regardent non pas parce que tu as fait quelque chose d'extraordinaire, mais parce que tu n'as pas demandé la permission d'exister. Cette version de toi est accessible maintenant.",
    "Rappelle-toi la dernière fois où tu as fait quelque chose qui te faisait peur — et où tu t'en es sorti. Pas forcément bien — sorti. Cette expérience a déposé quelque chose dans ton corps. Une mémoire musculaire de survivance. Elle est encore là. Elle dit : tu as fait ça avant. Tu peux recommencer.",
  ],

  Abondance: [
    "Tu te vois dans un espace où tout ce dont tu as besoin est déjà là. Pas l'excès — la juste mesure. La table est mise. Le travail que tu fais résonne plus loin que tu ne le vois. L'argent, l'énergie, les connexions — tout circule. Tu n'attrapes pas. Tu accueilles. Tu te détends et tu reçois.",
    "Visualise une rivière claire qui coule à travers ta poitrine. Rien ne se bloque. Ce que tu donnes revient transformé. Les opportunités que tu ignores encore existent déjà, quelque part dans ce flux. Tu n'es pas en train de manquer quelque chose — tu es en train de t'ouvrir à ce qui vient.",
    "Pose une main sur ton ventre. Respire doucement dans cet espace. L'abondance n'est pas là-haut dans le futur. Elle est dans ce souffle, dans ce corps qui fonctionne, dans cette journée entière qui s'étend devant toi. Tu as assez. Tu es assez. Le reste vient.",
    "Imagine que la valeur que tu crées — par ton travail, ta présence, ta créativité — se répand en cercles dans le monde, comme des ondes sur l'eau. Chaque geste juste est une onde. Ces ondes reviennent un jour sous d'autres formes : une opportunité, une rencontre, une ressource au bon moment. Tu sèmes en ce moment.",
    "Vois-toi ouvrir les mains, paumes vers le haut. L'abondance tombe naturellement dans des mains ouvertes — pas dans des poings serrés. Aujourd'hui tu travailles, tu agis, tu contribues. Et tu fais confiance que ce que tu mérites trouve son chemin jusqu'à toi. Relâche le contrôle. Ouvre les mains.",
  ],

  Connexion: [
    "Tu vois tous ceux que tu aimes dispersés dans la lumière. Chacun porte sa propre lutte, ses propres peurs — mais aussi sa propre force. Un fil invisible relie vos cœurs. Quand tu te sens seul, ce fil vibre encore. Tu n'es jamais vraiment seul. Tu fais partie de quelque chose de plus grand que ce que tu vois.",
    "Imagine une personne avec qui tu veux tisser un lien plus profond. Tu la regardes sans projection, sans attente — juste avec curiosité. Tu vois quelque chose de toi en elle. Elle voit quelque chose d'elle en toi. C'est ça, la vraie connexion : la reconnaissance. Laisse-la exister.",
    "Place ta conscience dans ton cœur. Sens-le battre. Chaque battement est une transmission — vers les gens proches, vers la ville, vers la planète. Tu n'es pas un individu isolé. Tu es un nœud dans un réseau vivant. Ce que tu rayonnes compte. Ce que tu reçois aussi.",
    "Visualise le moment de ta prochaine vraie conversation — pas une transaction, pas un échange d'informations, mais un moment où deux personnes se rencontrent vraiment. Tu arrives à cette conversation ouvert, curieux, sans agenda. Tu poses des questions que tu veux vraiment entendre. Quelque chose de réel peut se passer.",
    "Imagine que tu es assis en cercle avec les gens qui comptent pour toi. Personne ne parle. Vous êtes simplement là, ensemble, dans un silence confortable. Ce silence n'est pas vide — il est plein de tout ce qui n'a pas besoin d'être dit. La connexion la plus profonde existe au-delà des mots.",
    "Vois-toi tendre la main à quelqu'un qui lutte en silence. Tu ne cherches pas à réparer. Tu dis simplement : je te vois. Ce geste minuscule — reconnaître la présence de l'autre — est l'acte le plus puissant de connexion humaine.",
  ],

  Créativité: [
    "Il y a en toi une source qui n'est jamais à sec. Elle n'a pas besoin d'être parfaite. Elle a besoin d'être ouverte. Imagine une porte entrouverte dans ta poitrine et derrière elle — de la lumière en mouvement. Des formes, des mots, des sons. Tout ça t'appartient. Tu n'inventes pas. Tu te souviens.",
    "Tu es assis devant une feuille blanche, et au lieu de la peur, tu ressens de la curiosité. Que se passe-t-il si tu commences juste ? Juste par le premier mot, le premier trait, la première note ? La créativité ne demande pas la perfection — elle demande l'honnêteté. Ose être maladroit. C'est là que ça vit.",
    "Tes meilleures idées ne viennent pas quand tu les cherches. Elles arrivent dans les espaces : sous la douche, en marchant, juste avant de dormir. Aujourd'hui, crée ces espaces. Laisse ta tête se vider. La source coule seule quand tu arrêtes de la bloquer.",
    "Vois-toi finir quelque chose aujourd'hui. Pas parfaitement — terminé. Un projet, un paragraphe, une décision. Quelque chose qui était en suspens atterrit. Tu ressens le soulagement physique de l'accomplissement. Ce soulagement est réel. Il t'attend à l'autre bout de l'action.",
    "Imagine que ton travail créatif parle à quelqu'un que tu ne rencontreras jamais. Il le lit, l'entend ou le voit — et quelque chose en lui se déplace. Tu ne créeras peut-être jamais pour les masses. Mais ton œuvre peut changer une vie. Une seule. Est-ce que c'est suffisant ? Pour toi, la réponse est oui.",
  ],

  Paix: [
    "Tu es assis au bord d'un lac sans vent. La surface est parfaitement lisse. Elle reflète le ciel. Tu n'as rien à résoudre maintenant. Rien à réparer. Tu peux simplement être là, au bord de cette eau immobile, et laisser le silence faire son travail. La paix n'est pas l'absence de problème — c'est l'espace entre toi et le problème.",
    "Imagine que tu poses tous les fardeaux que tu portes — les inquiétudes, les listes, les conversations que tu n'as pas encore eues. Tu les poses délicatement sur le sol. Ils seront encore là quand tu reviendras les chercher, si tu le veux. Mais là, maintenant, tu as les mains libres. Comment c'est, les mains libres ?",
    "Descends dans ton corps. Ton ventre. Tes cuisses. Tes pieds sur le sol. Plus tu es dans le corps, moins tu es dans la tête. La paix habite le corps. Elle est toujours là, sous le bruit. Une respiration lente. Encore une. La surface du lac s'apaise.",
    "Vois-toi dans un endroit qui t'a déjà apaisé — une forêt, une plage, une chambre connue, un café familier. Laisse les détails apparaître : l'odeur, la lumière, la température. Ton cerveau ne fait pas vraiment la différence entre y être et s'en souvenir. Cette paix est disponible maintenant, ici, sans bouger.",
    "Imagine que le conflit intérieur qui t'agite en ce moment se dépose comme de la poussière dans un verre d'eau qu'on laisse reposer. Tu ne forces rien. Tu attends. Les particules descendent. L'eau s'éclaircit. La solution ou l'acceptation viendra d'elle-même — pas en cherchant plus fort, mais en cherchant moins.",
  ],

  Puissance: [
    "Tu te vois debout, la colonne droite, les yeux clairs. Pas arrogant — ancré. Tu connais ce que tu vaux. Tu sais ce que tu es capable de faire. La puissance ne crie pas. Elle n'a pas besoin de se justifier. Elle occupe simplement l'espace qui lui revient. Occupe le tien, entièrement, aujourd'hui.",
    "Rappelle-toi un moment où tu as fait quelque chose de difficile et où tu t'en es sorti. Pas forcément brillamment — mais tu t'en es sorti. Cette version de toi est encore là. Elle n'est pas partie. Elle est prête. Tu es plus capable que tu ne te souviens de l'être quand tu doutes.",
    "Il y a une flamme dans ton ventre. Pas de la rage — de l'intention. Une direction. Quelque chose que tu veux construire, ou défendre, ou créer. Sens cette flamme. Elle ne demande pas la permission. Elle ne s'excuse pas d'exister. Aujourd'hui, laisse-la guider tes pas.",
    "La puissance n'est pas ce que tu fais aux autres — c'est ce que tu refuses de laisser les autres te faire. Ton espace intérieur t'appartient. Tes limites sont ta dignité. Aujourd'hui, vois-toi tenir ferme sur ce qui compte vraiment pour toi, avec calme et sans excuses.",
    "Vois-toi dans un an. Tu as maintenu le cap. Tu as fait ce que tu avais dit que tu ferais. Pas parfaitement — mais tu as continué. Les gens qui doutaient ont eu tort. Et ceux qui croyaient en toi avaient raison depuis le début. Cette personne existe. Elle est l'extension naturelle de qui tu es ce matin.",
  ],
};

/**
 * Retourne une visualisation sans répétition jusqu'à épuisement du pool.
 * Si plusieurs intentions, choisit une intention aléatoirement.
 *
 * @param {string[]} intentions — liste des intentions choisies
 * @returns {string}
 */
function pickVisualization(intentions) {
  const validIntentions = (intentions || []).filter(i => VISUALISATIONS[i]);

  const key = validIntentions.length > 0
    ? validIntentions[Math.floor(Math.random() * validIntentions.length)]
    : 'Confiance';

  return MatriceStorage.pickUnique(VISUALISATIONS[key], 'visualisations.' + key);
}
