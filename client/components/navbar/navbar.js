angular.module('ramblApp.navbar', [])

.controller('navbarController', ['$scope', '$location', 'Auth',
  function ($scope, $location, Auth) {
    $scope.signout = function(){
      Auth.signout();
      $scope.data.username = Auth.getUsername();
    };

    $scope.getUsername = Auth.getUsername;

    $scope.isLoggedIn = function(){
      return Auth.getUsername(); //will return null if not preset, otherwise will return value;
    };

    $scope.isActive = function(route) {
      if ( route === '/login' && $location.path().indexOf('/login') !== -1 ) {
        return '#/login';
      } else if ( route === '/signup' && $location.path().indexOf('/signup') !== -1 ) {
        return '#/signup';
      }
      return route === $location.path();
    };
}]);
