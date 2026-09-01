import { CADRAGE, POINTS_SALAIRE_PAR_MD } from './constantes.js';

/* ============================================================================
   RUE DE GRENELLE. CATALOGUE DES MESURES (phase moteur : 12 cartes-leçons)
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
    preuve: 'Attention au format : le HCSP (août 2026) rappelle que l’efficacité des dispositifs de formation continue est très variable selon leur intensité, leur contenu et leur ancrage dans la pratique. Ce qui marche est intensif, long, centré sur la pratique, et combine formation et accompagnement en classe. La formation continue est l’intervention au meilleur rendement documenté du répertoire : l’Education Endowment Foundation classe le feedback et la métacognition (cœur des formations efficaces) à +6 et +7/8 mois de progrès par an, au plus haut niveau de preuve (plus de 90 études). Condition : des formations longues, disciplinaires et suivies. La France est classée dernière des 48 pays de l’enquête TALIS 2024 pour la formation continue de ses enseignants : la marge de progression est maximale.',
    ideeRecue: '« Former les profs, on le fait déjà. » En volume réel, un enseignant français reçoit parmi les plus faibles quantités de formation continue du monde développé, et souvent hors de sa discipline.',
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
    preuve: 'La note n° 15 du Conseil scientifique de l’éducation nationale (Gurgand) synthétise des décennies d’études : effet moyen négatif sur les trajectoires, décrochage accru, coût d’environ une année de scolarité (9 à 11 k€ par élève). L’« effet de menace » (l’idée que la peur de redoubler ferait travailler) n’a jamais été démontré.',
    ideeRecue: '« Le redoublement, c’était mieux avant. » Les pays qui font le plus redoubler ne réussissent pas mieux ; à profil égal, l’élève qui redouble progresse moins que celui qui passe avec accompagnement. C’est l’une des idées les plus étudiées (et les plus tenaces) du débat éducatif.',
    mot: "Coûteux, contre-productif, et populaire. Le miroir exact de la formation continue : tout ce que le tableau de bord adore et que le bilan déteste.",
  },

  /* ------------------------------------------------------------------ 3 --- */
  {
    id: 'revalorisation',
    label: 'Revalorisation des enseignants',
    famille: 'moyens',
    porteurs: ['FSU (+20 % du point ≈ 10 Md€)', 'Parti socialiste (moyenne OCDE)', 'Gabriel Attal (+200 à +500 €/mois)', 'la droite parlementaire (+20 %/5 ans conditionnés)', 'HCSP (ciblage des pénuries)'],
    perimetre: 'ministeriel',
    cout: 1.3, coutETP: 0, pol: 7,        // montant par défaut ; le curseur décide
    once: false, reforme: false,          // répétable : une mesure salariale par budget
    parametrique: 'revalorisation',   // deux curseurs : cible × contrepartie
    vitrine: { parents: 0, enseignants: +6, presse: +2, compteurs: { budget: +5 } },
    reel: [],   // construits par le moteur selon les curseurs
    physique: {},
    preuve: 'Le Haut-commissariat à la Stratégie et au Plan (août 2026) pose le problème en deux lignes : avec 367 000 enseignants dans le premier degré et 485 000 dans le second, toute revalorisation générale coûte très cher, à moins de rester modérée, et donc sans effet sur l’attractivité. Sa recommandation est de cibler les affectations et les missions où la pénurie est la plus criante. Pour mémoire, la revalorisation des débuts de carrière de 2023 a coûté 2 Md€ par an en année pleine. Les salaires effectifs des enseignants français sont inférieurs de 26 % (élémentaire) et 18 % (collège) à ceux des autres diplômés du supérieur (OCDE 2025) ; un certifié débutant est passé de 2 SMIC en 1980 à 1,08 SMIC en 2025. Le point décisif est la cible : les revalorisations de 2023 ont ciblé les débuts de carrière ; le milieu de carrière, lui, a décroché de 14 points par rapport à l’OCDE en dix ans, c’est là que se joue l’usure du corps.',
    ideeRecue: '« Augmenter tout le monde pareil, c’est plus juste. » Le saupoudrage est l’option la mieux acceptée et la moins efficace : diluée sur 814 927 équivalents temps plein, la même somme ne change ni l’attractivité ni les démissions.',
    mot: "Trois façons de dépenser exactement la même somme, et trois pays différents à l'arrivée.",
  },

  /* ------------------------------------------------------------------ 4 --- */
  {
    id: 'dedoublement',
    label: 'Extension du dédoublement aux GS/CP/CE1 hors éducation prioritaire',
    famille: 'moyens',
    porteurs: ['prolongement de la politique engagée en 2017', 'Institut des politiques publiques', 'la gauche parlementaire', 'HCSP (recommandation 3, ciblée)'],
    perimetre: 'ministeriel',
    cout: 0.42, coutETP: 5200, pol: 5,
    theme: 'taille_classe', once: true, excl: 'encadrement', reforme: true,
    vitrine: { parents: +5, enseignants: +3, presse: +4, compteurs: { egalite: +5 } },
    reel: [
      { compteur: 'egalite',  central: 5, delai: 4, cadenas: 3, source: 'DEPP 2021 : +8 % d’écart-type en français, +13 % en maths en fin de CP, mais l’avantage n’est plus visible à l’entrée en sixième (HCSP 2026)' },
      { compteur: 'reussite', central: 1, delai: 4, cadenas: 3, source: 'DEPP 2021 : bénéfice limité voire nul pour les meilleurs élèves ; effets de long terme non confirmés' },
    ],
    physique: {},
    preuve: 'Évaluation DEPP 2021 sur 15 000 élèves et 408 écoles : +8 % d’écart-type en français et +13 % en maths en fin de CP, effet concentré sur les élèves en grande difficulté. Mais le suivi de long terme change la conclusion : selon le Haut-commissariat à la Stratégie et au Plan (août 2026), les bénéfices observés de la fin du CP à la fin du CE1 n’apparaissent plus à l’entrée en sixième. La prudence s’impose dans les deux sens, cette première cohorte n’avait pas bénéficié du dédoublement en grande section.',
    ideeRecue: '« Le dédoublement, c’est prouvé, ça marche. » C’est prouvé à court terme, et démenti à moyen terme par le suivi de la première cohorte. Le rapport du HCSP en tire une recommandation explicite : ne pas tout miser sur la taille des classes, et cibler précisément, d’autant que la faiblesse des acquis touche tous les profils d’élèves, pas seulement les plus fragiles.',
    mot: "La mesure la plus évaluée du répertoire français. C'est aussi la seule dont l'évaluation, en grandissant, a retiré une partie de ce qu'elle avait promis.",
  },

  /* ------------------------------------------------------------------ 5 --- */
  {
    id: 'classe19',
    label: 'Plafond général de 19 élèves par classe',
    famille: 'moyens',
    porteurs: ['La France insoumise (≤ 19 par classe)', 'Parti socialiste', 'Institut des politiques publiques (version ciblée)'],
    perimetre: 'ministeriel',
    cout: 0, coutETP: 0, pol: 11,          // dépend du financement choisi
    theme: 'taille_classe', once: true, excl: 'encadrement', reforme: true,
    parametrique: 'financement19',          // recrutement (Bercy) ou démographie (syndicats)
    vitrine: { parents: +8, enseignants: +6, presse: +5, compteurs: { egalite: +5, sante: +4 } },
    reel: [
      { compteur: 'reussite', central: 4, delai: 5, cadenas: 3, source: 'STAR / Piketty-Valdenaire : 20-30 % d’écart-type, effet concentré sur les défavorisés' },
      { compteur: 'egalite',  central: 5, delai: 5, cadenas: 3, source: 'idem, l’effet de taille de classe est très inégalement réparti' },
    ],
    physique: {},
    preuve: 'L’effet de la taille des classes est réel mais coûteux et inégalement réparti : 20 à 30 % d’écart-type dans les études de référence, porté par les élèves défavorisés et les premières années. Passer de 21,3 à 19 élèves par classe en moyenne, c’est créer environ 60 000 divisions, un ordre de grandeur de 78 000 postes si l’on recrute.',
    ideeRecue: '« C’est LA mesure. » C’est une mesure dont l’effet par euro est parmi les plus faibles du répertoire pour les élèves moyens, et parmi les plus forts pour les plus fragiles. Tout dépend de qui, et de comment on la finance.',
    mot: "La même vitrine que le dédoublement, pour dix fois le prix. Reste à savoir qui paie : Bercy, ou la carte scolaire.",
  },

  /* ------------------------------------------------------------------ 6 --- */
  {
    id: 'aesh',
    label: 'Création d’un corps de fonctionnaires AESH',
    famille: 'moyens',
    porteurs: ['collectifs d’AESH', 'Défenseur des droits', 'associations de familles (Unapei, APF France handicap)', 'la gauche parlementaire'],
    contre: ['rapport IGÉSR-IGAS : rejette la fonctionnarisation, propose +10 % via une grille type catégorie B'],
    perimetre: 'matignon',                  // législatif, rejeté au Sénat le 07/01/2026
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
      { compteur: 'egalite',  central: 7, delai: 6, cadenas: 3, source: 'idem, l’orientation précoce est le principal canal de reproduction sociale' },
    ],
    physique: {},
    greve: { intensite: 2, theme: 'pedagogie', segment: 'lp' },
    preuve: 'C’est la mesure dont la comparaison internationale documente le mieux l’effet. La Pologne a reporté d’un an son premier palier d’orientation en 1999 ; sa progression à PISA a été portée surtout par les élèves les plus faibles, et le report du palier est identifié comme le facteur crucial. En 2000, 23 % des élèves polonais étaient sous le niveau 2 en compréhension de l’écrit. Le mécanisme est simple : plus l’orientation est précoce, plus elle enregistre l’origine sociale au lieu des aptitudes.',
    mot: "Six ans de délai, aucune photo à la clé, et la voie professionnelle qui se sent visée. Un pari de ministre qui a lu les études plutôt que les sondages.",
  },

  /* ------------------------------------------------------------------ 9 --- */
  {
    id: 'differenciation',
    label: 'Différenciation précoce : groupes de niveau, certificat d’entrée en 6e, parcours dès la 4e',
    famille: 'parcours',
    porteurs: ['Gabriel Attal (« choc des savoirs »)', 'la droite parlementaire', 'Reconquête (fin du collège unique)', 'Rassemblement national (collège modulaire)'],
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
    preuve: 'La littérature internationale sur les regroupements durables par niveau est convergente : effet moyen proche de zéro sur l’ensemble, effet négatif sur les élèves faibles regroupés entre eux (perte de l’entraînement par les pairs, baisse des attentes des adultes). Le précédent français est éloquent : l’obligation des groupes de niveau a été appliquée dans moins de 20 % des établissements, censurée partiellement par le Conseil d’État, puis abandonnée en 2026, l’IGÉSR a parlé de « dérive des continents » entre le texte et le terrain.',
    ideeRecue: '« Regrouper les faibles ensemble permet de mieux s’occuper d’eux. » C’est l’intuition la plus répandue et la mieux réfutée : l’effet de composition joue contre eux, sauf regroupements courts, ciblés et réversibles.',
    mot: "Première tentative : appliqué dans moins de 20 % des établissements, puis censuré au Conseil d'État et abandonné en 2026. Vous voulez vraiment recommencer ?",
  },

  /* ----------------------------------------------------------------- 10 --- */
  {
    id: 'autonomie',
    label: 'Autonomie des établissements et publication des résultats',
    famille: 'autonomie',
    porteurs: ['Édouard Philippe', 'Institut Montaigne', 'iFRAP', 'précédent anglais des academies'],
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
    ideeRecue: '« Publier les résultats, c’est de la transparence. » C’est aussi mettre les établissements en concurrence sur leurs notes. En Suède, où le diplôme de fin de lycée repose sur le contrôle continu, la concurrence a produit une inflation documentée, les « notes du bonheur » : les indicateurs s’améliorent sans que rien ne s’améliore. La France a déjà 40 % de contrôle continu au baccalauréat depuis 2019 : le mécanisme n’est pas hypothétique, il est en place.',
    mot: "Deux cadenas : l'effet réel peut aussi bien doubler que se retourner. C'est la carte la plus incertaine du jeu, et celle qui fait les meilleures unes.",
  },

  /* ----------------------------------------------------------------- 11 --- */
  {
    id: 'prive_mixite',
    label: 'Financement du privé sous contrat conditionné à des objectifs de mixité',
    famille: 'mixite',
    porteurs: ['Nouveau Front populaire', 'Place publique (privé intégré à la carte scolaire)', 'Cour des comptes (contrôle des fonds publics)', 'FCPE'],
    perimetre: 'matignon',
    cout: -0.15, coutETP: 0, pol: 15,       // rapporte de l'argent, coûte tout le reste
    theme: 'prive', once: true, reforme: true,
    provocations: 1,                         // une provocation : la guerre scolaire s'arme à 2
    vitrine: { parents: -5, enseignants: +5, presse: +3, compteurs: { egalite: 0 } },
    reel: [
      { compteur: 'egalite', central: 10, delai: 3, cadenas: 3, source: 'IPS privé 117,4 vs public 99,9 ; part d’élèves très favorisés dans le privé 26,4 % (2000) → 40,2 % (2021)' },
    ],
    physique: { segregation: -2.4 },
    preuve: 'L’indice de position sociale médian des collèges privés sous contrat est de 117,4 contre 99,9 dans le public, et l’écart grandit ; la part d’élèves très favorisés dans le privé est passée de 26,4 % en 2000 à 40,2 % en 2021, pour un financement public d’environ 73 à 75 %. Conditionner ce financement est le levier structurel le plus puissant sur la ségrégation, et le plus explosif : en 1984, la loi Savary a mis un million de personnes dans la rue et fait tomber le gouvernement.',
    mot: "Le seul levier vraiment puissant sur la ségrégation. Aussi le seul qui ait déjà fait tomber un gouvernement. Savary, 1984, un million de personnes dans la rue.",
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
    preuve: '9,8 % des heures d’enseignement du second degré n’ont pas été assurées en 2024-2025 (DEPP), dont 7,5 points de non-remplacement, environ deux heures perdues par élève et par semaine, en hausse de 0,7 point par an. Ramener ce taux à 5 % rendrait aux élèves plus d’heures que 4 000 postes n’en apportent. Le verrou n’est pas budgétaire : il est statutaire (l’organisation du remplacement de courte durée).',
    ideeRecue: '« Il manque des profs, donc il faut recruter. » Le gisement le plus rapide n’est pas le recrutement : c’est l’organisation du remplacement, à condition d’accepter d’ouvrir le dossier du statut, ce qu’aucune intersyndicale n’accueille avec des fleurs.',
    mot: "Ramener les heures non assurées de 9,8 % à 5 % rendrait aux élèves plus d'heures que 4 000 postes n'en coûtent. Encore faut-il toucher au statut pour y arriver.",
  },

  /* ======================================================================
     EXTENSION DU CATALOGUE, cartes 13 à 40 (phase 2)
     Cinq familles doctrinales (B.7), porteurs réels cités, humour compris.
     ====================================================================== */

  /* ----------------------------- 13 · moyens ------------------------- */
  {
    id: 'maternelle',
    label: 'Plan langage en maternelle, priorité aux réseaux d’éducation prioritaire',
    famille: 'moyens',
    porteurs: ['CSEN', 'économie de l’éducation (rendement des investissements précoces)', 'Parti socialiste', 'Terra Nova'],
    perimetre: 'ministeriel',
    cout: 0.28, coutETP: 1500, pol: 4,
    theme: 'maternelle', once: true, reforme: true,
    vitrine: { parents: +1, enseignants: +2, presse: 0, compteurs: {} },
    reel: [
      { compteur: 'reussite', central: 5, delai: 6, cadenas: 4, source: 'recherche convergente : le rendement éducatif est maximal aux âges précoces' },
      { compteur: 'egalite',  central: 6, delai: 6, cadenas: 4, source: 'les écarts de vocabulaire sont installés à 4 ans ; l’intervention précoce les réduit' },
    ],
    physique: {},
    preuve: 'Les travaux d’économie de l’éducation (à la suite de Heckman) convergent : le rendement de l’euro public investi est maximal aux âges précoces, surtout pour les enfants défavorisés. Les écarts de vocabulaire entre milieux sociaux sont déjà installés à 4 ans ; c’est en maternelle qu’ils se réduisent le mieux, et c’est l’investissement le moins visible politiquement, puisque ses effets arrivent après le mandat.',
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
    preuve: 'La difficulté sociale est continue ; le label éducation prioritaire est binaire. Résultat documenté par la Cour des comptes et la DEPP : des établissements au public très défavorisé restent hors du dispositif, d’autres y demeurent alors que leur situation a changé. Une allocation progressive sur l’indice de position sociale supprime l’effet de seuil, et les rentes de situation, ce qui explique sa difficulté politique.',
    mot: "Techniquement irréprochable : la difficulté sociale est continue, pas binaire. Politiquement : vous venez d'annoncer à cent collèges qu'ils perdent leur prime.",
  },

  /* ----------------------------- 15 · moyens ------------------------- */
  {
    id: 'titularisation',
    label: 'Plan de titularisation des contractuels enseignants',
    famille: 'moyens',
    porteurs: ['intersyndicale', 'Parti socialiste', 'Défenseur des droits (précarité des contractuels)'],
    perimetre: 'ministeriel',
    cout: 0.30, coutETP: 0, pol: 5,
    theme: 'contractuels', once: true, reforme: false,
    vitrine: { parents: +1, enseignants: +6, presse: -1, compteurs: { sante: +2 } },
    reel: [
      { compteur: 'sante', central: 4, delai: 2, cadenas: 3, source: 'stabilisation et formation d’agents déjà en poste, souvent recrutés en quelques jours' },
    ],
    physique: { adhesion: +3 },
    preuve: 'Le recours aux contractuels s’est banalisé, avec des recrutements parfois expédiés en quelques jours et sans formation. Les stabiliser et les former améliore la continuité pédagogique à coût modéré, c’est une reconnaissance de l’existant plus qu’une création de moyens.',
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
    preuve: 'Une heure supplémentaire annuelle coûte environ un cinquantième d’un poste : c’est l’instrument de gestion le plus rentable à court terme, utilisé par tous les gouvernements. Son coût différé est documenté par les enquêtes de conditions de travail : intensification, épuisement, démissions, le rabot d’aujourd’hui se paie sur l’attractivité de demain.',
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
      { compteur: 'sante',    central: 5, delai: 5, cadenas: 3, source: 'une formation en alternance mieux rémunérée reconstitue le vivier, après la transition' },
      { compteur: 'reussite', central: 3, delai: 6, cadenas: 3, source: 'des néotitulaires mieux formés tiennent mieux leurs classes' },
    ],
    physique: { attractivite: -9 },       // la transition casse une année de recrutement
    preuve: 'La formation initiale a été réformée à répétition (IUFM, ESPE, INSPÉ, position du concours déplacée plusieurs fois) : chaque transition casse une année de recrutement, le temps que les candidats s’adaptent. La réforme de 2026 (concours à bac+3) a fait bondir les inscriptions de 76,6 %, après un trou d’air. Les systèmes qui progressent (Estonie, Irlande, Singapour) ont tous investi massivement et durablement dans la formation de leurs enseignants.',
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
    preuve: 'Environ 76 000 jeunes sortent chaque année sans qualification. La recherche est unanime : le décrochage est un processus à signaux faibles (absences, notes, comportement) repérables des années avant la rupture, et le repérage précoce avec référent est la intervention la mieux évaluée, très loin devant les sanctions, dont les évaluations n’ont montré aucun effet durable.',
    mot: "Le décrochage est un processus, pas un événement. Intervenir en 5e coûte dix fois moins cher que raccrocher un jeune de 18 ans, et fait cent fois moins de communiqués.",
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
    preuve: 'L’État ne possède ni les écoles (communes), ni les collèges (départements), ni les lycées (régions) : il ne peut que co-financer et inciter. Le confort thermique a un effet documenté mais modeste sur les apprentissages ; l’effet principal d’un plan bâti est ailleurs, dans la relation avec les collectivités, qui paient 40 % de la dépense éducative sans participer aux décisions pédagogiques.',
    ideeRecue: '« Le ministre n’a qu’à rénover les écoles. » Il ne le peut pas : les murs ne sont pas à lui. Une annonce nationale sur le bâti est une annonce sur le budget des autres.',
    mot: "Les écoles sont aux communes, les collèges aux départements, les lycées aux régions, et les photos de classes à 40 °C au ministre. Vous payez l'amorçage pour des murs qui ne sont pas à vous.",
  },

  /* ----------------------------- 22 · évaluation ---------------------- */
  {
    id: 'evaluation_diagnostic',
    label: 'Évaluations nationales rendues aux équipes, avec accompagnement, sans publication',
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
    ideeRecue: '« Évaluer, c’est fliquer. » / « Évaluer, c’est la transparence. » Les deux slogans ratent l’essentiel : un thermomètre ne soigne ni ne punit, tout dépend de qui lit la température, et pour quoi faire.',
    mot: "La presse titrera « le ministre renonce à la transparence ». En réalité vous choisissez entre deux outils : un thermomètre pour soigner, ou un thermomètre pour classer les malades.",
  },

  /* ----------------------------- 23 · autonomie ----------------------- */
  {
    id: 'cheque_education',
    label: 'Chèque-éducation : financement attaché à l’élève, libre choix de l’établissement',
    famille: 'autonomie',
    porteurs: ['David Lisnard', 'iFRAP', 'précédent suédois du chèque scolaire'],
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
    preuve: 'La Suède est l’expérience naturelle la mieux documentée du monde : chèque scolaire, écoles indépendantes à but lucratif et libre choix au début des années 1990. Bilan à vingt ans, partagé par la quasi-totalité des chercheurs et par les agences gouvernementales suédoises : l’OCDE constatait en 2015 qu’aucun autre pays participant à PISA n’enregistrait un tel recul. Démonstration décisive (Östh, 2013) : en comparant la variance réelle entre écoles à celle qu’on observerait si chaque élève allait à l’école de son quartier, c’est <b>le libre choix, et non la ségrégation résidentielle</b>, qui explique le mieux les écarts entre établissements. S’y ajoutent une inflation des notes née de la concurrence, et des coûts plus élevés pour des résultats qui ne le sont pas.',
    ideeRecue: '« La concurrence tire tout le monde vers le haut. » C’est l’hypothèse qui a été testée grandeur nature, sur vingt ans, par un pays entier, et invalidée par ses propres agences publiques. Cette carte est le miroir exact du redoublement : une vitrine excellente, un bilan qui arrive après vous, et une littérature qui dit déjà ce qu’il contiendra.',
    mot: "Aucun pays comparable ne l'a fait à l'échelle. Vous serez le pionnier, ou le cas d'école, au sens propre.",
  },

  /* ----------------------------- 24 · autonomie ----------------------- */
  {
    id: 'recrutement_direction',
    label: 'Recrutement des enseignants par les chefs d’établissement',
    famille: 'autonomie',
    porteurs: ['Horizons (version expérimentale)', 'SNPDEN', 'précédent anglais des academies'],
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
    preuve: 'Les résultats internationaux sont contradictoires et dépendent entièrement de la qualité de l’encadrement. Le risque documenté : un « marché » des mutations où les établissements attractifs captent les enseignants expérimentés, tandis que les établissements difficiles (déjà les plus jeunes en moyenne) recrutent ce qui reste.',
    mot: "Les établissements attractifs recruteront les meilleurs. Les autres recruteront.",
  },

  /* ----------------------------- 25 · autonomie ----------------------- */
  {
    id: 'pacte_pluriannuel',
    label: 'Pacte pluriannuel : moyens garantis trois ans contre contractualisation d’objectifs',
    famille: 'autonomie',
    porteurs: ['Michel Barnier (pacte pluriannuel)', 'recteurs', 'associations d’élus', 'Cour des comptes (contractualisation)'],
    perimetre: 'ministeriel',
    cout: 0.10, coutETP: 0, pol: 5,
    theme: 'pluriannuel', once: true, reforme: false,
    bercy: -3,                            // Bercy déteste s'engager au-delà de l'annualité
    vitrine: { parents: +1, enseignants: +3, presse: +1, compteurs: {} },
    reel: [
      { compteur: 'sante', central: 3, delai: 3, cadenas: 3, source: 'la visibilité pluriannuelle stabilise les équipes et déclenche l’investissement local' },
    ],
    physique: { adhesion: +2 },
    preuve: 'La visibilité pluriannuelle est un levier peu coûteux et documenté : une commune n’investit pas dans une école menacée de fermeture, une équipe ne s’engage pas sur des moyens repris l’année suivante. Son ennemi naturel est l’annualité budgétaire, à laquelle Bercy tient comme à son bien le plus précieux, parce que c’est son bien le plus précieux.',
    mot: "Une commune ne rénove pas une école qu'elle croit condamnée, un principal ne s'engage pas sur des moyens repris en février. La visibilité est une politique, que Bercy compte comme une reddition.",
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
    preuve: 'La différenciation efficace, selon la recherche, est courte, ciblée et réversible : des regroupements de quelques semaines sur un besoin identifié, puis retour en classe entière. C’est la version que la Sgen-CFDT a arrachée en 2024-2026 contre les groupes de niveau permanents. Sa limite : elle exige de l’ingénierie d’emploi du temps et une vraie adhésion des équipes, elle ne se décrète pas.',
    mot: "Différencier sans étiqueter. Exigeant, invisible, efficace là où les équipes y croient, c'est-à-dire là où vous ne décidez pas.",
  },

  /* ----------------------------- 27 · parcours ------------------------ */
  {
    id: 'brevet_barrage',
    label: 'Brevet obligatoire pour l’entrée en seconde, avec classes « prépa-seconde »',
    famille: 'parcours',
    porteurs: ['Gabriel Attal', 'Fondation Jean-Jaurès (version mixité)'],
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
    preuve: 'Aucune étude ne démontre qu’un examen-barrage élève le niveau par « effet de menace », c’est le même mécanisme non prouvé que pour le redoublement. Ce qui est documenté : les recalés d’un barrage décrochent davantage, et ils sont socialement très typés. La « prépa-seconde » française n’a pas d’équivalent évalué.',
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
    ideeRecue: '« L’uniforme gomme les inégalités et restaure le cadre. » C’est l’exemple parfait de la mesure-vitrine : populaire, visible, photogénique, et sans effet mesuré. Les inégalités se voient aux chaussures, aux téléphones et aux vacances, pas au polo.',
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
    preuve: 'Un tiers des lycéens sont en voie professionnelle, qui concentre les élèves les plus défavorisés. Or une large part d’entre eux poursuit désormais en BTS, où le taux d’échec est massif faute de bases en français et en mathématiques. Renforcer les fondamentaux y a un double effet documenté : insertion ET poursuite d’études.',
    mot: "Un tiers des lycéens, zéro pour cent des éditoriaux.",
  },

  /* ----------------------------- 30 · autorité ------------------------ */
  {
    id: 'allocations',
    label: 'Suspension des allocations familiales en cas d’absentéisme persistant',
    famille: 'autorite',
    porteurs: ['Reconquête', 'Rassemblement national', 'une partie de la droite parlementaire', 'une majorité de l’opinion dans les sondages'],
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
    preuve: 'Le dispositif de suspension des allocations (loi Ciotti, 2010-2013) a été évalué puis abrogé : aucun effet durable sur l’assiduité, un effet net d’appauvrissement des familles déjà les plus fragiles, et une dégradation du lien école-famille, celui-là même dont dépend le raccrochage. Il reste soutenu par une majorité constante de l’opinion.',
    ideeRecue: '« Toucher au portefeuille, ça au moins ça marche. » C’est l’une des rares mesures éducatives testées en vraie grandeur EN France, DEUX fois, avec le même résultat nul. Le débat public l’ignore avec constance.',
    mot: "Évaluée deux fois, enterrée deux fois, réclamée toujours. La mesure zombie du débat éducatif français : elle ne marche pas, mais elle marche très bien.",
  },

  /* ----------------------------- 31 · autorité ------------------------ */
  {
    id: 'internats',
    label: 'Internats de rescolarisation pour élèves hautement perturbateurs',
    famille: 'autorite',
    porteurs: ['la droite parlementaire', 'des chefs d’établissement épuisés', 'associations de victimes de violences scolaires'],
    perimetre: 'ministeriel',
    cout: 0.21, coutETP: 0, pol: 5,
    theme: 'internats', once: true, reforme: false,
    vitrine: { parents: +5, enseignants: +1, presse: +5, compteurs: {} },
    reel: [
      { compteur: 'sante',   central: 1, delai: 3, cadenas: 2, source: 'soulage les classes d’origine ; les trajectoires des élèves déplacés sont mal documentées' },
      { compteur: 'egalite', central: -2, delai: 3, cadenas: 2, source: 'concentrer les élèves en rupture entre eux : l’effet de composition joue contre eux' },
    ],
    physique: {},
    preuve: 'Le déplacement d’élèves très perturbateurs soulage la classe d’origine, c’est réel et immédiat. Sur les élèves déplacés, les données manquent, et ce qu’on sait des regroupements d’élèves en rupture joue contre : concentrer les difficultés dégrade les trajectoires (effet de composition, encore lui).',
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
    preuve: 'L’interdiction effective du téléphone (casiers, pochettes) montre des effets mesurés sur le climat de récréation, les incidents et l’attention, modestes mais réels, parmi les mieux établis des mesures « d’ordre ». Le point aveugle : l’intendance (achat, responsabilité, gestion) retombe sur les établissements et les collectivités.',
    mot: "Mesure rarissime : les enseignants sont pour, les parents sont pour, les élèves sont contre et n'ont pas le droit de vote. Reste à savoir qui achète les casiers, indice : pas vous.",
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
    porteurs: ['Rassemblement national', 'Reconquête', 'la nostalgie, qui vote beaucoup'],
    perimetre: 'ministeriel',
    cout: 0.14, coutETP: 1500, pol: 3,
    theme: 'surges', once: true, reforme: false,
    vitrine: { parents: +4, enseignants: 0, presse: +4, compteurs: {} },
    reel: [
      { compteur: 'sante', central: 2, delai: 2, cadenas: 1, source: 'aucune évaluation : c’est un assistant d’éducation avec un nom d’avant. La présence adulte aide ; le costume, on ne sait pas' },
    ],
    physique: {},
    preuve: 'Aucune évaluation n’existe : le « surveillant général » a disparu en 1970, remplacé par les CPE. Ce qui est documenté, c’est l’effet de la présence adulte stable, que le poste s’appelle surgé, AED ou CPE. Le reste est du costume. D’où un seul cadenas : l’effet tiré peut aller du négatif au double.',
    ideeRecue: '« De mon temps, avec les surgés, il y avait de l’ordre. » De votre temps, il y avait surtout deux fois moins d’élèves scolarisés au-delà de 16 ans. La nostalgie est un biais d’échantillonnage.',
    mot: "Personne ne sait exactement ce que c'était, tout le monde s'en souvient avec émotion. Vous financez un souvenir, à variance maximale.",
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
    preuve: 'Les secteurs multi-collèges expérimentés à Paris depuis 2017 sont l’une des rares politiques de mixité évaluées en France : la mixité sociale progresse nettement, sans baisse mesurée des résultats des élèves favorisés. L’obstacle n’est pas technique : la sectorisation appartient aux départements, et la crainte (non vérifiée mais électoralement réelle) des familles favorisées.',
    ideeRecue: '« La mixité tire les bons élèves vers le bas. » C’est LA crainte qui bloque tout, et les évaluations disponibles, françaises comme internationales, ne la confirment pas : les élèves favorisés perdent peu ou rien, les défavorisés gagnent beaucoup.',
    mot: "Les évaluations montrent que les résultats des enfants favorisés ne baissent pas. Les craintes de leurs parents, si, et elles, elles votent.",
  },

  /* ----------------------------- 36 · mixité -------------------------- */
  {
    id: 'ghettos',
    label: 'Fermer une centaine de « ghettos scolaires » et redéployer les élèves',
    famille: 'mixite',
    porteurs: ['Gabriel Attal', 'Fondation Jean-Jaurès (version mixité sociale)', 'chercheurs en sociologie de l’éducation'],
    perimetre: 'ministeriel',
    cout: 0.35, coutETP: 0, pol: 11,
    theme: 'ghettos', once: true, reforme: true,
    vitrine: { parents: -2, enseignants: -3, presse: +5, compteurs: {} },
    reel: [
      { compteur: 'egalite', central: 4, delai: 4, cadenas: 2, source: 'jamais fait à cette échelle : dépend entièrement de la qualité des réaffectations' },
    ],
    physique: { segregation: -0.8 },
    preuve: 'La fermeture-redéploiement d’établissements très ségrégués n’a jamais été menée à l’échelle annoncée : l’effet dépend entièrement de la qualité des réaffectations (vers des établissements mixtes, avec accompagnement, ou vers le collège voisin tout aussi ségrégué). Deux cadenas : le principe est plausible, l’exécution est tout.',
    mot: "Fermer un collège que tout le monde évite : tout le monde est pour, sauf l'intégralité des personnes concernées, son maire, et le collège d'à côté.",
  },

  /* ----------------------------- 37 · mixité (l’arme nucléaire) ------- */
  {
    id: 'loi_carle',
    label: 'Abroger la loi Carle et intégrer le privé sous contrat à la carte scolaire',
    famille: 'mixite',
    porteurs: ['La France insoumise', 'Place publique (version carte scolaire)', 'Nouveau Front populaire', 'Comité national d’action laïque'],
    perimetre: 'matignon',
    cout: -0.10, coutETP: 0, pol: 13,
    theme: 'carle', once: true, reforme: true,
    provocations: 2,                      // à elle seule, elle arme la guerre scolaire
    vitrine: { parents: -6, enseignants: +4, presse: -2, compteurs: { egalite: +2 } },
    reel: [
      { compteur: 'egalite', central: 8, delai: 4, cadenas: 3, source: 'le privé sous contrat scolarise 40 % d’élèves très favorisés contre 26 % en 2000 : l’intégrer à la carte est le levier structurel' },
    ],
    physique: { segregation: -2.0 },
    preuve: 'L’intégration du privé sous contrat à la carte scolaire est le levier le plus puissant du jeu sur la ségrégation, mécaniquement, puisque le privé concentre 40 % d’élèves très favorisés. C’est aussi le seul dont l’histoire a testé le coût politique en vraie grandeur : 1984, un million de manifestants, retrait de la loi Savary, chute du gouvernement Mauroy.',
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
    preuve: 'La « perte estivale » est massivement documentée : sur deux mois d’interruption, les élèves de milieux favorisés maintiennent voire progressent (livres, voyages, activités), les autres régressent, l’écart se creuse chaque été. Raccourcir ou zoner l’été est l’une des mesures d’égalité les mieux étayées… et la plus unanimement combattue : parents, enseignants, tourisme, tous alignés contre.',
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
    preuve: 'L’esprit critique face aux médias et à l’IA s’enseigne, avec des effets mesurés (modestes, lents, réels) quand des heures y sont réellement dédiées et les enseignants formés. Le piège documenté : l’ajout au programme sans retrait équivalent, tout ajout est une soustraction ailleurs.',
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
      { compteur: 'reussite', central: 2, delai: 3, cadenas: 4, source: 'idem, l’effet dépend de l’encadrement réel, pas de l’étude surveillée' },
    ],
    physique: {},
    preuve: 'L’aide aux devoirs encadrée et le tutorat comptent parmi les interventions les mieux documentées du répertoire EEF (+5 mois pour le tutorat). Le mécanisme d’équité est limpide : le devoir à la maison mesure surtout l’aide disponible à la maison. Condition : un encadrement réel, pas une étude surveillée où l’on fait ses devoirs seul mais assis.',
    ideeRecue: '« Les devoirs, c’est aux parents de s’en occuper. » C’est exactement ainsi que l’école transforme les inégalités familiales en inégalités scolaires, chaque soir, gratuitement.',
    mot: "Le dispositif existe depuis 2017. Vous le rendez systématique, c'est-à-dire que vous allez découvrir qui, exactement, était volontaire.",
  },

  /* ======================================================================
     EXTENSION DU CATALOGUE, cartes 41 à 55 (phase 4)
     Ces cartes ne sont PAS sur le bureau au premier jour : chacune porte un
     champ `decouverte` qui dit à quelle condition le dossier remonte. Un
     ministre ne connaît pas son ministère en juin ; il l'apprend, dossier par
     dossier, souvent parce qu'un rapport tombe ou parce qu'une crise éclate.
     ====================================================================== */

  /* ----------------------------- 41 · moyens -------------------------- */
  {
    id: 'tutorat',
    label: 'Tutorat intensif en petits groupes pour les élèves les plus fragiles',
    famille: 'moyens',
    porteurs: ['Education Endowment Foundation', 'programmes de rattrapage post-Covid britanniques et néerlandais'],
    perimetre: 'ministeriel',
    cout: 0.58, coutETP: 0, pol: 4,
    theme: 'tutorat', once: true, reforme: true,
    decouverte: { annee: 2, note: 'Les évaluations nationales de septembre remontent : la DEPP vous propose un dispositif de rattrapage ciblé.' },
    vitrine: { parents: +4, enseignants: +2, presse: +2, compteurs: { reussite: +3, egalite: +2 } },
    reel: [
      { compteur: 'reussite', central: 8, delai: 3, cadenas: 5, source: 'EEF : tutorat en petits groupes +4 mois de progrès, tutorat individuel +5 mois, plus de 60 études' },
      { compteur: 'egalite',  central: 7, delai: 3, cadenas: 4, source: 'EEF : effet supérieur pour les élèves défavorisés, à condition que le ciblage soit réel' },
    ],
    physique: {},
    preuve: 'Le tutorat est, avec le feedback, l’intervention la mieux documentée du répertoire de l’Education Endowment Foundation : +4 mois de progrès pour le tutorat en petits groupes, +5 mois en individuel, sur plus de soixante études. Les conditions sont connues et exigeantes : trois séances par semaine, des groupes de un à trois élèves, douze semaines au moins, des tuteurs formés.',
    ideeRecue: '« Du soutien scolaire, on en fait déjà partout. » Ce qui existe partout, c’est l’aide diffuse en classe entière. Ce qui produit l’effet mesuré, c’est un protocole intensif et court, et c’est justement ce qui coûte, parce qu’il faut du temps d’adulte qualifié en plus.',
    mot: "L'une des rares cartes à cinq cadenas du catalogue. Elle ne fera jamais la une, mais elle est la seule dont vous serez à peu près sûr au bilan.",
  },

  /* ----------------------------- 42 · moyens -------------------------- */
  {
    id: 'lecture_explicite',
    label: 'Enseignement explicite du code et de la fluence, CP-CE1',
    famille: 'moyens',
    porteurs: ['Conseil scientifique de l’éducation nationale', 'Education Endowment Foundation'],
    perimetre: 'ministeriel',
    cout: 0.19, coutETP: 0, pol: 4,
    theme: 'lecture', once: true, reforme: true,
    decouverte: { si: 'apres_un_an' },
    vitrine: { parents: +3, enseignants: -3, presse: +2, compteurs: { reussite: +3 } },
    reel: [
      { compteur: 'reussite', central: 9, delai: 4, cadenas: 5, source: 'EEF : enseignement systématique du code +5 mois de progrès, niveau de preuve maximal' },
      { compteur: 'egalite',  central: 5, delai: 4, cadenas: 4, source: 'EEF : effet renforcé pour les élèves les plus éloignés de la lecture à l’entrée au CP' },
    ],
    physique: { adhesion: -3 },
    preuve: 'L’enseignement systématique et explicite du code est classé à +5 mois de progrès au plus haut niveau de preuve par l’Education Endowment Foundation. Le rapport du HCSP d’août 2026 précise le tableau français : plus personne n’emploie la « méthode globale », mais la méthode phonique synthétique stricte (la plus efficace, singulièrement pour les élèves de condition modeste) reste minoritaire, la majorité des enseignants recourant à des méthodes mixtes. Enjeu de fond : près d’un jeune sur quatre a des difficultés prononcées en lecture à 17-18 ans, aux tests de la Journée défense et citoyenneté.',
    ideeRecue: '« Il suffit de prescrire la bonne méthode. » Le fait le plus instructif du dossier est ailleurs : la moitié des enseignants qui emploient la méthode la plus efficace exercent dans une quinzaine de circonscriptions où l’inspection et les conseillers pédagogiques avaient organisé un accompagnement spécifique. Ce n’est pas la circulaire qui diffuse une méthode, c’est l’accompagnement de proximité, et il ne s’achète pas en une rentrée.',
    mot: "Preuve maximale, coût minimal, et une salle des professeurs qui vous demandera de quel droit un ministre décide comment on apprend à lire.",
  },

  /* ----------------------------- 43 · moyens -------------------------- */
  {
    id: 'absences_institutionnelles',
    label: 'Sortir examens, réunions et formations du temps de classe',
    famille: 'moyens',
    porteurs: ['Cour des comptes', 'fédérations de parents'],
    contre: ['déplacer ces heures hors du temps de classe, c’est allonger la présence des enseignants dans l’établissement'],
    perimetre: 'ministeriel',
    cout: 0.21, coutETP: 0, pol: 6,
    theme: 'remplacement', once: true, reforme: false,
    decouverte: { si: 'heures_perdues', note: 'La Cour des comptes publie son rapport sur la gestion des absences. Il est sur toutes les tables.' },
    vitrine: { parents: +7, enseignants: -5, presse: +4, compteurs: { sante: +4 } },
    reel: [
      { compteur: 'sante',    central: 7, delai: 2, cadenas: 4, source: 'Cour des comptes 2025 : deux tiers des absences non remplacées ont une cause institutionnelle, pas individuelle' },
      { compteur: 'reussite', central: 4, delai: 3, cadenas: 4, source: 'le temps d’enseignement effectivement reçu est un déterminant direct des acquis' },
    ],
    physique: { hna: { delta: -1.9, duree: 99 } },
    greve: { intensite: 2, theme: 'statut', segment: 'college' },
    preuve: 'La Cour des comptes établit en décembre 2025 que 9,3 % des heures sont perdues au collège et au lycée, et surtout que les deux tiers des absences non remplacées ne sont pas individuelles : elles sont produites par le système lui-même, surveillance et correction d’examens, formation, réunions, sorties. Le rapport sénatorial de juin 2025 mesure 4,3 % du temps scolaire perdu en moyenne et 7,4 % dans le second degré : deux chiffres officiels, deux périmètres, un même diagnostic.',
    ideeRecue: '« Les profs sont trop souvent absents. » Un tiers seulement de ces absences relève de raisons individuelles. Les deux autres tiers, c’est l’institution qui convoque ses propres enseignants pendant les heures de cours, puis qui s’étonne que les heures manquent.',
    mot: "La mesure la moins chère du catalogue pour rendre des heures aux élèves. Elle consiste à demander au ministère d'arrêter de se déranger lui-même.",
  },

  /* ----------------------------- 44 · parcours ------------------------ */
  {
    id: 'pfmp',
    label: 'Doubler l’allocation de stage et le suivi en lycée professionnel',
    famille: 'parcours',
    porteurs: ['prolongement du décret du 11 août 2023', 'régions', 'branches professionnelles'],
    perimetre: 'ministeriel',
    cout: 0.35, coutETP: 900, pol: 3,
    theme: 'voie_pro', once: true, reforme: false,
    decouverte: { annee: 2 },
    vitrine: { parents: +4, enseignants: +3, presse: +2, compteurs: { egalite: +3 } },
    reel: [
      { compteur: 'egalite',  central: 6, delai: 3, cadenas: 3, source: 'la voie professionnelle scolarise un tiers des lycéens et concentre les élèves d’origine populaire' },
      { compteur: 'reussite', central: 3, delai: 4, cadenas: 2, source: 'l’effet sur les acquis passe par la persévérance : la gratification réduit l’abandon en cours de cursus' },
    ],
    physique: {},
    preuve: 'Depuis le décret du 11 août 2023, les périodes de formation en milieu professionnel sont gratifiées par l’État : 50 € par semaine en seconde ou première année de CAP, 75 € puis 100 € ensuite, soit jusqu’à 2 100 € sur un cursus de baccalauréat professionnel. Le levier est social avant d’être pédagogique : la voie professionnelle accueille les élèves les plus fragiles (40 % en difficulté en français et 70 % en mathématiques, contre 6 % et 20 % dans les voies générale et technologique) et le taux d’insertion six mois après le diplôme ne dépasse pas 40 %.',
    ideeRecue: '« Le lycée professionnel, c’est l’apprentissage en moins bien. » Il scolarise un tiers des lycéens, dans des territoires et des familles où l’apprentissage n’offre pas d’alternative : c’est le seul lycée de beaucoup de communes.',
    mot: "Un tiers des lycéens, et la moitié de l'attention médiatique d'une réforme du bac général.",
  },

  /* ----------------------------- 45 · moyens -------------------------- */
  {
    id: 'annee_38',
    label: 'Étaler l’année scolaire sur 38 semaines et alléger les journées',
    famille: 'parcours',
    porteurs: ['OCDE', 'chronobiologistes', 'une partie des fédérations de parents'],
    contre: ['le tourisme, les collectivités, les familles, et à peu près tout le monde en juillet'],
    perimetre: 'matignon',
    cout: 0.30, coutETP: 0, pol: 9,
    theme: 'rythmes', once: true, excl: 'calendrier', reforme: true,
    decouverte: { annee: 3, note: 'Le rapport annuel de l’OCDE relance le sujet des rythmes. Matignon demande une note.' },
    vitrine: { parents: -6, enseignants: -4, presse: +5, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 6, delai: 5, cadenas: 2, source: 'OCDE 2025 : mêmes heures réparties sur 36 semaines contre 38, 7 h de présence par jour au collège contre 5 ailleurs' },
      { compteur: 'sante',    central: 3, delai: 4, cadenas: 2, source: 'la charge quotidienne est un déterminant du climat scolaire et de la fatigue enseignante' },
    ],
    physique: {},
    greve: { intensite: 3, theme: 'statut', segment: 'tous' },
    preuve: 'Les élèves français reçoivent 864 heures d’enseignement par an en élémentaire et 973 au collège, soit environ 600 heures de plus que la moyenne de l’OCDE sur l’ensemble de la scolarité obligatoire. Ces heures tiennent dans 36 semaines quand la moyenne est de 38 : les journées sont donc parmi les plus longues du monde développé, 7 heures de présence quotidienne au collège contre 5 ailleurs. Le niveau de preuve sur les rythmes reste faible : deux cadenas, pas davantage.',
    ideeRecue: '« Les élèves français n’ont pas assez d’heures de cours. » Ils en ont plus que presque partout ailleurs, sur moins de jours, avec la plus forte proportion de français et de mathématiques de l’OCDE, pour des résultats moyens. Ce n’est pas le volume qui manque.',
    mot: "Aucun ministre n'a jamais gagné une bataille sur les rythmes scolaires. Aucun n'a jamais résisté à l'envie d'essayer.",
  },

  /* ----------------------------- 46 · autonomie ----------------------- */
  {
    id: 'directeurs',
    label: 'Décharge complète et statut pour les directeurs d’école',
    famille: 'autonomie',
    porteurs: ['SNPDEN', 'associations de directeurs', 'plusieurs rapports parlementaires'],
    contre: ['la FSU refuse un supérieur hiérarchique dans l’école'],
    perimetre: 'ministeriel',
    cout: 0.44, coutETP: 3800, pol: 6,
    theme: 'direction', once: true, excl: 'gouvernance', reforme: true,
    decouverte: { si: 'apres_un_an' },
    vitrine: { parents: +2, enseignants: +4, presse: +1, compteurs: { sante: +4 } },
    reel: [
      { compteur: 'sante',    central: 6, delai: 3, cadenas: 3, source: 'la charge administrative des directeurs est identifiée comme un facteur d’usure majeur dans le premier degré' },
      { compteur: 'reussite', central: 3, delai: 5, cadenas: 3, source: 'EEF : le pilotage pédagogique d’équipe est une condition d’efficacité des interventions, pas un effet en soi' },
    ],
    physique: { adhesion: +4, affection: +3 },
    greve: { intensite: 2, theme: 'statut', segment: '1erdegre' },
    preuve: 'L’école primaire française est le seul niveau du système sans chef d’établissement : le directeur d’école est un enseignant déchargé, sans autorité hiérarchique, qui absorbe l’administratif, la sécurité, le lien avec la mairie et les familles. C’est un facteur d’usure documenté, et le maillon par lequel passe (ou ne passe pas) toute réforme pédagogique du premier degré.',
    ideeRecue: '« Un statut, c’est juste une prime et un titre. » C’est aussi la question de savoir qui, dans une école, peut demander à une équipe de faire quelque chose. La réponse actuelle est : personne. C’est pour cela que la mesure est à la fois populaire chez les directeurs et combattue par la principale fédération.',
    mot: "Le seul niveau du système éducatif où personne n'est le chef. Ce n'est pas un oubli, c'est une position politique, vieille de quarante ans.",
  },

  /* ----------------------------- 47 · moyens -------------------------- */
  {
    id: 'plan_maths',
    label: 'Plan mathématiques : formation disciplinaire en école, par constellations',
    famille: 'moyens',
    porteurs: ['rapport Villani-Torossian', 'DEPP (TIMSS)', 'sociétés savantes'],
    perimetre: 'ministeriel',
    cout: 0.28, coutETP: 700, pol: 3,
    theme: 'formation_maths', once: true, reforme: true,
    decouverte: { si: 'reussite_basse', note: 'TIMSS retombe dans l’actualité : 484 en CM1 contre 524 dans l’Union européenne. La question vous sera posée.' },
    vitrine: { parents: +3, enseignants: +2, presse: +3, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 7, delai: 4, cadenas: 4, source: 'EEF : la formation disciplinaire longue et située est l’un des rares leviers de formation à effet mesuré' },
      { compteur: 'sante',    central: 3, delai: 3, cadenas: 3, source: 'TALIS : le sentiment de compétence disciplinaire est un déterminant du maintien dans le métier' },
    ],
    physique: { hna: { delta: +0.6, duree: 2 }, adhesion: +3 },
    preuve: 'Les élèves de CM1 obtiennent 484 en mathématiques à TIMSS 2023, contre 524 pour la moyenne des pays de l’Union européenne et 525 pour l’OCDE ; 15 % n’atteignent pas le niveau minimal, et les résultats sont stables depuis 2019. Le rapport Villani-Torossian a établi le diagnostic : les professeurs des écoles sont très majoritairement issus de filières littéraires et reçoivent peu de formation disciplinaire en mathématiques. Le format « constellations » (petits groupes d’enseignants suivis dans la durée par un pair formé) est celui dont l’effet est le mieux étayé.',
    ideeRecue: '« Le niveau en maths baisse partout, c’est une tendance mondiale. » L’écart de la France à ses voisins européens en CM1 est de 40 points et il ne se réduit pas : ce n’est pas une dérive commune, c’est un décrochage propre.',
    mot: "Quarante points d'écart avec la moyenne européenne dès le CM1. On ne les rattrape pas en changeant le programme du lycée.",
  },

  /* ----------------------------- 48 · mixite -------------------------- */
  {
    id: 'affelnet',
    label: 'Affectation au lycée pilotée par la mixité sociale',
    famille: 'mixite',
    porteurs: ['expérience parisienne depuis 2021', 'chercheurs en économie de l’éducation'],
    contre: ['les fédérations de parents des secteurs favorisés', 'une partie des élus locaux'],
    perimetre: 'ministeriel',
    cout: 0.05, coutETP: 0, pol: 7,
    theme: 'affectation', once: true, excl: 'sectorisation', reforme: true,
    decouverte: { si: 'segregation_haute' },
    vitrine: { parents: -5, enseignants: +2, presse: +3, compteurs: { egalite: +4 } },
    reel: [
      { compteur: 'egalite',  central: 8, delai: 3, cadenas: 3, source: 'l’algorithme d’affectation parisien a réduit la ségrégation entre lycées sans dégrader les résultats moyens' },
      { compteur: 'reussite', central: -1, delai: 4, cadenas: 2, source: 'les évaluations disponibles ne montrent pas d’effet négatif sur les acquis, mais le suivi reste court' },
    ],
    physique: { segregation: -1.6 },
    preuve: 'Depuis 2021, l’affectation en seconde à Paris pondère les vœux par l’indice de position sociale : la ségrégation entre lycées a reculé sans dégradation mesurée des résultats. Le levier est puissant parce qu’il ne coûte presque rien (c’est un paramètre d’algorithme) et fragile pour la même raison : un successeur le change en une circulaire.',
    ideeRecue: '« La mixité sociale, c’est bon pour les uns et mauvais pour les autres. » Les travaux disponibles concluent à un gain net pour les élèves défavorisés et à un effet proche de zéro pour les favorisés. Ce que perdent ces derniers n’est pas mesuré en points : c’est un entre-soi.',
    mot: "Cinq millions d'euros, un paramètre d'algorithme, et la totalité des associations de parents du 5e arrondissement.",
  },

  /* ----------------------------- 49 · moyens -------------------------- */
  {
    id: 'cantine',
    label: 'Cantine à un euro et petits déjeuners en éducation prioritaire',
    famille: 'moyens',
    porteurs: ['dispositifs existants à généraliser', 'collectivités', 'associations de lutte contre la pauvreté'],
    perimetre: 'ministeriel',
    cout: 0.33, coutETP: 0, pol: 2,
    theme: 'social', once: true, reforme: false,
    decouverte: { annee: 2 },
    vitrine: { parents: +8, enseignants: +3, presse: +4, compteurs: { egalite: +3 } },
    reel: [
      { compteur: 'egalite',  central: 5, delai: 3, cadenas: 3, source: 'les dispositifs d’alimentation scolaire ciblés améliorent l’assiduité et la disponibilité aux apprentissages' },
      { compteur: 'reussite', central: 2, delai: 4, cadenas: 2, source: 'l’effet sur les acquis est indirect et modeste : il passe par la présence et l’attention' },
    ],
    physique: {},
    preuve: 'La restauration scolaire relève des collectivités, mais l’État finance depuis 2019 la tarification à un euro dans les communes qui s’y engagent, et les petits déjeuners en éducation prioritaire. La littérature sur l’alimentation scolaire est convergente sur l’assiduité et la disponibilité aux apprentissages, plus modeste sur les acquis eux-mêmes.',
    ideeRecue: '« Ce n’est pas le rôle de l’école. » C’est déjà son rôle depuis 1881 dans les faits, et le seul repas complet de la journée pour une part non négligeable des élèves d’éducation prioritaire.',
    mot: "La carte la moins contestée du catalogue. Profitez-en, il n'y en a qu'une.",
  },

  /* ----------------------------- 50 · autorite ------------------------ */
  {
    id: 'pause_lycee',
    label: 'Extension de la pause numérique au lycée',
    famille: 'autorite',
    porteurs: ['prolongement de la mesure de 2025', 'plusieurs candidats', 'une majorité de proviseurs'],
    perimetre: 'ministeriel',
    cout: 0.16, coutETP: 0, pol: 3,
    theme: 'numerique_tel', once: true, reforme: false,
    decouverte: { si: 'apres_pause_numerique', note: 'La pause numérique tourne au collège. Les proviseurs de lycée demandent la même chose.' },
    vitrine: { parents: +7, enseignants: +4, presse: +5, compteurs: { reussite: +3, sante: +2 } },
    reel: [
      { compteur: 'sante',    central: 3, delai: 2, cadenas: 2, source: 'ministère 2025 : climat scolaire amélioré et signalements de cyberharcèlement en baisse dans les 200 collèges expérimentateurs' },
      { compteur: 'reussite', central: 2, delai: 4, cadenas: 1, source: 'aucune évaluation indépendante publiée à ce jour : l’effet sur les acquis est une hypothèse, pas un résultat' },
    ],
    physique: {},
    preuve: 'La mise à l’écart des téléphones a été expérimentée dans environ 200 collèges et auprès de 32 000 élèves en 2024-2025, puis généralisée au collège à la rentrée 2025. Le ministère fait état d’un climat scolaire amélioré et d’une baisse des signalements de cyberharcèlement ; aucune évaluation indépendante n’a été publiée. C’est le profil classique d’une mesure généralisée avant d’être évaluée : un cadenas sur les acquis.',
    ideeRecue: '« On a la preuve que ça marche. » On a le retour du ministère qui l’a décidée, sur les établissements qui se sont portés volontaires. C’est un indice, pas une preuve, et c’est exactement ce que mesure le nombre de cadenas.',
    mot: "Populaire, peu chère, applaudie en salle des professeurs. Un cadenas sur les acquis : le jeu vous laisse la prendre, il ne vous promet rien.",
  },

  /* ----------------------------- 51 · moyens -------------------------- */
  {
    id: 'ruralite',
    label: 'Contrats territoriaux et moratoire sur les fermetures en zone rurale',
    famille: 'moyens',
    porteurs: ['Association des maires ruraux', 'sénateurs de tous bords', 'préfets'],
    contre: ['Bercy, qui y voit le renoncement à la dividende démographique'],
    perimetre: 'ministeriel',
    cout: 0.38, coutETP: 1800, pol: 5,
    theme: 'ruralite', once: true, reforme: false,
    decouverte: { si: 'maires_en_colere', note: 'L’Association des maires ruraux demande une audience. Elle a compté vos fermetures de classes.' },
    vitrine: { parents: +6, enseignants: +3, presse: +3, compteurs: { paix: +3, egalite: +2 } },
    reel: [
      { compteur: 'egalite',  central: 4, delai: 4, cadenas: 2, source: 'les élèves ruraux réussissent bien au collège mais s’auto-censurent à l’orientation : l’effet passe par l’offre de proximité' },
      { compteur: 'paix',     central: 5, delai: 1, cadenas: 3, source: 'le conflit sur la carte scolaire est d’abord un conflit avec les maires, pas avec les syndicats' },
    ],
    physique: {},
    preuve: 'La baisse démographique frappe d’abord les écoles rurales, où une classe fermée est souvent la dernière. Le verrou politique reconduit depuis plusieurs années (aucune fermeture d’école sans l’accord du maire) a un coût budgétaire direct : il empêche de convertir la démographie en postes rendus. Les élèves ruraux réussissent plutôt bien au collège mais s’orientent moins vers les filières longues : l’enjeu est l’offre de proximité, pas le niveau.',
    ideeRecue: '« Une école à huit élèves, ce n’est pas raisonnable. » Ce n’est pas raisonnable comptablement. C’est la seule chose qui reste dans certaines communes, et c’est de cette phrase-là que sont faites les crises de carte scolaire.',
    mot: "Vous n'achetez pas des résultats, vous achetez la paix avec six cents maires. C'est parfois exactement ce qu'il faut acheter.",
  },

  /* ----------------------------- 52 · autonomie ----------------------- */
  {
    id: 'evaluation_ecoles',
    label: 'Généraliser l’évaluation des établissements, avec suites données',
    famille: 'autonomie',
    porteurs: ['Conseil d’évaluation de l’école', 'Cour des comptes', 'Édouard Philippe'],
    contre: ['la crainte d’un classement déguisé'],
    perimetre: 'ministeriel',
    cout: 0.17, coutETP: 600, pol: 4,
    theme: 'evaluation_etab', once: true, excl: 'evaluation', reforme: true,
    decouverte: { annee: 3 },
    vitrine: { parents: +3, enseignants: -3, presse: +3, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 5, delai: 5, cadenas: 3, source: 'l’effet des démarches d’auto-évaluation dépend entièrement des moyens donnés aux suites : sans suites, il est nul' },
      { compteur: 'sante',    central: -2, delai: 2, cadenas: 3, source: 'toute évaluation non accompagnée est vécue comme un contrôle et pèse sur l’adhésion' },
    ],
    physique: { adhesion: -3 },
    greve: { intensite: 2, theme: 'evaluation', segment: 'tous' },
    preuve: 'Le Conseil d’évaluation de l’école conduit depuis 2020 un cycle d’évaluations d’établissement combinant auto-évaluation et regard externe. Le point faible identifié par la Cour des comptes est constant : les rapports concluent, et rien ne suit. L’effet mesuré des démarches d’évaluation dépend presque entièrement des moyens affectés aux suites, accompagnement, formation, marges d’organisation.',
    ideeRecue: '« Évaluer, c’est déjà agir. » Évaluer sans donner de suites, c’est produire un document et une rancune. C’est la différence entre cette carte et un classement des établissements : elle ne vaut que par ce qu’on met derrière.',
    mot: "Le rapport d'évaluation est le seul produit du ministère dont la production est garantie et l'usage, facultatif.",
  },

  /* ----------------------------- 53 · moyens -------------------------- */
  {
    id: 'aed_statut',
    label: 'CDI et formation pour les assistants d’éducation',
    famille: 'moyens',
    porteurs: ['prolongement de la loi de 2022', 'l’ensemble des organisations syndicales'],
    perimetre: 'ministeriel',
    cout: 0.29, coutETP: 0, pol: 3,
    theme: 'vie_scolaire', once: true, reforme: false,
    decouverte: { si: 'apres_un_an' },
    vitrine: { parents: +2, enseignants: +5, presse: +1, compteurs: { sante: +3, paix: +2 } },
    reel: [
      { compteur: 'sante',    central: 5, delai: 2, cadenas: 3, source: 'la rotation des équipes de vie scolaire est un déterminant direct du climat des établissements' },
      { compteur: 'egalite',  central: 3, delai: 4, cadenas: 2, source: 'l’effet passe par le suivi des élèves les plus fragiles, qui repose largement sur la vie scolaire' },
    ],
    physique: { adhesion: +3 },
    preuve: 'La loi de 2022 a ouvert la possibilité d’un contrat à durée indéterminée aux assistants d’éducation après six ans. Dans les faits, la vie scolaire reste l’un des services les plus instables des établissements : équipes renouvelées chaque année, peu ou pas de formation, et la charge du suivi quotidien des élèves les plus fragiles. Le climat scolaire se construit là, pas dans les circulaires.',
    ideeRecue: '« Les surveillants, ce sont des étudiants de passage. » C’est le modèle de 1937, encore inscrit dans les textes. Les établissements qui vont bien sont ceux qui ont réussi, à titre local, à s’en écarter.',
    mot: "Le service qui connaît le mieux les élèves est aussi celui dont on renouvelle l'équipe tous les ans. Personne ne trouve ça bizarre depuis 1937.",
  },

  /* ----------------------------- 54 · parcours ------------------------ */
  {
    id: 'orientation',
    label: 'Heures d’orientation encadrées et rétablissement des psychologues de l’éducation',
    famille: 'parcours',
    porteurs: ['régions (compétentes depuis 2018)', 'fédérations de parents', 'Cour des comptes'],
    perimetre: 'ministeriel',
    cout: 0.31, coutETP: 1500, pol: 3,
    theme: 'orientation', once: true, reforme: false,
    decouverte: { annee: 2 },
    vitrine: { parents: +5, enseignants: +2, presse: +2, compteurs: { egalite: +3 } },
    reel: [
      { compteur: 'egalite',  central: 6, delai: 4, cadenas: 3, source: 'à résultats scolaires égaux, l’origine sociale continue de commander les vœux d’orientation : c’est là que se joue l’auto-censure' },
      { compteur: 'reussite', central: 2, delai: 5, cadenas: 2, source: 'l’effet sur les acquis est indirect, il passe par l’adéquation entre la filière et l’élève' },
    ],
    physique: {},
    preuve: 'Les 54 heures annuelles dédiées à l’orientation existent dans les textes depuis 2018 ; leur mise en œuvre effective est très inégale, faute d’heures fléchées et de personnels. Le mécanisme d’inégalité est documenté : à résultats scolaires identiques, l’origine sociale continue de commander les vœux. Le corps des psychologues de l’éducation nationale compte environ 5 500 personnes pour 7 500 postes.',
    ideeRecue: '« L’orientation, c’est le rôle des familles. » C’est précisément le problème : quand elle l’est, elle reproduit exactement ce que les familles savent déjà de l’école, et rien de ce qu’elles n’en savent pas.',
    mot: "Le moment où le système décide de ce que deviendront les élèves est aussi celui où il leur consacre le moins de temps d'adulte formé.",
  },

  /* ----------------------------- 55 · moyens -------------------------- */
  {
    id: 'outremer',
    label: 'Plan d’urgence pour Mayotte, la Guyane et les territoires en tension',
    famille: 'moyens',
    porteurs: ['préfets', 'parlementaires ultramarins', 'Défenseur des droits'],
    perimetre: 'matignon',
    cout: 0.46, coutETP: 2200, pol: 5,
    theme: 'outremer', once: true, reforme: false,
    decouverte: { si: 'apres_un_an', note: 'Une note de la direction générale remonte la situation scolaire à Mayotte et en Guyane. Elle n’est pas rassurante.' },
    vitrine: { parents: +2, enseignants: +3, presse: +4, compteurs: { egalite: +4 } },
    reel: [
      { compteur: 'egalite',  central: 7, delai: 4, cadenas: 3, source: 'les écarts d’accès à la scolarisation et de résultats entre ces territoires et l’hexagone sont les plus élevés du système' },
      { compteur: 'sante',    central: 3, delai: 3, cadenas: 3, source: 'ces académies concentrent les plus fortes proportions de contractuels et les plus faibles taux de couverture' },
    ],
    physique: { adhesion: +2 },
    preuve: 'Mayotte et la Guyane cumulent les écarts les plus élevés du système français : rotations scolaires faute de salles, taux de non-scolarisation sans équivalent hexagonal, part de contractuels et rotation des équipes très supérieures à la moyenne. Ce sont aussi les seuls territoires où la démographie scolaire progresse alors qu’elle recule partout ailleurs, le « dividende démographique » n’y existe pas.',
    ideeRecue: '« Le problème est démographique, il se réglera tout seul. » Il ne se règle nulle part tout seul, et surtout pas là : ce sont les deux académies où le nombre d’élèves augmente.',
    mot: "La baisse démographique finance vos réformes partout, sauf là où il faudrait le plus les financer.",
  },

  /* ======================================================================
     EXTENSION DU CATALOGUE, cartes 56 à 65 (phase 5)
     Les onze recommandations du rapport « Niveau scolaire : éléments de
     diagnostic et propositions » (Haut-commissariat à la Stratégie et au
     Plan, août 2026), rendues jouables. Elles arrivent sur le bureau à la
     date où le rapport paraît, c'est-à-dire pendant votre mandat.
     ====================================================================== */

  /* ----------------------------- 56 · autonomie ----------------------- */
  {
    id: 'evaluabilite',
    label: 'Rendre toute réforme évaluable, et publier les résultats',
    famille: 'autonomie',
    porteurs: ['Haut-commissariat à la Stratégie et au Plan (recommandations 1 et 2)', 'Conseil d’analyse économique'],
    contre: ['tous ceux qui préfèrent annoncer avant de savoir, c’est-à-dire tout le monde, un jour ou l’autre'],
    perimetre: 'ministeriel',
    cout: 0.09, coutETP: 250, pol: 5,
    theme: 'evaluabilite', once: true, reforme: false,
    decouverte: { si: 'apres_un_an', note: 'Le Haut-commissariat à la Stratégie et au Plan publie son rapport sur le niveau scolaire. Sa première recommandation vous concerne directement.' },
    vitrine: { parents: +1, enseignants: 0, presse: -2, compteurs: {} },
    reel: [
      { compteur: 'reussite', central: 6, delai: 6, cadenas: 4, source: 'HCSP 2026 : « on ne devrait pas pouvoir changer de cap avant d’avoir évalué les effets des politiques menées jusqu’ici »' },
      { compteur: 'sante',    central: 4, delai: 5, cadenas: 3, source: 'HCSP 2026 : l’enchaînement des réformes non évaluées est cité par les enseignants de collège comme source de stress avant la discipline en classe' },
    ],
    physique: { adhesion: +2 },
    preuve: 'Première recommandation du rapport du Haut-commissariat à la Stratégie et au Plan (août 2026) : tout nouveau dispositif doit être conçu, dès l’amont, pour que ses effets sur les résultats des élèves soient mesurables et effectivement mesurés. Seconde recommandation : les résultats de ces évaluations doivent être rendus publics. Le rapport ajoute la contrainte qui fait mal : il faut laisser le temps aux réformes de produire des résultats avant d’en changer.',
    ideeRecue: '« On évalue déjà tout. » On mesure beaucoup, la France dispose d’un dispositif d’évaluations nationales exhaustives sans équivalent à l’étranger. On évalue rarement : mesurer le niveau des élèves n’est pas la même chose que mesurer l’effet d’une politique, ce qui suppose de l’avoir prévu avant de la lancer.',
    mot: "La seule carte du catalogue dont l'effet consiste à empêcher vos successeurs de faire n'importe quoi. Vous compris.",
  },

  /* ----------------------------- 57 · moyens -------------------------- */
  {
    id: 'accompagnement_separe',
    label: 'Séparer inspection et accompagnement, créer des conseillers pédagogiques au collège',
    famille: 'moyens',
    porteurs: ['HCSP (recommandation 6)', 'Cnesco', 'associations de corps d’inspection'],
    perimetre: 'ministeriel',
    cout: 0.41, coutETP: 3200, pol: 5,
    theme: 'accompagnement', once: true, reforme: true,
    decouverte: { si: 'apres_un_an' },
    vitrine: { parents: 0, enseignants: +6, presse: 0, compteurs: { sante: +3 } },
    reel: [
      { compteur: 'reussite', central: 8, delai: 5, cadenas: 4, source: 'HCSP 2026 : les inspections, malgré leurs limites, ont un effet mesurable sur la capacité des enseignants à faire progresser leurs élèves' },
      { compteur: 'sante',    central: 6, delai: 3, cadenas: 3, source: 'HCSP 2026 : un inspecteur pour 280 enseignants au primaire, 240 au collège, et aucun équivalent des conseillers pédagogiques dans le second degré' },
    ],
    physique: { adhesion: +6 },
    preuve: 'Le rapport du HCSP identifie là un angle mort du système : on compte un inspecteur pour 280 enseignants dans le premier degré et un pour 240 dans le second, et les inspecteurs, accaparés par la mise en œuvre des réformes, se sont éloignés des classes. Or confondre celui qui évalue et celui qui accompagne rend le second rôle presque impossible à tenir. Le second degré n’a même pas d’équivalent des conseillers pédagogiques de circonscription.',
    ideeRecue: '« Les profs ne veulent pas qu’on entre dans leur classe. » Ce qu’ils refusent, c’est le jugement. L’observation entre pairs, elle, est la pratique la plus rare en France et l’une des mieux corrélées à l’efficacité ailleurs, et là où elle a été organisée, elle a été adoptée.',
    mot: "Il n'y a pas de mot pour cette carte : elle est ennuyeuse, invisible, et probablement la plus efficace de la page.",
  },

  /* ----------------------------- 58 · autonomie ----------------------- */
  {
    id: 'coordination_pedago',
    label: 'Reconnaître la coordination pédagogique : décharges, certification, adjoint pédagogique au collège',
    famille: 'autonomie',
    porteurs: ['HCSP (recommandation 7)', 'chefs d’établissement', 'une partie des équipes'],
    perimetre: 'ministeriel',
    cout: 0.36, coutETP: 2400, pol: 4,
    theme: 'coordination', once: true, excl: 'gouvernance', reforme: true,
    decouverte: { si: 'apres_un_an' },
    vitrine: { parents: 0, enseignants: +4, presse: +1, compteurs: { sante: +3 } },
    reel: [
      { compteur: 'reussite', central: 6, delai: 5, cadenas: 3, source: 'HCSP 2026 : le pilotage pédagogique de proximité, appuyé sur les évaluations nationales, est jugé indispensable' },
      { compteur: 'sante',    central: 4, delai: 3, cadenas: 3, source: 'HCSP 2026 : l’autonomie pédagogique est vécue en France comme individuelle, jamais comme collective' },
    ],
    physique: { adhesion: +4 },
    preuve: 'Le HCSP formule le diagnostic en une phrase : « dans un système où les difficultés sont perçues comme individuelles, les réponses le sont aussi. » Il propose de reconnaître les fonctions de coordination, organiser les temps entre collègues d’une discipline ou d’un cycle, faire vivre les résultats des évaluations nationales, monter des formations, par des certifications, des indemnités plus substantielles et des décharges. Au collège, la fonction pourrait revenir à un adjoint du principal dont ce serait la mission principale.',
    ideeRecue: '« Il y a déjà des coordonnateurs de discipline. » Il y a des indemnités et des bonnes volontés. Il n’y a ni temps garanti, ni formation, ni légitimité, c’est-à-dire aucune des trois conditions pour que la fonction existe autrement que sur le papier.',
    mot: "Créer un chef pédagogique dans un établissement français : ce qui, vu de l'étranger, s'appelle simplement « un établissement ».",
  },

  /* ----------------------------- 59 · moyens -------------------------- */
  {
    id: 'ors_college',
    label: 'Inscrire formation et animation pédagogique dans les obligations de service au collège',
    famille: 'moyens',
    porteurs: ['HCSP (recommandation 8)', 'commission Thélot (2004)', 'rapport Joxe (1972)'],
    contre: ['toucher aux obligations de service, c’est toucher au statut : l’intersyndicale s’y oppose en bloc'],
    perimetre: 'ministeriel',
    cout: 0.52, coutETP: 0, pol: 8,
    theme: 'ors', once: true, reforme: true,
    decouverte: { si: 'apres_un_an' },
    vitrine: { parents: +2, enseignants: -4, presse: +3, compteurs: { sante: +2 } },
    reel: [
      { compteur: 'sante',    central: 7, delai: 4, cadenas: 3, source: 'HCSP 2026 : le premier degré sanctuarise 18 h de formation et d’animation pédagogique ; le second degré n’identifie aucun temps dédié' },
      { compteur: 'reussite', central: 5, delai: 6, cadenas: 3, source: 'HCSP 2026 : 56 % des modules de formation suivis dans le premier degré en 2023-2024 l’ont été dans le cadre de l’animation pédagogique' },
    ],
    physique: { adhesion: -2 },
    greve: { intensite: 4, theme: 'statut', segment: 'college' },
    preuve: 'Le professeur des écoles a 24 heures d’enseignement plus 108 heures annualisées, dont 18 pour la formation et l’animation pédagogique : un temps sanctuarisé, et 56 % des formations suivies dans le premier degré passent par là. Le certifié a 18 heures devant élèves et rien d’autre de compté, la formation continue y est obligatoire sans temps identifié. Il ne s’agit pas d’allonger le temps de travail, qui ne se résume pas aux heures de cours, mais de rendre le travail collectif possible, visible et valorisable.',
    ideeRecue: '« Les profs du secondaire refusent depuis toujours d’être présents davantage. » La commission Thélot proposait en 2004 d’allonger la présence de 4 à 8 heures contre rémunération, sans obligation pour les enseignants en poste. La proposition est restée lettre morte, mais elle n’a jamais été mise aux voix.',
    mot: "Le premier degré a un temps de formation dans son statut. Le second n'en a pas. Cinquante ans que c'est ainsi, et cinquante ans que chaque ministre découvre pourquoi.",
  },

  /* ----------------------------- 60 · parcours ------------------------ */
  {
    id: 'semaine_45',
    label: 'Revenir à la semaine de quatre jours et demi à l’école',
    famille: 'parcours',
    porteurs: ['HCSP (recommandation 11)', 'chronobiologistes', 'Académie de médecine'],
    contre: ['les communes, qui financent le périscolaire', 'une majorité de familles et d’enseignants attachés au mercredi'],
    perimetre: 'matignon',
    cout: 0.42, coutETP: 0, pol: 10,
    theme: 'rythmes', once: true, excl: 'calendrier', reforme: true,
    decouverte: { si: 'apres_un_an', note: 'La question des rythmes scolaires remonte : la France est le seul pays de l’OCDE où la semaine de quatre jours est majoritaire.' },
    vitrine: { parents: -9, enseignants: -7, presse: +6, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 7, delai: 5, cadenas: 2, source: 'HCSP 2026 : 93 % des communes en semaine de quatre jours, cas unique dans l’OCDE ; journées d’école exceptionnellement longues' },
      { compteur: 'sante',    central: 2, delai: 4, cadenas: 2, source: 'l’effet passe par le sommeil et la fatigue, mieux documentés que l’effet direct sur les acquis' },
    ],
    physique: {},
    greve: { intensite: 4, theme: 'statut', segment: '1erdegre' },
    preuve: 'La France est le seul pays de l’OCDE où la majorité des écoles (93 % des communes) organise les cours sur quatre jours ; ailleurs, la règle est quatre jours et demi ou cinq. Avec 864 heures annuelles en élémentaire contre 730 en moyenne européenne, la conséquence arithmétique est connue : des journées d’école parmi les plus longues du monde développé. Le HCSP recommande le retour à quatre jours et demi au minimum, en tenant compte des contraintes des familles et des enseignants.',
    ideeRecue: '« On a déjà essayé, ça n’a pas marché. » La réforme de 2013 a échoué sur son financement et sa méthode (le périscolaire à la charge des communes, sans moyens ni concertation) et non sur son diagnostic, qui n’a jamais été contesté par les chronobiologistes. C’est la mise en œuvre qui a été abandonnée, pas la question.',
    mot: "Deux ministres s'y sont brûlés en dix ans. Le rapport le redemande quand même, ce qui en dit long sur la solidité du diagnostic, et sur le peu de poids qu'a un diagnostic.",
  },

  /* ----------------------------- 61 · moyens -------------------------- */
  {
    id: 'specialisation_pe',
    label: 'Expérimenter la spécialisation certifiée des professeurs des écoles',
    famille: 'moyens',
    porteurs: ['HCSP (recommandation 9)'],
    contre: ['la polyvalence est un principe fondateur du métier : y toucher inquiète bien au-delà des syndicats'],
    perimetre: 'ministeriel',
    cout: 0.24, coutETP: 600, pol: 6,
    theme: 'polyvalence', once: true, reforme: true,
    decouverte: { si: 'reussite_basse' },
    vitrine: { parents: +1, enseignants: -3, presse: +2, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 7, delai: 5, cadenas: 2, source: 'HCSP 2026 : les enseignants du premier degré se disent souvent peu à l’aise en sciences, et moins qu’en mathématiques' },
      { compteur: 'sante',    central: 3, delai: 4, cadenas: 2, source: 'HCSP 2026 : la spécialisation ouvre des trajectoires professionnelles dans un métier à progression uniforme' },
    ],
    physique: { adhesion: -2, affection: +2 },
    greve: { intensite: 2, theme: 'statut', segment: '1erdegre' },
    preuve: 'Le professeur des écoles est réputé parfaitement polyvalent ; au collège, on n’enseigne qu’une discipline. Le HCSP note que cette frontière n’a rien d’évident, et propose (sans remettre en cause le principe général) d’expérimenter des spécialisations reconnues par une certification, par cycle d’apprentissage ou par discipline, susceptibles d’évoluer en cours de carrière. Le déficit est documenté : en CM1, 47 heures de sciences déclarées pour 72 recommandées.',
    ideeRecue: '« La polyvalence, c’est ce qui fait la force de l’école primaire française. » C’est surtout une organisation, née d’une histoire, et que presque aucun de nos voisins ne pousse aussi loin. Elle suppose qu’un même adulte soit également compétent en lecture, en géométrie, en sciences expérimentales et en éducation musicale, pour vingt-quatre heures par semaine devant vingt et un élèves.',
    mot: "Toucher à la polyvalence du professeur des écoles, c'est toucher à 1882. Le rapport le propose « à titre expérimental », ce qui est la formule administrative pour « nous savons ce que nous demandons ».",
  },

  /* ----------------------------- 62 · autonomie ----------------------- */
  {
    id: 'manuels',
    label: 'Évaluation publique de la qualité des manuels du primaire',
    famille: 'autonomie',
    porteurs: ['HCSP (recommandation 10)', 'précédents portugais et japonais'],
    contre: ['les éditeurs scolaires', 'les organisations syndicales, qui y voient une atteinte à la liberté pédagogique'],
    perimetre: 'ministeriel',
    cout: 0.07, coutETP: 150, pol: 6,
    theme: 'manuels', once: true, reforme: false,
    decouverte: { si: 'apres_un_an' },
    vitrine: { parents: +4, enseignants: -5, presse: +4, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 6, delai: 4, cadenas: 3, source: 'HCSP 2026 : pour certains apprentissages fondamentaux, les manuels dictent largement les pratiques des enseignants' },
      { compteur: 'egalite',  central: 3, delai: 5, cadenas: 2, source: 'l’effet passe par les classes où le manuel tient lieu de progression, plus fréquentes là où l’accompagnement manque' },
    ],
    physique: { adhesion: -4 },
    greve: { intensite: 3, theme: 'pedagogie', segment: '1erdegre' },
    preuve: 'Les enquêtes en classe montrent que, pour les apprentissages fondamentaux au moins, le manuel dicte largement la pratique, or leur qualité et leur orientation didactique sont très variables, et la France est l’un des rares pays sans aucune certification. Le HCSP écarte la labellisation, à laquelle éditeurs et syndicats s’opposent frontalement, et propose une information qualitative publique par une commission de spécialistes et d’enseignants : place réservée aux domaines du programme, exactitude des définitions, conformité aux connaissances scientifiques, qualité des exercices, approche didactique servie.',
    ideeRecue: '« Un ministre n’a pas à dire aux enseignants quel manuel choisir. » Il ne le dit pas : il publie ce qu’un manuel contient. C’est le refus même de publier cette information qui est une position, et elle n’est défendue nulle part au nom de l’intérêt des élèves.',
    mot: "Informer sur le contenu d'un manuel scolaire : on croirait une mesure sans adversaire. Elle en a deux, et ils sont organisés.",
  },

  /* ----------------------------- 63 · moyens -------------------------- */
  {
    id: 'sciences_primaire',
    label: 'Plan sciences à l’école : horaire garanti et formation des maîtres',
    famille: 'moyens',
    porteurs: ['HCSP', 'Académie des sciences', 'La main à la pâte'],
    perimetre: 'ministeriel',
    cout: 0.26, coutETP: 800, pol: 3,
    theme: 'sciences', once: true, reforme: true,
    decouverte: { si: 'reussite_basse' },
    vitrine: { parents: +3, enseignants: +1, presse: +3, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 7, delai: 5, cadenas: 3, source: 'HCSP 2026 : 47 h de sciences déclarées en CM1 pour 72 h recommandées, contre 58 h dans l’Union européenne' },
      { compteur: 'sante',    central: 2, delai: 4, cadenas: 2, source: 'le vivier de recrutement en physique-chimie au collège est jugé très fragile : peu de candidats, postes non pourvus, recours aux contractuels' },
    ],
    physique: { hna: { delta: +0.4, duree: 2 }, adhesion: +2 },
    preuve: 'C’est la seule discipline où le volume horaire est vraiment en cause : les enseignants déclarent 47 heures annuelles de sciences en CM1 pour 72 recommandées, soit un déficit de 35 %, quand leurs homologues européens en déclarent 58. Les enseignants du premier degré se disent souvent peu à l’aise avec cet enseignement, moins qu’avec les mathématiques. Le rapport pointe aussi que la promotion des démarches d’investigation, utiles pour l’intérêt des élèves, a pu se faire au détriment de l’acquisition des concepts fondamentaux.',
    ideeRecue: '« Les sciences, ça s’apprend au collège. » Les écarts observés à TIMSS existent déjà en CM1, et la France est le pays où l’horaire réel s’écarte le plus de l’horaire prescrit. Ce qui n’est pas enseigné à l’école n’est pas rattrapé ensuite : c’est reporté sur des professeurs de physique-chimie qu’on ne parvient déjà plus à recruter.',
    mot: "Trente-cinq pour cent de l'horaire officiel simplement absent des emplois du temps. Personne ne l'a décidé ; c'est ce qui rend la chose difficile à corriger.",
  },

  /* ----------------------------- 64 · moyens -------------------------- */
  {
    id: 'calcul_automatismes',
    label: 'Techniques opératoires et automatismes : rétablir l’entraînement en calcul',
    famille: 'moyens',
    porteurs: ['HCSP', 'Conseil scientifique de l’éducation nationale', 'programmes 2025'],
    perimetre: 'ministeriel',
    cout: 0.14, coutETP: 0, pol: 3,
    theme: 'calcul', once: true, reforme: true,
    decouverte: { si: 'reussite_basse' },
    vitrine: { parents: +6, enseignants: -2, presse: +4, compteurs: { reussite: +3 } },
    reel: [
      { compteur: 'reussite', central: 7, delai: 4, cadenas: 3, source: 'HCSP 2026 : la moindre importance accordée aux techniques opératoires explique une part de la baisse des résultats en calcul en fin d’élémentaire' },
      { compteur: 'egalite',  central: 4, delai: 5, cadenas: 2, source: 'l’automatisation libère la mémoire de travail pour le raisonnement, bénéfice plus net pour les élèves les plus fragiles' },
    ],
    physique: {},
    preuve: 'Le volume horaire de mathématiques n’est pas en cause : les élèves français reçoivent près de 1 450 heures entre 6 et 14 ans, pour une moyenne internationale de 1 100. Le HCSP désigne trois autres causes : la moindre place accordée aux techniques opératoires, qui explique une partie de la baisse en calcul ; l’introduction longtemps trop tardive des décimaux et des fractions, avancée en CE1 dans les derniers programmes ; et la rareté de l’enseignement explicite de la résolution de problèmes ouverts, introduit au cycle 3 en 2025.',
    ideeRecue: '« Poser une division, c’est du par-cœur, l’essentiel est de comprendre. » Les deux ne s’opposent pas : l’automatisation libère la mémoire de travail, sans quoi l’élève dépense en calcul l’attention qu’il devrait consacrer au raisonnement. C’est l’un des rares points où les neurosciences cognitives et les enseignants les plus traditionnels tombent d’accord.',
    mot: "La seule carte qui plaise à la fois au Conseil scientifique et à votre grand-oncle. Profitez-en, cela n'arrivera plus.",
  },

  /* ----------------------------- 65 · autorite ------------------------ */
  {
    id: 'ia_cadre',
    label: 'Cadre national d’usage de l’intelligence artificielle en classe',
    famille: 'autorite',
    porteurs: ['HCSP (point de vigilance)', 'filière EdTech française', 'inspection générale'],
    contre: ['ceux qui trouvent qu’on va trop vite', 'ceux qui trouvent qu’on va trop lentement, souvent dans la même réunion'],
    perimetre: 'ministeriel',
    cout: 0.22, coutETP: 400, pol: 4,
    theme: 'ia', once: true, excl: 'numerique_educ', reforme: true,
    decouverte: { annee: 3, note: 'Les usages « sauvages » de l’intelligence artificielle explosent chez les élèves comme chez les enseignants. On vous demande un cadre.' },
    vitrine: { parents: +5, enseignants: +3, presse: +6, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 3, delai: 5, cadenas: 1, source: 'HCSP 2026 : outils expérimentés à grande échelle avec des résultats encourageants, mais évolutions trop rapides pour une preuve établie' },
      { compteur: 'egalite',  central: -2, delai: 5, cadenas: 1, source: 'HCSP 2026 : le renforcement des inégalités figure parmi les risques identifiés, au même titre que la « spoliation cognitive »' },
    ],
    physique: { adhesion: +2 },
    preuve: 'Le HCSP classe l’intelligence artificielle parmi ses points de vigilance, pas parmi ses recommandations, et la nuance est le message. Les usages se développent massivement et sans cadre, chez les élèves comme chez les enseignants ; des outils issus de la filière EdTech française sont expérimentés à grande échelle avec des résultats encourageants. Mais quatre risques sont explicitement nommés : la « spoliation cognitive » si l’IA prend en charge la réflexion à la place de l’élève, l’hyperpersonnalisation doublée d’un contrôle excessif, le renforcement des inégalités, et les questions éthiques, juridiques et environnementales.',
    ideeRecue: '« Interdire, ou généraliser. » Le rapport ne tranche ni dans un sens ni dans l’autre, et c’est un choix argumenté : les évolutions sont trop rapides pour qu’une preuve solide existe, et un cadre qui se contenterait d’interdire serait contourné dans l’heure. Un cadenas sur les acquis : le jeu vous laisse la prendre, il ne vous promet rien.',
    mot: "Vous légiférez sur une technologie qui aura changé deux fois avant la publication du décret. C'est aussi ce que fera votre successeur.",
  },

  /* ======================================================================
     EXTENSION DU CATALOGUE, cartes 66 et 67 (leçons internationales)
     Deux enseignements que la comparaison internationale documente mieux que
     l'expérience française : ce qu'un plan territorial intensif peut produire
     (Londres, 2003-2011), et ce que coûte de ne pas consolider (France, 2015).
     ====================================================================== */

  /* ----------------------------- 66 · moyens -------------------------- */
  {
    id: 'plan_territorial',
    label: 'Plan territorial intensif sur trois académies en difficulté',
    famille: 'moyens',
    porteurs: ['précédent du London Challenge (2003-2011)', 'recteurs', 'Ofsted (évaluation)'],
    contre: ['les académies non retenues, qui compteront les moyens qu’elles n’ont pas eus'],
    perimetre: 'ministeriel',
    cout: 0.47, coutETP: 1400, pol: 5,
    theme: 'territorial', once: true, reforme: true,
    decouverte: { si: 'apres_un_an', note: 'Le rapport d’évaluation du London Challenge circule au cabinet. Il pose une question simple : et si l’on concentrait ?' },
    vitrine: { parents: +2, enseignants: +3, presse: +2, compteurs: { egalite: +3 } },
    reel: [
      { compteur: 'egalite',  central: 9, delai: 5, cadenas: 4, source: 'London Challenge : les autorités du centre de Londres passent des pires aux meilleures performances nationales, y compris pour les élèves très défavorisés' },
      { compteur: 'reussite', central: 4, delai: 6, cadenas: 3, source: 'Ofsted attribue le succès à la clarté du but, à la constance du suivi et à des conseillers chevronnés affectés aux établissements en difficulté' },
    ],
    physique: { adhesion: +3 },
    preuve: 'Lancé en 2003, le London Challenge a fait passer les autorités locales du centre de Londres des pires aux meilleures performances nationales, avec des progrès substantiels pour les élèves très défavorisés et dans tous les groupes ethniques. Quatre ingrédients identifiés : le programme lui-même, l’appui renforcé de certaines autorités locales, de nouvelles formes de gouvernance, et surtout des conseillers expérimentés et crédibles affectés aux établissements en difficulté, financés directement par le ministère. Nuance honnête : plusieurs stratégies nationales étaient déployées en même temps, et la contribution propre du programme reste difficile à isoler.',
    ideeRecue: '« Ce qui marche à Londres marchera partout. » L’exportation du modèle hors de Londres s’est révélée bien plus complexe que sa réussite. Et pour vous, le piège est ailleurs : un effet fort mais local ne déplace presque pas les compteurs nationaux. Vous ferez très bien, et vos indicateurs ne le diront pas.',
    mot: "Le cas de réussite le mieux documenté du monde, et le plus frustrant à jouer : ça marche, et personne ne le voit à l'échelle du pays.",
  },

  /* ----------------------------- 67 · autonomie ----------------------- */
  {
    id: 'loi_programmation',
    label: 'Inscrire votre réforme dans une loi de programmation pluriannuelle',
    famille: 'autonomie',
    porteurs: ['précédent des lois de programmation militaire et de la recherche', 'Michel Barnier (pacte pluriannuel)', 'organisations syndicales, pour la visibilité'],
    contre: ['Bercy, qui déteste engager les budgets de ses successeurs', 'Matignon, qui déteste occuper le calendrier parlementaire'],
    perimetre: 'matignon',
    cout: 0.18, coutETP: 0, pol: 12,
    theme: 'programmation', once: true, reforme: false,
    decouverte: { annee: 2, note: 'Le cabinet vous rappelle qu’un décret se défait par décret. Une loi, non.' },
    vitrine: { parents: +2, enseignants: +5, presse: +3, compteurs: { paix: +3 } },
    reel: [
      { compteur: 'paix',     central: 5, delai: 2, cadenas: 3, source: 'la visibilité pluriannuelle est la contrepartie que les organisations demandent le plus constamment' },
      { compteur: 'sante',    central: 4, delai: 4, cadenas: 3, source: 'l’instabilité des dispositifs est citée par les enseignants de collège avant la discipline en classe comme source de stress' },
    ],
    physique: { adhesion: +5 },
    preuve: 'La réforme du collège de 2015 a été préparée deux ans, appliquée une année, puis partiellement abrogée par décret dès l’arrivée du ministre suivant : les enseignements pratiques interdisciplinaires, cœur du dispositif, sont devenus facultatifs, ce qui les a tués sans les supprimer. Sept ministres se sont succédé depuis 2022. Une loi de programmation ne se défait pas d’un trait de plume : elle coûte du capital politique et du temps parlementaire, et c’est exactement ce qu’elle achète.',
    ideeRecue: '« L’essentiel est de faire la réforme ; on verra bien ensuite. » C’est le raisonnement de tous vos prédécesseurs, et il explique pourquoi trois réformes majeures sur quatre ont été abrogées ou vidées en dix ans. Sans consolidation, une part importante de ce que vous aurez semé sera arrachée par le suivant, et le jeu vous le montrera à la projection de fin.',
    mot: "Douze points de capital pour que votre successeur ne puisse pas vous effacer d'un décret. C'est cher. C'est le seul achat du catalogue qui porte sur l'après.",
  },

  /* ----------------------------- 68 · autonomie ----------------------- */
  {
    id: 'trace_ecrite',
    label: 'La leçon se copie à la main : fin de la photocopie comme trace écrite',
    famille: 'autonomie',
    porteurs: ['IGÉSR (mission sur l’enseignement en cours moyen)', 'rapport Villani-Torossian', 'HCSP 2026'],
    contre: ['les organisations syndicales, au nom de la liberté pédagogique', 'une partie des équipes, qui y voit un retour en arrière'],
    perimetre: 'ministeriel',
    cout: 0.04, coutETP: 0, pol: 5,
    theme: 'pedagogie', once: true, reforme: false,
    decouverte: { si: 'apres_un_an', note: 'Une note d’inspection remonte : dans beaucoup de cahiers de cours moyen, la leçon est une photocopie collée.' },
    vitrine: { parents: +5, enseignants: -4, presse: +3, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 3, delai: 3, cadenas: 2, source: 'IGÉSR : la copie manuscrite de la leçon favorise l’institutionnalisation des connaissances, que la photocopie collée court-circuite' },
    ],
    physique: { adhesion: -3 },
    greve: { intensite: 2, theme: 'pedagogie', segment: '1erdegre' },
    preuve: 'La mission d’inspection consacrée à l’enseignement en cours moyen relève un recours massif et excessif aux photocopies : elles servent de support d’exercices, mais font aussi office de leçon. « Trop souvent les traces écrites sont de simples photocopies collées dans le cahier ou glissées dans un porte-vue, laissant penser que les élèves n’ont pas été directement impliqués dans leur construction, ce qui risque de nuire à leur appropriation des connaissances. » La phase d’institutionnalisation des savoirs s’en trouve fortement réduite ; elle est mieux servie par la copie à la main dans le cahier de leçon. Le rapport Villani-Torossian recommandait déjà de redonner sa place au cours structuré et à la trace écrite. Le niveau de preuve reste modeste : ce sont des observations de classe et un raisonnement didactique, pas un essai contrôlé.',
    ideeRecue: '« Interdire les textes à trous, ça ne coûte rien et ça règle le problème. » Cela ne coûte effectivement rien, et c’est bien ce qui doit vous alerter : une circulaire ne s’applique pas dans une salle de classe où personne ne vient la vérifier. La seule chose qu’un ministre puisse acheter ici, c’est l’adhésion des équipes, et cette mesure la fait baisser. Vous êtes en train d’acheter un effet avec la monnaie qui le produit.',
    mot: "Le ministre peut imprimer une circulaire. Il ne peut pas inspecter une photocopieuse. Bienvenue rue de Grenelle.",
  },

  /* ----------------------------- 69 · autonomie ----------------------- */
  {
    id: 'explicite_partout',
    label: 'Généraliser l’enseignement explicite, du CP à la troisième',
    famille: 'autonomie',
    porteurs: ['Conseil scientifique de l’éducation nationale', 'HCSP 2026', 'nouveaux programmes de cycle 2'],
    contre: ['une partie des formateurs, attachés aux démarches de découverte', 'les organisations syndicales, sur la prescription des méthodes'],
    perimetre: 'ministeriel',
    cout: 0.34, coutETP: 0, pol: 9,
    theme: 'pedagogie', once: true, excl: 'doctrine_pedago', reforme: true,
    decouverte: { annee: 2, note: 'Les nouveaux programmes de cycle 2 valorisent déjà l’enseignement explicite. Reste à l’étendre, et à former.' },
    vitrine: { parents: +3, enseignants: -2, presse: +2, compteurs: { reussite: +2 } },
    reel: [
      { compteur: 'reussite', central: 7, delai: 4, cadenas: 4, source: 'HCSP 2026 : l’enseignement explicite est valorisé dans les nouveaux programmes conformément aux résultats de la recherche, qui ont prouvé son efficacité' },
      { compteur: 'egalite',  central: 4, delai: 5, cadenas: 3, source: 'l’explicitation des attendus profite d’abord aux élèves qui ne trouvent pas le code scolaire à la maison' },
    ],
    physique: { adhesion: -2 },
    preuve: 'Enseigner explicitement une procédure, énoncer ce qu’il faut mémoriser, lister les faits numériques attendus, faire de la résolution de problèmes un objet d’enseignement en soi et non seulement un moyen de donner du sens : c’est l’orientation retenue par les nouveaux programmes de mathématiques du cycle 2 et par ceux de français en grammaire, orthographe et vocabulaire. Le HCSP relève que cette efficacité est établie par la recherche. Signal convergent dans TIMSS : le décrochage des élèves français porte autant, et parfois plus, sur les domaines « connaître » et « appliquer » que sur « raisonner ».',
    ideeRecue: '« L’enseignement explicite, c’est le retour du par cœur. » Non : c’est dire à voix haute ce que l’école attend, au lieu de laisser les élèves le deviner. Les enfants qui le devinent sans qu’on le dise sont ceux à qui on l’a dit ailleurs. Ce qui se joue là n’est pas un débat de méthode, c’est une question d’égalité.',
    mot: "Sept points documentés, quatre cadenas de preuve, et un mandat entier de formation continue pour les obtenir. Le meilleur rapport qualité-prix du catalogue, si vous tenez trois ans.",
  },

  /* ----------------------------- 70 · parcours ------------------------ */
  {
    id: 'taches_complexes',
    label: 'Investir dans les démarches d’investigation et les tâches complexes',
    famille: 'parcours',
    porteurs: ['une part importante des formateurs et des inspections pédagogiques', 'la gauche parlementaire', 'les programmes de 2015'],
    contre: ['le Conseil scientifique de l’éducation nationale', 'HCSP 2026 (point de vigilance)'],
    perimetre: 'ministeriel',
    cout: 0.30, coutETP: 0, pol: 7,
    theme: 'pedagogie', once: true, excl: 'doctrine_pedago', reforme: true,
    decouverte: { annee: 2 },
    vitrine: { parents: +2, enseignants: +6, presse: +2, compteurs: { reussite: +2, sante: +1 } },
    reel: [
      { compteur: 'sante',    central: 3, delai: 2, cadenas: 2, source: 'les démarches d’investigation sont utiles pour susciter l’intérêt des élèves et sont plébiscitées par les équipes qui les pratiquent' },
      { compteur: 'reussite', central: -2, delai: 4, cadenas: 2, source: 'HCSP 2026 : leur promotion a pu se faire au détriment de l’acquisition et de la mémorisation des concepts fondamentaux' },
    ],
    physique: { adhesion: +6 },
    preuve: 'Les démarches d’investigation, les tâches complexes et les activités interdisciplinaires ont une vertu documentée : elles suscitent l’intérêt et l’engagement, et les équipes qui les pratiquent y tiennent. Le HCSP en fait aussi un point de vigilance : elles visent à « faire » et ne permettent pas forcément « d’apprendre » ; chez certains enseignants, le cours structuré a quasiment disparu, et leur promotion a pu se faire au détriment de l’acquisition et de la mémorisation des concepts fondamentaux. Elles exigent en outre une maîtrise technique élevée, donc de la formation : sans elle, on obtient l’inconvénient sans l’avantage.',
    ideeRecue: '« C’est la pédagogie moderne contre la pédagogie du siècle dernier. » Le jeu ne tranche pas ce débat-là, et personne ne devrait le trancher en meeting : cette carte a un effet positif documenté sur l’engagement et un effet négatif documenté sur les acquis, tous deux à deux cadenas. Vous n’achetez pas une doctrine, vous achetez un arbitrage, et vous le découvrirez au bilan comme tout le reste.',
    mot: "La mesure la plus aimée des salles des professeurs, et la seule du catalogue qui porte un effet négatif assumé sur la réussite. Les deux sont vrais en même temps.",
  },
];

/* --------------------------------------------------------------------------
   Cartes paramétriques : les curseurs et leurs effets différenciés.
   -------------------------------------------------------------------------- */

/* ============================================================================
   REVALORISATION, la carte la plus chiffrée du jeu             [source B.1, B.3]
   ----------------------------------------------------------------------------
   Trois curseurs indépendants : COMBIEN, COMMENT, POUR QUI.
   Toutes les conversions sont calculées par `chiffrerRevalorisation()`, que
   l'interface et le moteur appellent tous les deux, ce que le joueur lit est
   donc exactement ce qui est appliqué.

   Ancrages réels :
   - 814 927 ETP enseignants (Sénat, PLF 2026) ;
   - 1 % de point d'indice sur le périmètre EN ≈ 0,49 Md€/an (bilan social MEN) ;
   - point d'indice 4,92 €, gelé depuis juillet 2023 ;
   - rattrapage réclamé par la FSU : +20 % du point ≈ 10 Md€ pour la seule EN ;
   - CAS Pensions = 25,15 Md€ pour 58,4 Md€ de masse salariale, soit +43 % :
     c'est le surcoût caché d'une hausse indiciaire, et la raison pour laquelle
     Bercy préfère toujours une prime ;
   - salaires effectifs vs autres diplômés du supérieur : −26 % en élémentaire,
     −18 % en collège (OCDE 2025) ; milieu de carrière −14 % vs OCDE en dix ans ;
   - pacte enseignant : 800 M€ au PLF 2025 pour ~34 % d'adhésion.
   ========================================================================== */
export const REVALORISATION = {
  montant: { min: 0.2, max: 5.0, pas: 0.1, defaut: 1.3 },   // Md€/an récurrents

  /* COMMENT on verse. Le choix de l'instrument change le coût réel, la
     durabilité et l'accueil, à euro constant. */
  instruments: {
    indiciaire: {
      label: 'Hausse du point d’indice (traitement)',
      porteurs: ['FSU', 'intersyndicale', 'PS (moyenne OCDE)'],
      facteurPosition: 1.00, adhesion: +7, bercy: -6, hna: 0, cas: true,
      note: 'Pérenne, compte pour la pension, irréversible. Entraîne mécaniquement +43 % de contribution employeur (CAS Pensions) que votre budget ne montre pas.',
      mot: 'Ce que réclament les syndicats depuis le gel de 2023. Ce que Bercy refuse depuis le gel de 2023.',
    },
    prime: {
      label: 'Prime indemnitaire reconductible',
      porteurs: ['Bercy', 'la plupart des arbitrages récents'],
      facteurPosition: 0.75, adhesion: +3, bercy: 0, hna: 0, cas: false,
      note: 'Pas de contribution pension, donc pas de surcoût caché, mais elle ne compte pas pour la retraite et un successeur peut l’arrêter d’un trait de plume.',
      mot: 'L’instrument préféré de tous les ministères du Budget depuis vingt ans. Il y a une raison : ce qui n’est pas indiciaire n’est pas définitif.',
    },
    pacte: {
      label: 'Rémunération contre missions supplémentaires (« pacte »)',
      porteurs: ['Gabriel Attal (« choc des savoirs », décembre 2023)', 'la droite parlementaire'],
      facteurPosition: 0.45, adhesion: -2, bercy: +4, hna: -0.6, cas: false,
      note: 'Vous budgétez la totalité, un tiers seulement la touche : 800 M€ au PLF 2025 pour ~34 % d’adhésion. Ceux qui sont épuisés ne prennent pas de mission de plus.',
      mot: 'Payer du travail supplémentaire plutôt que le travail existant. Comptablement élégant, humainement discuté.',
    },
  },

  /* POUR QUI. Concentrer multiplie l'effet par tête, et le ressentiment
     de ceux qu'on ne cible pas. */
  cibles: {
    debuts: {
      label: 'Début de carrière (moins de 15 ans d’ancienneté)',
      part: 0.38, adhesion: +2, attractivite: +9,
      note: 'La cible déjà retenue par les revalorisations de 2023. C’est le salaire d’entrée que regarde un étudiant qui hésite à passer le concours.',
      reel: [{ compteur: 'sante', central: 6, delai: 1, cadenas: 4, source: 'effet sur le vivier de candidats dès la session suivante' }],
      mot: 'Les candidats reviennent vite. Les collègues de milieu de carrière, eux, comptent leurs années.',
    },
    milieux: {
      label: 'Milieu de carrière (15 à 25 ans d’ancienneté)',
      part: 0.30, adhesion: +9, attractivite: +2,
      note: 'Le point noir documenté par l’OCDE : −14 % par rapport à la moyenne OCDE en dix ans, et 0 % d’évolution pour les expérimentés du premier degré.',
      reel: [{ compteur: 'sante', central: 7, delai: 2, cadenas: 3, source: 'OCDE 2025 : le décrochage de milieu de carrière est le principal moteur des démissions' }],
      mot: 'Aucun effet sur les concours de l’an prochain, un effet massif sur ceux qui sont déjà là.',
    },
    tous: {
      label: 'Tout le corps, uniformément',
      part: 1.00, adhesion: +4, attractivite: +4,
      note: 'Le saupoudrage : la somme divisée par 814 927 équivalents temps plein.',
      reel: [{ compteur: 'sante', central: 3, delai: 2, cadenas: 3, source: 'effet dilué : la même somme répartie sur tout le corps' }],
      mot: 'Personne n’est furieux, personne n’est content. Le degré zéro de la politique salariale, et souvent le plus sûr.',
    },
  },
};

/* Toutes les conversions, en un seul endroit : l'interface les affiche,
   le moteur les applique. */
export function chiffrerRevalorisation(montantMd, instrumentId, cibleId) {
  const I = REVALORISATION.instruments[instrumentId] || REVALORISATION.instruments.indiciaire;
  const C = REVALORISATION.cibles[cibleId] || REVALORISATION.cibles.tous;
  const m = Math.max(REVALORISATION.montant.min, Math.min(REVALORISATION.montant.max, montantMd));
  const concernes = Math.round(CADRAGE.etpEnseignants * C.part);
  return {
    montantMd: m,
    instrument: I, cible: C,
    concernes,
    euroParMois: (m * 1e9) / concernes / 12,            // brut mensuel moyen sur la cible
    pctPoint: m / CADRAGE.coutPointIndice,              // en % de point d'indice
    pctRattrapageFSU: (m / 10) * 100,                   // part des 10 Md€ réclamés
    coutAvecCAS: I.cas ? m * 1.43 : m,                  // CAS Pensions : 25,15 / 58,4
    gainPosition: m * POINTS_SALAIRE_PAR_MD * I.facteurPosition,
    echelle: m / REVALORISATION.montant.defaut,
  };
}

/* Plafond de 19 élèves par classe, la « carte à deux financements » (B.8-3).
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

/* --------------------------------------------------------------------------
   L'ÉTÉ DES CENT JOURS, dossiers de crise de la première année.
   Entre la nomination (juin 2027) et la première rentrée, le nouveau ministre
   est testé : deux crises tirées de ce vivier, à trancher dans l'instant.
   Effets volontairement modestes (c'est un apprentissage, pas un tournant) ;
   chaque option porte son décryptage, la leçon vaut plus que les points.
   -------------------------------------------------------------------------- */
export const DOSSIERS_ETE = [
  {
    id: 'canicule',
    titre: 'Canicule de juillet : des écoles à 40 °C',
    contexte: 'Une vague de chaleur précoce frappe le pays. Des centres de loisirs ferment, des vidéos de salles surchauffées circulent, et l’on vous demande, à vous qui êtes ministre depuis onze jours, « un plan national pour le bâti scolaire ».',
    options: [
      { titre: 'Annoncer un grand plan national de rénovation',
        effets: { parents: 5, capital: -6, adhesion: 0 },
        decryptage: 'L’annonce est superbe ; l’exécution appartient aux communes, départements et régions, propriétaires des murs. Vous venez de promettre le budget des autres, ils vous l’expliqueront à la rentrée, par communiqué.' },
      { titre: 'Proposer un fonds d’amorçage cofinancé avec les collectivités',
        effets: { parents: 2, capital: -1, collectivitesBonus: true },
        decryptage: 'La bonne maille juridique : l’État déclenche, le propriétaire décide. Moins spectaculaire au 20 h, réellement exécutable, c’est souvent le même arbitrage.' },
      { titre: 'Rappeler que le bâti relève des collectivités',
        effets: { parents: -5, capital: 2, adhesion: 0 },
        decryptage: 'Juridiquement exact, politiquement mortel. « Ce n’est pas moi » est la phrase la plus coûteuse du répertoire ministériel, surtout dite à des parents dont l’enfant a eu un malaise en classe.' },
    ],
  },
  {
    id: 'agression',
    titre: 'Fin août : un professeur agressé, la vidéo circule',
    contexte: 'À dix jours de la rentrée, un enseignant est agressé devant son établissement. La vidéo tourne en boucle. L’opposition dénonce, l’intersyndicale attend, et votre téléphone affiche quatorze demandes d’interview.',
    options: [
      { titre: 'Vous rendre sur place, immédiatement',
        effets: { adhesion: 4, parents: 2, capital: -2 },
        decryptage: 'La présence physique du ministre dit aux personnels « vous n’êtes pas seuls », c’est le premier facteur du moral, avant tout dispositif. Elle vous expose aussi à être pris à partie en direct : c’est le prix.' },
      { titre: 'Annoncer un plan sécurité des établissements',
        effets: { parents: 4, adhesion: -3, capital: 1 },
        decryptage: 'Répondre à un fait divers par un plan national est le réflexe le plus courant et le moins efficace : les équipes reçoivent une circulaire de plus, la situation locale reste entière.' },
      { titre: 'Activer la protection fonctionnelle et laisser la justice faire',
        effets: { adhesion: 2, parents: -2, capital: 1 },
        decryptage: 'La protection fonctionnelle est un droit : l’administration doit assistance juridique à l’agent attaqué. Réponse exacte, sobre, et jugée « froide » par le débat public, qui préfère les plans.' },
    ],
  },
  {
    id: 'manuel',
    titre: 'Polémique d’août : une page de manuel sortie de son contexte',
    contexte: 'Un extrait de manuel scolaire circule sur les réseaux, tronqué. En six heures, la polémique atteint les matinales. On exige que « le ministre retire ce manuel », que, détail, le ministère ne choisit pas.',
    options: [
      { titre: 'Demander publiquement le retrait du manuel',
        effets: { parents: 3, adhesion: -5, capital: 1 },
        decryptage: 'La polémique s’éteint en 24 heures. Le signal envoyé aux enseignants durera cinq ans : le ministère cède aux réseaux sociaux plutôt qu’il ne protège. Et le choix des manuels relève des équipes, pas de vous, vous venez d’en décider quand même.' },
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
        decryptage: 'Les familles applaudissent, les salles des professeurs entendent « ils ne sont pas exigeants ». Toute petite phrase sur l’école est un message à deux destinataires, et l’un des deux la prend toujours pour lui.' },
      { titre: '« Je fais confiance aux enseignants. »',
        effets: { adhesion: 3, parents: 0, capital: -1 },
        decryptage: 'Sobre, peu repris, pas de titre. La confiance ne fait pas de « une », c’est précisément pour ça qu’elle est rare : son rendement est réel mais différé, comme tout ce qui compte ici.' },
      { titre: '« Je me battrai pour chaque euro du budget. »',
        effets: { adhesion: 2, parents: 1, bercyMalus: true },
        decryptage: 'Bercy lit les interviews. Annoncer le rapport de force avant de l’avoir engagé, c’est payer le prix du conflit sans en avoir encore les gains, mais le message interne est entendu.' },
    ],
  },
];

/* --------------------------------------------------------------------------
   AUDIENCES SYNDICALES, un face-à-face par an avec l'organisation majoritaire.
   La question dépend du contexte (vos actes de l'année) ; les trois réponses
   suivent toujours la même grammaire (fermeté / méthode / concession) mais
   leur ACCUEIL dépend du profil de l'organisation en face. C'est la leçon :
   il n'y a pas de bonne réponse dans l'absolu, il y a une bonne réponse à
   quelqu'un.
   -------------------------------------------------------------------------- */
export const AUDIENCES = [
  {
    id: 'postes',
    quand: (s) => (s.dernierPostesRendus || 0) > 2200,
    question: (s) => `« Vous avez supprimé ${Math.round(s.dernierPostesRendus / 100) * 100} postes en janvier. Dans nos salles des professeurs, on ne parle que de ça. Vous assumez ? »`,
    reponses: [
      { type: 'ferme', titre: '« La démographie baisse. Je gère l’école, pas les symboles. »',
        mot: 'Arithmétiquement exact. Une salle des professeurs n’est pas une feuille de calcul.' },
      { type: 'methode', titre: '« Chaque poste rendu est documenté ; venez co-construire la carte de l’an prochain. »',
        mot: 'Ouvrir la cuisine de la carte scolaire : risqué, mais c’est la seule réponse qui traite la question posée.' },
      { type: 'concession', titre: '« J’entends. Je gèle les suppressions dans le premier degré l’an prochain. »',
        mot: 'Une concession annoncée en audience est une concession que Bercy découvre dans la presse. Il adore.' },
    ],
  },
  {
    id: 'salaires',
    quand: (s) => s.phys.positionSalariale < -22,
    question: () => '« Un certifié débutant gagne 1,08 SMIC. En 1980, c’était 2 SMIC. À quel niveau de déclassement comptez-vous intervenir ? »',
    reponses: [
      { type: 'ferme', titre: '« Je ne promets que ce que je peux financer. »',
        mot: 'La sincérité budgétaire, dite à des gens qui ont perdu 20 % de pouvoir d’achat en vingt ans.' },
      { type: 'methode', titre: '« Je propose un agenda social : trajectoire pluriannuelle, négociée, publiée. »',
        mot: 'Un calendrier n’est pas un chèque, mais c’est la première chose qu’on ne leur a jamais tenue.' },
      { type: 'concession', titre: '« Le prochain budget comportera une mesure salariale. Je m’y engage ici. »',
        mot: 'Vous venez d’arbitrer votre propre budget en direct. Bercy vous écoutait, comme toujours.' },
    ],
  },
  {
    id: 'remplacement',
    quand: (s) => s.phys.heuresNonAssurees > 11,
    question: (s) => `« ${Math.round(s.phys.heuresNonAssurees)} % d’heures non assurées. Les parents nous en parlent plus que nos propres adhérents. Votre plan ? »`,
    reponses: [
      { type: 'ferme', titre: '« Le remplacement de courte durée est dans les obligations de service. Je l’appliquerai. »',
        mot: 'Juridiquement fondé. C’est aussi la phrase qui a déclenché trois des cinq derniers conflits.' },
      { type: 'methode', titre: '« Brigades académiques d’abord, obligations ensuite : discutons l’ordre. »',
        mot: 'Donner avant d’exiger, la seule séquence qui ait jamais fonctionné sur ce dossier.' },
      { type: 'concession', titre: '« Je retire le volet obligations. Le remplacement sera volontaire et payé. »',
        mot: 'La paix immédiate, contre un dispositif qui ne tiendra que là où il n’était pas nécessaire.' },
    ],
  },
  {
    id: 'concours',
    quand: (s) => s.phys.couvertureConcours < 90,
    question: (s) => `« ${(100 - s.phys.couvertureConcours).toFixed(0)} % des postes non pourvus aux concours. Le métier ne fait plus envie. Qu’est-ce que vous répondez à un étudiant de licence ? »`,
    reponses: [
      { type: 'ferme', titre: '« Que c’est le plus beau métier du monde, et que les vocations se méritent. »',
        mot: 'Les vocations ne lisent pas les discours ; elles lisent les grilles indiciaires.' },
      { type: 'methode', titre: '« Qu’on le paie mieux en début de carrière et qu’on le forme sérieusement. Preuves à l’appui. »',
        mot: 'La seule réponse que le vivier entend, avec dix-huit mois de décalage, comme toujours.' },
      { type: 'concession', titre: '« Qu’il aura un prérecrutement rémunéré dès la L2. Je l’annonce devant vous. »',
        mot: 'Efficace, coûteux, et annoncé sans arbitrage préalable. Le cabinet du Budget vous appelle déjà.' },
    ],
  },
  {
    id: 'greve',
    quand: (s) => s.greves.length > 0 && s.greves[s.greves.length - 1].annee === s.annee,
    question: (s) => `« ${s.greves[s.greves.length - 1].tauxSyndicats} % de grévistes selon nous, vous en avez compté ${s.greves[s.greves.length - 1].tauxMinistere}. Au-delà des chiffres : qu’avez-vous entendu ? »`,
    reponses: [
      { type: 'ferme', titre: '« J’ai entendu une minorité mobilisée. Le pays, lui, attend des résultats. »',
        mot: 'Minorer une mobilisation devant ceux qui l’ont organisée : audacieux, au sens où l’entendait Napoléon avant la Bérézina.' },
      { type: 'methode', titre: '« J’ai entendu de la fatigue plus que de la colère. Reprenons dossier par dossier. »',
        mot: 'Nommer la fatigue plutôt que la colère : le diagnostic le plus juste, et le moins coûteux.' },
      { type: 'concession', titre: '« J’ai entendu. Je retire le point le plus contesté du texte. »',
        mot: 'Reculer après une journée réussie confirme que la journée a servi. Vous venez de financer la prochaine.' },
    ],
  },
  {
    id: 'doctrine',
    quand: () => true,
    question: (s) => `« Votre priorité affichée, c’est « ${({reussite:'la réussite des élèves',egalite:'la réduction des inégalités',sante:'la santé du système',paix:'la paix sociale',budget:'le budget et les salaires'})[s.doctrine[0]]} ». Concrètement, pour nos collègues, ça change quoi lundi matin ? »`,
    reponses: [
      { type: 'ferme', titre: '« Un cap se juge à cinq ans, pas lundi matin. »',
        mot: 'Vrai. Mais les gens qui vous font face vivent une succession de lundis matins.' },
      { type: 'methode', titre: '« Voici les trois premières mesures, leur calendrier et leur financement. »',
        mot: 'Répondre à une question par son contenu : technique sous-employée rue de Grenelle.' },
      { type: 'concession', titre: '« Dites-moi ce qui doit changer lundi, et je le mets au budget. »',
        mot: 'Le chèque en blanc rhétorique. Ils ont une liste. Elle est longue. Elle est chiffrée.' },
    ],
  },
];

/* Accueil d'une réponse selon le profil de l'organisation : multiplicateur
   appliqué aux effets sociaux, et verdict affiché. > 1 : bien pris. */
export const RECEPTION = {
  rapport_de_force: { ferme: -1.4, methode: 0.8, concession: 1.5 },
  reformiste:       { ferme: -0.6, methode: 1.5, concession: 1.0 },
  frontal:          { ferme: -1.6, methode: 0.2, concession: 1.3 },
  negociation:      { ferme: -0.8, methode: 1.7, concession: 0.9 },
  radical:          { ferme: -1.7, methode: 0.3, concession: 1.1 },
  corporatiste:     { ferme: -0.9, methode: 1.0, concession: 1.4 },
};

/* La réplique de sortie d'audience, selon le verdict. */
export const REPLIQUES = {
  bien: [
    '« Nous prenons acte. C’est un début, nous jugerons sur pièces. »',
    '« Voilà une réunion qui n’aura pas été inutile. C’est assez rare pour être noté au compte rendu. »',
  ],
  froid: [
    '« Nous transmettrons à nos instances. » (Traduction : cela ne suffira pas.)',
    '« Nous restons à votre disposition. » (Le communiqué, lui, est déjà écrit.)',
  ],
  mal: [
    '« Nos collègues apprécieront. » (Ils apprécieront en assemblée générale, avec un vote à la fin.)',
    '« Merci de votre franchise, monsieur le ministre. Elle figurera intégralement dans notre préavis. »',
  ],
};

/* ============================================================================
   LES AFFAIRES, six archétypes de polémique personnelle          [source G]
   ----------------------------------------------------------------------------
   Situations inspirées de faits publics ; les personnages sont fictifs et
   aucune affaire n'est rejouée sous le nom de qui que ce soit. Ce qu'on garde,
   c'est la FORME : le déclencheur, la cinétique, l'issue.

   Aucune de ces affaires ne fait bouger un compteur éducatif. Elles agissent
   toutes sur les trois jauges relationnelles, adhésion, crédibilité, capital.
   Un jeu qui n'aurait que des compteurs de résultats scolaires ne pourrait pas
   représenter ce qui met réellement fin aux carrières ministérielles.

   `themes` : les thèmes de mesure avec lesquels l'affaire résonne. Une carte
   jouée sur le même thème dans l'année triple la probabilité qu'elle sorte.
   ========================================================================== */
export const AFFAIRES = [
  {
    id: 'lieu',
    titre: 'Le lieu',
    manchette: 'Le ministre était en vacances quand le protocole est tombé',
    themes: ['remplacement', 'rythmes', 'ors', 'ete', 'accompagnement'],
    recit: 'Un site d’information révèle (et le ministère confirme) que vous vous trouviez à l’étranger, en congé, le soir où votre cabinet transmettait à la presse la circulaire que les équipes ont découverte le lendemain matin. Le fait est exact, il est régulier, et il est indéfendable.',
    lecon: 'On ne vous reproche pas un acte, on vous reproche un signe. La défense factuelle est solide et catégoriellement inadaptée : à un signe, on ne répond pas par un bilan.',
    reponses: [
      { type: 'assumer', label: 'Assumer sobrement : « j’ai pris trois jours, je le referais »',
        det: 'Vous ne vous excusez pas et vous ne vous justifiez pas. La séquence dure quatre jours au lieu de trois semaines.',
        adhesion: -8, credibilite: -6, capital: -3, parents: -2,
        suite: 'La formule est jugée sèche, et refermer le dossier en quatre jours est ce que personne n’avait réussi avant vous.' },
      { type: 'defendre', label: 'Se défendre sur les faits : « quelle réunion n’ai-je pas tenue ? »',
        det: 'Vous démontrez, chiffres à l’appui, qu’aucun acte n’a manqué. C’est vrai, et cela ne répond pas à la question posée.',
        adhesion: -13, credibilite: -4, capital: -2, parents: -4,
        suite: 'Vous avez raison sur les faits et tort sur le terrain. Une organisation résume le grief en une phrase que la presse reprendra tout l’hiver : pendant ce temps, les personnels, eux, font tenir l’école.' },
      { type: 'contre', label: 'Mettre en cause ceux qui ont sorti l’information',
        det: 'Vous dénoncez une campagne et une fuite organisée. C’est la réponse la plus tentante du répertoire, et la plus chère.',
        adhesion: -16, credibilite: -12, capital: -6, parents: -5,
        suite: 'La question de la fuite a désormais son propre article. L’affaire dure trois semaines de plus, et personne ne parle plus de la circulaire.' },
    ],
  },
  {
    id: 'ecole_enfants',
    titre: 'L’école de vos enfants',
    manchette: 'Les enfants du ministre scolarisés dans le privé',
    themes: ['prive', 'affectation', 'secteurs', 'carle', 'cheque', 'ghettos'],
    recit: 'La presse révèle que vos enfants sont scolarisés dans un établissement privé sous contrat. Le fait est banal, de nombreux responsables publics font ce choix sans que cela fasse chuter personne. Ce qui suivra, en revanche, ne l’est pas.',
    lecon: 'Le point de bascule n’est jamais la révélation. C’est la justification. Expliquer son choix par un défaut du service public dont on vient de prendre la tête transforme un fait privé en jugement professionnel, et cela, le corps ne le pardonne pas.',
    reponses: [
      { type: 'assumer', label: 'Assumer sobrement, sans commenter le service public',
        det: '« C’est un choix de famille, il ne dit rien de l’école publique, dont je suis le ministre. » Le dossier se referme en une semaine.',
        adhesion: -6, credibilite: -3, capital: -2, parents: 0,
        suite: 'Une semaine de commentaires, puis plus rien. C’était la seule sortie possible, et elle était disponible dès la première question.' },
      { type: 'defendre', label: 'Justifier par un manque du service public',
        det: '« Il y a des heures qui ne sont pas sérieusement remplacées. » Vous dites tout haut ce que disent les familles, sauf que vous êtes le ministre.',
        adhesion: -26, credibilite: -14, capital: -14, parents: +3, unite: true, fatal: 0.42,
        suite: 'Les sept organisations publient un communiqué commun dans la journée : elles ne s’étaient pas accordées sur une virgule depuis février. Dans l’après-midi, l’établissement que vous mettiez en cause publie les états de service des remplacements, et votre propre direction de l’évaluation confirme les chiffres. Ce n’est plus le choix d’une école qu’on vous reproche, c’est d’avoir dit quelque chose de faux pour le justifier. L’intersyndicale dépose un préavis, et Matignon ne dément pas assez vite les rumeurs de remplacement.' },
      { type: 'contre', label: 'Ne pas répondre et refuser toute question sur le sujet',
        det: 'Le silence est une position. Elle tient rarement plus de trois conférences de presse.',
        adhesion: -12, credibilite: -10, capital: -6, parents: -4,
        suite: 'La question revient à chaque point presse pendant trois mois. Elle a ouvert un dossier que le ministère ne contrôle pas : le financement du privé sous contrat, immédiatement saisi par toutes les oppositions.' },
    ],
  },
  {
    id: 'privilege',
    titre: 'Le privilège',
    manchette: 'Un traitement perçu sans service fait',
    themes: ['ors', 'evaluation_etab', 'remplacement', 'autonomie', 'recrutement_local', 'pluriannuel'],
    recit: 'Un hebdomadaire satirique révèle que vous percevez, depuis des années, le traitement attaché à un poste universitaire où vous n’assurez plus d’enseignement, au titre d’une décharge parfaitement régulière. Le montant est dérisoire à l’échelle d’un budget de 65 milliards. Ce n’est pas la question.',
    lecon: 'L’affaire est dévastatrice parce qu’elle porte exactement sur ce que le ministère demande à ses agents : faire ses heures. On n’est pas puni pour ce qu’on fait, on est puni pour l’écart entre ce qu’on exige des autres et ce qu’on s’applique à soi-même.',
    reponses: [
      { type: 'assumer', label: 'Renoncer immédiatement au poste et rembourser',
        det: 'Vous démissionnez du poste et remboursez les sommes perçues. Le geste coûte, il clôt.',
        adhesion: -5, credibilite: -4, capital: -5, parents: -1,
        suite: 'La droite parle de précipitation, la gauche de aveu. Le dossier est mort en dix jours, ce qui est le seul résultat qui compte.' },
      { type: 'defendre', label: 'Rappeler que le régime de décharge est parfaitement légal',
        det: 'Il l’est, et cela n’a jamais été démenti. Vous produisez les textes.',
        adhesion: -15, credibilite: -11, capital: -4, parents: -3,
        suite: 'Vous avez publié les textes. Une salle des professeurs a publié son emploi du temps. Les deux documents ont circulé côte à côte.' },
      { type: 'contre', label: 'Rappeler que la question du service fait se pose partout ailleurs',
        det: 'Vous élargissez le débat au service effectif dans la fonction publique. Techniquement pertinent, politiquement suicidaire.',
        adhesion: -22, credibilite: -14, capital: -8, parents: 0, unite: true,
        suite: 'Vous venez d’ouvrir, depuis la position la plus faible possible, le seul dossier sur lequel l’unité syndicale est immédiate.' },
    ],
  },
  {
    id: 'faux_nez',
    titre: 'Le faux nez',
    manchette: 'Une association d’élèves financée par le ministère, et créée par lui',
    themes: ['manuels', 'numerique_tel', 'portable', 'ia', 'uniforme', 'eval_diag'],
    recit: 'Deux rédactions révèlent qu’une association de lycéens très favorable à vos réformes, subventionnée par le ministère, aurait été suscitée par votre entourage, au moment où une organisation lycéenne historique voyait, elle, sa subvention divisée par quatre. Une enquête est ouverte, visant les dirigeants de l’association.',
    lecon: 'Ce grief-là ne relève pas de la vie privée mais du mélange des genres : l’appareil d’État et des fonds publics au service d’une communication. C’est le reproche le plus lourd du répertoire, et paradoxalement celui qui emporte le moins de ministres. On n’en tombe pas ; on y perd sa voix.',
    reponses: [
      { type: 'assumer', label: 'Suspendre la subvention et saisir l’inspection générale',
        det: 'Vous ouvrez vous-même le dossier plutôt que d’attendre qu’on vous l’ouvre.',
        adhesion: -4, credibilite: -8, capital: -6, parents: -2,
        suite: 'L’inspection travaillera huit mois. D’ici là, le sujet est administratif, ce qui est la meilleure chose qui puisse lui arriver.' },
      { type: 'defendre', label: 'Défendre le pluralisme : « toutes les associations sont soutenues »',
        det: 'Vous produisez le tableau des subventions. Il contient précisément le chiffre qui pose problème.',
        adhesion: -9, credibilite: -16, capital: -5, parents: -3,
        suite: 'Le tableau que vous avez publié est devenu l’illustration de l’article. Ce n’est pas ce que vous aviez prévu.' },
      { type: 'contre', label: 'Dénoncer une manœuvre d’organisations politisées',
        det: 'Vous mettez en cause, sur un plateau, ceux qui vous interrogent.',
        adhesion: -13, credibilite: -24, capital: -7, parents: -4,
        suite: 'Mettre en cause ceux qui posent la question a toujours le même effet : ils posent la question plus longtemps. Votre parole vaut désormais moins que le communiqué de n’importe qui.' },
    ],
  },
  {
    id: 'illegitimite',
    titre: 'L’illégitimité',
    manchette: 'Le procès en incompétence, et il n’est pas question d’école',
    themes: [],                 // ne résonne avec aucune mesure : elle est subie
    subie: true,
    recit: 'Depuis votre nomination, une partie de la presse d’opinion et des responsables politiques contestent moins vos décisions que votre droit d’occuper le poste : votre parcours, vos travaux antérieurs, vos prises de position d’avant. Aucune de vos mesures n’est discutée. C’est vous qui l’êtes.',
    lecon: 'Cette affaire-là ne récompense aucune bonne gestion et ne se réduit par aucune décision. Elle existe dans le jeu comme subie, jamais comme une carte que l’on pourrait jouer contre quelqu’un. On modélise la réalité d’une exposition ; on ne fabrique pas un simulateur de dénigrement.',
    reponses: [
      { type: 'assumer', label: 'Ne pas entrer dans le débat et rester sur les dossiers',
        det: 'Vous répondez à chaque question par une mesure. C’est fatigant, et c’est ce qui use le moins vite.',
        adhesion: -2, credibilite: -5, capital: -6, parents: -2,
        suite: 'Le flux ne s’arrête pas ; il cesse simplement de progresser. Sur ce dossier-là, c’est une victoire.' },
      { type: 'defendre', label: 'Répondre point par point, publiquement',
        det: 'Vous consacrez une conférence de presse entière à votre propre parcours.',
        adhesion: -4, credibilite: -9, capital: -10, parents: -4,
        suite: 'Vous avez passé une heure à parler de vous. C’est une heure que vous n’avez pas passée à parler d’école, et c’était exactement le but de l’exercice.' },
      { type: 'contre', label: 'Demander l’arbitrage de l’Élysée',
        det: 'Vous montez au Château chercher un soutien public. Il vient, et il a un prix.',
        adhesion: -3, credibilite: -3, capital: -12, parents: 0, captation: true,
        suite: 'Le soutien est venu, chaleureux et bref. En échange, l’Élysée annoncera lui-même votre prochaine mesure : vous en gardez le coût, il en garde le bénéfice.' },
    ],
  },
  {
    id: 'passe',
    titre: 'Votre passé',
    manchette: 'Un dossier antérieur à votre nomination refait surface',
    themes: [],
    subie: true,
    recit: 'Une commission d’enquête parlementaire s’intéresse à une fonction que vous occupiez bien avant d’être ministre, et à ce que vous saviez alors. Vous contestez. L’audition durera cinq heures et sera retransmise.',
    lecon: 'Une affaire héritée n’éjecte pas : elle fragilise. Elle abaisse le seuil de déclenchement de toutes les autres crises et elle consume l’agenda. Un cabinet d’analyse du risque politique l’a formulé mieux que personne : elle enhardit les adversaires (et les alliés supposés) à agir pour d’autres motifs.',
    reponses: [
      { type: 'assumer', label: 'Publier l’intégralité des pièces, sans attendre',
        det: 'Vous mettez tout en ligne le jour même de la convocation.',
        adhesion: -3, credibilite: -6, capital: -7, parents: -3, fragilise: 2,
        suite: 'La transparence immédiate n’a jamais éteint une commission d’enquête. Elle a souvent empêché la deuxième vague, celle des contradictions.' },
      { type: 'defendre', label: 'Répondre à l’audition en contestant point par point',
        det: 'Cinq heures d’affrontement retransmis. Vous êtes bon. Cela ne suffira pas.',
        adhesion: -5, credibilite: -10, capital: -11, parents: -5, fragilise: 3,
        suite: 'Les extraits qui circulent le lendemain ne sont pas ceux que vous auriez choisis. Ils ne le sont jamais.' },
      { type: 'contre', label: 'Dénoncer une cabale et refuser de vous expliquer davantage',
        det: 'Vous mettez en cause la commission elle-même.',
        adhesion: -8, credibilite: -18, capital: -14, parents: -7, fragilise: 5,
        suite: 'Le rapport, quand il sortira, retiendra un « défaut d’action ». D’ici là, chaque incident ordinaire de votre ministère se lira à travers ce dossier.' },
    ],
  },
  {
    id: 'image',
    titre: 'L’image',
    manchette: 'Les photos du ministre en soirée, la semaine où l’on parlait d’écrans',
    themes: ['portable', 'numerique_tel', 'uniforme', 'empathie', 'vie_scolaire'],
    recit: 'Des photographies de vous en soirée, à l’étranger, un verre à la main, circulent par centaines de milliers de reprises. Elles datent de l’été, elles sont authentiques, elles ne montrent rien d’illégal et rien d’indigne. Elles sortent la semaine où vous demandez aux adolescents de poser leur téléphone et aux familles de tenir un cadre.',
    lecon: 'Une image ne se réfute pas : elle circule. Le grief n’est pas la soirée, c’est la simultanéité, vous exigez des autres une tenue au moment précis où l’on vous regarde relâchée. Répondre sur le fond (« c’était mon congé, c’est légal ») revient à argumenter contre une photographie, exercice que personne n’a jamais gagné.',
    reponses: [
      { type: 'assumer', label: 'En rire une fois, en public, puis revenir au dossier',
        det: 'Une phrase, une seule, à la première question : « J’ai quarante-huit ans et j’ai dansé. Passons aux programmes. » Puis vous ne répondez plus jamais sur le sujet.',
        adhesion: -4, credibilite: -3, capital: -3, parents: -1,
        suite: 'La séquence dure trois jours. Les mêmes photos servent maintenant à illustrer des articles qui parlent d’autre chose, ce qui est la définition technique d’un dossier éteint.' },
      { type: 'defendre', label: 'Rappeler que c’était un congé, hors de toute fonction',
        det: 'Vous produisez les dates, la régularité du congé, l’agenda tenu à votre retour. Tout est exact.',
        adhesion: -11, credibilite: -7, capital: -5, parents: -5,
        suite: 'Votre communiqué de mise au point, sobre et daté, a été partagé quatre fois moins que la photo. Les deux figurent maintenant côte à côte dans tous les articles, et ce n’est pas le communiqué qu’on regarde.' },
      { type: 'contre', label: 'Dénoncer une intrusion dans la vie privée et saisir la justice',
        det: 'Vous portez plainte pour atteinte à la vie privée. Vous êtes probablement dans votre droit.',
        adhesion: -14, credibilite: -13, capital: -9, parents: -6,
        suite: 'La plainte a donné à l’affaire ce qui lui manquait : une suite, des dates d’audience, et un deuxième pic de diffusion. Vous avez transformé trois jours en dix-huit mois de calendrier judiciaire.' },
    ],
  },
  {
    id: 'rapport_modifie',
    titre: 'Le rapport corrigé',
    manchette: 'Un rapport d’inspection publié sans les passages qui dérangeaient',
    themes: ['prive', 'carle', 'cheque', 'evaluation_etab', 'empathie'],
    recit: 'L’inspection générale a remis un rapport sur un établissement privé sous contrat. La version rendue publique par le ministère ne contient pas les pages où les inspecteurs relevaient des propos et des situations homophobes signalés par des élèves. Les inspecteurs signataires font savoir qu’ils n’ont pas consenti à cette version. Le rapport intégral fuite en quarante-huit heures.',
    lecon: 'L’inspection générale rend ses rapports au ministre, qui décide de les publier ou non : ne rien publier était juridiquement possible. Publier une version amputée ne l’était pas, politiquement, une seule seconde. Le grief change de nature en chemin, il partait d’un établissement, il arrive sur la parole de l’État et sur des élèves qui avaient parlé.',
    reponses: [
      { type: 'assumer', label: 'Publier le rapport intégral et saisir le rectorat sur les faits',
        det: 'Vous mettez la version complète en ligne le jour même, vous demandez un rapport circonstancié au recteur et vous recevez les associations de familles. Vous ne cherchez pas qui a coupé : vous répondez de la coupe.',
        adhesion: -6, credibilite: -7, capital: -8, parents: -2,
        suite: 'Publier soi-même ce qui allait fuiter de toute façon coûte une journée. Ne pas le publier coûte le mandat. Les inspecteurs signataires ne diront plus rien publiquement, ce qui est tout ce que vous pouviez espérer.' },
      { type: 'defendre', label: 'Invoquer la protection des personnes citées dans les passages retirés',
        det: 'L’argument existe et il est parfois recevable. Il l’est nettement moins quand les personnes protégées se trouvent être les adultes, et les personnes citées les élèves.',
        adhesion: -18, credibilite: -17, capital: -9, parents: -8, unite: true,
        suite: 'La question posée dans tous les points presse est devenue : qui, au ministère, a décidé quelles pages protégeaient qui. Vous ne l’avez pas encore, la réponse, et on vous la redemandera demain.' },
      { type: 'contre', label: 'Mettre en cause la fuite et demander une enquête interne sur son origine',
        det: 'Vous faites de l’affaire une question de loyauté administrative plutôt qu’une question de contenu.',
        adhesion: -24, credibilite: -22, capital: -12, parents: -9, unite: true, fragilise: 3,
        suite: 'Le corps d’inspection s’est senti visé collectivement, et il a la mémoire longue et l’écriture précise. Vous avez fait de vos propres inspecteurs une partie adverse, au moment où vous aviez besoin d’eux sur douze autres dossiers.' },
    ],
  },
  {
    id: 'internat',
    titre: 'L’internat',
    manchette: 'Des faits de violences connus de l’administration, et jamais transmis',
    themes: ['internats', 'vie_scolaire', 'sante_mentale', 'social', 'prive'],
    recit: 'D’anciens élèves d’un internat racontent, par dizaines, des violences physiques et sexuelles subies sur plusieurs décennies. Des courriers de familles figuraient dans les archives du rectorat. Une inspection avait eu lieu. Rien n’avait été transmis au procureur de la République. Vous n’étiez pas en fonction ; les archives, elles, sont celles de votre ministère.',
    lecon: 'L’article 40 du code de procédure pénale oblige tout fonctionnaire qui acquiert la connaissance d’un crime ou d’un délit à en aviser sans délai le procureur. Ce n’est pas une faculté d’appréciation, c’est une obligation, et c’est le seul point sur lequel un ministre de l’Éducation ne dispose d’aucune marge de manœuvre politique. Il n’y a pas ici de bonne réponse peu coûteuse : il y a une réponse due, et deux façons d’aggraver.',
    reponses: [
      { type: 'assumer', label: 'Saisir le procureur, ouvrir les archives, recevoir les victimes',
        det: 'Signalement au titre de l’article 40 dans la journée, mission d’inspection sur les contrôles non faits, ouverture des archives rectorales, et vous recevez vous-même les anciens élèves, sans caméra.',
        adhesion: -3, credibilite: -6, capital: -13, parents: -3,
        suite: 'La séquence sera longue, publique et pénible, et c’était la seule ligne tenable. Ce qui a été reproché à vos prédécesseurs n’est pas d’avoir eu des établissements défaillants : c’est d’avoir su et de n’avoir rien transmis.' },
      { type: 'defendre', label: 'Rappeler l’ancienneté des faits et les contrôles réalisés depuis',
        det: 'Vous produisez le calendrier des inspections et la réforme des procédures de signalement. Les faits sont anciens, c’est vrai, et cela ne répond à aucune des questions posées.',
        adhesion: -14, credibilite: -19, capital: -16, parents: -13, unite: true, fragilise: 3,
        suite: 'Une commission d’enquête parlementaire est constituée dans le mois. Elle demandera les archives que vous n’avez pas ouvertes de vous-même, et votre audition figurera dans son rapport à la rubrique des réponses non apportées.' },
      { type: 'contre', label: 'Contester la mise en cause du ministère et parler d’instrumentalisation',
        det: 'Vous dénoncez une exploitation politique d’une souffrance réelle. C’est la seule réponse du répertoire dont on ne revient pas.',
        adhesion: -26, credibilite: -28, capital: -22, parents: -20, unite: true, fragilise: 5, fatal: 0.45,
        suite: 'Des victimes ont répondu, à visage découvert, sur toutes les chaînes, le soir même. Aucun soutien politique n’a suivi. Aucun ne pouvait suivre.' },
    ],
  },
];

export const AFFAIRE_PAR_ID = Object.fromEntries(AFFAIRES.map((a) => [a.id, a]));

/* ============================================================================
   LA BOUSSOLE : D'OÙ VIENNENT LES MESURES QU'ON PREND
   ----------------------------------------------------------------------------
   Chaque carte porte déjà, depuis le premier jour, la liste de ceux qui la
   défendent réellement dans le débat français : partis, candidats, think tanks,
   mais aussi corps d'inspection, juridictions financières, chercheurs et
   organisations professionnelles. On s'en sert ici pour une seule chose, et le
   jeu le dit sans détour : montrer au joueur, à mesure qu'il avance, de quels
   programmes ses propres décisions se rapprochent.

   Trois précautions de méthode, qui sont aussi tout l'intérêt de l'exercice :

   1. le rattachement se lit dans la carte elle-même (`porteurs`), il n'est pas
      décidé ailleurs ni ajouté après coup. Il est donc vérifiable ligne à ligne ;
   2. une même mesure est souvent portée par plusieurs bords à la fois. C'est un
      fait du débat scolaire français, pas une imprécision du jeu ;
   3. beaucoup de mesures ne sont portées par AUCUN parti : elles viennent de la
      Cour des comptes, de la DEPP, du CSEN, de l'inspection générale ou de la
      recherche. Le jeu les compte à part, et c'est probablement le chiffre le
      plus intéressant de la boussole.

   On ne dit jamais au joueur « vous êtes de tel bord ». On lui dit « ces
   mesures-là figurent aussi dans tel programme ». La conclusion lui appartient.
   ========================================================================== */

export const BLOCS_2027 = {
  gauche:   { label: 'la gauche', long: 'LFI, NFP, Parti socialiste, Place publique', coul: 'var(--c-egalite)' },
  centre:   { label: 'le centre et la majorité sortante', long: 'Gabriel Attal, Édouard Philippe, Horizons, Michel Barnier', coul: 'var(--bleu-rf)' },
  droite:   { label: 'la droite', long: 'la droite parlementaire, David Lisnard, iFRAP', coul: 'var(--c-budget)' },
  extreme:  { label: 'l’extrême droite', long: 'Rassemblement national, Reconquête', coul: 'var(--rouge-rf)' },
};

/* Fragments cherchés dans les `porteurs` d'une carte. L'ordre compte : le
   premier fragment trouvé donne le bord. Tout ce qui n'est pas ici n'est pas un
   parti, et c'est délibéré : la Cour des comptes, la DEPP, le CSEN, l'IGÉSR,
   le HCSP, l'OCDE, l'IPP, les syndicats et les fédérations de parents ne sont
   rattachés à aucun bord par le jeu. */
const RATTACHEMENTS = [
  ['La France insoumise', 'gauche'], ['Nouveau Front populaire', 'gauche'],
  ['Parti socialiste', 'gauche'], ['Place publique', 'gauche'],
  ['la gauche parlementaire', 'gauche'], ['Terra Nova', 'gauche'],
  ['Fondation Jean-Jaurès', 'gauche'], ['Glucksmann', 'gauche'],
  ['Gabriel Attal', 'centre'], ['Édouard Philippe', 'centre'], ['Horizons', 'centre'],
  ['Michel Barnier', 'centre'], ['politique engagée en 2017', 'centre'],
  ['Institut Montaigne', 'centre'],
  ['droite parlementaire', 'droite'], ['candidats de droite', 'droite'],
  ['David Lisnard', 'droite'], ['iFRAP', 'droite'],
  ['Rassemblement national', 'extreme'], ['Reconquête', 'extreme'],
];

/* Les bords qui portent cette mesure, d'après ses propres porteurs. */
export function bordsDeCarte(carte) {
  const out = new Set();
  for (const p of carte.porteurs || []) {
    for (const [frag, bord] of RATTACHEMENTS) if (p.includes(frag)) out.add(bord);
  }
  return [...out];
}

/* La boussole du mandat : sur les mesures effectivement annoncées, combien
   figurent aussi dans le programme de chaque bord, et combien ne viennent
   d'aucun parti. */
export function boussole(ids) {
  const cartes = ids.map((id) => PAR_ID[id]).filter(Boolean);
  const parBord = { gauche: [], centre: [], droite: [], extreme: [] };
  const horsPartis = [];
  for (const c of cartes) {
    const b = bordsDeCarte(c);
    if (!b.length) horsPartis.push(c.label);
    for (const x of b) parBord[x].push(c.label);
  }
  return { total: cartes.length, parBord, horsPartis };
}

/* ============================================================================
   L'ARGUMENTAIRE SYNDICAL
   ----------------------------------------------------------------------------
   Une organisation qui demande un retrait ne dit jamais « nous n'aimons pas ».
   Elle produit deux choses de nature différente, et le jeu doit apprendre à les
   distinguer, parce que c'est exactement ce qu'un lecteur de tract, de tribune
   ou de programme électoral doit savoir faire :

   - un argument ÉTAYÉ, adossé à une donnée ou au niveau de preuve de la mesure
     elle-même. Il se vérifie. Il peut être juste et non décisif ;
   - un argument DE PRINCIPE, adossé à une conception de l'école. Il ne se
     vérifie pas, ce qui ne le rend ni faux ni illégitime : une part de la
     politique scolaire est un choix de valeurs, pas un résultat d'étude.

   Le premier est fabriqué à partir des données de la carte elle-même (niveau de
   preuve, effets documentés, coût, postes) : il ne peut donc pas mentir. Le
   second dépend de la famille de la mesure et du profil de l'organisation.
   ========================================================================== */

const COMPTEURS_L = { reussite: 'la réussite des élèves', egalite: 'la réduction des inégalités', sante: 'la santé du système', paix: 'la paix sociale', budget: 'les salaires' };

const PRINCIPES_FAMILLE = {
  moyens: 'Le taux d’encadrement n’est pas une variable d’ajustement budgétaire. Une heure rendue à Bercy est une heure prise à des élèves, quelle que soit la courbe démographique qu’on nous oppose.',
  autonomie: 'L’autonomie des établissements, c’est la mise en concurrence des équipes et la fin du cadre national. Nous défendons un service public identique de Roubaix à Bayonne, pas une collection d’expérimentations locales.',
  parcours: 'Trier les élèves, même provisoirement, même avec les meilleures intentions du monde, c’est assigner. Le collège unique n’est pas un détail d’organisation : c’est une promesse républicaine.',
  autorite: 'L’école n’est pas d’abord un lieu d’ordre, c’est un lieu d’émancipation. Chaque fois qu’on a répondu à une difficulté éducative par un règlement, on a déplacé le problème et fabriqué du décrochage.',
  mixite: 'La carte scolaire est un outil d’égalité, pas une contrainte administrative à négocier établissement par établissement. On ne construit pas la mixité en demandant leur avis à ceux qui la fuient.',
};

/* Les profils les plus durs ajoutent une phrase qui, elle, est franchement une
   position politique, et le jeu le dit. */
const PRINCIPES_PROFIL = {
  frontal: 'Et disons les choses : ce gouvernement n’a aucun mandat pour toucher à l’école. Nous ne négocierons pas la mise en œuvre de ce que nous combattons sur le fond.',
  radical: 'Nous ne sommes pas là pour aménager votre réforme. Nous sommes là pour obtenir son retrait, et nous avons les moyens de l’obtenir.',
  rapport_de_force: 'Nous avons été reçus quatre fois en deux ans. Nous n’avons rien obtenu quatre fois. Vous comprendrez que la discussion ait un coût.',
};

export function argumentaireSyndical(carte, org, s) {
  const reels = carte.reel || [];
  const cadMax = Math.max(0, ...reels.map((e) => e.cadenas));
  const negatifs = reels.filter((e) => e.central < 0);
  const postes = carte.coutETP || 0;

  /* --- l'argument étayé : construit à partir de la carte, donc vérifiable --- */
  let etaye, verifiable;
  if (negatifs.length) {
    const n = negatifs[0];
    etaye = `« Votre propre chiffrage documente un effet négatif sur ${COMPTEURS_L[n.compteur] || n.compteur}, de l’ordre de ${n.central} point${n.central <= -2 ? 's' : ''} à ${n.delai} an${n.delai > 1 ? 's' : ''}. Nous ne vous demandons pas de nous croire : nous vous demandons de relire la fiche que vous avez signée. »`;
    verifiable = `Exact, et vérifiable dans le jeu : la mesure porte un effet documenté de ${n.central} sur ce compteur (${n.source}).`;
  } else if (cadMax <= 2) {
    const e = reels[0];
    etaye = `« Cette mesure repose sur ${cadMax} cadenas de preuve sur cinq. Vous engagez ${Math.round((carte.cout || 0) * 1000)} millions d’euros par an sur une hypothèse. Nous demandons une expérimentation évaluée avant toute généralisation. »`;
    verifiable = `Exact. Le niveau de preuve est effectivement de ${cadMax}/5${e ? ` (${e.source})` : ''}. C’est l’argument le plus solide de la délégation, et il ne dit pas que la mesure est mauvaise : il dit qu’on n’en sait pas assez.`;
  } else if (postes < -300) {
    etaye = `« Cette mesure rend ${Math.abs(postes).toLocaleString('fr-FR')} équivalents temps plein. Nous n’avons pas encore vu de classe où la baisse démographique ait supprimé un remplaçant. »`;
    verifiable = `Exact sur les postes. La démographie baisse réellement, mais les deux faits ne se compensent pas là où ils se produisent : le calcul est national, les classes sont locales.`;
  } else {
    etaye = `« Nous ne contestons pas l’effet attendu : votre mesure est correctement étayée (${cadMax} cadenas sur cinq). Nous contestons les conditions de sa mise en œuvre. L’adhésion des personnels est aujourd’hui à ${Math.round((s && s.phys ? s.phys.adhesion : 25))} sur 100. À ce niveau, vous n’obtiendrez pas ce que la recherche promet. »`;
    verifiable = `Exact, et c’est l’argument que le jeu vous oppose depuis le début : votre facteur d’implémentation est indexé sur cette adhésion. Une organisation qui vous dit cela vous décrit votre propre moteur.`;
  }

  /* --- l'argument de principe : légitime, et non vérifiable --- */
  const principe = PRINCIPES_FAMILLE[carte.famille] || PRINCIPES_FAMILLE.moyens;
  const extra = PRINCIPES_PROFIL[org && org.profil];

  return {
    etaye, verifiable,
    principe: extra ? principe + ' ' + extra : principe,
  };
}


/* ============================================================================
   LES RENDEZ-VOUS DE L'ANNÉE 2, la polémique, la livraison, le plateau
   ----------------------------------------------------------------------------
   Un mandat n'est pas cinq fois la même année. La deuxième apporte ce que la
   première n'avait pas : une polémique identitaire qui s'installe et qu'aucune
   décision n'éteint, une livraison internationale sur laquelle on est sommé
   d'annoncer, et un plateau de vingt heures où l'on répond en direct.
   ========================================================================== */

/* La polémique de rentrée. Elle ne porte jamais sur l'école, elle porte sur
   l'ordre public à l'école, et elle occupe l'agenda six semaines. */
export const POLEMIQUES_RENTREE = [
  {
    id: 'vetement',
    titre: 'Un vêtement, et six semaines d’agenda',
    recit: 'Des chefs d’établissement signalent des tenues qu’ils ne savent pas qualifier. La question arrive au journal de 20 heures avant d’arriver sur votre bureau. En quarante-huit heures, elle est devenue le sujet de la rentrée, devant les 2 800 postes non pourvus dont personne ne parlera.',
    reponses: [
      { label: 'Publier une circulaire d’interdiction claire', type: 'ferme',
        det: 'Le texte sort en trois jours. Il sera attaqué au Conseil d’État, et il tiendra probablement.',
        parents: +7, adhesion: -4, presse: +6, credibilite: +2, capital: -3, agenda: 2,
        suite: 'Les familles approuvent largement, les chefs d’établissement respirent, et vous venez de consacrer votre rentrée à un sujet qui ne fera bouger aucun compteur d’acquis.' },
      { label: 'Renvoyer à l’appréciation des équipes, avec un cadre', type: 'methode',
        det: 'Vous refusez la circulaire et donnez une doctrine d’application aux recteurs.',
        parents: -3, adhesion: +5, presse: -4, credibilite: -2, capital: -1, agenda: 3,
        suite: 'La position est défendable et impossible à résumer en une phrase. Elle vous vaudra six semaines de questions au lieu de deux.' },
      { label: 'Refuser d’entrer dans le sujet', type: 'esquive',
        det: '« Ma priorité, ce sont les savoirs. » C’est vrai, et cela ne fera pas disparaître la question.',
        parents: -6, adhesion: +2, presse: -7, credibilite: -5, capital: -4, agenda: 4,
        suite: 'La question revient à chaque point presse. Au bout d’un mois, ce n’est plus la polémique qui vous coûte : c’est de donner l’impression de la fuir.' },
    ],
  },
  {
    id: 'harcelement',
    titre: 'Un drame, et la chaîne des signalements',
    recit: 'Un élève de troisième s’est donné la mort. Le collège avait été alerté. La famille a saisi la justice et les médias le même jour, et le mot « défaillance » est prononcé dès le premier journal.',
    reponses: [
      { label: 'Vous rendre sur place et diligenter une inspection', type: 'ferme',
        det: 'Vous partez le jour même. L’inspection générale rendra son rapport dans six semaines.',
        parents: +6, adhesion: +2, presse: +4, credibilite: +3, capital: -4, agenda: 2,
        suite: 'La présence physique est ce qui se voit le plus et se conteste le moins. Le rapport, lui, dira ce qu’il dira.' },
      { label: 'Annoncer un plan national de plus', type: 'methode',
        det: 'Un dispositif existe déjà. Vous en annoncez le renforcement.',
        parents: +2, adhesion: -3, presse: -2, credibilite: -4, capital: -2, agenda: 3,
        suite: 'Les personnels comptent les plans successifs sur les doigts d’une main, et n’en manquent pas un. Annoncer un plan là où un plan existe déjà se paie en crédibilité.' },
      { label: 'Rappeler que la responsabilité est locale', type: 'esquive',
        det: 'C’est juridiquement exact. Personne ne retiendra la nuance.',
        parents: -9, adhesion: -6, presse: -8, credibilite: -8, capital: -6, agenda: 4,
        suite: 'La phrase tourne en boucle. Le lendemain, trois autres familles témoignent, et ce n’est plus un fait divers : c’est votre gestion.' },
    ],
  },
];

/* La livraison internationale de l'automne. Le ministre n'a pas le choix
   d'annoncer : il a le choix de ce qu'il annonce, et de ce que cela déclenche. */
export const LIVRAISON_PISA = {
  titre: 'PISA tombe, et vous devez répondre ce soir',
  recit: 'Les résultats de l’enquête internationale sont publiés à 11 heures. Ils portent sur des élèves entrés au cours préparatoire dix ans avant votre nomination. À midi, trois chaînes demandent une réaction. À 20 heures, on attendra des mesures, pas une explication méthodologique.',
  contrainte: 'Vous devez annoncer trois mesures pour le niveau des élèves. Ce n’est pas une option du jeu : c’est ce que le poste exige. Selon celles que vous retenez, la salle des professeurs applaudit, hausse les épaules, ou dépose un préavis.',
  /* Les familles de mesures qui apaisent ou qui enflamment, une fois annoncées
     sous la pression d'une livraison internationale. */
  apaise: ['moyens', 'parcours'],
  enflamme: ['autorite', 'autonomie'],
};

/* Le plateau de vingt heures. Trois questions, et l'une d'elles n'a rien à voir
   avec la politique éducative : c'est celle dont on se souviendra.
   Précédent : un ministre en exercice mis en difficulté, en direct, sur
   l'orthographe de mots courants. */
export const PLATEAU = {
  titre: 'Vingt heures, plateau, sept millions de personnes',
  recit: 'La séquence dure onze minutes. Le journaliste a préparé trois questions ; la troisième n’était pas dans le brief transmis à votre cabinet.',
  questions: [
    {
      id: 'bilan',
      q: '« Monsieur le ministre, en deux ans, le niveau des élèves a-t-il monté ? »',
      reponses: [
        { label: 'Donner le chiffre, y compris s’il est mauvais', credibilite: +6, parents: +2, adhesion: +3,
          suite: 'La franchise sur un mauvais chiffre est le placement le plus rentable du plateau. Elle ne se rejoue pas deux fois.' },
        { label: 'Répondre par les moyens engagés', credibilite: -2, parents: -1, adhesion: +1,
          suite: 'Le journaliste répète la question. Vous répétez la réponse. Le public a compris avant vous deux.' },
        { label: 'Contester la pertinence de la mesure', credibilite: -7, parents: -4, adhesion: 0,
          suite: 'Contester l’instrument quand il donne tort est ce que font tous les ministres, et le public le sait aussi.' },
      ],
    },
    {
      id: 'profs',
      q: '« Les enseignants disent qu’ils n’en peuvent plus. Que leur répondez-vous ? »',
      reponses: [
        { label: 'Reconnaître, sans promettre ce que vous ne pouvez pas tenir', credibilite: +4, adhesion: +7, parents: 0,
          suite: 'La phrase circule en salle des professeurs le lendemain matin. C’est le seul public qui vérifie.' },
        { label: 'Rappeler les revalorisations déjà accordées', credibilite: 0, adhesion: -5, parents: +2,
          suite: 'Répondre à de la fatigue par un tableau de rémunération est une erreur de registre, et elle se paie longtemps.' },
        { label: 'Évoquer l’absentéisme et les heures non faites', credibilite: -6, adhesion: -18, parents: +4, derapage: true,
          suite: 'La phrase touche l’estime professionnelle et non la politique. Elle unifie en une nuit des organisations qui ne s’entendent sur rien. Aucune excuse ne la rattrapera.' },
      ],
    },
    {
      id: 'dictee',
      q: '« Une dernière, pour le plaisir : pouvez-vous nous épeler “dilemme” ? »',
      aparte: 'Ce n’était pas dans le brief. Le plateau sourit. Sept millions de personnes attendent.',
      reponses: [
        { label: '« D-I-L-E-M-M-E. »', credibilite: +5, parents: +4, adhesion: +4, presse: +5,
          suite: 'Onze secondes, et la séquence la plus partagée de votre mandat sera celle-là. C’est absurde, et c’est ainsi.' },
        { label: '« D-I-L-E-M-N-E. »', credibilite: -14, parents: -9, adhesion: -8, presse: -12, derapage: true,
          suite: 'L’extrait fait le tour des réseaux avant la fin de l’émission. Le ministre de l’Éducation nationale qui ne sait pas écrire « dilemme » : plus personne ne retiendra rien d’autre de vos onze minutes, ni de votre semaine.' },
        { label: 'Refuser l’exercice : « je ne suis pas là pour ça »', credibilite: -6, parents: -5, adhesion: +2, presse: -4,
          suite: 'Refuser est plus digne et se lit comme un aveu. Le lendemain, trois éditorialistes expliquent que vous auriez dû accepter.' },
      ],
    },
  ],
};


export const PAR_ID = Object.fromEntries(CATALOGUE.map((c) => [c.id, c]));
