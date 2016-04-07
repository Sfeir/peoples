//console.log('Hello from service worker !!!');
var dataCacheName = 'peoples-data-v1';
var staticCacheName = 'peoples-static-v1';

var filesToCache = [
  '/offline.html',
  '/img/offline.jpg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
  e.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});




self.addEventListener('fetch', function(e) {
  //console.log('[ServiceWorker] fetch:'+ e.request.url);
  const url=new URL(e.request.url);

  //TODO ES6

  //Simple reponse
  /*e.respondWith(
    new Response('Hello')
  );
  return;
  */

  //Switch all image by cat
  /*if(url.pathname.endsWith('.jpg')){
    e.respondWith(
      fetch('/img/cat.jpg')
    );
  }
  return;
  */

  //Custom 404
  /*e.respondWith(
    fetch(e.request).then(function (response) {
      if(response.status === 404){
        return fetch('/img/404.png');
      }
      return response;
    })
  );
  return;
  */

  //OFFLINE FALLBACK
  /*e.respondWith(
    caches.match(e.request)
      .then(function(response) {
        return response || fetch(e.request);
      })
      .catch(function () {
          return caches.match('/offline.html');
      })
  );*/

  //CACHE FIRST
  /*e.respondWith(
    caches.match(e.request)
      .then(function(response) {
        if(response){
          console.log('[ServiceWorker] fetch from cache:'+ e.request.url);
          return response;
        }
        return fetch(e.request);
      })
  );*/

  //CACHE OR FETCH&CACHE
  /*e.respondWith(
    caches.match(e.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('[ServiceWorker] fetch from cache:'+ e.request.url);
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = e.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            caches.open(staticCacheName)
              .then(function(cache) {
                cache.put(e.request, responseToCache);
              });
            console.log('[ServiceWorker] fetch and add to  cache:'+ e.request.url);
            return response;
          }
        );
      })
  );*/

  //Stale-while-revalidate
  /*e.respondWith(
      caches.match(e.request).then(function(response) {
        var fetchPromise = fetch(e.request).then(function(networkResponse) {
          caches.open(staticCacheName)
            .then(function(cache) {
              cache.put(e.request, networkResponse.clone());
            });
          return networkResponse;
        });
        return response || fetchPromise;
    })
  )*/

});
