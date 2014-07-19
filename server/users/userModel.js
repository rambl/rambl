var bcrypt    = require('bcrypt');
var q         = require('q');
var mysql     = require('mysql');
var Sequelize = require('sequelize');

var SALT_WORK_FACTOR = 10;

// TODO: Move these values to environment variables.
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
      console.log('User table created (if sync force=true)');
    }
  });
