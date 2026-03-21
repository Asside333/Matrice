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
    "Tu es debout dans une salle vide. Les murs sont couverts de tous les mots qu'on t'a jetés — 'pas assez', 'trop', 'jamais'. Tu lèves la main et, un par un, les mots tombent en poussière. Derrière, la lumière dorée de ta propre vérité apparaît.",
    "Imagine une armure invisible qui t'enveloppe. Pas rigide — souple, vivante. Elle filtre ce qui entre. Les critiques glissent, les encouragements passent. Tu es protégé par ta propre certitude.",
    "Tu es dans un atelier souterrain, taillé dans la pierre. Au centre, une enclume. Tu y déposes le doute, le regard des autres, la peur de ne pas être à la hauteur. Tu frappes une fois. L'acier sonne clair. Ce son est ta voix — nette, décidée, inaltérable. À chaque frappe, la confiance prend forme. Tu forges ton propre bouclier.",
    "Tu marches pieds nus sur un sentier de montagne à l'aube. L'air est frais, presque froid, mais chaque pas réchauffe la terre sous tes pieds. Tu sens la rosée, l'odeur de la roche humide. Au sommet, tu découvres que le brouillard est en dessous de toi. Tu es au-dessus des nuages. La clarté ici est absolue. Tu sais exactement qui tu es.",
  ],

  Abondance: [
    "Tu te vois dans un espace où tout ce dont tu as besoin est déjà là. Pas l'excès — la juste mesure. La table est mise. Le travail que tu fais résonne plus loin que tu ne le vois. L'argent, l'énergie, les connexions — tout circule. Tu n'attrapes pas. Tu accueilles. Tu te détends et tu reçois.",
    "Visualise une rivière claire qui coule à travers ta poitrine. Rien ne se bloque. Ce que tu donnes revient transformé. Les opportunités que tu ignores encore existent déjà, quelque part dans ce flux. Tu n'es pas en train de manquer quelque chose — tu es en train de t'ouvrir à ce qui vient.",
    "Pose une main sur ton ventre. Respire doucement dans cet espace. L'abondance n'est pas là-haut dans le futur. Elle est dans ce souffle, dans ce corps qui fonctionne, dans cette journée entière qui s'étend devant toi. Tu as assez. Tu es assez. Le reste vient.",
    "Imagine que la valeur que tu crées — par ton travail, ta présence, ta créativité — se répand en cercles dans le monde, comme des ondes sur l'eau. Chaque geste juste est une onde. Ces ondes reviennent un jour sous d'autres formes : une opportunité, une rencontre, une ressource au bon moment. Tu sèmes en ce moment.",
    "Vois-toi ouvrir les mains, paumes vers le haut. L'abondance tombe naturellement dans des mains ouvertes — pas dans des poings serrés. Aujourd'hui tu travailles, tu agis, tu contribues. Et tu fais confiance que ce que tu mérites trouve son chemin jusqu'à toi. Relâche le contrôle. Ouvre les mains.",
    "Visualise un arbre dont les racines plongent dans la terre et dont les branches touchent les nuages. Cet arbre, c'est toi. Chaque fruit qu'il porte est un projet, une relation, une idée. Les fruits mûrissent à leur rythme. Tu n'as pas besoin de les forcer.",
    "Tu marches dans un marché vibrant. Chaque étal déborde de possibilités. Tu n'as pas besoin de tout prendre — juste de savoir que tout est disponible. L'abondance n'est pas dans l'accumulation. Elle est dans la certitude qu'il y en a assez.",
    "Tu te trouves dans une clairière baignée de lumière dorée. Au centre, un puits ancien. Tu regardes dedans : au fond, pas de l'eau noire — de la lumière liquide. Tu plonges les mains dedans. Ce que tu remontes brille entre tes doigts. C'est tout ce que tu as semé sans le savoir — les gestes justes, les heures données, les silences qui ont porté. La récolte monte.",
    "Imagine un studio de musique dont chaque mur est fait de fréquences dorées. Les enceintes pulsent au rythme de ton coeur. Chaque beat que tu poses génère une onde qui se propage vers l'extérieur — la ville, le pays, le monde. Ton art est une monnaie qui circule sans perdre de valeur. Plus tu produis, plus l'univers te renvoie.",
  ],

  Connexion: [
    "Tu vois tous ceux que tu aimes dispersés dans la lumière. Chacun porte sa propre lutte, ses propres peurs — mais aussi sa propre force. Un fil invisible relie vos cœurs. Quand tu te sens seul, ce fil vibre encore. Tu n'es jamais vraiment seul. Tu fais partie de quelque chose de plus grand que ce que tu vois.",
    "Imagine une personne avec qui tu veux tisser un lien plus profond. Tu la regardes sans projection, sans attente — juste avec curiosité. Tu vois quelque chose de toi en elle. Elle voit quelque chose d'elle en toi. C'est ça, la vraie connexion : la reconnaissance. Laisse-la exister.",
    "Place ta conscience dans ton cœur. Sens-le battre. Chaque battement est une transmission — vers les gens proches, vers la ville, vers la planète. Tu n'es pas un individu isolé. Tu es un nœud dans un réseau vivant. Ce que tu rayonnes compte. Ce que tu reçois aussi.",
    "Visualise le moment de ta prochaine vraie conversation — pas une transaction, pas un échange d'informations, mais un moment où deux personnes se rencontrent vraiment. Tu arrives à cette conversation ouvert, curieux, sans agenda. Tu poses des questions que tu veux vraiment entendre. Quelque chose de réel peut se passer.",
    "Imagine que tu es assis en cercle avec les gens qui comptent pour toi. Personne ne parle. Vous êtes simplement là, ensemble, dans un silence confortable. Ce silence n'est pas vide — il est plein de tout ce qui n'a pas besoin d'être dit. La connexion la plus profonde existe au-delà des mots.",
    "Vois-toi tendre la main à quelqu'un qui lutte en silence. Tu ne cherches pas à réparer. Tu dis simplement : je te vois. Ce geste minuscule — reconnaître la présence de l'autre — est l'acte le plus puissant de connexion humaine.",
    "Imagine un pont de lumière entre ton cœur et celui de quelqu'un que tu aimes. Ce pont n'a pas besoin de mots, pas besoin de distance. Il existe en ce moment. Il vibre de tout ce que vous partagez sans le dire.",
    "Tu es assis devant un feu de camp avec des étrangers. Les flammes éclairent les visages. Quelqu'un commence à parler de sa peur. Puis un autre. Puis toi. Dans ce cercle, personne ne juge. Tout le monde comprend. La connexion naît dans la vulnérabilité partagée.",
    "Tu es dans la cuisine d'un appartement simple. Quelqu'un que tu aimes coupe des légumes en silence. La radio murmure une chanson que vous connaissez tous les deux. Personne ne parle. Vos corps bougent dans le même espace avec une fluidité naturelle. Ce moment banal contient plus d'amour que mille déclarations.",
    "Tu es assis sur un toit la nuit, les jambes dans le vide. À côté de toi, quelqu'un que tu ne verras peut-être plus jamais. Vous regardez les lumières de la ville. L'un de vous dit quelque chose de vrai — une phrase qui ne sera jamais répétée. Ce moment ne durera pas. C'est exactement ce qui le rend sacré.",
  ],

  Créativité: [
    "Il y a en toi une source qui n'est jamais à sec. Elle n'a pas besoin d'être parfaite. Elle a besoin d'être ouverte. Imagine une porte entrouverte dans ta poitrine et derrière elle — de la lumière en mouvement. Des formes, des mots, des sons. Tout ça t'appartient. Tu n'inventes pas. Tu te souviens.",
    "Tu es assis devant une feuille blanche, et au lieu de la peur, tu ressens de la curiosité. Que se passe-t-il si tu commences juste ? Juste par le premier mot, le premier trait, la première note ? La créativité ne demande pas la perfection — elle demande l'honnêteté. Ose être maladroit. C'est là que ça vit.",
    "Tes meilleures idées ne viennent pas quand tu les cherches. Elles arrivent dans les espaces : sous la douche, en marchant, juste avant de dormir. Aujourd'hui, crée ces espaces. Laisse ta tête se vider. La source coule seule quand tu arrêtes de la bloquer.",
    "Vois-toi finir quelque chose aujourd'hui. Pas parfaitement — terminé. Un projet, un paragraphe, une décision. Quelque chose qui était en suspens atterrit. Tu ressens le soulagement physique de l'accomplissement. Ce soulagement est réel. Il t'attend à l'autre bout de l'action.",
    "Imagine que ton travail créatif parle à quelqu'un que tu ne rencontreras jamais. Il le lit, l'entend ou le voit — et quelque chose en lui se déplace. Tu ne créeras peut-être jamais pour les masses. Mais ton œuvre peut changer une vie. Une seule. Est-ce que c'est suffisant ? Pour toi, la réponse est oui.",
    "Vois tes mains en train de façonner quelque chose — peu importe quoi. De l'argile, des mots, du code, de la musique. Tes mains savent. Elles ont une intelligence que ta tête ignore. Laisse-les guider.",
    "Tu entres dans un atelier silencieux. Tous tes outils sont là, rangés, prêts. Le temps n'existe pas dans cet espace. Il n'y a que toi et l'acte de créer. Commence par n'importe quoi. Le reste suivra.",
    "Tu es devant ta DAW, casque sur les oreilles. Le monde extérieur n'existe plus. Un kick pulse dans ton sternum. Un sub gronde sous tes pieds. Les breaks se construisent seuls, comme si la musique savait déjà où aller. Tu ne composes pas — tu canalises. Quand tu relèves la tête, trois heures ont passé en ce qui semblait être dix minutes.",
    "Tu es dans une bibliothèque circulaire, infinie. Chaque livre contient une idée que tu n'as pas encore eue. Tu en ouvres un au hasard : la première page est blanche. Puis les mots apparaissent sous tes yeux — c'est ton écriture. Tu es à la fois le lecteur et l'auteur. Tout ce que tu cherches est déjà en toi, attendant d'être formulé.",
  ],

  Paix: [
    "Tu es assis au bord d'un lac sans vent. La surface est parfaitement lisse. Elle reflète le ciel. Tu n'as rien à résoudre maintenant. Rien à réparer. Tu peux simplement être là, au bord de cette eau immobile, et laisser le silence faire son travail. La paix n'est pas l'absence de problème — c'est l'espace entre toi et le problème.",
    "Imagine que tu poses tous les fardeaux que tu portes — les inquiétudes, les listes, les conversations que tu n'as pas encore eues. Tu les poses délicatement sur le sol. Ils seront encore là quand tu reviendras les chercher, si tu le veux. Mais là, maintenant, tu as les mains libres. Comment c'est, les mains libres ?",
    "Descends dans ton corps. Ton ventre. Tes cuisses. Tes pieds sur le sol. Plus tu es dans le corps, moins tu es dans la tête. La paix habite le corps. Elle est toujours là, sous le bruit. Une respiration lente. Encore une. La surface du lac s'apaise.",
    "Vois-toi dans un endroit qui t'a déjà apaisé — une forêt, une plage, une chambre connue, un café familier. Laisse les détails apparaître : l'odeur, la lumière, la température. Ton cerveau ne fait pas vraiment la différence entre y être et s'en souvenir. Cette paix est disponible maintenant, ici, sans bouger.",
    "Imagine que le conflit intérieur qui t'agite en ce moment se dépose comme de la poussière dans un verre d'eau qu'on laisse reposer. Tu ne forces rien. Tu attends. Les particules descendent. L'eau s'éclaircit. La solution ou l'acceptation viendra d'elle-même — pas en cherchant plus fort, mais en cherchant moins.",
    "Tu es allongé dans une prairie. L'herbe est tiède. Le ciel est immense. Tu n'as rien à être, rien à prouver, nulle part où aller. Ce moment de rien est le moment le plus plein de ta journée.",
    "Imagine que chaque expiration emporte un peu du bruit intérieur. Pas de force. Juste le souffle qui fait le ménage. Après quelques respirations, le silence n'est plus vide — il est spacieux.",
    "Tu es au fond de l'océan. Pas de peur — une paix totale. La lumière du soleil descend en rayons obliques, silencieux, mouvants. Les bruits du monde sont devenus un bourdonnement lointain, presque doux. Tu flottes entre deux eaux, ni tombant ni montant. Le temps ici n'a aucune prise. Tu sens ton corps se relâcher fibre par fibre.",
    "Tu es dans un jardin japonais au crépuscule. L'eau d'un bassin reflète les dernières lueurs. Un poisson rouge passe sous la surface sans bruit. Le gravier est ratissé en cercles parfaits. Tu t'assieds sur une pierre tiède et tu ne penses à rien. Pas par effort — par débordement de calme. Le monde s'organise tout seul quand tu cesses de le forcer.",
  ],

  Puissance: [
    "Tu te vois debout, la colonne droite, les yeux clairs. Pas arrogant — ancré. Tu connais ce que tu vaux. Tu sais ce que tu es capable de faire. La puissance ne crie pas. Elle n'a pas besoin de se justifier. Elle occupe simplement l'espace qui lui revient. Occupe le tien, entièrement, aujourd'hui.",
    "Rappelle-toi un moment où tu as fait quelque chose de difficile et où tu t'en es sorti. Pas forcément brillamment — mais tu t'en es sorti. Cette version de toi est encore là. Elle n'est pas partie. Elle est prête. Tu es plus capable que tu ne te souviens de l'être quand tu doutes.",
    "Il y a une flamme dans ton ventre. Pas de la rage — de l'intention. Une direction. Quelque chose que tu veux construire, ou défendre, ou créer. Sens cette flamme. Elle ne demande pas la permission. Elle ne s'excuse pas d'exister. Aujourd'hui, laisse-la guider tes pas.",
    "La puissance n'est pas ce que tu fais aux autres — c'est ce que tu refuses de laisser les autres te faire. Ton espace intérieur t'appartient. Tes limites sont ta dignité. Aujourd'hui, vois-toi tenir ferme sur ce qui compte vraiment pour toi, avec calme et sans excuses.",
    "Vois-toi dans un an. Tu as maintenu le cap. Tu as fait ce que tu avais dit que tu ferais. Pas parfaitement — mais tu as continué. Les gens qui doutaient ont eu tort. Et ceux qui croyaient en toi avaient raison depuis le début. Cette personne existe. Elle est l'extension naturelle de qui tu es ce matin.",
    "Imagine un volcan en toi — pas destructeur, mais créateur. La lave coule lentement, façonne de nouvelles terres. Ta puissance n'a pas besoin d'exploser. Elle a besoin de couler, de construire, de transformer.",
    "Tu te tiens au sommet d'une montagne que tu as gravie seul. Le vent souffle. Tu ne cries pas victoire — tu observes. La vue depuis le sommet ne montre pas seulement où tu es. Elle montre tout le chemin parcouru.",
    "Tu es dans une arène vide. Pas de public, pas de juges. Juste toi et le silence. Tu sens chaque muscle de ton corps prêt. Tes pieds grippent le sol. Tes bras sont détendus. Tu n'as pas d'adversaire parce que tu as déjà gagné le seul combat qui compte — celui contre l'envie d'abandonner. L'arène est vide parce que tu n'as besoin de personne pour te valider.",
    "Imagine que tu te tiens devant un mur immense, couvert de toutes les raisons pour lesquelles tu ne devrais pas y arriver. Tu lis chaque ligne. Puis tu poses ta main à plat sur le mur. Il est chaud. Il vibre. Et sous ta paume, une fissure apparaît. Pas la violence — la pression constante. Le mur cède parce que tu refuses de reculer.",
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
