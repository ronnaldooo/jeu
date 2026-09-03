# Handoff : « Le téléphone du ministre » — nouvelle charte graphique

## Vue d'ensemble

Le jeu existe déjà et fonctionne. Ce dossier ne demande **aucune nouvelle fonctionnalité** : il décrit une **refonte visuelle complète** de l'interface, à appliquer par-dessus la logique de jeu existante.

Le principe de la charte : le joueur ne manipule pas une application de gestion, il tient **le téléphone personnel du ministre**. L'écran principal est un écran verrouillé noir sur lequel tombent des notifications. Chaque notification est un dossier à trancher. On la balaie à gauche (classer sans suite) ou à droite (signer). Les fiches de dossier apparaissent en **papier crème posé sur le noir** — le vocabulaire administratif reste, mais il arrive par le canal le plus intime possible.

C'est un **test réversible** : voir la section « Stratégie de bascule et retour arrière » plus bas. Rien ne doit être supprimé de l'existant tant que le test n'est pas validé.

---

## À propos des fichiers de ce dossier

Les fichiers HTML livrés ici sont des **références de design**, pas du code de production à copier. Ce sont des prototypes qui montrent l'apparence et le comportement attendus.

Le travail consiste à **recréer ces écrans dans l'environnement existant du jeu** (React, Vue, Svelte, React Native, SwiftUI, moteur maison — quel qu'il soit), avec ses composants, ses conventions et sa gestion d'état actuelles. Ne pas importer le HTML tel quel, ne pas introduire une nouvelle stack pour cette refonte.

Le fichier `Telephone du ministre.dc.html` s'ouvre directement dans un navigateur (il charge `support.js`, fourni à côté). Ouvrez-le en premier : il contient les deux écrans à taille réelle (390 × 844) et un panneau « kit » avec les couleurs, la typographie et les règles.

## Fidélité

**Haute fidélité (hi-fi).** Les couleurs, les tailles de police, les rayons, les ombres et les espacements ci-dessous sont définitifs et doivent être reproduits au pixel près. Les textes cités sont ceux à utiliser (ils sont écrits dans le ton du jeu : satire administrative pince-sans-rire).

---

## Stratégie de bascule et retour arrière

C'est un test. Il doit être annulable en une commande.

1. **Branche dédiée**
   ```bash
   git switch -c theme/telephone-du-ministre
   git tag pre-theme-telephone   # point de retour explicite
   ```
   Retour arrière : `git switch main` (la branche de test reste intacte), ou `git reset --hard pre-theme-telephone` si la bascule a été faite sur la branche principale.

2. **Ne rien supprimer, tout dupliquer.** Les composants d'interface actuels restent en place. Les nouveaux vivent à côté, dans un dossier séparé :
   ```
   src/ui/          <- existant, inchangé
   src/ui-phone/    <- nouveaux composants de cette charte
   ```

3. **Un seul interrupteur.** Une constante ou une variable d'environnement décide quelle famille de composants est montée :
   ```
   THEME = "classic" | "phone"     (défaut : "classic")
   ```
   Lue une seule fois, au plus haut niveau de l'arbre (racine de l'app / point d'entrée), et propagée. Aucune condition `if (theme === …)` dispersée dans la logique de jeu.

4. **Frontière étanche.** La logique de jeu (état, effets des choix, tirage des dossiers, conditions de fin) **ne doit pas être modifiée**. Si un écran de la nouvelle charte a besoin d'une donnée que la logique ne fournit pas encore, exposez-la par un sélecteur / getter en lecture seule, sans toucher au calcul.

5. **Critère de validation du test** : les deux thèmes doivent pouvoir enchaîner une partie complète (8 semaines, 6 dossiers par semaine, jusqu'au remaniement) sans divergence de score.

---

## Écrans

### Écran 1 — Écran verrouillé (écran principal du jeu)

**Rôle** : c'est le hub. Le joueur y voit l'heure de la partie, l'état de ses curseurs, et la pile des dossiers du jour sous forme de notifications. Il balaie une notification pour la traiter, ou l'ouvre pour lire la fiche complète (écran 2).

**Structure verticale** (colonne flex, hauteur totale 844, fond `#14120E`) :

| Bloc | Hauteur | Détail |
|---|---|---|
| Barre d'état | 44 px fixe | padding latéral 28. Heure à gauche, indicateurs réseau/batterie à droite. Mono 12 px, `rgba(244,241,234,.7)` |
| En-tête horloge | auto | padding `16px 24px 18px`, centré |
| Widget curseurs | auto | marge latérale 20 px |
| Pile de notifications | `flex:1`, `overflow:hidden` | padding `16px 20px 0`, gouttière 10 px |
| Barre de saisie | auto | padding `14px 0 26px`, trait 120 × 5, rayon 3, `rgba(244,241,234,.35)` |

**En-tête horloge**
- Ligne 1 — mono 11 px, interlettrage `.2em`, majuscules, `rgba(244,241,234,.5)` : `Mardi · Semaine 3 / 8`
- Ligne 2 — Spectral **300**, 64 px, interligne 1.05, `#F4F1EA` : `6:58`
- Ligne 3 — Spectral 400 italique, 14 px, `rgba(244,241,234,.55)`, marge haute 2 px : `Camille Vasseur · 5 semaines avant remaniement`

**Widget curseurs**
- Conteneur : fond `rgba(244,241,234,.07)`, bordure 1 px `rgba(244,241,234,.14)`, rayon 16, padding `13px 15px`
- Titre : mono 9 px, `.18em`, majuscules, `rgba(244,241,234,.45)` : `Vos curseurs`
- Rangée flex, gouttière 14 px, marge haute 10 px, quatre colonnes : Opinion `flex:1`, Niveau `flex:1`, Inégalités `flex:1`, Budget `flex:1.2`
- Chaque colonne : chiffre mono 700 22 px interligne 1 → libellé mono 8,5 px `.1em` majuscules `rgba(244,241,234,.45)` marge haute 4 → jauge 3 px de haut, rayon 2, piste `rgba(244,241,234,.15)`, marge haute 6
- Couleurs de jauge : Opinion `#E8746A`, Niveau `#7FA3D8`, Inégalités `#E8746A`. Le chiffre passe en `#E8746A` quand la valeur est mauvaise (Inégalités > 60, Opinion < 45), sinon `#F4F1EA`
- Budget n'a pas de jauge : chiffre mono 700 18 px `#E8746A`, `padding-top:3px`, libellé marge haute 5

**En-tête de pile** — ligne flex, `space-between`, base commune :
- gauche : mono 9 px `.18em` majuscules `rgba(244,241,234,.45)` : `6 notifications`
- droite : mono 9,5 px `rgba(244,241,234,.35)` : `Glissez pour trancher`

**Notifications** — quatre variantes, jamais plus. Rayon 16 dans tous les cas, padding `13px 15px`.

1. **Papier (dossier à trancher)** — fond `#F4F1EA`, ombre de pile `0 8px 0 -4px #C9C2B0, 0 16px 0 -8px #A79F8D` (c'est ce qui signale qu'il reste des dossiers derrière).
   En-tête flex `space-between` : source en mono 9 px `.16em` majuscules `#C8102E` (`Direction générale · 6:12`) + numéro mono 9,5 px `#8A8579` (`01`).
   Titre Spectral 700 17 px interligne 1.2 `#14120E`, marge haute 6.
   Sous-titre Spectral 400 13,5 px `#77726A` interligne 1.35, marge haute 3.
2. **Bleue (institution : les Comptes, la Direction du budget)** — fond `#1B3A6B`. Source mono 9 px `rgba(244,241,234,.6)`, corps Spectral 16 px `#F4F1EA` interligne 1.3.
3. **Sourde (syndicat, bruit de fond)** — fond `rgba(244,241,234,.08)`, bordure 1 px `rgba(244,241,234,.16)`. Source `rgba(244,241,234,.45)`, corps `#F4F1EA`.
4. **Rouge (Matignon / Hôtel Malesherbes — jamais pour autre chose)** — fond `#C8102E`. Source `rgba(247,239,233,.75)`, corps `#F7EFE9`.

Textes de référence dans le prototype :
- `Dédoubler les CE1 en quartier prioritaire` / `Promis par vos trois prédécesseurs. Payé par aucun.`
- `« On a vu passer votre note. On l'a corrigée. »` — Les Comptes · 6:31
- `Quatrième demande d'audience. Le ton a changé.` — FUSE · 6:44
- `« Tu peux passer ce matin ? Ce n'est rien. »` — Hôtel Malesherbes · 7:04

---

### Écran 2 — Notification ouverte (la carte à trancher)

**Rôle** : le dossier en pleine page. Le joueur lit la fiche et tranche, par balayage ou par appui sur l'un des deux choix.

| Bloc | Détail |
|---|---|
| Barre d'état | identique à l'écran 1 |
| En-tête de progression | padding `4px 22px 12px`, trait bas 1 px `rgba(244,241,234,.12)`. Gauche : mono 11 px `rgba(244,241,234,.5)` `Notification 1 / 6`. Droite : 6 tirets 16 × 4, rayon 2, gouttière 4 — actif `#F4F1EA`, inactif `rgba(244,241,234,.22)` |
| Corps | `flex:1`, `overflow:hidden`, padding `20px 20px 0` |
| Pied | padding `14px 22px 30px`, trait haut 1 px `rgba(244,241,234,.12)` |

**Fiche papier**
- Fond `#F4F1EA`, rayon 18, padding `18px 18px 20px`, ombre de pile `0 8px 0 -4px #C9C2B0, 0 16px 0 -8px #A79F8D`
- ⚠️ La pile de cartes **doit** être faite par ces ombres empilées, pas par des éléments décoratifs positionnés en absolu : l'ombre suit automatiquement la hauteur réelle de la fiche, quel que soit le texte.
- Ligne d'en-tête flex, `space-between`, gouttière 12 :
  - gauche : mono 9,5 px `.18em` majuscules `#8A8579` — `Direction générale · fiche 014`
  - droite : tampon `URGENT` — mono 700 10 px `.14em`, `#C8102E`, bordure 2 px `#C8102E`, padding `4px 7px`, `transform: rotate(-7deg)`. Il est **dans le flux** (`flex:0 0 auto`), jamais positionné en absolu, sinon il chevauche le titre.
- Titre : Spectral 800, 28 px, interligne 1.1, interlettrage `-.015em`, `#14120E`, marge haute 12, `text-wrap: pretty`
- Corps : Spectral 400, 15 px, interligne 1.5, `#3E3A33`, marge haute 12
- Aparté : trait haut 1 px `#DED8C8`, padding haut 10, marge haute 13 — Spectral italique 13,5 px `#77726A` interligne 1.4

**Les deux choix** (rangée flex, gouttière 12, marge haute 26)
- Gauche « refus » : fond `rgba(244,241,234,.07)`, bordure 1 px `rgba(232,116,106,.5)`, rayon 15, padding `13px 14px`. Sur-titre mono 9,5 px `.16em` majuscules `#E8746A` `← Glisser`. Libellé Spectral 700 18 px `#F4F1EA`, marge haute 5.
- Droite « validation » : fond `#1B3A6B`, bordure 1 px `#2E5BA8`, mêmes rayon et padding, tout aligné à droite. Sur-titre `rgba(244,241,234,.65)` `Glisser →`. Libellé Spectral 700 18 px `#F4F1EA`.
- **Pastilles d'effet** (marge haute 10, gouttière 5, mono 10 px, rayon 20) : effet négatif → fond `#C8102E`, texte `#F7EFE9`, padding `3px 7px` ; effet positif → fond `#F4F1EA`, texte `#14120E` ; effet nul → transparent, bordure 1 px `rgba(244,241,234,.3)`, texte `rgba(244,241,234,.6)`, padding `3px 6px`.
- Les pastilles annoncent l'effet **avant** le choix. C'est un parti pris de game design : le joueur sait toujours ce qu'il paie.

**Échappatoire** — bloc marge haute 22, fond `rgba(244,241,234,.06)`, rayon 14, padding `12px 14px`, Spectral italique 14 px `rgba(244,241,234,.7)` : `Vous pouvez aussi laisser sonner. Le dossier partira au suivant.`

**Pied** — gauche : mono 10,5 px `rgba(244,241,234,.45)`, largeur max 18 caractères, `Aucune notification ne revient.` Droite : bouton bordé, mono 10,5 px `#F4F1EA`, bordure 1 px `rgba(244,241,234,.35)`, rayon 9, padding `9px 13px`, `DEMANDER UNE NOTE`.

---

## Interactions et comportement

**Balayage de notification (écran 1 et écran 2)**
- Suivi du doigt : la carte translate en X avec la position du doigt, plus une rotation `translateX(dx) rotate(dx / 20 deg)`, plafonnée à ±8°.
- Seuil de validation : **35 % de la largeur de la carte** ou une vélocité de sortie > 0,5 px/ms.
- En dessous du seuil, retour à zéro : ressort ou `cubic-bezier(.22,1,.36,1)` sur 260 ms.
- Au-dessus du seuil, sortie : translation jusqu'à ±120 % de la largeur en 220 ms, `ease-out`, opacité vers 0 sur les 80 dernières ms.
- Retour d'information pendant le glissement : à partir de 15 % de déplacement, le choix visé s'éclaire — bloc gauche bordure vers `#E8746A` pleine opacité, bloc droit fond vers `#2E5BA8`.
- Appuyer sur l'un des deux blocs de choix déclenche exactement la même animation que le balayage correspondant. Le clavier doit y accéder aussi (deux boutons focusables, `Enter`/`Espace`).

**Arrivée d'une notification**
- Entrée par le bas : `translateY(24px)` + opacité 0 → position finale, 280 ms, `cubic-bezier(.22,1,.36,1)`.
- Décalage de 60 ms entre deux notifications qui arrivent ensemble.
- Une notification rouge (Matignon) arrive **seule**, jamais dans un lot, et déclenche une vibration courte si la plateforme le permet.

**Mise à jour des curseurs**
- Après un choix : le chiffre s'anime de l'ancienne à la nouvelle valeur sur 600 ms (interpolation entière), la jauge suit sur la même durée.
- Un delta s'affiche brièvement à droite du chiffre (`▲2` / `▼6`), 1,2 s, puis disparaît en fondu.
- Passage d'un seuil (Opinion sous 45, Inégalités au-dessus de 60) : le chiffre bascule en `#E8746A` et pulse une fois.

**Navigation**
- Appui sur une notification papier → écran 2 (transition : la carte grandit depuis sa position, 300 ms).
- Balayage sur une notification depuis l'écran 1 → tranchée directement, sans passer par l'écran 2.
- Retour en arrière depuis l'écran 2 → glissement vers le bas.

**États à ne pas oublier**
- File vide : la pile disparaît, un texte italique centré la remplace (`La journée est finie. Demain sera pire.`) et un bouton `SEMAINE SUIVANTE` en style bouton bordé du pied.
- Chargement : squelettes aux dimensions exactes des cartes, fond `rgba(244,241,234,.06)`, pas de spinner.
- Dernière semaine : l'en-tête horloge passe la mention `5 semaines avant remaniement` en `#E8746A`.

**Accessibilité**
- Zones tactiles ≥ 44 px de haut : les deux blocs de choix et les notifications les respectent déjà.
- `prefers-reduced-motion` : supprimer rotation et ressort, garder un fondu de 120 ms.
- Contraste : le texte `rgba(244,241,234,.35)` du pied est décoratif — ne pas y mettre d'information nécessaire.

---

## État nécessaire

Aucun nouvel état de jeu. Les écrans consomment ce que la logique existante expose déjà :

- `minister.name`, `week`, `mandateWeeks`, `weeksBeforeReshuffle`
- `indicators` : `{ opinion, level, inequality, budget }` — les trois premiers sur 0–100, le budget en euros (affiché en milliards, une décimale, séparateur virgule)
- `queue` : liste ordonnée de dossiers `{ id, source, time, title, subtitle, body, aside, urgent, choices: [gauche, droite] }`
- `choice` : `{ label, effects: [{ indicator, delta, tone }] }` où `tone ∈ { negative, positive, neutral }` pilote la couleur de la pastille
- État local d'interface uniquement : `dragX`, `isOpen`, `pendingExit`, `deltaBadges`

Si la version actuelle n'a pas la notion de `source` (qui envoie la notification), c'est la seule donnée à ajouter — elle détermine la variante de couleur. Table de correspondance :

| `source` | variante |
|---|---|
| Direction générale, services, rapport | papier |
| Les Comptes, autres ministères | bleue |
| FUSE, UNIPE, syndicats, presse | sourde |
| Hôtel Malesherbes (Matignon) | rouge |

---

## Jetons de design

**Couleurs**
```
--ink            #14120E   fond d'écran, texte sur papier
--paper          #F4F1EA   fiches, notifications de dossier
--paper-shade-1  #C9C2B0   1re ombre de pile
--paper-shade-2  #A79F8D   2e ombre de pile
--official       #1B3A6B   institutions, choix « signer »
--official-line  #2E5BA8   bordure du choix « signer »
--alert          #C8102E   alerte sur papier, Matignon, effets négatifs
--alert-soft     #E8746A   alerte sur fond noir (contraste)
--positive       #7FA3D8   jauge en progrès
--on-alert       #F7EFE9   texte sur rouge
--ink-text-2     #3E3A33   corps de texte sur papier
--ink-text-3     #77726A   texte secondaire sur papier
--ink-text-4     #8A8579   libellés mono sur papier
--rule           #DED8C8   filets sur papier
```
Sur fond noir, pas de gris : uniquement `#F4F1EA` en opacité variable — `.7` texte courant, `.55` secondaire, `.45` libellés, `.35` décoratif, `.16 / .14 / .12` bordures, `.08 / .07 / .06` surfaces.

**Typographie** — deux familles, aucune autre.
```
Spectral       300 (horloge) · 400 · 400 italique · 700 · 800
JetBrains Mono 400 · 700
```
Échelle : 64 / 28 / 22 / 18 / 17 / 16 / 15 / 14 / 13,5 / 12 / 11 / 10,5 / 10 / 9,5 / 9 / 8,5.
Le mono est toujours en majuscules avec un interlettrage de `.1em` à `.2em`, jamais en corps de texte.

**Espacement** — 3 · 4 · 5 · 6 · 10 · 12 · 13 · 14 · 15 · 18 · 20 · 22 · 26 · 28 px.
Marge latérale d'écran : 20 px (contenu), 22 px (en-têtes et pied), 24 px (bloc horloge), 28 px (barre d'état).

**Rayons** — 16 notification · 18 fiche ouverte · 15 bloc de choix · 14 échappatoire · 9 bouton bordé · 20 pastille · 2 jauge · 36 écran · 46 coque.

**Ombres**
```
pile de fiches : 0 8px 0 -4px #C9C2B0, 0 16px 0 -8px #A79F8D
coque (maquette uniquement) : 0 34px 64px -24px rgba(5,7,10,.55)
```

---

## Ressources

Aucune image, aucune icône. La charte est entièrement typographique — c'est délibéré, et il ne faut pas ajouter d'icônes.

Polices : **Spectral** et **JetBrains Mono**, toutes deux sous licence SIL Open Font. Dans le prototype elles viennent de Google Fonts ; en production, les embarquer localement plutôt que de dépendre d'un CDN.

---

## Fichiers de ce dossier

| Fichier | Contenu |
|---|---|
| `Telephone du ministre.dc.html` | Les deux écrans à taille réelle + le kit (couleurs, typographie, règles). **À ouvrir en premier.** |
| `Ministre - Chartes graphiques.dc.html` | Le document d'exploration complet : les six directions étudiées. Utile pour comprendre d'où vient la charte retenue (elle y figure sous l'identifiant `2c`). Non nécessaire à l'implémentation. |
| `support.js` | Runtime nécessaire à l'ouverture des deux fichiers ci-dessus dans un navigateur. Ne pas l'intégrer au jeu. |

---

## Recette du test

- [ ] Les deux thèmes coexistent, `THEME` bascule sans rebuild de la logique
- [ ] `git switch main` restaure exactement l'ancienne interface
- [ ] Une partie complète (8 semaines) se joue de bout en bout dans le nouveau thème
- [ ] Les scores finaux sont identiques entre les deux thèmes pour une même suite de choix
- [ ] Le balayage fonctionne au doigt, à la souris et au clavier
- [ ] Aucune fiche n'est coupée quel que soit la longueur du texte (tester avec un titre de 80 caractères)
- [ ] `prefers-reduced-motion` respecté
- [ ] Aucune icône, aucune police tierce ajoutée
