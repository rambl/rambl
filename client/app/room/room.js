angular.module('ramblApp.room', [])

.controller('roomController', ['$scope', '$window', '$location', 'EasyRTC', 'InterviewQuestions', 'Auth', 
  function ($scope, $window, $location, EasyRTC, InterviewQuestions, Auth) {
    $scope.signout = Auth.signout;
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
}]);

