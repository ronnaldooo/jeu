/* ============================================================================
   RUE DE GRENELLE — CONSTANTES DU MOTEUR
   ----------------------------------------------------------------------------
   Toutes les constantes paramétrables du jeu sont ici, chacune commentée avec
   sa source (partie B du brief). Même convention que `jeu-budget-source.jsx` :
   on doit pouvoir ré-équilibrer le jeu sans toucher au moteur.

   Unités : Md€ courants hors CAS Pensions · ETP · points de compteur (0-100).
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1. CADRAGE BUDGÉTAIRE                                          [source B.1]
   ------------------------------------------------------------------------- */
export const CADRAGE = {
  missionHorsCAS: 64.49,      // Md€ CP, PLF 2026 (Sénat)
  missionAvecCAS: 89.64,      // Md€ (CAS Pensions ≈ 25 Md€)
  titre2: 58.4,               // Md€ de masse salariale = 92,7 % de la mission
  partMasseSalariale: 0.927,  // ce qui n'est PAS arbitrable
  etpEnseignants: 814927,     // ETP (74 % des 1,2 M de personnels)
  coutETPhorsCAS: 0.000072,   // Md€/an = 72 k€ (calcul T2/ETP)
  coutETPavecCAS: 0.000110,   // Md€/an = 110 k€ : le vrai coût d'un poste
  coutPointIndice: 0.49,      // Md€/an pour 1 % de point, périmètre EN seul
  depenseParEleve: 10920,     // € (DEPP 2024, tous niveaux)
};

/* Marge de manœuvre annuelle réellement arbitrable, avant carte scolaire.
   Le PLF 2026 progresse de +0,26 % : l'essentiel est pré-engagé.
   C'est la contrainte structurante du jeu — l'équivalent du « mur des 3 % ». */
export const ENVELOPPE_BASE = 0.17;   // Md€ de mesures nouvelles « gratuites »

/* Paliers de la lettre plafond de juillet, selon le crédit Bercy.  [B.6, C.4]
   schemaEmplois = ETP que Bercy EXIGE de rendre ; marge = Md€ concédés. */
export const PALIERS_BERCY = [
  { seuil: 75, schemaEmplois: -800,  marge: 1.35, ton: 'confiant' },
  { seuil: 55, schemaEmplois: -2200, marge: 0.72, ton: 'vigilant' },
  { seuil: 35, schemaEmplois: -4000, marge: 0.38, ton: 'ferme' },
  { seuil: 0,  schemaEmplois: -6200, marge: 0.05, ton: 'comminatoire' },
];

/* Dépasser l'enveloppe est possible — et cher. C'est le seul moyen de financer
   les grosses cartes (statut AESH 4,3 Md€, 19/classe, revalorisation 2,5 Md€). */
export const SURCOUT = {
  creditBercyParMd: 13,   // points de crédit Bercy perdus par Md€ de dépassement
  capitalParMd: 7,        // points de capital gouvernemental consommés
  /* Sur-engagement structurel : quand les charges déjà engagées dépassent la
     marge de l'année, Bercy le rappelle chaque année — mais on ne re-facture
     pas l'intégralité du dépassement initial (les charges sont dans la base). */
  penaliteStructurelleMax: 8,
  penaliteStructurelleParMd: 4,
};

/* Échelle salariale : la revendication FSU d'un rattrapage de +20 % du point
   est chiffrée à ~10 Md€ pour la seule Éducation nationale (B.3-5). On en tire
   la conversion du jeu : 1 Md€ récurrent ≈ 2 points de position salariale. */
export const POINTS_SALAIRE_PAR_MD = 2.0;

/* ---------------------------------------------------------------------------
   2. LE TENDANCIEL DÉMOGRAPHIQUE — le moteur du jeu           [source B.2]
   ------------------------------------------------------------------------- */
/* Projections DEPP avril 2026 : −1 676 800 élèves d'ici 2035 (−14,2 %).
   Baisse par rentrée, en milliers d'élèves. La rentrée 2026 (−161 000) est
   l'héritage ; le joueur arbitre les rentrées 2027 à 2031. */
export const BAISSE_ELEVES = { 2027: -158, 2028: -172, 2029: -181, 2030: -176, 2031: -168 };
export const ELEVES_INITIAL = 11607.6;     // milliers, rentrée 2026

/* Conversion élèves → postes « libérés ». C'EST le choix politique du jeu.
   Précédents opposés : rentrée 2025 = −106 000 élèves / −470 postes (ratio 0,04) ;
   rentrée 2026 = −161 000 élèves / −4 032 postes titulaires (ratio 0,60). */
export const ELEVES_PAR_POSTE = 24;        // diviseur de conversion démographie→ETP

/* Encadrement. E/D France 21,3 (OCDE 20) ; objectif ministériel 21 ;
   collège ~26/classe (« les classes les plus chargées d'Europe »). */
export const RATIO_ED_INITIAL = 21.3;

/* Verrou politique reconduit : « aucune école ne ferme sans l'accord du maire ».
   Au-delà de ce taux de restitution, les maires entrent dans le conflit. */
export const SEUIL_COLERE_MAIRES = 0.55;

/* ---------------------------------------------------------------------------
   3. ÉTAT INITIAL DES CINQ COMPTEURS                          [source B.3]
   ------------------------------------------------------------------------- */
/* Échelle 0-100, 100 = idéal. Ce sont des indices composites, pas des taux.
   Justification de chaque valeur de départ :
   - reussite 41  : TIMSS CM1 maths 484 vs UE 524 (28e/32) ; 17 % des 4e sous le
                    niveau de base contre 3 % en 1995 ; PIRLS stable.
   - egalite  34  : France parmi les plus inégalitaires en maths (DEPP/TIMSS) ;
                    IPS collèges publics 99,9 vs privés 117,4 et écart +2 pts/an.
   - sante    29  : 9,8 % d'heures non assurées ; 4 % des enseignants se sentent
                    valorisés (TALIS, dernière place mondiale) ; formation
                    continue dernière des 48 pays ; 36 % du corps a ≥50 ans.
   - paix     78  : le mandat ne s'ouvre pas sur une page blanche. Un front
                    intersyndical unitaire à sept organisations existe depuis
                    février 2026, une grève de la fonction publique a eu lieu le
                    29 septembre 2026 et l'intersyndicale a boycotté les
                    instances en janvier 2026. Vous héritez d'un conflit ouvert.
   - budget   30  : salaires −26 % (élémentaire) / −18 % (collège) vs autres
                    diplômés du supérieur ; point d'indice gelé depuis 2023. */
export const COMPTEURS_INITIAUX = { reussite: 41, egalite: 34, sante: 29, paix: 78, budget: 30 };

export const COMPTEURS_META = {
  reussite: { nom: 'Réussite des élèves', court: 'Réussite' },
  egalite:  { nom: 'Réduction des inégalités', court: 'Inégalités' },
  sante:    { nom: 'Santé du système', court: 'Santé' },
  paix:     { nom: 'Paix sociale', court: 'Paix sociale' },
  budget:   { nom: 'Budget et salaires', court: 'Budget' },
};

/* Poids du score final selon le rang que le joueur a lui-même donné au compteur
   lors de sa déclaration de doctrine (juin 2027). Il est noté contre sa parole. */
export const POIDS_DOCTRINE = [35, 25, 20, 12, 8];

/* ---------------------------------------------------------------------------
   4. VARIABLES PHYSIQUES DU SYSTÈME                           [source B.3]
   ------------------------------------------------------------------------- */
export const PHYSIQUE_INITIALE = {
  heuresNonAssurees: 9.8,     // % (DEPP 26-14), dont 7,5 pt de non-remplacement
  couvertureConcours: 92.0,   // % de postes pourvus (9,4 % non pourvus en 2025)
  adhesion: 25,               // enseignants : adhésion aux choix politiques (UNSA au plus bas)
  affection: 90,              // enseignants : attachement au métier (79-90 %, plancher stable)
  parents: 45,                // opinion des familles
  positionSalariale: -22,     // % vs autres diplômés du supérieur (−26 élém. / −18 collège)
  segregation: 17.5,          // écart d'IPS privé − public (117,4 − 99,9)
  medecinsScolaires: 900,     // pour 12 M d'élèves, >1/3 des postes vacants
  psyEN: 5500,                // sur 7 500 postes (~2 000 vacants)
};

/* Dérives spontanées annuelles si le ministre ne fait rien.               [B.3] */
/* L'adhésion et l'affection sont PERSISTANTES AVEC INERTIE (correction du
   défaut A.9-2 du jeu de référence : là-bas, le malus des mesures disparaissait
   au reset de janvier et devenait exploitable). Ici les mesures les déplacent
   durablement, avec un lent retour vers la moyenne. */
export const INERTIE_OPINION = {
  cibleAdhesion: 18, vitesse: 0.16, cibleParents: 45, vitesseParents: 0.16,
  /* La cible d'adhésion n'est pas fixe : c'est la boucle d'attractivité (B.8-1).
     Payer mieux et faire baisser les heures non assurées relève durablement le
     niveau d'adhésion vers lequel le corps revient — et donc la capacité du
     système à appliquer les réformes suivantes. C'est le cercle vertueux. */
  gainParPointSalaire: 1.30,      // par point de rattrapage salarial vs supérieur
  perteParPointHNA: 1.20,         // par point d'heures non assurées au-dessus de 9,8
};

export const TENDANCIEL = {
  heuresNonAssurees: +0.7,    // +0,7 pt/an constaté
  segregation: +0.6,          // l'IPS du privé progresse ~+2 pts/an, le public non
  positionSalariale: -0.8,    // point d'indice gelé + inflation
  affection: -0.9,            // érosion lente (heureux d'exercer 80,9 % → 73 %)
  adhesion: -0.8,             // sans geste, l'adhésion continue de baisser
};

/* ---------------------------------------------------------------------------
   5. VITRINE / RÉEL : le mécanisme central                    [source B.5, C.2]
   ------------------------------------------------------------------------- */
/* Largeur du tirage de l'effet réel selon le niveau de preuve (cadenas EEF).
   « Le vrai effet peut aller du négatif au double » quand la preuve est faible. */
export const INTERVALLE_CADENAS = {
  5: [0.80, 1.20],
  4: [0.65, 1.35],
  3: [0.50, 1.60],
  2: [0.30, 2.00],
  1: [-0.50, 3.00],
};

/* Capacité d'absorption : au-delà de 3 réformes pédagogiques simultanément
   actives, chaque réforme supplémentaire rabote l'effet de TOUTES et gonfle
   leur variance (Slavin : un programme mal implanté a un effet ≈ 0). */
export const ABSORPTION = {
  seuil: 3,
  penaliteParReforme: 0.15,   // −15 % d'effet central par réforme au-delà
  plancher: 0.35,
  varianceParReforme: 0.22,   // +22 % de largeur d'intervalle par réforme au-delà
  dureeActive: 3,             // une réforme « occupe » le système 3 ans
};

/* Fatigue réformatrice : 7 ministres en 3 ans avant vous.                [B.8-7] */
export const FATIGUE = {
  initiale: 40,
  parReforme: 10,
  parAbandon: 15,
  parAnneeSansAnnonce: -8,
  max: 100,
};

/* Facteur d'implémentation : c'est LA leçon du jeu. Une réforme ne vaut que ce
   que les personnels en font. adhésion 25 → 0,63 ; adhésion 60 → 1,01. */
export const IMPLEMENTATION = {
  baseAdhesion: 0.35,
  penteAdhesion: 1.10,
  penteFatigue: 0.0045,       // par point de fatigue au-dessus de l'initiale
  plancher: 0.20,
};

/* Poids de l'héritage dans le signal AFFICHÉ, par année de mandat.        [C.3]
   Les deux premières années, le joueur est jugé sur ce qu'il n'a pas fait. */
export const POIDS_HERITAGE = [0.60, 0.60, 0.42, 0.26, 0.12];

/* Bruit annuel des indicateurs affichés (évaluations nationales bruitées). */
export const BRUIT_AFFICHE = 2.6;         // écart-type, en points de compteur

/* Le coût d'affichage du long terme. Une réforme dont l'effet n'arrivera que
   dans quatre ans ou plus consomme des moyens visibles pour un résultat
   invisible : pendant la transition, l'indicateur ne bouge pas et la
   comparaison avec l'annonce se retourne contre le ministre. C'est ce qui rend
   la politique de long terme électoralement irrationnelle. */
export const COUT_AFFICHAGE_LONG_TERME = 2.4;   // points de vitrine, par effet à délai ≥ 4 ans

/* Décroissance annuelle de l'effet-vitrine : l'annonce s'use. */
export const DECROISSANCE_VITRINE = 0.74; // il reste 74 % l'année suivante

/* ---------------------------------------------------------------------------
   6. BOUCLE D'ATTRACTIVITÉ                                    [source B.8-1]
   ------------------------------------------------------------------------- */
/* salaires + considération + conditions → candidats → couverture des concours
   → remplacement → conditions. Rétroaction positive, à forte inertie.
   Le taux de couverture de juillet a UN AN DE RETARD sur les décisions. */
export const ATTRACTIVITE = {
  /* Calibré pour que l'état initial soit un ÉQUILIBRE : sans geste, la
     couverture ne s'effondre pas toute seule, elle stagne. C'est l'action du
     ministre — dans un sens ou dans l'autre — qui la déplace. */
  base: 68, pente: 0.65,
  poidsSalaire: 0.40,
  poidsAdhesion: 0.35,
  poidsConditions: 0.25,
  inertieCouverture: 0.28,    // vitesse de convergence de la couverture vers sa cible
  couvertureReference: 92,    // au-dessus, le remplacement s'améliore ; en dessous, il se dégrade
  effetHNAparPointCouv: 0.060,// par point d'écart à la référence
};

/* ---------------------------------------------------------------------------
   7. CONFLIT SOCIAL                                           [source B.3-4, B.4]
   ------------------------------------------------------------------------- */
/* Étalon historique : grève du 10/02/2011 = 16,99 % d'enseignants grévistes. */
export const GREVE = {
  baseParIntensite: { 1: 4.5, 2: 8.5, 3: 13.5, 4: 19.5, 5: 26.5 },  // % de grévistes
  bonusUnite: 0.30,           // +30 % si ≥ 5 organisations sur 7 mobilisées
  ecartSyndicats: 1.70,       // les syndicats annoncent ~1,7× le chiffre du ministère
  coutPaixParPointGreve: 0.45,// points de paix sociale perdus par point de grévistes
  conflictualiteLatente: 0.42,// préavis, motions, boycott des instances : le conflit sans la grève
                              // (précédent : boycott intersyndical des instances, janvier 2026)
  coutAdhesionParPoint: 0.10,
  segments: { college: 1.20, '1erdegre': 1.09, lp: 0.69, lycee: 0.92, tous: 1.0 }, // étalon 2011
};

/* Les sept organisations, pondérées par les élections professionnelles CSA 2022.
   `seuil` = intensité minimale (pondérée) qui les met en grève.
   `profil` : rapport de force / négociation / frontal / corporatiste / radical. */
export const SYNDICATS = [
  { id: 'fsu',   nom: 'FSU',            poids: 34.05, seuil: 2.4, profil: 'rapport_de_force' },
  { id: 'unsa',  nom: 'UNSA Éducation', poids: 19.37, seuil: 3.4, profil: 'reformiste' },
  { id: 'fo',    nom: 'FNEC-FP-FO',     poids: 14.05, seuil: 1.8, profil: 'frontal' },
  { id: 'cfdt',  nom: 'Sgen-CFDT',      poids: 7.80,  seuil: 3.7, profil: 'negociation' },
  { id: 'cgt',   nom: "CGT Éduc'action", poids: 6.64, seuil: 1.7, profil: 'radical' },
  { id: 'snalc', nom: 'SNALC',          poids: 6.21,  seuil: 3.0, profil: 'corporatiste' },
  { id: 'sud',   nom: 'SUD Éducation',  poids: 5.09,  seuil: 1.5, profil: 'radical' },
];

/* Sensibilité de chaque profil aux thèmes de conflit (multiplie l'intensité). */
export const SENSIBILITES = {
  moyens:        { rapport_de_force: 1.3, reformiste: 1.0, frontal: 1.2, negociation: 0.8, radical: 1.3, corporatiste: 1.1 },
  salaires:      { rapport_de_force: 1.2, reformiste: 1.1, frontal: 1.3, negociation: 0.9, radical: 1.2, corporatiste: 1.3 },
  statut:        { rapport_de_force: 1.2, reformiste: 0.9, frontal: 1.4, negociation: 0.7, radical: 1.2, corporatiste: 1.4 },
  pedagogie:     { rapport_de_force: 1.1, reformiste: 0.7, frontal: 1.0, negociation: 0.5, radical: 1.0, corporatiste: 1.2 },
  evaluation:    { rapport_de_force: 1.2, reformiste: 0.8, frontal: 1.1, negociation: 0.6, radical: 1.2, corporatiste: 1.0 },
  prive:         { rapport_de_force: 0.9, reformiste: 0.7, frontal: 0.8, negociation: 0.6, radical: 1.1, corporatiste: 0.4 },
  autorite:      { rapport_de_force: 0.9, reformiste: 0.6, frontal: 0.9, negociation: 0.5, radical: 1.2, corporatiste: 0.3 },
};

/* ---------------------------------------------------------------------------
   8. SURVIE POLITIQUE                                         [source A.3, C.5]
   ------------------------------------------------------------------------- */
export const CAPITAL = { initial: 50, parAn: 30, plafond: 100 };

/* Le prix de l'immobilisme. La fatigue réformatrice retombe quand on n'annonce
   rien (c'est bon pour l'implémentation des réformes suivantes), mais un
   ministre qui n'annonce rien n'est pas un ministre qui dure. */
export const IMMOBILISME = { capital: 7, parents: 3.5 };
export const CREDIT_BERCY_INITIAL = 40;

/* Convocation à Matignon : 3 convocations cumulées = renvoi.
   Durée réelle moyenne d'un ministre de l'EN ≈ 2 ans : finir est une performance. */
export const RENVOI = {
  convocationsFatales: 3,
  seuilAdhesionRentreeRatee: 15,
  seuilHNARentreeRatee: 12.5,   // % d'heures non assurées = « rentrée ratée »
  seuilCouvertureRentreeRatee: 88,
  probaConvocRentreeRatee: 0.34,// une rentrée ratée suffit parfois, même sans crise d'adhésion
  probaConvocCapitalBas: 0.55,  // si capital < 12 en fin d'année
  seuilParents: 26,             // les familles décrochent : la presse réclame une tête
  probaConvocParents: 0.40,
  seuilCreditBercy: 12,         // Bercy fait remonter le dossier à Matignon
  probaConvocBercy: 0.35,
  seuilPaixCritique: 45,
  /* Remaniement : la première cause de fin de mandat dans la vraie vie. Depuis
     1958, plus de trente ministres se sont succédé rue de Grenelle ; la durée
     moyenne dans le poste dépasse rarement deux ans. Le risque est modulé par
     le capital politique et l'opinion des familles : un ministre solide n'est
     pas à l'abri, il est seulement moins exposé. */
  remaniementBase: 0.175,
  remaniementParCapital: 900,
  remaniementParParents: 700,
  remaniementMin: 0.03, remaniementMax: 0.30,
};

/* ---------------------------------------------------------------------------
   9. PROJECTION À DIX ANS                                     [source B.5, B.8-8]
   ------------------------------------------------------------------------- */
/* Portugal : 15 ans de cap constant malgré l'alternance → seul pays OCDE en
   progression dans les 3 domaines PISA 2000-2018. La victoire existe, elle
   prend 10-15 ans. La constance du cap est ce qui la déclenche. */
export const PROJECTION = {
  bonusConstance: 0.55,       // part supplémentaire d'effet si le cap a tenu
  poursuiteDuCap: 0.40,       // le successeur prolonge votre trajectoire à 40 % de son rythme
  seuilAbandonsConstance: 1,  // au-delà d'un abandon, plus de bonus
  /* « Tenir le cap » ne veut pas dire « ne rien faire » : le Portugal a beaucoup
     réformé. Cela veut dire faire, pendant quinze ans, des choses qui vont dans
     le MÊME sens. On mesure donc la cohérence entre les effets réellement
     produits et les deux priorités que le joueur a déclarées en juin 2027 —
     il est, là aussi, noté contre sa propre parole. */
  seuilCoherence: 0.45,       // part des effets dirigés vers les priorités déclarées
  maxAnneesSurcharge: 2,      // années passées au-delà de la capacité d'absorption
};

export const MOIS = ['janvier','février','mars','avril','mai','juin',
                     'juillet','août','septembre','octobre','novembre','décembre'];
