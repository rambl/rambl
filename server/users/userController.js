var User = require('./userModel.js');
var q    = require('q');
var jwt  = require('jwt-simple');

module.exports = {
  login: function(req, res, next) {

    console.log('userController login');
    
    var email = req.body.email;
    var password = req.body.password;

    // find user
    var findUser = User.checkForUser(email);

    console.log(findUser);
    

  },

  signup: function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;

    
  },

  checkAuth: function(req, res, next) {
    // Check to see if the user is authenticated.
    // Grab the token in the header, if any,
    // then decode the token, which end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }

}
