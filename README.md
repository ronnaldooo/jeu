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

## État du projet

**Phase 1 terminée : le moteur et son équilibrage.** Pas encore d'interface,
délibérément — un jeu de gestion mal équilibré ne se rattrape pas à l'habillage,
et les quatre cibles d'équilibrage se vérifient à moindre coût sur un moteur nu.

Les quatre cibles sont atteintes, sur trois jeux de graines indépendants :
survivre cinq ans réussit à **55 %** pour un joueur attentif ; aucun des cinq
compteurs n'est maximisable sans en sacrifier trois ou quatre ; la stratégie
« tout vitrine » affiche **+4,9** de plus que sa réalité et la stratégie « tout
réel » **−1,4** de moins, toutes deux perdantes face au jeu mixte ; mettre les
cinq compteurs au vert en cinq ans est impossible, mais quatre y parviennent en
projection décennale.

→ **[EQUILIBRAGE.md](EQUILIBRAGE.md)** — les constantes et leurs sources, les
trajectoires des cinq compteurs pour six stratégies-types, les cinq erreurs de
conception que les simulations ont révélées, et les paramètres à réexaminer
après tests humains.

```bash
npm run equilibrage     # banc d'essai : vérifie les 4 cibles
npm run trajectoires    # trajectoires annuelles des 5 compteurs
```

Aucune dépendance : Node 18+ suffit. Le moteur est du JavaScript pur, il
tournera tel quel dans le navigateur.

```
moteur/constantes.js         constantes du moteur, chacune commentée avec sa source
moteur/catalogue.js          12 cartes-leçons + cartes paramétriques à curseurs
moteur/moteur.js             calendrier, vitrine/réel, grève, attractivité, bilan, projection
simulations/                 stratégies-types et bancs d'essai
```

**Prochaine étape** : porter le catalogue à une quarantaine de cartes, puis
l'interface — calendrier mensuel, unes de journal, fil social, communiqué
intersyndical, dépêche DEPP. Le moteur n'aura pas à changer : les stratégies de
simulation et l'interface implémentent la même interface de décision, et chaque
nouvelle carte peut être passée au banc d'essai avant d'être montrée à un
joueur.

## Sources et précautions

Les paramètres viennent de sources publiques datées d'août 2026 : DEPP
(évaluations nationales, heures non assurées, projections démographiques,
indice de position sociale), documents budgétaires du PLF et rapports du Sénat,
OCDE (PISA, TIMSS, TALIS, salaires), Cour des comptes, IGÉSR, CSEN,
Education Endowment Foundation pour les tailles d'effet. Les chiffres sont
utilisés comme **ordres de grandeur** : ils servent à faire comprendre des
proportions et des arbitrages, pas à documenter une année précise.

Les sept organisations syndicales sont pondérées par les résultats réels des
élections professionnelles de 2022, avec des profils de négociation
différenciés. Les positions attribuées aux acteurs restent des simplifications
de jeu.

**Jeu pédagogique indépendant, sans lien avec le ministère de l'Éducation
nationale.**

## Licence

Code sous licence MIT. Contenus (textes, paramétrage, catalogue) sous licence
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.fr).
