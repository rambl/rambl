angular.module('handleApp.room', [])

.controller('roomController', function ($scope, EasyRTC) {
  EasyRTC.init();
});

