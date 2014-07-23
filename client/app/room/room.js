angular.module('ramblApp.room', [])

.controller('RoomController', ['$scope', '$window', '$location', 'EasyRTC', 'InterviewQuestions', 'Auth', 
  function ($scope, $window, $location, EasyRTC, InterviewQuestions, Auth) {
    $scope.data = {};
    $scope.data.currentRoom = EasyRTC.getCurrentRoom();
    $scope.data.userName = $window.localStorage.getItem('ramblUsername');
    $scope.data.questions = InterviewQuestions.questions;

    $scope.shuffleQuestions = function () {
      $scope.data.questions = $window._.shuffle($scope.data.questions); 
    };
    $scope.signout = Auth.signout;
    $scope.showQuestions = false;
    $scope.leaveRoom = EasyRTC.leaveRoom;

    // set up elements for local and remote streams, set up room occupant listener
    EasyRTC.interviewInit();
}]);

