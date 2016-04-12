(function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(function(swreg) {
              console.log('Service Worker Registered');
          });
    }
})();
