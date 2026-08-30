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
    preuve: 'La formation continue est l’intervention au meilleur rendement documenté du répertoire : l’Education Endowment Foundation classe le feedback et la métacognition — cœur des formations efficaces — à +6 et +7/8 mois de progrès par an, au plus haut niveau de preuve (plus de 90 études). Condition : des formations longues, disciplinaires et suivies. La France est classée dernière des 48 pays de l’enquête TALIS 2024 pour la formation continue de ses enseignants : la marge de progression est maximale.',
    ideeRecue: '« Former les profs, on le fait déjà. » En volume réel, un enseignant français reçoit parmi les plus faibles quantités de formation continue du monde développé — et souvent hors de sa discipline.',
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
    preuve: 'La note n° 15 du Conseil scientifique de l’éducation nationale (Gurgand) synthétise des décennies d’études : effet moyen négatif sur les trajectoires, décrochage accru, coût d’environ une année de scolarité (9 à 11 k€ par élève). L’« effet de menace » — l’idée que la peur de redoubler ferait travailler — n’a jamais été démontré.',
    ideeRecue: '« Le redoublement, c’était mieux avant. » Les pays qui font le plus redoubler ne réussissent pas mieux ; à profil égal, l’élève qui redouble progresse moins que celui qui passe avec accompagnement. C’est l’une des idées les plus étudiées — et les plus tenaces — du débat éducatif.',
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
    preuve: 'Les salaires effectifs des enseignants français sont inférieurs de 26 % (élémentaire) et 18 % (collège) à ceux des autres diplômés du supérieur (OCDE 2025) ; un certifié débutant est passé de 2 SMIC en 1980 à 1,08 SMIC en 2025. Le point décisif est la cible : les revalorisations de 2023 ont ciblé les débuts de carrière ; le milieu de carrière, lui, a décroché de 14 points par rapport à l’OCDE en dix ans — c’est là que se joue l’usure du corps.',
    ideeRecue: '« Augmenter tout le monde pareil, c’est plus juste. » Le saupoudrage est l’option la mieux acceptée et la moins efficace : diluée sur 814 927 équivalents temps plein, la même somme ne change ni l’attractivité ni les démissions.',
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
    preuve: 'Évaluation DEPP 2021 sur 15 000 élèves et 408 écoles : +8 % d’écart-type en français et +13 % en maths en fin de CP, avec un effet concentré sur les élèves en grande difficulté — et un bénéfice limité, voire nul, pour les meilleurs. La littérature internationale (expérience STAR, travaux Piketty-Valdenaire) confirme : réduire la taille des classes agit surtout aux âges précoces et pour les élèves défavorisés.',
    ideeRecue: '« Moins d’élèves par classe, ça marche pour tout le monde. » L’effet moyen est modeste : c’est un levier d’égalité bien plus qu’un levier de niveau général. La même carte bouge fort le compteur Inégalités, peu le compteur Réussite.',
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
    preuve: 'L’effet de la taille des classes est réel mais coûteux et inégalement réparti : 20 à 30 % d’écart-type dans les études de référence, porté par les élèves défavorisés et les premières années. Passer de 21,3 à 19 élèves par classe en moyenne, c’est créer environ 60 000 divisions — un ordre de grandeur de 78 000 postes si l’on recrute.',
    ideeRecue: '« C’est LA mesure. » C’est une mesure dont l’effet par euro est parmi les plus faibles du répertoire pour les élèves moyens — et parmi les plus forts pour les plus fragiles. Tout dépend de qui, et de comment on la finance.',
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
    preuve: '146 000 accompagnants pour 520 600 élèves en situation de handicap scolarisés en milieu ordinaire (trois fois plus qu’au début des années 2000), avec des notifications MDPH en hausse de 10 % par an. La fonctionnarisation est chiffrée à 4,3 Md€ ; le rapport IGÉSR-IGAS la rejette et propose +10 % via une grille de catégorie B. Le fond du problème : le temps incomplet est structurel tant que l’accompagnement s’arrête aux heures de classe.',
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
    preuve: 'Environ 900 médecins scolaires pour 12 millions d’élèves, plus d’un tiers des postes vacants (Cour des comptes) ; 20 % seulement des visites médicales de la sixième année réalisées ; 41 postes de psychologues sur 147 non pourvus au concours 2025. La leçon du PLF 2026 (+300 postes votés, pourvus en partie seulement) : un budget voté n’est pas une politique faite quand le vivier professionnel n’existe pas.',
    ideeRecue: '« Il suffit de créer des postes. » Créer un poste et le pourvoir sont deux choses différentes : quand toute une profession manque de praticiens, l’argent seul n’ouvre pas de cabinet médical dans un collège.',
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
    preuve: 'Pologne, 1999 : le report d’un an du palier d’orientation, dans une réforme d’ensemble, est identifié par la recherche comme un facteur décisif de la progression spectaculaire du pays dans PISA — portée par les élèves les plus faibles. L’orientation précoce est, dans les comparaisons internationales, l’un des principaux canaux de la reproduction sociale.',
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
    preuve: 'La littérature internationale sur les regroupements durables par niveau est convergente : effet moyen proche de zéro sur l’ensemble, effet négatif sur les élèves faibles regroupés entre eux (perte de l’entraînement par les pairs, baisse des attentes des adultes). Le précédent français est éloquent : l’obligation des groupes de niveau a été appliquée dans moins de 20 % des établissements, censurée partiellement par le Conseil d’État, puis abandonnée en 2026 — l’IGÉSR a parlé de « dérive des continents » entre le texte et le terrain.',
    ideeRecue: '« Regrouper les faibles ensemble permet de mieux s’occuper d’eux. » C’est l’intuition la plus répandue et la mieux réfutée : l’effet de composition joue contre eux, sauf regroupements courts, ciblés et réversibles.',
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
    preuve: 'Les comparaisons internationales sont contradictoires : l’autonomie améliore les résultats dans les systèmes dotés d’un encadrement fort, les dégrade ailleurs. Sur la publication des résultats par établissement, le constat est plus net : elle alimente l’évitement scolaire et la ségrégation sans gain d’apprentissage démontré. C’est la carte à la variance maximale du jeu : preuve faible, deux cadenas.',
    ideeRecue: '« La transparence ne peut pas faire de mal. » Publier des résultats bruts revient surtout à classer les publics : un palmarès d’établissements est d’abord un palmarès de quartiers.',
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
    preuve: 'L’indice de position sociale médian des collèges privés sous contrat est de 117,4 contre 99,9 dans le public, et l’écart grandit ; la part d’élèves très favorisés dans le privé est passée de 26,4 % en 2000 à 40,2 % en 2021, pour un financement public d’environ 73 à 75 %. Conditionner ce financement est le levier structurel le plus puissant sur la ségrégation — et le plus explosif : en 1984, la loi Savary a mis un million de personnes dans la rue et fait tomber le gouvernement.',
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
    preuve: '9,8 % des heures d’enseignement du second degré n’ont pas été assurées en 2024-2025 (DEPP), dont 7,5 points de non-remplacement — environ deux heures perdues par élève et par semaine, en hausse de 0,7 point par an. Ramener ce taux à 5 % rendrait aux élèves plus d’heures que 4 000 postes n’en apportent. Le verrou n’est pas budgétaire : il est statutaire (l’organisation du remplacement de courte durée).',
    ideeRecue: '« Il manque des profs, donc il faut recruter. » Le gisement le plus rapide n’est pas le recrutement : c’est l’organisation du remplacement — à condition d’accepter d’ouvrir le dossier du statut, ce qu’aucune intersyndicale n’accueille avec des fleurs.',
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
    preuve: 'Les travaux d’économie de l’éducation (à la suite de Heckman) convergent : le rendement de l’euro public investi est maximal aux âges précoces, surtout pour les enfants défavorisés. Les écarts de vocabulaire entre milieux sociaux sont déjà installés à 4 ans ; c’est en maternelle qu’ils se réduisent le mieux — et c’est l’investissement le moins visible politiquement, puisque ses effets arrivent après le mandat.',
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
    preuve: 'La difficulté sociale est continue ; le label éducation prioritaire est binaire. Résultat documenté par la Cour des comptes et la DEPP : des établissements au public très défavorisé restent hors du dispositif, d’autres y demeurent alors que leur situation a changé. Une allocation progressive sur l’indice de position sociale supprime l’effet de seuil — et les rentes de situation, ce qui explique sa difficulté politique.',
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
    preuve: 'Le recours aux contractuels s’est banalisé, avec des recrutements parfois expédiés en quelques jours et sans formation. Les stabiliser et les former améliore la continuité pédagogique à coût modéré — c’est une reconnaissance de l’existant plus qu’une création de moyens.',
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
    preuve: 'Le facteur le mieux établi du climat scolaire n’est ni le discours ni le règlement : c’est la densité et la stabilité des adultes présents. Les études sur les violences scolaires convergent sur ce point ; en France, la précarité des contrats d’assistants d’éducation produit une rotation qui défait chaque année ce que l’année précédente a construit.',
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
    preuve: 'Une heure supplémentaire annuelle coûte environ un cinquantième d’un poste : c’est l’instrument de gestion le plus rentable à court terme, utilisé par tous les gouvernements. Son coût différé est documenté par les enquêtes de conditions de travail : intensification, épuisement, démissions — le rabot d’aujourd’hui se paie sur l’attractivité de demain.',
    ideeRecue: '« Les HS, tout le monde y gagne. » À dose modérée, oui. En usage structurel, c’est un emprunt sur la santé du corps enseignant, remboursable avec intérêts.',
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
    preuve: 'La formation initiale a été réformée à répétition (IUFM, ESPE, INSPÉ, position du concours déplacée plusieurs fois) : chaque transition casse une année de recrutement, le temps que les candidats s’adaptent. La réforme de 2026 (concours à bac+3) a fait bondir les inscriptions de 76,6 % — après un trou d’air. Les systèmes qui progressent (Estonie, Irlande, Singapour) ont tous investi massivement et durablement dans la formation de leurs enseignants.',
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
    preuve: 'Environ 76 000 jeunes sortent chaque année sans qualification. La recherche est unanime : le décrochage est un processus à signaux faibles (absences, notes, comportement) repérables des années avant la rupture, et le repérage précoce avec référent est la intervention la mieux évaluée — très loin devant les sanctions, dont les évaluations n’ont montré aucun effet durable.',
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
    preuve: 'Les indicateurs de santé mentale des adolescents se sont nettement dégradés depuis 2020. La médecine scolaire ne peut pas y répondre seule (900 médecins pour 12 millions d’élèves) : les conventions avec les maisons des adolescents et les agences régionales de santé mobilisent des professionnels qui existent, plutôt que d’attendre des recrutements impossibles.',
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
    preuve: 'L’État ne possède ni les écoles (communes), ni les collèges (départements), ni les lycées (régions) : il ne peut que co-financer et inciter. Le confort thermique a un effet documenté mais modeste sur les apprentissages ; l’effet principal d’un plan bâti est ailleurs — dans la relation avec les collectivités, qui paient 40 % de la dépense éducative sans participer aux décisions pédagogiques.',
    ideeRecue: '« Le ministre n’a qu’à rénover les écoles. » Il ne le peut pas : les murs ne sont pas à lui. Une annonce nationale sur le bâti est une annonce sur le budget des autres.',
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
    preuve: 'Le feedback aux enseignants est l’intervention la mieux documentée du répertoire EEF (plus haut niveau de preuve). Mais l’usage décide de tout : un même test peut servir au diagnostic (rendu aux équipes, accompagné) ou au classement (publié). Les systèmes qui ont publié les résultats bruts ont vu l’évitement scolaire augmenter sans gain d’apprentissage ; ceux qui ont outillé leurs équipes ont progressé.',
    ideeRecue: '« Évaluer, c’est fliquer. » / « Évaluer, c’est la transparence. » Les deux slogans ratent l’essentiel : un thermomètre ne soigne ni ne punit — tout dépend de qui lit la température, et pour quoi faire.',
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
    preuve: 'Aucun grand pays comparable n’a généralisé le chèque-éducation. Les expériences les plus proches (Chili des années 1980-2010, libre choix suédois) ont accru le tri social sans améliorer les résultats moyens — le Chili a fini par re-réguler. C’est la carte à la preuve la plus faible du jeu : un cadenas, variance maximale.',
    ideeRecue: '« La concurrence tirera tout le monde vers le haut. » C’est la prédiction ; les données disponibles montrent surtout un tri : les établissements choisissent autant que les familles.',
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
    preuve: 'Les résultats internationaux sont contradictoires et dépendent entièrement de la qualité de l’encadrement. Le risque documenté : un « marché » des mutations où les établissements attractifs captent les enseignants expérimentés, tandis que les établissements difficiles — déjà les plus jeunes en moyenne — recrutent ce qui reste.',
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
    preuve: 'La visibilité pluriannuelle est un levier peu coûteux et documenté : une commune n’investit pas dans une école menacée de fermeture, une équipe ne s’engage pas sur des moyens repris l’année suivante. Son ennemi naturel est l’annualité budgétaire, à laquelle Bercy tient comme à son bien le plus précieux — parce que c’est son bien le plus précieux.',
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
    preuve: 'La différenciation efficace, selon la recherche, est courte, ciblée et réversible : des regroupements de quelques semaines sur un besoin identifié, puis retour en classe entière. C’est la version que la Sgen-CFDT a arrachée en 2024-2026 contre les groupes de niveau permanents. Sa limite : elle exige de l’ingénierie d’emploi du temps et une vraie adhésion des équipes — elle ne se décrète pas.',
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
    preuve: 'Aucune étude ne démontre qu’un examen-barrage élève le niveau par « effet de menace » — c’est le même mécanisme non prouvé que pour le redoublement. Ce qui est documenté : les recalés d’un barrage décrochent davantage, et ils sont socialement très typés. La « prépa-seconde » française n’a pas d’équivalent évalué.',
    ideeRecue: '« Un examen exigeant tire tout le monde vers le haut. » L’exigence sans accompagnement trie ; elle n’élève pas. Les systèmes les plus exigeants qui réussissent (Japon, Estonie) sont aussi ceux qui laissent le moins d’élèves au bord du chemin.',
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
    preuve: 'L’expérimentation française de la tenue unique (2024-2026) n’a mesuré aucun effet significatif sur les acquis, le climat ou le harcèlement. La littérature internationale, essentiellement anglo-saxonne, est tout aussi décevante : les corrélations positives disparaissent quand on tient compte du profil des établissements volontaires.',
    ideeRecue: '« L’uniforme gomme les inégalités et restaure le cadre. » C’est l’exemple parfait de la mesure-vitrine : populaire, visible, photogénique — et sans effet mesuré. Les inégalités se voient aux chaussures, aux téléphones et aux vacances, pas au polo.',
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
    preuve: 'Un tiers des lycéens sont en voie professionnelle, qui concentre les élèves les plus défavorisés. Or une large part d’entre eux poursuit désormais en BTS — où le taux d’échec est massif faute de bases en français et en mathématiques. Renforcer les fondamentaux y a un double effet documenté : insertion ET poursuite d’études.',
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
    preuve: 'Le dispositif de suspension des allocations (loi Ciotti, 2010-2013) a été évalué puis abrogé : aucun effet durable sur l’assiduité, un effet net d’appauvrissement des familles déjà les plus fragiles, et une dégradation du lien école-famille — celui-là même dont dépend le raccrochage. Il reste soutenu par une majorité constante de l’opinion.',
    ideeRecue: '« Toucher au portefeuille, ça au moins ça marche. » C’est l’une des rares mesures éducatives testées en vraie grandeur EN France, DEUX fois — avec le même résultat nul. Le débat public l’ignore avec constance.',
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
    preuve: 'Le déplacement d’élèves très perturbateurs soulage la classe d’origine — c’est réel et immédiat. Sur les élèves déplacés, les données manquent, et ce qu’on sait des regroupements d’élèves en rupture joue contre : concentrer les difficultés dégrade les trajectoires (effet de composition, encore lui).',
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
    preuve: 'L’interdiction effective du téléphone (casiers, pochettes) montre des effets mesurés sur le climat de récréation, les incidents et l’attention — modestes mais réels, parmi les mieux établis des mesures « d’ordre ». Le point aveugle : l’intendance (achat, responsabilité, gestion) retombe sur les établissements et les collectivités.',
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
    preuve: 'Les programmes structurés de compétences psychosociales et de prévention du harcèlement (KiVa en Finlande et ses équivalents) comptent parmi les interventions les mieux évaluées d’Europe : réduction mesurée des violences entre élèves, effets durables. Deux conditions : des adultes formés, et de la durée. Sans elles, « l’heure d’empathie » devient une heure de vie de classe de plus.',
    ideeRecue: '« C’est l’école des bisous. » Les programmes moqués sous ce nom sont, avec la formation continue, ce que la recherche européenne a de mieux évalué en matière de climat scolaire. Le ridicule médiatique n’est pas un niveau de preuve.',
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
    preuve: 'Aucune évaluation n’existe : le « surveillant général » a disparu en 1970, remplacé par les CPE. Ce qui est documenté, c’est l’effet de la présence adulte stable — que le poste s’appelle surgé, AED ou CPE. Le reste est du costume. D’où un seul cadenas : l’effet tiré peut aller du négatif au double.',
    ideeRecue: '« De mon temps, avec les surgés, il y avait de l’ordre. » De votre temps, il y avait surtout deux fois moins d’élèves scolarisés au-delà de 16 ans. La nostalgie est un biais d’échantillonnage.',
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
    preuve: 'Les secteurs multi-collèges expérimentés à Paris depuis 2017 sont l’une des rares politiques de mixité évaluées en France : la mixité sociale progresse nettement, sans baisse mesurée des résultats des élèves favorisés. L’obstacle n’est pas technique : la sectorisation appartient aux départements, et la crainte — non vérifiée mais électoralement réelle — des familles favorisées.',
    ideeRecue: '« La mixité tire les bons élèves vers le bas. » C’est LA crainte qui bloque tout, et les évaluations disponibles, françaises comme internationales, ne la confirment pas : les élèves favorisés perdent peu ou rien, les défavorisés gagnent beaucoup.',
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
    preuve: 'La fermeture-redéploiement d’établissements très ségrégués n’a jamais été menée à l’échelle annoncée : l’effet dépend entièrement de la qualité des réaffectations (vers des établissements mixtes, avec accompagnement — ou vers le collège voisin tout aussi ségrégué). Deux cadenas : le principe est plausible, l’exécution est tout.',
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
    preuve: 'L’intégration du privé sous contrat à la carte scolaire est le levier le plus puissant du jeu sur la ségrégation — mécaniquement, puisque le privé concentre 40 % d’élèves très favorisés. C’est aussi le seul dont l’histoire a testé le coût politique en vraie grandeur : 1984, un million de manifestants, retrait de la loi Savary, chute du gouvernement Mauroy.',
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
    preuve: 'La « perte estivale » est massivement documentée : sur deux mois d’interruption, les élèves de milieux favorisés maintiennent voire progressent (livres, voyages, activités), les autres régressent — l’écart se creuse chaque été. Raccourcir ou zoner l’été est l’une des mesures d’égalité les mieux étayées… et la plus unanimement combattue : parents, enseignants, tourisme, tous alignés contre.',
    ideeRecue: '« Les vacances, c’est bon pour tous les enfants. » Pour les apprentissages, l’été français de huit semaines est surtout bon pour ceux dont il est rempli. C’est l’exemple type du sujet où la preuve et l’opinion vivent sur deux planètes.',
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
    preuve: 'L’esprit critique face aux médias et à l’IA s’enseigne, avec des effets mesurés (modestes, lents, réels) quand des heures y sont réellement dédiées et les enseignants formés. Le piège documenté : l’ajout au programme sans retrait équivalent — tout ajout est une soustraction ailleurs.',
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
    preuve: 'L’aide aux devoirs encadrée et le tutorat comptent parmi les interventions les mieux documentées du répertoire EEF (+5 mois pour le tutorat). Le mécanisme d’équité est limpide : le devoir à la maison mesure surtout l’aide disponible à la maison. Condition : un encadrement réel, pas une étude surveillée où l’on fait ses devoirs seul mais assis.',
    ideeRecue: '« Les devoirs, c’est aux parents de s’en occuper. » C’est exactement ainsi que l’école transforme les inégalités familiales en inégalités scolaires — chaque soir, gratuitement.',
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

/* --------------------------------------------------------------------------
   L'ÉTÉ DES CENT JOURS — dossiers de crise de la première année.
   Entre la nomination (juin 2027) et la première rentrée, le nouveau ministre
   est testé : deux crises tirées de ce vivier, à trancher dans l'instant.
   Effets volontairement modestes (c'est un apprentissage, pas un tournant) ;
   chaque option porte son décryptage — la leçon vaut plus que les points.
   -------------------------------------------------------------------------- */
export const DOSSIERS_ETE = [
  {
    id: 'canicule',
    titre: 'Canicule de juillet : des écoles à 40 °C',
    contexte: 'Une vague de chaleur précoce frappe le pays. Des centres de loisirs ferment, des vidéos de salles surchauffées circulent, et l’on vous demande, à vous qui êtes ministre depuis onze jours, « un plan national pour le bâti scolaire ».',
    options: [
      { titre: 'Annoncer un grand plan national de rénovation',
        effets: { parents: 5, capital: -6, adhesion: 0 },
        decryptage: 'L’annonce est superbe ; l’exécution appartient aux communes, départements et régions, propriétaires des murs. Vous venez de promettre le budget des autres — ils vous l’expliqueront à la rentrée, par communiqué.' },
      { titre: 'Proposer un fonds d’amorçage cofinancé avec les collectivités',
        effets: { parents: 2, capital: -1, collectivitesBonus: true },
        decryptage: 'La bonne maille juridique : l’État déclenche, le propriétaire décide. Moins spectaculaire au 20 h, réellement exécutable — c’est souvent le même arbitrage.' },
      { titre: 'Rappeler que le bâti relève des collectivités',
        effets: { parents: -5, capital: 2, adhesion: 0 },
        decryptage: 'Juridiquement exact, politiquement mortel. « Ce n’est pas moi » est la phrase la plus coûteuse du répertoire ministériel — surtout dite à des parents dont l’enfant a eu un malaise en classe.' },
    ],
  },
  {
    id: 'agression',
    titre: 'Fin août : un professeur agressé, la vidéo circule',
    contexte: 'À dix jours de la rentrée, un enseignant est agressé devant son établissement. La vidéo tourne en boucle. L’opposition dénonce, l’intersyndicale attend, et votre téléphone affiche quatorze demandes d’interview.',
    options: [
      { titre: 'Vous rendre sur place, immédiatement',
        effets: { adhesion: 4, parents: 2, capital: -2 },
        decryptage: 'La présence physique du ministre dit aux personnels « vous n’êtes pas seuls » — c’est le premier facteur du moral, avant tout dispositif. Elle vous expose aussi à être pris à partie en direct : c’est le prix.' },
      { titre: 'Annoncer un plan sécurité des établissements',
        effets: { parents: 4, adhesion: -3, capital: 1 },
        decryptage: 'Répondre à un fait divers par un plan national est le réflexe le plus courant et le moins efficace : les équipes reçoivent une circulaire de plus, la situation locale reste entière.' },
      { titre: 'Activer la protection fonctionnelle et laisser la justice faire',
        effets: { adhesion: 2, parents: -2, capital: 1 },
        decryptage: 'La protection fonctionnelle est un droit : l’administration doit assistance juridique à l’agent attaqué. Réponse exacte, sobre — et jugée « froide » par le débat public, qui préfère les plans.' },
    ],
  },
  {
    id: 'manuel',
    titre: 'Polémique d’août : une page de manuel sortie de son contexte',
    contexte: 'Un extrait de manuel scolaire circule sur les réseaux, tronqué. En six heures, la polémique atteint les matinales. On exige que « le ministre retire ce manuel » — que, détail, le ministère ne choisit pas.',
    options: [
      { titre: 'Demander publiquement le retrait du manuel',
        effets: { parents: 3, adhesion: -5, capital: 1 },
        decryptage: 'La polémique s’éteint en 24 heures. Le signal envoyé aux enseignants durera cinq ans : le ministère cède aux réseaux sociaux plutôt qu’il ne protège. Et le choix des manuels relève des équipes, pas de vous — vous venez d’en décider quand même.' },
      { titre: 'Rappeler la liberté pédagogique et soutenir les équipes',
        effets: { adhesion: 4, parents: -2, capital: -1 },
        decryptage: 'Trois jours de mauvaise presse contre un principe tenu. Les personnels retiennent qu’on ne les lâche pas sous pression : c’est exactement ce que mesure, à bas bruit, la jauge d’adhésion.' },
    ],
  },
  {
    id: 'interview',
    titre: 'L’interview de rentrée : choisir votre petite phrase',
    contexte: 'Grand entretien de pré-rentrée. Votre conseiller com’ est formel : « Il en restera UNE phrase. Choisissez-la, sinon ils la choisiront pour vous. »',
    options: [
      { titre: '« L’école doit renouer avec l’exigence. »',
        effets: { parents: 3, adhesion: -3, capital: 1 },
        decryptage: 'Les familles applaudissent, les salles des professeurs entendent « ils ne sont pas exigeants ». Toute petite phrase sur l’école est un message à deux destinataires — et l’un des deux la prend toujours pour lui.' },
      { titre: '« Je fais confiance aux enseignants. »',
        effets: { adhesion: 3, parents: 0, capital: -1 },
        decryptage: 'Sobre, peu repris, pas de titre. La confiance ne fait pas de « une » — c’est précisément pour ça qu’elle est rare : son rendement est réel mais différé, comme tout ce qui compte ici.' },
      { titre: '« Je me battrai pour chaque euro du budget. »',
        effets: { adhesion: 2, parents: 1, bercyMalus: true },
        decryptage: 'Bercy lit les interviews. Annoncer le rapport de force avant de l’avoir engagé, c’est payer le prix du conflit sans en avoir encore les gains — mais le message interne est entendu.' },
    ],
  },
];

export const PAR_ID = Object.fromEntries(CATALOGUE.map((c) => [c.id, c]));
