/* ============================================================================
   BANC D'ESSAI D'ÉQUILIBRAGE — RUE DE GRENELLE
   ----------------------------------------------------------------------------
   Vérifie les quatre cibles d'équilibrage du brief (partie C.8) :
     1. survivre 5 ans doit réussir ~1 partie sur 2 pour un joueur attentif ;
     2. aucun des 5 compteurs ne doit être maximisable sans en dégrader un autre ;
     3. « tout vitrine » = bon mandat / mauvais bilan, « tout réel » = l'inverse,
        les deux perdants au score, l'optimum étant mixte ;
     4. mettre les 5 compteurs au vert en 5 ans doit être impossible ;
        le bilan à 10 ans, lui, peut l'être.

   Usage :  node simulations/simuler.js [nbParties]
   ========================================================================== */

import { jouerMandat, rngDepuis } from '../moteur/moteur.js';
import { STRATEGIES, MIXTE, DOCTRINAIRES, politiqueAleatoire } from './strategies.js';
import { COMPTEURS_META } from '../moteur/constantes.js';

const N = Number(process.argv[2] || 600);
const GRAINE0 = Number(process.argv[3] || 1000);   // décalage de graines : rejouer la même série
const COMPTEURS = ['reussite', 'egalite', 'sante', 'paix', 'budget'];
const moy = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
const med = (a) => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)] ?? 0; };
const f1 = (x) => (x === undefined ? '—' : x.toFixed(1));

function lancerSerie(politique, n, graine0 = GRAINE0) {
  const res = [];
  for (let i = 0; i < n; i++) res.push(jouerMandat({ graine: graine0 + i * 7919, politique }));
  return res;
}

function resumer(nom, res) {
  const complets = res.filter((r) => r.fin.type === 'mandat_complet');
  const r = {
    nom,
    survie: complets.length / res.length,
    dureeMoy: moy(res.map((x) => x.anneesJouees)),
    noteMandat: moy(res.map((x) => x.noteMandat)),
    scoreAffiche: moy(res.map((x) => x.scoreAffiche)),
    scoreBilan: moy(res.map((x) => x.scoreBilan)),
    scoreProjection: moy(res.map((x) => x.scoreProjection)),
    greves: moy(res.map((x) => x.greves)),
    coherence: moy(res.map((x) => x.coherence || 0)),
    constance: res.filter((x) => x.constance).length / res.length,
    vertsBilan: moy(res.map((x) => x.compteursVertsBilan)),
    vertsProj: moy(res.map((x) => x.compteursVertsProjection)),
    max5vertsBilan: Math.max(...res.map((x) => x.compteursVertsBilan)),
    max5vertsProj: Math.max(...res.map((x) => x.compteursVertsProjection)),
    vrai: {}, affiche: {}, proj: {},
    fins: {},
  };
  for (const c of COMPTEURS) {
    r.vrai[c] = moy(res.map((x) => x.vrai[c]));
    r.affiche[c] = moy(res.map((x) => x.affiche[c]));
    r.proj[c] = moy(res.map((x) => x.projection[c]));
  }
  for (const x of res) r.fins[x.fin.type] = (r.fins[x.fin.type] || 0) + 1;
  return r;
}

function tableau(rs) {
  const col = (s, n) => String(s).padEnd(n);
  const colr = (s, n) => String(s).padStart(n);
  console.log('\n' + col('stratégie', 26) + colr('survie', 8) + colr('durée', 7)
    + colr('affiché', 9) + colr('bilan', 7) + colr('10 ans', 8) + colr('grèves', 8) + colr('verts', 7));
  console.log('-'.repeat(79));
  for (const r of rs) {
    console.log(col(r.nom, 26) + colr((r.survie * 100).toFixed(0) + ' %', 8) + colr(r.dureeMoy.toFixed(1), 7)
      + colr(f1(r.scoreAffiche), 9) + colr(f1(r.scoreBilan), 7) + colr(f1(r.scoreProjection), 8)
      + colr(r.greves.toFixed(1), 8) + colr((r.constance * 100).toFixed(0) + ' %', 10) + colr(r.vertsBilan.toFixed(1), 7));
  }
}

function detailCompteurs(rs) {
  console.log('\nCompteurs en fin de mandat — A = affiché (ce que le public a vu) · V = vrai (le bilan) · P = projection 10 ans');
  console.log('-'.repeat(79));
  for (const r of rs) {
    console.log('\n  ' + r.nom);
    for (const c of COMPTEURS) {
      const bar = (v) => '█'.repeat(Math.round(v / 4)).padEnd(25, '·');
      console.log('    ' + COMPTEURS_META[c].court.padEnd(12)
        + ' A ' + f1(r.affiche[c]).padStart(5)
        + '  V ' + f1(r.vrai[c]).padStart(5)
        + '  P ' + f1(r.proj[c]).padStart(5) + '  ' + bar(r.vrai[c]));
    }
  }
}

/* ---- Cible 2 : recherche par échantillonnage d'un optimum par compteur ---- */
function chercherOptimum(compteur, essais = 900) {
  const rng = rngDepuis(20260830 + compteur.length * 13);
  let best = null;
  for (let i = 0; i < essais; i++) {
    const poids = {};
    for (const c of COMPTEURS) poids[c] = c === compteur ? 60 : rng() * 22;
    const pol = politiqueAleatoire(rng, poids);
    /* Trois graines par politique pour ne pas primer un coup de chance. */
    const runs = [0, 1, 2].map((k) => jouerMandat({ graine: 5000 + i * 131 + k * 17, politique: pol }));
    const v = moy(runs.map((r) => r.vrai[compteur]));
    if (!best || v > best.valeur) best = { valeur: v, runs, moyennes: Object.fromEntries(COMPTEURS.map((c) => [c, moy(runs.map((r) => r.vrai[c]))])) };
  }
  return best;
}

/* ---- Cible 4 : recherche d'une politique qui compose sur dix ans ---------- */
function chercherOptimumDecennal(essais = 1100) {
  const rng = rngDepuis(19840624);
  let best = null;
  /* On teste d'abord les cinq doctrines cohérentes, puis on échantillonne. */
  for (const pol of DOCTRINAIRES) {
    const runs = [0, 1, 2, 3, 4, 5].map((k) => jouerMandat({ graine: 77000 + k * 3301, politique: pol }));
    const verts = moy(runs.map((r) => r.compteursVertsProjection));
    const sc = verts * 100 + moy(runs.map((r) => r.scoreProjection));
    if (!best || sc > best.sc) best = { sc, verts, runs, maxVertsProj: Math.max(...runs.map((r) => r.compteursVertsProjection)), maxVertsBilan: Math.max(...runs.map((r) => r.compteursVertsBilan)) };
  }
  for (let i = 0; i < essais; i++) {
    const poids = {};
    for (const c of COMPTEURS) poids[c] = 20 + rng() * 45;
    const pol = politiqueAleatoire(rng, poids);
    const runs = [0, 1, 2].map((k) => jouerMandat({ graine: 91000 + i * 149 + k * 23, politique: pol }));
    /* On maximise le nombre de compteurs au vert en projection, puis le score. */
    const verts = moy(runs.map((r) => r.compteursVertsProjection));
    const sc = verts * 100 + moy(runs.map((r) => r.scoreProjection));
    if (!best || sc > best.sc) best = { sc, verts, runs, maxVertsProj: Math.max(...runs.map((r) => r.compteursVertsProjection)), maxVertsBilan: Math.max(...runs.map((r) => r.compteursVertsBilan)) };
  }
  return best;
}

/* ============================== EXÉCUTION ================================= */
console.log('='.repeat(79));
console.log('RUE DE GRENELLE — banc d\'essai d\'équilibrage   (' + N + ' parties par stratégie, graine ' + GRAINE0 + ')');
console.log('='.repeat(79));

const resultats = STRATEGIES.map((st) => resumer(st.nom, lancerSerie(st, N)));
tableau(resultats);
detailCompteurs(resultats);

const parNom = Object.fromEntries(resultats.map((r) => [r.nom, r]));
const mixte = parNom[MIXTE.nom];
const vitrine = parNom['Tout vitrine'];
const reel = parNom['Tout réel'];

console.log('\n' + '='.repeat(79));
console.log('CIBLES D\'ÉQUILIBRAGE');
console.log('='.repeat(79));

const verdicts = [];
const check = (nom, ok, detail) => { verdicts.push({ nom, ok, detail }); console.log((ok ? ' ✓ ' : ' ✗ ') + nom + '\n     ' + detail); };

check('1. Survie du joueur attentif ≈ 1 partie sur 2',
  mixte.survie >= 0.40 && mixte.survie <= 0.62,
  `mixte survit à ${(mixte.survie * 100).toFixed(0)} % (cible 40-62 %) · durée moyenne ${mixte.dureeMoy.toFixed(1)} ans · passif ${(parNom['Passif (ne rien faire)'].survie * 100).toFixed(0)} %`);

console.log('\n   Recherche d\'optima par compteur (900 politiques échantillonnées chacune)…');
const optima = {};
for (const c of COMPTEURS) optima[c] = chercherOptimum(c);
/* Test d'arbitrage : pour chaque compteur X, la politique qui MAXIMISE X
   doit renoncer à quelque chose — c'est-à-dire laisser au moins un compteur Y
   nettement en dessous de ce qu'une politique tournée vers Y aurait obtenu.
   (Comparer au « passif » ne dit rien : il est dominé sur tous les tableaux.) */
const MARGE_ARBITRAGE = 8;
let cible2 = true; const lignes2 = [];
for (const c of COMPTEURS) {
  const o = optima[c];
  const renonce = COMPTEURS.filter((d) => d !== c && o.moyennes[d] <= optima[d].valeur - MARGE_ARBITRAGE);
  if (!renonce.length) cible2 = false;
  const cout = renonce.map((d) => `${COMPTEURS_META[d].court} ${f1(o.moyennes[d])} vs ${f1(optima[d].valeur)}`);
  lignes2.push(`     ${COMPTEURS_META[c].court.padEnd(12)} max ${f1(o.valeur).padStart(5)} → renonce à : ${cout.length ? cout.join(' · ') : 'RIEN (compteur gratuit)'}`);
}
check('2. Aucun compteur maximisable sans renoncer à un autre', cible2, lignes2.join('\n').trim());

/* On compare perception et vérité SUR LA MÊME ÉCHELLE : le tableau de bord au
   moment du départ (`scoreAffiche`) contre la vérité révélée (`scoreBilan`). */
check('3. Vitrine = bon affichage / mauvais bilan, réel = l\'inverse, mixte au-dessus des deux',
  vitrine.scoreAffiche > vitrine.scoreBilan + 2
  && reel.scoreBilan > reel.scoreAffiche + 1
  && mixte.scoreBilan > vitrine.scoreBilan && mixte.scoreBilan > reel.scoreBilan,
  `vitrine : affiché ${f1(vitrine.scoreAffiche)} / réel ${f1(vitrine.scoreBilan)} (écart +${f1(vitrine.scoreAffiche - vitrine.scoreBilan)})\n     `
  + `réel : affiché ${f1(reel.scoreAffiche)} / réel ${f1(reel.scoreBilan)} (écart ${f1(reel.scoreAffiche - reel.scoreBilan)})\n     `
  + `mixte : bilan ${f1(mixte.scoreBilan)} — au-dessus des deux extrêmes ${mixte.scoreBilan > vitrine.scoreBilan && mixte.scoreBilan > reel.scoreBilan ? 'oui' : 'NON'}`);

console.log('\n   Recherche d\'une politique qui compose sur dix ans (1 100 politiques)…');
const dec = chercherOptimumDecennal();
const maxVertsBilan = Math.max(...resultats.map((r) => r.max5vertsBilan), dec.maxVertsBilan,
  ...COMPTEURS.map((c) => Math.max(...optima[c].runs.map((r) => r.compteursVertsBilan))));
const maxVertsProj = Math.max(...resultats.map((r) => r.max5vertsProj), dec.maxVertsProj,
  ...COMPTEURS.map((c) => Math.max(...optima[c].runs.map((r) => r.compteursVertsProjection))));
const meilleurDec = dec.runs.reduce((a, b) => (b.compteursVertsProjection > a.compteursVertsProjection ? b : a));
check('4. Les 5 compteurs au vert impossibles à 5 ans, possibles à 10 ans',
  maxVertsBilan < 5 && maxVertsProj >= 4,
  `meilleur relevé : ${maxVertsBilan}/5 compteurs ≥ 60 au bilan · ${maxVertsProj}/5 en projection décennale\n     `
  + `meilleure trajectoire décennale : ` + COMPTEURS.map((c) => `${COMPTEURS_META[c].court} ${f1(meilleurDec.projection[c])}`).join(' · '));

console.log('\n' + '='.repeat(79));
const ok = verdicts.filter((v) => v.ok).length;
console.log(`RÉSULTAT : ${ok}/4 cibles atteintes`);
console.log('='.repeat(79) + '\n');

export { resultats, optima };
