(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('errSrc', errSrcDirective);

    function errSrcDirective() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src !== attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        };
    }
})();
