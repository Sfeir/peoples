console.log('We cache offline page if we are in offline mode');

var staticCacheName = 'peoples-static-v1';

var filesToCache = [
    '/offline.html',
    '/img/offline.jpg'
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    self.skipWaiting();
    e.waitUntil(
        caches.open(staticCacheName)
            .then(function(cache) {
                console.log('[ServiceWorker] Caching Offline page');
                return cache.addAll(filesToCache);
            })
            .catch(function() {
                console.log('INSTALL ERROR');
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
            .catch(function() {
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
            })
    );
});
