'use strict';

/* ================================================================
   MATRICE — storage.js
   Centralise toute la persistance localStorage :
     - matrice_calendar  : { "YYYY-MM-DD": { completed: true, mood: 1-5 } }
     - matrice_seasons   : saisons archivées []
     - matrice_streak    : { count, lastDate } (compat)
     - matrice_favorites : string[]
     - matrice_seen      : { [seenKey]: number[] }
   ================================================================ */

const MatriceStorage = (() => {

  const KEY_STREAK    = 'matrice_streak';
  const KEY_FAVORITES = 'matrice_favorites';
  const KEY_SEEN      = 'matrice_seen';
  const KEY_CALENDAR  = 'matrice_calendar';
  const KEY_SEASONS   = 'matrice_seasons';

  // ── Seen indices ───────────────────────────────────────────────

  function _readSeen() {
    try { return JSON.parse(localStorage.getItem(KEY_SEEN) || '{}'); } catch { return {}; }
  }

  function getSeen(key) { return _readSeen()[key] || []; }

  function saveSeen(key, arr) {
    try {
      const all = _readSeen();
      all[key] = arr;
      localStorage.setItem(KEY_SEEN, JSON.stringify(all));
    } catch {}
  }

  function pickUnique(pool, seenKey) {
    let seen = getSeen(seenKey);
    let available = pool.map((_, i) => i).filter(i => !seen.includes(i));
    if (available.length === 0) {
      const last = seen[seen.length - 1];
      seen = last !== undefined ? [last] : [];
      available = pool.map((_, i) => i).filter(i => !seen.includes(i));
    }
    const idx = available[Math.floor(Math.random() * available.length)];
    seen.push(idx);
    saveSeen(seenKey, seen);
    return pool[idx];
  }

  // ── Date helpers ───────────────────────────────────────────────

  function _todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  // ── Calendrier ────────────────────────────────────────────────

  function getCalendar() {
    try { return JSON.parse(localStorage.getItem(KEY_CALENDAR) || '{}'); } catch { return {}; }
  }

  function _saveCalendar(cal) {
    try { localStorage.setItem(KEY_CALENDAR, JSON.stringify(cal)); } catch {}
  }

  // ── Saisons ───────────────────────────────────────────────────

  /**
   * Renvoie les infos de saison pour une date "YYYY-MM-DD".
   * Printemps : 21 mars → 20 juin
   * Été       : 21 juin → 22 septembre
   * Automne   : 23 septembre → 20 décembre
   * Hiver     : 21 décembre → 20 mars
   */
  function getSeasonForDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);

    if ((m === 3 && d >= 21) || (m > 3 && m < 6) || (m === 6 && d <= 20)) {
      return { name: 'Printemps', key: 'printemps', colorTrace: '#5DCAA5',
               start: `${y}-03-21`, end: `${y}-06-20` };
    }
    if ((m === 6 && d >= 21) || (m > 6 && m < 9) || (m === 9 && d <= 22)) {
      return { name: 'Été', key: 'ete', colorTrace: '#B8860B',
               start: `${y}-06-21`, end: `${y}-09-22` };
    }
    if ((m === 9 && d >= 23) || (m > 9 && m < 12) || (m === 12 && d <= 20)) {
      return { name: 'Automne', key: 'automne', colorTrace: '#B87333',
               start: `${y}-09-23`, end: `${y}-12-20` };
    }
    // Hiver : déc 21 – mars 20
    if (m === 12 && d >= 21) {
      return { name: 'Hiver', key: 'hiver', colorTrace: '#AFA9EC',
               start: `${y}-12-21`, end: `${y + 1}-03-20` };
    }
    return { name: 'Hiver', key: 'hiver', colorTrace: '#AFA9EC',
             start: `${y - 1}-12-21`, end: `${y}-03-20` };
  }

  function getCurrentSeason() {
    return getSeasonForDate(_todayKey());
  }

  /** Renvoie le tableau de toutes les dates "YYYY-MM-DD" d'une saison. */
  function getSeasonDays(season) {
    const days = [];
    let cur = new Date(season.start + 'T12:00:00Z');
    const end = new Date(season.end   + 'T12:00:00Z');
    while (cur <= end) {
      days.push(cur.toISOString().slice(0, 10));
      cur = new Date(cur.getTime() + 86400000);
    }
    return days;
  }

  // ── Calcul des streaks ────────────────────────────────────────

  /**
   * Calcule les deux compteurs depuis matrice_calendar.
   * @returns {{ streakConsecutif, streakSaison, season, seasonDays }}
   */
  function getStreakData() {
    const cal    = getCalendar();
    const today  = _todayKey();
    const season = getCurrentSeason();
    const seasonDays = getSeasonDays(season);

    // Streak saison : jours complétés dans la saison courante (jusqu'à aujourd'hui)
    const streakSaison = seasonDays.filter(d => d <= today && cal[d]?.completed).length;

    // Streak consécutif : jours d'affilée en remontant depuis aujourd'hui (ou hier)
    let streakConsecutif = 0;
    let check = today;
    if (!cal[today]?.completed) {
      check = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    }
    while (cal[check]?.completed) {
      streakConsecutif++;
      check = new Date(new Date(check + 'T12:00:00Z').getTime() - 86400000).toISOString().slice(0, 10);
    }

    return { streakConsecutif, streakSaison, season, seasonDays };
  }

  /**
   * Marque aujourd'hui comme complété (idempotent).
   * Met à jour l'humeur si fournie. Retourne le streak consécutif.
   * @param {number} [mood] 1-5
   */
  function markDayCompleted(mood) {
    const cal   = getCalendar();
    const today = _todayKey();
    const prev  = cal[today] || {};
    cal[today]  = { completed: true, mood: mood || prev.mood || 3 };
    _saveCalendar(cal);

    // Sync matrice_streak pour compat
    const { streakConsecutif } = getStreakData();
    try {
      localStorage.setItem(KEY_STREAK, JSON.stringify({ count: streakConsecutif, lastDate: today }));
    } catch {}
    return streakConsecutif;
  }

  // ── Streak (backward compat) ──────────────────────────────────

  /**
   * Lit le streak. Priorité au calendrier, fallback sur l'ancien format.
   * @returns {{ count: number, lastDate: string|null }}
   */
  function getStreak() {
    const cal = getCalendar();
    if (Object.keys(cal).length > 0) {
      const { streakConsecutif } = getStreakData();
      return { count: streakConsecutif, lastDate: _todayKey() };
    }
    // Fallback ancien format
    try {
      const raw = localStorage.getItem(KEY_STREAK);
      if (!raw) return { count: 0, lastDate: null };
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null && 'count' in parsed) {
        return { count: parsed.count || 0, lastDate: parsed.lastDate || null };
      }
      const count = parseInt(raw, 10) || 0;
      const oldDate = localStorage.getItem('matrice_last_ritual');
      let lastDate = null;
      if (oldDate) {
        const d = new Date(oldDate);
        if (!isNaN(d.getTime())) lastDate = d.toISOString().slice(0, 10);
      }
      const migrated = { count, lastDate };
      localStorage.setItem(KEY_STREAK, JSON.stringify(migrated));
      localStorage.removeItem('matrice_last_ritual');
      return migrated;
    } catch { return { count: 0, lastDate: null }; }
  }

  /**
   * Incrémente le streak (marque aujourd'hui complété).
   * @param {number} [mood] 1-5
   * @returns {number} streak consécutif
   */
  function incrementStreak(mood) {
    return markDayCompleted(mood);
  }

  // ── Saisons archivées ─────────────────────────────────────────

  function getArchivedSeasons() {
    try { return JSON.parse(localStorage.getItem(KEY_SEASONS) || '[]'); } catch { return []; }
  }

  /**
   * Détecte les dates du calendrier appartenant à des saisons passées
   * et les archive si elles ne le sont pas encore.
   */
  function archiveSeasonIfNeeded() {
    const cal = getCalendar();
    const allDates = Object.keys(cal).sort();
    if (allDates.length === 0) return;

    const currentSeason = getCurrentSeason();
    const archived = getArchivedSeasons();
    const archivedKeys = new Set(archived.map(a => a.seasonKey));

    // Regrouper les dates passées par saison
    const seasonMap = {};
    allDates.forEach(d => {
      if (d >= currentSeason.start && d <= currentSeason.end) return;
      if (d > currentSeason.end) return;
      const s = getSeasonForDate(d);
      const key = `${s.start}_${s.key}`;
      if (!seasonMap[key]) seasonMap[key] = { season: s, dates: [] };
      seasonMap[key].dates.push(d);
    });

    let changed = false;
    Object.entries(seasonMap).forEach(([key, { season, dates }]) => {
      if (archivedKeys.has(key)) return;
      const seasonDays  = getSeasonDays(season);
      const completed   = dates.filter(d => cal[d]?.completed);
      const moods       = completed.map(d => cal[d]?.mood).filter(Boolean);
      const avgMood     = moods.length
        ? +(moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1)
        : null;

      archived.push({
        seasonKey:     key,
        name:          season.name,
        colorTrace:    season.colorTrace,
        start:         season.start,
        end:           season.end,
        totalDays:     seasonDays.length,
        completedDays: completed.length,
        avgMood,
        calendarData:  Object.fromEntries(dates.map(d => [d, cal[d]])),
      });
      changed = true;
    });

    if (changed) {
      try { localStorage.setItem(KEY_SEASONS, JSON.stringify(archived)); } catch {}
    }
  }

  // ── Migration depuis anciens logs ─────────────────────────────

  /**
   * Peuple matrice_calendar depuis matrice_ritual_log si le calendrier est vide.
   * Si les deux sont vides → injecte 15 jours de données test pour le rendu.
   */
  function migrateFromLogs() {
    const cal = getCalendar();
    if (Object.keys(cal).length > 0) return; // déjà des données

    const ritualLog = getRitualLog();
    const humeurLog = getHumeurLog();
    const humeurByDate = {};
    humeurLog.forEach(e => { humeurByDate[e.date] = e.humeur; });

    if (ritualLog.length > 0) {
      // Migration depuis les anciens logs
      ritualLog.forEach(entry => {
        if (!entry.date) return;
        const mood = entry.humeur || humeurByDate[entry.date] || 3;
        cal[entry.date] = { completed: true, mood };
      });
      _saveCalendar(cal);
      return;
    }

    // Aucune donnée → injecter des données de test
    const today = new Date();
    const testMoods = [3, 5, 4, 3, 5, 4, 2, 4, 5, 3, 4, 5, 3, 4, 5];
    let moodIdx = 0;
    for (let i = 14; i >= 0; i--) {
      if (i === 9 || i === 5) { moodIdx++; continue; } // 2 jours sautés
      const d = new Date(today.getTime() - i * 86400000);
      const dateStr = d.toISOString().slice(0, 10);
      cal[dateStr] = { completed: true, mood: testMoods[moodIdx % testMoods.length] };
      moodIdx++;
    }
    _saveCalendar(cal);
  }

  // ── Journal d'humeur ──────────────────────────────────────────

  const KEY_HUMEUR_LOG = 'matrice_humeur_log';

  function saveHumeur(score) {
    const log   = getHumeurLog();
    const today = _todayKey();
    const existing = log.findIndex(e => e.date === today);
    if (existing >= 0) {
      log[existing].humeur = score;
    } else {
      log.unshift({ date: today, humeur: score });
    }
    try { localStorage.setItem(KEY_HUMEUR_LOG, JSON.stringify(log.slice(0, 90))); } catch {}

    // Mémoriser l'humeur dans le calendrier (sans marquer comme complété)
    const cal = getCalendar();
    if (!cal[today]) cal[today] = {};
    cal[today].mood = score;
    _saveCalendar(cal);
  }

  function getHumeurLog() {
    try { return JSON.parse(localStorage.getItem(KEY_HUMEUR_LOG) || '[]'); } catch { return []; }
  }

  // ── Journal des rituels ───────────────────────────────────────

  const KEY_RITUAL_LOG = 'matrice_ritual_log';

  function saveRitualLog(entry) {
    const log = getRitualLog();
    const existing = log.findIndex(e => e.date === entry.date);
    if (existing >= 0) {
      log[existing] = { ...log[existing], ...entry };
    } else {
      log.unshift(entry);
    }
    try { localStorage.setItem(KEY_RITUAL_LOG, JSON.stringify(log.slice(0, 90))); } catch {}
  }

  function getRitualLog() {
    try { return JSON.parse(localStorage.getItem(KEY_RITUAL_LOG) || '[]'); } catch { return []; }
  }

  // ── Favoris ───────────────────────────────────────────────────

  function getFavorites() {
    try {
      const raw = localStorage.getItem(KEY_FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function isFavorite(text) { return getFavorites().includes(text); }

  function toggleFavorite(text) {
    const favs = getFavorites();
    const idx  = favs.indexOf(text);
    if (idx === -1) { favs.push(text); } else { favs.splice(idx, 1); }
    try { localStorage.setItem(KEY_FAVORITES, JSON.stringify(favs)); } catch {}
    return idx === -1;
  }

  // ── API publique ──────────────────────────────────────────────

  return {
    // Seen / picking
    getSeen, saveSeen, pickUnique,
    // Calendrier et saisons
    getCalendar, markDayCompleted,
    getStreakData, getCurrentSeason, getSeasonForDate, getSeasonDays,
    getArchivedSeasons, archiveSeasonIfNeeded, migrateFromLogs,
    // Streak (compat)
    getStreak, incrementStreak,
    // Favoris
    getFavorites, isFavorite, toggleFavorite,
    // Humeur
    saveHumeur, getHumeurLog,
    // Rituels
    saveRitualLog, getRitualLog,
  };

})();
