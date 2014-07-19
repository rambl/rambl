angular.module('handleApp.auth', [])

.controller('authController', function ($scope, $window, $location, $rootScope, Auth, EasyRTC) {
  
  // if user has userName and token, redirect to lobby, else check if they're coming from
  // lobby/room having signed out and if so remove them from room and/or disconnect from easyrtc
  if ($window.localStorage.getItem('ramblUsername') && $window.localStorage.getItem('com.handle')) {
    $location.path('/lobby');
  } else {
    if (EasyRTC.getCurrentRoom() !== null) {
      EasyRTC.leaveRoom();
    }
    if (EasyRTC.getConnectionStatus() === true) {
      EasyRTC.disconnect();
    }
  }


  // This function is shared by both login and signup and handles the 
  // administrative tasks of setting up the data that needs to be set
  // upon login.
  var processLogin = function(userObject) {
    $window.localStorage.setItem('ramblUsername', userObject.userName);
    $window.localStorage.setItem('com.handle', userObject.token);
    $location.path('/lobby');
  };

  $scope.login = function () {
    Auth.login($scope.user)
      .then(function (userObject) {
        processLogin(userObject);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signout = Auth.signout; 

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (userObject) {
        processLogin(userObject);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});
