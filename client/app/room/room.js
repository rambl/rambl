angular.module('handleApp.room', [])

.controller('roomController', function ($scope, EasyRTCChat) {
  EasyRTCChat.init();
});

