(function() {
    'use strict';

    angular
        .module('peoplesApp')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/people/skill/:skill', {
                templateUrl : 'partials/people-skills.html',
                controller  : 'PeopleSkillCtrl'
            })
            .when('/people/tagcloud', {
                templateUrl : 'partials/people-tagcloud.html',
                controller  : 'SkillCloudCtrl'
            })
            .when('/people/all', {
                templateUrl : 'partials/people-list-all.html',
                controller  : 'PeopleListCtrl'
            })
            .when('/people', {
                templateUrl : 'partials/people-list.html',
                controller  : 'PeopleListCtrl'
            })
            .when('/people/:email', {
                templateUrl : 'partials/people-detail.html',
                controller  : 'PeopleDetailCtrl'
            })
            .otherwise({
                redirectTo : '/people'
            });
    }
})();
