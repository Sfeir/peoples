(function() {
    'use strict';

    angular
        .module('peoples-skills')
        .controller('SkillsController', SkillsController);

    SkillsController.$inject = ['$scope', 'People', '$routeParams', '$location'];

    function SkillsController($scope, People, $routeParams, $location) {
        var vm = this;

        activate();

        function activate() {
            $scope.people = [];
            $scope.filteredPeople = [];
            $scope.query = $routeParams.skill;

            People.$promise.then(function (){
                $scope.people = People.list;
            });

            $scope.pressEnter = function(adr){
                $scope.query = "";
                $location.path('/people/' + adr);
            };
        }

    }
})();
