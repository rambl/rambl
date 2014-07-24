angular.module('ramblApp.navbar', [])

.controller('navbarController', ['$scope', 'Auth',
  function ($scope, Auth) {
    $scope.signout = function(){
      Auth.signout();
      $scope.data.username = Auth.getUsername();
    };

    $scope.getUsername = Auth.getUsername;

    $scope.isLoggedIn = function(){
      return Auth.getUsername(); //will return null if not preset, otherwise will return value;
    };
}]);
