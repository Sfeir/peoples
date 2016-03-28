(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('peopleCard', peopleCardDirective);

    function peopleCardDirective() {
        return {
            scope: {
                people: '<',
                describe: '='
            },
            templateUrl: './js/components/directives/people-card/people-card.html',
            link : function(scope) {
                scope.mySplit = function(string) {
                    return string ? string.split('@')[0] : '';
                };
            }
        };
    }
})();
