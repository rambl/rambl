var bcrypt    = require('bcrypt');
var q         = require('q');
var mysql     = require('mysql');
var Sequelize = require('sequelize');

var SALT_WORK_FACTOR = 10;

var sequelize = new Sequelize('handledb', 'bce62c7ed88dce', 'b3cc7632', {
  dialect: 'mysql',
  host:    'us-cdbr-azure-west-a.cloudapp.net',
  port:    3306
});

sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect ot the database: ', err);
    } else {
      console.log('Connection to db established successfully')
    }
  });

// TODO: Need to apply non-null constraint to some of these tables
  User = sequelize.define('User', 
  {
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    name: Sequelize.STRING
  },
  {
    instanceMethods: {
      // This might more properly be a class method, but not sure on the 
      // difference between two method types
      userAlreadyExists: function() {
        User
          .find({where: {email: this.email}})
          .complete(function(err, user) {
            if (!!err) {
              console.log('Error while searching for user ', err);
              // Returning true here b/c we don't know if user exists
              return true;
            } else if (!user) {
              console.log('No user found for email ', this.email);
              return false;
            } else {
              console.log('User found for email ', this.email);
              return true;
            }
          });
      },

      saveUser: function() {
        this.save()
          .complete(function(err, user) {
            if (!!err) {
              console.log('Unable to save user ', user.email);
              return false;
            } else {
              console.log('Successfully saved user ', user.email);
              return true;
            }
          });
      }
    },
    classMethods: {
      checkPassword: function(enteredPassword) {
        console.log('checkPassword');
        
        var savedPassword = this.password;
        bcrypt.compare(enteredPassword, savedPassword, function(err, isMatch) {
          if (err) {
            console.log('Error while checking passwords. ', err);
            return false;
          } else {
            return isMatch;
          }
        });
      },
      
      createUser: function(email, name, password) {
          console.log('createUser called for ', email);

          var user = User.build({
            email: email,
            name: name, 
            password: password  // Need to encrypt it first
          });

        user
          .save()
          .complete(function(err) {
            if (!!err) {
              console.log('Unable to save user ', email);
            } else {
              console.log('Successfully saved user ', email);
            }
          });
        // Do we return this?
        return user;
      }
    }
  }
);

sequelize
  .sync({force:false})
  .complete(function(err) {
    if (!!err) {
      console.log('An error occurred while creating the table: ', err);
    } else {
      console.log('User table created.');
    }
  });
