(function() {
    'use strict';

    angular.module('peopleApp', [
        'ngRoute',
        'ngAnimate',
        'ngMessages',
        'ngMaterial',
        'people-home',
        'people-components',
        'people-list',
        'people-details',
        'people-skills'
    ]);



  /*if('serviceWorker' in navigator) {
    navigator.serviceWorker
      //.register('/swTest.js')
      .register('/service-worker.js')
      .then(function() { console.log('Service Worker Registered'); });
  }*/

})();
