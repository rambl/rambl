angular.module('handleApp', 
  ['ngRoute', 
   'handleApp.home',
   'handleApp.authServices', 
   'handleApp.auth',
   'handleApp.signup',
   'handleApp.easyRTCServices',
   'handleApp.lobby', 
   'handleApp.room'])

//.config(['$stateProvider', '$urlRouterProvider', function () {
//handleApp.config(function($stateProvider, $urlRouterProvider) {
.config(function($routeProvider) {
  //$urlRouterProvider.otherwise('home');

  $routeProvider
    .when('/', {
      templateUrl: 'app/home/home.html',
      controller: 'homeController'
    })
    .when('/lobby', {
      templateUrl: 'app/lobby/lobby.html',
      controller: 'lobbyController'
    })
    .when('/signup', {
      templateUrl: 'app/signup/signup.html',
      controller: 'signupController'
    })
    .when('/room', {
      templateUrl: 'app/room/room.html',
      controller: 'roomController'
    })
    .otherwise({
      redirectTo: '/'
    });

});

