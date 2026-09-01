/* ============================================================================
   RUE DE GRENELLE — application (interface)
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
   hebdos et la presse syndicale — chacun avec sa manière de dire la même
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
  /* presse spécialisée éducation — celle que lisent les personnels */
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
    'Uniforme, autorité, fondamentaux. Trois mots que la rue de Grenelle a rayés du dictionnaire — probablement lors d’un allègement des programmes.',
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
   (35 + 25 + 20). Les deux autres continuent d'être tenus — ils comptent dans le
   score et réapparaissent au bilan — mais ne sont pas sous les yeux. Un ministre
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
   l'écran — c'était le reproche : trop de compteurs —, elles se signalent
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
     les autres attendront l'année suivante — ou ne viendront jamais. */
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
function docu(type, titre, dateLabel) {
  const d = el('article', 'doc');
  d.appendChild(el('div', 'entete-doc', `<span class="type">${type}</span><span class="date">${dateLabel || ETAT.dateLabel || ''}</span>`));
  if (titre) d.appendChild(el('h2', '', titre));
  return d;
}

/* --- accueil --------------------------------------------------------------- */
function ecranAccueil(sauvegarde) {
  const a = el('div', 'accueil');
  a.innerHTML = `
    <div class="tampon"><div class="rf">RÉPUBLIQUE FRANÇAISE</div><div style="font-size:.62rem;letter-spacing:.18em">MINISTÈRE DE L'ÉDUCATION NATIONALE</div></div>
    <h1>Rue de Grenelle</h1>
    <p class="devise">Vous êtes ministre de l'Éducation nationale. Cinq rentrées, cinq budgets, 1,2 million d'agents, 12 millions d'élèves — et une durée moyenne dans le poste de deux ans. Finir sera déjà une performance.</p>`;
  const actions = el('div', 'actions'); actions.style.justifyContent = 'center';
  if (sauvegarde) {
    const rep = el('button', 'btn', 'Reprendre la partie en cours');
    rep.onclick = () => demarrer(sauvegarde);
    actions.appendChild(rep);
    const neuf = el('button', 'btn sec', 'Nouveau mandat');
    neuf.onclick = () => { localStorage.removeItem(CLE_SAUVE); demarrer(null); };
    actions.appendChild(neuf);
  } else {
    const go = el('button', 'btn', 'Prendre vos fonctions — juin 2027');
    go.onclick = () => demarrer(null);
    actions.appendChild(go);
  }
  a.appendChild(actions);
  a.appendChild(el('p', 'avertissement', 'Jeu pédagogique indépendant, sans lien avec le ministère de l’Éducation nationale. Les ordres de grandeur viennent de sources publiques (DEPP, PLF, OCDE, CSEN, EEF) ; chaque mesure cite ses porteurs réels et le niveau de preuve de son effet. Le jeu ne dit jamais qu’une doctrine est la bonne — il vous laisse en répondre.'));
  scene(a);
}

/* --- la nomination : on vous propose Grenelle -------------------------------- */
function ecranNomination() {
  const d = docu('Appel de Matignon', 'On vous propose la rue de Grenelle', 'juin 2027');
  d.classList.add('papier');
  d.appendChild(el('p', 'chapo', 'Le gouvernement se forme. Votre téléphone sonne : le portefeuille proposé est l’Éducation nationale — le premier budget de l’État — 65,3 milliards d’euros au projet de loi de finances qui s’annonce, 1,2 million d’agents, 12 millions d’élèves. La durée moyenne dans le poste dépasse rarement deux ans.'));
  d.appendChild(el('div', 'note-passation',
    'Votre prédécesseur, huitième en quatre ans, laisse un mot : « Tout est dans les dossiers. Les dossiers sont dans les cartons. Les cartons sont au garde-meuble, la DGESCO sait lequel. Méfiez-vous de juillet, de septembre et de janvier — le reste de l’année est calme, sauf le reste de l’année. Bonne chance.'
    + '<span class="ps">P.-S. — La photocopieuse du deuxième est en panne depuis 2019. C’est le dossier le plus consensuel du ministère : ne le réglez pas, il fédère. »</span>'));
  d.appendChild(el('p', '', 'Vous acceptez. L’Élysée vous recevra dans l’heure — trois questions, pour vérifier que votre nomination ne coûtera rien au Président.'));
  const act = el('div', 'actions');
  const ok = el('button', 'btn tamponner', 'Accepter le ministère');
  ok.onclick = () => suivant('accepter');
  act.appendChild(ok);
  d.appendChild(act);
  scene(d);
}

/* --- votre feuille de route : le classement que VOUS déclarez ---------------- */
function ecranDoctrine() {
  const ordre = Object.keys(NOMS_C);
  const d = docu('Conférence de presse — prise de fonction', 'Votre feuille de route, devant témoins', 'juin 2027');
  d.appendChild(el('p', 'chapo', 'Premier acte du mandat : classer les cinq compteurs du quinquennat par ordre de priorité. Aucune priorité n’est neutre — chacune est au cœur de projets politiques réellement débattus, et la presse le relèvera dès demain. Surtout : <b>c’est sur VOTRE ordre que votre bilan sera noté</b> (35 / 25 / 20 / 12 / 8). Vous serez jugé contre votre propre parole, et rien d’autre.'));

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
    'Un dernier point, technique et lourd de conséquences : <b>votre tableau de bord n’affichera que vos trois premiers compteurs</b>, ceux qui pèsent 80 % de votre note. Les deux derniers seront tenus sans être montrés. Vous les retrouverez au bilan, et le cabinet vous alertera s’ils décrochent vraiment. C’est ainsi que fonctionne un ministère : on suit ce qu’on a dit qu’on suivrait, et on découvre le reste dans la presse.'));
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
  const d = docu('Lettre plafond — Matignon / Bercy', 'Le cadrage de votre prochain budget');
  d.appendChild(el('p', 'chapo', `${CAST.bercy} vous adresse la lettre plafond. ${tons[p.ton]}`));
  d.appendChild(el('div', 'depeche',
    `OBJET : plafonds 2e circulaire budgétaire<br>
     SCHÉMA D’EMPLOIS EXIGÉ : <b>${fmt0(p.schemaEmplois)} ETP</b><br>
     MARGE EN MESURES NOUVELLES : <b>${fmt0(p.marge * 1000)} M€</b> (crédit Bercy : ${fmt0(S.creditBercy)}/100)<br>
     RAPPEL : toute dépense pérenne engage vos successeurs. Les nôtres aussi.`));
  const opts = el('div', 'opts');
  const acc = el('button', 'opt', `<b>Accepter le cadrage</b><span class="det">Vous gardez vos munitions politiques pour janvier. Bercy note votre esprit de responsabilité, ce qui ne coûte rien à Bercy.</span>`);
  acc.onclick = () => suivant('accepter');
  const con = el('button', 'opt', `<b>Contester et porter l’arbitrage à Matignon</b><span class="det">Coût : 12 points de capital politique (il vous en reste ${fmt0(S.capital)}). Chances de gagner : moyennes, et décroissantes avec l’usage. Un ministre qui menace trop souvent finit par ne plus être craint, seulement remplacé.</span>`);
  con.onclick = () => suivant('contester');
  opts.append(acc, con); d.appendChild(opts);
  scene(d);
}

/* --- septembre (an 2) : la polémique qui s'installe -------------------------- */
function ecranPolemique(q) {
  const p = q.polemique;
  const d = docu('Rentrée — la question qui occupe l’antenne', esc(p.titre));
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
  d.appendChild(el('p', 'note-passation', 'Aucune de ces réponses ne fait bouger un compteur d’acquis. Elles décident seulement de combien de semaines vous parlerez d’autre chose que d’école — et devant qui vous aurez raison.'));
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
  const d = docu('Livraison internationale — 11 heures', esc(L.titre));
  d.appendChild(el('p', 'chapo', fr(L.recit)));
  d.appendChild(serieNiveaux());
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
  const d = docu('Journal de 20 heures — plateau', esc(P.titre));
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
    zone.appendChild(el('p', 'note-passation', 'Onze minutes. Sur les six causes documentées de chute d’un ministre de l’Éducation, une seule relève de la politique éducative — les cinq autres ressemblent à ce que vous venez de vivre.'));
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
  const d = docu('Revue de presse — affaire personnelle', esc(a.manchette));
  d.classList.add('papier');
  d.appendChild(el('p', 'chapo', fr(a.recit)));
  if (q.resonne) {
    d.appendChild(el('div', 'bandeau-neuf',
      '<b>Le calendrier n’est pas un hasard.</b> Le dossier ressort au moment précis où vous légiférez sur le même sujet. Une polémique personnelle n’est presque jamais fatale en elle-même : elle le devient quand elle donne à un procès politique déjà instruit sa preuve intuitive.'));
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
  d.appendChild(el('p', 'note-passation', `Votre crédibilité est aujourd’hui de <b>${fmt0(q.credibilite)}/100</b>. C’est elle qui décide de ce que valent vos annonces : à crédibilité effondrée, la meilleure mesure du catalogue ne porte plus. Aucune de ces réponses ne touche un compteur éducatif — et c’est bien le problème du métier.`));

  function finAffaire(i, r) {
    opts.querySelectorAll('.opt').forEach((n) => { n.disabled = true; });
    const box = el('div', 'decryptage');
    box.style.borderLeftColor = r.type === 'assumer' ? 'var(--c-sante)' : r.type === 'defendre' ? 'var(--c-budget)' : 'var(--rouge-rf)';
    box.innerHTML = `<div class="titre-d" style="color:${r.type === 'assumer' ? 'var(--c-sante)' : r.type === 'defendre' ? 'var(--c-budget)' : 'var(--rouge-rf)'}">La suite</div><p>${fr(r.suite)}</p>`
      + '<p style="font-size:.78rem;color:var(--encre-3);margin-top:8px">Une affaire médiatique n’est pas une culpabilité : une sur quatre se dégonfle — démentie, classée, ou close par un remboursement. Le coût politique, lui, reste à moitié encaissé. C’est vrai, et c’est ce que le public retient le plus mal.</p>';
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
  const d = docu('Élysée — entretien préalable', 'Trois questions avant votre nomination');
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
  const d = docu('Notice biographique — service de presse', 'D’où venez-vous ?');
  d.appendChild(el('p', 'chapo', 'Le service de presse a besoin de deux lignes pour les dépêches de demain. Ce que vous déclarez ne vous rend ni meilleur ni moins bon ministre — <b>aucun profil ne donne d’avantage sur les compteurs</b> — mais décide de ce que le corps enseignant attendra de vous, et de ce qu’on vous reprochera.'));
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
  const d = docu('Note du secrétariat général — négociation de gestion', 'Demander une rallonge à Bercy');
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
  d.appendChild(el('p', 'note-passation', 'Un refus ne vous coûte pas grand-chose sur le papier — 4 points de crédit et 3 de capital — mais il se sait, et le cabinet de Bercy a une bonne mémoire. Demander beaucoup rapporte beaucoup et échoue plus d’une fois sur deux.'));
  scene(d);
}

/* --- l'intention de restitution des postes ----------------------------------- */
function ecranIntention(q) {
  const d = docu('Conférence de presse — préparation de la rentrée', 'Que ferez-vous des postes que la démographie libère ?');
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
  d.appendChild(el('p', 'note-passation', 'Ne pas tenir cette parole en janvier coûte 16 points de crédit Bercy et 6 de capital politique. La tenir en rend 6. C’est le premier des cinq arbitrages de carte scolaire, et vous le prenez avant de savoir ce que la démographie vous donnera vraiment.'));
  scene(d);
}

/* --- rentrée ratée : la communication --------------------------------------- */
function ecranRentree() {
  const S = ETAT.s;
  const d = docu('Cellule de crise — rentrée', 'Des classes sans professeur, et un micro devant vous');
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
  const d = docu('Bordereau — carte scolaire & DHG', `Rentrée ${S.anneeCiv + 1} : le moment le plus conflictuel de l’année`);
  d.classList.add('large', 'papier');
  d.appendChild(el('p', 'chapo',
    `La démographie fait son œuvre : <b>${fmt0(Math.abs(q.baisse) * 1000)} élèves de moins</b> à la prochaine rentrée, soit ${fmt0(q.postesLiberables)} postes « libérables ». Bercy en exige ${fmt0(Math.abs(q.schemaDemande))}. Les maires, eux, exigent l’inverse. Les deux vous regardent.`));

  const meca = el('div', 'mecanisme');
  meca.innerHTML = `<div class="titre-d">Comment ça marche</div><ol>
    <li>La démographie baisse : des postes d’enseignants deviennent « libérables » sans dégrader l’encadrement actuel.</li>
    <li>Vous arbitrez : <b>rendre ces postes à Bercy</b> (crédit budgétaire pour vos mesures, mais fermetures de classes visibles, maires et salles des professeurs en colère) ou <b>les réinvestir</b> (moins d’élèves par classe, mais Bercy s’en souviendra en juillet).</li>
    <li>En juillet, Bercy compare ce que vous avez rendu à ce qu’il exigeait : c’est ce qui fixe votre marge de l’an prochain.</li></ol>`;
  d.appendChild(meca);

  let restitution = Math.min(q.restitutionMax, 0.4), prive = 0.5;
  const c1 = el('div', 'curseur');
  c1.innerHTML = `<label for="cur-rest">Postes rendus à Bercy ⟷ réinvestis dans l’encadrement</label>
    <div class="aide">${(S.historiqueRestitution && S.historiqueRestitution.length)
      ? 'Vos précédents : ' + S.historiqueRestitution.map((h) => `rentrée ${h.rentree}, ${h.pct} % rendus`).join(' ; ') + '. (Pour mémoire, avant vous : 4 % en 2025, 60 % en 2026.)'
      : 'Précédents réels : rentrée 2025, 4 % des postes libérés rendus ; rentrée 2026, 60 %. Les deux ministres ont affirmé faire « le choix de l’école ».'}</div>
    <input id="cur-rest" type="range" min="0" max="${q.restitutionMax}" step="0.05" value="${restitution}">
    <div class="lecture" id="lec-rest"></div>`;
  const c2 = el('div', 'curseur');
  c2.innerHTML = `<label for="cur-prive">Répartition de l’effort : épargner le privé sous contrat ⟷ le faire contribuer</label>
    <div class="aide">17 % des élèves, financement public à environ 73 %, IPS moyen très supérieur au public. Au-delà d’un certain point, le mot « Savary » réapparaît tout seul dans les dépêches.</div>
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
      : '<span style="color:var(--rouge-rf)">Le privé est mis à contribution frontale : provocation comptabilisée — à deux, la guerre scolaire s’arme.</span>';

    /* Les acteurs réagissent AVANT que vous ne signiez — mêmes formules que le moteur. */
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
      type: 'Prise de fonction — vos premières annonces',
      titre: 'Vos premières annonces',
      chapo: 'Vous n’attendez pas le prochain budget : la loi de finances votée par votre prédécesseur laisse une marge de redéploiement, et le pays regarde ce qu’un nouveau ministre fait de ses premiers jours. Deux annonces au maximum — au-delà, plus personne ne retient rien.',
    },
    rentree: {
      type: 'Circulaire de rentrée',
      titre: 'Que met-on dans la circulaire de rentrée ?',
      titreSuite: 'Une mesure, pas davantage : la circulaire de rentrée porte un message, pas un programme. Elle se finance par redéploiement — pas d’arbitrage interministériel en septembre.',
    },
    livraison: {
      type: 'Après la livraison — vos annonces de ce soir',
      titre: 'Trois mesures pour le niveau des élèves',
      chapo: 'Vous n’avez pas le choix d’annoncer : à 20 heures, on attend des mesures. Vous avez le choix de celles-ci. Selon les familles de mesures retenues, la salle des professeurs applaudira, haussera les épaules, ou déposera un préavis pour le printemps.',
    },
    janvier: {
      type: 'L’atelier — l’arbitrage de janvier',
      titre: 'Que portez-vous cette année ?',
      chapo: 'Le moment où le budget de l’année se transforme en décisions. Jusqu’à trois annonces, et le seul moment où vous pouvez arracher un arbitrage interministériel pour dépasser votre enveloppe.',
    },
  };
  const MOM = MOMENTS[q.moment] || MOMENTS.janvier;

  const d = el('article', 'doc large');
  d.appendChild(el('div', 'entete-doc', `<span class="type">${MOM.type}</span><span class="date">${ETAT.dateLabel}</span>`));
  d.appendChild(el('h2', '', MOM.titre));
  d.appendChild(el('p', 'chapo', (MOM.chapo || MOM.titreSuite) + ' L’effet vitrine est chiffré : vous le verrez. L’effet réel ne l’est pas — seuls le niveau de preuve (🔒) et le délai sont connus, et vous découvrirez au bilan ce que vous avez produit. Rien ne s’applique sans les personnels.'));
  /* Le budget, en vrai : tout le mandat se joue dans un liseré. */
  const M = K.CADRAGE.missionHorsCAS;                       // 65,30 Md€ (plafond PLF 2027)
  const salaires = M * K.CADRAGE.partMasseSalariale;
  const engages = S.chargesRecurrentes;
  const libre = Math.max(0, q.tresor);
  const autres = Math.max(0, M - salaires - engages - libre);
  const pc = (x) => Math.max(0.35, (x / M) * 100).toFixed(2) + '%';
  const bb = el('div', 'budget-bloc');
  bb.innerHTML = `
    <div class="titre-b"><span>Le budget du ministère — premier budget de l'État</span><b>${fmt1(M)} Md€/an</b></div>
    <div class="budget-barre" aria-hidden="true">
      <i class="salaires" style="width:${pc(salaires)}"></i><i class="autres" style="width:${pc(autres)}"></i><i class="engage" style="width:${pc(engages)}"></i><i class="libre" style="width:${pc(libre)}"></i>
    </div>
    <div class="budget-legende">
      <span><i class="puce salaires" style="background:var(--filet)"></i>masse salariale <b>${fmt1(salaires)} Md€</b> (intouchable : ce sont 1,2 M d'agents)</span>
      <span><i class="puce" style="background:var(--filet-fort)"></i>dépenses déjà engagées</span>
      <span><i class="puce" style="background:var(--c-paix)"></i>vos mesures passées <b>${fmt0(engages * 1000)} M€/an</b> (à vie — l'effet cliquet)</span>
      <span><i class="puce" style="background:var(--c-sante)"></i>votre marge cette année <b>${fmt0(libre * 1000)} M€</b></span>
    </div>
    <div class="budget-legende" style="margin-top:6px"><span>Le liseré vert est tout ce que vous pouvez décider cette année : <b>${fmt1((libre / M) * 100)} %</b> du budget. Chaque mesure pérenne le réduit pour toujours — pour vous et vos successeurs.</span></div>`;
  d.appendChild(bb);

  if ((q.nouveaux || []).length) {
    /* On n'annonce que ce que le joueur voit réellement dans le menu : les
       autres dossiers ouverts attendront leur tour de rotation. */
    const ici = q.nouveaux.map((id) => PAR_ID[id]).filter((c) => c && q.dispo.includes(c));
    const ailleurs = q.nouveaux.length - ici.length;
    if (ici.length) {
      d.appendChild(el('div', 'bandeau-neuf',
        `<b>${ici.length} dossier${ici.length > 1 ? 's remontent' : ' remonte'} sur votre bureau.</b> Le catalogue ne vous est pas remis en entier le premier jour : un ministre découvre son ministère au fil des rapports, des indicateurs et des crises. ${ici.map((c) => `« ${esc(c.label)} »`).join(', ')}.`
        + (ailleurs ? ` ${ailleurs} autre${ailleurs > 1 ? 's se sont ouverts' : ' s’est ouvert'} en coulisse : ${ailleurs > 1 ? 'ils arriveront' : 'il arrivera'} dans un prochain menu.` : '')));
    }
  }

  d.appendChild(el('div', 'legende-cadenas', '<b>Échelle de preuve</b> (d’après le Teaching &amp; Learning Toolkit de l’EEF) — 🔒🔒🔒🔒🔒 : plus de 90 études concordantes, l’effet tiré reste proche de l’annonce (±20 %) · 🔒🔒🔒 : preuve correcte, l’effet peut aller de la moitié au double · 🔒 : quasi aucune évaluation, l’effet peut aller du négatif au triple. Un cadenas n’est pas un jugement : c’est la largeur de votre pari.'));

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
        : '<span class="neg">hors enveloppe — impossible sans arbitrage budgétaire (janvier)</span>') : '',
    ].filter(Boolean).map((x) => `<span>${x}</span>`).join('');
    const tropCher = !q.depassementAutorise && cout > enveloppe;
    const tropDeCapital = pol > capital;
    valider.disabled = tropCher || tropDeCapital || selection.size > q.maxAnnonces;
    valider.textContent = tropCher ? `Dépasse l’enveloppe de ${fmt0((cout - enveloppe) * 1000)} M€ — retirez une mesure`
      : tropDeCapital ? 'Capital politique insuffisant — retirez une mesure'
      : selection.size ? `Annoncer ${selection.size} mesure${selection.size > 1 ? 's' : ''}`
      : (q.moment === 'janvier' ? 'Ne rien annoncer cette année' : 'Passer — ne rien annoncer');
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
      <div class="plie">Porté par : ${c.porteurs.map(esc).join(' · ')}</div>`;

    /* --- corps, déplié à la demande --- */
    const corps = el('div', 'corps');
    corps.innerHTML = `
      ${c.contre ? `<div class="porteurs">Contre : ${c.contre.map(esc).join(' · ')}</div>` : ''}
      <div class="chiffres">
        ${c.coutETP ? `<span>${fmt0(c.coutETP)} ETP</span>` : ''}
        <span class="${vit.parents >= 0 ? 'pos' : 'neg'}">parents ${signe(vit.parents)}</span>
        <span class="${vit.enseignants >= 0 ? 'pos' : 'neg'}">enseignants ${signe(vit.enseignants)}</span>
        <span class="${vit.presse >= 0 ? 'pos' : 'neg'}">presse ${signe(vit.presse)}</span>
        ${vc.map(([cc, v]) => `<span class="image">image ${NOMS_C[cc]} ${signe(v)}</span>`).join('')}
      </div>
      ${vc.length ? '<div class="note-image">« Image » : l’indicateur affiché bouge tout de suite — puis l’effet s’estompe d’un quart par an et ne compte pas au bilan. Seuls les effets réels (🔒, différés) comptent.</div>' : ''}
      <div class="reels">${(c.reel || []).map((e) => `<div class="ligne"><span class="verrous">${'🔒'.repeat(e.cadenas)}${'·'.repeat(5 - e.cadenas)}</span><span>Effet réel sur <b>${NOMS_C[e.compteur]}</b>, vers l’an +${e.delai}</span></div><div class="src">${esc(e.source)}</div>`).join('')}
      ${c.parametrique === 'revalorisation' ? '<div class="ligne"><span class="verrous">🔒🔒🔒··</span><span>Montant, instrument et cible se règlent après sélection — tout est chiffré en direct</span></div>' : ''}</div>
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
        /* 1. Le montant, au curseur — tout le reste en découle. */
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
  const d = docu('L’été des cent jours — dossier de crise', dos.titre, 'été 2027');
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
  const { org, audience } = q;
  const d = docu('Audience — rentrée sociale', `Face à face : ${org.nom}`);
  d.appendChild(el('p', 'chapo', `L’organisation majoritaire du moment (${fmt1(org.poids)} % aux dernières élections professionnelles, profil : ${PROFILS_L[org.profil]}) est reçue rue de Grenelle. Sa délégation s’assoit, ouvre un parapheur, et pose UNE question :`));
  d.appendChild(el('div', 'note-passation', fr(audience.question(ETAT.s))));
  d.appendChild(el('p', '', '<span style="font-size:.82rem;color:var(--encre-2)">Il n’y a pas de bonne réponse dans l’absolu — il y a une bonne réponse à <b>ce</b> profil-là. La fermeté rassure l’opinion, la méthode paie selon l’interlocuteur, la concession paie partout… et se paie à Bercy.</span>'));
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
  const d = docu('Audience — la revendication', `${org.nom} exige un retrait`);
  d.classList.add('papier');
  d.appendChild(el('div', 'note-passation', `« Venons-en au fond. Nous demandons le retrait de <b>« ${esc(carte.label)} »</b>. Nos instances sont mandatées. Votre réponse, monsieur le ministre ? »`));
  d.appendChild(el('p', '', `<span style="font-size:.85rem;color:var(--encre-2)">Céder retire réellement la mesure du jeu : ses ${fmt0(mesure.cout * 1000)} M€/an reviennent à votre marge, mais ses effets encore à venir sont annulés — et si c'était une priorité présidentielle, l'Élysée l'apprendra par communiqué syndical.</span>`));
  const opts = el('div', 'opts');

  const bMaintenir = el('button', 'opt', `<b>Maintenir la mesure</b>
    <span class="det">« Cette mesure a été décidée, elle sera appliquée. » Capital +2, adhésion en baisse.</span>
    <span class="risque-ligne">Risque de grève : <b style="color:${combatif && risque ? 'var(--rouge-rf)' : 'var(--ok)'}">${combatif && risque ? '~' + fmt1(risque.tauxMinistere) + ' % de grévistes (préavis probable)' : 'contenu — le profil de l’organisation ne s’y prête pas'}</b></span>`);
  bMaintenir.onclick = () => finRetrait('maintenir');
  const bCeder = el('button', 'opt', `<b>Céder — retirer la mesure</b>
    <span class="det">Adhésion en hausse, ${fmt0(mesure.cout * 1000)} M€/an récupérés · capital −4, fatigue +15, parents déçus — et les effets attendus de la mesure ne viendront jamais.</span>
    <span class="risque-ligne">Risque de grève : <b style="color:var(--ok)">désamorcé</b></span>`);
  bCeder.onclick = () => finRetrait('ceder');
  const bRequal = el('button', 'opt', `<b>Requalifier — la renommer et la rendre facultative</b>
    <span class="det">Ni retrait ni maintien : la mesure change de nom, cesse d’être obligatoire, et ses crédits restent inscrits. L’annonce est sauvée, le dispositif se vide. Capital −2, fatigue +5, adhésion en légère hausse — et les ${fmt0(mesure.cout * 1000)} M€/an continuent d’être dépensés.</span>
    <span class="risque-ligne">Risque de grève : <b style="color:var(--ok)">désamorcé</b> · effet réel : <b style="color:var(--rouge-rf)">vous le découvrirez au bilan</b></span>`);
  bRequal.onclick = () => finRetrait('requalifier');
  opts.append(bMaintenir, bRequal, bCeder);
  d.appendChild(opts);

  function finRetrait(dec) {
    opts.querySelectorAll('.opt').forEach((n) => { n.disabled = true; });
    const box = el('div', 'decryptage');
    box.style.borderLeftColor = dec === 'ceder' ? 'var(--c-sante)' : dec === 'requalifier' ? 'var(--c-budget)' : 'var(--rouge-rf)';
    box.innerHTML = dec === 'ceder'
      ? `<div class="titre-d" style="color:var(--c-sante)">Vous cédez</div><p><i>« Nous saluons un ministre qui sait entendre. »</i> — La mesure sort du droit. La presse titrera sur le recul ; les salles des professeurs, sur l’écoute. Les deux auront raison.</p>`
      : dec === 'requalifier'
      ? `<div class="titre-d" style="color:var(--c-budget)">Vous requalifiez</div><p><i>« Nous prenons acte de cet ajustement de méthode. »</i> — Personne ne parlera de recul : le dispositif existe toujours, il porte simplement un autre nom et ne s’impose plus à personne. C’est le geste le moins coûteux de tout le jeu, et le seul dont vous ne mesurerez le prix qu’à la dernière page.</p>`
      : `<div class="titre-d" style="color:var(--rouge-rf)">Vous maintenez</div><p><i>« Nous en tirerons les conséquences. »</i> — ${combatif ? 'La délégation quitte l’audience. Le préavis sera déposé avant la fin de semaine.' : 'La délégation transmettra à ses instances. Le rapport de force est noté, de part et d’autre.'}</p>`;
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
      sc.appendChild(el('div', 'titre-d', 'Scellés ouverts cette année — les effets réels arrivent'));
      for (const e of ouverts) {
        const c = PAR_ID[e.carte];
        sc.appendChild(el('div', 'ligne-s', `<span>${esc(c ? c.label : e.carte)}${e.requalifie ? '<span class="requal">requalifiée</span>' : ''}</span><span>→ ${NOMS_C[e.compteur]}</span>
          <span class="val" style="color:${e.montant > 1 ? 'var(--ok)' : e.montant < -1 ? 'var(--alerte)' : 'var(--encre-2)'}">${signe(e.montant)}</span>
          <span style="color:var(--encre-3);font-size:.76rem">preuve ${'🔒'.repeat(e.cadenas)} · documenté ~${signe(e.central)}${e.requalifie ? ' · rendue facultative' : ''}</span>`));
      }
      sc.appendChild(el('p', '', '<span style="font-size:.76rem;color:var(--encre-3)">Ce que vous aviez signé sous incertitude entre aujourd’hui dans les compteurs — implémentation comprise. Les scellés restants s’ouvriront plus tard, certains après vous.'
        + (ouverts.some((e) => e.requalifie) ? ' Les lignes marquées « requalifiée » sont les mesures que vous avez rendues facultatives sous pression : elles ont continué d’être financées et ont produit moins d’un cinquième de ce qu’elles promettaient.' : '')
        + '</span>'));
      blocs.push(sc);
    }
  }

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
    rentree: 'La rentrée est passée. Ou l’inverse.',
    decembre: 'Budget voté, publications de décembre.',
    mars: 'Les mobilisations de printemps.',
    cloture: `Fin de l’année scolaire — an ${S.annee} sur 5.`,
  }[etape] || '';
  scene(...blocs, j, fil);
  boutonSuite('Continuer', ctx, () => suivant(undefined));
}

/* --- bilan final -------------------------------------------------------------- */
function ecranBilan(B) {
  const S = ETAT.s;
  localStorage.removeItem(CLE_SAUVE);
  const fins = {
    mandat_complet: ['CINQ ANS RUE DE GRENELLE : IL PART DEBOUT', 'Aucun ministre de l’Éducation n’avait tenu un quinquennat entier depuis fort longtemps. Le déménageur est déçu.'],
    renvoi: ['REMANIÉ', 'Trois convocations à Matignon font une porte. Vos cartons connaissaient le chemin.'],
    remaniement: ['REMANIEMENT SURPRISE : LA COLONNE D’À CÔTÉ', 'Rien de personnel. Votre nom équilibrait un tableau qui ne vous concernait pas.'],
    guerre_scolaire: ['GUERRE SCOLAIRE : LE TEXTE RETIRÉ, LE MINISTRE AUSSI', 'Un million de personnes dans la rue. Comme en 1984, à la mode près.'],
  }[B.fin.type] || ['FIN DE MANDAT', ''];

  const j = el('article', 'journal');
  j.innerHTML = `<div class="manchette"><span class="titre-j">${CAST.journal}</span><span class="ours">édition spéciale · héritage</span></div>
    <h2 class="une">${fins[0]}</h2><p class="sous-une">${fins[1] || esc(B.fin.texte)}</p>`;

  const d = el('article', 'doc large');
  d.appendChild(el('div', 'entete-doc', `<span class="type">Le bilan — la vérité, enfin</span><span class="date">${B.anneesJouees} an${B.anneesJouees > 1 ? 's' : ''} de mandat</span>`));

  const sc = el('div', 'score-final');
  const bloc = (val, lib, note) => { const b = el('div', 'score-bloc', `<div class="val">${fmt0(val)}<span style="font-size:.9rem;color:var(--encre-2)">/100</span></div><div class="lib">${lib}</div>${note ? `<div style="font-size:.72rem;color:var(--encre-2);margin-top:4px">${note}</div>` : ''}`); return b; };
  sc.append(
    bloc(B.scoreAffiche, 'Ce que le pays a vu', 'les indicateurs à votre départ'),
    bloc(B.scoreBilan, 'Ce que vous avez fait', 'les effets réels, pondérés par VOTRE doctrine'),
    bloc(B.scoreProjection, 'Dans dix ans',
      B.constance ? 'si votre successeur tient votre cap — et il le peut'
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
  d.appendChild(el('p', 'bilan-note', `Les deux derniers compteurs de votre doctrine (${caches.map((c) => NOMS_C_LONGS[c].toLowerCase()).join(' et ')}) n’ont jamais été affichés sur votre tableau de bord : vous les aviez classés quatrième et cinquième. Ils étaient tenus quand même, et ils valent ${K.POIDS_DOCTRINE[3] + K.POIDS_DOCTRINE[4]} % de votre note.`));

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
        : '<li>Aucun de vos effets n’arrive après vous : tout ce que vous avez engagé a produit — ou non — pendant votre mandat.</li>',
      `<li>Les effets « d’image » vus en cours de mandat n’apparaissent nulle part ici : ils se sont évaporés, comme prévu. Seuls comptent les effets réels, tirés sous incertitude et multipliés par l’implémentation.</li>`,
    ].filter(Boolean).join('');
    d.appendChild(syn);
  } else {
    d.appendChild(el('p', 'chapo', 'Aucune mesure engagée. Le système vous remercie du repos ; l’Histoire, moins.'));
  }

  const det = el('details', 'bilan-detail');
  det.innerHTML = '<summary>Le détail, mesure par mesure</summary>';
  const t2 = el('div', 'defile');
  let lignes = '';
  for (const [id, effs] of parCarte) {
    lignes += effs.map((e, i) => `<tr>${i === 0 ? `<td rowspan="${effs.length}">${esc(nom(id))}</td>` : ''}
      <td>${NOMS_C[e.compteur]}</td>
      <td class="num">${signe(e.central)} <span title="niveau de preuve">${'🔒'.repeat(e.cadenas)}</span></td>
      <td class="num"><span class="revele ${e.montant > 1 ? 'bon' : e.montant < -1 ? 'mauvais' : ''}">${signe(e.montant)}</span></td>
      <td>${e.retire ? '<span style="color:var(--rouge-rf)">retirée — effet annulé</span>' : e.applique ? 'effet arrivé' : `arrive an ${e.anneeArrivee}${e.anneeArrivee > B.anneesJouees ? ' — après vous' : ''}`}</td></tr>`).join('');
  }
  t2.innerHTML = `<table class="bilan"><tr><th>Mesure</th><th>Compteur</th><th class="num">Effet documenté</th><th class="num">Effet obtenu</th><th>Horizon</th></tr>${lignes || '<tr><td colspan="5">Aucune mesure engagée.</td></tr>'}</table>`;
  det.appendChild(t2);
  det.appendChild(el('p', 'bilan-note', 'Effet documenté : la valeur centrale trouvée dans la littérature, que vous ne voyiez pas au moment de signer — vous n’aviez que les cadenas, le niveau de preuve. Effet obtenu : ce tirage-là, multiplié par votre facteur d’implémentation et par la capacité d’absorption du système.'));
  d.appendChild(det);

  /* --- doctrine déclarée vs menée --- */
  d.appendChild(el('p', 'bilan-final', `<b>Doctrine déclarée contre doctrine menée :</b> ${fmt0((B.coherence || 0) * 100)} % de vos effets réels servent vos deux priorités annoncées${B.constance ? ', cap tenu : vos gains composeront.' : ', cap non tenu : un successeur détricote, et les dérives reprennent.'}
    <br>${B.greves} journée${B.greves > 1 ? 's' : ''} de grève · fatigue réformatrice ${fmt0(B.fatigue)}/100 · ${B.abandons} mesure${B.abandons > 1 ? 's' : ''} retirée${B.abandons > 1 ? 's' : ''} sous la pression.`));

  const act = el('div', 'actions');
  const rejouer = el('button', 'btn', 'Nouveau mandat (autres tirages, autres crises)');
  rejouer.onclick = () => { localStorage.removeItem(CLE_SAUVE); location.reload(); };
  act.appendChild(rejouer);
  d.appendChild(act);
  scene(j, d);
}

function verdictProse(B) {
  const v = B.vrai, ecartPerception = B.scoreAffiche - B.scoreBilan;
  if (B.fin.type === 'guerre_scolaire') return '« Il avait raison sur le fond », dira-t-on dans dix ans. C’est exactement ce qu’on a dit d’Alain Savary.';
  if (B.scoreBilan >= 55 && B.constance) return 'Vous laissez un système en meilleur état que vous ne l’avez trouvé, un cap lisible, et des effets qui composeront après vous. Dans ce ministère, cela porte un nom : une exception.';
  if (ecartPerception > 5) return 'Beau mandat, disent les sondages. Le bilan, lui, est plus discret : vous avez surtout gouverné le tableau de bord. Vos successeurs gouverneront le reste.';
  if (B.scoreBilan - B.scoreAffiche > 3) return 'Le pays ne vous a pas vu travailler — les indicateurs regardaient ailleurs, comme toujours, avec dix ans de retard. Vos successeurs inaugureront vos résultats. Ils y penseront très fort.';
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
   affichés mentent. Les COURBES, elles, ont le droit à une échelle resserrée —
   c'est l'usage pour une série temporelle — à condition que l'axe soit gradué
   et légendé, ce qu'il est ici. */
const md1 = (x) => x.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function serieBudget() {
  const max = 70, HP = 132;                        // graduation ronde, hauteur de tracé
  const grads = [0, 20, 40, 60];
  /* Valeurs et années sont dans leurs propres rangées, avec le même retrait à
     gauche et la même gouttière que les barres : rien ne peut se chevaucher. */
  const g = el('div', '');
  g.innerHTML = `
  <div class="rep-valeurs">${SERIE_BUDGET.map((b) => `<span>${md1(b.md)}</span>`).join('')}</div>
  <div class="rep-plot" role="img" aria-label="Budget de l’enseignement scolaire, de 52,3 milliards d’euros en 2019 à 65,3 milliards en 2027">
    ${grads.map((v) => `<i class="grad" style="bottom:${((v / max) * HP).toFixed(1)}px"><b>${v}</b></i>`).join('')}
    <div class="rep-cols">
      ${SERIE_BUDGET.map((b) => `<div class="col${b.prevision ? ' prev' : ''}">`
        + `<i class="bar" style="height:${((b.md / max) * HP).toFixed(1)}px"></i></div>`).join('')}
    </div>
  </div>
  <div class="rep-annees">${SERIE_BUDGET.map((b) => `<span>${b.annee}</span>`).join('')}</div>
  <div class="rep-lgd"><i class="c-bleu-bloc"></i>budget voté<i class="c-hachure"></i>plafond prévisionnel 2027<span class="unite">en milliards d’euros courants</span></div>
  <p class="rep-serie-note">Crédits de paiement de la mission « Enseignement scolaire », hors pensions. <b>L’échelle part de zéro</b> : la hausse est réelle mais modeste — +25 % en huit ans d’euros courants, soit à peu près l’inflation. 2021 n’est pas représentée, le périmètre de la mission ayant changé cette année-là.</p>`;
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
  niveaux: 'Lire la note, puis passer aux annonces',
};
function ecranReperes(q) {
  const cle = (q && q.note) || 'budget';
  const b = CADRAGE_INITIAL.find((x) => x.cle === cle) || CADRAGE_INITIAL[0];
  const rang = CADRAGE_INITIAL.findIndex((x) => x.cle === cle) + 1;
  const GRAPH = { budget: serieBudget, eleves: serieEleves, niveaux: serieNiveaux };

  const d = el('article', 'doc large');
  d.appendChild(el('div', 'entete-doc',
    `<span class="type">Note ${rang}/3 — direction générale de l’enseignement scolaire (DGESCO)</span><span class="date">${ETAT.dateLabel}</span>`));
  d.appendChild(el('h2', '', esc(b.titre)));

  const a = el('div', 'accroche');
  a.innerHTML = `<b>${fr(b.accroche.v)}</b><p>${fr(b.accroche.l)}${citer(b.accroche.src)}</p>`;
  d.appendChild(a);
  if (GRAPH[b.graphique]) d.appendChild(GRAPH[b.graphique]());
  d.appendChild(el('ul', 'rep-liste', b.chiffres.map((x) =>
    `<li><span class="v">${fr(x.v)}</span><span class="l">${fr(x.l)}.${citer(x.src)}</span></li>`).join('')));
  d.appendChild(el('p', 'cadrage-retenir', fr(b.aRetenir)));
  d.appendChild(el('p', 'note-passation',
    'Les huit autres fiches de référence sont à tout moment dans « Comprendre le jeu », en bas à gauche de l’écran. Cette note-ci appelle une décision : elle vous attend à l’écran suivant.'));

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
  <p class="rep-serie-note">Les personnages, les organisations syndicales et les titres de presse du jeu sont des pseudonymes transparents : la satire est symétrique, personne n’est épargné. En revanche, les propositions politiques citées sur les cartes sont réelles et attribuées à leurs auteurs, et tous les chiffres ci-dessus sont vérifiables aux adresses indiquées.</p>`;
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
  if (q.type === 'reperes') return 'juin 2027';
  if (q.type === 'avance') return 'juin 2027';
  if (q.type === 'entretien') return 'juin 2027';
  if (q.type === 'profil') return 'juin 2027';
  if (q.type === 'intention') return 'juin 2027';
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

function rendre(q) {
  ETAT.dateLabel = dateDe(q);
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
  if (res.done) { const B = bilan(ETAT.s); majHud(); ecranBilan(B); return; }
  rendre(res.value);
}

function sauvegarder() {
  try { localStorage.setItem(CLE_SAUVE, JSON.stringify({ graine: ETAT.graine, pas: ETAT.pas })); } catch (e) { /* stockage indisponible : on joue sans filet */ }
}

function demarrer(sauve) {
  ETAT.graine = sauve ? sauve.graine : (Math.floor(Math.random() * 2 ** 31) || 1);
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
