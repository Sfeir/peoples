(function() {
    'use strict';

    angular
        .module('peoples-components')
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
                    $location.path('/people/' + filteredPeople[0].email);
                };
            }
        };
    }
})();
