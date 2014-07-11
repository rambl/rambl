angular.module('handle', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', function () {
  $urlRouterProvider.otherwise('/home');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'app/home/home.html'
  });
}]).run();

