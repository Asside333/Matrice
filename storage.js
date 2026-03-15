'use strict';

/* ================================================================
   MATRICE — storage.js
   Centralise toute la persistance localStorage :
     - matrice_streak    : { count, lastDate: "YYYY-MM-DD" }
     - matrice_favorites : string[]
     - matrice_seen      : { [seenKey]: number[] }
   ================================================================ */

const MatriceStorage = (() => {

  const KEY_STREAK    = 'matrice_streak';
  const KEY_FAVORITES = 'matrice_favorites';
  const KEY_SEEN      = 'matrice_seen';

  // ── Seen indices ───────────────────────────────────────────────

  function _readSeen() {
    try { return JSON.parse(localStorage.getItem(KEY_SEEN) || '{}'); } catch { return {}; }
  }

  function getSeen(key) {
    return _readSeen()[key] || [];
  }

  function saveSeen(key, arr) {
    try {
      const all = _readSeen();
      all[key] = arr;
      localStorage.setItem(KEY_SEEN, JSON.stringify(all));
    } catch {}
  }

  /**
   * Tire un élément unique d'un pool en évitant les répétitions
   * jusqu'à épuisement, puis réinitialise (en gardant le dernier
   * pour éviter la répétition immédiate).
   *
   * @param {Array}  pool    — tableau d'items
   * @param {string} seenKey — clé dans matrice_seen
   * @returns {*} élément tiré
   */
  function pickUnique(pool, seenKey) {
    let seen = getSeen(seenKey);
    let available = pool.map((_, i) => i).filter(i => !seen.includes(i));

    // Tout vu → réinitialiser (garder seulement le dernier pour éviter répétition immédiate)
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

  // ── Streak ─────────────────────────────────────────────────────

  function _todayKey() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  /**
   * Lit le streak. Migre automatiquement l'ancien format
   * (nombre + matrice_last_ritual en toDateString) vers le nouveau.
   * @returns {{ count: number, lastDate: string|null }}
   */
  function getStreak() {
    try {
      const raw = localStorage.getItem(KEY_STREAK);
      if (!raw) return { count: 0, lastDate: null };

      const parsed = JSON.parse(raw);
      // Nouveau format : objet avec count + lastDate
      if (typeof parsed === 'object' && parsed !== null && 'count' in parsed) {
        return { count: parsed.count || 0, lastDate: parsed.lastDate || null };
      }

      // Ancien format : nombre seul (number ou string)
      const count = parseInt(raw, 10) || 0;
      const oldDate = localStorage.getItem('matrice_last_ritual');
      let lastDate = null;
      if (oldDate) {
        const d = new Date(oldDate);
        if (!isNaN(d.getTime())) lastDate = d.toISOString().slice(0, 10);
      }
      // Migration : écrire dans le nouveau format
      const migrated = { count, lastDate };
      localStorage.setItem(KEY_STREAK, JSON.stringify(migrated));
      localStorage.removeItem('matrice_last_ritual');
      return migrated;
    } catch { return { count: 0, lastDate: null }; }
  }

  /**
   * Incrémente le streak si le rituel n'a pas encore été fait aujourd'hui.
   * Si la dernière date n'est pas hier → reset à 1.
   * @returns {number} nouveau count
   */
  function incrementStreak() {
    const today = _todayKey();
    const s = getStreak();
    if (s.lastDate === today) return s.count; // déjà fait aujourd'hui

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const newCount = s.lastDate === yesterday ? s.count + 1 : 1;

    localStorage.setItem(KEY_STREAK, JSON.stringify({ count: newCount, lastDate: today }));
    return newCount;
  }

  // ── Favoris ────────────────────────────────────────────────────

  function getFavorites() {
    try {
      const raw = localStorage.getItem(KEY_FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  function isFavorite(text) {
    return getFavorites().includes(text);
  }

  /**
   * Ajoute ou retire un texte des favoris.
   * @param {string} text
   * @returns {boolean} true si maintenant favori
   */
  function toggleFavorite(text) {
    const favs = getFavorites();
    const idx  = favs.indexOf(text);
    if (idx === -1) {
      favs.push(text);
    } else {
      favs.splice(idx, 1);
    }
    try { localStorage.setItem(KEY_FAVORITES, JSON.stringify(favs)); } catch {}
    return idx === -1;
  }

  // ── Journal d'humeur ───────────────────────────────────────────

  const KEY_HUMEUR_LOG = 'matrice_humeur_log';

  /**
   * Enregistre l'humeur du jour (score 1–5). Remplace si déjà saisi aujourd'hui.
   */
  function saveHumeur(score) {
    const log = getHumeurLog();
    const today = _todayKey();
    const existing = log.findIndex(e => e.date === today);
    if (existing >= 0) {
      log[existing].humeur = score;
    } else {
      log.unshift({ date: today, humeur: score });
    }
    try { localStorage.setItem(KEY_HUMEUR_LOG, JSON.stringify(log.slice(0, 90))); } catch {}
  }

  function getHumeurLog() {
    try { return JSON.parse(localStorage.getItem(KEY_HUMEUR_LOG) || '[]'); } catch { return []; }
  }

  // ── Journal des rituels ────────────────────────────────────────

  const KEY_RITUAL_LOG = 'matrice_ritual_log';

  /**
   * Enregistre un rituel complété (une entrée par jour, remplace si déjà saisi).
   * @param {{ date, humeur, mantra, mantraCategory, intentions, element, elementKey, hexagram, hexagramName }} entry
   */
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

  // ── API publique ───────────────────────────────────────────────

  return {
    // Seen / picking
    getSeen,
    saveSeen,
    pickUnique,
    // Streak
    getStreak,
    incrementStreak,
    // Favoris
    getFavorites,
    isFavorite,
    toggleFavorite,
    // Humeur
    saveHumeur,
    getHumeurLog,
    // Rituels
    saveRitualLog,
    getRitualLog,
  };

})();
