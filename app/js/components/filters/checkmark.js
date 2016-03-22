(function() {
    'use strict';

    angular
        .module('peoples-components')
        .filter('checkmark', checkMarkFilter);

    function checkMarkFilter() {
        return function(input) {
            return input ? '\u2713' : '\u2718';
        };
    }
})();
