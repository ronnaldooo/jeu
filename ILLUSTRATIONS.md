# Rue de Grenelle — demandes d'illustrations

Brief à remettre tel quel à Claude Design (ou à un illustrateur). Une page par
demande, dans l'ordre d'importance. Les pictogrammes d'en-tête existent déjà en
SVG au trait ; ce qui manque, ce sont des **scènes**.

## Ligne graphique commune

- Registre : « papier administratif et presse ». Pas de mascotte, pas de
  personnage caricaturé, pas de visage reconnaissable. La satire du jeu est
  symétrique : les illustrations ne doivent viser personne.
- Personnages : autorisés, et même attendus dans les scènes de dialogue
  (plateau, audience, classe, pupitre). Ce sont des **silhouettes de fonction**,
  pas des portraits : tête ronde, deux yeux en points, une bouche en arc, aucun
  trait distinctif, aucun âge, aucune ressemblance possible avec une personne
  réelle. Le kit est codé une fois (`tete`, `buste`, `jambes` dans
  `interface/app.js`) pour que les figures se ressemblent d'une scène à l'autre.
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

## État : onze sont faites

Onze illustrations sont **dessinées et intégrées au jeu**. Sept objets ou lieux
(façade de l'accueil, déménagement du bilan, bureau de l'atelier, enveloppe de
Bercy, carte scolaire, table d'audience, cour de rentrée) et quatre scènes avec
personnages (le plateau de 20 heures, la délégation syndicale, la classe, le
pupitre). Elles ont été écrites en SVG à la main, puis rendues dans un
navigateur — fond clair et fond sombre — et corrigées à la vue : deux à trois
passes chacune. Les demandes ci-dessous marquées « FAIT » n'ont donc plus besoin
d'être commandées ; les autres restent ouvertes.

Deux règles de fabrication apprises à la correction, à respecter pour la suite :
un buste ne se dessine pas d'un seul arc jusqu'au sol (cela produit une pierre
tombale) — il faut des épaules, des côtés verticaux, des bras détachés, et des
jambes si la figure est debout ; et le mobilier au premier plan doit être
**rempli** de la couleur du fond (`fill="var(--fond-illus)"`, qui suit la fiche
blanche ou le papier crème de la presse) pour masquer le bas des corps, sinon
les traits du meuble traversent les personnages.

## Les demandes, par ordre d'importance

### 1. L'accueil : la façade — 280 × 120 (existe en version simple, à refaire mieux)  — **FAIT**
Façade du 110 rue de Grenelle : le porche, l'hôtel particulier derrière, le
drapeau. Vu de la rue, légèrement en contre-plongée. C'est la seule image que
tout le monde verra.

### 2. Le bilan : le déménagement — 280 × 120  — **FAIT**
Un bureau ministériel vidé : cartons fermés, un fauteuil, un cadre décroché
laissant une trace claire sur le mur, un téléphone débranché. Sans personnage.
Sert à l'écran final, toutes fins confondues.

### 3. L'atelier de mesures : le bureau — 280 × 120  — **FAIT**
Un grand bureau avec des dossiers alignés, un parapheur ouvert, un stylo, une
tasse. Éventuellement un dossier estampillé « nouveau ». C'est l'écran le plus
fréquent du jeu (cinq fois par partie).

### 4. La lettre plafond : l'enveloppe de Bercy — 120 × 120  — **FAIT**
Une enveloppe épaisse, cachet « Ministère des comptes publics », un coin
relevé. Le détail drôle possible : un trombone qui tient une seconde feuille
plus épaisse que la première.

### 5. La carte scolaire : la carte — 120 × 120  — **FAIT**
Une carte de France simplifiée, sans région identifiable, avec des points
d'école dont certains sont barrés au crayon et d'autres entourés. Un compas ou
une règle posée dessus.

### 6. L'audience syndicale : la table — 280 × 120  — **FAIT**
Une table de réunion vue de haut, deux rangées de chaises face à face, des
parapheurs et des bouteilles d'eau. Un côté a plus de chaises que l'autre.
Sans personnage. Sert désormais à l'écran de retrait d'une mesure ; l'audience
elle-même a reçu la scène avec délégation (n° 15).

### 7. La rentrée : la cour — 280 × 120  — **FAIT**
Une cour d'école vide, tôt le matin : le préau, un panier de basket, des
marelles au sol, une porte ouverte. L'heure sur une horloge : 8 h 07.

### 8. Le plateau de 20 heures : le studio — 280 × 120  — **FAIT**
Le plateau vu de face : une caméra sur pied à gauche, un bureau courbe, la ou le
journaliste et le ministre face à face, deux micros de table entre eux, un
moniteur de retour avec sa diode d'antenne, deux projecteurs suspendus.

### 9. L'affaire : la une — 120 × 120
Un journal plié dont on ne lit pas le titre, un téléphone portable posé dessus
avec beaucoup de notifications. Doit rester neutre : la même image sert à
toutes les affaires.

### 10. La livraison PISA : la mallette — 120 × 120  — *sans objet*
Une mallette de rapport ouverte, des feuilles de tableaux, un logo générique
d'organisation internationale (pas celui de l'OCDE). Un tampon « 11 h 00 ».
Remplacée par la scène de classe (n° 16) : l'écran n'a besoin que d'un dessin.

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

### 15. L'audience : la délégation — 280 × 120  — **FAIT**
Trois représentants derrière une longue table, l'un lève la main, une pancarte
posée à gauche, des papiers sur la table.

### 16. La livraison PISA : la classe — 280 × 120  — **FAIT**
Le tableau, l'enseignante bras tendu vers lui, deux élèves à leur table dont
l'un lève la main. Sert à l'écran des résultats internationaux : ce que les
comparaisons mesurent se passe là.

### 17. La doctrine : le pupitre — 120 × 120  — **FAIT**
Une seule figure derrière un pupitre, les mains posées dessus, face à la salle.
Pour l'écran où l'on annonce l'ordre de ses priorités.

## Ce qu'il ne faut pas faire

- Pas de personnage identifiable : ni visage reconnaissable, ni coiffure, ni
  attribut qui puisse désigner un ministre, un syndicaliste ou un journaliste
  réel. Les personnages sont autorisés, les portraits non.
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
