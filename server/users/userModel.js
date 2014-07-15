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
var User = sequelize.define('User', 
  {
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    name: Sequelize.STRING
  },
  {
    instanceMethods: {
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
      }
    },
    classMethods: {
      checkForUser: function(email) {
        var exists = 
          User
          .find({where: {email: email}})
          .complete(function(err, user) {
            if (!!err) {
              console.log('Error while searching for user ', err);
            } else if (!user) {
              console.log('No user found for email ', email);
            } else {
              console.log('User found for email ', email);
              return true;
            }
            return false;
          });

        // Probably not correct way to return the found user.
        return exists;
      },

      createUser: function(email, name, password) {
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
  .sync({force:true})
  .complete(function(err) {
    if (!!err) {
      console.log('An error occurred while creating the table: ', err);
    } else {
      console.log('User table created.');
    }
  });
