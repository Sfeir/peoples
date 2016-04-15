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


        var service = {
            getPeoples    : getPeoples,
            getPeopleById : getPeopleById,
            getCollab     : getCollab
        };

        initialize();

        function initialize() {
            //getNetWorkPromise();
        }

        function onResult() {
            peoples.forEach(function(people) {
                people.name = people.firstname + ' ' + people.lastname;
                peopleMap.set(people.email, people);
            });
            return peoples;
        }

        function getPeoples() {
            var promise;
            if (CacheService.isCacheActive()) {
                promise = getCachePromise();
            }
            else {
                promise = getNetWorkPromise();
            }
            return promise.then(onResult);
        }

        function getCachePromise() {
            if (!cachePromise) {
                cachePromise = CacheService.getCacheData(API_URL)
                    .then(function(response) {
                        if (response) {
                            peoples = response;
                            //To check for update
                            requestAnimationFrame(function() {
                                getNetWorkPromise().then(onResult);
                            });
                            return peoples;
                        }
                        else {
                            return getNetWorkPromise();
                        }
                    });
            }
            return cachePromise;
        }

        function getNetWorkPromise() {
            if (!networkPromise) {
                networkPromise = $http.get(API_URL)
                    .then(function(response) {
                        if (peoples) {
                            //Replace peoples
                            peoples.push(response.data[0]);
                            //Array.prototype.splice.apply(peoples, [0, peoples.length].concat(response.data));
                        } else {
                            peoples = response.data;
                        }
                        return peoples;
                    });
            }
            return networkPromise;
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
