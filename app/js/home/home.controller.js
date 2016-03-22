(function() {
    'use strict';

    angular
        .module('peoples-home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope','People','$rootScope'];

    function HomeController($scope, People, $rootScope) {
        var vm = this;

        activate();

        function activate() {
            $scope.people = [];
            $scope.filteredPeople = [];
            $scope.random = [];
            $scope.loading = true;

            $scope.queryAll = $rootScope.search || "";

            People.$promise.then(function (){
                $scope.people = People.list;
                $scope.random = $scope.people[Math.floor(Math.random() * ($scope.people.length))];
                $scope.loading = false;
            });

            $scope.mySplit = function(string) {
                if(string == undefined)
                    return;
                var array = string.split('@');
                return array[0];
            };

            $scope.pressEnter = function(adr){
                if(adr){
                    $location.path('/people/' + adr);
                }
            };
        }

    }
})();
