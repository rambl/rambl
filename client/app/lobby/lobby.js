angular.module('ramblApp.lobby', [])

.controller('lobbyController', ['$scope', '$window', '$location', '$interval', 'EasyRTC', 'Auth', 
  function ($scope, $window, $location, $interval, EasyRTC, Auth) {
    $scope.data = {};
    $scope.data.userName = $window.localStorage.getItem('ramblUsername');

    // sets currentRoom then navigates to the room route
    $scope.setCurrentRoomAndNavigate = function (roomName) {
      EasyRTC.setCurrentRoom(roomName); 
      $location.path('/room'); 
    };
    
    $scope.signout = Auth.signout; 

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
}]);

