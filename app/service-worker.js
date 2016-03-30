//console.log('Hello from service worker !!!');
var dataCacheName = 'peoples-data-v1';
var staticCacheName = 'peoples-static-v1';

var filesToCache = [
  "/shell.html",
  "/bootstrap/dist/css/bootstrap.css",
  "/css/app.css",
  "/css/animation.css",
  "/css/md-overwrite.css",
  "/angular-material/angular-material.css",
  "/angular/angular.min.js",
  "/angular-route/angular-route.min.js",
  "/angular-animate/angular-animate.min.js",
  "/angular-aria/angular-aria.min.js",
  "/angular-messages/angular-messages.min.js",
  "/angular-material/angular-material.min.js",
  "/js/app.module.js",
  "/js/app.config.js",
  "/js/list/list.module.js",
  "/js/list/list.controller.js",
  "/js/home/home.module.js",
  "/js/home/home.controller.js",
  "/js/details/details.module.js",
  "/js/details/details.controller.js",
  "/js/skills/skills.module.js",
  "/js/skills/skills.controller.js",
  "/js/components/components.module.js",
  "/js/components/services/people.service.js",
  "/js/components/filters/capitalize.js",
  "/js/components/filters/checkmark.js",
  "/js/components/directives/scroll.js",
  "/js/components/directives/errSrc.js",
  "/js/components/directives/focus.js",
  "/js/components/directives/people-card/people-card.js",
  "/js/components/directives/search-bar/search-bar.js",
  "/img/bg_left.png",
  "/img/bg_right.png",
  "/img/logo-sfeir.svg",
  "/img/md-cellphone.svg",
  "/img/md-email.svg",
  "/img/md-github.svg",
  "/img/md-linkedin.svg",
  "/img/md-map.svg",
  "/img/md-phone.svg",
  "/img/md-slack.svg",
  "/img/md-twitter.svg",
  "/img/profile.svg",
  "/img/search.svg"
];


self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  //TO FORCE UPDATE
  e.waitUntil(
    self.skipWaiting().then(function () {
      caches.open(staticCacheName).then(function(cache) {
        console.log('[ServiceWorker] Caching App Shell');
        return cache.addAll(filesToCache);
      })
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activation- update cache');
  e.waitUntil(
    self.clients.claim().then(function () {
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== staticCacheName) {
            return caches.delete(key);
          }
        }));
      })
    })
  );
});


self.addEventListener('fetch', function(e) {
  //console.log('[ServiceWorker] fetch:'+ e.request.url);
  const url=new URL(e.request.url);


  if(url.origin== 'http://api.randomuser.me'){
    e.respondWith(handleUserPictureRequest(e));
    return;
  }


  //Serve static resources
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if(response){
        return response;
      }
      if(url)

      return response || fetch(e.request)
    })
  );

  //Cache avatar

});


function handleUserPictureRequest(event){
  return caches.match(event.request).then(function (response) {
    if(response){
      return response;
    }
    var fetchReq= event.request.clone();
    return fetch(fetchReq).then(function (response) {
      const respClone=response.clone();
      caches.open(staticCacheName).then(function (cache) {
        cache.put(event.request,respClone);
      });
      return response;
    });
  })
}

