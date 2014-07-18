var userModel = require('./userModel.js');
var Q    = require('q');
var jwt  = require('jwt-simple');

var secret = '8n24hEyJo7jYCEi';

module.exports = {
  login: function(req, res, next) {
    //console.log('userController login');
    
    var email = req.body.email;
    var password = req.body.password;

    User.find({where: {email: email}})
      .complete(function(err, user){
        console.log('complete function called');
        if (user !== null) {
          // TODO -- Hash password (It's plaintext now, which is awful)
          if (user.password === password) {
            // Success!
            console.log('User passed authentication this user in!');
            var token = jwt.encode(user, secret);

            var userObj = {
              token: token,
              userName: user.name,
              email: user.email
            };
            res.json(userObj);
          } else {
            // TODO: Create message for user.
            console.log('Password authentication failed.');
          }
        } else {
          // User does not exist
          // TODO: Create message for user.
          console.log('User does not exist.');
        }
    });
  },

  signup: function(req, res, next) {
    // Simple object to hold data collected from sign-up form.
    var formUser = User.build({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    });

    // Find the user based on email.
    User.find({where: {email: formUser.email}})
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
    console.log('checkAuth called');

    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, secret);

      //console.log('Decoded user ', user);

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
