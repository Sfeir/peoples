(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('searchBar', ['$location','$timeout', searchBarDirective]);

    function searchBarDirective($location, $timeout) {
        return {
            scope: {
                filteredPeople: '<',
                query: '=',
                focus: '@'
            },
            templateUrl: './js/components/directives/search-bar/search-bar.html',
            link : function(scope, element) {
                if (scope.focus) {
                    $timeout(function() {
                        element.find('input').focus();
                    });
                }
                scope.pressEnter = function() {
                    $location.path('/people/' + scope.filteredPeople.email);
                };
            }
        };
    }
})();
