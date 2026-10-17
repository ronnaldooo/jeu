/* ============================================================================
   TERRITOIRES — « Mon lycée, mon département »
   ----------------------------------------------------------------------------
   Les 101 départements et leur région, et ce que l'on sait, chiffre par
   chiffre, de ce qu'un lycéen reçoit selon l'endroit où il vit. Règle du
   jeu : un chiffre n'est écrit ici que s'il a une source (`src` renvoie à
   SOURCES dans reperes.js). Là où le dossier de recherche n'a pas trouvé de
   chiffre pour une région ou un département, le jeu le dit, il n'invente
   pas. Voir RECHERCHE-TERRITOIRES.md.
   ========================================================================== */

export const REGIONS = {
  ara: 'Auvergne-Rhône-Alpes', bfc: 'Bourgogne-Franche-Comté', bre: 'Bretagne', cvl: 'Centre-Val de Loire',
  cor: 'Corse', ges: 'Grand Est', hdf: 'Hauts-de-France', idf: 'Île-de-France', nor: 'Normandie',
  naq: 'Nouvelle-Aquitaine', occ: 'Occitanie', pdl: 'Pays de la Loire', pac: 'Provence-Alpes-Côte d’Azur',
  gua: 'Guadeloupe', mar: 'Martinique', guy: 'Guyane', reu: 'La Réunion', may: 'Mayotte',
};

/* code, nom, région, académie (pour les faits connus par académie) */
const D = (code, nom, region, academie) => ({ code, nom, region, academie });
export const DEPARTEMENTS = [
  D('01', 'Ain', 'ara', 'Lyon'), D('03', 'Allier', 'ara', 'Clermont-Ferrand'), D('07', 'Ardèche', 'ara', 'Grenoble'), D('15', 'Cantal', 'ara', 'Clermont-Ferrand'),
  D('26', 'Drôme', 'ara', 'Grenoble'), D('38', 'Isère', 'ara', 'Grenoble'), D('42', 'Loire', 'ara', 'Lyon'), D('43', 'Haute-Loire', 'ara', 'Clermont-Ferrand'),
  D('63', 'Puy-de-Dôme', 'ara', 'Clermont-Ferrand'), D('69', 'Rhône', 'ara', 'Lyon'), D('73', 'Savoie', 'ara', 'Grenoble'), D('74', 'Haute-Savoie', 'ara', 'Grenoble'),
  D('21', 'Côte-d’Or', 'bfc', 'Dijon'), D('25', 'Doubs', 'bfc', 'Besançon'), D('39', 'Jura', 'bfc', 'Besançon'), D('58', 'Nièvre', 'bfc', 'Dijon'),
  D('70', 'Haute-Saône', 'bfc', 'Besançon'), D('71', 'Saône-et-Loire', 'bfc', 'Dijon'), D('89', 'Yonne', 'bfc', 'Dijon'), D('90', 'Territoire de Belfort', 'bfc', 'Besançon'),
  D('22', 'Côtes-d’Armor', 'bre', 'Rennes'), D('29', 'Finistère', 'bre', 'Rennes'), D('35', 'Ille-et-Vilaine', 'bre', 'Rennes'), D('56', 'Morbihan', 'bre', 'Rennes'),
  D('18', 'Cher', 'cvl', 'Orléans-Tours'), D('28', 'Eure-et-Loir', 'cvl', 'Orléans-Tours'), D('36', 'Indre', 'cvl', 'Orléans-Tours'),
  D('37', 'Indre-et-Loire', 'cvl', 'Orléans-Tours'), D('41', 'Loir-et-Cher', 'cvl', 'Orléans-Tours'), D('45', 'Loiret', 'cvl', 'Orléans-Tours'),
  D('2A', 'Corse-du-Sud', 'cor', 'Corse'), D('2B', 'Haute-Corse', 'cor', 'Corse'),
  D('08', 'Ardennes', 'ges', 'Reims'), D('10', 'Aube', 'ges', 'Reims'), D('51', 'Marne', 'ges', 'Reims'), D('52', 'Haute-Marne', 'ges', 'Reims'),
  D('54', 'Meurthe-et-Moselle', 'ges', 'Nancy-Metz'), D('55', 'Meuse', 'ges', 'Nancy-Metz'), D('57', 'Moselle', 'ges', 'Nancy-Metz'),
  D('67', 'Bas-Rhin', 'ges', 'Strasbourg'), D('68', 'Haut-Rhin', 'ges', 'Strasbourg'), D('88', 'Vosges', 'ges', 'Nancy-Metz'),
  D('02', 'Aisne', 'hdf', 'Amiens'), D('59', 'Nord', 'hdf', 'Lille'), D('60', 'Oise', 'hdf', 'Amiens'), D('62', 'Pas-de-Calais', 'hdf', 'Lille'), D('80', 'Somme', 'hdf', 'Amiens'),
  D('75', 'Paris', 'idf', 'Paris'), D('77', 'Seine-et-Marne', 'idf', 'Créteil'), D('78', 'Yvelines', 'idf', 'Versailles'), D('91', 'Essonne', 'idf', 'Versailles'),
  D('92', 'Hauts-de-Seine', 'idf', 'Versailles'), D('93', 'Seine-Saint-Denis', 'idf', 'Créteil'), D('94', 'Val-de-Marne', 'idf', 'Créteil'), D('95', 'Val-d’Oise', 'idf', 'Versailles'),
  D('14', 'Calvados', 'nor', 'Normandie'), D('27', 'Eure', 'nor', 'Normandie'), D('50', 'Manche', 'nor', 'Normandie'), D('61', 'Orne', 'nor', 'Normandie'), D('76', 'Seine-Maritime', 'nor', 'Normandie'),
  D('16', 'Charente', 'naq', 'Poitiers'), D('17', 'Charente-Maritime', 'naq', 'Poitiers'), D('19', 'Corrèze', 'naq', 'Limoges'), D('23', 'Creuse', 'naq', 'Limoges'),
  D('24', 'Dordogne', 'naq', 'Bordeaux'), D('33', 'Gironde', 'naq', 'Bordeaux'), D('40', 'Landes', 'naq', 'Bordeaux'), D('47', 'Lot-et-Garonne', 'naq', 'Bordeaux'),
  D('64', 'Pyrénées-Atlantiques', 'naq', 'Bordeaux'), D('79', 'Deux-Sèvres', 'naq', 'Poitiers'), D('86', 'Vienne', 'naq', 'Poitiers'), D('87', 'Haute-Vienne', 'naq', 'Limoges'),
  D('09', 'Ariège', 'occ', 'Toulouse'), D('11', 'Aude', 'occ', 'Montpellier'), D('12', 'Aveyron', 'occ', 'Toulouse'), D('30', 'Gard', 'occ', 'Montpellier'),
  D('31', 'Haute-Garonne', 'occ', 'Toulouse'), D('32', 'Gers', 'occ', 'Toulouse'), D('34', 'Hérault', 'occ', 'Montpellier'), D('46', 'Lot', 'occ', 'Toulouse'),
  D('48', 'Lozère', 'occ', 'Montpellier'), D('65', 'Hautes-Pyrénées', 'occ', 'Toulouse'), D('66', 'Pyrénées-Orientales', 'occ', 'Montpellier'),
  D('81', 'Tarn', 'occ', 'Toulouse'), D('82', 'Tarn-et-Garonne', 'occ', 'Toulouse'),
  D('44', 'Loire-Atlantique', 'pdl', 'Nantes'), D('49', 'Maine-et-Loire', 'pdl', 'Nantes'), D('53', 'Mayenne', 'pdl', 'Nantes'), D('72', 'Sarthe', 'pdl', 'Nantes'), D('85', 'Vendée', 'pdl', 'Nantes'),
  D('04', 'Alpes-de-Haute-Provence', 'pac', 'Aix-Marseille'), D('05', 'Hautes-Alpes', 'pac', 'Aix-Marseille'), D('06', 'Alpes-Maritimes', 'pac', 'Nice'),
  D('13', 'Bouches-du-Rhône', 'pac', 'Aix-Marseille'), D('83', 'Var', 'pac', 'Nice'), D('84', 'Vaucluse', 'pac', 'Aix-Marseille'),
  D('971', 'Guadeloupe', 'gua', 'Guadeloupe'), D('972', 'Martinique', 'mar', 'Martinique'), D('973', 'Guyane', 'guy', 'Guyane'),
  D('974', 'La Réunion', 'reu', 'La Réunion'), D('976', 'Mayotte', 'may', 'Mayotte'),
];

/* Ce que l'on sait par région. `invest` : investissement de la région dans
   ses lycées publics, par lycéen et par an, 2022-2025 (reconstitution de la
   Gazette des communes à partir des comptes administratifs ; seules trois
   valeurs et l'ordre des quatre premières ont pu être relevés). */
export const FAITS_REGION = {
  bre: { invest: { v: 1978, rang: 'première des treize régions', src: 'gazette_invest' },
         prive: { v: '3 059 € par lycéen du privé en huit ans (2016-2023)', src: 'gazette_prive' },
         participation: { v: 'un budget participatif lycéen dans neuf lycées pilotes depuis 2024, à la main des élèves', src: 'bretagne_bp' } },
  bfc: { invest: { rang: 'dans les quatre premières régions, derrière la Bretagne', src: 'gazette_invest' } },
  pdl: { invest: { rang: 'dans les quatre premières régions', src: 'gazette_invest' },
         prive: { v: '3 884 € par lycéen du privé en huit ans (2016-2023), le plus haut niveau de France', src: 'gazette_prive' } },
  nor: { invest: { rang: 'dans les quatre premières régions', src: 'gazette_invest' } },
  idf: { invest: { v: 1206, rang: 'en queue de classement', src: 'gazette_invest' },
         fonctionnement: { v: '1 500 € par élève en 2023, le plus faible niveau des régions (plus de 2 000 € en moyenne) ; la Région répond que sa dotation a doublé en dix ans et atteint 210 M€ en 2026', src: 'gazette_accueil', src2: 'idf_dotation' },
         prive: { v: '405 € par lycéen du privé en huit ans (2016-2023), le plus bas de France', src: 'gazette_prive' },
         cantine: { v: 'de 0,50 € à 4,66 € le repas selon le quotient familial (2026-2027)', src: 'idf_cantine' } },
  hdf: { invest: { v: 885, rang: 'dernière des treize régions', src: 'gazette_invest' } },
  naq: { cantine: { v: 'tarification solidaire dans tous les lycées publics à la rentrée 2026 : les familles les plus modestes paient 2,30 €, le prix des denrées, pour un repas qui coûte 9,50 € à produire', src: 'na_cantine' } },
  occ: { participation: { v: 'un budget participatif lycéen depuis 2017 : une trentaine de lycées, les élèves proposent et votent, jusqu’à 10 000 € par projet', src: 'occitanie_bp' } },
  cvl: { participation: { v: 'un budget participatif des lycées annoncé pour la rentrée 2026 dans « Ma Région Ô Lycées »', src: 'cvl_bp' } },
  pac: { participation: { v: 'un Parlement régional de la jeunesse doté de 50 000 €', src: 'paca_prj' } },
};

/* Ce que l'on sait par département : l'indice de position sociale moyen des
   lycées à la rentrée 2024 (DEPP, note 25-21 ; moyenne nationale 109, de 59
   à 162 selon le lycée). Seules les valeurs publiées dans la note ou ses
   relais ont été relevées ; « sous 100 » quand la note cite le département
   sans donner la valeur. */
export const IPS_DEPARTEMENT = {
  75: 129, 92: 125, 78: 125, 44: 120, 93: 93, 974: 90, 973: 83, 976: 71,
};
export const IPS_SOUS_100 = ['02', '08', '52', '62', '971'];
export const IPS_NATIONAL = { moyenne: 109, min: 59, max: 162, prive: 125, public: 105, pro: 92, gt: 121 };

/* Faits connus par académie ou par département, hors IPS. */
export const FAITS_LOCAUX = [
  { academies: ['Créteil', 'Versailles'], v: 'des élèves en plus, pas de professeurs en plus',
    l: 'entre 2005 et 2025, dans les académies de Créteil et de Versailles, les effectifs d’enseignants n’ont pas suivi ceux des élèves ; à Paris, c’est l’inverse, avec des professeurs plus âgés, plus souvent agrégés et moins souvent contractuels', src: 'ipp_territoires' },
  { academies: ['Paris'], v: 'plus d’agrégés, moins de contractuels',
    l: 'les enseignants des collèges et lycées de Paris sont plus âgés, plus souvent agrégés et moins souvent contractuels que la moyenne, ce qui rend probablement la dépense d’État par élève plus élevée, sans qu’elle soit publiée', src: 'ipp_territoires' },
  { academies: ['Orléans-Tours'], v: '65 % de participation',
    l: 'aux élections du conseil de la vie lycéenne en 2025 dans l’académie (72 % dans le Cher), contre moins de 50 % au niveau national selon l’académie', src: 'orleans_cvl' },
  { departements: ['34'], v: '7 septembre 2026',
    l: 'cours interrompus l’après-midi dans deux lycées de l’Hérault à cause de la température dans les salles', src: 'f3_rentree2026' },
  { departements: ['976', '973'], v: 'les écarts les plus élevés du système',
    l: 'Mayotte et la Guyane cumulent rotations scolaires faute de salles, non-scolarisation, part de contractuels très supérieure à la moyenne, et sont les seuls territoires où le nombre d’élèves augmente', src: 'outremer26' },
];

/* Ce qui est vrai partout, et que l'écran rappelle sous les chiffres locaux. */
export const FAITS_NATIONAUX = [
  { v: '11 660 €', l: 'par an : ce que coûte un élève du second degré à la collectivité en 2024 (9 080 € au premier degré). Trois ans de lycée, c’est de l’ordre de 35 000 €', src: 'insee_die2024' },
  { v: 'un quart', l: 'c’est à peu près la part de ce coût que paie la région : 6,8 Md€ en 2025 pour les lycées (murs, cantine, internat, agents, ordinateurs), soit 3 000 à 3 900 € par lycéen selon qu’on compte ou non le privé. L’État paie le reste, d’abord les professeurs', src: 'ofgl_regions' },
  { v: '+24 %', l: 'la France dépense 18 127 dollars par élève de lycée contre 14 562 en moyenne dans l’OCDE ; et 13 % de moins que la moyenne au primaire', src: 'ocde_rse2025' },
  { v: '885 à 1 978 €', l: 'par lycéen et par an : l’investissement des régions dans leurs lycées publics, du simple au double entre les Hauts-de-France et la Bretagne (2022-2025)', src: 'gazette_invest' },
  { v: '71 à 129', l: 'l’indice de position sociale moyen des lycées selon le département, de Mayotte à Paris, pour une moyenne de 109', src: 'depp_ips_lycees' },
  { v: '−10 points', l: 'les élèves des communes rurales entrent en seconde générale et technologique dix points de moins que ceux des villes ; le ministère l’attribue à l’éloignement de l’offre', src: 'senat_ruraux' },
  { v: '7,5 %', l: 'des heures de cours perdues en 2024-2025 pour absence d’un professeur, jusqu’à 14 % dans les établissements les plus touchés. Le chiffre de votre lycée n’est publié nulle part', src: 'letudiant_heures' },
];

/* Où un élève peut chercher lui-même. Les liens vont vers les jeux de
   données, pas vers des articles. */
export const OU_CHERCHER = [
  { quoi: 'L’IPS de chaque lycée (le vôtre, et ceux d’à côté)', src: 'ods_ips' },
  { quoi: 'La valeur ajoutée de chaque lycée au bac : ce qu’il obtient, comparé à ce que son public laissait attendre', src: 'ival_guide' },
  { quoi: 'Le taux de réussite au bac de chaque département', src: 'datagouv_bac' },
  { quoi: 'Des cartes par commune, département et académie (Géo-éducation, DEPP)', src: 'geo_education' },
  { quoi: 'Les 38 fiches de « Géographie de l’École 2026 », avec les fichiers par département', src: 'geo_ecole2026' },
];

export function departement(code) {
  return DEPARTEMENTS.find((d) => d.code === String(code)) || null;
}

/* La fiche d'un département : tout ce que le jeu sait, prêt à afficher. */
export function ficheTerritoire(code) {
  const d = departement(code);
  if (!d) return null;
  const R = FAITS_REGION[d.region] || {};
  const ips = IPS_DEPARTEMENT[d.code] != null ? IPS_DEPARTEMENT[d.code] : null;
  const sous100 = IPS_SOUS_100.includes(d.code);
  const locaux = FAITS_LOCAUX.filter((f) => (f.academies && f.academies.includes(d.academie)) || (f.departements && f.departements.includes(d.code)));
  return { ...d, regionNom: REGIONS[d.region], region: R, ips, sous100, locaux };
}

/* Pour la recherche en direct : les codes que les jeux de données du
   ministère utilisent (« 093 » ou « 93 », « 2A », « 974 »). */
export function codesPossibles(code) {
  const c = String(code);
  const set = new Set([c]);
  if (/^\d$/.test(c)) set.add('0' + c).add('00' + c);
  if (/^\d{2}$/.test(c)) set.add('0' + c).add(String(+c));
  return [...set];
}
