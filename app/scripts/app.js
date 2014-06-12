(function () {
  'use strict';

  angular.module('populationioApp', [ 'ngResource', 'ui.router', 'ngAnimate', 'ui.bootstrap' ])

  .config(function ($locationProvider, $urlRouterProvider, $stateProvider, $httpProvider) {
    $stateProvider
      .state('root', {
        url: '/',
        controller: 'StatsCtrl'
      })
      .state('people', {
        url: '/:year/:month/:day/:country/people',
        controller: 'PeopleCtrl'
      })
      .state('story', {
        url: '/:year/:month/:day/:country/story',
        controller: 'StoryCtrl'
      })
      .state('birthdays', {
        url: '/:year/:month/:day/:country/birthdays',
        controller: 'BirthdaysCtrl'
      })
      .state('expectancy', {
        url: '/:year/:month/:day/:country/expectancy',
        controller: 'ExpectancyCtrl'
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