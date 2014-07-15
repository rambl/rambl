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
var User = sequelize.define('User', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  name: Sequelize.STRING
});

sequelize
  .sync({force:true})
  .complete(function(err) {
    if (!!err) {
      console.log('An error occurred while creating the table: ', err);
    } else {
      console.log('It worked!');
    }
  });



// // This is not a secure way to connect to the database, 
// // but we're just testing that we can connect at this point.
// var connection = mysql.createConnection({
//   host: 'us-cdbr-azure-west-a.cloudapp.net',
//   user: 'bce62c7ed88dce',
//   password: 'b3cc7632'  
// });

// connection.connect();

// connection.query('select 1+1 as solution', function(err, rows, fields){
//   if (err) throw err;

//   console.log('the solution is: ', rows[0].solution);
// })

// connection.end();

// connection.query('select * from users')
