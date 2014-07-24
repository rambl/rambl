angular.module('ramblApp.about', [])

.controller('AboutController', ['$scope', '$window', 'EasyRTC',
  function ($scope, $window, EasyRTC) {
  	console.log("Your birthday~~!!!!!!!!!!!!!!!!!");
  	$scope.test = "Dandan";
    // check if user is coming from lobby/room and if so remove them from room 
    // and/or disconnect from easyrtc
    if (EasyRTC.getCurrentRoom() !== null) {
      EasyRTC.leaveRoom();
    }
    if (EasyRTC.getConnectionStatus() === true) {
      EasyRTC.disconnect();
    }
}]);