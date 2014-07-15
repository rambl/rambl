angular.module('handleApp.lobby', [])

.controller('lobbyController', function ($scope, $location, EasyRTC) {
  $scope.data = {}
  
  $scope.setCurrentRoom = EasyRTC.setCurrentRoom;

  // sets currentRoom thien navigates to the room route
  $scope.setCurrentRoomAndNavigate = function (roomName, path) {
    EasyRTC.setCurrentRoom(roomName); 
    $location.path(path); 
  };

  // connect to server then get rooms with asynchronous callback and apply them to scope
  EasyRTC.connect(function () {
	  EasyRTC.getRooms(function (rooms) {
	  	$scope.$apply(function () {
  	    $scope.data.rooms = rooms;
	  	});
	  });
  });

	EasyRTC.getRooms(function (rooms) {
  	$scope.$apply(function () {
	    $scope.data.rooms = rooms;
  	});
  });

});

