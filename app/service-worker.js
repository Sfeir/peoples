//console.log('Hello from service worker !!!');
var dataCacheName = 'peoples-data-v1';
var staticCacheName = 'peoples-static-v1';

var filesToCache = [
  "/",
  "/index.html",
  "/manifest.json",
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
  "/js/initSw.js",
  "/js/app.module.js",
  "/js/app.config.js",
  "/js/list/list.module.js",
  "/js/list/list.controller.js",
  "/js/list/list.html",
  "/js/home/home.module.js",
  "/js/home/home.controller.js",
  "/js/home/home.html",
  "/js/details/details.module.js",
  "/js/details/details.controller.js",
  "/js/details/details.html",
  "/js/skills/skills.module.js",
  "/js/skills/skills.controller.js",
  "/js/skills/skills.html",
  "/js/components/components.module.js",
  "/js/components/services/people.service.js",
  "/js/components/filters/capitalize.js",
  "/js/components/filters/checkmark.js",
  "/js/components/directives/scroll.js",
  "/js/components/directives/errSrc.js",
  "/js/components/directives/focus.js",
  "/js/components/directives/people-card/people-card.js",
  "/js/components/directives/people-card/people-card.html",
  "/js/components/directives/search-bar/search-bar.js",
  "/js/components/directives/search-bar/search-bar.html",
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
  "/img/search.svg",
  "/img/md-install.svg",
  "/img/md-subscribe.svg",
  "/img/md-unsubscribe.svg",
  "/img/icons/icon-128x128.png",
  "https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3ZBw1xU1rKptJj_0jans920.woff2"
];


self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  //TO FORCE UPDATE
  self.skipWaiting();
  e.waitUntil(
  caches.open(staticCacheName)
    .then(function (cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
    .catch(function () {
      console.log('INSTALL ERROR');
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activation- update cache');
  self.clients.claim();
  e.waitUntil(
      caches.keys()
        .then(function (keyList) {
          return Promise.all(keyList.map(function (key) {
            if (key !== staticCacheName) {
              return caches.delete(key);
            }
          }))
        })
        .catch(function () {
          console.log('ACTIVATE ERROR');
        })
      )
});


self.addEventListener('fetch', function (e) {
  //console.log('[ServiceWorker] fetch:'+ e.request.url);
  const url = new URL(e.request.url);

  //Cache avatar
  if (url.origin == 'http://api.randomuser.me') {
    e.respondWith(handleUserPictureRequest(e));
    return;
  }

  //Cache DATA
  if (url.pathname == '/mocks/people.json') {
    e.respondWith(handleAPIRequest(e));
    return;
  }

  //Serve static resources
  e.respondWith(
    caches.match(e.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return response || fetch(e.request)
      })
      .catch(function () {
        console.log('GENERIC FETCH  ERROR');
      })
  );
});


self.addEventListener('push', function (event) {
  console.log('Received a push message', event);
  event.waitUntil(
    fetch('/mocks/notification.json')
      .then(function (resp) {
        return resp.json();
      })
      .then(function (data) {
        var title = 'Hey look who just join the team';
        var body = 'Hi from ' + data.firstname + ' ' + data.lastname;
        var icon = data.photo;
        var tag = data.email;


        self.registration.showNotification(title, {
          body: body,
          icon: icon,
          tag: tag,
          actions: [
            {action: 'open', title: 'Show me more details'},
            {action: 'no', title: 'No thanks'}
          ]

        })
      })
      .catch(function () {
        console.log('PUSH ERROR');
      })
  );


  /*var title = 'Yay a message.';
   var body  = 'We have received a push message.';
   var icon  = '/images/icon-192x192.png';
   var tag   = 'simple-push-demo-notification-tag';

   event.waitUntil(
   self.registration.showNotification(title, {
   body : body,
   icon : icon,
   tag  : tag
   })
   );*/
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click: tag ', event.notification.tag);
  event.notification.close();
  if (event.action === 'open') {
    var url = 'http://localhost:8080/#/people/' + event.notification.tag;
    event.waitUntil(
      clients.matchAll({
          type: 'window'
        })
        .then(function (windowClients) {
          for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
        .catch(function () {
          console.log('PUSH CLICK  ERROR');
        })
    );
  }
});

function handleUserPictureRequest(event) {
  return caches.match(event.request)
    .then(function (response) {
      if (response) {
        return response;
      }
      return fetchAndCache(event.request,staticCacheName);
    })
    .catch(function () {
      console.log('PICTURE FETCH ERROR');
    })
}

function handleAPIRequest(event) {
  return fetchAndCache(event.request,dataCacheName)
    .catch(function () {
      console.log('API FETCH ERROR');
      //OFFLINE
      return caches.match(event.request);
    });
}


function fetchAndCache(request,cacheName){
  return fetch(request)
    .then(function (response) {
      //clone response to add to cache
      const respClone = response.clone();
      caches.open(cacheName).then(function (cache) {
        cache.put(request, respClone);
      });
      return response;
    })
}
