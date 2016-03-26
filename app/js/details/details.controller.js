(function() {
    'use strict';

    angular
        .module('peoples-details')
        .controller('DetailsController', DetailsController);

    DetailsController.$inject = ['$scope','$routeParams', '$location', 'People'];

    function DetailsController($scope, $routeParams, $location, People) {
        $scope.sfeirien = {};
        $scope.manager = {};

        People.$promise.then(function() {
            $scope.sfeirien = People.get($routeParams.id);
            $scope.manager = People.getCollab($routeParams.id);
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
})();
