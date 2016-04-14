var dataCacheName   = 'peoples-data-v1';
var staticCacheName = 'peoples-static-v1';

var filesToCache = [
    '/',
    'index.html',
    'manifest/manifest.json',
    'js/initSw.js',
    'CSS_VENDOR',
    'CSS_APP',
    'JS_VENDOR',
    'JS_APP',
    'templates/home/home.html',
    'templates/list/list.html',
    'templates/details/details.html',
    'templates/skills/skills.html',
    'templates/components/directives/people-card/people-card.html',
    'templates/components/directives/search-bar/search-bar.html',
    'img/bg_left.png',
    'img/bg_right.png',
    'img/logo-sfeir.svg',
    'img/md-cellphone.svg',
    'img/md-email.svg',
    'img/md-github.svg',
    'img/md-linkedin.svg',
    'img/md-map.svg',
    'img/md-phone.svg',
    'img/md-slack.svg',
    'img/md-twitter.svg',
    'img/profile.svg',
    'img/search.svg',
    'img/md-install.svg',
    'img/md-subscribe.svg',
    'img/md-unsubscribe.svg',
    'img/icons/icon-32x32.png',
    'img/icons/icon-128x128.png',
    'img/icons/icon-144x144.png',
    'img/icons/icon-152x152.png',
    'img/icons/icon-192x192.png',
    'img/icons/icon-256x256.png'
];


self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    //TO FORCE UPDATE
    self.skipWaiting();
    e.waitUntil(
        caches.open(staticCacheName)
            .then(function(cache) {
                console.log('[ServiceWorker] Caching App Shell');
                return cache.addAll(filesToCache);
            })
            .catch(function() {
                console.log('INSTALL ERROR');
            })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activation- update cache');
    self.clients.claim();
    e.waitUntil(
        caches.keys()
            .then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    if (key !== staticCacheName) {
                        return caches.delete(key);
                    }
                }))
            })
            .catch(function() {
                console.log('ACTIVATE ERROR');
            })
    )
});


self.addEventListener('fetch', function(e) {
    //console.log('[ServiceWorker] fetch:'+ e.request.url);
    const url = new URL(e.request.url);

    //Cache avatar
    if (url.origin == 'http://api.randomuser.me') {
        e.respondWith(handleUserPictureRequest(e));
        return;
    }

    //Cache DATA
    if (url.pathname == 'mocks/people.json') {
        e.respondWith(handleAPIRequest(e));
        return;
    }

    //Serve static resources
    e.respondWith(
        caches.match(e.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return response || fetch(e.request)
            })
            .catch(function() {
                console.log('GENERIC FETCH  ERROR');
            })
    );
});


self.addEventListener('push', function(event) {
    console.log('Received a push message', event);
    event.waitUntil(
        fetch('mocks/notification.json')
            .then(function(resp) {
                return resp.json();
            })
            .then(function(data) {
                var title = 'Hey look who just join the team';
                var body  = 'Hi from ' + data.firstname + ' ' + data.lastname;
                var icon  = data.photo;
                var tag   = data.email;


                self.registration.showNotification(title, {
                    body    : body,
                    icon    : icon,
                    tag     : tag,
                    actions : [
                        {action : 'open', title : 'Show me more details'},
                        {action : 'no', title : 'No thanks'}
                    ]

                })
            })
            .catch(function() {
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

self.addEventListener('notificationclick', function(event) {
    console.log('Notification click: tag ', event.notification.tag);
    event.notification.close();
    if (event.action === 'open') {
        var url = 'http://localhost:8080/#/people/' + event.notification.tag;
        event.waitUntil(
            clients.matchAll({
                    type : 'window'
                })
                .then(function(windowClients) {
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
                .catch(function() {
                    console.log('PUSH CLICK  ERROR');
                })
        );
    }
});

function handleUserPictureRequest(event) {
    return caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            }
            return fetchAndCache(event.request, staticCacheName);
        })
        .catch(function() {
            console.log('PICTURE FETCH ERROR');
        })
}

function handleAPIRequest(event) {
    return fetchAndCache(event.request, dataCacheName)
        .catch(function() {
            console.log('API FETCH ERROR');
            //OFFLINE
            return caches.match(event.request);
        });
}


function fetchAndCache(request, cacheName) {
    return fetch(request)
        .then(function(response) {
            //clone response to add to cache
            //TODO cache only if status is OK
            const respClone = response.clone();
            caches.open(cacheName).then(function(cache) {
                cache.put(request, respClone);
            });
            return response;
        })
}
