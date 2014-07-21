var morgan      = require('morgan'); // used for logging incoming request
var bodyParser  = require('body-parser');
var helpers     = require('./helpers.js'); // our custom middleware

module.exports = function (app, express) {
  var userRouter = express.Router();
  //var linkRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  // user user router for all user request
  app.use('/api/users', userRouter); 

  // authentication middleware used to decode token and made available on the request
  app.use('/api/users', helpers.decode);
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their perspective route files
  require('../users/userRoutes.js')(userRouter);

  console.log('End of middleware');
};
