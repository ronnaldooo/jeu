# Thème « Le téléphone du ministre » — test réversible

Second habillage du jeu, appliqué **par-dessus** l'interface existante, à partir
de la charte livrée dans `design/telephone/` (README-charte.md et les deux
maquettes). Le moteur, les mesures, les textes et les sources ne sont pas
touchés : les deux thèmes jouent exactement la même partie.

## L'interrupteur

C'est le fichier qu'on ouvre.

| Thème | Jouable | Artefact |
|---|---|---|
| classique | `index.html` | `artefact.html` |
| téléphone | `index-telephone.html` | `artefact-telephone.html` |

Les quatre sont produits par `node outil/construire.js`. Le thème téléphone,
c'est `interface/telephone.css` (la charte) et `interface/telephone.js` (la
coque et les gestes), ajoutés après `app.js` dans l'assemblage. Aucun
`if (theme)` dans le jeu.

## Retour arrière

Le tag `pre-theme-telephone` marque l'état d'avant. La branche
`claude/jeu-theme-telephone` porte le test ; la branche principale reste intacte.
Pour abandonner : ne pas fusionner. Pour garder : fusionner, les deux fichiers
coexistent.

## Pas de coque : le texte prend la largeur

Premier essai : le jeu était enfermé dans une maquette de téléphone de 390 px
au milieu de l'écran. C'était fidèle à la charte et mauvais à l'usage — la
boîte mangeait l'écran alors que le texte est le contenu. La coque a sauté ;
le langage visuel est resté.

La charpente tient en trois pièces :

- une **barre haute collante** (fond sombre translucide, flou) : le mois en
  grand, l'année scolaire, la progression du mandat en cinq segments, et les
  quatre curseurs alignés à droite ;
- une **colonne de lecture** de 640 px pour les fiches, qui s'élargit à
  1 040 px pour ce qui le mérite — la pile de notifications (deux colonnes
  au-delà de 820 px), le solde, le bilan de l'année ;
- une **barre basse collante** : le contexte, l'action principale, la note.

Sur un téléphone tout s'empile ; sur un écran de bureau on lit une colonne
confortable au lieu d'une vignette.

## Comment la charpente lit le jeu

`telephone.js` ne calcule rien. Il cache le bandeau et le calendrier classiques
et les **lit** (observateurs de mutations) pour remplir :

- la barre haute — le mois, l'année scolaire, et la progression du mandat en
  cinq segments (passé plein, année en cours en clair, avenir en creux) ;
- l'écran d'ouverture — le mois en très grand, avant la première décision ;
- « Vos curseurs » — les trois compteurs de la doctrine, avec leur jauge, plus
  le capital politique en quatrième colonne. Le chiffre s'anime sur 600 ms, un
  delta ▲/▼ s'affiche 1,2 s, le chiffre pulse et passe en rouge sous le seuil ;
- l'alerte du cabinet — une notification « sourde » en tête de contenu.

## Les quatre variantes de notification

C'est ce que la charte a de plus frappant, et ce que le premier essai avait
laissé de côté. Chaque fiche prend la couleur de qui écrit :

| Expéditeur | Variante | Écrans |
|---|---|---|
| Matignon, l'Élysée | **rouge** | l'appel, l'entretien préalable, le remaniement, le renvoi |
| Bercy, la carte scolaire | **bleu** | la lettre plafond, le bordereau DHG |
| la presse, les syndicats | **sourde** | polémiques, plateau, affaires, audiences, retraits |
| les dossiers à trancher | **papier** | tout le reste |

Les fiches qui portent un graphique restent sur le papier : une courbe sur
fond rouge ne se lit pas. Dans chaque variante colorée, les jetons de la
feuille classique sont renvoyés en clair, et l'auditeur de contraste vérifie
qu'aucun texte n'y tombe sous 4,5:1.

## Ce qui a été modernisé

- **Profondeur.** La charte empilait deux marches dures de 8 px. Remplacées par
  deux liserés fins plus une ombre diffuse, et un liseré clair en haut de
  chaque carte.
- **Fond.** Un dégradé radial chaud plutôt qu'un aplat noir.
- **Barres translucides** avec flou d'arrière-plan.
- **Progression du mandat** en cinq segments plutôt qu'« An 1 / 5 ».
- **Retour au toucher** : chaque élément cliquable se creuse de 2 % à l'appui.
- **Entrée en vague** : les fiches et les notifications arrivent décalées de
  55 à 60 ms, comme un lot de notifications.
- **Rayons et boutons** en capsule dans les barres, coins à 18–20 px ailleurs.

Tout cela s'annule sous `prefers-reduced-motion`.

Chaque document du jeu devient une **fiche papier** (rayon 18, pile d'ombres).
Les cartes de l'atelier sortent du papier et deviennent des **notifications**
sur le noir : balayage à droite = signer (Retenir), à gauche = classer (la
carte disparaît du menu ; sur une carte signée, à gauche = retirer). Le seuil
est 35 % de la largeur ou une vélocité > 0,5 px/ms ; au clavier, flèches
droite et gauche sur la carte focalisée ; un clic simple ouvre toujours la
carte. Sur une fiche à deux choix, le balayage de la fiche choisit gauche ou
droite. Le bouton « Demander une note » ouvre « Comprendre le jeu ».

## La note à la DGESCO

Le bouton du pied de page dit « Demander une note à la DGESCO ». Il ouvre un
panneau en deux temps, à l'intérieur du téléphone :

1. **Sur quel sujet ?** — les onze thèmes de référence du jeu, chacun en fiche
   papier avec son résumé.
2. **La note** — le thème choisi, déplié : ses chiffres, leurs sources
   cliquables, et « ce qu'il faut en retenir ».

Un bouton « ← Choisir un autre sujet » revient à la liste, « Fermer » et la
touche Échap ferment le panneau et rendent le focus au bouton. C'est le vrai
fonctionnement d'un cabinet : on ne lit pas la documentation, on la demande.
La liste se termine par la seule ligne d'humour de l'écran — « Elles sont
sourcées, elles sont exactes, et personne ne les lit jamais. »

Le contenu vient de `REPERES` et de `blocReperes()` : rien n'est dupliqué, la
note du thème téléphone et l'onglet « Comprendre le jeu » du thème classique
disent exactement la même chose.

## La passe de lisibilité

La charte descendait à 8,5 px de corps et à 35 % d'opacité sur le noir. Mesuré,
cela donnait du texte sous 4,5:1 et sous le plancher de taille. Un auditeur
automatique parcourt une partie entière et relève, pour chaque nœud de texte,
sa taille et son contraste réel (fonds semi-transparents composités jusqu'à la
racine). Il est passé de **39 problèmes distincts à 0**.

Ce qui a changé :

- **Opacités.** `.45 → .60`, `.35 → .52`, `.55 → .70`, `.70 → .82`. Les gris du
  papier assombris (`#8A8579 → #5F5A52`).
- **Tailles.** Plus rien sous 11 px : les libellés mono passent de 8,5–9,5 px à
  10,5–11,5 px, le corps de 15 à 16 px, les options de 13 à 14,5 px.
- **Couleurs de compteurs.** Les teintes de la charte tombaient à 2,2:1 sur le
  crème ; elles sont assombries pour le papier et gardent leurs variantes
  claires sur le noir.
- **Un bogue de fond.** Sur plusieurs écrans les blocs de choix sont construits
  *dans* la fiche : texte clair sur papier crème, donc invisibles. Ils sortent
  désormais sur le noir (c'est aussi la charte) ; les questions d'entretien et
  de plateau, elles, restent dans le papier et prennent une variante « papier »
  à encre sombre.
- **Le renvoi de jetons.** Plutôt que de réécrire chaque composant hérité posé
  sur le noir, les variables de la feuille classique (`--encre`, `--ok`,
  `--alerte`, `--filet`…) sont redéfinies à l'intérieur de ces conteneurs.
- **L'action principale** de l'atelier rejoint la barre du bas, au lieu de
  flotter au-dessus du solde et de le masquer.
- **L'observateur** regarde désormais les descendants : le plateau de 20 heures
  ajoute ses questions une par une dans un bloc existant, et elles n'étaient
  pas habillées.

## Écarts assumés avec la charte

1. **Deux blocs de choix neutres.** La charte veut gauche rouge = refus,
   droite bleue = signer. Ici le sens des deux options varie (« Accepter le
   cadrage » est à gauche) : les deux blocs sont neutres, la direction reste
   indiquée, le bleu marque le choix fait. Trois choix ou plus : une pile.
2. **« Laisser sonner »** n'existe pas : le jeu n'a pas de mécanique de report.
3. **Les illustrations** sont masquées (la charte n'a ni image ni icône).
4. **Les polices** viennent de Google Fonts, avec repli Georgia / monospace,
   parce que le jeu tient en un seul fichier.
5. **Les curseurs** sont ceux du jeu (réussite, inégalités, santé, capital),
   pas ceux de la maquette (opinion, niveau, inégalités, budget).
6. **Les tailles et les opacités** de la charte ont été relevées : mesurées,
   elles ne passaient ni le contraste ni le plancher de taille. Les proportions
   et le vocabulaire graphique sont conservés.

## Recette

- [x] Les deux thèmes coexistent, l'interrupteur est le fichier ouvert
- [x] `git switch` sur la branche principale restaure l'ancienne interface
- [x] Une partie complète se joue de bout en bout dans le nouveau thème (robot, 390 × 844 et 1200 × 900)
- [x] Scores finaux identiques : le journal de décisions d'une partie classique
      est rejoué tel quel dans le thème téléphone (mécanisme de sauvegarde du
      jeu), et le bilan est identique au chiffre près, sur plusieurs graines
- [x] Balayage à la souris (et au doigt : mêmes événements pointer), flèches au clavier, clic simple préservé
- [x] Fiches jamais coupées : le papier suit la hauteur du texte, la pile d'ombres aussi
- [x] `prefers-reduced-motion` : plus de rotation ni de ressort, fondu de 120 ms
- [x] Contraste et taille : 0 problème sur une partie complète (auditeur automatique)
- [x] Note à la DGESCO : onze sujets, retour à la liste, Échap, focus rendu
- [x] Aucune icône ajoutée ; deux familles de polices
