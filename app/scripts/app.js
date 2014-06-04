(function () {
  'use strict';

  angular.module('populationioApp', [ 'ngResource', 'ngRoute'])
      .config(function ($routeProvider, $locationProvider) {
//        $routeProvider
//            .when('/', {
//              templateUrl: 'partials/main.html',
//              controller: 'MainCtrl'
//            });
        $locationProvider.html5Mode(true);
      })

      .run(function ($rootScope, $location) {
        console.log('running');
        $rootScope.currentPage = 0;

        $rootScope.$watch('currentPage', function (currentPage) {
//          console.log(currentPage)
        });

//        $rootScope.$on('$locationChangeSuccess', function () {
//            $rootScope.location = $location.path();
//        });
        // On catching 401 errors, redirect to the login page.
//        $rootScope.$on('event:auth-loginRequired', function () {
//            $location.path('/login');
//            return false;
//        });

      });
}());