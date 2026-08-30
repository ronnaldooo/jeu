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
    theme: 'autonomie', once: true, excl: 'evaluation', reforme: true,
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
    provocations: 1,                         // une provocation : la guerre scolaire s'arme à 2
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

  /* ======================================================================
     EXTENSION DU CATALOGUE — cartes 13 à 40 (phase 2)
     Cinq familles doctrinales (B.7), porteurs réels cités, humour compris.
     ====================================================================== */

  /* ----------------------------- 13 · moyens ------------------------- */
  {
    id: 'maternelle',
    label: 'Plan langage en maternelle, priorité aux réseaux d’éducation prioritaire',
    famille: 'moyens',
    porteurs: ['CSEN', 'économie de l’éducation (rendement des investissements précoces)', 'PS'],
    perimetre: 'ministeriel',
    cout: 0.28, coutETP: 1500, pol: 4,
    theme: 'maternelle', once: true, reforme: true,
    vitrine: { parents: +1, enseignants: +2, presse: 0, compteurs: {} },
    reel: [
      { compteur: 'reussite', central: 5, delai: 6, cadenas: 4, source: 'recherche convergente : le rendement éducatif est maximal aux âges précoces' },
      { compteur: 'egalite',  central: 6, delai: 6, cadenas: 4, source: 'les écarts de vocabulaire sont installés à 4 ans ; l’intervention précoce les réduit' },
    ],
    physique: {},
    mot: "L'euro le mieux investi du système, et le seul dont l'inauguration n'intéresse personne : les bénéficiaires ont quatre ans et ne votent pas.",
  },

  /* ----------------------------- 14 · moyens / équité ----------------- */
  {
    id: 'ep_progressive',
    label: 'Refonte de l’éducation prioritaire : allocation progressive sur l’indice de position sociale',
    famille: 'moyens',
    porteurs: ['Cour des comptes', 'DEPP', 'une partie de l’encadrement'],
    contre: ['les réseaux sortants du label, leurs maires et leurs équipes'],
    perimetre: 'ministeriel',
    cout: 0.15, coutETP: 0, pol: 10,
    theme: 'ep', once: true, reforme: true,
    vitrine: { parents: -2, enseignants: -4, presse: +2, compteurs: { egalite: +2 } },
    reel: [
      { compteur: 'egalite',  central: 7, delai: 4, cadenas: 3, source: 'la difficulté sociale est continue : l’allocation progressive atteint les établissements hors label' },
      { compteur: 'reussite', central: 2, delai: 4, cadenas: 3, source: 'effet indirect via le ciblage des moyens' },
    ],
    physique: {},
    greve: { intensite: 2, theme: 'moyens', segment: 'tous' },
    mot: "Techniquement irréprochable : la difficulté sociale est continue, pas binaire. Politiquement : vous venez d'annoncer à cent collèges qu'ils perdent leur prime.",
  },

  /* ----------------------------- 15 · moyens ------------------------- */
  {
    id: 'titularisation',
    label: 'Plan de titularisation des contractuels enseignants',
    famille: 'moyens',
    porteurs: ['intersyndicale', 'PS'],
    perimetre: 'ministeriel',
    cout: 0.30, coutETP: 0, pol: 5,
    theme: 'contractuels', once: true, reforme: false,
    vitrine: { parents: +1, enseignants: +6, presse: -1, compteurs: { sante: +2 } },
    reel: [
      { compteur: 'sante', central: 4, delai: 2, cadenas: 3, source: 'stabilisation et formation d’agents déjà en poste, souvent recrutés en quelques jours' },
    ],
    physique: { adhesion: +3 },
    mot: "Ils font déjà cours depuis trois ans. Vous ne recrutez personne : vous reconnaissez l'existant, ce qui est à la fois moins cher et plus honnête.",
  },

  /* ----------------------------- 16 · moyens / climat ----------------- */
  {
    id: 'vie_scolaire',
    label: 'Renforcer la vie scolaire : CPE et assistants d’éducation, contrats stabilisés',
    famille: 'moyens',
    porteurs: ['intersyndicale', 'recherche sur le climat scolaire', 'chefs d’établissement'],
    perimetre: 'ministeriel',
    cout: 0.33, coutETP: 4000, pol: 4,
    theme: 'vie_scolaire', once: true, reforme: false,
    vitrine: { parents: +3, enseignants: +5, presse: +1, compteurs: { sante: +3 } },
    reel: [
      { compteur: 'sante',    central: 5, delai: 2, cadenas: 4, source: 'la densité et la stabilité des adultes sont le facteur le mieux établi du climat scolaire' },
      { compteur: 'reussite', central: 2, delai: 3, cadenas: 3, source: 'un climat apaisé rend du temps d’apprentissage effectif' },
    ],
    physique: {},
    mot: "Le climat scolaire n'est pas un discours sur l'autorité : c'est un budget de surveillants. Le discours est gratuit, c'est bien pour ça qu'on l'entend plus souvent.",
  },

  /* ----------------------------- 17 · moyens (le rabot) --------------- */
  {
    id: 'hsa',
    label: 'Recours massif aux heures supplémentaires plutôt qu’au recrutement',
    famille: 'moyens',
    porteurs: ['Bercy', 'tous les gouvernements depuis vingt ans'],
    perimetre: 'ministeriel',
    cout: 0.18, coutETP: 0, pol: 2,
    once: false, reforme: false,          // le rabot est éternel : répétable chaque année
    vitrine: { parents: +4, enseignants: -3, presse: +1, compteurs: { sante: +2 } },
    reel: [
      { compteur: 'sante', central: -2, delai: 3, cadenas: 3, source: 'l’intensification du travail nourrit l’épuisement et les démissions' },
    ],
    physique: { hna: { delta: -0.8, duree: 2 } },
    mot: "Une HSA coûte cinquante fois moins qu'un poste. C'est aussi la différence entre embaucher un collègue et faire ses heures à sa place.",
  },

  /* ----------------------------- 18 · moyens ------------------------- */
  {
    id: 'formation_initiale',
    label: 'Réforme de la formation initiale et du concours',
    famille: 'moyens',
    porteurs: ['tous vos prédécesseurs, sans exception'],
    perimetre: 'ministeriel',
    cout: 0.22, coutETP: 0, pol: 8,
    theme: 'formation_initiale', once: true, reforme: true,
    vitrine: { parents: 0, enseignants: -5, presse: +3, compteurs: {} },
    reel: [
      { compteur: 'sante',    central: 5, delai: 5, cadenas: 3, source: 'une formation en alternance mieux rémunérée reconstitue le vivier — après la transition' },
      { compteur: 'reussite', central: 3, delai: 6, cadenas: 3, source: 'des néotitulaires mieux formés tiennent mieux leurs classes' },
    ],
    physique: { attractivite: -9 },       // la transition casse une année de recrutement
    mot: "Chaque réforme de la formation casse une promotion le temps de la transition. La vôtre sera la neuvième en trente ans. Cette fois, c'est la bonne.",
  },

  /* ----------------------------- 19 · moyens / équité ----------------- */
  {
    id: 'decrochage',
    label: 'Repérage précoce du décrochage : un référent par établissement',
    famille: 'moyens',
    porteurs: ['consensus de la recherche', 'missions locales', 'régions'],
    perimetre: 'ministeriel',
    cout: 0.26, coutETP: 0, pol: 3,
    theme: 'decrochage', once: true, reforme: false,
    vitrine: { parents: +2, enseignants: +1, presse: 0, compteurs: { egalite: +1 } },
    reel: [
      { compteur: 'egalite', central: 5, delai: 4, cadenas: 4, source: 'le repérage précoce est la mesure la mieux évaluée contre le décrochage' },
      { compteur: 'sante',   central: 2, delai: 4, cadenas: 3, source: 'moins de sortants sans qualification, moins de classes ingérables' },
    ],
    physique: {},
    mot: "Le décrochage est un processus, pas un événement. Intervenir en 5e coûte dix fois moins cher que raccrocher un jeune de 18 ans — et fait cent fois moins de communiqués.",
  },

  /* ----------------------------- 20 · moyens / interministériel ------- */
  {
    id: 'sante_mentale',
    label: 'Conventions santé mentale : permanences des maisons des adolescents dans les établissements',
    famille: 'moyens',
    porteurs: ['fédérations de parents', 'agences régionales de santé'],
    perimetre: 'ministeriel',
    cout: 0.12, coutETP: 0, pol: 6,       // le coût est surtout de la négociation interministérielle
    theme: 'sante_mentale', once: true, reforme: false,
    vitrine: { parents: +4, enseignants: +1, presse: +2, compteurs: { sante: +2 } },
    reel: [
      { compteur: 'sante', central: 4, delai: 2, cadenas: 3, source: 'contourne le goulot de recrutement de la santé scolaire en mobilisant des personnels de santé publique' },
    ],
    physique: {},
    mot: "Faire soigner vos élèves par le budget d'un autre ministère : l'art d'être efficace avec l'argent qu'on n'a pas. Le revers : votre politique dépend d'un partenaire qui ne vous doit rien.",
  },

  /* ----------------------------- 21 · compétences partagées ----------- */
  {
    id: 'bati',
    label: 'Fonds d’amorçage pour la rénovation thermique du bâti scolaire',
    famille: 'moyens',
    porteurs: ['associations d’élus', 'parents d’élèves en juin'],
    perimetre: 'matignon',                // l'État n'est pas propriétaire des murs
    cout: 0.25, coutETP: 0, pol: 8,
    theme: 'bati', once: true, reforme: false,
    vitrine: { parents: +6, enseignants: +2, presse: +4, compteurs: {} },
    reel: [
      { compteur: 'sante',    central: 2, delai: 3, cadenas: 2, source: 'effet indirect : conditions de travail et d’étude' },
      { compteur: 'reussite', central: 1, delai: 4, cadenas: 2, source: 'la littérature sur le confort thermique est mince mais cohérente' },
    ],
    physique: {},
    mot: "Les écoles sont aux communes, les collèges aux départements, les lycées aux régions — et les photos de classes à 40 °C au ministre. Vous payez l'amorçage pour des murs qui ne sont pas à vous.",
  },

  /* ----------------------------- 22 · évaluation ---------------------- */
  {
    id: 'evaluation_diagnostic',
    label: 'Évaluations nationales rendues aux équipes, avec accompagnement — sans publication',
    famille: 'autonomie',
    porteurs: ['DEPP', 'encadrement', 'chercheurs en évaluation'],
    perimetre: 'ministeriel',
    cout: 0.07, coutETP: 0, pol: 3,
    theme: 'eval_diag', once: true, excl: 'evaluation', reforme: false,
    vitrine: { parents: -1, enseignants: +4, presse: -2, compteurs: {} },
    reel: [
      { compteur: 'reussite', central: 4, delai: 3, cadenas: 4, source: 'EEF : le feedback est l’intervention la mieux documentée du répertoire' },
      { compteur: 'egalite',  central: 2, delai: 3, cadenas: 3, source: 'le diagnostic oriente les moyens vers les besoins réels' },
    ],
    physique: {},
    mot: "La presse titrera « le ministre renonce à la transparence ». En réalité vous choisissez entre deux outils : un thermomètre pour soigner, ou un thermomètre pour classer les malades.",
  },

  /* ----------------------------- 23 · autonomie ----------------------- */
  {
    id: 'cheque_education',
    label: 'Chèque-éducation : financement attaché à l’élève, libre choix de l’établissement',
    famille: 'autonomie',
    porteurs: ['Lisnard'],
    contre: ['la quasi-totalité de la recherche comparative', 'les fédérations du public'],
    perimetre: 'matignon',
    cout: 0.40, coutETP: 0, pol: 14,
    theme: 'cheque', once: true, reforme: true,
    provocations: 1,
    vitrine: { parents: +3, enseignants: -8, presse: +6, compteurs: {} },
    reel: [
      { compteur: 'reussite', central: 1, delai: 4, cadenas: 1, source: 'aucun pays comparable ne l’a fait à l’échelle : preuve minimale, variance maximale' },
      { compteur: 'egalite',  central: -6, delai: 4, cadenas: 2, source: 'les systèmes à libre choix accroissent le tri social (Chili, Suède)' },
    ],
    physique: { segregation: +1.0 },
    greve: { intensite: 3, theme: 'prive', segment: 'tous' },
    mot: "Aucun pays comparable ne l'a fait à l'échelle. Vous serez le pionnier, ou le cas d'école — au sens propre.",
  },

  /* ----------------------------- 24 · autonomie ----------------------- */
  {
    id: 'recrutement_direction',
    label: 'Recrutement des enseignants par les chefs d’établissement',
    famille: 'autonomie',
    porteurs: ['Lisnard', 'Philippe (version expérimentale)'],
    perimetre: 'ministeriel',
    cout: 0.05, coutETP: 0, pol: 9,
    theme: 'recrutement_local', once: true, reforme: true,
    vitrine: { parents: +2, enseignants: -9, presse: +5, compteurs: {} },
    reel: [
      { compteur: 'reussite', central: 2, delai: 4, cadenas: 2, source: 'résultats contradictoires selon les systèmes ; dépend entièrement de la qualité des directions' },
      { compteur: 'egalite',  central: -3, delai: 4, cadenas: 2, source: 'les établissements difficiles perdent au marché des mutations' },
    ],
    physique: {},
    greve: { intensite: 3, theme: 'statut', segment: 'tous' },
    mot: "Les établissements attractifs recruteront les meilleurs. Les autres recruteront.",
  },

  /* ----------------------------- 25 · autonomie ----------------------- */
  {
    id: 'pacte_pluriannuel',
    label: 'Pacte pluriannuel : moyens garantis trois ans contre contractualisation d’objectifs',
    famille: 'autonomie',
    porteurs: ['Barnier', 'recteurs', 'associations d’élus'],
    perimetre: 'ministeriel',
    cout: 0.10, coutETP: 0, pol: 5,
    theme: 'pluriannuel', once: true, reforme: false,
    bercy: -3,                            // Bercy déteste s'engager au-delà de l'annualité
    vitrine: { parents: +1, enseignants: +3, presse: +1, compteurs: {} },
    reel: [
      { compteur: 'sante', central: 3, delai: 3, cadenas: 3, source: 'la visibilité pluriannuelle stabilise les équipes et déclenche l’investissement local' },
    ],
    physique: { adhesion: +2 },
    mot: "Une commune ne rénove pas une école qu'elle croit condamnée, un principal ne s'engage pas sur des moyens repris en février. La visibilité est une politique — que Bercy compte comme une reddition.",
  },

  /* ----------------------------- 26 · parcours ------------------------ */
  {
    id: 'groupes_besoins',
    label: 'Groupes de besoins temporaires, à la main des équipes',
    famille: 'parcours',
    porteurs: ['Sgen-CFDT (l’a arrachée puis défendue)', 'IGÉSR (version souple)'],
    perimetre: 'ministeriel',
    cout: 0.24, coutETP: 0, pol: 4,
    theme: 'groupes_besoins', once: true, excl: 'orientation', reforme: true,
    vitrine: { parents: +2, enseignants: +1, presse: 0, compteurs: {} },
    reel: [
      { compteur: 'reussite', central: 3, delai: 3, cadenas: 3, source: 'différencier sans assigner : le compromis le plus étayé sur l’hétérogénéité' },
      { compteur: 'egalite',  central: 2, delai: 3, cadenas: 3, source: 'regroupements courts et réversibles : pas d’effet d’étiquetage mesuré' },
    ],
    physique: {},
    mot: "Différencier sans étiqueter. Exigeant, invisible, efficace là où les équipes y croient — c'est-à-dire là où vous ne décidez pas.",
  },

  /* ----------------------------- 27 · parcours ------------------------ */
  {
    id: 'brevet_barrage',
    label: 'Brevet obligatoire pour l’entrée en seconde, avec classes « prépa-seconde »',
    famille: 'parcours',
    porteurs: ['Attal'],
    contre: ['CSEN : les effets de barrage nourrissent le décrochage'],
    perimetre: 'ministeriel',
    cout: 0.30, coutETP: 0, pol: 7,
    theme: 'brevet', once: true, excl: 'orientation', reforme: true,
    vitrine: { parents: +5, enseignants: +1, presse: +6, compteurs: { reussite: +4 } },
    reel: [
      { compteur: 'reussite', central: 0, delai: 3, cadenas: 2, source: 'aucune preuve que l’effet de menace élève le niveau ; le redoublement déguisé, si' },
      { compteur: 'egalite',  central: -5, delai: 3, cadenas: 3, source: 'le barrage frappe les élèves fragiles, socialement très typés' },
    ],
    physique: {},
    mot: "« L'exigence. » Les recalés iront en prépa-seconde, c'est-à-dire au même endroit qu'avant, mais avec un nom qui rassure tout le monde sauf eux.",
  },

  /* ----------------------------- 28 · autorité (comédie) -------------- */
  {
    id: 'uniforme',
    label: 'Généralisation de la tenue unique',
    famille: 'autorite',
    porteurs: ['une majorité constante de l’opinion', 'plusieurs candidats'],
    perimetre: 'ministeriel',
    cout: 0.09, coutETP: 0, pol: 2,
    theme: 'uniforme', once: true, reforme: false,
    vitrine: { parents: +5, enseignants: -1, presse: +5, compteurs: { sante: +1 } },
    reel: [
      { compteur: 'reussite', central: 0, delai: 2, cadenas: 2, source: 'l’expérimentation française n’a mesuré aucun effet sur les acquis ni sur le climat' },
      { compteur: 'sante',    central: 1, delai: 2, cadenas: 2, source: 'léger effet déclaré d’appartenance dans certains établissements volontaires' },
    ],
    physique: {},
    mot: "L'expérimentation a coûté trois millions d'euros et conclu à un effet principal : des polos. Mais quels polos.",
  },

  /* ----------------------------- 29 · parcours ------------------------ */
  {
    id: 'voie_pro',
    label: 'Renforcer les savoirs fondamentaux au lycée professionnel',
    famille: 'parcours',
    porteurs: ['intersyndicale', 'chercheurs sur la poursuite d’études'],
    perimetre: 'ministeriel',
    cout: 0.28, coutETP: 0, pol: 4,
    theme: 'voie_pro', once: true, reforme: true,
    vitrine: { parents: 0, enseignants: +2, presse: -1, compteurs: {} },
    reel: [
      { compteur: 'egalite',  central: 4, delai: 4, cadenas: 3, source: 'la voie professionnelle accueille les élèves les plus défavorisés ; leur réussite en BTS dépend des bases' },
      { compteur: 'reussite', central: 2, delai: 4, cadenas: 3, source: 'un tiers des lycéens sont concernés' },
    ],
    physique: {},
    mot: "Un tiers des lycéens, zéro pour cent des éditoriaux.",
  },

  /* ----------------------------- 30 · autorité ------------------------ */
  {
    id: 'allocations',
    label: 'Suspension des allocations familiales en cas d’absentéisme persistant',
    famille: 'autorite',
    porteurs: ['Zemmour', 'une partie de la droite', '60 % de l’opinion'],
    contre: ['deux évaluations publiques : aucun effet durable'],
    perimetre: 'matignon',
    cout: 0.02, coutETP: 0, pol: 9,
    theme: 'allocations', once: true, reforme: false,
    vitrine: { parents: +4, enseignants: -2, presse: +7, compteurs: {} },
    reel: [
      { compteur: 'egalite', central: -4, delai: 3, cadenas: 4, source: 'dispositif Ciotti évalué : sans effet sur l’assiduité, frappe les familles les plus fragiles' },
      { compteur: 'sante',   central: -1, delai: 3, cadenas: 3, source: 'casse le lien école-famille qu’il faudrait reconstruire' },
    ],
    physique: {},
    mot: "Évaluée deux fois, enterrée deux fois, réclamée toujours. La mesure zombie du débat éducatif français : elle ne marche pas, mais elle marche très bien.",
  },

  /* ----------------------------- 31 · autorité ------------------------ */
  {
    id: 'internats',
    label: 'Internats de rescolarisation pour élèves hautement perturbateurs',
    famille: 'autorite',
    porteurs: ['Lisnard', 'Zemmour', 'des chefs d’établissement épuisés'],
    perimetre: 'ministeriel',
    cout: 0.21, coutETP: 0, pol: 5,
    theme: 'internats', once: true, reforme: false,
    vitrine: { parents: +5, enseignants: +1, presse: +5, compteurs: {} },
    reel: [
      { compteur: 'sante',   central: 1, delai: 3, cadenas: 2, source: 'soulage les classes d’origine ; les trajectoires des élèves déplacés sont mal documentées' },
      { compteur: 'egalite', central: -2, delai: 3, cadenas: 2, source: 'concentrer les élèves en rupture entre eux : l’effet de composition joue contre eux' },
    ],
    physique: {},
    mot: "Sortir l'élève règle le problème de la classe et déplace celui de l'élève. Le transfert n'est pas une politique, mais il photographie très bien.",
  },

  /* ----------------------------- 32 · autorité ------------------------ */
  {
    id: 'pause_numerique',
    label: 'Pause numérique : téléphones sous clé du portail à la sortie',
    famille: 'autorite',
    porteurs: ['acquis de 2025, à généraliser', 'fédérations de parents'],
    perimetre: 'ministeriel',
    cout: 0.11, coutETP: 0, pol: 2,
    theme: 'portable', once: true, reforme: false,
    vitrine: { parents: +6, enseignants: +2, presse: +4, compteurs: { sante: +2 } },
    reel: [
      { compteur: 'sante',    central: 3, delai: 2, cadenas: 3, source: 'effets mesurés sur le climat de récréation et les incidents' },
      { compteur: 'reussite', central: 1, delai: 3, cadenas: 3, source: 'effets sur l’attention documentés, d’ampleur modeste' },
    ],
    physique: {},
    mot: "Mesure rarissime : les enseignants sont pour, les parents sont pour, les élèves sont contre et n'ont pas le droit de vote. Reste à savoir qui achète les casiers — indice : pas vous.",
  },

  /* ----------------------------- 33 · climat -------------------------- */
  {
    id: 'empathie',
    label: 'Compétences psychosociales et prévention du harcèlement dès le CP',
    famille: 'autorite',
    porteurs: ['programmes finlandais et danois évalués', 'mission harcèlement'],
    perimetre: 'ministeriel',
    cout: 0.19, coutETP: 0, pol: 3,
    theme: 'empathie', once: true, reforme: true,
    vitrine: { parents: +2, enseignants: +1, presse: -3, compteurs: {} },
    reel: [
      { compteur: 'sante',    central: 5, delai: 4, cadenas: 4, source: 'programmes structurés (KiVa et apparentés) : réduction mesurée des violences entre élèves' },
      { compteur: 'reussite', central: 2, delai: 5, cadenas: 3, source: 'un élève qui n’a pas peur apprend mieux : effet indirect robuste' },
    ],
    physique: {},
    mot: "Les programmes danois ont vingt ans de preuve. Le vôtre aura vingt secondes au journal de 20 heures, sous le bandeau « L'école des bisous ».",
  },

  /* ----------------------------- 34 · autorité (comédie) -------------- */
  {
    id: 'surges',
    label: 'Rétablir les surveillants généraux',
    famille: 'autorite',
    porteurs: ['Zemmour', 'la nostalgie'],
    perimetre: 'ministeriel',
    cout: 0.14, coutETP: 1500, pol: 3,
    theme: 'surges', once: true, reforme: false,
    vitrine: { parents: +4, enseignants: 0, presse: +4, compteurs: {} },
    reel: [
      { compteur: 'sante', central: 2, delai: 2, cadenas: 1, source: 'aucune évaluation : c’est un assistant d’éducation avec un nom d’avant. La présence adulte aide ; le costume, on ne sait pas' },
    ],
    physique: {},
    mot: "Personne ne sait exactement ce que c'était, tout le monde s'en souvient avec émotion. Vous financez un souvenir — à variance maximale.",
  },

  /* ----------------------------- 35 · mixité (le levier doux) --------- */
  {
    id: 'secteurs',
    label: 'Secteurs multi-collèges avec les départements volontaires',
    famille: 'mixite',
    porteurs: ['expérimentations parisiennes évaluées', 'départements volontaires', 'CSEN'],
    perimetre: 'ministeriel',
    cout: 0.08, coutETP: 0, pol: 8,
    theme: 'secteurs', once: true, reforme: true,
    vitrine: { parents: -4, enseignants: +2, presse: -1, compteurs: { egalite: +2 } },
    reel: [
      { compteur: 'egalite', central: 6, delai: 4, cadenas: 3, source: 'secteurs bi-collèges parisiens : la mixité progresse sans baisse des résultats des favorisés' },
    ],
    physique: { segregation: -1.2 },
    mot: "Les évaluations montrent que les résultats des enfants favorisés ne baissent pas. Les craintes de leurs parents, si — et elles, elles votent.",
  },

  /* ----------------------------- 36 · mixité -------------------------- */
  {
    id: 'ghettos',
    label: 'Fermer une centaine de « ghettos scolaires » et redéployer les élèves',
    famille: 'mixite',
    porteurs: ['Attal'],
    perimetre: 'ministeriel',
    cout: 0.35, coutETP: 0, pol: 11,
    theme: 'ghettos', once: true, reforme: true,
    vitrine: { parents: -2, enseignants: -3, presse: +5, compteurs: {} },
    reel: [
      { compteur: 'egalite', central: 4, delai: 4, cadenas: 2, source: 'jamais fait à cette échelle : dépend entièrement de la qualité des réaffectations' },
    ],
    physique: { segregation: -0.8 },
    mot: "Fermer un collège que tout le monde évite : tout le monde est pour, sauf l'intégralité des personnes concernées, son maire, et le collège d'à côté.",
  },

  /* ----------------------------- 37 · mixité (l’arme nucléaire) ------- */
  {
    id: 'loi_carle',
    label: 'Abroger la loi Carle et intégrer le privé sous contrat à la carte scolaire',
    famille: 'mixite',
    porteurs: ['Mélenchon', 'Glucksmann (version carte scolaire)', 'NFP'],
    perimetre: 'matignon',
    cout: -0.10, coutETP: 0, pol: 13,
    theme: 'carle', once: true, reforme: true,
    provocations: 2,                      // à elle seule, elle arme la guerre scolaire
    vitrine: { parents: -6, enseignants: +4, presse: -2, compteurs: { egalite: +2 } },
    reel: [
      { compteur: 'egalite', central: 8, delai: 4, cadenas: 3, source: 'le privé sous contrat scolarise 40 % d’élèves très favorisés contre 26 % en 2000 : l’intégrer à la carte est le levier structurel' },
    ],
    physique: { segregation: -2.0 },
    mot: "1984 : un million de personnes dans la rue, un ministre débarqué, une loi retirée. Mais vous, vous avez un plan.",
  },

  /* ----------------------------- 38 · rythmes (comédie tragique) ------ */
  {
    id: 'ete',
    label: 'Raccourcir et zoner les vacances d’été',
    famille: 'moyens',
    porteurs: ['chronobiologistes', 'la recherche sur la perte estivale', 'personne d’autre'],
    perimetre: 'ministeriel',
    cout: 0.12, coutETP: 0, pol: 12,
    theme: 'ete', once: true, reforme: true,
    vitrine: { parents: -6, enseignants: -7, presse: +2, compteurs: {} },
    reel: [
      { compteur: 'egalite',  central: 5, delai: 4, cadenas: 3, source: 'la perte estivale d’apprentissages est massive et socialement très inégale' },
      { compteur: 'reussite', central: 2, delai: 4, cadenas: 3, source: 'étalement de l’année : effet modeste mais convergent' },
    ],
    physique: {},
    greve: { intensite: 3, theme: 'statut', segment: 'tous' },
    mot: "Contre vous : les parents, les enseignants, les hôteliers, les colonies de vacances et le ministre du Tourisme. Pour vous : trois chronobiologistes, dont un en congé.",
  },

  /* ----------------------------- 39 · numérique ----------------------- */
  {
    id: 'ia_emi',
    label: 'Éducation aux médias et à l’intelligence artificielle, heures dédiées',
    famille: 'parcours',
    porteurs: ['à peu près tout le monde, sans les heures'],
    perimetre: 'ministeriel',
    cout: 0.13, coutETP: 0, pol: 2,
    theme: 'ia', once: true, reforme: false,
    vitrine: { parents: +2, enseignants: 0, presse: +3, compteurs: {} },
    reel: [
      { compteur: 'reussite', central: 2, delai: 4, cadenas: 3, source: 'l’esprit critique s’enseigne ; les effets sont réels et lents' },
      { compteur: 'sante',    central: 1, delai: 4, cadenas: 2, source: 'moins de conflits liés aux réseaux sociaux, si les adultes sont formés' },
    ],
    physique: {},
    mot: "Vos élèves utilisent déjà l'IA pour leurs devoirs, et vos enseignants pour les corriger. Il serait temps que quelqu'un forme quelqu'un.",
  },

  /* ----------------------------- 40 · équité -------------------------- */
  {
    id: 'devoirs_faits',
    label: 'Accompagnement aux devoirs systématique au collège',
    famille: 'moyens',
    porteurs: ['dispositif existant depuis 2017, à rendre effectif', 'EEF (tutorat)'],
    perimetre: 'ministeriel',
    cout: 0.24, coutETP: 0, pol: 3,
    theme: 'devoirs', once: true, reforme: false,
    vitrine: { parents: +5, enseignants: -1, presse: +2, compteurs: { egalite: +1 } },
    reel: [
      { compteur: 'egalite',  central: 4, delai: 3, cadenas: 4, source: 'EEF : le tutorat et l’aide aux devoirs encadrée comptent parmi les interventions les mieux documentées' },
      { compteur: 'reussite', central: 2, delai: 3, cadenas: 4, source: 'idem — l’effet dépend de l’encadrement réel, pas de l’étude surveillée' },
    ],
    physique: {},
    mot: "Le dispositif existe depuis 2017. Vous le rendez systématique — c'est-à-dire que vous allez découvrir qui, exactement, était volontaire.",
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
/* Le Président élu en 2027 impose deux mesures « présidentielles » à caser dans
   le mandat. L'Élysée aime le visible : le pool penche vitrine. */
export const MESURES_PRESIDENTIELLES = [
  'differenciation', 'redoublement', 'autonomie', 'classe19', 'sante_scolaire',
  'remplacement', 'uniforme', 'pause_numerique', 'brevet_barrage', 'internats',
];

export const PAR_ID = Object.fromEntries(CATALOGUE.map((c) => [c.id, c]));
