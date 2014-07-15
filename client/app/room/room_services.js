angular.module('handleApp.roomServices', [])

.factory('EasyRTCChat', function ($window) {

  // callback ties video element to incoming remote stream 
  $window.easyrtc.setStreamAcceptor(function (callerEasyrtcid, stream) {
  	console.log('setStreamAcceptor callback called')
    var video = $window.document.getElementById('other');
    $window.easyrtc.setVideoObjectSrc(video, stream);
  });

  // callback changes video element source to empty string when remote user disconnects
  $window.easyrtc.setOnStreamClosed(function (callerEasyrtcid) {
    $window.easyrtc.setVideoObjectSrc($window.document.getElementById('other'), '');
  });

  // this function gets called when the page is loaded, it sets up the element for
  // the local video stream and connects to the server
	var init = function () {
   
    var connectFailure = function (err) {
    	console.log(err);
    };

	  var initMediaSourceSuccess = function () {
  		var selfVideo = $window.document.getElementById('self');
  	  $window.easyrtc.setVideoObjectSrc(selfVideo, $window.easyrtc.getLocalStream());	
	  };	

    $window.easyrtc.initMediaSource(initMediaSourceSuccess, connectFailure);
	};

	return {
		init: init 
	};
});