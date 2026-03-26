const CACHE_NAME = 'os-edu-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './data/lessons.js',
  './assets/cpu-diagram.svg',
  './assets/icon.svg',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { if(key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(fetchResp => {
      return caches.open(CACHE_NAME).then(cache => {
        try{ cache.put(event.request, fetchResp.clone()); }catch(e){}
        return fetchResp;
      })
    }))
  );
});
