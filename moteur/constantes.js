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
  /* Le mandat s'ouvre sur le PLF 2027. Les lettres plafonds du 16 juillet 2026
     fixent la mission interministérielle « Enseignement scolaire » à 65,3 Md€,
     soit +0,8 Md€ (+1,2 %) sur les 64,49 Md€ du budget 2026 — la première
     hausse supérieure à l'inflation depuis 2024. C'est la marge que vous
     héritez, et elle n'est pas nulle : le jeu la fait sentir. */
  missionHorsCAS: 65.30,      // Md€, plafond prévisionnel PLF 2027
  mission2026: 64.49,         // Md€ CP hors CAS, budget 2026 voté (Sénat)
  missionAvecCAS: 89.64,      // Md€ pensions comprises, budget 2026 (Sénat)
  titre2: 58.4,               // Md€ de masse salariale = 92,7 % de la mission
  partMasseSalariale: 0.927,  // ce qui n'est PAS arbitrable
  etpEnseignants: 814927,     // ETP (74 % des 1,2 M de personnels)
  coutETPhorsCAS: 0.000072,   // Md€/an = 72 k€ (calcul T2/ETP)
  coutETPavecCAS: 0.000110,   // Md€/an = 110 k€ : le vrai coût d'un poste
  coutPointIndice: 0.49,      // Md€/an pour 1 % de point, périmètre EN seul
  depenseParEleve: 10920,     // € (DEPP 2024, tous niveaux)
  /* Détail 2024 par niveau (HCSP, août 2026) : ce que coûte réellement un
     élève selon l'année où on le regarde. C'est l'arbitrage caché du système. */
  depenseParEleveNiveau: { ecole: 9100, college: 10500, lgt: 13000, lp: 14700 },
};

/* Marge de manœuvre annuelle réellement arbitrable, avant carte scolaire.
   Le PLF 2027 apporte +0,8 Md€, mais une bonne moitié est déjà engagée par le
   prédécesseur : réforme du recrutement et de la formation initiale, protection
   sociale complémentaire, allocations de stage en voie professionnelle. Reste
   ce que le nouveau ministre peut réellement affecter.
   C'est la contrainte structurante du jeu — l'équivalent du « mur des 3 % ». */
export const ENVELOPPE_BASE = 0.42;   // Md€ de mesures nouvelles « gratuites »

/* Un ministre n'attend pas le budget suivant pour agir : il arrive dans une loi
   de finances déjà votée par son prédécesseur, et il y redéploie. Deux fenêtres
   plus précoces que l'arbitrage de janvier, volontairement étroites — on ne
   refait pas un budget, on déplace des crédits et on signe des circulaires. */
export const ENVELOPPE_PRISE_FONCTION = 0.55;  // Md€, juin 2027, une seule fois
export const ENVELOPPE_RENTREE = 0.22;         // Md€, chaque septembre (circulaire de rentrée)
export const TAILLE_MENU_COURT = 5;            // menus resserrés hors janvier

/* Combien d'annonces une fenêtre peut porter. La contrainte n'est pas
   budgétaire mais réglementaire et humaine : le calendrier du Conseil
   supérieur de l'éducation, les textes à écrire, et la capacité du ministère
   à accompagner ce qu'il annonce. Un ministre qui annonce six réformes dans
   l'année n'en applique aucune. */
export const ANNONCES_MAX = { prise_fonction: 3, rentree: 3, livraison: 3, janvier: 3 };

/* ---------------------------------------------------------------------------
   L'AVANCE DE GESTION — le premier arbitrage, juin 2027
   ---------------------------------------------------------------------------
   Un ministre qui arrive en juin n'a pas de budget à lui : la loi de finances
   est votée. Mais il a un levier réel, et un seul — la RÉSERVE DE PRÉCAUTION.
   Chaque programme est gelé dès le début de l'exercice (taux de mise en réserve
   de 0,5 % sur les crédits de personnel et de 5 % hors personnel, reconduits
   d'une loi de finances à l'autre). Sur une mission de 65 Md€, cela immobilise
   plusieurs centaines de millions d'euros que Bercy peut dégeler — ou pas.

   Le dégel n'est jamais gratuit : il se paie en engagement sur le schéma
   d'emplois de l'exercice suivant. C'est exactement l'échange que le jeu
   propose au joueur dès son premier jour, et le manquement se paie en janvier.
   ------------------------------------------------------------------------- */
export const AVANCE_GESTION = [
  {
    id: 'rien',
    titre: 'Ne rien demander',
    detail: 'Vous vous en tenez aux crédits que votre prédécesseur a laissés disponibles. Bercy apprécie les ministres qui ne commencent pas par tendre la main.',
    bonus: 0, proba: 1, capital: 0, bercy: +4,
    mot: 'Sobre. Vous aurez de quoi faire une chose, et une seule.',
  },
  {
    id: 'reserve',
    titre: 'Demander le dégel de la réserve de précaution',
    detail: 'La demande normale d’un ministre normal, sur le dégel partiel de la mise en réserve. Elle passe le plus souvent.',
    bonus: 0.40, proba: 0.80, capital: -2, bercy: 0,
    mot: 'Elle s’obtient presque toujours. Presque.',
  },
  {
    id: 'motivee',
    titre: 'Demander davantage, en nommant la mesure que cela financera',
    detail: 'Bercy accepte plus volontiers ce qu’il peut inscrire en face d’une ligne. En contrepartie, la mesure choisie est engagée : vous la porterez, qu’elle vous plaise encore ou non.',
    bonus: 0.65, proba: 0.72, capital: -4, bercy: -2, exigeMesure: true,
    mot: 'On finance un objet, jamais une intention. C’est la première leçon de la rue de Rivoli.',
  },
  {
    id: 'arbitrage',
    titre: 'Monter l’arbitrage au Premier ministre',
    detail: 'Vous demandez le dégel intégral et une avance sur l’exercice suivant. Le taux de réussite est faible, le coût politique est immédiat, et un refus se sait.',
    bonus: 0.85, proba: 0.45, capital: -7, bercy: -6,
    mot: 'Trois mesures dès juin, ou une humiliation dès juin. Il n’y a pas de troisième issue.',
  },
];

/* Refus de Bercy : ce qu'il en coûte d'avoir demandé et de ne pas avoir obtenu.
   Le crédit ne s'effondre pas — demander est légitime — mais cela se sait. */
export const REFUS_BERCY = { creditBercy: -4, capital: -3 };

/* L'intention de restitution, déclarée en juin devant la note démographique.
   Elle n'engage à rien juridiquement et engage à tout politiquement : Bercy la
   compare à ce que le ministre fait réellement au mois de janvier. */
export const INTENTIONS_POSTES = [
  { id: 'rendre', titre: 'Rendre à Bercy l’essentiel des postes libérés',
    detail: 'La ligne de la rentrée 2026 : 60 % des postes que la démographie libère repartent au budget de l’État.',
    restitution: 0.60, bercy: +10, adhesion: -6,
    mot: 'Bercy vous inscrit dans la colonne des sérieux. La salle des professeurs vous inscrit ailleurs.' },
  { id: 'partager', titre: 'Partager entre restitution et encadrement',
    detail: 'La moitié rendue, la moitié réinvestie. Personne n’est satisfait, ce qui est parfois le signe d’un arbitrage.',
    restitution: 0.45, bercy: +4, adhesion: -2,
    mot: 'La position médiane a ceci de commode qu’on peut la défendre devant les deux publics. Et ceci d’inconfortable qu’on la défend deux fois.' },
  { id: 'investir', titre: 'Réinvestir la quasi-totalité dans l’encadrement',
    detail: 'La ligne de la rentrée 2025 : les postes restent dans les classes. Bercy le tiendra pour un engagement non tenu par avance.',
    restitution: 0.10, bercy: -9, adhesion: +7,
    mot: 'Vous venez de dépenser, en une phrase, la moitié de ce que Bercy vous aurait concédé en janvier.' },
];

/* Le printemps rouvre le dossier des mesures contestées : ce qui n'a pas été
   retiré à l'automne revient, et l'intersyndicale a eu six mois pour préparer
   sa mobilisation. Une réforme n'est jamais acquise tant qu'elle est jeune. */
export const RETRAIT_MARS = { proba: 0.42 };

/* Le prix du manquement : Bercy compare l'engagement de juin à la restitution
   de janvier. Un ministre qui ne tient pas sa signature ne la redonne pas. */
export const MANQUEMENT_ENGAGEMENT = { creditBercy: 16, capital: 6 };

/* Le calendrier réglementaire ne suit pas les annonces : trois mesures en juin
   sont possibles, mais la troisième restera dans les tuyaux. C'est la DGESCO
   qui le dit, et elle a rarement tort sur ce point. */
export const TROISIEME_ANNONCE = { probaRetard: 0.62, effetSiRetard: 0.25 };

/* Paliers de la lettre plafond de juillet, selon le crédit Bercy.  [B.6, C.4]
   schemaEmplois = ETP que Bercy EXIGE de rendre ; marge = Md€ concédés. */
export const PALIERS_BERCY = [
  { seuil: 75, schemaEmplois: -800,  marge: 1.80, ton: 'confiant' },
  { seuil: 55, schemaEmplois: -2200, marge: 1.05, ton: 'vigilant' },
  { seuil: 35, schemaEmplois: -4000, marge: 0.62, ton: 'ferme' },
  { seuil: 0,  schemaEmplois: -6200, marge: 0.18, ton: 'comminatoire' },
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
  budget:   { nom: 'Salaires', court: 'Salaires' },
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

/* La requalification : ce qui reste d'une réforme rendue facultative. Le
   « choc des savoirs » a été mis en œuvre à moins de 20 % de conformité avant
   d'être requalifié puis vidé ; on retient un ordre de grandeur voisin. */
export const REQUALIFICATION = { effetRestant: 0.18 };

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

/* LA RÉVERSION — ce qui reste d'une réforme après le départ de son ministre.
   Précédent : réforme du collège 2015, deux ans de préparation, une année
   d'application, abrogation partielle par décret dès mai 2017. Une réforme non
   consolidée (ni inscrite dans la loi, ni budgétée pluriannuellement, ni
   appropriée par le terrain) ne survit pas au changement de gouvernement. */
export const REVERSION = { effetSurvivant: 0.62 };

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
/* Les noms sont des pseudonymes transparents (satire symétrique : toutes les
   organisations sont altérées du même degré). Les identifiants, pondérations
   (élections CSA 2022) et profils correspondent aux organisations réelles. */
export const SYNDICATS = [
  { id: 'fsu',   nom: 'FUSE',             poids: 34.05, seuil: 2.4, profil: 'rapport_de_force' },
  { id: 'unsa',  nom: 'UNISA Éducation',  poids: 19.37, seuil: 3.4, profil: 'reformiste' },
  { id: 'fo',    nom: 'FNEC-OF',          poids: 14.05, seuil: 1.8, profil: 'frontal' },
  { id: 'cfdt',  nom: 'Sgen-CFTD',        poids: 7.80,  seuil: 3.7, profil: 'negociation' },
  { id: 'cgt',   nom: "CGT Éduc'axion",   poids: 6.64,  seuil: 1.7, profil: 'radical' },
  { id: 'snalc', nom: 'SNACL',            poids: 6.21,  seuil: 3.0, profil: 'corporatiste' },
  { id: 'sud',   nom: 'SÜD Éducation',    poids: 5.09,  seuil: 1.5, profil: 'radical' },
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
export const CREDIT_BERCY_INITIAL = 48;

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
  remaniementBase: 0.205,
  remaniementParCapital: 900,
  remaniementParParents: 700,
  remaniementMin: 0.03, remaniementMax: 0.30,
};

/* ===========================================================================
   11. LES TURBULENCES — profil, crédibilité, affaires        [source E, G]
   ---------------------------------------------------------------------------
   Sur les six causes documentées de chute d'un ministre de l'Éducation, UNE
   SEULE relève de la politique éducative. Les cinq autres tiennent à la
   posture, à la communication, au hasard biographique ou au périmètre de la
   nomination. Un ministre tombe plus souvent sur une phrase que sur un bilan.

   Trois règles ont guidé l'écriture de ce bloc :
   · les situations sont inspirées de faits publics, les personnages sont
     fictifs et aucune affaire n'est rejouée sous le nom de qui que ce soit ;
   · une affaire médiatique n'est pas une culpabilité : une sur quatre se
     dégonfle, et le coût politique reste largement encaissé ;
   · le profil détermine des EXPOSITIONS, jamais des capacités. Aucun profil
     n'est meilleur qu'un autre au sens des compteurs éducatifs.
   ========================================================================= */

/* Le profil du ministre : c'est LE JOUEUR qui le déclare, comme on remplit une
   notice biographique le jour de sa nomination. Il ne change aucun compteur
   éducatif — aucun profil n'est meilleur qu'un autre — mais il décide de ce
   qu'on vous reprochera, et de ce que le corps enseignant attend de vous. */
export const PROFILS = [
  {
    id: 'serail', nom: 'Vous venez de la maison',
    detail: 'Ancien recteur, passé par l’administration centrale. Les personnels savent que vous connaissez le terrain ; la presse écrira que vous êtes le candidat de la continuité.',
    adhesion: +7, capital: -4, credibilite: +10,
    expose: ['privilege'],
  },
  {
    id: 'hautfonc', nom: 'Vous venez de la haute fonction publique',
    detail: 'Inspection générale des finances, cabinets ministériels. Vous savez tenir un arbitrage à Bercy ; on vous soupçonnera de tenir des comptes plutôt que des classes.',
    adhesion: -3, capital: +5, credibilite: +4,
    expose: ['privilege', 'faux_nez'],
  },
  {
    id: 'elu', nom: 'Vous venez d’un mandat d’élu local',
    detail: 'Maire, puis parlementaire. Vous connaissez les cartes scolaires par les maires qui les subissent ; on vous rappellera vos anciennes déclarations.',
    adhesion: +2, capital: +2, credibilite: -2,
    expose: ['faux_nez', 'lieu'],
  },
  {
    id: 'civile', nom: 'Vous venez de la société civile',
    detail: 'Chercheur, chef d’entreprise ou dirigeant associatif. On vous a nommé pour votre regard neuf ; on vous le reprochera dès la première difficulté.',
    adhesion: -8, capital: +7, credibilite: -4,
    expose: ['illegitimite', 'ecole_enfants'],
  },
];

/* L'ENTRETIEN DE L'ÉLYSÉE — avant de vous nommer, on vérifie que vous ne
   salirez pas l'image du Président. Les questions sont courtes, les réponses
   sont fermées, et personne ne vérifie. C'est là que le joueur décide, sans le
   savoir, de ce qui pourra lui exploser à la figure : chaque réponse ouvre ou
   ferme une exposition, et MENTIR ferme la porte aujourd'hui pour la rouvrir
   en grand plus tard. */
export const ENTRETIEN = [
  {
    id: 'prive',
    question: 'Vos enfants sont-ils scolarisés dans le public ?',
    aparte: 'Le conseiller ne lève pas les yeux de sa fiche. La question n’est pas morale, elle est médiatique.',
    reponses: [
      { label: 'Oui, dans le public', valeur: 'public',
        det: 'C’est vrai, et cela vous met à l’abri de la polémique la plus fréquente du poste.',
        credibilite: 0, ferme: ['ecole_enfants'] },
      { label: 'Non, dans le privé sous contrat — et je l’assume', valeur: 'prive_assume',
        det: 'Beaucoup de responsables publics font ce choix. L’assumer d’emblée désamorce à moitié ce qui viendra.',
        credibilite: +3, expose: ['ecole_enfants'] },
      { label: '« Dans le public, bien sûr. »', valeur: 'mensonge',
        det: 'Ce n’est pas vrai. Personne ne vérifiera aujourd’hui. C’est exactement ainsi que se fabriquent les affaires.',
        credibilite: +6, expose: ['ecole_enfants'], mensonge: true },
    ],
  },
  {
    id: 'patrimoine',
    question: 'Rien à déclarer côté patrimoine ? Aucun mandat rémunéré qui traîne ?',
    aparte: 'Votre déclaration d’intérêts sera publiée par la Haute Autorité pour la transparence de la vie publique. Tout le monde pourra la lire.',
    reponses: [
      { label: 'Rien à signaler, ma déclaration est à jour', valeur: 'net',
        det: 'La déclaration part demain à la Haute Autorité. Vous dormirez mieux.',
        credibilite: 0, ferme: ['privilege'] },
      { label: 'Un poste universitaire en sommeil, avec décharge', valeur: 'decharge',
        det: 'Parfaitement régulier, et parfaitement inexplicable à des enseignants à qui vous demanderez de faire leurs heures.',
        credibilite: +2, expose: ['privilege'] },
      { label: '« Absolument rien. »', valeur: 'mensonge',
        det: 'Le poste universitaire existe toujours. Un hebdomadaire satirique met en moyenne dix-huit mois à trouver ce genre de chose.',
        credibilite: +5, expose: ['privilege'], mensonge: true },
    ],
  },
  {
    id: 'passe',
    question: 'Rien dans vos fonctions précédentes qui puisse nous revenir dessus ?',
    aparte: 'Traduction : y a-t-il un dossier que vous avez laissé passer il y a dix ans, et dont personne ne parlait alors ?',
    reponses: [
      { label: 'Rien à ma connaissance', valeur: 'rien',
        det: 'La formule est prudente. C’est aussi celle qu’on repasse au journal de 20 heures le jour où il s’avère qu’il y avait quelque chose.',
        credibilite: 0 },
      { label: 'Un signalement que je n’ai pas transmis, dans un internat', valeur: 'signale',
        det: 'Vous le dites avant qu’on ne le trouve. Le cabinet préparera une réponse ; elle existera le jour où il faudra.',
        credibilite: -4, ferme: ['passe'] },
      { label: '« Rien, absolument rien. »', valeur: 'mensonge',
        det: 'Il y a quelque chose. Une commission d’enquête met en moyenne trois ans à s’en saisir. Vous en avez cinq.',
        credibilite: +4, expose: ['passe'], mensonge: true },
    ],
  },
];

/* Mentir à l'Élysée ne coûte rien sur le moment. Cela multiplie la probabilité
   que l'affaire correspondante sorte, et alourdit son coût quand elle sort. */
export const MENSONGE = { multiplicateurTirage: 2.2, aggravation: 1.45 };

/* LA CRÉDIBILITÉ — la ressource de parole, distincte du capital politique.
   Elle conditionne l'efficacité de tout ce que le ministre annonce : à
   crédibilité effondrée, l'annonce ne porte plus, quelle que soit la mesure.
   Elle se dégrade vite (affaire, revirement, requalification) et se reconstitue
   très lentement. C'est la jauge qui manque à la plupart des jeux de gestion,
   et celle sur laquelle les carrières se jouent réellement. */
export const CREDIBILITE = {
  initiale: 62,
  parAn: +4,                 // reconstitution lente
  parRequalification: -9,    // un revirement se paie en parole
  parAbandon: -5,
  parRentreeRatee: -4,
  /* Facteur appliqué à l'effet-vitrine : 0,55 + 0,90 × (crédibilité / 100).
     À 62 → ×1,11. À 20 → ×0,73. À 95 → ×1,41. */
  base: 0.55, pente: 0.90,
};

/* Probabilité qu'une affaire sorte, par an. Faible en soi ; multipliée quand
   elle résonne avec ce que le ministre vient de faire — c'est la règle la plus
   fidèle au réel de tout le dossier : on n'est pas puni pour ce qu'on fait, on
   est puni pour l'ÉCART entre ce qu'on exige des autres et ce qu'on s'applique. */
export const AFFAIRES_TIRAGE = {
  base: 0.095,               // probabilité par an qu'une affaire sorte, hors résonance
  resonance: 2.6,            // ×2,6 si le ministre a joué une carte du même thème
  exposition: 1.7,           // ×1,7 si son profil y est exposé
  plafondAnnuel: 0.42,       // même très exposé, l'année peut être calme
  maxParPartie: 2,
  probaDegonflement: 0.25,   // une sur quatre se dégonfle — le coût reste à moitié
  remboursement: 0.5,
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

/* ---------------------------------------------------------------------------
   10. LES PROJETS DE 2027                                       [source B.7]
   ------------------------------------------------------------------------- */
/* Chaque compteur du score est au cœur de projets politiques réels débattus en
   2027 (propositions publiques, août 2026). La feuille de route que déclare le
   joueur le situe donc, qu'il le veuille ou non, sur une carte politique
   existante — c'est le premier enseignement du jeu : il n'y a pas de priorité
   neutre. Le `decode` sert à la revue de presse du premier jour.
   Neutralité par attribution : on cite, on ne juge pas. */
export const PROJETS_2027 = {
  reussite: {
    sousTitre: 'Les acquis des élèves, mesurés par les évaluations nationales et internationales.',
    porteurs: [
      { qui: 'Gabriel Attal', quoi: 'le « choc des savoirs » : exigence, certificats, groupes, brevet obligatoire' },
      { qui: 'Édouard Philippe', quoi: 'l’autonomie des établissements jugée sur les résultats, publiés' },
      { qui: 'David Lisnard', quoi: 'évaluation systématique et rémunération conditionnée' },
    ],
    decode: 'Vous entrez sur le terrain du « niveau », celui où campent Attal, Philippe et Lisnard — avec chacun un chemin incompatible avec les deux autres.',
  },
  egalite: {
    sousTitre: 'Le poids de l’origine sociale sur les résultats — le point le plus faible de la France dans les comparaisons.',
    porteurs: [
      { qui: 'Jean-Luc Mélenchon', quoi: '19 élèves par classe maximum, abrogation de la loi Carle' },
      { qui: 'Raphaël Glucksmann', quoi: 'le privé sous contrat intégré à la carte scolaire' },
      { qui: 'le NFP', quoi: 'financement du privé conditionné à la mixité sociale' },
    ],
    decode: 'Priorité revendiquée par toute la gauche — Mélenchon, Glucksmann, le NFP — avec le privé sous contrat en ligne de mire. Le mot « Savary » n’est jamais loin.',
  },
  sante: {
    sousTitre: 'Attractivité du métier, remplacement, moral : la capacité du système à fonctionner.',
    porteurs: [
      { qui: 'le PS', quoi: 'salaires alignés sur la moyenne de l’OCDE' },
      { qui: 'Raphaël Glucksmann', quoi: 'une loi de programmation de revalorisation pluriannuelle' },
      { qui: 'Gabriel Attal', quoi: '+200 à +500 € par mois (chiffré à 2,5 Md€)' },
    ],
    decode: 'La revalorisation traverse tout le spectre — du PS à Attal — mais chacun paie différemment : sans condition, contre missions, ou contre évaluation. Le diable est dans la contrepartie.',
  },
  paix: {
    sousTitre: 'Grèves, mobilisations, climat social : l’histoire du mandat, qui ne s’efface pas.',
    porteurs: [
      { qui: 'Michel Barnier', quoi: 'le pacte pluriannuel : de la visibilité contre du calme' },
      { qui: 'aucun programme', quoi: 'ne la revendique — mais tous la supposent acquise' },
    ],
    decode: 'Aucun candidat ne fait campagne sur la paix scolaire : elle ne rapporte des voix que quand elle manque. Vous venez d’en faire une priorité — c’est original, et invérifiable en meeting.',
  },
  budget: {
    sousTitre: 'Tenir la lettre plafond ET rattraper les salaires : la quadrature du premier budget de l’État.',
    porteurs: [
      { qui: 'Édouard Philippe', quoi: '+20 % en 5 ans, financés par la baisse démographique' },
      { qui: 'David Lisnard', quoi: 'la même somme, conditionnée à l’autonomie et à la présence' },
      { qui: 'la FSU', quoi: '(côté personnels) un rattrapage de +20 % du point, chiffré à 10 Md€' },
    ],
    decode: 'Le sérieux budgétaire appliqué à l’école : c’est la ligne Philippe-Lisnard. Bercy vous adore déjà ; la salle des professeurs a un doute.',
  },
};

/* Taille du menu de mesures par année de mandat : on commence resserré pour
   que chaque carte soit vraiment lue, on élargit avec l'expérience du joueur. */
export const TAILLES_MENU = [8, 11, 14, 16, 16];

export const MOIS = ['janvier','février','mars','avril','mai','juin',
                     'juillet','août','septembre','octobre','novembre','décembre'];
