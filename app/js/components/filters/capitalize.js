(function() {
    'use strict';

    angular
        .module('people-components')
        .filter('capitalize', capitalizeFilter);

    function capitalizeFilter() {
        return function(input) {
            return angular.isString(input) && input.length > 0 ?
             input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    }
})();
