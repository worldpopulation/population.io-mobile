(function () {
  'use strict';

  angular.module('populationioApp', [ 'ngResource', 'ngRoute', 'ui.bootstrap' ])

  .config(function ($locationProvider, $routeProvider) {
    $routeProvider
      .when('/:section/:year/:month/:day/:country', {
        controller: 'MainCtrl',
        template: ' '
      });
    // $locationProvider.html5Mode(false);
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