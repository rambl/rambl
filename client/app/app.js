angular.module('ramblApp', 
  ['ngRoute', 
   'ramblApp.authServices', 
   'ramblApp.easyRTCServices',
   'ramblApp.interviewServices',
   'ramblApp.home',
   'ramblApp.signup',
   'ramblApp.about',
   'ramblApp.lobby', 
   'ramblApp.room'])

.config(['$routeProvider', '$httpProvider', '$locationProvider',function ($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeController'
      })
      .when('/signup', {
        templateUrl: 'app/signup/signup.html',
        controller: 'SignupController'
      })
      .when('/about', {
        templateUrl: 'app/about/about.html',
        controller: 'AboutController'
      })
      .when('/lobby', {
        templateUrl: 'app/lobby/lobby.html',
        controller: 'LobbyController'
      })
      .when('/room', {
        templateUrl: 'app/room/room.html',
        controller: 'RoomController'
      })
      .otherwise({
        redirectTo: '/'
      });

    // For remove # from url bar
    if(window.history && window.history.pushState){
      $locationProvider.html5Mode(true);
    }
      $httpProvider.interceptors.push('AttachTokens');
}])

.factory('AttachTokens', ['$window',
  function ($window) {
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('ramblToken');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        return object;
      }
    };
    return attach;
}])

.run(['$rootScope', '$location', '$window', 'Auth',
  function($rootScope, $location, $window, Auth) {

    $rootScope.$on('$routeChangeStart', function(evt, next, current) {
      if (next && 
          next.$$route && 
          next.$$route.controller && 
          (next.$$route.controller !== 'HomeController' && 
            next.$$route.controller !== 'SignupController' && 
            next.$$route.controller !== 'AboutController')) {
        Auth.isAuth()
          .then(function() {
          })
          .catch(function() {
            $location.path('/');
          });
      }
    });
}]);
