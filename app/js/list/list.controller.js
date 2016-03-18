(function() {
    'use strict';

    angular
        .module('peoples-list')
        .controller('ListController', ListController);

    ListController.$inject = ['$scope'];

    function ListController($scope) {
        var vm = this;

        activate();

        function activate() {

        }

    }
})();
