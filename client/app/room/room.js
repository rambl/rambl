angular.module('handleApp.room', [])

.controller('roomController', function ($scope, $window, $location, $rootScope, EasyRTC) {
  $scope.signout = function () {
    $window.localStorage.removeItem('com.handle');
    $rootScope.userName = null;
    $location.path('/home');
  };

  $scope.currentRoom = EasyRTC.getCurrentRoom();
	$scope.leaveRoom = EasyRTC.leaveRoom;
	$scope.roomDisconnect = EasyRTC.roomDisconnect;
	EasyRTC.interviewInit();
});

