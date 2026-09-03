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

## Comment la coque lit le jeu

`telephone.js` ne calcule rien. Il cache le bandeau et le calendrier classiques
et les **lit** (observateurs de mutations) pour remplir :

- la barre d'état — la date du jeu, et une « batterie » qui descend avec les années ;
- l'horloge — le mois en grand, « An n / 5 · 2027‑28 » au-dessus, l'étape et le
  temps restant en italique dessous (en rouge la dernière année) ;
- le widget « Vos curseurs » — les trois compteurs de la doctrine, avec leur
  jauge, plus le capital politique en quatrième colonne (sans jauge, comme le
  « Budget » de la charte). Le chiffre s'anime sur 600 ms, un delta ▲/▼
  s'affiche 1,2 s, le chiffre pulse et passe en rouge sous le seuil ;
- l'alerte du cabinet — une notification « sourde » sous le widget.

Chaque document du jeu devient une **fiche papier** (rayon 18, pile d'ombres).
Les cartes de l'atelier sortent du papier et deviennent des **notifications**
sur le noir : balayage à droite = signer (Retenir), à gauche = classer (la
carte disparaît du menu ; sur une carte signée, à gauche = retirer). Le seuil
est 35 % de la largeur ou une vélocité > 0,5 px/ms ; au clavier, flèches
droite et gauche sur la carte focalisée ; un clic simple ouvre toujours la
carte. Sur une fiche à deux choix, le balayage de la fiche choisit gauche ou
droite. Le bouton « Demander une note » ouvre « Comprendre le jeu ».

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

## Recette

- [x] Les deux thèmes coexistent, l'interrupteur est le fichier ouvert
- [x] `git switch` sur la branche principale restaure l'ancienne interface
- [x] Une partie complète se joue de bout en bout dans le nouveau thème (robot, 390 × 844 et 1200 × 900)
- [x] Scores finaux identiques entre les deux thèmes pour une même graine et une même suite de choix
- [x] Balayage à la souris (et au doigt : mêmes événements pointer), flèches au clavier, clic simple préservé
- [x] Fiches jamais coupées : le papier suit la hauteur du texte, la pile d'ombres aussi
- [x] `prefers-reduced-motion` : plus de rotation ni de ressort, fondu de 120 ms
- [x] Aucune icône ajoutée ; deux familles de polices
