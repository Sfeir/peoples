(function() {
    'use strict';

    angular
        .module('people-components')
        .factory('CacheService', ['$q', CacheService]);

    function CacheService($q) {

        var deferred = $q.defer();

        var service = {
            isCacheActive : isCacheActive,
            getCacheData  : getCacheData
        };


        function isCacheActive() {
            return 'caches' in window;
        }

        function getCacheData(url) {
            if (isCacheActive()) {
                caches.match(url).then(function(response) {
                    var data;
                    if (response) {
                        data = response.json();
                    }
                    //must be wrap in Angular promise for digest cycle
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        }

        return service;
    }

})();
