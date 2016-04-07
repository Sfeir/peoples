(function() {
    'use strict';

    angular
        .module('people-list')
        .controller('ListController', ['People', ListController]);

    function ListController(People) {
        var _this = this;

        _this.filteredPeople = [];
        _this.loading = true;
        _this.query = '';

        People.getPeoples().then(function(people) {
            _this.people = people;
            _this.loading = false;
        });
    }
})();
