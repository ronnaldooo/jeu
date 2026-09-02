/* ============================================================================
   DOCUMENT DE RELECTURE nº 2 — « Tout le texte du jeu »
   ----------------------------------------------------------------------------
   Le premier document (deroule-docx.cjs) décrit ce que le jeu FAIT. Celui-ci
   donne ce qu'il DIT : chaque phrase affichée à l'écran, les 70 mesures avec
   tous leurs champs, les repères sourcés, la presse. Il est fait pour être
   corrigé au mot près, en suivi de modifications.

   Chaque bloc porte sa RÉFÉRENCE, à droite ou en tête : « app.js:412 » ou
   « catalogue.js › redoublement › mot ». Une correction se reporte donc
   directement, sans avoir à chercher où la phrase se trouve.

     npm install docx                     (une seule fois, hors du dépôt)
     NODE_PATH=<ou-est-docx>/node_modules \
       node outil/contenu-docx.cjs "Rue de Grenelle - tout le texte.docx"

   Les données (mesures, affaires, repères…) sont lues dans les modules du jeu :
   ce document ne peut pas se désynchroniser du code. Les textes d'interface
   sont extraits de interface/app.js par analyse des littéraux de chaîne.
   ========================================================================== */
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  TableOfContents, PageBreak, LevelFormat, convertInchesToTwip,
} = require('docx');
const fs = require('fs');
const path = require('path');

const LARGEUR = 9360;

/* ---------- helpers ---------- */
const T = (t, o = {}) => new TextRun({ text: String(t), ...o });
const H1 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 } });
const H2 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 120 } });
const H3 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_3, spacing: { before: 220, after: 80 } });
const BODY = (t) => new Paragraph({ children: typeof t === 'string' ? [T(t)] : t, spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED });
const PUCE = (t) => new Paragraph({ children: typeof t === 'string' ? [T(t)] : t, numbering: { reference: 'puces', level: 0 }, spacing: { after: 70 } });
const VIDE = () => new Paragraph({ text: '', spacing: { after: 80 } });
const SAUT = () => new Paragraph({ children: [new PageBreak()] });

/* La référence du bloc : où retrouver la phrase dans le code. */
const REF = (t) => new Paragraph({
  children: [T(t, { font: 'Consolas', size: 15, color: '8A8FA3' })],
  spacing: { after: 40 },
});

function cellule(contenu, largeur, o = {}) {
  const paras = (Array.isArray(contenu) ? contenu : [contenu]).map((c) =>
    c instanceof Paragraph ? c
      : new Paragraph({ children: typeof c === 'string' ? [T(c, o.run || {})] : c, spacing: { after: 40 } }));
  return new TableCell({
    width: { size: largeur, type: WidthType.DXA },
    shading: o.fond ? { type: ShadingType.CLEAR, fill: o.fond, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: paras.length ? paras : [new Paragraph('')],
  });
}

function tableau(entetes, lignes, largeurs, o = {}) {
  const rows = [];
  if (entetes) {
    rows.push(new TableRow({
      tableHeader: true,
      children: entetes.map((e, i) => cellule(e, largeurs[i], { fond: 'ECEEF4', run: { bold: true, size: o.taille || 18 } })),
    }));
  }
  for (const l of lignes) {
    rows.push(new TableRow({ children: l.map((c, i) => cellule(c, largeurs[i], { run: { size: o.taille || 18 } })) }));
  }
  return new Table({
    columnWidths: largeurs,
    width: { size: largeurs.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: 'D8DAE4' },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'D8DAE4' },
      left: { style: BorderStyle.SINGLE, size: 2, color: 'D8DAE4' },
      right: { style: BorderStyle.SINGLE, size: 2, color: 'D8DAE4' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'E8EAF0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: 'E8EAF0' },
    },
    rows,
  });
}

/* ---------- extraction des textes d'interface ---------- */
/* On lit interface/app.js et on relève, fonction d'écran par fonction d'écran,
   les littéraux de chaîne assez longs pour être des phrases affichées. Les
   interpolations deviennent « […] », les balises disparaissent. Le numéro de
   ligne est conservé : c'est la référence de correction. */
function textesInterface(racine) {
  const src = fs.readFileSync(path.join(racine, 'interface/app.js'), 'utf8');
  const lignes = src.split('\n');
  const bornes = [];
  for (let i = 0; i < lignes.length; i++) {
    const m = lignes[i].match(/^function (ecran[A-Za-z]+|blocBoussole|blocReperes|ouvrirComprendre|verdictProse)\b/);
    if (m) bornes.push({ nom: m[1], debut: i });
  }
  for (let i = 0; i < bornes.length; i++) bornes[i].fin = (i + 1 < bornes.length ? bornes[i + 1].debut : lignes.length);

  const relever = (a, b) => {
    const bloc = lignes.slice(a, b).join('\n');
    const out = [];
    const re = /'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
    let m;
    while ((m = re.exec(bloc)) !== null) {
      let t = (m[1] !== undefined ? m[1] : m[2]);
      t = t.replace(/\$\{[^}]*\}/g, '[…]')
           .replace(/<[^>]+>/g, ' ')
           .replace(/\\'/g, '’').replace(/\\n/g, ' ')
           .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
           .replace(/\s+/g, ' ').trim();
      if (t.length < 22) continue;
      if (/^(var\(|color:|font|display|https?:)/.test(t)) continue;
      if (!/[a-zà-ÿ]{3}/i.test(t)) continue;
      out.push({ ligne: a + bloc.slice(0, m.index).split('\n').length, t });
    }
    return out;
  };
  return bornes.map((b) => ({ nom: b.nom, textes: relever(b.debut, b.fin) }));
}

/* Le titre lisible et le moment de chaque écran. */
const ECRANS = {
  ecranAccueil:      ['L’accueil', 'Avant la partie'],
  ecranNomination:   ['L’appel de Matignon', 'Juin 2027, écran 1'],
  ecranEntretien:    ['Les trois questions de l’Élysée', 'Juin 2027, écran 2'],
  ecranProfil:       ['D’où venez-vous', 'Juin 2027, écran 3'],
  ecranDoctrine:     ['La conférence de presse, votre feuille de route', 'Juin 2027, écran 4'],
  ecranReperes:      ['Les trois notes de la DGESCO', 'Juin 2027, écrans 5, 7 et 9'],
  ecranAvance:       ['L’avance de gestion', 'Juin 2027, écran 6'],
  ecranIntention:    ['Votre intention sur les postes', 'Juin 2027, écran 8'],
  ecranAtelier:      ['L’atelier de mesures', 'Juin, septembre et janvier'],
  ecranDossier:      ['L’été des cent jours', 'Juillet et août'],
  ecranBercy:        ['La lettre plafond', 'Juillet, chaque année'],
  ecranRentree:      ['La rentrée', 'Septembre, chaque année'],
  ecranPolemique:    ['La polémique de rentrée', 'Septembre, à partir de l’an 2'],
  ecranAudience:     ['L’audience syndicale, la question', 'Octobre, chaque année'],
  ecranRetrait:      ['L’audience syndicale, la revendication', 'Octobre, chaque année'],
  ecranLivraison:    ['La livraison PISA', 'Décembre de l’an 2'],
  ecranCarteScolaire:['La carte scolaire', 'Janvier, chaque année'],
  ecranPlateau:      ['Le plateau de 20 heures', 'Variable, à partir de l’an 2'],
  ecranAffaire:      ['Les affaires personnelles', 'Variable'],
  ecranEtape:        ['Les points d’étape et la presse', 'Six fois par an'],
  blocBoussole:      ['La boussole politique', 'À chaque clôture à partir de la deuxième, puis au bilan'],
  ecranBilan:        ['Le bilan', 'Fin de partie'],
  verdictProse:      ['Le verdict du bilan, une phrase selon la partie', 'Fin de partie'],
  blocReperes:       ['Les fiches de repères, gabarit commun', 'Onglet « Comprendre le jeu »'],
  ouvrirComprendre:  ['L’onglet « Comprendre le jeu »', 'À tout moment'],
};

/* ------------------------------------------------------------------------ */
(async function main() {
  const racine = path.resolve(__dirname, '..');
  const u = (f) => require('url').pathToFileURL(path.join(racine, f)).href;
  const K = await import(u('moteur/constantes.js'));
  const C = await import(u('moteur/catalogue.js'));
  const R = await import(u('moteur/reperes.js'));

  const enfants = [];
  const A = (...x) => enfants.push(...x);

  /* ---- page de titre ---- */
  A(
    new Paragraph({ text: '', spacing: { after: 1400 } }),
    new Paragraph({ children: [T('RUE DE GRENELLE', { bold: true, size: 56, color: '000091' })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
    new Paragraph({ children: [T('Devenir ministre de l’Éducation nationale', { size: 30, color: '565B6B' })], alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
    new Paragraph({ children: [T('Tout le texte du jeu', { bold: true, size: 28 })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
    new Paragraph({ children: [T('Document nº 2 : le contenu, phrase par phrase, à corriger au mot près', { size: 22, italics: true, color: '565B6B' })], alignment: AlignmentType.CENTER, spacing: { after: 1000 } }),
    new Paragraph({ children: [T('Version du 2 septembre 2026', { size: 20, color: '8A8FA3' })], alignment: AlignmentType.CENTER }),
    new Paragraph({ children: [T('Jeu en ligne : https://ronnaldooo.github.io/jeu/', { size: 20, color: '8A8FA3' })], alignment: AlignmentType.CENTER }),
    new Paragraph({ children: [T('Code et sources : https://github.com/ronnaldooo/jeu', { size: 20, color: '8A8FA3' })], alignment: AlignmentType.CENTER, spacing: { after: 600 } }),
    SAUT(),
  );

  /* ---- mode d'emploi ---- */
  A(H1('Comment corriger ce document'));
  A(BODY('Le premier document décrivait ce que le jeu fait. Celui-ci donne ce qu’il dit : chaque phrase affichée à l’écran, les 70 mesures avec tous leurs champs, les onze fiches de repères et leurs sources, les affaires, les audiences, la presse. Il n’est pas fait pour être lu d’un trait, il est fait pour qu’on y corrige des phrases.'));
  A(BODY([
    T('Chaque bloc porte sa ', {}), T('référence', { bold: true }),
    T(' en petits caractères gris : ', {}), T('app.js:412', { font: 'Consolas', size: 18 }),
    T(' ou ', {}), T('catalogue.js › redoublement › mot', { font: 'Consolas', size: 18 }),
    T('. Une phrase corrigée se reporte donc directement dans le code, sans avoir à la chercher. Vous pouvez récrire par-dessus en suivi de modifications, ou commenter : les deux se reportent aussi bien.', {}),
  ]));
  A(BODY([
    T('Deux conventions à connaître pour ne pas être surpris. ', {}),
    T('« […] » remplace une valeur calculée', { bold: true }),
    T(' : un nombre, un nom de mesure, une date que le jeu insère au moment de l’affichage. Et ', {}),
    T('les textes d’interface sont donnés dans l’ordre du code', { bold: true }),
    T(', pas dans l’ordre d’apparition à l’écran, qui dépend des choix du joueur : un écran qui propose trois réponses affiche les trois, le joueur n’en verra qu’une commentée.', {}),
  ]));
  A(BODY('Les données (mesures, affaires, chiffres, sources) sont lues directement dans les fichiers du jeu au moment où ce document est fabriqué : il ne peut pas être en retard sur le code.'));
  A(SAUT());

  /* ---- sommaire ---- */
  A(H1('Sommaire'));
  A(new TableOfContents('Sommaire', { hyperlink: true, headingStyleRange: '1-2' }));
  A(BODY([T('(Dans Word : clic droit sur le sommaire → Mettre à jour les champs.)', { italics: true, size: 19, color: '8A8FA3' })]));
  A(SAUT());

  /* ============ 1. LES ÉCRANS ============ */
  A(H1('1. Le texte de chaque écran'));
  A(BODY('Tout ce qui s’affiche, écran par écran, dans l’ordre du code. Les textes courts (libellés de boutons, étiquettes) ne sont pas repris : seules les phrases le sont.'));

  const extraits = textesInterface(racine);
  const ordre = Object.keys(ECRANS);
  const tri = [...extraits].sort((a, b) => {
    const ia = ordre.indexOf(a.nom), ib = ordre.indexOf(b.nom);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  for (const e of tri) {
    const meta = ECRANS[e.nom] || [e.nom, ''];
    A(H2(meta[0]));
    if (meta[1]) A(BODY([T(meta[1] + '. ', { italics: true, color: '565B6B' }), T('interface/app.js', { font: 'Consolas', size: 18, color: '8A8FA3' })]));
    if (!e.textes.length) { A(BODY('Aucune phrase fixe : cet écran n’affiche que des données.')); continue; }
    A(tableau(['Ligne', 'Le texte affiché'],
      e.textes.map((x) => [String(x.ligne), x.t]), [800, 8560], { taille: 18 }));
    A(VIDE());
  }
  A(SAUT());

  /* ============ 2. LES MESURES ============ */
  A(H1('2. Les ' + C.CATALOGUE.length + ' mesures'));
  A(BODY('Chaque carte du catalogue, avec tous ses champs. L’ordre est celui du fichier. Les effets réels sont ceux que le joueur ne voit pas pendant la partie : ils sont donnés ici pour que vous puissiez juger de leur plausibilité et de leur source.'));

  const FAM = { moyens: 'Moyens et encadrement', autonomie: 'Autonomie et évaluation', parcours: 'Parcours et orientation', autorite: 'Autorité et familles', mixite: 'Mixité et carte scolaire' };
  const CPT = { reussite: 'Réussite', egalite: 'Inégalités', sante: 'Santé du système', paix: 'Paix sociale', budget: 'Salaires' };
  const md = (x) => (x === 0 ? '0' : (Math.round(x * 1000)) + ' M€/an');
  const sg = (x) => (x > 0 ? '+' + x : String(x).replace('-', '\u2212'));

  for (const c of C.CATALOGUE) {
    A(H2(c.label));
    A(REF('catalogue.js › ' + c.id));
    const vit = Object.entries(c.vitrine.compteurs || {}).map(([k, v]) => CPT[k] + ' ' + sg(v));
    const lignes = [
      ['Famille', FAM[c.famille] || c.famille],
      ['Portée par', (c.porteurs || []).join(' · ') || '—'],
    ];
    if (c.contre && c.contre.length) lignes.push(['Combattue par', c.contre.join(' · ')]);
    lignes.push(['Coût', md(c.cout || 0) + (c.coutETP ? ' · ' + c.coutETP.toLocaleString('fr-FR') + ' ETP' : '') + ' · ' + c.pol + ' points de capital politique']);
    lignes.push(['Effet d’annonce (affiché)', ['parents ' + sg(c.vitrine.parents || 0) + ' · enseignants ' + sg(c.vitrine.enseignants || 0) + ' · presse ' + sg(c.vitrine.presse || 0), vit.length ? 'compteurs : ' + vit.join(' · ') : 'aucun compteur déplacé'].join(' | ')]);
    lignes.push(['Effet réel (caché)', (c.reel || []).length
      ? (c.reel || []).map((e) => CPT[e.compteur] + ' ' + sg(e.central) + ' à ' + e.delai + ' an' + (e.delai > 1 ? 's' : '') + ', ' + e.cadenas + ' cadenas sur 5 · ' + e.source).join(' || ')
      : 'aucun']);
    if (c.decouverte) lignes.push(['Découverte', c.decouverte.annee ? 'à partir de l’an ' + c.decouverte.annee : 'déclencheur : ' + c.decouverte.si]);
    A(tableau(null, lignes.map((l) => [l[0], String(l[1]).split(' || ')]), [2200, 7160], { taille: 18 }));
    if (c.preuve) { A(REF('› preuve'));  A(BODY([T('Ce que disent les études. ', { bold: true }), T(c.preuve)])); }
    if (c.ideeRecue) { A(REF('› ideeRecue')); A(BODY([T('L’idée reçue déconstruite. ', { bold: true }), T(c.ideeRecue)])); }
    if (c.mot) { A(REF('› mot')); A(BODY([T(c.mot, { italics: true })])); }
    A(VIDE());
  }
  A(SAUT());

  /* ============ 3. LES CARTES PARAMÉTRIQUES ============ */
  A(H1('3. Les curseurs de la carte salariale'));
  A(REF('catalogue.js › REVALORISATION'));
  A(tableau(['Instrument', 'Ce que le jeu en dit'],
    Object.entries(C.REVALORISATION.instruments).map(([k, v]) => [v.label, v.note]), [2400, 6960]));
  A(VIDE());
  A(tableau(['Cible', 'Ce que le jeu en dit'],
    Object.entries(C.REVALORISATION.cibles).map(([k, v]) => [v.label, v.note]), [2400, 6960]));
  A(VIDE());
  A(tableau(['Financement des 19 élèves par classe', 'Coût', 'Ce que le jeu en dit'],
    Object.entries(C.FINANCEMENT_19).map(([k, v]) => [v.label, md(v.cout), v.note || '—']), [2600, 1400, 5360]));
  A(SAUT());

  /* ============ 4. L'ÉTÉ DES CENT JOURS ============ */
  A(H1('4. Les dossiers de l’été'));
  for (const d of C.DOSSIERS_ETE) {
    A(H2(d.titre));
    A(REF('catalogue.js › DOSSIERS_ETE › ' + d.id));
    A(BODY(d.contexte));
    A(tableau(['La réponse', 'Ce que le jeu en décode'],
      d.options.map((o) => [o.titre, o.decryptage || '—']), [3400, 5960]));
    A(VIDE());
  }
  A(SAUT());

  /* ============ 5. LES AUDIENCES ============ */
  A(H1('5. Les audiences syndicales'));
  A(BODY('Six questions possibles ; celle qui tombe dépend de l’état du système. Les organisations sont des pseudonymes transparents, pondérés par les résultats réels des élections professionnelles de 2022.'));
  A(H2('Les organisations'));
  A(REF('constantes.js › SYNDICATS'));
  A(tableau(['Pseudonyme', 'Organisation réelle', 'Poids 2022', 'Profil'],
    (K.SYNDICATS || []).map((s) => [s.nom, s.id.toUpperCase(), String(s.poids).replace('.', ',') + ' %', s.profil]), [2200, 2200, 1400, 3560]));
  A(VIDE());
  A(H2('Qui porte quoi : les mesures rattachées à chaque organisation'));
  A(REF('catalogue.js › PORTEURS_SYNDICAUX'));
  A(BODY('Lu dans la ligne « portée par » de chaque carte. Une organisation ne peut pas exiger le retrait d’une mesure qui figure dans cette liste pour elle : c’est la règle qui manquait au jeu. « L’intersyndicale » et « les organisations syndicales » engagent les sept. Le SNPDEN, syndicat des personnels de direction, n’est pas l’une des sept : qu’il porte une mesure ne la protège pas de la contestation des syndicats d’enseignants.'));
  {
    const parOrg = new Map((K.SYNDICATS || []).map((o) => [o.id, []]));
    for (const c of C.CATALOGUE) for (const id of C.porteursSyndicaux(c)) if (parOrg.has(id)) parOrg.get(id).push(c.label);
    A(tableau(['Organisation', 'Les mesures qu’elle défend'],
      (K.SYNDICATS || []).map((o) => [o.nom + ' (' + o.id.toUpperCase() + ')',
        (parOrg.get(o.id) || []).join(' · ') || 'aucune']), [2400, 6960], { taille: 17 }));
    A(VIDE());
  }

  for (const a of C.AUDIENCES) {
    A(H2('La question « ' + a.id + ' »'));
    A(REF('catalogue.js › AUDIENCES › ' + a.id));
    A(tableau(['Type', 'La réponse', 'Le mot du jeu'],
      a.reponses.map((r) => [r.type, r.titre, r.mot]), [1300, 3600, 4460]));
    A(VIDE());
  }
  A(H2('Les arguments avancés à l’appui d’un retrait'));
  A(REF('catalogue.js › PRINCIPES_FAMILLE et PRINCIPES_PROFIL'));
  A(BODY('L’argument étayé est fabriqué à partir des données de la carte contestée : il change à chaque partie et ne peut pas être faux. L’argument de principe, lui, est écrit. Le voici en entier, par famille de mesure, puis par profil d’organisation.'));
  const src = fs.readFileSync(path.join(racine, 'moteur/catalogue.js'), 'utf8');
  const extraireObjet = (nom) => {
    const i = src.indexOf('const ' + nom + ' = {');
    if (i < 0) return [];
    const j = src.indexOf('\n};', i);
    const bloc = src.slice(i, j);
    const out = [];
    const re = /^\s{2}(\w+):\s*'((?:[^'\\]|\\.)*)',?\s*$/gm;
    let m; while ((m = re.exec(bloc)) !== null) out.push([m[1], m[2].replace(/\\'/g, '’')]);
    return out;
  };
  A(tableau(['Famille de la mesure', 'L’argument de principe'],
    extraireObjet('PRINCIPES_FAMILLE').map(([k, v]) => [FAM[k] || k, v]), [2400, 6960]));
  A(VIDE());
  A(tableau(['Profil de l’organisation', 'La phrase ajoutée'],
    extraireObjet('PRINCIPES_PROFIL').map(([k, v]) => [k, v]), [2400, 6960]));
  A(SAUT());

  /* ============ 6. TURBULENCES ============ */
  A(H1('6. Ce qui vous arrive et que vous n’avez pas décidé'));

  A(H2('L’entretien à l’Élysée'));
  A(REF('constantes.js › ENTRETIEN'));
  for (const q of (K.ENTRETIEN || [])) {
    A(BODY([T(q.question, { bold: true })]));
    if (q.aparte) A(BODY([T(q.aparte, { italics: true, color: '565B6B' })]));
    A(tableau(['La réponse', 'Le détail affiché', 'Ce qu’elle ferme ou ouvre'],
      q.reponses.map((r) => [r.label, r.det || '—',
        [r.ferme ? 'ferme définitivement : ' + r.ferme.join(', ') : '',
         r.expose ? 'expose : ' + r.expose.join(', ') : '',
         r.mensonge ? 'et c’est un mensonge' : ''].filter(Boolean).join(' · ') || '—']), [2600, 4200, 2560]));
    A(VIDE());
  }

  A(H2('Les profils'));
  A(REF('constantes.js › PROFILS'));
  A(tableau(['Profil', 'Ce que le jeu en dit', 'Effets'],
    (K.PROFILS || []).map((p) => [p.nom, p.detail || '—',
      ['adhésion ' + sg(p.adhesion || 0), 'capital ' + sg(p.capital || 0), 'crédibilité ' + sg(p.credibilite || 0),
       p.expose ? 'expose à : ' + p.expose.join(', ') : ''].filter(Boolean).join(' · ')]), [2000, 4900, 2460]));
  A(VIDE());

  A(H2('Les affaires personnelles'));
  for (const a of C.AFFAIRES) {
    A(H3(a.titre + ' · « ' + a.manchette + ' »'));
    A(REF('catalogue.js › AFFAIRES › ' + a.id));
    A(BODY(a.recit));
    A(BODY([T('Ce que ce type d’affaire enseigne. ', { bold: true }), T(a.lecon)]));
    A(tableau(['La réponse', 'Le détail', 'Ce qui suit'],
      a.reponses.map((r) => [r.label, r.det, r.suite]), [2600, 3200, 3560]));
    A(VIDE());
  }

  A(H2('Les polémiques de rentrée'));
  for (const p of (C.POLEMIQUES_RENTREE || [])) {
    A(H3(p.titre || p.id));
    A(REF('catalogue.js › POLEMIQUES_RENTREE › ' + p.id));
    if (p.recit) A(BODY(p.recit));
    A(tableau(['La réponse', 'Le détail affiché', 'Ce qui suit'],
      (p.reponses || []).map((r) => [r.label, r.det || '—', r.suite || '—']), [2600, 3200, 3560]));
    A(VIDE());
  }

  A(H2('La livraison PISA'));
  A(REF('catalogue.js › LIVRAISON_PISA'));
  if (C.LIVRAISON_PISA) {
    const L = C.LIVRAISON_PISA;
    A(BODY([T(L.titre, { bold: true })]));
    A(BODY(L.recit));
    A(BODY([T('La contrainte. ', { bold: true }), T(L.contrainte)]));
    A(BODY('Familles de mesures qui apaisent la salle des professeurs : ' + (L.apaise || []).map((f) => (FAM[f] || f).toLowerCase()).join(', ') + '. Familles qui l’enflamment : ' + (L.enflamme || []).map((f) => (FAM[f] || f).toLowerCase()).join(', ') + '.'));
    A(VIDE());
  }

  A(H2('Le plateau de 20 heures'));
  A(REF('catalogue.js › PLATEAU'));
  if (C.PLATEAU) {
    if (C.PLATEAU.titre) A(BODY([T(C.PLATEAU.titre, { bold: true })]));
    if (C.PLATEAU.recit) A(BODY(C.PLATEAU.recit));
    for (const q of (C.PLATEAU.questions || [])) {
      A(BODY([T(q.q, { bold: true })]));
      A(tableau(['La réponse', 'Ce qui suit'],
        (q.reponses || []).map((r) => [r.label, r.suite || '—']), [3400, 5960]));
      A(VIDE());
    }
  }
  A(SAUT());

  /* ============ 7. LES PROJETS POLITIQUES ============ */
  A(H1('7. Les projets politiques de 2027'));
  A(REF('constantes.js › PROJETS_2027'));
  A(BODY('Ce que le jeu affiche sous chaque priorité, au moment où le joueur classe sa feuille de route. C’est de là que vient la lecture politique du jeu, et c’est la partie la plus datée : elle demande une vérification à chaque échéance électorale.'));
  for (const [cle, p] of Object.entries(K.PROJETS_2027 || {})) {
    A(H3(CPT[cle] || cle));
    A(BODY(p.sousTitre));
    A(tableau(['Qui', 'Ce qu’il ou elle porte'], p.porteurs.map((x) => [x.qui, x.quoi]), [2400, 6960]));
    A(BODY([T('Ce que la presse en décode. ', { bold: true }), T(p.decode)]));
    A(VIDE());
  }
  A(H2('La boussole : quels porteurs sont rattachés à quel bord'));
  A(REF('catalogue.js › BLOCS_2027 et RATTACHEMENTS'));
  A(tableau(['Bord', 'Qui il recouvre'],
    Object.values(C.BLOCS_2027).map((b) => [b.label, b.long]), [2400, 6960]));
  A(VIDE());
  const sansBord = C.CATALOGUE.filter((c) => !C.bordsDeCarte(c).length);
  A(BODY(sansBord.length + ' des ' + C.CATALOGUE.length + ' mesures ne sont rattachées à aucun bord : elles sont portées par la Cour des comptes, la DEPP, le Conseil scientifique, l’inspection générale, le Haut-commissariat ou la recherche. Les voici, parce que c’est la liste que vous voudrez sans doute vérifier en premier.'));
  A(tableau(['Mesure', 'Portée par'],
    sansBord.map((c) => [c.label, (c.porteurs || []).join(' · ')]), [4000, 5360], { taille: 17 }));
  A(SAUT());

  /* ============ 8. LES REPÈRES ============ */
  A(H1('8. Les fiches de repères et leurs chiffres'));
  A(BODY('Le contenu de l’onglet « Comprendre le jeu ». C’est la partie où une erreur coûte le plus cher : un chiffre faux ou mal daté décrédibilise tout le reste. Chaque chiffre est sur sa propre ligne dans le fichier, une correction est immédiate.'));
  for (const r of R.REPERES) {
    A(H2(r.titre));
    A(REF('reperes.js › ' + r.cle));
    A(BODY([T(r.resume, { italics: true })]));
    A(tableau(['Le chiffre', 'Ce qu’il dit', 'Source'],
      r.chiffres.map((x) => [x.v, x.l, (R.SOURCES[x.src] || {}).org || x.src]), [1500, 5700, 2160], { taille: 17 }));
    A(BODY([T('Ce qu’il faut en retenir. ', { bold: true }), T(r.aRetenir)]));
    A(VIDE());
  }
  A(H2('Les trois notes de juin 2027'));
  A(REF('reperes.js › CADRAGE_INITIAL'));
  for (const b of R.CADRAGE_INITIAL) {
    A(H3(b.titre));
    A(BODY([T(b.accroche.v + ' · ', { bold: true }), T(b.accroche.l)]));
    A(tableau(['Le chiffre', 'Ce qu’il dit', 'Source'],
      b.chiffres.map((x) => [x.v, x.l, (R.SOURCES[x.src] || {}).org || x.src]), [1500, 5700, 2160], { taille: 17 }));
    A(BODY([T('À retenir. ', { bold: true }), T(b.aRetenir)]));
    A(VIDE());
  }
  A(H2('Les ' + Object.keys(R.SOURCES).length + ' sources'));
  A(REF('reperes.js › SOURCES'));
  A(tableau(['Organisme', 'Document', 'Date'],
    Object.values(R.SOURCES).map((s) => [s.org, s.titre, s.date]), [2200, 5560, 1600], { taille: 17 }));
  A(SAUT());

  /* ============ 9. LA PRESSE ============ */
  A(H1('9. La presse, le fil social, les fins de partie'));
  A(BODY('C’est l’endroit où passe l’humour du jeu, et donc celui où votre œil de lecteur du système comptera le plus : une satire qui tombe à côté se voit tout de suite.'));
  const app = fs.readFileSync(path.join(racine, 'interface/app.js'), 'utf8');
  const listeDe = (nom) => {
    const i = app.indexOf('const ' + nom);
    if (i < 0) return [];
    const j = app.indexOf('\n];', i);
    const bloc = app.slice(i, j > 0 ? j : i + 4000);
    const out = []; const re = /'((?:[^'\\\n]|\\.)*)'/g; let m;
    while ((m = re.exec(bloc)) !== null) { const t = m[1].replace(/\\'/g, '’'); if (t.length > 3) out.push(t); }
    return out;
  };
  const journaux = listeDe('JOURNAUX');
  if (journaux.length) {
    A(H2('Les titres de presse'));
    A(REF('app.js › JOURNAUX'));
    A(BODY('Un seul est tiré au sort par partie et sert de journal de référence : ' + journaux.join(', ') + '.'));
  }
  const sign = listeDe('BREVES_SIGNATURES');
  if (sign.length) {
    A(H2('Les signatures de brèves'));
    A(REF('app.js › BREVES_SIGNATURES'));
    A(BODY(sign.join(' · ')));
  }
  A(H2('Les fins de partie'));
  A(REF('app.js › ecranBilan › fins'));
  const finsBloc = app.slice(app.indexOf('const fins = {'), app.indexOf('}[B.fin.type]'));
  const finsRe = /\[\s*'((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)'\s*\]/g;
  const fins = []; let fm;
  while ((fm = finsRe.exec(finsBloc)) !== null) fins.push([fm[1].replace(/\\'/g, '’'), fm[2].replace(/\\'/g, '’')]);
  A(tableau(['La une', 'Le sous-titre'], fins, [3600, 5760]));
  A(VIDE());

  /* ---- pied ---- */
  A(new Paragraph({ text: '', spacing: { before: 400 } }));
  A(new Paragraph({
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'D8DAE4' } },
    spacing: { before: 200, after: 120 }, children: [T('')],
  }));
  A(new Paragraph({ children: [T('Jeu pédagogique indépendant, sans lien avec le ministère de l’Éducation nationale. Les personnages, les organisations syndicales et les titres de presse sont des pseudonymes transparents ; les propositions politiques citées sont réelles et attribuées à leurs auteurs. Code sous licence MIT, contenus sous licence CC BY-SA 4.0.', { size: 18, italics: true, color: '8A8FA3' })], alignment: AlignmentType.JUSTIFIED }));

  const doc = new Document({
    creator: 'Rue de Grenelle',
    title: 'Rue de Grenelle, tout le texte du jeu',
    description: 'Document de relecture nº 2 : le contenu, phrase par phrase',
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 21, color: '1E1F26' }, paragraph: { spacing: { line: 264 } } },
        heading1: { run: { font: 'Calibri', size: 32, bold: true, color: '000091' } },
        heading2: { run: { font: 'Calibri', size: 25, bold: true, color: '1E1F26' } },
        heading3: { run: { font: 'Calibri', size: 22, bold: true, color: '565B6B' } },
      },
    },
    numbering: {
      config: [{
        reference: 'puces',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.18) } } } }],
      }],
    },
    features: { updateFields: true },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      children: enfants,
    }],
  });

  const b = await Packer.toBuffer(doc);
  fs.writeFileSync(process.argv[2] || 'rue-de-grenelle-contenu.docx', b);
  console.log('écrit :', (b.length / 1024).toFixed(0), 'Ko ·', enfants.length, 'blocs');
})().catch((e) => { console.error(e); process.exit(1); });
