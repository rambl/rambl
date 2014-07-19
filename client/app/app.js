angular.module('handleApp', 
  ['ngRoute', 
   'handleApp.authServices', 
   'handleApp.auth',
   'handleApp.easyRTCServices',
   'handleApp.lobby', 
   'handleApp.interviewServices',
   'handleApp.room'])

.config(function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/home/home.html',
      controller: 'authController'
    })
    .when('/lobby', {
      templateUrl: 'app/lobby/lobby.html',
      controller: 'lobbyController'
    })
    .when('/signup', {
      templateUrl: 'app/signup/signup.html',
      controller: 'authController'
    })
    .when('/room', {
      templateUrl: 'app/room/room.html',
      controller: 'roomController'
    })
    .otherwise({
      redirectTo: '/'
    });


    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function($window) {
  var attach = {
    request: function(object) {
      var jwt = $window.localStorage.getItem('com.handle');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function($rootScope, $location, $window, Auth) {
  $rootScope.userName = $window.localStorage.getItem('ramblUsername');
  $rootScope.$on('$routeChangeStart', function(evt, next, current) {
    if (next && 
        next.$$route && 
        next.$$route.controller && 
        next.$$route.controller !== 'authController') {
      Auth.isAuth()
        .then(function() {
          console.log('Good to go in!');
        })
        .catch(function() {
          $location.path('/login');
        });
    }
  });
});
