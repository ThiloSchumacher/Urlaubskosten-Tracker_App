const CACHE_NAME = 'urlaubsapp-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Beim Installieren alle Dateien herunterladen und cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Dateien werden gecached...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Bei jeder Anfrage: zuerst im Cache nachsehen, sonst online laden
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Alte Caches löschen, wenn eine neue Version kommt
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});