/* ============================================================================
   RUE DE GRENELLE — REPÈRES SOURCÉS
   ----------------------------------------------------------------------------
   Toutes les données de référence du jeu, avec leur source officielle. Ce
   module alimente deux écrans :
     · la note de cadrage remise au ministre AVANT ses premières mesures ;
     · l'onglet « Comprendre le jeu », consultable à tout moment.

   Règle d'or : aucun chiffre ici n'est inventé ni arrondi « à la louche ».
   Chaque `src` renvoie à une entrée de SOURCES, qui porte l'organisme, la date
   et l'adresse du document. Quand deux sources officielles publient des
   chiffres différents (c'est le cas du remplacement), on donne les deux et on
   dit pourquoi : c'est une leçon du jeu, pas une négligence.

   Dernière vérification des sources : août 2026.
   ========================================================================== */

export const SOURCES = {
  senat_plf26: {
    org: 'Sénat, commission des finances',
    titre: 'Projet de loi de finances pour 2026 — mission « Enseignement scolaire »',
    date: 'novembre 2025',
    url: 'https://www.senat.fr/rap/a25-144-31/a25-144-314.html',
  },
  hcsp26: {
    org: 'Haut-commissariat à la Stratégie et au Plan (rapporteur : Pierre-Yves Cusset)',
    titre: 'Niveau scolaire : éléments de diagnostic et propositions — rapport du groupe de travail réuni au HCSP',
    date: 'août 2026',
    url: 'https://www.strategie-plan.gouv.fr',
  },
  senat_plf25: {
    org: 'Sénat, commission des finances',
    titre: 'Projet de loi de finances pour 2025 — mission « Enseignement scolaire »',
    date: 'novembre 2024',
    url: 'https://www.senat.fr/rap/l24-144-314/l24-144-314_mono.html',
  },
  senat_plf24: {
    org: 'Sénat, commission des finances',
    titre: 'Projet de loi de finances pour 2024 — mission « Enseignement scolaire »',
    date: 'novembre 2023',
    url: 'https://www.senat.fr/rap/l23-128-314/l23-128-314_mono.html',
  },
  senat_plf20: {
    org: 'Sénat, commission des finances',
    titre: 'Projet de loi de finances pour 2020 — mission « Enseignement scolaire »',
    date: 'novembre 2019',
    url: 'https://www.senat.fr/rap/l19-140-314/l19-140-314_mono.html',
  },
  cc_neb24: {
    org: 'Cour des comptes',
    titre: 'Note d’analyse de l’exécution budgétaire 2024 — mission « Enseignement scolaire »',
    date: 'avril 2025',
    url: 'https://www.ccomptes.fr/sites/default/files/2025-04/NEB-2024-Enseignement-scolaire.pdf',
  },
  plafonds27: {
    org: 'Ministère de l’Économie et des Finances (lettres plafonds)',
    titre: 'Plafonds prévisionnels de dépenses du PLF 2027 : 65,3 Md€ pour la mission interministérielle « Enseignement scolaire », soit +0,8 Md€ (+1,2 %)',
    date: '16 juillet 2026',
    url: 'https://franceuniversites.fr/wp-content/uploads/2026/07/PLF-2027-_-plafond-previsionnel-de-318-MdE-pour-la-Mires-16-News-Tank-Education-Recherche.pdf',
  },
  depp_proj35: {
    org: 'DEPP, ministère de l’Éducation nationale',
    titre: 'Projections d’effectifs d’élèves dans les premier et second degrés à l’horizon 2035',
    date: 'avril 2026',
    url: 'https://www.education.gouv.fr/demographie-scolaire-le-ministere-publie-pour-la-premiere-fois-des-projections-d-effectifs-d-eleves-504392',
  },
  depp_prev28: {
    org: 'DEPP, ministère de l’Éducation nationale',
    titre: 'Prévisions d’effectifs d’élèves des premier et second degrés',
    date: 'mars 2025',
    url: 'https://www.education.gouv.fr/media/200346/download',
  },
  pisa22: {
    org: 'OCDE',
    titre: 'PISA 2022 — Note par pays : France',
    date: 'décembre 2023',
    url: 'https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/france_8008535b-en.html',
  },
  timss23: {
    org: 'DEPP, ministère de l’Éducation nationale',
    titre: 'TIMSS 2023 — résultats en mathématiques et en sciences des élèves de CM1 et de 4e',
    date: 'décembre 2024',
    url: 'https://www.education.gouv.fr/timss-2023-resultats-en-mathematiques-et-en-sciences-des-eleves-de-cm1-et-4eme-462435',
  },
  pirls21: {
    org: 'DEPP, ministère de l’Éducation nationale',
    titre: 'PIRLS 2021 — compréhension de l’écrit des élèves de CM1 (note d’information 23.21)',
    date: 'mai 2023',
    url: 'https://www.education.gouv.fr/sites/default/files/document/NI%2023.21-364557.pdf',
  },
  evalnat25: {
    org: 'DEPP, ministère de l’Éducation nationale',
    titre: 'Évaluations nationales de septembre 2025 — premiers résultats',
    date: 'novembre 2025',
    url: 'https://www.education.gouv.fr/evaluations-nationales-de-septembre-2025-467758',
  },
  ocde25: {
    org: 'OCDE',
    titre: 'Regards sur l’éducation 2025 — note par pays : France',
    date: 'septembre 2025',
    url: 'https://www.oecd.org/content/dam/oecd/fr/publications/reports/2025/09/education-at-a-glance-2025-country-notes_9749f4ff/france_0639c7fb/aca6dceb-fr.pdf',
  },
  enchiffres25: {
    org: 'DEPP, ministère de l’Éducation nationale',
    titre: 'L’éducation nationale en chiffres, édition 2025',
    date: 'septembre 2025',
    url: 'https://www.education.gouv.fr/l-education-nationale-en-chiffres-edition-2025-450963',
  },
  senat_rempl: {
    org: 'Sénat, commission des finances (rapport Paccaud)',
    titre: 'Le remplacement des enseignants',
    date: 'juin 2025',
    url: 'https://www.senat.fr/rap/r24-730/r24-7305.html',
  },
  cc_absences: {
    org: 'Cour des comptes',
    titre: 'La gestion des absences des enseignants',
    date: 'décembre 2025',
    url: 'https://www.ccomptes.fr/en/documents/57962',
  },
  cc_formation: {
    org: 'Cour des comptes',
    titre: 'La formation continue des enseignants',
    date: 'septembre 2023',
    url: 'https://www.ccomptes.fr/sites/default/files/2023-10/20230907-S2023-0729-Formation-continue-enseignants.pdf',
  },
  cc_pacte: {
    org: 'Cour des comptes',
    titre: 'Audit flash — le pacte enseignant',
    date: 'juillet 2025',
    url: 'https://www.ccomptes.fr/sites/default/files/2025-07/20250701-Pacte-Enseignant_1.pdf',
  },
  handicap: {
    org: 'Ministère de l’Éducation nationale',
    titre: 'La scolarisation des élèves en situation de handicap',
    date: 'rentrée 2025',
    url: 'https://www.education.gouv.fr/la-scolarisation-des-eleves-en-situation-de-handicap-1022',
  },
  concours25: {
    org: 'Ministère de l’Éducation nationale',
    titre: 'Concours enseignants de la session 2025 — résultats',
    date: 'juillet 2025',
    url: 'https://www.education.gouv.fr/concours-enseignants-de-la-session-2025-463026',
  },
  an_medecine: {
    org: 'Assemblée nationale, question écrite au Gouvernement',
    titre: 'Situation de la médecine scolaire — effectifs et postes vacants',
    date: '2025',
    url: 'https://www.assemblee-nationale.fr/dyn/17/questions/QANR5L17QE7641',
  },
  senat_mixite: {
    org: 'Sénat, rapport législatif',
    titre: 'Proposition de loi visant à assurer la mixité sociale et scolaire dans les établissements publics et privés sous contrat',
    date: 'juin 2024',
    url: 'https://www.senat.fr/rap/l23-677/l23-677_mono.html',
  },
  depp_decrochage: {
    org: 'DEPP, ministère de l’Éducation nationale',
    titre: 'La baisse des sorties sans diplôme (série Études)',
    date: '2024',
    url: 'https://www.education.gouv.fr/media/156962/download',
  },
  depp_climat: {
    org: 'DEPP, ministère de l’Éducation nationale',
    titre: 'Enquête de climat scolaire et de victimation, passation du 20 novembre 2025',
    date: 'novembre 2025',
    url: 'https://www.education.gouv.fr/depp',
  },
  csen15: {
    org: 'Conseil scientifique de l’éducation nationale (note n° 15, M. Gurgand)',
    titre: 'Faut-il encore faire redoubler les élèves ?',
    date: '2023',
    url: 'https://www.reseau-canope.fr/fileadmin/user_upload/Projets/conseil_scientifique_education_nationale/notes_csen/Note_CSEN_15.pdf',
  },
  depp_dedoub: {
    org: 'DEPP, ministère de l’Éducation nationale',
    titre: 'Évaluation de l’impact de la réduction de la taille des classes de CP et de CE1 en REP+',
    date: '2021',
    url: 'https://archives-statistiques-depp.education.gouv.fr/Default/doc/SYRACUSE/50756/',
  },
  eef: {
    org: 'Education Endowment Foundation (Royaume-Uni)',
    titre: 'Teaching and Learning Toolkit — méta-analyses classées par niveau de preuve',
    date: 'mise à jour continue',
    url: 'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit',
  },
  pause_num: {
    org: 'Ministère de l’Éducation nationale',
    titre: 'Interdiction du téléphone portable dans les écoles et les collèges — « pause numérique »',
    date: 'rentrée 2025',
    url: 'https://www.education.gouv.fr/interdiction-du-telephone-portable-dans-les-ecoles-et-les-colleges-et-pause-numerique-455181',
  },
  pfmp: {
    org: 'Éduscol / décret n° 2023-765 du 11 août 2023',
    titre: 'Allocation de stage au lycée professionnel (périodes de formation en milieu professionnel)',
    date: 'août 2023',
    url: 'https://eduscol.education.gouv.fr/5478/allocation-de-stage-au-lycee-professionnel',
  },
  senat_fc: {
    org: 'Sénat, rapport d’information',
    titre: 'La formation continue des enseignants',
    date: 'juillet 2023',
    url: 'https://www.senat.fr/rap/r22-869/r22-869_mono.html',
  },
  talis: {
    org: 'OCDE',
    titre: 'TALIS — enquête internationale sur l’enseignement et l’apprentissage',
    date: 'éditions 2018 et 2024',
    url: 'https://www.oecd.org/fr/themes/enquete-internationale-sur-l-enseignement-et-l-apprentissage-talis.html',
  },
};

/* ---------------------------------------------------------------------------
   La série budgétaire, en Md€ de crédits de paiement HORS CAS Pensions.
   2021 n'est pas affiché : le périmètre de la mission a été modifié cette
   année-là (transferts) et la comparaison directe serait trompeuse.
   ------------------------------------------------------------------------- */
export const SERIE_BUDGET = [
  { annee: 2019, md: 52.33, note: 'point de départ de la comparaison retenue par le Sénat', src: 'senat_plf26' },
  { annee: 2020, md: 53.30, src: 'senat_plf20' },
  { annee: 2022, md: 56.03, src: 'senat_plf24' },
  { annee: 2023, md: 59.75, src: 'senat_plf24' },
  { annee: 2024, md: 63.65, note: '+3,9 Md€ en un an : l’effet des revalorisations de 2023', src: 'senat_plf24' },
  { annee: 2025, md: 64.32, src: 'senat_plf26' },
  { annee: 2026, md: 64.49, note: '+0,26 % : la progression la plus faible de la série', src: 'senat_plf26' },
  { annee: 2027, md: 65.30, prevision: true, note: 'plafond prévisionnel : +0,8 Md€. C’est votre marge — sur le papier.', src: 'plafonds27' },
];

/* ---------------------------------------------------------------------------
   Les thèmes de référence. `cle` sert d'ancre, `chiffres` est la matière.
   ------------------------------------------------------------------------- */
export const REPERES = [
  {
    cle: 'budget',
    titre: 'L’argent',
    resume: 'Le premier budget de l’État en effectifs, et le plus rigide en euros.',
    chiffres: [
      { v: '64,49 Md€', l: 'crédits de paiement de la mission « Enseignement scolaire » au budget 2026, hors contribution au CAS Pensions', src: 'senat_plf26' },
      { v: '89,64 Md€', l: 'la même mission pensions comprises — c’est ce chiffre que citent les tribunes, et l’autre que manie Bercy', src: 'senat_plf26' },
      { v: '+0,26 %', l: 'progression du budget 2026 sur 2025 : +167 M€ en crédits de paiement, moins que l’inflation', src: 'senat_plf26' },
      { v: '+0,8 Md€', l: 'hausse inscrite au plafond prévisionnel du PLF 2027 (65,3 Md€), soit +1,2 % — la marge que vous héritez', src: 'plafonds27' },
      { v: '≈ 93 %', l: 'part de la mission consommée par la masse salariale : ce qui n’est pas arbitrable dans l’année', src: 'cc_neb24' },
      { v: '13 545 $', l: 'dépense annuelle par élève en France (moyenne OCDE : 12 647 $) — mais −13 % en primaire, −5 % au collège, +24 % au lycée', src: 'ocde25' },
      { v: '9 100 € → 14 700 €', l: 'dépense annuelle par élève en 2024 selon le niveau : 9 100 € à l’école, 10 500 € au collège, 13 000 € au lycée général, 14 700 € au lycée professionnel. Le même élève ne vaut pas la même chose selon l’année où on le regarde', src: 'hcsp26' },
      { v: 'stable depuis 2010', l: 'la dépense par élève du second degré, en euros constants ; celle du premier degré, elle, progresse depuis 2010 et surtout depuis 2017 : le rééquilibrage a commencé, il n’est pas fini', src: 'hcsp26' },
    ],
    serie: 'budget',
    aRetenir: 'La France ne dépense pas moins que ses voisins : elle dépense ailleurs. Le lycée est sur-doté, le primaire sous-doté, et l’écart se creuse depuis vingt ans. Déplacer un euro du second vers le premier degré est la décision la moins coûteuse et la plus impopulaire du métier.',
  },
  {
    cle: 'demographie',
    titre: 'Les élèves qui manquent',
    resume: 'La donnée qui commande tout le reste, et dont personne ne parle en campagne.',
    chiffres: [
      { v: '−1 676 800', l: 'élèves de moins en 2035 qu’aujourd’hui dans le public et le privé sous contrat, scénario de référence', src: 'depp_proj35' },
      { v: '−14,2 %', l: 'de la population scolaire en dix ans : c’est l’équivalent de l’académie de Versailles qui disparaît, deux fois', src: 'depp_proj35' },
      { v: '≈ −161 000', l: 'élèves à la seule rentrée 2026, dont environ −125 000 dans le premier degré', src: 'depp_prev28' },
      { v: '2010', l: 'année où la baisse des naissances s’amorce ; elle s’est accélérée depuis 2015 et arrive maintenant au collège', src: 'depp_proj35' },
    ],
    aRetenir: 'Chaque année, la démographie « rend » des milliers de postes. Deux politiques opposées existent, toutes deux appliquées récemment : rendre ces postes à Bercy (rentrée 2026 : −4 032 postes pour −161 000 élèves), ou les réinvestir dans l’encadrement (rentrée 2025 : −470 postes seulement pour −106 000 élèves). Le même chiffre démographique, deux pays différents à l’arrivée. C’est l’arbitrage de janvier, dans le jeu comme dans la réalité.',
  },
  {
    cle: 'niveaux',
    titre: 'Ce que savent les élèves',
    resume: 'Trois enquêtes, trois âges, trois messages qui ne disent pas la même chose.',
    chiffres: [
      { v: '474 / 474 / 487', l: 'PISA 2022, élèves de 15 ans : mathématiques, compréhension de l’écrit, sciences. Moyennes OCDE : 472, 476, 485 — la France est dans la moyenne', src: 'pisa22' },
      { v: 'baisse « sans précédent »', l: 'c’est le mot de l’OCDE pour la chute en mathématiques entre 2018 et 2022 ; elle suit une période de stabilité', src: 'pisa22' },
      { v: '7 %', l: 'd’élèves très performants en mathématiques en France (OCDE : 9 %) — le haut du tableau s’érode aussi', src: 'pisa22' },
      { v: '484', l: 'score des CM1 français en mathématiques (TIMSS 2023), contre 524 pour la moyenne de l’Union européenne et 525 pour l’OCDE', src: 'timss23' },
      { v: '15 %', l: 'des CM1 n’atteignent pas le niveau minimal en mathématiques ; les résultats sont stables depuis 2019', src: 'timss23' },
      { v: '514', l: 'compréhension de l’écrit en CM1 (PIRLS 2021) : au-dessus de la moyenne internationale (500), sous la moyenne européenne (527) — mais la France est l’un des rares pays à s’être stabilisé', src: 'pirls21' },
      { v: 'un quart', l: 'des jeunes de 17-18 ans avaient en 2024 des difficultés prononcées en lecture aux tests de la Journée défense et citoyenneté — et la moitié d’entre eux se situaient sous le seuil de lecture fonctionnelle', src: 'hcsp26' },
      { v: 'septembre 2025', l: 'évaluations nationales : progrès confirmés en CP depuis 2019, résultats en baisse en français en CE1 sur trois compétences sur huit, français en hausse en 6e', src: 'evalnat25' },
    ],
    aRetenir: 'Les enquêtes internationales mesurent une cohorte, pas un ministre : un élève de PISA 2027 est entré au CP en 2018. Aucune mesure prise pendant votre mandat n’apparaîtra dans PISA avant votre départ. C’est la contrainte que le jeu vous fait éprouver : la vitrine bouge tout de suite, le réel arrive après vous.',
  },
  {
    cle: 'inegalites',
    titre: 'Le poids de l’origine',
    resume: 'Le point où la France est régulièrement la plus mal classée.',
    chiffres: [
      { v: '99,9 vs 117,4', l: 'indice de position sociale médian des collèges publics et des collèges privés sous contrat (2023-2024) ; l’écart se creuse d’environ 2 points par an', src: 'senat_mixite' },
      { v: '75 % / 98 %', l: 'parmi les 200 collèges au plus fort IPS, 75 % sont privés ; parmi les 200 au plus faible, 98 % sont publics', src: 'senat_mixite' },
      { v: '26,4 % → 40,2 %', l: 'part des élèves très favorisés dans le privé sous contrat, de 2000 à 2021', src: 'senat_mixite' },
      { v: '75 % contre 32 %', l: 'part des 25-34 ans diplômés du supérieur selon que leurs parents le sont ou n’ont pas le baccalauréat', src: 'ocde25' },
      { v: 'en baisse', l: 'la ségrégation entre collèges publics a plutôt diminué, et celle entre collèges privés aussi ; c’est l’écart de composition sociale entre les deux secteurs qui se creuse. Le problème français n’est pas la ségrégation en général, c’est la frontière public/privé', src: 'hcsp26' },
      { v: 'tous les profils', l: 'la faiblesse relative de la France en comparaison internationale touche les élèves modestes comme les favorisés, les plus faibles comme les meilleurs, les filles comme les garçons. La France n’a pas seulement un problème d’inégalités : elle a aussi, jusqu’au collège, un problème de niveau général', src: 'hcsp26' },
      { v: '7,6 %', l: 'de sorties précoces chez les 18-24 ans (environ 110 000 jeunes par an) — contre 11,2 % en 2006 : le décrochage, lui, recule', src: 'depp_decrochage' },
    ],
    aRetenir: 'C’est le compteur qui bouge le plus lentement et qui coûte le plus cher politiquement. Toucher au privé sous contrat déclenche un conflit qui, en 1984, a fait tomber un ministre et un gouvernement. Le jeu ne vous en dissuade pas — il vous fait payer le prix réel.',
  },
  {
    cle: 'metier',
    titre: 'Ceux qui font tourner l’école',
    resume: 'Un million de personnes, dont la moitié de la carrière se joue sur un point d’indice.',
    chiffres: [
      { v: '−26 % / −18 %', l: 'salaires effectifs des enseignants d’élémentaire et de collège par rapport aux autres diplômés du supérieur à temps plein (2024). Moyennes OCDE : −17 % et −13 %', src: 'ocde25' },
      { v: '4 sur 10', l: 'enseignants français ont plus de 50 ans', src: 'ocde25' },
      { v: '3,5 jours', l: 'de formation continue par an au collège, contre 8 en moyenne dans l’OCDE ; 35 % des enseignants français jugent utile la formation proposée, contre 55 % ailleurs', src: 'talis' },
      { v: 'dernière place', l: 'taux de participation à la formation continue le plus faible des pays enquêtés (83 %, contre 94 % en moyenne)', src: 'talis' },
      { v: '2 610', l: 'postes non pourvus aux concours 2025 sur 27 713 offerts (9,4 %), public et privé confondus — dont près de 400 en mathématiques, un poste sur cinq', src: 'concours25' },
      { v: '5 → 2,5', l: 'candidats par poste au concours de professeur des écoles, de la fin des années 2000 à 2024 ; dans le second degré, plus de 6 → environ 3. À Créteil, 0,7 candidat par poste en 2024 ; à Versailles, 0,8', src: 'hcsp26' },
      { v: '+43 %', l: 'de personnels non titulaires entre 2015 et 2022 dans le public, quand le nombre de titulaires reculait de 0,7 %', src: 'hcsp26' },
      { v: '38 % contre 64 %', l: 'enseignants de collège s’estimant bien ou très bien préparés en pédagogie générale, en France et en moyenne européenne', src: 'hcsp26' },
      { v: '1 pour 280', l: 'inspecteurs par enseignant dans le premier degré, 1 pour 240 dans le second — et des inspecteurs de plus en plus mobilisés par la mise en place des réformes, donc éloignés des classes', src: 'hcsp26' },
      { v: '64 % / 55 % / 27 %', l: 'part des enseignants du premier degré, du second degré et des autres cadres déclarant vivre des situations de tension avec le public', src: 'hcsp26' },
      { v: '94,7 %', l: 'de couverture dans le premier degré public en 2025, contre 88,3 % en 2024 : la situation s’améliore, sans être réglée', src: 'concours25' },
    ],
    aRetenir: 'La boucle d’attractivité est le vrai moteur du système : salaires et conditions font les candidats, les candidats font le remplacement, le remplacement fait les conditions. Elle met trois à cinq ans à tourner — soit plus qu’un mandat de ministre.',
  },
  {
    cle: 'moyens',
    titre: 'Les heures qui manquent',
    resume: 'Le sujet dont les familles parlent, et que les statistiques mesurent mal.',
    chiffres: [
      { v: '4,3 % et 7,4 %', l: 'part du temps scolaire perdu faute de remplacement, en moyenne et dans le second degré (rapport sénatorial, juin 2025)', src: 'senat_rempl' },
      { v: '9,3 %', l: 'part des heures d’enseignement perdues au collège et au lycée en 2023-2024 selon la Cour des comptes (décembre 2025). Deux chiffres officiels, deux périmètres : c’est le débat, pas une erreur', src: 'cc_absences' },
      { v: '20 % contre 96 %', l: 'taux de remplacement des absences courtes et des absences de plus de quinze jours', src: 'cc_absences' },
      { v: 'deux tiers', l: 'des absences non remplacées ont une cause institutionnelle — examens, formation, réunions, sorties — et non individuelle', src: 'cc_absences' },
      { v: '4,2 Md€', l: 'budget consacré au remplacement en 2025, en hausse de 33 % depuis 2017', src: 'senat_rempl' },
      { v: '90 502 ETP', l: 'd’accompagnants d’élèves en situation de handicap à la rentrée 2025 (+67 % en huit ans) pour 520 600 élèves en situation de handicap scolarisés', src: 'handicap' },
      { v: '1 sur 7', l: 'élèves notifiés pour un accompagnement humain se retrouve sans AESH à la rentrée : 48 726 sur 352 102', src: 'handicap' },
      { v: '×2,4 en 18 ans', l: 'élèves en situation de handicap scolarisés : 232 400 en 2006 (1,9 % des effectifs), 563 400 en 2024 (4,7 %). La hausse a porté presque entièrement sur le milieu ordinaire', src: 'hcsp26' },
      { v: '49 %', l: 'des enseignants de collège déclarent que l’adaptation des séances pour les élèves à besoins éducatifs particuliers est une source de stress — dix points de plus que la moyenne européenne', src: 'hcsp26' },
      { v: '≈ 900', l: 'médecins scolaires pour 12 millions d’élèves — 1 143 en 2013, 818 en 2022 ; 28 postes seulement ouverts au concours 2025', src: 'an_medecine' },
    ],
    aRetenir: 'Deux tiers des absences non remplacées sont produites par le fonctionnement même du système. C’est la meilleure nouvelle du dossier : cette part-là ne se règle pas en recrutant, elle se règle en réorganisant — donc à budget presque constant, et contre les habitudes de tout le monde.',
  },
  {
    cle: 'organisation',
    titre: 'Le temps et les classes',
    resume: 'La France est une anomalie horaire dans l’OCDE, dans les deux sens.',
    chiffres: [
      { v: '864 h / 973 h', l: 'heures d’enseignement par an en élémentaire et au collège, contre 730 h et 851 h en moyenne européenne : les élèves français ont plus d’heures que presque partout', src: 'hcsp26' },
      { v: '93 %', l: 'des communes appliquent la semaine de quatre jours à l’école. La France est le seul pays de l’OCDE dans ce cas : partout ailleurs, l’instruction est étalée sur au moins quatre jours et demi. D’où des journées d’école exceptionnellement longues', src: 'hcsp26' },
      { v: '38 % contre 25 %', l: 'part du volume horaire de l’élémentaire consacrée au triptyque lecture / écriture / littérature, en France et en moyenne dans l’Union européenne — et les enseignants déclarent aller au-delà du volume prescrit', src: 'hcsp26' },
      { v: '1 450 h contre 1 100 h', l: 'heures de mathématiques reçues entre 6 et 14 ans, en France et en moyenne internationale. Le volume horaire n’explique donc pas la baisse du niveau en mathématiques', src: 'hcsp26' },
      { v: '47 h pour 72 h', l: 'heures de sciences déclarées en CM1 pour 72 heures recommandées, soit un déficit de 35 % ; les enseignants des autres pays de l’Union européenne en déclarent 58. Là, le volume est bien en cause', src: 'hcsp26' },
      { v: '21,5 et 25,8', l: 'élèves par classe en 2023 au primaire et au collège. Au collège, c’est le nombre le plus élevé des pays européens', src: 'hcsp26' },
      { v: '12,5 / 12,8', l: 'élèves par classe en CP et CE1 dédoublés en éducation prioritaire, pour environ 144 000 élèves de chaque niveau', src: 'depp_dedoub' },
      { v: '2 Md€', l: 'coût annuel estimé du redoublement, pour un effet moyen nul à négatif sur les trajectoires selon le Conseil scientifique de l’éducation nationale', src: 'csen15' },
    ],
    aRetenir: 'Les élèves français passent plus d’heures en classe que presque partout, sur moins de jours, avec plus de français et de maths, et pour des résultats moyens. Cela invalide l’idée qu’il suffirait d’ajouter des heures — et rend l’organisation du temps scolaire au moins aussi décisive que son volume.',
  },
  {
    cle: 'climat',
    titre: 'Le climat scolaire',
    resume: 'Nouveau venu dans les priorités ministérielles, et déjà chiffré.',
    chiffres: [
      { v: '3 % / 4 % / 2 %', l: 'élèves se déclarant victimes de harcèlement à l’école, au collège et au lycée (enquête menée en novembre 2025)', src: 'depp_climat' },
      { v: '5 % et 6 %', l: 'les deux points hauts : les CE2, et les élèves de deuxième ou troisième année de CAP', src: 'depp_climat' },
      { v: '2 h 36 par jour', l: 'temps d’écran moyen des enfants de 10 ans et demi en 2022 (cohorte Elfe) : 59 min de télévision, 33 de jeu vidéo, 29 de tablette, 19 de smartphone, 16 d’ordinateur. En 2023, 45 % des 11-12 ans étaient inscrits sur TikTok', src: 'hcsp26' },
      { v: 'sommeil et activité physique', l: 'les deux effets des écrans aujourd’hui bien documentés ; ceux sur l’attention et le développement du cerveau restent discutés, faute d’études longitudinales assez nombreuses. Or le manque de sommeil aggrave les difficultés d’apprentissage', src: 'hcsp26' },
      { v: '≈ 200 collèges', l: 'et 32 000 élèves ont expérimenté la mise à l’écart des téléphones en 2024-2025 avant sa généralisation à la rentrée 2025 ; l’effet a été jugé « encourageant » par le ministère, sans évaluation indépendante publiée', src: 'pause_num' },
    ],
    aRetenir: 'Le climat scolaire est le domaine où l’écart entre l’annonce et la preuve est le plus grand : les dispositifs sont généralisés vite, évalués tard, et rarement de manière indépendante. Le jeu le traduit par un faible nombre de cadenas — pas par un effet nul.',
  },
  {
    cle: 'diagnostic',
    titre: 'Pourquoi le niveau baisse',
    resume: 'Le diagnostic officiel d’août 2026, et ce qu’il écarte autant que ce qu’il retient.',
    chiffres: [
      { v: 'pas une cause', l: 'le Haut-commissariat à la Stratégie et au Plan conclut qu’il n’existe pas de cause unique. Il distingue des difficultés exogènes — hétérogénéité des publics, écrans — et endogènes — moyens, attractivité du métier, formation, temps scolaire, rythme des réformes', src: 'hcsp26' },
      { v: 'pas le volume horaire', l: 'ni en français ni en mathématiques : les élèves français en reçoivent plus que la moyenne. Ce sont les méthodes et la progression des programmes qui sont mises en cause — sauf en sciences, où le volume, lui, manque vraiment', src: 'hcsp26' },
      { v: 'pas les élèves allophones', l: 'leur nombre augmente fortement mais reste très faible rapporté aux effectifs scolaires : la diversité culturelle pose ses propres défis, elle n’accroît pas mécaniquement l’hétérogénéité des acquis', src: 'hcsp26' },
      { v: 'le rythme des réformes', l: 'au collège, les enseignants citent l’enchaînement des réformes comme source de stress plus souvent que le maintien de la discipline en classe. Il transforme aussi une partie du temps de formation continue en séances d’information sur les dispositifs à mettre en place', src: 'hcsp26' },
      { v: 'le balancier pédagogique', l: 'quarante ans de formation à des méthodes favorisant l’activité de l’élève ont pu se faire au détriment de ce qui ancre durablement les savoirs : traces écrites structurées, ré-explications, entraînement, répétition. Le rapport pose l’hypothèse ; il ne la tranche pas', src: 'hcsp26' },
      { v: 'la méthode de lecture', l: 'la méthode phonique synthétique stricte est la plus efficace, particulièrement pour les élèves de condition modeste — et n’est encore employée que par une minorité d’enseignants, la majorité recourant à des méthodes mixtes', src: 'hcsp26' },
      { v: '50 % dans 15 circonscriptions', l: 'la moitié des enseignants qui emploient la méthode la plus efficace exercent dans une quinzaine de circonscriptions où l’inspection et les conseillers pédagogiques avaient organisé un accompagnement spécifique à l’enseignement de la lecture. La méthode ne se diffuse pas seule', src: 'hcsp26' },
      { v: '11 recommandations', l: 'du rendre-évaluable-et-publier au retour à la semaine de quatre jours et demi, en passant par la formation centrée sur l’observation en classe, la coordination pédagogique reconnue et l’évaluation des manuels. Plusieurs sont jouables dans le catalogue', src: 'hcsp26' },
    ],
    aRetenir: 'Ce rapport est le contraire d’un pamphlet : il écarte méthodiquement les explications les plus commodes — le nombre d’heures, les élèves étrangers, l’argent seul — pour désigner ce qui est plus difficile à changer : la formation des maîtres, l’accompagnement de proximité, les méthodes d’apprentissage de la lecture, l’organisation du temps. Aucune de ces réponses ne se décrète en une rentrée, et c’est exactement ce que le jeu vous fait éprouver.',
  },
  {
    cle: 'preuve',
    titre: 'Comment le jeu note les mesures',
    resume: 'Les cadenas, l’écart vitrine/réel, et pourquoi tout cela n’est pas arbitraire.',
    chiffres: [
      { v: '5 cadenas', l: 'plusieurs dizaines d’essais concordants : l’effet réel tiré par le jeu reste dans une fourchette de ±20 % autour de l’effet central', src: 'eef' },
      { v: '1 cadenas', l: 'une évaluation isolée, ou aucune : l’effet réel peut aller de la moitié en négatif au triple en positif. C’est le vrai risque d’une mesure non évaluée', src: 'eef' },
      { v: 'effet-vitrine', l: 'ce que l’annonce produit tout de suite : opinion, presse, compteurs affichés. Il s’use de 26 % par an et ne compte pas au bilan', src: 'eef' },
      { v: 'effet réel', l: 'ce que la mesure produit vraiment, avec un délai de 1 à 8 ans, révélé seulement à la fin. C’est lui, et lui seul, qui est noté', src: 'eef' },
      { v: '× adhésion', l: 'toute mesure est multipliée par le facteur d’implémentation : une réforme appliquée par des personnels qui n’y croient pas produit un effet proche de zéro', src: 'talis' },
    ],
    aRetenir: 'Les cadenas reprennent l’échelle de niveau de preuve de l’Education Endowment Foundation, l’organisme britannique qui synthétise les méta-analyses en éducation. Un effet moyen élevé mais mal établi vaut souvent moins qu’un effet modeste et solide : c’est la leçon que le bilan de fin de mandat vous administrera.',
  },
];

export const PAR_CLE = Object.fromEntries(REPERES.map((r) => [r.cle, r]));
