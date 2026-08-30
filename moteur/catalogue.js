/* ============================================================================
   RUE DE GRENELLE — CATALOGUE DES MESURES (phase moteur : 12 cartes-leçons)
   ----------------------------------------------------------------------------
   Chaque carte cite ses PORTEURS RÉELS (neutralité par attribution : le jeu ne
   dit jamais qu'une doctrine est la bonne) et la SOURCE de son effet réel.

   Deux effets par carte :
   - `vitrine` : chiffré, immédiat, visible. C'est ce que le joueur voit.
   - `reel`    : jamais chiffré à l'écran. Le joueur ne voit qu'un nombre de
                 cadenas (niveau de preuve) et un délai. Il découvre au bilan
                 ce qu'il a réellement produit.

   Champs :
     cout      Md€/an récurrents (hors CAS)      coutETP  ETP créés (+) / rendus (−)
     pol       capital gouvernemental consommé   perimetre 'ministeriel' | 'matignon'
     greve     { intensite 1-5, theme, segment } reforme  compte dans l'absorption
     goulot    l'effet est plafonné par le taux de postes effectivement pourvus
   ========================================================================== */

export const CATALOGUE = [

  /* ------------------------------------------------------------------ 1 --- */
  {
    id: 'formation',
    label: 'Plan national de formation continue sur le temps de service',
    famille: 'moyens',
    porteurs: ['OCDE/TALIS 2024', 'Cour des comptes', 'Education Endowment Foundation'],
    perimetre: 'ministeriel',
    cout: 0.62, coutETP: 2500, pol: 5,
    theme: 'formation', once: true, reforme: true,
    vitrine: { parents: -4, enseignants: +7, presse: -1, compteurs: { sante: -6, reussite: -3 } },
    reel: [
      { compteur: 'reussite', central: 9, delai: 4, cadenas: 5, source: 'EEF : feedback +6 mois, métacognition +7/8 mois, 5 cadenas' },
      { compteur: 'sante',    central: 6, delai: 3, cadenas: 4, source: 'TALIS 2024 : France dernière des 48 pays, marge maximale' },
    ],
    physique: { hna: { delta: +1.5, duree: 2 }, adhesion: +5 },
    mot: "L'effet réel le plus solide du catalogue. Il coûte deux ans d'heures non assurées, et personne ne vous en félicitera avant votre départ.",
  },

  /* ------------------------------------------------------------------ 2 --- */
  {
    id: 'redoublement',
    label: 'Redoublement facilité, décision rendue aux équipes et aux familles',
    famille: 'autorite',
    porteurs: ['une large majorité de l’opinion', 'plusieurs candidats de droite'],
    perimetre: 'ministeriel',
    cout: 0.55, coutETP: 0, pol: 3,
    theme: 'redoublement', once: true, reforme: true,
    vitrine: { parents: +9, enseignants: +1, presse: +6, compteurs: { reussite: +8 } },
    reel: [
      { compteur: 'reussite', central: -7, delai: 3, cadenas: 4, source: 'CSEN note 15 (Gurgand) : effet négatif, décrochage accru, coût ≈ une année de scolarité' },
      { compteur: 'egalite',  central: -8, delai: 4, cadenas: 4, source: 'CSEN : le redoublement frappe très majoritairement les élèves défavorisés' },
    ],
    physique: {},
    mot: "Coûteux, contre-productif, et populaire. Le miroir exact de la formation continue : tout ce que le tableau de bord adore et que le bilan déteste.",
  },

  /* ------------------------------------------------------------------ 3 --- */
  {
    id: 'revalorisation',
    label: 'Revalorisation des enseignants',
    famille: 'moyens',
    porteurs: ['FSU (+20 % du point ≈ 10 Md€)', 'PS (moyenne OCDE)', 'Attal (+200 à +500 €/mois)', 'Lisnard (+20 %/5 ans conditionnés)'],
    perimetre: 'ministeriel',
    cout: 1.3, coutETP: 0, pol: 7,
    once: false, reforme: false,          // répétable : une mesure salariale par budget
    parametrique: 'revalorisation',   // deux curseurs : cible × contrepartie
    vitrine: { parents: 0, enseignants: +6, presse: +2, compteurs: { budget: +5 } },
    reel: [],   // construits par le moteur selon les curseurs
    physique: {},
    mot: "Trois façons de dépenser exactement la même somme, et trois pays différents à l'arrivée.",
  },

  /* ------------------------------------------------------------------ 4 --- */
  {
    id: 'dedoublement',
    label: 'Extension du dédoublement aux GS/CP/CE1 hors éducation prioritaire',
    famille: 'moyens',
    porteurs: ['prolongement de la politique engagée en 2017', 'PS', 'Mélenchon (≤19/classe)'],
    perimetre: 'ministeriel',
    cout: 0.42, coutETP: 5200, pol: 5,
    theme: 'taille_classe', once: true, excl: 'encadrement', reforme: true,
    vitrine: { parents: +5, enseignants: +3, presse: +4, compteurs: { egalite: +5 } },
    reel: [
      { compteur: 'egalite',  central: 8, delai: 4, cadenas: 4, source: 'DEPP 2021 (15 000 élèves, 408 écoles) : +8 % d’écart-type en français, +13 % en maths ; élèves en très grande difficulté −7,8 / −12,5 pts' },
      { compteur: 'reussite', central: 2, delai: 4, cadenas: 4, source: 'DEPP 2021 : bénéfice limité voire nul pour les meilleurs élèves' },
    ],
    physique: {},
    mot: "Fait beaucoup pour les inégalités, presque rien pour la moyenne. Aucun journal ne titrera là-dessus, et c'est bien le problème.",
  },

  /* ------------------------------------------------------------------ 5 --- */
  {
    id: 'classe19',
    label: 'Plafond général de 19 élèves par classe',
    famille: 'moyens',
    porteurs: ['Mélenchon', 'PS'],
    perimetre: 'ministeriel',
    cout: 0, coutETP: 0, pol: 11,          // dépend du financement choisi
    theme: 'taille_classe', once: true, excl: 'encadrement', reforme: true,
    parametrique: 'financement19',          // recrutement (Bercy) ou démographie (syndicats)
    vitrine: { parents: +8, enseignants: +6, presse: +5, compteurs: { egalite: +5, sante: +4 } },
    reel: [
      { compteur: 'reussite', central: 4, delai: 5, cadenas: 3, source: 'STAR / Piketty-Valdenaire : 20-30 % d’écart-type, effet concentré sur les défavorisés' },
      { compteur: 'egalite',  central: 5, delai: 5, cadenas: 3, source: 'idem — l’effet de taille de classe est très inégalement réparti' },
    ],
    physique: {},
    mot: "La même vitrine que le dédoublement, pour dix fois le prix. Reste à savoir qui paie : Bercy, ou la carte scolaire.",
  },

  /* ------------------------------------------------------------------ 6 --- */
  {
    id: 'aesh',
    label: 'Création d’un corps de fonctionnaires AESH',
    famille: 'moyens',
    porteurs: ['PS', 'Mélenchon', 'SNALC', 'collectif AESH'],
    contre: ['rapport IGÉSR-IGAS : rejette la fonctionnarisation, propose +10 % via une grille type catégorie B'],
    perimetre: 'matignon',                  // législatif — rejeté au Sénat le 07/01/2026
    cout: 4.3, coutETP: 0, pol: 16,
    theme: 'aesh', once: true, reforme: false,
    vitrine: { parents: +7, enseignants: +8, presse: +5, compteurs: { sante: +6 } },
    reel: [
      { compteur: 'sante',   central: 7, delai: 2, cadenas: 3, source: 'stabilisation d’un corps de 146 000 personnes aujourd’hui à temps incomplet subi' },
      { compteur: 'egalite', central: 4, delai: 3, cadenas: 2, source: '520 600 élèves en situation de handicap scolarisés, notifications MDPH +10 %/an' },
    ],
    physique: { adhesion: +4, affection: +2 },
    mot: "4,3 milliards. Soit environ neuf fois toute la marge que Bercy vous concédera en cinq ans. Les experts sont contre, les personnels sont pour. Bon courage.",
  },

  /* ------------------------------------------------------------------ 7 --- */
  {
    id: 'sante_scolaire',
    label: 'Plan de recrutement en santé scolaire (infirmiers, PsyEN, assistants sociaux)',
    famille: 'moyens',
    porteurs: ['Cour des comptes', 'intersyndicale', 'fédérations de parents'],
    perimetre: 'ministeriel',
    cout: 0.19, coutETP: 1200, pol: 3,
    theme: 'sante_scolaire', once: true, reforme: false,
    goulot: true,                           // l'argent ne produit qu'au rythme des concours pourvus
    vitrine: { parents: +5, enseignants: +4, presse: +2, compteurs: { sante: +2 } },
    reel: [
      { compteur: 'sante',   central: 5, delai: 3, cadenas: 3, source: '~900 médecins pour 12 M d’élèves ; 20 % des visites de la 6e année réalisées' },
      { compteur: 'egalite', central: 3, delai: 4, cadenas: 2, source: 'désengagement scolaire 31 % en IPS faible contre 19,4 % en IPS élevé' },
    ],
    physique: {},
    mot: "Le PLF 2026 a voté +300 postes. Les concours n'en ont pourvu qu'une fraction : 41 postes de PsyEN non pourvus sur 147. Un budget voté n'est pas une politique faite.",
  },

  /* ------------------------------------------------------------------ 8 --- */
  {
    id: 'palier',
    label: 'Report d’un an du palier d’orientation (tronc commun jusqu’en seconde)',
    famille: 'parcours',
    porteurs: ['réforme polonaise de 1999', 'CSEN', 'chercheurs en économie de l’éducation'],
    perimetre: 'ministeriel',
    cout: 0.35, coutETP: 900, pol: 12,
    theme: 'palier', once: true, excl: 'orientation', reforme: true,
    vitrine: { parents: -3, enseignants: -2, presse: -2, compteurs: { reussite: -4 } },
    reel: [
      { compteur: 'reussite', central: 6, delai: 6, cadenas: 3, source: 'Pologne 1999 : facteur crucial de progression PISA, porté par les élèves les plus faibles' },
      { compteur: 'egalite',  central: 7, delai: 6, cadenas: 3, source: 'idem — l’orientation précoce est le principal canal de reproduction sociale' },
    ],
    physique: {},
    greve: { intensite: 2, theme: 'pedagogie', segment: 'lp' },
    mot: "Six ans de délai, aucune photo à la clé, et la voie professionnelle qui se sent visée. Un pari de ministre qui a lu les études plutôt que les sondages.",
  },

  /* ------------------------------------------------------------------ 9 --- */
  {
    id: 'differenciation',
    label: 'Différenciation précoce : groupes de niveau, certificat d’entrée en 6e, parcours dès la 4e',
    famille: 'parcours',
    porteurs: ['Attal', 'Lisnard', 'Zemmour (fin du collège unique)', 'Le Pen (collège modulaire)'],
    contre: ['IGÉSR juin 2025 : « dérive des continents »', 'Conseil d’État : censure partielle du dispositif'],
    perimetre: 'ministeriel',
    cout: 0.5, coutETP: 1800, pol: 10,
    theme: 'differenciation', once: true, excl: 'orientation', reforme: true,
    vitrine: { parents: +8, enseignants: -9, presse: +7, compteurs: { reussite: +8 } },
    reel: [
      { compteur: 'reussite', central: 1, delai: 4, cadenas: 2, source: 'littérature internationale : effet moyen proche de zéro sur la moyenne' },
      { compteur: 'egalite',  central: -9, delai: 4, cadenas: 2, source: 'effet de composition : les regroupements durables pénalisent les élèves faibles' },
    ],
    physique: {},
    greve: { intensite: 4, theme: 'pedagogie', segment: 'college' },
    mot: "Première tentative : appliqué dans moins de 20 % des établissements, puis censuré au Conseil d'État et abandonné en 2026. Vous voulez vraiment recommencer ?",
  },

  /* ----------------------------------------------------------------- 10 --- */
  {
    id: 'autonomie',
    label: 'Autonomie des établissements et publication des résultats',
    famille: 'autonomie',
    porteurs: ['Philippe', 'Barnier (pacte pluriannuel)', 'Lisnard (recrutement par les directions)'],
    perimetre: 'ministeriel',
    cout: 0.12, coutETP: 0, pol: 9,
    theme: 'autonomie', once: true, reforme: true,
    vitrine: { parents: +4, enseignants: -11, presse: +8, compteurs: { reussite: +7 } },
    reel: [
      { compteur: 'reussite', central: 3, delai: 4, cadenas: 2, source: 'preuve faible : résultats contradictoires selon les systèmes, variance maximale' },
      { compteur: 'egalite',  central: -4, delai: 4, cadenas: 2, source: 'publication des résultats : accroît l’évitement scolaire et la ségrégation' },
    ],
    physique: { segregation: +0.8 },
    greve: { intensite: 4, theme: 'statut', segment: 'tous' },
    mot: "Deux cadenas : l'effet réel peut aussi bien doubler que se retourner. C'est la carte la plus incertaine du jeu, et celle qui fait les meilleures unes.",
  },

  /* ----------------------------------------------------------------- 11 --- */
  {
    id: 'prive_mixite',
    label: 'Financement du privé sous contrat conditionné à des objectifs de mixité',
    famille: 'mixite',
    porteurs: ['NFP', 'Glucksmann (privé intégré à la carte scolaire)', 'Mélenchon (abrogation de la loi Carle)'],
    perimetre: 'matignon',
    cout: -0.15, coutETP: 0, pol: 15,       // rapporte de l'argent, coûte tout le reste
    theme: 'prive', once: true, reforme: true,
    guerreScolaire: true,                    // arme l'événement historique (Savary 1984)
    vitrine: { parents: -5, enseignants: +5, presse: +3, compteurs: { egalite: 0 } },
    reel: [
      { compteur: 'egalite', central: 10, delai: 3, cadenas: 3, source: 'IPS privé 117,4 vs public 99,9 ; part d’élèves très favorisés dans le privé 26,4 % (2000) → 40,2 % (2021)' },
    ],
    physique: { segregation: -2.4 },
    mot: "Le seul levier vraiment puissant sur la ségrégation. Aussi le seul qui ait déjà fait tomber un gouvernement — Savary, 1984, un million de personnes dans la rue.",
  },

  /* ----------------------------------------------------------------- 12 --- */
  {
    id: 'remplacement',
    label: 'Plan remplacement : brigades académiques et annualisation des obligations de service',
    famille: 'moyens',
    porteurs: ['fédérations de parents (FCPE, PEEP)', 'Cour des comptes'],
    contre: ['l’annualisation touche au statut : l’intersyndicale la refuse en bloc'],
    perimetre: 'ministeriel',
    cout: 0.48, coutETP: 4000, pol: 7,
    theme: 'remplacement', once: true, reforme: false,
    vitrine: { parents: +8, enseignants: -6, presse: +5, compteurs: { sante: +6 } },
    reel: [
      { compteur: 'sante',    central: 6, delai: 2, cadenas: 3, source: 'DEPP 26-14 : 9,8 % d’heures non assurées, ~2 h/semaine perdues par élève' },
      { compteur: 'reussite', central: 3, delai: 3, cadenas: 3, source: 'le temps d’enseignement effectivement reçu est un déterminant direct des acquis' },
    ],
    physique: { hna: { delta: -2.2, duree: 99 } },
    greve: { intensite: 3, theme: 'statut', segment: 'tous' },
    mot: "Ramener les heures non assurées de 9,8 % à 5 % rendrait aux élèves plus d'heures que 4 000 postes n'en coûtent. Encore faut-il toucher au statut pour y arriver.",
  },
];

/* --------------------------------------------------------------------------
   Cartes paramétriques : les curseurs et leurs effets différenciés.
   -------------------------------------------------------------------------- */

/* Revalorisation — chaîne 2 du brief (B.8-2) : revaloriser QUI, et contre quoi.
   Même coût, trois pays différents. */
export const REVALORISATION = {
  /* Combien on met sur la table. 1 Md€ récurrent ≈ +2 points de position
     salariale vs les autres diplômés du supérieur (cf. POINTS_SALAIRE_PAR_MD). */
  ampleurs: {
    geste:     { label: 'Un geste (0,5 Md€)', cout: 0.5,
                 mot: 'De quoi faire un communiqué. Pas de quoi faire une carrière.' },
    plan:      { label: 'Un plan pluriannuel (1,3 Md€)', cout: 1.3,
                 mot: 'L’ordre de grandeur d’une vraie mesure catégorielle. Il faudra la financer tous les ans, à vie.' },
    rattrapage:{ label: 'Un rattrapage (2,6 Md€)', cout: 2.6,
                 mot: 'Le quart de ce que réclame la FSU. Bercy va vous demander où vous avez trouvé ça.' },
  },
  cibles: {
    debuts: {
      label: 'Début de carrière (moins de 15 ans d’ancienneté)',
      note: 'Les revalorisations de 2023 ont déjà ciblé les débuts. On recommence.',
      positionSalariale: +4.0, adhesion: +2, attractiviteBonus: +9,
      reel: [{ compteur: 'sante', central: 6, delai: 1, cadenas: 4, source: 'effet sur le vivier de concours dès l’année suivante' }],
      mot: 'Les candidats arrivent vite. Les collègues de milieu de carrière, eux, comptent leurs années.',
    },
    milieux: {
      label: 'Milieu de carrière (le décrochage de −14 % vs OCDE)',
      note: 'Le point noir documenté par l’OCDE : 0 % d’évolution en dix ans pour les expérimentés.',
      positionSalariale: +4.5, adhesion: +9, attractiviteBonus: +2,
      reel: [{ compteur: 'sante', central: 7, delai: 2, cadenas: 3, source: 'OCDE 2025 : milieu de carrière −14 % vs moyenne OCDE ; principal moteur des démissions' }],
      mot: 'Aucun effet sur les concours de l’an prochain, un effet massif sur ceux qui sont déjà là.',
    },
    tous: {
      label: 'Tout le monde, uniformément',
      note: 'Le saupoudrage : 4,92 € le point d’indice, réparti sur 814 927 ETP.',
      positionSalariale: +2.5, adhesion: +4, attractiviteBonus: +4,
      reel: [{ compteur: 'sante', central: 3, delai: 2, cadenas: 3, source: 'effet dilué : la même somme divisée par tout le corps' }],
      mot: 'Personne n’est furieux, personne n’est content. Le degré zéro de la politique salariale, et souvent le plus sûr.',
    },
  },
  contreparties: {
    sans: {
      label: 'Sans contrepartie',
      porteurs: ['FSU', 'Mélenchon'],
      pol: +4, adhesion: +7, presse: -3, paixBonus: 1.0, hna: 0,
      mot: 'Bercy vous regardera comme si vous aviez rendu les clés de la maison.',
    },
    pacte: {
      label: 'Contre missions supplémentaires (« pacte »)',
      porteurs: ['Attal'],
      pol: 0, adhesion: -3, presse: +2, paixBonus: 1.0, hna: -0.6,
      note: '800 M€ au PLF 2025 pour ~34 % d’adhésion : les épuisés ne prennent pas de mission de plus.',
      mot: 'Un tiers des enseignants signent. Ce sont ceux qui allaient déjà bien.',
    },
    evaluation: {
      label: 'Contre évaluation, présence et formation obligatoire',
      porteurs: ['Lisnard', 'Philippe'],
      pol: -3, adhesion: -11, presse: +7, paixBonus: 1.0, hna: -0.3,
      greve: { intensite: 4, theme: 'statut', segment: 'tous' },
      mot: 'La presse adore. Les salles des professeurs beaucoup moins. Comptez une grève.',
    },
  },
};

/* Plafond de 19 élèves par classe — la « carte à deux financements » (B.8-3).
   Le même affichage, deux conflits opposés. */
export const FINANCEMENT_19 = {
  recrutement: {
    label: 'Par recrutement de 78 000 ETP (21,3 → 19 = ~60 000 divisions à créer)',
    cout: 5.6, coutETP: 78000, creditBercy: -26, adhesion: +7,
    mot: 'Bercy vous répondra que vous recrutez pendant que le nombre d’élèves s’effondre. Il n’aura pas complètement tort.',
  },
  demographie: {
    label: 'Par redéploiement intégral de la baisse démographique',
    cout: 0.35, coutETP: 0, creditBercy: -9, adhesion: +3,
    forceRestitutionMax: 0.10,   // interdit de rendre des postes à Bercy pendant la mesure
    mot: 'Gratuit, ou presque. Sauf que vous venez de promettre à Bercy le contraire de ce que vous ferez en janvier.',
  },
};

/* Les deux « mesures présidentielles » imposées en cours de mandat (aléa
   initial, comme l'élection du jeu de référence). Le joueur les applique
   (elles consomment son enveloppe) ou les abandonne (fatigue +15, capital −10). */
export const MESURES_PRESIDENTIELLES = ['differenciation', 'redoublement', 'autonomie', 'classe19', 'sante_scolaire', 'remplacement'];

export const PAR_ID = Object.fromEntries(CATALOGUE.map((c) => [c.id, c]));
