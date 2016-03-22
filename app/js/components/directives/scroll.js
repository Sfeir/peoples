(function() {
    'use strict';

    angular
        .module('peoples-components')
        .directive('scroll', ScrollDirective);

    ScrollDirective.$inject=['$window'];

    function ScrollDirective($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
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
