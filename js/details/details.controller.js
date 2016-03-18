(function() {
    'use strict';

    angular
        .module('peoples-details')
        .controller('DetailsController', DetailsController);

    DetailsController.$inject = ['$scope','$routeParams', 'People'];

    function DetailsController($scope, $routeParams, People) {
        var vm = this;

        activate();

        function activate() {
            $scope.sfeirien = {};
            $scope.manager = {};
            $scope.photo = photo;

            People.$promise.then(function (){
                $scope.sfeirien = People.get($routeParams.id);
                $scope.manager = People.getCollab($routeParams.id);
            });
            $scope.mySplit = function(string) {
                if(string == undefined)
                    return;
                var array = string.split('@');
                return array[0];
            };
            $scope.pressEnter = function(adr){
                $rootScope.search = adr;
                $location.path('/people/all');
            };
        }

    }
})();
