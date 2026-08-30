/* ============================================================================
   TRAJECTOIRES ANNUELLES DES CINQ COMPTEURS
   Sortie destinée à EQUILIBRAGE.md et au calibrage de l'interface.
   Usage : node simulations/trajectoires.js [nbParties]
   ========================================================================== */
import { jouerMandat } from '../moteur/moteur.js';
import { PASSIF, TOUT_VITRINE, TOUT_REEL, MIXTE, DOCTRINAIRES } from './strategies.js';
import { COMPTEURS_META } from '../moteur/constantes.js';

const N = Number(process.argv[2] || 500);
const COMPTEURS = ['reussite', 'egalite', 'sante', 'paix', 'budget'];
const moy = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);

for (const st of [PASSIF, TOUT_VITRINE, TOUT_REEL, MIXTE, DOCTRINAIRES[0], DOCTRINAIRES[2]]) {
  const runs = [];
  for (let i = 0; i < N; i++) runs.push(jouerMandat({ graine: 2000 + i * 7919, politique: st }));
  console.log('\n### ' + st.nom);
  console.log('| année | ' + COMPTEURS.map((c) => COMPTEURS_META[c].court).join(' | ') + ' | parties encore en poste |');
  console.log('|---|' + COMPTEURS.map(() => '---').join('|') + '|---|');
  for (let an = 1; an <= 5; an++) {
    const h = runs.map((r) => r.histoire[an - 1]).filter(Boolean);
    if (!h.length) break;
    console.log(`| an ${an} | ` + COMPTEURS.map((c) => {
      const a = moy(h.map((x) => x.affiche[c])), v = moy(h.map((x) => x.vrai[c]));
      return `${a.toFixed(0)} / ${v.toFixed(0)}`;
    }).join(' | ') + ` | ${Math.round((h.length / N) * 100)} % |`);
  }
  const p = COMPTEURS.map((c) => moy(runs.map((r) => r.projection[c])).toFixed(0));
  console.log('| **+10 ans** | ' + p.join(' | ') + ' | — |');
  const fins = {};
  for (const r of runs) fins[r.fin.type] = (fins[r.fin.type] || 0) + 1;
  console.log('\nFins de partie : ' + Object.entries(fins).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${Math.round((v / N) * 100)} %`).join(' · '));
}
console.log('\n(Chaque cellule : **affiché / vrai**. L\'écart entre les deux est le sujet du jeu.)');
