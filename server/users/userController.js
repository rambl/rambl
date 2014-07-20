var userModel = require('./userModel.js');
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

      console.log('checkAuth no token found! Calling next.');

      next(new Error('No token'));
    } else {
      // console.log('checkAuth token found: ', token);
      var user = jwt.decode(token, secret);

      // console.log('Decoded user from token: ', user);
      if (user && user.email) {
        User.find({where: {email: user.email}})
          .complete(function(err, foundUser){
            if (!!err) {
              console.log('Error encountered while checking db: ', err);
              res.send(500, err.message);
            }
            else if (user === null) {
              console.log('No user found');
              res.send(401);
            } else  {
              console.log('User found. User: ', foundUser.values);
              res.send(200);
            }
          });
      } else {
        console.log('user or user email is blank. User: ', user);
        res.send(401);
      }
    }
  }
}
