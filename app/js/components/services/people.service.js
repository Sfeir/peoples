(function() {
    'use strict';

    angular
        .module('people-components')
        .factory('People', ['$http', Peoples]);

    function Peoples($http) {
        var peopleMap = new Map();
        var promise = $http.get('mocks/people.json')
            .then(function(response) {
                return Promise.resolve(response.data);
            });

        function map(arr) {

            arr.forEach(function(sfeirien) {
                sfeirien.name = sfeirien.firstname + ' ' + sfeirien.lastname;
                peopleMap.set(sfeirien.email, sfeirien);
            });

            return arr;
        }

        var service = {
            $promise: promise.then(map),
            map: peopleMap,
            get: peopleMap.get.bind(peopleMap),
            getCollab: function(email) {
                var response = {isManager: false, collab: []};

                angular.forEach(peopleMap, function(value, key) {
                    if (value.manager === email) {
                        response.isManager = true;
                        response.collab.push(key);
                    }
                }, response);

                return response;
            },
            getSkills: function() {
                var skills = [];
                var test = {};

                angular.forEach(peopleMap, function(value, key) {
                    angular.forEach(value.skills, function(value, key) {
                        if (value) {
                            test[value] = (test[value] || 0) + 20;
                        }
                    }, skills);
                }, skills);

                angular.forEach(test, function(value, key) {
                    skills.push({size: value, text: key});
                });

                return skills;
            }
        };

        return service;
    }

})();
