/* ============================================================================
   RUE DE GRENELLE. REPÈRES SOURCÉS
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

   Dernière vérification des sources : août 2026 ; automne 2026 pour le
   mouvement lycéen (relevé du 17 octobre 2026).
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
  hcsp_partieD: {
    org: 'Ofsted / ministère britannique de l’éducation',
    titre: 'Évaluations du London Challenge (2003-2011) : des autorités locales passées des pires aux meilleures performances nationales',
    date: '2010-2014',
    url: 'https://www.gov.uk/government/organisations/ofsted',
  },
  suede: {
    org: 'OCDE et agences gouvernementales suédoises (travaux d’Östh, Wiborg)',
    titre: 'Improving Schools in Sweden — bilan des réformes de marché scolaire des années 1990',
    date: '2015',
    url: 'https://www.oecd.org/en/publications/improving-schools-in-sweden_9789264247437-en.html',
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
  /* --- l'automne 2026 : le mouvement lycéen et ses réponses -----------------
     Relevé le 17 octobre 2026 (RECHERCHE-GRAND-PUBLIC.md). Quand le chiffre
     est officiel mais n'a été lu que dans un relais de presse, l'organisme
     d'origine est nommé et le relais indiqué : c'est une source de second
     rang, et le jeu le dit. */
  agora26: {
    org: 'Gouvernement (info.gouv.fr)',
    titre: 'Lycéennes, lycéens : donnez votre avis sur votre quotidien au lycée — consultation nationale sur la plateforme Agora, du 5 au 23 octobre 2026',
    date: 'octobre 2026',
    url: 'https://www.info.gouv.fr/actualite/lyceennes-lyceens-donnez-votre-avis-sur-votre-quotidien-au-lycee',
  },
  consult26: {
    org: 'Premier ministre, premiers résultats de la consultation lycéenne (76 500 contributions), relayés par Europe 1',
    titre: 'Colère des lycéens : temps scolaire, bâtiments… les principales revendications recensées sur la plateforme de concertation',
    date: '11 octobre 2026',
    url: 'https://www.europe1.fr/societe/colere-des-lyceens-temps-scolaire-batiments-les-principales-revendications-recensees-sur-la-plateforme-de-concertation-1139498',
  },
  mobilisation26: {
    org: 'Ministère de l’Intérieur et ministère de l’Éducation nationale, chiffres du 6 octobre 2026 relayés par franceinfo',
    titre: 'La mobilisation des lycéens a réuni 450 000 manifestants selon l’intersyndicale, 256 000 selon le ministère de l’Intérieur ; cours suspendus dans 891 lycées sur 3 700',
    date: '6 octobre 2026',
    url: 'https://www.franceinfo.fr/societe/education/blocage-des-lycees/la-mobilisation-des-lyceens-a-reuni-450-000-manifestants-selon-l-intersyndicale-de-la-jeunesse-contre-256-000-d-apres-le-ministere-de-l-interieur_8225587.html',
  },
  chantiers26: {
    org: 'Premier ministre, lettre aux ministres du 4 octobre 2026 (cinq chantiers), relayée par la Banque des Territoires',
    titre: 'Mouvement lycéen : Sébastien Lecornu lance cinq chantiers pour « répondre aux difficultés »',
    date: '5 octobre 2026',
    url: 'https://www.banquedesterritoires.fr/mouvement-lyceen-sebastien-lecornu-lance-cinq-chantiers-pour-repondre-aux-difficultes',
  },
  dix_mesures: {
    org: 'Union étudiante et Union syndicale lycéenne',
    titre: '« 10 mesures d’urgence pour la jeunesse »',
    date: '5 octobre 2026',
    url: 'https://union-etudiante.fr/10mesures/',
  },
  snes_rentree26: {
    org: 'SNES-FSU, enquête de rentrée auprès de 1 033 collèges et lycées publics',
    titre: 'Rentrée 2026, toujours la pénurie !',
    date: '7 septembre 2026',
    url: 'https://www.snes.edu/article/rentree-2026-toujours-la-penurie/',
  },
  remplacants26: {
    org: 'Ministère de l’Éducation nationale, annonces du 15 octobre 2026 relayées par Europe 1',
    titre: '3 000 professeurs titulaires remplaçants appelés en urgence ; les lycées « en grande difficulté » passés de 114 à 47 en une semaine',
    date: '15 octobre 2026',
    url: 'https://www.europe1.fr/societe/mouvement-des-lycees-les-problemes-de-remplacement-dans-les-etablissements-prioritaires-resolus-a-la-rentree-espere-edouard-geffray-1151282',
  },
  ocde_temps: {
    org: 'OCDE, temps d’instruction à 15 ans, relayé par le CIDJ',
    titre: 'Emploi du temps au lycée : le casse-tête des journées 8 h-18 h (1 224 heures par an en France, 962 dans l’Union européenne)',
    date: 'octobre 2026',
    url: 'https://www.cidj.com/s-orienter/au-coeur-des-revendications-le-8h-18h-pese-sur-les-lyceens',
  },
  parcoursup26: {
    org: 'Ministère de l’Enseignement supérieur, bilan de la phase principale de Parcoursup 2026, relayé par Thotis',
    titre: '126 632 candidats sans proposition à l’issue de la phase principale (17,4 %)',
    date: '11 juillet 2026',
    url: 'https://thotismedia.com/bilan-parcoursup-2026-plus-de-126-000-candidats-encore-sans-proposition-a-lissue-de-la-phase-principale/',
  },
  cespm26: {
    org: 'Comité éthique et scientifique de Parcoursup et Mon Master (ministère de l’Enseignement supérieur)',
    titre: '8e rapport : publier le code, ou au moins la spécification, du module de classement',
    date: 'avril 2026',
    url: 'https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2026-04/8e-rapport-du-comit-thique-et-scientifique-de-parcoursup-et-mon-master-39958.pdf',
  },
  regions_lycees: {
    org: 'Observatoire des finances publiques locales, dépenses des régions pour le second degré en 2025, relayé par Public Sénat',
    titre: 'Blocage des lycées : que paient les régions pour la construction et l’entretien des établissements ? (6,8 Md€, dont 2,5 Md€ d’investissement)',
    date: 'octobre 2026',
    url: 'https://www.publicsenat.fr/actualites/economie/blocage-des-lycees-que-payent-les-regions-pour-la-construction-et-lentretien-des-etablissements',
  },
  plf27: {
    org: 'Projet de loi de finances pour 2027, mission « Enseignement scolaire », relayé par la Banque des Territoires',
    titre: 'L’Éducation nationale « préservée » par le PLF 2027 : +1,2 Md€, 1 588 suppressions de postes d’enseignants',
    date: '2 octobre 2026',
    url: 'https://www.banquedesterritoires.fr/leducation-nationale-preservee-par-le-projet-de-loi-de-finances-pour-2027',
  },
  outremer26: {
    org: 'Outre-mer La 1ère (France Télévisions)',
    titre: 'Ce que l’on sait du mouvement des lycéens, de La Réunion à la Guyane en passant par Mayotte : au lycée du Nord, 2 300 élèves dans des bâtiments conçus pour 900',
    date: 'octobre 2026',
    url: 'https://la1ere.franceinfo.fr/ce-que-l-on-sait-du-mouvement-des-lyceens-de-la-reunion-a-la-guyane-en-passant-par-la-guyane-mayotte-et-la-martinique-1744191.html',
  },
  depp_ni2609: {
    org: 'DEPP, ministère de l’Éducation nationale (note d’information 26.09)',
    titre: 'Prévisions d’effectifs : 5,58 millions d’élèves dans le second degré à la rentrée 2026, soit 36 200 de moins qu’en 2025',
    date: 'avril 2026',
    url: 'https://www.education.gouv.fr/sites/default/files/document/education-nationale-depp-ni-2026-09-pdf-508061.pdf',
  },
  interpellations26: {
    org: 'Euronews, d’après l’AFP et le ministère de l’Intérieur',
    titre: '400 lycées fermés, près de 2 000 interpellations (90 % de mineurs), une centaine d’établissements gravement dégradés',
    date: '2 octobre 2026',
    url: 'https://fr.euronews.com/2026/10/02/400-lycees-fermes-plus-de-2-000-interpellations-la-mobilisation-lyceenne-ne-faiblit-pas',
  },
  nantes26: {
    org: 'Assemblée nationale, proposition de résolution (17e législature)',
    titre: 'Incendie du lycée Nelson-Mandela de Nantes : 2 millions d’euros de dégâts, un mois de fermeture',
    date: 'octobre 2026',
    url: 'https://www.assemblee-nationale.fr/dyn/17/textes/l17b3292_proposition-resolution.pdf',
  },
  concertation_men: {
    org: 'Ministère de l’Éducation nationale',
    titre: 'Les structures de concertation dans les établissements : conseil d’administration (30 membres en lycée), conseil pédagogique, conseil de la vie lycéenne',
    date: 'page de référence',
    url: 'https://www.education.gouv.fr/les-structures-de-concertation-9242',
  },
  cvl_bo: {
    org: 'Bulletin officiel de l’Éducation nationale (numéro hors-série 4, 2000) et décret EPLE',
    titre: 'Le conseil de la vie lycéenne : dix lycéens élus pour deux ans, présidé par le chef d’établissement, adultes à voix consultative',
    date: '2000, modifié 2016',
    url: 'https://www.education.gouv.fr/bo/2000/hs4/cvl.htm',
  },
  fvl_circ: {
    org: 'Circulaire n° 2014-092 du 16 juillet 2014, « Favoriser l’engagement des élèves »',
    titre: 'Le fonds de vie lycéenne : appel à projets, représentants lycéens associés aux critères de répartition',
    date: 'juillet 2014',
    url: 'https://www.education.gouv.fr/bo/14/Hebdo29/MENE1416441C.htm',
  },
  fvl_enquete: {
    org: 'Rectorat d’Orléans-Tours, enquête nationale sur la vie lycéenne (synthèse académique)',
    titre: 'Fonds de vie lycéenne voté par les conseils d’administration : 771 € en moyenne par lycée, de 0 à 64 158 €',
    date: 'vers 2016',
    url: 'https://ac-orleans-tours.fr/media/23960/download',
  },
  dhg_qe: {
    org: 'Assemblée nationale, réponse ministérielle à une question écrite (17e législature)',
    titre: 'Dotation horaire globale : le volume est fixé par l’académie, le conseil d’administration délibère sur la répartition (articles L. 421-4 et R. 421-9 du code de l’éducation)',
    date: '2025',
    url: 'https://www.assemblee-nationale.fr/dyn/17/questions/QANR5L17QE9236.pdf',
  },
  discipline_eduscol: {
    org: 'Éduscol, ministère de l’Éducation nationale',
    titre: 'Le conseil de discipline : trois représentants des élèves dans les lycées, élus par les délégués de classe',
    date: 'document de référence',
    url: 'https://eduscol.education.fr/document/31078/download',
  },
  hvc_snes: {
    org: 'SNES-FSU, fiche réglementaire',
    titre: 'L’heure de vie de classe : dix heures annuelles inscrites à l’emploi du temps depuis la rentrée 2002',
    date: 'fiche mise à jour',
    url: 'https://www.snes.edu/ma-carriere/obligations-reglementaires/l-heure-de-vie-de-classe/',
  },
  ope_portugal: {
    org: 'Revue Educação, Sociedade & Culturas (université de Porto), étude sur l’Orçamento Participativo das Escolas',
    titre: 'Le budget participatif des écoles au Portugal (créé en 2017, 1 € par élève) : des centaines d’écoles, des propositions surtout tournées vers le bien-être, pas d’évaluation nationale d’impact',
    date: '2023',
    url: 'https://ojs.up.pt/index.php/esc-ciie/article/download/610/447/1929',
  },
  mager_nowak: {
    org: 'Mager et Nowak, Educational Research Review (revue systématique de 32 études)',
    titre: 'Effets de la participation des élèves aux décisions de l’établissement : effets positifs modérés sur les connaissances et valeurs civiques, trop peu d’études solides sur les résultats scolaires',
    date: '2012',
    url: 'https://eric.ed.gov/?id=EJ955284',
  },
  tabin_mediation: {
    org: 'Tabin, Revue suisse des sciences de l’éducation (revue systématique de onze programmes)',
    titre: 'La médiation par les pairs en milieu scolaire : des programmes efficaces existent, les preuves contre le harcèlement restent minces',
    date: '2019',
    url: 'https://www.pedocs.de/volltexte/2019/17745/pdf/SZBW_2019_1_Tabin_La_mediation_par_les_pairs.pdf',
  },
  mediatrice25: {
    org: 'Médiatrice de l’Éducation nationale et de l’Enseignement supérieur, chiffres clés 2025',
    titre: '28 450 saisines traitées en 2025 (+22 % en un an, +57 % en cinq ans), 78 % d’interventions avec succès total ou partiel ; rapport consacré à la santé mentale',
    date: 'juillet 2026',
    url: 'https://www.education.gouv.fr/sites/default/files/document/chiffres-cl-s-2025-de-la-m-diation-de-l-ducation-nationale-et-de-l-enseignement-sup-rieur-518885.pdf',
  },
  /* --- territoires : ce que coûte un lycéen selon l'endroit (dossier RECHERCHE-TERRITOIRES.md) --- */
  insee_die2024: {
    org: 'Insee, Dépenses d’éducation (compte de l’éducation, DEPP)',
    titre: 'Dépense intérieure d’éducation 2024 : 197,1 Md€ ; 11 660 € par élève du second degré, 9 080 € au premier degré, 10 920 € en moyenne',
    date: '2025',
    url: 'https://www.insee.fr/fr/statistiques/8612572',
  },
  ocde_rse2025: {
    org: 'OCDE, Regards sur l’éducation 2025, note pays France',
    titre: '18 127 dollars PPA par élève du second cycle du secondaire en France contre 14 562 en moyenne OCDE (+24 %) ; −13 % au préélémentaire et à l’élémentaire, −5 % au collège',
    date: '2025',
    url: 'https://www.oecd.org/content/dam/oecd/fr/publications/reports/2025/09/education-at-a-glance-2025-country-notes_9749f4ff/france_0639c7fb/aca6dceb-fr.pdf',
  },
  ofgl_regions: {
    org: 'Observatoire des finances et de la gestion publique locales, relayé par Public Sénat',
    titre: 'Les régions ont consacré 6,8 Md€ aux établissements du second degré en 2025, dont 4,3 Md€ de fonctionnement et 2,5 Md€ d’investissement',
    date: '2026',
    url: 'https://www.publicsenat.fr/actualites/economie/blocage-des-lycees-que-payent-les-regions-pour-la-construction-et-lentretien-des-etablissements',
  },
  dres_insee: {
    org: 'Insee, définitions',
    titre: 'Dotation régionale d’équipement scolaire : concours de l’État aux régions pour la construction, les grosses réparations et l’équipement des lycées',
    date: '2024',
    url: 'https://www.insee.fr/fr/metadonnees/definition/c1339',
  },
  dres_an: {
    org: 'Assemblée nationale, amendements au projet de loi de finances pour 2023',
    titre: 'Dotation régionale d’équipement scolaire figée depuis 2008 à 661,8 M€ ; en Île-de-France, de 219 € par élève en 2008 à 162 € en 2022',
    date: '2022',
    url: 'https://www.assemblee-nationale.fr/dyn/16/amendements/0273A/AN/1096.pdf',
  },
  gazette_invest: {
    org: 'La Gazette des communes, à partir des comptes administratifs des régions',
    titre: 'Investissement des régions dans les lycées publics, 2022-2025 : de 885 € par lycéen et par an (Hauts-de-France) à 1 978 € (Bretagne) ; Île-de-France 1 206 € ; 22 Md€ investis en dix ans',
    date: '2026',
    url: 'https://www.lagazettedescommunes.com/club-education-et-vie-scolaire/politiques-educatives/lycees/lycees-derriere-les-milliards-investis-un-parc-toujours-vieillissant.HCECLCFIQFAOLBNGRE724K63JU.html',
  },
  gazette_prive: {
    org: 'La Gazette des communes, enquête sur les subventions régionales aux lycées privés',
    titre: '1,05 Md€ de subventions facultatives aux lycées privés entre 2016 et 2023 : 3 884 € par lycéen du privé en Pays de la Loire, 3 059 € en Bretagne, 405 € en Île-de-France',
    date: '2025',
    url: 'https://www.lagazettedescommunes.com/973132/depuis-2016-105-milliard-deuros-de-subventions-regionales-un-choix-politique-assume/',
  },
  gazette_accueil: {
    org: 'La Gazette des communes, comptes administratifs des régions 2023',
    titre: 'Dépenses de fonctionnement par élève dans les lycées publics en 2023 : 1 500 € en Île-de-France, le plus faible niveau, contre plus de 2 000 € en moyenne',
    date: '2026',
    url: 'https://www.lagazettedescommunes.com/club-education-et-vie-scolaire/equipements-scolaires/lycees-derriere-les-blocus-la-question-des-conditions-daccueil.Y4JOGJFZUJD53KRDN5KQLF4SN4.html',
  },
  idf_dotation: {
    org: 'Région Île-de-France, communiqué',
    titre: 'Dotation globale de fonctionnement des lycées publics : 210 M€ en 2026, doublée en dix ans à périmètre constant ; « près de 4 000 € par lycéen public »',
    date: '2025',
    url: 'https://www.iledefrance.fr/presse/la-region-ile-de-france-double-les-moyens-de-fonctionnement-des-lycees-publics-en-dix-ans',
  },
  idf_cantine: {
    org: 'Lycée public francilien, grille régionale de tarification 2026-2027',
    titre: 'Prix du repas au lycée en Île-de-France selon le quotient familial : de 0,50 € à 4,66 € au ticket ; la Région finance de 53 à 98 % du coût',
    date: '2026',
    url: 'https://lyc-ferry-versailles.ac-versailles.fr/IMG/pdf/tarifs_2026-2027_-_famille_mode_d_emploi_-_equitables.pdf',
  },
  na_cantine: {
    org: 'Région Nouvelle-Aquitaine, tarification solidaire des cantines, questions des familles 2026',
    titre: 'Tarification solidaire dans la totalité des lycées publics à la rentrée 2026 ; les familles les plus modestes paient 2,30 € (le prix des denrées) pour un repas qui coûte 9,50 € à produire',
    date: '2026',
    url: 'https://jeunes.nouvelle-aquitaine.fr/sites/default/files/2026-05/Tarification%20solidaire%20cantines%20-%20FAQ%20familles%202026.pdf',
  },
  ipp_territoires: {
    org: 'Institut des politiques publiques, « Mobilisation des lycéens : le sentiment d’inégalité territoriale peut-il être objectivé ? »',
    titre: 'Entre 2005 et 2025, à Créteil et Versailles, les effectifs d’enseignants n’ont pas suivi ceux des élèves ; à Paris, l’inverse, avec des enseignants plus âgés, plus souvent agrégés, moins souvent contractuels. La dépense d’État par élève et par territoire n’est pas mesurable',
    date: '2026',
    url: 'https://www.ipp.eu/mobilisation-des-lyceens-le-sentiment-dinegalite-territoriale-peut-il-etre-objective/',
  },
  depp_ips_lycees: {
    org: 'DEPP, note d’information 25-21, « Quel est le profil social des lycées ? »',
    titre: 'IPS moyen des lycées à la rentrée 2024 : 109 (de 59 à 162) ; 125 dans le privé sous contrat, 105 dans le public ; 92 en lycée professionnel, 121 en général et technologique ; par département, de 71 (Mayotte) à 129 (Paris)',
    date: '2025',
    url: 'https://www.education.gouv.fr/depp/quel-est-le-profil-social-des-lycees-452742',
  },
  ods_ips: {
    org: 'Ministère de l’Éducation nationale, données ouvertes : « Indices de position sociale des lycées (à partir de 2023) »',
    titre: 'Une ligne par lycée et par rentrée, public et privé sous contrat, avec l’IPS par voie ; export CSV et JSON, interface de programmation ouverte (5 000 appels par jour sans compte)',
    date: '2025',
    url: 'https://data.education.gouv.fr/explore/dataset/fr-en-ips-lycees-ap2023/',
  },
  ival_guide: {
    org: 'DEPP, indicateurs de résultats des lycées (IVAL), guide méthodologique 2025',
    titre: 'Pour chaque lycée, le taux de réussite au bac et le taux d’accès de la seconde au bac, comparés à ce que le profil des élèves laissait attendre : la « valeur ajoutée »',
    date: '2025',
    url: 'https://www.education.gouv.fr/indicateurs-resultats-lycees',
  },
  datagouv_bac: {
    org: 'data.gouv.fr, DEPP, « Réussite au baccalauréat par département »',
    titre: 'Admis et taux de réussite par département et par voie, sessions 2023 et 2024 (notes DEPP 24-07 et 25-05)',
    date: '2025',
    url: 'https://www.data.gouv.fr/datasets/67ac1cead25c6f09c2c6a495',
  },
  geo_education: {
    org: 'DEPP, Géo-éducation, l’observatoire territorial sur l’éducation',
    titre: 'Cartes interactives d’indicateurs scolaires par commune, département, académie, bassin de vie et aire d’éducation : élèves, établissements, résultats, contexte social',
    date: '2026',
    url: 'https://www.education.gouv.fr/geo-education-l-observatoire-territorial-sur-l-education-343981',
  },
  geo_ecole2026: {
    org: 'DEPP, Géographie de l’École 2026',
    titre: '38 fiches cartographiées (environnement social, contexte scolaire, moyens, parcours et résultats), avec les fichiers de données par département, académie ou région',
    date: '2026',
    url: 'https://www.education.gouv.fr/sites/default/files/document/g-ographie-de-l-cole-2026-519114.pdf',
  },
  senat_ruraux: {
    org: 'Sénat, réponse du ministère de l’Éducation nationale à une question écrite',
    titre: 'Les élèves des communes rurales ont, à l’issue du collège, un taux de passage en seconde générale et technologique inférieur de 10 points à ceux des communes urbaines, écart attribué à l’éloignement de l’offre de formation',
    date: '2025',
    url: 'https://www.senat.fr/questions/base/2025/qSEQ250203074.html',
  },
  letudiant_heures: {
    org: 'L’Étudiant, chiffres du ministère de l’Éducation nationale',
    titre: '7,5 % des heures d’enseignement perdues en 2024-2025 dans les collèges et lycées pour absence d’un professeur, jusqu’à 14 % dans les établissements les plus touchés ; les absences longues non remplacées ont presque doublé en six ans',
    date: '2026',
    url: 'https://www.letudiant.fr/lycee/filiere-generale-et-technologique/article/mouvement-lyceen-le-nombre-d-heures-de-cours-non-remplacees-a-presque-double-en-six-ans.html',
  },
  an_remplacement: {
    org: 'Assemblée nationale, rapport d’information sur le remplacement des enseignants (17e législature)',
    titre: 'Environ 20 millions d’heures non assurées en 2024-2025, près de 10 % du total des heures d’enseignement du second degré',
    date: '2026',
    url: 'https://www.assemblee-nationale.fr/dyn/docs/RINFANR5L17B3198.pdf',
  },
  depp_climat_lyceens: {
    org: 'DEPP, enquête nationale de climat scolaire et de victimation auprès des lycéens 2022-2023',
    titre: '91 % des lycéens se sentent bien ou tout à fait bien dans leur lycée ; 40 % des filles et 12 % des garçons se disent très stressés par les évaluations ; pas de résultats par académie, prochaine enquête en 2027',
    date: '2024',
    url: 'https://www.education.gouv.fr/depp/91-des-eleves-declarent-se-sentir-bien-ou-tout-fait-bien-dans-leur-lycee-resultats-de-l-enquete-452505',
  },
  eduscol_elcs: {
    org: 'Éduscol, ministère de l’Éducation nationale, enquête locale de climat scolaire',
    titre: 'L’application ELCS permet à chaque école, collège ou lycée d’établir sa propre photographie du climat scolaire et de la comparer aux résultats nationaux',
    date: '2025',
    url: 'https://eduscol.education.gouv.fr/5016/une-ecole-engagee-en-faveur-du-climat-scolaire',
  },
  snes_chaleur: {
    org: 'SNES-FSU, « météo des classes », relevé déclaratif des 18 et 19 juin 2026',
    titre: 'Plus de 30 °C relevés dans 88 % des 669 collèges et lycées répondants en juin 2026 (78 % en mai), 87 % sans mesure d’adaptation ; relevés volontaires, non représentatifs',
    date: '2026',
    url: 'https://www.snes.edu/article/vague-de-chaleur-le-retour-de-la-meteo-des-classes/',
  },
  an_chaleur: {
    org: 'Assemblée nationale, question écrite n° 17103 (17e législature)',
    titre: 'Chaleur dans les établissements scolaires : des budgets des collectivités jugés insuffisants pour adapter les bâtiments ; un plan canicule départemental de 100 M€ pour les collèges arrêté en 2025',
    date: '2026',
    url: 'https://www.assemblee-nationale.fr/dyn/17/questions/QANR5L17QE17103',
  },
  f3_rentree2026: {
    org: 'France 3 Régions, rentrée scolaire 2026',
    titre: 'Cours interrompus l’après-midi du 7 septembre 2026 dans deux lycées de l’Hérault en raison de températures excessives dans les salles',
    date: '2026',
    url: 'https://france3-regions.franceinfo.fr/societe/education/rentree-scolaire',
  },
  park_chaleur: {
    org: 'Park, Goodman, Hurwitz et Smith, « Heat and Learning », American Economic Journal: Economic Policy',
    titre: 'Sur dix millions d’élèves américains, chaque année scolaire plus chaude de 1 °F réduit les apprentissages mesurés d’environ 1 % ; la climatisation des écoles annule l’essentiel de l’effet',
    date: '2020',
    url: 'https://www.aeaweb.org/articles?id=10.1257/pol.20180612',
  },
  behaghel_internat: {
    org: 'Behaghel, de Chaisemartin et Gurgand, « Ready for Boarding? », American Economic Journal: Applied Economics',
    titre: 'Internat d’excellence de Sourdun, évaluation par tirage au sort : pas d’effet la première année, puis des gains importants en mathématiques la deuxième, surtout pour les élèves initialement les plus forts',
    date: '2017',
    url: 'https://www.aeaweb.org/articles?id=10.1257/app.20150090',
  },
  cdc_ep: {
    org: 'Cour des comptes, « L’éducation prioritaire », rapport d’évaluation d’une politique publique',
    titre: 'Depuis la réforme de 2014-2015, l’éducation prioritaire ne couvre plus que les écoles et les collèges ; les lycées en sont sortis, et la Cour recommande une allocation progressive des moyens à tous les établissements selon leur profil social',
    date: '2018',
    url: 'https://www.ccomptes.fr/fr/publications/leducation-prioritaire',
  },
  occitanie_bp: {
    org: 'Le Journal Toulousain, budget participatif lycéen de la Région Occitanie',
    titre: 'Lancé à la rentrée 2017-2018 : une trentaine de lycées, les élèves proposent (foyer, internat, espaces extérieurs) et votent le projet financé, jusqu’à 10 000 € par projet',
    date: '2018',
    url: 'https://www.lejournaltoulousain.fr/politique/les-budgets-participatifs-a-quoi-ca-sert-59839/',
  },
  bretagne_bp: {
    org: 'Région Bretagne, dossier de presse de rentrée 2024',
    titre: 'Budget participatif lycéen : des projets entièrement à la main des élèves, concrétisés dans neuf lycées pilotes',
    date: '2024',
    url: 'https://bretagne.bzh/app/uploads/272-DP-Rentree-Lycees-Region-Bretagne-2024.pdf',
  },
  cvl_bp: {
    org: 'Région Centre-Val de Loire, « Ma Région Ô Lycées »',
    titre: 'Un budget participatif des lycées, projets initiés par les lycéennes et lycéens, prévu à partir de la rentrée 2026',
    date: '2026',
    url: 'https://www.centre-valdeloire.fr/vivre/accompagner-la-formation/lyceens/ma-region-o-lycees',
  },
  paca_prj: {
    org: 'L’Écho du Mardi, Parlement régional de la jeunesse de Provence-Alpes-Côte d’Azur',
    titre: 'Le Parlement régional de la jeunesse clôture son mandat 2024-2025 ; il dispose d’un budget de 50 000 €',
    date: '2025',
    url: 'https://www.echodumardi.com/politiqueetterritoire/le-parlement-regional-de-la-jeunesse-cloture-son-mandat-2024-2025/',
  },
  orleans_cvl: {
    org: 'Académie d’Orléans-Tours, bilan des élections au conseil de la vie lycéenne 2025',
    titre: '65 % de participation aux élections CVL dans l’académie en 2025 (72,3 % dans le Cher), « très supérieure à une moyenne nationale estimée à moins de 50 % »',
    date: '2025',
    url: 'https://www.ac-orleans-tours.fr/media/33744/download',
  },
  bmbf_laender: {
    org: 'Portail de données du ministère fédéral allemand de l’éducation (Destatis), tableau 2.1.14',
    titre: 'Dépense publique par élève de Gymnasium en 2023 : 9 700 € en Rhénanie-du-Nord-Westphalie, 11 200 € au Bade-Wurtemberg, 14 000 € en Bavière, 14 200 € à Berlin',
    date: '2025',
    url: 'https://www.datenportal.bmbf.de/portal/de/Tabelle-2.1.14.pdf',
  },
  census_states: {
    org: 'United States Census Bureau, Annual Survey of School System Finances 2023',
    titre: 'Dépense courante par élève selon l’État : 10 203 $ dans l’Idaho, 10 333 $ dans l’Utah, 30 012 $ dans l’État de New York',
    date: '2025',
    url: 'https://www.census.gov/newsroom/press-releases/2025/2023-annual-survey-of-school-system-finances.html',
  },
  mec_espagne: {
    org: 'Ministère espagnol de l’Éducation, Eurydice, dépense publique par élève',
    titre: '7 384 € par élève des centres publics non universitaires en 2022 ; le Pays basque, la Navarre, la Cantabrie, les Asturies et La Rioja dépensent le plus, Madrid parmi les moins (de 5 534 € à 8 946 € selon une étude des fondations Areces et Europea)',
    date: '2025',
    url: 'https://www.educacionfpydeportes.gob.es/eu/mc/redie-eurydice/sistemas-educativos/organizacion-y-administracion/gasto-publico-conciertos.html',
  },
  elcano_pisa: {
    org: 'Real Instituto Elcano, résultats régionaux de PISA 2022 en Espagne',
    titre: '52 points d’écart en mathématiques entre Castille-et-León et les Canaries ; 30 à 40 points valent à peu près une année scolaire',
    date: '2024',
    url: 'https://www.realinstitutoelcano.org/en/commentaries/mixed-education-results-in-pisa-international-tests/',
  },
  cmec_pisa: {
    org: 'Conseil des ministres de l’Éducation du Canada, PISA 2022, faits saillants',
    titre: 'Part d’élèves atteignant le niveau de base en mathématiques : de 66 % à Terre-Neuve-et-Labrador à 83 % au Québec',
    date: '2023',
    url: 'https://cmec.ca/docs/pisa2022/PISA-2022_Highlights_FINAL_EN.pdf',
  },
  acara_myschool: {
    org: 'ACARA, My School (Australie)',
    titre: 'Pour chaque école du pays : profil des élèves, résultats aux tests nationaux et financement, avec une comparaison limitée aux « écoles semblables » (indice ICSEA) pour éviter les palmarès',
    date: '2025',
    url: 'https://myschool.edu.au/about-my-school',
  },
  govuk_compare: {
    org: 'GOV.UK, Compare school and college performance (Angleterre)',
    titre: 'Résultats, rapports d’inspection et informations financières de chaque établissement, séries depuis 1991-1992',
    date: '2026',
    url: 'https://www.gov.uk/school-performance-tables',
  },
  essa_k12dive: {
    org: 'K-12 Dive, obligations de la loi fédérale américaine ESSA',
    titre: 'Depuis 2018-2019, chaque État doit publier sur son bulletin annuel la dépense par élève de chaque école, par source de financement',
    date: '2017',
    url: 'https://www.k12dive.com/news/essa-reporting-requirements-will-reveal-spending-disparities-within-distric/429504/',
  },
  issu_ncca: {
    org: 'Gouvernement irlandais, ministère de l’Éducation',
    titre: 'Le président du syndicat lycéen (ISSU) siège de droit au Conseil national des programmes et de l’évaluation (NCCA) par arrêté ministériel ; une unité « participation des élèves » créée au ministère en 2023',
    date: '2023',
    url: 'https://www.gov.ie/en/department-of-education/press-releases/minister-foley-announces-addition-of-the-irish-second-level-students-union-to-the-national-council-for-curriculum-and-assessment/',
  },
  osta_ontario: {
    org: 'Ontario Student Trustees’ Association',
    titre: 'Des élèves élus (« student trustees ») siègent aux conseils scolaires de l’Ontario avec voix mais sans vote contraignant ; ils peuvent demander un vote indicatif et réclament le droit de déposer des motions',
    date: '2024',
    url: 'https://osta-aeco.org/our-work/the-students-vision-for-education/school-board-governance/',
  },
  an_toilettes: {
    org: 'Assemblée nationale, question écrite au Gouvernement (16e législature)',
    titre: 'État des sanitaires dans les établissements : ni papier ni savon dans de très nombreux établissements, nombre de sanitaires parfois insuffisant ; un tiers des élèves renoncent à y aller (Observatoire national de la sécurité, 2014)',
    date: '2023',
    url: 'https://questions.assemblee-nationale.fr/dyn/16/questions/QANR5L16QE14330.pdf',
  },
  odoxa26: {
    org: 'Odoxa pour Le Figaro et Backbone Consulting',
    titre: 'Les Français soutiennent les lycéens mais réprouvent l’implication de LFI (62 % jugent la mobilisation justifiée)',
    date: '1er octobre 2026',
    url: 'https://www.odoxa.fr/sondage/16286-2/',
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
  { annee: 2027, md: 65.30, prevision: true, note: 'plafond prévisionnel : +0,8 Md€. C’est votre marge, sur le papier.', src: 'plafonds27' },
];

/* ---------------------------------------------------------------------------
   Ce que les lycéens ont écrit : part des 76 500 premières contributions de la
   consultation nationale (octobre 2026) qui évoquent chaque sujet. Une
   contribution peut en évoquer plusieurs ; la consultation est ouverte, pas
   représentative, et le jeu le dit.
   ------------------------------------------------------------------------- */
export const SERIE_CONSULTATION = [
  { sujet: 'Journées trop longues, emplois du temps', pct: 71, src: 'consult26' },
  { sujet: 'Bâtiments, toilettes, chauffage, chaleur', pct: 51, src: 'consult26' },
  { sujet: 'Professeurs absents, non remplacés', pct: 28.5, src: 'consult26' },
  { sujet: 'Trop d’élèves par classe', pct: 24, src: 'consult26' },
  { sujet: 'Parcoursup et l’orientation', pct: 14.5, src: 'consult26' },
];

/* ---------------------------------------------------------------------------
   Les thèmes de référence. `cle` sert d'ancre, `chiffres` est la matière.
   ------------------------------------------------------------------------- */
export const REPERES = [
  {
    cle: 'budget',
    titre: 'Un budget contraint',
    resume: 'Le premier budget de l’État en effectifs, et le plus rigide en euros.',
    chiffres: [
      { v: '64,49 Md€', l: 'crédits de paiement de la mission « Enseignement scolaire » au budget 2026, hors contribution au CAS Pensions', src: 'senat_plf26' },
      { v: '89,64 Md€', l: 'la même mission pensions comprises, c’est ce chiffre que citent les tribunes, et l’autre que manie Bercy', src: 'senat_plf26' },
      { v: '+0,26 %', l: 'progression du budget 2026 sur 2025 : +167 M€ en crédits de paiement, moins que l’inflation', src: 'senat_plf26' },
      { v: '+0,8 Md€', l: 'hausse inscrite au plafond prévisionnel du PLF 2027 (65,3 Md€), soit +1,2 %, la marge que vous héritez', src: 'plafonds27' },
      { v: '≈ 93 %', l: 'part de la mission consommée par la masse salariale : ce qui n’est pas arbitrable dans l’année', src: 'cc_neb24' },
      { v: '13 545 $', l: 'dépense annuelle par élève en France (moyenne OCDE : 12 647 $), mais −13 % en primaire, −5 % au collège, +24 % au lycée', src: 'ocde25' },
      { v: '9 100 € → 14 700 €', l: 'dépense annuelle par élève en 2024 selon le niveau : 9 100 € à l’école, 10 500 € au collège, 13 000 € au lycée général, 14 700 € au lycée professionnel. Le même élève ne vaut pas la même chose selon l’année où on le regarde', src: 'hcsp26' },
      { v: 'stable depuis 2010', l: 'la dépense par élève du second degré, en euros constants ; celle du premier degré, elle, progresse depuis 2010 et surtout depuis 2017 : le rééquilibrage a commencé, il n’est pas fini', src: 'hcsp26' },
    ],
    serie: 'budget',
    aRetenir: 'La France ne dépense pas moins que ses voisins : elle dépense ailleurs. Le lycée est sur-doté, le primaire sous-doté, et l’écart se creuse depuis vingt ans. Déplacer un euro du second vers le premier degré est la décision la moins coûteuse et la plus impopulaire du métier.',
  },
  {
    cle: 'demographie',
    titre: 'Une baisse démographique',
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
    titre: 'Des résultats préoccupants',
    resume: 'Ce que mesurent les évaluations nationales et internationales, à trois âges différents.',
    chiffres: [
      { v: '474 / 474 / 487', l: 'PISA 2022, élèves de 15 ans : mathématiques, compréhension de l’écrit, sciences. Moyennes OCDE : 472, 476, 485, la France est dans la moyenne', src: 'pisa22' },
      { v: 'baisse « sans précédent »', l: 'c’est le mot de l’OCDE pour la chute en mathématiques entre 2018 et 2022 ; elle suit une période de stabilité', src: 'pisa22' },
      { v: '7 %', l: 'd’élèves très performants en mathématiques en France (OCDE : 9 %), le haut du tableau s’érode aussi', src: 'pisa22' },
      { v: '484', l: 'score des CM1 français en mathématiques (TIMSS 2023), contre 524 pour la moyenne de l’Union européenne et 525 pour l’OCDE', src: 'timss23' },
      { v: '15 %', l: 'des CM1 n’atteignent pas le niveau minimal en mathématiques ; les résultats sont stables depuis 2019', src: 'timss23' },
      { v: '514', l: 'compréhension de l’écrit en CM1 (PIRLS 2021) : au-dessus de la moyenne internationale (500), sous la moyenne européenne (527), mais la France est l’un des rares pays à s’être stabilisé', src: 'pirls21' },
      { v: 'un quart', l: 'des jeunes de 17-18 ans avaient en 2024 des difficultés prononcées en lecture aux tests de la Journée défense et citoyenneté, et la moitié d’entre eux se situaient sous le seuil de lecture fonctionnelle', src: 'hcsp26' },
      { v: 'septembre 2025', l: 'évaluations nationales : progrès confirmés en CP depuis 2019, résultats en baisse en français en CE1 sur trois compétences sur huit, français en hausse en 6e', src: 'evalnat25' },
    ],
    aRetenir: 'Les enquêtes internationales mesurent une cohorte, pas un ministre : un élève de PISA 2027 est entré au CP en 2018. Aucune mesure prise pendant votre mandat n’apparaîtra dans PISA avant votre départ. C’est la contrainte que le jeu vous fait éprouver : la vitrine bouge tout de suite, le réel arrive après vous.',
  },
  {
    cle: 'inegalites',
    titre: 'Les inégalités sociales',
    resume: 'Le point où la France est régulièrement la plus mal classée.',
    chiffres: [
      { v: '99,9 vs 117,4', l: 'indice de position sociale médian des collèges publics et des collèges privés sous contrat (2023-2024) ; l’écart se creuse d’environ 2 points par an', src: 'senat_mixite' },
      { v: '75 % / 98 %', l: 'parmi les 200 collèges au plus fort IPS, 75 % sont privés ; parmi les 200 au plus faible, 98 % sont publics', src: 'senat_mixite' },
      { v: '26,4 % → 40,2 %', l: 'part des élèves très favorisés dans le privé sous contrat, de 2000 à 2021', src: 'senat_mixite' },
      { v: '75 % contre 32 %', l: 'part des 25-34 ans diplômés du supérieur selon que leurs parents le sont ou n’ont pas le baccalauréat', src: 'ocde25' },
      { v: 'en baisse', l: 'la ségrégation entre collèges publics a plutôt diminué, et celle entre collèges privés aussi ; c’est l’écart de composition sociale entre les deux secteurs qui se creuse. Le problème français n’est pas la ségrégation en général, c’est la frontière public/privé', src: 'hcsp26' },
      { v: 'tous les profils', l: 'la faiblesse relative de la France en comparaison internationale touche les élèves modestes comme les favorisés, les plus faibles comme les meilleurs, les filles comme les garçons. La France n’a pas seulement un problème d’inégalités : elle a aussi, jusqu’au collège, un problème de niveau général', src: 'hcsp26' },
      { v: '7,6 %', l: 'de sorties précoces chez les 18-24 ans (environ 110 000 jeunes par an), contre 11,2 % en 2006 : le décrochage, lui, recule', src: 'depp_decrochage' },
    ],
    aRetenir: 'C’est le compteur qui bouge le plus lentement et qui coûte le plus cher politiquement. Toucher au privé sous contrat déclenche un conflit qui, en 1984, a fait tomber un ministre et un gouvernement. Le jeu ne vous en dissuade pas, il vous fait payer le prix réel.',
  },
  {
    cle: 'metier',
    titre: 'Le métier enseignant',
    resume: 'Un million de personnes, dont la moitié de la carrière se joue sur un point d’indice.',
    chiffres: [
      { v: '−26 % / −18 %', l: 'salaires effectifs des enseignants d’élémentaire et de collège par rapport aux autres diplômés du supérieur à temps plein (2024). Moyennes OCDE : −17 % et −13 %', src: 'ocde25' },
      { v: '4 sur 10', l: 'enseignants français ont plus de 50 ans', src: 'ocde25' },
      { v: '3,5 jours', l: 'de formation continue par an au collège, contre 8 en moyenne dans l’OCDE ; 35 % des enseignants français jugent utile la formation proposée, contre 55 % ailleurs', src: 'talis' },
      { v: 'dernière place', l: 'taux de participation à la formation continue le plus faible des pays enquêtés (83 %, contre 94 % en moyenne)', src: 'talis' },
      { v: '2 610', l: 'postes non pourvus aux concours 2025 sur 27 713 offerts (9,4 %), public et privé confondus, dont près de 400 en mathématiques, un poste sur cinq', src: 'concours25' },
      { v: '5 → 2,5', l: 'candidats par poste au concours de professeur des écoles, de la fin des années 2000 à 2024 ; dans le second degré, plus de 6 → environ 3. À Créteil, 0,7 candidat par poste en 2024 ; à Versailles, 0,8', src: 'hcsp26' },
      { v: '+43 %', l: 'de personnels non titulaires entre 2015 et 2022 dans le public, quand le nombre de titulaires reculait de 0,7 %', src: 'hcsp26' },
      { v: '38 % contre 64 %', l: 'enseignants de collège s’estimant bien ou très bien préparés en pédagogie générale, en France et en moyenne européenne', src: 'hcsp26' },
      { v: '1 pour 280', l: 'inspecteurs par enseignant dans le premier degré, 1 pour 240 dans le second, et des inspecteurs de plus en plus mobilisés par la mise en place des réformes, donc éloignés des classes', src: 'hcsp26' },
      { v: '64 % / 55 % / 27 %', l: 'part des enseignants du premier degré, du second degré et des autres cadres déclarant vivre des situations de tension avec le public', src: 'hcsp26' },
      { v: '94,7 %', l: 'de couverture dans le premier degré public en 2025, contre 88,3 % en 2024 : la situation s’améliore, sans être réglée', src: 'concours25' },
    ],
    aRetenir: 'La boucle d’attractivité est le vrai moteur du système : salaires et conditions font les candidats, les candidats font le remplacement, le remplacement fait les conditions. Elle met trois à cinq ans à tourner, soit plus qu’un mandat de ministre.',
  },
  {
    cle: 'moyens',
    titre: 'Le remplacement',
    resume: 'Le sujet dont les familles parlent, et que les statistiques mesurent mal.',
    chiffres: [
      { v: '4,3 % et 7,4 %', l: 'part du temps scolaire perdu faute de remplacement, en moyenne et dans le second degré (rapport sénatorial, juin 2025)', src: 'senat_rempl' },
      { v: '9,3 %', l: 'part des heures d’enseignement perdues au collège et au lycée en 2023-2024 selon la Cour des comptes (décembre 2025). Deux chiffres officiels, deux périmètres : c’est le débat, pas une erreur', src: 'cc_absences' },
      { v: '20 % contre 96 %', l: 'taux de remplacement des absences courtes et des absences de plus de quinze jours', src: 'cc_absences' },
      { v: 'deux tiers', l: 'des absences non remplacées ont une cause institutionnelle (examens, formation, réunions, sorties) et non individuelle', src: 'cc_absences' },
      { v: '4,2 Md€', l: 'budget consacré au remplacement en 2025, en hausse de 33 % depuis 2017', src: 'senat_rempl' },
      { v: '90 502 ETP', l: 'd’accompagnants d’élèves en situation de handicap à la rentrée 2025 (+67 % en huit ans) pour 520 600 élèves en situation de handicap scolarisés', src: 'handicap' },
      { v: '1 sur 7', l: 'élèves notifiés pour un accompagnement humain se retrouve sans AESH à la rentrée : 48 726 sur 352 102', src: 'handicap' },
      { v: '×2,4 en 18 ans', l: 'élèves en situation de handicap scolarisés : 232 400 en 2006 (1,9 % des effectifs), 563 400 en 2024 (4,7 %). La hausse a porté presque entièrement sur le milieu ordinaire', src: 'hcsp26' },
      { v: '49 %', l: 'des enseignants de collège déclarent que l’adaptation des séances pour les élèves à besoins éducatifs particuliers est une source de stress, dix points de plus que la moyenne européenne', src: 'hcsp26' },
      { v: '≈ 900', l: 'médecins scolaires pour 12 millions d’élèves : 1 143 en 2013, 818 en 2022 ; 28 postes seulement ouverts au concours 2025', src: 'an_medecine' },
    ],
    aRetenir: 'Deux tiers des absences non remplacées sont produites par le fonctionnement même du système. C’est la meilleure nouvelle du dossier : cette part-là ne se règle pas en recrutant, elle se règle en réorganisant, donc à budget presque constant, et contre les habitudes de tout le monde.',
  },
  {
    cle: 'organisation',
    titre: 'Le temps scolaire et les classes',
    resume: 'La France est une anomalie horaire dans l’OCDE, dans les deux sens.',
    chiffres: [
      { v: '864 h / 973 h', l: 'heures d’enseignement par an en élémentaire et au collège, contre 730 h et 851 h en moyenne européenne : les élèves français ont plus d’heures que presque partout', src: 'hcsp26' },
      { v: '93 %', l: 'des communes appliquent la semaine de quatre jours à l’école. La France est le seul pays de l’OCDE dans ce cas : partout ailleurs, l’instruction est étalée sur au moins quatre jours et demi. D’où des journées d’école exceptionnellement longues', src: 'hcsp26' },
      { v: '38 % contre 25 %', l: 'part du volume horaire de l’élémentaire consacrée au triptyque lecture / écriture / littérature, en France et en moyenne dans l’Union européenne, et les enseignants déclarent aller au-delà du volume prescrit', src: 'hcsp26' },
      { v: '1 450 h contre 1 100 h', l: 'heures de mathématiques reçues entre 6 et 14 ans, en France et en moyenne internationale. Le volume horaire n’explique donc pas la baisse du niveau en mathématiques', src: 'hcsp26' },
      { v: '47 h pour 72 h', l: 'heures de sciences déclarées en CM1 pour 72 heures recommandées, soit un déficit de 35 % ; les enseignants des autres pays de l’Union européenne en déclarent 58. Là, le volume est bien en cause', src: 'hcsp26' },
      { v: '21,5 et 25,8', l: 'élèves par classe en 2023 au primaire et au collège. Au collège, c’est le nombre le plus élevé des pays européens', src: 'hcsp26' },
      { v: '12,5 / 12,8', l: 'élèves par classe en CP et CE1 dédoublés en éducation prioritaire, pour environ 144 000 élèves de chaque niveau', src: 'depp_dedoub' },
      { v: '2 Md€', l: 'coût annuel estimé du redoublement, pour un effet moyen nul à négatif sur les trajectoires selon le Conseil scientifique de l’éducation nationale', src: 'csen15' },
    ],
    aRetenir: 'Les élèves français passent plus d’heures en classe que presque partout, sur moins de jours, avec plus de français et de maths, et pour des résultats moyens. Cela invalide l’idée qu’il suffirait d’ajouter des heures, et rend l’organisation du temps scolaire au moins aussi décisive que son volume.',
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
    aRetenir: 'Le climat scolaire est le domaine où l’écart entre l’annonce et la preuve est le plus grand : les dispositifs sont généralisés vite, évalués tard, et rarement de manière indépendante. Le jeu le traduit par un faible nombre de cadenas, pas par un effet nul.',
  },
  {
    cle: 'international',
    titre: 'Ce qui a marché ailleurs',
    resume: 'Quatre pays, deux réussites, deux reculs, et aucun modèle transposable tel quel.',
    chiffres: [
      { v: 'Portugal', l: 'quinze ans de réformes menées par des ministres d’orientations différentes, avec un seul fil commun : l’attention constante aux résultats. Seul pays de l’OCDE en progression dans les trois domaines de PISA entre 2000 et 2018', src: 'pisa22' },
      { v: 'Pologne', l: 'le report d’un an du premier palier d’orientation (1999) est identifié comme le facteur crucial d’une progression portée surtout par les élèves les plus faibles', src: 'pisa22' },
      { v: 'Londres', l: 'le London Challenge (2003-2011) fait passer les autorités du centre de Londres des pires aux meilleures performances nationales, grâce à des conseillers chevronnés affectés aux établissements en difficulté, mais l’exportation du modèle hors de Londres a échoué', src: 'hcsp_partieD' },
      { v: 'Suède', l: 'chèque scolaire et libre choix depuis les années 1990 : recul à PISA sans équivalent parmi les pays participants, ségrégation accrue, inflation des notes. C’est le libre choix, et non la ségrégation résidentielle, qui explique le mieux les écarts entre écoles', src: 'suede' },
      { v: 'Finlande', l: 'première à PISA en 2000, 2003 et 2006 ; déclin continu depuis, avec un renforcement du lien entre origine familiale et apprentissage. En mathématiques : 554 points en 2003, 484 en 2022', src: 'pisa22' },
      { v: '10 à 15 ans', l: 'le délai des deux réussites. Sous des majorités différentes, sans réforme spectaculaire, en tirant les élèves les plus faibles', src: 'pisa22' },
    ],
    aRetenir: 'Les deux systèmes qui ont réellement progressé l’ont fait sur dix à quinze ans, sous des majorités successives, sans réforme spectaculaire. Les deux qui ont reculé l’ont fait en libérant le choix et en abandonnant la mesure. La France, elle, a changé sept fois de ministre en trois ans et abrogé ou vidé trois réformes majeures sur quatre. Le jeu ne conclut pas : il rend ces faits jouables.',
  },
  {
    cle: 'diagnostic',
    titre: 'Pourquoi le niveau baisse',
    resume: 'Le diagnostic officiel d’août 2026, et ce qu’il écarte autant que ce qu’il retient.',
    chiffres: [
      { v: 'pas une cause', l: 'le Haut-commissariat à la Stratégie et au Plan conclut qu’il n’existe pas de cause unique. Il distingue des difficultés exogènes (hétérogénéité des publics, écrans) et endogènes, moyens, attractivité du métier, formation, temps scolaire, rythme des réformes', src: 'hcsp26' },
      { v: 'pas le volume horaire', l: 'ni en français ni en mathématiques : les élèves français en reçoivent plus que la moyenne. Ce sont les méthodes et la progression des programmes qui sont mises en cause, sauf en sciences, où le volume, lui, manque vraiment', src: 'hcsp26' },
      { v: 'pas les élèves allophones', l: 'leur nombre augmente fortement mais reste très faible rapporté aux effectifs scolaires : la diversité culturelle pose ses propres défis, elle n’accroît pas mécaniquement l’hétérogénéité des acquis', src: 'hcsp26' },
      { v: 'le rythme des réformes', l: 'au collège, les enseignants citent l’enchaînement des réformes comme source de stress plus souvent que le maintien de la discipline en classe. Il transforme aussi une partie du temps de formation continue en séances d’information sur les dispositifs à mettre en place', src: 'hcsp26' },
      { v: 'le balancier pédagogique', l: 'quarante ans de formation à des méthodes favorisant l’activité de l’élève ont pu se faire au détriment de ce qui ancre durablement les savoirs : traces écrites structurées, ré-explications, entraînement, répétition. Le rapport pose l’hypothèse ; il ne la tranche pas', src: 'hcsp26' },
      { v: 'la méthode de lecture', l: 'la méthode phonique synthétique stricte est la plus efficace, particulièrement pour les élèves de condition modeste, et n’est encore employée que par une minorité d’enseignants, la majorité recourant à des méthodes mixtes', src: 'hcsp26' },
      { v: '50 % dans 15 circonscriptions', l: 'la moitié des enseignants qui emploient la méthode la plus efficace exercent dans une quinzaine de circonscriptions où l’inspection et les conseillers pédagogiques avaient organisé un accompagnement spécifique à l’enseignement de la lecture. La méthode ne se diffuse pas seule', src: 'hcsp26' },
      { v: '11 recommandations', l: 'du rendre-évaluable-et-publier au retour à la semaine de quatre jours et demi, en passant par la formation centrée sur l’observation en classe, la coordination pédagogique reconnue et l’évaluation des manuels. Plusieurs sont jouables dans le catalogue', src: 'hcsp26' },
    ],
    aRetenir: 'Ce rapport est le contraire d’un pamphlet : il écarte méthodiquement les explications les plus commodes (le nombre d’heures, les élèves étrangers, l’argent seul) pour désigner ce qui est plus difficile à changer : la formation des maîtres, l’accompagnement de proximité, les méthodes d’apprentissage de la lecture, l’organisation du temps. Aucune de ces réponses ne se décrète en une rentrée, et c’est exactement ce que le jeu vous fait éprouver.',
  },
  {
    cle: 'etablissement',
    titre: 'Comment marche un lycée',
    resume: 'Qui décide de quoi entre le proviseur, le conseil d’administration, les élèves, la région et le ministre.',
    chiffres: [
      { v: '30 membres', l: 'au conseil d’administration d’un lycée : un tiers d’administration et d’élus locaux, un tiers de personnels, un tiers de parents et d’élèves. Les élèves y sont une poignée de sièges. Il vote le budget, le règlement intérieur et la répartition des heures d’enseignement', src: 'concertation_men' },
      { v: '10 élèves', l: 'élus pour deux ans au conseil de la vie lycéenne, présidé par le proviseur, avec un vice-président élève ; les adultes y ont voix consultative. Il est consulté, il propose, il ne décide pas', src: 'cvl_bo' },
      { v: 'le rectorat fixe, le CA répartit', l: 'les heures d’enseignement d’un lycée (la dotation horaire) sont attribuées par l’académie ; le conseil d’administration en vote la répartition entre classes et options. S’il la refuse deux fois, le proviseur décide seul', src: 'dhg_qe' },
      { v: '3 élèves', l: 'siègent au conseil de discipline d’un lycée, élus par les délégués de classe', src: 'discipline_eduscol' },
      { v: '10 heures', l: 'de vie de classe par an sont prévues à l’emploi du temps depuis 2002. Leur tenue réelle dépend de chaque professeur principal', src: 'hvc_snes' },
      { v: '771 €', l: 'par lycée en moyenne : le fonds de vie lycéenne voté par les conseils d’administration pour les projets des élèves, de 0 à 64 158 € selon l’établissement (enquête nationale, vers 2016)', src: 'fvl_enquete' },
      { v: 'la région', l: 'possède les bâtiments, paie la cantine, l’internat, les agents d’entretien et les ordinateurs. Le ministre, lui, paie les professeurs, fixe les programmes et les examens, et nomme le proviseur', src: 'regions_lycees' },
      { v: '28 450', l: 'saisines de la médiatrice de l’Éducation nationale en 2025, en hausse de 57 % en cinq ans : la voie de recours quand l’établissement ne répond pas, encore peu connue des élèves', src: 'mediatrice25' },
    ],
    aRetenir: 'Un lycée est gouverné à trois : l’État pour les personnels et les programmes, la région pour les murs et les repas, le conseil d’administration pour l’organisation. Les élèves ont des sièges partout, et presque nulle part la majorité. C’est là que se joue une partie de ce que les lycéens appellent « personne ne nous écoute ».',
  },
  {
    cle: 'lyceens',
    titre: 'L’automne 2026 des lycéens',
    resume: 'Ce que les lycéens ont demandé, ce qu’on leur a répondu, et ce dont vous héritez.',
    chiffres: [
      { v: '891 lycées', l: 'ont eu leurs cours suspendus, totalement ou partiellement, le 6 octobre 2026, sur 3 700 ; 256 000 manifestants selon l’Intérieur, 450 000 selon les organisateurs', src: 'mobilisation26' },
      { v: '76 500', l: 'contributions à la consultation nationale ouverte du 5 au 23 octobre 2026 : 71 % évoquent le temps scolaire, 51 % les bâtiments, 28,5 % les professeurs absents, 24 % les effectifs, 14,5 % Parcoursup', src: 'consult26' },
      { v: '5 chantiers', l: 'ouverts par le Premier ministre le 4 octobre 2026 : remplacement, bâti (compétence des régions), emplois du temps, Parcoursup, démocratie lycéenne. Décisions annoncées pour la fin du mois', src: 'chantiers26' },
      { v: '10 mesures', l: 'd’urgence des organisations lycéennes et étudiantes : rénovation du bâti, recrutements, rythmes, fin de la sélection via Parcoursup avec 250 000 places, démocratie lycéenne, bourses, repas à 1 €, logement, fin de la répression', src: 'dix_mesures' },
      { v: '53 %', l: 'des collèges et lycées publics manquaient d’au moins un professeur à la rentrée 2026 selon le SNES-FSU ; le ministère parle de volumes d’heures, pas de postes entiers', src: 'snes_rentree26' },
      { v: '3 000', l: 'professeurs titulaires remplaçants affectés en urgence en octobre 2026 ; les lycées « en grande difficulté » passent de 114 à 47 en une semaine', src: 'remplacants26' },
      { v: '1 224 h', l: 'de cours par an à 15 ans en France, contre 962 h en moyenne dans l’Union européenne', src: 'ocde_temps' },
      { v: '126 632', l: 'candidats sans proposition à l’issue de la phase principale de Parcoursup 2026 (17,4 %), 5,5 points de plus qu’en 2025', src: 'parcoursup26' },
      { v: '6,8 Md€', l: 'dépensés par les régions pour le second degré en 2025, dont 2,5 Md€ d’investissement : ce sont elles qui possèdent les lycées, pas le ministre', src: 'regions_lycees' },
      { v: '−1 588 postes', l: 'd’enseignants au budget 2027 (dont 836 dans le second degré public), pour +1,2 Md€ de crédits : c’est le budget que vous héritez', src: 'plf27' },
      { v: '62 %', l: 'des Français jugeaient la mobilisation lycéenne justifiée début octobre 2026', src: 'odoxa26' },
    ],
    aRetenir: 'Le mouvement de 2026 a été le plus large depuis 2005, et il a obtenu des promesses datées plutôt que des moyens. C’est ce qu’un ministre hérite le plus souvent : non pas une crise, mais la facture d’une crise que d’autres ont apaisée avec sa signature.',
  },
  {
    cle: 'territoires',
    titre: 'Mon lycée, mon département',
    resume: 'Ce que coûte un lycéen, qui paie, et pourquoi ce n’est pas pareil partout.',
    chiffres: [
      { v: '11 660 €', l: 'par an et par élève du second degré en 2024 : trois ans de lycée coûtent de l’ordre de 35 000 € à la collectivité, une classe de trente environ 350 000 € par an', src: 'insee_die2024' },
      { v: 'un quart', l: 'de ce coût est payé par la région (murs, cantine, internat, agents, ordinateurs) : 6,8 Md€ en 2025, soit 3 000 à 3 900 € par lycéen. L’État paie le reste, d’abord les professeurs', src: 'ofgl_regions' },
      { v: '+24 %', l: 'par rapport à la moyenne de l’OCDE pour un élève de lycée (18 127 dollars contre 14 562), mais −13 % pour un élève de primaire : la France dépense beaucoup en haut, peu en bas', src: 'ocde_rse2025' },
      { v: '885 à 1 978 €', l: 'par lycéen et par an d’investissement selon la région, des Hauts-de-France à la Bretagne, Île-de-France en queue : du simple au double, sur le quart régional du coût', src: 'gazette_invest' },
      { v: '405 à 3 884 €', l: 'par lycéen du privé en huit ans : ce que les régions choisissent de donner aux lycées privés, de l’Île-de-France aux Pays de la Loire', src: 'gazette_prive' },
      { v: 'non publiée', l: 'la dépense de l’État par élève et par territoire. On sait seulement qu’à Paris les professeurs sont plus âgés, plus souvent agrégés et moins souvent contractuels, et qu’à Créteil et Versailles leurs effectifs n’ont pas suivi les élèves depuis 2005', src: 'ipp_territoires' },
      { v: '71 à 129', l: 'l’indice de position sociale moyen des lycées selon le département (Mayotte, Paris), 109 en moyenne, et de 59 à 162 selon le lycée. Celui de chaque lycée est en données ouvertes', src: 'depp_ips_lycees' },
      { v: '9 700 à 14 200 €', l: 'par élève de Gymnasium selon le Land allemand ; 10 203 à 30 012 dollars selon l’État américain : dans les pays fédéraux, l’écart porte sur tout le coût, en France sur la part régionale', src: 'bmbf_laender' },
      { v: 'Madrid', l: 'dépense le moins par élève des régions espagnoles et réussit parmi les mieux à PISA ; le Mezzogiorno dépense plus par habitant et réussit moins : l’argent compte, mais pas tout seul', src: 'elcano_pisa' },
      { v: 'nulle part', l: 'les heures de cours perdues et la dépense par élève de chaque lycée. L’Australie, l’Angleterre et les États-Unis publient la seconde pour chaque école', src: 'acara_myschool' },
    ],
    aRetenir: 'Un lycéen coûte à peu près la même chose partout en France, parce que l’État paie les professeurs partout. Ce qui change d’une région à l’autre, c’est le quart régional : les murs, la cantine, les travaux, du simple au double. Et ce qui change d’un lycée à l’autre, qui enseigne et combien d’heures sont vraiment faites, personne ne le publie.',
  },
  {
    cle: 'agir',
    titre: 'Le mode d’emploi du lycéen',
    resume: 'Sept choses qu’un élève peut faire, dans l’ordre où elles servent.',
    chiffres: [
      { v: '1. Lire', l: 'l’IPS de son lycée et sa valeur ajoutée au bac : ils sont publics, lycée par lycée. En dix minutes on sait si son lycée fait mieux ou moins bien que ce que son public laissait attendre. Ce chiffre vaut plus que les palmarès des magazines', src: 'ods_ips' },
      { v: '2. Demander', l: 'au conseil de la vie lycéenne les deux chiffres que personne ne publie : les heures de cours perdues cette année dans l’établissement (le proviseur les a) et la dotation de fonctionnement reçue de la région (le conseil d’administration la vote)', src: 'letudiant_heures' },
      { v: '3. Viser les deux moments', l: 'où quelque chose se décide : à l’automne, le conseil régional vote la dotation de chaque lycée ; en janvier, le rectorat attribue les heures d’enseignement, et en février ou mars le conseil d’administration vote leur répartition. Les élus élèves y siègent', src: 'dhg_qe' },
      { v: '4. Le budget participatif', l: 'quand la région en a un (Occitanie depuis 2017, Bretagne, Centre-Val de Loire) : jusqu’à 10 000 € sur un vote des élèves. Quand elle n’en a pas, c’est une demande simple à porter au conseil régional', src: 'occitanie_bp' },
      { v: '5. L’enquête de climat scolaire', l: 'locale (ELCS) : chaque lycée peut la passer et comparer ses résultats au national. Un résultat chiffré est un argument plus fort qu’une pétition', src: 'eduscol_elcs' },
      { v: '6. Les élections du CVL', l: 'réunissent moins d’un électeur sur deux au niveau national. Une liste qui fait campagne sur deux chiffres et trois demandes datées change le rapport de force sans bloquer quoi que ce soit', src: 'orleans_cvl' },
      { v: '7. La médiatrice', l: 'de l’Éducation nationale : 28 450 saisines en 2025, 78 % de succès au moins partiel, et presque aucun élève ne la saisit. C’est le recours quand l’établissement ne répond pas', src: 'mediatrice25' },
    ],
    aRetenir: 'Les murs, c’est la région ; les professeurs, c’est l’État ; l’organisation, c’est le conseil d’administration. Un lycéen qui sait lequel des trois décide de ce qu’il demande a déjà gagné la moitié de la discussion. Ce que ni lui ni le ministre ne peuvent faire seuls : obliger à publier les chiffres par lycée, donner un vote aux élèves, compenser les écarts entre territoires.',
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

/* ---------------------------------------------------------------------------
   TRAJECTOIRE DES EFFECTIFS D'ÉLÈVES, constaté puis projeté
   ---------------------------------------------------------------------------
   Millions d'élèves, public et privé sous contrat, premier et second degrés.
   Les rentrées 2027 à 2031 sont celles que le joueur arbitre. Les valeurs
   suivent la trajectoire DEPP du scénario de référence, calée sur ses deux
   points publiés : la rentrée 2026 et l'horizon 2035 (−1 676 800 élèves).
   ------------------------------------------------------------------------- */
export const SERIE_ELEVES = [
  { annee: 2024, m: 11.88, constate: true },
  { annee: 2025, m: 11.77, constate: true },   /* rentrée 2025 : −106 000 élèves */
  { annee: 2026, m: 11.61, constate: true },   /* rentrée 2026 : −161 000 élèves */
  { annee: 2027, m: 11.45 },
  { annee: 2028, m: 11.28 },
  { annee: 2029, m: 11.10 },
  { annee: 2030, m: 10.92 },
  { annee: 2031, m: 10.75 },
  { annee: 2033, m: 10.34 },
  { annee: 2035, m: 9.93 },   /* 11,61 − 1,6768 : cale la courbe sur le chiffre publié */
];

/* ---------------------------------------------------------------------------
   PISA. MATHÉMATIQUES, ÉLÈVES DE 15 ANS, FRANCE
   ---------------------------------------------------------------------------
   L'échelle de mathématiques est ancrée sur 2003, année où la discipline était
   le domaine majeur de l'enquête : la série commence donc là. La chute de 2022
   est la plus forte mesurée en France depuis la création de PISA.
   ------------------------------------------------------------------------- */
export const SERIE_PISA_MATHS = [
  { annee: 2003, score: 511 },
  { annee: 2006, score: 496 },
  { annee: 2009, score: 497 },
  { annee: 2012, score: 495 },
  { annee: 2015, score: 493 },
  { annee: 2018, score: 495 },
  { annee: 2022, score: 474, chute: true },
];

/* ---------------------------------------------------------------------------
   LA NOTE DE CADRAGE DE LA DGESCO, version courte, remise avant la première
   décision. Règle : un graphique et TROIS chiffres par page, pas davantage.
   Le détail complet reste dans l'onglet « Comprendre le jeu ».
   ------------------------------------------------------------------------- */
export const CADRAGE_INITIAL = [
  {
    cle: 'lyceens',
    titre: 'Où vous mettez les pieds : l’automne 2026 des lycéens',
    accroche: { v: '891 lycées', l: 'ont eu leurs cours suspendus le même jour, le 6 octobre 2026, sur 3 700. Votre prédécesseur a promis, puis démissionné. Les promesses restent, et les blocus aussi.', src: 'mobilisation26' },
    sousAccroche: { v: '76 500', l: 'lycéens ont écrit au gouvernement ce qui n’allait pas. Ils attendent votre réponse', src: 'consult26' },
    graphique: 'consultation',
    chiffres: [
      { v: '5 promesses', l: 'un professeur devant chaque classe « à la Toussaint », des travaux « avant l’été 2027 », des règles de Parcoursup lisibles, des emplois du temps revus, une place pour les élèves dans les décisions : les cinq chantiers du 4 octobre 2026', src: 'chantiers26' },
      { v: '10 milliards', l: 'ce que les organisations lycéennes demandent pour les lycées. Le budget 2027 ajoute 1,2 milliard à toute l’Éducation nationale, et supprime 1 588 postes', src: 'dix_mesures' },
    ],
    aRetenir: 'Vous n’avez pas bloqué les lycées. Vous êtes la personne à qui l’on demandera, dès demain matin, pourquoi ils le sont encore.',
  },
  {
    cle: 'budget',
    titre: 'Un budget contraint',
    accroche: { v: '65,3 Md€', l: 'C’est le budget de l’Éducation nationale en 2027, hors pensions, le premier budget de l’État. Il augmente, un peu, et il est presque entièrement pré-engagé.', src: 'plafonds27' },
    /* Le chiffre qui commande tous les autres se lit sous le total, pas dans
       une liste sous le graphique où personne ne le voyait. La hausse de
       +0,8 Md€, elle, est écrite sur la colonne 2027 du graphique. */
    sousAccroche: { v: '93 %', l: 'du total, c’est de la masse salariale : ce que vous ne pouvez pas arbitrer dans l’année', src: 'cc_neb24' },
    graphique: 'budget',
    chiffres: [],
    aRetenir: 'Tout votre mandat se joue dans le liséré qui reste.',
  },
  {
    cle: 'demographie',
    titre: 'Une baisse démographique',
    accroche: { v: '−1 676 800', l: 'C’est le nombre d’élèves que le système éducatif aura perdus d’ici 2035, soit 14,2 % de sa population scolaire.', src: 'depp_proj35' },
    graphique: 'eleves',
    chiffres: [
      { v: '≈ 6 600', l: 'postes que la démographie « libère » chaque rentrée, à raison d’un poste pour vingt-quatre élèves. C’est vous qui décidez à qui ils vont', src: 'depp_proj35' },
      { v: '4 % ou 60 %', l: 'les deux précédents récents de restitution à Bercy, rentrée 2025, puis rentrée 2026. Le même chiffre démographique, deux pays différents', src: 'senat_plf26' },
    ],
    aRetenir: 'Rendre ces postes ou les réinvestir : c’est l’arbitrage de janvier, chaque année.',
  },
  {
    cle: 'niveaux',
    titre: 'Des résultats préoccupants',
    accroche: { v: '−21 points', l: 'C’est ce que les élèves français de 15 ans ont perdu en mathématiques entre 2018 et 2022. La plus forte baisse mesurée en France depuis la création de l’enquête PISA.', src: 'pisa22' },
    graphique: 'niveaux',
    chiffres: [
      { v: '484 contre 524', l: 'le score des CM1 français en mathématiques face à la moyenne de l’Union européenne (TIMSS 2023). Stable depuis 2019, mais loin', src: 'timss23' },
      { v: '1 jeune sur 4', l: 'a des difficultés prononcées en lecture à 17-18 ans, aux tests de la Journée défense et citoyenneté', src: 'hcsp26' },
    ],
    aRetenir: 'Un élève de PISA 2027 est entré au CP en 2018 : vous répondrez de ce que vous n’avez pas fait.',
  },
];

/* Comparaisons du petit graphique « niveaux » : France face à sa référence. */
export const COMPARAISONS_NIVEAUX = [
  { libelle: 'Mathématiques, CM1', fr: 484, ref: 524, refNom: 'moyenne UE', src: 'timss23' },
  { libelle: 'Mathématiques, 15 ans', fr: 474, ref: 472, refNom: 'moyenne OCDE', src: 'pisa22' },
  { libelle: 'Compréhension de l’écrit, CM1', fr: 514, ref: 527, refNom: 'moyenne UE', src: 'pirls21' },
];

export const PAR_CLE = Object.fromEntries(REPERES.map((r) => [r.cle, r]));
