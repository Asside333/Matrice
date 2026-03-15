'use strict';

/**
 * Yi King / I Ching - Les 64 Hexagrammes
 * =======================================
 * Structure : chaque hexagramme contient son numéro, son nom chinois, son nom français,
 * ses traits (bas vers haut, 1=yang/plein, 0=yin/brisé), un conseil court et une
 * interprétation complète, tous deux rédigés en français.
 *
 * Trigrammes de référence (bas vers haut) :
 *   Qian=111, Dui=110, Li=101, Zhen=100,
 *   Xun=011, Kan=010, Gen=001, Kun=000
 *
 * Sources : Wilhelm/Baynes, Legge, tradition classique chinoise.
 */

const YIKING = [
  {
    number: 1,
    nameChinese: 'Qián',
    nameFrench: 'Le Créatif',
    traits: [1, 1, 1, 1, 1, 1], // Qian / Qian
    shortAdvice: "Tu portes en toi une force créatrice immense — ne la retiens pas par peur du jugement. Agis avec une intention pure et une volonté ferme, car le ciel soutient ceux qui osent créer. C'est le moment d'initier, de prendre les rênes de ta destinée.",
    fullInterpretation: "Le Créatif représente la puissance originelle du yang, l'élan vital qui donne forme à toutes choses. Tu es appelé à incarner cette force dans ta vie quotidienne : dans ton travail, tes relations, tes projets. Ne te laisse pas paralyser par le doute — la créativité authentique naît de l'alignement entre ta vision intérieure et ton action extérieure. Comme le ciel tourne sans relâche au-dessus de la terre, tu dois persévérer avec constance et noblesse d'âme. Cultive ta vertu intérieure et le monde reconnaîtra naturellement ton autorité.",
  },
  {
    number: 2,
    nameChinese: 'Kūn',
    nameFrench: 'Le Réceptif',
    traits: [0, 0, 0, 0, 0, 0], // Kun / Kun
    shortAdvice: "Apprends à recevoir sans résister — la force de la terre réside dans son accueil total. Laisse venir ce qui vient, soutiens ce qui t'est confié, sans chercher à dominer ou à précéder. Ta puissance est dans la douceur et la constance silencieuse.",
    fullInterpretation: "Le Réceptif est la grande matrice du yin, la terre nourricière qui accueille et fait fructifier toute semence. Dans ta vie, cet hexagramme t'invite à développer l'art de l'écoute, de la patience et du service généreux. Il ne s'agit pas de passivité, mais d'une force immense qui sait se laisser traverser par les événements sans se briser. Comme la terre porte toutes choses sans distinction, tu es appelé à soutenir les autres avec une fidélité sans condition. Confie-toi au rythme naturel des choses et tu verras tes efforts porter des fruits durables.",
  },
  {
    number: 3,
    nameChinese: 'Zhūn',
    nameFrench: 'La Difficulté initiale',
    traits: [1, 0, 0, 0, 1, 0], // Zhen / Kan
    shortAdvice: "Toute naissance est douloureuse — ne confonds pas la difficulté du début avec un signe d'échec. Tiens bon dans le chaos initial, cherche de l'aide autour de toi et avance pas à pas. La graine qui perce la terre sait que l'effort en vaut la peine.",
    fullInterpretation: "La Difficulté initiale évoque le chaos primordial d'où émergent toutes les nouvelles réalités. Tu traverses peut-être une période de démarrage difficile : un projet qui peine à décoller, une relation qui cherche ses fondations, une vie qui se réorganise après une rupture. C'est normal et même nécessaire — rien de grand ne naît sans résistance. Organise-toi, cherche des alliés fiables et ne prends pas de décisions précipitées sous la pression. La patience et la méthode sont tes meilleures armes en ce moment.",
  },
  {
    number: 4,
    nameChinese: 'Méng',
    nameFrench: 'La Folie juvénile',
    traits: [0, 1, 0, 0, 0, 1], // Kan / Gen
    shortAdvice: "Reconnais humblement ce que tu ne sais pas encore — c'est le premier pas vers la vraie sagesse. Ne t'obstine pas dans l'erreur par orgueil ; le vrai disciple apprend de chaque chute. Accepte d'être guidé et ta croissance sera rapide.",
    fullInterpretation: "La Folie juvénile parle de l'inexpérience et de la nécessité d'apprendre. Il y a en toi une énergie brute, enthousiaste, mais encore mal orientée. Cet hexagramme t'invite à te rapprocher d'un maître, d'un mentor, ou simplement d'une sagesse plus ancienne que la tienne. L'ignorance n'est pas une honte en elle-même — la honte serait de refuser de voir ses propres angles morts. Sois curieux, pose des questions sans craindre de paraître naïf, et la brume de la confusion se dissipera peu à peu.",
  },
  {
    number: 5,
    nameChinese: 'Xū',
    nameFrench: "L'Attente",
    traits: [1, 1, 1, 0, 1, 0], // Qian / Kan
    shortAdvice: "Le temps juste n'est pas encore arrivé — agir dans la précipitation serait gaspiller ta force. Nourris-toi, repose-toi, prépare-toi intérieurement pendant cette période d'attente. La confiance en l'avenir est elle-même une forme d'action.",
    fullInterpretation: "L'Attente n'est pas la résignation, mais une foi active dans le bon moment. Comme les nuages s'accumulent avant la pluie qui fertilisera la terre, tu dois accepter une phase de préparation que rien ne peut accélérer. Dans ta vie, cela peut concerner une décision professionnelle, une relation qui mûrit lentement, ou un projet qui nécessite encore des ressources. Utilise ce temps pour te fortifier : lis, rencontre des gens, prends soin de ton corps et de ton esprit. Quand le moment viendra, tu seras pleinement prêt à agir.",
  },
  {
    number: 6,
    nameChinese: 'Sòng',
    nameFrench: 'Le Conflit',
    traits: [0, 1, 0, 1, 1, 1], // Kan / Qian
    shortAdvice: "Avant de t'engager dans un conflit, demande-toi honnêtement quelle part de responsabilité tu portes. La victoire dans une dispute coûte souvent plus qu'elle ne rapporte — cherche un compromis ou un médiateur. Cultive la paix intérieure plutôt que d'avoir raison.",
    fullInterpretation: "Le Conflit avertit du danger des affrontements prolongés. Tu ressens peut-être une injustice, une tension avec un collègue, un partenaire ou une institution. Mais cet hexagramme te demande de ne pas t'entêter : même si tu as raison sur le fond, l'escalade du conflit te coûtera davantage que ce que tu espères gagner. Cherche à résoudre les différends tôt, par le dialogue et si possible avec l'aide d'un tiers impartial. La vraie force ne se prouve pas en écrasant l'adversaire, mais en maintenant ta dignité tout en trouvant une issue sage.",
  },
  {
    number: 7,
    nameChinese: 'Shī',
    nameFrench: "L'Armée",
    traits: [0, 1, 0, 0, 0, 0], // Kan / Kun
    shortAdvice: "Pour mener les autres, tu dois d'abord te maîtriser toi-même. Une cause juste a besoin d'une direction claire — assume ton leadership avec discipline et humanité. Ceux qui te suivent ont besoin de voir en toi à la fois la force et la bienveillance.",
    fullInterpretation: "L'Armée parle de l'organisation, du leadership et de la mobilisation collective pour un but commun. Dans ta vie, tu es peut-être amené à coordonner une équipe, à diriger un projet ou à prendre la tête d'une situation difficile. La clé réside dans la légitimité de ta cause et la clarté de ta vision. Un bon leader ne s'impose pas par la peur, mais par la compétence et l'exemple. Assure-toi que les personnes qui t'entourent comprennent le sens de leur engagement et tu verras leur dévouement se multiplier.",
  },
  {
    number: 8,
    nameChinese: 'Bǐ',
    nameFrench: "L'Union",
    traits: [0, 0, 0, 0, 1, 0], // Kun / Kan
    shortAdvice: "Rapproche-toi de ceux qui partagent tes valeurs — l'union sincère est une force que rien ne peut briser. Ne reste pas isolé par orgueil ou peur d'être blessé ; les liens authentiques nourrissent l'âme. Choisis bien à qui tu t'associes, puis engage-toi pleinement.",
    fullInterpretation: "L'Union célèbre la solidarité, la loyauté et la cohésion entre les êtres. Cet hexagramme t'invite à examiner la qualité de tes alliances : sont-elles fondées sur la confiance mutuelle, des valeurs communes, un soutien réciproque ? Il est temps de consolider tes relations importantes et peut-être d'en abandonner certaines qui te drainent sans te nourrir. Rejoindre un groupe, une communauté ou un partenariat peut être exactement ce dont tu as besoin. La véritable union demande que tu t'ouvres sans arrière-pensée, avec sincérité.",
  },
  {
    number: 9,
    nameChinese: 'Xiǎo Xù',
    nameFrench: 'La Petite Accumulation',
    traits: [1, 1, 1, 0, 1, 1], // Qian / Xun
    shortAdvice: "Les grandes choses se construisent par petites touches — ne sous-estime pas la puissance du détail et de la régularité. Accumule des forces, affine tes plans, mais n'essaie pas encore de tout changer d'un coup. La patience fine est ta plus grande alliée en ce moment.",
    fullInterpretation: "La Petite Accumulation décrit un moment où la grande action n'est pas encore possible, mais où de petits progrès constants sont accessibles. Le vent doux retient les nuages sans encore les libérer en pluie — l'énergie est là, mais le moment décisif n'est pas venu. Dans ta vie, concentre-toi sur l'amélioration progressive : peaufine un projet, améliore une compétence, soigne une relation. Ces petits efforts cumulés créeront une base solide pour un grand déploiement futur. Reste attentif aux détails et fais confiance au processus.",
  },
  {
    number: 10,
    nameChinese: 'Lǚ',
    nameFrench: 'La Conduite',
    traits: [1, 1, 0, 1, 1, 1], // Dui / Qian
    shortAdvice: "Avance avec précaution et respect — même dans des situations risquées, la bonne attitude te protège. Sois conscient de ta position et de celle des autres avant d'agir. La courtoisie et la maîtrise de soi sont tes sauvegardes.",
    fullInterpretation: "La Conduite — marcher sur la queue d'un tigre — illustre la nécessité d'une conduite irréprochable dans les situations délicates. Tu évolues peut-être dans un environnement où une erreur de comportement pourrait avoir de grandes conséquences. Cet hexagramme t'enseigne l'importance des formes, du protocole et du respect des hiérarchies, non par soumission aveugle, mais par intelligence sociale. Sois sincère, joyeux dans l'attitude, et cela désamorcera bien des tensions. Ta façon d'agir vaut autant que ce que tu fais.",
  },
  {
    number: 11,
    nameChinese: 'Tài',
    nameFrench: 'La Paix',
    traits: [1, 1, 1, 0, 0, 0], // Qian / Kun
    shortAdvice: "Une période d'harmonie et d'abondance s'ouvre à toi — accueille-la pleinement et sans culpabilité. Profites-en pour consolider ce qui compte vraiment, car les cycles changent toujours. Partage ta chance avec générosité et prépare-toi sereinement aux temps plus difficiles.",
    fullInterpretation: "La Paix est l'un des hexagrammes les plus favorables du Yi King : le ciel et la terre communiquent, le yin et le yang s'harmonisent parfaitement. Tu traverses ou tu approches une période de fluidité, où tes projets avancent, tes relations s'épanouissent et ta santé rayonne. Ce n'est pas le moment de te reposer sur tes lauriers, mais de construire et de semener pour l'avenir avec une sage prévoyance. Fais preuve de modestie dans le succès et de générosité envers ceux qui t'entourent. La paix durable se mérite par la vertu autant que par la chance.",
  },
  {
    number: 12,
    nameChinese: 'Pǐ',
    nameFrench: 'La Stagnation',
    traits: [0, 0, 0, 1, 1, 1], // Kun / Qian
    shortAdvice: "Quand les voies sont bloquées, la sagesse consiste à ne pas forcer et à préserver ton énergie. Retire-toi intérieurement, reste fidèle à tes valeurs même quand le monde semble fermé. Cette stagnation est temporaire — garde la flamme allumée en toi.",
    fullInterpretation: "La Stagnation décrit un temps où la communication est coupée, les échanges bloqués, et les efforts semblent vains. Le ciel et la terre se sont éloignés l'un de l'autre. Dans ta vie, tu ressens peut-être une impasse professionnelle, une relation qui ne progresse plus, ou un sentiment d'isolement profond. Ce n'est pas le moment d'agir avec force — c'est le moment de te retirer, de réfléchir et de préserver ton intégrité. Les petites gens prospèrent dans ces temps d'obscurité, mais les sages savent que la lumière reviendra et s'y préparent discrètement.",
  },
  {
    number: 13,
    nameChinese: 'Tóng Rén',
    nameFrench: 'La Fraternité',
    traits: [1, 0, 1, 1, 1, 1], // Li / Qian
    shortAdvice: "Ouvre ton cœur aux autres sans distinction — la vraie communauté transcende les clans et les préférences. Cherche ce qui unit plutôt que ce qui divise, et tu découvriras des alliés insoupçonnés. La fraternité authentique est une force transformatrice.",
    fullInterpretation: "La Fraternité célèbre la communauté humaine fondée sur des valeurs universelles plutôt que sur l'intérêt particulier. Tu es appelé à sortir de ta zone de confort relationnel et à t'engager avec des personnes différentes de toi. Cet hexagramme est particulièrement favorable aux associations, aux projets collectifs et aux causes communes. Pour que cette fraternité soit durable, elle doit être ouverte à tous — non réservée à un cercle fermé. Cultive la transparence, la loyauté et la capacité à dépasser les malentendus par le dialogue.",
  },
  {
    number: 14,
    nameChinese: 'Dà Yǒu',
    nameFrench: 'La Grande Possession',
    traits: [1, 1, 1, 1, 0, 1], // Qian / Li
    shortAdvice: "Tu as accès à d'immenses ressources — matérielles, intellectuelles ou relationnelles. Gère-les avec sagesse et sans attachement excessif, car la vraie richesse est dans le partage. Reste humble devant ce que la vie t'accorde.",
    fullInterpretation: "La Grande Possession est un hexagramme de plénitude et d'abondance : le feu du soleil brille au-dessus du ciel, illuminant tout. Tu disposes peut-être de moyens importants, d'une influence ou d'un talent exceptionnel. La sagesse de cet hexagramme est de te rappeler que cette possession n'est pas une fin en soi, mais un outil au service d'un idéal plus grand. Éloigne de toi l'arrogance et la cupidité — ce sont les seuls ennemis qui pourraient renverser ta fortune. Partage généreusement et administre avec équité ce que tu possèdes.",
  },
  {
    number: 15,
    nameChinese: 'Qiān',
    nameFrench: 'La Modestie',
    traits: [0, 0, 1, 0, 0, 0], // Gen / Kun
    shortAdvice: "La vraie grandeur sait se faire discrète — ne cherche pas à t'imposer, laisse tes actes parler pour toi. La modestie n'est pas la faiblesse ; c'est la sagesse de celui qui connaît sa valeur sans avoir besoin de la prouver. Abaisse-toi et tu seras élevé.",
    fullInterpretation: "La Modestie est l'un des hexagrammes les plus vertueux du Yi King — le seul dont tous les traits sont favorables. La montagne s'abaisse sous la terre, cachant sa grandeur. Dans ta vie, cela t'invite à ne pas chercher la reconnaissance ou les honneurs, mais à accomplir ton travail avec conscience et discrétion. Les personnes véritablement modestes attirent naturellement le respect et la confiance des autres. Que tu aies réussi ou échoué, accueille les deux avec le même équilibre : c'est la marque d'une âme accomplie.",
  },
  {
    number: 16,
    nameChinese: 'Yù',
    nameFrench: "L'Enthousiasme",
    traits: [0, 0, 0, 1, 0, 0], // Kun / Zhen
    shortAdvice: "Laisse ton enthousiasme être contagieux — il a le pouvoir de mobiliser les gens autour de toi. Mais veille à ce que ton élan repose sur quelque chose de solide, pas seulement sur l'excitation du moment. La musique des âmes alignées crée des miracles.",
    fullInterpretation: "L'Enthousiasme est l'énergie du tonnerre qui s'éveille au-dessus de la terre : une énergie puissante, contagieuse et mobilisatrice. Tu ressens peut-être un regain de motivation, une vision claire de ce que tu veux accomplir, et une capacité à entraîner les autres dans ton sillage. C'est le moment idéal pour lancer des initiatives, inspirer ton entourage et avancer avec joie. Cependant, garde les pieds sur terre : l'enthousiasme sans discipline peut mener à la dispersion. Canalise cette belle énergie dans des projets concrets et durables.",
  },
  {
    number: 17,
    nameChinese: 'Suí',
    nameFrench: 'Le Suivi',
    traits: [1, 0, 0, 1, 1, 0], // Zhen / Dui
    shortAdvice: "Sois assez souple pour suivre le mouvement naturel des choses plutôt que de t'y opposer. L'adaptation intelligente n'est pas une capitulation — c'est l'art de saisir le courant favorable au bon moment. Ce qui suit les rythmes de la nature prospère.",
    fullInterpretation: "Le Suivi enseigne l'art de s'adapter et de se laisser porter par les tendances naturelles du moment. Il ne s'agit pas de subir passivement, mais de reconnaître quand il vaut mieux suivre que mener. Dans ta vie, tu peux avoir à accepter une nouvelle direction imposée par les circonstances, ou à te rallier à une idée qui n'est pas la tienne initialement. Si tu le fais avec sincérité et en restant fidèle à tes valeurs, tu en sortiras grandi. Le vrai leader sait aussi suivre au bon moment.",
  },
  {
    number: 18,
    nameChinese: 'Gǔ',
    nameFrench: 'Le Travail sur le Corrompu',
    traits: [0, 1, 1, 0, 0, 1], // Xun / Gen
    shortAdvice: "Quelque chose s'est corrompu dans ta vie — un schéma hérité, une habitude toxique, une situation qui s'est dégradée. C'est le moment courageux d'y faire face et de réparer, sans fuir dans le déni. Le nettoyage profond est douloureux, mais il libère.",
    fullInterpretation: "Le Travail sur le Corrompu décrit une situation qui s'est détériorée par négligence, erreur ou héritage du passé. Il peut s'agir d'un problème dans ta famille, une organisation mal gérée, ou des habitudes ancrées qui te freinent. Cet hexagramme ne te juge pas — il t'appelle à l'action correctrice avec méthode et courage. Commence par comprendre les causes profondes avant d'agir, puis avance avec détermination. Le renouveau profond exige que tu regardes en face ce qui ne fonctionne plus.",
  },
  {
    number: 19,
    nameChinese: 'Lín',
    nameFrench: "L'Approche",
    traits: [1, 1, 0, 0, 0, 0], // Dui / Kun
    shortAdvice: "Une période favorble s'annonce — approche les gens et les situations avec chaleur et bienveillance. C'est le moment d'agir, d'aller vers les autres, de saisir les opportunités qui se présentent. Ta présence bienveillante est elle-même une force d'attraction.",
    fullInterpretation: "L'Approche évoque la montée de la lumière en hiver, le retour du yang après l'obscurité. Une période de croissance et d'expansion s'ouvre devant toi. Dans tes projets professionnels, tes relations personnelles ou ta vie intérieure, il est temps de prendre des initiatives positives et d'aller à la rencontre de ce que tu désires. La supervision bienveillante — prendre soin de ceux qui dépendent de toi — est aussi mise en avant. Agis avec générosité et tu créeras des liens qui dureront.",
  },
  {
    number: 20,
    nameChinese: 'Guān',
    nameFrench: 'La Contemplation',
    traits: [0, 0, 0, 0, 1, 1], // Kun / Xun
    shortAdvice: "Prends du recul et observe — avant d'agir, comprends réellement ce qui se passe autour de toi. Sois toi-même un exemple qui inspire par sa présence silencieuse et sa profondeur. La vraie contemplation transforme autant celui qui regarde que ce qui est regardé.",
    fullInterpretation: "La Contemplation est l'hexagramme de l'observation, de la méditation et de l'influence exercée par l'exemple. Comme le vent balaie la terre, ta présence et ta façon d'être influencent subtilement tout ce qui t'entoure. Tu es peut-être à un moment de ta vie où tu dois t'arrêter pour réfléchir, faire un bilan, saisir la nature profonde d'une situation. Regarde aussi comment les autres te perçoivent — leur regard peut t'apprendre quelque chose sur toi-même. La contemplation nourrit l'action juste.",
  },
  {
    number: 21,
    nameChinese: 'Shì Kè',
    nameFrench: 'Mordre à travers',
    traits: [1, 0, 0, 1, 0, 1], // Zhen / Li
    shortAdvice: "Il y a un obstacle entre toi et ce que tu cherches — il faut l'affronter directement, sans détour. Parfois, seule une décision ferme et un peu de force permettent de trancher ce qui bloque. N'évite plus ce que tu dois résoudre.",
    fullInterpretation: "Mordre à travers décrit la nécessité de surmonter un obstacle par une action décisive, comme on mord à travers quelque chose de dur pour accéder à la nourriture. Dans ta vie, il y a probablement une situation que tu remets à plus tard, un problème que tu contournes plutôt que de le résoudre. Cet hexagramme t'appelle à agir avec clarté et fermeté — que ce soit pour mettre fin à une situation injuste, confronter un mensonge ou prendre une décision difficile. La justice et la vérité sont au cœur de ce processus. Agis, et la voie s'ouvrira.",
  },
  {
    number: 22,
    nameChinese: 'Bì',
    nameFrench: 'La Grâce',
    traits: [1, 0, 1, 0, 0, 1], // Li / Gen
    shortAdvice: "Prends soin de la forme autant que du fond — la beauté et l'élégance ont leur propre valeur et leur propre message. Mais ne te laisse pas séduire par les apparences au point de négliger l'essentiel. La vraie grâce rayonne de l'intérieur.",
    fullInterpretation: "La Grâce parle de la beauté, de l'élégance et de l'esthétique dans la vie. La lumière du feu illumine le flanc de la montagne — tout devient beau, mais temporairement. Cet hexagramme t'invite à soigner la forme de ce que tu fais : la présentation de tes idées, l'harmonie de ton espace, la qualité de tes manières. La beauté extérieure est une expression de la richesse intérieure. Cependant, garde à l'esprit que la grâce est un ornement, non un substitut à la substance — ce que tu fais doit aussi avoir de la profondeur.",
  },
  {
    number: 23,
    nameChinese: 'Bō',
    nameFrench: "L'Éclatement",
    traits: [0, 0, 0, 0, 0, 1], // Kun / Gen
    shortAdvice: "Ce qui devait tomber tombe — n'essaie pas de retenir ce qui est déjà perdu. Accepte cette période de dépouillement comme une purification nécessaire avant un renouveau. Ta force est de rester digne et ancré pendant la dissolution.",
    fullInterpretation: "L'Éclatement décrit un temps de désintégration où les structures anciennes s'effondrent. La montagne solitaire domine un sol yin qui monte et érode tout. Tu traverses peut-être une perte, une fin de cycle, une période où beaucoup semble se défaire autour de toi. Ce n'est pas le moment d'agir avec force — c'est le moment de lâcher prise avec sagesse et d'accepter la transformation. Les seuls qui traversent bien ces périodes sont ceux qui s'appuient sur leurs valeurs profondes plutôt que sur les circonstances extérieures.",
  },
  {
    number: 24,
    nameChinese: 'Fù',
    nameFrench: 'Le Retour',
    traits: [1, 0, 0, 0, 0, 0], // Zhen / Kun
    shortAdvice: "La lumière revient après l'obscurité — accueille ce renouveau avec douceur et sans précipitation. Tu sens en toi quelque chose qui se ranime, une direction qui redevient claire. Fais confiance à ce premier souffle de renouveau, il porte une promesse réelle.",
    fullInterpretation: "Le Retour est l'hexagramme du solstice d'hiver : la première ligne yang réapparaît dans les ténèbres, annonçant le retour de la lumière. Dans ta vie, tu ressens peut-être un regain de vitalité, un retour à tes vraies valeurs après une période d'égarement, ou simplement la fin d'une longue période difficile. Ce retour doit être doux et mesuré — comme la nature après l'hiver, reprends tes forces progressivement. C'est le moment de te reconnecter à ce qui compte vraiment pour toi et de repartir sur des bases saines.",
  },
  {
    number: 25,
    nameChinese: 'Wú Wàng',
    nameFrench: "L'Innocence",
    traits: [1, 0, 0, 1, 1, 1], // Zhen / Qian
    shortAdvice: "Agis avec sincérité et sans calcul — l'intention pure attire naturellement ce dont tu as besoin. Ne cherche pas à contrôler l'issue de tes actions ; fais ce qui est juste et laisse le ciel faire le reste. L'innocence est la force des cœurs droits.",
    fullInterpretation: "L'Innocence — sans fausseté — décrit l'état de celui qui agit en accord parfait avec sa nature profonde et la volonté du ciel. C'est une façon d'être dans le monde où l'on ne cherche pas à manipuler ou à calculer, mais à agir spontanément avec intégrité. Dans ta vie, cet hexagramme t'invite à te débarrasser des stratégies compliquées et des arrière-pensées. Reviens à la simplicité et à la droiture. Si tu agis ainsi, les événements se dérouleront favorablement — non parce que tu les auras forcés, mais parce que tu seras en harmonie avec le mouvement naturel des choses.",
  },
  {
    number: 26,
    nameChinese: 'Dà Xù',
    nameFrench: 'La Grande Accumulation',
    traits: [1, 1, 1, 0, 0, 1], // Qian / Gen
    shortAdvice: "Tu accumules une énergie considérable — des savoirs, des forces, des ressources. Veille à ne pas la laisser se disperser avant d'être prêt à l'utiliser pleinement. La maîtrise de soi est le signe des grandes âmes.",
    fullInterpretation: "La Grande Accumulation est l'hexagramme du sage qui a retenu et maîtrisé une énergie immense avant de l'utiliser à bon escient. Comme la montagne retient le ciel créateur, tu as la capacité de dompter de grandes forces. Dans ta vie, cela peut concerner une accumulation de connaissances, d'expériences, d'économies ou de liens. La tentation est de dépenser trop tôt — résiste à cette impatience. Plus tu cultives la retenue et la discipline, plus l'impact de ton action sera décisif quand le bon moment viendra.",
  },
  {
    number: 27,
    nameChinese: 'Yí',
    nameFrench: 'Les Coins de la Bouche',
    traits: [1, 0, 0, 0, 0, 1], // Zhen / Gen
    shortAdvice: "Fais attention à ce que tu ingères — nourriture, paroles, informations, influences. Ce que tu nourris en toi façonne ce que tu deviens. Sois aussi attentif à nourrir les autres avec sagesse et générosité.",
    fullInterpretation: "Les Coins de la Bouche parlent de la nourriture au sens large : ce dont on se nourrit physiquement, mentalement et spirituellement. Tu es invité à examiner tes habitudes : ce que tu manges, ce que tu lis, ce que tu écoutes, les conversations que tu entretiens. Tout cela façonne ton énergie et ton caractère. De même, regarde comment tu nourris les autres — tes paroles et tes actes sont-ils nourrissants ou épuisants pour ceux qui t'entourent ? La sagesse consiste à nourrir ce qui est vrai, beau et bon, en soi et autour de soi.",
  },
  {
    number: 28,
    nameChinese: 'Dà Guò',
    nameFrench: 'La Prépondérance du Grand',
    traits: [0, 1, 1, 1, 1, 0], // Xun / Dui
    shortAdvice: "Tu portes plus que tu ne peux longtemps soutenir — la poutre est sur le point de se briser. Il te faut alléger la charge, déléguer, ou trouver une voie extraordinaire avant que la situation ne s'effondre. Le courage ici est d'admettre que tu es à ta limite.",
    fullInterpretation: "La Prépondérance du Grand décrit une situation de crise où la pression est trop forte pour les structures en place. La poutre centrale fléchit. Dans ta vie, tu traverses peut-être une période d'épuisement, de surcharge, où des décisions extraordinaires sont nécessaires pour éviter l'effondrement. Cet hexagramme n'est pas une catastrophe — c'est un appel à l'innovation et au courage. Les grandes crises produisent souvent des solutions brillantes. Cherche une issue créative, peu conventionnelle, et n'aie pas peur d'agir de façon inhabituelle.",
  },
  {
    number: 29,
    nameChinese: 'Kǎn',
    nameFrench: "L'Insondable",
    traits: [0, 1, 0, 0, 1, 0], // Kan / Kan
    shortAdvice: "Tu es dans le gouffre — mais l'eau traverse toujours l'obstacle en restant fidèle à sa nature. Ne te débats pas contre le danger : garde ton cœur droit et avance prudemment, pas après pas. La constance dans l'épreuve est ta seule voie de sortie.",
    fullInterpretation: "L'Insondable est l'eau qui se déverse dans le vide, symbole de l'épreuve profonde et du danger répété. Tu traverses peut-être une période particulièrement difficile : des obstacles s'accumulent, les solutions semblent hors de portée. Cet hexagramme t'enseigne une leçon essentielle : l'eau ne s'arrête pas devant l'obstacle, elle le contourne en restant eau. Maintiens ta nature profonde, ton intégrité et ta clarté intérieure, même au cœur du chaos. La confiance en soi et la fidélité à ses valeurs sont les seules bouées dans ce tourbillon.",
  },
  {
    number: 30,
    nameChinese: 'Lí',
    nameFrench: 'La Flamme',
    traits: [1, 0, 1, 1, 0, 1], // Li / Li
    shortAdvice: "Brille de ta lumière propre, mais sache que toute flamme a besoin d'un support pour durer. Clarifie ce à quoi tu t'attaches — tes valeurs, tes amours, tes objectifs — et reste-y fidèle. La clarté que tu dégages guidera et réchauffera ceux qui t'entourent.",
    fullInterpretation: "La Flamme — le feu qui s'attache — symbolise la lumière, la clarté et la dépendance consciente. Comme une flamme ne peut brûler sans combustible, tout être humain a besoin de se lier à quelque chose de plus grand que lui. Dans ta vie, cet hexagramme t'invite à clarifier tes attachements essentiels : à qui, à quoi tu te lies vraiment ? Cette clarté sera ta force. Ta lumière intérieure peut illuminer les autres — mais seulement si tu restes connecté à ce qui te nourrit. Évite la confusion et les engagements superficiels.",
  },
  {
    number: 31,
    nameChinese: 'Xián',
    nameFrench: "L'Influence",
    traits: [0, 0, 1, 1, 1, 0], // Gen / Dui
    shortAdvice: "L'attraction véritable ne se force pas — elle rayonne naturellement de l'ouverture du cœur. Laisse-toi toucher par l'autre sans calculer ; la réciprocité naît de la sincérité. Tes relations les plus profondes commencent par une vraie sensibilité à l'autre.",
    fullInterpretation: "L'Influence décrit le mouvement d'attraction mutuelle entre le lac et la montagne, entre le jeune homme et la jeune femme. C'est l'hexagramme par excellence des relations amoureuses, des affinités électives et de l'influence subtile que les êtres exercent les uns sur les autres. Dans ta vie, tu ressens peut-être une attirance forte, ou tu cherches à influencer quelqu'un. La leçon ici est que la vraie influence vient d'une disponibilité totale, d'une sensibilité ouverte — pas de la manipulation. Vide ton esprit de toute stratégie et laisse la rencontre se faire naturellement.",
  },
  {
    number: 32,
    nameChinese: 'Héng',
    nameFrench: 'La Durée',
    traits: [0, 1, 1, 1, 0, 0], // Xun / Zhen
    shortAdvice: "Ce qui dure vraiment ne vient pas de l'obstination, mais de la souplesse dans la constance. Reste fidèle à ce qui est essentiel, mais adapte ta forme aux circonstances changeantes. La durée n'est pas l'immobilité — c'est l'engagement vivant.",
    fullInterpretation: "La Durée est l'hexagramme du mariage, des engagements à long terme et de la constance dans le changement. Comme le vent et le tonnerre se soutiennent mutuellement, les couples durables savent s'adapter ensemble. Dans ta vie, cela concerne tes engagements les plus importants : une relation, une vocation, un projet de vie. La clé de la durée n'est pas la rigidité, mais la capacité à rester fidèle à l'essence de ton engagement tout en évoluant dans sa forme. Ce qui ne change jamais est ce qui finit par mourir.",
  },
  {
    number: 33,
    nameChinese: 'Dùn',
    nameFrench: 'La Retraite',
    traits: [0, 0, 1, 1, 1, 1], // Gen / Qian
    shortAdvice: "Il faut parfois reculer pour mieux avancer — la retraite stratégique est un acte de courage et d'intelligence. Ne te laisse pas entraîner dans une lutte que tu ne peux pas gagner maintenant. Préserve tes forces pour le moment où ta présence sera vraiment efficace.",
    fullInterpretation: "La Retraite est l'art de savoir se retirer à temps, avant d'être épuisé ou débordé. Ce n'est pas la fuite — c'est la sagesse militaire et spirituelle de ne pas gaspiller son énergie dans des combats perdus d'avance. Dans ta vie, tu peux avoir à prendre de la distance vis-à-vis d'une situation toxique, d'une relation épuisante, ou d'un projet qui n'est pas le bon. Cette retraite doit être dignement faite, sans slamm de portes ni rancoeur. Elle préserve ton intégrité et ta force pour des batailles plus importantes.",
  },
  {
    number: 34,
    nameChinese: 'Dà Zhuàng',
    nameFrench: 'La Grande Force',
    traits: [1, 1, 1, 1, 0, 0], // Qian / Zhen
    shortAdvice: "Tu as une force immense en ce moment — veille à la diriger avec sagesse plutôt qu'avec brutalité. La vraie puissance n'a pas besoin de s'imposer ; elle convainc par sa justesse. Agis, mais assure-toi que chaque geste est aligné avec le droit.",
    fullInterpretation: "La Grande Force est l'hexagramme du tonnerre dans le ciel : une énergie yang puissante, montante, presque irrésistible. Tu te sens peut-être en plein élan, invincible, prêt à bousculer tous les obstacles. Cette force est réelle et précieuse — mais un bélier qui force une haie peut s'y coincer les cornes. La puissance sans discernement mène à l'échec. Oriente ta grande énergie vers ce qui est juste et nécessaire, avec méthode. La maîtrise de la force est le signe de la vraie puissance.",
  },
  {
    number: 35,
    nameChinese: 'Jìn',
    nameFrench: 'La Progression',
    traits: [0, 0, 0, 1, 0, 1], // Kun / Li
    shortAdvice: "Tu avances vers la lumière — accepte cette progression avec gratitude et sans précipitation. Chaque pas accompli en plein jour, avec transparence, consolide ton ascension. Ta clarté intérieure est ce qui attire l'opportunité à toi.",
    fullInterpretation: "La Progression décrit le soleil qui s'élève au-dessus de la terre, répandant sa lumière progressivement. Tu traverses une période d'ascension naturelle : dans ta carrière, ta vie sociale ou ton développement personnel. Cette progression est d'autant plus belle qu'elle se fait dans la lumière — avec honnêteté, transparence et un vrai mérite. Ne cherche pas à brûler les étapes en usant de compromis douteux. Ta montée sera régulière si tu restes fidèle à ta lumière intérieure. L'estime des autres viendra naturellement.",
  },
  {
    number: 36,
    nameChinese: 'Míng Yí',
    nameFrench: "L'Obscurcissement de la lumière",
    traits: [1, 0, 1, 0, 0, 0], // Li / Kun
    shortAdvice: "Dans un environnement sombre ou hostile, cache ta lumière pour la préserver. Ce n'est pas le moment de briller ouvertement — c'est le moment de la discrétion et de la résistance intérieure. Garde ta flamme intacte, même entourée d'obscurité.",
    fullInterpretation: "L'Obscurcissement de la lumière décrit le soleil qui sombre sous la terre — un temps où la clarté est supprimée, parfois par des forces extérieures malveillantes ou simplement par des circonstances défavorables. Tu te trouves peut-être dans un environnement professionnel ou personnel toxique, où ta véritable valeur n'est pas reconnue, voire activement niée. La sagesse ici est de ne pas te révolter ouvertement — protège ta lumière intérieure et attends le moment où tu pourras à nouveau la manifester librement. La persévérance dans l'adversité est une noble vertu.",
  },
  {
    number: 37,
    nameChinese: 'Jiā Rén',
    nameFrench: 'La Famille',
    traits: [1, 0, 1, 0, 1, 1], // Li / Xun
    shortAdvice: "La santé de ta vie extérieure commence par l'ordre dans ta sphère la plus proche. Prends soin de ta maison, de tes relations les plus intimes, de l'atmosphère que tu crées autour de toi. Ce que tu cultives chez toi se répand dans le monde.",
    fullInterpretation: "La Famille est l'hexagramme de la cellule de base de la société : le foyer, les rôles de chacun et les liens qui nous fondent. Il met en lumière l'importance d'une communication authentique et d'une autorité bienveillante au sein du cercle familial. Dans ta vie, cela t'invite à prêter attention à la qualité de tes relations proches : les non-dits, les tensions latentes, les rôles mal définis. Une famille harmonieuse repose sur la parole juste et le respect mutuel des rôles. Commence par être exemplaire dans ton propre comportement à la maison.",
  },
  {
    number: 38,
    nameChinese: 'Kuí',
    nameFrench: "L'Opposition",
    traits: [1, 1, 0, 1, 0, 1], // Dui / Li
    shortAdvice: "La différence n'est pas l'ennemi — c'est une richesse quand on sait la regarder avec curiosité plutôt qu'avec méfiance. Dans les petites choses, l'opposition peut être féconde ; cherche ce qui unit malgré tout. La rencontre des contraires crée quelque chose de nouveau.",
    fullInterpretation: "L'Opposition décrit un moment de malentendus, de divergences et d'incompréhensions mutuelles. Comme le feu monte et l'eau descend, certaines personnes ou situations semblent fondamentalement aller dans des directions opposées aux tiennes. Dans les grandes choses, la séparation est inévitable — mais dans les petites, il reste possible de collaborer malgré les différences. Cherche les points d'accord plutôt que d'insister sur les désaccords. La polarité créatrice — deux forces opposées qui coopèrent — peut produire des résultats extraordinaires.",
  },
  {
    number: 39,
    nameChinese: 'Jiǎn',
    nameFrench: "L'Obstruction",
    traits: [0, 0, 1, 0, 1, 0], // Gen / Kan
    shortAdvice: "Quand la route est bloquée, cherche d'abord la cause en toi-même avant de blâmer les circonstances. L'obstacle extérieur est souvent le reflet d'un blocage intérieur. Retourne-toi, regarde-toi honnêtement, et la voie se rouvrira.",
    fullInterpretation: "L'Obstruction décrit un chemin semé d'obstacles qui semblent insurmontables. L'eau se heurte à la montagne. Dans ta vie, des obstacles majeurs te barrent peut-être la route — dans ta carrière, une relation ou un projet. La sagesse de cet hexagramme est de te demander : que puis-je apprendre de cette obstruction ? Y a-t-il quelque chose en moi qui contribue à cette situation ? Le regard intérieur et l'aide de personnes de sagesse autour de toi sont tes meilleures ressources. Certains obstacles appellent le recul, pas l'assaut frontal.",
  },
  {
    number: 40,
    nameChinese: 'Jiě',
    nameFrench: 'La Délivrance',
    traits: [0, 1, 0, 1, 0, 0], // Kan / Zhen
    shortAdvice: "La tension se relâche — profite de cette libération pour repartir allégé, sans traîner le passé avec toi. Pardonne vite, agis promptement pour résoudre ce qui reste, puis avance. La délivrance est un cadeau — ne l'alourdit pas de rancœurs inutiles.",
    fullInterpretation: "La Délivrance est le soulagement après la tempête, la dissolution des tensions accumulées. Comme le tonnerre et la pluie libèrent l'atmosphère lourde, une période difficile touche à sa fin dans ta vie. C'est le moment de te libérer des fardeaux inutiles — rancunes, erreurs passées, relations épuisantes. Agis rapidement pour régler les derniers points en suspens, pardonne généreusement et reparts léger. Ne complique pas cette libération en cherchant des vengeances ou des explications exhaustives. La simplicité et le mouvement en avant sont la sagesse du moment.",
  },
  {
    number: 41,
    nameChinese: 'Sǔn',
    nameFrench: 'La Diminution',
    traits: [1, 1, 0, 0, 0, 1], // Dui / Gen
    shortAdvice: "Moins peut être plus — apprends la joie de la sobriété et de l'essentiel. Ce que tu sacrifies sincèrement maintenant reviendra sous une forme plus pure et plus durable. La vraie offrande vient du cœur, pas de l'abondance.",
    fullInterpretation: "La Diminution enseigne la valeur du sacrifice consenti et de la simplification. Tu traverses peut-être une période où tu dois te serrer la ceinture, donner davantage que tu ne reçois, ou renoncer à quelque chose qui te tenait à cœur. Si cette diminution est consentie et sincère, elle porte en elle les germes d'une future augmentation. La joie dans le peu est une forme de sagesse rare. Consacre ton énergie à enrichir ton monde intérieur — c'est une richesse que rien ne peut te prendre.",
  },
  {
    number: 42,
    nameChinese: 'Yì',
    nameFrench: "L'Augmentation",
    traits: [1, 0, 0, 0, 1, 1], // Zhen / Xun
    shortAdvice: "Tu reçois un surplus — redistribue-le généreusement, car c'est ainsi que se perpétue l'abondance. Chaque bonne action accomplie maintenant portera des fruits décuplés. Saisis les opportunités de croître et d'aider simultanément.",
    fullInterpretation: "L'Augmentation est un hexagramme très favorable : le vent nourrit le tonnerre, l'énergie se démultiplie. Dans ta vie, une période de croissance, d'expansion et de chance s'annonce. C'est le moment d'agir, d'entreprendre, de faire des dons généreux et de traverser les grandes eaux — c'est-à-dire de prendre des risques calculés. Mais la véritable augmentation implique que ta prospérité bénéficie aussi à ceux qui t'entourent. Agir pour le bien commun pendant ces périodes favorables est ce qui en fait un succès durable.",
  },
  {
    number: 43,
    nameChinese: 'Guài',
    nameFrench: 'La Percée',
    traits: [1, 1, 1, 1, 1, 0], // Qian / Dui
    shortAdvice: "Il est temps de parler clairement et publiquement de ce qui doit être résolu. Affronte l'obscurité en toi et dans ta situation avec une honnêteté totale — sans haine, mais sans faiblesse. La percée vient de la clarté et du courage de nommer la vérité.",
    fullInterpretation: "La Percée décrit le moment décisif où cinq lignes yang poussent vers la sortie une seule ligne yin — l'élimination du mal ou de l'erreur par la force du bien. Dans ta vie, il y a quelque chose qui doit être dit, décidé ou fait — une vérité à proclamer, une mauvaise habitude à extirper, une situation malsaine à confronter. La méthode est importante : pas de violence ou de colère, mais une annonce ferme et publique de ce qui est. Ne traite pas la noirceur par la noirceur. Ta propre force morale est ta plus grande arme.",
  },
  {
    number: 44,
    nameChinese: 'Gòu',
    nameFrench: 'La Venue à la Rencontre',
    traits: [0, 1, 1, 1, 1, 1], // Xun / Qian
    shortAdvice: "Une rencontre soudaine ou une tentation inattendue s'impose à toi — reste vigilant et discerne bien ses intentions. Tout ce qui se présente à toi n'est pas forcément bienveillant, même si c'est séduisant. Garde la maîtrise de la situation.",
    fullInterpretation: "La Venue à la Rencontre décrit l'irruption du yin dans le yang — quelque chose ou quelqu'un qui surgit de façon inattendue et tente de s'imposer. Cela peut être une opportunité, mais aussi une tentation ou une influence corruptrice. Dans ta vie, tu rencontres peut-être une personne séduisante mais ambiguë, ou une situation qui te paraît attrayante mais cache des risques. Cet hexagramme t'appelle à la discernement et à ne pas te laisser emporter. La rencontre peut être fertile si tu gardes la maîtrise de toi-même.",
  },
  {
    number: 45,
    nameChinese: 'Cuì',
    nameFrench: 'Le Rassemblement',
    traits: [0, 0, 0, 1, 1, 0], // Kun / Dui
    shortAdvice: "Le moment est propice pour rassembler les gens, les forces et les ressources autour d'un but commun. Prépare-toi sérieusement et ne néglige pas les questions de logistique ou de prévoyance. Une communauté forte se construit sur un centre solide.",
    fullInterpretation: "Le Rassemblement décrit la convergence des êtres et des forces autour d'un centre fédérateur. Comme l'eau s'accumule dans un lac, les personnes et les ressources cherchent un point de ralliement. Dans ta vie, c'est le moment de créer ou de rejoindre une communauté, de réunir les conditions d'un grand projet, ou de réconcilier ce qui a été dispersé. La préparation matérielle est essentielle ici — ne laisse pas l'enthousiasme prendre le pas sur l'organisation. Un leader fort et une cause claire sont les conditions du succès.",
  },
  {
    number: 46,
    nameChinese: 'Shēng',
    nameFrench: 'La Poussée vers le haut',
    traits: [0, 1, 1, 0, 0, 0], // Xun / Kun
    shortAdvice: "Comme la plante pousse vers la lumière, laisse ton élan naturel te porter vers le haut. La croissance est maintenant favorisée — sois confiant et avance sans hésiter. L'humilité dans l'ascension est ce qui la rend durable.",
    fullInterpretation: "La Poussée vers le haut est l'hexagramme de la croissance organique et naturelle. Comme l'arbre pousse depuis la terre vers le ciel, tu es dans une phase d'expansion progressive et régulière. Dans ta carrière, tes projets personnels ou ton développement intérieur, cette progression est soutenue par des forces bienveillantes. Avance avec confiance et sans arrogance — l'humilité est la racine qui permet à l'arbre de grandir sans se briser. Il est également favorable de consulter des personnes sages et expérimentées pendant cette montée.",
  },
  {
    number: 47,
    nameChinese: 'Kùn',
    nameFrench: "L'Accablement",
    traits: [0, 1, 0, 1, 1, 0], // Kan / Dui
    shortAdvice: "Tu es épuisé et rien ne semble fonctionner — c'est précisément le moment de ne pas perdre ton intégrité. Ne te plains pas, garde le silence intérieur, et cherche la joie dans les petites choses qui restent. Cette épreuve forge l'âme si tu la traverses debout.",
    fullInterpretation: "L'Accablement décrit une période d'épuisement profond où l'eau du lac s'écoule, laissant le fond à sec. Les ressources sont épuisées, les efforts semblent vains, les paroles ne portent plus. Dans ta vie, tu traverses peut-être une crise majeure — financière, affective, professionnelle ou spirituelle. Cet hexagramme ne promet pas de sortie rapide, mais il te garantit que ceux qui maintiennent leur intégrité dans l'adversité en sortent transformés et plus forts. Fais taire les lamentations, préserve ta dignité et continue d'avancer, même très lentement.",
  },
  {
    number: 48,
    nameChinese: 'Jǐng',
    nameFrench: 'Le Puits',
    traits: [0, 1, 1, 0, 1, 0], // Xun / Kan
    shortAdvice: "Tu as accès à une source de sagesse profonde et inépuisable — en toi ou dans ta communauté. Descends chercher cette eau et partage-la généreusement avec les autres. Ne laisse pas le puits se combler par négligence.",
    fullInterpretation: "Le Puits est l'hexagramme de la ressource commune et inépuisable — la sagesse ancestrale, la culture, l'eau partagée par tous. Dans ta vie, cela t'invite à puiser dans tes ressources les plus profondes : ton héritage spirituel, ta tradition familiale, ta formation intérieure. Cette eau appartient à tous et ne diminue pas quand on la partage — au contraire. Tu peux aussi être le puits pour les autres : une source de conseil, de soutien, de connaissance. Entretiens ce puits que tu es en te nourrissant régulièrement de ce qui est profond.",
  },
  {
    number: 49,
    nameChinese: 'Gé',
    nameFrench: 'La Révolution',
    traits: [1, 0, 1, 1, 1, 0], // Li / Dui
    shortAdvice: "Le changement que tu envisages est nécessaire, mais le moment et la méthode comptent autant que l'intention. Agis seulement lorsque les conditions sont vraiment mûres et que tu as le soutien des autres. La révolution juste est celle qui arrive au bon moment.",
    fullInterpretation: "La Révolution est le grand changement, la transformation radicale des structures qui ne correspondent plus à la réalité. Le feu dans le lac — deux éléments qui se combattent. Dans ta vie, tu portes peut-être le désir de tout changer : une situation professionnelle, une relation, un mode de vie. La sagesse de cet hexagramme est d'attendre que le changement soit mûr — c'est-à-dire attendu et soutenu par ceux qui t'entourent. Une révolution précipitée échoue ; une révolution au bon moment transforme le monde. Prépare soigneusement le terrain avant d'agir.",
  },
  {
    number: 50,
    nameChinese: 'Dǐng',
    nameFrench: 'Le Chaudron',
    traits: [0, 1, 1, 1, 0, 1], // Xun / Li
    shortAdvice: "Tu es un vase de transformation — ce que tu reçois brut, tu le transmutes en quelque chose de précieux. Prends soin de ta mission créatrice ou spirituelle avec la même révérence qu'on apporte aux rites sacrés. Ce que tu cuisines nourrit les autres au-delà du visible.",
    fullInterpretation: "Le Chaudron est l'hexagramme de la transformation alchimique et du rite sacré. Comme le chaudron magique transforme les ingrédients bruts en nourriture divine pour les sages, tu es appelé à transformer tes expériences, tes dons et tes ressources en quelque chose qui nourrisse les autres en profondeur. Dans ta vie, c'est un appel à te consacrer à une mission créative, spirituelle ou culturelle avec soin et dévotion. La qualité de l'intention est aussi importante que la technique. Soigne l'invisible autant que le visible dans ce que tu fais.",
  },
  {
    number: 51,
    nameChinese: 'Zhèn',
    nameFrench: "L'Éveilleur",
    traits: [1, 0, 0, 1, 0, 0], // Zhen / Zhen
    shortAdvice: "Le choc est là — il te réveille et te rappelle ce qui compte vraiment. Ne fuis pas dans la panique : le tonnerre passe, et ceux qui restent ancrés en eux-mêmes en ressortent plus sages. Ris même au cœur de la secousse.",
    fullInterpretation: "L'Éveilleur est le tonnerre sur le tonnerre — un choc répété, une secousse qui ébranle toutes les certitudes. Dans ta vie, un événement soudain — une perte, une révélation, une rupture — te confronte à ta fragilité. Mais cet hexagramme promet que si tu maintiens ton équilibre intérieur pendant l'alarme, tu retrouveras ta joie et ta sérénité après. La peur face au tonnerre est naturelle ; ce qui est remarquable, c'est de retrouver le sourire une fois qu'il est passé. Ces chocs sont des invitations à grandir profondément.",
  },
  {
    number: 52,
    nameChinese: 'Gèn',
    nameFrench: "L'Immobilité",
    traits: [0, 0, 1, 0, 0, 1], // Gen / Gen
    shortAdvice: "Arrête-toi complètement — non par résignation, mais par une volonté consciente de revenir à toi-même. Dans le silence et l'immobilité, tu entendras ce que l'agitation t'empêche d'entendre. Sois la montagne : stable, silencieuse, présente.",
    fullInterpretation: "L'Immobilité — la montagne sur la montagne — enseigne l'art du vrai repos intérieur. Ce n'est pas l'inaction subie, mais la capacité à stopper le flot des pensées et des actions pour se retrouver face à soi-même. Dans ta vie, tu es peut-être envahi par une agitation constante, des sollicitations incessantes, un esprit qui ne s'arrête jamais. Cet hexagramme t'invite à la méditation, à la retraite, à une pause sincère. L'immobilité juste dans chaque partie du corps — dos, cœur, esprit — révèle une paix que l'action perpétuelle ne peut jamais atteindre.",
  },
  {
    number: 53,
    nameChinese: 'Jiàn',
    nameFrench: 'Le Développement graduel',
    traits: [0, 0, 1, 0, 1, 1], // Gen / Xun
    shortAdvice: "Ne brûle pas les étapes — toute chose belle se développe à son propre rythme et dans le bon ordre. Comme l'arbre qui pousse lentement devient le plus solide, ta progression durable exige de la patience et de la constance. Fais confiance au processus.",
    fullInterpretation: "Le Développement graduel est l'hexagramme de l'oie sauvage qui progresse d'étape en étape selon un ordre naturel immuable. Dans ta vie, un développement important est en cours — une relation, une carrière, une transformation intérieure — mais il demande du temps et ne peut pas être forcé. Chaque étape a sa valeur propre et ne doit pas être sautée au profit de la suivante. Ce qui progresse ainsi, lentement et correctement, finit par atteindre des hauteurs inespérées. Respecte le tempo de ta propre évolution.",
  },
  {
    number: 54,
    nameChinese: 'Guī Mèi',
    nameFrench: 'La Jeune Mariée',
    traits: [1, 1, 0, 1, 0, 0], // Dui / Zhen
    shortAdvice: "Prends garde aux relations déséquilibrées où tu te retrouves en position de faiblesse ou de dépendance. Même dans un rôle secondaire, garde ta dignité et tes valeurs intactes. Le vrai bonheur relationnel exige la réciprocité.",
    fullInterpretation: "La Jeune Mariée décrit une relation où la position est délicate — une union où l'on n'est pas dans une position d'égalité, un rôle qui dépend de la bonne volonté d'un autre. Dans ta vie, tu peux te trouver dans une situation professionnelle ou affective où tu dois composer avec une dépendance inconfortable. Cet hexagramme ne condamne pas cette situation, mais t'invite à y naviguer avec discernement et à ne jamais sacrifier ton intégrité fondamentale pour plaire ou pour te maintenir. Les fins douteuses mènent aux regrets.",
  },
  {
    number: 55,
    nameChinese: 'Fēng',
    nameFrench: "L'Abondance",
    traits: [1, 0, 1, 1, 0, 0], // Li / Zhen
    shortAdvice: "Tu es au sommet — profites-en pleinement maintenant, sans peur de la descente. La plénitude se vit dans l'instant présent, non dans l'anxiété de la perdre. Rayonne, partage, célèbre — c'est ça, honorer l'abondance.",
    fullInterpretation: "L'Abondance est un hexagramme de plénitude maximale : le tonnerre et l'éclair ensemble dans toute leur puissance, la lumière à son zénith. Tu es ou tu arrives à un sommet — un accomplissement majeur, une période de grande vitalité, un moment de rayonnement exceptionnel. Cet hexagramme t'invite à ne pas te soucier du déclin inévitable, mais à habiter pleinement ce moment de grâce. Accueille les honneurs sans vanité, partage ta lumière sans compter. Le soleil à son zénith n'essaie pas de rester là — il brille simplement.",
  },
  {
    number: 56,
    nameChinese: 'Lǚ',
    nameFrench: 'Le Voyageur',
    traits: [0, 0, 1, 1, 0, 1], // Gen / Li
    shortAdvice: "Tu es en transit — adapte-toi aux lieux et aux gens sans t'imposer, mais reste fidèle à toi-même. Le voyageur sage se fait des amis partout par sa courtoisie, et des ennemis nulle part par sa discrétion. Voyage léger, intérieurement et extérieurement.",
    fullInterpretation: "Le Voyageur décrit celui qui est loin de chez lui — au sens littéral ou figuré. Tu traverses peut-être une période de transition, de déracinement, d'expatriation ou simplement un entre-deux dans ta vie. La sagesse du voyageur est de s'adapter sans s'effacer, de créer des liens sans s'attarder là où ce n'est pas sa place. Sois discret, courtois et prudent — évite les conflits dans les environnements nouveaux, car tu n'as pas encore le réseau ni la connaissance nécessaires pour les gérer. La légèreté est ta meilleure protection.",
  },
  {
    number: 57,
    nameChinese: 'Xùn',
    nameFrench: 'Le Doux',
    traits: [0, 1, 1, 0, 1, 1], // Xun / Xun
    shortAdvice: "L'influence douce et persistante est plus puissante que la force brute — pénètre les situations comme le vent pénètre toutes choses. Sois souple, adaptable, mais constant dans ta direction. La douceur persistante finit par façonner le roc.",
    fullInterpretation: "Le Doux est le vent sur le vent — une influence subtile, pénétrante, qui s'insinue partout sans résistance apparente. Dans ta vie, c'est l'hexagramme de la persuasion douce, de l'influence progressive et de la souplesse stratégique. Plutôt que d'affronter les obstacles de front, tu trouveras plus d'efficacité à te glisser autour, à multiplier les petites actions constantes dans la même direction. La douceur n'est pas la faiblesse — c'est l'intelligence de celui qui comprend que la persistance vaut mieux que la brutalité. Reste dans le mouvement.",
  },
  {
    number: 58,
    nameChinese: 'Duì',
    nameFrench: 'La Joie',
    traits: [1, 1, 0, 1, 1, 0], // Dui / Dui
    shortAdvice: "Laisse-toi habiter par la joie sincère — elle est contagieuse et nourrit tous ceux qui te côtoient. La vraie joie vient de l'intérieur, pas des circonstances ; cultive-la comme un art de vivre. Partage-la sans retenue.",
    fullInterpretation: "La Joie est le lac sur le lac — une joie douce, réfléchissante, communicative. Ce n'est pas l'euphorie passagère, mais une sérénité joyeuse profonde qui naît de l'harmonie intérieure et du partage avec les autres. Dans ta vie, cet hexagramme t'invite à cultiver la joie comme une pratique consciente : cherche ce qui te nourrit vraiment, cultivate les échanges agréables et sincères, pratique la légèreté de l'âme. La vraie joie est aussi une forme de discipline — elle ne dépend pas des circonstances, mais de ta façon d'habiter chaque moment.",
  },
  {
    number: 59,
    nameChinese: 'Huàn',
    nameFrench: 'La Dissolution',
    traits: [0, 1, 0, 0, 1, 1], // Kan / Xun
    shortAdvice: "Les rigidités, les cloisonnements, les ego enflés — voilà ce qui se dissout maintenant. Laisse aller ce qui te sépare des autres et du mouvement de la vie. La dissolution prépare une forme nouvelle, plus fluide et plus juste.",
    fullInterpretation: "La Dissolution décrit la liquéfaction des rigidités — les divisions disparaissent, les frontières se dissolvent, les égo se fondent dans quelque chose de plus vaste. Comme le vent chasse les nuages et que la barque navigue librement, les obstacles à la communication et à l'unité se dissipent. Dans ta vie, cela peut annoncer une réconciliation, un abandon de vieilles rancunes, une ouverture à une dimension spirituelle plus large. C'est un moment propice aux rites communautaires, aux cérémonies, aux célébrations collectives qui transcendent l'individuel. Laisse fondre les armures.",
  },
  {
    number: 60,
    nameChinese: 'Jié',
    nameFrench: 'La Limitation',
    traits: [1, 1, 0, 0, 1, 0], // Dui / Kan
    shortAdvice: "Les limites ne sont pas des prisons — elles sont les conditions de toute création et de tout épanouissement. Accepte celles qui sont nécessaires et fixe-toi celles qui te libèrent. La discipline joyeuse est plus puissante que la liberté sans structure.",
    fullInterpretation: "La Limitation enseigne la valeur des contraintes acceptées consciemment. L'eau du lac est contenue par ses berges — sans elles, elle se disperserait et ne pourrait pas miroiter le ciel. Dans ta vie, il y a des limites que tu dois t'imposer à toi-même pour préserver ton énergie, ta santé ou tes valeurs. La vraie liberté se construit dans le cadre, non contre lui. Cependant, il faut savoir distinguer les limitations fructueuses de celles qui brisent l'esprit — les premières sont à embrasser, les secondes à transformer avec douceur.",
  },
  {
    number: 61,
    nameChinese: 'Zhōng Fú',
    nameFrench: 'La Vérité intérieure',
    traits: [1, 1, 0, 0, 1, 1], // Dui / Xun
    shortAdvice: "Quand tu agis depuis ta vérité la plus profonde, tu touches le cœur des autres sans effort. Ne cache pas ce que tu ressens vraiment derrière des masques — ta sincérité est ta plus grande force. La confiance naît de l'authenticité.",
    fullInterpretation: "La Vérité intérieure est l'hexagramme de la sincérité profonde qui rayonne vers l'extérieur et transforme ce qu'elle touche. Comme le vent sur le lac crée des cercles qui s'élargissent sans fin, ta vérité intérieure, quand elle est réelle, influence tout ce qui t'entoure. Dans ta vie, c'est un appel à l'authenticité totale — dans tes relations, ton travail, ta façon d'être. Les personnes qui ressentent ta sincérité te feront confiance et te suivront naturellement. Ta cohérence entre l'intérieur et l'extérieur est la fondation de tout ce que tu bâtis.",
  },
  {
    number: 62,
    nameChinese: 'Xiǎo Guò',
    nameFrench: 'La Prépondérance du Petit',
    traits: [0, 0, 1, 1, 0, 0], // Gen / Zhen
    shortAdvice: "Dans les temps d'obscurité, reste en dessous plutôt qu'en dessus — l'humilité et la petitesse sont tes alliées. Ne vise pas trop haut maintenant ; concentre-toi sur les tâches simples, les gestes quotidiens. L'excellence dans le petit prépare les grandes choses.",
    fullInterpretation: "La Prépondérance du Petit décrit un temps où les grandes actions ne sont pas favorables, mais où l'attention aux petites choses est précieuse. Comme un oiseau qui vole bas par mauvais temps, tu dois adapter ton ambition aux circonstances. Dans ta vie, cela t'invite à ne pas chercher à te surpasser dans les grands projets pour l'instant, mais à exceller dans les détails du quotidien — la courtoisie, la précision, le soin des petites obligations. C'est aussi un appel à l'humilité dans l'expression de tes opinions et de tes désirs.",
  },
  {
    number: 63,
    nameChinese: 'Jì Jì',
    nameFrench: "Après l'Accomplissement",
    traits: [1, 0, 1, 0, 1, 0], // Li / Kan
    shortAdvice: "Tu as accompli quelque chose d'important — maintenant, reste vigilant pour que cela ne se défasse pas. Le succès crée ses propres dangers ; la discipline après la victoire est aussi importante qu'avant. Maintiens l'ordre que tu as créé avec le même soin que tu as mis à le bâtir.",
    fullInterpretation: "Après l'Accomplissement est le seul hexagramme où chaque ligne est à sa place correcte — une complétude parfaite. Et pourtant, c'est le moment le plus dangereux : ce qui est achevé peut commencer à se défaire. Dans ta vie, tu as peut-être atteint un objectif important, conclu un projet, trouvé un équilibre. La tentation est de te relâcher, de négliger ce qui a permis ce succès. Cet hexagramme t'invite à maintenir la vigilance, l'entretien et la gratitude. La perfection atteinte doit être cultivée pour durer.",
  },
  {
    number: 64,
    nameChinese: 'Wèi Jì',
    nameFrench: "Avant l'Accomplissement",
    traits: [0, 1, 0, 1, 0, 1], // Kan / Li
    shortAdvice: "Tu es presque arrivé — mais cette dernière étape exige plus de soin et d'attention que toutes les autres. Ne te laisse pas griser par la proximité du but ; reste concentré et patient jusqu'au bout. L'accomplissement est à portée de main si tu ne fais pas de fausse manœuvre.",
    fullInterpretation: "Avant l'Accomplissement est paradoxalement le dernier hexagramme du Yi King, placé après l'Accomplissement. Il symbolise un état de transition, de presque-arrivée, où tout le potentiel est là mais rien n'est encore fixé. Dans ta vie, tu es dans une phase de transition importante — un projet qui n'est pas encore terminé, une transformation qui n'est pas encore stabilisée. L'énergie est là, la lumière est visible, mais le renard doit traverser la glace avec précaution. Reste concentré, ne cède pas à l'impatience, et l'accomplissement sera complet. Chaque fin est le début d'un nouveau cycle.",
  },
];

function getHexagram(number) {
  return YIKING.find(h => h.number === number) || YIKING[0];
}

function getRandomHexagram() {
  return YIKING[Math.floor(Math.random() * 64)];
}

function getHexagramByTraits(traits) {
  const hex = YIKING.find(h => h.traits.every((t, i) => t === traits[i]));
  return hex || YIKING[0];
}
