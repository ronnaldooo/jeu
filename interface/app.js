/* ============================================================================
   RUE DE GRENELLE, application (interface)
   Pilote le générateur `derouler` du moteur : chaque yield est un écran.
   La sauvegarde rejoue le journal des décisions sur la même graine.
   ========================================================================== */
'use strict';

/* ---------------------------------------------------------------- outils --- */
const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const alea = (arr) => arr[Math.floor(Math.random() * arr.length)];
const fmt1 = (x) => (Math.round(x * 10) / 10).toLocaleString('fr-FR');
const fmt0 = (x) => Math.round(x).toLocaleString('fr-FR');
const signe = (x) => (x > 0 ? '+' + fmt1(x) : fmt1(x).replace(/^-/, '\u2212'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
/* typographie française pour les textes du moteur : décimales à virgule */
const fr = (s) => esc(s).replace(/(\d)\.(\d)/g, '$1,$2');

const NOMS_C = { reussite: 'Réussite', egalite: 'Inégalités', sante: 'Santé du système', paix: 'Paix sociale', budget: 'Salaires' };
const NOMS_C_LONGS = {
  reussite: 'Réussite des élèves', egalite: 'Réduction des inégalités',
  sante: 'Santé du système', paix: 'Paix sociale', budget: 'Salaires',
};
const COULEURS_C = { reussite: 'var(--c-reussite)', egalite: 'var(--c-egalite)', sante: 'var(--c-sante)', paix: 'var(--c-paix)', budget: 'var(--c-budget)' };
const FAMILLES = {
  moyens: ['Moyens & encadrement', 'var(--c-reussite)'],
  autonomie: ['Autonomie & évaluation', 'var(--c-budget)'],
  parcours: ['Parcours & orientation', 'var(--c-sante)'],
  autorite: ['Autorité & familles', 'var(--c-paix)'],
  mixite: ['Mixité & carte scolaire', 'var(--c-egalite)'],
};
const MOIS_L = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/* ------------------------------------------------------- distribution ------ */
/* Satire symétrique : personnages transparents, tout le monde y passe. */
/* Le paysage médiatique. Pseudonymes transparents, satire symétrique : le
   quotidien national de droite, celui de gauche, la presse régionale, la presse
   spécialisée que lisent réellement les personnels, les chaînes d'info, les
   hebdos et la presse syndicale, chacun avec sa manière de dire la même
   chose. Le titre du quotidien de référence est tiré au sort par partie : on
   ne suit pas le même journal deux mandats de suite. */
const JOURNAUX = [
  'La Gazette de Grenelle', 'Le Quotidien de l’École', 'L’Estrade',
  'Le Courrier des Écoles', 'La Craie du Matin', 'Le Journal du Soir',
];
const BREVES_SIGNATURES = [
  /* quotidiens nationaux */
  'Le Figareau', 'Libécole', 'Le Monde de l’Estrade', 'La Croix du Tableau',
  'L’Ardoise', 'Les Écho-liers', 'Le Périscolaire', 'Médiacraie',
  /* hebdomadaires et magazines */
  'Le Cancre Enchaîné', 'Le Point Médian', 'L’Exposé', 'Marianne du Soir',
  'Valeurs Scolaires', 'Téléramage',
  /* presse régionale */
  'Ouest-Trance', 'La Voix du Fond de la Classe', 'Sud-Devoirs',
  'Le Dauphin Libéré', 'La Dépêche de Midi-Journée',
  /* presse spécialisée éducation, celle que lisent les personnels */
  'Le Percolateur pédagogique', 'ToutÉduque', 'Dépêches Éducation',
  'VousNousEux', 'Les Cahiers à Spirale',
  /* radio, télévision, syndicats */
  'BFM Récré', 'France Interro', 'Être et Savoir-Faire',
  'Fenêtres sur Cour de Récré', 'Le Bulletin Intersyndical',
];
const CAST = {
  pm: 'Barthélemy Roulette, Premier ministre',
  bercy: 'Aymeric Sécateur, ministre des Comptes publics',
  journal: 'La Gazette de Grenelle',      // remplacé au démarrage par tirage
  breves: BREVES_SIGNATURES,
};
const COMPTES = [
  { a: 'Craie Voyante', p: '@CraieVoyante · prof de lettres, voit tout venir', quand: (s) => s.phys.adhesion < 30, posts: [
    'Nouveau plan ministériel reçu ce matin. Je le range avec les huit autres. Le classeur s’appelle « À appliquer dès que possible », il date de 2017.',
    'On nous demande de restaurer l’autorité, le niveau, le lien avec les familles et la République. Toujours entre 8 h et 8 h 05, avant l’appel.',
    'Le ministère parle de « co-construction ». C’est le nom administratif du moment où on nous informe après la presse.',
  ] },
  { a: 'Parent Délégué 67', p: '@ParentDelegue67 · FPCE, 3 enfants, 0 remplaçant', quand: (s) => s.phys.parents < 42, posts: [
    'Jour 12 sans prof de maths en 4e. Le collège nous dit que « le rectorat est saisi ». Le rectorat doit être très occupé à se saisir.',
    'On a reçu un questionnaire de satisfaction du ministère. Question 1 : êtes-vous satisfaits ? Il n’y avait pas de question 2.',
  ] },
  { a: 'Dirlo Fatigué', p: '@DirloFatigue · directeur d’école, 27e enquête de l’année', quand: () => true, posts: [
    'Enquête ministérielle urgente : combien de prises électriques dans votre école ? C’est la troisième fois. Elles n’ont pas bougé.',
    'J’ai une décharge de direction de 8 heures. J’ai passé 9 heures cette semaine à chercher un remplaçant. Le compte est bon.',
  ] },
  { a: 'Bercy Leaks', p: '@BercyLeaks · fuites certifiées conformes', quand: (s) => s.creditBercy < 30, posts: [
    'Selon nos informations, la lettre plafond de la rue de Grenelle tient sur un timbre.',
    'Note interne : « le ministère de l’Éducation demande des moyens ». Bercy a répondu « bien reçu », ce qui, en langage Bercy, veut dire non.',
  ] },
  { a: 'Jean-Michel Blanquette', p: '@JMBlanquette · ancien ministre, twitte avant le lever du soleil', quand: () => true, posts: [
    'Ce que je vois rue de Grenelle me préoccupe. De mon temps, les choses étaient claires : elles étaient décidées, puis annoncées, puis re-annoncées.',
    'Je dis les choses simplement : il faut de l’exigence, de la bienveillance, et un communiqué avant 7 heures.',
  ] },
  { a: 'Gabriel Attable', p: '@GAttable · ancien ministre aussi, disponible pour en reparler', quand: () => true, posts: [
    'J’avais engagé exactement cette réforme. Ou son contraire. Dans les deux cas, j’invite le ministre à s’inspirer de mon bilan.',
    'Le niveau, l’autorité, l’uniforme. Je mets ça là, au cas où quelqu’un chercherait un programme.',
  ] },
  { a: 'Jean-Luc Mélanchton', p: '@Melanchton · la réforme (de l’éducation) ou la mort', quand: () => true, posts: [
    'Pendant que le ministre compte ses postes, le privé sous contrat compte ses IPS. Abrogation. Générale. Tout de suite.',
    '19 élèves par classe. C’est écrit dans notre programme depuis 2012, page 34. Je vous attends page 34.',
  ] },
  { a: 'Marine de Montretout', p: '@MdeMontretout · l’école du bon sens', quand: () => true, posts: [
    'Les Français veulent une école qui instruit. Le ministre propose un comité. Chacun jugera.',
    'Uniforme, autorité, fondamentaux. Trois mots que la rue de Grenelle a rayés du dictionnaire, probablement lors d’un allègement des programmes.',
  ] },
];

/* --------------------------------------------------------------- unes ------ */
function unesPossibles(etape) {
  const S = ETAT.s, dern = S.greves[S.greves.length - 1];
  const u = [];
  /* Chaque situation a plusieurs unes possibles : sans cela, un joueur qui
     enchaîne deux mandats lit deux fois le même journal. Le choix est
     déterministe (graine + année + mois) pour que la sauvegarde le rejoue. */
  const tour = (S.graine + S.annee * 7 + (S.mois || 0) * 3);
  const pousser = (cond, titre, sous) => {
    if (!cond) return;
    if (Array.isArray(titre)) { const v = titre[tour % titre.length]; u.push({ titre: v[0], sous: v[1] }); }
    else u.push({ titre, sous });
  };
  const j = nouvellesEntrees();
  const a = (cat) => j.some((e) => e.cat === cat);

  pousser(a('pisa'), 'PISA : la France piétine, le ministre répond',
    'L’enquête mesure des élèves entrés au CP dix ans avant la nomination du ministre. Détail que le plateau de 20 h a choisi de garder pour lui.');
  pousser(a('greve') && dern, `Grève dans l’éducation : ${fmt1(dern ? dern.tauxSyndicats : 0)} % de grévistes selon l’intersyndicale, ${fmt1(dern ? dern.tauxMinistere : 0)} % selon le ministère`,
    'Les deux chiffres sont exacts. Ils ne comptent simplement pas la même chose, ce qui tombe bien : personne ne compte pareil.');
  pousser(a('matignon'), 'Rue de Grenelle : Matignon convoque, le ministre « conforté »',
    '« Conforté » est, dans la presse gouvernementale, le stade qui précède immédiatement « remplacé ».');
  pousser(a('prive'), 'École privée : la tension monte, le mot « Savary » est lâché',
    'Au ministère, on assure « assumer le dialogue ». Le dialogue a prévu de défiler un dimanche.');
  pousser(a('rentree') && ETAT.rentreeRatee, [
    ['Rentrée : le compteur des classes sans professeur tourne déjà',
     'Le ministère parle de « tensions localisées ». La localisation : un peu partout.'],
    ['« Ma fille a eu quatre professeurs en trois semaines » : la rentrée vue d’en bas',
     'Le rectorat évoque « une situation en voie de résolution ». La classe, elle, évoque le couloir.'],
    ['Rentrée sous tension : les remplaçants manquent là où ils manquaient déjà',
     'Le ministère rappelle que la carte des difficultés est stable. C’est exact, et c’est le problème.'],
  ]);
  pousser(a('rentree') && !ETAT.rentreeRatee, [
    ['Rentrée sans accroc rue de Grenelle',
     'Un professeur devant chaque classe ou presque. L’information, jugée peu spectaculaire, est en page 12.'],
    ['Rentrée : « rien à signaler », et personne pour le signaler',
     'Douze millions d’élèves sont entrés en classe sans incident. Aucune chaîne d’information n’a ouvert dessus.'],
    ['Le ministre visite une école, la rentrée se passe bien',
     'Les deux faits sont indépendants, ce que la photographie ne dit pas.'],
  ]);
  pousser(a('bercy'), 'Budget de l’éducation : bras de fer avec Bercy',
    'Les deux ministères partagent le même gouvernement, ce qui ne les a jamais rapprochés.');
  pousser(a('concours'), `Concours : ${fmt1(S.phys.couvertureConcours)} % des postes pourvus`,
    S.phys.couvertureConcours < 90 ? 'Le vivier est un lac. Le lac baisse.' : 'Le frémissement est confirmé par les autorités compétentes en frémissements.');
  pousser(a('maires'), 'Fermetures de classes : les maires montent au créneau',
    '« Aucune école ne ferme sans l’accord du maire. » Les maires viennent de relire la phrase à voix haute.');
  pousser(a('elysee'), 'L’Élysée s’impatiente',
    'Le Château rappelle qu’il existe, exercice dans lequel il excelle.');
  pousser(etape === 'cloture', `An ${S.annee} du mandat : ce qui a changé, ce qui attend`,
    'Le système scolaire bouge à la vitesse d’un paquebot. Le ministre rame, la presse chronomètre.');
  pousser(a('dossier'), [
    ['Un rapport de plus sur le bureau du ministre',
     'Il rejoint les précédents. Le ministère indique qu’il sera « étudié avec la plus grande attention », formule dont la durée de vie moyenne est de six mois.'],
    ['Éducation : les experts recommandent, le ministère prend acte',
     '« Prendre acte » est le seul verbe de l’administration qui ne suppose aucune action.'],
  ]);
  pousser(a('salaires'), [
    ['Salaires : le ministre annonce, les syndicats calculent',
     'Le calcul dépend de l’unité choisie : le brut mensuel, le net, ou le pouvoir d’achat depuis 2010. Les trois ont été retenus, par trois personnes différentes.'],
    ['Revalorisation : « historique », selon le ministère',
     'Le mot a été employé pour la sixième fois en dix ans, ce qui pose une question de vocabulaire.'],
  ]);
  pousser(a('audience'), [
    ['Le ministre reçoit les organisations syndicales',
     'La rencontre a duré deux heures. Les communiqués publiés à l’issue permettent de douter qu’il s’agissait de la même.'],
    ['Après l’audience : « climat constructif », « aucune avancée »',
     'Les deux formules figurent dans le même compte rendu, à quatre lignes d’intervalle.'],
  ]);
  pousser(true, [
    ['Rue de Grenelle : le ministre poursuit sa route',
     'Selon son entourage, « le cap est clair ». Le cap n’a pas souhaité répondre à nos questions.'],
    ['Éducation : la réforme suit son cours, disent ceux qui la suivent',
     'Ceux qui l’appliquent n’ont pas été joints : ils étaient en cours.'],
    ['Le ministère communique sur sa méthode',
     'La méthode consiste à communiquer sur la méthode. Notre rédaction poursuit ses investigations.'],
    ['Une semaine ordinaire rue de Grenelle',
     'Quatre notes de service, une visite d’établissement, un tweet. Le système scolaire, lui, a fonctionné sans en être informé.'],
  ]);
  return u;
}

function nouvellesEntrees() {
  return ETAT.s.journal.slice(ETAT.journalLu);
}

/* ---------------------------------------------------------------- HUD ----- */
/* Trois compteurs affichés, pas cinq. Ce sont les trois que le joueur a lui-même
   placés en tête de sa doctrine en juin 2027 : ils pèsent 80 % de son bilan
   (35 + 25 + 20). Les deux autres continuent d'être tenus (ils comptent dans le
   score et réapparaissent au bilan) mais ne sont pas sous les yeux. Un ministre
   ne regarde que le tableau de bord qu'il s'est donné ; c'est précisément là que
   les surprises se logent. Les alertes ci-dessous servent à cela : quand une
   mécanique invisible se met à mordre, elle vient le dire. */
let repereAnnee = null;   // valeurs des compteurs à l'ouverture de l'année en cours
function majHud() {
  const S = ETAT.s;
  $('#hud').hidden = false;
  $('#hud-date').textContent = ETAT.dateLabel || 'juin 2027';
  if (!repereAnnee || repereAnnee.annee !== S.annee) repereAnnee = { annee: S.annee, v: { ...S.affiche } };
  const zone = $('#hud-compteurs'); zone.innerHTML = '';
  const ordre = S.doctrine || Object.keys(NOMS_C);
  for (const c of ordre.slice(0, 3)) {
    const v = S.affiche[c];
    const d = v - repereAnnee.v[c];
    const j = el('div', 'jauge grande');
    j.innerHTML = `<div class="nom"><span>${NOMS_C[c]}</span><b>${fmt0(v)}</b></div>
      <div class="rail"><i style="width:${Math.max(2, Math.min(100, v))}%;background:${COULEURS_C[c]}"></i></div>
      <div class="delta ${d > 0.5 ? 'up' : d < -0.5 ? 'down' : ''}">${Math.abs(d) > 0.5 ? (d > 0 ? '▲ +' : '▼ −') + fmt1(Math.abs(d)) + ' cette année' : 'stable cette année'}</div>`;
    zone.appendChild(j);
  }
  $('#hud-sous').innerHTML = [
    `Capital politique <b>${fmt0(S.capital)}</b>`,
    `Crédibilité <b class="${S.credibilite < 35 ? 'neg' : ''}">${fmt0(S.credibilite)}</b> <small>(vos annonces valent ×${(Math.round(facteurParole(S) * 100) / 100).toLocaleString('fr-FR')})</small>`,
    `Crédit Bercy <b class="${S.creditBercy < 20 ? 'neg' : ''}">${fmt0(S.creditBercy)}</b>`,
  ].map((x) => `<span>${x}</span>`).join('');
  majAlertes(S);
}

/* --- alertes ---------------------------------------------------------------
   Le jeu tient une dizaine de variables que le joueur ne voit pas : adhésion des
   personnels, fatigue réformatrice, capacité d'absorption, couverture des
   concours, heures non assurées, ségrégation public/privé. Elles décident du
   résultat réel sans jamais s'afficher. Plutôt que de les remettre toutes à
   l'écran (c'était le reproche : trop de compteurs), elles se signalent
   d'elles-mêmes quand elles se mettent à mordre. Une alerte ne se déclenche
   qu'une fois par mandat et ne reste affichée que l'année en cours. */
const alertesVues = new Set();
let alertesActives = [];
let anneeDerniereAlerte = -1;
function reglesAlertes(S) {
  const abs = absorption(S);
  const cachees = S.doctrine ? S.doctrine.slice(3) : [];
  const R = [
    { cle: 'adhesion', si: S.phys.adhesion <= 14, t: 'Les personnels ne suivent plus',
      p: `Adhésion enseignante à ${fmt0(S.phys.adhesion)} sur 100. Vos annonces ne s’appliquent qu’à ${Math.round(facteurImplementation(S) * 100)} % de leur effet documenté : une réforme ne vaut que ce que les personnels en font. C’est invisible à l’écran et décisif au bilan.` },
    { cle: 'absorption', si: abs.nActives > K.ABSORPTION.seuil, t: 'Le système est saturé',
      p: `${abs.nActives} réformes tournent en même temps, pour une capacité d’absorption de ${K.ABSORPTION.seuil}. Chacune rabote l’effet de <b>toutes les autres</b> (elles ne valent plus que ${Math.round(abs.penalite * 100)} % de leur portée). Empiler n’est pas réformer.` },
    { cle: 'concours', si: S.phys.couvertureConcours < 88, t: 'Les postes ne se pourvoient plus',
      p: `${fmt1(S.phys.couvertureConcours)} % des postes offerts aux concours sont pourvus. Un poste créé au budget mais non pourvu ne met personne devant les élèves : la boucle salaires → candidats → remplacement se referme lentement, et elle est longue à rouvrir.` },
    { cle: 'heures', si: S.phys.heuresNonAssurees > 11.5, t: 'Les heures perdues se voient dans les familles',
      p: `${fmt1(S.phys.heuresNonAssurees)} % des heures dues ne sont pas assurées. C’est le seul indicateur que les parents mesurent eux-mêmes, chaque semaine, sans attendre une évaluation internationale.` },
    { cle: 'segregation', si: S.phys.segregation > K.PHYSIQUE_INITIALE.segregation + 1.5, t: 'L’écart public / privé se creuse',
      p: `L’écart d’indice de position sociale entre collèges privés et publics atteint ${fmt1(S.phys.segregation)} points (${fmt1(K.PHYSIQUE_INITIALE.segregation)} à votre arrivée). Épargner le privé sous contrat n’est pas neutre : la ségrégation monte, et elle pèse directement sur votre compteur <b>Réduction des inégalités</b>.` },
    { cle: 'credibilite', si: S.credibilite < 35, t: 'Votre parole ne porte plus',
      p: `Crédibilité à ${fmt0(S.credibilite)}. Vos annonces ne produisent plus que ×${(Math.round(facteurParole(S) * 100) / 100).toLocaleString('fr-FR')} de leur effet d’image. Annoncer davantage n’y changera rien : c’est le crédit accumulé qui manque, pas le volume.` },
    { cle: 'fatigue', si: S.fatigue >= 80, t: 'Fatigue réformatrice',
      p: `Indice de fatigue à ${fmt0(S.fatigue)} sur 100. Sept ministres en trois ans avant vous, et vous ajoutez des chantiers : à ce niveau, la maison encaisse les circulaires sans plus les appliquer.` },
  ];
  for (const c of cachees) {
    const v = S.affiche[c], d0 = K.COMPTEURS_INITIAUX[c], rang = S.doctrine.indexOf(c);
    R.push({ cle: 'cache-' + c, si: v <= d0 - 7, t: `Le compteur « ${NOMS_C_LONGS[c]} » décroche`,
      p: `Ce compteur n’est pas affiché sur votre tableau de bord : vous l’avez classé n° ${rang + 1} de votre doctrine. Il est tenu quand même (${fmt0(d0)} en juin 2027, ${fmt0(v)} aujourd’hui) et il vaut ${K.POIDS_DOCTRINE[rang]} % de votre bilan final.` });
  }
  return R;
}
function majAlertes(S) {
  alertesActives = alertesActives.filter((a) => a.annee === S.annee);
  /* Rationnement volontaire : une alerte par année au plus, trois par mandat.
     Une alerte qui revient tous les écrans n'alerte plus personne, elle décore.
     Les règles sont classées par ordre de priorité : la première qui mord passe,
     les autres attendront l'année suivante, ou ne viendront jamais. */
  if (alertesVues.size < 3 && S.annee !== anneeDerniereAlerte) {
    const r = reglesAlertes(S).find((x) => x.si && !alertesVues.has(x.cle));
    if (r) {
      alertesVues.add(r.cle);
      anneeDerniereAlerte = S.annee;
      alertesActives.push({ cle: r.cle, titre: r.t, texte: r.p, annee: S.annee });
    }
  }
  const z = $('#hud-alertes');
  z.hidden = alertesActives.length === 0;
  z.innerHTML = alertesActives.map((a) =>
    `<div class="alerte-hud"><b class="t">${esc(a.titre)}</b><span>${a.texte}</span></div>`).join('');
}

/* ------------------------------------------------------------ écrans ------- */
function scene(...blocs) {
  const sc = $('#scene'); sc.innerHTML = '';
  for (const b of blocs) sc.appendChild(b);
  $('#suite').hidden = true;
  window.scrollTo({ top: 0 });
}
function boutonSuite(label, ctx, action) {
  $('#suite').hidden = false;
  $('#suite-ctx').textContent = ctx || '';
  const b = $('#suite-btn'); b.textContent = label;
  b.onclick = action;
}
/* Pictogrammes d'en-tête : un trait, une couleur, vingt-quatre pixels. Ils
   servent à reconnaître l'écran avant de le lire, pas à décorer. */
const PICTO = {
  telephone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/>',
  colonnes: '<path d="M3 21h18M4 9h16M6 9v10M10 9v10M14 9v10M18 9v10M12 3 3 8h18z"/>',
  carte: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M6 17c.6-2 1.9-3 3-3s2.4 1 3 3M14 9h4M14 13h4"/>',
  pupitre: '<path d="M8 21h8M12 15v6M6 3h12l-1.5 12h-9zM12 3v12"/>',
  dossier: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 11h18"/>',
  pieces: '<circle cx="9" cy="12" r="6"/><path d="M15 6.5a6 6 0 1 1 0 11M7 12h4M9 10v4"/>',
  courbe: '<path d="M3 20h18M4 16l5-6 4 3 7-8"/><path d="M16 5h4v4"/>',
  ecole: '<path d="M3 21h18M5 21V10l7-5 7 5v11M10 21v-5h4v5M12 5V3"/>',
  megaphone: '<path d="M3 10v4a1 1 0 0 0 1 1h3l8 4V5L7 9H4a1 1 0 0 0-1 1zM18 9a4 4 0 0 1 0 6M7 15l1 5h3"/>',
  journal: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M7 8h6M7 12h10M7 16h10M15 8h2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  tele: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M9 3l3 3 3-3"/>',
  alerte: '<path d="M12 3 2 20h20zM12 10v4M12 17v.5"/>',
  plan: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
  liste: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.5M3 12h.5M3 18h.5"/>',
  soleil: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  lettre: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  boussole: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  drapeau: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
};
/* Le kit personnages : une tête, un buste, des bras, des jambes, tous
   construits par les mêmes fonctions pour que les silhouettes se ressemblent
   d'une scène à l'autre. Le mobilier est rempli de la couleur de la fiche :
   il masque le bas des corps, personne ne flotte. Ce sont des silhouettes de
   fonction, pas des portraits : aucun personnage n'est identifiable. */
const A = (v) => Math.round(v * 10) / 10;

/* Tête. r = rayon, o.cheveux court|carre|raie|chauve, o.regard -1|1,
   o.bouche sourire|ligne. */
function tete(x, y, r, o) {
  o = o || {};
  const g = o.regard === undefined ? 1 : o.regard;
  const d = g * 1.4;
  const w = r < 10 ? 1.2 : 1.3;
  const s = ['<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>'];
  const hy = A(y - r * 0.18), h = A(r + 1.4);
  if (o.cheveux !== 'chauve') {
    s.push('<path d="M' + A(x - r - 0.4) + ' ' + hy + 'A' + h + ' ' + h
      + ' 0 0 1 ' + A(x + r + 0.4) + ' ' + hy + '" stroke-width="' + w + '"/>');
  }
  if (o.cheveux === 'carre') {
    s.push('<path d="M' + A(x - r - 0.9) + ' ' + hy + 'q-0.6 ' + A(r * 0.7) + ' 0.8 '
      + A(r * 1.1) + 'M' + A(x + r + 0.9) + ' ' + hy + 'q0.6 ' + A(r * 0.7) + ' -0.8 '
      + A(r * 1.1) + '" stroke-width="' + w + '"/>');
  }
  if (o.cheveux === 'raie') {
    s.push('<path d="M' + A(x - r * 0.35) + ' ' + A(y - r - 0.6) + 'L' + A(x + r * 0.75)
      + ' ' + A(y - r * 0.35) + '" stroke-width="' + w + '"/>');
  }
  const er = r < 10 ? 1.1 : 1.3, ex = r < 10 ? 2.6 : 3.2, ey = A(y + 0.4);
  s.push('<circle cx="' + A(x - ex + d) + '" cy="' + ey + '" r="' + er + '" fill="currentColor" stroke="none"/>');
  s.push('<circle cx="' + A(x + ex + d) + '" cy="' + ey + '" r="' + er + '" fill="currentColor" stroke="none"/>');
  const my = A(y + r * 0.55);
  s.push(o.bouche === 'ligne'
    ? '<path d="M' + A(x - 2.6 + d) + ' ' + my + 'h5.2" stroke-width="' + w + '"/>'
    : '<path d="M' + A(x - 2.8 + d) + ' ' + my + 'q2.8 2.4 5.6 0" stroke-width="' + w + '"/>');
  return s.join('');
}

/* Buste, du cou à yBas. o.cravate, o.col, o.brasGauche/brasDroit :
   'bas' (défaut) | 'leve' | 'tendu' | 'aucun'. */
function buste(x, yTete, r, yBas, o) {
  o = o || {};
  const yEp = A(yTete + r + 4), l = A(o.larg || r * 1.5);
  const s = ['<path d="M' + x + ' ' + A(yTete + r - 0.5) + 'v4.5" stroke-width="1.3"/>'];
  s.push('<path d="M' + A(x - l) + ' ' + yBas + 'V' + A(yEp + 4)
    + 'C' + A(x - l) + ' ' + A(yEp - 1) + ' ' + A(x - l * 0.55) + ' ' + A(yEp - 3) + ' ' + x + ' ' + A(yEp - 3)
    + 'C' + A(x + l * 0.55) + ' ' + A(yEp - 3) + ' ' + A(x + l) + ' ' + A(yEp - 1) + ' ' + A(x + l) + ' ' + A(yEp + 4)
    + 'V' + yBas + '" stroke-width="1.5"/>');
  const bras = (cote, mode) => {
    const bx = A(x + cote * l * 0.6), by = A(yEp + 2);
    if (mode === 'aucun') return '';
    if (mode === 'leve') return '<path d="M' + bx + ' ' + by + 'L' + A(x + cote * (l + 7))
      + ' ' + A(yEp - 16) + '" stroke-width="1.4"/><circle cx="' + A(x + cote * (l + 8))
      + '" cy="' + A(yEp - 19) + '" r="2.4" stroke-width="1.2"/>';
    if (mode === 'tendu') return '<path d="M' + bx + ' ' + by + 'L' + A(x + cote * (l + 12))
      + ' ' + A(yEp + 1) + '" stroke-width="1.4"/><circle cx="' + A(x + cote * (l + 14.5))
      + '" cy="' + A(yEp + 1) + '" r="2.2" stroke-width="1.2"/>';
    return '<path d="M' + bx + ' ' + by + 'V' + yBas + '" stroke-width="1.2"/>';
  };
  s.push(bras(-1, o.brasGauche || 'bas'));
  s.push(bras(1, o.brasDroit || 'bas'));
  if (o.col !== false) s.push('<path d="M' + A(x - 4) + ' ' + A(yEp - 2) + 'L' + x + ' '
    + A(yEp + 4.5) + 'L' + A(x + 4) + ' ' + A(yEp - 2) + '" stroke-width="1.2"/>');
  if (o.cravate) s.push('<path d="M' + x + ' ' + A(yEp + 4.5) + 'l-2 3 2 8 2-8z" stroke-width="1.1"/>');
  return s.join('');
}

function jambes(x, yH, yB, e) {
  e = e || 6;
  return '<path d="M' + A(x - 2) + ' ' + yH + 'L' + A(x - e) + ' ' + yB
    + 'M' + A(x + 2) + ' ' + yH + 'L' + A(x + e) + ' ' + yB + '" stroke-width="1.5"/>';
}

/* ---------------------------------------------------------------------------
   Vocabulaire graphique commun à toutes les illustrations.

   Trois défauts de la première série, corrigés ici : tout était au même
   trait (aucune hiérarchie), tout était vide (aucun volume), et tout
   flottait sur une ligne de sol unique (aucune profondeur).

   - `masse`  : une surface opaque (elle masque ce qui est derrière) puis
                une trame d'encre à 7 % (elle donne le volume), puis le trait.
   - `trame`  : une surface teintée sans masquage, pour les plans arrière.
   - `ombre`  : une ellipse très pâle au sol, qui pose l'objet.
   - Épaisseurs : 1,9 pour les contours porteurs, 1,5 pour le mobilier,
     1,05 pour les détails. C'est ce qui fait lire une image au premier coup
     d'œil plutôt qu'un fil de fer.
   - Accent : `ACC` (le rouge de la charte) sur UN élément par scène, et
     seulement quand il dit quelque chose — le voyant d'antenne, les écoles
     fermées, le cachet de Bercy.
--------------------------------------------------------------------------- */
const ACC = 'var(--rouge-rf)';
const masse = (d, o) => `<path d="${d}" fill="var(--fond-illus,#fff)" stroke="none"/>`
  + `<path d="${d}" fill="currentColor" fill-opacity=".07"${o || ''}/>`;
const trame = (d, t, o) => `<path d="${d}" fill="currentColor" fill-opacity="${t || '.07'}"${o || ' stroke="none"'}/>`;
const ombre = (x, y, rx, t) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${Math.max(2, Math.round(rx * 0.14))}" fill="currentColor" fill-opacity="${t || '.07'}" stroke="none"/>`;
const carreau = (x, y, w, h) => masse(`M${x} ${y}h${w}v${h}h${-w}z`, ' stroke-width="1.3"')
  + `<path d="M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}" stroke-width="1.05"/>`;

/* Les illustrations : encre du thème, aplats de trame, un accent rouge par
   scène au plus. Un bandeau 280×120 en tête de document, une vignette
   120×120 flottant à droite du chapô. Elles nomment l'écran d'un coup d'œil ;
   elles n'ajoutent rien à lire. */
const ILLUS = {


/* L'accueil : la façade du 110, vue de la rue. */
facade: `<svg viewBox="0 0 280 120" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  ${ombre(140, 111, 124, '.06')}
  ${trame('M40 44h200v22H40z', '.05')}
  ${masse('M30 110V44h220v66', ' stroke-width="1.9"')}
  ${masse('M23 44l8-11h218l8 11z', ' stroke-width="1.6"')}
  ${masse('M60 33V21h12v12M206 33V17h12v16', ' stroke-width="1.3"')}
  ${[48, 84, 178, 214].map((x) => carreau(x, 58, 24, 28)).join('\n  ')}
  ${masse('M124 110V74a16 16 0 0 1 32 0v36z', ' stroke-width="1.7"')}
  <path d="M140 74v36M126 90h28" stroke-width="1.05"/>
  <path d="M112 110h56M118 104h44" stroke-width="1.4"/>
  <path d="M140 33V8" stroke-width="1.4"/>
  ${masse('M140 8h26l-6 7 6 7h-26z', ' stroke-width="1.3"')}
  <path d="M6 110h268" stroke-width="1.4"/>
  <path d="M14 110c5-8 11-8 16 0M250 110c5-8 11-8 16 0" stroke-width="1.05"/>
</svg>`,

/* Le bilan : le bureau qu'on vide. */
demenagement: `<svg viewBox="0 0 280 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  ${trame('M16 14h132v84H16z', '.04')}
  <path d="M16 98V14h132" stroke-width="1.3"/>
  ${trame('M40 28h56v40H40z', '.11')}
  <path d="M40 28h56v40H40z" stroke-width="1.2" stroke-dasharray="5 5"/>
  <path d="M68 22v6M64 22h8" stroke-width="1.2"/>
  ${ombre(66, 99, 34)}
  ${masse('M36 98V70h60v28z', ' stroke-width="1.8"')}
  ${masse('M36 70l9-11h42l9 11z', ' stroke-width="1.4"')}
  <path d="M66 70v28M45 78h14M73 78h14" stroke-width="1.05"/>
  ${ombre(122, 99, 26)}
  ${masse('M100 98V78h44v20z', ' stroke-width="1.7"')}
  ${masse('M100 78l7-9h30l7 9z', ' stroke-width="1.3"')}
  <path d="M122 78v20" stroke-width="1.05"/>
  <path d="M101 66c5-6 13-6 19 0M124 66c5-6 13-6 19 0" stroke-width="1.2"/>
  ${ombre(216, 99, 42)}
  ${masse('M190 76V50c0-6 4-10 10-10h32c6 0 10 4 10 10v26z', ' stroke-width="1.7"')}
  ${masse('M180 74h72v12h-72z', ' stroke-width="1.8"')}
  ${masse('M180 62h10v12h-10zM242 62h10v12h-10z', ' stroke-width="1.4"')}
  <path d="M188 86v12M244 86v12" stroke-width="1.5"/>
  <path d="M200 50h32" stroke-width="1.05"/>
  <path d="M12 98h262" stroke-width="1.4"/>
</svg>`,

/* L'atelier : le bureau où l'on choisit. */
bureau: `<svg viewBox="0 0 280 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  ${ombre(70, 79, 30)} ${ombre(146, 79, 26)} ${ombre(212, 79, 26)}
  ${masse('M42 78V48h56v30z', ' stroke-width="1.6"')}
  ${masse('M42 48l5-5h46l5 5z', ' stroke-width="1.3"')}
  <path d="M50 56h40M50 63h40M50 70h24" stroke-width="1.05"/>
  <path d="M92 43v-7h10v9" stroke="${ACC}" stroke-width="1.6"/>
  ${masse('M116 78l14-31 32 9-13 22z', ' stroke-width="1.6"')}
  <path d="M130 47l32 9" stroke-width="1.2"/>
  <path d="M139 60h18M137 67h18" stroke-width="1.05"/>
  ${masse('M186 78V42h46v36z', ' stroke-width="1.6"')}
  <path d="M186 42h46M209 42v36" stroke-width="1.2"/>
  <path d="M192 52h12M192 59h12M215 52h12M215 59h12" stroke-width="1.05"/>
  ${masse('M238 78V60h22v18z', ' stroke-width="1.6"')}
  <path d="M260 64c6 0 6 9 0 9" stroke-width="1.3"/>
  <path d="M238 66h22" stroke-width="1.05"/>
  <path d="M126 58l16-8" stroke-width="1.4"/>
  <path d="M142 50l5-1-2 5z" stroke-width="1.2"/>
  ${masse('M10 86l16-8h228l16 8z', ' stroke-width="1.5"')}
  ${masse('M10 86h260v9H10z', ' stroke-width="1.9"')}
  ${masse('M26 95h10v22H26zM244 95h10v22h-10z', ' stroke-width="1.6"')}
</svg>`,

/* La lettre plafond : l'enveloppe de Bercy. */
enveloppe: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  ${masse('M32 10h58v30H32z', ' stroke-width="1.5"')}
  <path d="M40 20h34M40 28h22" stroke-width="1.1"/>
  <path d="M56 4v22a5 5 0 0 0 10 0V8a6.5 6.5 0 0 0-13 0v26" stroke-width="1.3"/>
  ${ombre(60, 96, 44)}
  ${masse('M14 34h92v58H14z', ' stroke-width="1.9"')}
  ${trame('M14 34l46 32 46-32z', '.10')}
  <path d="M14 38l46 31 46-31" stroke-width="1.4"/>
  <path d="M14 88l30-24M106 88L76 64" stroke-width="1.1"/>
  <circle cx="88" cy="80" r="12" stroke="${ACC}" stroke-width="1.5"/>
  <circle cx="88" cy="80" r="8" stroke="${ACC}" stroke-width="1.05"/>
  <path d="M83 80l4 4 6-8" stroke="${ACC}" stroke-width="1.4"/>
</svg>`,

/* La carte scolaire : ce qu'on ferme et ce qu'on ouvre. */
carte: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  ${ombre(60, 108, 46, '.06')}
  ${masse('M12 24l32-11 32 11 32-11v80l-32 11-32-11-32 11z', ' stroke-width="1.9"')}
  <path d="M44 13v80M76 24v80" stroke-width="1.1"/>
  <path d="M12 52l32-8 32 8 32-8M12 76l32-8 32 8 32-8" stroke-width="1.05"/>
  <circle cx="28" cy="40" r="3.2" fill="currentColor" stroke="none"/>
  <circle cx="28" cy="40" r="8" stroke-width="1.2"/>
  <circle cx="60" cy="34" r="3.2" fill="currentColor" stroke="none"/>
  <circle cx="90" cy="46" r="3.2" fill="currentColor" stroke="none"/>
  <circle cx="34" cy="70" r="3.2" fill="currentColor" stroke="none"/>
  <circle cx="64" cy="64" r="3.2" fill="currentColor" stroke="none"/>
  <path d="M56 30l8 8M64 30l-8 8" stroke="${ACC}" stroke-width="1.7"/>
  <path d="M86 42l8 8M94 42l-8 8" stroke="${ACC}" stroke-width="1.7"/>
  ${masse('M70 100l26-27 7 7-26 27z', ' stroke-width="1.4"')}
  <path d="M96 73l7 7" stroke-width="1.05"/>
  <path d="M72 102l-6 6 8-2z" stroke-width="1.3"/>
</svg>`,

/* Le retrait : la table d'audience, vidée de ses occupants. */
audience: `<svg viewBox="0 0 280 120" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  ${[76, 106, 136, 166, 196].map((x) => masse(`M${x} 18h20v16h-20z`, ' stroke-width="1.3"')).join('\n  ')}
  ${[96, 126, 156].map((x) => masse(`M${x} 88h20v16h-20z`, ' stroke-width="1.3"')).join('\n  ')}
  ${ombre(140, 86, 78, '.06')}
  ${masse('M62 36h156v46H62z', ' stroke-width="1.9"')}
  ${trame('M92 42h34v8H92zM152 42h34v8h-34z', '.13')}
  <path d="M92 42h34v8H92zM152 42h34v8h-34z" stroke-width="1.1"/>
  ${masse('M130 60h20v14h-20z', ' stroke-width="1.3"')}
  <path d="M136 60v-4h8v4" stroke-width="1.1"/>
  <path d="M50 44v28M52 50h8M230 44v28M228 50h-8" stroke-width="1.1"/>
</svg>`,

/* La rentrée : la cour, tôt le matin. */
cour: `<svg viewBox="0 0 280 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  ${trame('M14 40h84v58H14z', '.05')}
  ${masse('M14 98V40h84v58z', ' stroke-width="1.9"')}
  ${masse('M7 40l8-11h82l8 11z', ' stroke-width="1.4"')}
  ${carreau(28, 58, 20, 24)}
  ${masse('M64 98V60h22v38z', ' stroke-width="1.5"')}
  <path d="M75 60v38" stroke-width="1.05"/>
  <circle cx="80" cy="20" r="11" stroke-width="1.5"/>
  <path d="M80 13v7l5 4" stroke-width="1.3"/>
  <path d="M204 98V64" stroke-width="1.6"/>
  ${masse('M182 40h44v24h-44z', ' stroke-width="1.6"')}
  ${trame('M194 52h20v12h-20z', '.13')}
  <path d="M194 52h20v12h-20z" stroke-width="1.1"/>
  <path d="M204 64c-6 0-9 4-9 8s4 8 9 8 9-4 9-8-3-8-9-8" stroke-width="1.2"/>
  ${ombre(138, 99, 30, '.06')}
  ${masse('M112 72h52v6h-52z', ' stroke-width="1.5"')}
  ${masse('M112 84h52v6h-52z', ' stroke-width="1.6"')}
  <path d="M118 78v6M158 78v6M118 90v8M158 90v8" stroke-width="1.4"/>
  ${masse('M246 98V68h16v30z', ' stroke-width="1.4"')}
  <path d="M250 74h8" stroke-width="1.05"/>
  ${ombre(140, 99, 130, '.05')}
  <path d="M8 98h264" stroke-width="1.4"/>
</svg>`,

/* Le plateau : la ou le journaliste, le ministre, le voyant d'antenne. */
plateau: `<svg viewBox="0 0 280 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M90 0v6M192 0v6" stroke-width="1.2"/>
  ${masse('M80 6h20l-5 14H85z', ' stroke-width="1.3"')}
  ${masse('M182 6h20l-5 14h-10z', ' stroke-width="1.3"')}
  <path d="M84 20h12M186 20h12" stroke-width="1.9"/>
  <path d="M83 24l-3 6M97 24l3 6M185 24l-3 6M199 24l3 6" stroke-width="1.05"/>
  ${trame('M74 34h136v40H74z', '.04')}
  ${tete(112, 40, 11, { cheveux: 'carre', regard: 1 })}
  ${buste(112, 40, 11, 90, {})}
  ${tete(168, 40, 11, { cheveux: 'raie', regard: -1 })}
  ${buste(168, 40, 11, 90, { cravate: true })}
  ${ombre(140, 107, 72, '.06')}
  ${masse('M74 106V80c0-4 3-6 7-6h118c4 0 7 2 7 6v26z', ' stroke-width="1.9"')}
  <path d="M74 85h132" stroke-width="1.05"/>
  <path d="M134 74v-9M146 74v-9" stroke-width="1.3"/>
  ${masse('M134 58a2.8 4.5 0 0 1 0 9 2.8 4.5 0 0 1 0-9z', ' stroke-width="1.2"')}
  ${masse('M146 58a2.8 4.5 0 0 1 0 9 2.8 4.5 0 0 1 0-9z', ' stroke-width="1.2"')}
  <path d="M28 106V80M17 106l11-11 11 11" stroke-width="1.4"/>
  ${masse('M12 50h30v26H12z', ' stroke-width="1.7"')}
  ${masse('M42 57l11-6v20l-11-6z', ' stroke-width="1.4"')}
  ${masse('M20 36a6 6 0 0 1 0 12 6 6 0 0 1 0-12z', ' stroke-width="1.3"')}
  ${masse('M34 36a6 6 0 0 1 0 12 6 6 0 0 1 0-12z', ' stroke-width="1.3"')}
  <path d="M20 42h14" stroke-width="1.05"/>
  ${masse('M214 28h54v40h-54z', ' stroke-width="1.8"')}
  <path d="M221 54l7-12 6 16 6-20 6 16 6-10" stroke-width="1.3"/>
  <circle cx="260" cy="35" r="2.6" fill="${ACC}" stroke="none"/>
  <path d="M241 68v9M228 77h26" stroke-width="1.4"/>
  <path d="M6 106h268" stroke-width="1.4"/>
</svg>`,

/* L'audience : la délégation, ses papiers, sa pancarte. */
delegation: `<svg viewBox="0 0 280 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M31 46v34" stroke-width="1.5"/>
  ${masse('M8 16h46v30H8z', ' stroke-width="1.6"')}
  <path d="M17 26h28M17 35h16" stroke="${ACC}" stroke-width="1.5"/>
  ${tete(82, 40, 11, { cheveux: 'court', regard: 1 })}
  ${buste(82, 40, 11, 96, {})}
  ${tete(134, 44, 10, { cheveux: 'carre', regard: 1, bouche: 'ligne' })}
  ${buste(134, 44, 10, 96, {})}
  ${tete(194, 38, 11, { cheveux: 'raie', regard: -1 })}
  ${buste(194, 38, 11, 96, { cravate: true, brasDroit: 'leve' })}
  ${ombre(142, 107, 106, '.06')}
  ${masse('M32 106V80h216v26z', ' stroke-width="1.9"')}
  <path d="M26 80h230" stroke-width="1.6"/>
  ${trame('M54 87h44v10H54zM162 87h40v10h-40z', '.12')}
  <path d="M54 87h44v10H54zM162 87h40v10h-40z" stroke-width="1.1"/>
  <path d="M8 106h264" stroke-width="1.4"/>
</svg>`,

/* La livraison : la classe, là où se joue ce que les enquêtes mesurent. */
classe: `<svg viewBox="0 0 280 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  ${masse('M8 12h92v56H8z', ' stroke-width="1.9"')}
  ${trame('M14 18h80v44H14z', '.10')}
  <path d="M22 30h36M22 40h52M22 50h28" stroke-width="1.2"/>
  ${tete(130, 34, 11, { cheveux: 'court', regard: -1 })}
  ${buste(130, 34, 11, 78, { brasGauche: 'tendu' })}
  ${jambes(130, 78, 104, 7)}
  ${tete(178, 62, 8, { cheveux: 'court', regard: -1 })}
  ${buste(178, 62, 8, 98, { col: false })}
  ${tete(238, 60, 8, { cheveux: 'carre', regard: -1, bouche: 'ligne' })}
  ${buste(238, 60, 8, 98, { col: false, brasDroit: 'leve' })}
  ${ombre(130, 105, 20, '.06')}
  ${ombre(178, 107, 28, '.06')} ${ombre(238, 107, 28, '.06')}
  ${masse('M156 106V86h44v20z', ' stroke-width="1.7"')}
  <path d="M150 86h56" stroke-width="1.6"/>
  ${masse('M216 106V86h44v20z', ' stroke-width="1.7"')}
  <path d="M210 86h56" stroke-width="1.6"/>
  <path d="M8 106h264" stroke-width="1.4"/>
</svg>`,

/* La doctrine : l'annonce, seul face à la salle. */
pupitre: `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
  ${tete(60, 30, 12, { cheveux: 'court', regard: 0 })}
  ${buste(60, 30, 12, 88, { cravate: true, brasGauche: 'aucun', brasDroit: 'aucun' })}
  <path d="M49 49L40 67M71 49l9 18" stroke-width="1.4"/>
  <circle cx="38.5" cy="68.5" r="2.3" stroke-width="1.2"/>
  <circle cx="81.5" cy="68.5" r="2.3" stroke-width="1.2"/>
  ${ombre(60, 105, 30, '.06')}
  ${masse('M38 104V72l4-6h36l4 6v32z', ' stroke-width="1.9"')}
  <path d="M32 72h56" stroke-width="1.7"/>
  ${trame('M46 82h28v12H46z', '.12')}
  <path d="M46 82h28v12H46z" stroke-width="1.1"/>
  <path d="M10 106h100" stroke-width="1.4"/>
</svg>`,

};

/* Un bandeau en tête de document ; `vignette` la place en flottant. */
function illustration(nom, vignette) {
  if (!ILLUS[nom]) return null;
  const d = el('div', 'illus' + (vignette ? ' vignette' : ' bandeau'));
  d.innerHTML = ILLUS[nom];
  d.setAttribute('aria-hidden', 'true');
  return d;
}

const picto = (nom) => PICTO[nom]
  ? `<svg class="picto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PICTO[nom]}</svg>`
  : '';

/* Quel dessin pour quel écran, et sous quelle forme. Un bandeau pour les
   scènes larges, une vignette flottante pour les objets. */
const DESSIN = {
  plateau: ['plateau', false], audience: ['delegation', false],
  livraison: ['classe', false], doctrine: ['pupitre', true],
  retrait: ['audience', false], rentree: ['cour', false],
  mesures: ['bureau', false], lettrePlafond: ['enveloppe', true],
  carteScolaire: ['carte', true],
};
function docu(type, titre, dateLabel) {
  const d = el('article', 'doc');
  d.appendChild(el('div', 'entete-doc', `<span class="type">${picto(ETAT.picto)}${type}</span><span class="date">${dateLabel || ETAT.dateLabel || ''}</span>`));
  const dessin = DESSIN[ETAT.typeEcran];
  if (dessin && dessin[1]) { const v = illustration(dessin[0], true); if (v) d.appendChild(v); }
  if (titre) d.appendChild(el('h2', '', titre));
  if (dessin && !dessin[1]) { const bn = illustration(dessin[0], false); if (bn) d.appendChild(bn); }
  return d;
}

/* --- accueil --------------------------------------------------------------- */
function ecranAccueil(sauvegarde) {
  const a = el('div', 'accueil');
  a.innerHTML = `
    <div class="tampon"><div class="rf">RÉPUBLIQUE FRANÇAISE</div><div style="font-size:.62rem;letter-spacing:.18em">MINISTÈRE DE L'ÉDUCATION NATIONALE</div></div>
    ${ILLUS.facade.replace('<svg ', '<svg class="illustration" ')}
    <h1>Rue de Grenelle</h1>
    <p class="devise">Vous êtes ministre de l'Éducation nationale.<br>1,2 million d'agents, 12 millions d'élèves. Un quinquennat, c'est cinq rentrées et cinq budgets.<br>Une durée moyenne dans le poste de deux ans, mais sept ministres sur les cinq dernières années…</p>`;
  const actions = el('div', 'actions'); actions.style.justifyContent = 'center';
  if (sauvegarde) {
    const rep = el('button', 'btn', 'Reprendre la partie en cours');
    rep.onclick = () => demarrer(sauvegarde);
    actions.appendChild(rep);
    const neuf = el('button', 'btn sec', 'Nouveau mandat');
    neuf.onclick = () => { localStorage.removeItem(CLE_SAUVE); demarrer(null); };
    actions.appendChild(neuf);
  } else {
    const go = el('button', 'btn', 'Prendre vos fonctions, juin 2027');
    go.onclick = () => demarrer(null);
    actions.appendChild(go);
  }
  a.appendChild(actions);
  a.appendChild(el('p', 'avertissement', 'Jeu pédagogique indépendant, sans lien avec le ministère de l’Éducation nationale. Les ordres de grandeur viennent de sources publiques (DEPP, PLF, OCDE, CSEN, EEF) ; chaque mesure cite ses porteurs réels et le niveau de preuve de son effet. Un lien est fait avec les propositions des candidats à l’élection présidentielle.<br>Le jeu ne dit jamais qu’une doctrine est la bonne, il vous laisse en répondre.'));
  scene(a);
}

/* --- la nomination : on vous propose Grenelle -------------------------------- */
function ecranNomination() {
  const d = docu('Appel de Matignon', 'On vous propose la rue de Grenelle', 'juin 2027');
  d.classList.add('papier');
  d.appendChild(el('p', 'chapo', 'Le gouvernement se forme. Votre téléphone sonne : le portefeuille proposé est l’Éducation nationale (le premier budget de l’État) 65,3 milliards d’euros au projet de loi de finances qui s’annonce.<br>1,2 million d’agents, 12 millions d’élèves.<br>La durée moyenne dans le poste dépasse rarement deux ans…'));
  d.appendChild(el('div', 'note-passation',
    'Votre prédécesseur, huitième en quatre ans, laisse un mot : « Tout est dans les dossiers. Les dossiers sont dans les cartons. Les cartons traînent à la DGESCO.<br>Méfiez-vous de juillet, de septembre et de janvier, le reste de l’année est calme, sauf le reste de l’année. Bonne chance.'
    + '<span class="ps">P.-S. — La photocopieuse du deuxième est en panne depuis 2019. C’est le dossier le plus consensuel du ministère : ne le réglez pas, il fédère. »</span>'));
  d.appendChild(el('p', '', 'Vous acceptez. L’Élysée vous recevra dans l’heure. Deux petites questions, pour vérifier que votre nomination ne coûtera rien au Président.'));
  const act = el('div', 'actions');
  const ok = el('button', 'btn tamponner', 'Accepter le ministère');
  ok.onclick = () => suivant('accepter');
  act.appendChild(ok);
  d.appendChild(act);
  scene(d);
}

/* --- votre feuille de route : le classement que VOUS déclarez ---------------- */
function ecranDoctrine() {
  const rev = ETAT.revanche;
  const ordre = rev && rev.doctrineInverse ? [...rev.doctrineInverse] : Object.keys(NOMS_C);
  const d = docu('Conférence de presse, prise de fonction', 'Votre feuille de route, devant témoins', 'juin 2027');
  if (rev) {
    d.appendChild(el('div', 'bandeau-neuf',
      `<b>La revanche.</b> Mêmes tirages, mêmes crises, mêmes affaires : tout ce qui relève du hasard sera identique à votre partie précédente. Le classement ci-dessous est l’inverse exact de celui que vous aviez déclaré. Vous pouvez le modifier ; le jeu comparera les deux bilans à la fin.`));
  }
  d.appendChild(el('p', 'chapo', 'Premier acte du mandat : classer les cinq compteurs du quinquennat par ordre de priorité. Aucune priorité n’est neutre, chacune est au cœur de projets politiques réellement débattus, et la presse le relèvera dès demain. Surtout : <b>c’est sur VOTRE ordre que votre bilan sera noté</b> (35 / 25 / 20 / 12 / 8).<br>Vous serez jugé contre votre propre parole, et rien d’autre.'));

  const liste = el('div', 'classement');
  const rendreListe = () => {
    liste.innerHTML = '';
    ordre.forEach((c, i) => {
      const bloc = el('div', 'rang-bloc');
      const r = el('div', 'rang');
      r.innerHTML = `<span class="pastille" style="background:${COULEURS_C[c]}"></span>
        <span class="lib">${NOMS_C_LONGS[c]}</span>
        <span class="poids">${K.POIDS_DOCTRINE[i]} % du bilan</span>`;
      const fl = el('div', 'fleches');
      const haut = el('button', '', '↑'); haut.setAttribute('aria-label', 'Monter ' + NOMS_C[c]); haut.disabled = i === 0;
      haut.onclick = () => { [ordre[i - 1], ordre[i]] = [ordre[i], ordre[i - 1]]; rendreListe(); };
      const bas = el('button', '', '↓'); bas.setAttribute('aria-label', 'Descendre ' + NOMS_C[c]); bas.disabled = i === ordre.length - 1;
      bas.onclick = () => { [ordre[i + 1], ordre[i]] = [ordre[i], ordre[i + 1]]; rendreListe(); };
      fl.append(haut, bas); r.appendChild(fl);
      bloc.appendChild(r);
      bloc.appendChild(el('p', 'sous-titre', K.PROJETS_2027[c].sousTitre));
      liste.appendChild(bloc);
    });
  };
  rendreListe();
  d.appendChild(liste);
  const act = el('div', 'actions');
  const ok = el('button', 'btn tamponner', 'Annoncer ce classement');
  ok.onclick = () => suivant([...ordre]);
  act.appendChild(ok);
  d.appendChild(act);
  d.appendChild(el('p', 'note-passation',
    '<b>Votre tableau de bord n’affichera que vos trois premiers compteurs</b>, ceux qui pèsent 80 % de votre note. Les deux derniers seront tenus sans être montrés. Vous les retrouverez au bilan, et le cabinet vous alertera s’ils décrochent vraiment.'));
  d.appendChild(el('p', '', '<span style="font-size:.82rem;color:var(--encre-2)">Votre directeur de cabinet, à voix basse : « Ce que vous mettez en premier, on vous le ressortira à chaque arbitrage contradictoire. Ce que vous mettez en dernier aussi. »</span>'));
  scene(d);
}

/* --- lettre plafond --------------------------------------------------------- */
function ecranBercy(q) {
  const S = ETAT.s, p = q.palier;
  const tons = {
    confiant: 'Le ton est presque cordial. Presque.',
    vigilant: 'Le ton est celui d’un créancier patient.',
    ferme: 'Le ton est celui d’un huissier poli.',
    comminatoire: 'Le ton est celui d’un huissier qui a cessé d’être poli.',
  };
  const d = docu('Lettre plafond. Matignon / Bercy', 'Le cadrage de votre prochain budget');
  d.appendChild(el('p', 'chapo', `${CAST.bercy} vous adresse la lettre plafond. ${tons[p.ton]}`));
  d.appendChild(el('div', 'depeche',
    `OBJET : plafonds 2e circulaire budgétaire<br>
     SCHÉMA D’EMPLOIS EXIGÉ : <b>${fmt0(p.schemaEmplois)} ETP</b><br>
     MARGE EN MESURES NOUVELLES : <b>${fmt0(p.marge * 1000)} M€</b> (crédit Bercy : ${fmt0(S.creditBercy)}/100)<br>
     RAPPEL : toute dépense pérenne engage vos successeurs. Les nôtres aussi.`));
  const opts = el('div', 'opts');
  const acc = el('button', 'opt', `<b>Accepter le cadrage</b><span class="det">Vous gardez vos munitions politiques pour janvier. Bercy note votre esprit de responsabilité, ce qui ne coûte rien à Bercy.</span>`);
  acc.onclick = () => suivant('accepter');
  const con = el('button', 'opt', `<b>Contester et porter l’arbitrage à Matignon</b><span class="det">Coût : 12 points de capital politique (il vous en reste ${fmt0(S.capital)}). Chances de gagner : moyennes, et décroissantes avec l’usage.${S.annee === 1 ? ' Un ministre qui menace trop souvent finit par ne plus être craint, seulement remplacé.' : ''}</span>`);
  con.onclick = () => suivant('contester');
  opts.append(acc, con); d.appendChild(opts);
  scene(d);
}

/* --- septembre (an 2) : la polémique qui s'installe -------------------------- */
function ecranPolemique(q) {
  const p = q.polemique;
  const d = docu('Rentrée, la question qui occupe l’antenne', esc(p.titre));
  d.classList.add('papier');
  d.appendChild(el('p', 'chapo', fr(p.recit)));
  const opts = el('div', 'opts');
  p.reponses.forEach((r, i) => {
    const eff = [
      r.parents ? `parents ${signe(r.parents)}` : '',
      r.adhesion ? `enseignants ${signe(r.adhesion)}` : '',
      r.presse ? `presse ${signe(r.presse)}` : '',
      r.credibilite ? `crédibilité ${signe(r.credibilite)}` : '',
      r.capital ? `capital ${signe(r.capital)}` : '',
      `<b class="neg">${r.agenda} semaines d’agenda</b>`,
    ].filter(Boolean);
    const b = el('button', 'opt',
      `<b>${esc(r.label)}</b><span class="det">${fr(r.det)}</span>`
      + `<span class="chiffres">${eff.map((x) => `<span>${x}</span>`).join('')}</span>`);
    b.onclick = () => fin(i, r);
    opts.appendChild(b);
  });
  d.appendChild(opts);
  d.appendChild(el('p', 'note-passation', 'Aucune de ces réponses ne fait bouger un compteur d’acquis. Elles décident seulement de combien de semaines vous parlerez d’autre chose que d’école, et devant qui vous aurez raison.'));
  function fin(i, r) {
    opts.querySelectorAll('.opt').forEach((n) => { n.disabled = true; });
    const box = el('div', 'decryptage');
    box.innerHTML = `<div class="titre-d">Ce qui suit</div><p>${fr(r.suite)}</p>`;
    d.appendChild(box);
    const act = el('div', 'actions');
    const ok = el('button', 'btn', 'Passer à la rentrée');
    ok.onclick = () => suivant(i);
    act.appendChild(ok); d.appendChild(act);
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  scene(d);
}

/* --- octobre (an 2) : la livraison internationale ---------------------------- */
function ecranLivraison(q) {
  const L = q.livraison;
  const d = docu('Livraison internationale, 11 heures', esc(L.titre));
  d.appendChild(el('p', 'chapo', fr(L.recit)));
  /* La note « niveaux » de la DGESCO n'existe plus en juin : c'est ici, quand
     la presse en parle, que le chiffre arrive, avec sa source. */
  const b = CADRAGE_INITIAL.find((x) => x.cle === 'niveaux');
  if (b) {
    const a = el('div', 'accroche');
    a.innerHTML = `<b>${fr(b.accroche.v)}</b><p>${fr(b.accroche.l)}${citer(b.accroche.src)}</p>`;
    d.appendChild(a);
  }
  d.appendChild(serieNiveaux());
  if (b) d.appendChild(el('ul', 'rep-liste', b.chiffres.map((x) =>
    `<li><span class="v">${fr(x.v)}</span><span class="l">${fr(x.l)}.${citer(x.src)}</span></li>`).join('')));
  d.appendChild(el('div', 'decryptage',
    `<div class="titre-d">Ce que le poste exige</div><p>${fr(L.contrainte)}</p>`));
  const ok = el('button', 'btn tamponner', 'Préparer les annonces de ce soir');
  ok.onclick = () => suivant(null);
  d.appendChild(el('div', 'actions')).appendChild(ok);
  scene(d);
}

/* --- décembre : le plateau de vingt heures ---------------------------------- */
function ecranPlateau(q) {
  const P = q.plateau;
  const rep = new Array(P.questions.length).fill(null);
  const d = docu('Journal de 20 heures, plateau', esc(P.titre));
  d.classList.add('papier');
  d.appendChild(el('p', 'chapo', fr(P.recit)));

  const zone = el('div', '');
  let courante = 0;
  function poser() {
    zone.innerHTML = '';
    if (courante >= P.questions.length) { conclure(); return; }
    const qu = P.questions[courante];
    const bloc = el('section', 'entretien-q');
    bloc.appendChild(el('div', 'plateau-num', `Question ${courante + 1} sur ${P.questions.length}`));
    bloc.appendChild(el('h3', '', fr(qu.q)));
    if (qu.aparte) bloc.appendChild(el('p', 'aparte', fr(qu.aparte)));
    const opts = el('div', 'opts');
    qu.reponses.forEach((r, k) => {
      const b = el('button', 'opt', `<b>${esc(r.label)}</b>`);
      b.onclick = () => {
        rep[courante] = k;
        opts.querySelectorAll('.opt').forEach((n) => { n.disabled = true; });
        b.classList.add('choisi');
        const box = el('div', 'decryptage');
        if (r.derapage) box.style.borderLeftColor = 'var(--rouge-rf)';
        box.innerHTML = `<div class="titre-d"${r.derapage ? ' style="color:var(--rouge-rf)"' : ''}>${r.derapage ? 'Dérapage' : 'En plateau'}</div><p>${fr(r.suite)}</p>`;
        bloc.appendChild(box);
        const suite = el('button', 'btn', courante < P.questions.length - 1 ? 'Question suivante' : 'Fin de la séquence');
        suite.onclick = () => { courante += 1; poser(); };
        bloc.appendChild(el('div', 'actions')).appendChild(suite);
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
      opts.appendChild(b);
    });
    bloc.appendChild(opts);
    zone.appendChild(bloc);
  }
  function conclure() {
    zone.appendChild(el('p', 'note-passation', 'Onze minutes. Sur les six causes documentées de chute d’un ministre de l’Éducation, une seule relève de la politique éducative, les cinq autres ressemblent à ce que vous venez de vivre.'));
    const ok = el('button', 'btn tamponner', 'Quitter le plateau');
    ok.onclick = () => suivant(rep);
    zone.appendChild(el('div', 'actions')).appendChild(ok);
  }
  d.appendChild(zone);
  poser();
  scene(d);
}

/* --- l'affaire : la polémique qui ne concerne pas l'école --------------------- */
function ecranAffaire(q) {
  const a = q.affaire;
  const d = docu('Revue de presse, affaire personnelle', esc(a.manchette));
  d.classList.add('papier');
  d.appendChild(el('p', 'chapo', fr(a.recit)));
  if (q.resonne) {
    d.appendChild(el('div', 'bandeau-neuf',
      '<b>Le calendrier n’est pas un hasard.</b> Le dossier ressort au moment précis où vous légiférez sur le même sujet.'));
  }
  /* Le mensonge d'il y a deux ans. Sans ce rappel, le joueur voit une affaire
     plus chère que les autres sans comprendre pourquoi ; avec, il relie la
     phrase et son prix, et c'est tout l'intérêt de l'avoir laissé mentir. */
  if (q.menti) {
    const qE = ENTRETIEN.find((x) => x.reponses.some((r) => r.mensonge && (r.expose || []).includes(a.id)));
    const rE = qE && qE.reponses.find((r) => r.mensonge && (r.expose || []).includes(a.id));
    if (rE) {
      d.appendChild(el('div', 'bandeau-mensonge',
        `<b>Ce n’est pas l’affaire qui coûte, c’est votre réponse d’il y a ${ETAT.s.annee > 1 ? ETAT.s.annee + ' ans' : 'un an'}.</b>
         À l’Élysée, à la question « ${esc(qE.question)} », vous aviez répondu : <i>${esc(rE.label)}</i>. Cette phrase ressort ce soir avec le dossier. L’affaire coûtera ×${(K.MENSONGE.aggravation).toLocaleString('fr-FR')} son prix normal, et elle avait ${K.MENSONGE.multiplicateurTirage.toLocaleString('fr-FR')} fois plus de chances de sortir.`));
    }
  }
  d.appendChild(el('div', 'decryptage',
    `<div class="titre-d">Ce que ce type d’affaire enseigne</div><p>${fr(a.lecon)}</p>`));

  const opts = el('div', 'opts');
  a.reponses.forEach((r, i) => {
    const chiffres = [
      r.adhesion ? `adhésion ${signe(r.adhesion)}` : '',
      r.credibilite ? `crédibilité ${signe(r.credibilite)}` : '',
      r.capital ? `capital ${signe(r.capital)}` : '',
      r.parents ? `parents ${signe(r.parents)}` : '',
      r.unite ? '<b class="neg">unité syndicale immédiate</b>' : '',
      r.fatal ? '<b class="neg">peut mettre fin au mandat</b>' : '',
      r.fragilise ? `<b class="neg">fragilise ${r.fragilise} an${r.fragilise > 1 ? 's' : ''}</b>` : '',
      r.captation ? '<b class="neg">l’Élysée annoncera votre prochaine mesure</b>' : '',
    ].filter(Boolean);
    const b = el('button', 'opt',
      `<b>${esc(r.label)}</b><span class="det">${fr(r.det)}</span>`
      + `<span class="chiffres">${chiffres.map((c) => `<span>${c}</span>`).join('')}</span>`);
    b.onclick = () => finAffaire(i, r);
    opts.appendChild(b);
  });
  d.appendChild(opts);
  d.appendChild(el('p', 'note-passation', `Votre crédibilité est aujourd’hui de <b>${fmt0(q.credibilite)}/100</b>. C’est elle qui décide de ce que valent vos annonces : à crédibilité effondrée, la meilleure mesure du catalogue ne porte plus. Aucune de ces réponses ne touche un compteur éducatif, et c’est bien le problème du métier.`));

  function finAffaire(i, r) {
    opts.querySelectorAll('.opt').forEach((n) => { n.disabled = true; });
    const box = el('div', 'decryptage');
    box.style.borderLeftColor = r.type === 'assumer' ? 'var(--c-sante)' : r.type === 'defendre' ? 'var(--c-budget)' : 'var(--rouge-rf)';
    box.innerHTML = `<div class="titre-d" style="color:${r.type === 'assumer' ? 'var(--c-sante)' : r.type === 'defendre' ? 'var(--c-budget)' : 'var(--rouge-rf)'}">La suite</div><p>${fr(r.suite)}</p>`
      + '<p style="font-size:.78rem;color:var(--encre-3);margin-top:8px">Une affaire médiatique n’est pas une culpabilité : une sur quatre se dégonfle, démentie ou classée. Mais un démenti ne rend pas ce qu’une accusation a coûté : vous ne récupérez que la moitié des points perdus.</p>';
    d.appendChild(box);
    const act = el('div', 'actions');
    const ok = el('button', 'btn', 'Passer à autre chose');
    ok.onclick = () => suivant(i);
    act.appendChild(ok); d.appendChild(act);
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  scene(d);
}

/* --- l'entretien de l'Élysée, avant la nomination ---------------------------- */
function ecranEntretien(q) {
  const rep = new Array(q.questions.length).fill(null);
  const d = docu('Élysée, entretien préalable', 'Deux questions avant votre nomination');
  d.classList.add('papier');
  d.appendChild(el('p', 'chapo', 'Un conseiller vous reçoit vingt minutes. Il ne s’intéresse ni à votre projet ni à l’école : il vérifie que votre nomination ne coûtera rien au Président. Personne ne contrôlera vos réponses aujourd’hui.'));

  const zone = el('div', '');
  q.questions.forEach((quest, i) => {
    const bloc = el('section', 'entretien-q');
    bloc.appendChild(el('h3', '', esc(quest.question)));
    bloc.appendChild(el('p', 'aparte', fr(quest.aparte)));
    const opts = el('div', 'opts');
    quest.reponses.forEach((r, k) => {
      const b = el('button', 'opt', `<b>${esc(r.label)}</b><span class="det">${fr(r.det)}</span>`);
      b.onclick = () => {
        rep[i] = k;
        opts.querySelectorAll('.opt').forEach((n) => n.classList.remove('choisi'));
        b.classList.add('choisi');
        maj();
      };
      opts.appendChild(b);
    });
    bloc.appendChild(opts);
    zone.appendChild(bloc);
  });
  d.appendChild(zone);

  const act = el('div', 'actions');
  const ok = el('button', 'btn tamponner', 'Signer la notice');
  ok.disabled = true;
  ok.onclick = () => suivant(rep);
  act.appendChild(ok); d.appendChild(act);
  function maj() {
    const complet = rep.every((x) => x !== null);
    ok.disabled = !complet;
    ok.textContent = complet ? 'Signer la notice' : `Répondre aux ${rep.filter((x) => x === null).length} question(s) restantes`;
  }
  maj();
  scene(d);
}

/* --- le profil déclaré ------------------------------------------------------- */
function ecranProfil(q) {
  const d = docu('Notice biographique, service de presse', 'D’où venez-vous ?');
  d.appendChild(el('p', 'chapo', 'Le service de presse a besoin de deux lignes pour les dépêches de demain. Ce que vous déclarez ne vous rend ni meilleur ni moins bon ministre (<b>aucun profil ne donne d’avantage sur les compteurs</b>) mais décide de ce que le corps enseignant attendra de vous, et de ce qu’on vous reprochera.'));
  const opts = el('div', 'opts');
  q.profils.forEach((p, i) => {
    const eff = [
      p.adhesion ? `adhésion enseignante ${signe(p.adhesion)}` : '',
      p.capital ? `capital ${signe(p.capital)}` : '',
      p.credibilite ? `crédibilité ${signe(p.credibilite)}` : '',
    ].filter(Boolean);
    const b = el('button', 'opt',
      `<b>${esc(p.nom)}</b><span class="det">${fr(p.detail)}</span>`
      + `<span class="chiffres">${eff.map((x) => `<span>${x}</span>`).join('')}</span>`);
    b.onclick = () => suivant(i);
    opts.appendChild(b);
  });
  d.appendChild(opts);
  scene(d);
}

/* --- la demande de rallonge, dont Bercy décide ------------------------------- */
function ecranAvance(q) {
  const S = ETAT.s;
  const d = docu('Note du secrétariat général, négociation de gestion', 'Demander une rallonge à Bercy');
  d.appendChild(el('p', 'chapo', 'Vous arrivez en juin sur un budget déjà voté. Un seul levier existe pour agir tout de suite : la <b>réserve de précaution</b>, cette part des crédits que Bercy gèle en début d’exercice sur chaque programme et ne dégèle qu’en gestion. Elle immobilise plusieurs centaines de millions d’euros sur votre mission. <b>Bercy n’est pas obligé de dire oui.</b>'));

  const opts = el('div', 'opts');
  let choix = null, mesureChoisie = null;
  const zoneMesure = el('div', '');

  q.options.forEach((o, i) => {
    const gains = [
      o.bonus ? `<b class="pos">+${fmt0(o.bonus * 1000)} M€</b> si Bercy accepte` : 'enveloppe inchangée',
      o.bonus ? `<b class="${o.proba >= 0.75 ? 'pos' : o.proba >= 0.6 ? '' : 'neg'}">${Math.round(o.proba * 100)} % de chances d’aboutir</b>` : '',
      o.capital ? `capital ${signe(o.capital)}` : '',
      o.bercy ? `crédit Bercy ${signe(o.bercy)}` : '',
      o.exigeMesure ? '<b class="neg">la mesure choisie sera engagée</b>' : '',
    ].filter(Boolean);
    const b = el('button', 'opt',
      `<b>${esc(o.titre)}</b><span class="det">${fr(o.detail)}</span>`
      + `<span class="chiffres">${gains.map((g) => `<span>${g}</span>`).join('')}</span>`
      + `<span class="det mot">« ${fr(o.mot)} »</span>`);
    b.onclick = () => {
      choix = i; mesureChoisie = null;
      opts.querySelectorAll('.opt').forEach((n) => n.classList.remove('choisi'));
      b.classList.add('choisi');
      construireMesure(o);
      maj();
    };
    opts.appendChild(b);
  });
  d.appendChild(opts);
  d.appendChild(zoneMesure);

  function construireMesure(o) {
    zoneMesure.innerHTML = '';
    if (!o.exigeMesure) return;
    const liste = mesuresDisponibles(ETAT.s, 6);
    const z = el('div', 'flechage');
    z.innerHTML = '<div class="titre-d">Sur quelle mesure fléchez-vous cette rallonge ?</div>'
      + '<p class="det">Bercy finance un objet, jamais une intention. La mesure retenue sera engagée : vous la porterez en juin, qu’elle vous plaise encore ou non.</p>';
    const ul = el('div', 'flechage-liste');
    liste.forEach((c) => {
      const k = coutDe(c, {});
      const b = el('button', 'opt', `<b>${esc(c.label)}</b><span class="chiffres"><span>${fmt0(k.cout * 1000)} M€/an</span><span>${k.pol} capital</span></span>`);
      b.onclick = () => {
        mesureChoisie = c.id;
        ul.querySelectorAll('.opt').forEach((n) => n.classList.remove('choisi'));
        b.classList.add('choisi');
        maj();
      };
      ul.appendChild(b);
    });
    z.appendChild(ul);
    zoneMesure.appendChild(z);
  }

  const act = el('div', 'actions');
  const ok = el('button', 'btn tamponner', 'Choisir une option');
  ok.disabled = true;
  ok.onclick = () => suivant({ option: choix, mesure: mesureChoisie });
  act.appendChild(ok); d.appendChild(act);
  function maj() {
    const o = q.options[choix];
    const manque = o && o.exigeMesure && !mesureChoisie;
    ok.disabled = choix === null || manque;
    ok.textContent = choix === null ? 'Choisir une option'
      : manque ? 'Désignez la mesure à financer'
      : o.bonus ? 'Transmettre la demande à Bercy' : 'Ne rien demander';
  }
  d.appendChild(el('p', 'note-passation', 'Un refus ne vous coûte pas grand-chose sur le papier (4 points de crédit et 3 de capital) mais il se sait, et le cabinet de Bercy a une bonne mémoire. Demander beaucoup rapporte beaucoup et échoue plus d’une fois sur deux.'));
  scene(d);
}

/* --- l'intention de restitution des postes ----------------------------------- */
function ecranIntention(q) {
  const d = docu('Conférence de presse, préparation de la rentrée', 'Que ferez-vous des postes que la démographie libère ?');
  d.appendChild(el('p', 'chapo', 'La question tombera dès votre premier point presse : chaque rentrée « libère » environ 6 600 postes, et tout le monde veut savoir où ils iront. Ce que vous répondez aujourd’hui n’engage rien juridiquement et tout politiquement : <b>Bercy comparera votre phrase à votre carte scolaire de janvier</b>.'));
  const opts = el('div', 'opts');
  q.options.forEach((o, i) => {
    const eff = [
      `<b>${Math.round(o.restitution * 100)} %</b> rendus`,
      o.bercy ? `crédit Bercy ${signe(o.bercy)}` : '',
      o.adhesion ? `adhésion ${signe(o.adhesion)}` : '',
    ].filter(Boolean);
    const b = el('button', 'opt',
      `<b>${esc(o.titre)}</b><span class="det">${fr(o.detail)}</span>`
      + `<span class="chiffres">${eff.map((x) => `<span>${x}</span>`).join('')}</span>`
      + `<span class="det mot">« ${fr(o.mot)} »</span>`);
    b.onclick = () => suivant(i);
    opts.appendChild(b);
  });
  d.appendChild(opts);
  scene(d);
}

/* --- rentrée ratée : la communication --------------------------------------- */
function ecranRentree() {
  const S = ETAT.s;
  const d = docu('Cellule de crise, rentrée', 'Des classes sans professeur, et un micro devant vous');
  d.appendChild(el('p', 'chapo', `Couverture des concours : ${fmt1(S.phys.couvertureConcours)} %. Heures non assurées : ${fmt1(S.phys.heuresNonAssurees)} %. Le comptage syndical des classes sans enseignant a commencé à 8 h 07. Il est 8 h 12.`));
  const opts = el('div', 'opts');
  const b1 = el('button', 'opt', `<b>Assumer les chiffres</b><span class="det">« La situation est difficile, voici ce que nous faisons. » Les personnels entendent qu’on ne leur ment pas ; l’opposition entend un aveu. Les deux ont raison.</span>`);
  b1.onclick = () => suivant('assumer');
  const b2 = el('button', 'opt', `<b>Contester le comptage syndical</b><span class="det">« Ces chiffres ne correspondent à aucune réalité observable. » Défendable une fois. La réalité observable, elle, revient chaque matin à 8 h.</span>`);
  b2.onclick = () => suivant('contester');
  opts.append(b1, b2); d.appendChild(opts);
  scene(d);
}

/* --- carte scolaire ---------------------------------------------------------- */
function ecranCarteScolaire(q) {
  const S = ETAT.s;
  const d = docu('Bordereau, carte scolaire & DHG', `Rentrée ${S.anneeCiv + 1} : le moment le plus conflictuel de l’année`);
  d.classList.add('large', 'papier');
  d.appendChild(el('p', 'chapo',
    `La démographie fait son œuvre : <b>${fmt0(Math.abs(q.baisse) * 1000)} élèves de moins</b> à la prochaine rentrée, soit ${fmt0(q.postesLiberables)} postes « libérables ». Bercy en exige ${fmt0(Math.abs(q.schemaDemande))}. Les maires, eux, exigent l’inverse. Les deux vous regardent.`));

  /* Le mécanisme s'explique le premier janvier. Les quatre suivants, le joueur
     l'a compris : il reste disponible d'un clic, il n'occupe plus la page. */
  const meca = el('details', 'mecanisme');
  if (S.annee === 1) meca.open = true;
  meca.innerHTML = `<summary class="titre-d">Comment ça marche</summary><ol>
    <li>La démographie baisse : des postes deviennent « libérables » sans dégrader l’encadrement actuel.</li>
    <li>Vous arbitrez : <b>les rendre à Bercy</b> (du crédit budgétaire, mais des fermetures de classes visibles) ou <b>les réinvestir</b> (moins d’élèves par classe, mais Bercy s’en souviendra en juillet).</li>
    <li>En juillet, Bercy compare ce que vous avez rendu à ce qu’il exigeait. C’est ce qui fixe votre marge de l’an prochain.</li></ol>`;
  d.appendChild(meca);

  let restitution = Math.min(q.restitutionMax, 0.4), prive = 0.5;
  const c1 = el('div', 'curseur');
  c1.innerHTML = `<label for="cur-rest">Postes rendus à Bercy ⟷ réinvestis dans l’encadrement</label>
    <div class="aide">${(S.historiqueRestitution && S.historiqueRestitution.length)
      ? 'Vos précédents : ' + S.historiqueRestitution.map((h) => `rentrée ${h.rentree}, ${h.pct} % rendus`).join(' ; ') + '. (Pour mémoire, avant vous : 4 % en 2025, 60 % en 2026.)'
      : 'Précédents réels : rentrée 2025, 4 % des postes libérés rendus ; rentrée 2026, 60 %. Les deux ministres ont dit faire « le choix de l’école ».'}</div>
    <input id="cur-rest" type="range" min="0" max="${q.restitutionMax}" step="0.05" value="${restitution}">
    <div class="lecture" id="lec-rest"></div>`;
  const c2 = el('div', 'curseur');
  c2.innerHTML = `<label for="cur-prive">Répartition de l’effort : épargner le privé sous contrat ⟷ le faire contribuer</label>
    <div class="aide">17 % des élèves, financés à 73 % sur fonds publics, IPS très supérieur au public.${S.annee === 1 ? ' Au-delà d’un certain point, le mot « Savary » réapparaît tout seul dans les dépêches.' : ''}</div>
    <input id="cur-prive" type="range" min="0" max="1" step="0.05" value="${prive}">
    <div class="lecture" id="lec-prive"></div>`;
  d.append(c1, c2);

  const deltas = el('div', 'deltas-acteurs');
  d.appendChild(deltas);
  const lire = () => {
    const postes = Math.round(restitution * q.postesLiberables);
    const eco = postes * K.CADRAGE.coutETPhorsCAS * 1000;
    const ecart = postes - Math.abs(q.schemaDemande);
    /* prévision d'encadrement : même formule que le moteur */
    const divisions = (S.eleves * 1000) / S.ratioED;
    const ratioApres = ((S.eleves + q.baisse) * 1000) / Math.max(1000, divisions - postes / 1.35);
    $('#lec-rest').innerHTML = `${fmt0(postes)} postes rendus · ${fmt0(eco)} M€ dégagés pour vos mesures · encadrement : ${fmt1(S.ratioED)} → <b>${fmt1(ratioApres)}</b> élèves/classe · ${ecart >= 0 ? 'Bercy servi (' + signe(ecart) + ' ETP)' : '<span style="color:var(--rouge-rf)">sous l’exigence Bercy (' + fmt0(ecart) + ' ETP) : crédit en baisse</span>'}${restitution > K.SEUIL_COLERE_MAIRES ? ' · <span style="color:var(--rouge-rf)">zone de colère des maires</span>' : ''}`;
    $('#lec-prive').innerHTML = prive < 0.35 ? 'Le privé est épargné : la ségrégation dérive en silence.'
      : prive <= 0.65 ? 'Effort proportionnel aux effectifs : personne n’est content, personne ne défile.'
      : prive <= 0.78 ? 'Le privé contribue davantage : protestations d’usage, encore contenues.'
      : '<span style="color:var(--rouge-rf)">Le privé est mis à contribution frontale : provocation comptabilisée, à deux, la guerre scolaire s’arme.</span>';

    /* Les acteurs réagissent AVANT que vous ne signiez, mêmes formules que le moteur. */
    const ecart2 = postes + q.schemaDemande;
    const dSynd = -(postes / 1000) * 1.05;
    const dBercy = ecart2 >= 0 ? Math.min(13, 4 + ecart2 / 700) : Math.max(-18, ecart2 / 260);
    const badge = (nom, v, seuil = 0.4) => `<span class="delta-a ${v > seuil ? 'pos' : v < -seuil ? 'neg' : ''}">${nom} ${v > 0 ? '+' : ''}${fmt1(v)}</span>`;
    deltas.innerHTML = badge('INTERSYNDICALE', dSynd) + badge('BERCY', dBercy)
      + `<span class="delta-a ${restitution > K.SEUIL_COLERE_MAIRES ? 'neg' : ''}">MAIRES ${restitution > K.SEUIL_COLERE_MAIRES ? '−6 (colère)' : '0'}</span>`
      + `<span class="delta-a ${prive > 0.78 ? 'neg' : ''}">PRIVÉ ${prive > 0.78 ? 'provocation +1' : prive < 0.35 ? 'épargné' : 'neutre'}</span>`;
  };
  scene(d);
  $('#cur-rest').oninput = (e) => { restitution = +e.target.value; lire(); };
  $('#cur-prive').oninput = (e) => { prive = +e.target.value; lire(); };
  lire();
  if (q.restitutionMax < 1) d.appendChild(el('p', '', `<span style="font-size:.82rem;color:var(--encre-2)">Votre engagement « 19 élèves par classe » plafonne la restitution à ${fmt0(q.restitutionMax * 100)} % : vous avez promis la démographie aux classes, pas à Bercy.</span>`));
  const ok = el('button', 'btn tamponner', 'Tamponner la carte scolaire');
  ok.onclick = () => suivant({ restitution, prive });
  d.appendChild(el('div', 'actions')).appendChild(ok);
}

/* --- atelier de mesures ------------------------------------------------------ */
function ecranAtelier(q) {
  const S = ETAT.s;
  const selection = new Map();   // id -> options
  const enveloppe = q.tresor, capital = q.capital;

  const MOMENTS = {
    prise_fonction: {
      type: 'Prise de fonction, vos premières annonces',
      titre: 'Vos premières annonces',
      chapo: 'Vous n’attendez pas le prochain budget : la loi de finances votée par votre prédécesseur laisse une marge de redéploiement, et le pays regarde ce qu’un nouveau ministre fait de ses premiers jours. Deux annonces au maximum, au-delà, plus personne ne retient rien.',
    },
    rentree: {
      type: 'Circulaire de rentrée',
      titre: 'Que met-on dans la circulaire de rentrée ?',
      titreSuite: 'Une mesure, pas davantage : la circulaire de rentrée porte un message, pas un programme.',
    },
    livraison: {
      type: 'Après la livraison, vos annonces de ce soir',
      titre: 'Trois mesures pour le niveau des élèves',
      chapo: 'Vous n’avez pas le choix d’annoncer : à 20 heures, on attend des mesures. Vous avez le choix de celles-ci. Selon les familles de mesures retenues, la salle des professeurs applaudira, haussera les épaules, ou déposera un préavis pour le printemps.',
    },
    janvier: {
      type: 'L’atelier, l’arbitrage de janvier',
      titre: 'Que portez-vous cette année ?',
      chapo: 'Le moment où le budget de l’année se transforme en décisions. Jusqu’à trois annonces, et le seul moment où vous pouvez arracher un arbitrage interministériel pour dépasser votre enveloppe.',
    },
  };
  const MOM = MOMENTS[q.moment] || MOMENTS.janvier;

  const d = el('article', 'doc large');
  d.appendChild(el('div', 'entete-doc', `<span class="type">${picto(ETAT.picto)}${MOM.type}</span><span class="date">${ETAT.dateLabel}</span>`));
  d.appendChild(el('h2', '', MOM.titre));
  { const bn = illustration('bureau', false); if (bn) d.appendChild(bn); }
  /* La règle du jeu s'énonce une fois, à la première ouverture de l'atelier.
     Ensuite, un rappel de dix mots suffit : la réimprimer cinq fois par partie
     ne l'apprend à personne, elle fait seulement de la page à sauter. */
  const premierAtelier = S.annee === 1 && q.moment === 'prise_fonction';
  d.appendChild(el('p', 'chapo', (MOM.chapo || MOM.titreSuite) + (premierAtelier
    ? ' L’effet d’annonce est chiffré : vous le verrez. L’effet réel ne l’est pas, vous n’avez que le niveau de preuve (🔒) et le délai, et vous découvrirez au bilan ce que vous avez produit. Rien ne s’applique sans les personnels.'
    : ' Effet d’annonce chiffré, effet réel caché.')));
  /* Le menu cadré : on dit pourquoi il l'est, sinon le joueur croit à un bug.
     C'est tout l'intérêt du dispositif — que l'enchaînement des écrans se lise
     comme une suite de conséquences et non comme une liste de courses. */
  if (q.cadrage) {
    d.appendChild(el('div', 'cadrage-menu',
      `<b>${esc(q.cadrage.titre)}</b><span>${fr(q.cadrage.cause)}</span>`));
  }

  /* Le budget, en vrai : tout le mandat se joue dans un liseré. */
  const M = K.CADRAGE.missionHorsCAS;                       // 65,30 Md€ (plafond PLF 2027)
  const salaires = M * K.CADRAGE.partMasseSalariale;
  const engages = S.chargesRecurrentes;
  const libre = Math.max(0, q.tresor);
  const autres = Math.max(0, M - salaires - engages - libre);
  const pc = (x) => Math.max(0.35, (x / M) * 100).toFixed(2) + '%';
  const bb = el('div', 'budget-bloc');
  bb.innerHTML = `
    <div class="titre-b"><span>Le budget du ministère, premier budget de l'État</span><b>${fmt1(M)} Md€/an</b></div>
    <div class="budget-barre" aria-hidden="true">
      <i class="salaires" style="width:${pc(salaires)}"></i><i class="autres" style="width:${pc(autres)}"></i><i class="engage" style="width:${pc(engages)}"></i><i class="libre" style="width:${pc(libre)}"></i>
    </div>
    <div class="budget-legende">
      <span><i class="puce salaires" style="background:var(--filet)"></i>masse salariale <b>${fmt1(salaires)} Md€</b>${premierAtelier ? " (intouchable : ce sont 1,2 M d'agents)" : ''}</span>
      <span><i class="puce" style="background:var(--filet-fort)"></i>dépenses déjà engagées</span>
      <span><i class="puce" style="background:var(--c-paix)"></i>vos mesures passées <b>${fmt0(engages * 1000)} M€/an</b>${premierAtelier ? " (à vie, l'effet cliquet)" : ''}</span>
      <span><i class="puce" style="background:var(--c-sante)"></i>votre marge cette année <b>${fmt0(libre * 1000)} M€</b></span>
    </div>
    <div class="budget-legende" style="margin-top:6px"><span>Le liseré vert est tout ce que vous pouvez décider cette année : <b>${fmt1((libre / M) * 100)} %</b> du budget.${premierAtelier ? ' Chaque mesure pérenne le réduit pour toujours, pour vous et pour vos successeurs.' : ''}</span></div>`;
  d.appendChild(bb);

  if ((q.nouveaux || []).length) {
    /* On n'annonce que ce que le joueur voit réellement dans le menu : les
       autres dossiers ouverts attendront leur tour de rotation. */
    const ici = q.nouveaux.map((id) => PAR_ID[id]).filter((c) => c && q.dispo.includes(c));
    const ailleurs = q.nouveaux.length - ici.length;
    if (ici.length) {
      d.appendChild(el('div', 'bandeau-neuf',
        `<b>${ici.length} dossier${ici.length > 1 ? 's remontent' : ' remonte'} sur votre bureau</b>${S.annee === 1 ? ' — un ministre découvre son ministère au fil des rapports et des crises, pas le premier jour' : ''} : ${ici.map((c) => `« ${esc(c.label)} »`).join(', ')}.`
        + (ailleurs ? ` ${ailleurs} autre${ailleurs > 1 ? 's se sont ouverts' : ' s’est ouvert'} en coulisse : ${ailleurs > 1 ? 'ils arriveront' : 'il arrivera'} dans un prochain menu.` : '')));
    }
  }

  d.appendChild(el('div', 'legende-cadenas', premierAtelier
    ? '<b>Échelle de preuve</b> (d’après le Teaching &amp; Learning Toolkit de l’EEF). 🔒🔒🔒🔒🔒 : plus de 90 études concordantes, l’effet obtenu reste à ±20 % de l’annonce. 🔒🔒🔒 : preuve correcte, l’effet peut aller de la moitié au double. 🔒 : presque aucune évaluation, l’effet peut aller du négatif au triple. Un cadenas n’est pas un jugement de valeur, c’est la largeur de votre pari. <b>« Image »</b> : l’indicateur affiché bouge tout de suite, s’estompe d’un quart par an, et ne compte pas au bilan.'
    : '<b>Échelle de preuve</b> : 5 cadenas, effet à ±20 % de l’annonce ; 1 cadenas, du négatif au triple. « Image » : effet immédiat, qui s’évapore et ne compte pas au bilan.'));

  const solde = el('div', 'solde');
  const grille = el('div', 'grille-cartes');

  const coutSel = () => { let cout = 0, pol = 0, reformes = 0;
    for (const [id, opt] of selection) { const c = PAR_ID[id]; const k = coutDe(c, opt);
      cout += k.cout; pol += c.perimetre === 'matignon' ? k.pol * 2 : k.pol; if (c.reforme) reformes++; }
    return { cout, pol, reformes }; };

  const majSolde = () => {
    const { cout, pol, reformes } = coutSel();
    const abs = absorption(S);
    const actives = abs.nActives + reformes;
    solde.innerHTML = [
      `Enveloppe <b class="${enveloppe - cout < 0 ? 'neg' : ''}">${fmt0((enveloppe - cout) * 1000)} M€</b>/${fmt0(enveloppe * 1000)}`,
      `Capital <b class="${capital - pol < 0 ? 'neg' : ''}">${fmt0(capital - pol)}</b>/${fmt0(capital)}`,
      `Annonces <b class="${selection.size >= q.maxAnnonces ? 'neg' : ''}">${selection.size}</b>/${q.maxAnnonces} possibles`,
      `Réformes actives <b class="${actives > K.ABSORPTION.seuil ? 'neg' : ''}">${actives}</b>/${K.ABSORPTION.seuil} absorbables`,
      `Implémentation ×<b>${(Math.round(facteurImplementation(S) * 100) / 100).toLocaleString('fr-FR')}</b> (adhésion ${fmt0(S.phys.adhesion)})`,
      cout > enveloppe ? (q.depassementAutorise
        ? `<span class="neg">dépassement : −${fmt0(K.SURCOUT.creditBercyParMd * (cout - enveloppe))} crédit Bercy, −${fmt0(K.SURCOUT.capitalParMd * (cout - enveloppe))} capital</span>`
        : '<span class="neg">hors enveloppe, impossible sans arbitrage budgétaire (janvier)</span>') : '',
    ].filter(Boolean).map((x) => `<span>${x}</span>`).join('');
    const tropCher = !q.depassementAutorise && cout > enveloppe;
    const tropDeCapital = pol > capital;
    valider.disabled = tropCher || tropDeCapital || selection.size > q.maxAnnonces;
    valider.textContent = tropCher ? `Dépasse l’enveloppe de ${fmt0((cout - enveloppe) * 1000)} M€, retirez une mesure`
      : tropDeCapital ? 'Capital politique insuffisant, retirez une mesure'
      : selection.size ? `Annoncer ${selection.size} mesure${selection.size > 1 ? 's' : ''}`
      : (q.moment === 'janvier' ? 'Ne rien annoncer cette année' : 'Passer, ne rien annoncer');
  };

  const valider = el('button', 'btn', '');
  const rendreCarte = (c) => {
    const carte = el('div', 'carte');
    carte.tabIndex = 0;
    const [famNom, famCoul] = FAMILLES[c.famille] || ['Divers', 'var(--encre-2)'];
    carte.style.borderTopColor = famCoul;
    const k0 = coutDe(c, {});
    const vit = c.vitrine, vc = Object.entries(vit.compteurs || {});
    const cadMax = Math.max(0, ...(c.reel || []).map((e) => e.cadenas), c.parametrique === 'revalorisation' ? 3 : 0);

    /* --- tête, toujours visible : l'essentiel en trois lignes --- */
    const tete = el('div', '');
    tete.style.cssText = 'display:flex;flex-direction:column;gap:6px;cursor:pointer';
    tete.innerHTML = `
      <span class="famille" style="color:${famCoul}">${famNom}</span>
      <h3>${esc(c.label)}${(q.nouveaux || []).includes(c.id) ? '<span class="nouveau-dossier">nouveau dossier</span>' : ''}</h3>
      <div class="chiffres"><span>${fmt0(k0.cout * 1000)} M€/an</span><span>${k0.pol}${c.perimetre === 'matignon' ? '×2' : ''} capital</span><span>preuve ${'🔒'.repeat(cadMax)}${'·'.repeat(Math.max(0, 5 - cadMax))}</span></div>
      <div class="plie">Porté par : ${c.porteurs.slice(0, 2).map(esc).join(' · ')}${c.porteurs.length > 2 ? ` <span class="reste">+ ${c.porteurs.length - 2}</span>` : ''}</div>`;

    /* --- corps, déplié à la demande --- */
    const corps = el('div', 'corps');
    corps.innerHTML = `
      ${c.porteurs.length > 2 ? `<div class="porteurs">Porté par : ${c.porteurs.map(esc).join(' · ')}</div>` : ''}
      ${c.contre ? `<div class="porteurs">Contre : ${c.contre.map(esc).join(' · ')}</div>` : ''}
      <div class="chiffres">
        ${c.coutETP ? `<span>${fmt0(c.coutETP)} ETP</span>` : ''}
        <span class="${vit.parents >= 0 ? 'pos' : 'neg'}">parents ${signe(vit.parents)}</span>
        <span class="${vit.enseignants >= 0 ? 'pos' : 'neg'}">enseignants ${signe(vit.enseignants)}</span>
        <span class="${vit.presse >= 0 ? 'pos' : 'neg'}">presse ${signe(vit.presse)}</span>
        ${vc.map(([cc, v]) => `<span class="image">image ${NOMS_C[cc]} ${signe(v)}</span>`).join('')}
      </div>

      <div class="reels">${(c.reel || []).map((e) => `<div class="ligne"><span class="verrous">${'🔒'.repeat(e.cadenas)}${'·'.repeat(5 - e.cadenas)}</span><span>Effet réel sur <b>${NOMS_C[e.compteur]}</b>, vers l’an +${e.delai}</span></div><div class="src">${esc(e.source)}</div>`).join('')}
      ${c.parametrique === 'revalorisation' ? '<div class="ligne"><span class="verrous">🔒🔒🔒··</span><span>Montant, instrument et cible se règlent après sélection, tout est chiffré en direct</span></div>' : ''}</div>
      ${c.greve ? `<div class="alerte-greve">⚠ Risque de mobilisation (intensité ${c.greve.intensite}/5, ${c.greve.theme})</div>` : ''}
      ${c.provocations ? `<div class="alerte-greve">⚠ Provocation « guerre scolaire » (+${c.provocations})</div>` : ''}
      <div class="mot">${esc(c.mot)}</div>`;

    /* --- panneau « comprendre l'effet » : la preuve, en clair --- */
    const comp = el('div', 'comprendre');
    comp.innerHTML = `<div class="titre-d">Ce que disent les études</div><p>${esc(c.preuve || '')}</p>`
      + (c.ideeRecue ? `<div class="idee"><div class="titre-d">L’idée reçue</div><p>${esc(c.ideeRecue)}</p></div>` : '');

    const barre = el('div', 'barre-actions');
    const bComp = el('button', 'btn-mini', 'Comprendre l’effet 🔒');
    bComp.onclick = (e) => { e.stopPropagation(); carte.classList.add('ouverte'); comp.classList.toggle('visible'); };
    const bRet = el('button', 'btn-mini btn-retenir', 'Retenir');
    barre.append(bComp, bRet);

    let zone = null;
    const majParams = () => {
      if (!selection.has(c.id) || !c.parametrique) return;
      const opt = selection.get(c.id);
      if (zone) zone.remove();
      zone = el('div', 'curseurs-carte');
      const sel = (nom, table, cle, format) => {
        const w = el('div'); w.appendChild(el('label', '', nom));
        const s = document.createElement('select');
        for (const [k, v] of Object.entries(table)) { const o = document.createElement('option'); o.value = k; o.textContent = format(k, v); if (opt[cle] === k) o.selected = true; s.appendChild(o); }
        s.onclick = (e) => e.stopPropagation();
        s.onchange = (e) => { opt[cle] = e.target.value; majSolde(); };
        w.appendChild(s); return w; };
      if (c.parametrique === 'revalorisation') {
        zone.classList.add('salaire');
        /* 1. Le montant, au curseur, tout le reste en découle. */
        const R = REVALORISATION.montant;
        const cur = el('div', 'curseur-md');
        cur.innerHTML = `<label for="md-${c.id}"><span>Montant engagé, par an</span><b></b></label>
          <input id="md-${c.id}" type="range" min="${R.min}" max="${R.max}" step="${R.pas}" value="${opt.montant}">
          <div class="reperes"><span>${fmt0(R.min * 1000)} M€</span><span>2,5 Md€ = le plan chiffré par Attal</span><span>${fmt1(R.max)} Md€</span></div>`;
        const chif = el('div', 'chiffrage');
        const noteI = el('div', 'note-i');

        const valeurMd = cur.querySelector('label b');
        const majChiffrage = () => {
          const r = chiffrerRevalorisation(opt.montant, opt.instrument, opt.cible);
          valeurMd.textContent = fmt1(r.montantMd) + ' Md€';
          chif.innerHTML = `
            <div class="l"><span>Concerne</span><b>${fmt0(r.concernes)} enseignants</b></div>
            <div class="l"><span>Soit, en brut mensuel moyen</span><b>+${fmt0(r.euroParMois)} €/mois</b></div>
            <div class="l"><span>Équivaut à</span><b>${fmt1(r.pctPoint)} % de point d’indice</b></div>
            <div class="l"><span>Part du rattrapage réclamé par la FSU (10 Md€)</span><b>${fmt0(r.pctRattrapageFSU)} %</b></div>
            <div class="l"><span>Coût réel pour l’État${r.instrument.cas ? ', CAS Pensions compris' : ' (pas de contribution pension)'}</span><b>${fmt1(r.coutAvecCAS)} Md€</b></div>
            <div class="l"><span>Position salariale vs autres diplômés du supérieur</span><b>${fmt1(S.phys.positionSalariale)} % → ${fmt1(S.phys.positionSalariale + r.gainPosition)} %</b></div>
            <div class="src">Point d’indice 4,92 € gelé depuis 2023 · 1 % de point ≈ 490 M€ sur le périmètre de l’Éducation nationale · 814 927 ETP enseignants · CAS Pensions = +43 % de la masse salariale.</div>`;
          noteI.innerHTML = `<b>${esc(r.instrument.label)}</b> — ${esc(r.instrument.note)}<br><span style="color:var(--encre-3)">${esc(r.cible.note)}</span>`;
          majSolde();
        };
        cur.querySelector('input').oninput = (e) => { e.stopPropagation(); opt.montant = +e.target.value; majChiffrage(); };
        cur.querySelector('input').onclick = (e) => e.stopPropagation();

        const relire = (fn) => (e) => { fn(e); majChiffrage(); };
        const selI = sel('Comment on verse', REVALORISATION.instruments, 'instrument', (k, v) => v.label);
        const selC = sel('Pour qui', REVALORISATION.cibles, 'cible', (k, v) => v.label);
        selI.querySelector('select').onchange = relire((e) => { opt.instrument = e.target.value; });
        selC.querySelector('select').onchange = relire((e) => { opt.cible = e.target.value; });

        zone.append(cur, selI, selC, chif, noteI);
        majChiffrage();
      } else if (c.parametrique === 'financement19') {
        zone.append(sel('Financement', FINANCEMENT_19, 'financement', (k, v) => `${v.label} (${fmt0(v.cout * 1000)} M€)`));
      }
      zone.onclick = (e) => e.stopPropagation();
      corps.appendChild(zone);
    };

    bRet.onclick = (e) => {
      e.stopPropagation();
      if (selection.has(c.id)) { selection.delete(c.id); carte.classList.remove('sel'); bRet.textContent = 'Retenir'; if (zone) { zone.remove(); zone = null; } }
      else {
        if (selection.size >= q.maxAnnonces) {
          bRet.textContent = `plafond de ${q.maxAnnonces} atteint`;
          setTimeout(() => { bRet.textContent = 'Retenir'; }, 1600);
          return;
        }
        const opt = c.parametrique === 'revalorisation' ? { montant: REVALORISATION.montant.defaut, instrument: 'indiciaire', cible: 'milieux' }
          : c.parametrique === 'financement19' ? { financement: 'demographie' } : {};
        selection.set(c.id, opt); carte.classList.add('sel', 'ouverte'); bRet.textContent = 'Retirer'; majParams();
      }
      majSolde();
    };
    const basculer = () => carte.classList.toggle('ouverte');
    tete.onclick = basculer;
    carte.onkeydown = (e) => { if (e.key === 'Enter' && e.target === carte) basculer(); };

    carte.append(tete, barre, corps, comp);
    return carte;
  };

  for (const c of q.dispo) grille.appendChild(rendreCarte(c));
  d.append(solde, grille);
  const act = el('div', 'actions');
  act.appendChild(valider);
  valider.onclick = () => {
    if (!selection.size && q.moment === 'janvier') {
      if (!confirm('Ne rien annoncer de toute l’année laisse le système souffler (fatigue −8)… et fait écrire « ministre invisible » (capital −7, parents −3,5). Confirmer ?')) return;
    }
    suivant([...selection].map(([id, options]) => ({ id, options })));
  };
  d.appendChild(act);
  majSolde();
  scene(d);
}

/* --- dossier de crise (l'été des cent jours) -------------------------------- */
function ecranDossier(q) {
  const dos = q.dossier;
  const d = docu('L’été des cent jours, dossier de crise', dos.titre, 'été 2027');
  d.classList.add('papier');
  d.appendChild(el('p', 'chapo', dos.contexte));
  const opts = el('div', 'opts');
  dos.options.forEach((o, i) => {
    const b = el('button', 'opt', `<b>${esc(o.titre)}</b>`);
    b.onclick = () => {
      opts.querySelectorAll('.opt').forEach((n, k) => {
        n.disabled = true;
        if (k !== i) n.style.opacity = '.38';
        else { n.style.borderLeftColor = 'var(--bleu-rf)'; n.style.borderColor = 'var(--bleu-rf)'; }
      });
      const dec = el('div', 'decryptage');
      dec.appendChild(el('div', 'titre-d', 'Ce que cette décision vous apprend'));
      dec.appendChild(el('p', '', esc(o.decryptage)));
      d.appendChild(dec);
      const act = el('div', 'actions');
      const ok = el('button', 'btn', 'Poursuivre');
      ok.onclick = () => suivant(i);
      act.appendChild(ok); d.appendChild(act);
      ok.scrollIntoView({ block: 'nearest' });
    };
    opts.appendChild(b);
  });
  d.appendChild(opts);
  scene(d);
}

/* --- audience syndicale ------------------------------------------------------ */
const PROFILS_L = {
  rapport_de_force: 'culture du rapport de force', reformiste: 'réformiste',
  frontal: 'opposition frontale', negociation: 'culture de la négociation',
  radical: 'radical', corporatiste: 'corporatiste',
};
function ecranAudience(q) {
  const { org, audience, soutien } = q;
  const d = docu('Audience, rentrée sociale', `Face à face : ${org.nom}`);
  const premiereAudience = ETAT.s.annee === 1;
  d.appendChild(el('p', 'chapo', `${fmt1(org.poids)} % aux dernières élections professionnelles, profil : ${PROFILS_L[org.profil]}.${premiereAudience ? ' La délégation s’assoit, ouvre un parapheur, et pose UNE question :' : ''}`));
  d.appendChild(el('div', 'note-passation', fr(audience.question(ETAT.s))));
  /* Une organisation ne fait pas que réclamer. Quand le ministre a pris une
     mesure qu'elle porte, elle le dit — et c'est la seule chose de la séance
     qui ne lui coûte rien. Le jeu le montre parce que l'inverse était faux :
     on ne demande pas le retrait de ce qu'on défend. */
  if (soutien) {
    d.appendChild(el('div', 'soutien-synd',
      `<b>Avant d’en venir au conflit, la délégation tient à le dire</b>
       <span class="quoi">${esc(soutien.label)}</span>
       <span>« Sur ce point, nous sommes avec vous. C’est une revendication que nous portons, vous l’avez prise. Mais nous ne le dirons pas publiquement. »</span>
       <span class="src">Une organisation ne peut pas demander le retrait d’une mesure qu’elle porte.</span>`));
  }
  if (premiereAudience) {
    d.appendChild(el('p', '', '<span style="font-size:.82rem;color:var(--encre-2)">Il n’y a pas de bonne réponse dans l’absolu, il y a une bonne réponse à <b>ce</b> profil-là. La fermeté rassure l’opinion, la méthode paie selon l’interlocuteur, la concession paie partout… et surtout à Bercy.</span>'));
  }
  const opts = el('div', 'opts');
  audience.reponses.forEach((r, i) => {
    const badge = { ferme: 'Fermeté', methode: 'Méthode', concession: 'Concession' }[r.type];
    const b = el('button', 'opt', `<b>${badge} — ${esc(r.titre)}</b>`);
    b.onclick = () => {
      const mult = (RECEPTION[org.profil] || {})[r.type] || 0;
      const verdict = mult >= 0.8 ? 'bien' : mult >= 0 ? 'froid' : 'mal';
      opts.querySelectorAll('.opt').forEach((n, k) => { n.disabled = true; if (k !== i) n.style.opacity = '.38'; else { n.style.borderColor = 'var(--bleu-rf)'; n.style.borderLeftColor = 'var(--bleu-rf)'; } });
      const coul = verdict === 'bien' ? 'var(--ok)' : verdict === 'mal' ? 'var(--rouge-rf)' : 'var(--or)';
      const lab = verdict === 'bien' ? '✓ Bien pris' : verdict === 'froid' ? '— Accueilli froidement' : '✗ Très mal reçu';
      const dec = el('div', 'decryptage');
      dec.style.borderLeftColor = coul;
      dec.innerHTML = `<div class="titre-d" style="color:${coul}">${lab} par ${esc(org.nom)} (${PROFILS_L[org.profil]})</div>
        <p><i>${esc(alea(REPLIQUES[verdict]))}</i></p><p>${esc(r.mot)}</p>`;
      d.appendChild(dec);
      const act = el('div', 'actions');
      const ok = el('button', 'btn', 'Clore l’audience');
      ok.onclick = () => suivant(i);
      act.appendChild(ok); d.appendChild(act);
      ok.scrollIntoView({ block: 'nearest' });
    };
    opts.appendChild(b);
  });
  d.appendChild(opts);
  scene(d);
}

/* --- la revendication : céder ou maintenir ----------------------------------- */
function ecranRetrait(q) {
  const { org, carte, mesure, risque, combatif } = q;
  const arg = q.argumentaire || {};
  const d = docu('Audience, la revendication', `${org.nom} exige un retrait`);
  d.classList.add('papier');
  d.appendChild(el('div', 'note-passation', `« Venons-en au fond. Nous demandons le retrait de <b>« ${esc(carte.label)} »</b>. Nous voterons contre au Conseil supérieur de l’éducation et nous appellerons à la grève. Votre réponse, monsieur le ministre ? »`));
  /* Deux arguments, de deux natures différentes, explicitement étiquetées.
     C'est le cœur pédagogique de la scène : apprendre à trier ce qui se vérifie
     de ce qui relève d'une conception de l'école, sans dire que le second
     serait illégitime. Une part de la politique scolaire est un choix de
     valeurs, et le jeu ne prétend pas trancher à la place du joueur. */
  const box = el('div', 'argumentaire');
  box.innerHTML = `
    <div class="arg arg-d"><span class="etiq">Argument étayé, vérifiable</span>
      <p class="dit">${fr(arg.etaye || '')}</p>
      <p class="verdict">${fr(arg.verifiable || '')}</p></div>
    <div class="arg arg-p"><span class="etiq">Argument de principe, non vérifiable</span>
      <p class="dit">${fr(arg.principe || '')}</p>
      <p class="verdict">${ETAT.s.annee <= 2
        ? 'Ce n’est pas une donnée, c’est une conception de l’école : parfaitement légitime, et non mesurable. Confondre les deux registres est ce qui rend illisibles la plupart des débats sur l’école, programmes des candidats compris.'
        : 'Légitime, et non mesurable : une conception de l’école, pas un résultat d’étude.'}</p></div>`;
  d.appendChild(box);
  d.appendChild(el('p', '', `<span style="font-size:.85rem;color:var(--encre-2)">Céder retire vraiment la mesure : ses ${fmt0(mesure.cout * 1000)} M€/an reviennent à votre marge, ses effets à venir sont annulés.</span>`));
  const opts = el('div', 'opts');

  const bMaintenir = el('button', 'opt', `<b>Maintenir la mesure</b>
    <span class="det">« Cette mesure a été décidée, elle sera appliquée. » Capital +2, adhésion en baisse.</span>
    <span class="risque-ligne">Risque de grève : <b style="color:${combatif && risque ? 'var(--rouge-rf)' : 'var(--ok)'}">${combatif && risque ? '~' + fmt1(risque.tauxMinistere) + ' % de grévistes (préavis probable)' : 'contenu, le profil de l’organisation ne s’y prête pas'}</b></span>`);
  bMaintenir.onclick = () => finRetrait('maintenir');
  const bCeder = el('button', 'opt', `<b>Céder, retirer la mesure</b>
    <span class="det">Adhésion en hausse, ${fmt0(mesure.cout * 1000)} M€/an récupérés · capital −4, fatigue +15, parents déçus. Les effets attendus ne viendront jamais.</span>
    <span class="risque-ligne">Risque de grève : <b style="color:var(--ok)">désamorcé</b></span>`);
  bCeder.onclick = () => finRetrait('ceder');
  const bRequal = el('button', 'opt', `<b>Requalifier, la renommer et la rendre facultative</b>
    <span class="det">L’annonce est sauvée, le dispositif se vide, et les ${fmt0(mesure.cout * 1000)} M€/an continuent d’être dépensés. Capital −2, fatigue +5, adhésion en légère hausse.</span>
    <span class="risque-ligne">Risque de grève : <b style="color:var(--ok)">désamorcé</b> · effet réel : <b style="color:var(--rouge-rf)">vous le découvrirez au bilan</b></span>`);
  bRequal.onclick = () => finRetrait('requalifier');
  opts.append(bMaintenir, bRequal, bCeder);
  d.appendChild(opts);

  function finRetrait(dec) {
    opts.querySelectorAll('.opt').forEach((n) => { n.disabled = true; });
    const box = el('div', 'decryptage');
    box.style.borderLeftColor = dec === 'ceder' ? 'var(--c-sante)' : dec === 'requalifier' ? 'var(--c-budget)' : 'var(--rouge-rf)';
    box.innerHTML = dec === 'ceder'
      ? `<div class="titre-d" style="color:var(--c-sante)">Vous cédez</div><p><i>« Nous avons gagné ce combat, mais la mobilisation se poursuit, pour les salaires ! »</i> — La mesure sort du droit. La presse titrera sur le recul ; les salles des professeurs, sur l’écoute. Les deux auront raison.</p>`
      : dec === 'requalifier'
      ? `<div class="titre-d" style="color:var(--c-budget)">Vous requalifiez</div><p><i>« Nous prenons acte de cet ajustement de méthode. »</i> Personne ne parlera de recul : le dispositif existe encore, sous un autre nom, et ne s’impose plus à personne. Le geste le moins coûteux du jeu, et le seul dont le prix n’apparaît qu’à la dernière page.</p>`
      : `<div class="titre-d" style="color:var(--rouge-rf)">Vous maintenez</div><p><i>« Nous allons appeler à une grève générale. Vous devrez en tirer les conséquences. »</i> — ${combatif ? 'La délégation quitte l’audience. Le préavis sera déposé avant la fin de semaine.' : 'La délégation transmettra à ses instances. Le rapport de force est noté, de part et d’autre.'}</p>`;
    d.appendChild(box);
    const act = el('div', 'actions');
    const ok = el('button', 'btn', 'Clore l’audience');
    ok.onclick = () => suivant(dec);
    act.appendChild(ok); d.appendChild(act);
    ok.scrollIntoView({ block: 'nearest' });
  }
  scene(d);
}

/* --- écrans narratifs (étapes) ---------------------------------------------- */
/* --- la boussole politique --------------------------------------------------
   Construite à partir des `porteurs` de chaque carte, c'est-à-dire de ceux qui
   défendent réellement la mesure dans le débat français. Deux chiffres comptent
   plus que les autres : la part des mesures portées par plusieurs bords à la
   fois (le débat scolaire est moins clivé qu'il ne se raconte), et la part de
   celles qu'aucun parti ne porte, elles viennent de la Cour des comptes, de la
   DEPP, du CSEN ou de la recherche, et ce sont souvent les mieux étayées. */
function blocBoussole(S, final) {
  const ids = S.mesuresParAnnee.flat().map((m) => m.id);
  const b = boussole(ids);
  const d = el('div', 'boussole');
  d.appendChild(el('div', 'titre-d', final ? 'D’où venaient vos mesures' : 'Ce que la presse politique lit dans vos annonces'));
  if (!b.total) {
    d.appendChild(el('p', 'bous-note', 'Vous n’avez rien annoncé. Aucun programme ne peut donc revendiquer quoi que ce soit, ce qui est une position, mais pas une politique.'));
    return d;
  }
  const lignes = Object.entries(BLOCS_2027).map(([cle, meta]) => {
    const n = b.parBord[cle].length;
    const pct = Math.round((n / b.total) * 100);
    return `<div class="bous-l"><span class="lib" style="border-left-color:${meta.coul}">${meta.label}<small>${meta.long}</small></span>
      <span class="rail"><i style="width:${Math.max(1, pct)}%;background:${meta.coul}"></i></span>
      <span class="v">${n}/${b.total}</span></div>`;
  }).join('');
  const sansPartiPct = Math.round((b.horsPartis.length / b.total) * 100);
  /* Le mode d’emploi une fois, les chiffres à chaque fois. */
  const premiereFois = final || S.annee <= 2;
  d.innerHTML += `<p class="bous-chapo">Sur vos <b>${b.total}</b> mesure${b.total > 1 ? 's' : ''} annoncée${b.total > 1 ? 's' : ''}, combien figurent aussi au programme de chaque camp en 2027.${premiereFois ? ' Une mesure peut compter dans plusieurs colonnes : c’est fréquent, et ce n’est pas une erreur de comptage.' : ''}</p>${lignes}
    <p class="bous-note"><b>${b.horsPartis.length} de vos ${b.total} mesures (${sansPartiPct} %) ne sont portées par aucun parti.</b>${premiereFois ? ' Elles viennent de la Cour des comptes, de la DEPP, du Conseil scientifique, de l’inspection générale ou de la recherche, et ce sont en moyenne celles dont le niveau de preuve est le plus élevé.' : ''}</p>`;
  if (final) {
    d.appendChild(el('p', 'bous-note',
      'Le jeu ne dit pas de quel bord vous êtes : il dit qui défend, dans la vraie vie, ce que vous avez signé. Si le résultat vous surprend, c’est le moment le plus utile de la partie.'));
  }
  return d;
}

function ecranEtape(etape) {
  const S = ETAT.s;
  const entrees = nouvellesEntrees();
  const une = unesPossibles(etape)[0];

  const blocs = [];
  if (etape === 'ouverture' && S.doctrine) {
    const dec = el('div', 'decode');
    dec.appendChild(el('div', 'titre-d', 'La presse décode votre feuille de route'));
    for (const c of S.doctrine.slice(0, 2)) dec.appendChild(el('p', '', K.PROJETS_2027[c].decode));
    dec.appendChild(el('p', '', `<span style="color:var(--encre-3);font-size:.8rem">En queue de classement : ${NOMS_C_LONGS[S.doctrine[4]].toLowerCase()} (8 % de votre bilan). Ses défenseurs relisent votre conférence de presse en prenant des notes.</span>`));
    blocs.push(dec);
  }

  if (etape === 'cloture') {
    const ouverts = S.effetsEnAttente.filter((e) => e.anneeOuverture === S.annee && !e.retire);
    if (ouverts.length) {
      const sc = el('div', 'scelles');
      sc.appendChild(el('div', 'titre-d', 'Scellés ouverts cette année, les effets réels arrivent'));
      for (const e of ouverts) {
        const c = PAR_ID[e.carte];
        sc.appendChild(el('div', 'ligne-s', `<span>${esc(c ? c.label : e.carte)}${e.requalifie ? '<span class="requal">requalifiée</span>' : ''}</span><span>→ ${NOMS_C[e.compteur]}</span>
          <span class="val" style="color:${e.montant > 1 ? 'var(--ok)' : e.montant < -1 ? 'var(--alerte)' : 'var(--encre-2)'}">${signe(e.montant)}</span>
          <span style="color:var(--encre-3);font-size:.76rem">preuve ${'🔒'.repeat(e.cadenas)} · documenté ~${signe(e.central)}${e.requalifie ? ' · rendue facultative' : ''}</span>`));
      }
      sc.appendChild(el('p', '', '<span style="font-size:.76rem;color:var(--encre-3)">Ce que vous aviez signé sous incertitude entre aujourd’hui dans les compteurs. Le reste s’ouvrira plus tard, parfois après vous.'
        + (ouverts.some((e) => e.requalifie) ? ' Les lignes marquées « requalifiée » sont les mesures que vous avez rendues facultatives sous pression : elles ont continué d’être financées et ont produit moins d’un cinquième de ce qu’elles promettaient.' : '')
        + '</span>'));
      blocs.push(sc);
    }
  }

  /* --- la boussole, à partir de la deuxième clôture ------------------------
     Elle arrive tard exprès : la première année, le joueur découvre le métier ;
     à partir de la deuxième, il a un bilan d'annonces assez fourni pour que la
     lecture politique soit autre chose qu'une étiquette collée sur trois
     cartes. Elle ne dit jamais « vous êtes de tel bord » : elle dit quels
     programmes portent, eux aussi, les mesures que le joueur a signées. */
  if (etape === 'cloture' && S.annee >= 2) blocs.push(blocBoussole(S));

  const j = el('article', 'journal');
  j.innerHTML = `<div class="manchette"><span class="titre-j">${CAST.journal}</span><span class="ours">${ETAT.dateLabel} · n° ${1200 + S.annee * 37 + (S.mois || 0)} · 2,40 €</span></div>
    <h2 class="une">${une.titre}</h2><p class="sous-une">${une.sous}</p>`;
  if (entrees.length) {
    const br = el('div', 'breves');
    for (const e of entrees.slice(0, 6)) br.appendChild(el('div', 'breve', `${fr(e.texte)} <span class="sig">${alea(CAST.breves)}</span>`));
    j.appendChild(br);
  }

  const fil = el('div', 'fil');
  const dispo = COMPTES.filter((c) => c.quand(S));
  for (const c of dispo.sort(() => Math.random() - 0.5).slice(0, etape === 'cloture' ? 3 : 2)) {
    fil.appendChild(el('div', 'post', `<span class="auteur">${c.a}</span> <span class="pseudo">${c.p}</span><p>${alea(c.posts)}</p>`));
  }

  ETAT.journalLu = S.journal.length;
  const ctx = {
    ouverture: 'Votre doctrine est déclarée. L’été, lui, a ses propres plans.',
    juillet: 'La double sanction de juillet est tombée : lettre plafond et concours.',
    rentree: '',
    decembre: 'Budget voté, publications de décembre.',
    mars: 'Les mobilisations de printemps.',
    cloture: `Fin de l’année scolaire, an ${S.annee} sur 5.`,
  }[etape] || '';
  scene(...blocs, j, fil);
  boutonSuite('Continuer', ctx, () => suivant(undefined));
}

/* --- bilan final -------------------------------------------------------------- */
function ecranBilan(B) {
  const S = ETAT.s;
  localStorage.removeItem(CLE_SAUVE);
  const fins = {
    mandat_complet: ['CINQ ANS RUE DE GRENELLE : IL PART DEBOUT', 'Bravo ! Aucun ministre de l’Éducation n’avait tenu un quinquennat entier depuis fort longtemps. Le déménageur est déçu.'],
    renvoi: ['REMANIÉ', 'Trois convocations à Matignon font une porte. Vos cartons connaissaient le chemin.'],
    remaniement: ['REMANIEMENT SURPRISE !', 'Rien de personnel. Votre nom équilibrait un tableau qui ne vous concernait pas.'],
    guerre_scolaire: ['GUERRE SCOLAIRE : LE TEXTE RETIRÉ, LE MINISTRE AUSSI', 'Un million de personnes dans la rue. Comme en 1984, à la mode près.'],
  }[B.fin.type] || ['FIN DE MANDAT', ''];

  const j = el('article', 'journal');
  j.innerHTML = `<div class="manchette"><span class="titre-j">${CAST.journal}</span><span class="ours">édition spéciale · héritage</span></div>
    <h2 class="une">${fins[0]}</h2><p class="sous-une">${fins[1] || esc(B.fin.texte)}</p>`;

  const d = el('article', 'doc large');
  d.appendChild(el('div', 'entete-doc', `<span class="type">${picto('drapeau')}Le bilan, la vérité, enfin</span><span class="date">${B.anneesJouees} an${B.anneesJouees > 1 ? 's' : ''} de mandat</span>`));
  { const bn = illustration('demenagement', false); if (bn) d.appendChild(bn); }

  const sc = el('div', 'score-final');
  const bloc = (val, lib, note) => { const b = el('div', 'score-bloc', `<div class="val">${fmt0(val)}<span style="font-size:.9rem;color:var(--encre-2)">/100</span></div><div class="lib">${lib}</div>${note ? `<div style="font-size:.72rem;color:var(--encre-2);margin-top:4px">${note}</div>` : ''}`); return b; };
  sc.append(
    bloc(B.scoreAffiche, 'Ce que le pays a vu', 'les indicateurs à votre départ'),
    bloc(B.scoreBilan, 'Ce que vous avez fait', 'les effets réels, pondérés par VOTRE doctrine'),
    bloc(B.scoreProjection, 'Dans dix ans',
      B.constance ? 'si votre successeur tient votre cap, et il le peut'
      : B.fin.type !== 'mandat_complet' ? 'mandat interrompu : le cap ne vous a pas survécu'
      : 'cap incohérent avec votre doctrine : le successeur détricote'));
  d.appendChild(sc);

  d.appendChild(el('p', 'verdict', verdictProse(B)));

  /* --- les cinq compteurs, y compris les deux qui n'étaient pas affichés --- */
  const caches = (B.doctrine || []).slice(3);
  const t1 = el('div', 'defile');
  t1.innerHTML = `<table class="bilan"><tr><th>Compteur (votre rang)</th><th class="num">Juin 2027</th><th class="num">Affiché</th><th class="num">Réel</th><th class="num">+10 ans</th></tr>
    ${B.doctrine.map((c, i) => `<tr${caches.includes(c) ? ' class="cache"' : ''}><td><span style="color:${COULEURS_C[c]}">●</span> ${NOMS_C_LONGS[c]} <span style="color:var(--encre-3)">(n° ${i + 1}, ${K.POIDS_DOCTRINE[i]} %${caches.includes(c) ? ', jamais affiché' : ''})</span></td>
      <td class="num">${fmt0(K.COMPTEURS_INITIAUX[c])}</td><td class="num">${fmt0(B.affiche[c])}</td>
      <td class="num"><b>${fmt0(B.vrai[c])}</b></td><td class="num">${fmt0(B.projection[c])}</td></tr>`).join('')}</table>`;
  d.appendChild(t1);
  d.appendChild(el('p', 'bilan-note', `Vous n’avez jamais vu ${caches.map((c) => NOMS_C_LONGS[c].toLowerCase()).join(' ni ')} : classés quatrième et cinquième, ils étaient tenus sans être affichés. Ils valent ${K.POIDS_DOCTRINE[3] + K.POIDS_DOCTRINE[4]} % de votre note.`));

  /* --- révélation des effets réels ---
     Trois phrases d'abord, le tableau complet ensuite, replié : le reproche fait
     à l'ancien bilan était sa longueur, pas ses données. */
  const effets = S.effetsEnAttente.filter((e) => !e.retire);
  const parCarte = new Map();
  for (const e of S.effetsEnAttente) { if (!parCarte.has(e.carte)) parCarte.set(e.carte, []); parCarte.get(e.carte).push(e); }
  const nom = (id) => (PAR_ID[id] ? PAR_ID[id].label : id);

  d.appendChild(el('h2', '', 'Ce que vos mesures ont réellement produit')).style.marginTop = '26px';
  if (effets.length) {
    const meilleur = effets.reduce((a, b) => (b.montant > a.montant ? b : a));
    const decu = effets.reduce((a, b) => ((b.central - b.montant) > (a.central - a.montant) ? b : a));
    const apres = effets.filter((e) => e.anneeArrivee > B.anneesJouees);
    const somme = apres.reduce((t, e) => t + e.montant, 0);
    const syn = el('ul', 'bilan-syn');
    syn.innerHTML = [
      `<li><b>Votre meilleure décision :</b> ${esc(nom(meilleur.carte))}, ${signe(meilleur.montant)} sur ${NOMS_C[meilleur.compteur]}, pour un effet documenté de ${signe(meilleur.central)}.</li>`,
      (decu.central - decu.montant) > 0.8
        ? `<li><b>Votre plus grosse déception :</b> ${esc(nom(decu.carte))}. Les études promettaient ${signe(decu.central)} sur ${NOMS_C[decu.compteur]}, vous avez obtenu ${signe(decu.montant)}. ${decu.cadenas <= 2 ? 'Le niveau de preuve était mince : c’était un pari.' : 'La mesure était solide, c’est sa mise en œuvre qui l’a rabotée (adhésion à ' + fmt0(S.phys.adhesion) + ').'}</li>`
        : '',
      apres.length
        ? `<li><b>${apres.length} effet${apres.length > 1 ? 's' : ''} arrive${apres.length > 1 ? 'nt' : ''} après votre départ</b>, pour ${signe(somme)} au total. Votre successeur les inaugurera. C’est la règle du métier : on récolte ce qu’un autre a semé, et on sème ce qu’un autre récoltera.</li>`
        : '<li>Aucun de vos effets n’arrive après vous : tout ce que vous avez engagé a produit (ou non) pendant votre mandat.</li>',
      `<li>Les effets « d’image » du mandat n’apparaissent nulle part ici : ils se sont évaporés, comme prévu.</li>`,
    ].filter(Boolean).join('');
    d.appendChild(syn);
  } else {
    d.appendChild(el('p', 'chapo', 'Aucune mesure engagée. Le système vous remercie du repos ; l’Histoire, moins.'));
  }

  /* --- d'où venaient vos mesures --- */
  d.appendChild(blocBoussole(S, true));

  const det = el('details', 'bilan-detail');
  det.innerHTML = '<summary>Le détail, mesure par mesure</summary>';
  const t2 = el('div', 'defile');
  let lignes = '';
  for (const [id, effs] of parCarte) {
    lignes += effs.map((e, i) => `<tr>${i === 0 ? `<td rowspan="${effs.length}">${esc(nom(id))}</td>` : ''}
      <td>${NOMS_C[e.compteur]}</td>
      <td class="num">${signe(e.central)} <span title="niveau de preuve">${'🔒'.repeat(e.cadenas)}</span></td>
      <td class="num"><span class="revele ${e.montant > 1 ? 'bon' : e.montant < -1 ? 'mauvais' : ''}">${signe(e.montant)}</span></td>
      <td>${e.retire ? '<span style="color:var(--rouge-rf)">retirée, effet annulé</span>' : e.applique ? 'effet arrivé' : `arrive an ${e.anneeArrivee}${e.anneeArrivee > B.anneesJouees ? ', après vous' : ''}`}</td></tr>`).join('');
  }
  t2.innerHTML = `<table class="bilan"><tr><th>Mesure</th><th>Compteur</th><th class="num">Effet documenté</th><th class="num">Effet obtenu</th><th>Horizon</th></tr>${lignes || '<tr><td colspan="5">Aucune mesure engagée.</td></tr>'}</table>`;
  det.appendChild(t2);
  det.appendChild(el('p', 'bilan-note', 'Effet documenté : la valeur centrale de la littérature, que vous ne voyiez pas en signant. Effet obtenu : ce tirage-là, multiplié par l’implémentation et la capacité d’absorption.'));
  d.appendChild(det);

  /* --- doctrine déclarée vs menée --- */
  d.appendChild(el('p', 'bilan-final', `<b>Doctrine déclarée contre doctrine menée :</b> ${fmt0((B.coherence || 0) * 100)} % de vos effets réels servent vos deux priorités annoncées${B.constance ? ', cap tenu : vos gains composeront.' : ', cap non tenu : un successeur détricote, et les dérives reprennent.'}
    <br>${B.greves} journée${B.greves > 1 ? 's' : ''} de grève · fatigue réformatrice ${fmt0(B.fatigue)}/100 · ${B.abandons} mesure${B.abandons > 1 ? 's' : ''} retirée${B.abandons > 1 ? 's' : ''} sous la pression.`));

  /* La comparaison, si cette partie était une revanche. */
  const rev = ETAT.revanche;
  if (rev && rev.precedent && rev.graine === ETAT.graine) {
    const P = rev.precedent;
    const cmp = el('div', 'revanche-cmp');
    cmp.innerHTML = `<div class="titre-d">Même partie, deux doctrines</div>
      <p class="bilan-note">Mêmes tirages, mêmes crises. Seul le classement de juin 2027 a changé. Voici ce que cela a fait.</p>
      <div class="defile"><table class="bilan">
        <tr><th></th><th class="num">Partie précédente</th><th class="num">Celle-ci</th></tr>
        <tr><td>Priorité déclarée</td><td class="num">${NOMS_C_LONGS[P.doctrine[0]]}</td><td class="num">${NOMS_C_LONGS[B.doctrine[0]]}</td></tr>
        <tr><td>Ce que le pays a vu</td><td class="num">${fmt0(P.scoreAffiche)}</td><td class="num">${fmt0(B.scoreAffiche)}</td></tr>
        <tr><td>Ce que vous avez fait</td><td class="num">${fmt0(P.scoreBilan)}</td><td class="num"><b>${fmt0(B.scoreBilan)}</b></td></tr>
        <tr><td>Dans dix ans</td><td class="num">${fmt0(P.scoreProjection)}</td><td class="num">${fmt0(B.scoreProjection)}</td></tr>
        <tr><td>Durée du mandat</td><td class="num">${P.anneesJouees} an${P.anneesJouees > 1 ? 's' : ''}</td><td class="num">${B.anneesJouees} an${B.anneesJouees > 1 ? 's' : ''}</td></tr>
        ${Object.keys(NOMS_C).map((c) => `<tr><td>${NOMS_C_LONGS[c]}, réel</td><td class="num">${fmt0(P.vrai[c])}</td><td class="num">${fmt0(B.vrai[c])}</td></tr>`).join('')}
      </table></div>
      <p class="bilan-note">Ce tableau est la thèse du jeu en une image : les faits sont les mêmes, les mesures disponibles aussi. Ce qui a changé, ce sont les priorités, et donc les choix, et donc le pays à l’arrivée. Le désaccord politique porte là-dessus, pas sur les chiffres.</p>`;
    d.appendChild(cmp);
    try { localStorage.removeItem(CLE_REVANCHE); } catch (e) { /* sans importance */ }
  }

  const act = el('div', 'actions');
  const rejouer = el('button', 'btn', 'Nouveau mandat (autres tirages, autres crises)');
  rejouer.onclick = () => { localStorage.removeItem(CLE_SAUVE); localStorage.removeItem(CLE_REVANCHE); location.reload(); };
  act.appendChild(rejouer);
  if (!(rev && rev.precedent)) {
    const revanche = el('button', 'btn secondaire', 'Rejouer la même partie, doctrine inversée');
    revanche.title = 'Mêmes tirages, mêmes crises : seul votre classement de juin change.';
    revanche.onclick = () => {
      try {
        localStorage.setItem(CLE_REVANCHE, JSON.stringify({
          graine: ETAT.graine, doctrineInverse: [...B.doctrine].reverse(),
          precedent: { doctrine: B.doctrine, scoreAffiche: B.scoreAffiche, scoreBilan: B.scoreBilan,
            scoreProjection: B.scoreProjection, anneesJouees: B.anneesJouees, vrai: B.vrai },
        }));
      } catch (e) { /* stockage indisponible : on rejoue sans comparaison */ }
      localStorage.removeItem(CLE_SAUVE); location.reload();
    };
    act.appendChild(revanche);
  }
  d.appendChild(act);
  scene(j, d);
}

function verdictProse(B) {
  const v = B.vrai, ecartPerception = B.scoreAffiche - B.scoreBilan;
  if (B.fin.type === 'guerre_scolaire') return '« Il avait raison sur le fond », dira-t-on dans dix ans. C’est exactement ce qu’on a dit d’Alain Savary.';
  if (B.scoreBilan >= 55 && B.constance) return 'Vous laissez un système en meilleur état que vous ne l’avez trouvé, un cap lisible, et des effets qui composeront après vous. Dans ce ministère, cela porte un nom : une exception. Vous aurez droit à une salle de réunion à votre nom à la DGESCO, celle qui fait face à la machine à café.';
  if (ecartPerception > 5) return 'Beau mandat, disent les sondages. Le bilan, lui, est plus discret : vous avez surtout gouverné le tableau de bord. Vos successeurs gouverneront le reste.';
  if (B.scoreBilan - B.scoreAffiche > 3) return 'Le pays ne vous a pas vu travailler, les indicateurs regardaient ailleurs, comme toujours, avec dix ans de retard. Vos successeurs inaugureront vos résultats. Ils y penseront très fort.';
  if (B.anneesJouees < 3) return 'Deux ans, comme la moyenne. Le système vous a survécu sans effort particulier : il a l’habitude.';
  return 'Un mandat dans la moyenne haute de ce que la Ve République fait de ses ministres de l’Éducation : des choix, des renoncements, et un tableau de bord qui ne dit pas encore la vérité.';
}

/* --- repères sourcés : rendu partagé ---------------------------------------- */
/* La même fonction sert la note de cadrage de juin 2027 et l'onglet permanent
   « Comprendre le jeu ». Chaque chiffre porte sa source, cliquable. */
function citer(idSource) {
  const S = SOURCES[idSource];
  if (!S) return '';
  const lib = `${esc(S.org)} — ${esc(S.titre)} (${esc(S.date)})`;
  return `<cite>${S.url ? `<a href="${S.url}" target="_blank" rel="noopener">${lib}</a>` : lib}</cite>`;
}

/* --- graphiques de la note de cadrage ---------------------------------------- */
/* Deux règles. Les BARRES partent toujours de zéro : un axe tronqué transforme
   une hausse de 1,2 % en mur, et ce jeu passe son temps à dire que les chiffres
   affichés mentent. Les COURBES, elles, ont le droit à une échelle resserrée
   (c'est l'usage pour une série temporelle), à condition que l'axe soit gradué
   et légendé, ce qu'il est ici. */
const md1 = (x) => x.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function serieBudget() {
  const max = 70, HP = 132;                        // graduation ronde, hauteur de tracé
  const grads = [0, 20, 40, 60];
  /* Valeurs et années sont dans leurs propres rangées, avec le même retrait à
     gauche et la même gouttière que les barres : rien ne peut se chevaucher. */
  const g = el('div', '');
  g.innerHTML = `
  <div class="rep-valeurs">${SERIE_BUDGET.map((b, i) => {
    /* La hausse de l'année s'écrit sur sa colonne : à l'échelle du graphique
       elle ne fait qu'un pixel et demi, mais c'est elle que le ministre
       arbitre. */
    const d = b.prevision && i > 0 ? `<em>+${md1(b.md - SERIE_BUDGET[i - 1].md)}</em>` : '';
    return `<span>${d}${md1(b.md)}</span>`;
  }).join('')}</div>
  <div class="rep-plot" role="img" aria-label="Budget de l’enseignement scolaire, de 52,3 milliards d’euros en 2019 à 65,3 milliards en 2027">
    ${grads.map((v) => `<i class="grad" style="bottom:${((v / max) * HP).toFixed(1)}px"><b>${v}</b></i>`).join('')}
    <div class="rep-cols">
      ${SERIE_BUDGET.map((b) => `<div class="col${b.prevision ? ' prev' : ''}">`
        + `<i class="bar" style="height:${((b.md / max) * HP).toFixed(1)}px"></i></div>`).join('')}
    </div>
  </div>
  <div class="rep-annees">${SERIE_BUDGET.map((b) => `<span>${b.annee}</span>`).join('')}</div>
  <div class="rep-lgd"><i class="c-bleu-bloc"></i>budget voté<i class="c-hachure"></i>plafond prévisionnel 2027<span class="unite">en milliards d’euros courants</span></div>
  <p class="rep-serie-note"><b>+0,8 Md€ en 2027</b>, soit +1,2 % : c’est tout ce qui est nouveau, et une bonne moitié en est déjà engagée par votre prédécesseur. Crédits de paiement de la mission « Enseignement scolaire », hors pensions. <b>L’échelle part de zéro</b> : la hausse est réelle mais modeste — +25 % en huit ans d’euros courants, soit à peu près l’inflation. 2021 n’est pas représentée, le périmètre de la mission ayant changé cette année-là.</p>`;
  return g;
}

/* Effectifs d'élèves : la courbe demandée. Bleu plein = constaté, violet
   pointillé = projection DEPP. Axe gradué, donc échelle resserrée assumée. */
function serieEleves() {
  const S = SERIE_ELEVES;
  const W = 640, H = 168, PL = 30, PB = 24, PT = 10;
  const yMin = 9.5, yMax = 12;
  /* L'abscisse suit l'ANNÉE et non le rang : 2031 et 2033 sont séparés de deux
     ans, les afficher à égale distance de 2030 et 2035 mentirait sur la pente. */
  const a0 = S[0].annee, a1 = S[S.length - 1].annee;
  const x = (an) => PL + ((an - a0) / (a1 - a0)) * (W - PL - 22);
  const y = (m) => PT + (1 - (m - yMin) / (yMax - yMin)) * (H - PT - PB);
  const iSplit = S.findIndex((p) => !p.constate) - 1;      // dernier point constaté
  const pts = (arr) => arr.map((p) => `${x(p.annee).toFixed(1)},${y(p.m).toFixed(1)}`).join(' ');
  const grads = [9.5, 10, 10.5, 11, 11.5, 12];
  const g = el('div', '');
  g.innerHTML = `
  <svg class="rep-courbe" viewBox="0 0 ${W} ${H}" role="img"
       aria-label="Nombre d’élèves : 11,88 millions en 2024, 11,61 millions en 2026, 9,93 millions projetés en 2035">
    ${grads.map((v) => `<line class="grille" x1="${PL}" y1="${y(v).toFixed(1)}" x2="${W - 10}" y2="${y(v).toFixed(1)}"/>
      <text class="tick" x="${PL - 6}" y="${(y(v) + 3.5).toFixed(1)}" text-anchor="end">${md1(v)}</text>`).join('')}
    <polyline class="trait constate" points="${pts(S.slice(0, iSplit + 1))}"/>
    <polyline class="trait projete" points="${pts(S.slice(iSplit))}"/>
    ${S.map((p) => `<circle cx="${x(p.annee).toFixed(1)}" cy="${y(p.m).toFixed(1)}" r="3.4" class="pt ${p.constate ? 'constate' : 'projete'}"/>`).join('')}
    ${S.map((p, i) => (i === 0 || i === S.length - 1 || p.annee === 2026)
      ? `<text class="val ${p.constate ? 'constate' : 'projete'}" x="${x(p.annee).toFixed(1)}" y="${(y(p.m) - 10).toFixed(1)}" text-anchor="${i === 0 ? 'start' : i === S.length - 1 ? 'end' : 'middle'}">${md1(p.m)} M</text>` : '').join('')}
    ${S.map((p, i) => (i % 2 === 0 || i === S.length - 1)
      ? `<text class="an" x="${x(p.annee).toFixed(1)}" y="${H - 7}" text-anchor="middle">${p.annee}</text>` : '').join('')}
  </svg>
  <div class="rep-lgd"><i class="c-bleu"></i>effectifs constatés<i class="c-violet"></i>projection DEPP, scénario de référence<span class="unite">en millions d’élèves</span></div>
  <p class="rep-serie-note">Premier et second degrés, public et privé sous contrat. L’axe vertical est gradué de 9,5 à 12 millions : il ne part pas de zéro, ce qui est l’usage pour une série temporelle et rend la pente lisible. La chute est continue, elle a déjà commencé, et elle touchera bientôt le collège puis le lycée.</p>`;
  return g;
}

/* Niveaux : l'évolution, parce que l'information qui manquait était la période. */
function serieNiveaux() {
  const S = SERIE_PISA_MATHS;
  const W = 640, H = 168, PL = 30, PB = 24, PT = 16;
  const yMin = 465, yMax = 520;
  const a0 = S[0].annee, a1 = S[S.length - 1].annee;
  const x = (an) => PL + ((an - a0) / (a1 - a0)) * (W - PL - 18);
  const y = (v) => PT + (1 - (v - yMin) / (yMax - yMin)) * (H - PT - PB);
  const grads = [470, 480, 490, 500, 510];
  const iC = S.length - 2;                                 // début du segment de chute
  const g = el('div', '');
  g.innerHTML = `
  <svg class="rep-courbe" viewBox="0 0 ${W} ${H}" role="img"
       aria-label="Score des élèves français de 15 ans en mathématiques à PISA : 511 en 2003, 495 en 2018, 474 en 2022">
    ${grads.map((v) => `<line class="grille" x1="${PL}" y1="${y(v).toFixed(1)}" x2="${W - 18}" y2="${y(v).toFixed(1)}"/>
      <text class="tick" x="${PL - 6}" y="${(y(v) + 3.5).toFixed(1)}" text-anchor="end">${v}</text>`).join('')}
    <polyline class="trait constate" points="${S.slice(0, iC + 1).map((p) => `${x(p.annee).toFixed(1)},${y(p.score).toFixed(1)}`).join(' ')}"/>
    <polyline class="trait chute" points="${S.slice(iC).map((p) => `${x(p.annee).toFixed(1)},${y(p.score).toFixed(1)}`).join(' ')}"/>
    ${S.map((p) => `<circle cx="${x(p.annee).toFixed(1)}" cy="${y(p.score).toFixed(1)}" r="3.4" class="pt ${p.chute ? 'chute' : 'constate'}"/>`).join('')}
    <text class="val constate" x="${x(S[0].annee).toFixed(1)}" y="${(y(S[0].score) - 10).toFixed(1)}" text-anchor="start">${S[0].score}</text>
    <text class="val constate" x="${x(S[iC].annee).toFixed(1)}" y="${(y(S[iC].score) - 10).toFixed(1)}" text-anchor="middle">${S[iC].score}</text>
    <text class="val chute" x="${x(S[S.length - 1].annee).toFixed(1)}" y="${(y(S[S.length - 1].score) + 17).toFixed(1)}" text-anchor="end">${S[S.length - 1].score}</text>
    <text class="annot" x="${((x(S[iC].annee) + x(S[S.length - 1].annee)) / 2).toFixed(1)}" y="${PT - 4}" text-anchor="middle">−21 points en quatre ans</text>
    ${S.map((p) => `<text class="an" x="${x(p.annee).toFixed(1)}" y="${H - 7}" text-anchor="middle">${p.annee}</text>`).join('')}
  </svg>
  <div class="rep-lgd"><i class="c-bleu"></i>score de la France<i class="c-rouge"></i>la chute de 2022<span class="unite">mathématiques, élèves de 15 ans</span></div>
  <p class="rep-serie-note">Échelle PISA ancrée sur 2003, année où les mathématiques étaient le domaine majeur de l’enquête. Le score était stable de 2012 à 2018 ; la baisse de 2022 est commune à la plupart des pays de l’OCDE, et la France reste dans la moyenne. Pour la première fois depuis 2003, la part des élèves les plus performants recule aussi : de 13 % à 7 %.</p>`;
  return g;
}

/* --- juin 2027 : les trois notes de la DGESCO, une par écran ------------------ */
/* Chacune débouche sur une décision : on ne lit pas un dossier pour le plaisir
   de le lire. La note arrive, on la lit, on décide. */
const NOTES_SUITE = {
  budget: 'Lire la note, puis décider de la rallonge',
  demographie: 'Lire la note, puis annoncer votre intention',
};
function ecranReperes(q) {
  const cle = (q && q.note) || 'budget';
  const b = CADRAGE_INITIAL.find((x) => x.cle === cle) || CADRAGE_INITIAL[0];
  const GRAPH = { budget: serieBudget, eleves: serieEleves, niveaux: serieNiveaux };

  const d = el('article', 'doc large');
  d.appendChild(el('div', 'entete-doc',
    `<span class="type">Note de la direction générale de l’enseignement scolaire (DGESCO)</span><span class="date">${ETAT.dateLabel}</span>`));
  d.appendChild(el('h2', '', esc(b.titre)));

  const a = el('div', 'accroche');
  /* Le chiffre-clé et, juste dessous, celui qui le commande. */
  const sa = b.sousAccroche;
  a.innerHTML = `<div class="chiffre-cle"><b>${fr(b.accroche.v)}</b>`
    + (sa ? `<span class="sous"><em>${fr(sa.v)}</em> ${fr(sa.l)}.${citer(sa.src)}</span>` : '')
    + `</div><p>${fr(b.accroche.l)}${citer(b.accroche.src)}</p>`;
  d.appendChild(a);
  if (GRAPH[b.graphique]) d.appendChild(GRAPH[b.graphique]());
  if (b.chiffres.length) d.appendChild(el('ul', 'rep-liste', b.chiffres.map((x) =>
    `<li><span class="v">${fr(x.v)}</span><span class="l">${fr(x.l)}.${citer(x.src)}</span></li>`).join('')));
  d.appendChild(el('p', 'cadrage-retenir', fr(b.aRetenir)));

  const ok = el('button', 'btn tamponner', NOTES_SUITE[cle] || 'Continuer');
  ok.onclick = () => suivant(null);
  d.appendChild(el('div', 'actions')).appendChild(ok);
  scene(d);
}

function blocReperes(cles, ouvert) {
  const z = el('div', 'reperes');
  for (const r of REPERES) {
    if (cles && !cles.includes(r.cle)) continue;
    const dt = el('details', 'rep-theme');
    if (ouvert === 'tous' || (Array.isArray(ouvert) && ouvert.includes(r.cle))) dt.open = true;
    dt.innerHTML = `<summary><h4>${esc(r.titre)}</h4><span class="res">${fr(r.resume)}</span></summary>`;
    const c = el('div', 'rep-corps');
    if (r.serie === 'budget') c.appendChild(serieBudget());
    c.appendChild(el('ul', 'rep-liste', r.chiffres.map((x) =>
      `<li><span class="v">${fr(x.v)}</span><span class="l">${fr(x.l)}.${citer(x.src)}</span></li>`).join('')));
    c.appendChild(el('div', 'rep-retenir', `<b>Ce qu’il faut en retenir</b>${fr(r.aRetenir)}`));
    dt.appendChild(c);
    z.appendChild(dt);
  }
  return z;
}

/* --- l'onglet permanent ------------------------------------------------------ */
function ouvrirComprendre() {
  const c = $('#comprendre-corps');
  c.innerHTML = '';
  const t = el('div', '');
  t.innerHTML = `<p class="chapo">Les données de référence sur lesquelles le jeu est construit, thème par thème, avec leurs sources. Rien ici n’est simulé : ce sont les chiffres publiés par la DEPP, le Sénat, la Cour des comptes et l’OCDE, tels qu’ils étaient en août 2026. Le moteur du jeu les utilise comme état de départ ; la fiche « Comment le jeu note les mesures » explique le reste.</p>`;
  c.appendChild(t);
  c.appendChild(blocReperes(null, ['preuve']));
  const src = el('div', '');
  src.innerHTML = `<h3>Toutes les sources</h3><ul class="rep-sources">${
    Object.values(SOURCES).sort((a, b) => a.org.localeCompare(b.org, 'fr')).map((S) =>
      `<li><span class="org">${esc(S.org)}</span> — ${S.url ? `<a href="${S.url}" target="_blank" rel="noopener">${esc(S.titre)}</a>` : esc(S.titre)} <span style="color:var(--encre-3)">(${esc(S.date)})</span></li>`).join('')
  }</ul>
  <p class="rep-serie-note">Les personnages, les organisations syndicales et les titres de presse du jeu sont des pseudonymes transparents : la satire est symétrique, personne n’est épargné. En revanche, les propositions politiques citées sur les cartes sont réelles et attribuées à leurs auteurs, et tous les chiffres ci-dessus sont vérifiables aux sources indiquées.</p>`;
  c.appendChild(src);
  $('#comprendre').hidden = false;
  $('#comprendre').scrollTop = 0;
  document.documentElement.style.overflow = 'hidden';
}
function fermerComprendre() {
  $('#comprendre').hidden = true;
  document.documentElement.style.overflow = '';
}

/* -------------------------------------------------------- boucle & sauvegarde */
const CLE_SAUVE = 'rue-de-grenelle-v3';   // v3 : feuille de route libre (formats antérieurs incompatibles)
const ETAT = { s: null, gen: null, journalLu: 0, pas: [], dateLabel: 'juin 2027', rentreeRatee: false, enAttente: null, rendre: null };

function dateDe(q) {
  const S = ETAT.s, an = S.anneeCiv || 2027;
  if (q.type === 'nomination') return 'juin 2027';
  if (q.type === 'doctrine') return 'juin 2027';
  if (q.type === 'reperes') return q.note === 'budget' ? 'juin 2027' : `juillet ${an}`;
  if (q.type === 'avance') return 'juin 2027';
  if (q.type === 'entretien') return 'juin 2027';
  if (q.type === 'profil') return 'juin 2027';
  if (q.type === 'intention') return `juillet ${an}`;
  if (q.type === 'affaire') return `décembre ${an}`;
  if (q.type === 'polemique') return `septembre ${an}`;
  if (q.type === 'livraison') return `octobre ${an}`;
  if (q.type === 'plateau') return `décembre ${an}`;
  if (q.type === 'retrait') return `octobre ${ETAT.s.anneeCiv || 2027}`;
  if (q.type === 'dossier') return 'été 2027';
  if (q.type === 'audience') return `octobre ${ETAT.s.anneeCiv || 2027}`;
  if (q.type === 'lettrePlafond') return `juillet ${an}`;
  if (q.type === 'rentree') return `septembre ${an}`;
  if (q.type === 'carteScolaire') return `janvier ${an + 1}`;
  if (q.type === 'mesures') {
    return q.moment === 'prise_fonction' ? 'juin 2027'
      : q.moment === 'rentree' ? `septembre ${an}` : `janvier ${an + 1}`;
  }
  const m = { ouverture: 'juin 2027', juillet: `juillet ${an}`, rentree: `septembre ${an}`, decembre: `décembre ${an}`, mars: `mars ${an + 1}`, cloture: `mai ${an + 1}` };
  return m[q.etape] || `${MOIS_L[S.mois] || ''} ${an}`;
}

/* Le pictogramme et le pas de temps de chaque écran, lus depuis la question
   posée par le moteur. La frise de gauche et l'en-tête des documents s'en
   servent tous les deux. */
/* L'été tient en une seule étape : juillet, c'est l'été, et les cent jours
   n'ont pas besoin de deux cases pour se raconter. */
const PAS = [
  ['juin', 'Juin', 'Prise de fonction'],
  ['ete', 'Été', 'Cent jours, lettre plafond'], ['septembre', 'Septembre', 'Rentrée, circulaire'],
  ['octobre', 'Octobre', 'Audience syndicale'], ['decembre', 'Décembre', 'Budget, presse'],
  ['janvier', 'Janvier', 'Carte scolaire, atelier'], ['mars', 'Mars', 'Mobilisations'], ['mai', 'Mai', 'Clôture'],
];
function situer(q) {
  const t = q.type, e = q.etape, m = q.moment;
  if (t === 'nomination') return ['juin', 'telephone'];
  if (t === 'entretien') return ['juin', 'colonnes'];
  if (t === 'profil') return ['juin', 'carte'];
  if (t === 'doctrine') return ['juin', 'pupitre'];
  if (t === 'reperes') return [q.note === 'budget' ? 'juin' : 'ete', q.note === 'budget' ? 'pieces' : 'courbe'];
  if (t === 'avance') return ['juin', 'pieces'];
  if (t === 'intention') return ['ete', 'courbe'];
  if (t === 'dossier') return ['ete', 'soleil'];
  if (t === 'lettrePlafond') return ['ete', 'lettre'];
  if (t === 'rentree') return ['septembre', 'ecole'];
  if (t === 'polemique') return ['septembre', 'journal'];
  if (t === 'audience') return ['octobre', 'megaphone'];
  if (t === 'retrait') return [q.printemps ? 'mars' : 'octobre', 'megaphone'];
  if (t === 'livraison') return ['decembre', 'globe'];
  if (t === 'plateau') return ['decembre', 'tele'];
  if (t === 'affaire') return ['decembre', 'alerte'];
  if (t === 'carteScolaire') return ['janvier', 'plan'];
  if (t === 'mesures') return [m === 'prise_fonction' ? 'juin' : m === 'rentree' ? 'septembre' : m === 'livraison' ? 'decembre' : 'janvier', 'liste'];
  if (t === 'etape') return [{ ouverture: 'ete', juillet: 'ete', rentree: 'septembre', decembre: 'decembre', mars: 'mars', cloture: 'mai' }[e] || 'mai', 'journal'];
  return ['mai', 'drapeau'];
}
function majFrise(pasCourant) {
  const S = ETAT.s, f = $('#frise');
  if (!f) return;
  f.hidden = false;
  const fini = pasCourant === 'fin';
  const annee = fini ? 6 : Math.max(1, Math.min(5, S.annee || 1));
  const iCourant = PAS.findIndex((x) => x[0] === pasCourant);
  /* L'année du jeu court de juin à mai : on l'affiche comme une année
     scolaire, 2027-28, et non « An 1 » — c'est le repère de tout le monde. */
  const anLabel = (a) => `${2026 + a}\u2011${(2027 + a) % 100}`;
  let html = '<div class="frise-titre">Calendrier</div>';
  for (let a = 1; a <= 5; a++) {
    const etat = a < annee ? 'passe' : a === annee ? 'courant' : 'avenir';
    html += `<div class="frise-an ${etat}"><span class="num">${anLabel(a)}</span></div>`;
    if (a !== annee) continue;
    html += '<ol class="frise-pas">';
    PAS.forEach(([cle, mois, quoi], i) => {
      if (cle === 'juin' && annee > 1) return;
      const st = i < iCourant ? 'fait' : i === iCourant ? 'ici' : 'apres';
      /* Le mois seul, sauf pour l'étape courante : c'est la seule qui ait
         besoin d'être expliquée, et c'est ce qui rend la colonne lisible. */
      html += `<li class="${st}"><span class="mois">${mois}</span>${st === 'ici' ? `<span class="quoi">${quoi}</span>` : ''}</li>`;
    });
    html += '</ol>';
  }
  if (fini) html += `<div class="frise-an courant"><span class="num">Bilan</span><span class="civ">${S.fin && S.fin.type === 'mandat_complet' ? 'mai 2032' : 'fin de mandat'}</span></div>`;
  f.innerHTML = html;
}

function rendre(q) {
  ETAT.dateLabel = dateDe(q);
  ETAT.typeEcran = q.type;
  const [pas, ic] = situer(q);
  ETAT.picto = ic;
  majFrise(pas);
  ETAT.rentreeRatee = ETAT.s.journal.some((e) => e.cat === 'rentree' && e.annee === ETAT.s.annee && e.texte.includes('dégradée'));
  majHud();
  if (q.type === 'nomination') ecranNomination();
  else if (q.type === 'doctrine') ecranDoctrine();
  else if (q.type === 'reperes') ecranReperes(q);
  else if (q.type === 'avance') ecranAvance(q);
  else if (q.type === 'entretien') ecranEntretien(q);
  else if (q.type === 'profil') ecranProfil(q);
  else if (q.type === 'intention') ecranIntention(q);
  else if (q.type === 'affaire') ecranAffaire(q);
  else if (q.type === 'polemique') ecranPolemique(q);
  else if (q.type === 'livraison') ecranLivraison(q);
  else if (q.type === 'plateau') ecranPlateau(q);
  else if (q.type === 'retrait') ecranRetrait(q);
  else if (q.type === 'dossier') ecranDossier(q);
  else if (q.type === 'audience') ecranAudience(q);
  else if (q.type === 'lettrePlafond') ecranBercy(q);
  else if (q.type === 'rentree') ecranRentree(q);
  else if (q.type === 'carteScolaire') ecranCarteScolaire(q);
  else if (q.type === 'mesures') ecranAtelier(q);
  else if (q.type === 'etape') ecranEtape(q.etape);
}

function suivant(rep) {
  ETAT.pas.push(rep === undefined ? null : rep);
  sauvegarder();
  const res = ETAT.gen.next(rep);
  if (res.done) { const B = bilan(ETAT.s); majHud(); ETAT.picto = 'drapeau'; majFrise('fin'); ecranBilan(B); return; }
  rendre(res.value);
}

function sauvegarder() {
  try { localStorage.setItem(CLE_SAUVE, JSON.stringify({ graine: ETAT.graine, pas: ETAT.pas })); } catch (e) { /* stockage indisponible : on joue sans filet */ }
}

/* La revanche : rejouer la même partie, mêmes tirages, avec la doctrine
   inversée. C'est la démonstration la plus forte du jeu : que le désaccord
   politique porte sur les priorités, pas sur les faits. Le hasard est fixé
   par la graine, seul le classement change. */
const CLE_REVANCHE = 'rue-de-grenelle-revanche';
function lireRevanche() {
  try { const r = JSON.parse(localStorage.getItem(CLE_REVANCHE) || 'null'); return r && r.graine ? r : null; } catch (e) { return null; }
}
function demarrer(sauve) {
  const rev = sauve ? null : lireRevanche();
  ETAT.revanche = rev;
  ETAT.graine = sauve ? sauve.graine : rev ? rev.graine : (Math.floor(Math.random() * 2 ** 31) || 1);
  CAST.journal = JOURNAUX[ETAT.graine % JOURNAUX.length];
  ETAT.s = creerPartie({ graine: ETAT.graine, politique: null });
  ETAT.gen = derouler(ETAT.s);
  ETAT.pas = [];
  ETAT.journalLu = 0;
  let res = ETAT.gen.next();
  if (sauve && Array.isArray(sauve.pas)) {
    for (const p of sauve.pas) {
      if (res.done) break;
      ETAT.pas.push(p);
      ETAT.journalLu = ETAT.s.journal.length;
      res = ETAT.gen.next(p === null ? undefined : p);
    }
    ETAT.journalLu = Math.max(0, ETAT.s.journal.length - 6);
  }
  if (res.done) { const B = bilan(ETAT.s); majHud(); ecranBilan(B); return; }
  rendre(res.value);
}

$('#comprendre-btn').onclick = ouvrirComprendre;
$('#comprendre-fermer').onclick = fermerComprendre;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#comprendre').hidden) fermerComprendre(); });

(function initialiser() {
  $('#comprendre-btn').hidden = false;
  let sauve = null;
  try { sauve = JSON.parse(localStorage.getItem(CLE_SAUVE) || 'null'); } catch (e) { sauve = null; }
  if (sauve && !(sauve.graine && Array.isArray(sauve.pas))) sauve = null;
  ecranAccueil(sauve);
})();
