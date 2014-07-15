angular.module('handleApp.room', [])

.controller('roomController', function ($scope, EasyRTC) {
	$scope.leaveRoom = EasyRTC.leaveRoom;
	$scope.disconnect = EasyRTC.disconnect;
	EasyRTC.interviewInit();
});

