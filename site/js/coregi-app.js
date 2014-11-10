var coregi = angular.module('coregiApp', ['ngRoute', 'coregiControllers', 'coregiServices']);

coregi.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      templateUrl : 'partials/machines.html'
    })
    .when('/:page', {
      templateUrl: function($routeParams) {
        return 'partials/'+$routeParams.page+'.html';
      }
    })
    .when('/:page/:child*', {
      templateUrl: function($routeParams) {
        return 'partials/'+$routeParams.page+'/'+$routeParams.child+'.html';
      }
    })
    .otherwise({
      redirectTo: '/'
    });

}]);
