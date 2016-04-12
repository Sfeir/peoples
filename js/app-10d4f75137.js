(function() {
    'use strict';

    angular.module('peopleApp', [
        'ngRoute',
        'ngAnimate',
        'ngMessages',
        'ngMaterial',
        'people-home',
        'people-components',
        'people-list',
        'people-details',
        'people-skills'
    ]);
})();

(function() {
    'use strict';

    angular
        .module('peopleApp')
        .config(['$routeProvider', config]);

    function config($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: './templates/home/home.html',
                controller: 'HomeController',
                controllerAs: 'homeCtrl'
            })
            .when('/people', {
                templateUrl: './templates/list/list.html',
                controller: 'ListController',
                controllerAs: 'listCtrl'
            })
            .when('/people/skill/:skill', {
                templateUrl: './templates/skills/skills.html',
                controller: 'SkillsController',
                controllerAs: 'skillsCtrl'
            })
            .when('/people/:id', {
                templateUrl: './templates/details/details.html',
                controller: 'DetailsController',
                controllerAs : 'detailsCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    }
})();

(function() {
    'use strict';

    angular
        .module('people-list', []);
})();

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

(function() {
    'use strict';

    angular
        .module('people-home', []);
})();

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

(function() {
    'use strict';

    angular
        .module('people-details', []);
})();

(function() {
    'use strict';

    angular
        .module('people-details')
        .controller('DetailsController', ['$routeParams', 'People', DetailsController]);

    function DetailsController($routeParams, People) {
        var _this = this;

        People.getPeoples().then(function() {
            _this.sfeirien = People.getPeopleById($routeParams.id);
            _this.manager = People.getCollab($routeParams.id);
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('people-skills', []);
})();

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

(function() {
    'use strict';

    angular
        .module('people-components', []);
})();

(function () {
  'use strict';

  angular
    .module('people-components')
    .factory('People', ['$http', 'CacheService', Peoples]);

  function Peoples($http, CacheService) {
    const API_URL = 'mocks/people.json';
    var cachePromise, networkPromise;
    var peoples;
    var peopleMap = new Map();

    var hasRequestPending = false;

    var service = {
      getPeoples: getPeoples,
      getPeopleById: getPeopleById,
      getCollab: getCollab
    };

    initialize();

    function initialize() {
      /*if (CacheService.isCacheActive()) {
        cachePromise = CacheService.getCacheData(API_URL)
          .then(function (response) {
            if (hasRequestPending && response) {
              peoples = response;
              return peoples;
            }
          });
      }
      hasRequestPending = true;
      networkPromise = $http.get(API_URL)
        .then(function (response) {
          hasRequestPending = false;
          if (peoples) {
            //Replace peoples
            Array.prototype.splice.apply(peoples, [0, peoples.length].concat(response.data));

          } else {
            peoples = response.data;
          }
          return peoples;
        });*/

      //getNetWorkPromise();
    }

    function onResult() {
      peoples.forEach(function (people) {
        people.name = people.firstname + ' ' + people.lastname;
        peopleMap.set(people.email, people);
      });
      return peoples;
    }

    function getPeoples() {
      if (CacheService.isCacheActive()) {
        return getCachePromise()
          .then(onResult);
      }
      return getNetWorkPromise().then(onResult);
    }

    function getCachePromise() {
      if (!cachePromise) {
        cachePromise = CacheService.getCacheData(API_URL)
          .then(function (response) {
            if (hasRequestPending && response) {
              peoples = response;
              return peoples;
            }
            else {
              return getNetWorkPromise();
            }
          });
      }
      return cachePromise;
    }

    function getNetWorkPromise() {
      if (!networkPromise) {
        hasRequestPending = true;
        networkPromise = $http.get(API_URL)
          .then(function (response) {
            hasRequestPending = false;
            if (peoples) {
              //Replace peoples
              Array.prototype.splice.apply(peoples, [0, peoples.length].concat(response.data));
            } else {
              peoples = response.data;
            }
            return peoples;
          });
      }
      return networkPromise;
    }

    function getPeopleById(id) {
      return peopleMap.get(id);
    }

    function getCollab(email) {
      var response = {isManager: false, collab: []};
      angular.forEach(peopleMap, function (value, key) {
        if (value.manager === email) {
          response.isManager = true;
          response.collab.push(key);
        }
      }, response);
      return response;
    }

    return service;
  }

})();

(function() {
    'use strict';

    angular
        .module('people-components')
        .factory('CacheService', ['$http', CacheService]);

    function CacheService($http) {


        var service = {
            isCacheActive:isCacheActive,
            getCacheData:getCacheData
        };


        function isCacheActive(){
            return 'caches' in window;
        }

        function getCacheData(url){
            if (isCacheActive()) {
                return caches.match(url).then(function(response) {
                    if (response) {
                        return response.json();
                    }
                });
            }
        }

        return service;
    }

})();

(function() {
    'use strict';

    angular
        .module('people-components')
        .filter('capitalize', capitalizeFilter);

    function capitalizeFilter() {
        return function(input) {
            return angular.isString(input) && input.length > 0 ?
             input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('people-components')
        .filter('checkmark', checkMarkFilter);

    function checkMarkFilter() {
        return function(input) {
            return input ? '\u2713' : '\u2718';
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('scroll', ['$window', ScrollDirective]);

    function ScrollDirective($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind('scroll', function() {
                if (this.pageYOffset >= 5) {
                    scope.boolChangeClass = true;
                } else {
                    scope.boolChangeClass = false;
                }
                scope.$apply();
            });
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('errSrc', errSrcDirective);

    function errSrcDirective() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    if (attrs.src !== attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('focusMe', ['$timeout', focusDirective]);

    function focusDirective($timeout) {
        return {
            scope: { trigger: '@focusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if (value === 'true') {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                });
            }
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('peopleCard', ['$routeParams', peopleCardDirective]);

    function peopleCardDirective($routeParams) {
        return {
            scope: {
                people: '<',
                describe: '<',
                skillOn: '<'
            },
            templateUrl: './templates/components/directives/people-card/people-card.html',
            link : function(scope) {
                scope.mySplit = function(string) {
                    return string ? string.split('@')[0] : '';
                };
            }
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('people-components')
        .directive('searchBar', ['$location', searchBarDirective]);

    function searchBarDirective($location) {
        return {
            scope: {
                filteredPeople: '<',
                query: '='
            },
            templateUrl: './templates/components/directives/search-bar/search-bar.html',
            link : function(scope) {
                scope.pressEnter = function() {
                    $location.path('/people/' + scope.filteredPeople.email);
                };
            }
        };
    }
})();
