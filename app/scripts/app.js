(function () {
  'use strict';

  angular
    .module('populationioApp', [ 'duScroll', 'ngResource', 'ui.router', 'ngAnimate', 'ui.bootstrap'])
    .config(function ($locationProvider, $urlRouterProvider, $httpProvider) {


      // $locationProvider.html5Mode(true);

      // cross domain restriction fixes
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .run(function ($rootScope, $location, $document) {
      console.log('App is running...');
      $rootScope.currentPage = 0;
    })
  ;
}());