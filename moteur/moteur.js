/* ============================================================================
   RUE DE GRENELLE — MOTEUR DE SIMULATION
   ----------------------------------------------------------------------------
   Moteur pur, sans aucune dépendance d'interface : il se joue en Node (pour les
   simulations d'équilibrage) exactement comme il se jouera dans le navigateur.

   Boucle : 5 années de mandat, de juin 2027 à mai 2032, 12 mois chacune.
   Le joueur est représenté par une `politique` — un objet de fonctions de
   décision. Les stratégies-types des simulations et l'interface React
   implémentent la même interface.
   ========================================================================== */

import * as K from './constantes.js';
import { CATALOGUE, PAR_ID, REVALORISATION, chiffrerRevalorisation, FINANCEMENT_19, DOSSIERS_ETE, AUDIENCES, RECEPTION } from './catalogue.js';

/* ---------------------------------------------------------------- ALÉA --- */
export function rngDepuis(graine) {
  let a = graine >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const borne = (x, min, max) => Math.max(min, Math.min(max, x));
const fmtMd = (x) => (Math.round(x * 100) / 100).toLocaleString('fr-FR');
/* Loi normale (Box-Muller) pour le bruit des indicateurs affichés. */
function normale(rng, mu = 0, sigma = 1) {
  const u = Math.max(1e-9, rng()), v = rng();
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* ------------------------------------------------------- CRÉATION D'ÉTAT --- */
export function creerPartie({ graine = 1, politique }) {
  const rng = rngDepuis(graine);
  const s = {
    rng, graine, politique,
    annee: 1, anneeCiv: 2027, mois: 5,        // juin 2027
    fini: false, fin: null,

    doctrine: null,                            // ordre des 5 compteurs, déclaré en juin
    heritage: { ...K.COMPTEURS_INITIAUX },     // le système tel qu'on vous le laisse
    vrai: { ...K.COMPTEURS_INITIAUX },         // la vérité, révélée au bilan
    vitrine: { reussite: 0, egalite: 0, sante: 0, paix: 0, budget: 0 },
    affiche: { ...K.COMPTEURS_INITIAUX },
    bruit: { reussite: 0, egalite: 0, sante: 0, paix: 0, budget: 0 },

    phys: { ...K.PHYSIQUE_INITIALE },
    eleves: K.ELEVES_INITIAL,
    ratioED: K.RATIO_ED_INITIAL,
    hnaTemporaires: [],                        // effets temporaires sur les heures non assurées

    capital: K.CAPITAL.initial,
    creditBercy: K.CREDIT_BERCY_INITIAL,
    fatigue: K.FATIGUE.initiale,

    tresor: 0,                                 // Md€ disponibles pour mesures nouvelles
    chargesRecurrentes: 0,                     // Md€/an déjà engagés à vie
    palier: null, schemaEmploisDemande: 0,
    restitutionMax: 1,                         // verrou éventuel (financement « démographie »)

    effetsEnAttente: [],                       // { compteur, montant, anneeArrivee, source, carte }
    reformesActives: [],                       // { id, anneeFin }
    joue: new Set(), themes: new Set(), excl: new Set(),
    decouvertes: new Set(),          // dossiers déjà remontés sur le bureau
    avance: null, engagementRestitution: 0, schemaAvance: 0,
    abandons: 0,
    mesuresParAnnee: [],

    syndicats: K.SYNDICATS.map((o) => ({ ...o })),
    greves: [], pointsGreveCumules: 0,
    convocations: 0, guerreScolaireArmee: false,

    attractiviteCible: 0,
    couvertureAnnoncee: K.PHYSIQUE_INITIALE.couvertureConcours,
    anneesSansAnnonce: 0,
    histoire: [],                              // trace annuelle pour le bilan
    journal: [],
  };

  return s;
}

const note = (s, texte, cat = 'info') => s.journal.push({ annee: s.annee, mois: s.mois, cat, texte });

/* ============================================================================
   1. EFFETS RÉELS : tirage sous incertitude
   ========================================================================== */
/* Le facteur d'implémentation est la leçon centrale : une réforme ne vaut que
   ce que les personnels en font (Slavin — un programme mal implanté ≈ 0). */
export function facteurImplementation(s) {
  const adh = K.IMPLEMENTATION.baseAdhesion + K.IMPLEMENTATION.penteAdhesion * (s.phys.adhesion / 100);
  const fat = 1 - K.IMPLEMENTATION.penteFatigue * Math.max(0, s.fatigue - K.FATIGUE.initiale);
  return Math.max(K.IMPLEMENTATION.plancher, adh * fat);
}

/* Capacité d'absorption : au-delà de 3 réformes actives, tout se dégrade. */
export function absorption(s) {
  const n = s.reformesActives.filter((r) => r.anneeFin >= s.annee).length;
  const exces = Math.max(0, n - K.ABSORPTION.seuil);
  return {
    nActives: n,
    penalite: Math.max(K.ABSORPTION.plancher, 1 - K.ABSORPTION.penaliteParReforme * exces),
    variance: 1 + K.ABSORPTION.varianceParReforme * exces,
  };
}

function tirerEffetReel(s, effet, extraVariance = 1) {
  const [bas, haut] = K.INTERVALLE_CADENAS[effet.cadenas];
  const centre = (bas + haut) / 2;
  const demiLargeur = ((haut - bas) / 2) * extraVariance;
  const facteurPreuve = borne(centre + (s.rng() * 2 - 1) * demiLargeur, -1.0, 3.5);
  return effet.central * facteurPreuve;
}

function programmerEffets(s, carte, effets, multiplicateur = 1) {
  const abs = absorption(s);
  const impl = facteurImplementation(s);
  for (const e of effets) {
    const brut = tirerEffetReel(s, e, abs.variance);
    const montant = brut * impl * abs.penalite * multiplicateur;
    s.effetsEnAttente.push({
      compteur: e.compteur, montant, anneeArrivee: s.annee + e.delai,
      carte: carte.id, cadenas: e.cadenas, source: e.source, central: e.central,
    });
    /* Ce qui met quatre ans à produire commence par coûter en affichage — et,
       symétriquement, ce qui met quatre ans à NUIRE ne se voit pas non plus.
       C'est toute la thèse du jeu : l'indicateur et la réalité ne parlent pas
       du même moment. */
    if (e.delai >= 4) s.vitrine[e.compteur] -= K.COUT_AFFICHAGE_LONG_TERME * Math.sign(e.central);
  }
}

/* ============================================================================
   2. CONFLIT SOCIAL
   ========================================================================== */
export function evaluerMobilisation(s, greve) {
  if (!greve) return null;
  const sens = K.SENSIBILITES[greve.theme] || K.SENSIBILITES.moyens;
  /* Une adhésion basse abaisse le seuil de déclenchement de toutes les organisations. */
  const colere = (50 - s.phys.adhesion) / 22;
  const mobilises = s.syndicats.filter((o) => greve.intensite * (sens[o.profil] || 1) + colere >= o.seuil);
  if (!mobilises.length) return null;

  const poidsMobilise = mobilises.reduce((a, o) => a + o.poids, 0) / 100;
  const unite = mobilises.length >= 5 ? 1 + K.GREVE.bonusUnite : 1;
  const segment = K.GREVE.segments[greve.segment] || 1;
  const base = K.GREVE.baseParIntensite[greve.intensite] || 10;

  const tauxMinistere = base * poidsMobilise * unite * segment * (1 + (50 - s.phys.adhesion) / 130);
  return {
    cause: greve.cause || greve.theme,
    organisations: mobilises.map((o) => o.nom),
    unite: mobilises.length >= 5,
    tauxMinistere: +tauxMinistere.toFixed(1),
    tauxSyndicats: +(tauxMinistere * K.GREVE.ecartSyndicats).toFixed(1),
  };
}

function appliquerGreve(s, mob) {
  if (!mob) return;
  s.greves.push({ annee: s.annee, ...mob });
  s.pointsGreveCumules += mob.tauxMinistere;
  s.phys.adhesion -= mob.tauxMinistere * K.GREVE.coutAdhesionParPoint;
  note(s, `Grève : ${mob.tauxMinistere} % selon le ministère, ${mob.tauxSyndicats} % selon l'intersyndicale (${mob.organisations.length} organisations).`, 'greve');
}

/* ============================================================================
   3. RECALCUL DES COMPTEURS
   ========================================================================== */
/* Les compteurs VRAIS sont dérivés de l'état physique du système, auxquels
   s'ajoutent les effets réels une fois leur délai écoulé (`acquis`). */
function recalculerVrai(s) {
  const p = s.phys;
  const a = s.acquis || (s.acquis = { reussite: 0, egalite: 0, sante: 0, paix: 0, budget: 0 });

  s.vrai.reussite = K.COMPTEURS_INITIAUX.reussite + a.reussite
    - (p.heuresNonAssurees - 9.8) * 1.10
    - (s.ratioED - K.RATIO_ED_INITIAL) * 2.2;

  s.vrai.egalite = K.COMPTEURS_INITIAUX.egalite + a.egalite
    - (p.segregation - K.PHYSIQUE_INITIALE.segregation) * 1.45;

  s.vrai.sante = K.COMPTEURS_INITIAUX.sante + a.sante
    + (p.couvertureConcours - 92) * 0.85
    - (p.heuresNonAssurees - 9.8) * 1.50
    + (p.adhesion - 25) * 0.30
    + (p.affection - 90) * 0.15;

  /* La paix sociale ne remonte jamais : l'histoire sociale du mandat est écrite. */
  s.vrai.paix = K.COMPTEURS_INITIAUX.paix - s.pointsGreveCumules * K.GREVE.coutPaixParPointGreve + a.paix;

  s.vrai.budget = K.COMPTEURS_INITIAUX.budget + a.budget
    + (p.positionSalariale - K.PHYSIQUE_INITIALE.positionSalariale) * 3.0
    + (s.creditBercy - K.CREDIT_BERCY_INITIAL) * 0.30;

  for (const c of Object.keys(s.vrai)) s.vrai[c] = borne(s.vrai[c], 0, 100);
}

/* Ce que le joueur VOIT : héritage des prédécesseurs + vérité partielle +
   effet-vitrine + bruit annuel. Les deux premières années, il est jugé sur ce
   qu'il n'a pas fait. */
function recalculerAffiche(s) {
  const w = K.POIDS_HERITAGE[Math.min(4, s.annee - 1)];
  for (const c of Object.keys(s.vrai)) {
    s.affiche[c] = borne(s.heritage[c] * w + s.vrai[c] * (1 - w) + s.vitrine[c] + s.bruit[c], 0, 100);
  }
}

export function rafraichir(s) { recalculerVrai(s); recalculerAffiche(s); }

/* ============================================================================
   4. LES ÉTAPES DU CALENDRIER
   ========================================================================== */

/* --- JUIN (an 1) : on vous propose Grenelle, vous fixez votre cap ----------- */
/* Un gouvernement se forme — vous n'avez pas choisi sa composition et le jeu
   ne vous dira pas qui l'a formé : ce n'est pas votre sujet. Votre sujet, le
   premier jour, c'est de dire devant la presse ce que vous allez chercher.
   Le score final pondérera les cinq compteurs selon VOTRE classement : vous
   serez noté contre votre propre parole, et rien d'autre. */
function* etapeDoctrine(s) {
  yield { type: 'nomination' };
  const ordre = (yield { type: 'doctrine' }) || Object.keys(K.COMPTEURS_INITIAUX);
  s.doctrine = [...ordre];
  s.poids = {};
  s.doctrine.forEach((c, i) => { s.poids[c] = K.POIDS_DOCTRINE[i]; });
  note(s, `Feuille de route déclarée : ${s.doctrine.join(' > ')}. La presse garde une copie.`, 'doctrine');
}

/* --- L'ÉTÉ DES CENT JOURS (an 1) : deux crises avant la première rentrée --- */
function* etapeEte(s) {
  const dec = s.graine % DOSSIERS_ETE.length;
  for (let k = 0; k < 2; k++) {
    const dossier = DOSSIERS_ETE[(dec + k) % DOSSIERS_ETE.length];
    const idx = yield { type: 'dossier', dossier };
    const opt = dossier.options[Math.max(0, Math.min(dossier.options.length - 1, idx | 0))];
    const e = opt.effets || {};
    if (e.parents) s.phys.parents = borne(s.phys.parents + e.parents, 0, 100);
    if (e.adhesion) s.phys.adhesion = borne(s.phys.adhesion + e.adhesion, 0, 100);
    if (e.capital) s.capital = Math.min(K.CAPITAL.plafond, s.capital + e.capital);
    if (e.collectivitesBonus) s.capital += 2;                    // les élus s'en souviendront en janvier
    if (e.bercyMalus) s.creditBercy = borne(s.creditBercy - 4, 0, 100);
    note(s, `Été 2027 — ${dossier.titre} : « ${opt.titre} »`, 'ete');
  }
}

/* --- JUILLET : lettre plafond de Bercy + résultats des concours ------------ */
function* etapeJuillet(s) {
  /* (a) Lettre plafond : la sanction externe non contrôlable. */
  const palier = K.PALIERS_BERCY.find((p) => s.creditBercy >= p.seuil) || K.PALIERS_BERCY[K.PALIERS_BERCY.length - 1];
  s.palier = palier;
  s.schemaEmploisDemande = palier.schemaEmplois + (s.annee === 1 ? (s.schemaAvance || 0) : 0);
  let marge = palier.marge;

  if ((yield { type: 'lettrePlafond', palier }) === 'contester') {
    s.capital -= 12;
    if (s.rng() < 0.30 + s.capital / 400) {
      marge += 0.28; s.schemaEmploisDemande = Math.round(s.schemaEmploisDemande * 0.55);
      note(s, 'Arbitrage gagné à Matignon : la lettre plafond est desserrée.', 'bercy');
    } else {
      s.creditBercy -= 6;
      note(s, 'Arbitrage perdu. Bercy note que vous avez essayé.', 'bercy');
    }
  }
  s.margeAnnee = K.ENVELOPPE_BASE + marge;

  /* (b) Résultats des concours : le thermomètre de l'attractivité, un an de retard. */
  const cible = s.attractiviteCible || s.phys.couvertureConcours;
  s.phys.couvertureConcours += (cible - s.phys.couvertureConcours) * K.ATTRACTIVITE.inertieCouverture;
  s.phys.couvertureConcours = borne(s.phys.couvertureConcours, 55, 100);
  note(s, `Concours : ${s.phys.couvertureConcours.toFixed(1)} % des postes pourvus.`, 'concours');
}

/* --- SEPTEMBRE : LA RENTRÉE. Le « 49.3 » du jeu. -------------------------- */
function* etapeRentree(s) {
  const p = s.phys;
  const ratee = p.heuresNonAssurees > K.RENVOI.seuilHNARentreeRatee
             || p.couvertureConcours < K.RENVOI.seuilCouvertureRentreeRatee;

  if (ratee) {
    p.parents -= 6;
    s.vitrine.sante -= 3;
    note(s, 'Rentrée dégradée : le comptage syndical des classes sans professeur commence dès le jour 1.', 'rentree');
    if (p.adhesion < K.RENVOI.seuilAdhesionRentreeRatee || s.rng() < K.RENVOI.probaConvocRentreeRatee) {
      s.convocations += 1;
      note(s, `Convocation à Matignon (${s.convocations}/3) : « une rentrée ratée, ça ne se rattrape pas. »`, 'matignon');
    }
    /* Comment le ministre commente-t-il les chiffres ? Les deux existent. */
    const rep = (yield { type: 'rentree', ratee }) || 'assumer';
    if (rep === 'contester') { s.capital += 3; p.adhesion -= 2.5; s.vitrine.sante += 1.5; }
    else { s.capital -= 2; p.adhesion += 1.5; }
  } else {
    p.parents += 3;
    note(s, 'Rentrée sans incident majeur. Personne n\'en parlera.', 'rentree');
  }

  /* An 1 : PISA sciences (8 septembre) — mesure des élèves formés AVANT vous. */
  if (s.annee === 1) {
    const choc = -2.5 + normale(s.rng, 0, 1.6);
    s.vitrine.reussite += choc;
    s.capital -= 4;
    note(s, `PISA sciences : le résultat porte sur des élèves scolarisés depuis dix ans. Vous répondez quand même. (${choc.toFixed(1)} pts affichés)`, 'pisa');
    /* Grève interprofessionnelle du 29 septembre 2027, héritée du front unitaire. */
    appliquerGreve(s, evaluerMobilisation(s, { intensite: 3, theme: 'moyens', segment: 'tous', cause: 'grève interprofessionnelle du 29 septembre' }));
  }
}

/* --- SEPTEMBRE (suite) : la circulaire de rentrée -------------------------- */
/* Chaque rentrée s'accompagne d'une circulaire : quelques mesures, financées
   par redéploiement dans le budget en cours. Étroit, mais immédiat — et c'est
   le moment où le pays regarde l'école. */
function* etapeCirculaireRentree(s) {
  crediter(s, K.ENVELOPPE_RENTREE);
  yield* etapeMesures(s, { moment: 'rentree', taille: K.TAILLE_MENU_COURT });
}

/* --- OCTOBRE : l'audience — face à face avec l'organisation majoritaire ---- */
function* etapeAudience(s) {
  /* L'organisation majoritaire du moment ; l'an 1 alterne avec la deuxième
     pour la variété. Après les élections de décembre, les poids ont bougé. */
  const tri = [...s.syndicats].sort((a, b) => b.poids - a.poids);
  const org = tri[(s.annee + (s.graine % 2)) % 2 === 0 ? 0 : Math.min(1, tri.length - 1)];
  const dispo = AUDIENCES.filter((a) => a.quand(s));
  const audience = dispo[(s.annee * 3 + (s.graine % 7)) % dispo.length];

  const idx = yield { type: 'audience', org, audience };
  const rep = audience.reponses[Math.max(0, Math.min(2, idx | 0))];
  const mult = (RECEPTION[org.profil] || {})[rep.type] || 0;
  const poidsRel = org.poids / 34;                    // rapporté au poids FSU 2022

  /* Effets : la fermeté rassure l'opinion et coûte le corps ; la méthode paie
     en adhésion selon le profil ; la concession paie partout mais se paie
     à Bercy et en capital. */
  if (rep.type === 'ferme') { s.capital += 2; s.phys.parents += 1.5; }
  if (rep.type === 'methode') { s.capital -= 1; }
  if (rep.type === 'concession') { s.capital -= 3; s.creditBercy = borne(s.creditBercy - 3, 0, 100); }
  s.phys.adhesion = borne(s.phys.adhesion + 2.6 * mult * poidsRel, 0, 100);
  if (mult < -1) s.pointsGreveCumules += 1.6 * poidsRel;

  const verdict = mult >= 0.8 ? 'bien' : mult >= 0 ? 'froid' : 'mal';
  s.derniereAudience = { org: org.nom, type: rep.type, verdict, mult };
  note(s, `Audience avec ${org.nom} : réponse « ${rep.type === 'ferme' ? 'fermeté' : rep.type === 'methode' ? 'méthode' : 'concession'} », ${verdict === 'bien' ? 'bien accueillie' : verdict === 'froid' ? 'accueillie froidement' : 'très mal reçue'}.`, 'audience');

  /* Second temps : la revendication. L'organisation exige le retrait de la
     mesure qu'elle conteste le plus. Céder la retire vraiment du jeu ;
     maintenir face à un profil combatif, c'est provisionner une grève. */
  const conteste = mesureContestee(s);
  if (conteste) {
    s.retraitsDemandes[conteste.id] = (s.retraitsDemandes[conteste.id] || 0) + 1;
    const carte = PAR_ID[conteste.id];
    const combatif = ['rapport_de_force', 'frontal', 'radical'].includes(org.profil);
    const risque = evaluerMobilisation(s, {
      intensite: combatif ? 4 : 3,
      theme: (carte.greve && carte.greve.theme) || 'moyens',
      segment: (carte.greve && carte.greve.segment) || 'tous',
      cause: `maintien de « ${carte.label} »`,
    });
    const dec = yield { type: 'retrait', org, carte, mesure: conteste, risque, combatif };
    if (dec === 'ceder') {
      retirerMesure(s, conteste, org, poidsRel);
    } else {
      s.capital += 2;
      s.phys.adhesion = borne(s.phys.adhesion - 1.8 * poidsRel, 0, 100);
      if (combatif && risque) {
        (s.grevesEnAttente = s.grevesEnAttente || []).push({
          intensite: combatif ? 4 : 3,
          theme: (carte.greve && carte.greve.theme) || 'moyens',
          segment: (carte.greve && carte.greve.segment) || 'tous',
          cause: `maintien de « ${carte.label} »`,
        });
        note(s, `${org.nom} quitte l’audience : préavis de grève déposé contre « ${carte.label} ».`, 'greve');
      } else {
        note(s, `Retrait refusé ; ${org.nom} « prend acte » — formule qui n'a jamais rien clos.`, 'audience');
      }
    }
  }
}

/* La mesure que l'intersyndicale conteste le plus parmi celles en vigueur. */
function mesureContestee(s) {
  s.retirees = s.retirees || new Set();
  s.retraitsDemandes = s.retraitsDemandes || {};
  let best = null, bv = 0;
  for (const m of s.mesuresParAnnee.flat()) {
    if (s.retirees.has(m.id)) continue;
    if ((s.retraitsDemandes[m.id] || 0) >= 2) continue;   // ils n'insistent que deux fois
    const c = PAR_ID[m.id];
    const score = (c.greve ? c.greve.intensite * 2 : 0) + Math.max(0, -(c.vitrine?.enseignants || 0));
    if (score >= 4 && score > bv) { bv = score; best = m; }
  }
  return best;
}

/* Retirer une mesure sous la pression : elle sort réellement du jeu — les
   crédits récurrents reviennent, les effets non advenus sont annulés. */
function retirerMesure(s, m, org, poidsRel) {
  const carte = PAR_ID[m.id];
  s.retirees.add(m.id);
  s.chargesRecurrentes = Math.max(0, s.chargesRecurrentes - m.cout);
  for (const e of s.effetsEnAttente) {
    if (e.carte === m.id && !e.applique) { e.retire = true; e.applique = true; }
  }
  s.reformesActives = s.reformesActives.filter((r) => r.id !== m.id);
  s.phys.adhesion = borne(s.phys.adhesion + 4.5 * poidsRel, 0, 100);
  s.phys.parents = borne(s.phys.parents - 3, 0, 100);
  s.capital -= 4;
  s.fatigue = Math.min(K.FATIGUE.max, s.fatigue + K.FATIGUE.parAbandon);
  s.abandons += 1;
  note(s, `Retrait de « ${carte.label} » obtenu par ${org.nom}. La mesure sort du droit ; ses effets ne viendront jamais.`, 'retrait');
}

/* --- DÉCEMBRE : vote du budget, publications DEPP, élections pro (an 1) ---- */
function etapeDecembre(s) {
  if (s.annee === 1) {
    /* Élections professionnelles : re-pondération des 7 organisations pour la
       suite du mandat. Une adhésion basse profite aux organisations de lutte. */
    const derive = (25 - s.phys.adhesion) / 100;
    for (const o of s.syndicats) {
      const radical = o.profil === 'radical' || o.profil === 'frontal' || o.profil === 'rapport_de_force';
      o.poids *= 1 + (radical ? derive : -derive) * 0.8;
    }
    const tot = s.syndicats.reduce((a, o) => a + o.poids, 0);
    for (const o of s.syndicats) o.poids = (o.poids / tot) * 100;
    note(s, 'Élections professionnelles : la représentativité est rebattue pour quatre ans.', 'syndicats');
  }
  /* Note de la DEPP : elle publie ce qu'elle mesure, y compris contre vous. */
  if (s.phys.heuresNonAssurees > 11) { s.phys.parents -= 3; s.vitrine.sante -= 1.5; }
}

/* --- JANVIER : CSA ministériel, carte scolaire, DHG, et l'atelier de mesures */
function* etapeJanvier(s) {
  s.capital = Math.min(K.CAPITAL.plafond, s.capital + K.CAPITAL.parAn);

  /* (a) Le tendanciel démographique de l'année. */
  const baisse = K.BAISSE_ELEVES[s.anneeCiv] || -160;         // milliers d'élèves
  const postesLiberables = Math.round((-baisse * 1000) / K.ELEVES_PAR_POSTE);

  const ctx = { baisse, postesLiberables, schemaDemande: s.schemaEmploisDemande, restitutionMax: s.restitutionMax };
  let { restitution, prive } = yield { type: 'carteScolaire', ...ctx };
  restitution = borne(restitution, 0, s.restitutionMax);
  prive = borne(prive, 0, 1);

  const postesRendus = Math.round(restitution * postesLiberables);
  s.dernierPostesRendus = postesRendus;
  (s.historiqueRestitution = s.historiqueRestitution || []).push({ rentree: s.anneeCiv + 1, pct: Math.round(restitution * 100) });
  const economie = postesRendus * K.CADRAGE.coutETPhorsCAS;

  /* Bercy compare aux emplois qu'il a exigés en juillet. */
  const ecart = postesRendus + s.schemaEmploisDemande;        // schéma négatif
  s.creditBercy += ecart >= 0 ? Math.min(13, 4 + ecart / 700) : Math.max(-18, ecart / 260);
  s.creditBercy = borne(s.creditBercy, 0, 100);

  /* La signature de juin. Bercy compare l'engagement à la restitution réelle,
     une seule fois — celle qui suit l'avance. */
  if (s.engagementRestitution > 0) {
    if (restitution + 1e-9 < s.engagementRestitution) {
      s.creditBercy = borne(s.creditBercy - K.MANQUEMENT_ENGAGEMENT.creditBercy, 0, 100);
      s.capital -= K.MANQUEMENT_ENGAGEMENT.capital;
      note(s, `Engagement de juin non tenu : ${Math.round(restitution * 100)} % restitués pour ${Math.round(s.engagementRestitution * 100)} % promis. Bercy verse la lettre au dossier.`, 'bercy');
    } else {
      s.creditBercy = borne(s.creditBercy + 6, 0, 100);
      note(s, 'Engagement de juin tenu. Bercy vous accorde le bénéfice du doute pour la suite.', 'bercy');
    }
    s.engagementRestitution = 0;
  }

  /* Les personnels comptent les suppressions, pas les intentions. */
  s.phys.adhesion -= (postesRendus / 1000) * 1.05;
  if (restitution > K.SEUIL_COLERE_MAIRES) {
    s.capital -= 6; s.phys.parents -= 3;
    note(s, 'Les maires invoquent la règle : aucune école ne ferme sans leur accord.', 'maires');
  }

  /* Encadrement : une division ≈ 1,35 ETP (décharges, options, remplaçants). */
  const divisions = (s.eleves * 1000) / s.ratioED;
  const divisionsNew = Math.max(1000, divisions - postesRendus / 1.35);
  s.eleves = s.eleves + baisse;
  s.ratioED = (s.eleves * 1000) / divisionsNew;

  /* (b) Répartition de l'effort public / privé sous contrat. */
  s.phys.segregation += (0.5 - prive) * 1.8;
  if (prive > 0.78) {
    s.provocationsPrive = (s.provocationsPrive || 0) + 1;
    s.capital -= 5;
    note(s, 'Le privé sous contrat se mobilise. Le mot « Savary » revient dans la presse.', 'prive');
    /* Il faut insister pour déclencher une guerre scolaire : une année de
       tension ne suffit pas, deux commencent à faire une histoire. */
    if (s.provocationsPrive >= 2) s.guerreScolaireArmee = true;
  }

  /* (c) L'atelier de mesures — le cœur du jeu.
     `margeAnnee` est la marge NOUVELLE de l'année (croissance de la mission +
     concession de Bercy) ; `economie` est l'argent frais dégagé par les postes
     rendus. Les charges déjà engagées sont dans la base : elles ne se
     re-paient pas, elles ont consommé définitivement la marge des années
     passées. C'est l'effet cliquet : vos décisions réduisent la marge de vos
     successeurs, pas la vôtre. */
  s.economieCarteScolaire = economie;
  crediter(s, s.margeAnnee + economie);
  yield* etapeMesures(s, { moment: 'janvier' });
}

/* Crédite la trésorerie d'argent frais. `margeCumulee` mémorise tout ce que
   le mandat a reçu : c'est elle qui mesure le sur-engagement. */
/* --- JUIN : l'avance de gestion, premier arbitrage du mandat -------------- */
function* etapeAvance(s) {
  const idx = yield { type: 'avance', options: K.AVANCE_GESTION };
  const o = K.AVANCE_GESTION[Math.max(0, Math.min(K.AVANCE_GESTION.length - 1, idx | 0))];
  s.avance = o.id;
  s.engagementRestitution = o.restitution;
  s.schemaAvance = o.schema;              // durcissement du schéma d'emplois de l'an 1
  s.capital = borne(s.capital + o.capital, 0, K.CAPITAL.plafond);
  s.creditBercy = borne(s.creditBercy + o.bercy, 0, 100);
  if (o.bonus > 0) crediter(s, o.bonus);
  note(s, o.bonus > 0
    ? `Avance de gestion obtenue : ${fmtMd(o.bonus)} Md€ dégelés contre un engagement de ${Math.round(o.restitution * 100)} % de restitution en janvier.`
    : 'Aucune demande à Bercy. Vous partez avec ce que votre prédécesseur a laissé.', 'bercy');
}

function crediter(s, montant) {
  s.margeCumulee = (s.margeCumulee || 0) + montant;
  s.tresor = Math.max(0, s.tresor) + montant;
}

/* L'atelier de mesures, réutilisable à chacune des trois fenêtres de l'année :
   juin (prise de fonction, an 1), septembre (circulaire de rentrée) et janvier
   (l'arbitrage principal, adossé à la carte scolaire). */
function* etapeMesures(s, opts) {
  const neufs = ouvrirNouveauxDossiers(s);
  const dispo = mesuresDisponibles(s, opts.taille);
  const maxAnnonces = K.ANNONCES_MAX[opts.moment] || 3;
  /* On n'arrache un arbitrage interministériel qu'au moment du budget. Une
     circulaire de rentrée se finance par redéploiement, ou ne se finance pas. */
  const depassementAutorise = opts.moment === 'janvier';
  const choix = (yield {
    type: 'mesures', moment: opts.moment, dispo, maxAnnonces, depassementAutorise,
    tresor: s.tresor, capital: s.capital, nouveaux: neufs.map((c) => c.id),
  }) || [];
  appliquerMesures(s, choix, maxAnnonces, depassementAutorise);
}

/* --- MARS : mobilisations de printemps ------------------------------------ */
function etapeMars(s) {
  for (const g of (s.grevesEnAttente || [])) appliquerGreve(s, evaluerMobilisation(s, g));
  s.grevesEnAttente = [];
  /* Une adhésion effondrée produit un conflit même sans mesure déclenchante. */
  if (s.phys.adhesion < 12 && s.rng() < 0.55) {
    appliquerGreve(s, evaluerMobilisation(s, { intensite: 3, theme: 'moyens', segment: 'tous', cause: 'mobilisation sur les moyens' }));
  }
}

/* --- MAI : clôture de l'année scolaire, tendanciels, attractivité --------- */
function etapeCloture(s) {
  const p = s.phys;

  /* Effets réels arrivés à échéance : ils entrent enfin dans la vérité. */
  s.acquis = s.acquis || { reussite: 0, egalite: 0, sante: 0, paix: 0, budget: 0 };
  for (const e of s.effetsEnAttente) {
    if (!e.applique && e.anneeArrivee <= s.annee) { s.acquis[e.compteur] += e.montant; e.applique = true; e.anneeOuverture = s.annee; }
  }

  /* Tendanciels : ce qui se dégrade tout seul si l'on ne fait rien. */
  p.heuresNonAssurees += K.TENDANCIEL.heuresNonAssurees;
  p.segregation += K.TENDANCIEL.segregation;
  p.positionSalariale += K.TENDANCIEL.positionSalariale;
  p.affection += K.TENDANCIEL.affection;
  p.adhesion += K.TENDANCIEL.adhesion;

  /* Effets temporaires sur les heures non assurées (ex. formation continue). */
  s.hnaTemporaires = s.hnaTemporaires.filter((t) => {
    p.heuresNonAssurees += t.delta;
    t.reste -= 1;
    if (t.reste <= 0) { p.heuresNonAssurees -= t.delta * t.applique; return false; }
    t.applique = (t.applique || 0) + 1;
    return true;
  });
  /* Postes non pourvus : le remplacement se dégrade mécaniquement. */
  p.heuresNonAssurees += (K.ATTRACTIVITE.couvertureReference - p.couvertureConcours) * K.ATTRACTIVITE.effetHNAparPointCouv;
  p.heuresNonAssurees = borne(p.heuresNonAssurees, 2, 26);

  /* Inertie : les jauges d'opinion reviennent lentement vers leur moyenne. */
  const cibleAdh = borne(
    K.INERTIE_OPINION.cibleAdhesion
      + (p.positionSalariale - K.PHYSIQUE_INITIALE.positionSalariale) * K.INERTIE_OPINION.gainParPointSalaire
      - (p.heuresNonAssurees - 9.8) * K.INERTIE_OPINION.perteParPointHNA, 5, 80);
  s.cibleAdhesion = cibleAdh;
  p.adhesion += (cibleAdh - p.adhesion) * K.INERTIE_OPINION.vitesse;
  p.parents  += (K.INERTIE_OPINION.cibleParents - p.parents) * K.INERTIE_OPINION.vitesseParents;

  /* Conflictualité latente : le conflit sans la grève (préavis, motions,
     boycott des instances). La paix sociale s'use même sans journée d'action. */
  s.pointsGreveCumules += Math.max(0, (25 - p.adhesion) * K.GREVE.conflictualiteLatente);

  p.adhesion = borne(p.adhesion, 0, 100);
  p.affection = borne(p.affection, 40, 100);
  p.parents = borne(p.parents, 0, 100);

  /* Boucle d'attractivité : salaires + considération + conditions → candidats. */
  const normSalaire = borne(100 + p.positionSalariale * 3.2, 0, 100);
  const conditions = borne(100 - (p.heuresNonAssurees - 5) * 4.5 - (s.ratioED - 19) * 6, 0, 100);
  const attractivite = K.ATTRACTIVITE.poidsSalaire * normSalaire
                     + K.ATTRACTIVITE.poidsAdhesion * p.adhesion
                     + K.ATTRACTIVITE.poidsConditions * conditions;
  s.attractiviteCible = borne(K.ATTRACTIVITE.base + attractivite * K.ATTRACTIVITE.pente + (s.bonusAttractivite || 0), 55, 100);
  s.bonusAttractivite = (s.bonusAttractivite || 0) * 0.55;

  /* L'effet-vitrine s'use ; le bruit est retiré chaque année. */
  for (const c of Object.keys(s.vitrine)) {
    s.vitrine[c] *= K.DECROISSANCE_VITRINE;
    s.bruit[c] = normale(s.rng, 0, K.BRUIT_AFFICHE);
  }

  /* Fatigue réformatrice : ne rien annoncer la fait retomber. */
  if (!(s.mesuresParAnnee[s.annee - 1] || []).length) {
    s.anneesSansAnnonce += 1;
    s.fatigue = Math.max(0, s.fatigue + K.FATIGUE.parAnneeSansAnnonce);
    /* Le système souffle — mais l'Élysée s'impatiente et la presse écrit
       « ministre invisible ». L'immobilisme a aussi son prix politique. */
    s.capital -= K.IMMOBILISME.capital;
    s.phys.parents -= K.IMMOBILISME.parents;
    note(s, 'Une année sans annonce : le système souffle, l\'Élysée s\'impatiente.', 'elysee');
  }
  if (absorption(s).nActives > K.ABSORPTION.seuil) s.anneesSurcharge = (s.anneesSurcharge || 0) + 1;
  s.reformesActives = s.reformesActives.filter((r) => r.anneeFin >= s.annee);

  rafraichir(s);
  s.histoire.push({
    annee: s.annee, anneeCiv: s.anneeCiv,
    affiche: { ...s.affiche }, vrai: { ...s.vrai },
    capital: s.capital, creditBercy: s.creditBercy, fatigue: s.fatigue,
    hna: +p.heuresNonAssurees.toFixed(2), couverture: +p.couvertureConcours.toFixed(1),
    adhesion: +p.adhesion.toFixed(1), parents: +p.parents.toFixed(1),
    ratioED: +s.ratioED.toFixed(2), segregation: +p.segregation.toFixed(2),
    positionSalariale: +p.positionSalariale.toFixed(2),
    tresor: +s.tresor.toFixed(3), charges: +s.chargesRecurrentes.toFixed(3),
    mesures: (s.mesuresParAnnee[s.annee - 1] || []).map((m) => m.id),
  });

  /* Survie politique. */
  if (s.capital < 12 && s.rng() < K.RENVOI.probaConvocCapitalBas) {
    s.convocations += 1;
    note(s, `Convocation à Matignon (${s.convocations}/3) : capital politique épuisé.`, 'matignon');
  }
  if (p.parents < K.RENVOI.seuilParents && s.rng() < K.RENVOI.probaConvocParents) {
    s.convocations += 1;
    note(s, `Convocation à Matignon (${s.convocations}/3) : les fédérations de parents ont été reçues avant vous.`, 'matignon');
  }
  if (s.creditBercy < K.RENVOI.seuilCreditBercy && s.rng() < K.RENVOI.probaConvocBercy) {
    s.convocations += 1;
    note(s, `Convocation à Matignon (${s.convocations}/3) : Bercy a fait remonter le dossier.`, 'matignon');
  }
  if (s.vrai.paix < K.RENVOI.seuilPaixCritique && p.adhesion < 15) {
    s.convocations += 1;
    note(s, `Convocation à Matignon (${s.convocations}/3) : le pays enseignant est bloqué.`, 'matignon');
  }
  /* Remaniement : indépendant de vos mérites, modulé par votre solidité. */
  if (!s.fini && s.annee < 5) {
    const pRem = borne(K.RENVOI.remaniementBase
      - s.capital / K.RENVOI.remaniementParCapital
      - (p.parents - 45) / K.RENVOI.remaniementParParents,
      K.RENVOI.remaniementMin, K.RENVOI.remaniementMax);
    if (s.rng() < pRem) {
      s.fini = true;
      s.fin = { type: 'remaniement', annee: s.annee, texte: 'Remaniement. Rien de personnel : votre nom figurait dans une autre colonne du tableau. Vos réformes, elles, avaient encore trois ans devant elles.' };
    }
  }
  if (s.convocations >= K.RENVOI.convocationsFatales) {
    s.fini = true;
    s.fin = { type: 'renvoi', annee: s.annee, texte: 'Remaniement. Vous quittez la rue de Grenelle. Durée moyenne d\'un ministre de l\'Éducation nationale : deux ans.' };
  }
  if (s.guerreScolaireArmee && s.capital < 22 && s.rng() < 0.26) {
    s.fini = true;
    s.fin = { type: 'guerre_scolaire', annee: s.annee, texte: 'Guerre scolaire. Un million de personnes dans la rue, comme en 1984. Le gouvernement retire le texte, et vous avec.' };
  }
}

/* ============================================================================
   5. MESURES : disponibilité, application
   ========================================================================== */
/* --------------------------------------------------------------------------
   DÉCOUVERTE PROGRESSIVE DU CATALOGUE
   --------------------------------------------------------------------------
   Un ministre ne connaît pas son ministère le jour de sa nomination. Les
   dossiers remontent : parce qu'un rapport tombe, parce qu'un indicateur se
   dégrade, parce qu'une mesure déjà prise en appelle une autre. Une partie du
   catalogue n'est donc pas sur le bureau au premier jour — elle s'y ajoute au
   fil du mandat, et le joueur en est informé.

   Chaque déclencheur est nommé et testable ; les seuils reprennent ceux que le
   moteur utilise déjà ailleurs, pour qu'un dossier remonte au moment où la
   situation qu'il traite devient réellement visible.
   -------------------------------------------------------------------------- */
const DECLENCHEURS = {
  apres_un_an:            (s) => s.annee >= 2,
  heures_perdues:         (s) => s.phys.heuresNonAssurees >= 10.6,
  reussite_basse:         (s) => s.annee >= 2 && s.affiche.reussite <= 46,
  segregation_haute:      (s) => s.phys.segregation >= 18.6,
  maires_en_colere:       (s) => (s.historiqueRestitution || []).some((h) => h.pct > 55),
  apres_pause_numerique:  (s) => s.joue.has('pause_numerique'),
};

export function estDecouverte(s, c) {
  const d = c.decouverte;
  if (!d) return true;
  if (s.decouvertes && s.decouvertes.has(c.id)) return true;   // une fois ouvert, il le reste
  if (d.annee && s.annee < d.annee) return false;
  if (d.si && !(DECLENCHEURS[d.si] || (() => true))(s)) return false;
  return true;
}

/* Enregistre les dossiers qui viennent d'apparaître et renvoie la liste, pour
   que l'atelier puisse les signaler au joueur. Appelé une fois par fenêtre. */
function ouvrirNouveauxDossiers(s) {
  s.decouvertes = s.decouvertes || new Set();
  const neufs = [];
  for (const c of CATALOGUE) {
    if (!c.decouverte || s.decouvertes.has(c.id)) continue;
    if (!estDecouverte(s, c)) continue;
    s.decouvertes.add(c.id);
    neufs.push(c);
    if (c.decouverte.note) note(s, c.decouverte.note, 'dossier');
  }
  if (neufs.length) {
    note(s, `${neufs.length} nouveau${neufs.length > 1 ? 'x' : ''} dossier${neufs.length > 1 ? 's' : ''} sur votre bureau : ${neufs.map((c) => c.label).join(' · ')}.`, 'dossier');
  }
  return neufs;
}

function estJouable(s, c) {
  if (c.once && s.joue.has(c.id)) return false;
  if (c.theme && s.themes.has(c.theme)) return false;
  if (c.excl && s.excl.has(c.excl)) return false;
  if (!estDecouverte(s, c)) return false;
  return true;
}

/* Le menu de janvier : 12 cartes tournantes sur le catalogue de 40, comme le
   jeu de référence (système once/theme/excl + rotation déterministe).
   Toujours proposées : la revalorisation (on revalorise à chaque budget, ou
   jamais) et les mesures présidentielles encore à caser — l'Élysée s'assure
   qu'elles restent sur votre bureau. */
/* Affinité d'une carte avec la doctrine déclarée : les effets réels qui
   servent vos deux premières priorités pèsent le plus. */
export function affiniteDoctrine(s, c) {
  if (!s.doctrine) return 0;
  let a = 0;
  const rang = (cc) => s.doctrine.indexOf(cc);
  for (const e of c.reel || []) {
    const r = rang(e.compteur);
    if (e.central > 0 && r >= 0 && r < 3) a += (3 - r);
  }
  if (c.parametrique === 'revalorisation' && rang('sante') < 3) a += 2;
  return a;
}

export function mesuresDisponibles(s, tailleVoulue) {
  const TAILLE_MENU = tailleVoulue || K.TAILLES_MENU[Math.min(4, s.annee - 1)];
  const pool = CATALOGUE.filter((c) => estJouable(s, c));
  const menu = [];
  const pousse = (c) => { if (c && !menu.includes(c)) menu.push(c); };

  pousse(pool.find((c) => c.id === 'revalorisation'));

  /* Votre doctrine ouvre d'abord les dossiers qui la servent : en début de
     mandat, l'essentiel du menu est aligné sur vos priorités déclarées ;
     le reste du catalogue arrive au fil des années. */
  const reste = pool.filter((c) => !menu.includes(c));
  const affins = reste.filter((c) => affiniteDoctrine(s, c) >= 2);
  const autres = reste.filter((c) => !affins.includes(c));
  const quotaAffins = [5, 4, 3, 2, 1][Math.min(4, s.annee - 1)];
  const tourner = (arr, mult) => {
    if (!arr.length) return [];
    const dec = (s.annee * mult + (s.graine % 13)) % arr.length;
    return arr.map((_, i) => arr[(dec + i) % arr.length]);
  };
  for (const c of tourner(affins, 7)) { if (menu.length >= 1 + quotaAffins + 2) break; pousse(c); }
  for (const c of tourner(autres, 5)) { if (menu.length >= TAILLE_MENU) break; pousse(c); }
  for (const c of tourner(affins, 7)) { if (menu.length >= TAILLE_MENU) break; pousse(c); }
  return menu;
}

/* Coût réel d'une carte, curseurs compris. */
export function coutDe(carte, options = {}) {
  if (carte.parametrique === 'financement19') {
    const f = FINANCEMENT_19[options.financement || 'demographie'];
    return { cout: f.cout, coutETP: f.coutETP, pol: carte.pol };
  }
  if (carte.parametrique === 'revalorisation') {
    const ch = chiffrerRevalorisation(options.montant ?? REVALORISATION.montant.defaut,
                                     options.instrument || 'indiciaire', options.cible || 'tous');
    /* Plus c'est gros, plus il faut arracher l'arbitrage ; une prime coûte
       moins de capital qu'une hausse indiciaire, que Bercy sait irréversible. */
    const polInstrument = { indiciaire: 4, prime: 0, pacte: -2 }[options.instrument || 'indiciaire'];
    return { cout: ch.montantMd, coutETP: 0, pol: Math.max(3, carte.pol + polInstrument + Math.round(ch.montantMd * 2)) };
  }
  return { cout: carte.cout, coutETP: carte.coutETP, pol: carte.pol };
}

function appliquerMesures(s, choix, maxAnnonces = 3, depassementAutorise = true) {
  const retenues = [];
  for (const ch of choix) {
    if (retenues.length >= maxAnnonces) break;   // le calendrier réglementaire ne suit pas
    const carte = PAR_ID[ch.id];
    if (!carte) continue;
    if (!mesuresDisponibles(s).includes(carte)) continue;
    const { cout, coutETP, pol } = coutDe(carte, ch.options || {});
    if (pol > s.capital) continue;                       // le capital bloque réellement
    if (carte.perimetre === 'matignon' && pol * 2 > s.capital) continue;
    if (!depassementAutorise && cout > s.tresor) continue; // redéploiement seulement

    const polReel = carte.perimetre === 'matignon' ? pol * 2 : pol;
    s.capital -= polReel;
    s.tresor -= cout;
    s.chargesRecurrentes += cout;

    s.joue.add(carte.id);
    if (carte.theme) s.themes.add(carte.theme);
    if (carte.excl) s.excl.add(carte.excl);
    if (carte.reforme) {
      s.fatigue = Math.min(K.FATIGUE.max, s.fatigue + K.FATIGUE.parReforme);
      s.reformesActives.push({ id: carte.id, anneeFin: s.annee + K.ABSORPTION.dureeActive - 1 });
    }

    /* Vitrine : immédiate, visible, périssable. */
    s.phys.parents += carte.vitrine.parents;
    s.phys.adhesion += carte.vitrine.enseignants;
    for (const [c, v] of Object.entries(carte.vitrine.compteurs || {})) s.vitrine[c] += v;

    /* Physique. */
    const ph = carte.physique || {};
    if (ph.adhesion) s.phys.adhesion += ph.adhesion;
    if (ph.affection) s.phys.affection += ph.affection;
    if (ph.segregation) s.phys.segregation += ph.segregation;
    if (ph.ratioED) s.ratioED += ph.ratioED;
    if (ph.hna) s.hnaTemporaires.push({ delta: ph.hna.delta, reste: ph.hna.duree, applique: 0 });
    if (ph.attractivite) s.bonusAttractivite = (s.bonusAttractivite || 0) + ph.attractivite;
    if (carte.bercy) s.creditBercy = borne(s.creditBercy + carte.bercy, 0, 100);
    if (carte.coutETP) s.ratioED -= carte.coutETP / 35000;   // les ETP créés desserrent l'encadrement

    /* Effets réels, curseurs compris. */
    let effets = carte.reel;
    let mult = 1;
    if (carte.parametrique === 'revalorisation') {
      const r = chiffrerRevalorisation(ch.options?.montant ?? REVALORISATION.montant.defaut,
                                       ch.options?.instrument || 'indiciaire', ch.options?.cible || 'tous');
      s.phys.positionSalariale += r.gainPosition;
      s.phys.adhesion += (r.cible.adhesion + r.instrument.adhesion) * r.echelle;
      s.bonusAttractivite = (s.bonusAttractivite || 0) + r.cible.attractivite * r.echelle * r.instrument.facteurPosition;
      s.creditBercy = borne(s.creditBercy + r.instrument.bercy * Math.min(2, r.echelle), 0, 100);
      /* Le pacte paie du remplacement : c'est son seul avantage documenté. */
      if (r.instrument.hna) s.hnaTemporaires.push({ delta: r.instrument.hna * Math.min(2, r.echelle), reste: 99, applique: 0 });
      mult *= r.echelle * r.instrument.facteurPosition;
      effets = r.cible.reel;
      note(s, `Revalorisation : ${fmtMd(r.montantMd)} Md€/an, ${r.instrument.label.toLowerCase()}, ${r.cible.label.toLowerCase()} — soit ${Math.round(r.euroParMois)} € brut par mois pour ${Math.round(r.concernes / 1000)} 000 enseignants.`, 'salaires');
    }
    if (carte.parametrique === 'financement19') {
      const f = FINANCEMENT_19[ch.options?.financement || 'demographie'];
      s.creditBercy = borne(s.creditBercy + f.creditBercy, 0, 100);
      s.phys.adhesion += f.adhesion;
      s.ratioED += (ch.options?.financement === 'recrutement') ? -2.0 : -0.9;
      if (f.forceRestitutionMax !== undefined) s.restitutionMax = f.forceRestitutionMax;
    }
    /* Goulot de recrutement : l'argent ne produit qu'au rythme des postes pourvus. */
    if (carte.goulot) mult *= borne(s.phys.couvertureConcours / 100, 0.3, 1) * 0.75;

    programmerEffets(s, carte, effets, mult);
    if (carte.greve) (s.grevesEnAttente = s.grevesEnAttente || []).push({ ...carte.greve, cause: carte.label });
    if (carte.provocations) {
      s.provocationsPrive = (s.provocationsPrive || 0) + carte.provocations;
      if (s.provocationsPrive >= 2) s.guerreScolaireArmee = true;
    }

    retenues.push({ id: carte.id, options: ch.options || {}, cout, annee: s.annee });
  }

  /* Dépassement : possible, et cher. Il ne porte que sur les engagements
     NOUVEAUX de l'année — au-delà, une charge trop lourde produit une
     pénalité structurelle annuelle, plus douce mais persistante. */
  if (s.tresor < 0) {
    const dep = -s.tresor;
    s.creditBercy = borne(s.creditBercy - K.SURCOUT.creditBercyParMd * dep, 0, 100);
    s.capital -= K.SURCOUT.capitalParMd * dep;
    note(s, `Dépassement de ${dep.toFixed(2)} Md€ : arbitrage interministériel arraché, crédit Bercy entamé.`, 'bercy');
    s.tresor = 0;
  }
  const surEngagement = s.chargesRecurrentes - (s.margeCumulee || 0);
  if (surEngagement > 0.05) {
    s.creditBercy = borne(s.creditBercy - Math.min(K.SURCOUT.penaliteStructurelleMax, surEngagement * K.SURCOUT.penaliteStructurelleParMd), 0, 100);
  }
  s.mesuresParAnnee[s.annee - 1] = (s.mesuresParAnnee[s.annee - 1] || []).concat(retenues);
  s.phys.adhesion = borne(s.phys.adhesion, 0, 100);
  s.phys.parents = borne(s.phys.parents, 0, 100);
}

/* ============================================================================
   6. BOUCLE PRINCIPALE
   ========================================================================== */
/* Le mandat, pas à pas : un générateur qui s'interrompt à chaque décision.
   `yield {type: ...}` = une question au joueur ; la réponse revient par
   `gen.next(reponse)`. L'interface interactive et les stratégies simulées
   pilotent EXACTEMENT le même déroulé — c'est la garantie que ce qui a été
   équilibré est ce qui sera joué. Les yields `type:'etape'` sont
   informatifs : l'interface y affiche le récit, les simulations les ignorent. */
export function* derouler(s) {
  yield* etapeDoctrine(s);
  rafraichir(s);
  /* La note de cadrage que la direction générale remet à tout nouveau ministre
     avant son premier arbitrage : budget, démographie, niveaux. Tous les
     chiffres viennent de `moteur/reperes.js` et sont sourcés. */
  yield { type: 'reperes' };
  /* Juin : on n'attend pas le prochain budget pour agir. La loi de finances
     votée par le prédécesseur laisse une marge de redéploiement — et la
     réserve de précaution, elle, se négocie. */
  yield* etapeAvance(s);
  crediter(s, K.ENVELOPPE_PRISE_FONCTION);
  yield* etapeMesures(s, { moment: 'prise_fonction', taille: K.TAILLE_MENU_COURT });
  rafraichir(s);
  yield { type: 'etape', etape: 'ouverture' };
  yield* etapeEte(s);
  rafraichir(s);

  for (s.annee = 1; s.annee <= 5 && !s.fini; s.annee++) {
    s.anneeCiv = 2026 + s.annee;                 // année civile de la carte scolaire
    yield* etapeJuillet(s);   s.mois = 6;  yield { type: 'etape', etape: 'juillet' };
    yield* etapeRentree(s);   s.mois = 8;
    yield* etapeCirculaireRentree(s);        yield { type: 'etape', etape: 'rentree' };
    yield* etapeAudience(s);  s.mois = 9;
    etapeDecembre(s);         s.mois = 11; yield { type: 'etape', etape: 'decembre' };
    yield* etapeJanvier(s);   s.mois = 0;
    etapeMars(s);             s.mois = 2;  yield { type: 'etape', etape: 'mars' };
    etapeCloture(s);          s.mois = 4;
    rafraichir(s);
    yield { type: 'etape', etape: 'cloture' };
  }
  if (!s.fini) { s.fini = true; s.fin = { type: 'mandat_complet', annee: 5, texte: 'Cinq rentrées. Vous partez debout — ce qui, rue de Grenelle, est déjà un résultat.' }; }
  s.annee = Math.min(5, s.annee);
}

/* Pilote synchrone : joue un mandat entier avec une `politique` (objet de
   fonctions de décision). C'est l'interface qu'utilisent les simulations. */
export function jouerMandat({ graine = 1, politique }) {
  const s = creerPartie({ graine, politique });
  const gen = derouler(s);
  let res = gen.next();
  while (!res.done) {
    const q = res.value;
    let rep;
    if (q.type === 'nomination') rep = 'accepter';
    else if (q.type === 'reperes') rep = null;   // la note de cadrage se lit, elle ne se décide pas
    else if (q.type === 'avance') rep = politique.avance ? politique.avance(s, q) : 1;
    else if (q.type === 'doctrine') rep = politique.doctrine ? politique.doctrine(s) : Object.keys(K.COMPTEURS_INITIAUX);
    else if (q.type === 'lettrePlafond') rep = politique.lettrePlafond ? politique.lettrePlafond(s, q.palier) : 'accepter';
    else if (q.type === 'rentree') rep = politique.rentree ? politique.rentree(s, q) : 'assumer';
    else if (q.type === 'carteScolaire') rep = politique.carteScolaire(s, q);
    else if (q.type === 'mesures') rep = politique.mesures(s, q.dispo, q) || [];
    else if (q.type === 'dossier') rep = politique.dossier ? politique.dossier(s, q.dossier) : 1;
    else if (q.type === 'audience') rep = politique.audience ? politique.audience(s, q) : 1;
    else if (q.type === 'retrait') rep = politique.retrait ? politique.retrait(s, q) : 'maintenir';
    res = gen.next(rep);
  }
  return bilan(s);
}

/* ============================================================================
   7. PROJECTION À DIX ANS — « si votre successeur maintient le cap »
   ----------------------------------------------------------------------------
   On ne plaque pas un bonus : on prolonge la physique du système sur cinq
   années supplémentaires. Les effets encore en route arrivent, la boucle
   d'attractivité continue de tourner dans le sens où le mandat l'a lancée, et
   les charges récurrentes engagées continuent de produire.
   Référence : Portugal, quinze ans de cap constant malgré l'alternance, seul
   pays de l'OCDE en progression dans les trois domaines de PISA 2000-2018.
   ========================================================================== */
export function projeterDixAns(s, constance) {
  const p = { ...s.phys };
  let ratio = s.ratioED;
  const acquis = { ...(s.acquis || { reussite: 0, egalite: 0, sante: 0, paix: 0, budget: 0 }) };
  const enRoute = s.effetsEnAttente.filter((e) => !e.applique).map((e) => ({ ...e }));
  /* Sans constance, le successeur détricote : les effets encore en route
     n'arrivent qu'à 60 %, et les dérives spontanées reprennent en entier. */
  const complet = s.fin.type === 'mandat_complet';
  const tenu = complet ? 1 : 0.70;
  /* Rythme imprimé par le mandat, par an : c'est lui que le successeur prolonge. */
  const ans = Math.max(1, s.histoire.length);
  const rythme = {
    positionSalariale: (p.positionSalariale - K.PHYSIQUE_INITIALE.positionSalariale) / ans,
    segregation: (p.segregation - K.PHYSIQUE_INITIALE.segregation) / ans,
    hna: (p.heuresNonAssurees - K.PHYSIQUE_INITIALE.heuresNonAssurees) / ans,
  };
  const k = constance ? K.PROJECTION.poursuiteDuCap : 0;

  for (let an = s.annee + 1; an <= s.annee + 5; an++) {
    for (const e of enRoute) {
      if (!e.applique && e.anneeArrivee <= an) { acquis[e.compteur] += e.montant * tenu; e.applique = true; }
    }
    /* Le cap tenu gèle les dérives que le mandat a corrigées ; sinon elles reprennent. */
    /* Si le cap tient, la dérive spontanée est neutralisée et la trajectoire du
       mandat se prolonge ; sinon tout reprend comme avant vous. */
    p.positionSalariale += constance ? rythme.positionSalariale * k : K.TENDANCIEL.positionSalariale;
    p.segregation += constance ? rythme.segregation * k : K.TENDANCIEL.segregation;
    p.affection += K.TENDANCIEL.affection * (constance ? 0.2 : 1);

    const cibleAdh = borne(K.INERTIE_OPINION.cibleAdhesion
      + (p.positionSalariale - K.PHYSIQUE_INITIALE.positionSalariale) * K.INERTIE_OPINION.gainParPointSalaire
      - (p.heuresNonAssurees - 9.8) * K.INERTIE_OPINION.perteParPointHNA, 5, 80);
    p.adhesion += (cibleAdh - p.adhesion) * K.INERTIE_OPINION.vitesse;

    const normSalaire = borne(100 + p.positionSalariale * 3.2, 0, 100);
    const conditions = borne(100 - (p.heuresNonAssurees - 5) * 4.5 - (ratio - 19) * 6, 0, 100);
    const attractivite = K.ATTRACTIVITE.poidsSalaire * normSalaire
                       + K.ATTRACTIVITE.poidsAdhesion * p.adhesion
                       + K.ATTRACTIVITE.poidsConditions * conditions;
    const cibleCouv = borne(K.ATTRACTIVITE.base + attractivite * K.ATTRACTIVITE.pente, 55, 100);
    p.couvertureConcours += (cibleCouv - p.couvertureConcours) * K.ATTRACTIVITE.inertieCouverture;

    p.heuresNonAssurees += (constance ? rythme.hna * k : K.TENDANCIEL.heuresNonAssurees)
      + (K.ATTRACTIVITE.couvertureReference - p.couvertureConcours) * K.ATTRACTIVITE.effetHNAparPointCouv;
    p.heuresNonAssurees = borne(p.heuresNonAssurees, 2, 26);
  }

  /* Le cap tenu compose : c'est l'effet Portugal, la seule façon de gagner. */
  if (constance) for (const c of Object.keys(acquis)) if (acquis[c] > 0) acquis[c] *= 1 + K.PROJECTION.bonusConstance;

  const v = {};
  v.reussite = K.COMPTEURS_INITIAUX.reussite + acquis.reussite - (p.heuresNonAssurees - 9.8) * 1.10 - (ratio - K.RATIO_ED_INITIAL) * 2.2;
  v.egalite  = K.COMPTEURS_INITIAUX.egalite + acquis.egalite - (p.segregation - K.PHYSIQUE_INITIALE.segregation) * 1.45;
  v.sante    = K.COMPTEURS_INITIAUX.sante + acquis.sante + (p.couvertureConcours - 92) * 0.85
             - (p.heuresNonAssurees - 9.8) * 1.50 + (p.adhesion - 25) * 0.30 + (p.affection - 90) * 0.15;
  v.paix     = K.COMPTEURS_INITIAUX.paix - s.pointsGreveCumules * K.GREVE.coutPaixParPointGreve + acquis.paix;
  v.budget   = K.COMPTEURS_INITIAUX.budget + acquis.budget
             + (p.positionSalariale - K.PHYSIQUE_INITIALE.positionSalariale) * 3.0
             + (s.creditBercy - K.CREDIT_BERCY_INITIAL) * 0.30;
  for (const c of Object.keys(v)) v[c] = borne(v[c], 0, 100);
  return v;
}

/* ============================================================================
   8. BILAN : la vérité, et la projection à dix ans
   ========================================================================== */
export function bilan(s) {
  rafraichir(s);
  const anneesJouees = s.histoire.length || 1;

  /* Score de perception : ce que le tableau de bord affichait à votre départ. */
  const scoreAffiche = s.doctrine.reduce((a, c, i) => a + (K.POIDS_DOCTRINE[i] * s.affiche[c]) / 100, 0);

  /* Note de mandat : ce que le public a vu, année après année, rapporté au
     quinquennat entier (les années non servies comptent pour zéro). */
  const noteMandat = s.histoire.reduce((acc, h) => {
    return acc + s.doctrine.reduce((a, c, i) => a + (K.POIDS_DOCTRINE[i] * h.affiche[c]) / 100, 0);
  }, 0) / 5;   // rapporté au quinquennat entier : les années non servies comptent pour zéro

  /* Score de bilan : la vérité, pondérée par la doctrine que le joueur a déclarée. */
  const scoreBilan = s.doctrine.reduce((a, c, i) => a + (K.POIDS_DOCTRINE[i] * s.vrai[c]) / 100, 0);

  /* Cohérence du cap : quelle part de ce que vous avez réellement produit
     va dans le sens des deux priorités que vous aviez annoncées ? */
  const prioritaires = s.doctrine.slice(0, 2);
  let dirige = 0, total = 0;
  for (const e of s.effetsEnAttente) {
    total += Math.abs(e.montant);
    if (prioritaires.includes(e.compteur) && e.montant > 0) dirige += e.montant;
  }
  const coherence = total > 0 ? dirige / total : 0;
  const constance = s.fin.type === 'mandat_complet'
                 && s.abandons <= K.PROJECTION.seuilAbandonsConstance
                 && coherence >= K.PROJECTION.seuilCoherence
                 && (s.anneesSurcharge || 0) <= K.PROJECTION.maxAnneesSurcharge;
  const proj = projeterDixAns(s, constance);
  const scoreProjection = s.doctrine.reduce((a, c, i) => a + (K.POIDS_DOCTRINE[i] * proj[c]) / 100, 0);

  const auVert = (o) => Object.values(o).filter((v) => v >= 60).length;

  return {
    etat: s,
    fin: s.fin,
    anneesJouees,
    doctrine: s.doctrine,
    affiche: { ...s.affiche }, vrai: { ...s.vrai }, projection: proj,
    noteMandat, scoreAffiche, scoreBilan, scoreProjection, constance, coherence,
    compteursVertsBilan: auVert(s.vrai),
    compteursVertsProjection: auVert(proj),
    greves: s.greves.length,
    pointsGreve: +s.pointsGreveCumules.toFixed(1),
    fatigue: s.fatigue, abandons: s.abandons,
    mesures: s.mesuresParAnnee.flat().map((m) => m.id),
    histoire: s.histoire,
    journal: s.journal,
  };
}
