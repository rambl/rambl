angular.module('handleApp.room', [])

.controller('roomController', function ($scope, EasyRTC) {
	$scope.currentRoom = EasyRTC.getCurrentRoom();
	$scope.leaveRoom = EasyRTC.leaveRoom;
	$scope.roomDisconnect = EasyRTC.roomDisconnect;
	EasyRTC.interviewInit();
});

