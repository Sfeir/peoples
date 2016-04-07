(function() {
    'use strict';

    angular
        .module('people-components')
        .factory('CacheService', ['$http', CacheService]);

    function CacheService($http) {


        var service = {
            isCacheActive:isCacheActive,
            getCacheData:getCacheData
        };


        function isCacheActive(){
            return 'caches' in window;
        }

        function getCacheData(url){
            if (isCacheActive()) {
                return caches.match(url).then(function(response) {
                    if (response) {
                        return response.json();
                    }
                });
            }
        }

        return service;
    }

})();
