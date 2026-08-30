/* ============================================================================
   STRATÉGIES-TYPES POUR L'ÉQUILIBRAGE
   ----------------------------------------------------------------------------
   Chaque stratégie implémente la même interface que l'interface de jeu :
     doctrine(s) · lettrePlafond(s, palier) · carteScolaire(s, ctx)
     mesures(s, dispo, ctx) · rentree(s, ctx)
   ========================================================================== */

import { coutDe } from '../moteur/moteur.js';
import { REVALORISATION, FINANCEMENT_19 } from '../moteur/catalogue.js';

/* Valeur « vitrine » d'une carte : ce que le joueur voit immédiatement. */
function valeurVitrine(c) {
  const v = c.vitrine || {};
  const comp = Object.values(v.compteurs || {}).reduce((a, b) => a + b, 0);
  return (v.parents || 0) * 1.0 + (v.presse || 0) * 0.9 + comp * 1.6 + (v.enseignants || 0) * 0.25;
}

/* Valeur « réelle espérée » : effet central pondéré par la solidité de la preuve
   (un effet à 2 cadenas vaut, en espérance de décision, moins qu'un effet à 5). */
function valeurReelle(c, poids = null, anneesRestantes = null) {
  let t = 0;
  for (const e of c.reel || []) {
    const conf = { 5: 1.0, 4: 0.9, 3: 0.72, 2: 0.5, 1: 0.28 }[e.cadenas];
    const w = poids ? (poids[e.compteur] || 0) / 25 : 1;
    /* Un effet qui arrive après votre départ ne compte, pour un ministre qui
       raisonne à l'horizon de son mandat, qu'à moitié. C'est ce biais de
       court terme que le jeu met en scène. */
    const horizon = anneesRestantes === null ? (1 - e.delai * 0.045)
                  : (e.delai <= anneesRestantes ? 1 : 0.45);
    t += e.central * conf * w * horizon;
  }
  /* La revalorisation n'a pas d'effets « réels » en dur dans le catalogue :
     ils dépendent des curseurs. On évalue l'option par défaut (plan / milieux)
     pour que le calcul reste comparable aux autres cartes. */
  if (c.parametrique === 'revalorisation') {
    for (const e of REVALORISATION.cibles.milieux.reel) {
      const conf = { 5: 1.0, 4: 0.9, 3: 0.72, 2: 0.5, 1: 0.28 }[e.cadenas];
      const w = poids ? (poids[e.compteur] || 0) / 25 : 1;
      t += e.central * conf * w;
    }
    t += 4;   // l'adhésion regagnée profite à toutes les réformes suivantes
  }
  return t;
}

/* Risque de conflit porté par la carte. */
function risqueGreve(c) { return c.greve ? c.greve.intensite * 1.6 : 0; }

/* Choisit les cartes tenables dans l'enveloppe et le capital disponibles. */
function selectionner(s, dispo, ctx, scorer, { toleranceDepassement = 0.15, options = () => ({}), concentration = 0, maxCartes = 3, reserveCapital = 0 } = {}) {
  maxCartes = Math.min(maxCartes, ctx.maxAnnonces || maxCartes);
  if (!ctx.depassementAutorise) toleranceDepassement = 0;
  /* Un ministre avisé ne descend pas son capital à zéro : il en garde pour
     les arbitrages qu'il n'a pas encore vus venir. */
  const reserve = reserveCapital;
  let classees = dispo
    .map((c) => ({ carte: c, sc: scorer(c) }))
    .filter((x) => x.sc > 0)
    .sort((a, b) => b.sc - a.sc);
  /* Concentration : on écarte ce qui est très en dessous de la meilleure carte.
     Un ministre qui saupoudre dépasse sa capacité d'absorption pour rien. */
  if (concentration && classees.length) {
    const seuil = classees[0].sc * concentration;
    classees = classees.filter((x) => x.sc >= seuil);
  }

  const retenues = [];
  let tresor = ctx.tresor, capital = ctx.capital;
  for (const { carte } of classees) {
    const opt = options(carte, s);
    const { cout, pol } = coutDe(carte, opt);
    const polReel = carte.perimetre === 'matignon' ? pol * 2 : pol;
    if (polReel > capital - reserve) continue;
    if (tresor - cout < -toleranceDepassement) continue;
    retenues.push({ id: carte.id, options: opt });
    tresor -= cout; capital -= polReel;
    if (retenues.length >= maxCartes) break;  // trois annonces par an au maximum
  }
  return retenues;
}

/* -------------------------------------------------------------------------- */
export const PASSIF = {
  doctrine: () => ['reussite', 'egalite', 'sante', 'budget', 'paix'],
  retrait: () => 'maintenir',
  nom: 'Passif (ne rien faire)',
  audience: () => 0,               // le ministre immobile défend la ligne, faute d'en avoir une
  doctrine: () => ['reussite', 'egalite', 'sante', 'budget', 'paix'],
  lettrePlafond: () => 'accepter',
  carteScolaire: () => ({ restitution: 0.6, prive: 0.5 }),
  mesures: () => [],
  rentree: () => 'assumer',
};

/* -------------------------------------------------------------------------- */
/* Réponses aux dossiers d'été : l'option qui maximise ce que chaque
   archétype regarde. Par défaut (absence de méthode), le pilote choisit
   l'option 1 — la voie médiane. */
function dossierVers(cle) {
  return (s, d) => {
    let best = 0, bv = -1e9;
    d.options.forEach((o, i) => { const v = (o.effets || {})[cle] || 0; if (v > bv) { bv = v; best = i; } });
    return best;
  };
}

export const TOUT_VITRINE = {
  doctrine: () => ['reussite', 'budget', 'egalite', 'sante', 'paix'],
  retrait: () => 'maintenir',
  nom: 'Tout vitrine',
  dossier: dossierVers('parents'),
  audience: () => 0,               // la fermeté fait de meilleures images
  doctrine: () => ['reussite', 'budget', 'egalite', 'sante', 'paix'],
  lettrePlafond: () => 'accepter',
  /* Rendre les postes fait plaisir à Bercy et paie les annonces. */
  carteScolaire: () => ({ restitution: 0.52, prive: 0.15 }),
  rentree: () => 'contester',
  /* Une grève est une mauvaise image : la vitrine achète la paix autant que
     l'applaudissement. Elle prend le « pacte » plutôt que l'évaluation. */
  mesures: (s, dispo, ctx) => selectionner(s, dispo, ctx,
    (c) => valeurVitrine(c) - risqueGreve(c) * 2.2,
    { toleranceDepassement: 0.35, options: () => ({ montant: 0.5, cible: 'debuts', instrument: 'pacte', financement: 'demographie' }) }),
};

/* -------------------------------------------------------------------------- */
/* Le ministre qui ne joue que la preuve : il choisit ses mesures sur les
   études, finance en rendant les postes que la démographie libère, et se
   désintéresse ouvertement de ce que montre le tableau de bord. Ce n'est pas
   un joueur suicidaire — c'est un joueur qui ne regarde pas les sondages. */
export const TOUT_REEL = {
  doctrine: () => ['reussite', 'egalite', 'sante', 'budget', 'paix'],
  retrait: () => 'maintenir',
  nom: 'Tout réel',
  doctrine: () => ['reussite', 'egalite', 'sante', 'budget', 'paix'],
  lettrePlafond: () => 'accepter',
  carteScolaire: () => ({ restitution: 0.45, prive: 0.6 }),
  rentree: () => 'assumer',
  /* Il connaît Slavin : une réforme mal implantée a un effet nul. Il protège
     donc l'adhésion — non par souci d'opinion, mais parce que c'est le
     multiplicateur de tout ce qu'il entreprend. Ce qu'il ignore, en revanche,
     c'est l'horizon : il investit à six ans sans se demander s'il y sera. */
  mesures: (s, dispo, ctx) => selectionner(s, dispo, ctx,
    (c) => valeurReelle(c) * 1.6
         - risqueGreve(c) * 1.5
         + (c.physique?.adhesion || 0) * 1.0
        ,
    { toleranceDepassement: 0.35, concentration: 0.5,
      options: () => ({ montant: 1.3, cible: 'milieux', instrument: 'indiciaire', financement: 'demographie' }) }),
};

/* -------------------------------------------------------------------------- */
export const SYNDICAL = {
  doctrine: () => ['sante', 'paix', 'budget', 'egalite', 'reussite'],
  retrait: () => 'ceder',
  nom: 'Paix sociale d’abord',
  dossier: dossierVers('adhesion'),
  audience: () => 2,               // toujours concéder
  doctrine: () => ['sante', 'paix', 'budget', 'egalite', 'reussite'],
  lettrePlafond: () => 'contester',
  carteScolaire: () => ({ restitution: 0.05, prive: 0.5 }),
  rentree: () => 'assumer',
  mesures: (s, dispo, ctx) => selectionner(s, dispo, ctx,
    (c) => (c.vitrine?.enseignants || 0) * 2 + (c.physique?.adhesion || 0) * 1.5 - risqueGreve(c) * 3,
    { toleranceDepassement: 0.35, options: () => ({ montant: 1.3, cible: 'milieux', instrument: 'indiciaire', financement: 'demographie' }) }),
};

/* -------------------------------------------------------------------------- */
/* Le « joueur attentif » : il équilibre vitrine et réel, surveille l'adhésion
   (dont dépend l'implémentation), tient le crédit Bercy et évite les grèves. */
export const MIXTE = {
  doctrine: () => ['sante', 'reussite', 'egalite', 'budget', 'paix'],
  retrait: (s, q) => (q.combatif && s.phys.adhesion < 18 ? 'ceder' : 'maintenir'),
  nom: 'Mixte (joueur attentif)',
  dossier: (s, d) => { let best = 0, bv = -1e9;
    d.options.forEach((o, i) => { const e = o.effets || {}; const v = (e.adhesion || 0) * 1.2 + (e.parents || 0) + (e.capital || 0) * 0.8; if (v > bv) { bv = v; best = i; } });
    return best; },
  doctrine: () => ['sante', 'reussite', 'egalite', 'budget', 'paix'],
  lettrePlafond: (s) => (s.creditBercy < 30 && s.capital > 45 ? 'contester' : 'accepter'),
  carteScolaire: (s, ctx) => {
    /* Rendre juste assez d'emplois pour tenir Bercy, jamais au-delà de la colère
       des maires ; épargner le privé quand la ségrégation est contenue. */
    const exige = Math.abs(ctx.schemaDemande) / Math.max(1, ctx.postesLiberables);
    const rest = Math.min(0.52, Math.max(0.18, exige * (s.creditBercy < 40 ? 1.0 : 0.7)));
    return { restitution: rest, prive: s.phys.segregation > 19 ? 0.7 : 0.5 };
  },
  rentree: () => 'assumer',
  mesures: (s, dispo, ctx) => selectionner(s, dispo, ctx, (c) => {
    const adhBasse = s.phys.adhesion < 32;
    const restantes = 5 - s.annee;
    /* L'adhésion est le multiplicateur de tout le reste : tant qu'elle est
       basse, un point d'adhésion vaut mieux qu'un point d'effet annoncé. */
    return valeurReelle(c, null, restantes) * 1.25
         + valeurVitrine(c) * 0.5
         - risqueGreve(c) * (adhBasse ? 2.8 : 1.5)
         + (c.physique?.adhesion || 0) * 1.2
         + (c.vitrine?.enseignants || 0) * (adhBasse ? 1.3 : 0.4)
         + (c.parametrique === 'revalorisation' && adhBasse ? 9 : 0)
        ;
  }, {
    toleranceDepassement: s.creditBercy > 45 ? 0.5 : 0.2,
    reserveCapital: 22,
    options: () => ({ montant: Math.max(0.3, Math.min(2.6, s.tresor * 0.8)),
                      cible: s.phys.couvertureConcours < 90 ? 'debuts' : 'milieux',
                      instrument: 'indiciaire', financement: 'demographie' }),
  }),
};

/* -------------------------------------------------------------------------- */
/* Stratégie aléatoire paramétrable — sert à la recherche d'optima par
   échantillonnage (cible d'équilibrage n° 2 : aucun compteur maximisable seul). */
export function politiqueAleatoire(rng, poids) {
  const ordre = ['reussite', 'egalite', 'sante', 'budget', 'paix']
    .sort((a, b) => (poids[b] || 0) - (poids[a] || 0));
  const cibles = Object.keys(REVALORISATION.cibles);
  const instrs = Object.keys(REVALORISATION.instruments);
  const fins = Object.keys(FINANCEMENT_19);
  const restBase = rng(), privBase = rng(), tol = rng() * 0.9;
  const contester = rng() < 0.5;
  const opt = {
    montant: 0.3 + rng() * 2.6,
    cible: cibles[Math.floor(rng() * cibles.length)],
    instrument: instrs[Math.floor(rng() * instrs.length)],
    financement: fins[Math.floor(rng() * fins.length)],
  };
  const bruitCarte = {};
  return {
    nom: 'aléatoire',
    doctrine: () => ordre,
    retrait: () => (rng() < 0.3 ? 'ceder' : 'maintenir'),
    doctrine: () => ordre,
    lettrePlafond: () => (contester ? 'contester' : 'accepter'),
    carteScolaire: () => ({ restitution: restBase, prive: privBase }),
    rentree: () => (rng() < 0.5 ? 'assumer' : 'contester'),
    mesures: (s, dispo, ctx) => selectionner(s, dispo, ctx, (c) => {
      if (bruitCarte[c.id] === undefined) bruitCarte[c.id] = rng() * 2 - 0.55;
      return valeurReelle(c, poids) * 1.1 + valeurVitrine(c) * 0.4 + bruitCarte[c.id] * 8;
    }, { toleranceDepassement: tol, options: () => opt }),
  };
}

/* -------------------------------------------------------------------------- */
/* Le ministre DOCTRINAIRE : il annonce un cap en juin 2027 et s'y tient cinq
   ans. C'est l'archétype « Portugal » — celui qui teste si la constance paie.
   `ordre` est le classement des cinq compteurs déclaré devant la presse. */
export function doctrinaire(ordre) {
  const poids = {}; ordre.forEach((c, i) => { poids[c] = [60, 34, 18, 10, 6][i]; });
  return {
    nom: 'Doctrinaire · ' + ordre[0],
    doctrine: () => ordre,
    lettrePlafond: (s) => (s.creditBercy < 28 && s.capital > 50 ? 'contester' : 'accepter'),
    carteScolaire: (s, ctx) => {
      const exige = Math.abs(ctx.schemaDemande) / Math.max(1, ctx.postesLiberables);
      /* Qui veut financer doit rendre des postes ; qui veut la paix n'en rend pas. */
      const appetit = poids.budget >= 34 ? 1.0 : poids.paix >= 34 ? 0.25 : 0.62;
      return {
        restitution: Math.min(0.95, Math.max(exige * 0.9, appetit)),
        prive: poids.egalite >= 34 ? 0.85 : s.phys.segregation > 19 ? 0.7 : 0.5,
      };
    },
    rentree: () => 'assumer',
    mesures: (s, dispo, ctx) => selectionner(s, dispo, ctx, (c) => {
      const adhBasse = s.phys.adhesion < 32;
      return valeurReelle(c, poids) * 2.0
           + valeurVitrine(c) * 0.25
           - risqueGreve(c) * (adhBasse ? 2.2 : 1.1)
           + (c.physique?.adhesion || 0) * 1.0
           + (c.vitrine?.enseignants || 0) * (adhBasse ? 1.0 : 0.3)
           + (c.parametrique === 'revalorisation' ? (poids.budget >= 34 ? 26 : adhBasse ? 8 : 0) : 0)
          ;
    }, {
      toleranceDepassement: 0.3,
      reserveCapital: 20,
      concentration: 0.55,
      maxCartes: poids.budget >= 34 ? 2 : 2,
      options: () => ({
        montant: Math.max(0.3, Math.min(poids.budget >= 34 ? 3.0 : 1.6, s.tresor * 0.85)),
        cible: s.phys.couvertureConcours < 90 ? 'debuts' : 'milieux',
        instrument: poids.paix >= 18 ? 'indiciaire' : 'pacte',
        financement: 'demographie',
      }),
    }),
  };
}

export const DOCTRINAIRES = [
  ['reussite', 'sante', 'egalite', 'budget', 'paix'],
  ['egalite', 'reussite', 'sante', 'paix', 'budget'],
  ['sante', 'budget', 'reussite', 'paix', 'egalite'],
  ['budget', 'sante', 'reussite', 'paix', 'egalite'],
  ['paix', 'sante', 'egalite', 'reussite', 'budget'],
].map((ordre) => {
  const d = doctrinaire(ordre);
  d.retrait = () => 'maintenir';
  return d;
});

export const STRATEGIES = [PASSIF, TOUT_VITRINE, TOUT_REEL, SYNDICAL, MIXTE, ...DOCTRINAIRES];
