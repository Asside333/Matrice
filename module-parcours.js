'use strict';

/* ================================================================
   MATRICE — Module Parcours
   Streak + spirale dorée, courbe d'humeur SVG, tendances,
   historique des rituels (10), journal du soir (10)
   ================================================================ */

const ModuleParcours = (() => {

  const NS = 'http://www.w3.org/2000/svg';

  // Couleurs humeur 1→5
  const HUMEUR_COLORS = ['', '#2a2a30', '#52525e', '#9A7A2E', '#C8952A', '#FFD700'];

  // Noms des éléments
  const ELEMENT_NAMES = { feu: 'Feu', terre: 'Terre', air: 'Air', eau: 'Eau', ether: 'Éther' };

  // SVG paths pour les éléments (viewBox 0 0 24 24)
  const ELEMENT_PATHS = {
    feu:   'M12 3C10 7 7 10 7 14.5C7 18 9.2 21 12 21C14.8 21 17 18 17 14.5C17 10 14 7 12 3Z',
    terre: 'M3 19L9 8L13 14L17 9L21 19 M3 19L21 19',
    air:   'M3 9Q9 6.5 15 9Q19 10.5 21 9 M3 13Q9 10.5 15 13Q19 14.5 21 13',
    eau:   'M12 3C12 3 5 11 5 15.5C5 19.1 8.1 22 12 22C15.9 22 19 19.1 19 15.5C19 11 12 3 12 3Z',
    ether: 'M12 2l2.09 4.26L18.5 7.27l-3.25 3.17.77 4.48L12 12.77l-4.02 2.15.77-4.48L5.5 7.27l4.41-.01z',
  };

  // ── Utilitaires ────────────────────────────────────────────────

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function last30Days() {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }

  function formatDateShort(dateKey) {
    if (!dateKey) return '';
    try {
      const [y, m, d] = dateKey.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short',
      });
    } catch { return dateKey.slice(5); }
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Crée un icône SVG élément (inline, petit)
  function elementIconSVG(key, size = 14) {
    const path = ELEMENT_PATHS[key];
    if (!path) return '';
    // For air, need multiple paths
    if (key === 'air') {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M3 9Q9 6.5 15 9Q19 10.5 21 9"/><path d="M3 13Q9 10.5 15 13Q19 14.5 21 13"/></svg>`;
    }
    if (key === 'terre') {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 19L9 8L13 14L17 9L21 19"/><line x1="3" y1="19" x2="21" y2="19"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
  }

  // ── Couleurs humeur (dupliqué pour indépendance du module) ────
  const MOOD_COLS_PA = ['', '#5a5a62', '#888899', '#B8860B', '#DAA520', '#FFD700'];

  // ── Spirale saisonnière (Parcours, grande) ────────────────────

  function buildSeasonSpiral(svgContainer, animate) {
    svgContainer.innerHTML = '';

    const { streakConsecutif, streakSaison, season, seasonDays } =
      MatriceStorage.getStreakData();
    const cal   = MatriceStorage.getCalendar();
    const today = new Date().toISOString().slice(0, 10);
    const { cx, cy, a, tStart, tEnd } = SP;
    const n = seasonDays.length;

    // ── Tracé de la spirale ──
    const pathPts = SpiralGold.path(cx, cy, a, tStart, tEnd, 400);
    const d = 'M' + pathPts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L');

    const spiralPath = svgEl('path', {
      d,
      stroke: season.colorTrace,
      'stroke-width': '1.5',
      fill: 'none',
      opacity: '0.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    });
    svgContainer.appendChild(spiralPath);

    // ── Animation stroke-dashoffset ──
    if (animate) {
      try {
        const len = spiralPath.getTotalLength();
        spiralPath.style.strokeDasharray  = len;
        spiralPath.style.strokeDashoffset = len;
        spiralPath.style.transition = 'stroke-dashoffset 2s ease-in-out';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          spiralPath.style.strokeDashoffset = '0';
        }));
      } catch {}
    }

    // ── Points des jours complétés ──
    const todayIdx = seasonDays.indexOf(today);
    const dotDelay = animate ? (1500 / Math.max(n, 1)) : 0;

    seasonDays.forEach((dateStr, i) => {
      if (dateStr > today) return;
      const entry = cal[dateStr];
      if (!entry?.completed) return;

      const [x, y] = SpiralGold.dayPos(cx, cy, a, tStart, tEnd, i, n);
      const isToday = i === todayIdx;

      const dot = svgEl('circle', {
        cx: x.toFixed(2),
        cy: y.toFixed(2),
        r:  isToday ? '4.5' : '3.2',
        fill: MOOD_COLS_PA[entry.mood] || MOOD_COLS_PA[3],
        stroke: isToday ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
        'stroke-width': '0.8',
      });

      if (animate) {
        dot.style.opacity    = '0';
        dot.style.transition = 'opacity 0.25s ease';
        setTimeout(() => { dot.style.opacity = '1'; }, 2100 + i * dotDelay);
      }
      svgContainer.appendChild(dot);
    });

    // ── Texte central ──
    const tCount = svgEl('text', {
      x: cx, y: cy - 4,
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      fill: '#B8860B',
      'font-family': "'Cormorant Garamond', Georgia, serif",
      'font-size': '42',
      'font-weight': '300',
    });
    tCount.textContent = streakConsecutif;
    svgContainer.appendChild(tCount);

    const tLabel = svgEl('text', {
      x: cx, y: cy + 22,
      'text-anchor': 'middle',
      fill: 'rgba(184,134,11,0.65)',
      'font-family': "'DM Sans', sans-serif",
      'font-size': '9',
      'letter-spacing': '2.5',
    });
    tLabel.textContent = 'JOURS';
    svgContainer.appendChild(tLabel);

    const tSeason = svgEl('text', {
      x: cx, y: cy + 38,
      'text-anchor': 'middle',
      fill: 'rgba(184,134,11,0.48)',
      'font-family': "'DM Sans', sans-serif",
      'font-size': '8',
    });
    tSeason.textContent = `${season.name} : ${streakSaison} / ${n} jours`;
    svgContainer.appendChild(tSeason);
  }

  // ── Miniatures des saisons archivées ─────────────────────────

  function buildArchivedSeasons(container) {
    const archived = MatriceStorage.getArchivedSeasons();
    const section  = document.getElementById('pa-archived-section');

    if (archived.length === 0) {
      if (section) section.style.display = 'none';
      return;
    }
    if (section) section.style.removeProperty('display');

    container.innerHTML = '';
    [...archived].reverse().forEach(arc => {
      const card = document.createElement('div');
      card.className = 'pa-season-card';

      // Mini SVG (même viewBox 280×280, réduit par CSS)
      const miniSvg = document.createElementNS(NS, 'svg');
      miniSvg.setAttribute('viewBox', '0 0 280 280');
      miniSvg.setAttribute('class', 'pa-season-mini-svg');
      miniSvg.setAttribute('aria-hidden', 'true');
      miniSvg.setAttribute('overflow', 'visible');

      // Tracé spiral
      const { cx, cy, a, tStart, tEnd } = SP;
      const pathPts = SpiralGold.path(cx, cy, a, tStart, tEnd, 200);
      const d = 'M' + pathPts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L');
      const p = svgEl('path', {
        d,
        stroke: arc.colorTrace,
        'stroke-width': '1.8',
        fill: 'none',
        opacity: '0.4',
        'stroke-linecap': 'round',
      });
      miniSvg.appendChild(p);

      // Dots
      if (arc.calendarData) {
        const seasonDays = MatriceStorage.getSeasonDays({ start: arc.start, end: arc.end });
        const n = seasonDays.length;
        seasonDays.forEach((date, i) => {
          const entry = arc.calendarData[date];
          if (!entry?.completed) return;
          const [x, y] = SpiralGold.dayPos(cx, cy, a, tStart, tEnd, i, n);
          miniSvg.appendChild(svgEl('circle', {
            cx: x.toFixed(2), cy: y.toFixed(2), r: '2.8',
            fill: MOOD_COLS_PA[entry.mood] || MOOD_COLS_PA[3],
          }));
        });
      }

      card.appendChild(miniSvg);

      const info = document.createElement('div');
      info.className = 'pa-season-info';
      const avgStr = arc.avgMood
        ? '★'.repeat(Math.round(arc.avgMood)) + '☆'.repeat(5 - Math.round(arc.avgMood))
        : '—';
      info.innerHTML = `
        <span class="pa-season-name">${escapeHtml(arc.name)} ${arc.start.slice(0, 4)}</span>
        <span class="pa-season-days">${arc.completedDays} / ${arc.totalDays} jours</span>
        <span class="pa-season-mood">${avgStr}</span>
      `;
      card.appendChild(info);
      container.appendChild(card);
    });
  }

  // ── Courbe d'humeur ────────────────────────────────────────────

  function buildMoodCurve(svgContainer) {
    svgContainer.innerHTML = '';

    const days = last30Days();
    const humeurLog = MatriceStorage.getHumeurLog();
    const byDate = {};
    humeurLog.forEach(e => { byDate[e.date] = e.humeur; });

    const W = 300, H = 100;
    const padL = 14, padR = 14, padT = 10, padB = 18;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const xOf = i => padL + (i / 29) * chartW;
    const yOf = h => padT + (5 - h) / 4 * chartH;

    // Grille horizontale subtile
    [1, 2, 3, 4, 5].forEach(h => {
      svgContainer.appendChild(svgEl('line', {
        x1: padL, y1: yOf(h), x2: W - padR, y2: yOf(h),
        stroke: 'rgba(255,255,255,0.04)', 'stroke-width': '1',
      }));
    });

    const pts = days.map((date, i) => {
      const h = byDate[date];
      return h ? { x: xOf(i), y: yOf(h), h, i } : null;
    });
    const valid = pts.filter(Boolean);

    if (valid.length === 0) {
      const t = svgEl('text', {
        x: W / 2, y: H / 2, 'text-anchor': 'middle',
        fill: 'rgba(255,255,255,0.18)', 'font-size': '9',
      });
      t.textContent = 'Continue tes rituels pour voir ta courbe apparaître.';
      svgContainer.appendChild(t);
      return;
    }

    // Dégradé sous la courbe
    const defs = svgEl('defs', {});
    const grad = svgEl('linearGradient', { id: 'pa-mood-grad', x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': '#B8860B', 'stop-opacity': '0.3' }));
    grad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': '#B8860B', 'stop-opacity': '0' }));
    defs.appendChild(grad);
    svgContainer.insertBefore(defs, svgContainer.firstChild);

    if (valid.length >= 2) {
      const areaD = `M${valid[0].x},${H - padB} ` +
        valid.map(p => `L${p.x},${p.y}`).join(' ') +
        ` L${valid[valid.length - 1].x},${H - padB} Z`;
      svgContainer.appendChild(svgEl('path', { d: areaD, fill: 'url(#pa-mood-grad)', stroke: 'none' }));

      svgContainer.appendChild(svgEl('polyline', {
        points: valid.map(p => `${p.x},${p.y}`).join(' '),
        stroke: '#B8860B', 'stroke-width': '1.5', fill: 'none',
        'stroke-linejoin': 'round', 'stroke-linecap': 'round',
      }));
    }

    // Points colorés
    valid.forEach(p => {
      svgContainer.appendChild(svgEl('circle', {
        cx: p.x, cy: p.y, r: '3',
        fill: HUMEUR_COLORS[p.h] || '#555',
        stroke: '#B8860B', 'stroke-width': '0.8',
      }));
    });

    // Petits traits d'axe (1 tous les 7 jours)
    [0, 7, 14, 21, 29].forEach(i => {
      svgContainer.appendChild(svgEl('line', {
        x1: xOf(i), y1: H - padB + 2, x2: xOf(i), y2: H - padB + 5,
        stroke: 'rgba(255,255,255,0.15)', 'stroke-width': '1',
      }));
    });

    // Label "auj." + "-30j"
    const tAuj = svgEl('text', { x: xOf(29), y: H - 2, 'text-anchor': 'middle', fill: 'rgba(255,255,255,0.25)', 'font-size': '7' });
    tAuj.textContent = 'auj.';
    svgContainer.appendChild(tAuj);
    const t30 = svgEl('text', { x: padL, y: H - 2, 'text-anchor': 'start', fill: 'rgba(255,255,255,0.18)', 'font-size': '7' });
    t30.textContent = '−30j';
    svgContainer.appendChild(t30);
  }

  // ── Tendances (3 cartes horizontales) ─────────────────────────

  function buildTendances(container) {
    const log = MatriceStorage.getRitualLog();

    // ── Intention favorite
    const intentionCount = {};
    log.forEach(e => {
      (e.intentions || []).forEach(intent => {
        if (intent) intentionCount[intent] = (intentionCount[intent] || 0) + 1;
      });
    });
    const topIntention = Object.entries(intentionCount).sort((a, b) => b[1] - a[1])[0];

    // ── Élément favori
    const elCount = {};
    log.forEach(e => {
      if (e.elementKey) elCount[e.elementKey] = (elCount[e.elementKey] || 0) + 1;
    });
    const topElement = Object.entries(elCount).sort((a, b) => b[1] - a[1])[0];

    // ── Humeur moyenne
    const humeurs = log.map(e => e.humeur).filter(h => h && h >= 1 && h <= 5);
    const avgHumeur = humeurs.length > 0
      ? Math.round(humeurs.reduce((a, b) => a + b, 0) / humeurs.length)
      : null;

    // Construire les 3 cartes
    const cards = [
      {
        label: 'Intention',
        content: topIntention
          ? `<span class="pa-tend-value">${escapeHtml(topIntention[0])}</span><span class="pa-tend-count">${topIntention[1]}×</span>`
          : `<span class="pa-tend-empty">—</span>`,
      },
      {
        label: 'Élément',
        content: topElement
          ? `<span class="pa-tend-icon">${elementIconSVG(topElement[0], 18)}</span><span class="pa-tend-value pa-tend-value--small">${ELEMENT_NAMES[topElement[0]] || topElement[0]}</span>`
          : `<span class="pa-tend-empty">—</span>`,
      },
      {
        label: 'Humeur moy.',
        content: avgHumeur
          ? `<span class="pa-tend-dot" style="background:${HUMEUR_COLORS[avgHumeur]}"></span><span class="pa-tend-value pa-tend-value--small">${avgHumeur} / 5</span>`
          : `<span class="pa-tend-empty">—</span>`,
      },
    ];

    container.innerHTML = `<div class="pa-tend-row">${
      cards.map(c => `
        <div class="pa-tend-card">
          <div class="pa-tend-label">${c.label}</div>
          <div class="pa-tend-body">${c.content}</div>
        </div>
      `).join('')
    }</div>`;
  }

  // ── Historique rituels (10 derniers) ──────────────────────────

  function buildRitualHistory(container) {
    const log = MatriceStorage.getRitualLog();

    if (log.length === 0) {
      container.innerHTML = '<p class="pa-empty">Complète ton premier rituel pour voir ton historique.</p>';
      return;
    }

    container.innerHTML = '';
    log.slice(0, 10).forEach(entry => {
      const row = document.createElement('div');
      row.className = 'pa-ritual-row';

      const humeurColor = HUMEUR_COLORS[entry.humeur] || '#333';
      const dateLabel   = formatDateShort(entry.date);
      const mantraWords = (entry.mantra || '—').split(' ').slice(0, 5).join(' ');
      const mantraShort = entry.mantra && entry.mantra.split(' ').length > 5
        ? mantraWords + '…'
        : (entry.mantra || '—');
      const elemIcon = entry.elementKey ? elementIconSVG(entry.elementKey, 13) : '';

      row.innerHTML = `
        <span class="pa-rr-date">${escapeHtml(dateLabel)}</span>
        <span class="pa-rr-dot" style="background:${humeurColor}"></span>
        <span class="pa-rr-mantra">${escapeHtml(mantraShort)}</span>
        <span class="pa-rr-elem">${elemIcon}</span>
      `;

      container.appendChild(row);
    });
  }

  // ── Journal du soir (10 dernières) ────────────────────────────

  function buildSoirJournal(container) {
    let entries = [];
    try { entries = JSON.parse(localStorage.getItem('matrice_soir_entries') || '[]'); } catch {}

    if (entries.length === 0) {
      container.innerHTML = '<p class="pa-empty">Scelle une première soirée pour voir ton journal.</p>';
      return;
    }

    container.innerHTML = '';
    entries.slice(0, 10).forEach(entry => {
      const row = document.createElement('div');
      row.className = 'pa-soir-row';

      const dateLabel = formatDateShort(entry.date);
      const grat = entry.gratitude || entry.rapide || '';
      const gratShort = grat.length > 70 ? grat.slice(0, 70) + '…' : grat;

      row.innerHTML = `
        <span class="pa-sr-date">${escapeHtml(dateLabel)}</span>
        <span class="pa-sr-text">${escapeHtml(gratShort || '—')}</span>
      `;
      container.appendChild(row);
    });
  }

  // ── Render ────────────────────────────────────────────────────

  function render(animate) {
    // Spirale saisonnière (grande)
    const spiralSvg = document.getElementById('pa-spiral-svg');
    if (spiralSvg) buildSeasonSpiral(spiralSvg, animate);

    // Saisons archivées
    const archivedEl = document.getElementById('pa-archived-seasons');
    if (archivedEl) buildArchivedSeasons(archivedEl);

    // Courbe d'humeur
    const moodSvg = document.getElementById('pa-mood-svg');
    if (moodSvg) buildMoodCurve(moodSvg);

    // Tendances
    const tendEl = document.getElementById('pa-tendances');
    if (tendEl) buildTendances(tendEl);

    // Rituels
    const ritualEl = document.getElementById('pa-ritual-list');
    if (ritualEl) buildRitualHistory(ritualEl);

    // Journal soir
    const soirEl = document.getElementById('pa-soir-list');
    if (soirEl) buildSoirJournal(soirEl);
  }

  // ── Lifecycle ──────────────────────────────────────────────────

  function onEnter() {
    render(true); // animate = true à chaque ouverture
    const scroll = document.getElementById('pa-scroll');
    if (scroll) scroll.scrollTop = 0;
  }

  function onLeave() {}

  screenHooks.parcours = { onEnter, onLeave };
  return { onEnter, onLeave };
})();
