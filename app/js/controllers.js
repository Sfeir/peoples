/* Controllers */

var photo = function(sferien) {
  if (sferien.email){
    var email = sferien.email.replace("@","_");
    var prefix = sferien.email.substring(0,2);
    //return "https://storage.googleapis.com/sfeir-people/"+prefix+"/" +email +".jpg";
    return sferien.photo;
  }
}

angular.module('trombiControllers', [])

.controller('PeopleListCtrl', ['$scope', 'People', '$location', '$rootScope',
  function($scope, People, $location, $rootScope) {
    $scope.people = [];
    $scope.filteredPeople = [];
    $scope.random = [];
    $scope.photo = photo;
    $scope.loading = true;

    $scope.queryAll = $rootScope.search || "";

    People.$promise.then(function (){
      $scope.people = People.list;
      $scope.random = $scope.people[Math.floor(Math.random() * ($scope.people.length))];
      $scope.loading = false;
    });

    $scope.mySplit = function(string) {
      if(string == undefined)
        return;
      var array = string.split('@');
      return array[0];
    }

    $scope.pressEnter = function(adr){
      if(adr){
        $location.path('/people/' + adr);
      }
    };

  }])

.controller('PeopleSkillCtrl', ['$scope', 'People', '$routeParams', '$location',
  function($scope, People, $routeParams, $location) {
    $scope.people = [];
    $scope.filteredPeople = [];
    $scope.photo = photo;
    $scope.query = $routeParams.skill;

    People.$promise.then(function (){
      $scope.people = People.list;
    });

    $scope.pressEnter = function(adr){
      $scope.query = "";
      $location.path('/people/' + adr);
    };

  }])

.controller('SkillCloudCtrl', ['$scope', 'People',
  function($scope, People){
    $scope.skills = [];

    People.$promise.then(function (){
      $scope.skills = People.getSkills();

      if($scope.skills.length > 0){
        var fill = d3.scale.category20();

        var layout = d3.layout.cloud()
          .size([900, 600])
          .words($scope.skills)
          .padding(0)
          .rotate(function() { return ~~(Math.random() * 160) - 80; })
          .font("Impact")
          .fontSize(function(d) { return d.size; })
          .on("end", draw);

        layout.start();

        function draw(words) {
          d3.select(".people-tag-cloud").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
        };
      }
    });



  }])

.controller('PeopleDetailCtrl', ['$scope', '$routeParams', 'People', '$location', '$rootScope',
  function($scope, $routeParams, People, $location, $rootScope) {
    $scope.sfeirien = {};
    $scope.manager = {};
    $scope.photo = photo;

    People.$promise.then(function (){
      $scope.sfeirien = People.get($routeParams.email);
      $scope.manager = People.getCollab($routeParams.email);
    });
    $scope.mySplit = function(string) {
      if(string == undefined)
        return;
      var array = string.split('@');
      return array[0];
    }
    $scope.pressEnter = function(adr){
      $rootScope.search = adr;
      $location.path('/people/all');
    };

  }])

.controller('PeopleToolBar', ['$scope', '$location',
  function($scope, $location){
    $scope.active = "";
    if ($location.url() === "/people") {
      $scope.active = "active";
    };
  }])

.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 5) {
                 scope.boolChangeClass = true;
             } else {
                 scope.boolChangeClass = false;
             }
            scope.$apply();
        });
    };
})

.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
})

.directive('focusMe', function($timeout) {
  return {
    scope: { trigger: '@focusMe' },
    link: function(scope, element) {
      scope.$watch('trigger', function(value) {
        if(value === "true") {
          // console.log('trigger',value);
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
});
