(function() {
    'use strict';

    angular
        .module('peopleApp')
        .config(['$routeProvider', config]);

    function config($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: './js/home/home.html',
                controller: 'HomeController',
                controllerAs: 'homeCtrl'
            })
            .when('/people', {
                templateUrl: './js/list/list.html',
                controller: 'ListController',
                controllerAs: 'listCtrl'
            })
            .when('/people/skill/:skill', {
                templateUrl: './js/skills/skills.html',
                controller: 'SkillsController',
                controllerAs: 'skillsCtrl'
            })
            .when('/people/:id', {
                templateUrl: './js/details/details.html',
                controller: 'DetailsController',
                controllerAs : 'detailsCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }
})();
