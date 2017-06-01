angular.module('app', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('main', {
          url: '/',
            views: {
              'user': {
                templateUrl: 'templates/user.html'
              },
              'service': {
                templateUrl: 'templates/service.html'
              },
              'reviews': {
                templateUrl: 'templates/reviews.html',
                controller: 'reviewsController',
                controllerAs: 'reviewsCtrl'
              }
            }
        });
      
      $urlRouterProvider.otherwise('/');
    }]);