(function() {
    'use strict';

    angular
        .module('peoples-components')
        .factory('People', ['$http', Peoples]);

    function Peoples($http) {
        var peopleMap = new Map();
        var data = localStorage.getItem('people');
        var promise = $http.get('/mocks/people.json')
            .then(response => {
                localStorage.setItem('people', JSON.stringify(response.data));
                return Promise.resolve(response.data);
            }, function() {
                return data;
            });

        function map(arr) {
            arr.forEach(function(sfeirien) {
                sfeirien.name = sfeirien.firstname + ' ' + sfeirien.lastname;
                peopleMap.set(sfeirien.email, sfeirien);
            });
            return Array.from(peopleMap.values());
        }

        var r = {
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

        return r;
    }

})();