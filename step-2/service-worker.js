console.log('We add a listener to fetch event');
self.addEventListener('fetch', function(event) {
    //See https://developer.mozilla.org/en-US/docs/Web/API/URL
    var url = new URL(event.request.url);

    if (url.pathname.indexOf('.jpg') !== -1) {
        //See https://developer.mozilla.org/fr/docs/Web/API/FetchEvent
        //See https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
        event.respondWith(fetch('/poney.png'));
    }
});
