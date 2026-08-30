# ÉQUILIBRAGE — RUE DE GRENELLE

> **État du projet : jeu complet.** Moteur équilibré par simulation (phase 1),
> catalogue étendu à 40 cartes avec menu tournant, et interface jouable en un
> seul fichier (`index.html`) — la même boucle de décision que les simulations,
> garantie par construction : l'interface et les stratégies simulées pilotent
> le même générateur `derouler()`.

## Ce qui tourne

```
moteur/constantes.js         toutes les constantes, chacune commentée avec sa source (partie B du brief)
moteur/catalogue.js          40 cartes (5 familles doctrinales, porteurs réels cités) + cartes à curseurs
moteur/moteur.js             calendrier, vitrine/réel, grève, attractivité, bilan, projection — en générateur pas-à-pas
simulations/                 10 stratégies-types et bancs d'essai
interface/                   gabarit (styles) + application (écrans, presse, fil social, bilan)
outil/construire.js          assemble index.html (autonome) et artefact.html
index.html                   LE JEU — un seul fichier, aucune dépendance réseau obligatoire
```

```bash
npm run equilibrage      # → 4/4 cibles atteintes
npm run trajectoires
npm run construire       # réassemble index.html après modification des sources
```

**Garantie moteur↔interface** : la boucle de jeu est un générateur
(`derouler`) qui s'interrompt à chaque décision ; les simulations le pilotent
par un adaptateur synchrone, l'interface par les clics du joueur. Le refactor
vers le générateur a été validé par empreinte : 36 mandats rejoués donnent des
résultats identiques à l'octet près avant/après. L'interface est testée de bout
en bout sous Playwright : mandat complet joué, sauvegarde/reprise (rejouage du
journal de décisions sur la même graine), mobile 375 px sans défilement
horizontal, thème sombre.

---

## 1. Les quatre cibles d'équilibrage

700 parties par stratégie, vérifié sur trois jeux de graines indépendants
(1000, 55555, 987654) — les quatre cibles passent dans les trois cas.

| Cible (brief C.8) | Verdict | Mesure |
|---|---|---|
| 1. Survivre 5 ans ≈ 1 partie sur 2 pour un joueur attentif | ✓ | **57 %** de mandats complets pour la stratégie « mixte » ; 25 % pour le joueur passif |
| 2. Aucun compteur maximisable sans en dégrader un autre | ✓ | chaque optimum renonce à 3-4 compteurs, de 10 à 46 points |
| 3. « Tout vitrine » = bon mandat / mauvais bilan ; « tout réel » = l'inverse ; les deux perdants | ✓ | vitrine **+4,0** d'écart affiché−réel ; réel **−2,2** ; mixte au-dessus des deux au bilan |
| 4. Les 5 compteurs au vert impossibles à 5 ans, possibles à 10 ans | ✓ | meilleur relevé **3/5** au bilan, **4/5** en projection décennale |

### Note de méthode sur la cible 2

Le test naïf — « l'optimum de X dégrade-t-il un compteur par rapport au joueur
passif ? » — ne dit rien : le joueur passif est dominé sur tous les tableaux.
Le banc d'essai teste un vrai arbitrage de Pareto : **la politique qui maximise
X doit laisser au moins un compteur Y nettement (≥ 8 points) en dessous de ce
qu'une politique tournée vers Y aurait obtenu.**

### La matrice des renoncements (catalogue à 40 cartes)

| Si vous maximisez… | vous atteignez | vous renoncez à |
|---|---|---|
| Réussite | 59,4 | Inégalités 26,5 (vs 48,4) · Santé 55,8 (vs 65,1) · Paix 40,6 (vs 69,9) · Budget 22,7 (vs 52,0) |
| Inégalités | 48,4 | Santé 38,7 (vs 65,1) · Paix 57,6 (vs 69,9) · Budget 6,0 (vs 52,0) |
| Santé | 65,1 | Inégalités 21,6 · Paix 50,3 · Budget 21,0 |
| Paix sociale | 69,9 | Réussite 47,9 · Inégalités 39,2 · Santé 47,0 · Budget 18,8 |
| Budget | 52,0 | Réussite 45,7 · Inégalités 30,8 · Santé 44,3 |

**L'équité reste le compteur le plus cher — mais elle est devenue jouable.**
La phase 2 lui a donné des leviers sans guerre scolaire (secteurs
multi-collèges, refonte progressive de l'éducation prioritaire, plan
maternelle, repérage du décrochage, devoirs faits), et la guerre scolaire
est passée d'un déclenchement instantané à une **escalade** : deux provocations
sont nécessaires pour l'armer (conditionnement du privé + carte scolaire
agressive, ou l'abrogation de la loi Carle qui en vaut deux à elle seule).
Résultat : le doctrinaire-égalité survit à 47 % (contre 7 % avant correction)
et affiche l'une des meilleures projections décennales (50,5).

---

## 2. Trajectoires des cinq compteurs

Chaque cellule : **affiché / vrai**. L'écart entre les deux est le sujet du jeu.
500 parties par stratégie.

### Passif (ne rien faire)
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 39 / 41 | 34 / 33 | 28 / 26 | 74 / 69 | 29 / 28 | 100 % |
| an 2 | 39 / 40 | 33 / 32 | 26 / 22 | 73 / 66 | 29 / 26 | 89 % |
| an 3 | 39 / 40 | 32 / 31 | 21 / 18 | 66 / 58 | 27 / 25 | 77 % |
| an 4 | 39 / 39 | 32 / 31 | 16 / 14 | 55 / 48 | 26 / 24 | 69 % |
| an 5 | 38 / 39 | 30 / 30 | 8 / 10 | 42 / 37 | 24 / 23 | 61 % |
| **+10 ans** | 33 | 26 | 2 | 46 | 12 | — |

Fins de partie : remaniement 39 % · renvoi 32 % · mandat_complet 29 %

### Tout vitrine
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 42 / 42 | 34 / 32 | 31 / 27 | 71 / 59 | 30 / 27 | 100 % |
| an 2 | 45 / 43 | 34 / 30 | 32 / 28 | 70 / 57 | 31 / 24 | 91 % |
| an 3 | 47 / 45 | 33 / 28 | 34 / 32 | 64 / 54 | 27 / 18 | 83 % |
| an 4 | 48 / 47 | 30 / 25 | 39 / 38 | 63 / 58 | 25 / 16 | 70 % |
| an 5 | 50 / 49 | 23 / 20 | 45 / 43 | 61 / 58 | 26 / 16 | 62 % |
| **+10 ans** | 45 | 18 | 31 | 53 | 6 | — |

Fins de partie : mandat_complet 58 % · remaniement 24 % · renvoi 18 %

### Tout réel
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 39 / 41 | 34 / 33 | 30 / 27 | 73 / 65 | 28 / 26 | 100 % |
| an 2 | 38 / 42 | 33 / 33 | 29 / 29 | 73 / 65 | 31 / 27 | 90 % |
| an 3 | 37 / 41 | 33 / 34 | 25 / 30 | 70 / 64 | 27 / 21 | 81 % |
| an 4 | 36 / 41 | 34 / 34 | 27 / 34 | 68 / 64 | 21 / 16 | 74 % |
| an 5 | 37 / 42 | 34 / 35 | 26 / 34 | 66 / 64 | 16 / 12 | 64 % |
| **+10 ans** | 49 | 45 | 32 | 63 | 9 | — |

Fins de partie : mandat_complet 58 % · remaniement 33 % · renvoi 9 %

### Mixte (joueur attentif)
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 39 / 42 | 33 / 33 | 32 / 31 | 75 / 70 | 33 / 28 | 100 % |
| an 2 | 41 / 43 | 33 / 33 | 33 / 33 | 75 / 70 | 34 / 25 | 90 % |
| an 3 | 42 / 45 | 34 / 34 | 39 / 40 | 73 / 69 | 32 / 21 | 81 % |
| an 4 | 46 / 50 | 36 / 36 | 49 / 49 | 71 / 69 | 28 / 18 | 73 % |
| an 5 | 51 / 54 | 36 / 36 | 56 / 56 | 70 / 69 | 26 / 17 | 62 % |
| **+10 ans** | 55 | 48 | 55 | 69 | 13 | — |

Fins de partie : mandat_complet 60 % · remaniement 34 % · guerre_scolaire 3 % · renvoi 2 %

### Doctrinaire · reussite
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 39 / 42 | 34 / 33 | 31 / 30 | 75 / 69 | 34 / 31 | 100 % |
| an 2 | 40 / 43 | 33 / 32 | 31 / 32 | 74 / 69 | 38 / 33 | 87 % |
| an 3 | 40 / 44 | 32 / 31 | 33 / 38 | 72 / 69 | 40 / 34 | 79 % |
| an 4 | 41 / 47 | 32 / 31 | 39 / 45 | 71 / 69 | 43 / 36 | 73 % |
| an 5 | 44 / 50 | 31 / 31 | 50 / 54 | 70 / 69 | 46 / 37 | 63 % |
| **+10 ans** | 58 | 31 | 60 | 69 | 32 | — |

Fins de partie : mandat_complet 63 % · remaniement 37 %

### Doctrinaire · sante
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 39 / 41 | 34 / 33 | 29 / 28 | 75 / 70 | 35 / 33 | 100 % |
| an 2 | 40 / 42 | 33 / 32 | 30 / 30 | 75 / 70 | 40 / 40 | 85 % |
| an 3 | 40 / 44 | 32 / 31 | 33 / 36 | 73 / 70 | 48 / 47 | 78 % |
| an 4 | 41 / 46 | 32 / 31 | 41 / 47 | 72 / 70 | 57 / 54 | 72 % |
| an 5 | 45 / 49 | 31 / 31 | 52 / 57 | 71 / 70 | 68 / 61 | 65 % |
| **+10 ans** | 51 | 29 | 62 | 70 | 49 | — |

Fins de partie : mandat_complet 65 % · remaniement 35 % · renvoi 0 %

### Lecture

- **Passif** : ne rien faire ne stabilise rien — la santé du système et la paix
  sociale s'érodent seules (conflictualité latente), et l'Élysée finit par
  remplacer un ministre invisible. 25 % de survie.
- **Tout vitrine** : l'affiché reste au-dessus du vrai pendant tout le mandat ;
  les inégalités s'effondrent en projection. Le tableau de bord ment dans le
  bon sens jusqu'au bilan.
- **Tout réel** : l'affiché est en dessous du vrai dès la première année — le
  ministre est jugé sur des indicateurs qui ignorent ce qu'il a semé.
- **Mixte** et **doctrinaires** : les seules trajectoires où bilan et projection
  montent ensemble. Le cap tenu (cohérence ≥ 45 % avec la doctrine déclarée)
  fait composer les gains — référence Portugal.

---

## 3. Les mécaniques ajoutées en phase 2

- **Menu tournant** : 12 cartes par janvier sur le catalogue de 40, rotation
  déterministe par (année, graine) ; la revalorisation est toujours proposée
  (on revalorise à chaque budget, ou jamais) et les mesures présidentielles en
  attente restent sur le bureau — l'Élysée y veille.
- **Guerre scolaire en escalade** : compteur de provocations (carte scolaire
  au-delà de 78 % d'effort sur le privé : +1/an ; conditionnement du privé :
  +1 ; chèque-éducation : +1 ; abrogation Carle : +2). Armée à 2 ; le
  déclenchement reste probabiliste tant que le capital est bas — le contre-jeu
  existe.
- **Cartes-leçons nouvelles** : le rabot HSA (1 heure supplémentaire ≈ 1/50 du
  coût d'un poste, et l'épuisement en prime), la réforme de la formation
  initiale qui casse une année de recrutement pendant la transition
  (attractivité −9 temporaire), le pacte pluriannuel que Bercy compte comme une
  reddition (bercy −3, adhésion +), quatre paris d'orientation mutuellement
  exclusifs (report du palier / différenciation précoce / groupes de besoins /
  brevet-barrage : un seul par mandat), et deux cartes à variance maximale
  assumée (1 cadenas : surveillants généraux, uniforme).

## 3 bis. La phase pédagogique (améliorations demandées après tests)

Quatre changements orientés compréhension, sans toucher à l'économie du jeu
(banc d'essai re-vérifié : 4/4 cibles sur trois graines, `remaniementBase`
0,19 → 0,205 pour compenser les petits bonus de l'été) :

- **Les projets de 2027 dès la doctrine** (`PROJETS_2027` dans les
  constantes) : chaque compteur affiche, au moment du classement, les candidats
  réels qui en font leur priorité et leur proposition phare ; après l'annonce,
  un encart « la presse décode votre doctrine » situe le joueur sur la carte
  politique. Premier enseignement du jeu : il n'y a pas de priorité neutre.
- **L'été des cent jours** : deux dossiers de crise (tirés de quatre : canicule
  et bâti, agression d'un enseignant, polémique de manuel, petite phrase de
  rentrée) entre la nomination et la première rentrée. Effets volontairement
  modestes ; chaque option porte un décryptage — le début de partie est plus
  dense, et chaque décision enseigne quelque chose.
- **« Comprendre l'effet »** : les 40 cartes portent désormais un champ
  `preuve` (ce que disent les études, sourcé : DEPP, CSEN, EEF, IGÉSR, OCDE)
  et, pour 15 d'entre elles, un champ `ideeRecue` qui déconstruit explicitement
  la croyance associée (uniforme, redoublement, allocations, groupes de niveau,
  surveillants généraux, devoirs, mixité…). Une légende explique l'échelle des
  cadenas (5 = plus de 90 études ; 1 = quasi aucune évaluation).
- **Densité maîtrisée** : menu progressif (`TAILLES_MENU` : 7 cartes en an 1,
  9, 11, puis 12) et cartes repliées par défaut — titre, coût, niveau de preuve
  et porteurs en tête ; le détail, le mot et la preuve se déplient.

## 3 ter. La phase « retours de jeu »

Cinq corrections issues des premières parties du commanditaire, plus une
demande d'inspiration du jeu de budget (banc d'essai re-vérifié : 4/4 sur
trois graines ; la survie du passif retombe à ~10 % une fois son audience
par défaut passée à la fermeté) :

- **La doctrine pilote le menu** (`affiniteDoctrine`) : en début de mandat,
  l'essentiel du menu est aligné sur les deux premières priorités déclarées ;
  le reste du catalogue arrive au fil des années. Déclarer une doctrine a
  désormais un effet mécanique immédiat, pas seulement un effet de score.
- **Priorités présidentielles expliquées** : la passation détaille la
  mécanique (échéance, −10 capital, +15 fatigue, cap non tenu), chaque carte
  concernée affiche son échéance et sa sanction, et l'Élysée envoie un
  courrier de rappel un an avant l'échéance.
- **Carte scolaire** : encadré « comment ça marche » en trois temps, et la
  lecture du curseur affiche l'effet prévisionnel sur l'encadrement
  (élèves/classe avant → après) et sur le crédit Bercy.
- **Le budget rendu visible** : l'atelier s'ouvre sur la barre des
  64,5 Md€ — masse salariale, dépenses engagées, engagements du joueur
  (l'effet cliquet), et le liseré vert de la marge annuelle (~1,2 % du
  budget). La contrainte se voit avant de se subir.
- **Image ≠ réel** : les effets vitrine sont étiquetés « image » avec une
  note explicative (immédiats, s'estompent, ne comptent pas au bilan) ; le
  bilan révèle l'« effet documenté » à côté du tirage obtenu, avec un
  verdict (« tirage favorable — la preuve était mince », « effet amputé :
  implémentation dégradée »). Plus d'ambiguïté entre ce qui se voit et ce
  qui agit.
- **L'audience syndicale annuelle** (`AUDIENCES`, `RECEPTION`) : chaque
  octobre, l'organisation majoritaire du moment pose UNE question tirée du
  contexte réel de la partie (postes rendus, salaires, remplacement,
  concours, grève de l'année, doctrine). Trois réponses — fermeté, méthode,
  concession — dont l'accueil (« bien pris / mal reçu ») dépend du profil de
  l'interlocuteur : la concession paie partout mais se paie à Bercy, la
  méthode paie chez les réformistes, la fermeté rassure l'opinion et coûte
  le corps. Il n'y a pas de bonne réponse dans l'absolu, il y a une bonne
  réponse à quelqu'un.

## 4. Les constantes du moteur

Inchangées depuis la phase 1 (voir `moteur/constantes.js`, tout est commenté
avec sa source), à trois ajustements près :

| Constante | Avant | Après | Raison |
|---|---|---|---|
| `RENVOI.remaniementBase` | 0,155 | 0,205 | recaler la survie du joueur attentif dans la fenêtre 40-62 % après l'élargissement du catalogue |
| guerre scolaire | armement instantané | 2 provocations, proba 0,26/an si capital < 22 | rendre l'équité jouable sans retirer la tragédie |
| `MESURES_PRESIDENTIELLES` | 6 cartes | 10 cartes (penchant vitrine) | l'Élysée aime le visible |

Rappels de la phase 1 : effet cliquet budgétaire (la marge nouvelle de l'année
est ~0,2-1,5 Md€, une charge récurrente la consomme à vie), facteur
d'implémentation indexé sur l'adhésion (Slavin), capacité d'absorption de
3 réformes, héritage à 60 % du signal affiché les deux premières années,
« tenir le cap » mesuré par la cohérence avec la doctrine déclarée.

## 5. Paramètres à réexaminer après tests humains

| Paramètre | Valeur | Ce qu'il faut regarder |
|---|---|---|
| `RENVOI.remaniementBase` | 0,205 | Une fin subie par tirage peut frustrer. Si les testeurs la trouvent arbitraire, 0,15 et compenser par les convocations (qui, elles, se méritent). |
| Rotation du menu | 12/40 | Vérifier qu'un joueur qui vise une doctrine trouve ses cartes assez souvent ; sinon, garantir 1 carte de chaque famille par menu. |
| `PALIERS_BERCY[0].marge` | 1,35 Md€ | Contrôle l'ambition possible sur cinq ans. |
| `GREVE.conflictualiteLatente` | 0,42 | La paix sociale baisse sans grève visible ; l'interface l'explique-t-elle assez ? |
| Effets d'équité | — | L'optimum Inégalités (48,4) reste sous les autres : c'est la thèse assumée. Si les testeurs le vivent comme une impasse, +1 à +2 sur `secteurs` et `ep_progressive`. |
| Humour | — | Les « mots » des cartes et le fil social : vérifier que la satire reste symétrique à l'usage (elle l'est par construction dans les textes). |

---

*Jeu pédagogique indépendant, sans lien avec le ministère de l'Éducation
nationale. Ordres de grandeur issus de sources publiques (DEPP, PLF, Sénat,
OCDE/TALIS, Cour des comptes, IGÉSR, CSEN, EEF), datés d'août 2026. Le jeu ne
dit jamais qu'une doctrine est la bonne : chaque carte cite ses porteurs réels
et le niveau de preuve de son effet.*
