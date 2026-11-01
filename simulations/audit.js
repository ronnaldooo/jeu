/* Audit des données du jeu : ce qui doit être vrai pour que le jeu ne casse pas
   et que chaque chiffre ait sa source. Usage : node simulations/audit.js
   Sort avec un code d'erreur s'il y a au moins une erreur (les avertissements
   n'en provoquent pas). */
import * as CAT from '../moteur/catalogue.js';
import * as REP from '../moteur/reperes.js';
import * as TER from '../moteur/territoires.js';
import * as K from '../moteur/constantes.js';

const erreurs = [], avert = [];
const E = (m) => erreurs.push(m), W = (m) => avert.push(m);

/* ---- 1. parcours de toutes les chaînes, de toutes les données ---------------- */
const chaines = [];
function parcourir(x, chemin, vus = new Set()) {
  if (x == null) return;
  if (typeof x === 'string') { chaines.push([chemin, x]); return; }
  if (typeof x === 'number') { if (!Number.isFinite(x)) E(`nombre non fini : ${chemin}`); return; }
  if (typeof x === 'function' || typeof x !== 'object') return;
  if (vus.has(x)) return; vus.add(x);
  if (x instanceof Set) { for (const v of x) parcourir(v, chemin + '{}', vus); return; }
  for (const [k, v] of Object.entries(x)) {
    if (v === undefined) E(`valeur undefined : ${chemin}.${k}`);
    parcourir(v, `${chemin}.${k}`, vus);
  }
}
for (const [nom, mod] of Object.entries({ CAT, REP, TER, K })) for (const [k, v] of Object.entries(mod)) parcourir(v, `${nom}.${k}`);

let apostrophes = 0, typo = 0;
for (const [chemin, t] of chaines) {
  if (/undefined|\bNaN\b|\[object|\$\{|null\b/.test(t) && !/null\b.*(?:nulle|nul)/.test(t)) E(`texte suspect (${chemin}) : ${t.slice(0, 80)}`);
  if (/ {2,}/.test(t)) W(`double espace (${chemin}) : ${t.slice(0, 70)}`);
  if (/\s[,.]/.test(t) && !/\s\.\.\./.test(t) && !/\d\s[,.]\d/.test(t)) W(`espace avant ponctuation (${chemin}) : ${t.slice(0, 70)}`);
  if (/[a-zéèà]\.[A-ZÉÈÀ][a-zéèà]/.test(t) && !/\.(?:fr|com|org|net|gouv|html?|pdf|md|js)/i.test(t) && !/https?:/.test(t) && !/[A-Z]\.[A-Z]/.test(t)) W(`point collé (${chemin}) : ${t.match(/.{0,25}[a-zéèà]\.[A-ZÉÈÀ][a-zéèà].{0,15}/)[0]}`);
  const o = (t.match(/«/g) || []).length, f = (t.match(/»/g) || []).length;
  if (o !== f) E(`guillemets déséquilibrés « » (${chemin}) : ${t.slice(0, 90)}`);
  if (/'/.test(t) && !/https?:|^[a-z_0-9]+$/.test(t) && /[a-zA-Zé]'[a-zA-Zé]/.test(t)) { apostrophes++; if (apostrophes <= 8) W(`apostrophe droite (${chemin}) : ${t.match(/.{0,20}[a-zA-Zé]'[a-zA-Zé].{0,15}/)[0]}`); }
  if (/\.\.\.(?!\))/.test(t) && !/https?:/.test(t)) W(`trois points au lieu de … (${chemin})`);
  if (/\b(\w{3,})\s+\1\b/i.test(t) && !/https?:/.test(t)) { const m = t.match(/\b(\w{3,})\s+\1\b/i); if (!/nous nous|vous vous|que que|\d/.test(m[0])) W(`mot répété « ${m[0]} » (${chemin})`); }
}
if (apostrophes > 8) W(`… et ${apostrophes - 8} autres apostrophes droites`);

/* ---- 2. sources : complètes, et chaque renvoi existe ------------------------ */
const S = REP.SOURCES;
for (const [id, s] of Object.entries(S)) {
  for (const c of ['org', 'titre', 'date']) if (!s[c] || typeof s[c] !== 'string') E(`source ${id} : champ « ${c} » manquant`);
  if (!s.url) W(`source ${id} : pas d'adresse`);
  else { try { const u = new URL(s.url); if (u.protocol !== 'https:') W(`source ${id} : adresse non https`); } catch { E(`source ${id} : adresse invalide ${s.url}`); } }
  if (!/\d{4}/.test(s.date || '')) W(`source ${id} : pas d'année dans « ${s.date} »`);
}
const utilisees = new Set();
function renvois(x, chemin, vus = new Set()) {
  if (!x || typeof x !== 'object' || vus.has(x)) return; vus.add(x);
  for (const [k, v] of Object.entries(x)) {
    if ((k === 'src' || k === 'src2') && typeof v === 'string') { utilisees.add(v); if (!S[v]) E(`source inconnue « ${v} » (${chemin})`); }
    else if (k === 'src' && Array.isArray(v)) for (const id of v) { utilisees.add(id); if (!S[id]) E(`source inconnue « ${id} » (${chemin})`); }
    else renvois(v, `${chemin}.${k}`, vus);
  }
}
for (const [nom, mod] of Object.entries({ CAT, REP, TER })) for (const [k, v] of Object.entries(mod)) renvois(v, `${nom}.${k}`);
for (const id of Object.keys(S)) if (!utilisees.has(id)) W(`source jamais citée : ${id}`);

/* ---- 3. catalogue : champs, valeurs, références -------------------------------- */
const ids = new Set();
const COMPTEURS = Object.keys(K.COMPTEURS_INITIAUX);
for (const c of CAT.CATALOGUE) {
  const t = `carte ${c.id}`;
  if (ids.has(c.id)) E(`${t} : identifiant en double`); ids.add(c.id);
  for (const f of ['label', 'famille', 'porteurs', 'perimetre', 'preuve', 'mot', 'vitrine', 'reel']) if (c[f] == null) E(`${t} : champ « ${f} » manquant`);
  for (const f of ['contre', 'ideeRecue']) if (c[f] == null) W(`${t} : champ « ${f} » absent`);
  if (c.theme == null && !c.parametrique) W(`${t} : pas de thème`);
  if (typeof c.cout !== 'number') E(`${t} : coût invalide (${c.cout})`);
  if (typeof c.pol !== 'number' || c.pol < 0) E(`${t} : points de soutien invalides (${c.pol})`);
  if (!['ministeriel', 'matignon'].includes(c.perimetre)) E(`${t} : périmètre inconnu « ${c.perimetre} »`);
  if (!Array.isArray(c.porteurs) || !c.porteurs.length) E(`${t} : aucun porteur cité`);
  if (!Array.isArray(c.contre) || !c.contre.length) W(`${t} : aucun opposant cité`);
  for (const e of c.reel || []) {
    if (!COMPTEURS.includes(e.compteur)) E(`${t} : compteur inconnu « ${e.compteur} »`);
    if (!(e.cadenas >= 1 && e.cadenas <= 5)) E(`${t} : cadenas hors 1-5 (${e.cadenas})`);
    if (!(e.delai >= 0 && e.delai <= 10)) E(`${t} : délai étrange (${e.delai})`);
    if (!e.source || e.source.length < 20) W(`${t} : source de l'effet « ${e.compteur} » trop courte`);
  }
  if ((c.vitrine || {}).compteurs) for (const k of Object.keys(c.vitrine.compteurs)) if (!COMPTEURS.includes(k)) E(`${t} : compteur de vitrine inconnu « ${k} »`);
  if (c.label.length > 125) W(`${t} : libellé de ${c.label.length} caractères (bouton difficile à lire)`);
  if (!/^[A-ZÉÈÀ0-9«Ç]/.test(c.label)) W(`${t} : libellé sans majuscule : ${c.label.slice(0, 30)}`);
  if (c.preuve && c.preuve.length < 150) W(`${t} : preuve courte (${c.preuve.length})`);
}
const themes = new Set(CAT.CATALOGUE.map((c) => c.theme));
for (const p of K.LYCEENS.promesses) for (const th of p.themes) if (!themes.has(th)) W(`promesse « ${p.id} » : thème « ${th} » sans carte`);
const nom = new Map(CAT.CATALOGUE.map((c) => [c.id, c]));

/* ---- 4. colères ----------------------------------------------------------------- */
for (const c of CAT.COLERES) {
  const t = `colère ${c.id}`;
  for (const f of ['intro', 'resume', 'cri', 'qui', 'faits', 'lecture', 'verdict']) if (!c[f]) E(`${t} : champ « ${f} » manquant`);
  if (!['fondee', 'partielle', 'ouverte'].includes(c.verdict)) E(`${t} : verdict « ${c.verdict} »`);
  if (c.postures == null && (!c.mesures || !c.mesures.length)) E(`${t} : ni mesures ni postures`);
  if ((c.mesures || []).length > 3) E(`${t} : plus de trois mesures (${c.mesures.length}) : la page aurait cinq choix`);
  for (const id of c.mesures || []) if (!nom.has(id)) E(`${t} : mesure inconnue « ${id} »`);
  if (c.annonce) {
    for (const id of c.annonce.plusLoin) if (!nom.has(id)) E(`${t} : « plusLoin » inconnu « ${id} »`);
    for (const id of c.annonce.src) if (!S[id]) E(`${t} : source d'annonce inconnue « ${id} »`);
    for (const id of c.mesures || []) if (!c.annonce.plusLoin.includes(id)) W(`${t} : la mesure « ${id} » n'est pas dans « plusLoin »`);
  }
  for (const f of c.faits || []) { if (!f.src) E(`${t} : un fait sans source (${f.v})`); if (!f.v || !f.l) E(`${t} : fait incomplet`); }
}
const ids2 = CAT.COLERES.map((c) => c.id); if (new Set(ids2).size !== ids2.length) E('colères : identifiants en double');

/* ---- 5. repères --------------------------------------------------------------------- */
const cles = new Set();
for (const r of REP.REPERES) {
  if (cles.has(r.cle)) E(`repère ${r.cle} en double`); cles.add(r.cle);
  if (!r.titre) E(`repère ${r.cle} sans titre`);
  for (const x of r.chiffres || []) { if (!x.src) E(`repère ${r.cle} : chiffre sans source (${x.v})`); if (!x.v || !x.l) E(`repère ${r.cle} : chiffre incomplet`); }
}
for (const r of REP.CADRAGE_INITIAL) for (const x of r.chiffres || []) if (!x.src) E(`cadrage ${r.cle} : chiffre sans source (${x.v})`);

/* ---- 6. départements et régions -------------------------------------------------------- */
const codes = new Set();
for (const d of TER.DEPARTEMENTS) {
  if (codes.has(d.code)) E(`département ${d.code} en double`); codes.add(d.code);
  if (!TER.REGIONS[d.region]) E(`département ${d.code} : région inconnue « ${d.region} »`);
}
if (TER.DEPARTEMENTS.length !== 101) E(`${TER.DEPARTEMENTS.length} départements au lieu de 101`);
for (const [r, f] of Object.entries(TER.FAITS_REGION)) if (!TER.REGIONS[r]) E(`FAITS_REGION : région inconnue « ${r} »`);

/* ---- 7. autres tables narratives ---------------------------------------------------------- */
function verifierOptions(liste, nomListe, champ, min = 2) {
  for (const it of liste || []) {
    const opts = it[champ];
    if (!Array.isArray(opts) || opts.length < min) E(`${nomListe} ${it.id || it.titre} : moins de ${min} ${champ}`);
    else if (opts.length > 4) E(`${nomListe} ${it.id || it.titre} : ${opts.length} ${champ} (plus de quatre choix)`);
  }
}
verifierOptions(CAT.DOSSIERS_ETE, 'dossier d\'été', 'options');
verifierOptions(CAT.AFFAIRES, 'affaire', 'reponses');
verifierOptions(CAT.POLEMIQUES_RENTREE, 'polémique', 'reponses');
verifierOptions(CAT.AUDIENCES, 'audience', 'reponses', 3);
verifierOptions([CAT.BLOCUS_LYCEEN], 'blocus', 'reponses');
verifierOptions(CAT.LECTURES_ANNONCES ? [{ id: 'annonces', lectures: CAT.LECTURES_ANNONCES }] : [], 'annonces', 'lectures', 3);
for (const p of CAT.PLATEAU.questions || []) if (!p.reponses || p.reponses.length < 2 || p.reponses.length > 4) E(`plateau « ${p.q} » : nombre de réponses`);

/* ---- rapport ------------------------------------------------------------------------------ */
const uniques = (a) => [...new Set(a)];
console.log(`Audit des données : ${CAT.CATALOGUE.length} cartes, ${CAT.COLERES.length} colères, ${Object.keys(S).length} sources, ${REP.REPERES.length} repères, ${TER.DEPARTEMENTS.length} départements, ${chaines.length} chaînes lues.`);
console.log(`\nERREURS : ${erreurs.length}`); for (const m of uniques(erreurs)) console.log('  ✗', m);
console.log(`\nAVERTISSEMENTS : ${avert.length}`); for (const m of uniques(avert).slice(0, 80)) console.log('  –', m);
if (avert.length > 80) console.log(`  … et ${avert.length - 80} autres`);
process.exit(erreurs.length ? 1 : 0);
