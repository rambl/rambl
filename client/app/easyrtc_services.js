angular.module('handleApp.easyRTCServices', [])

.factory('EasyRTC', function ($window, $timeout) {
  // gets set after a room is clicked in the lobby, gets passed to 
  // joinRoom
  var currentRoom = null;

  // gets set to true after connecting in lobby, prevents repeated attempts to connect to easyrtc 
  // after connection has been established. 
  var connectionEstablished = false;

  var setCurrentRoom = function (roomName) {
    currentRoom = roomName;
  };

  var getCurrentRoom = function () {
    return currentRoom;
  };

  // attached to buttons by roomListener to call other users
  var performCall = function (easyrtcid) {
    easyrtc.call(
      easyrtcid,
      function(easyrtcid) {console.log("completed call to " + easyrtcid);},
      function(errorCode, errorText) {console.log("err:" + errorText);},
      function(accepted, bywho) {
        console.log((accepted?"accepted":"rejected")+ " by " + bywho);
      }
    );
  };
  
  // gets called when another user joins or leaves, calls other user and creates identifying paragraph tag
  var roomListener = function (roomName, otherPeers) {
    console.log('room listener entered');
    var partnerNameContainer = $window.document.getElementById('partnerNameContainer'); 

    while (partnerNameContainer.hasChildNodes()) {
        partnerNameContainer.removeChild(partnerNameContainer.lastChild);
    }

    for (var i in otherPeers) {
    
      if ($window.easyrtc.getConnectStatus(i) !== 'is connected') {
        $timeout(function () {
          if ($window.easyrtc.getConnectStatus(i) === 'not connected') {
            performCall(i);
          }
        }, 3000);
      }
        
      var partnerParagraph = $window.document.createElement('p');
      var partnerName = $window.document.createTextNode('Interview Partner: ' + otherPeers[i].username);
      partnerParagraph.appendChild(partnerName);
      partnerNameContainer.appendChild(partnerParagraph);
    }
  };

  // this seemingly redundant function in necessary because it's the only way to access
  // otherPeers when initially joining an existing room
  var initRoomListener = function (roomName, otherPeers) {
    var partnerNameContainer = $window.document.getElementById('partnerNameContainer'); 

    while (partnerNameContainer.hasChildNodes()) {
        partnerNameContainer.removeChild(partnerNameContainer.lastChild);
    }

    for (var i in otherPeers) {
      var partnerParagraph = $window.document.createElement('p');
      var partnerName = $window.document.createTextNode('Interview Partner: ' + otherPeers[i].username);
      partnerParagraph.appendChild(partnerName);
      partnerNameContainer.appendChild(partnerParagraph);
    }  
  };


  // gets called when the room view is loaded, sets up the elements for local and
  // remote video streams, also joins currentRoom and sets up room listener
  var interviewInit = function () {
    var initMediaSourceSuccess = function () {
      var selfVideo = $window.document.getElementById('self');
      $window.easyrtc.setVideoObjectSrc(selfVideo, $window.easyrtc.getLocalStream()); 

      // this is critical to the application's functioning, roomListener gets called when
      // someone joins or exits, this function must only get called AFTER setVideoObjectSrc 
      $window.easyrtc.setRoomOccupantListener(roomListener);
    };  
    var initMediaSourceFailure = function (err) {
      console.log(err);
    };
     
    // if there is a currentRoom, perform init logic, else do nothing
    if (currentRoom) {
      $window.easyrtc.setRoomOccupantListener(initRoomListener);
      $window.easyrtc.joinRoom(currentRoom);
      $window.easyrtc.initMediaSource(initMediaSourceSuccess, initMediaSourceFailure);

      // callback ties video element to incoming remote stream 
      $window.easyrtc.setStreamAcceptor(function (callerEasyrtcid, stream) {
        var video = $window.document.getElementById('other');
        $window.easyrtc.setVideoObjectSrc(video, stream);
      });

      //callback changes video element source to empty string when remote user disconnects
      $window.easyrtc.setOnStreamClosed(function (callerEasyrtcid) {
        $window.easyrtc.setVideoObjectSrc($window.document.getElementById('other'), '');
      });

    }
  };

  // connects to easyrtc if the flag is set to false 
  var connect = function (callback) {
    var connectSuccess = function (selfId) {
      console.log('My easyrtcid is:', selfId);
      // this callback gets the room list
      connectionEstablished = true;
      callback();
    };
    var connectFailure = function (err) {
      console.log(err);
    };
    
    // prevent connection attempt when going back to lobby from room 
    if (connectionEstablished === false) {

      // User name gets set here for easy rtc
      $window.easyrtc.setUsername('fred');
      $window.easyrtc.connect('interview', connectSuccess, connectFailure);
    }
  };

  // disconnects from easyrtc
  var roomDisconnect = function () {
    $window.easyrtc.setRoomOccupantListener(null);
    connectionEstablished = false;
    $window.easyrtc.leaveRoom(currentRoom);
    currentRoom = null;
    $window.easyrtc.disconnect();
  };

  var leaveRoom = function () {
    $window.easyrtc.setRoomOccupantListener(null);
    $window.easyrtc.leaveRoom(currentRoom);
    currentRoom = null;
  };
  
  var lobbyDisconnect = function () {
    connectionEstablished = false;
    $window.easyrtc.disconnect();
  };

  // gets rooms and passes an array of room names to callback
  var getRooms = function (callback) {
    var rooms = [];
    $window.easyrtc.getRoomList(function (roomList) {
        for (var i in roomList) {
          if (roomList[i].numberClients === 1) {
            rooms.push(roomList[i].roomName);
          }
        }
        callback(rooms);
    }, function () {console.log('error getting rooms');});
  };

  return {
    interviewInit: interviewInit, 
    roomDisconnect: roomDisconnect,
    lobbyDisconnect: lobbyDisconnect,
    connect: connect,
    getRooms: getRooms,
    leaveRoom: leaveRoom,
    setCurrentRoom: setCurrentRoom,
    getCurrentRoom: getCurrentRoom
  }; 
});