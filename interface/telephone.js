/* ============================================================================
   THÈME « LE TÉLÉPHONE DU MINISTRE » — la coque et les gestes.

   Ce fichier est ajouté APRÈS app.js dans l'assemblage « téléphone ». Il ne
   modifie ni le moteur ni app.js : il construit une coque autour des zones
   existantes (#scene, #suite), LIT le bandeau et le calendrier classiques
   (cachés par la feuille de style) pour remplir l'horloge et le widget des
   curseurs, et ajoute le balayage sur les cartes et les fiches à deux choix.
   Frontière étanche : aucune donnée de jeu n'est calculée ici, tout est lu
   dans le DOM que le thème classique produit déjà.
   ========================================================================== */
(function () {
  document.body.classList.add('telephone');
  const $t = (s, r) => (r || document).querySelector(s);
  const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const mouvementReduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- la coque ------------------------------------------------------------ */
  const fond = mk('div', 'tel-fond');
  const coque = mk('div', 'tel-coque');
  const ecran = mk('div', 'tel-ecran');
  const statut = mk('div', 'tel-statut', '<span class="heure">juin 2027</span><span class="reseau">▮▮▮ ⌁ 94%</span>');
  const horloge = mk('div', 'tel-horloge', '<div class="l1">Rue de Grenelle</div><div class="l2">2027</div><div class="l3">Juin. Le gouvernement se forme.</div>');
  const curseurs = mk('div', 'tel-curseurs'); curseurs.hidden = true;
  const alerte = mk('div', 'tel-alerte'); alerte.hidden = true;
  const pile = mk('div', 'tel-pile');
  const pileTete = mk('div', 'tel-pile-tete'); pileTete.hidden = true;
  const pied = mk('div', 'tel-pied');

  const scene = $t('#scene'), suite = $t('#suite');
  pile.append(pileTete, scene);
  const noteBtn = mk('button', 'btn-borde', 'Demander une note<br>à la DGESCO');
  noteBtn.setAttribute('aria-haspopup', 'dialog');
  noteBtn.onclick = () => ouvrirNote();
  pied.append(suite, noteBtn);
  $t('#suite-ctx', suite).classList.add('contexte');
  ecran.append(statut, horloge, curseurs, alerte, pile, pied);
  coque.appendChild(ecran); fond.appendChild(coque);
  document.body.insertBefore(fond, document.body.firstChild);

  /* --- la note de la DGESCO ------------------------------------------------
     Deux temps : on choisit un sujet, la note arrive. C'est la seule façon de
     rendre les onze fiches de référence consultables sur un écran de 390 px —
     et c'est aussi le vrai fonctionnement d'un cabinet : on ne lit pas la
     documentation, on la demande. */
  const note = mk('div', 'tel-note');
  note.hidden = true;
  note.setAttribute('role', 'dialog'); note.setAttribute('aria-modal', 'true');
  note.setAttribute('aria-label', 'Demander une note à la DGESCO');
  note.innerHTML = '<div class="tel-note-tete">'
    + '<div><div class="src">Direction générale de l’enseignement scolaire</div>'
    + '<div class="titre">Note à la DGESCO</div></div>'
    + '<button class="fermer" type="button">Fermer</button></div>'
    + '<div class="tel-note-corps"></div>';
  ecran.appendChild(note);
  const noteCorps = $t('.tel-note-corps', note);
  $t('.fermer', note).onclick = () => fermerNote();

  function listeSujets() {
    noteCorps.innerHTML = '';
    noteCorps.appendChild(mk('p', 'tel-note-question', 'Sur quel sujet ?'));
    const liste = mk('div', 'tel-note-liste');
    (typeof REPERES !== 'undefined' ? REPERES : []).forEach((r) => {
      const b2 = mk('button', 'tel-sujet', `<b>${r.titre}</b><span>${r.resume}</span>`);
      b2.type = 'button';
      b2.onclick = () => afficherNote(r.cle);
      liste.appendChild(b2);
    });
    noteCorps.appendChild(liste);
    noteCorps.appendChild(mk('p', 'tel-note-pied', 'Onze notes tenues à jour par la direction générale. Elles sont sourcées, elles sont exactes, et personne ne les lit jamais.'));
    noteCorps.scrollTop = 0;
    const p1 = $t('.tel-sujet', noteCorps); if (p1) p1.focus();
  }
  function afficherNote(cle) {
    noteCorps.innerHTML = '';
    const retour = mk('button', 'tel-retour', '← Choisir un autre sujet');
    retour.type = 'button'; retour.onclick = listeSujets;
    noteCorps.appendChild(retour);
    const fiche = mk('div', 'tel-note-fiche');
    if (typeof blocReperes === 'function') fiche.appendChild(blocReperes([cle], [cle]));
    fiche.appendChild(mk('p', 'remise', 'Note remise en trois jours. Vous êtes la première personne à l’ouvrir.'));
    noteCorps.appendChild(fiche);
    noteCorps.scrollTop = 0;
    retour.focus();
  }
  let rendreLeFocus = null;
  function ouvrirNote() {
    rendreLeFocus = document.activeElement;
    note.hidden = false;
    noteBtn.setAttribute('aria-expanded', 'true');
    listeSujets();
  }
  function fermerNote() {
    note.hidden = true;
    noteBtn.setAttribute('aria-expanded', 'false');
    if (rendreLeFocus && rendreLeFocus.focus) rendreLeFocus.focus();
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !note.hidden) { e.stopPropagation(); fermerNote(); } }, true);

  /* --- l'horloge : lue dans le calendrier classique ----------------------- */
  function majHorloge() {
    const f = $t('#frise');
    const l1 = $t('.l1', horloge), l2 = $t('.l2', horloge), l3 = $t('.l3', horloge);
    if (!f || f.hidden) return;
    const ans = [...f.querySelectorAll('.frise-an')];
    const iAn = ans.findIndex((a) => a.classList.contains('courant'));
    const anCourant = ans[iAn];
    const bilan = anCourant && /Bilan/.test(anCourant.textContent);
    const ici = $t('.frise-pas li.ici', f);
    const mois = ici ? $t('.mois', ici).textContent.trim() : (bilan ? 'Bilan' : 'Juin');
    const quoi = ici && $t('.quoi', ici) ? $t('.quoi', ici).textContent.trim() : '';
    const an = bilan ? 5 : Math.max(1, iAn + 1);
    const civ = anCourant ? $t('.num', anCourant).textContent.trim() : '2027‑28';
    l1.textContent = bilan ? 'Fin de mandat' : `An ${an} / 5 · ${civ}`;
    l2.textContent = mois;
    const reste = 5 - an;
    l3.textContent = bilan ? 'Le déménageur est en bas.' : `${quoi}${quoi ? ' · ' : ''}${reste === 0 ? 'dernière année du mandat' : reste + ' an' + (reste > 1 ? 's' : '') + ' avant la fin du mandat'}`;
    l3.classList.toggle('fin', reste === 0 || bilan);
    $t('.reseau', statut).textContent = `▮▮▮ ⌁ ${Math.max(6, 94 - (an - 1) * 18)}%`;
  }

  /* --- les curseurs : lus dans le bandeau classique ------------------------ */
  const precedent = {};
  function majCurseurs() {
    const hud = $t('#hud');
    if (!hud || hud.hidden) { curseurs.hidden = true; alerte.hidden = true; return; }
    curseurs.hidden = false;
    const date = $t('#hud-date'); if (date) $t('.heure', statut).textContent = date.textContent;
    const jauges = [...hud.querySelectorAll('.jauge.grande')];
    const sous = [...hud.querySelectorAll('#hud-sous b')];
    const capital = sous[0] ? sous[0].textContent.trim() : '';
    const cols = jauges.map((j) => {
      const nom = $t('.nom span', j).textContent.trim();
      const v = parseFloat($t('.nom b', j).textContent.replace(',', '.'));
      const rail = $t('.rail i', j);
      return { nom, v, w: rail ? rail.style.width : '0%', c: rail ? rail.style.background : '', delta: $t('.delta', j) ? $t('.delta', j).textContent.trim() : '' };
    });
    if (!curseurs.childElementCount) {
      curseurs.innerHTML = '<div class="titre">Vos curseurs</div><div class="rangee"></div>';
    }
    const rangee = $t('.rangee', curseurs);
    const cle = cols.map((c) => c.nom).join('|') + '|capital';
    if (rangee.dataset.cle !== cle) {
      rangee.dataset.cle = cle;
      const court = (n) => ({ 'Santé du système': 'Santé', 'Paix sociale': 'Paix', 'Réussite': 'Réussite', 'Inégalités': 'Inégalités', 'Salaires': 'Salaires' })[n] || n;
      rangee.innerHTML = cols.map((c) => `<div class="col"><div class="v"><span class="n"></span><span class="delta"></span></div><div class="l" title="${c.nom}">${court(c.nom)}</div><div class="jauge-t"><i></i></div></div>`).join('')
        + '<div class="col large"><div class="v"><span class="n"></span></div><div class="l">Capital</div></div>';
    }
    const colsDom = [...rangee.querySelectorAll('.col')];
    cols.forEach((c, i) => {
      const col = colsDom[i], n = $t('.n', col), d = $t('.delta', col), i2 = $t('.jauge-t i', col);
      const mauvais = /in[ée]galit/i.test(c.nom) ? c.v > 60 : c.v < 30;
      $t('.v', col).classList.toggle('mauvais', mauvais);
      i2.style.width = c.w; i2.style.background = c.c;
      animerNombre(n, precedent[c.nom], c.v, () => {
        if (precedent[c.nom] !== undefined && Math.round(precedent[c.nom]) !== Math.round(c.v)) {
          const dd = Math.round(c.v) - Math.round(precedent[c.nom]);
          d.textContent = (dd > 0 ? '▲' : '▼') + Math.abs(dd);
          d.className = 'delta visible ' + (dd > 0 ? 'up' : 'down');
          $t('.v', col).classList.remove('pulse'); void $t('.v', col).offsetWidth; $t('.v', col).classList.add('pulse');
          setTimeout(() => d.classList.remove('visible'), 1200);
        }
        precedent[c.nom] = c.v;
      });
    });
    const cap = colsDom[cols.length];
    if (cap) { $t('.n', cap).textContent = capital; $t('.v', cap).classList.toggle('bon', parseFloat(capital) >= 25); }
    /* l'alerte du cabinet devient une notification sourde */
    const a = $t('#hud-alertes');
    if (a && !a.hidden && a.textContent.trim()) {
      const t = $t('.alerte-hud b.t', a), s = $t('.alerte-hud span', a);
      alerte.hidden = false;
      alerte.innerHTML = `<div class="src">Votre cabinet · ${t ? t.textContent.trim() : 'alerte'}</div><div class="corps">${s ? s.innerHTML : a.innerHTML}</div>`;
    } else alerte.hidden = true;
  }
  function animerNombre(el, de, a, fin) {
    if (de === undefined || mouvementReduit() || Math.round(de) === Math.round(a)) { el.textContent = Math.round(a); fin(); return; }
    const t0 = performance.now(), d0 = Math.round(de), d1 = Math.round(a);
    const pas = (t) => { const k = Math.min(1, (t - t0) / 600); el.textContent = Math.round(d0 + (d1 - d0) * k); if (k < 1) requestAnimationFrame(pas); else fin(); };
    requestAnimationFrame(pas);
  }

  /* --- le balayage --------------------------------------------------------- */
  function glisser(el, actions) {
    let x0 = null, t0 = 0, dx = 0, actif = false, bouge = false;
    const w = () => el.offsetWidth || 1;
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('button, select, input, a, summary, textarea')) return;
      x0 = e.clientX; t0 = performance.now(); actif = true; bouge = false;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* sans capture, le glisser reste possible */ }
      el.classList.add('glisse');
    });
    el.addEventListener('pointermove', (e) => {
      if (!actif) return;
      dx = e.clientX - x0;
      if (Math.abs(dx) > 6) bouge = true;
      if (!mouvementReduit()) el.style.transform = `translateX(${dx}px) rotate(${Math.max(-8, Math.min(8, dx / 20))}deg)`;
      const r = dx / w();
      el.classList.toggle('vise-g', r < -0.15); el.classList.toggle('vise-d', r > 0.15);
      if (actions.viser) actions.viser(r);
    });
    const fin = () => {
      if (!actif) return; actif = false; el.classList.remove('glisse');
      const vitesse = Math.abs(dx) / Math.max(1, performance.now() - t0);
      const seuil = Math.abs(dx) > w() * 0.35 || (vitesse > 0.5 && Math.abs(dx) > 24);
      el.classList.remove('vise-g', 'vise-d'); if (actions.viser) actions.viser(0);
      if (seuil) sortir(dx > 0 ? 'd' : 'g');
      else el.style.transform = '';
      dx = 0;
    };
    const sortir = (sens) => {
      const duree = mouvementReduit() ? 120 : 220;
      el.classList.add('sortie');
      if (!mouvementReduit()) el.style.transform = `translateX(${sens === 'd' ? 120 : -120}%) rotate(${sens === 'd' ? 8 : -8}deg)`;
      setTimeout(() => { el.classList.remove('sortie'); el.style.transform = ''; (sens === 'd' ? actions.droite : actions.gauche)(); }, duree);
    };
    el.addEventListener('pointerup', fin); el.addEventListener('pointercancel', fin);
    el.addEventListener('click', (e) => { if (bouge) { e.stopPropagation(); e.preventDefault(); bouge = false; } }, true);
    el.addEventListener('keydown', (e) => {
      if (e.target !== el && !e.target.classList.contains('doc')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); sortir('d'); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); sortir('g'); }
    });
    return { sortir };
  }

  /* --- habiller chaque écran ---------------------------------------------- */
  let dernierEcran = null;
  function habillerScene() {
    /* On ne remonte en haut qu'au changement d'écran, pas à chaque ajout. */
    const marque = scene.firstElementChild;
    if (marque !== dernierEcran) {
      dernierEcran = marque; pile.scrollTop = 0;
      pied.querySelectorAll('.atelier-pied').forEach((n) => n.remove());
    }
    const type = (typeof ETAT !== 'undefined' && ETAT.typeEcran) || '';

    /* Les blocs de choix d'une décision sortent de la fiche pour se poser sur
       le noir : c'est la charte, et surtout c'est ce qui les rend lisibles —
       à l'intérieur du papier, le texte clair des blocs devenait invisible.
       Les questions d'entretien et de plateau, elles, restent dans le papier
       (un formulaire), et prennent la variante « papier ». */
    scene.querySelectorAll('.opts').forEach((g) => {
      if (g.dataset.place) return; g.dataset.place = '1';
      if (g.closest('.entretien-q, .plateau-q, .flechage-liste')) { g.classList.add('sur-papier'); return; }
      const doc = g.closest('.doc');
      if (!doc) return;
      let apres = doc, n = g;
      while (n && n.parentElement !== doc) n = n.parentElement;
      const suiteDoc = [];
      for (let q = n; q; q = q.nextElementSibling) suiteDoc.push(q);
      for (const x of suiteDoc) { apres.after(x); apres = x; }
    });
    scene.querySelectorAll('.opts').forEach((g) => {
      if (g.dataset.tel) return; g.dataset.tel = '1';
      const opts = [...g.querySelectorAll(':scope > .opt')];
      const deux = opts.length === 2 && !g.classList.contains('sur-papier');
      g.classList.toggle('deux', deux);
      if (!g.classList.contains('sur-papier')) {
        opts.forEach((o, i) => {
          const s = mk('span', 'surtitre', deux ? (i === 0 ? '← Glisser' : 'Glisser →') : `Choix ${i + 1}`);
          o.insertBefore(s, o.firstChild);
        });
      }
      if (deux) {
        const doc = g.previousElementSibling && g.previousElementSibling.classList.contains('doc') ? g.previousElementSibling : g.parentElement;
        doc.tabIndex = doc.tabIndex >= 0 ? doc.tabIndex : -1;
        glisser(doc, {
          gauche: () => opts[0].click(), droite: () => opts[1].click(),
          viser: (r) => { opts[0].classList.toggle('vise', r < -0.15); opts[1].classList.toggle('vise', r > 0.15); },
        });
      }
    });

    /* l'atelier : le solde, la pile de cartes et le bouton sortent du papier
       pour se poser sur le noir — ce sont les notifications, pas la fiche */
    const grille = $t('.grille-cartes', scene);
    if (grille && grille.closest('.doc')) {
      const doc = grille.closest('.doc');
      const solde = $t('.solde', doc), actions = $t('.actions', doc);
      const apres = [solde, grille, actions].filter(Boolean);
      let ref = doc;
      for (const n of apres) { ref.after(n); ref = n; }
      grille.before(pileTete);
    }
    const cartes = [...scene.querySelectorAll('.grille-cartes .carte')];
    if (cartes.length) {
      cartes.forEach((c, i) => {
        if (c.dataset.tel) return; c.dataset.tel = '1';
        c.appendChild(mk('span', 'numero', String(i + 1).padStart(2, '0')));
        c.appendChild(mk('span', 'indice-glisse g', 'Classer'));
        c.appendChild(mk('span', 'indice-glisse d', 'Signer'));
        const retenir = () => { const b = $t('.btn-retenir', c); if (b) b.click(); };
        glisser(c, {
          droite: () => { if (!c.classList.contains('sel')) retenir(); majPileTete(); },
          gauche: () => { if (c.classList.contains('sel')) retenir(); else c.classList.add('ecartee'); majPileTete(); },
        });
      });
      /* Le bouton de validation rejoint la barre du bas : l'action principale
         est toujours au même endroit, et elle ne recouvre plus le solde. */
      const actions = $t('#scene .actions');
      if (actions && !actions.classList.contains('atelier-pied')) {
        actions.classList.add('atelier-pied');
        pied.insertBefore(actions, noteBtn);
      }
      pileTete.hidden = false; majPileTete();
    } else { pileTete.hidden = true; pile.insertBefore(pileTete, scene); }

    /* le tampon URGENT sur ce qui brûle */
    if (/^(affaire|polemique|dossier|retrait|guerre_scolaire)$/.test(type)) {
      const e = $t('.doc .entete-doc', scene);
      if (e && !$t('.tampon-urgent', e)) e.appendChild(mk('span', 'tampon-urgent', 'Urgent'));
    }
  }
  function majPileTete() {
    const n = scene.querySelectorAll('.grille-cartes .carte:not(.ecartee)').length;
    const s = scene.querySelectorAll('.grille-cartes .carte.sel').length;
    pileTete.innerHTML = `<span class="g">${n} notification${n > 1 ? 's' : ''}${s ? ` · ${s} signée${s > 1 ? 's' : ''}` : ''}</span><span class="d">Glissez pour trancher</span>`;
    if (n === 0 && !$t('.tel-vide', scene)) {
      const g = $t('.grille-cartes', scene);
      if (g) g.appendChild(mk('div', 'tel-vide', 'La pile est vide. Signez, ou passez : demain sera pire.'));
    }
  }

  /* --- observation : le thème suit ce que le jeu affiche ------------------
     `subtree` est nécessaire : le plateau de 20 heures ajoute ses questions
     une par une DANS un bloc existant. habillerScene est idempotente (chaque
     élément traité porte une marque), et l'appel est groupé sur une frame
     pour ne pas se déclencher à chaque nœud d'une même vague. */
  let attendu = false;
  const habillerBientot = () => { if (attendu) return; attendu = true; requestAnimationFrame(() => { attendu = false; habillerScene(); }); };
  new MutationObserver(habillerBientot).observe(scene, { childList: true, subtree: true });
  const hud = $t('#hud'), frise = $t('#frise');
  if (hud) new MutationObserver(majCurseurs).observe(hud, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  if (frise) new MutationObserver(majHorloge).observe(frise, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  habillerScene(); majCurseurs(); majHorloge();
})();
