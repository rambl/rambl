angular.module('handleApp.lobby', [])

.controller('lobbyController', function ($scope, $location, EasyRTC, $interval) {
  $scope.data = {}

  // sets currentRoom then navigates to the room route
  $scope.setCurrentRoomAndNavigate = function (roomName, path) {
    EasyRTC.setCurrentRoom(roomName); 
    $location.path(path); 
  };
  
  // check if there is a current room and if so leave it and hang up all calls
  if (EasyRTC.getCurrentRoom()) {
    EasyRTC.leaveRoom();
  }
  
  // connect to server then get rooms with asynchronous callback and apply them to scope
  EasyRTC.connect(function () {
	  EasyRTC.getRooms(function (rooms) {
	  	$scope.$apply(function () {
  	    $scope.data.rooms = rooms;
	  	});
	  });
  });
  
  // this is so that rooms are displayed instantly when going from room to lobby 
  EasyRTC.getRooms(function (rooms) {
	  	$scope.$apply(function () {
		    $scope.data.rooms = rooms;
	  	});
	});

  // update room list every 2 seconds 
  var getRoomsRepeatedly = $interval(function () {
    if (EasyRTC.getConnectionStatus() === true && EasyRTC.getCurrentRoom() === null) {
      EasyRTC.getRooms(function (rooms) {
        $scope.$apply(function () {
          $scope.data.rooms = rooms;
        });
      });
    } else {
      $interval.cancel(getRoomsRepeatedly);
    }
  }, 2000);

});

