angular.module('ramblApp.about', [])

.controller('aboutController', ['$scope', '$window', 'EasyRTC',
  function ($scope, $window, EasyRTC) {
    if (EasyRTC.getCurrentRoom() !== null) {
      EasyRTC.leaveRoom();
    }
    if (EasyRTC.getConnectionStatus() === true) {
      EasyRTC.disconnect();
    }
}]);