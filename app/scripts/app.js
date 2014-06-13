(function () {
  'use strict';

  angular
    .module('populationioApp', [ 'duScroll', 'ngResource', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'restangular'])
    .config(function ($locationProvider, $urlRouterProvider, $httpProvider, RestangularProvider) {

      RestangularProvider.setBaseUrl('http://104.130.5.217:8000/api/1.0');
      RestangularProvider
        .addResponseInterceptor(function (data, operation, what, url, response, deferred) {
          switch (what) {
            case 'countries':
              var extractedData;
              if (operation === "getList") {
                // .. and handle the data and meta data
                extractedData = data.countries;
              } else {
                extractedData = data;
              }
              return extractedData;
            default:
              return data
          }
        });

      // $locationProvider.html5Mode(true);

      // cross domain restriction fixes
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .factory('Countries', function (Restangular) {
      return Restangular.service('countries')
    })
    .factory('LifeExpectancy', function (Restangular) {
      //http://104.130.5.217:8000/api/1.0/life-expectancy/remaining/male/Germany/2014-06-11/27/
      return Restangular.service('life-expectancy')
    })
    .run(function ($rootScope, $location, $document) {
      console.log('App is running...');
      $rootScope.currentPage = 0;
    })
  ;
}());