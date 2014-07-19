var bcrypt    = require('bcryptjs');
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


  // See http://sequelizejs.com/docs/1.7.8/models#definition for details about definitions below.
  User = sequelize.define('User', 
  {
    email: { 
      type: Sequelize.STRING(128), 
      allowNull: false, 
      unique: true,
      validate: {
        isEmail: true
      }},
    password: { 
      type: Sequelize.STRING(128), 
      allowNull: false,
      // set: function(value) {
      //   // Salt!
      //   // Encrypt!
      // } 
    },
    name: { 
      type: Sequelize.STRING(64), 
      allowNull: false 
    }
  },
  {
    instanceMethods: {
      // No instance methods defined yet.
    },
    classMethods: {
      // Validate the enteredPassword against this User instance's persisted password.
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

// Room = sequelize.define('Room',
// {
//   name: { type: Sequelize.STRING(64), allowNull: false },
//   created_by: {}
// })

// Interview = sequelize.define('Interview',
// { 
//   // room name

// })

sequelize
  .sync({force:true})
  .complete(function(err) {
    if (!!err) {
      console.log('An error occurred while creating the table: ', err);
    } else {
      console.log('User table created (if sync force=true)');
    }
  });
