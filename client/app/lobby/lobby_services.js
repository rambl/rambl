angular.module('handleApp.lobbyServices', [])

.factory('EasyRTCServer', function ($window) {
  var connect = function (callback) {

    var connectSuccess = function (selfId) {
    	console.log('My easyrtcid is:', selfId);
    	// this callback gets the room list
    	$window.RTCConnectionEstablished = true;
    	callback();
    };

    var connectFailure = function (err) {
    	console.log(err);
    };
    
    if ($window.RTCConnectionEstablished === undefined) {
      $window.easyrtc.connect('interview', connectSuccess, connectFailure);
    }
  };

  var getRooms = function (callback) {
  	var rooms = [];
  	$window.easyrtc.getRoomList(function (roomList) {
    		for (var i in roomList) {
    			rooms.push(roomList[i].roomName);
    		}
    		callback(rooms);
    }, function () {console.log('error getting rooms');});
  };

  var createNewRoom = function (roomName) {
    $window.easyrtc.joinRoom(roomName); 
  };

  var joinExistingRoom = function (roomName) {
    $window.easyrtc.joinRoom(roomName);
    
    var callExistingUser = function (roomName, otherUsers) {
      for (var easyrtcid in otherUsers) {
  	    $window.easyrtc.call(
	        easyrtcid,
	        function(easyrtcid) { console.log("completed call to " + easyrtcid);},
	        function(errorCode, errorText) { console.log("err:" + errorText);},
	        function(accepted, bywho) {
	          console.log((accepted?"accepted":"rejected")+ " by " + bywho);
	         }
        );
      } 
    };

    $window.easyrtc.setRoomOccupantListener(callExistingUser);
  }; 


  return {
  	connect: connect,
  	getRooms: getRooms, 
  	createNewRoom: createNewRoom,
  	joinExistingRoom: joinExistingRoom
  };

});