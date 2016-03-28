(function() {
    'use strict';

    angular
        .module('peoples-components')
        .directive('focusMe', ['$timeout', focusDirective]);

    function focusDirective($timeout) {
        return {
            scope: { trigger: '@focusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if (value === 'true') {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    }
})();