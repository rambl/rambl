angular.module('handleApp', ['ngRoute'])

//.config(['$stateProvider', '$urlRouterProvider', function () {
//handleApp.config(function($stateProvider, $urlRouterProvider) {
.config(function($routeProvider) {
  //$urlRouterProvider.otherwise('home');

  $routeProvider
    .when('/home', {
      templateUrl: 'app/home/home.html',
      controller: 'homeController'
    })
    .otherwise({
      redirectTo: '/home'
    });

}).run();

