(function() {
    'use strict';

    angular
        .module('peoples-details')
        .controller('DetailsController', DetailsController);

    DetailsController.$inject = ['$scope','$routeParams', '$location', 'People'];

    function DetailsController($scope, $routeParams, $location, People) {
        var _this = this;

        People.$promise.then(function() {
            _this.sfeirien = People.get($routeParams.id);
            _this.manager = People.getCollab($routeParams.id);
        });

        _this.pressEnter = function(adr) {
            if (adr) {
                $location.path('/people/' + adr);
            }
        };
    }
})();
