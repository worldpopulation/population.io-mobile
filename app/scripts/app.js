(function () {
  'use strict';

  angular.module('populationioApp', [ 'ngResource', 'ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'partials/main.html',
          controller: 'MainCtrl'
        });
      $locationProvider.html5Mode(true);
    })

    .run(function ($rootScope, $location) {
      console.log('running');
      //watching the value of the currentUser variable.
//        $rootScope.$watch('currentUser', function (currentUser) {
//            // if no currentUser and on a page that requires authorization then try to update it
//            // will trigger 401s if user does not have a valid session
//            if (!currentUser && (['/', '/login', '/logout', '/signup'].indexOf($location.path()) == -1 )) {
//                Auth.currentUser();
//            }
//        });

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