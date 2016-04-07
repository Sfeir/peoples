(function() {
    'use strict';

    angular
        .module('people-home')
        .controller('HomeController', ['People', HomeController]);

    function HomeController(People) {
        var _this = this;

        _this.filteredPeople = [];
        _this.loading = true;
        _this.query = '';

        People.getPeoples().then(function(people) {
            _this.people = people;
            _this.random = _this.people[Math.floor(Math.random() * _this.people.length)];
            _this.loading = false;
        });
    }
})();
