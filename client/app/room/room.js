angular.module('handleApp.room', [])

.controller('roomController', function ($scope, EasyRTC) {
	$scope.leaveRoom = EasyRTC.leaveRoom;
	$scope.roomDisconnect = EasyRTC.roomDisconnect;
	EasyRTC.interviewInit();
});

