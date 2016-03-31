if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        //.register('/swTest.js')
        .register('/service-worker.js')
        .then(function() {
            console.log('Service Worker Registered');
        });
}