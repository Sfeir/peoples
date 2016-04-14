(function() {
    'use strict';

    angular
        .module('people-home')
        .controller('HomeController', ['$location', 'People', HomeController]);

    function HomeController($location, People) {
        var _this = this;

        _this.filteredPeople = [];
        _this.loading = true;
        _this.query = '';

        _this.goToPeopleStep = function goToPeopleStep() {
            $location.path('/people/');
        };

        People.getPeoples().then(function(people) {
            _this.people = people;
            _this.random = _this.people[Math.floor(Math.random() * _this.people.length)];
            _this.loading = false;
        });
    }
})();
