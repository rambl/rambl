angular.module('handleApp.auth', [])

.controller('authController', function ($scope, $window, $location, $rootScope, Auth, EasyRTC) {
  if (EasyRTC.getCurrentRoom() !== null) {
    EasyRTC.leaveRoom();
  }

  if (EasyRTC.getConnectionStatus() === true) {
    EasyRTC.disconnect();
  }

  // This function is shared by both login and signup and handles the 
  // administrative tasks of setting up the data that needs to be set
  // upon login.
  var processLogin = function(userObject) {
    $rootScope.userName = userObject.userName;
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

  $scope.signout = function () {
    console.log('signout called');
    $window.localStorage.removeItem('com.handle');
    $rootScope.userName = null;
    $location.path('/home');
  };

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
