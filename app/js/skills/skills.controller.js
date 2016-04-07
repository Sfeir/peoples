(function() {
    'use strict';

    angular
        .module('people-skills')
        .controller('SkillsController', SkillsController);

    SkillsController.$inject = ['People', '$routeParams', '$location'];

    function SkillsController(People, $routeParams, $location) {
        var _this = this;
        _this.filteredPeople = [];
        _this.query = $routeParams.skill;

        People.getPeoples().then(function(people) {
            _this.people = people;
        });

        _this.pressEnter = function(adr) {
            _this.query = '';
            $location.path('/people/' + adr);
        };
    }
})();
