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

/* Version grand public : des mots de tous les jours. Les clés du moteur ne
   changent pas. */
const NOMS_C = { reussite: 'Niveau', egalite: 'Égalité', sante: 'Métier de prof', paix: 'Climat social', budget: 'Salaires' };
const NOMS_C_LONGS = {
  reussite: 'Le niveau des élèves', egalite: 'L’égalité des chances',
  sante: 'Le métier de prof', paix: 'Le climat social', budget: 'Les salaires',
};
/* Une jauge se lit d'abord en mots. Le nombre reste, en petit, pour qui le veut. */
const motJauge = (v) => v >= 70 ? 'bon' : v >= 55 ? 'correct' : v >= 40 ? 'fragile' : v >= 25 ? 'mauvais' : 'critique';
const COULEURS_C = { reussite: 'var(--c-reussite)', egalite: 'var(--c-egalite)', sante: 'var(--c-sante)', paix: 'var(--c-paix)', budget: 'var(--c-budget)' };
const FAMILLES = {
  moyens: ['Moyens & encadrement', 'var(--c-reussite)'],
  autonomie: ['Autonomie & évaluation', 'var(--c-budget)'],
  parcours: ['Parcours & orientation', 'var(--c-sante)'],
  autorite: ['Autorité & familles', 'var(--c-paix)'],
  mixite: ['Mixité & carte scolaire', 'var(--c-egalite)'],
  lycee: ['Lycée & lycéens', 'var(--c-violet)'],
  vie_lyceenne: ['Dans le lycée : la parole des élèves', 'var(--or)'],
  territoires: ['Territoires : qui reçoit quoi', 'var(--c-egalite)'],
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
  { a: 'Union des Lycéens Debout', p: '@ULDebout · syndicat lycéen, 10 milliards ou rien', quand: (s) => s.lyceens && s.lyceens.colere >= 45, posts: [
    'Le ministre a « entendu les lycéens ». Nous aussi on l’a entendu. On attend toujours de voir.',
    'Rappel : il manque un prof dans la moitié des lycées, il fait 32 °C en salle 204, et la plateforme nous dit « merci pour votre contribution ».',
    'On nous a donné une demi-journée de « temps lycéen ». On a fait les comptes : il nous reste 1 223 heures et demie.',
  ] },
  { a: 'Union des Lycéens Debout', p: '@ULDebout · syndicat lycéen, on juge sur pièces', quand: (s) => s.lyceens && s.lyceens.colere < 45, posts: [
    'Des dates, enfin. On les a imprimées. On viendra avec en septembre.',
    'Première fois qu’un ministre répond à une revendication sans dire « c’est la région ». On note.',
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
  pousser(a('blocus'), [
    ['Lycées bloqués : « on nous a promis, on attend encore »',
     'Les lycéens reprennent les mots de l’automne 2026. Le ministère rappelle qu’il « hérite » des promesses. Les lycéens rappellent qu’ils héritent des toilettes.'],
    ['Rentrée : des poubelles devant les grilles, un calendrier sur le bureau du ministre',
     'Le décompte des lycées « perturbés » tourne sur les chaînes d’information. Le décompte des travaux réalisés tourne moins.'],
  ]);
  pousser(a('lyceens') && !a('blocus'), [
    ['Rentrée : les lycéens « jugeront sur pièces »',
     'Les organisations lycéennes saluent des réponses et préviennent qu’elles ont gardé la liste. La liste est longue, mais elle est datée.'],
  ]);
  pousser(a('colere') && etape === 'automne', [
    ['Lycées : le nouveau ministre répond, colère par colère',
     'Neuf sujets, autant de décisions, et des organisations lycéennes qui « jugeront sur pièces ». Les pièces sont attendues à la rentrée.'],
    ['Automne de crise rue de Grenelle : des annonces, et une question',
     'La question est celle de tous les automnes : qui paiera, et quand. Le ministère répond « le budget 2027 ». Le budget 2027 n’a pas encore été voté.'],
  ]);
  pousser(a('colere') && etape === 'rentree', [
    ['« Chez nous et pas ailleurs » : la colère lycéenne change de forme',
     'Un an après l’automne 2026, les lycéens comparent. Les régions publient leurs plans bâti, les magazines leurs palmarès, le ministère rien du tout : la dépense de l’État par élève et par territoire n’existe dans aucun tableau.'],
  ]);
  pousser(etape === 'election', [
    ['Présidentielle : un nouveau gouvernement, et le même ministre de l’Éducation',
     'Une continuité rare rue de Grenelle. Les lycéens y voient une personne à qui l’on peut encore rappeler ses promesses.'],
  ]);
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
      p: `Ce compteur n’est pas affiché sur votre tableau de bord : vous l’avez classé n° ${rang + 1} de votre doctrine. Il est tenu quand même (${fmt0(d0)} à votre arrivée, ${fmt0(v)} aujourd’hui) et il vaut ${K.POIDS_DOCTRINE[rang]} % de votre bilan final.` });
  }
  return R;
}
/* ============================================================================
   LE NOYAU DES PAGES
   ----------------------------------------------------------------------------
   Règle de la refonte : un écran = une information + une décision (quatre
   choix au plus). Rien à dérouler. Ce qui éclaire la décision (chiffres,
   sources, ce que disent les études) est derrière un bouton : « demander une
   note à la DGESCO » ; ce qui détaille un choix est derrière le « i » du
   choix. Les choix, eux, sont politiques : ils dépendent de valeurs, pas de
   chiffres. Les chiffres disent ce qui est ; ils ne disent pas ce qu'il faut
   en faire.
   ========================================================================== */

const NOMS_COURTS = { reussite: 'Niveau', egalite: 'Égalité', sante: 'Métier', paix: 'Climat', budget: 'Salaires' };

/* --- le temps qui passe : de novembre 2026 à mai 2030 ------------------------ */
const MOIS_TOTAL = 42;
function moisDepuis(label) {
  const m = String(label || '').toLowerCase();
  const an = parseInt((m.match(/\d{4}/) || ['2026'])[0], 10);
  let idx = MOIS_L.findIndex((x) => m.includes(x));
  if (/été/.test(m)) idx = 6;
  if (idx < 0) idx = 10;
  return (an - 2026) * 12 + idx - 10;
}

/* --- le bandeau : la date, quatre pastilles, la progression ------------------- */
let repereAnnee = null;   // valeurs des compteurs à l'ouverture de l'année en cours
let hudPrecedent = {};    // dernière valeur affichée par compteur, pour signaler ce qui bouge
function majBandeau(fin) {
  const S = ETAT.s;
  $('#bandeau').hidden = false;
  $('#bd-date').textContent = ETAT.dateLabel || 'novembre 2026';
  if (!repereAnnee || repereAnnee.annee !== S.annee) repereAnnee = { annee: S.annee, v: { ...S.affiche } };
  const zone = $('#bd-chips'); zone.innerHTML = '';
  const ordre = S.doctrine || Object.keys(NOMS_C);
  const puce = (nom, mot, pct, coul, pulse, neg) => {
    const b = el('button', 'chip' + (pulse ? ' pulse' : '') + (neg ? ' neg' : ''));
    b.type = 'button';
    b.setAttribute('aria-label', `${nom} : ${mot}. Ouvrir le tableau de bord.`);
    b.innerHTML = `<span class="n">${esc(nom)}</span><b>${esc(mot)}</b><span class="rail"><u style="width:${Math.max(3, Math.min(100, pct))}%;background:${coul}"></u></span>`;
    b.onclick = ouvrirTableauDeBord;
    return b;
  };
  for (const c of ordre.slice(0, 3)) {
    const v = S.affiche[c];
    const pulse = hudPrecedent[c] !== undefined && fmt0(hudPrecedent[c]) !== fmt0(v);
    hudPrecedent[c] = v;
    zone.appendChild(puce(NOMS_COURTS[c], motJauge(v), v, COULEURS_C[c], pulse, v < 40));
  }
  if (S.lyceens) {
    const col = S.lyceens.colere;
    zone.appendChild(puce('Lycéens', humeurLyceenne(col).replace('au bord du blocus', 'bord du blocus'), col, 'var(--c-violet)', false, col >= K.LYCEENS.seuilBlocus));
  }
  const prog = fin ? 100 : Math.max(2, Math.min(100, (moisDepuis(ETAT.dateLabel) / MOIS_TOTAL) * 100));
  $('#bd-prog i').style.width = prog.toFixed(1) + '%';
  majAlertes(S);
}

/* Le tableau de bord complet : ce que le bandeau ne montre pas. */
function ouvrirTableauDeBord() {
  const S = ETAT.s;
  const z = el('div', 'tb');
  const ordre = S.doctrine || Object.keys(NOMS_C);
  z.appendChild(el('h3', '', 'Vos priorités annoncées'));
  const g = el('div', 'tb-jauges');
  ordre.forEach((c, i) => {
    const v = S.affiche[c], d = v - (repereAnnee ? repereAnnee.v[c] : v);
    const cache = i >= 3;
    g.appendChild(el('div', 'tb-j' + (cache ? ' cache' : ''), `<div class="l"><span><b>${i + 1}.</b> ${NOMS_C_LONGS[c]}</span><span><b>${cache ? 'non affiché' : motJauge(v)}</b>${cache ? '' : ` <small>${fmt0(v)}</small>`}</span></div>
      <div class="rail"><i style="width:${Math.max(2, Math.min(100, cache ? 0 : v))}%;background:${COULEURS_C[c]}"></i></div>
      <div class="s">${K.POIDS_DOCTRINE[i]} % de votre bilan${cache ? ' · tenu sans être affiché, vous le retrouverez au bilan' : Math.abs(d) > 0.5 ? ` · ${d > 0 ? '▲ +' : '▼ −'}${fmt1(Math.abs(d))} cette année` : ' · stable cette année'}</div>`));
  });
  z.appendChild(g);
  z.appendChild(el('h3', '', 'Ce qui décide de votre sort'));
  const lignes = [
    ['Soutien du gouvernement', fmt0(S.capital) + ' / 100', S.capital < 25, 'ce que vous pouvez dépenser en réformes'],
    ['Votre parole', fmt0(S.credibilite) + ' / 100', S.credibilite < 35, 'ce que valent vos annonces'],
    ['Crédit auprès de Bercy', fmt0(S.creditBercy) + ' / 100', S.creditBercy < 20, 'votre marge dans les arbitrages'],
  ];
  if (S.lyceens) lignes.push(['Lycéens', humeurLyceenne(S.lyceens.colere), S.lyceens.colere >= K.LYCEENS.seuilBlocus, 'au-delà d’un seuil, les lycées se bloquent à la rentrée']);
  z.appendChild(el('ul', 'tb-liste', lignes.map(([a, b, neg, c]) => `<li><span>${a}<small>${c}</small></span><b class="${neg ? 'neg' : ''}">${b}</b></li>`).join('')));
  if (alertesActives.length) {
    z.appendChild(el('h3', '', 'Alertes du cabinet'));
    for (const a of alertesActives) z.appendChild(el('div', 'alerte-hud', `<b class="t">${esc(a.titre)}</b><span>${a.texte}</span>`));
  }
  const plus = el('button', 'cta sec', 'Comprendre le jeu : toutes les fiches et leurs sources');
  plus.onclick = () => { fermerFeuille(); ouvrirComprendre(); };
  z.appendChild(plus);
  ouvrirFeuille({ kicker: 'Tableau de bord', titre: 'Où vous en êtes', corps: z });
}

/* Une alerte du cabinet ne s'affiche qu'une fois par mandat : un bandeau d'une
   ligne sous les pastilles, qui s'ouvre sur son explication. */
const alertesVues = new Set();
let alertesActives = [];
let anneeDerniereAlerte = -1;
function majAlertes(S) {
  alertesActives = alertesActives.filter((a) => a.annee === S.annee);
  if (alertesVues.size < 3 && S.annee !== anneeDerniereAlerte) {
    const r = reglesAlertes(S).find((x) => x.si && !alertesVues.has(x.cle));
    if (r) {
      alertesVues.add(r.cle);
      anneeDerniereAlerte = S.annee;
      alertesActives.push({ cle: r.cle, titre: r.t, texte: r.p, annee: S.annee });
    }
  }
  const z = $('#bd-alertes');
  z.hidden = alertesActives.length === 0;
  z.innerHTML = '';
  for (const a of alertesActives) {
    const b = el('button', 'alerte-bd', `<span aria-hidden="true">⚠</span> Alerte du cabinet`);
    b.title = a.titre;
    b.type = 'button';
    b.onclick = () => ouvrirFeuille({ kicker: 'Alerte du cabinet', titre: a.titre, corps: `<p class="pg-info">${a.texte}</p>` });
    z.appendChild(b);
  }
}

/* --- la feuille : ce qu'on ouvre quand on veut en savoir plus ---------------- */
let feuilleOrigine = null;
function ouvrirFeuille({ kicker, titre, corps }) {
  const f = $('#feuille');
  $('#fe-kicker').textContent = kicker || '';
  $('#fe-titre').textContent = titre || '';
  const c = $('#fe-corps'); c.innerHTML = '';
  const contenu = typeof corps === 'function' ? corps() : corps;
  if (typeof contenu === 'string') c.innerHTML = contenu; else if (contenu) c.appendChild(contenu);
  f.hidden = false;
  c.scrollTop = 0;
  feuilleOrigine = document.activeElement;
  $('#fe-fermer').focus();
  document.addEventListener('keydown', toucheFeuille);
}
function fermerFeuille() {
  const f = $('#feuille');
  if (f.hidden) return;
  f.hidden = true;
  document.removeEventListener('keydown', toucheFeuille);
  if (feuilleOrigine && feuilleOrigine.focus) { try { feuilleOrigine.focus({ preventScroll: true }); } catch (e) { /* sans importance */ } }
}
function toucheFeuille(e) { if (e.key === 'Escape') fermerFeuille(); }

/* --- la scène -------------------------------------------------------------- */
function scene(...blocs) {
  const sc = $('#scene'); sc.innerHTML = '';
  for (const b of blocs) sc.appendChild(b);
  sc.scrollTop = 0;
  ETAT.tScene = performance.now();
  /* La page déborde-t-elle ? On mesure la page elle-même, pas la scène : la
     petite animation d'entrée la décale de quelques pixels. */
  const deborde = () => {
    const pg = sc.firstElementChild;
    if (!pg) return 0;
    const interieur = sc.clientHeight - 24;      // la marge de la scène
    return pg.offsetHeight - interieur;
  };
  /* Les illustrations sont un bonus : si la page ne tient pas, elles cèdent la place. */
  for (const ill of sc.querySelectorAll('.pg-illus')) { if (deborde() > 2) ill.hidden = true; }
  /* Un contrôle pour les développeurs et le robot : une page qui déborde est
     une page à raccourcir. */
  requestAnimationFrame(() => {
    const deb = deborde();
    window.__debordements = window.__debordements || [];
    if (deb > 2) {
      const h = sc.querySelector('h2, h1');
      window.__debordements.push({ ecran: ETAT.typeEcran || '', titre: h ? h.textContent.slice(0, 60) : '', px: Math.round(deb) });
    }
  });
  const h = sc.querySelector('h2, h1');
  if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
}

/* --- la page : une information, une décision ---------------------------------- */
const tag = (t, cls) => `<span class="tg${cls ? ' ' + cls : ''}">${esc(t)}</span>`;

/* Un choix : le bouton principal, et le « i » quand il y a un détail. */
function noeudChoix(c, i, surChoix) {
  const aTags = !!(c.tags && c.tags.length);
  const d = el('div', 'ch' + (c.off ? ' off' : '') + (c.autre ? ' autre' : '') + (aTags ? ' ch-c' : ''));
  const b = el('button', 'ch-main');
  b.type = 'button';
  /* Un choix à étiquettes se lit en une ligne : son commentaire est derrière le « i ». */
  b.innerHTML = `<span class="ch-t">${c.html ? c.titre : esc(c.titre)}</span>`
    + ((c.det && !aTags && !c.autre) ? `<span class="ch-d">${fr(c.det)}</span>` : '')
    + (aTags ? `<span class="ch-tags">${c.tags.map((t) => (typeof t === 'string' ? tag(t) : tag(t[0], t[1]))).join('')}${c.raison ? tag(c.raison, 'neg') : ''}</span>` : '')
    + ((c.raison && !aTags) ? `<span class="ch-raison">${esc(c.raison)}</span>` : '');
  if (c.off) b.setAttribute('aria-disabled', 'true');
  b.onclick = () => { if (!c.off) surChoix(i, c); };
  d.appendChild(b);
  const detail = c.detail || ((c.det && (c.autre || String(c.det).length > 70)) ? { kicker: 'Ce choix', titre: c.titre, corps: `<p class="pg-info">${fr(c.det)}</p>` } : null);
  if (detail) {
    const n = el('button', 'ch-i', 'i');
    n.type = 'button';
    n.setAttribute('aria-label', 'En savoir plus sur ce choix');
    n.onclick = (e) => { e.stopPropagation(); ouvrirFeuille(detail); };
    d.appendChild(n);
  }
  return d;
}

/* Un bouton d'action large, en bas de page, là où se pose le pouce. */
function cta(label, onClick, cls) {
  const b = el('button', 'cta' + (cls ? ' ' + cls : ''), esc(label));
  b.type = 'button';
  b.onclick = onClick;
  return b;
}

/* o = { kicker, picto, pas, titre, cri, qui, illus, info, figure, chiffres,
         extra, note, prompt, choix, retour, fin, bouton, papier, classe,
         secondaire }
   - `choix` : tableau de choix (quatre au plus) ; `fin(i, choix)` est appelée
     quand le joueur a choisi (après le retour, s'il y en a un).
   - `retour(i, choix)` : { titre, texte, ton } affiché à la place des choix,
     avec un bouton « Continuer ».
   - `bouton` : { label } pour une page d'information sans décision ; `fin()`.
   - `note` : { kicker, titre, corps, label } : le bouton « demander une note ». */
function page(o) {
  const pg = el('article', 'pg' + (o.papier ? ' papier' : '') + (o.classe ? ' ' + o.classe : ''));
  pg.appendChild(el('div', 'pg-tete', `<span class="k">${picto(o.picto || ETAT.picto)}${esc(o.kicker || '')}</span>${o.pas ? `<span class="pas">${esc(o.pas)}</span>` : ''}`));
  if (o.illus) { const v = illustration(o.illus, false); if (v) { v.classList.add('pg-illus'); pg.appendChild(v); } }
  if (o.titre !== undefined) pg.appendChild(el('h2', o.cri ? 'cri' : '', o.titreHtml ? o.titre : fr(o.titre)));
  if (o.qui) pg.appendChild(el('p', 'pg-qui', fr(o.qui)));
  if (o.info) pg.appendChild(el('p', 'pg-info', o.info));
  if (o.figure) pg.appendChild(el('div', 'pg-chiffre', `<b>${fr(o.figure.v)}</b><span>${fr(o.figure.l)}${o.figure.src ? citerCourt(o.figure.src) : ''}</span>`));
  if (o.chiffres) pg.appendChild(el('div', 'pg-chiffres', o.chiffres.map((x) => `<div><b>${fr(x.v)}</b><span>${fr(x.l)}</span></div>`).join('')));
  if (o.extra) for (const x of [].concat(o.extra)) if (x) pg.appendChild(typeof x === 'string' ? el('div', '', x) : x);
  const notes = o.notes || (o.note ? [o.note] : []);
  if (notes.length) {
    const rang = el('div', 'pg-notes');
    for (const nt of notes) {
      const n = el('button', 'pg-note', `<span aria-hidden="true">📎</span> ${esc(nt.label || 'Demander une note à la DGESCO')}`);
      n.type = 'button';
      n.onclick = () => ouvrirFeuille({ kicker: nt.kicker || 'Note de la DGESCO', titre: nt.titre, corps: nt.corps });
      rang.appendChild(n);
    }
    pg.appendChild(rang);
  }

  const zone = el('div', 'pg-zone');
  pg.appendChild(zone);
  let fait = false;
  if (o.choix && o.choix.length) {
    if (o.choix.length > 4) console.warn('plus de quatre choix sur la page', o.titre);
    if (o.prompt !== false) zone.appendChild(el('p', 'pg-q', esc(o.prompt || 'À vous de décider')));
    const liste = el('div', 'pg-choix');
    liste.setAttribute('role', 'group');
    liste.setAttribute('aria-label', o.prompt || 'À vous de décider');
    const surChoix = (i, c) => {
      if (fait) return;
      fait = true;
      const r = o.retour ? o.retour(i, c) : null;
      if (!r) { o.fin(i, c); return; }
      zone.innerHTML = '';
      zone.appendChild(el('div', 'pg-choisi', `<span>Votre choix</span><b>${c.html ? c.titre : esc(c.titre)}</b>`));
      const ton = r.ton === 'bien' ? 'var(--c-sante)' : r.ton === 'mal' ? 'var(--rouge-rf)' : r.ton === 'froid' ? 'var(--c-budget)' : 'var(--or)';
      const bloc = el('div', 'pg-retour');
      bloc.style.borderLeftColor = ton;
      bloc.innerHTML = `<div class="t" style="color:${ton}">${esc(r.titre || 'Ce qui suit')}</div><p>${r.html ? r.texte : fr(r.texte)}</p>`;
      zone.appendChild(bloc);
      const b = cta(r.bouton || 'Continuer', () => o.fin(i, c));
      zone.appendChild(b);
      b.focus({ preventScroll: true });
    };
    o.choix.forEach((c, i) => liste.appendChild(noeudChoix(c, i, surChoix)));
    zone.appendChild(liste);
  } else if (o.bouton) {
    zone.appendChild(cta(o.bouton.label || 'Continuer', () => { if (!fait) { fait = true; o.fin(); } }));
  }
  if (o.secondaire) zone.appendChild(cta(o.secondaire.label, o.secondaire.onClick, 'sec'));
  scene(pg);
  return pg;
}

/* Une ligne « chiffre + source » compacte pour les pages (la source complète,
   cliquable, est dans la note). */
function citerCourt(id) {
  const S = SOURCES[id];
  if (!S) return '';
  return `<cite>${S.url ? `<a href="${S.url}" target="_blank" rel="noopener">${esc(S.org)}</a>` : esc(S.org)} (${esc(S.date)})</cite>`;
}

/* Les mots d'une carte-mesure, tels qu'on les lit sur un bouton de choix. */
function motsCarte(c, enveloppe) {
  const k = coutDe(c, {});
  const cad = Math.max(0, ...(c.reel || []).map((e) => e.cadenas), c.parametrique === 'revalorisation' ? 3 : 0);
  const vit = c.vitrine || {};
  const tags = [];
  tags.push([k.cout <= 0.005 ? 'gratuit' : `${fmt0(k.cout * 1000)} M€/an`, enveloppe !== undefined && k.cout > enveloppe + 1e-9 ? 'neg' : '']);
  tags.push([`preuves : ${cad >= 5 ? 'solides' : cad >= 3 ? 'correctes' : cad >= 2 ? 'fragiles' : 'aucune'}`, cad >= 3 ? 'pos' : '']);
  if (vit.enseignants >= 3) tags.push(['profs pour', 'pos']);
  else if (vit.enseignants <= -5) tags.push(['profs contre', 'neg']);
  else if (vit.enseignants < 0) tags.push(['profs grincent', 'neg']);
  return tags;
}

/* Le détail d'une carte, derrière son « i » : qui la défend, qui est contre,
   ce que disent les études, l'idée reçue. */
function detailCarte(c) {
  const k = coutDe(c, {});
  const vit = c.vitrine || {};
  const corps = el('div', 'dc');
  corps.innerHTML = `
    ${c.porteurs ? `<p class="dc-qui"><b>Qui la défend</b> ${c.porteurs.map(esc).join(' · ')}</p>` : ''}
    ${c.contre ? `<p class="dc-qui"><b>Qui est contre</b> ${c.contre.map(esc).join(' · ')}</p>` : ''}
    <div class="dc-chiffres">
      <span>${fmt0(k.cout * 1000)} M€ par an</span>
      <span>${k.pol}${c.perimetre === 'matignon' ? '×2' : ''} points de soutien</span>
      ${c.coutETP ? `<span>${fmt0(c.coutETP)} postes</span>` : ''}
      <span class="${vit.parents >= 0 ? 'pos' : 'neg'}">parents ${signe(vit.parents || 0)}</span>
      <span class="${vit.enseignants >= 0 ? 'pos' : 'neg'}">enseignants ${signe(vit.enseignants || 0)}</span>
      <span class="${vit.presse >= 0 ? 'pos' : 'neg'}">presse ${signe(vit.presse || 0)}</span>
    </div>
    <h4>Ce que disent les études</h4>
    <p>${esc(c.preuve || '')}</p>
    ${(c.reel || []).length ? `<h4>Ce qu’on en attend, et avec quelle certitude</h4><ul class="dc-reels">${c.reel.map((e) => `<li><span class="verrous">${'🔒'.repeat(e.cadenas)}${'·'.repeat(5 - e.cadenas)}</span> <b>${NOMS_C[e.compteur]}</b>, dans ${e.delai} an${e.delai > 1 ? 's' : ''}<small>${esc(e.source)}</small></li>`).join('')}</ul>` : ''}
    ${c.ideeRecue ? `<h4>L’idée reçue</h4><p>${esc(c.ideeRecue)}</p>` : ''}
    ${c.greve ? `<p class="dc-alerte">⚠ Risque de grève (${c.greve.intensite}/5)</p>` : ''}
    ${c.provocations ? `<p class="dc-alerte">⚠ Provocation « guerre scolaire » (+${c.provocations})</p>` : ''}
    <p class="dc-mot">${esc(c.mot || '')}</p>`;
  return { kicker: (FAMILLES[c.famille] || ['Mesure'])[0], titre: c.label, corps };
}

/* La note de la DGESCO : la fiche de référence d'un thème, avec ses sources. */
function corpsFiche(cle) {
  const z = el('div', 'fiche-corps');
  const GRAPH = { budget: serieBudget, eleves: serieEleves, niveaux: serieNiveaux, consultation: serieConsultation };
  const b = CADRAGE_INITIAL.find((x) => x.cle === cle);
  const r = REPERES.find((x) => x.cle === cle);
  if (b) {
    const a = el('div', 'accroche grille');
    const sa = b.sousAccroche;
    a.innerHTML = `<div class="chiffre-cle"><b>${fr(b.accroche.v)}</b></div><p>${fr(b.accroche.l)}${citer(b.accroche.src)}</p>`
      + (sa ? `<span class="sous"><em>${fr(sa.v)}</em> ${fr(sa.l)}.${citer(sa.src)}</span>` : '');
    z.appendChild(a);
    if (GRAPH[b.graphique]) z.appendChild(GRAPH[b.graphique]());
  }
  const chiffres = (b && b.chiffres && b.chiffres.length) ? b.chiffres : (r ? r.chiffres : []);
  if (r && r.serie === 'budget' && !b) z.appendChild(serieBudget());
  if (chiffres.length) z.appendChild(el('ul', 'rep-liste', chiffres.map((x) => `<li><span class="v">${fr(x.v)}</span><span class="l">${fr(x.l)}.${citer(x.src)}</span></li>`).join('')));
  const retenir = (b && b.aRetenir) || (r && r.aRetenir);
  if (retenir) z.appendChild(el('p', 'cadrage-retenir', fr(retenir)));
  return z;
}
function noteFiche(cle, titre) {
  const b = CADRAGE_INITIAL.find((x) => x.cle === cle);
  const r = REPERES.find((x) => x.cle === cle);
  return { kicker: 'Note de la DGESCO', titre: titre || (b ? b.titre : r ? r.titre : 'Les chiffres'), corps: () => corpsFiche(cle) };
}

/* Une note faite de faits sourcés : [{ v, l, src }]. */
function noteFaits(titre, faits, lecture) {
  return {
    kicker: 'Note de la DGESCO', titre,
    corps: () => {
      const z = el('div', 'fiche-corps');
      if (faits && faits.length) z.appendChild(el('ul', 'rep-liste', faits.map((x) => `<li><span class="v">${fr(x.v)}</span><span class="l">${fr(x.l)}.${citer(x.src)}</span></li>`).join('')));
      if (lecture) z.appendChild(el('p', 'cadrage-retenir', fr(lecture)));
      return z;
    },
  };
}
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


/* La note du prédécesseur : le tube de dentifrice dont la pâte, une fois
   sortie, ne rentre plus, et la pancarte plantée dedans. */
dentifrice: `<svg viewBox="0 0 280 120" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  ${ombre(100, 106, 96, '.06')}
  ${masse('M24 54h12v34H24z', ' stroke-width="1.5"')}
  <path d="M27 54v34M30 54v34M33 54v34" stroke-width="1"/>
  ${masse('M36 52h104q16 0 28 12v14q-12 12-28 12H36z', ' stroke-width="1.9"')}
  ${trame('M62 52h18v38H62z', '.14')}
  <path d="M62 52v38M80 52v38" stroke-width="1.1"/>
  <path d="M92 66h40M92 74h26" stroke-width="1.1"/>
  ${masse('M168 62h22v20h-22z', ' stroke="' + ACC + '" stroke-width="1.7"')}
  <path d="M174 62v20M180 62v20" stroke="${ACC}" stroke-width="1"/>
  <path d="M190 72C208 72 206 46 228 48C250 50 254 78 238 86C224 92 212 84 222 76" stroke-width="9"/>
  <path d="M190 72C208 72 206 46 228 48C250 50 254 78 238 86C224 92 212 84 222 76" stroke="var(--fond-illus,#fff)" stroke-width="6.4"/>
  <path d="M232 50V24" stroke-width="1.6"/>
  ${masse('M220 8h26v16h-26z', ' stroke-width="1.5"')}
  <path d="M233 12v6M233 21v.6" stroke="${ACC}" stroke-width="1.8"/>
  <path d="M14 106h252" stroke-width="1.4"/>
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

/* ============================================================================
   LES PAGES DU DÉBUT : accueil, note du prédécesseur, entretien, priorités,
   territoire, Bercy, les colères.
   ========================================================================== */

/* --- accueil --------------------------------------------------------------- */
function ecranAccueil(sauvegarde) {
  const pg = el('article', 'pg pg-accueil');
  pg.innerHTML = `
    <div class="tampon"><div class="rf">RÉPUBLIQUE FRANÇAISE</div><div class="mn">MINISTÈRE DE L’ÉDUCATION NATIONALE</div></div>
    ${ILLUS.facade.replace('<svg ', '<svg class="illustration" ')}
    <h1>Rue de Grenelle</h1>
    <p class="devise">Automne 2026. Les lycées sont bloqués depuis six semaines. Le ministre démissionne. On vous appelle.</p>
    <p class="chute">Vous allez entendre ce que disent les lycéens, vérifier les chiffres, vous faire un avis, et décider. Vingt à trente minutes.</p>`;
  const zone = el('div', 'pg-zone');
  if (sauvegarde) {
    zone.appendChild(cta('Reprendre la partie en cours', () => demarrer(sauvegarde)));
    zone.appendChild(cta('Nouveau mandat', () => { localStorage.removeItem(CLE_SAUVE); demarrer(null); }, 'sec'));
  } else {
    zone.appendChild(cta('Prendre vos fonctions', () => demarrer(null)));
  }
  const a = cta('À propos du jeu et de ses sources', () => ouvrirFeuille({
    kicker: 'À propos', titre: 'Un jeu pour comprendre l’école',
    corps: '<h3>Comment jouer</h3><p class="pg-info">Chaque page apporte <b>une information</b> et demande <b>une décision</b> (quatre choix au plus). <b>📎</b> demande une note à la DGESCO : les chiffres, avec leurs sources. <b>i</b> donne le détail d’un choix. Les chiffres disent ce qui est ; ce qu’il faut en faire est un choix politique, qui dépend de valeurs : c’est le vôtre.</p><h3>À propos</h3><p class="pg-info">Jeu pédagogique indépendant, sans lien avec le ministère de l’Éducation nationale. Les chiffres viennent de sources publiques (DEPP, budget de l’État, OCDE, Cour des comptes), chacune citée et cliquable. Chaque mesure dit qui la défend vraiment (gouvernement, candidats de 2027, organisations lycéennes) et ce qu’on sait de son effet. Les revendications des lycéens sont celles de l’automne 2026.</p><p class="pg-info">Le jeu ne dit jamais qu’une politique est la bonne. Les chiffres disent ce qui est ; ce qu’il faut en faire dépend de valeurs, et c’est vous qui décidez. Les personnages, syndicats et titres de presse sont des pseudonymes transparents.</p>',
  }), 'sec petit');
  zone.appendChild(a);
  pg.appendChild(zone);
  scene(pg);
}

/* --- la note du prédécesseur ---------------------------------------------- */
function ecranNomination() {
  const note = el('div', 'note-passation');
  note.innerHTML = `<p>Cher successeur,</p>
    <p>Un seul conseil, le seul que je n’ai pas su suivre : <b>les lycéens, c’est comme le dentifrice. Une fois sorti du tube, on ne le fait plus rentrer.</b> On peut l’étaler, le diriger, le canaliser. Pas faire comme s’il n’était jamais sorti.</p>
    <p>Le reste est dans les cartons. Les cartons sont devant les grilles.</p>
    <p class="ps">P.-S. La photocopieuse du deuxième est en panne depuis 2019. Ne la réparez pas : c’est le dossier le plus consensuel du ministère. Il fédère.</p>`;
  page({
    kicker: 'Rue de Grenelle', picto: 'lettre', pas: 'novembre 2026',
    titre: 'Un mot de votre prédécesseur', illus: 'dentifrice', papier: true, classe: 'nomination',
    info: 'Le ministre a démissionné hier soir, après six semaines de blocus. On vous a appelé : le poste est à vous.',
    extra: note,
    note: Object.assign(noteFiche('lyceens', 'Où en est-on ? L’automne 2026 des lycéens'), { label: 'Où en est-on ? Demander une note à la DGESCO' }),
    bouton: { label: 'Accepter le ministère' },
    fin: () => suivant('accepter'),
  });
}

/* --- l'entretien de l'Élysée : une question par page -------------------------- */
function ecranEntretien(q) {
  const quest = q.question;
  page({
    kicker: 'Élysée, entretien préalable', picto: 'colonnes', pas: `Question ${q.index + 1} sur ${q.total}`, papier: true,
    titre: quest.question,
    info: (q.index === 0 ? 'Un conseiller vous reçoit vingt minutes. Il ne s’intéresse ni à votre projet ni à l’école : il vérifie que votre nomination ne coûtera rien au Président. Personne ne contrôlera vos réponses aujourd’hui.<br>' : '') + `<i>${fr(quest.aparte)}</i>` + (q.index === 0 ? '<small>Touchez un choix pour décider. Le « i » en donne le détail.</small>' : ''),
    prompt: 'Que répondez-vous ?',
    choix: quest.reponses.map((r) => ({ titre: r.label, det: r.det })),
    fin: (k) => suivant(k),
  });
}

/* --- vos priorités, devant la presse -------------------------------------- */
function ecranDoctrine() {
  const rev = ETAT.revanche;
  const ordre = rev && rev.doctrineInverse ? [...rev.doctrineInverse] : [];
  const tous = Object.keys(NOMS_C);
  const liste = el('div', 'rangs');
  let ok;
  const dessiner = () => {
    liste.innerHTML = '';
    tous.forEach((c) => {
      const rang = ordre.indexOf(c);
      const b = el('button', 'rang-b' + (rang >= 0 ? ' pris' : ''));
      b.type = 'button';
      b.innerHTML = `<span class="num">${rang >= 0 ? rang + 1 : ''}</span><span class="txt"><b><i class="pastille" style="background:${COULEURS_C[c]}"></i>${NOMS_C_LONGS[c]}</b><small>${esc(K.PROJETS_2027[c].sousTitre)}</small></span><span class="poids">${rang >= 0 ? K.POIDS_DOCTRINE[rang] + ' %' : ''}</span>`;
      b.onclick = () => { if (rang >= 0) ordre.splice(rang, 1); else ordre.push(c); dessiner(); };
      liste.appendChild(b);
    });
    if (ok) {
      ok.disabled = ordre.length < tous.length;
      ok.textContent = ordre.length < tous.length ? `Touchez la priorité n° ${ordre.length + 1}` : 'Annoncer ces priorités';
    }
  };
  const corps = () => {
    const z = el('div', 'fiche-corps');
    z.appendChild(el('p', 'pg-info', 'Chaque priorité est aussi celle d’un ou plusieurs candidats de 2027 : la presse le remarquera demain. Voici qui défend quoi.'));
    for (const c of tous) {
      const P = K.PROJETS_2027[c];
      z.appendChild(el('div', 'proj', `<h4><i class="pastille" style="background:${COULEURS_C[c]}"></i>${NOMS_C_LONGS[c]}</h4>${P.porteurs.map((p) => `<p><b>${esc(p.qui)}</b> : ${esc(p.quoi)}</p>`).join('')}`));
    }
    return z;
  };
  const pg = page({
    kicker: 'Conférence de presse', picto: 'pupitre', pas: 'prise de fonction',
    titre: 'Vos cinq priorités, devant la presse', illus: null,
    info: `Touchez-les dans l’ordre : la première compte le plus (35 % du bilan), la dernière presque rien (8 %). <b>Vous serez jugé sur VOTRE classement.</b> Le bandeau n’affichera que les trois premières.${rev ? ' <b>Revanche :</b> classement inversé, modifiable.' : ''}`,
    extra: liste,
    note: { label: 'Qui défend quoi en 2027 ? Demander une note', kicker: 'Note de la DGESCO', titre: 'Les priorités des candidats de 2027', corps },
    choix: null,
  });
  ok = cta('', () => suivant([...ordre]));
  ok.disabled = true;
  pg.querySelector('.pg-zone').appendChild(ok);
  const rec = cta('Recommencer', () => { ordre.length = 0; dessiner(); }, 'sec petit');
  pg.querySelector('.pg-zone').appendChild(rec);
  dessiner();
}

/* --- la note d'héritage et les notes de cadrage ------------------------------ */
/* Les notes de cadrage ne sont plus imposées : elles se demandent, depuis la
   page où elles servent. Seule la note d'héritage garde sa page. */
function ecranReperes(q) {
  suivant(null);
}

/* --- « Mon lycée, mon département » : deux pages, et la fiche à la demande --- */
function ecranTerritoire(q) {
  const parRegion = {};
  for (const dep of [...q.departements].sort((a, b) => a.code.localeCompare(b.code, 'fr', { numeric: true }))) (parRegion[dep.region] = parRegion[dep.region] || []).push(dep);
  const sel = el('select', 'choix-dep');
  sel.id = 'dep';
  sel.setAttribute('aria-label', 'Votre département');
  sel.innerHTML = '<option value="">Choisir un département…</option>' + Object.keys(parRegion).map((r) =>
    `<optgroup label="${esc(REGIONS[r])}">${parRegion[r].map((dep) => `<option value="${dep.code}">${esc(dep.code)} · ${esc(dep.nom)}</option>`).join('')}</optgroup>`).join('');
  const pg = page({
    kicker: 'Avant les colères', picto: 'carte', pas: 'un lycée en tête ?',
    titre: 'Un lycée que vous connaissez ?',
    info: 'Un ministre arrive toujours avec un lycée en tête : celui où il a été élève, celui de ses enfants. Choisissez son département : le jeu pourra vous dire ce qu’on y reçoit, et ce qu’on n’en sait pas.',
    extra: sel,
    bouton: null,
  });
  const zone = pg.querySelector('.pg-zone');
  const go = cta('Voir ce département', () => pageIntention(sel.value));
  go.disabled = true;
  sel.onchange = () => { go.disabled = !sel.value; };
  zone.appendChild(go);
  zone.appendChild(cta('Je préfère ne pas choisir', () => suivant(null), 'sec petit'));

  function pageIntention(code) {
    const f = ficheTerritoire(code);
    if (!f) { suivant(null); return; }
    const R = f.region || {};
    let ligne;
    if (f.ips != null) ligne = `IPS moyen des lycées : ${f.ips}, pour une moyenne nationale de 109 ${f.ips >= 118 ? '(parmi les plus favorisés de France)' : f.ips <= 95 ? '(parmi les plus défavorisés de France)' : '(dans la moyenne)'}.`;
    else if (f.sous100) ligne = 'IPS moyen des lycées sous 100, pour une moyenne nationale de 109 : parmi les plus défavorisés de France.';
    else ligne = 'Son profil social moyen n’est pas dans les chiffres du jeu : le bouton ci-dessous va le chercher dans les données ouvertes.';
    const inv = R.invest && R.invest.v ? ` Votre région investit ${fmt0(R.invest.v)} € par lycéen et par an (${R.invest.rang}).` : R.invest && R.invest.rang ? ` Votre région est ${R.invest.rang} pour l’investissement par lycéen.` : '';
    page({
      kicker: 'Avant les colères', picto: 'carte', pas: `${f.nom}, ${f.regionNom}`,
      titre: `${f.nom} : et votre politique ?`,
      info: `${esc(ligne)}${esc(inv)} Rien de tout cela ne change les règles du jeu. Cela change ce que le bilan pourra vous dire de « chez vous ».`,
      note: { label: 'Voir les chiffres de mon département', kicker: 'Mon département', titre: `${f.nom}, ${f.regionNom}`, corps: () => corpsTerritoire(f) },
      prompt: 'Dans votre politique, les territoires comptent…',
      choix: [
        { titre: 'D’abord : donner plus là où l’on reçoit moins', det: 'Le bilan vérifiera si vous l’avez fait.' },
        { titre: 'Pas plus qu’ailleurs : les mêmes règles partout', det: 'Le service public est national. Le bilan vérifiera aussi.' },
        { titre: 'Je verrai sur pièces', det: 'Vous ne promettez rien avant d’avoir vu les chiffres.' },
      ],
      fin: (i) => suivant({ code: f.code, priorite: ['territoires', 'national', 'verra'][i] }),
    });
  }
}

/* La fiche d'un département, dans la feuille : ce que le jeu sait, la
   recherche en direct, et les chiffres nationaux. */
function corpsTerritoire(f) {
  const z = el('div', 'fiche-corps');
  const R = f.region || {};
  const lignes = [];
  if (R.invest && R.invest.v) lignes.push({ v: `${fmt0(R.invest.v)} €`, l: `par lycéen et par an : l’investissement de la région ${f.regionNom} dans ses lycées publics (2022-2025), ${R.invest.rang} ; de 885 à 1 978 € selon les régions`, src: R.invest.src });
  else if (R.invest && R.invest.rang) lignes.push({ v: 'haut du tableau', l: `l’investissement par lycéen de la région ${f.regionNom} la place ${R.invest.rang} (2022-2025) ; la valeur exacte n’a pas été relevée, l’écart va de 885 à 1 978 €`, src: R.invest.src });
  else lignes.push({ v: 'non relevé', l: `l’investissement par lycéen de la région ${f.regionNom} n’a pas été relevé ; il se situe entre 885 € (Hauts-de-France) et 1 978 € (Bretagne) par an. Aucun tableau officiel : la presse le reconstitue`, src: 'gazette_invest' });
  if (R.fonctionnement) lignes.push({ v: 'fonctionnement', l: R.fonctionnement.v, src: R.fonctionnement.src });
  if (R.prive) lignes.push({ v: 'au privé', l: R.prive.v, src: R.prive.src });
  if (R.cantine) lignes.push({ v: 'la cantine', l: R.cantine.v, src: R.cantine.src });
  if (R.participation) lignes.push({ v: 'les élèves décident', l: R.participation.v, src: R.participation.src });
  if (f.ips != null) lignes.push({ v: `IPS ${f.ips}`, l: `l’indice de position sociale moyen des lycées de ${f.nom} (rentrée 2024), pour une moyenne nationale de 109 (de 71 à Mayotte à 129 à Paris)`, src: 'depp_ips_lycees' });
  else if (f.sous100) lignes.push({ v: 'IPS sous 100', l: `${f.nom} fait partie des départements où l’indice de position sociale moyen des lycées est sous 100 (moyenne nationale 109)`, src: 'depp_ips_lycees' });
  else lignes.push({ v: 'IPS : à chercher', l: `l’IPS moyen des lycées de ${f.nom} n’a pas été relevé ; celui de chaque lycée est en données ouvertes`, src: 'ods_ips' });
  for (const x of f.locaux) lignes.push(x);
  z.appendChild(el('ul', 'rep-liste', lignes.map((x) => `<li><span class="v">${fr(x.v)}</span><span class="l">${fr(x.l)}.${citer(x.src)}${x.src2 ? citer(x.src2) : ''}</span></li>`).join('')));

  const direct = el('div', 'direct');
  direct.innerHTML = `<h4>Les lycées de ${esc(f.nom)}, en direct</h4><p class="exp">Le ministère publie l’IPS de chaque lycée en données ouvertes. Si votre appareil a du réseau, le jeu peut aller les chercher.</p>`;
  const go = el('button', 'cta sec petit', 'Chercher mes lycées');
  go.type = 'button';
  const res = el('div', 'direct-res');
  go.onclick = () => { go.disabled = true; go.textContent = 'Recherche…'; chercherLycees(f.code).then((r) => afficherDirect(r)).catch((e) => afficherDirect({ erreur: e })); };
  direct.append(go, res);
  z.appendChild(direct);
  function afficherDirect(r) {
    go.hidden = true;
    if (!r || r.erreur || !r.lycees || !r.lycees.length) {
      res.innerHTML = `<p class="exp">Pas de réseau, ou le service ne répond pas d’ici. Voici où chercher vous-même :</p><ul class="liens">${OU_CHERCHER.map((o) => `<li>${esc(o.quoi)}${citer(o.src)}</li>`).join('')}</ul>`;
      return;
    }
    const L = r.lycees;
    const pub = L.filter((x) => x.secteur === 'public'), pri = L.filter((x) => x.secteur === 'prive');
    const moy = (arr) => arr.length ? arr.reduce((a, x) => a + x.ips, 0) / arr.length : null;
    const tri = [...L].sort((a, b) => a.ips - b.ips);
    res.innerHTML = `<ul class="rep-liste"><li><span class="v">${L.length} lycées</span><span class="l">à la rentrée ${esc(r.rentree || '')}${pub.length || pri.length ? ` : ${pub.length} publics, ${pri.length} privés sous contrat` : ''}${moy(L) != null ? ` ; IPS moyen ${fmt0(moy(L))}${pub.length && pri.length ? ` (public ${fmt0(moy(pub))}, privé ${fmt0(moy(pri))})` : ''}` : ''}</span></li>
      <li><span class="v">${fmt0(tri[0].ips)}</span><span class="l">le lycée le moins favorisé : ${esc(tri[0].nom)}${tri[0].commune ? `, ${esc(tri[0].commune)}` : ''}</span></li>
      <li><span class="v">${fmt0(tri[tri.length - 1].ips)}</span><span class="l">le plus favorisé : ${esc(tri[tri.length - 1].nom)}${tri[tri.length - 1].commune ? `, ${esc(tri[tri.length - 1].commune)}` : ''}</span></li></ul>
      <p class="exp">Un IPS de 100 est la moyenne des élèves de France ; les lycées vont de 59 à 162.${citer('ods_ips')}</p>`;
    const cherche = el('input', 'cherche-lycee');
    cherche.type = 'search'; cherche.placeholder = 'Le nom de votre lycée…'; cherche.setAttribute('aria-label', 'Votre lycée');
    const liste = el('ul', 'lycee-liste');
    cherche.oninput = () => {
      const v = cherche.value.trim();
      liste.innerHTML = '';
      if (v.length < 2) return;
      const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      L.filter((x) => norm(x.nom).includes(norm(v)) || (x.commune && norm(x.commune).includes(norm(v)))).slice(0, 8).forEach((x) => {
        const rang = tri.indexOf(x) + 1;
        liste.appendChild(el('li', '', `<b>${esc(x.nom)}</b>${x.commune ? ` <span class="c">${esc(x.commune)}</span>` : ''} <span class="i">IPS ${fmt0(x.ips)}</span> <span class="c">${rang <= L.length / 3 ? 'tiers le moins favorisé du département' : rang > (2 * L.length) / 3 ? 'tiers le plus favorisé' : 'tiers médian'}</span>`));
      });
    };
    res.append(cherche, liste);
  }
  const nat = el('details', 'nat');
  nat.innerHTML = '<summary>Et partout en France : sept chiffres</summary>';
  nat.appendChild(el('ul', 'rep-liste', FAITS_NATIONAUX.map((x) => `<li><span class="v">${fr(x.v)}</span><span class="l">${fr(x.l)}.${citer(x.src)}</span></li>`).join('')));
  z.appendChild(nat);
  return z;
}

/* --- Bercy : demander de l'argent dès l'arrivée ----------------------------- */
function ecranAvance(q) {
  const S = ETAT.s;
  const optionsAffichees = q.options;
  let choix = null;
  page({
    kicker: 'Premier appel à Bercy', picto: 'pieces', pas: 'novembre 2026',
    titre: 'Demander de l’argent dès votre arrivée ?',
    info: 'Le budget 2026 est dépensé, le budget 2027 est en discussion. Pour agir tout de suite, un levier : demander à Bercy de débloquer une réserve. <b>Bercy n’est pas obligé de dire oui</b>, et un refus se sait.',
    note: noteFiche('budget', 'Le budget de l’Éducation nationale'),
    choix: optionsAffichees.map((o) => ({
      titre: o.titre, det: o.detail,
      tags: [o.bonus ? [`+${fmt0(o.bonus * 1000)} M€`, 'pos'] : 'enveloppe inchangée', o.bonus ? [`${Math.round(o.proba * 100)} % de chances`, o.proba >= 0.75 ? 'pos' : o.proba < 0.6 ? 'neg' : ''] : '', o.exigeMesure ? ['il faut nommer une mesure', 'neg'] : ''].filter(Boolean),
      detail: { kicker: 'Demande à Bercy', titre: o.titre, corps: `<p class="pg-info">${fr(o.detail)}</p><p class="pg-info">${o.bonus ? `Si Bercy accepte : +${fmt0(o.bonus * 1000)} M€ pour vos premières décisions. Chances : ${Math.round(o.proba * 100)} %. ` : ''}${o.capital ? `Soutien du gouvernement ${signe(o.capital)}. ` : ''}${o.bercy ? `Crédit auprès de Bercy ${signe(o.bercy)}. ` : ''}</p><p class="dc-mot">« ${fr(o.mot)} »</p>` },
    })),
    fin: (i) => {
      const o = optionsAffichees[i];
      if (!o.exigeMesure) { suivant({ option: i, mesure: null }); return; }
      const liste = mesuresDisponibles(S, 6).slice(0, 4);
      page({
        kicker: 'Premier appel à Bercy', picto: 'pieces', pas: 'fléchage',
        titre: 'Sur quelle mesure fléchez-vous cette rallonge ?',
        info: 'Bercy finance un objet, jamais une intention. <b>La mesure retenue sera engagée</b> : vous la porterez en juin, qu’elle vous plaise encore ou non.',
        choix: liste.map((c) => ({ titre: c.label, tags: motsCarte(c), detail: detailCarte(c) })),
        fin: (k) => suivant({ option: i, mesure: liste[k].id }),
      });
    },
  });
}

/* --- le résultat d'un arbitrage : une page, un mot, on continue -------------- */
function ecranResultat(q) {
  page({
    kicker: q.kicker || 'Résultat', picto: q.picto || 'journal',
    titre: q.titre, info: fr(q.texte), papier: true, illus: q.illus,
    figure: q.figure,
    bouton: { label: q.bouton || 'Continuer' },
    fin: () => suivant(null),
  });
  const t = $('#scene .pg-tete');
  if (t && q.ton) t.style.color = q.ton === 'bien' ? 'var(--c-sante)' : q.ton === 'mal' ? 'var(--rouge-rf)' : '';
}

/* --- une colère : ce qu'ils disent, votre avis -------------------------------- */
const rentreeColere = (q) => !!(q.quand && /^Rentrée/.test(q.quand));
function ecranColere(q) {
  const c = q.colere;
  page({
    kicker: rentreeColere(q) ? `${q.quand}, ce que disent les lycéens` : 'Automne 2026, ce que disent les lycéens', picto: 'megaphone',
    pas: q.total > 1 ? `Colère ${q.rang} sur ${q.total}` : '',
    titre: c.cri, cri: true, papier: true,
    qui: c.qui,
    info: fr(c.intro || c.contexte),
    prompt: 'Avant de regarder les chiffres : cette colère est-elle fondée ?',
    choix: q.avis.map((a) => ({ titre: a.label, det: a.det })),
    fin: (i) => suivant(i),
  });
}

/* --- une colère : ce que disent les faits, votre réponse -------------------- */
const VERDICTS = {
  fondee: { t: 'Les chiffres confirment', coul: 'var(--c-sante)' },
  partielle: { t: 'Vrai, mais pas comme ils le disent', coul: 'var(--c-budget)' },
  ouverte: { t: 'Les chiffres ne tranchent pas', coul: 'var(--c-violet)' },
};
function miroirAvis(avis, verdict) {
  if (verdict === 'ouverte') return avis === 'partielle' ? 'prudent : les données ne tranchent pas.' : 'les données ne tranchent pas : gardez votre avis, et sachez sur quoi il repose.';
  if (avis === verdict) return 'les chiffres vont dans votre sens.';
  if (avis === 'infondee') return 'les chiffres ne vous donnent pas raison : le constat est documenté.';
  if (avis === 'fondee' && verdict === 'partielle') return 'le constat tient, l’explication moins : c’est là que se joue une bonne décision.';
  return 'plus solide que vous ne le pensiez.';
}
function ecranFaits(q) {
  const c = q.colere, S = ETAT.s;
  const V = VERDICTS[c.verdict] || VERDICTS.ouverte;
  const avisLabel = (AVIS.find((a) => a.id === q.avis) || {}).label || '';
  const rentree = rentreeColere(q);
  const when = rentree ? 'cette année' : 'cet automne';
  /* La colère des territoires parle du département du joueur, quand il l'a dit. */
  let chezVous = '';
  if (c.id === 'territoires' && S.territoire) {
    const f = ficheTerritoire(S.territoire.code);
    if (f) {
      const R = f.region || {};
      const inv = R.invest && R.invest.v ? `${fmt0(R.invest.v)} € par lycéen et par an d’investissement (${R.invest.rang})` : R.invest && R.invest.rang ? `une région ${R.invest.rang} pour l’investissement` : '';
      const ips = f.ips != null ? `IPS moyen des lycées ${f.ips} (moyenne 109)` : f.sous100 ? 'IPS moyen des lycées sous 100' : '';
      if (inv || ips) chezVous = `<br><b>Chez vous, ${esc(f.nom)} :</b> ${[inv, ips].filter(Boolean).map(esc).join(' ; ')}.`;
    }
  }
  const note = noteFaits(`Ce que disent les chiffres`, c.faits, c.lecture);
  const base = {
    kicker: rentree ? `${q.quand}, les faits` : 'Automne 2026, les faits', picto: 'megaphone',
    pas: q.total > 1 ? `Colère ${q.rang} sur ${q.total}` : '',
    titre: c.cri, cri: true, classe: 'faits',
    note: { label: 'Voir les chiffres : note de la DGESCO', kicker: 'Note de la DGESCO', titre: 'Ce que disent les chiffres', corps: note.corps },
  };
  const verdictHtml = `<span class="verdict" style="color:${V.coul}"><b>${V.t}.</b></span> ${fr(c.resume || c.lecture)}${chezVous}`;
  const miroir = `Votre avis : « ${avisLabel} » : ${miroirAvis(q.avis, c.verdict)}`;

  if (q.postures) {
    page(Object.assign(base, {
      info: verdictHtml,
      prompt: 'Votre attitude',
      choix: q.postures.map((r) => ({
        titre: r.label, det: r.det,
        tags: [r.colere < 0 ? ['la colère retombe', 'pos'] : ['la colère monte', 'neg'], r.greve ? ['préavis de grève', 'neg'] : ''].filter(Boolean),
        detail: { kicker: 'Votre attitude', titre: r.label, corps: `<p class="pg-info">${fr(r.det)}</p><p class="pg-info">Parents ${signe(r.parents)} · enseignants ${signe(r.adhesion)} · ${r.agenda} semaines d’agenda.</p>` },
      })),
      retour: (i) => ({ titre: 'Ce qui suit', html: true, texte: `${fr(q.postures[i].suite)}<br><small>${esc(miroir)}</small>` }),
      fin: (i) => suivant(i),
    }));
    return;
  }
  const choix = q.dispo.map((carte) => {
    const k = coutDe(carte, {});
    const tropCher = k.cout > q.tresor + 1e-9;
    const tropCapital = (carte.perimetre === 'matignon' ? k.pol * 2 : k.pol) > q.capital;
    return {
      titre: carte.label, tags: (tropCher || tropCapital) ? [motsCarte(carte, q.tresor)[0]] : motsCarte(carte, q.tresor), detail: detailCarte(carte),
      off: tropCher || tropCapital,
      raison: tropCher ? `trop cher : reste ${fmt0(Math.max(0, q.tresor) * 1000)} M€` : tropCapital ? 'le gouvernement ne suit pas' : '',
      carte,
    };
  });
  choix.push({ titre: 'Pas maintenant', det: 'Vous notez la question. Un sujet sans réponse à la rentrée fait remonter la colère.', autre: true });
  page(Object.assign(base, {
    info: verdictHtml,
    prompt: `Votre réponse · ${fmt0(Math.max(0, q.tresor) * 1000)} M€ · soutien ${fmt0(q.capital)}`,
    choix,
    retour: (i, ch) => ({ titre: ch.carte ? 'Vous avez décidé' : 'Vous attendez', html: true, texte: `${fr(ch.carte ? ch.carte.mot : 'Rien n’est décidé, et c’est une décision : elle ne coûte rien aujourd’hui, elle se paie en septembre.')}<br><small>${esc(miroir)}</small>` }),
    fin: (i, ch) => suivant(ch.carte ? { id: ch.carte.id } : null),
  }));
}
/* ============================================================================
   LES PAGES DE L'ANNÉE : lettre de Bercy, intention, carte scolaire, mesures,
   rentrée, blocus, polémique, audience, retrait, livraison, plateau, affaire,
   dossier de crise.
   ========================================================================== */

const PROFILS_L = {
  rapport_de_force: 'culture du rapport de force', reformiste: 'réformiste',
  frontal: 'opposition frontale', negociation: 'culture de la négociation',
  radical: 'radical', corporatiste: 'corporatiste',
};
const finRetour = (r) => ({ titre: r.titre || 'Ce qui suit', texte: r.texte, ton: r.ton });

/* --- juillet : la lettre plafond ------------------------------------------- */
function ecranBercy(q) {
  const S = ETAT.s, p = q.palier;
  const tons = {
    confiant: 'Le ton est presque cordial. Presque.',
    vigilant: 'Le ton est celui d’un créancier patient.',
    ferme: 'Le ton est celui d’un huissier poli.',
    comminatoire: 'Le ton est celui d’un huissier qui a cessé d’être poli.',
  };
  page({
    kicker: 'Lettre de Bercy', picto: 'lettre', pas: ETAT.dateLabel,
    titre: 'Ce que Bercy vous laisse pour l’an prochain', papier: true, illus: 'enveloppe',
    info: `${esc(CAST.bercy)} vous écrit. ${tons[p.ton]} Deux choses : combien de postes rendre, et combien d’argent neuf pour vos mesures. <b>Toute dépense durable engage vos successeurs.</b>`,
    chiffres: [
      { v: fmt0(Math.abs(p.schemaEmplois)), l: 'postes à rendre' },
      { v: `${fmt0(p.marge * 1000)} M€`, l: 'argent neuf' },
      { v: `${fmt0(S.creditBercy)}/100`, l: 'confiance de Bercy' },
    ],
    note: noteFiche('budget', 'Le budget de l’Éducation nationale'),
    prompt: 'Votre réponse',
    choix: [
      { titre: 'Accepter', det: 'Vous gardez votre crédit auprès du gouvernement pour janvier. Bercy note votre esprit de responsabilité, ce qui ne lui coûte rien.' },
      { titre: 'Contester, et demander au Premier ministre de trancher', det: `Coût : 12 points de soutien (il vous en reste ${fmt0(S.capital)}). Chances de gagner : moyennes, de plus en plus faibles à chaque fois.${S.annee === 1 ? ' Un ministre qui menace trop souvent finit par être remplacé.' : ''}` },
    ],
    fin: (i) => suivant(['accepter', 'contester'][i]),
  });
}

/* --- que faire des postes que la démographie libère ------------------------- */
function ecranIntention(q) {
  page({
    kicker: 'Préparation de la rentrée', picto: 'courbe', pas: ETAT.dateLabel,
    titre: 'Moins d’élèves : que faites-vous des postes libérés ?',
    info: 'La baisse du nombre d’élèves libère chaque année environ 6 600 postes. Rendus à Bercy, ou gardés dans les classes ? <b>Bercy comparera votre phrase d’aujourd’hui à ce que vous ferez en janvier.</b>',
    figure: { v: '4 % ou 60 %', l: 'des postes libres rendus à Bercy aux rentrées 2025 et 2026', src: 'depp_proj35' },
    note: noteFiche('demographie', 'La baisse démographique'),
    choix: q.options.map((o) => ({
      titre: o.titre, det: o.detail,
      tags: [[`${Math.round(o.restitution * 100)} % rendus`, ''], o.bercy ? [`crédit Bercy ${signe(o.bercy)}`, o.bercy > 0 ? 'pos' : 'neg'] : ''].filter(Boolean),
      detail: { kicker: 'Votre intention', titre: o.titre, corps: `<p class="pg-info">${fr(o.detail)}</p><p class="dc-mot">« ${fr(o.mot)} »</p>` },
    })),
    fin: (i) => suivant(i),
  });
}

/* --- la carte scolaire : deux décisions, deux pages --------------------------- */
const CHOIX_POSTES = [
  { v: 0.60, titre: 'Rendre la plupart des postes à Bercy', det: 'Six postes sur dix repartent au budget. Bercy est content, des classes ferment, les maires et les syndicats le disent.' },
  { v: 0.40, titre: 'Partager', det: 'Quatre sur dix rendus, le reste gardé dans les classes. Personne n’est content : souvent le signe d’un compromis.' },
  { v: 0.10, titre: 'Garder presque tout dans les classes', det: 'Moins d’élèves par classe, et Bercy s’en souviendra en juillet.' },
];
const CHOIX_PRIVE = [
  { v: 0.25, titre: 'Épargner le privé sous contrat', det: 'Les fermetures touchent surtout le public. L’écart social entre les deux se creuse, en silence.' },
  { v: 0.50, titre: 'Même effort pour tous, au prorata des élèves', det: 'Personne ne défile, personne ne remercie.' },
  { v: 0.70, titre: 'Demander un peu plus au privé', det: 'Protestations d’usage, encore contenues.' },
  { v: 0.85, titre: 'Mettre le privé sous contrat à contribution, franchement', det: 'Le mot « Savary » revient. Une fois, ça passe. Deux fois, c’est la guerre scolaire.' },
];
function ecranCarteScolaire(q) {
  const S = ETAT.s;
  const postesDispo = CHOIX_POSTES.filter((c) => c.v <= q.restitutionMax + 1e-9);
  const precedents = (S.historiqueRestitution && S.historiqueRestitution.length)
    ? 'Vos précédents : ' + S.historiqueRestitution.map((h) => `rentrée ${h.rentree}, ${h.pct} % rendus`).join(' ; ') + '.'
    : 'Avant vous : 4 % des postes libres rendus en 2025, 60 % en 2026.';
  const premiere = () => page({
    kicker: 'La carte scolaire', picto: 'plan', pas: `Rentrée ${S.anneeCiv + 1} · décision 1 sur 2`,
    titre: 'Les postes libres : les rendre ou les garder ?', illus: 'carte',
    info: `<b>${fmt0(Math.abs(q.baisse) * 1000)} élèves de moins</b> à la rentrée, soit ${fmt0(q.postesLiberables)} postes devenus inutiles. Bercy veut en récupérer ${fmt0(Math.abs(q.schemaDemande))}. Les maires et les syndicats veulent l’inverse. ${precedents}${q.restitutionMax < 1 ? `<br><small>Votre engagement « 19 élèves par classe » vous interdit d’en rendre plus de ${fmt0(q.restitutionMax * 100)} %.</small>` : ''}`,
    note: noteFiche('demographie', 'La baisse démographique'),
    choix: postesDispo.map((c) => ({ titre: c.titre, det: c.det })),
    fin: (i) => seconde(postesDispo[i].v),
  });
  const seconde = (restitution) => page({
    kicker: 'La carte scolaire', picto: 'plan', pas: `Rentrée ${S.anneeCiv + 1} · décision 2 sur 2`,
    titre: 'Qui porte l’effort ?',
    info: '17 % des élèves sont dans le privé sous contrat, financé aux trois quarts par l’argent public, avec des familles nettement plus aisées en moyenne.',
    prompt: 'Votre décision',
    choix: CHOIX_PRIVE.map((c) => ({ titre: c.titre, det: c.det })),
    retour: (i) => ({ titre: 'Ce que cela donne', html: true, texte: lectureCarte(q, restitution, CHOIX_PRIVE[i].v), bouton: 'Signer la carte scolaire' }),
    fin: (i) => suivant({ restitution, prive: CHOIX_PRIVE[i].v }),
  });
  premiere();
}
function lectureCarte(q, restitution, prive) {
  const S = ETAT.s;
  const postes = Math.round(restitution * q.postesLiberables);
  const eco = postes * K.CADRAGE.coutETPhorsCAS * 1000;
  const divisions = (S.eleves * 1000) / S.ratioED;
  const ratioApres = ((S.eleves + q.baisse) * 1000) / Math.max(1000, divisions - postes / 1.35);
  const ecart2 = postes + q.schemaDemande;
  const bercy = ecart2 >= 0 ? 'Bercy est servi.' : 'Bercy n’a pas son compte : il vous le rappellera en juillet.';
  const maires = restitution > K.SEUIL_COLERE_MAIRES ? ' Les maires vont se fâcher : des écoles ferment.' : '';
  const priv = prive > 0.78 ? ' Le privé sous contrat se mobilise : une provocation de plus, et c’est la guerre scolaire.' : prive < 0.35 ? ' L’écart entre public et privé se creuse.' : '';
  return `<b>${fmt0(postes)} postes rendus</b>, ${fmt0(eco)} millions d’euros dégagés pour vos mesures. Élèves par classe : ${fmt1(S.ratioED)} aujourd’hui, ${fmt1(ratioApres)} à la rentrée. ${bercy}${maires}${priv}`;
}

/* --- les mesures, par petits lots : une décision par page -------------------- */
const FORMULES_SALAIRE = [
  { titre: 'Une prime pour tous', montant: 0.8, instrument: 'prime', cible: 'tous',
    det: 'Pas une hausse de salaire : elle ne compte pas pour la retraite et un successeur peut l’arrêter. Bercy préfère.' },
  { titre: 'Rattraper le milieu de carrière', montant: 1.3, instrument: 'indiciaire', cible: 'milieux',
    det: 'Une vraie hausse pour ceux qui ont quinze à vingt-cinq ans de métier et ont le plus décroché. Rien pour les débutants.' },
  { titre: 'Attirer des candidats : les débuts de carrière', montant: 1.3, instrument: 'indiciaire', cible: 'debuts',
    det: 'Ce que regarde un étudiant qui hésite à passer le concours. Les collègues de milieu de carrière comptent leurs années.' },
  { titre: 'Payer des missions en plus : le « pacte »', montant: 1.0, instrument: 'pacte', cible: 'tous',
    det: 'On paie du travail supplémentaire, pas le travail existant. Un tiers des professeurs le prend ; les autres sont fatigués.' },
];
const MOMENTS_MESURES = {
  prise_fonction: { type: 'Prise de fonction', titre: 'Vos premières annonces', regle: 'Deux annonces au maximum : au-delà, plus personne ne retient rien.', chapo: 'Les lycéens attendent que les deux premières répondent à l’automne 2026.' },
  rentree: { type: 'Circulaire de rentrée', titre: 'Que dit-on aux écoles ?', regle: 'Une ou deux mesures, pas davantage.', chapo: 'La circulaire porte un message, pas un programme.' },
  livraison: { type: 'Après le classement international', titre: 'Vos annonces de ce soir', regle: 'Trois mesures pour le niveau des élèves.', chapo: 'La salle des professeurs applaudira, haussera les épaules, ou déposera un préavis.' },
  janvier: { type: 'Le budget de l’année', titre: 'Que portez-vous cette année ?', regle: 'Jusqu’à trois annonces. Seul moment où l’on peut dépasser son enveloppe, si le Premier ministre tranche.', chapo: 'L’argent de l’année devient des décisions.' },
};

/* Le budget en un coup d'œil et l'échelle de preuve, pour la note. */
function corpsBudgetEtPreuve(q) {
  const S = ETAT.s;
  const z = el('div', 'fiche-corps');
  const M = K.CADRAGE.missionHorsCAS;
  const salaires = M * K.CADRAGE.partMasseSalariale;
  const engages = S.chargesRecurrentes;
  const libre = Math.max(0, q.tresor);
  const autres = Math.max(0, M - salaires - engages - libre);
  const pc = (x) => Math.max(0.35, (x / M) * 100).toFixed(2) + '%';
  z.appendChild(el('div', 'budget-bloc', `
    <div class="titre-b"><span>Le budget du ministère</span><b>${fmt1(M)} Md€/an</b></div>
    <div class="budget-barre" aria-hidden="true"><i class="salaires" style="width:${pc(salaires)}"></i><i class="autres" style="width:${pc(autres)}"></i><i class="engage" style="width:${pc(engages)}"></i><i class="libre" style="width:${pc(libre)}"></i></div>
    <div class="budget-legende">
      <span><i class="puce" style="background:var(--filet)"></i>masse salariale <b>${fmt1(salaires)} Md€</b> (1,2 M d’agents)</span>
      <span><i class="puce" style="background:var(--filet-fort)"></i>dépenses déjà engagées</span>
      <span><i class="puce" style="background:var(--c-paix)"></i>vos mesures passées <b>${fmt0(engages * 1000)} M€/an</b> (à vie)</span>
      <span><i class="puce" style="background:var(--c-sante)"></i>votre marge <b>${fmt0(libre * 1000)} M€</b> (${fmt1((libre / M) * 100)} %)</span>
    </div>`));
  z.appendChild(el('p', 'pg-info', '<b>Comment lire une mesure.</b> Elle dit combien elle coûte, qui la défend dans la vraie vie, et ce qu’on sait de son effet : « solide » quand des dizaines d’études concordent, « fragile » quand il y en a une ou deux, « personne ne sait » quand il n’y en a aucune. L’effet d’image se voit tout de suite et s’use ; l’effet réel arrive plus tard, vous le verrez au bilan. Rien ne s’applique sans les professeurs.'));
  z.appendChild(corpsFiche('preuve'));
  return z;
}

function ecranMesures(q) {
  const S = ETAT.s;
  const MOM = MOMENTS_MESURES[q.moment] || MOMENTS_MESURES.janvier;
  const enveloppe = q.tresor, capital = q.capital;
  const selection = new Map();   // id -> options
  const ordreFam = [];
  q.dispo.forEach((c) => { if (!ordreFam.includes(c.famille)) ordreFam.push(c.famille); });
  const tout = ordreFam.flatMap((f) => q.dispo.filter((c) => c.famille === f));
  let pool = [...tout];
  let rang = 0;
  const ici = (q.nouveaux || []).map((id) => PAR_ID[id]).filter((c) => c && q.dispo.includes(c));

  const coutSel = () => { let cout = 0, pol = 0;
    for (const [id, opt] of selection) { const c = PAR_ID[id]; const k = coutDe(c, opt); cout += k.cout; pol += c.perimetre === 'matignon' ? k.pol * 2 : k.pol; }
    return { cout, pol }; };
  const moinsCherFormule = () => Math.min(...FORMULES_SALAIRE.map((f) => chiffrerRevalorisation(f.montant, f.instrument, f.cible).coutAvecCAS));

  function etat(c) {
    const { cout, pol } = coutSel();
    const k = coutDe(c, c.parametrique === 'revalorisation' ? { montant: FORMULES_SALAIRE[0].montant, instrument: FORMULES_SALAIRE[0].instrument, cible: FORMULES_SALAIRE[0].cible } : {});
    const kPlancher = c.parametrique === 'revalorisation' ? { cout: moinsCherFormule(), pol: k.pol } : k;
    const polC = c.perimetre === 'matignon' ? kPlancher.pol * 2 : kPlancher.pol;
    if (!q.depassementAutorise && cout + kPlancher.cout > enveloppe + 1e-9) return { off: true, raison: `Trop cher : reste ${fmt0(Math.max(0, enveloppe - cout) * 1000)} M€` };
    if (pol + polC > capital) return { off: true, raison: 'le gouvernement ne suit pas' };
    if (q.depassementAutorise && cout + kPlancher.cout > enveloppe + 1e-9) return { off: false, depasse: true };
    return { off: false };
  }

  function etape() {
    /* Ce qui était trop cher à la première page l'est encore : on ne le remontre pas. */
    if (rang > 0) pool = pool.filter((c) => !etat(c).off);
    if (selection.size >= q.maxAnnonces || pool.length === 0) { terminer(); return; }
    const lot = pool.slice(0, 3);
    const { cout } = coutSel();
    const reste = enveloppe - cout;
    const retenues = [...selection.keys()].map((id) => `« ${PAR_ID[id].label.split(' : ')[0]} »`).join(', ');
    const premier = rang === 0;
    const info = [
      premier ? (q.cadrage ? '' : `${MOM.regle} ${MOM.chapo}`) : (retenues ? `Déjà retenu : ${esc(retenues)}.` : 'Rien de retenu pour l’instant.'),
    ];
    if (premier && q.cadrage) info.unshift(`<b>${esc(q.cadrage.titre)}.</b> Le menu ne propose que des réponses aux lycéens, venues de camps différents.`);
    if (premier && q.mesureFlechee && PAR_ID[q.mesureFlechee]) info.push(`<small>Bercy attend que vous portiez « ${esc(PAR_ID[q.mesureFlechee].label)} ».</small>`);
    const extra = (premier && ici.length) ? el('p', 'pg-neuf', `<b>Nouveau sur votre bureau :</b> ${ici.map((c) => esc(c.label.split(' : ')[0])).join(' · ')}`) : null;
    const choix = lot.map((c) => {
      const e = etat(c);
      let tags = motsCarte(c, enveloppe);
      if (e.off) tags = [tags[0]];
      if (e.depasse) tags.push(['dépasse l’enveloppe', 'neg']);
      return { titre: c.label, tags, detail: detailCarte(c), off: e.off, raison: e.raison || '', carte: c };
    });
    choix.push({ titre: pool.length > lot.length ? 'Pas celles-là, voir d’autres dossiers' : (selection.size ? 'Rien d’autre' : 'Aucune de celles-là'), autre: true });
    page({
      kicker: MOM.type, picto: 'liste', pas: `Annonce ${selection.size + 1} sur ${q.maxAnnonces}`,
      titre: premier ? MOM.titre : 'Un autre dossier ?', illus: premier ? 'bureau' : null,
      info: info.join('<br>'), extra,
      notes: [{ label: 'Budget et niveaux de preuve : demander une note', kicker: 'Note de la DGESCO', titre: 'Le budget et ce qu’on sait d’une mesure', corps: () => corpsBudgetEtPreuve(q) }],
      prompt: `Laquelle annoncez-vous ? · ${fmt0(Math.max(0, reste) * 1000)} M€ · soutien ${fmt0(capital)}`,
      choix,
      retour: (i, ch) => (ch.carte ? { titre: 'Vous l’annoncez', texte: ch.carte.mot, bouton: 'Continuer' } : null),
      fin: (i, ch) => {
        if (!ch.carte) { pool = pool.filter((c) => !lot.includes(c)); rang += 1; etape(); return; }
        choisir(ch.carte);
      },
    });
  }

  function choisir(c) {
    pool = pool.filter((x) => x !== c);
    rang += 1;
    if (c.parametrique === 'revalorisation') {
      const { cout, pol } = coutSel();
      const choix = FORMULES_SALAIRE.map((f) => {
        const r = chiffrerRevalorisation(f.montant, f.instrument, f.cible);
        const trop = !q.depassementAutorise && cout + r.coutAvecCAS > enveloppe + 1e-9;
        return { titre: f.titre, off: trop, raison: trop ? `Trop cher : il vous reste ${fmt0(Math.max(0, enveloppe - cout) * 1000)} M€.` : '',
          tags: [`${fmt1(r.coutAvecCAS)} Md€/an`, `+${fmt0(r.euroParMois)} €/mois`],
          detail: { kicker: 'Revalorisation', titre: f.titre, corps: `<p class="pg-info">${fr(f.det)}</p><p class="pg-info"><b>Concerne</b> ${fmt0(r.concernes)} professeurs. <b>Soit</b> +${fmt0(r.euroParMois)} € brut par mois en moyenne. <b>Coût pour l’État${r.instrument.cas ? ', retraites comprises' : ''} :</b> ${fmt1(r.coutAvecCAS)} Md€ par an.</p><p class="pg-info">${esc(r.instrument.note)} ${esc(r.cible.note)}</p>` },
          formule: f };
      });
      page({
        kicker: MOM.type, picto: 'pieces', pas: 'Revalorisation',
        titre: 'Combien, pour qui, comment ?',
        info: `La revalorisation des salaires a trois réglages : le montant, la façon de verser, et la cible. Voici quatre formules. Il vous reste ${fmt0(Math.max(0, enveloppe - cout) * 1000)} M€.`,
        choix,
        fin: (i, ch) => { selection.set(c.id, { montant: ch.formule.montant, instrument: ch.formule.instrument, cible: ch.formule.cible }); etape(); },
      });
      return;
    }
    if (c.parametrique === 'financement19') {
      const cles = Object.keys(FINANCEMENT_19);
      page({
        kicker: MOM.type, picto: 'plan', pas: 'Financement',
        titre: 'Comment financez-vous les classes à 19 ?',
        info: 'Cette mesure se finance de deux manières, très différentes.',
        choix: cles.map((cle) => ({ titre: FINANCEMENT_19[cle].label, det: FINANCEMENT_19[cle].mot, tags: [`${fmt0(FINANCEMENT_19[cle].cout * 1000)} M€`] })),
        fin: (i) => { selection.set(c.id, { financement: cles[i] }); etape(); },
      });
      return;
    }
    selection.set(c.id, {});
    etape();
  }

  function terminer() {
    if (!selection.size && q.moment === 'janvier') {
      page({
        kicker: MOM.type, picto: 'liste', pas: 'Votre décision',
        titre: 'Ne rien annoncer de toute l’année ?',
        info: 'Ne rien annoncer laisse le système souffler (fatigue −8), et fait écrire « ministre invisible » (soutien −7, parents −3,5).',
        choix: [
          { titre: 'Revenir aux dossiers', det: 'Vous reprenez la liste depuis le début.' },
          { titre: 'Ne rien annoncer cette année', det: 'Le système souffle. La presse, moins.' },
        ],
        fin: (i) => { if (i === 0) { pool = [...tout]; rang = 0; etape(); } else suivant([]); },
      });
      return;
    }
    suivant([...selection].map(([id, options]) => ({ id, options })));
  }
  etape();
}

/* --- rentrée : les lycées se bloquent --------------------------------------- */
function ecranBlocus(q) {
  const B = q.blocus;
  const chips = (q.nonTenues && q.nonTenues.length)
    ? el('p', 'pg-promesses', `<b>Sans réponse :</b> ${q.nonTenues.map((p) => `<span>✗ ${esc(p.libelle.split(' : ')[0].split(',')[0])}</span>`).join(' ')}`)
    : el('p', 'pg-promesses', '<b>Vous avez répondu aux cinq chantiers de 2026.</b> Les lycéens le savent, et ils ont trouvé autre chose.');
  page({
    kicker: q.n === 1 ? 'Rentrée, les lycées bloqués' : 'Rentrée, les lycées bloqués, encore', picto: 'megaphone', pas: ETAT.dateLabel,
    titre: B.titre, papier: true,
    info: fr(B.recit), extra: chips,
    note: noteFiche('lyceens', 'L’automne 2026 des lycéens'),
    prompt: 'Votre réponse',
    choix: B.reponses.map((r) => ({
      titre: r.label, det: r.det,
      tags: [r.colere < 0 ? ['la colère retombe', 'pos'] : ['la colère monte', 'neg'], r.greve ? ['préavis de grève', 'neg'] : ''].filter(Boolean),
      detail: { kicker: 'Votre réponse', titre: r.label, corps: `<p class="pg-info">${fr(r.det)}</p><p class="pg-info">Parents ${signe(r.parents)} · enseignants ${signe(r.adhesion)} · ${r.agenda} semaines d’agenda.</p>` },
    })),
    retour: (i) => ({ titre: 'Ce qui suit', texte: B.reponses[i].suite, bouton: 'Écrire la circulaire de rentrée' }),
    fin: (i) => suivant(i),
  });
}

/* --- rentrée : la polémique qui s'installe ------------------------------------ */
function ecranPolemique(q) {
  const p = q.polemique;
  page({
    kicker: 'Rentrée, la question qui occupe l’antenne', picto: 'tele', pas: ETAT.dateLabel,
    titre: p.titre, papier: true,
    info: fr(p.recit),
    note: noteFiche('climat', 'Le climat scolaire'),
    prompt: 'Votre réponse',
    choix: p.reponses.map((r) => ({
      titre: r.label, det: r.det,
      tags: [[`${r.agenda} semaines d’agenda`, 'neg']],
      detail: { kicker: 'Votre réponse', titre: r.label, corps: `<p class="pg-info">${fr(r.det)}</p><p class="pg-info">${[r.parents ? `parents ${signe(r.parents)}` : '', r.adhesion ? `enseignants ${signe(r.adhesion)}` : '', r.presse ? `presse ${signe(r.presse)}` : '', r.credibilite ? `parole ${signe(r.credibilite)}` : '', r.capital ? `soutien ${signe(r.capital)}` : ''].filter(Boolean).join(' · ')}</p><p class="pg-info">Aucune de ces réponses ne touche un compteur d’acquis : elles décident de combien de semaines vous parlerez d’autre chose que d’école.</p>` },
    })),
    retour: (i) => ({ titre: 'Ce qui suit', texte: p.reponses[i].suite, bouton: 'Passer à la rentrée' }),
    fin: (i) => suivant(i),
  });
}

/* --- rentrée ratée : la communication ------------------------------------------ */
function ecranRentree() {
  const S = ETAT.s;
  page({
    kicker: 'Cellule de crise, rentrée', picto: 'ecole', pas: ETAT.dateLabel,
    titre: 'Des classes sans professeur, et un micro devant vous', illus: 'cour',
    info: `<b>${fmt1(100 - S.phys.couvertureConcours)} %</b> des postes n’ont pas trouvé de candidat au concours. <b>${fmt1(S.phys.heuresNonAssurees)} %</b> des heures de cours ne sont pas assurées. Le comptage syndical des classes sans enseignant a commencé à 8 h 07. Il est 8 h 12.`,
    note: noteFiche('moyens', 'Le remplacement des professeurs'),
    choix: [
      { titre: 'Assumer les chiffres', det: '« La situation est difficile, voici ce que nous faisons. » Les personnels entendent qu’on ne leur ment pas ; l’opposition entend un aveu. Les deux ont raison.' },
      { titre: 'Contester le comptage syndical', det: '« Ces chiffres ne correspondent à aucune réalité observable. » Défendable une fois. La réalité observable, elle, revient chaque matin à 8 h.' },
    ],
    fin: (i) => suivant(['assumer', 'contester'][i]),
  });
}

/* --- octobre : l'audience syndicale ----------------------------------------- */
function ecranAudience(q) {
  const { org, audience, soutien } = q;
  const S = ETAT.s;
  const premiere = S.annee === 1;
  const soutienHtml = soutien
    ? `<br><small><b>Avant le conflit, la délégation tient à le dire :</b> sur « ${esc(soutien.label.split(/ : |, /)[0])} », elle est avec vous, mais ne le dira pas publiquement. Une organisation ne demande pas le retrait de ce qu’elle défend.</small>` : '';
  page({
    kicker: 'Audience, rentrée sociale', picto: 'megaphone', pas: ETAT.dateLabel,
    titre: `Face à face : ${org.nom}`, illus: 'delegation',
    info: `Le syndicat de professeurs le plus important du moment (${fmt1(org.poids)} % aux élections), ${PROFILS_L[org.profil]}.${premiere ? ' La délégation s’assoit et pose UNE question :' : ''}<br><i>${fr(audience.question(S))}</i>${soutienHtml}`,
    note: noteFiche('metier', 'Le métier enseignant'),
    prompt: premiere ? 'Il n’y a pas de bonne réponse dans l’absolu, seulement une bonne réponse à ce profil-là' : 'Votre réponse',
    choix: audience.reponses.map((r) => ({ titre: `${{ ferme: 'Fermeté', methode: 'Méthode', concession: 'Concession' }[r.type]} — ${r.titre}` })),
    retour: (i) => {
      const r = audience.reponses[i];
      const mult = (RECEPTION[org.profil] || {})[r.type] || 0;
      const verdict = mult >= 0.8 ? 'bien' : mult >= 0 ? 'froid' : 'mal';
      const lab = verdict === 'bien' ? '✓ Bien pris' : verdict === 'froid' ? '— Accueilli froidement' : '✗ Très mal reçu';
      return { titre: `${lab} par ${org.nom}`, ton: verdict, html: true, texte: `<i>${esc(alea(REPLIQUES[verdict]))}</i><br>${fr(r.mot)}`, bouton: 'Clore l’audience' };
    },
    fin: (i) => suivant(i),
  });
}

/* --- la revendication : céder ou maintenir (deux pages) ---------------------- */
function ecranRetrait(q) {
  const { org, carte, mesure, risque, combatif } = q;
  const arg = q.argumentaire || {};
  const S = ETAT.s;
  page({
    kicker: 'Audience, la revendication', picto: 'megaphone', pas: 'ce qu’on vous oppose',
    titre: `${org.nom} exige un retrait`, papier: true, illus: 'audience',
    info: `Elle vise « ${esc(carte.label.split(' : ')[0].split(' ').slice(0, 14).join(' '))} ». « Nous voterons contre et nous appellerons à la grève. » Deux arguments vous sont opposés : apprenez à les distinguer.`,
    extra: el('div', 'argumentaire', `
      <div class="arg arg-d"><span class="etiq">Argument étayé, vérifiable</span><p class="dit">${fr(arg.etaye || '')}</p></div>
      <div class="arg arg-p"><span class="etiq">Argument de principe, non vérifiable</span><p class="dit">${fr(arg.principe || '')}</p></div>`),
    note: { label: 'Que vaut chaque argument ? Demander une note', kicker: 'Note de la DGESCO', titre: 'Étayé ou de principe ?', corps: `<p class="pg-info"><b>L’argument étayé :</b> ${fr(arg.verifiable || '')}</p><p class="pg-info"><b>L’argument de principe :</b> ${S.annee <= 2 ? 'ce n’est pas une donnée, c’est une conception de l’école : parfaitement légitime, et non mesurable. Confondre les deux registres est ce qui rend illisibles la plupart des débats sur l’école, programmes des candidats compris.' : 'légitime, et non mesurable : une conception de l’école, pas un résultat d’étude.'}</p>` },
    bouton: { label: 'Répondre à la délégation' },
    fin: () => decision(),
  });
  function decision() {
    page({
      kicker: 'Audience, la revendication', picto: 'megaphone', pas: 'votre réponse',
      titre: `Que répondez-vous à ${org.nom} ?`,
      info: `Céder retire vraiment la mesure : ses ${fmt0(mesure.cout * 1000)} M€ par an reviennent à votre marge, ses effets à venir sont annulés.`,
      choix: [
        { titre: 'Maintenir la mesure', det: '« Cette mesure a été décidée, elle sera appliquée. » Soutien +2, adhésion en baisse.', tags: [[combatif && risque ? `grève probable (~${fmt1(risque.tauxMinistere)} %)` : 'grève contenue', combatif && risque ? 'neg' : 'pos']] },
        { titre: 'Requalifier : la renommer et la rendre facultative', det: `L’annonce est sauvée, le dispositif se vide, et les ${fmt0(mesure.cout * 1000)} M€ par an continuent d’être dépensés. Le geste le moins coûteux du jeu, et le seul dont le prix n’apparaît qu’au bilan.`, tags: [['grève désamorcée', 'pos'], ['effet réel : au bilan', 'neg']] },
        { titre: 'Céder : retirer la mesure', det: `Adhésion en hausse, ${fmt0(mesure.cout * 1000)} M€ par an récupérés, mais soutien −4, fatigue +15, parents déçus. Les effets attendus ne viendront jamais.`, tags: [['grève désamorcée', 'pos']] },
      ],
      retour: (i) => {
        const dec = ['maintenir', 'requalifier', 'ceder'][i];
        return { ton: dec === 'ceder' ? 'bien' : dec === 'requalifier' ? 'froid' : 'mal', html: true, bouton: 'Clore l’audience',
          titre: dec === 'ceder' ? 'Vous cédez' : dec === 'requalifier' ? 'Vous requalifiez' : 'Vous maintenez',
          texte: dec === 'ceder'
            ? '<i>« Nous avons gagné ce combat, mais la mobilisation se poursuit, pour les salaires ! »</i> La mesure sort du droit. La presse titrera sur le recul ; les salles des professeurs, sur l’écoute.'
            : dec === 'requalifier'
            ? '<i>« Nous prenons acte de cet ajustement de méthode. »</i> Personne ne parlera de recul : le dispositif existe encore, sous un autre nom, et ne s’impose plus à personne.'
            : `<i>« Nous allons appeler à une grève générale. »</i> ${combatif ? 'La délégation quitte l’audience. Le préavis sera déposé avant la fin de semaine.' : 'La délégation transmettra à ses instances. Le rapport de force est noté, de part et d’autre.'}` };
      },
      fin: (i) => suivant(['maintenir', 'requalifier', 'ceder'][i]),
    });
  }
}

/* --- octobre : la livraison internationale ------------------------------------ */
function ecranLivraison(q) {
  const L = q.livraison;
  const b = CADRAGE_INITIAL.find((x) => x.cle === 'niveaux');
  page({
    kicker: 'Livraison internationale, 11 heures', picto: 'globe', pas: ETAT.dateLabel,
    titre: L.titre, illus: 'classe',
    info: `${fr(L.recit)}<br><b>Ce que le poste exige :</b> ${fr(L.contrainte)}`,
    figure: b ? { v: b.accroche.v, l: 'perdus en mathématiques par les élèves de 15 ans entre 2018 et 2022 : la plus forte baisse mesurée en France', src: b.accroche.src } : null,
    note: noteFiche('niveaux', 'Des résultats préoccupants'),
    bouton: { label: 'Préparer les annonces de ce soir' },
    fin: () => suivant(null),
  });
}

/* --- décembre : le plateau de vingt heures — une question par page ------------- */
function ecranPlateau(q) {
  const P = q.plateau;
  const rep = new Array(P.questions.length).fill(null);
  const poser = (k) => {
    if (k >= P.questions.length) { suivant(rep); return; }
    const qu = P.questions[k];
    page({
      kicker: 'Journal de 20 heures, plateau', picto: 'tele', pas: `Question ${k + 1} sur ${P.questions.length}`,
      titre: qu.q, papier: true, illus: k === 0 ? 'plateau' : null,
      info: k === 0 ? fr(P.recit) + (qu.aparte ? `<br><i>${fr(qu.aparte)}</i>` : '') : (qu.aparte ? `<i>${fr(qu.aparte)}</i>` : ''),
      prompt: 'Que répondez-vous ?',
      choix: qu.reponses.map((r) => ({ titre: r.label })),
      retour: (i) => { const r = qu.reponses[i]; return { titre: r.derapage ? 'Dérapage' : 'En plateau', ton: r.derapage ? 'mal' : '', texte: r.suite, bouton: k < P.questions.length - 1 ? 'Question suivante' : 'Quitter le plateau' }; },
      fin: (i) => { rep[k] = i; poser(k + 1); },
    });
  };
  poser(0);
}

/* --- l'affaire : la polémique qui ne concerne pas l'école ------------------------ */
function ecranAffaire(q) {
  const a = q.affaire, S = ETAT.s;
  let rappel = '';
  if (q.menti) {
    const qE = ENTRETIEN.find((x) => x.reponses.some((r) => r.mensonge && (r.expose || []).includes(a.id)));
    const rE = qE && qE.reponses.find((r) => r.mensonge && (r.expose || []).includes(a.id));
    if (rE) rappel = `<br><b>Ce n’est pas l’affaire qui coûte, c’est votre réponse à l’Élysée :</b> <i>${esc(rE.label)}</i>. Elle ressort ce soir.`;
  }
  const resonne = q.resonne ? '<br><b>Le calendrier n’est pas un hasard :</b> le dossier ressort au moment où vous légiférez sur le même sujet.' : '';
  page({
    kicker: 'Revue de presse, affaire personnelle', picto: 'alerte', pas: ETAT.dateLabel,
    titre: a.manchette, papier: true,
    info: `${fr(a.recit)}${resonne}${rappel}`,
    note: { label: 'Ce que ce type d’affaire enseigne', kicker: 'Note du cabinet', titre: 'Ce que cette affaire enseigne', corps: `<p class="pg-info">${fr(a.lecon)}</p><p class="pg-info">Votre crédibilité est aujourd’hui de <b>${fmt0(q.credibilite)}/100</b> : c’est elle qui décide de ce que valent vos annonces. Aucune de ces réponses ne touche un compteur éducatif, et c’est bien le problème du métier. Une affaire n’est pas une culpabilité : une sur quatre se dégonfle. Mais un démenti ne rend que la moitié des points perdus.</p>` },
    prompt: 'Votre réponse',
    choix: a.reponses.map((r) => ({
      titre: r.label, det: r.det,
      tags: [r.unite ? ['unité syndicale immédiate', 'neg'] : '', r.fatal ? ['peut mettre fin au mandat', 'neg'] : '', r.captation ? ['l’Élysée annoncera votre prochaine mesure', 'neg'] : ''].filter(Boolean),
      detail: { kicker: 'Votre réponse', titre: r.label, corps: `<p class="pg-info">${fr(r.det)}</p><p class="pg-info">${[r.adhesion ? `adhésion ${signe(r.adhesion)}` : '', r.credibilite ? `parole ${signe(r.credibilite)}` : '', r.capital ? `soutien ${signe(r.capital)}` : '', r.parents ? `parents ${signe(r.parents)}` : '', r.fragilise ? `fragilise ${r.fragilise} an${r.fragilise > 1 ? 's' : ''}` : ''].filter(Boolean).join(' · ')}</p>` },
    })),
    retour: (i) => { const r = a.reponses[i]; return { titre: 'La suite', ton: r.type === 'assumer' ? 'bien' : r.type === 'defendre' ? 'froid' : 'mal', texte: r.suite, bouton: 'Passer à autre chose' }; },
    fin: (i) => suivant(i),
  });
}

/* --- l'été : le dossier de crise ------------------------------------------------ */
const NOTES_DOSSIER = {
  lyceens_ete: () => noteFiche('lyceens', 'L’automne 2026 des lycéens'),
};
function ecranDossier(q) {
  const dos = q.dossier;
  const n = NOTES_DOSSIER[dos.id] ? NOTES_DOSSIER[dos.id]() : (dos.faits ? noteFaits(dos.titre, dos.faits, dos.lecture) : null);
  page({
    kicker: 'L’été des cent jours, dossier de crise', picto: 'dossier', pas: 'été 2027',
    titre: dos.titre, papier: true,
    info: fr(dos.contexte),
    note: n || undefined,
    choix: dos.options.map((o) => ({ titre: o.titre })),
    retour: (i) => ({ titre: 'Ce que cette décision vous apprend', texte: dos.options[i].decryptage, bouton: 'Poursuivre' }),
    fin: (i) => suivant(i),
  });
}
/* ============================================================================
   LES PAGES SANS DÉCISION : la revue de presse du mois, et le bilan en pages.
   ========================================================================== */

/* La revue de presse : la une, les brèves du mois, le fil social. */
function corpsRevuePresse(une, entrees, etape) {
  const S = ETAT.s;
  const j = el('div', 'journal petit');
  j.innerHTML = `<div class="manchette"><span class="titre-j">${CAST.journal}</span><span class="ours">${ETAT.dateLabel}</span></div>
    <h3 class="une">${une.titre}</h3><p class="sous-une">${une.sous}</p>`;
  if (entrees.length) {
    const br = el('div', 'breves');
    for (const e of entrees.slice(0, 6)) br.appendChild(el('div', 'breve', `${fr(e.texte)} <span class="sig">${alea(CAST.breves)}</span>`));
    j.appendChild(br);
  } else {
    j.appendChild(el('p', 'sous-une', 'Rien de notable ce mois-ci : le système avance seul, et vos mesures précédentes produisent leurs effets.'));
  }
  const fil = el('div', 'fil');
  const dispo = COMPTES.filter((c) => c.quand(S));
  for (const c of dispo.sort(() => Math.random() - 0.5).slice(0, 2)) {
    fil.appendChild(el('div', 'post', `<span class="auteur">${c.a}</span> <span class="pseudo">${c.p}</span><p>${alea(c.posts)}</p>`));
  }
  const z = el('div', '');
  z.append(j, fil);
  return z;
}

function ecranEtape(etape) {
  const S = ETAT.s;
  const entrees = nouvellesEntrees();
  const une = unesPossibles(etape)[0];
  const notes = [];
  let chiffres = null, info = `${une.sous}`, kicker = 'Revue de presse', picto = 'journal', titre = une.titre, label = 'Continuer';
  const ctx = {
    automne: 'L’automne est passé. En janvier, la carte scolaire ; en mai, l’élection.',
    election: S.fini ? 'Votre passage rue de Grenelle s’arrête ici. Le bilan, lui, continue.' : 'Vous restez. L’été 2027 commence, avec la lettre de Bercy.',
    ouverture: 'Votre feuille de route est déclarée. L’été, lui, a ses propres plans.',
    juillet: 'La double sanction de juillet est tombée : lettre plafond et concours.',
    decembre: 'Budget voté, publications de décembre.',
    mars: 'Les mobilisations de printemps.',
    cloture: `Fin de l’année scolaire, ${S.annee} sur ${K.DUREE_MANDAT}.`,
  }[etape] || '';

  if (etape === 'automne') {
    kicker = 'Fin de l’automne 2026'; picto = 'megaphone';
    const dec = Object.values(S.coleres.decisions).filter((d) => d && !String(d).startsWith('posture:')).length;
    let accord = 0, total = 0;
    for (const c of COLERES) { const a = S.coleres.avis[c.id]; if (!a) continue; total++; if (c.verdict === 'ouverte' ? a === 'partielle' : a === c.verdict) accord++; }
    chiffres = [
      { v: String(dec), l: dec > 1 ? 'mesures annoncées' : 'mesure annoncée' },
      { v: humeurLyceenne(S.lyceens.colere), l: 'les lycéens' },
      { v: `${accord}/${total}`, l: 'avis proches des faits' },
    ];
    notes.push({ label: 'Ce que vous pensiez, ce que disaient les faits', kicker: 'Votre automne', titre: 'Ce que vous pensiez, ce que disaient les faits', corps: () => blocMiroir(S) });
  }
  if (etape === 'election') {
    kicker = 'Mai 2027, l’élection présidentielle'; picto = 'drapeau';
    titre = S.fini ? 'Un nouveau gouvernement, et votre nom n’y figure pas' : une.titre;
    info = S.fini ? fr(S.fin.texte) : 'Un nouveau président est élu. Dans la vraie vie, le ministre de l’Éducation change presque toujours à ce moment-là. Dans le jeu, <b>vous restez</b> : la seule entorse à la réalité, qui sert à voir ce que vos décisions de l’automne produisent.';
    if (S.fini) label = 'Voir le bilan';
  }
  if (etape === 'ouverture' && S.doctrine) {
    kicker = 'La presse décode votre feuille de route';
    info = S.doctrine.slice(0, 2).map((c) => fr(K.PROJETS_2027[c].decode)).join('<br>');
    titre = 'Votre feuille de route, lue par la presse';
  }
  if (etape === 'cloture') {
    kicker = `Fin de l’année ${2026 + S.annee}‑${(2027 + S.annee) % 100}`; picto = 'drapeau';
    if (repereAnnee && repereAnnee.annee === S.annee) {
      const ordre = (S.doctrine || Object.keys(NOMS_C)).slice(0, 3);
      let hausse = 0, baisse = 0;
      chiffres = ordre.map((c) => {
        const v0 = repereAnnee.v[c], v1 = S.affiche[c], d = v1 - v0;
        if (d > 0.5) hausse++; else if (d < -0.5) baisse++;
        return { v: Math.abs(d) > 0.5 ? `${d > 0 ? '▲' : '▼'} ${motJauge(v1)}` : motJauge(v1), l: NOMS_COURTS[c] + (Math.abs(d) > 0.5 ? ` (${signe(d)})` : ' (stable)') };
      });
      info = `${une.sous}<br><small>${hausse === 3 ? 'Trois compteurs en hausse : une année comme les ministres n’en ont pas deux.' : baisse === 3 ? 'Trois compteurs en baisse. L’effet d’annonce s’est évaporé ; l’effet réel n’est pas encore arrivé.' : hausse + baisse === 0 ? 'Rien n’a bougé de plus d’un demi-point : le système avance à la vitesse d’un paquebot.' : 'Ce que vous voyez, c’est l’affiché. Le réel s’ouvre au bilan, scellé par scellé.'}</small>`;
    }
    const ouverts = S.effetsEnAttente.filter((e) => e.anneeOuverture === S.annee && !e.retire);
    if (ouverts.length) notes.push({ label: 'Les scellés ouverts cette année', kicker: 'Fin d’année', titre: 'Les effets réels arrivent', corps: () => {
      const sc = el('div', 'scelles');
      for (const e of ouverts) {
        const c = PAR_ID[e.carte];
        sc.appendChild(el('div', 'ligne-s', `<span>${esc(c ? c.label.split(' : ')[0] : e.carte)}${e.requalifie ? '<span class="requal"> requalifiée</span>' : ''}</span><span>→ ${NOMS_C[e.compteur]}</span>
          <span class="val" style="color:${e.montant > 1 ? 'var(--ok)' : e.montant < -1 ? 'var(--alerte)' : 'var(--encre-2)'}">${signe(e.montant)}</span>
          <span style="color:var(--encre-3);font-size:.76rem">preuve ${'🔒'.repeat(e.cadenas)} · documenté ~${signe(e.central)}${e.requalifie ? ' · rendue facultative' : ''}</span>`));
      }
      sc.appendChild(el('p', 'pg-info', 'Ce que vous aviez signé sous incertitude entre aujourd’hui dans les compteurs. Le reste s’ouvrira plus tard, parfois après vous.'));
      return sc;
    } });
    if (S.annee >= 2) notes.push({ label: 'Ce que la presse politique lit dans vos annonces', kicker: 'Fin d’année', titre: 'D’où viennent vos mesures', corps: () => blocBoussole(S) });
    if (S.lyceens) notes.push({ label: 'Et les lycéens ?', kicker: 'Fin d’année', titre: 'Les lycéens', corps: () => blocLyceens(S, false) });
  }
  notes.push({ label: 'Lire la revue de presse', kicker: 'Revue de presse', titre: ETAT.dateLabel, corps: () => corpsRevuePresse(une, entrees, etape) });
  ETAT.journalLu = S.journal.length;

  page({
    kicker, picto, pas: ETAT.dateLabel,
    titre, titreHtml: true,
    papier: true, illus: null,
    info: `${etape === 'ouverture' || (etape === 'election' && S.fini) ? '' : ''}${info}${ctx ? `<br><small>${ctx}</small>` : ''}`,
    chiffres,
    notes,
    bouton: { label },
    fin: () => suivant(undefined),
  });
}

/* --- le bilan : sept pages, une idée par page ------------------------------ */
function ecranBilan(B) {
  const S = ETAT.s;
  try { localStorage.removeItem(CLE_SAUVE); } catch (e) { /* sans importance */ }
  majBandeau(true);
  const fins = {
    mandat_complet: [`Un automne de crise et ${({ 2: 'deux', 3: 'trois' })[K.DUREE_MANDAT] || K.DUREE_MANDAT} rentrées : le ministre part debout`, 'Arrivé dans les blocus, parti debout : la moyenne dans ce bureau est de deux ans.'],
    election: ['Présidentielle : le ministre des six mois n’est pas reconduit', 'Nommé dans la crise, remercié au changement de gouvernement. Ses décisions de l’automne, elles, restent dans les textes.'],
    renvoi: ['Remanié', 'Trois convocations à Matignon font une porte. Vos cartons connaissaient le chemin.'],
    remaniement: ['Remaniement surprise', 'Rien de personnel. Votre nom équilibrait un tableau qui ne vous concernait pas.'],
    guerre_scolaire: ['Guerre scolaire : le texte retiré, le ministre aussi', 'Un million de personnes dans la rue. Comme en 1984, à la mode près.'],
  }[B.fin.type] || ['Fin de mandat', ''];
  const caches = (B.doctrine || []).slice(3);
  const nom = (id) => (PAR_ID[id] ? PAR_ID[id].label : id);
  const effets = S.effetsEnAttente.filter((e) => !e.retire);
  const parCarte = new Map();
  for (const e of S.effetsEnAttente) { if (!parCarte.has(e.carte)) parCarte.set(e.carte, []); parCarte.get(e.carte).push(e); }
  const rev = ETAT.revanche;

  const detailMesures = () => {
    const t2 = el('div', 'defile');
    let lignes = '';
    for (const [id, effs] of parCarte) {
      lignes += effs.map((e, i) => `<tr>${i === 0 ? `<td rowspan="${effs.length}">${esc(nom(id).split(' : ')[0])}</td>` : ''}
        <td>${NOMS_C[e.compteur]}</td>
        <td class="num">${signe(e.central)} <span title="niveau de preuve">${'🔒'.repeat(e.cadenas)}</span></td>
        <td class="num"><span class="revele ${e.montant > 1 ? 'bon' : e.montant < -1 ? 'mauvais' : ''}">${signe(e.montant)}</span></td>
        <td>${e.retire ? 'retirée' : e.applique ? 'arrivé' : `an ${e.anneeArrivee}${e.anneeArrivee > B.anneesJouees ? ', après vous' : ''}`}</td></tr>`).join('');
    }
    t2.innerHTML = `<table class="bilan"><tr><th>Mesure</th><th>Compteur</th><th class="num">Documenté</th><th class="num">Obtenu</th><th>Horizon</th></tr>${lignes || '<tr><td colspan="5">Aucune mesure engagée.</td></tr>'}</table>
      <p class="pg-info">Effet documenté : la valeur centrale de la littérature, que vous ne voyiez pas en signant. Effet obtenu : ce tirage-là, multiplié par l’implémentation et la capacité d’absorption.</p>`;
    return t2;
  };

  const pages = [];
  /* 1. le verdict */
  pages.push(() => ({
    kicker: 'Le bilan, la vérité, enfin', picto: 'drapeau', titre: fins[0], papier: true, illus: 'demenagement',
    info: `${fr(fins[1] || B.fin.texte)}<br><i>${fr(verdictProse(B))}</i>`,
    chiffres: [
      { v: fmt0(B.scoreAffiche), l: 'ce que le pays a vu' },
      { v: fmt0(B.scoreBilan), l: 'ce que vous avez fait' },
      { v: fmt0(B.scoreProjection), l: B.constance ? 'dans dix ans, cap tenu' : B.fin.type !== 'mandat_complet' ? 'dans dix ans, mandat interrompu' : 'dans dix ans, cap détricoté' },
    ],
  }));
  /* 2. les cinq priorités */
  pages.push(() => {
    const t = el('table', 'bilan court');
    t.innerHTML = `<tr><th>Priorité</th><th class="num">Départ</th><th class="num">Vu</th><th class="num">Réel</th><th class="num">+10 ans</th></tr>`
      + B.doctrine.map((c, i) => `<tr${caches.includes(c) ? ' class="cache"' : ''}><td><span style="color:${COULEURS_C[c]}">●</span> ${NOMS_COURTS[c]} <small>n° ${i + 1}</small></td><td class="num">${fmt0(K.COMPTEURS_INITIAUX[c])}</td><td class="num">${fmt0(B.affiche[c])}</td><td class="num"><b>${fmt0(B.vrai[c])}</b></td><td class="num">${fmt0(B.projection[c])}</td></tr>`).join('');
    return {
      kicker: 'Vos cinq priorités', picto: 'courbe', titre: 'Ce que le pays a vu, et ce qui s’est vraiment passé',
      info: `Vous n’avez jamais vu ${caches.map((c) => NOMS_C_LONGS[c].toLowerCase()).join(' ni ')} : classés quatrième et cinquième, ils étaient tenus sans être affichés. Ils valent ${K.POIDS_DOCTRINE[3] + K.POIDS_DOCTRINE[4]} % de votre note.`,
      extra: t,
    };
  });
  /* 3. ce que vos mesures ont produit */
  pages.push(() => {
    let info;
    if (effets.length) {
      const meilleur = effets.reduce((a, b) => (b.montant > a.montant ? b : a));
      const decu = effets.reduce((a, b) => ((b.central - b.montant) > (a.central - a.montant) ? b : a));
      const apres = effets.filter((e) => e.anneeArrivee > B.anneesJouees);
      const somme = apres.reduce((t, e) => t + e.montant, 0);
      info = [
        `<b>Votre meilleure décision :</b> ${esc(nom(meilleur.carte).split(' : ')[0])}, ${signe(meilleur.montant)} sur ${NOMS_C[meilleur.compteur]}.`,
        (decu.central - decu.montant) > 0.8 ? `<b>Votre plus grosse déception :</b> ${esc(nom(decu.carte).split(' : ')[0])} : ${signe(decu.central)} promis, ${signe(decu.montant)} obtenu. ${decu.cadenas <= 2 ? 'Preuve mince : c’était un pari.' : 'La mesure était solide ; sa mise en œuvre l’a rabotée.'}` : '',
        apres.length ? `<b>${apres.length} effet${apres.length > 1 ? 's' : ''} après votre départ</b> (${signe(somme)} au total) : votre successeur les inaugurera.` : 'Aucun de vos effets n’arrive après vous.',
      ].filter(Boolean).join('<br>');
    } else info = 'Aucune mesure engagée. Le système vous remercie du repos ; l’Histoire, moins.';
    return {
      kicker: 'Vos mesures', picto: 'liste', titre: 'Ce que vos mesures ont réellement produit', info,
      notes: [{ label: 'Le détail, mesure par mesure', kicker: 'Vos mesures', titre: 'Effet documenté, effet obtenu', corps: detailMesures }],
    };
  });
  /* 4. d'où venaient vos mesures */
  pages.push(() => {
    const ids = S.mesuresParAnnee.flat().map((m) => m.id);
    const b = boussole(ids);
    if (!b.total) return { kicker: 'Vos mesures', picto: 'boussole', titre: 'D’où venaient vos mesures', info: 'Vous n’avez rien annoncé. Aucun programme ne peut revendiquer quoi que ce soit : c’est une position, mais pas une politique.' };
    const lignes = el('div', 'bous');
    lignes.innerHTML = Object.entries(BLOCS_2027).map(([cle, meta]) => {
      const n = b.parBord[cle].length, pct = Math.round((n / b.total) * 100);
      return `<div class="bous-l"><span class="lib" style="border-left-color:${meta.coul}">${meta.label}</span><span class="rail"><i style="width:${Math.max(1, pct)}%;background:${meta.coul}"></i></span><span class="v">${n}/${b.total}</span></div>`;
    }).join('');
    return {
      kicker: 'Vos mesures', picto: 'boussole', titre: 'D’où venaient vos mesures',
      info: `Sur vos <b>${b.total}</b> mesures, combien figurent aussi au programme de chaque camp en 2027 (une mesure peut compter dans plusieurs colonnes). <b>${b.horsPartis.length}</b> ne sont portées par aucun parti : elles viennent de la Cour des comptes, de la DEPP, de la recherche. Le jeu ne dit pas de quel bord vous êtes : il dit qui défend ce que vous avez signé.`,
      extra: lignes,
      notes: [{ label: 'Voir lesquelles, bord par bord', kicker: 'Vos mesures', titre: 'D’où venaient vos mesures', corps: () => blocBoussole(S, true) }],
    };
  });
  /* 5. les lycéens */
  pages.push(() => {
    const L = S.lyceens;
    const tenues = K.LYCEENS.promesses.filter((p) => p.themes.some((t) => S.themes.has(t)));
    const rompues = K.LYCEENS.promesses.filter((p) => !p.themes.some((t) => S.themes.has(t)));
    const reponses = [...new Set(L.reponses)];
    const ch = el('ul', 'chantiers');
    ch.innerHTML = tenues.map((p) => `<li class="ok">✓ ${esc(p.libelle)}</li>`).join('') + rompues.map((p) => `<li class="non">✗ ${esc(p.libelle)}</li>`).join('');
    return {
      kicker: 'Les lycéens', picto: 'megaphone', titre: 'Et les lycéens ?',
      info: `Ils sont <b>${humeurLyceenne(L.colere)}</b>. ${L.blocus ? `${L.blocus} rentrée${L.blocus > 1 ? 's' : ''} bloquée${L.blocus > 1 ? 's' : ''} depuis votre arrivée.` : 'Aucune rentrée bloquée depuis votre arrivée.'} Les cinq chantiers de 2026 :`,
      extra: [ch, el('p', 'pg-info', reponses.length
        ? `Vous leur avez répondu par ${reponses.slice(0, 3).map((r) => `« ${esc(r.split(/ : |, /)[0])} »`).join(', ')}${reponses.length > 3 ? ' et d’autres' : ''}. ${L.colere < 45 ? 'Ils ont rangé les pancartes, pas la liste.' : 'Ils ont gardé la liste, et les pancartes.'}`
        : 'Vous ne leur avez rien répondu de précis. Ils ont gardé la liste, les pancartes, et le numéro de votre successeur.')],
      notes: [{ label: 'Ce que vous pensiez, ce que disaient les faits', kicker: 'Les lycéens', titre: 'Ce que vous pensiez, ce que disaient les faits', corps: () => blocMiroir(S) }],
    };
  });
  /* 6. vu de chez vous */
  if (S.territoire) pages.push(() => ({ kicker: 'Chez vous', picto: 'carte', titre: 'Votre département', extra: blocTerritoire(S) }));
  /* 7. doctrine déclarée, doctrine menée */
  pages.push(() => {
    let cmp = null;
    if (rev && rev.precedent && rev.graine === ETAT.graine) {
      const P = rev.precedent;
      cmp = { label: 'Même partie, deux doctrines', kicker: 'La revanche', titre: 'Mêmes tirages, deux doctrines', corps: () => {
        const z = el('div', 'defile');
        z.innerHTML = `<table class="bilan"><tr><th></th><th class="num">Précédente</th><th class="num">Celle-ci</th></tr>
          <tr><td>Priorité n° 1</td><td class="num">${NOMS_C_LONGS[P.doctrine[0]]}</td><td class="num">${NOMS_C_LONGS[B.doctrine[0]]}</td></tr>
          <tr><td>Ce que le pays a vu</td><td class="num">${fmt0(P.scoreAffiche)}</td><td class="num">${fmt0(B.scoreAffiche)}</td></tr>
          <tr><td>Ce que vous avez fait</td><td class="num">${fmt0(P.scoreBilan)}</td><td class="num"><b>${fmt0(B.scoreBilan)}</b></td></tr>
          <tr><td>Dans dix ans</td><td class="num">${fmt0(P.scoreProjection)}</td><td class="num">${fmt0(B.scoreProjection)}</td></tr>
          ${Object.keys(NOMS_C).map((c) => `<tr><td>${NOMS_C_LONGS[c]}, réel</td><td class="num">${fmt0(P.vrai[c])}</td><td class="num">${fmt0(B.vrai[c])}</td></tr>`).join('')}</table>
          <p class="pg-info">Les faits sont les mêmes, les mesures disponibles aussi. Ce qui a changé, ce sont les priorités, donc les choix, donc le pays à l’arrivée. Le désaccord politique porte là-dessus, pas sur les chiffres.</p>`;
        return z;
      } };
      try { localStorage.removeItem(CLE_REVANCHE); } catch (e) { /* sans importance */ }
    }
    return {
      kicker: 'Votre cap', picto: 'pupitre', titre: 'Doctrine déclarée, doctrine menée',
      info: `<b>${fmt0((B.coherence || 0) * 100)} %</b> de vos effets réels servent vos deux priorités annoncées${B.constance ? ' : cap tenu, vos gains composeront.' : ' : cap non tenu, un successeur détricote.'}<br>${B.greves} journée${B.greves > 1 ? 's' : ''} de grève · fatigue réformatrice ${fmt0(B.fatigue)}/100 · ${B.abandons} mesure${B.abandons > 1 ? 's' : ''} retirée${B.abandons > 1 ? 's' : ''} sous la pression.`,
      notes: cmp ? [cmp] : [],
      derniere: true,
    };
  });

  const montrer = (i) => {
    const o = pages[i]();
    o.pas = `Bilan ${i + 1}/${pages.length}`;
    o.papier = o.papier || false;
    const last = i === pages.length - 1;
    if (!last) {
      o.bouton = { label: 'Suivant' };
      o.fin = () => montrer(i + 1);
    } else {
      o.bouton = null;
    }
    const pg = page(o);
    const zone = pg.querySelector('.pg-zone');
    if (last) {
      zone.appendChild(cta('Nouveau mandat (autres tirages, autres crises)', () => { try { localStorage.removeItem(CLE_SAUVE); localStorage.removeItem(CLE_REVANCHE); } catch (e) { /* sans importance */ } location.reload(); }));
      if (!(rev && rev.precedent)) {
        zone.appendChild(cta('Rejouer la même partie, doctrine inversée', () => {
          try {
            localStorage.setItem(CLE_REVANCHE, JSON.stringify({
              graine: ETAT.graine, doctrineInverse: [...B.doctrine].reverse(),
              precedent: { doctrine: B.doctrine, scoreAffiche: B.scoreAffiche, scoreBilan: B.scoreBilan, scoreProjection: B.scoreProjection, anneesJouees: B.anneesJouees, vrai: B.vrai },
            }));
          } catch (e) { /* stockage indisponible : on rejoue sans comparaison */ }
          try { localStorage.removeItem(CLE_SAUVE); } catch (e) { /* sans importance */ }
          location.reload();
        }, 'sec'));
      }
    }
    if (i > 0) zone.appendChild(cta('‹ Précédent', () => montrer(i - 1), 'sec petit'));
  };
  montrer(0);
}
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
  /* Au bilan final, on ne se contente pas du décompte : on nomme les mesures.
     C'est là que le rattachement politique devient lisible — « ce que vous avez
     signé, voilà qui le portait aussi ». */
  const lignes = Object.entries(BLOCS_2027).map(([cle, meta]) => {
    const n = b.parBord[cle].length;
    const pct = Math.round((n / b.total) * 100);
    const liste = final && n
      ? `<ul class="bous-mesures">${b.parBord[cle].map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`
      : '';
    return `<div class="bous-l"><span class="lib" style="border-left-color:${meta.coul}">${meta.label}<small>${meta.long}</small></span>
      <span class="rail"><i style="width:${Math.max(1, pct)}%;background:${meta.coul}"></i></span>
      <span class="v">${n}/${b.total}</span></div>${liste}`;
  }).join('');
  const sansPartiPct = Math.round((b.horsPartis.length / b.total) * 100);
  /* Le mode d’emploi une fois, les chiffres à chaque fois. */
  const premiereFois = final || S.annee <= 2;
  d.innerHTML += `<p class="bous-chapo">Sur vos <b>${b.total}</b> mesure${b.total > 1 ? 's' : ''} annoncée${b.total > 1 ? 's' : ''}, combien figurent aussi au programme de chaque camp en 2027.${premiereFois ? ' Une mesure peut compter dans plusieurs colonnes : c’est fréquent, et ce n’est pas une erreur de comptage.' : ''}</p>${lignes}
    <p class="bous-note"><b>${b.horsPartis.length} de vos ${b.total} mesures (${sansPartiPct} %) ne sont portées par aucun parti.</b>${premiereFois ? ' Elles viennent de la Cour des comptes, de la DEPP, du Conseil scientifique, de l’inspection générale ou de la recherche, et ce sont en moyenne celles dont le niveau de preuve est le plus élevé.' : ''}</p>
    ${final && b.horsPartis.length ? `<ul class="bous-mesures hors">${b.horsPartis.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}`;
  if (final) {
    d.appendChild(el('p', 'bous-note',
      'Le jeu ne dit pas de quel bord vous êtes : il dit qui défend, dans la vraie vie, ce que vous avez signé. Si le résultat vous surprend, c’est le moment le plus utile de la partie.'));
  }
  return d;
}

/* Les lycéens, en mots : où en est leur colère, ce que vous leur avez répondu. */
function blocLyceens(S, final) {
  const L = S.lyceens;
  const d = el('div', 'lyceens-bloc');
  const humeur = humeurLyceenne(L.colere);
  d.appendChild(el('div', 'titre-d', final ? 'Et les lycéens ?' : 'Les lycéens, en fin d’année'));
  const reponses = [...new Set(L.reponses)];
  const tenues = K.LYCEENS.promesses.filter((p) => p.themes.some((t) => S.themes.has(t)));
  const rompues = K.LYCEENS.promesses.filter((p) => !p.themes.some((t) => S.themes.has(t)));
  d.appendChild(el('p', 'humeur', `Ils sont <b class="${L.colere >= K.LYCEENS.seuilBlocus ? 'neg' : L.colere < 45 ? 'pos' : ''}">${humeur}</b>. ${L.blocus ? `${L.blocus} rentrée${L.blocus > 1 ? 's' : ''} bloquée${L.blocus > 1 ? 's' : ''} depuis votre arrivée.` : 'Aucune rentrée bloquée depuis votre arrivée.'}`));
  d.appendChild(el('p', 'promesses-l', `<b>Les cinq chantiers de 2026 :</b> ${tenues.length ? tenues.map((p) => `<span class="ok">✓ ${esc(p.libelle)}</span>`).join(' ') : ''}${rompues.length ? rompues.map((p) => `<span class="non">✗ ${esc(p.libelle)}</span>`).join(' ') : ''}`));
  if (final) {
    d.appendChild(el('p', 'bous-note', reponses.length
      ? `Vous leur avez répondu par : ${reponses.map((r) => `« ${esc(r)} »`).join(', ')}. ${L.colere < 45 ? 'Ils ont rangé les pancartes, pas la liste.' : 'Ils ont gardé la liste, et les pancartes.'}`
      : 'Vous ne leur avez rien répondu de précis. Ils ont gardé la liste, les pancartes, et le numéro de votre successeur.'));
  }
  return d;
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

/* Ce que les lycéens ont écrit : des barres horizontales, une par sujet, en
   pourcentage des contributions. L'axe part de zéro. */
function serieConsultation() {
  const g = el('div', 'conso');
  g.setAttribute('role', 'img');
  g.setAttribute('aria-label', 'Part des contributions lycéennes évoquant chaque sujet : temps scolaire 71 %, bâtiments 51 %, professeurs absents 28,5 %, effectifs 24 %, Parcoursup 14,5 %');
  g.innerHTML = SERIE_CONSULTATION.map((x) => `<div class="conso-l"><span class="sujet">${esc(x.sujet)}</span><span class="piste"><i style="width:${x.pct}%"></i></span><b>${fr(String(x.pct))} %</b></div>`).join('')
    + `<p class="rep-serie-note">Part des 76 500 premières contributions qui évoquent chaque sujet (une contribution peut en évoquer plusieurs). La consultation était ouverte à tous les lycéens, elle n’est pas un sondage représentatif.${citer('consult26')}</p>`;
  return g;
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
  $('#comprendre-btn').setAttribute('aria-expanded', 'true');
  document.documentElement.style.overflow = 'hidden';
  $('#comprendre-fermer').focus();
}
function fermerComprendre() {
  $('#comprendre').hidden = true;
  $('#comprendre-btn').setAttribute('aria-expanded', 'false');
  document.documentElement.style.overflow = '';
  $('#comprendre-btn').focus();
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

/* Les lycées d'un département, lus dans les données ouvertes du ministère
   (jeu « IPS des lycées à partir de 2023 »). Les noms des colonnes sont
   découverts sur un premier enregistrement, pour ne pas dépendre d'une
   version précise du jeu de données ; tout échec rend `null`. */
async function chercherLycees(code) {
  const base = 'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-ips-lycees-ap2023';
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const un = await (await fetch(base + '/records?limit=1', { signal: ctrl.signal })).json();
    const rec = (un.results || [])[0];
    if (!rec) return null;
    const cles = Object.keys(rec);
    const trouve = (...motifs) => cles.find((k) => motifs.every((m) => m.test(k)));
    const fDep = trouve(/departement/, /code/) || trouve(/departement/);
    const fIps = trouve(/^ips/, /ensemble/) || trouve(/^ips/, /gt/) || trouve(/^ips/);
    const fRentree = trouve(/rentree/);
    const fNom = trouve(/nom/, /etab/) || trouve(/nom/);
    const fSecteur = trouve(/secteur/);
    const fCommune = trouve(/nom/, /commune/);
    if (!fDep || !fIps) return null;
    const where = codesPossibles(code).map((c) => `${fDep}="${c}"`).join(' or ');
    const url = `${base}/exports/json?where=${encodeURIComponent(where)}&limit=-1`;
    const rows = await (await fetch(url, { signal: ctrl.signal })).json();
    if (!Array.isArray(rows) || !rows.length) return null;
    const rentrees = [...new Set(rows.map((r) => String(r[fRentree] || '')))].sort();
    const derniere = rentrees[rentrees.length - 1];
    const lycees = rows.filter((r) => String(r[fRentree] || '') === derniere && r[fIps] != null && !isNaN(+r[fIps]))
      .map((r) => ({ nom: r[fNom] || '', commune: fCommune ? r[fCommune] : '', ips: +r[fIps], secteur: /priv/i.test(String(r[fSecteur] || '')) ? 'prive' : /publ/i.test(String(r[fSecteur] || '')) ? 'public' : '' }));
    return { rentree: derniere, lycees };
  } finally { clearTimeout(t); }
}

/* Le bilan, vu de votre lycée */
function blocTerritoire(S) {
  const f = ficheTerritoire(S.territoire.code);
  if (!f) return el('div');
  const d = el('div', 'terr-bloc');
  d.appendChild(el('div', 'titre-d', `Dans votre département : ${esc(f.nom)}`));
  const J = (id) => S.joue.has(id);
  const defav = f.ips != null ? f.ips < 95 : f.sous100;
  const fav = f.ips != null && f.ips >= 118;
  const l = [];
  if (J('ep_lycee')) l.push(defav ? ['ok', `Les lycées de ${f.nom} reçoivent des heures en plus : avec un IPS moyen ${f.ips != null ? 'de ' + f.ips : 'sous 100'}, ils sont dans la cible de l’éducation prioritaire au lycée.`]
    : fav ? ['non', `Les lycées de ${f.nom} (IPS moyen ${f.ips}) financent une part de l’éducation prioritaire au lycée : un peu moins d’heures chez vous, davantage sous 95. C’est ce que vous avez choisi.`]
    : ['neutre', `L’éducation prioritaire au lycée ne change rien pour ${f.nom}${f.ips != null ? ` (IPS moyen ${f.ips}, dans la moyenne)` : ' : son IPS moyen n’est pas connu du jeu, les lycées sous 95 y sont servis un par un'}.`]);
  if (J('bulletin_lycee')) l.push(['ok', `Chaque lycée de ${f.nom} publie désormais sa dépense par élève, ses heures perdues, son IPS et sa valeur ajoutée. Ce que ce dossier n’avait pas pu trouver, un élève peut le lire sur la porte.`]);
  if (J('open_data_lycee')) l.push(['ok', 'Les heures de cours non assurées sont affichées chaque mois à l’entrée de chaque lycée.']);
  if (J('plan_chaleur')) l.push(['ok', `Le diagnostic thermique de chaque lycée de ${f.nom} est publié ; au-dessus de 30 °C, les cours s’adaptent ; les travaux vont d’abord aux lycées les plus chauds et les plus défavorisés.`]);
  if (J('garantie_trajet')) l.push(['ok', 'Aucun lycéen à plus de quarante-cinq minutes de son lycée sans internat gratuit ou aide au transport : la garantie vaut surtout pour les communes rurales du département.']);
  if (J('eleve_vote_region')) l.push(['ok', `Deux lycéens votent à la commission lycées de la région ${f.regionNom}.`]);
  if (J('bp_regional')) l.push(['ok', f.region.participation ? `La région ${f.regionNom} avait déjà un budget participatif lycéen ; il passe à 1 % du budget des lycées, voté par les élèves.` : `La région ${f.regionNom} n’avait pas de budget participatif lycéen ; elle a désormais 1 % de son budget des lycées à faire voter par les élèves.`]);
  if (J('budget_participatif')) l.push(['ok', 'Deux euros par élève, dépensés sur un vote des élèves, dans chaque lycée.']);
  if (J('enquete_climat')) l.push(['ok', 'Tous les deux ans, les élèves de chaque lycée répondent à l’enquête de climat scolaire et en voient les résultats.']);
  if (J('droit_reponse')) l.push(['ok', 'Toute question du conseil de la vie lycéenne reçoit une réponse écrite sous un mois.']);
  if (J('charte_sanitaires')) l.push(['ok', 'Les toilettes sont ouvertes, équipées et visitées deux fois par an par les élèves.']);
  if (J('cantine_lycee')) l.push(['ok', f.region.cantine ? `Le repas à un euro pour les boursiers s’ajoute à la tarification de la région (${f.region.cantine.v}).` : 'Le repas à un euro pour les boursiers, dans tous les lycées.']);
  if (!l.length) l.push(['non', `Aucune de vos décisions ne change quelque chose de visible dans un lycée de ${f.nom} : ni les murs, ni la parole des élèves, ni ce qu’on sait de chaque établissement. Les professeurs et les programmes, peut-être ; de loin.`]);
  const pr = S.territoire.priorite;
  if (pr === 'territoires') l.push([J('ep_lycee') || J('garantie_trajet') || J('plan_chaleur') ? 'ok' : 'non', J('ep_lycee') || J('garantie_trajet') || J('plan_chaleur') ? 'Vous aviez dit « les territoires d’abord » : vous avez déplacé des moyens vers ceux qui en ont le moins.' : 'Vous aviez dit « les territoires d’abord ». Aucune de vos mesures n’a déplacé de moyens d’un territoire vers un autre.']);
  if (pr === 'national') l.push([J('ep_lycee') ? 'non' : 'ok', J('ep_lycee') ? 'Vous aviez dit « les mêmes règles partout », puis vous avez créé un barème au profil social. Les lycéens appellent cela changer d’avis ; vous, apprendre.' : 'Vous aviez dit « les mêmes règles partout » : vous vous y êtes tenu.']);
  d.appendChild(el('ul', 'terr-liste', l.map(([k, t]) => `<li class="${k}">${k === 'ok' ? '✓' : k === 'non' ? '✗' : '–'} ${fr(t)}</li>`).join('')));
  return d;
}

/* Le miroir de l'automne : ce que vous pensiez, ce que disent les faits.
   Pas une note : une liste, colère par colère. */
function blocMiroir(S) {
  const d = el('div', 'miroir-bloc');
  d.appendChild(el('div', 'titre-d', 'Ce que vous pensiez, ce que disent les faits'));
  let accord = 0, total = 0;
  const lignes = COLERES.map((c) => {
    const a = S.coleres.avis[c.id]; if (!a) return '';
    total++;
    const ok = c.verdict === 'ouverte' ? (a === 'partielle') : (a === c.verdict);
    if (ok) accord++;
    const dec = S.coleres.decisions[c.id];
    const rep = !dec ? 'pas de réponse' : String(dec).startsWith('posture:') ? 'une attitude' : `« ${esc((PAR_ID[dec] || {}).label || dec)} »`;
    return `<li class="${ok ? 'ok' : 'ecart'}"><span class="cri">${fr(c.cri)}</span><span class="d">votre avis : ${esc((AVIS.find((x) => x.id === a) || {}).label || a).toLowerCase()} · les faits : ${VERDICTS[c.verdict].t.toLowerCase()} · ${rep}</span></li>`;
  }).join('');
  d.innerHTML += `<ul>${lignes}</ul><p class="bous-note">${total ? `Sur ${total} colères, votre premier avis rejoignait les chiffres ${accord} fois. ` : ''}Le but n’était pas d’avoir raison d’avance : c’était de savoir, avant de décider, sur quoi repose ce qu’on pense.</p>`;
  return d;
}

/* -------------------------------------------------------- boucle & sauvegarde */
const CLE_SAUVE = 'rue-de-grenelle-gp3';  // version grand public : son propre jeu de sauvegarde
const ETAT = { s: null, gen: null, journalLu: 0, pas: [], dateLabel: 'novembre 2026', rentreeRatee: false, picto: 'journal', typeEcran: '' };

function dateDe(q) {
  const S = ETAT.s, an = S.anneeCiv || 2026;
  const t = q.type;
  if (['nomination', 'doctrine', 'entretien', 'territoire', 'avance', 'resultat'].includes(t)) return 'novembre 2026';
  if (t === 'reperes') return q.note === 'demographie' ? `juillet ${an}` : 'novembre 2026';
  if (t === 'colere' || t === 'faits') return q.quand && /^Rentrée/.test(q.quand) ? `septembre ${an}` : 'novembre 2026';
  if (t === 'intention') return `juillet ${an}`;
  if (t === 'affaire') return `décembre ${an}`;
  if (t === 'polemique') return `septembre ${an}`;
  if (t === 'blocus') return `septembre ${an}`;
  if (t === 'livraison') return `octobre ${an}`;
  if (t === 'plateau') return `décembre ${an}`;
  if (t === 'retrait') return `octobre ${an}`;
  if (t === 'dossier') return 'été 2027';
  if (t === 'audience') return `octobre ${an}`;
  if (t === 'lettrePlafond') return `juillet ${an}`;
  if (t === 'rentree') return `septembre ${an}`;
  if (t === 'carteScolaire') return `janvier ${an + 1}`;
  if (t === 'mesures') {
    return q.moment === 'prise_fonction' ? 'juin 2027'
      : q.moment === 'rentree' ? `septembre ${an}` : `janvier ${an + 1}`;
  }
  const m = { automne: 'décembre 2026', election: 'mai 2027', ouverture: 'juin 2027', juillet: `juillet ${an}`, rentree: `septembre ${an}`, decembre: `décembre ${an}`, mars: `mars ${an + 1}`, cloture: `mai ${an + 1}` };
  return m[q.etape] || `${MOIS_L[S.mois] || ''} ${an}`;
}

/* Le pictogramme de chaque type de page : on reconnaît la page avant de la lire. */
const PICTO_DE = {
  nomination: 'lettre', entretien: 'colonnes', doctrine: 'pupitre', avance: 'pieces', resultat: 'pieces', territoire: 'carte',
  colere: 'megaphone', faits: 'megaphone', intention: 'courbe', affaire: 'alerte', polemique: 'tele', blocus: 'megaphone',
  livraison: 'globe', plateau: 'tele', retrait: 'megaphone', dossier: 'dossier', audience: 'megaphone', lettrePlafond: 'lettre',
  rentree: 'ecole', carteScolaire: 'plan', mesures: 'liste',
};

function rendre(q) {
  ETAT.dateLabel = dateDe(q);
  ETAT.typeEcran = q.type;
  ETAT.picto = q.picto || PICTO_DE[q.type] || 'journal';
  ETAT.rentreeRatee = ETAT.s.journal.some((e) => e.cat === 'rentree' && e.annee === ETAT.s.annee && e.texte.includes('dégradée'));
  majBandeau();
  if (q.type === 'nomination') ecranNomination();
  else if (q.type === 'doctrine') ecranDoctrine();
  else if (q.type === 'reperes') ecranReperes(q);
  else if (q.type === 'avance') ecranAvance(q);
  else if (q.type === 'resultat') ecranResultat(q);
  else if (q.type === 'entretien') ecranEntretien(q);
  else if (q.type === 'territoire') ecranTerritoire(q);
  else if (q.type === 'intention') ecranIntention(q);
  else if (q.type === 'affaire') ecranAffaire(q);
  else if (q.type === 'polemique') ecranPolemique(q);
  else if (q.type === 'blocus') ecranBlocus(q);
  else if (q.type === 'colere') ecranColere(q);
  else if (q.type === 'faits') ecranFaits(q);
  else if (q.type === 'livraison') ecranLivraison(q);
  else if (q.type === 'plateau') ecranPlateau(q);
  else if (q.type === 'retrait') ecranRetrait(q);
  else if (q.type === 'dossier') ecranDossier(q);
  else if (q.type === 'audience') ecranAudience(q);
  else if (q.type === 'lettrePlafond') ecranBercy(q);
  else if (q.type === 'rentree') ecranRentree(q);
  else if (q.type === 'carteScolaire') ecranCarteScolaire(q);
  else if (q.type === 'mesures') ecranMesures(q);
  else if (q.type === 'etape') ecranEtape(q.etape);
}

function suivant(rep) {
  ETAT.pas.push(rep === undefined ? null : rep);
  sauvegarder();
  const res = ETAT.gen.next(rep);
  if (res.done) { const B = bilan(ETAT.s); ETAT.typeEcran = 'bilan'; ETAT.picto = 'drapeau'; ETAT.dateLabel = 'mai ' + (2027 + K.DUREE_MANDAT); ecranBilan(B); return; }
  rendre(res.value);
}

function sauvegarder() {
  try { localStorage.setItem(CLE_SAUVE, JSON.stringify({ graine: ETAT.graine, pas: ETAT.pas })); } catch (e) { /* stockage indisponible : on joue sans filet */ }
}

/* La revanche : rejouer la même partie, mêmes tirages, avec la doctrine
   inversée. C'est la démonstration la plus forte du jeu : que le désaccord
   politique porte sur les priorités, pas sur les faits. Le hasard est fixé
   par la graine, seul le classement change. */
const CLE_REVANCHE = 'rue-de-grenelle-gp-revanche';
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
  if (res.done) { const B = bilan(ETAT.s); ETAT.typeEcran = 'bilan'; ecranBilan(B); return; }
  rendre(res.value);
}

$('#comprendre-btn').onclick = ouvrirComprendre;
$('#comprendre-fermer').onclick = fermerComprendre;
$('#fe-fermer').onclick = fermerFeuille;
$('#feuille .voile').onclick = fermerFeuille;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#comprendre').hidden) fermerComprendre(); });

(function initialiser() {
  let sauve = null;
  try { sauve = JSON.parse(localStorage.getItem(CLE_SAUVE) || 'null'); } catch (e) { sauve = null; }
  if (sauve && !(sauve.graine && Array.isArray(sauve.pas))) sauve = null;
  ecranAccueil(sauve);
})();
