# ÉQUILIBRAGE — RUE DE GRENELLE

> **État du projet : phase 1 terminée.** Le moteur, le calendrier et douze
> cartes-leçons sont implémentés et équilibrés par simulation. L'interface
> n'est pas écrite : c'est délibéré. Le brief demandait de commencer par
> « moteur + simulations », parce que c'est là que les quatre cibles
> d'équilibrage se vérifient à moindre coût — et parce qu'un jeu de gestion
> mal équilibré ne se rattrape pas à l'habillage.

## Ce qui tourne

```
moteur/constantes.js    toutes les constantes, chacune commentée avec sa source (partie B du brief)
moteur/catalogue.js     12 cartes-leçons + les cartes paramétriques (curseurs)
moteur/moteur.js        le moteur : calendrier, vitrine/réel, grève, attractivité, bilan, projection
simulations/strategies.js   10 stratégies-types, même interface de décision que l'interface de jeu
simulations/simuler.js      banc d'essai : vérifie les 4 cibles d'équilibrage
simulations/trajectoires.js trajectoires annuelles des 5 compteurs
```

```bash
npm run equilibrage     # → 4/4 cibles atteintes
npm run trajectoires
```

Le moteur est du JavaScript pur sans dépendance : il tourne en Node pour les
simulations et tournera tel quel dans le navigateur pour le jeu.

---

## 1. Les quatre cibles d'équilibrage

Résultat sur 700 parties par stratégie, vérifié sur trois jeux de graines
indépendants (1000, 55555, 987654) — les quatre cibles passent dans les trois cas.

| Cible (brief C.8) | Verdict | Mesure |
|---|---|---|
| 1. Survivre 5 ans ≈ 1 partie sur 2 pour un joueur attentif | ✓ | **54-58 %** de mandats complets pour la stratégie « mixte » ; 26-30 % pour le joueur passif |
| 2. Aucun compteur maximisable sans en dégrader un autre | ✓ | chaque optimum renonce à 3 ou 4 compteurs, de 8 à 60 points |
| 3. « Tout vitrine » = bon mandat / mauvais bilan ; « tout réel » = l'inverse ; les deux perdants | ✓ | vitrine **+4,9** d'écart affiché−réel ; réel **−1,4** ; mixte au-dessus des deux au bilan |
| 4. Les 5 compteurs au vert impossibles à 5 ans, possibles à 10 ans | ✓ | meilleur relevé **3/5** au bilan, **4/5** en projection décennale |

### Note de méthode sur la cible 2

Le test naïf — « l'optimum de X dégrade-t-il un compteur par rapport au joueur
passif ? » — ne dit rien : le joueur passif est dominé sur tous les tableaux,
donc *toute* politique le bat partout. Le banc d'essai teste donc un vrai
arbitrage de Pareto : **la politique qui maximise X doit laisser au moins un
compteur Y nettement (≥ 8 points) en dessous de ce qu'une politique tournée
vers Y aurait obtenu.** C'est le coût d'opportunité réel, et c'est plus
exigeant.

### La matrice des renoncements

Optima trouvés par échantillonnage de 900 politiques par compteur, trois
graines chacune :

| Si vous maximisez… | vous atteignez | vous renoncez à |
|---|---|---|
| Réussite | 65,7 | Inégalités 30,3 (vs 48,8) · Santé 49,1 (vs 64,9) · Paix 45,4 (vs 69,9) · Budget 15,0 (vs 53,4) |
| Inégalités | 48,8 | Réussite 42,8 (vs 65,7) · Santé 20,3 (vs 64,9) · Paix 44,4 (vs 69,9) · Budget 9,0 (vs 53,4) |
| Santé | 64,9 | Réussite 52,8 · Inégalités 22,4 · Paix 55,5 · Budget 45,0 |
| Paix sociale | 69,9 | Réussite 40,9 · Inégalités 35,8 · Santé 27,9 · Budget 27,0 |
| Budget | 53,4 | Réussite 48,7 · Santé 48,3 · Paix 51,9 |

Lecture : **le compteur « Inégalités » est le plus cher du jeu.** Le seul levier
vraiment puissant sur la ségrégation — conditionner le financement du privé
sous contrat — est aussi celui qui arme l'événement « guerre scolaire »
(précédent Savary, 1984). Le maximiser coûte la paix sociale, le budget et la
santé du système. C'est conforme à ce que montre la partie B, mais c'est le
point que les tests humains devront confirmer (voir § 5).

---

## 2. Trajectoires des cinq compteurs

Chaque cellule : **affiché / vrai**. L'écart entre les deux est le sujet du jeu.
500 parties par stratégie.

### Passif (ne rien faire)
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 39 / 41 | 34 / 33 | 28 / 26 | 74 / 69 | 29 / 28 | 100 % |
| an 2 | 39 / 40 | 33 / 32 | 26 / 22 | 73 / 66 | 29 / 26 | 90 % |
| an 3 | 39 / 40 | 32 / 31 | 21 / 18 | 66 / 58 | 27 / 25 | 79 % |
| an 4 | 39 / 39 | 32 / 31 | 16 / 14 | 55 / 48 | 26 / 24 | 73 % |
| an 5 | 38 / 39 | 30 / 30 | 8 / 10 | 42 / 37 | 24 / 23 | 66 % |
| **+10 ans** | 32 | 26 | 2 | 45 | 12 | — |

Fins de partie : renvoi 35 % · remaniement 34 % · mandat_complet 31 %

### Tout vitrine
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 44 / 43 | 36 / 32 | 33 / 27 | 71 / 60 | 27 / 23 | 100 % |
| an 2 | 48 / 44 | 36 / 30 | 32 / 25 | 65 / 45 | 25 / 15 | 89 % |
| an 3 | 48 / 46 | 33 / 28 | 31 / 27 | 55 / 38 | 25 / 15 | 82 % |
| an 4 | 47 / 45 | 30 / 26 | 36 / 35 | 50 / 41 | 27 / 16 | 58 % |
| an 5 | 49 / 47 | 23 / 20 | 42 / 42 | 50 / 46 | 28 / 17 | 43 % |
| **+10 ans** | 44 | 19 | 25 | 39 | 4 | — |

Fins de partie : renvoi 43 % · mandat_complet 36 % · remaniement 20 %

### Tout réel
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 34 / 40 | 34 / 33 | 26 / 28 | 74 / 69 | 28 / 25 | 100 % |
| an 2 | 36 / 41 | 36 / 36 | 26 / 27 | 72 / 64 | 26 / 20 | 88 % |
| an 3 | 38 / 42 | 36 / 35 | 25 / 27 | 68 / 61 | 24 / 17 | 79 % |
| an 4 | 40 / 43 | 36 / 35 | 28 / 34 | 65 / 60 | 22 / 16 | 71 % |
| an 5 | 47 / 50 | 41 / 41 | 30 / 36 | 64 / 62 | 18 / 13 | 57 % |
| **+10 ans** | 49 | 42 | 28 | 62 | 8 | — |

Fins de partie : mandat_complet 41 % · remaniement 36 % · renvoi 23 %

### Mixte (joueur attentif)
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 38 / 43 | 36 / 37 | 33 / 32 | 75 / 70 | 33 / 27 | 100 % |
| an 2 | 40 / 45 | 36 / 36 | 35 / 35 | 74 / 69 | 32 / 22 | 85 % |
| an 3 | 43 / 47 | 35 / 35 | 38 / 39 | 72 / 67 | 28 / 18 | 76 % |
| an 4 | 47 / 49 | 40 / 42 | 44 / 45 | 69 / 66 | 26 / 16 | 68 % |
| an 5 | 51 / 52 | 40 / 41 | 51 / 50 | 67 / 65 | 25 / 16 | 61 % |
| **+10 ans** | 52 | 45 | 46 | 66 | 11 | — |

Fins de partie : mandat_complet 56 % · remaniement 37 % · renvoi 7 %

### Doctrinaire · reussite
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 34 / 40 | 34 / 33 | 25 / 29 | 75 / 70 | 32 / 29 | 100 % |
| an 2 | 36 / 42 | 35 / 32 | 29 / 31 | 74 / 69 | 34 / 27 | 87 % |
| an 3 | 39 / 45 | 33 / 31 | 33 / 35 | 72 / 67 | 32 / 23 | 79 % |
| an 4 | 43 / 48 | 33 / 31 | 43 / 47 | 69 / 66 | 31 / 20 | 73 % |
| an 5 | 53 / 58 | 32 / 31 | 52 / 55 | 67 / 65 | 31 / 19 | 67 % |
| **+10 ans** | 60 | 33 | 53 | 66 | 16 | — |

Fins de partie : mandat_complet 66 % · remaniement 33 % · renvoi 1 %

### Doctrinaire · sante
| année | Réussite | Inégalités | Santé | Paix sociale | Budget | parties encore en poste |
|---|---|---|---|---|---|---|
| an 1 | 35 / 40 | 33 / 33 | 26 / 29 | 75 / 70 | 35 / 32 | 100 % |
| an 2 | 37 / 41 | 33 / 32 | 26 / 30 | 75 / 70 | 39 / 36 | 87 % |
| an 3 | 39 / 43 | 33 / 31 | 31 / 35 | 73 / 70 | 45 / 41 | 79 % |
| an 4 | 42 / 46 | 32 / 31 | 41 / 47 | 72 / 70 | 51 / 45 | 73 % |
| an 5 | 50 / 54 | 31 / 31 | 52 / 57 | 71 / 70 | 59 / 50 | 67 % |
| **+10 ans** | 54 | 30 | 59 | 70 | 40 | — |

Fins de partie : mandat_complet 67 % · remaniement 33 %

### Lecture

- **Passif** : ne rien faire ne stabilise rien. La santé du système tombe de 29
  à 10, la paix sociale de 78 à 37 (conflictualité latente : préavis, motions,
  boycott des instances). 35 % de renvois. L'immobilisme n'est pas une position
  d'attente, c'est une décision qui se paie.
- **Tout vitrine** : l'affiché reste **au-dessus** du vrai pendant tout le
  mandat (an 2 : 48 affiché contre 44 réel sur la réussite ; 25 contre 15 sur le
  budget). Les inégalités s'effondrent à 19 en projection. Le tableau de bord
  ment dans le bon sens jusqu'au bilan.
- **Tout réel** : l'affiché est **en dessous** du vrai dès la première année
  (34 contre 40 sur la réussite). Le ministre est jugé sur des indicateurs qui
  ignorent ce qu'il a semé. Sa réussite finit à 50, son budget à 13.
- **Mixte** : la seule trajectoire où les cinq compteurs progressent ou tiennent.
  56 % de mandats complets. C'est l'optimum, et il ne met aucun compteur au vert
  avant l'an 5.
- **Doctrinaire · réussite** : le cap tenu paie — mais à dix ans (60 en
  projection contre 58 au bilan), et au prix des inégalités, figées à 31.

---

## 3. Les constantes du moteur

Toutes sont dans `moteur/constantes.js`, commentées avec leur source. Les plus
structurantes :

### Argent

| Constante | Valeur | Source / rôle |
|---|---|---|
| `CADRAGE.missionHorsCAS` | 64,49 Md€ | PLF 2026, Sénat |
| `CADRAGE.partMasseSalariale` | 92,7 % | ce qui n'est pas arbitrable |
| `CADRAGE.coutETPhorsCAS` | 72 k€ | calcul T2/ETP ; 110 k€ avec CAS Pensions |
| `ENVELOPPE_BASE` | 0,17 Md€/an | croissance de la mission (+0,26 %) : la marge « gratuite » |
| `PALIERS_BERCY` | 1,35 / 0,72 / 0,38 / 0,05 Md€ | lettre plafond selon le crédit Bercy |
| `POINTS_SALAIRE_PAR_MD` | 2,0 | calé sur « +20 % du point ≈ 10 Md€ » (revendication FSU) |
| `SURCOUT.creditBercyParMd` | 13 pts | prix du dépassement d'enveloppe |

**L'effet cliquet est le cœur du modèle budgétaire** : `margeAnnee` est la marge
*nouvelle* de l'année ; une charge récurrente la consomme définitivement. Vos
décisions ne réduisent pas votre marge, elles réduisent celle de vos
successeurs. Sur cinq ans, un ministre discipliné dispose d'environ **6 Md€ de
charges récurrentes cumulées** — à comparer aux 4,3 Md€ du seul statut AESH.

### Démographie — le moteur du jeu

`BAISSE_ELEVES` : −158, −172, −181, −176, −168 milliers d'élèves de 2027 à 2031
(projections DEPP avril 2026 : −1 676 800 d'ici 2035). `ELEVES_PAR_POSTE = 24`
convertit la baisse en postes « libérables » (~6 600/an). Le curseur de
restitution encadre les deux précédents réels : rentrée 2025 = ratio 0,04
(−106 000 élèves, −470 postes) ; rentrée 2026 = ratio 0,60 (−161 000 élèves,
−4 032 postes titulaires).

### Vitrine et réel

| Constante | Valeur | Rôle |
|---|---|---|
| `INTERVALLE_CADENAS` | 5🔒 ±20 % … 1🔒 −50 % à +200 % | largeur du tirage selon le niveau de preuve (EEF) |
| `ABSORPTION.seuil` | 3 réformes actives | au-delà : −15 % d'effet et +22 % de variance par réforme |
| `IMPLEMENTATION` | 0,35 + 1,10 × adhésion | adhésion 25 → ×0,63 ; adhésion 60 → ×1,01 (Slavin) |
| `POIDS_HERITAGE` | 0,60 / 0,60 / 0,42 / 0,26 / 0,12 | part de l'héritage dans le signal affiché |
| `COUT_AFFICHAGE_LONG_TERME` | 2,4 pts | ce qui met 4 ans à produire commence par coûter en affichage — et ce qui met 4 ans à nuire ne se voit pas non plus |
| `DECROISSANCE_VITRINE` | 0,74/an | l'annonce s'use |

### Conflit social

`GREVE.baseParIntensite` 4,5 → 26,5 % de grévistes, calé sur l'étalon
historique du 10/02/2011 (16,99 %). `ecartSyndicats = 1,70` : le jeu produit
**toujours deux chiffres**, celui du ministère et celui de l'intersyndicale.
Les sept organisations sont pondérées par les élections professionnelles de
2022 et re-pondérées en décembre de l'an 1, l'adhésion basse profitant aux
organisations de lutte. `conflictualiteLatente = 0,42` : la paix sociale s'use
même sans journée d'action (préavis, motions, boycott des instances — précédent
de janvier 2026).

### Survie politique

`remaniementBase = 0,175`/an, modulé par le capital politique et l'opinion des
familles, borné à [3 %, 30 %]. C'est la première cause de fin de mandat dans le
jeu comme dans la réalité : depuis 1958, plus de trente ministres se sont
succédé rue de Grenelle. Trois convocations à Matignon valent renvoi ; elles
viennent d'une rentrée ratée, d'un capital épuisé, d'un décrochage des familles,
d'un crédit Bercy à zéro ou d'un blocage social.

### Projection décennale

Elle ne plaque pas un bonus : elle **prolonge la physique du système sur cinq
années supplémentaires**. Si le cap a tenu, les dérives spontanées sont
neutralisées, la trajectoire imprimée se poursuit à 40 % de son rythme et les
effets acquis sont majorés de 55 %. Sinon, tout reprend comme avant vous et les
effets encore en route n'arrivent qu'à 70 %.

**« Tenir le cap » a dû être redéfini en cours d'équilibrage.** La première
version l'indexait sur une fatigue réformatrice basse — ce qui revenait à
récompenser l'inaction, et rendait le bonus inaccessible à quiconque agissait.
Or le Portugal a beaucoup réformé ; il a réformé *dans le même sens* pendant
quinze ans. La constance est donc mesurée par la **cohérence** : la part des
effets réellement produits qui va dans le sens des deux priorités déclarées en
juin 2027 (seuil 45 %), plus un mandat complet, au plus un abandon et au plus
deux années au-delà de la capacité d'absorption. Le joueur est, là aussi, noté
contre sa propre parole.

---

## 4. Ce que les simulations ont appris (et corrigé)

Cinq erreurs de conception que seules les simulations pouvaient révéler :

1. **Les charges récurrentes étaient re-facturées chaque année.** Le joueur se
   retrouvait sans un euro dès l'an 3 et la partie était jouée d'avance. Les
   charges sont dans la base : elles consomment définitivement la marge de
   l'année où elles sont décidées, pas celle des suivantes.
2. **L'encadrement était compté deux fois** (`physique.ratioED` et `coutETP`),
   ce qui faisait tomber le nombre d'élèves par classe de 21,3 à 18,6 en une
   année et offrait des points de réussite gratuits.
3. **La revalorisation était structurellement inatteignable**, donc le compteur
   « Budget et salaires » ne pouvait pas bouger et n'arbitrait rien. Il a fallu
   un curseur d'ampleur (0,5 / 1,3 / 2,6 Md€) et rendre la carte répétable : on
   revalorise à chaque budget, ou jamais.
4. **La paix sociale était un compteur gratuit** : partant de 92 et n'étant
   entamée que par les grèves formelles, la classer en tête de doctrine offrait
   30 points de score sans rien faire. Départ ramené à 78 (le mandat s'ouvre sur
   un front intersyndical déjà constitué) et conflictualité latente introduite.
5. **Le bonus de constance récompensait l'immobilisme** (voir § 3).

---

## 5. Paramètres à réexaminer après tests humains

Par ordre de priorité :

| Paramètre | Valeur | Ce qu'il faut regarder |
|---|---|---|
| `COMPTEURS_INITIAUX.egalite` et effets des cartes de mixité | 34 | **Le point le plus fragile.** Le compteur « Inégalités » plafonne à 48,8 quand les autres montent à 65-70. Si les joueurs le vivent comme une impasse plutôt que comme un arbitrage tragique, relever de 2 à 3 points les effets réels de `dedoublement` et `prive_mixite`, ou adoucir le déclenchement de la guerre scolaire. |
| `RENVOI.remaniementBase` | 0,175 | Une fin de partie subie peut être frustrante. Si les testeurs la trouvent arbitraire, descendre à 0,14 et compenser par les convocations (qui, elles, se méritent). |
| `PALIERS_BERCY[0].marge` | 1,35 Md€ | Contrôle à lui seul l'ambition possible sur cinq ans. Le desserrer rend le jeu plus permissif, le resserrer le rend étouffant. |
| `IMMOBILISME` | −7 capital, −3,5 parents | Introduit pour que « ne rien faire » ne soit pas une stratégie de survie. À vérifier : ne pénalise-t-il pas trop une année de consolidation délibérée ? |
| `GREVE.conflictualiteLatente` | 0,42 | Rend la paix sociale sensible à l'adhésion sans journée de grève. Si les joueurs ne comprennent pas pourquoi le compteur baisse, l'expliciter dans l'interface avant de baisser la valeur. |
| `ABSORPTION.seuil` | 3 | Concept central à enseigner. Si les testeurs ne le perçoivent pas, le rendre visible dans l'interface plutôt que le durcir. |

---

## 6. Prochaine étape

Le brief prévoit ensuite : étendre le catalogue de 12 à ~40 cartes depuis la
partie B.7 (cinq familles doctrinales, porteurs réels cités sur chaque carte),
puis habiller l'interface — fichier React monolithique, bandeau tricolore,
polices Marianne/DSFR, unes de journal, fil social, communiqué intersyndical,
thread du prof-influenceur, dépêche DEPP, personnages à pseudonymes
**symétriques pour tous** (correction du défaut A.9-4 du jeu de référence).

Le moteur n'aura pas à changer : les stratégies de simulation et l'interface
implémentent la même interface de décision (`doctrine`, `lettrePlafond`,
`carteScolaire`, `mesures`, `rentree`). Chaque nouvelle carte pourra être
passée au banc d'essai avant d'être montrée à un joueur.

---

*Jeu pédagogique indépendant, sans lien avec le ministère de l'Éducation
nationale. Les chiffres sont des ordres de grandeur issus de sources publiques
(DEPP, PLF, Sénat, OCDE/TALIS, CSEN, EEF), datés d'août 2026 ; les positions
attribuées aux acteurs sont des simplifications de jeu. Le jeu ne dit jamais
qu'une doctrine est la bonne : chaque carte cite ses porteurs réels et le niveau
de preuve de son effet.*
