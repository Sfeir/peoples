(function() {
    'use strict';

    angular
        .module('people-components')
        .filter('checkmark', checkMarkFilter);

    function checkMarkFilter() {
        return function(input) {
            return input ? '\u2713' : '\u2718';
        };
    }
})();
