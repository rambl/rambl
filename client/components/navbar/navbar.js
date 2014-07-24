angular.module('ramblApp.navbar', [])

.controller('navbarController', ['$scope', 'Auth',
  function ($scope, Auth) {
    $scope.signout = function(){
      Auth.signout();
      $scope.data.username = Auth.getUsername();
    };

    $scope.isLoggedIn = function(){
      if ($scope.data.username) {
        return true;
      } else {
        return false;
      }
      // Auth.isAuth()
      // .then(function(){
      //   console.log('hooray!');
      // })
      // .catch(function(){
      //   console.log('sorry');
      // });
    };
}]);
