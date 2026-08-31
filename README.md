# Rue de Grenelle

**Un jeu de gestion politique où vous êtes ministre de l'Éducation nationale,
de juin 2027 à mai 2032. Cinq rentrées, cinq budgets, et une question : sur
quoi serez-vous jugé ?**

Le jeu s'adresse au grand public, et d'abord aux personnels du système
éducatif — enseignants, cadres, parents informés. Il ne cherche pas à
convaincre : chaque mesure du catalogue cite ses porteurs politiques réels et
le niveau de preuve de son effet. Il cherche à faire comprendre pourquoi les
politiques éducatives ressemblent si souvent à ce qu'elles sont.

## Ce que le jeu met en scène

**Vous déclarez votre doctrine en juin 2027**, devant la presse : vous classez
les cinq compteurs — réussite des élèves, inégalités, santé du système, paix
sociale, budget et salaires — par ordre de priorité. Le score final vous notera
selon *votre* classement. Vous êtes jugé contre votre propre parole, et les
oppositions vous la ressortiront à chaque arbitrage contradictoire.

**Chaque mesure a deux effets.** L'effet *vitrine* est chiffré, immédiat,
visible. L'effet *réel* n'est jamais affiché : vous ne voyez qu'un niveau de
preuve (de 1 à 5 cadenas, avec sa source) et un délai de 1 à 8 ans. Vous
découvrez au bilan ce que vous avez réellement produit. À 5 cadenas, l'effet
tiré est proche de sa valeur centrale ; à 1 cadenas, il peut aller du négatif
au double.

**Rien ne s'applique tout seul.** L'effet d'une réforme est multiplié par
l'adhésion des personnels : à 25 d'adhésion, vous récoltez 63 % de ce que vous
avez semé. Au-delà de trois réformes simultanément actives, elles se dégradent
toutes. Un programme mal implanté a un effet nul — c'est le résultat le mieux
établi de la littérature, et c'est la règle centrale du jeu.

**Le temps ne joue pas pour vous.** PISA tombe en septembre de votre première
année et mesure des élèves scolarisés depuis dix ans : vous répondez de ce que
vous n'avez pas fait. Vos propres décisions, elles, produiront leurs effets
après votre départ. Le bilan final révèle la vérité, puis la projette à dix ans
— « si votre successeur maintient le cap ».

## ▶ Jouer

### **[Lancer le jeu](https://ronnaldooo.github.io/jeu/)** — rien à installer

Le jeu s'ouvre directement dans le navigateur, sur ordinateur comme sur
téléphone. Un mandat se joue en 45 à 90 minutes ; la partie se sauvegarde
toute seule dans le navigateur. Aucun compte, aucune donnée envoyée nulle
part : tout se passe sur votre appareil.

Vous pouvez aussi **[télécharger `index.html`](index.html)** et l'ouvrir hors
ligne — le jeu tient dans ce seul fichier, y compris pour une salle de classe
sans connexion, ou pour le déposer sur un ENT.

Au menu : une nomination qu'on peut refuser, la feuille de route que vous
déclarez vous-même devant la presse, une note de cadrage sourcée avant votre
première décision, trois fenêtres d'annonces par an (juin, la circulaire de
rentrée en septembre, l'arbitrage de janvier), un été des cent jours à
traverser avant la première rentrée, la carte scolaire de janvier et ses deux
curseurs, la lettre plafond de Bercy, les face-à-face syndicaux où l'on peut
céder ou tenir, une revalorisation entièrement paramétrable (montant,
instrument, cible), et un menu progressif de mesures — 7 cartes en première
année, 14 en fin de mandat, tirées d'un catalogue de **55**, dont quinze qu'on
ne découvre qu'en jouant, quand un rapport tombe ou qu'un indicateur se
dégrade. Chaque carte porte ses porteurs politiques réels, son niveau de
preuve, un panneau « Comprendre l'effet » qui dit ce que montrent vraiment les
études (et l'idée reçue qu'elles contredisent), son risque de grève et son
petit mot. Plus des unes de journal, un fil social de circonstance, et un bilan
qui révèle, enfin, ce que vous avez vraiment produit.

**Un bouton « Comprendre le jeu » est disponible en bas à gauche de chaque
écran.** Il ouvre neuf fiches de référence — budget, démographie, niveaux,
inégalités, métier enseignant, remplacement, organisation du temps, climat
scolaire, et la mécanique du jeu elle-même — soit une cinquantaine de chiffres,
chacun suivi de sa source officielle, cliquable.

## L'équilibrage

Le jeu est équilibré par simulation (700 mandats par stratégie-type, quatre
jeux de graines) et l'interface pilote exactement le même moteur que les
simulations. Les quatre cibles du cahier des charges sont tenues : survivre
cinq ans réussit à **45-50 %** pour un joueur attentif ; aucun des cinq compteurs
n'est maximisable sans en sacrifier d'autres ; « tout vitrine » fait un bon
mandat et un mauvais bilan, « tout réel » l'inverse, et les deux perdent contre
le jeu mixte ; mettre les cinq compteurs au vert en cinq ans est impossible —
en dix ans, presque.

### Pour les collègues qui veulent l'utiliser en formation

Le jeu a été conçu pour être joué **puis discuté** : chaque mesure affiche ses
porteurs politiques réels, son niveau de preuve et un panneau « Comprendre
l'effet » qui résume ce que disent les études (et l'idée reçue qu'elles
contredisent). Les moments les plus productifs en formation sont en général le
bilan final — où l'écart entre ce que le tableau de bord affichait et ce qui
s'est réellement produit se lit d'un coup d'œil — et la comparaison de deux
parties menées avec des feuilles de route opposées.

L'onglet « Comprendre le jeu » a été pensé pour cet usage : il donne, sourcées
et à jour d'août 2026, les données de cadrage qu'on passe habituellement une
demi-journée à rassembler avant une formation.

---

## Sous le capot (pour les curieux et les développeurs)

```bash
npm run equilibrage     # banc d'essai : vérifie les 4 cibles (→ 4/4)
npm run trajectoires    # trajectoires annuelles des 5 compteurs
npm run construire      # réassemble index.html depuis moteur/ + interface/
```

Aucune dépendance : Node 18+ suffit pour les simulations, un navigateur pour
jouer.

```
index.html                   LE JEU — fichier unique autonome
moteur/                      constantes sourcées, catalogue de 55 cartes, repères sourcés, moteur en générateur
moteur/reperes.js            les 9 fiches de référence et leurs 31 sources officielles
simulations/                 stratégies-types et bancs d'essai
interface/                   gabarit (styles) + application (écrans, presse, bilan)
outil/construire.js          assemblage
```

→ **[EQUILIBRAGE.md](EQUILIBRAGE.md)** pour les constantes et leurs sources,
les trajectoires simulées et les paramètres à revoir après tests humains.

## Sources et précautions

Les paramètres viennent de sources publiques datées d'août 2026 : DEPP
(évaluations nationales, TIMSS et PIRLS, heures non assurées, projections
démographiques à l'horizon 2035, indice de position sociale), documents
budgétaires du PLF et rapports du Sénat, plafonds prévisionnels du PLF 2027,
OCDE (PISA, TALIS, *Regards sur l'éducation*), Cour des comptes, IGÉSR, CSEN,
Education Endowment Foundation pour les tailles d'effet. Les chiffres sont
utilisés comme **ordres de grandeur** : ils servent à faire comprendre des
proportions et des arbitrages, pas à documenter une année précise.

Toutes les données affichées dans le jeu portent leur source, avec l'organisme,
la date et un lien vers le document : elles sont rassemblées dans
`moteur/reperes.js` et consultables en jeu par le bouton « Comprendre le jeu ».
Quand deux sources officielles publient des chiffres différents — le
remplacement, mesuré à 4,3 % du temps scolaire par le Sénat en juin 2025 et à
9,3 % au collège-lycée par la Cour des comptes en décembre 2025 — le jeu
affiche les deux et explique l'écart.

Les sept organisations syndicales sont pondérées par les résultats réels des
élections professionnelles de 2022, avec des profils de négociation
différenciés. Les positions attribuées aux acteurs restent des simplifications
de jeu.

**Jeu pédagogique indépendant, sans lien avec le ministère de l'Éducation
nationale.**

## Licence

Code sous licence MIT. Contenus (textes, paramétrage, catalogue) sous licence
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.fr).
