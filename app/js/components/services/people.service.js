(function() {
    'use strict';

    angular
        .module('people-components')
        .factory('People', ['$http', 'CacheService', Peoples]);

    function Peoples($http, CacheService) {
        const API_URL = 'mocks/people.json';
        var cachePromise, networkPromise;
        var peoples;
        var peopleMap = new Map();

        var hasRequestPending = false;

        var service = {
            getPeoples    : getPeoples,
            getPeopleById : getPeopleById,
            getCollab     : getCollab
        };

        initialize();

        function initialize() {
            if (CacheService.isCacheActive()) {
                cachePromise = CacheService.getCacheData(API_URL)
                    .then(function(response) {
                        if (hasRequestPending && response) {
                            peoples = response;
                            return peoples;
                        }
                    });
            }
            hasRequestPending = true;
            networkPromise    = $http.get(API_URL)
                .then(function(response) {
                    hasRequestPending = false;
                    if (peoples) {
                        //Replace peoples
                        Array.prototype.splice.apply(peoples, [0, peoples.length].concat(response.data));

                    } else {
                        peoples = response.data;
                    }
                    return peoples;
                });
        }

        function onResult() {
            peoples.forEach(function(people) {
                people.name = people.firstname + ' ' + people.lastname;
                peopleMap.set(people.email, people);
            });
            return peoples;
        }

        function getPeoples() {
            if (cachePromise) {
                return cachePromise
                    .then(function() {
                        if (!peoples) {
                            return networkPromise;
                        }
                        return peoples;
                    })
                    .then(onResult);
            }
            return networkPromise.then(onResult);
        }


        function getPeopleById(id) {
            return peopleMap.get(id);
        }

        function getCollab(email) {
            var response = {isManager : false, collab : []};
            angular.forEach(peopleMap, function(value, key) {
                if (value.manager === email) {
                    response.isManager = true;
                    response.collab.push(key);
                }
            }, response);
            return response;
        }

        return service;
    }

})();
