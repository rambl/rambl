angular.module('handleApp.authServices', [])

.factory('Auth', function ($http, $location, $window) {
  // it is responsible for authenticating our user
  // by exchanging the user's username and password
  // for a JWT from the server
  // that JWT is then stored in localStorage as 'com.shortly'
  // after you login/signup open devtools, click resources,
  // then localStorage and you'll see your token from the server

  var login = function (user) {
    console.log('auth_services login called');

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

  var signup = function (user) {
    console.log('auth_services signup called');

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
    console.log('auth_services isAuth called');

    return $http({
      method: 'GET',
      url: '/api/users/signedin'
    });
  };

  return {
    login: login,
    signup: signup,
    isAuth: isAuth
  };
});
