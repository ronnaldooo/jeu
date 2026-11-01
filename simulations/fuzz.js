/* Fuzz du moteur : des milliers de mandats joués par des « joueurs » qui
   changent de stratégie à chaque décision, avec des invariants vérifiés à
   chaque pas. Usage : node simulations/fuzz.js [parties] [graine]
   Cherche : exceptions, nombres non finis, compteurs hors bornes, mandats qui
   ne se terminent pas, bilans incomplets. */
import { jouerMandat } from '../moteur/moteur.js';
import { STRATEGIES } from './strategies.js';
import * as K from '../moteur/constantes.js';

const N = +process.argv[2] || 1500, G0 = +process.argv[3] || 1;
let rng = G0 * 2654435761 % 4294967296 || 1;
const alea = () => { rng ^= rng << 13; rng >>>= 0; rng ^= rng >>> 17; rng ^= rng << 5; rng >>>= 0; return rng / 4294967296; };
const METHODES = new Set(STRATEGIES.flatMap((p) => Object.keys(p).filter((k) => typeof p[k] === 'function')));
const problemes = new Map();
const noter = (m, graine) => { if (!problemes.has(m)) problemes.set(m, { n: 0, graine }); problemes.get(m).n++; };

function invariants(s, ou) {
  for (const k of ['capital', 'credibilite', 'creditBercy', 'tresor']) if (!Number.isFinite(s[k])) noter(`${k} non fini (${ou})`, s.graine);
  for (const [k, v] of Object.entries(s.affiche || {})) if (!Number.isFinite(v) || v < -0.01 || v > 100.01) noter(`affiché.${k} hors bornes : ${v} (${ou})`, s.graine);
  for (const [k, v] of Object.entries(s.vrai || {})) if (!Number.isFinite(v) || v < -0.01 || v > 100.01) noter(`vrai.${k} hors bornes : ${v} (${ou})`, s.graine);
  if (s.lyceens && (!Number.isFinite(s.lyceens.colere) || s.lyceens.colere < -0.01 || s.lyceens.colere > 100.01)) noter(`colère lycéenne hors bornes : ${s.lyceens.colere} (${ou})`, s.graine);
  if (s.phys) for (const [k, v] of Object.entries(s.phys)) if (typeof v === 'number' && !Number.isFinite(v)) noter(`phys.${k} non fini (${ou})`, s.graine);
  if (s.capital > K.CAPITAL.plafond + 0.01) noter(`capital au-dessus du plafond : ${s.capital} (${ou})`, s.graine);
}

let finis = 0, fins = {};
for (let i = 0; i < N; i++) {
  const graine = G0 * 100000 + i;
  /* un joueur qui tire une stratégie différente à chaque décision */
  const pol = {};
  for (const m of METHODES) {
    pol[m] = (...args) => {
      const dispo = STRATEGIES.filter((p) => typeof p[m] === 'function');
      const p = dispo[Math.floor(alea() * dispo.length)];
      if (args[0]) invariants(args[0], m);
      return p[m](...args);
    };
  }
  try {
    const b = jouerMandat({ graine, politique: pol });
    finis++;
    fins[b.fin.type] = (fins[b.fin.type] || 0) + 1;
    for (const k of ['scoreAffiche', 'scoreBilan', 'scoreProjection']) if (!Number.isFinite(b[k])) noter(`bilan.${k} non fini`, graine);
    for (const k of ['affiche', 'vrai', 'projection']) for (const [c, v] of Object.entries(b[k] || {})) if (!Number.isFinite(v)) noter(`bilan.${k}.${c} non fini`, graine);
    if (!b.fin || !b.fin.texte) noter('bilan sans texte de fin', graine);
    if (!Array.isArray(b.doctrine) || b.doctrine.length !== 5) noter('doctrine incomplète au bilan', graine);
  } catch (e) {
    noter(`EXCEPTION : ${String(e.stack || e).split('\n').slice(0, 3).join(' | ')}`, graine);
  }
}
console.log(`${finis}/${N} mandats terminés. Fins : ${JSON.stringify(fins)}`);
if (!problemes.size) console.log('Aucun problème.');
else { console.log(`${problemes.size} problème(s) :`); for (const [m, v] of problemes) console.log(`  ✗ ${m}  (×${v.n}, première graine ${v.graine})`); process.exitCode = 1; }
