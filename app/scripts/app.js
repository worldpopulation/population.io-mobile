(function () {
  'use strict';

  angular.module('populationioApp', [ 'ngResource', 'ngRoute', 'angucomplete' ])

  .config(function ($routeProvider, $locationProvider) {
    // $routeProvider
    //   .when('/', {
    //     templateUrl: 'partials/main.html',
    //     controller: 'MainCtrl'
    //    });
    $locationProvider.html5Mode(true);
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