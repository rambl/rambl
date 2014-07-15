var userController = require('./userController.js');

module.exports = function(app) {
  app.post('/home', userController.login);
  app.post('/signup', userController.signup);
  app.get('/signedin', userController.checkAuth);
};