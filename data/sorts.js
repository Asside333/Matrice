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
    {
      titre: "La Danse du Feu",
      texte: "Le feu danse. Il ne reste jamais immobile. Aujourd'hui, mets du mouvement dans tes actions. Pas la frénésie — la fluidité du feu qui cherche toujours vers le haut.",
      geste: "Secoue tes mains vigoureusement pendant 10 secondes, comme si tu les séchais. Sens l'énergie circuler. Tu viens de réveiller ton feu.",
    },
    {
      titre: "Forger l'Impossible",
      texte: "Le forgeron ne craint pas le métal brûlant. Il sait que ce qui résiste au marteau prend la meilleure forme. Ce qui te résiste aujourd'hui te forge.",
      geste: "Frappe doucement un poing dans l'autre paume, trois fois. Chaque frappe est une décision. La dernière est un engagement.",
    },
    {
      titre: "Le Cri Silencieux",
      texte: "Il y a des choses que tu portes sans les dire. Aujourd'hui, donne-leur une voix — pas un cri de douleur, mais un cri de naissance. Ce qui sort de ta gorge est plus vieux que toi.",
      geste: "Prononce à voix haute un son grave, long, depuis le ventre — un 'OM' ou simplement un 'AAAH'. Tiens 10 secondes. Sens la vibration dans ta poitrine et ton crâne.",
    },
    {
      titre: "Le Regard qui Brûle",
      texte: "Le feu le plus intense n'est pas dans les flammes visibles — il est dans le regard de celui qui sait ce qu'il veut. Aujourd'hui, regarde chaque situation avec cette intensité calme.",
      geste: "Fixe un point devant toi sans ciller pendant 20 secondes. Pas d'agressivité — de la concentration pure. Sens ton regard devenir un laser. Emporte cette précision dans ta journée.",
    },
    {
      titre: "Le Mot de Pouvoir",
      texte: "Il y a un mot en toi qui contient toute ta force. Un mot ancien, personnel, irréductible. Ce mot ne s'explique pas — il se crie. Il vibre dans ta cage thoracique avant de sortir. Aujourd'hui, donne-lui une voix.",
      geste: "Choisis un mot — ton prénom, 'maintenant', 'debout', ou n'importe quel mot qui résonne. Inspire profondément. Crie-le une seule fois, du ventre, à pleine voix. Sens la vibration dans tout ton corps. Le silence qui suit est ton territoire.",
    },
    {
      titre: "L'Oeil de la Flamme",
      texte: "Le feu hypnotise parce qu'il est vivant. Il danse sans se répéter. Regarde une flamme assez longtemps et tu oublies le temps, le doute, le bruit. Il ne reste que la présence pure.",
      geste: "Allume une bougie, un briquet, ou fixe l'image mentale d'une flamme. Regarde-la sans ciller pendant 30 secondes. Laisse tes yeux se détendre. La flamme nettoie ce qui encombre ton champ de vision intérieur.",
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
    {
      titre: "Le Sillon",
      texte: "Chaque sillon tracé dans la terre est un acte de foi — tu plantes sans savoir ce qui poussera. Aujourd'hui, fais confiance au processus. La récolte viendra.",
      geste: "Trace une ligne invisible devant toi avec le pied, lentement, comme si tu ouvrais un sillon. C'est ton chemin. Il commence ici.",
    },
    {
      titre: "Sel de la Terre",
      texte: "Le sel préserve, purifie, donne saveur. Tu es le sel de ton environnement — ta présence change la composition de chaque pièce où tu entres.",
      geste: "Frotte tes paumes ensemble puis passe-les sur tes bras, de l'épaule au poignet. Tu te nettoies. Tu te prépares.",
    },
    {
      titre: "Contact Originel",
      texte: "Tes ancêtres marchaient pieds nus. La terre sous eux n'était pas un sol — c'était un dialogue. Aujourd'hui, rétablis ce contact. Le béton a coupé la ligne. Tu la reconnectes.",
      geste: "Retire tes chaussures. Pose tes pieds nus sur le sol — même à l'intérieur. Sens la température, la texture. Reste 60 secondes en pleine conscience de ce contact. La terre te parle à travers tes pieds.",
    },
    {
      titre: "Les Mains qui Savent",
      texte: "Tes mains construisent des choses depuis des années. Elles tirent des câbles, elles tournent des potentiomètres, elles tiennent ceux que tu aimes. Elles savent avant ta tête. Aujourd'hui, fais-leur confiance.",
      geste: "Penche-toi et pose tes deux paumes à plat sur le sol ou sur une surface en bois. Sens la matière. Presse doucement. Tes mains se rechargent au contact de la terre. Reste 30 secondes.",
    },
    {
      titre: "La Marche Nue",
      texte: "Il y a quelque chose que le béton nous a volé : le dialogue entre la plante des pieds et la terre vivante. L'herbe, le gravier, la terre battue — chaque texture parle un langage différent. Aujourd'hui, sors et écoute avec tes pieds.",
      geste: "Sors dehors pieds nus — herbe, terre, gravier, peu importe. Marche lentement pendant 60 secondes. Sens chaque texture, chaque température. Chaque pas est une phrase dans une conversation millénaire entre ton corps et la planète.",
    },
    {
      titre: "La Pierre de Poche",
      texte: "Les anciens portaient des pierres. Pas par superstition — par ancrage. Un caillou dans la poche est un rappel constant : la terre est là, le sol est solide, tu es réel. Aujourd'hui, trouve ta pierre.",
      geste: "Ramasse un caillou — n'importe lequel, celui qui attire ta main. Tiens-le dans ta paume fermée pendant 30 secondes. Sens son poids, sa température, sa texture. Glisse-le dans ta poche. Chaque fois que ta main le touche aujourd'hui, tu reviens à toi.",
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
    {
      titre: "Le Souffle du Vent",
      texte: "Le vent porte les graines là où elles doivent tomber. Tes idées cherchent à se poser quelque part. Laisse-les voyager aujourd'hui — la bonne terre les accueillera.",
      geste: "Souffle doucement dans tes mains en coupe. Puis ouvre-les vers le ciel. Tu viens de libérer quelque chose.",
    },
    {
      titre: "L'Aigle et la Vue",
      texte: "L'aigle vole si haut qu'il voit le paysage entier. Aujourd'hui, prends de la hauteur. Ce qui semble un obstacle vu de près est un détail vu d'en haut.",
      geste: "Lève les yeux vers le point le plus haut que tu peux voir. Reste 10 secondes. Ton champ de vision s'élargit. Ta perspective aussi.",
    },
    {
      titre: "Le Souffle sur les Paumes",
      texte: "L'air que tu expires porte ton énergie, tes intentions, ta chaleur intérieure. Ce n'est pas du vent — c'est du toi rendu visible. Aujourd'hui, charge tes mains de cette énergie avant chaque action importante.",
      geste: "Rapproche tes paumes à 5 cm l'une de l'autre. Souffle doucement entre elles, un souffle long et chaud. Sens la chaleur humide. Frotte tes paumes ensemble. L'air que tu viens de charger est dans tes mains.",
    },
    {
      titre: "L'Ouverture Totale",
      texte: "Le vent ne peut entrer que dans un espace ouvert. Aujourd'hui, ouvre-toi — aux idées inattendues, aux rencontres imprévues, aux chemins que tu n'avais pas envisagés. La rigidité est l'ennemi. La souplesse est l'air.",
      geste: "Debout, ouvre les bras grand, paumes vers le ciel, tête légèrement relevée. Inspire profondément par le nez en élargissant la poitrine au maximum. Tiens 5 secondes. Expire en ramenant les bras lentement. Répète 3 fois.",
    },
    {
      titre: "Le Visage du Vent",
      texte: "Le vent est invisible mais tu sais qu'il est là. Il touche ton visage avant que ta tête ne le comprenne. Aujourd'hui, laisse le monde te toucher avant de le penser. Ressens d'abord. Analyse ensuite.",
      geste: "Sors dehors ou ouvre la fenêtre. Ferme les yeux. Tourne ton visage vers le courant d'air. Sens le vent sur ta peau — direction, température, force. Reste 30 secondes. Tu viens de te calibrer avec le monde extérieur.",
    },
    {
      titre: "L'Oreille de l'Eau",
      texte: "L'eau qui coule produit le son le plus ancien du monde. Avant les langues, avant la musique, il y avait ce son. Il calme le système nerveux comme rien d'autre parce que ton corps s'en souvient depuis toujours.",
      geste: "Ouvre un robinet. Écoute l'eau couler pendant 60 secondes — pas en bruit de fond, en écoute active. Ferme les yeux. Suis les variations du son. Puis ferme le robinet. Le silence qui suit est plus profond qu'avant.",
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
    {
      titre: "Les Larmes de la Terre",
      texte: "La pluie n'est pas de la tristesse — c'est la terre qui se renouvelle. Ce que tu ressens de lourd aujourd'hui est peut-être ton âme qui se nettoie pour faire de la place au neuf.",
      geste: "Passe tes doigts sur ton visage, de haut en bas, comme de l'eau qui coule. Trois fois. Tu laisses partir ce qui doit partir.",
    },
    {
      titre: "Le Courant Souterrain",
      texte: "Sous la surface de ta journée ordinaire coule un courant plus profond. L'intuition, le pressentiment, la sagesse du corps. Aujourd'hui, écoute ce courant.",
      geste: "Pose ta main sur ton ventre. Ferme les yeux. Demande : 'Qu'est-ce que mon corps sait que ma tête ignore ?' Attends la réponse.",
    },
    {
      titre: "Les Larmes du Guerrier",
      texte: "Les larmes ne sont pas une faiblesse. Elles sont de l'eau sacrée — elles nettoient ce que les mots ne peuvent pas atteindre. Le guerrier qui pleure est plus fort que celui qui retient, parce qu'il a le courage de se vider pour se remplir à nouveau.",
      geste: "Ferme les yeux. Si l'émotion monte, laisse-la venir. Si tes yeux s'humidifient, ne les essuie pas. Si rien ne vient, pose simplement les doigts sous tes yeux et imagine l'eau couler. Reste 30 secondes dans cette permission.",
    },
    {
      titre: "Le Baptême du Matin",
      texte: "L'eau sur le visage est le rituel le plus ancien du monde. Chaque civilisation a compris que l'eau purifie, réinitialise, remet les compteurs à zéro. Ce matin, tu te baptises toi-même.",
      geste: "Va au robinet. Prends de l'eau fraîche dans tes mains en coupe. Passe-la sur ton visage lentement, du front au menton. Sens chaque goutte. Tu viens de renaître à cette journée.",
    },
    {
      titre: "Le Souffle sur l'Eau",
      texte: "Souffler sur l'eau, c'est charger un élément avec un autre. L'air rencontre l'eau. L'intention rencontre l'émotion. Ce geste est plus vieux que toutes les religions — il est inscrit dans ton ADN.",
      geste: "Remplis un verre d'eau. Tiens-le à deux mains devant ta bouche. Souffle doucement sur la surface — un souffle long, lent, chargé d'intention. Regarde les rides à la surface. Puis bois cette eau lentement. Tu viens de boire ton propre souffle.",
    },
    {
      titre: "L'Éveil par le Froid",
      texte: "L'eau froide ne ment pas. Elle coupe net toute rumination, toute hésitation, toute complaisance. Elle dit : tu es là, maintenant, vivant. Le choc du froid est un reset brutal et bienveillant.",
      geste: "Ouvre le robinet d'eau froide. Plonge tes mains dedans jusqu'aux poignets. Tiens 30 secondes. Sens le froid remonter dans tes avant-bras. Ton coeur accélère. Ta respiration change. Tu es réveillé. Sèche tes mains lentement.",
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
    {
      titre: "Le Miroir Cosmique",
      texte: "Ce que tu vois dans le monde est le reflet de ce que tu portes en toi. Quand le monde te semble hostile, vérifie d'abord ton état intérieur. Quand il te semble beau, remercie ta lumière.",
      geste: "Regarde-toi dans un reflet — vitre, écran éteint, miroir. Regarde-toi dans les yeux pendant 10 secondes. Vois celui qui a traversé tout ça.",
    },
    {
      titre: "L'Infini dans l'Instant",
      texte: "Ce moment précis — maintenant — contient tout ce dont tu as besoin. Le passé est un souvenir, le futur une projection. Le seul point de pouvoir est ici, maintenant, dans ce souffle.",
      geste: "Arrête tout pendant 5 secondes. Ne bouge pas. Ne pense pas. Juste... être. Ces 5 secondes sont l'éternité compressée.",
    },
    {
      titre: "L'Immobilité Absolue",
      texte: "Avant le Big Bang, il y avait l'immobilité parfaite. Toute création naît du point zéro. Aujourd'hui, avant de créer, avant d'agir, avant de parler — trouve ce point zéro en toi. L'immobilité n'est pas l'absence d'énergie. C'est l'énergie compressée à l'infini.",
      geste: "Assieds-toi ou tiens-toi debout. Ne bouge absolument rien — pas les doigts, pas les yeux, pas la mâchoire. Respire le plus lentement possible. Reste dans cette immobilité totale pendant 2 minutes. Tu es le centre immobile autour duquel le monde tourne.",
    },
    {
      titre: "L'Écoute Pure",
      texte: "Il existe un son sous tous les sons — le bourdonnement de l'existence elle-même. Les mystiques l'appellent le Nada, le Son Primordial. Tu n'as pas besoin de le croire. Tu as besoin de l'écouter.",
      geste: "Bouche tes oreilles avec tes paumes, coudes relevés. Écoute le son intérieur — le sang, le souffle, le silence vivant. Reste 60 secondes. Ce que tu entends est toi, réduit à l'essentiel. Enlève les mains. Le monde extérieur revient, mais tu as touché le fond.",
    },
    {
      titre: "Le Regard Immobile",
      texte: "Les yeux bougent sans cesse — c'est le mental qui cherche. Quand les yeux s'immobilisent, le mental s'arrête. Ce n'est pas de la méditation. C'est de la mécanique : fixe le regard et le bruit intérieur baisse.",
      geste: "Choisis un point fixe — un objet, une tache sur le mur, l'horizon. Fixe-le sans bouger les yeux pendant 60 secondes. Ne cligne pas si tu peux. Laisse ta vision périphérique s'estomper. Le monde se réduit à ce point. Et dans cette réduction, tout s'apaise.",
    },
    {
      titre: "Le Son le Plus Lointain",
      texte: "L'éther connecte tout. Le son le plus lointain que tu puisses percevoir est la preuve que tu es relié au monde bien au-delà de ton corps. Ton champ de perception est plus vaste que tu ne le crois.",
      geste: "Ferme les yeux. Écoute. Repère le son le plus lointain que tu puisses percevoir — un avion, un oiseau, une route, le vent. Accroche-toi à ce son. Suis-le. Puis élargis encore. Cherche un son encore plus loin. Pendant 60 secondes, deviens une antenne. Tu es connecté à tout.",
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
