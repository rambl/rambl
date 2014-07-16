var userModel = require('./userModel.js');
var Q    = require('q');
var jwt  = require('jwt-simple');

var secret = 'secret!';

module.exports = {
  login: function(req, res, next) {

    console.log('userController login');
    
    var email = req.body.email;
    var password = req.body.password;

    User.find({where: {email: email}})
      .complete(function(err, user){
        console.log('complete function called');
        if (user !== null) {
          // checkAuth. (will need to hash password)
          if (user.password === password) {
            // Success!
            console.log('let this user in!');
            var token = jwt.encode(user, secret);
            res.json({token:token});
          } else {
            console.log('invalid password for user')
          }
        } else {
          // User does not exist
          // TODO: Create message for user.
          console.log('User does not exist.')
        }
    });


    console.log('login called for ', email);
  },

  signup: function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;

    console.log('signup called for ', email);

    // Check to see if user already exists
    var formUser = User.build({
        email: email,
        password: password,
        name: name
      });


    User.find({where: {email: email}})
      .complete(function(err, user){
        console.log('complete function called');
        if (user === null) {
          formUser.save().complete(function(err) {
            if (!!err) {
              console.log('Error while saving. ', err);
            } else {
              console.log('User saved successfully.');
              // TODO: Go to next step....
            }
          });          
        } else {
          // User already exists
          // TODO: Create message for user.
          console.log('User already exists.')
        }
    });
  },

  checkAuth: function(req, res, next) {
    // Check to see if the user is authenticated.
    // Grab the token in the header, if any,
    // then decode the token, which end up being the user object
    // check to see if that user exists in the database
    console.log('checkAuth called');

    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, secret);
      var findUser = Q.nbind(User.find, User);
      findUser({email: user.email})
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
