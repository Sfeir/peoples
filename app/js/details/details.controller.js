(function() {
    'use strict';

    angular
        .module('people-details')
        .controller('DetailsController', ['$routeParams', 'People', DetailsController]);

    function DetailsController($routeParams, People) {
        var _this = this;

        People.$promise.then(function() {
            _this.sfeirien = People.get($routeParams.id);
            _this.manager = People.getCollab($routeParams.id);
        });
    }
})();
