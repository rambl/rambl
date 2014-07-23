angular.module('ramblApp.navbar', [])

.controller('navbarController', ['$scope', '$window', 'Auth',
  function ($scope, $window, Auth) {
    $scope.data = {};
    $scope.data.userName = $window.localStorage.getItem('ramblUsername');

    $scope.signout = Auth.signout;
}]);
