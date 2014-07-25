angular.module('ramblApp.easyRTCServices', [])

.factory('EasyRTC', ['$window', '$timeout', '$location',
  function ($window, $timeout, $location) {
    // gets set after a room is clicked in the lobby, gets passed to joinRoom
    var currentRoom = null;

    // gets set to true after connecting in lobby, prevents repeated attempts to connect to easyrtc
    // after connection has been established.
    var connectionEstablished = false;

    var getConnectionStatus = function () {
      return connectionEstablished;
    };

    var setCurrentRoom = function (roomName) {
      currentRoom = roomName;
    };

    var getCurrentRoom = function () {
      return currentRoom;
    };

    // calls other user
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
      var partnerNameContainer = $window.document.getElementById('partner_name_container');

      while (partnerNameContainer.hasChildNodes()) {
          partnerNameContainer.removeChild(partnerNameContainer.lastChild);
      }

      for (var i in otherPeers) {

        // if the other peer is in not connected or processing status
        // wait 3 seconds and if the peer is not connected, call them
        // this is meant to reduce the chances of peers calling each other at the same moment
        if ($window.easyrtc.getConnectStatus(i) !== 'is connected') {
          $timeout(function () {
            if ($window.easyrtc.getConnectStatus(i) === 'not connected') {
              performCall(i);
            }
          }, 3000);
        }

        var partnerParagraph = $window.document.createElement('p');
        var partnerName = $window.document.createTextNode('Interview Partner: ' + otherPeers[i].username );
        partnerParagraph.appendChild(partnerName);
        partnerNameContainer.appendChild(partnerParagraph);
      }
    };

    // this seemingly redundant function is a necessary workaround because of how easyrtc works.
    // when calling setRoomOccupantListener, the passed in callback will not be run if a user
    // has already joined a room, but the listener must also be set after calling setVideoObjSrc
    // or else the remote user will not get the local stream. It would seem to make sense to simply
    // call joinRoom last and only set a listener once, but server-side errors result when calling joinRoom after
    // all of the other setup
    var initRoomListener = function (roomName, otherPeers) {
      var partnerNameContainer = $window.document.getElementById('partner_name_container');

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

      // ensure that user has a currentRoom and that the room either doesn't exist or only has at most 1 other client
      // before joining, else return to lobby. rooms cannot be easily deleted so an existing room with 0 clients
      // is always possible
      if (currentRoom) {
        $window.easyrtc.getRoomList(function (roomList) {
          if (roomList[currentRoom] === undefined || roomList[currentRoom].numberClients <= 1) {

            // the order of functions in this block is important, changing the order will result
            // in bugs that are extremely difficult to diagnose

            // initRoomListener is used only to produce a paragraph element containing
            // the other user's name, it is overwritten by roomListener after initMediaSourceSuccess
            // is called
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
              // check if element exists so there isn't an error calling leaveRoom in a different view
              if ($window.document.getElementById('other')) {
                $window.easyrtc.setVideoObjectSrc($window.document.getElementById('other'), '');
              }
            });
          } else {
            $location.path('/lobby');
          }
        });
      } else {
        $location.path('/lobby');
      }


    };

    // connects to easyrtc if the flag is set to false
    var connect = function (callback) {
      var connectSuccess = function (selfId) {
        connectionEstablished = true;

        // this callback gets the room list
        callback();
      };
      var connectFailure = function (err) {
        console.log(err);
      };

      // prevent connection attempt when going back to lobby from room
      if (connectionEstablished === false) {

        // User name gets set here for easyrtc
        $window.easyrtc.setUsername($window.localStorage.getItem('ramblUsername'));
        $window.easyrtc.connect('interview', connectSuccess, connectFailure);
      }
    };

    // this function is called throughout the app if the user navigates elsewhere from a room
    var leaveRoom = function () {
      $window.easyrtc.setRoomOccupantListener(null);
      $window.easyrtc.hangupAll();
      $window.easyrtc.leaveRoom(currentRoom);
      if ($window.easyrtc.getLocalStream()) {
        $window.easyrtc.getLocalStream().stop();
      }
      currentRoom = null;
    };

    // this function is called throughout the app if the user navigates anywhere other than
    // lobby from a room
    var disconnect = function () {
      if ($window.easyrtc.getLocalStream()) {
        $window.easyrtc.getLocalStream().stop();
      }
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
      disconnect: disconnect,
      connect: connect,
      getRooms: getRooms,
      leaveRoom: leaveRoom,
      setCurrentRoom: setCurrentRoom,
      getCurrentRoom: getCurrentRoom,
      getConnectionStatus: getConnectionStatus,
    };
}]);
