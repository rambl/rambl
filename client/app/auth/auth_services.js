angular.module('handleApp.authServices', [])
.factory('Auth', function ($http, $location, $window) {
  // Don't touch this Auth service!!!
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
      return resp.data.token;
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
      return resp.data.token;
    });
  };

  var isAuth = function () {
    console.log('auth_services isAuth called');
    return $http({
      method: 'GET',
      url: '/api/users/signedin'
    });
  };

  var signout = function () {
    console.log('auth_services signout called')
    $window.localStorage.removeItem('com.handle');
    $location.path('/login');
  };

  return {
    login: login,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
});
