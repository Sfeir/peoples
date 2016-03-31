(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('scroll', ['$window', ScrollDirective]);

    function ScrollDirective($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind('scroll', function() {
                if (this.pageYOffset >= 5) {
                    scope.boolChangeClass = true;
                } else {
                    scope.boolChangeClass = false;
                }
                scope.$apply();
            });
        };
    }
})();
