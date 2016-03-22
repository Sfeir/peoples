(function() {
    'use strict';

    angular
        .module('peoples-components')
        .directive('focusMe', focusDirective);

    focusDirective.$inject=['$timeout'];


    function focusDirective($timeout) {
        return {
            scope: { trigger: '@focusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if(value === "true") {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    }
})();
