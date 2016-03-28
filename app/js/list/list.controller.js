(function() {
    'use strict';

    angular
        .module('peoples-list')
        .controller('ListController', ListController);

    ListController.$inject = ['People','$location', '$rootScope'];

    function ListController(People, $location, $rootScope) {
        var _this = this;

        _this.people = [];
        _this.filteredPeople = [];
        _this.random = [];
        _this.loading = true;

        _this.queryAll = '';

        People.$promise.then(function(people) {
            _this.people = people;
            _this.random = _this.people[Math.floor(Math.random() * _this.people.length)];
            _this.loading = false;
        });

        _this.pressEnter = function(adr) {
            if (adr) {
                $location.path('/people/' + adr);
            }
        };
    }
})();
