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
const signe = (x) => (x > 0 ? '+' + fmt1(x) : fmt1(x));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
/* typographie française pour les textes du moteur : décimales à virgule */
const fr = (s) => esc(s).replace(/(\d)\.(\d)/g, '$1,$2');

const NOMS_C = { reussite: 'Réussite', egalite: 'Inégalités', sante: 'Santé du système', paix: 'Paix sociale', budget: 'Budget & salaires' };
const NOMS_C_LONGS = {
  reussite: 'Réussite des élèves', egalite: 'Réduction des inégalités',
  sante: 'Santé du système', paix: 'Paix sociale', budget: 'Budget et salaires',
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
const CAST = {
  pm: 'Barthélemy Roulette, Premier ministre',
  bercy: 'Aymeric Sécateur, ministre des Comptes publics',
  journal: 'La Gazette de Grenelle',
  breves: ['Le Figareau', 'Libécole', 'Ouest-Trance', 'BFM Récré', 'La Craie du Matin'],
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
  const pousser = (cond, titre, sous) => { if (cond) u.push({ titre, sous }); };
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
  pousser(a('rentree') && ETAT.rentreeRatee, 'Rentrée : le compteur des classes sans professeur tourne déjà',
    'Le ministère parle de « tensions localisées ». La localisation : un peu partout.');
  pousser(a('rentree') && !ETAT.rentreeRatee, 'Rentrée sans accroc rue de Grenelle',
    'Un professeur devant chaque classe ou presque. L’information, jugée peu spectaculaire, est en page 12.');
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
  pousser(true, 'Rue de Grenelle : le ministre poursuit sa route',
    'Selon son entourage, « le cap est clair ». Le cap n’a pas souhaité répondre à nos questions.');
  return u;
}

function nouvellesEntrees() {
  return ETAT.s.journal.slice(ETAT.journalLu);
}

/* ---------------------------------------------------------------- HUD ----- */
let instantane = null;
let hudDeplie = false;
function majHud() {
  const S = ETAT.s;
  $('#hud').hidden = false;
  $('#hud-date').textContent = ETAT.dateLabel || 'juin 2027';
  const zone = $('#hud-compteurs'); zone.innerHTML = '';
  const ordre = S.doctrine || Object.keys(NOMS_C);
  const grands = ordre.slice(0, 3);
  const petits = ordre.slice(3);
  const jauge = (c, grande) => {
    const v = S.affiche[c];
    const d = instantane ? v - instantane[c] : 0;
    const j = el('div', 'jauge' + (grande ? ' grande' : ''));
    j.innerHTML = `<div class="nom"><span>${NOMS_C[c]}</span><b>${fmt0(v)}</b></div>
      <div class="rail"><i style="width:${Math.max(2, Math.min(100, v))}%;background:${COULEURS_C[c]}"></i></div>
      <div class="delta ${d > 0.6 ? 'up' : d < -0.6 ? 'down' : ''}">${Math.abs(d) > 0.6 ? (d > 0 ? '▲ +' : '▼ −') + fmt1(Math.abs(d)) : '&nbsp;'}</div>`;
    if (S.doctrine && S.doctrine[0] === c) j.querySelector('.nom span').style.color = 'var(--bleu-rf)';
    return j;
  };
  for (const c of grands) zone.appendChild(jauge(c, true));
  const btn = el('button', 'repli-btn', hudDeplie ? '▾ replier' : '▸ tout le tableau de bord');
  btn.onclick = () => { hudDeplie = !hudDeplie; majHud(); };
  zone.appendChild(btn);
  if (hudDeplie) for (const c of petits) zone.appendChild(jauge(c, false));
  instantane = { ...S.affiche };
  const sous = $('#hud-sous');
  sous.hidden = !hudDeplie;
  sous.innerHTML = [
    `Capital politique <b>${fmt0(S.capital)}</b>`,
    `Crédit Bercy <b>${fmt0(S.creditBercy)}</b>`,
    `Adhésion enseignante <b>${fmt0(S.phys.adhesion)}</b>`,
    `Parents <b>${fmt0(S.phys.parents)}</b>`,
    `Fatigue réformatrice <b>${fmt0(S.fatigue)}</b>`,
    `Concours pourvus <b>${fmt1(S.phys.couvertureConcours)} %</b>`,
    `Heures non assurées <b>${fmt1(S.phys.heuresNonAssurees)} %</b>`,
  ].map((x) => `<span>${x}</span>`).join('');
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
  d.appendChild(el('p', 'chapo', 'Le gouvernement se forme. Votre téléphone sonne : le portefeuille proposé est l’Éducation nationale — le premier budget de l’État, 64,5 milliards d’euros par an, 1,2 million d’agents, 12 millions d’élèves. La durée moyenne dans le poste dépasse rarement deux ans.'));
  d.appendChild(el('div', 'note-passation',
    'Votre prédécesseur, huitième en quatre ans, laisse un mot : « Tout est dans les dossiers. Les dossiers sont dans les cartons. Les cartons sont au garde-meuble, la DGESCO sait lequel. Méfiez-vous de juillet, de septembre et de janvier — le reste de l’année est calme, sauf le reste de l’année. Bonne chance.'
    + '<span class="ps">P.-S. — La photocopieuse du deuxième est en panne depuis 2019. C’est le dossier le plus consensuel du ministère : ne le réglez pas, il fédère. »</span>'));
  d.appendChild(el('p', '', 'Vous acceptez. Dès demain, devant la presse, vous direz vous-même ce que vous allez chercher pendant cinq ans.'));
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
  d.appendChild(el('p', '', '<span style="font-size:.82rem;color:var(--encre-2)">Votre directeur de cabinet, à voix basse : « Ce que vous mettez en premier, on vous le ressortira à chaque arbitrage contradictoire. Ce que vous mettez en dernier aussi. »</span>'));
  scene(d);
}

/* --- lettre plafond ---/* --- lettre plafond ---/* --- lettre plafond --------------------------------------------------------- */
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

  const d = el('article', 'doc large');
  d.appendChild(el('div', 'entete-doc', `<span class="type">L’atelier — mesures de l’année</span><span class="date">${ETAT.dateLabel}</span>`));
  d.appendChild(el('h2', '', 'Que portez-vous cette année ?'));
  d.appendChild(el('p', 'chapo', 'L’effet vitrine est chiffré : vous le verrez. L’effet réel ne l’est pas : seuls le niveau de preuve (🔒) et le délai sont connus — vous découvrirez au bilan ce que vous avez produit. Dépliez une carte, puis « Comprendre l’effet » pour lire ce que disent réellement les études. Votre doctrine ouvre d’abord les dossiers qui la servent — le reste du catalogue arrivera au fil du mandat. Et rien ne s’applique sans les personnels.'));
  /* Le budget, en vrai : tout le mandat se joue dans un liseré. */
  const M = K.CADRAGE.missionHorsCAS;                       // 64,49 Md€
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
      `Réformes actives <b class="${actives > K.ABSORPTION.seuil ? 'neg' : ''}">${actives}</b>/${K.ABSORPTION.seuil} absorbables`,
      `Implémentation ×<b>${(Math.round(facteurImplementation(S) * 100) / 100).toLocaleString('fr-FR')}</b> (adhésion ${fmt0(S.phys.adhesion)})`,
      cout > enveloppe ? `<span class="neg">dépassement : −${fmt0(K.SURCOUT.creditBercyParMd * (cout - enveloppe))} crédit Bercy, −${fmt0(K.SURCOUT.capitalParMd * (cout - enveloppe))} capital</span>` : '',
    ].filter(Boolean).map((x) => `<span>${x}</span>`).join('');
    valider.disabled = pol > capital;
    valider.textContent = selection.size ? `Annoncer ${selection.size} mesure${selection.size > 1 ? 's' : ''}` : 'Ne rien annoncer cette année';
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
      <h3>${esc(c.label)}</h3>
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
      ${c.parametrique === 'revalorisation' ? '<div class="ligne"><span class="verrous">🔒🔒🔒··</span><span>Effet réel selon vos curseurs (réglez-les après sélection)</span></div>' : ''}</div>
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
        zone.append(
          sel('Ampleur', REVALORISATION.ampleurs, 'ampleur', (k, v) => v.label),
          sel('Cible', REVALORISATION.cibles, 'cible', (k, v) => v.label),
          sel('Contrepartie', REVALORISATION.contreparties, 'contrepartie', (k, v) => `${v.label} — ${v.porteurs.join(', ')}`));
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
        const opt = c.parametrique === 'revalorisation' ? { ampleur: 'plan', cible: 'milieux', contrepartie: 'sans' }
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
    if (!selection.size) {
      if (!confirm('Ne rien annoncer laisse le système souffler (fatigue −8)… et fait écrire « ministre invisible » (capital −7, parents −3,5). Confirmer ?')) return;
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
  opts.append(bMaintenir, bCeder);
  d.appendChild(opts);

  function finRetrait(dec) {
    opts.querySelectorAll('.opt').forEach((n) => { n.disabled = true; });
    const box = el('div', 'decryptage');
    box.style.borderLeftColor = dec === 'ceder' ? 'var(--c-sante)' : 'var(--rouge-rf)';
    box.innerHTML = dec === 'ceder'
      ? `<div class="titre-d" style="color:var(--c-sante)">Vous cédez</div><p><i>« Nous saluons un ministre qui sait entendre. »</i> — La mesure sort du droit. La presse titrera sur le recul ; les salles des professeurs, sur l’écoute. Les deux auront raison.</p>`
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
        sc.appendChild(el('div', 'ligne-s', `<span>${esc(c ? c.label : e.carte)}</span><span>→ ${NOMS_C[e.compteur]}</span>
          <span class="val" style="color:${e.montant > 1 ? 'var(--ok)' : e.montant < -1 ? 'var(--alerte)' : 'var(--encre-2)'}">${signe(e.montant)}</span>
          <span style="color:var(--encre-3);font-size:.76rem">preuve ${'🔒'.repeat(e.cadenas)} · documenté ~${signe(e.central)}</span>`));
      }
      sc.appendChild(el('p', '', '<span style="font-size:.76rem;color:var(--encre-3)">Ce que vous aviez signé sous incertitude entre aujourd’hui dans les compteurs — implémentation comprise. Les scellés restants s’ouvriront plus tard, certains après vous.</span>'));
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

  /* --- les cinq compteurs --- */
  const t1 = el('div', 'defile');
  t1.innerHTML = `<table class="bilan"><tr><th>Compteur (votre rang)</th><th class="num">Départ 2027</th><th class="num">Affiché</th><th class="num">Réel</th><th class="num">+10 ans</th></tr>
    ${B.doctrine.map((c, i) => `<tr><td><span style="color:${COULEURS_C[c]}">●</span> ${NOMS_C_LONGS[c]} <span style="color:var(--encre-3)">(n° ${i + 1}, ${K.POIDS_DOCTRINE[i]} %)</span></td>
      <td class="num">${fmt0(K.COMPTEURS_INITIAUX[c])}</td><td class="num">${fmt0(B.affiche[c])}</td>
      <td class="num"><b>${fmt0(B.vrai[c])}</b></td><td class="num">${fmt0(B.projection[c])}</td></tr>`).join('')}</table>`;
  d.appendChild(t1);

  /* --- révélation des effets réels --- */
  d.appendChild(el('h2', '', 'Ce que vos mesures ont réellement produit')).style.marginTop = '26px';
  d.appendChild(el('p', 'chapo', 'À la signature, vous ne connaissiez que le niveau de preuve. Voici tout : l’effet documenté par les études (la valeur centrale, cachée en cours de jeu), et l’effet que VOUS avez obtenu — tirage sous incertitude, multiplié par l’implémentation (adhésion à ' + fmt0(S.phys.adhesion) + ') et la capacité d’absorption. Les effets « d’image » vus en cours de mandat n’apparaissent pas ici : ils se sont évaporés, comme prévu.'));
  const parCarte = new Map();
  for (const e of S.effetsEnAttente) { if (!parCarte.has(e.carte)) parCarte.set(e.carte, []); parCarte.get(e.carte).push(e); }
  const t2 = el('div', 'defile');
  let lignes = '';
  for (const [id, effs] of parCarte) {
    const c = PAR_ID[id];
    lignes += effs.map((e, i) => {
      const verdictTirage = e.cadenas <= 2 && e.montant >= e.central + 1.5 ? '<br><span style="font-size:.72rem;color:var(--encre-3)">tirage favorable — la preuve était mince, vous avez eu de la chance</span>'
        : e.cadenas <= 2 && e.montant <= e.central - 1.5 ? '<br><span style="font-size:.72rem;color:var(--encre-3)">tirage défavorable — c’est le prix d’un pari à preuve faible</span>'
        : e.central >= 3 && e.montant < e.central * 0.55 ? '<br><span style="font-size:.72rem;color:var(--encre-3)">effet amputé : implémentation dégradée (adhésion basse ou système saturé)</span>' : '';
      return `<tr>${i === 0 ? `<td rowspan="${effs.length}">${esc(c ? c.label : id)}</td>` : ''}
      <td>${NOMS_C[e.compteur]}</td><td>${'🔒'.repeat(e.cadenas)}</td>
      <td class="num">${signe(e.central)}</td>
      <td class="num"><span class="revele ${e.montant > 1 ? 'bon' : e.montant < -1 ? 'mauvais' : ''}">${signe(e.montant)}</span>${verdictTirage}</td>
      <td>${e.retire ? '<span style="color:var(--rouge-rf)">retirée sous la pression syndicale — effet annulé</span>' : e.applique ? 'effet arrivé' : `arrive an ${e.anneeArrivee}${e.anneeArrivee > 5 ? ' — après vous' : ''}`}</td></tr>`;
    }).join('');
  }
  t2.innerHTML = `<table class="bilan"><tr><th>Mesure</th><th>Compteur</th><th>Preuve</th><th class="num">Effet documenté</th><th class="num">Effet réel tiré</th><th>Horizon</th></tr>${lignes || '<tr><td colspan="6">Aucune mesure engagée. Le système vous remercie du repos ; l’Histoire, moins.</td></tr>'}</table>`;
  d.appendChild(t2);

  /* --- doctrine déclarée vs menée --- */
  d.appendChild(el('p', '', `<b>Doctrine déclarée contre doctrine menée :</b> ${fmt0((B.coherence || 0) * 100)} % de vos effets réels servent vos deux priorités déclarées${B.constance ? ' — cap tenu : vos gains composeront (référence Portugal, quinze ans de constance)' : ' — cap non tenu : sans constance, un successeur détricote et les dérives reprennent'}.
    Grèves : <b>${B.greves}</b> journée${B.greves > 1 ? 's' : ''} · fatigue réformatrice finale : <b>${fmt0(B.fatigue)}</b>/100 · mesures retirées sous la pression : <b>${B.abandons}</b>.`));

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

/* -------------------------------------------------------- boucle & sauvegarde */
const CLE_SAUVE = 'rue-de-grenelle-v3';   // v3 : feuille de route libre (formats antérieurs incompatibles)
const ETAT = { s: null, gen: null, journalLu: 0, pas: [], dateLabel: 'juin 2027', rentreeRatee: false, enAttente: null, rendre: null };

function dateDe(q) {
  const S = ETAT.s, an = S.anneeCiv || 2027;
  if (q.type === 'nomination') return 'juin 2027';
  if (q.type === 'doctrine') return 'juin 2027';
  if (q.type === 'retrait') return `octobre ${ETAT.s.anneeCiv || 2027}`;
  if (q.type === 'dossier') return 'été 2027';
  if (q.type === 'audience') return `octobre ${ETAT.s.anneeCiv || 2027}`;
  if (q.type === 'lettrePlafond') return `juillet ${an}`;
  if (q.type === 'rentree') return `septembre ${an}`;
  if (q.type === 'carteScolaire' || q.type === 'mesures') return `janvier ${an + 1}`;
  const m = { ouverture: 'juin 2027', juillet: `juillet ${an}`, rentree: `septembre ${an}`, decembre: `décembre ${an}`, mars: `mars ${an + 1}`, cloture: `mai ${an + 1}` };
  return m[q.etape] || `${MOIS_L[S.mois] || ''} ${an}`;
}

function rendre(q) {
  ETAT.dateLabel = dateDe(q);
  ETAT.rentreeRatee = ETAT.s.journal.some((e) => e.cat === 'rentree' && e.annee === ETAT.s.annee && e.texte.includes('dégradée'));
  majHud();
  if (q.type === 'nomination') ecranNomination();
  else if (q.type === 'doctrine') ecranDoctrine();
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

(function initialiser() {
  let sauve = null;
  try { sauve = JSON.parse(localStorage.getItem(CLE_SAUVE) || 'null'); } catch (e) { sauve = null; }
  if (sauve && !(sauve.graine && Array.isArray(sauve.pas))) sauve = null;
  ecranAccueil(sauve);
})();
