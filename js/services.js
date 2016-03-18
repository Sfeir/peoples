/* Service */

// le constructeur à Sfeiriens, pour ajouter les méthodes et getters
function Sfeirien(data)
{
  if(typeof data === "object") Object.assign(this, data);
}

Object.defineProperties(Sfeirien.prototype, {
  name: {
    get: function (){ return `${this.firstName} ${this.lastName}`; }
  }
});


// Le service People charge le JSON (du localStorage si déjà disponible)
// et expose la liste sous forme de:
//   map: Map(id => Sfeirien) pratique pour récupérer un Sfeirien
//   list: [Sfeirien] que Angular1 sait afficher directement
// Pour savoir quand les données sont chargées, il suffit d'attendre People.$promise
angular.module('trombiServices', []).factory('People', ['$http',
  function($http){
    var m = new Map();
    var data = localStorage.getItem("people");
    var promise = $http.get('/mocks/people.json')
    .then(function (response){
      localStorage.setItem("people", JSON.stringify(response.data));
      return Promise.resolve(response.data);
    }, function(){
      return data;
    });

    function map(arr)
    {
      for(var sfeirien of arr)
        m.set(sfeirien.email, new Sfeirien(sfeirien));
      return Promise.resolve(m);
    };

    var r = {
      $promise: promise.then(map),
      map: m,
      get: m.get.bind(m),
      getCollab: function(email){
        var response = {isManager: false, collab: []};
        angular.forEach(m, function(value, key){
          if(value.manager === email){
            response.isManager = true;
            response.collab.push(key);
          }
        }, response);
          return response;
      },
      getSkills: function(){
        var skills = [];
        var test = {};

        // taille des mots soit inversement proportionnelle à la taille totale du tableau.
        angular.forEach(m, function(value, key){
          angular.forEach(value.skills, function(value, key){
            if (value) {
              test[value] = (test[value] || 0) + 20;
            }
          }, skills);
        }, skills);
        angular.forEach(test, function(value, key){
          skills.push({size: value, text: key});
        });
        return skills;
      }
    };

    Object.defineProperty(r, "list", {
      get: function (){ return Array.from(m.values()); }
    });

    return r;
  }
]);
