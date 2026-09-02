# Rue de Grenelle — demandes d'illustrations

Brief à remettre tel quel à Claude Design (ou à un illustrateur). Une page par
demande, dans l'ordre d'importance. Les pictogrammes d'en-tête existent déjà en
SVG au trait ; ce qui manque, ce sont des **scènes**.

## Ligne graphique commune

- Registre : « papier administratif et presse ». Pas de mascotte, pas de
  personnage caricaturé, pas de visage reconnaissable. La satire du jeu est
  symétrique : les illustrations ne doivent viser personne.
- Trait : dessin au trait, une seule couleur, épaisseur constante (1,5 px à
  24 px de haut, 2 px au-delà), bouts arrondis. Pas de dégradé, pas d'ombre
  portée, pas de remplissage sauf un aplat léger optionnel.
- Couleur : encre bleu République `#000091` sur fond clair, `#8585f6` sur fond
  sombre. Chaque fichier doit fonctionner sur les deux fonds (trait en
  `currentColor`, sans couleur codée en dur).
- Format : **SVG**, `viewBox` propre, sans police embarquée, sans image
  bitmap, poids visé < 8 Ko. Exports PNG inutiles.
- Tailles : bandeau large 280 × 120 (en-tête d'écran), vignette 120 × 120
  (dans le corps), pictogramme 24 × 24 (déjà faits, ne pas refaire).
- Ton : sobre, un détail discrètement drôle par scène autorisé (une plante
  morte, une pile qui penche, une photocopieuse en panne). Jamais de blague
  dans le trait sur les élèves ou les enseignants.

## Les demandes, par ordre d'importance

### 1. L'accueil : la façade — 280 × 120 (existe en version simple, à refaire mieux)
Façade du 110 rue de Grenelle : le porche, l'hôtel particulier derrière, le
drapeau. Vu de la rue, légèrement en contre-plongée. C'est la seule image que
tout le monde verra.

### 2. Le bilan : le déménagement — 280 × 120
Un bureau ministériel vidé : cartons fermés, un fauteuil, un cadre décroché
laissant une trace claire sur le mur, un téléphone débranché. Sans personnage.
Sert à l'écran final, toutes fins confondues.

### 3. L'atelier de mesures : le bureau — 280 × 120
Un grand bureau avec des dossiers alignés, un parapheur ouvert, un stylo, une
tasse. Éventuellement un dossier estampillé « nouveau ». C'est l'écran le plus
fréquent du jeu (cinq fois par partie).

### 4. La lettre plafond : l'enveloppe de Bercy — 120 × 120
Une enveloppe épaisse, cachet « Ministère des comptes publics », un coin
relevé. Le détail drôle possible : un trombone qui tient une seconde feuille
plus épaisse que la première.

### 5. La carte scolaire : la carte — 120 × 120
Une carte de France simplifiée, sans région identifiable, avec des points
d'école dont certains sont barrés au crayon et d'autres entourés. Un compas ou
une règle posée dessus.

### 6. L'audience syndicale : la table — 280 × 120
Une table de réunion vue de haut, deux rangées de chaises face à face, des
parapheurs et des bouteilles d'eau. Un côté a plus de chaises que l'autre.
Sans personnage.

### 7. La rentrée : la cour — 280 × 120
Une cour d'école vide, tôt le matin : le préau, un panier de basket, des
marelles au sol, une porte ouverte. L'heure sur une horloge : 8 h 07.

### 8. Le plateau de 20 heures : le studio — 120 × 120
Un pupitre de plateau télé, deux micros, un projecteur, un moniteur de retour
qui affiche un compte à rebours. Sans visage.

### 9. L'affaire : la une — 120 × 120
Un journal plié dont on ne lit pas le titre, un téléphone portable posé dessus
avec beaucoup de notifications. Doit rester neutre : la même image sert à
toutes les affaires.

### 10. La livraison PISA : la mallette — 120 × 120
Une mallette de rapport ouverte, des feuilles de tableaux, un logo générique
d'organisation internationale (pas celui de l'OCDE). Un tampon « 11 h 00 ».

### 11. L'été des cent jours : le ventilateur — 120 × 120
Un bureau en juillet : un ventilateur, des stores baissés, un dossier « urgent »
sous un presse-papier. Le détail drôle : une plante qui fait la tête.

### 12. La note de la DGESCO : le dossier à sangle — 120 × 120
Un dossier cartonné à sangle, une étiquette manuscrite, un post-it. Pour les
notes budgétaire et démographique.

### 13. La revanche : les deux chemins — 120 × 120
Deux flèches partant du même point et divergeant ; ou un embranchement de
routes vu de haut. Illustre « même partie, deux doctrines ».

### 14. Les fins de partie (série de quatre) — 120 × 120 chacune
- Mandat complet : la porte du ministère, ouverte sur la rue, en pleine lumière.
- Remaniement : un fauteuil vide et un carton ouvert, à peine entamé.
- Renvoi : trois convocations empilées, la troisième dépasse.
- Guerre scolaire : une rue vue de haut, remplie de points (la foule), sans
  détail.

## Ce qu'il ne faut pas faire

- Pas de personnage identifiable ni de silhouette qui puisse ressembler à un
  ministre réel.
- Pas de logo réel (ministère, syndicat, journal, OCDE) : le jeu n'en utilise
  aucun, tout est pseudonymisé.
- Pas de texte dans l'image, sauf un chiffre ou une heure (8 h 07, 11 h 00) :
  le jeu est traduisible et le texte doit rester dans le code.
- Pas d'illustration « inspirante » ou « corporate » : des objets, des lieux,
  des papiers.

## Où ça s'intègre

Chaque SVG est collé en ligne dans `interface/app.js` (pas de fichier externe :
le jeu tient en un seul fichier HTML). Un bandeau 280 × 120 se place sous
l'en-tête du document, une vignette 120 × 120 flotte à droite du chapô. La
classe CSS `.illustration` existe déjà et gère les deux thèmes.
