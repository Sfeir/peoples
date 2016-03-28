(function() {
    'use strict';

    angular
        .module('peoples-list')
        .controller('ListController', ListController);

    ListController.$inject = ['People'];

    function ListController(People) {
        var _this = this;

        _this.people = [];
        _this.filteredPeople = [];
        _this.loading = true;
        _this.query = '';

        People.$promise.then(function(people) {
            _this.people = people;
            _this.random = _this.people[Math.floor(Math.random() * _this.people.length)];
            _this.loading = false;
        });
    }
})();
