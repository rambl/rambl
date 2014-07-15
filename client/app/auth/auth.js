angular.module('handleApp.auth', [])

.controller('authController', function ($scope, $window, $location, Auth) {
  $scope.user = {};

  $scope.login = function () {
    Auth.login($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.handle', token);
        $location.path('/lobby');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.handle', token);
        $location.path('/lobby');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
