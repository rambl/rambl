angular.module('ramblApp.home', [])

.controller('HomeController', ['$scope', '$window', '$location', 'Auth', 'EasyRTC',
  function ($scope, $window, $location, Auth, EasyRTC) {
    $scope.testHome = "This is testing home controller";
    $scope.invalidAccountInfo = false;

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

    $scope.login = function (form) {
      console.log("scope login in homes.js is calling", form);    
      Auth.login($scope.user)
        .then(function (userObject) {
          console.log("This is home.js login after get userObject");
          if (userObject.token !== undefined && userObject.userName !== undefined) {
            Auth.processLogin(userObject);
          } else {
            $scope.invalidAccountInfo = true;
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    $scope.signout = Auth.signout; 
}]);