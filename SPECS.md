# MATRICE — CAHIER DES CHARGES COMPLET

## 1. Vision
MATRICE n'est pas une app de méditation. C'est un instrument de calibration personnelle. Chaque matin, l'utilisateur programme son champ. Il décide ce qu'il attire, intègre ce qui pèse, et sort aligné.

## 2. Design adaptatif
- Avant 7h et après 19h : mode sombre (fond #1A1A2E, or #B8860B, symboles lumineux filaire)
- Entre 7h-19h : mode clair (fond crème #FFF8E7, or, traits fins)
- Transition graduelle entre modes
- Typo : Cormorant Garamond (mantras, sorts, rituels) + DM Sans (interface)
- Esthétique : synthétiseur analogique + grimoire moderne. Beaucoup d'espace vide. Animations lentes.
- Géométrie sacrée en 3 couches : fond subtil + symbole central + animations pulse/rotation

## 3. Géométrie sacrée
- Cube de Métatron : logo, écran d'accueil, SVG filaire animé rotation lente. 333 intégré subtilement.
- Graine de Vie : remplace le cercle de respiration. Pulse avec le souffle (inspire=ouvre, expire=contracte).
- 5 Solides de Platon = 5 éléments : Tétraèdre=Feu(or/rouge), Cube=Terre(vert profond), Octaèdre=Air(blanc/argent), Icosaèdre=Eau(bleu sombre), Dodécaèdre=Éther(violet/indigo). Chacun en fond filaire quand son élément est actif.
- Spirale de Fibonacci : streak/progression.
- Plume de Maât : SVG dans module intégration du sombre.
- Yin Yang : fond du module intégration du sombre.
- 333 : easter eggs (streak 33, 333, écran chargement).

## 4. Durée adaptative
Contrôle global accessible pendant le rituel. Défaut 5min. Ajustable 3-15min. Tous les modules se recalibrent proportionnellement. Respiration minimum 1min30.

## 5. Rituel matin — 6 modules

### Module 1 — Souffle & Fréquences
- Graine de Vie SVG animée pulse avec le souffle
- 3 patterns : cohérence cardiaque 5-5 (défaut), carré 4-2-4-2, relaxant 4-7-8
- Chaque phase (inspire, retient, expire) a sa couleur propre avec transition fluide
- Binauraux Web Audio API : Theta 6Hz "Ouverture/Introspection", Alpha 10Hz "Focus calme", Gamma 40Hz "Énergie/Clarté"
- Sons ambiance optionnels : pluie, bols tibétains, drone grave, silence
- Durée défaut 2min, contrôle +/- visible, ajustable à la volée
- Consigne : "Mâchoire relâchée. Épaules lourdes. Bassin posé."

### Module 2 — Mantra du jour
- Banque 50+ mantras en 3 catégories : Noyau (travail intérieur), Élan (mouvement), Ancrage (jours lourds)
- Rotation shuffle sans répétition proche
- Affichage : Cormorant Garamond, centré, fond doré
- "Répète 3 fois à voix haute"
- Bouton autre mantra + sauvegarder favori

### Module 3 — Intégration du sombre
- Symboles : Plume de Maât + Yin Yang
- "Qu'est-ce qui pèse ce matin ?" — texte libre
- Transmutation contextuelle par mots-clés (travail→pro, corps→somatique, deuil→perte, peur→mental, fallback→général)
- 30+ transmutations, 6 minimum par pool
- Transition visuelle sombre→lumière

### Module 4 — Magnétisme & Visualisation
- Chips : Confiance, Abondance, Connexion, Créativité, Paix, Puissance + texte libre
- Retour visuel fort à la sélection
- Visualisations guidées contextuelles aux intentions (15+ textes)
- Ancrées dans la vie réelle, pas génériques

### Module 5 — Sort du jour
- App propose un élément, utilisateur peut changer
- 5 éléments avec solides de Platon en fond SVG
- 25+ sorts (5 min par élément), chacun = geste physique réel
- Éther = silence, contemplation, écoute de l'espace entre les sons
- Phase lunaire affichée (calculée JS), indication légère

### Module 6 — Yi King & Clôture
- Tirage par simulation lancer 3 pièces × 6 fois
- L'utilisateur tape 6 fois, chaque tap = 3 pièces = 1 trait yin ou yang
- Hexagramme construit de bas en haut avec animation
- 64 hexagrammes : numéro, nom chinois, nom français, symbole, conseil court, interprétation complète
- Affichage rituel : hexagramme SVG + nom + conseil court
- "Voir la carte complète" = overlay avec interprétation détaillée
- Résumé du rituel + phrase de clôture contextuelle (20+)
- Streak sur spirale de Fibonacci

## 6. Mode Libre / Studio
- Accessible depuis navigation principale, pas de structure
- Binauraux au choix + patterns respiration + sons ambiance + Graine de Vie
- Timer optionnel. Yi King accessible librement.

## 7. Mode SOS
- Bouton teal toujours visible sur l'accueil
- Phase 1 CORPS (90s) : respiration 5-5 + Graine de Vie + binauraux toggle + "Mâchoire relâchée. Épaules lourdes. Bassin posé."
- Phase 2 NOMMER (60s) : "Qu'est-ce qui monte ? Un mot." + transmutation + Plume Maât + Yin Yang
- Phase 3 ANCRE (90s) : mantra ancrage + micro-sort + "Tu es encore là. Tu n'as pas fui."
- Quitter possible après chaque phase

## 8. Mode Soir / Gratitude
- Rapide : une ligne de gratitude
- Complet : gratitude + action du jour + lâcher
- Historique consultable, patterns récurrents

## 9. Audio
- Binauraux temps réel Web Audio API (2 oscillateurs sinusoïdaux stéréo)
- Theta 6Hz, Alpha 10Hz, Gamma 40Hz
- Ambiance superposable : pluie (bruit blanc filtré), bols (sinusoïdes harmoniques), drone (basse fréquence)

## 10. Persistance (localStorage)
- Streak (spirale Fibonacci), historique rituels, mantras favoris, journal gratitude
- Stats : nombre rituels, mantras les plus tirés, intentions récurrentes

## 11. Notifications
- Matin (rituel) + soir (gratitude), heures configurables, ton doux, textes variés

## 12. PWA
- manifest.json, sw.js, cache offline, installable mobile, GitHub Pages
