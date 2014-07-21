angular.module('ramblApp.signup', [])

.controller('signupController', ['$scope', '$window', '$location', 'Auth', 'EasyRTC',
  function ($scope, $window, $location, Auth, EasyRTC) {
    
    // if user has userName and token, redirect to lobby, else check if they're coming from
    // lobby/room having signed out and if so remove them from room and/or disconnect from easyrtc
    if ($window.localStorage.getItem('ramblUsername') && $window.localStorage.getItem('ramblToken')) {
      $location.path('/lobby');
    } else {
      if (EasyRTC.getCurrentRoom() !== null) {
        EasyRTC.leaveRoom();
      }
      if (EasyRTC.getConnectionStatus() === true) {
        EasyRTC.disconnect();
      }
    }

    $scope.signup = function () {
      Auth.signup($scope.user)
        .then(function (userObject) {
          if (userObject.token !== undefined && userObject.userName !== undefined) {
            Auth.processLogin(userObject);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }; 

    $scope.signout = Auth.signout; 
}]);