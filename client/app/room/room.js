angular.module('handleApp.room', [])

.controller('roomController', function ($scope, $window, $location, $rootScope, EasyRTC, InterviewQuestions) {
  $scope.signout = function () {
    $window.localStorage.removeItem('com.handle');
    $rootScope.userName = null;
    $location.path('/home');
  };
  $scope.currentRoom = EasyRTC.getCurrentRoom();
	$scope.showQuestions = false;
	$scope.shuffleQuestions = function () {
    $scope.data.questions = $window._.shuffle($scope.data.questions); 
	};
	$scope.data = {};
	$scope.userName = $window.localStorage.getItem('ramblUsername');
	$scope.leaveRoom = EasyRTC.leaveRoom;
	$scope.data.questions = InterviewQuestions.questions;
	EasyRTC.interviewInit();
});

