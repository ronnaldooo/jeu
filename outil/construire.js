/* ============================================================================
   ASSEMBLAGE — fabrique les fichiers finaux à partir des sources.
   - index.html    : jeu autonome complet (un seul fichier, aucune dépendance
                     réseau obligatoire — les polices ont une pile de repli)
   - artefact.html : même contenu, sans squelette (pour publication artifact)
   Le moteur testé par les simulations est injecté TEL QUEL, à la
   transformation modules→portée globale près.
   ========================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';

const lire = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

/* Transforme un module ES en script de portée globale :
   suppression des lignes d'import, des mots-clés export. */
function aplatir(src) {
  return src
    .replace(/^import .*$/gm, '')
    .replace(/^export default /gm, '')
    .replace(/^export (const|let|function\*?|class)/gm, '$1');
}
function nomsExportes(src) {
  return [...src.matchAll(/^export (?:const|let|function\*? |class )\s*([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
}

const constantes = lire('moteur/constantes.js');
const catalogue = lire('moteur/catalogue.js');
const reperes = lire('moteur/reperes.js');
const moteur = lire('moteur/moteur.js');
const app = lire('interface/app.js');
const gabarit = lire('interface/gabarit.html');
const telCss = lire('interface/telephone.css');
const telJs = lire('interface/telephone.js');

const K = nomsExportes(constantes);
const bundle = [
  '/* ===== moteur/constantes.js ===== */',
  aplatir(constantes),
  `const K = { ${K.join(', ')} };   // espace de noms attendu par le moteur`,
  '/* ===== moteur/catalogue.js ===== */',
  aplatir(catalogue),
  '/* ===== moteur/reperes.js ===== */',
  aplatir(reperes),
  '/* ===== moteur/moteur.js ===== */',
  aplatir(moteur),
].join('\n');

const page = gabarit.replace('/*__MOTEUR__*/', () => bundle).replace('/*__APP__*/', () => app);

writeFileSync(new URL('../artefact.html', import.meta.url), page);

/* index.html : version autonome — tête (title/polices/styles) et corps séparés. */
const coupe = page.indexOf('</style>') + '</style>'.length;
const tete = page.slice(0, coupe), corps = page.slice(coupe);
writeFileSync(new URL('../index.html', import.meta.url),
  `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n${tete}\n</head>\n<body>${corps}\n</body>\n</html>\n`);
console.log('index.html + artefact.html assemblés (' + Math.round(page.length / 1024) + ' Ko)');

/* ---------------------------------------------------------------------------
   Thème « le téléphone du ministre » : mêmes moteur et interface, plus une
   feuille de style et une coque ajoutées PAR-DESSUS. L'interrupteur, c'est
   le fichier qu'on ouvre : index-telephone.html / artefact-telephone.html.
   Aucun `if (theme)` dans le jeu : la coque lit ce que le jeu affiche.
   ------------------------------------------------------------------------- */
const polices = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;700&display=swap">';
const pageTel = polices + '\n' + gabarit.replace('</style>', () => '</style>\n<style>\n' + telCss + '\n</style>')
  .replace('/*__MOTEUR__*/', () => bundle)
  .replace('/*__APP__*/', () => app + '\n/* ===== interface/telephone.js ===== */\n' + telJs);
writeFileSync(new URL('../artefact-telephone.html', import.meta.url), pageTel);
const coupeTel = pageTel.lastIndexOf('</style>') + '</style>'.length;
writeFileSync(new URL('../index-telephone.html', import.meta.url),
  `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${pageTel.slice(0, coupeTel)}\n</head>\n<body>${pageTel.slice(coupeTel)}\n</body>\n</html>\n`);
console.log('index-telephone.html + artefact-telephone.html assemblés (' + Math.round(pageTel.length / 1024) + ' Ko)');
