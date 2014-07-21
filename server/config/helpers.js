var jwt  = require('jwt-simple');

var secret = '8n24hEyJo7jYCEi';

module.exports = {
  errorLogger: function (error, req, res, next) {
    // log the error then send it to the next middleware in
    // middleware.js
    console.error(error.stack);
    next(error);
  },

  errorHandler: function (error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    console.log('errorHandler called for ', error);
    res.send(500, {error: error.message});
  },

  decode: function (req, res, next) {
    console.log('decode called');
    var token = req.headers['x-access-token'];
    var user;

    if (!token) {
      console.log('Sending 403 forbidden because token is not provided.');
      return res.send(403); 
    }

    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, secret);
      req.user = user;
      next();
    } catch(error) {
      return next(error);
    }

  }
};
