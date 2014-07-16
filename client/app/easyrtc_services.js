angular.module('handleApp.easyRTCServices', [])

.factory('EasyRTC', function ($window) {
  // gets set after a room is clicked in the lobby, gets passed to 
  // joinRoom
  var currentRoom = null;

  // gets set to true after connecting in lobby, prevents repeated attempts to connect to easyrtc 
  // after connection has been established. 
  var connectionEstablished = false;

  var setCurrentRoom = function (roomName) {
    currentRoom = roomName;
  };

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

  var roomListener = function (roomName, otherPeers) {
    var partnerButtonContainer = $window.document.getElementById('partnerButtonContainer');
    var partnerNameContainer = $window.document.getElementById('partnerNameContainer'); 

    while (partnerButtonContainer.hasChildNodes()) {
        partnerButtonContainer.removeChild(partnerButtonContainer.lastChild);
    }
    while (partnerNameContainer.hasChildNodes()) {
        partnerNameContainer.removeChild(partnerNameContainer.lastChild);
    }

    for (var i in otherPeers) {
      var button = $window.document.createElement('button');
      button.onclick = function (easyrtcid) {
        return function () {
          performCall(easyrtcid);
        }
      }(i);
        
      var partnerParagraph = $window.document.createElement('p');
      var partnerName = $window.document.createTextNode('Interview Partner: ' + otherPeers[i].username);
      partnerParagraph.appendChild(partnerName);

      var label = $window.document.createTextNode('Click to connect to ' + otherPeers[i].username);
      button.appendChild(label);
      partnerButtonContainer.appendChild(button);
      partnerNameContainer.appendChild(partnerParagraph);
    }
  };


  // gets called when the room view is loaded, sets up the elements for local and
  // remote video streams, also joins currentRoom and sets up room listener
  var interviewInit = function () {
    var initMediaSourceSuccess = function () {
      var selfVideo = $window.document.getElementById('self');
      $window.easyrtc.setVideoObjectSrc(selfVideo, $window.easyrtc.getLocalStream()); 
    };  
    var initMediaSourceFailure = function (err) {
      console.log(err);
    };
    
    // if there is a currentRoom, perform init logic, else do nothing
    if (currentRoom) {
      $window.easyrtc.joinRoom(currentRoom);
      
      // this is critical to the application's functioning, roomListener gets called when
      // someone joins or exits 
      $window.easyrtc.setRoomOccupantListener(roomListener);

      // callback ties video element to incoming remote stream 
      $window.easyrtc.setStreamAcceptor(function (callerEasyrtcid, stream) {
        var video = $window.document.getElementById('other');
        $window.easyrtc.setVideoObjectSrc(video, stream);
      });

      // callback changes video element source to empty string when remote user disconnects
      $window.easyrtc.setOnStreamClosed(function (callerEasyrtcid) {
        $window.easyrtc.setVideoObjectSrc($window.document.getElementById('other'), '');
      });

      $window.easyrtc.initMediaSource(initMediaSourceSuccess, initMediaSourceFailure);
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
      $window.easyrtc.setUsername('fred');
      $window.easyrtc.connect('interview', connectSuccess, connectFailure);
    }
  };

  // disconnects from easyrtc
  var disconnect = function () {
    connectionEstablished = false;
    $window.easyrtc.leaveRoom(currentRoom);
    currentRoom = null;
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

  var leaveRoom = function () {
    $window.easyrtc.leaveRoom(currentRoom);
    haveCalledUser = false;
    currentRoom = null;
  };
  
  return {
    interviewInit: interviewInit, 
    disconnect: disconnect,
    connect: connect,
    getRooms: getRooms,
    leaveRoom: leaveRoom,
    setCurrentRoom: setCurrentRoom
  }; 
});