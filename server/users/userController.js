var userModel = require('./userModel.js');
var jwt  = require('jwt-simple');

var secret = '8n24hEyJo7jYCEi';

module.exports = {
  login: function(req, res, next) {
    console.log('USERCONTROLLOER LOGIN');
    
    var email = req.body.email;
    var password = req.body.password;

    User.find({where: {email: email}})
      .complete(function(err, user){
        if (user !== null) {
          // TODO -- Hash password (It's plaintext now, which is awful)
          var isMatch = user.checkPassword(password);
          console.log('isMatch=' + isMatch + ' for password ' + password);

          if (isMatch === true) {
            // Success!
            console.log('Login successful for this user.');
            var token = jwt.encode(user, secret);

            var userObj = {
              token: token,
              userName: user.name,
              email: user.email
            };
            res.json(userObj);
          } else {
            console.log('Password authentication failed.');
            var errorObj = {
              type: 'error',
              message: 'Password authentication failed.'
            };
            //res.json(errorObj);
            res.send(401, 'Password authentication failed.');
          }
        } else {
          // User does not exist
          console.log('User does not exist.');
          var errorObj = {
            type: 'error',
            message: 'User does not exist.'
          };
          res.json(errorObj);
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
              var errorObj = {
                type: 'error',
                message: 'Unable to create the account.'
              };
              res.json(errorObj);
            } else {
              console.log('User saved successfully.');
              module.exports.login(req, res, next);
            }
          });          
        } else {
          // User already exists
          console.log('User already exists.');
          var errorObj = {
            type: 'error',
            message: 'User already exists.'
          };
          res.json(errorObj);
        }
    });
  },

  checkAuth: function(req, res, next) {
    console.log('checkAuth called');

    var token = req.headers['x-access-token'];
    if (!!token) {
      console.log('401: No token found.');
      //res.send(401);
    } else {
      console.log('checkAuth token found: ', token);
      var user = null;
      try {
        user = jwt.decode(token, secret);
      } catch (exception) {
        console.log('500: Unable to decode jwt token. ', exception);
        res.send(500, 'Unable to decode token.');
        return; // Seems necessary to avoid the rest of the method from being run.
      }

      // console.log('Decoded user from token: ', user);
      if (user && user.email) {
        User.find({where: {email: user.email}})
          .complete(function(err, foundUser){
            if (!!err) {
              console.log('500: Error encountered while checking db: ', err);
              res.send(500, err.message);
            } else if (user === null) {
              console.log('401: No user found.');
              res.send(401);
            } else  {
              console.log('200: Success! User found.');
              res.send(200);
            }
          });
      } else {
        console.log('401: User or user.email is blank.');
        res.send(401);
      }
    }
  }
}
