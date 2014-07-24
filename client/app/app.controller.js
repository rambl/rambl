angular.module('ramblApp.app', [])

.controller('appController', ['$scope', 'Auth',
  function ($scope, Auth) {
    $scope.data = {};
    $scope.data.username = Auth.getUserName;
}]);
