/* App Module */

angular.module('trombiApp', [
  'ngRoute',
  'ngAnimate',
  'ngMessages',
  'ngMaterial',
  'trombiServices',
  'trombiControllers',
  'trombiFilters'
])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/people/skill/:skill', {
        templateUrl: 'partials/people-skills.html',
        controller: 'PeopleSkillCtrl'
      }).
      when('/people/tagcloud', {
        templateUrl: 'partials/people-tagcloud.html',
        controller: 'SkillCloudCtrl'
      }).
      when('/people/all', {
        templateUrl: 'partials/people-list-all.html',
        controller: 'PeopleListCtrl'
      }).
      when('/people', {
        templateUrl: 'partials/people-list.html',
        controller: 'PeopleListCtrl'
      }).
      when('/people/:email', {
        templateUrl: 'partials/people-detail.html',
        controller: 'PeopleDetailCtrl'
      }).
      otherwise({
        redirectTo: '/people'
      });
  }]
);
