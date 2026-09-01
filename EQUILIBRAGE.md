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

## 3 quater. La phase « Président & rapport de force »

Retours de jeu de la deuxième session, plus les greffes du prototype d'UI
fourni par le commanditaire (« Le Bureau », design handoff). Banc d'essai
re-vérifié : 4/4 cibles sur trois graines.

- **Plus de couche présidentielle du tout** (retirée après tests) : le jeu ne
  dit pas qui a été élu, n'impose aucune plateforme et aucune « mesure
  présidentielle ». Le joueur accepte le ministère, puis **classe librement**
  les cinq compteurs devant la presse — c'est sur son propre ordre que le
  bilan le note. Les trois tentatives successives (doctrine fixée par un
  Président choisi, puis tiré au sort, puis plateforme suggérée avec coût
  d'écart) ajoutaient une couche que les tests n'ont jamais rendue lisible :
  « on ne comprend pas ce que ça fait là ni pourquoi ». La simplification
  n'a coûté aucune cible d'équilibrage.
- **La revendication syndicale** : second temps de l'audience d'octobre.
  L'organisation majoritaire exige le retrait de la mesure en vigueur qu'elle
  conteste le plus. Céder retire réellement la mesure du jeu (`retirerMesure` :
  crédits récurrents restitués, effets non advenus annulés, priorité
  présidentielle abandonnée le cas échéant) ; maintenir face à un profil
  combatif dépose un préavis de grève. Le risque de grève est chiffré sur
  chaque option avant de répondre.
- **Greffes du prototype d'UI** : hiérarchie « 3 grands indicateurs (votre
  doctrine) + le reste replié » dans le bandeau ; deltas d'acteurs affichés
  en direct sous les curseurs de la carte scolaire, avant validation ;
  « scellés ouverts » en clôture d'année (les effets réels qui arrivent sont
  révélés, comparés à l'effet documenté) ; fond papier crème des documents
  administratifs ; bouton « Tamponner ».
- **Divers** : précédents de la carte scolaire dynamiques (vos propres
  arbitrages passés dès l'an 2), formulation de la passation clarifiée,
  sauvegardes re-versionnées (v2).

## 3 quinquies. Trois fenêtres de décision par an

Le joueur attendait janvier 2028 pour prendre sa première décision de fond —
sept écrans sans agir. Le calendrier compte désormais **trois moments où l'on
annonce**, chacun avec sa maille propre :

| Fenêtre | Quand | Enveloppe | Annonces | Dépassement |
|---|---|---|---|---|
| Prise de fonction | juin 2027, une fois | 300 M€ de redéploiement | 2 | non |
| Circulaire de rentrée | chaque septembre | 120 M€ de redéploiement | 1 | non |
| Arbitrage de janvier | chaque janvier | marge Bercy + carte scolaire | 3 | **oui** |

Deux règles nouvelles, toutes deux réalistes et toutes deux structurantes :

- **`ANNONCES_MAX`** plafonne le nombre de mesures par fenêtre. La contrainte
  n'est pas budgétaire mais réglementaire et humaine : calendrier du Conseil
  supérieur de l'éducation, textes à écrire, capacité à accompagner. Un
  ministre qui annonce six réformes dans l'année n'en applique aucune.
- **Le dépassement d'enveloppe n'est possible qu'en janvier.** On n'arrache
  pas un arbitrage interministériel pour une circulaire de rentrée : elle se
  finance par redéploiement, ou ne se finance pas.

Sans ces deux règles, l'ouverture de deux fenêtres supplémentaires faisait
passer les stratégies de 8 à 15 mesures par mandat et la survie du joueur
attentif de 53 % à **21 %** : capital épuisé, crédit Bercy détruit par des
dépassements triplés, et 20 % de guerres scolaires par accumulation de
provocations. Avec elles, la survie revient à 51-55 % et les quatre cibles
sont tenues sans autre retouche.

## 3 sexies. La revalorisation, entièrement chiffrée

La carte salariale passe de trois choix forfaitaires à **trois curseurs
indépendants** — combien, comment, pour qui — dont toutes les conversions sont
calculées par `chiffrerRevalorisation()`, appelée à la fois par l'interface et
par le moteur : **ce que le joueur lit est exactement ce qui est appliqué.**

**Le montant** est libre, de 200 M€ à 5 Md€ par an. Le panneau affiche en
direct, pour chaque réglage : le nombre d'enseignants concernés, le brut
mensuel moyen que cela représente, l'équivalent en points d'indice, la part du
rattrapage réclamé par la FSU, le coût réel pour l'État et le déplacement de la
position salariale.

**L'instrument** change le coût réel à euro affiché constant :

| Instrument | Position salariale | Coût réel | Bercy | Autre effet |
|---|---|---|---|---|
| Point d'indice | ×1,00 | **×1,43** (CAS Pensions) | −6 | irréversible |
| Prime indemnitaire | ×0,75 | ×1,00 | 0 | un successeur peut l'arrêter |
| Pacte (contre missions) | ×0,45 | ×1,00 | +4 | −0,6 pt d'heures non assurées |

Le surcoût caché de l'indiciaire (CAS Pensions = 25,15 Md€ pour 58,4 Md€ de
masse salariale, soit +43 %) est **la** raison pour laquelle tous les
ministères du Budget préfèrent la prime. Le jeu le montre au lieu de le dire.

**La cible** concentre : 38 % du corps pour les débuts de carrière (la cible
déjà retenue en 2023), 30 % pour le milieu de carrière (le décrochage de
−14 % vs OCDE), 100 % pour le saupoudrage. À montant égal, cibler multiplie
le gain par tête — et le ressentiment de ceux qu'on ne cible pas.

Contrôle de cohérence : 2,5 Md€ répartis sur tout le corps donnent
**256 €/mois**, ce qui recoupe le « +200 à +500 €/mois » chiffré à 2,5 Md€
dans le débat public. Les mêmes 2,5 Md€ concentrés sur les débuts de carrière
donnent 673 €/mois — la démonstration arithmétique de ce que « cibler » veut
dire.

## 3 septies. La phase « sources » — desserrer, expliquer, enrichir

Quatre demandes, une exigence : **tout ce qui est ajouté doit être sourcé sur
des sites officiels.** La recherche a précédé le code, et c'est elle qui a
fixé les chiffres — pas l'inverse.

### a) Le budget desserré, parce que la réalité l'a desserré

Le blocage signalé par les testeurs (« bloqué trop vite à cause du budget »)
était fondé, et la correction était disponible dans les documents budgétaires :
les lettres plafonds du 16 juillet 2026 portent la mission interministérielle
« Enseignement scolaire » à **65,3 Md€ au PLF 2027, soit +0,8 Md€ (+1,2 %)**,
là où le budget 2026 progressait de +0,26 %. Le jeu s'ouvrait donc sur le
cadrage de l'année précédente.

| Constante | Avant | Après | Justification |
|---|---|---|---|
| `CADRAGE.missionHorsCAS` | 64,49 | **65,30** | plafond prévisionnel PLF 2027 |
| `ENVELOPPE_BASE` | 0,17 | **0,42** | ~la moitié des +0,8 Md€ est pré-engagée (recrutement, protection sociale complémentaire, allocations de stage) |
| `ENVELOPPE_PRISE_FONCTION` | 0,30 | **0,55** | marge de redéploiement de juin |
| `ENVELOPPE_RENTREE` | 0,12 | **0,22** | circulaire de rentrée |
| `PALIERS_BERCY[*].marge` | 1,35 / 0,72 / 0,38 / 0,05 | **1,80 / 1,05 / 0,62 / 0,18** | translation du même écart entre paliers |
| `CREDIT_BERCY_INITIAL` | 40 | **48** | le mandat s'ouvre sur un budget en hausse, pas sur une purge |
| `TAILLES_MENU` | 7/9/11/12/12 | **7/10/12/14/14** | 55 cartes au lieu de 40 : sans cela, la moitié du catalogue ne serait jamais vue |

Résultat mesuré : **4/4 cibles** sur quatre jeux de graines indépendants
(1000, 55555, 987654, 424242), survie du joueur attentif 45-50 %. Le
desserrement ne casse rien : il déplace le moment où la contrainte mord, de
la première année vers la troisième — ce qui est le bon moment, puisque
c'est là que l'effet cliquet des mesures pérennes commence vraiment à peser.

### b) La note de cadrage (juin 2027)

Un nouvel écran s'intercale entre la déclaration de doctrine et les premières
annonces : trois fiches — l'argent, les élèves qui manquent, ce que savent les
élèves — avec une série budgétaire 2019-2027 en graphique, et **chaque chiffre
suivi de sa source cliquable**. Aucune recommandation : l'état du système, et
rien d'autre.

### c) L'onglet « Comprendre le jeu »

Bouton fixe en bas à gauche, disponible sur tous les écrans. Il ouvre les
**neuf fiches** de `moteur/reperes.js` (50 chiffres, 31 sources), dont la
neuvième explique la mécanique du jeu lui-même : l'échelle des cadenas, l'écart
vitrine/réel, le facteur d'implémentation. La liste complète des sources est
en pied de panneau.

Un choix éditorial notable : là où deux sources officielles donnent des
chiffres différents — le remplacement, mesuré à 4,3 % du temps scolaire par le
Sénat (juin 2025) et à 9,3 % au collège-lycée par la Cour des comptes
(décembre 2025) — **les deux sont affichés**, avec la raison de l'écart. Le
désaccord entre sources est une donnée pédagogique, pas une négligence.

### d) Quinze mesures de plus, découvertes en jouant

Le catalogue passe de 40 à **55 cartes**. Les quinze nouvelles ne sont pas sur
le bureau au premier jour : chacune porte un champ `decouverte` qui dit à
quelle condition le dossier remonte.

| Déclencheur | Ce qu'il modélise | Cartes |
|---|---|---|
| `{ annee: 2 }` / `{ annee: 3 }` | on découvre son ministère avec le temps | tutorat, PFMP, cantine, orientation, année de 38 semaines, évaluation d'établissement |
| `apres_un_an` | idem, après la première rentrée | lecture explicite, directeurs d'école, statut AED, plan Mayotte-Guyane |
| `heures_perdues` (HNA ≥ 10,6) | un rapport tombe quand le sujet devient visible | absences institutionnelles |
| `reussite_basse` | TIMSS revient dans l'actualité | plan mathématiques |
| `segregation_haute` | l'écart d'IPS force le sujet | affectation au lycée |
| `maires_en_colere` | vos fermetures de classes ont été comptées | ruralité |
| `apres_pause_numerique` | une mesure en appelle une autre | pause numérique au lycée |

Mesuré sur 400 parties : **6,8 ouvertures de dossier par partie**, 89 % des
parties en voient au moins une, et **les 15 cartes sont proposées au menu**
au moins une fois sur l'ensemble des stratégies testées. Le joueur est prévenu
par un bandeau et par un badge « nouveau dossier » sur la carte concernée.

Toutes portent, comme les précédentes, leurs porteurs réels, leur niveau de
preuve, une idée reçue déconstruite et leur source : EEF (tutorat +4 mois,
code alphabétique +5 mois), Cour des comptes (deux tiers des absences non
remplacées sont d'origine institutionnelle), OCDE (36 semaines contre 38,
7 h de présence par jour au collège contre 5), décret du 11 août 2023
(allocation de stage : 50/75/100 € par semaine), rapport Villani-Torossian,
Conseil d'évaluation de l'école.

## 3 octies. Le rapport HCSP d'août 2026 — la source qui corrige le jeu

Le Haut-commissariat à la Stratégie et au Plan a publié en août 2026
« Niveau scolaire : éléments de diagnostic et propositions » (rapporteur
Pierre-Yves Cusset), rapport d'un groupe de travail réunissant la DEPP, des
chercheurs et des personnalités qualifiées. C'est la source la plus complète
et la plus récente dont le jeu dispose, et elle a servi à trois choses.

### a) Corriger une carte que le jeu présentait à tort comme acquise

Le suivi de long terme du dédoublement change la conclusion : les bénéfices
observés de la fin du CP à la fin du CE1 **n'apparaissent plus à l'entrée en
sixième**. Le jeu affichait `egalite +8 à 4 ans, 4 cadenas` — c'est-à-dire
exactement l'excès de confiance que le jeu prétend enseigner.

| Carte | Avant | Après |
|---|---|---|
| `dedoublement` — égalité | central 8, 4 cadenas | **central 5, 3 cadenas** |
| `dedoublement` — réussite | central 2, 4 cadenas | **central 1, 3 cadenas** |

`preuve`, `ideeRecue` et le mot de la carte ont été récrits autour du démenti.
C'était le test du dispositif : une source contraire doit pouvoir déplacer
un paramètre, pas seulement s'ajouter en note de bas de page.

Trois autres cartes ont été enrichies plutôt que corrigées :
`lecture_explicite` (la moitié des enseignants employant la méthode la plus
efficace exercent dans une quinzaine de circonscriptions où un accompagnement
avait été organisé — ce n'est pas la circulaire qui diffuse une méthode),
`formation` (l'efficacité dépend de l'intensité, de la durée et de l'ancrage
dans la pratique) et `revalorisation` (367 000 + 485 000 enseignants : toute
mesure générale coûte cher ou ne fait rien).

### b) Rendre jouables les onze recommandations

Le rapport ne fait pas que diagnostiquer : il recommande. Dix cartes en sont
tirées, portées à la découverte progressive et datées de la parution du
rapport — c'est-à-dire pendant le mandat du joueur.

| Carte | Recommandation | Ce qu'elle apporte au jeu |
|---|---|---|
| `evaluabilite` | 1 et 2 | La seule carte dont l'effet est d'empêcher les suivantes d'être prises à l'aveugle. Coût dérisoire, effet à 6 ans, 4 cadenas. |
| `accompagnement_separe` | 6 | Sépare inspection et accompagnement, crée l'équivalent des conseillers pédagogiques au collège. |
| `coordination_pedago` | 7 | Reconnaît la coordination pédagogique — la seule réponse au « dans un système où les difficultés sont perçues comme individuelles, les réponses le sont aussi ». |
| `ors_college` | 8 | Inscrit formation et animation dans les obligations de service au collège. Grève d'intensité 4 sur le statut. |
| `semaine_45` | 11 | Quatre jours et demi à l'école. Périmètre Matignon, capital 10, vitrine négative des deux côtés. |
| `specialisation_pe` | 9 | Spécialisation certifiée des professeurs des écoles. |
| `manuels` | 10 | Information publique sur la qualité des manuels — deux adversaires organisés pour sept centièmes de milliard. |
| `sciences_primaire` | ch. 3 | La seule discipline où le volume horaire est réellement en cause : 47 h déclarées pour 72 recommandées. |
| `calcul_automatismes` | ch. 3 | Techniques opératoires et automatisation ; le volume horaire de maths, lui, est supérieur à la moyenne internationale. |
| `ia_cadre` | ch. 5 | Classée par le rapport en « point de vigilance », pas en recommandation : 1 cadenas, et c'est le message. |

Catalogue : 55 → **65 cartes**, dont 25 à découverte progressive.
`TAILLES_MENU` passe de 7/10/12/14/14 à **8/11/13/15/15** : vérifié, les
65 cartes sont proposées au moins une fois sur l'ensemble des stratégies
testées (250 parties × 6 stratégies), et les 25 cartes à découvrir aussi.

### c) Remplacer des chiffres approchés par des chiffres exacts

La fiche « Comprendre le jeu » gagne une dixième entrée — **« Pourquoi le
niveau baisse »**, qui expose le diagnostic du rapport, y compris ce qu'il
**écarte** : ni le volume horaire (sauf en sciences), ni les élèves
allophones. Les autres fiches passent de 50 à **74 chiffres**.

Remplacements notables :

| Donnée | Avant | Après (HCSP 2026) |
|---|---|---|
| Dépense par élève | 13 545 $ toutes filières | + le détail 2024 : **9 100 € école, 10 500 € collège, 13 000 € LGT, 14 700 € LP** |
| Taille des classes | 21,3 moyenne, collège 23,4 | **21,5 primaire, 25,8 collège** — le plus élevé d'Europe |
| Temps scolaire | « ~600 h de plus que l'OCDE » | **864 h contre 730 h, 973 h contre 851 h** (moyennes européennes) |
| Français en élémentaire | « 59 % français + maths » | **38 % lecture/écriture/littérature contre 25 % dans l'UE** |
| Ségrégation | « elle progresse » | **la ségrégation entre collèges publics a diminué** ; c'est l'écart public/privé qui se creuse |

Ajouts : la semaine de quatre jours (93 % des communes, cas unique dans
l'OCDE), la Journée défense et citoyenneté (un quart des jeunes de 17-18 ans
en difficulté prononcée de lecture), les candidats par poste (5 → 2,5 dans le
premier degré ; 0,7 à Créteil), les non-titulaires (+43 % en sept ans),
l'école inclusive (232 400 élèves en 2006 → 563 400 en 2024), les écrans
(2 h 36 par jour à 10 ans et demi), l'encadrement (1 inspecteur pour 280
enseignants).

Équilibrage revérifié après tous ces changements : **4/4 sur quatre jeux de
graines**, survie du joueur attentif 45-50 %.

## 3 nonies. Retours de test et Partie D

### a) La note de cadrage : un graphique qui mentait

Le reproche le plus grave portait sur l'échelle. Les histogrammes budgétaires
partaient d'un axe tronqué : la barre 2019 paraissait deux fois plus courte que
celle de 2027 alors que l'écart réel est de 25 %. Un jeu bâti sur l'idée que
les chiffres affichés mentent ne peut pas ouvrir sur un graphique trompeur.
**Toutes les barres partent désormais de zéro.**

La correction en a appelé une seconde. À échelle honnête, une courbe d'effectifs
de 11,6 à 9,9 millions paraît plate : l'axe est juste, mais le sujet est raté.
Le graphique démographique ne représente donc plus le niveau mais **la perte
cumulée depuis 2026**, barres descendantes, avec les cinq rentrées que le joueur
arbitre distinguées de celles de ses successeurs. Même honnêteté d'échelle,
sujet correctement cadré — et le chiffre publié par la DEPP (−1 676 800) est
exactement l'extrémité de la dernière barre.

La note passe de trois fiches dépliables à **trois pages courtes : un graphique
et trois chiffres chacune**, émetteur nommé (direction générale de
l'enseignement scolaire), intitulés corrigés — « un budget contraint », « une
baisse démographique », « des résultats préoccupants ». Le détail complet reste
dans l'onglet « Comprendre le jeu », où sa place est.

### b) L'avance de gestion : le budget de juin cesse d'être une impasse

Le testeur ne pouvait presque rien faire en juin. La correction ne consiste pas
à donner de l'argent mais à **rendre son obtention jouable**, par le seul levier
réel dont dispose un ministre arrivant sur un budget voté : la **réserve de
précaution** — la part des crédits gelée en début d'exercice (0,5 % du titre 2,
5 % hors titre 2) que Bercy dégèle, ou pas.

| Option | Juin | Contrepartie en janvier |
|---|---|---|
| Ne rien demander | 550 M€ | — (crédit Bercy +4) |
| Dégel de la réserve | **950 M€** | 45 % de restitution promis (capital −2) |
| Avance large | **1 400 M€** | 60 % de restitution **et** −1 500 ETP de schéma (capital −7, Bercy −5) |

L'engagement non tenu coûte 16 points de crédit Bercy et 6 de capital — plus
que l'avance n'a rapporté. Tenu, il en rend 6. Le premier arbitrage de carte
scolaire est donc pris **en juin, avant de savoir ce que la démographie
donnera**, ce qui est exactement la situation réelle.

### c) Presse et porteurs : la diversité manquait

Le quotidien de référence était toujours le même et cinq titres signaient les
brèves. Désormais : **6 quotidiens** tirés par partie (on ne suit pas le même
journal deux mandats de suite) et **29 signatures** couvrant le paysage réel —
quotidiens nationaux, hebdomadaires, presse régionale, presse spécialisée
éducation (celle que lisent les personnels), radio, télévision, presse
syndicale. Les unes les plus fréquentes ont trois à quatre variantes, choisies
de façon déterministe pour que la sauvegarde les rejoue.

Côté porteurs politiques, trois noms revenaient. Le catalogue compte maintenant
**114 porteurs distincts**, aucun politique au-delà de quatre occurrences, avec
un spectre élargi (Rassemblement national, Reconquête, La France insoumise,
Place publique, Horizons, la droite et la gauche parlementaires) et davantage
d'acteurs institutionnels et associatifs — Institut Montaigne, iFRAP, Terra
Nova, Fondation Jean-Jaurès, IPP, Défenseur des droits, SNPDEN, FCPE,
collectifs d'AESH. Les attributions collectives ont été préférées à
l'invention d'attributions individuelles.

### d) La Partie D : trois mécaniques, deux cartes, une fiche

Le document fourni proposait davantage. On a retenu ce qui **prolonge la
colonne vertébrale du jeu** plutôt que ce qui ajoute des systèmes parallèles.

**La requalification** (précédent : « choc des savoirs », requalifié en
« groupes de besoins » puis vidé de son obligation). Troisième option du
face-à-face syndical, entre céder et maintenir : la mesure change de nom et
devient facultative. Les crédits restent inscrits — on paie toujours — mais
l'effet réel tombe à **18 %**, et elle cesse d'occuper la capacité
d'absorption. Coût immédiat dérisoire : capital −2, fatigue +5, adhésion en
légère hausse. C'est le geste le moins cher du jeu, et le seul dont le prix
n'apparaît qu'au bilan, où les lignes concernées portent la mention
« requalifiée ».

**La réversion** (précédent : réforme du collège 2015, abrogée par décret dès
l'arrivée du successeur). Les effets encore en route à la fin du mandat
n'arrivent qu'à **62 %** dans la projection décennale — sauf si le joueur a
consolidé par une loi de programmation. C'est ce que la carte
`loi_programmation` achète, et c'est tout ce qu'elle achète : 12 points de
capital, périmètre Matignon, aucun effet visible pendant le mandat.

**Le plan territorial intensif** (London Challenge, 2003-2011) : effet réel
fort à 4 cadenas, mais **local** — il ne déplace presque pas les compteurs
nationaux. Frustrant, et vrai.

Trois cartes existantes ont été enrichies de la preuve internationale :
`palier` (Pologne, report du palier d'orientation), `cheque_education` (Suède,
démonstration d'Östh 2013 : c'est le libre choix, non la ségrégation
résidentielle, qui explique les écarts entre écoles) et `autonomie` (Suède,
inflation des notes — la France a déjà 40 % de contrôle continu au bac).
Onzième fiche de référence : **« Ce qui a marché ailleurs »**.

Catalogue : 65 → **67 cartes** ; menus élargis à 8/11/14/16/16, les 67 restent
proposées au moins une fois. Fiches : 10 → **11**, 74 → **80 chiffres**,
32 → **34 sources**. Équilibrage **4/4 sur quatre jeux de graines**, survie
43-51 %.

### e) Non retenu pour l'instant

Trois mécaniques de la Partie D attendent : les **effets de bord** tirés au sort
et révélés à N+2, le **choc exogène** majeur (pandémie, cyberattaque) tiré une
fois par partie, et l'archétype de **l'affaire** — l'événement où aucune option
n'est bonne. Chacune ajoute un système d'événements, pas seulement des données ;
elles méritent d'être décidées, pas glissées.

## 3 decies. Les turbulences — ce qui vous arrive et que vous n'avez pas décidé

Sur les six causes documentées de chute d'un ministre de l'Éducation, **une
seule relève de la politique éducative**. Les cinq autres tiennent à la
posture, à la communication, au hasard biographique ou au périmètre de la
nomination. Un ministre tombe plus souvent sur une phrase que sur un bilan —
et un jeu qui n'aurait que des compteurs de résultats scolaires ne pourrait
pas représenter ce qui met réellement fin aux carrières.

Trois briques, une seule idée : **ce qui déstabilise ne se décide pas.**

### a) Le profil, tiré à la nomination

Quatre origines (la maison, la haute fonction publique, un mandat local, la
société civile) et trois périmètres (plein exercice, périmètre élargi,
ministre délégué), tirés au sort et affichés dès l'écran de nomination.

| | Effet |
|---|---|
| Origine | adhésion −8 à +7, capital −4 à +7, crédibilité −4 à +10, et **une ou deux affaires auxquelles elle expose** |
| Périmètre | capital −9 à +9, crédit Bercy −7 à +4, et un **plafond d'adhésion** abaissé de 15 points pour le périmètre élargi |

Règle absolue tenue : **aucun profil n'est meilleur qu'un autre au sens des
compteurs éducatifs.** Ils exposent différemment, c'est tout. Le joueur n'a pas
choisi son handicap — comme dans la réalité, où la fusion Éducation-Sports de
janvier 2024 a été lue comme un déclassement avant que la ministre n'ait rien
décidé.

### b) La crédibilité — la ressource de parole

Nouvelle jauge, distincte du capital politique, initialisée à **62**. Elle
multiplie tout l'effet-vitrine par `0,55 + 0,90 × (crédibilité / 100)` : à 62,
×1,11 ; à 20, ×0,73 ; à 95, ×1,41. À crédibilité effondrée, la meilleure mesure
du catalogue ne porte plus.

Elle se dégrade vite et se reconstitue lentement (+4/an) :

| Événement | Crédibilité |
|---|---|
| Requalifier une mesure sous pression | **−9** |
| Abandonner une mesure | −5 |
| Affaire, selon la réponse | −3 à −24 |

C'est le lien qui manquait entre la requalification (phase précédente) et son
coût : se dédire ne coûtait qu'un peu de fatigue, cela coûte désormais la
parole. Elle est affichée au tableau de bord déplié, avec le multiplicateur en
clair.

### c) Les affaires — tirage conditionnel, jamais aléatoire pur

Six archétypes, **pseudonymisés intégralement** : les situations sont inspirées
de faits publics, les personnages sont fictifs, et aucune affaire n'est rejouée
sous le nom de qui que ce soit. Ce qu'on garde, c'est la forme — le
déclencheur, la cinétique, l'issue.

| Archétype | Ce qui est reproché | Résonne avec |
|---|---|---|
| Le lieu | la distance avec le terrain | remplacement, rythmes, obligations de service |
| L'école de vos enfants | la défiance envers le service public | privé, affectation, sectorisation |
| Le privilège | l'écart entre ce qu'on exige et ce qu'on s'applique | obligations de service, évaluation, autonomie |
| Le faux nez | l'instrumentalisation de l'État | manuels, numérique, uniforme, évaluations |
| L'illégitimité | le droit même d'occuper le poste | rien — elle est **subie** |
| Votre passé | une défaillance antérieure à la nomination | rien — elle est **subie** |

**Le tirage.** Probabilité de base 9,5 % par an, **×2,6 si le ministre a joué
une carte du même thème dans l'année**, ×1,7 si son profil y est exposé,
plafonnée à 42 %, deux affaires par partie au maximum. C'est la règle la plus
fidèle au réel de tout le dossier : *on n'est pas puni pour ce qu'on fait, on
est puni pour l'écart.*

Mesuré sur 500 parties : **40 % des parties ne voient aucune affaire**, 42 %
en voient une, 18 % en voient deux ; **28 % des affaires qui sortent sont
résonantes** — c'est-à-dire déclenchées par ce que le ministre venait de faire.
Le bandeau de l'écran le dit explicitement quand c'est le cas.

**Trois réponses, toujours** : assumer sobrement, se défendre sur les faits,
contre-attaquer. La troisième est la plus tentante et la plus coûteuse. Aucune
ne touche un compteur éducatif : elles agissent toutes sur adhésion,
crédibilité et capital.

**L'affaire qui se dégonfle.** Une sur quatre est démentie, classée, ou close
par un remboursement. **Le joueur récupère la moitié du coût, pas la
totalité.** C'est vrai, et c'est ce que le public retient le plus mal.

**Une seule réponse est fatale à elle seule** — et ce n'est pas la plus grave
sur le fond : c'est celle où le ministre justifie la scolarisation privée de
ses enfants par un défaut du service public dont il vient de prendre la tête.
Elle transforme un fait privé en jugement professionnel, unifie les sept
organisations dans la journée, et ouvre une sixième fin de partie (`affaire`).

### d) Les garde-fous, tenus

- **Pseudonymisation intégrale**, y compris pour les affaires closes.
- **Aucune affaire à connotation raciste, sexiste ou identitaire jouable.**
  L'archétype de l'illégitimité existe comme **subi** — un flux d'attaques qui
  affecte le ministre selon son profil — jamais comme une carte que le joueur
  ou un adversaire pourrait « jouer ». On modélise la réalité d'une exposition ;
  on ne fabrique pas un simulateur de dénigrement.
- **Le profil n'est jamais un critère de compétence.**
- Les défenses et les issues sont restituées : une affaire médiatique n'est pas
  une culpabilité, et le jeu le dit à l'écran.

Équilibrage revérifié : **4/4 sur trois jeux de graines**, survie 42-50 %.
Nouvelle répartition des fins : remaniement 45 %, mandat complet 44 %, renvoi
9 %, guerre scolaire 1 %, affaire 1 %.

### e) Toujours en attente

De la partie E : la **cinétique à cinq paliers** de la réforme contestée
(contestation → tribunes → défection interne → désaveu d'une instance → grève
de retrait), le **dérapage verbal** comme registre de sortie médiatique, et la
**boucle hebdomadaire en crise**. De la partie D : le **choc exogène** majeur et
les **effets de bord** révélés à N+2. Chacune change le rythme du jeu, pas
seulement ses données.

## 3 undecies. La note de cadrage, deuxième passe

Trois reproches de test, tous fondés, et une règle qui en sort.

**La règle : un chiffre, un graphique, deux précisions.** Chaque page s'ouvre
désormais sur une accroche unique — le nombre en grand, une phrase — puis le
graphique, puis deux lignes de détail au maximum. La version précédente en
alignait trois à sept, ce qui noyait ce qu'il fallait retenir.

| Page | Le chiffre d'accroche |
|---|---|
| Un budget contraint | **65,3 Md€** — le budget de l'Éducation nationale en 2027 |
| Une baisse démographique | **−1 676 800** — les élèves perdus d'ici 2035 |
| Des résultats préoccupants | **−21 points** — ce que les élèves de 15 ans ont perdu en mathématiques entre 2018 et 2022 |

**Le diagramme des pertes cumulées était illisible.** Il répondait bien à la
question « combien d'élèves perdus », mal à la question « que se passe-t-il ».
Remplacé par la courbe demandée : **bleu plein pour les effectifs constatés
(2024-2026), violet pointillé pour la projection DEPP (2027-2035)**, axe
vertical gradué de 9,5 à 12 millions. Une courbe temporelle a le droit à une
échelle resserrée — c'est l'usage — à condition que l'axe soit gradué et que
la note le dise, ce qu'elle fait.

Trois points constatés ont dû être reconstitués pour que le trait bleu existe :
la rentrée 2026 (11,61 M, constante du jeu), la rentrée 2025 (11,77 M, en
ajoutant les 106 000 élèves perdus en 2026) et la rentrée 2024 (11,88 M, de
même). Les deux variations sont celles que le jeu utilise déjà comme précédents
de carte scolaire.

**Les évaluations ne disaient pas sur quelle période.** C'était le défaut le
plus sérieux : les barres France / moyenne européenne donnaient un écart sans
jamais dire de quand il datait ni comment il avait évolué. Remplacées par la
**série PISA mathématiques 2003-2022** : le plateau bleu de 2012 à 2018, puis
le segment rouge de la chute, annoté « −21 points en quatre ans ».

| Année | 2003 | 2006 | 2009 | 2012 | 2015 | 2018 | 2022 |
|---|---|---|---|---|---|---|---|
| France, mathématiques | 511 | 496 | 497 | 495 | 493 | 495 | **474** |

L'échelle est ancrée sur 2003, année où les mathématiques étaient le domaine
majeur de l'enquête : la série ne peut pas commencer avant.

**Deux défauts de tracé corrigés au passage.** L'abscisse des courbes suivait
le RANG des points et non l'ANNÉE : 2031, 2033 et 2035 apparaissaient à égale
distance, ce qui aplatissait la fin de la projection. Elle suit désormais
l'année. Et l'histogramme budgétaire avait son axe vertical dans une colonne
séparée, calée à l'estime : valeurs, tracé et années sont maintenant trois
rangées de même gabarit, la graduation partageant exactement la base des barres.

**Règle d'échelle, énoncée une fois pour toutes.** Les *barres* partent
toujours de zéro — un axe tronqué transforme une hausse de 1,2 % en mur. Les
*courbes* ont droit à une échelle resserrée, à condition d'être graduées et
légendées. Les deux notes de bas de graphique le disent au joueur.

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

## 3 duodecies. Moins de compteurs, un bilan lisible, des alertes

Deuxième lot de corrections issues de la relecture du document Word. Le
reproche tenait en trois points : trop de compteurs à l'écran, un bilan trop
long, et des mécaniques décisives que rien ne signale pendant la partie.

### a) Trois compteurs affichés au lieu de cinq

Le bandeau montrait cinq jauges (trois grandes, deux repliées) plus huit
indicateurs secondaires : quatorze nombres en permanence sous les yeux. Il en
montre désormais **trois**, et trois seulement : les trois premiers compteurs
de la doctrine que le joueur a lui-même déclarée en juin 2027, ceux qui pèsent
80 % de sa note (35 + 25 + 20). Les deux derniers (12 % et 8 %) continuent
d'être calculés, comptent dans le score, et réapparaissent au bilan avec la
mention « jamais affiché ».

Ce n'est pas un simple allègement graphique. Un ministre ne regarde que le
tableau de bord qu'il s'est donné, et c'est exactement là que les surprises se
logent : le joueur qui classe la paix sociale en cinquième position ne verra
pas l'incendie monter. L'écran de doctrine le prévient explicitement avant le
classement, donc l'information est loyale, et le cabinet alerte si le compteur
caché décroche vraiment.

Les huit indicateurs secondaires tombent à **trois**, toujours visibles au lieu
d'être repliés : capital politique, crédibilité (avec le multiplicateur qu'elle
applique aux annonces) et crédit Bercy. Ce sont les trois monnaies que le
joueur dépense ; les cinq autres relevaient de la physique du système, qui n'a
pas à s'afficher en continu.

Enfin la variation : elle se lisait par rapport à l'écran précédent, donc elle
était presque toujours vide ou minuscule. Elle se lit maintenant **depuis
l'ouverture de l'année en cours**, ce qui donne un nombre stable et lisible
(« ▼ −3,5 cette année ») au lieu d'un clignotement.

### b) Des alertes plutôt que des compteurs

Le jeu tient une dizaine de variables invisibles qui décident du résultat réel :
adhésion des personnels, fatigue réformatrice, capacité d'absorption, couverture
des concours, heures non assurées, écart d'IPS public/privé. Les remettre à
l'écran aurait rétabli l'encombrement qu'on venait de supprimer. Elles se
signalent donc **d'elles-mêmes, quand elles se mettent à mordre** : un encadré
sous le bandeau, qui nomme le seuil franchi, donne le chiffre et explique la
conséquence.

Rationnement volontaire : **une alerte par année au plus, trois par mandat**,
prises dans l'ordre de priorité des règles. Une alerte qui revient à chaque
écran n'alerte plus personne, elle décore. Mesuré sur des parties complètes :
une à trois alertes par partie.

Une de ces alertes répond à une demande explicite de la relecture : épargner le
privé sous contrat fait monter la ségrégation, **et pèse donc sur le compteur
Inégalités**. Le lien était dans le moteur, il n'était dit nulle part.

### c) Un bilan de moitié plus court

L'ancien bilan alignait, après les trois scores et le tableau des compteurs, un
tableau de six colonnes listant chaque effet de chaque mesure, avec un verdict
en petites capitales sous chaque ligne : vingt à trente lignes à lire d'un
trait. Il est remplacé par **trois à quatre phrases** — votre meilleure
décision, votre plus grosse déception (avec la raison : pari à preuve faible,
ou mise en œuvre dégradée), les effets qui arrivent après votre départ — suivies
du tableau complet, **replié** derrière « Le détail, mesure par mesure », et
ramené de six à cinq colonnes. Rien n'est perdu, tout est hiérarchisé. Hauteur
mesurée : environ 1 550 px contre 2 400 auparavant.

### d) « Budget et salaires » devient « Salaires »

Correction directe de la relecture. Le compteur ne mesurait pas le budget (qui
est une contrainte, pas un objectif) mais la position salariale des personnels.

Équilibrage revérifié : **4/4 sur trois jeux de graines**, survie du joueur
attentif 47-49 % (le 40 % relevé sur 250 parties de la graine 777 remonte à
47 % sur 900 parties : c'était du bruit d'échantillonnage, aucune constante du
moteur n'a bougé). Parties complètes rejouées au navigateur en clair, en sombre
et en 390 px : aucune erreur JavaScript, aucun débordement horizontal.

## 3 terdecies. Affaires réelles, arguments syndicaux, boussole politique

Troisième lot de corrections issues de la relecture. Il porte sur ce que le jeu
fait comprendre, plus que sur ce qu'il calcule.

### a) Trois affaires de plus, transposées de faits publics

Le répertoire passe de six à neuf archétypes, sur demande explicite de la
relecture, qui citait quatre situations. L'une (« mentir pour justifier ses
enfants dans le privé ») existait déjà : elle a été précisée, parce que le
reproche n'était pas assez clairement la contradiction plutôt que le choix
d'école. Les trois autres sont nouvelles :

- **L'image** : des photographies de soirée circulent la semaine où le ministre
  demande aux adolescents de poser leur téléphone. Une image ne se réfute pas,
  elle circule ; le grief est la simultanéité, et la réponse factuelle est
  catégoriellement inadaptée.
- **Le rapport corrigé** : un rapport d'inspection publié sans les pages où les
  inspecteurs relevaient des situations homophobes signalées par des élèves. Le
  ministre peut légalement ne pas publier un rapport ; publier une version
  amputée le fait changer de terrain, de l'établissement vers la parole de
  l'État.
- **L'internat** : des violences connues de l'administration et jamais
  transmises au procureur. L'article 40 du code de procédure pénale oblige tout
  fonctionnaire qui a connaissance d'un crime ou d'un délit à en aviser sans
  délai le procureur : c'est le seul point du jeu où le ministre n'a aucune
  marge d'appréciation. Il n'y a donc pas de réponse peu coûteuse, il y a une
  réponse due et deux façons d'aggraver. La contre-attaque y est la deuxième
  réponse fatale du jeu (0,45), après celle de l'école des enfants.

Les archétypes restent pseudonymisés, sans nom ni établissement identifiable, et
la satire reste symétrique. Fréquence mesurée sur 900 mandats : **66 % des
parties voient au moins une affaire**, ce qui satisfait la contrainte posée dès
l'origine (pas à toutes les parties). Un ministre qui répond franchement aux
trois questions de l'Élysée en ferme trois de façon définitive.

### b) Les syndicats argumentent, et le jeu étiquette la nature de l'argument

C'était la demande la plus intéressante de la relecture : « les syndicats
avancent des arguments, certains appuyés par des données, d'autres des principes
et des idéologies ». L'écran de revendication affiche désormais les deux, côte à
côte et nommés :

- l'**argument étayé** est fabriqué à partir des données de la carte elle-même
  (niveau de preuve, effet documenté, postes rendus, adhésion du moment). Il ne
  peut donc pas mentir, et le jeu écrit sous chaque argument ce qu'il vaut ;
- l'**argument de principe** dépend de la famille de la mesure et du profil de
  l'organisation. Le jeu dit explicitement qu'il n'est ni faux ni illégitime,
  simplement non mesurable, et que la confusion des deux registres est ce qui
  rend illisibles la plupart des débats sur l'école.

### c) La boussole : de quels programmes vos mesures se rapprochent

Chaque carte porte depuis l'origine la liste de ceux qui la défendent réellement.
On s'en sert pour une lecture politique **progressive** : à partir de la
deuxième clôture annuelle, puis au bilan, le joueur voit combien de ses mesures
figurent aussi au programme de la gauche, du centre, de la droite et de
l'extrême droite. Trois précautions, qui sont l'essentiel de l'exercice :

1. le rattachement se lit dans la carte, il n'est pas décidé ailleurs ;
2. une même mesure est souvent portée par plusieurs bords, et c'est un fait du
   débat français, pas une imprécision ;
3. **46 des 70 cartes ne sont portées par aucun parti** : elles viennent de la
   Cour des comptes, de la DEPP, du CSEN, de l'IGÉSR ou de la recherche. C'est
   probablement le chiffre le plus instructif du jeu.

Le jeu ne dit jamais « vous êtes de tel bord ». Il dit « ces mesures figurent
aussi dans tel programme ».

### d) Trois mesures de plus, dont celle qui était demandée

Le catalogue passe de 67 à 70 cartes.

- **`trace_ecrite`** : la leçon se copie à la main, fin de la photocopie comme
  trace écrite. C'est la mesure demandée en relecture (« interdire les textes à
  trous »). Source : la mission d'inspection sur l'enseignement en cours moyen,
  citée par le HCSP, relève un recours massif et excessif aux photocopies, qui
  font parfois office de leçon et court-circuitent l'institutionnalisation des
  savoirs ; le rapport Villani-Torossian recommandait déjà de redonner sa place
  au cours structuré. Deux cadenas seulement : ce sont des observations de
  classe, pas un essai contrôlé. Le mot de la carte dit l'essentiel du jeu :
  un ministre peut imprimer une circulaire, il ne peut pas inspecter une
  photocopieuse.
- **`explicite_partout`** : généraliser l'enseignement explicite, du CP à la
  troisième. Quatre cadenas (le HCSP note que son efficacité est prouvée par la
  recherche, et les nouveaux programmes de cycle 2 le retiennent déjà).
- **`taches_complexes`** : investir dans les démarches d'investigation et les
  tâches complexes. Exclusive de la précédente. C'est la seule carte du
  catalogue à porter un effet **négatif assumé** sur la réussite (−2, deux
  cadenas, d'après le point de vigilance du HCSP) en même temps qu'un effet
  positif sur la santé du système. Les deux sont documentés, et le jeu se garde
  de trancher un débat que personne ne devrait trancher en meeting.

### e) Typographie : les tirets cadratins

Demande générale de la relecture : remplacer les « — » par des parenthèses ou
des virgules. 332 occurrences traitées automatiquement selon trois règles
(tirets appariés vers des parenthèses, tiret simple suivi d'une minuscule vers
une virgule, suivi d'une majuscule vers un point), puis relecture. Les titres
des 34 sources ont été **restaurés à l'identique** : ce sont des titres de
documents réels, ils ne se réécrivent pas. Restent une douzaine de tirets qui
servent de séparateurs dans des libellés (« organisation — titre (date) ») et
non de parenthèses de prose.

Équilibrage revérifié après l'ensemble : **4/4 sur trois jeux de graines**,
survie du joueur attentif 48-50 %. Parties complètes rejouées en clair, en
sombre et en 390 px : aucune erreur JavaScript, aucun débordement horizontal.

## 3 quaterdecies. On ne demande pas le retrait de ce qu'on défend

Défaut de logique relevé en relecture : « certaines mesures sont portées par les
syndicats, il ne peut pas y avoir de contestation sur ces sujets ». C'était vrai,
et le jeu ne le savait pas.

### a) Le défaut

`mesureContestee` choisissait la mesure dont l'organisation exigerait le retrait
sur son seul potentiel de conflit : l'intensité de grève inscrite sur la carte,
plus ce que la mesure coûtait aux personnels dans l'effet d'annonce. Il ne
regardait pas qui la portait. Sur les 18 mesures que ce calcul rendait
contestables, une était franchement absurde : « Décharge complète et statut pour
les directeurs d'école », effet d'annonce enseignants +4, adhésion +4, pouvait
être réclamée en retrait par une organisation. On ne demande pas le retrait de ce
qui fait monter l'adhésion.

Et surtout, rien n'empêchait le cas général. Neuf cartes du catalogue sont
portées par des organisations syndicales — la revalorisation par la FSU, les
groupes de besoins par le Sgen-CFDT, le corps de fonctionnaires AESH, la santé
scolaire, la titularisation des contractuels, la vie scolaire, le lycée
professionnel, le statut des AED et la loi de programmation par l'intersyndicale
entière. Aucune n'était contestée en pratique, faute de bloc `greve` : c'était un
accident, pas une règle.

### b) La règle

`porteursSyndicaux(carte)` lit, dans la ligne `porteurs` de la carte, lesquelles
des sept organisations la défendent. Le rattachement est explicite et vérifiable,
comme celui de la boussole politique. Deux points d'attention documentés dans le
code : « l'intersyndicale » et « les organisations syndicales » engagent les
sept ; le **SNPDEN n'est pas l'une des sept** — c'est le syndicat des personnels
de direction, et qu'il porte une mesure ne la protège en rien de la contestation
des syndicats d'enseignants. Le statut des directeurs d'école en est l'exemple
historique, et le jeu doit pouvoir le représenter.

`estContestable(carte, org)` ne retient donc une mesure que si l'organisation ne
la porte pas, si elle ne fait pas monter l'adhésion des personnels, et si elle
est effectivement conflictuelle. Les deux fenêtres de retrait (octobre et mars)
passent maintenant l'organisation demandeuse à `mesureContestee`.

Conséquence mesurée sur 300 mandats par stratégie : le ministre « syndical »
**ne se voit plus jamais réclamer de retrait** (0/300, contre 1/300 par accident
avant), le ministre mixte 79/300, le ministre de vitrine 201/300. La règle
produit exactement ce qu'elle devait produire.

### c) Le pendant qui manquait

Une organisation ne fait pas que réclamer des retraits. Quand le ministre a pris
une mesure qu'elle porte, la délégation le dit avant d'en venir au conflit, dans
un encadré vert au-dessus des trois réponses, et le jeu explique pourquoi il ne
lui proposera jamais d'en demander le retrait. Une fois par mesure et par
organisation : **2,1 soutiens exprimés par partie**, soit une audience sur deux.
Le répéter à chaque fois en aurait fait une tapisserie.

Équilibrage revérifié : **4/4 sur trois jeux de graines**, survie 49-51 %.

## 5. Paramètres à réexaminer après tests humains

| Paramètre | Valeur | Ce qu'il faut regarder |
|---|---|---|
| `RENVOI.remaniementBase` | 0,205 | Une fin subie par tirage peut frustrer. Si les testeurs la trouvent arbitraire, 0,15 et compenser par les convocations (qui, elles, se méritent). |
| Rotation du menu | 16/70 | Vérifier qu'un joueur qui vise une doctrine trouve ses cartes assez souvent ; sinon, garantir 1 carte de chaque famille par menu. |
| `PALIERS_BERCY[0].marge` | 1,80 Md€ | Contrôle l'ambition possible sur cinq ans. Desserré en phase « sources » ; à resserrer si les testeurs trouvent le mandat trop confortable en fin de course. |
| Seuils de `DECLENCHEURS` | HNA 10,6 · IPS 18,6 · réussite 46 | Vérifier que les dossiers remontent au moment où le joueur ressent le problème, pas avant ni longtemps après. |
| `GREVE.conflictualiteLatente` | 0,42 | La paix sociale baisse sans grève visible ; l'interface l'explique-t-elle assez ? |
| Effets d'équité | — | L'optimum Inégalités (48,4) reste sous les autres : c'est la thèse assumée. Si les testeurs le vivent comme une impasse, +1 à +2 sur `secteurs` et `ep_progressive`. |
| Humour | — | Les « mots » des cartes et le fil social : vérifier que la satire reste symétrique à l'usage (elle l'est par construction dans les textes). |

---

*Jeu pédagogique indépendant, sans lien avec le ministère de l'Éducation
nationale. Ordres de grandeur issus de sources publiques (DEPP, PLF, Sénat,
OCDE/TALIS, Cour des comptes, IGÉSR, CSEN, EEF), datés d'août 2026 et listés
avec leur adresse dans `moteur/reperes.js` et dans l'onglet « Comprendre le
jeu » du jeu lui-même. Le jeu ne
dit jamais qu'une doctrine est la bonne : chaque carte cite ses porteurs réels
et le niveau de preuve de son effet.*
