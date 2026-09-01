/* ============================================================================
   DOCUMENT DE RELECTURE, « Déroulé du jeu et grandes étapes »
   ----------------------------------------------------------------------------
   Génère le .docx remis pour relecture et corrections. Ce n'est PAS une brique
   du jeu : le jeu lui-même n'a aucune dépendance. Cet outil-là en a une.

     npm install docx                     (une seule fois, hors du dépôt)
     NODE_PATH=<ou-est-docx>/node_modules \\
       node outil/deroule-docx.cjs "Rue de Grenelle - deroule du jeu.docx"

   Extension .cjs et non .js : le dépôt est en modules ES, cet outil-là est en
   CommonJS parce que le paquet docx l'est.

   Le document décrit ce que le jeu FAIT ; il doit donc être régénéré après
   toute modification du calendrier, des seuils ou du catalogue. Les encadrés
   gris « À relire » sont les questions ouvertes soumises au relecteur.
   ========================================================================== */
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  TableOfContents, PageBreak, LevelFormat, convertInchesToTwip,
} = require('docx');
const fs = require('fs');

/* ---------- helpers ---------- */
const T = (t, o = {}) => new TextRun({ text: t, ...o });
const P = (t, o = {}) => new Paragraph({ children: typeof t === 'string' ? [T(t)] : t, ...o });
const H1 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 } });
const H2 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 120 } });
const H3 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_3, spacing: { before: 220, after: 90 } });
const BODY = (t) => new Paragraph({ children: typeof t === 'string' ? [T(t)] : t, spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED });
const PUCE = (t) => new Paragraph({ children: typeof t === 'string' ? [T(t)] : t, numbering: { reference: 'puces', level: 0 }, spacing: { after: 70 } });
const VIDE = () => new Paragraph({ text: '', spacing: { after: 80 } });

/* Encadré « à relire » : c'est là que le relecteur est invité à écrire.
   Chaque question est numérotée et enregistrée, pour être reprise en fin de
   document dans un tableau récapitulatif avec une colonne à remplir. */
const QUESTIONS = [];
const ENCADRE = (titre, texte, section) => {
  QUESTIONS.push({ n: QUESTIONS.length + 1, section: section || '', texte });
  const num = QUESTIONS.length;
  return new Table({
    columnWidths: [9360],
    width: { size: 9360, type: WidthType.DXA },
    rows: [new TableRow({ children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: 'F2F3F7' },
      margins: { top: 120, bottom: 120, left: 160, right: 160 },
      children: [
        new Paragraph({ children: [T(`${titre}, question ${num}`, { bold: true, size: 18, color: '000091', allCaps: true })], spacing: { after: 60 } }),
        new Paragraph({ children: [T(texte, { size: 20, italics: true, color: '444444' })], spacing: { after: 90 } }),
        new Paragraph({ children: [T('Votre réponse : ', { size: 19, color: '8A8FA3' }),
          T('………………………………………………………………………………………………………………………………', { size: 19, color: 'C9C9C9' })] }),
      ],
    })] })],
  });
};

const LARGEUR = 9360;
function tableau(entetes, lignes, largeurs) {
  const w = largeurs || entetes.map(() => Math.floor(LARGEUR / entetes.length));
  const cell = (txt, i, opts = {}) => new TableCell({
    width: { size: w[i], type: WidthType.DXA },
    shading: opts.entete ? { type: ShadingType.CLEAR, fill: '000091' } : (opts.zebre ? { type: ShadingType.CLEAR, fill: 'F7F8FB' } : undefined),
    margins: { top: 80, bottom: 80, left: 110, right: 110 },
    children: (() => { const segs = String(txt).split(/\u2029| \| /);
      return segs.map((seg, k) => new Paragraph({
        children: [T(seg, { bold: !!opts.entete || (segs.length > 1 && k === 0),
                            color: opts.entete ? 'FFFFFF' : undefined, size: 19 })],
        spacing: { after: segs.length > 1 && k < segs.length - 1 ? 60 : 0 },
      })); })(),
  });
  return new Table({
    columnWidths: w,
    width: { size: LARGEUR, type: WidthType.DXA },
    rows: [
      new TableRow({ tableHeader: true, children: entetes.map((h, i) => cell(h, i, { entete: true })) }),
      ...lignes.map((l, k) => new TableRow({ children: l.map((c, i) => cell(c, i, { zebre: k % 2 === 1 })) })),
    ],
  });
}

/* ============================ CONTENU ============================ */
const enfants = [];
const A = (...x) => enfants.push(...x);

/* ---- page de titre ---- */
A(
  new Paragraph({ text: '', spacing: { after: 1400 } }),
  new Paragraph({ children: [T('RUE DE GRENELLE', { bold: true, size: 56, color: '000091' })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
  new Paragraph({ children: [T('Devenir ministre de l’Éducation nationale', { size: 30, color: '565B6B' })], alignment: AlignmentType.CENTER, spacing: { after: 480 } }),
  new Paragraph({ children: [T('Déroulé du jeu et grandes étapes', { bold: true, size: 28 })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
  new Paragraph({ children: [T('Document de travail destiné à la relecture et aux corrections', { size: 22, italics: true, color: '565B6B' })], alignment: AlignmentType.CENTER, spacing: { after: 1000 } }),
  new Paragraph({ children: [T('Version du 2 septembre 2026, deuxième tour, après vos corrections', { size: 20, color: '8A8FA3' })], alignment: AlignmentType.CENTER }),
  new Paragraph({ children: [T('Jeu en ligne : https://ronnaldooo.github.io/jeu/', { size: 20, color: '8A8FA3' })], alignment: AlignmentType.CENTER }),
  new Paragraph({ children: [T('Code et sources : https://github.com/ronnaldooo/jeu', { size: 20, color: '8A8FA3' })], alignment: AlignmentType.CENTER, spacing: { after: 600 } }),
  new Paragraph({ children: [new PageBreak()] }),
);

/* ---- comment relire ---- */
A(H1('Comment relire ce document'));
A(BODY('Ce document décrit ce que le jeu fait aujourd’hui, étape par étape, dans l’ordre où le joueur les rencontre. Il n’est pas une notice : c’est un support de relecture. Chaque section se termine par un encadré gris « À relire » qui signale les points sur lesquels un avis extérieur serait le plus utile.'));
A(BODY('Trois façons d’annoter, au choix :'));
A(PUCE('écrire directement dans les encadrés gris ;'));
A(PUCE('utiliser les commentaires Word (Révision → Nouveau commentaire), c’est le plus facile à reporter dans le code ;'));
A(PUCE('activer le suivi des modifications et récrire les textes que vous voulez changer : les formulations du jeu sont dans des fichiers séparés, une phrase corrigée ici se remplace telle quelle.'));
A(VIDE());
A(BODY([
  T('Un repère utile pour vos remarques : ', {}),
  T('presque tout ce qui est chiffré dans le jeu est un paramètre isolé', { bold: true }),
  T(' (fichier ', {}), T('moteur/constantes.js', { font: 'Consolas', size: 19 }),
  T('), et presque tout ce qui est rédigé est une chaîne de caractères isolée (fichiers ', {}),
  T('moteur/catalogue.js', { font: 'Consolas', size: 19 }), T(' et ', {}),
  T('moteur/reperes.js', { font: 'Consolas', size: 19 }),
  T('). Autrement dit : « cette mesure devrait coûter plus cher », « ce délai est trop court », « cette phrase est fausse » sont des corrections rapides. En revanche « il faudrait une étape supplémentaire en mars » touche à la structure et demande un rééquilibrage complet.', {}),
]));
A(VIDE());
A(ENCADRE('À relire', 'Y a-t-il des parties du jeu dont vous voudriez le détail et qui ne figurent pas ici ?', 'Comment relire'));
A(new Paragraph({ children: [new PageBreak()] }));

/* ---- sommaire ---- */
A(H1('Sommaire'));
A(new TableOfContents('Sommaire', { hyperlink: true, headingStyleRange: '1-3' }));
A(BODY([T('(Dans Word : clic droit sur le sommaire → Mettre à jour les champs.)', { italics: true, size: 19, color: '8A8FA3' })]));
A(new Paragraph({ children: [new PageBreak()] }));

/* ============ 1. EN UN COUP D'ŒIL ============ */
A(H1('1. Le jeu en un coup d’œil'));
A(BODY('Le joueur est nommé ministre de l’Éducation nationale en juin 2027 et joue cinq années scolaires, de la rentrée 2027 à mai 2032. Une partie complète dure 45 à 90 minutes. Le jeu se joue dans un navigateur, sur ordinateur ou sur téléphone, sans compte et sans installation ; la partie se sauvegarde toute seule.'));
A(BODY('Il s’adresse au grand public et d’abord aux personnels du système éducatif. Il ne cherche pas à convaincre : chaque mesure cite ses porteurs politiques réels et le niveau de preuve de son effet.'));

A(H2('Les trois règles qui font le jeu'));
A(tableau(
  ['Règle', 'Ce qu’elle produit sur le joueur'],
  [
    ['L’écart vitrine / réel Toute mesure a un effet d’annonce, chiffré et immédiat, et un effet réel, jamais affiché, qui arrive avec 1 à 8 ans de retard.',
     'Le tableau de bord ment. Le joueur pilote pendant cinq ans avec des indicateurs qui ne mesurent pas ce qu’il croit, et découvre la vérité au bilan.'],
    ['Le niveau de preuve (les cadenas) De 1 à 5 cadenas selon la solidité des études disponibles, avec la source affichée.',
     'À 5 cadenas, l’effet obtenu reste proche de l’annonce (± 20 %). À 1 cadenas, il peut aller du négatif au triple. Un cadenas n’est pas un jugement de valeur : c’est la largeur du pari.'],
    ['Rien ne s’applique tout seul L’effet d’une réforme est multiplié par l’adhésion des personnels ; au-delà de trois réformes actives, toutes se dégradent.',
     'À 25 d’adhésion (le niveau de départ) le joueur récolte 63 % de ce qu’il a semé. Annoncer beaucoup revient à ne rien produire.'],
  ],
  [4400, 4960],
));

A(VIDE());
A(H2('Les cinq compteurs'));
A(BODY('Tout le jeu se lit dans cinq compteurs sur 100. Leur valeur de départ n’est pas arbitraire : elle est justifiée dans le code, source par source.'));
A(tableau(
  ['Compteur', 'Départ', 'Ce qu’il mesure'],
  [
    ['Réussite des élèves', '41', 'Acquis mesurés par les évaluations nationales et internationales (TIMSS CM1 : 484 contre 524 dans l’Union européenne).'],
    ['Réduction des inégalités', '34', 'Poids de l’origine sociale sur les résultats. Écart d’indice de position sociale public/privé : 99,9 contre 117,4.'],
    ['Santé du système', '29', 'Attractivité, remplacement, moral. 9,8 % d’heures non assurées ; formation continue au dernier rang des 48 pays de TALIS.'],
    ['Paix sociale', '78', 'Le mandat ne s’ouvre pas sur une page blanche : front intersyndical unitaire, grève de septembre 2026, boycott des instances.'],
    ['Salaires', '30', 'Salaires inférieurs de 26 % (élémentaire) et 18 % (collège) aux autres diplômés du supérieur ; point d’indice gelé depuis 2023.'],
  ],
  [2600, 900, 5860],
));
A(VIDE());
A(H3('Trois affichés, cinq comptés'));
A(BODY([T('Le tableau de bord n’affiche que ', {}), T('les trois premiers compteurs de la feuille de route', { bold: true }), T(' que le joueur a lui-même déclarée en juin 2027, ceux qui pèsent 80 % de sa note (35 + 25 + 20). Les deux derniers continuent d’être calculés, comptent dans le score et réapparaissent au bilan, mais ne sont pas sous ses yeux pendant la partie. L’écran de doctrine le prévient avant qu’il classe, donc l’information est loyale.', {})]));
A(BODY('Ce n’est pas seulement un allègement graphique : un ministre ne regarde que le tableau de bord qu’il s’est donné, et c’est précisément là que les surprises se logent. Le joueur qui classe la paix sociale en cinquième position ne verra pas l’incendie monter.'));
A(BODY('Trois indicateurs secondaires restent visibles en permanence, parce que ce sont les trois monnaies que le joueur dépense : le capital politique, la crédibilité (avec le multiplicateur qu’elle applique à ses annonces) et le crédit Bercy. Les autres variables, adhésion des personnels, fatigue réformatrice, saturation du système, couverture des concours, heures non assurées, écart d’indice social public/privé, ne sont plus affichées : elles se signalent d’elles-mêmes par une alerte quand elles se mettent à mordre, une par année au plus, trois par mandat.'));
A(VIDE());
A(ENCADRE('À relire', 'N’afficher que trois compteurs sur cinq est un pari : cela allège l’écran et cela crée volontairement un angle mort. Est-ce le bon dosage, ou faut-il montrer les cinq ? Et les alertes : une par an, est-ce trop rare pour comprendre ce qui vous arrive, ou déjà assez ?', '1 · Les compteurs'));
A(ENCADRE('À relire', 'Ces cinq compteurs sont-ils les bons ? Leur valeur de départ vous paraît-elle juste, notamment « Paix sociale » à 78, qui suppose qu’on hérite d’un conflit ouvert mais pas d’un blocage ?', '1 · En un coup d’œil'));
A(new Paragraph({ children: [new PageBreak()] }));

/* ============ 2. DÉROULÉ ============ */
A(H1('2. Le déroulé, écran par écran'));
A(BODY('Le jeu suit le calendrier réel d’un ministre. Une année de mandat comporte dix rendez-vous, dont six appellent une décision. Ce qui suit décrit l’enchaînement exact.'));

A(H2('2.1 L’ouverture, juin 2027'));

A(H3('Écran 1 · L’appel de Matignon'));
A(BODY('Le gouvernement se forme, le téléphone sonne. Le portefeuille proposé est l’Éducation nationale : premier budget de l’État, 65,3 milliards d’euros au projet de loi de finances qui s’annonce, 1,2 million d’agents, 12 millions d’élèves. La durée moyenne dans le poste dépasse rarement deux ans.'));
A(BODY('Le prédécesseur, huitième en quatre ans, laisse un mot de passation. Le joueur peut refuser la nomination, le jeu s’arrête alors, ce qui est une fin comme une autre.'));
A(BODY([T('Point de règle : ', { bold: true }), T('on ne dit jamais qui a été élu président. Le joueur choisit lui-même ses priorités ; aucune n’est imposée par l’Élysée.')]));

A(H3('Écran 2 · Trois questions à l’Élysée'));
A(BODY('Avant la passation, le Château reçoit le ministre pressenti une heure. Trois questions, qui n’ont rien à voir avec l’école : où sont scolarisés vos enfants, avez-vous perçu quelque chose sans service fait, que trouvera-t-on dans vos fonctions antérieures. Trois réponses possibles à chaque fois, répondre franchement, éluder, ou mentir.'));
A(BODY([T('C’est la scène la plus rentable du jeu, et le joueur ne le sait pas encore. ', {}), T('Répondre franchement ferme définitivement l’affaire correspondante', { bold: true }), T(' : elle ne pourra plus sortir de la partie, au prix de quelques points de crédibilité immédiats. Éluder l’entrouvre. ', {}), T('Mentir la referme aujourd’hui et la rouvre en grand', { bold: true }), T(' : la probabilité qu’elle sorte est multipliée par 2,2, et son coût par 1,45 quand elle sort. Ce n’est jamais l’affaire qui tue, c’est d’avoir dit le contraire.', {})]));

A(H3('Écran 3 · D’où venez-vous, le profil, cette fois choisi'));
A(BODY('Le service de presse a besoin de deux lignes pour les dépêches du lendemain. Le joueur déclare son profil : la maison (recteur, administration centrale), la haute fonction publique, un mandat d’élu local, ou la société civile.'));
A(BODY([T('La règle absolue est inchangée : ', {}), T('aucun profil ne donne d’avantage sur les compteurs éducatifs', { bold: true }), T('. Un profil décide de trois choses seulement (l’adhésion de départ des personnels, le capital politique initial, la crédibilité initiale) et de ce sur quoi on sera attaquable. Le profil était tiré au sort dans la version précédente ; il est désormais déclaré par le joueur, comme le reste. Le périmètre de nomination, en revanche, a disparu : il ajoutait une contrainte subie de plus sur un écran qui en comptait déjà assez.', {})]));

A(H3('Écran 4 · La conférence de presse, votre feuille de route'));
A(BODY('Premier acte du mandat : classer les cinq compteurs par ordre de priorité, devant la presse. Ce classement décide de la pondération du score final : 35 / 25 / 20 / 12 / 8 points.'));
A(BODY([T('C’est le ressort principal du jeu : ', {}), T('le joueur est noté contre sa propre parole', { bold: true }), T('. Un ministre qui annonce la réduction des inégalités et qui passe cinq ans à tenir le budget aura un mauvais score, même si le budget est excellent. Les oppositions lui ressortent sa déclaration à chaque arbitrage contradictoire.')]));
A(BODY('Chaque priorité est présentée avec les projets politiques réels qui la portent en 2027 (Attal, Philippe, Lisnard, le PS, Glucksmann, Mélenchon, le NFP, la FSU) de sorte que le joueur comprenne qu’aucune priorité n’est neutre. Le jeu cite, il ne juge pas.'));

A(H3('Écrans 5, 7 et 9 · Les trois notes de la DGESCO'));
A(BODY('La direction générale de l’enseignement scolaire remet trois pages courtes (un budget contraint, une baisse démographique, des résultats préoccupants) avec un graphique et deux précisions chacune, pas davantage. Chaque chiffre porte sa source officielle, cliquable. Aucune recommandation : l’état du système, et rien d’autre. Les huit autres fiches sont accessibles à tout moment par l’onglet « Comprendre le jeu ».'));
A(BODY([T('Ces trois notes ne se lisent plus d’affilée : ', {}), T('chacune débouche immédiatement sur la décision qu’elle éclaire', { bold: true }), T('. La note budgétaire précède l’arbitrage sur l’avance de gestion ; la note démographique précède la déclaration d’intention sur les postes que la baisse va libérer ; la note sur les niveaux précède les premières annonces. On ne lit pas un dossier pour le plaisir de le lire.', {})]));
A(BODY('Chaque page suit le même gabarit : un chiffre d’accroche en grand avec une phrase, le graphique qui va avec, puis deux précisions au maximum.'));
A(tableau(
  ['Page', 'Le chiffre d’accroche', 'Le graphique'],
  [
    ['Un budget contraint', '65,3 Md€, le budget de l’Éducation nationale en 2027', 'Histogramme 2019-2027, échelle graduée partant de zéro.'],
    ['Une baisse démographique', '−1 676 800, les élèves perdus d’ici 2035', 'Courbe des effectifs : bleu plein pour le constaté, violet pointillé pour la projection DEPP, axe gradué de 9,5 à 12 millions.'],
    ['Des résultats préoccupants', '−21 points, ce que les élèves de 15 ans ont perdu en mathématiques entre 2018 et 2022', 'Série PISA mathématiques 2003-2022 : le plateau bleu, puis le segment rouge de la chute.'],
  ],
  [2400, 3400, 3560],
));
A(BODY([T('Une règle d’échelle s’applique, énoncée dans les notes de bas de graphique. ', {}), T('Les barres partent toujours de zéro', { bold: true }), T(', un axe tronqué transformait la hausse de 1,2 % du budget en mur, et un jeu bâti sur l’idée que les chiffres affichés mentent ne peut pas ouvrir sur un graphique trompeur. ', {}), T('Les courbes ont droit à une échelle resserrée', { bold: true }), T(', ce qui est l’usage pour une série temporelle, à condition que l’axe soit gradué et que la note le dise. L’abscisse suit l’année et non le rang des points : afficher 2031, 2033 et 2035 à égale distance aplatirait la fin de la projection.', {})]));

A(H3('Écran 6 · L’avance de gestion, le premier arbitrage'));
A(BODY('La loi de finances votée par le prédécesseur laisse une marge : la réserve de précaution, gelée en début d’exercice sur chaque programme. Le ministre demande à Bercy d’en dégeler une part, contre un engagement chiffré de restitution de postes en janvier. Trois options : 550, 950 ou 1 400 millions d’euros, contre 0, 45 ou 60 % de restitution promise. Plus on demande, plus la demande peut être refusée, et plus l’engagement pris sera rappelé.'));
A(BODY('Ne pas tenir l’engagement de janvier coûte seize points de crédit Bercy et six de capital politique. C’est la première dette du mandat, et elle est contractée avant la première rentrée.'));

A(H3('Écran 8 · Votre intention sur les postes'));
A(BODY('Après la note démographique, le ministre annonce publiquement ce qu’il compte faire des postes que la baisse des effectifs va libérer : les réinvestir dans l’encadrement, les partager, ou les rendre. L’annonce est gratuite et engageante : elle sera confrontée à l’arbitrage réel de janvier, et l’écart sera relevé.'));

A(H3('Écran 10 · Les premières annonces'));
A(BODY('Enveloppe issue de l’avance obtenue, trois annonces au maximum, menu resserré à huit cartes.'));
A(BODY('La limite à deux annonces n’est pas budgétaire mais humaine et réglementaire : calendrier du Conseil supérieur de l’éducation, textes à écrire, capacité du ministère à accompagner ce qu’il annonce.'));

A(H3('Écran 11 · L’été des cent jours'));
A(BODY('Avant la première rentrée, un dossier de crise tombe au hasard parmi quatre, chacun avec trois réponses possibles :'));
A(PUCE('la canicule de juillet et des écoles à 40 °C ;'));
A(PUCE('un professeur agressé fin août, la vidéo circule ;'));
A(PUCE('une page de manuel sortie de son contexte, polémique d’août ;'));
A(PUCE('l’interview de rentrée, et le choix de sa petite phrase.'));
A(BODY('Ces dossiers ne coûtent rien en budget et beaucoup en positionnement : ils fixent l’image du ministre avant qu’il ait rien fait.'));
A(VIDE());
A(ENCADRE('À relire', 'L’ouverture fait maintenant onze écrans avant la première rentrée, mais aucun n’est une page de lecture pure : chaque note débouche sur une décision. Est-ce le bon rythme, ou reste-t-il trop long avant la première rentrée ?', '2.1 · L’ouverture'));

A(H2('2.2 L’année type, cinq fois de suite'));
A(BODY('À partir de septembre 2027, chaque année suit le même cycle. Les lignes marquées « DÉCISION » appellent un choix du joueur ; les autres sont des points d’étape où il lit ce qui s’est produit.'));
A(tableau(
  ['Mois', 'Rendez-vous', 'Ce qui se joue'],
  [
    ['Juillet', 'La lettre plafond de Bercy. DÉCISION', 'Bercy fixe le schéma d’emplois exigé (de −800 à −6 200 ETP) et la marge concédée (de 1,80 à 0,18 milliard), selon le crédit dont le ministre dispose. Il peut accepter ou contester : contester coûte 12 points de capital politique et réussit environ une fois sur trois.'],
    ['Juillet', 'Les résultats des concours', 'Le thermomètre de l’attractivité, avec un an de retard sur les décisions. C’est ici que la boucle salaires → candidats → remplacement → conditions devient visible.'],
    ['Septembre', 'La rentrée. DÉCISION si elle est ratée', 'Si les heures non assurées dépassent 12,5 % ou la couverture des concours descend sous 88 %, la rentrée est « dégradée » : le comptage syndical commence dès le jour 1. Le ministre choisit d’assumer ou de contester les chiffres, les deux existent dans la réalité, et les deux coûtent quelque chose.'],
    ['Septembre', 'La circulaire de rentrée. DÉCISION', 'Une mesure, pas davantage : la circulaire porte un message, pas un programme. Elle se finance par redéploiement (220 millions), sans arbitrage interministériel possible.'],
    ['Septembre', 'La polémique de rentrée. DÉCISION (à partir de l’an 2)', 'Une controverse qui n’a rien à voir avec le budget occupe la semaine de rentrée. Elle se règle en trois jours ou en trois mois, selon la réponse.'],
    ['Décembre (an 2)', 'La livraison PISA. DÉCISION', 'Les résultats de l’enquête tombent. Ils mesurent des élèves entrés au cours préparatoire dix ans avant la nomination du ministre. Personne ne le dira à sa place.'],
    ['Octobre', 'L’audience syndicale. DÉCISION (deux temps)', 'Face-à-face avec l’organisation majoritaire du moment. Voir le détail au § 3.3.'],
    ['Décembre', 'Élections professionnelles (an 1) et note de la DEPP', 'La représentativité des sept organisations est rebattue pour quatre ans : une adhésion basse profite aux organisations de lutte. La DEPP publie ce qu’elle mesure, y compris contre le ministre.'],
    ['Janvier', 'La carte scolaire. DÉCISION', 'L’arbitrage central du jeu. Voir le détail au § 3.1.'],
    ['Janvier', 'L’atelier. DÉCISION', 'Le budget de l’année devient des décisions : jusqu’à trois annonces, et le seul moment où l’on peut arracher un dépassement d’enveloppe.'],
    ['Mars', 'Les mobilisations de printemps. DÉCISION possible', 'Les grèves provisionnées se déclenchent. Une adhésion effondrée produit un conflit même sans mesure déclenchante. Si la mobilisation est forte, une seconde fenêtre de retrait s’ouvre : céder à chaud coûte moins cher en paix sociale qu’en octobre, et davantage en crédibilité.'],
    ['Variable', 'Le plateau de 20 heures. DÉCISION', 'À partir de l’an 2, si la crédibilité descend sous 58, si une affaire est sortie, ou de toute façon à partir de l’an 3. Trois questions en direct, dont une où aucune réponse n’est bonne.'],
    ['Mai', 'La clôture', 'Les effets réels arrivés à échéance entrent dans la vérité (invisible). Les tendanciels jouent : +0,7 point d’heures non assurées, −0,8 de position salariale, −0,9 d’attachement au métier. Le fil de presse et le fil social commentent l’année. À partir de la deuxième clôture, la boussole politique s’affiche (§ 4.2).'],
  ],
  [1100, 2900, 5360],
));
A(VIDE());
A(ENCADRE('À relire', 'Le calendrier vous paraît-il fidèle ? Manque-t-il un rendez-vous que vit réellement un ministre (le comité social d’administration ? les résultats du baccalauréat en juillet ? la conférence de presse de rentrée ?).', '2.2 · L’année type'));

A(H2('2.3 La fin de partie'));
A(BODY('Cinq façons de terminer, et une seule qui consiste à aller au bout.'));
A(tableau(
  ['Fin', 'Déclenchement'],
  [
    ['Mandat complet (5 ans)', 'Survivre aux cinq années. « Vous partez debout, ce qui, rue de Grenelle, est déjà un résultat. »'],
    ['Renvoi', 'Trois convocations à Matignon. Une convocation s’obtient par une rentrée ratée, un capital politique épuisé, des familles qui décrochent, ou Bercy qui fait remonter le dossier.'],
    ['Remaniement', 'Un tirage annuel, modulé par le capital politique et l’opinion des familles. C’est la première cause de fin de mandat dans la vraie vie : plus de trente ministres depuis 1958.'],
    ['Affaire', 'Deux réponses du répertoire sont fatales à elles seules. Justifier la scolarisation privée de ses enfants par un défaut du service public : les sept organisations publient un communiqué commun dans la journée. Et, sur l’affaire de l’internat, contester la mise en cause du ministère en parlant d’instrumentalisation : des victimes répondent à visage découvert le soir même, et aucun soutien politique ne suit.'],
    ['Guerre scolaire', 'Deux provocations sur le privé sous contrat, puis un capital politique bas. « Un million de personnes dans la rue, comme en 1984. Le gouvernement retire le texte, et vous avec. »'],
  ],
  [2600, 6760],
));
A(BODY('Un joueur attentif survit cinq ans dans 45 à 50 % des parties. C’est un choix : finir doit être une performance, pas un dû.'));
A(VIDE());
A(ENCADRE('À relire', 'Le remaniement est un tirage : on peut perdre sans avoir démérité. C’est fidèle à la réalité, mais est-ce frustrant à jouer ? Faut-il baisser sa probabilité et compenser par les convocations, qui, elles, se méritent ?', '2.3 · La fin de partie'));
A(new Paragraph({ children: [new PageBreak()] }));

/* ============ 3. LES QUATRE DÉCISIONS ============ */
A(H1('3. Les quatre décisions structurantes'));

A(H2('3.1 La carte scolaire (janvier), l’arbitrage central'));
A(BODY('C’est le cœur politique du jeu, et il tient en deux curseurs.'));
A(BODY([T('Le premier : que fait-on des postes que la démographie libère ?', { bold: true })]));
A(BODY('La France perdra 1 676 800 élèves d’ici 2035, soit 14,2 % de sa population scolaire. Chaque année, cette baisse « rend » des milliers de postes. Le curseur va de 0 % (tout est réinvesti dans l’encadrement) à 100 % (tout est rendu à Bercy).'));
A(BODY('Les deux précédents réels sont donnés au joueur, et ils sont opposés : rentrée 2025, −106 000 élèves pour seulement −470 postes (4 %) ; rentrée 2026, −161 000 élèves pour −4 032 postes titulaires (60 %). Le même chiffre démographique, deux pays différents à l’arrivée.'));
A(BODY('Conséquences : Bercy compare aux emplois qu’il avait exigés en juillet et ajuste le crédit du ministre ; les personnels comptent les suppressions, pas les intentions ; au-delà de 55 % de restitution, les maires invoquent la règle « aucune école ne ferme sans notre accord » et le capital politique chute.'));
A(BODY([T('Le second : comment l’effort est-il réparti entre public et privé sous contrat ?', { bold: true })]));
A(BODY('Épargner le privé fait monter la ségrégation ; le faire contribuer au-delà de 78 % déclenche une provocation. Deux provocations arment la guerre scolaire, il faut donc insister pour la déclencher : une année de tension ne suffit pas, deux commencent à faire une histoire.'));
A(VIDE());
A(ENCADRE('À relire', 'Le seuil de colère des maires (55 %) et celui de la provocation sur le privé (78 %) sont des jugements de ma part. Vous paraissent-ils placés au bon endroit ?', '3.1 · La carte scolaire'));

A(H2('3.2 L’atelier de mesures, le catalogue'));
A(BODY('Le catalogue compte 70 cartes réparties en cinq familles : moyens et encadrement, autonomie et évaluation, parcours et orientation, autorité et familles, mixité et carte scolaire.'));
A(H3('Ce que porte chaque carte'));
A(tableau(
  ['Élément', 'Exemple, sur la carte « Redoublement facilité »'],
  [
    ['Coût et capital politique', '550 millions d’euros par an, 3 points de capital.'],
    ['Porteurs réels', '« Une large majorité de l’opinion », plusieurs candidats de droite.'],
    ['Effet vitrine (affiché)', 'Parents +9, presse +6, compteur Réussite +8.'],
    ['Effet réel (caché)', 'Réussite −7 à 3 ans (4 cadenas), Inégalités −8 à 4 ans (4 cadenas).'],
    ['Ce que disent les études', 'Note n° 15 du Conseil scientifique de l’éducation nationale : effet moyen négatif, décrochage accru, coût d’une année de scolarité. L’« effet de menace » n’a jamais été démontré.'],
    ['L’idée reçue déconstruite', '« Le redoublement, c’était mieux avant. » Les pays qui font le plus redoubler ne réussissent pas mieux.'],
    ['Le mot de la carte', '« Coûteux, contre-productif, et populaire. Le miroir exact de la formation continue : tout ce que le tableau de bord adore et que le bilan déteste. »'],
  ],
  [2900, 6460],
));
A(H3('La découverte progressive'));
A(BODY('Vingt-cinq cartes ne sont pas sur le bureau le premier jour. Elles remontent quand la situation les appelle : au bout d’un an ou deux, quand un rapport tombe (les heures perdues dépassent 10,6 %), quand un indicateur se dégrade (la ségrégation, la réussite), quand les maires ont compté les fermetures de classes, ou quand une mesure en appelle une autre (la pause numérique au collège fait demander la même chose au lycée).'));
A(BODY('Le joueur est prévenu par un bandeau et par un badge « nouveau dossier ». Mesuré sur 400 parties : 9,3 ouvertures de dossier par partie, et 89 % des parties en voient au moins une. Sur l’ensemble des stratégies testées, toutes les cartes sont proposées au menu au moins une fois.'));
A(H3('Les recommandations d’août 2026, jouables'));
A(BODY('Dix cartes sont tirées des onze recommandations du rapport du Haut-commissariat à la Stratégie et au Plan « Niveau scolaire : éléments de diagnostic et propositions » (août 2026). Elles arrivent sur le bureau à la date où le rapport paraît, c’est-à-dire pendant le mandat : rendre les réformes évaluables et publier les résultats, séparer inspection et accompagnement, reconnaître la coordination pédagogique, inscrire la formation dans les obligations de service au collège, revenir à la semaine de quatre jours et demi, expérimenter la spécialisation des professeurs des écoles, évaluer publiquement les manuels du primaire, un plan sciences à l’école, le rétablissement des techniques opératoires, et un cadre national d’usage de l’intelligence artificielle.'));
A(BODY([T('Le même rapport a servi à ', {}), T('corriger', { bold: true }), T(' une carte. Le suivi de long terme du dédoublement établit que les bénéfices observés de la fin du CP à la fin du CE1 n’apparaissent plus à l’entrée en sixième. Le jeu affichait un effet d’égalité de +8 à quatre ans avec quatre cadenas, c’est-à-dire exactement l’excès de confiance qu’il prétend enseigner. La carte est ramenée à +5 avec trois cadenas, et ses textes sont récrits autour du démenti. C’était le test du dispositif : une source contraire doit pouvoir déplacer un paramètre, pas seulement s’ajouter en note de bas de page.')]));

A(H3('Les trois dernières cartes ajoutées'));
A(BODY('Elles répondent à une demande de relecture (« enrichir les mesures, par exemple avec interdire les textes à trous ») et elles illustrent trois cas de figure différents du catalogue.'));
A(tableau(
  ['Carte', 'Ce qu’elle fait', 'Ce qu’elle enseigne'],
  [
    ['La leçon se copie à la main : fin de la photocopie comme trace écrite',
     'Deux cadenas de preuve, 40 millions d’euros, effet Réussite +3 à trois ans. Source : la mission d’inspection sur l’enseignement en cours moyen, citée par le Haut-commissariat, relève un recours massif et excessif aux photocopies, qui font parfois office de leçon et court-circuitent l’institutionnalisation des savoirs. Le rapport Villani-Torossian recommandait déjà de redonner sa place au cours structuré.',
     'Qu’une mesure gratuite n’est pas une mesure facile. Une circulaire ne s’applique pas dans une salle de classe où personne ne vient la vérifier : la seule chose qu’un ministre puisse acheter ici est l’adhésion des équipes, et cette carte la fait baisser. Il achète un effet avec la monnaie qui le produit.'],
    ['Généraliser l’enseignement explicite, du CP à la troisième',
     'Quatre cadenas, 340 millions d’euros, Réussite +7 à quatre ans et Inégalités +4 à cinq ans. Le Haut-commissariat note que son efficacité est prouvée par la recherche ; les nouveaux programmes de cycle 2 le retiennent déjà.',
     'Que les meilleures cartes du catalogue demandent un mandat entier de formation continue pour produire ce qu’elles promettent, et que l’explicitation des attendus profite d’abord aux élèves qui ne trouvent pas le code scolaire à la maison.'],
    ['Investir dans les démarches d’investigation et les tâches complexes',
     'Exclusive de la précédente. Deux cadenas dans les deux sens : Santé du système +3 à deux ans, et Réussite −2 à quatre ans.',
     'C’est la seule carte du catalogue à porter un effet négatif assumé sur la réussite en même temps qu’un effet positif documenté sur l’engagement des équipes. Le jeu ne tranche pas ce débat-là, et il écrit noir sur blanc que personne ne devrait le trancher en meeting.'],
  ],
  [2400, 3900, 3060],
));
A(VIDE());

A(H3('La carte salariale, entièrement paramétrable'));
A(BODY('La revalorisation n’est pas une carte comme les autres : elle a trois curseurs, et le chiffrage s’affiche en direct.'));
A(tableau(
  ['Curseur', 'Options', 'Ce que ça change'],
  [
    ['Combien', 'De 200 millions à 5 milliards par an', 'Le panneau affiche le nombre d’enseignants concernés, le brut mensuel moyen, l’équivalent en points d’indice, la part du rattrapage réclamé par la FSU.'],
    ['Comment', 'Point d’indice / prime / pacte contre missions', 'Le point d’indice coûte 43 % de plus à l’État (CAS Pensions) et est irréversible ; la prime coûte le prix affiché mais un successeur peut l’arrêter ; le pacte fait baisser les heures non assurées et l’adhésion.'],
    ['Pour qui', 'Débuts de carrière / milieu de carrière / tout le corps', '2,5 milliards sur tout le corps donnent 256 € par mois ; les mêmes 2,5 milliards concentrés sur les débuts donnent 673 €. C’est la démonstration arithmétique de ce que « cibler » veut dire.'],
  ],
  [1500, 2900, 4960],
));
A(VIDE());
A(ENCADRE('À relire', 'Manque-t-il des mesures que vous attendriez dans un tel catalogue ? Y en a-t-il dont la formulation, les porteurs ou l’effet vous paraissent inexacts ? C’est la partie la plus facile à corriger : une carte est un bloc de texte isolé.', '3.2 · Le catalogue'));

A(H2('3.3 L’audience syndicale (octobre), en deux temps'));
A(BODY('Sept organisations, pondérées par les résultats réels des élections professionnelles de 2022, avec des profils de négociation distincts : rapport de force, réformiste, frontal, négociation, radical, corporatiste. Les noms sont des pseudonymes transparents ; les poids et les profils sont ceux des organisations réelles.'));
A(BODY([T('Premier temps : la question.', { bold: true }), T(' Le ministre reçoit l’organisation majoritaire du moment sur un sujet, les postes, les salaires, le remplacement, les concours, une grève, sa doctrine. Trois réponses possibles : la fermeté, la méthode, la concession. Une matrice croise le type de réponse et le profil de l’organisation : la fermeté rassure l’opinion et coûte le corps ; la méthode paie en adhésion selon le profil ; la concession paie partout mais se paie à Bercy. Le verdict est affiché, bien accueillie, accueillie froidement, très mal reçue.')]));
A(BODY([T('Second temps : la revendication.', { bold: true }), T(' L’organisation exige le retrait de la mesure qu’elle conteste le plus. Trois réponses sont possibles. ', {}), T('Céder', { bold: true }), T(' retire vraiment la mesure du jeu : ses effets réels ne viendront jamais, et le compteur d’abandons monte. ', {}), T('Maintenir', { bold: true }), T(' face à un profil combatif, c’est provisionner une grève pour le printemps. ', {}), T('Requalifier', { bold: true }), T(' (la renommer et la rendre facultative) ne coûte presque rien sur le moment : le conflit se dénoue, les crédits restent inscrits, l’annonce survit. C’est le geste politique le plus fréquent du système français, et le seul dont le prix n’apparaît qu’au bilan : la mesure requalifiée produit moins d’un cinquième de ce qu’elle promettait. Précédent : le « choc des savoirs » de décembre 2023, requalifié en « groupes de besoins », puis vidé de son obligation.', {})]));
A(H3('Ce que les syndicats avancent, et de quelle nature'));
A(BODY('L’écran de revendication affiche désormais les deux arguments de l’organisation, côte à côte et explicitement étiquetés. C’est le cœur pédagogique de la scène.'));
A(tableau(
  ['Nature', 'D’où il vient', 'Ce que le jeu en dit'],
  [
    ['Argument étayé, vérifiable',
     'Fabriqué à partir des données de la carte elle-même : son niveau de preuve, son effet documenté, les postes qu’elle rend, l’adhésion du moment. Il ne peut donc pas mentir.',
     'Le jeu écrit sous l’argument ce qu’il vaut exactement. Exemple : « votre mesure est correctement étayée, quatre cadenas ; nous contestons les conditions de sa mise en œuvre, l’adhésion est à 22 sur 100 », et le jeu répond que l’organisation vient de décrire le moteur du joueur.'],
    ['Argument de principe, non vérifiable',
     'Dépend de la famille de la mesure et du profil de l’organisation. Exemple, sur une carte de parcours : « trier les élèves, même provisoirement, c’est assigner ; le collège unique est une promesse républicaine ».',
     'Le jeu écrit qu’il n’est ni faux ni illégitime, simplement non mesurable : une part de la politique scolaire est un choix de valeurs et non un résultat d’étude. Et que la confusion des deux registres est ce qui rend illisibles la plupart des débats sur l’école, y compris ceux des programmes des candidats.'],
  ],
  [2000, 3400, 3960],
));
A(VIDE());
A(BODY('Les grèves sont chiffrées à partir d’un étalon historique (le 10 février 2011, 16,99 % d’enseignants grévistes) et affichées avec deux nombres : celui du ministère et celui de l’intersyndicale, environ 1,7 fois plus élevé.'));
A(VIDE());
A(ENCADRE('À relire', 'Les profils syndicaux et la matrice d’accueil des réponses sont des simplifications assumées. Sonnent-elles juste pour quelqu’un qui connaît ces organisations ? La satire des noms reste-t-elle acceptable et symétrique ?', '3.3 · L’audience syndicale'));
A(ENCADRE('À relire', 'La distinction argument étayé / argument de principe est le pari pédagogique de cette version. Les arguments de principe que je prête aux organisations sont-ils justes et respectueux, c’est-à-dire les reconnaîtraient-elles comme les leurs ? Et le jeu dit-il assez clairement qu’un argument de principe n’est pas un argument faible ?', '3.3 · Les arguments'));

A(H2('3.4 La lettre plafond (juillet), la contrainte extérieure'));
A(BODY('Bercy n’est pas un adversaire à battre : c’est un cadre. Selon le crédit dont le ministre dispose, quatre paliers, du ton « confiant » au ton « comminatoire » :'));
A(tableau(
  ['Crédit Bercy', 'Schéma d’emplois exigé', 'Marge concédée', 'Ton'],
  [
    ['75 et plus', '−800 ETP', '1,80 Md€', 'confiant'],
    ['55 à 74', '−2 200 ETP', '1,05 Md€', 'vigilant'],
    ['35 à 54', '−4 000 ETP', '0,62 Md€', 'ferme'],
    ['moins de 35', '−6 200 ETP', '0,18 Md€', 'comminatoire'],
  ],
  [2200, 2600, 2200, 2360],
));
A(BODY('Le ministre commence à 48, donc au palier « ferme ». Le crédit monte quand il tient ses engagements en janvier, descend quand il dépasse son enveloppe. C’est le seul indicateur du jeu que le joueur peut vraiment reconstruire en tête.'));
A(new Paragraph({ children: [new PageBreak()] }));

A(H2('3.5 Les turbulences, ce qui vous arrive et que vous n’avez pas décidé'));
A(BODY('Sur les six causes documentées de chute d’un ministre de l’Éducation, une seule relève de la politique éducative. Les cinq autres tiennent à la posture, à la communication, au hasard biographique ou au périmètre de la nomination. Un ministre tombe plus souvent sur une phrase que sur un bilan, et un jeu qui n’aurait que des compteurs de résultats scolaires ne pourrait pas représenter ce qui met réellement fin aux carrières.'));
A(H3('La crédibilité, la ressource de parole'));
A(BODY('Une jauge distincte du capital politique, initialisée à 62. Elle multiplie tout l’effet d’annonce : à 62, les mesures valent ×1,11 ; à 20, ×0,73 ; à 95, ×1,41. À crédibilité effondrée, la meilleure mesure du catalogue ne porte plus. Elle se reconstitue de quatre points par an et se perd beaucoup plus vite : neuf points pour une mesure requalifiée, cinq pour un abandon, jusqu’à vingt-quatre pour une affaire mal gérée. C’est ce qui donne enfin un prix à la requalification : se dédire ne coûtait qu’un peu de fatigue, cela coûte désormais la parole.'));
A(H3('Les affaires personnelles'));
A(BODY('Neuf archétypes, intégralement pseudonymisés : les situations sont inspirées de faits publics, les personnages sont fictifs, et aucune affaire n’est rejouée sous le nom de qui que ce soit. Ce qu’on garde, c’est la forme, le déclencheur, la cinétique, l’issue. Les trois derniers ont été ajoutés sur votre liste de relecture.'));
A(tableau(
  ['Archétype', 'Ce qui est reproché', 'Se déclenche quand'],
  [
    ['Le lieu', 'La distance avec le terrain', 'Vous avez légiféré sur le remplacement, les rythmes ou les obligations de service.'],
    ['L’école de vos enfants', 'La défiance envers le service public', 'Vous avez touché au privé, à l’affectation ou à la sectorisation.'],
    ['Le privilège', 'L’écart entre ce que vous exigez et ce que vous vous appliquez', 'Vous avez exigé de la présence, de l’évaluation ou du contrôle.'],
    ['Le faux nez', 'L’instrumentalisation de l’État', 'Vous avez joué une carte de communication : manuels, numérique, uniforme, évaluations.'],
    ['L’illégitimité', 'Votre droit même d’occuper le poste', 'Rien. Elle est subie, selon votre profil.'],
    ['Votre passé', 'Une défaillance antérieure à votre nomination', 'Rien. Elle est subie.'],
    ['L’image', 'Des photos de soirée qui circulent la semaine où vous demandez aux adolescents de poser leur téléphone', 'Vous avez légiféré sur les écrans, le portable, l’uniforme ou le climat scolaire.'],
    ['Le rapport corrigé', 'Un rapport d’inspection publié sans les pages où les inspecteurs relevaient des situations homophobes signalées par des élèves', 'Vous avez touché au privé sous contrat, à son financement ou à l’évaluation des établissements.'],
    ['L’internat', 'Des violences connues de l’administration et jamais transmises au procureur', 'Vous avez touché aux internats, à la vie scolaire, à la santé mentale ou au social.'],
  ],
  [2100, 3100, 4160],
));
A(BODY([T('L’affaire de l’internat est la seule du répertoire à ne pas avoir de réponse peu coûteuse. ', {}), T('L’article 40 du code de procédure pénale', { bold: true }), T(' oblige tout fonctionnaire qui acquiert la connaissance d’un crime ou d’un délit à en aviser sans délai le procureur : ce n’est pas une faculté d’appréciation. Il y a donc une réponse due (saisir, ouvrir les archives, recevoir les victimes) et deux façons d’aggraver. C’est volontairement le seul endroit du jeu où le calcul politique n’a pas sa place.', {})]));
A(BODY('Le tirage n’est jamais purement aléatoire : 9,5 % par an de base, multiplié par 2,6 si vous avez joué une carte du même thème dans l’année, par 1,7 si votre profil y expose, plafonné à 42 %, deux affaires par partie au maximum. C’est la règle la plus fidèle au réel de tout le dossier : on n’est pas puni pour ce qu’on fait, on est puni pour l’écart. Mesuré sur 900 parties : 34 % des parties ne voient aucune affaire, et un quart des affaires qui sortent sont déclenchées par ce que le ministre venait de faire, l’écran le signale quand c’est le cas. Un ministre qui a répondu franchement aux trois questions de l’Élysée en a fermé trois définitivement, et n’est plus exposé qu’aux six autres.'));
A(BODY('Trois réponses toujours : assumer sobrement, se défendre sur les faits, contre-attaquer. La troisième est la plus tentante et la plus coûteuse. Aucune ne touche un compteur éducatif. Une affaire sur quatre se dégonfle (démentie, classée, close par un remboursement) et le joueur ne récupère alors que la moitié du coût : c’est vrai, et c’est ce que le public retient le plus mal. Une seule réponse du répertoire est fatale à elle seule, et ce n’est pas la plus grave sur le fond : c’est celle où le ministre justifie la scolarisation privée de ses enfants par un défaut du service public dont il vient de prendre la tête.'));
A(VIDE());
A(ENCADRE('À relire', 'La fréquence vous paraît-elle juste, un tiers des parties sans aucune affaire ? Et le garde-fou principal : l’archétype de l’attaque en illégitimité existe uniquement comme subi, jamais comme une carte jouable par qui que ce soit. On modélise la réalité d’une exposition, on ne fabrique pas un simulateur de dénigrement. Cette ligne vous semble-t-elle au bon endroit ?', '3.5 · Les turbulences'));

/* ============ 4. LE BILAN ============ */
A(H1('4. Le bilan, le moment où le jeu dit ce qu’il avait à dire'));
A(H2('4.1 Ce qui est révélé'));
A(BODY('Le bilan est la seule partie du jeu où la vérité est affichée. Vous l’aviez trouvé trop long : il a été ramené du simple au double en hauteur, sans qu’aucune donnée soit perdue. Le tableau exhaustif des effets, mesure par mesure, existe toujours mais il est replié derrière un dépliant ; ce qui reste ouvert tient en trois ou quatre phrases.'));
A(BODY('Il se lit en quatre temps.'));
A(tableau(
  ['Temps', 'Ce qui est révélé'],
  [
    ['1. Les cinq compteurs', 'Départ 2027, affiché, réel, projection à dix ans, sur une seule ligne chacun. Les deux compteurs qui n’ont jamais été affichés pendant la partie apparaissent ici, signalés comme tels : c’est souvent la surprise du bilan.'],
    ['2. L’écart affiché / réel', 'Il se lit d’un coup d’œil sur ce même tableau, et c’est en général le moment où les joueurs s’arrêtent.'],
    ['3. Trois phrases, puis le détail replié', 'Votre meilleure décision ; votre plus grosse déception, avec sa raison (pari à preuve faible, ou mise en œuvre dégradée) ; les effets qui arriveront après votre départ, et leur total. Le tableau complet (chaque effet, son niveau de preuve, sa valeur documentée, sa valeur obtenue, son horizon) est accessible d’un clic pour qui veut tout voir.'],
    ['4. La projection à dix ans', 'Non pas un bonus plaqué, mais la physique du système prolongée de cinq ans : les effets encore en route arrivent, la boucle d’attractivité continue de tourner dans le sens qu’on lui a donné. Référence : le Portugal, seul pays de l’OCDE en progression dans les trois domaines de PISA entre 2000 et 2018, après quinze ans de cap constant malgré l’alternance.'],
  ],
  [2400, 6960],
));
A(BODY('Le score final est pondéré par la feuille de route déclarée en juin 2027 : 35 / 25 / 20 / 12 / 8. Deux bonus s’y ajoutent : la constance (avoir peu abandonné) et la cohérence (la part de ce qu’on a réellement produit qui va dans le sens de ce qu’on avait annoncé).'));
A(BODY([T('La leçon visée, en une phrase : ', {}), T('mettre les cinq compteurs au vert est impossible en cinq ans, et presque possible en dix.', { bold: true }), T(' La victoire existe ; elle demande plus de temps qu’un mandat.')]));
A(VIDE());
A(ENCADRE('À relire', 'Le bilan a été allégé : trois phrases de synthèse, le tableau exhaustif replié derrière un dépliant. Est-ce assez, trop, ou mal découpé ? Y manque-t-il une phrase de conclusion plus explicite sur ce que la partie a montré ?', '4.1 · Le bilan'));

A(H2('4.2 La boussole, de quels programmes vos mesures se rapprochent'));
A(BODY([T('C’était l’objectif que vous aviez formulé : ', {}), T('« le jeu doit permettre de comprendre progressivement que ses mesures sont celles, ou non, de celles portées par des partis politiques ou des candidats »', { italics: true }), T('. La boussole y répond, et elle apparaît deux fois : à chaque clôture annuelle à partir de la deuxième, puis au bilan.', {})]));
A(BODY('Elle affiche, sur l’ensemble des mesures annoncées, combien figurent aussi au programme de la gauche, du centre et de la majorité sortante, de la droite, et de l’extrême droite. Trois précautions de méthode, qui sont aussi tout l’intérêt de l’exercice :'));
A(PUCE('le rattachement se lit dans la carte elle-même, à sa ligne « portée par », qui existe depuis le premier jour et qui nomme les porteurs réels. Il est donc vérifiable ligne à ligne, et il n’a pas été décidé ailleurs ;'));
A(PUCE('une même mesure est souvent portée par plusieurs bords à la fois. C’est un fait du débat scolaire français, pas une imprécision de comptage ;'));
A(PUCE('46 des 70 cartes ne sont portées par aucun parti : elles viennent de la Cour des comptes, de la DEPP, du Conseil scientifique, de l’inspection générale ou de la recherche. C’est probablement le chiffre le plus instructif du jeu, et il est affiché en gras sous la boussole.'));
A(BODY([T('Le jeu ne dit jamais « vous êtes de tel bord », et il ne le sait pas. Il dit ', {}), T('« ces mesures figurent aussi dans tel programme »', { bold: true }), T('. La conclusion appartient au joueur, et le texte ajoute que si le résultat le surprend, c’est le moment le plus utile de la partie.', {})]));
A(VIDE());
A(ENCADRE('À relire', 'La boussole est l’ajout le plus délicat du jeu : elle range des mesures d’école dans des cases politiques. Les rattachements vous paraissent-ils justes ? Faut-il davantage de bords (les écologistes, le centre-gauche, les communistes) ou est-ce déjà trop fin pour ce que le jeu peut honnêtement soutenir ? Et l’apparition à partir de la deuxième année : est-ce le bon moment ?', '4.2 · La boussole'));
A(new Paragraph({ children: [new PageBreak()] }));

/* ============ 5. TRANSVERSAL ============ */
A(H1('5. Ce qui tourne en arrière-plan'));
A(BODY('Huit mécaniques fonctionnent en continu, sans écran dédié. Elles expliquent la plupart des surprises que rencontre un joueur.'));
A(tableau(
  ['Mécanique', 'Ce qu’elle fait'],
  [
    ['L’effet cliquet budgétaire', 'Toute mesure pérenne consomme pour toujours la marge nouvelle de l’année, pour le ministre et pour ses successeurs. C’est ce qui rend la troisième année plus dure que la première.'],
    ['La boucle d’attractivité', 'Salaires + considération + conditions → candidats → couverture des concours → remplacement → conditions. Rétroaction positive, à forte inertie : trois à cinq ans, soit plus qu’un mandat.'],
    ['La capacité d’absorption', 'Au-delà de trois réformes simultanément actives, chaque réforme supplémentaire rabote l’effet de toutes et élargit leur incertitude. Une réforme « occupe » le système trois ans.'],
    ['La fatigue réformatrice', 'Sept ministres en trois ans avant vous. Elle monte à chaque réforme et à chaque abandon, redescend quand on n’annonce rien, mais un ministre qui n’annonce rien n’est pas un ministre qui dure.'],
    ['Le poids de l’héritage', 'Les deux premières années, 60 % du signal affiché vient de ce qu’on n’a pas fait. Le ministre est jugé sur le mandat de son prédécesseur.'],
    ['Le coût d’affichage du long terme', 'Une réforme dont l’effet arrive dans quatre ans ou plus consomme des moyens visibles pour un résultat invisible. C’est ce qui rend la politique de long terme électoralement irrationnelle.'],
    ['La réversion', 'Une réforme non consolidée ne survit pas au ministre suivant : les effets encore en route à la fin du mandat n’arrivent qu’à 62 % dans la projection décennale. Une seule carte immunise (la loi de programmation) et elle ne produit rien de visible pendant le mandat. Précédent : la réforme du collège de 2015, abrogée par décret dès l’arrivée du successeur.'],
    ['La presse et le fil social', 'Unes de journal, comptes qui commentent selon l’état du système : un directeur d’école fatigué, un parent délégué sans remplaçant, un ancien ministre qui tweete avant le lever du soleil. C’est la respiration du jeu, et l’endroit où passe l’humour.'],
  ],
  [2600, 6760],
));
A(VIDE());
A(BODY([T('Depuis votre relecture, ces mécaniques ne sont plus totalement muettes : ', {}), T('elles se signalent d’elles-mêmes quand elles se mettent à mordre', { bold: true }), T('. Un encadré apparaît sous le bandeau, nomme le seuil franchi, donne le chiffre et explique la conséquence, « adhésion enseignante à 14 sur 100, vos annonces ne s’appliquent qu’à 50 % de leur effet documenté ». Sept règles existent, dont celle que vous aviez demandée explicitement : épargner le privé sous contrat fait monter la ségrégation, et pèse donc sur le compteur Réduction des inégalités. Le rationnement est volontaire (une alerte par année au plus, trois par mandat) parce qu’une alerte qui revient à chaque écran n’alerte plus personne, elle décore.', {})]));
A(VIDE());
A(ENCADRE('À relire', 'Ces mécaniques sont invisibles par construction, et les alertes en lèvent une partie. Le dosage vous paraît-il juste : assez pour comprendre ce qui vous arrive, pas au point de tuer la surprise du bilan ?', '5 · L’arrière-plan'));

A(H1('6. L’onglet « Comprendre le jeu »'));
A(BODY('Un bouton fixe en bas à gauche de chaque écran ouvre onze fiches de référence, 80 chiffres, trente-quatre sources officielles portant chacune l’organisme, la date et le lien du document.'));
A(tableau(
  ['Fiche', 'Ce qu’elle contient'],
  [
    ['L’argent', 'Série budgétaire 2019-2027, part de la masse salariale, dépense par élève comparée à l’OCDE.'],
    ['Les élèves qui manquent', 'Projections démographiques à 2035, rentrée 2026, origine de la baisse.'],
    ['Ce que savent les élèves', 'PISA 2022, TIMSS 2023, PIRLS 2021, évaluations nationales 2025.'],
    ['Le poids de l’origine', 'Indices de position sociale public/privé, décrochage, reproduction sociale.'],
    ['Ceux qui font tourner l’école', 'Salaires comparés, âge du corps, formation continue, concours 2025.'],
    ['Les heures qui manquent', 'Remplacement, AESH, santé scolaire.'],
    ['Le temps et les classes', 'Heures d’enseignement, semaines, taille des classes, redoublement.'],
    ['Le climat scolaire', 'Harcèlement, pause numérique, temps d’écran.'],
    ['Ce qui a marché ailleurs', 'Portugal, Pologne, Londres, Suède, Finlande : deux réussites, deux reculs, et aucun modèle transposable tel quel.'],
    ['Pourquoi le niveau baisse', 'Le diagnostic du Haut-commissariat à la Stratégie et au Plan (août 2026), y compris ce qu’il écarte : ni le volume horaire, sauf en sciences, ni les élèves allophones.'],
    ['Comment le jeu note les mesures', 'L’échelle des cadenas, l’écart vitrine/réel, le facteur d’implémentation.'],
  ],
  [3000, 6360],
));
A(BODY([T('Un parti pris à signaler : ', {}), T('quand deux sources officielles se contredisent, les deux sont affichées.', { bold: true }), T(' Le remplacement vaut 4,3 % du temps scolaire selon le Sénat (juin 2025) et 9,3 % au collège-lycée selon la Cour des comptes (décembre 2025). Deux périmètres, un même diagnostic : le désaccord entre sources est une donnée pédagogique, pas une négligence.')]));
A(VIDE());
A(ENCADRE('À relire', 'C’est la partie où votre relecture m’est la plus utile : un chiffre faux ou mal daté dans cet onglet décrédibilise tout le reste. Chaque chiffre est sur une ligne isolée dans le fichier moteur/reperes.js, une correction est immédiate.', '6 · Comprendre le jeu'));

A(H1('7. Usage en formation'));
A(BODY('Le jeu a été conçu pour être joué puis discuté. Les moments les plus productifs observés en conception :'));
A(PUCE('le bilan final, où l’écart entre l’affiché et le réel se lit d’un coup d’œil, c’est le moment de la discussion collective ;'));
A(PUCE('la comparaison de deux parties menées avec des feuilles de route opposées, qui montre que le désaccord politique porte sur les priorités et non sur les faits ;'));
A(PUCE('les panneaux « Comprendre l’effet », qui déconstruisent quinze idées reçues et fonctionnent seuls, même sans jouer ;'));
A(PUCE('l’onglet « Comprendre le jeu », qui donne sourcées les données de cadrage qu’on passe habituellement une demi-journée à rassembler avant une formation.'));
A(BODY('Le jeu tient dans un seul fichier HTML : il peut être déposé sur un ENT, distribué sur clé, ou ouvert hors connexion dans une salle sans réseau.'));
A(VIDE());
A(ENCADRE('À relire', 'Faut-il un livret d’accompagnement pour l’animateur, questions de débriefing, points de vigilance, durée conseillée ? Et faudrait-il une partie courte (une ou deux années) pour un usage en une heure ?', '7 · Usage en formation'));

A(H1('8. Ce que je sais devoir surveiller'));
A(BODY('Pour être complet, voici les points sur lesquels j’ai des doutes et où votre avis tranchera.'));
A(tableau(
  ['Point', 'Le doute'],
  [
    ['La durée', 'Une partie complète dure 45 à 90 minutes. C’est long pour une découverte, court pour une formation d’une demi-journée.'],
    ['Le remaniement aléatoire', 'Fidèle à la réalité, potentiellement frustrant. Actuellement environ 20 % par an, modulé par le capital politique.'],
    ['La voie de l’égalité', 'C’est le compteur le plus difficile à faire monter, et c’est une thèse assumée du jeu. Si elle est vécue comme une impasse plutôt que comme une difficulté, il faut la rendre un peu plus accessible.'],
    ['La densité de texte', 'Chaque carte porte beaucoup d’information. Un joueur pressé lit la tête de carte et ignore le reste ; un joueur curieux lit tout. Le pli est fait pour ça, mais l’équilibre est fragile.'],
    ['L’humour', 'La satire est symétrique par construction, tout le monde y passe, personne n’est nommé. Reste à vérifier qu’elle est perçue comme telle par des personnels du système, qui sont le public visé.'],
    ['Le catalogue à 70 cartes', 'Le catalogue a doublé depuis la première version. Chaque carte est proposée au moins une fois sur l’ensemble des stratégies testées, mais un joueur donné n’en verra qu’une partie. Est-ce une bonne chose (de la rejouabilité) ou de la frustration ?'],
    ['Ce qui n’est pas encore intégré', 'Deux mécaniques restent en attente de votre arbitrage, parce qu’elles ajoutent un système d’événements et non seulement des données : les effets de bord d’une réforme, tirés au sort et révélés deux ans plus tard ; et le choc exogène majeur (pandémie, cyberattaque) tiré une fois par partie. La troisième (l’événement où aucune option n’est bonne) est intégrée depuis votre relecture : c’est l’affaire de l’internat.'],
    ['Les sources bloquées', 'Le réseau de mon environnement de travail bloque education.gouv.fr, senat.fr et oecd.org : les chiffres viennent des extraits indexés de ces documents, pas de leur lecture directe. Les liens du jeu pointent bien vers les originaux, mais une vérification humaine reste utile.'],
  ],
  [2600, 6760],
));
A(VIDE());
A(ENCADRE('À relire', 'Y a-t-il un point qui vous gêne davantage que ceux-ci ? Ou un point de cette liste qui, selon vous, n’en est pas un ?', '8 · Points de vigilance'));

/* ============ 9. RÉCAPITULATIF DES QUESTIONS ============ */
A(new Paragraph({ children: [new PageBreak()] }));
A(H1('9. Toutes les questions, en un seul endroit'));
A(BODY(`Les ${QUESTIONS.length} encadrés gris du document, rassemblés ici pour que vous puissiez y répondre d’une traite si vous préférez. La colonne de droite est vide : elle est à vous. Une réponse d’un mot suffit (« oui », « trop », « à revoir ») je saurai quoi en faire.`));
A(tableau(
  ['N°', 'Où', 'La question', 'Votre réponse'],
  QUESTIONS.map((q) => [String(q.n), q.section, q.texte, '']),
  [560, 1700, 4600, 2500],
));
A(VIDE());
A(BODY([T('Et une dernière, qui n’est dans aucun encadré : ', {}), T('qu’est-ce qui manque ?', { bold: true }), T(' Ce document décrit ce que le jeu fait ; il ne dit pas ce qu’il devrait faire et ne fait pas. Si en le lisant vous pensez à un moment du métier qui n’est pas représenté (un rendez-vous, un acteur, une décision) c’est la remarque qui m’aidera le plus.', {})]));
A(VIDE());
A(ENCADRE('À écrire', 'Ce qui manque au jeu, selon vous :', '9 · Récapitulatif'));

/* ---- pied de document ---- */
A(new Paragraph({ text: '', spacing: { before: 400 } }));
A(new Paragraph({
  border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'D8DAE4' } },
  spacing: { before: 200, after: 120 }, children: [T('')],
}));
A(new Paragraph({ children: [T('Jeu pédagogique indépendant, sans lien avec le ministère de l’Éducation nationale. Les personnages, les organisations syndicales et les titres de presse sont des pseudonymes transparents ; les propositions politiques citées sont réelles et attribuées à leurs auteurs. Code sous licence MIT, contenus sous licence CC BY-SA 4.0.', { size: 18, italics: true, color: '8A8FA3' })], alignment: AlignmentType.JUSTIFIED }));

/* ============================ DOCUMENT ============================ */
const doc = new Document({
  creator: 'Rue de Grenelle',
  title: 'Rue de Grenelle, déroulé du jeu et grandes étapes',
  description: 'Document de travail destiné à la relecture et aux corrections',
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22, color: '1E1F26' }, paragraph: { spacing: { line: 276 } } },
      heading1: { run: { font: 'Calibri', size: 32, bold: true, color: '000091' } },
      heading2: { run: { font: 'Calibri', size: 26, bold: true, color: '1E1F26' } },
      heading3: { run: { font: 'Calibri', size: 23, bold: true, color: '565B6B' } },
    },
  },
  numbering: {
    config: [{
      reference: 'puces',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.18) } } } }],
    }],
  },
  features: { updateFields: true },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: enfants,
  }],
});

Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync(process.argv[2] || 'rue-de-grenelle-deroule.docx', b);
  console.log('écrit :', (b.length / 1024).toFixed(0), 'Ko');
});
