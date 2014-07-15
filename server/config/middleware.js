var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'); // our custom middleware


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  //var linkRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/client'));

  // user user router for all user request
  app.use('/api/users', userRouter); 

  // authentication middleware used to decode token and made available on the request
  // app.use('/api/links', helpers.decode);
  //app.use('/', linkRouter); // user link router for link request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their perspective route files
  require('../users/userRoutes.js')(userRouter);
  //require('../links/linkRoutes.js')(linkRouter);
};
