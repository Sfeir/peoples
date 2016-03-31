(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('searchBar', ['$location', searchBarDirective]);

    function searchBarDirective($location) {
        return {
            scope: {
                filteredPeople: '<',
                query: '='
            },
            templateUrl: './js/components/directives/search-bar/search-bar.html',
            link : function(scope) {
                scope.pressEnter = function() {
                    $location.path('/people/' + scope.filteredPeople.email);
                };
            }
        };
    }
})();
