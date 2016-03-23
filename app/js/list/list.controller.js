(function() {
    'use strict';

    angular
        .module('peoples-list')
        .controller('ListController', ListController);

    ListController.$inject = ['$scope','People','$location', '$rootScope'];

    function ListController($scope, People, $location, $rootScope) {
        activate();

        function activate() {
            $scope.people = [];
            $scope.filteredPeople = [];
            $scope.random = [];
            $scope.loading = true;

            $scope.queryAll = $rootScope.search || '';

            People.$promise.then(function() {
                $scope.people = People.list;
                $scope.random = $scope.people[Math.floor(Math.random() * $scope.people.length)];
                $scope.loading = false;
            });

            $scope.mySplit = function(string) {
                var result;
                if (string) {
                    result = string.split('@')[0];
                }
                return result;
            };

            $scope.pressEnter = function(adr) {
                if (adr) {
                    $location.path('/people/' + adr);
                }
            };
        }

    }
})();
