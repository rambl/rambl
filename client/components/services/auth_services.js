angular.module('ramblApp.authServices', [])

.factory('Auth', ['$http', '$location', '$window',
  function ($http, $location, $window) {
    // it is responsible for authenticating our user
    // by exchanging the user's username and password
    // for a JWT from the server
    // that JWT is then stored in localStorage as 'com.shortly'
    // after you login/signup open devtools, click resources,
    // then localStorage and you'll see your token from the server

    var getUsername = function() {
      return $window.localStorage.getItem('ramblUsername');
    };

    var login = function (user) {

      return $http({
        method: 'POST',
        url: '/api/users/login',
        data: user
      })
      .then(function (resp) {
        var userObj = {
          token: resp.data.token,
          userName: resp.data.userName,
          email: resp.data.email
        };

        return userObj;
      });
    };

    var signout = function () {
      $window.localStorage.removeItem('ramblToken');
      $window.localStorage.removeItem('ramblUsername');
      $location.path('/');
    };

    var signup = function (user) {

      return $http({
        method: 'POST',
        url: '/api/users/signup',
        data: user
      })
      .then(function (resp) {
        var userObj = {
          token: resp.data.token,
          userName: resp.data.userName,
          email: resp.data.email
        };

        return userObj;
      });
    };

    var isAuth = function () {

      return $http({
        method: 'GET',
        url: '/api/users/signedin'
      });
    };

    var processLogin = function(userObject) {
      $window.localStorage.setItem('ramblToken', userObject.token);
      $window.localStorage.setItem('ramblUsername', userObject.userName);
      $location.path('/lobby');
    };


    return {
      getUsername: getUsername,
      login: login,
      signup: signup,
      signout: signout,
      isAuth: isAuth,
      processLogin: processLogin
    };
}]);
