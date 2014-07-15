angular.module('handleApp.lobby', [])

.controller('lobbyController', function ($scope, $location, EasyRTCServer) {
  $scope.data = {}
  
  $scope.joinExistingRoom = EasyRTCServer.joinExistingRoom;

  // creates a new room, joins it and navigates to the room route
  $scope.createNewRoom = function (roomName, path) {
  	EasyRTCServer.createNewRoom(roomName);
    $location.path(path); 
  };

  // connect to server then get rooms with asynchronous callback and apply them to scope
  EasyRTCServer.connect(function () {
	  EasyRTCServer.getRooms(function (rooms) {
	  	$scope.$apply(function () {
  	    $scope.data.rooms = rooms;
	  	});
	  });
  });

	EasyRTCServer.getRooms(function (rooms) {
  	$scope.$apply(function () {
	    $scope.data.rooms = rooms;
  	});
  });

});

