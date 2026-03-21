/* ================================================================
   MATRICE — Service Worker
   Cache offline, stratégie Cache-First
   ================================================================ */

const CACHE_NAME = 'matrice-v24';

// Fichiers à mettre en cache à l'installation
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './storage.js',
  './app.js',
  './manifest.json',
  './module2.js',
  './module3.js',
  './data/mantras.js',
  './data/transmutations.js',
  './data/visualisations.js',
  './data/sorts.js',
  './data/yiking.js',
  './data/closings.js',
  './module4.js',
  './module5.js',
  './module6.js',
  './module-sos.js',
  './module-libre.js',
  './data/soir-phrases.js',
  './module-soir.js',
  './module-humeur.js',
  './module-parcours.js',
  './module-parametres.js',
  './module-nuit.js',
  './module-lune-overlay.js',
  './data/citations.js',
  './data/moon.js',
  // Google Fonts sont mis en cache dynamiquement (voir fetch handler)
];

// ── Installation : mise en cache des ressources statiques ────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activation : nettoyage des anciens caches ─────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch : Cache-First pour les assets, Network-First pour le reste ─
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorer les requêtes non-GET et les extensions de navigateur
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Stratégie Cache-First pour les assets locaux
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => {
          if (cached) return cached;

          return fetch(event.request)
            .then(response => {
              // Ne mettre en cache que les réponses valides
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              const toCache = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
              return response;
            })
            .catch(() => {
              // Fallback offline : retourner index.html pour les navigations
              if (event.request.destination === 'document') {
                return caches.match('./index.html');
              }
            });
        })
    );
    return;
  }

  // Stratégie Cache-First pour Google Fonts (cross-origin)
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => {
          if (cached) return cached;

          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200) return response;

              const toCache = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
              return response;
            })
            .catch(() => new Response('', { status: 408 }));
        })
    );
  }
});
