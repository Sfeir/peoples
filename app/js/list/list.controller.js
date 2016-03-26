(function() {
    'use strict';

    angular
        .module('peoples-list')
        .controller('ListController', ListController);

    ListController.$inject = ['$scope','People','$location', '$rootScope'];

    function ListController($scope, People, $location, $rootScope) {
        $scope.people = [];
        $scope.filteredPeople = [];
        $scope.random = [];
        $scope.loading = true;

        $scope.queryAll = '';

        People.$promise.then(function(people) {
            $scope.people = people;
            $scope.random = $scope.people[Math.floor(Math.random() * $scope.people.length)];
            $scope.loading = false;
        });

        $scope.mySplit = function(string) {
            return string ? string.split('@')[0] : '';
        };

        $scope.pressEnter = function(adr) {
            if (adr) {
                $location.path('/people/' + adr);
            }
        };
    }
})();
