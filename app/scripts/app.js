(function () {
  'use strict';

  angular.module('populationioApp', [ 'ngResource', 'ui.router', 'ngAnimate', 'ui.bootstrap' ])

  .config(function ($locationProvider, $urlRouterProvider, $stateProvider) {
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