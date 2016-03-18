(function() {
    'use strict';

    angular
        .module('peoples-details')
        .controller('DetailsController', DetailsController);

    DetailsController.$inject = ['$scope'];

    function DetailsController($scope) {
        var vm = this;

        activate();

        function activate() {

        }

    }
})();
