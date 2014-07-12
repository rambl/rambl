var handleApp = angular.module('handleApp', ['ngRoute']);

//.config(['$stateProvider', '$urlRouterProvider', function () {
//handleApp.config(function($stateProvider, $urlRouterProvider) {
handleApp.config(function($routeProvider) {
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

handleApp.controller('handleController', function($scope) {
});
