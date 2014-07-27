angular.module('ramblApp.about', [])

.controller('aboutController', ['$scope', '$window', 'EasyRTC',
  function ($scope, $window, EasyRTC) {
    // check if user is coming from lobby/room and if so remove them from room 
    // and/or disconnect from easyrtc
    if (EasyRTC.getCurrentRoom() !== null) {
      EasyRTC.leaveRoom();
    }
    if (EasyRTC.getConnectionStatus() === true) {
      EasyRTC.disconnect();
    }
}]);