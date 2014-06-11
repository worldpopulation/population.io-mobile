(function () {
  'use strict';

  angular.module('populationioApp', [ 'ngResource', 'ui.router', 'ngAnimate', 'ui.bootstrap' ])

  .config(function ($locationProvider, $urlRouterProvider, $stateProvider, $httpProvider) {
    $stateProvider
      .state('root', {
        url: '/',
        controller: 'StateCtrl'
      })
      .state('section', {
        url: '/:year/:month/:day/:country/:state',
        controller: 'StateCtrl'
      });

    // $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  .run(function ($rootScope, $location) {
    console.log('running');
    $rootScope.currentPage = 0;
    $rootScope.$watch('currentPage', function (currentPage) {
      console.log('currentPage: ' + currentPage);
    });
  })
  ;
}());