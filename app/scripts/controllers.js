(function () {
  'use strict';

  angular.module('populationioApp')
    .controller('MainCtrl', function ($scope, Data, $rootScope, $location) {

      Data.query(function (testChartData) {
        $rootScope.testChartData = testChartData;
        console.log($rootScope.testChartData);
      });

    })
    .controller('StatsCtrl', function ($scope, Data, $rootScope, $location) {

      Data.query(function (testChartData) {
        $rootScope.testChartData = testChartData;
        console.log($rootScope.testChartData);
      });

    })
    .controller('PeopleCtrl', function ($scope, Data, $rootScope, $location) {

      Data.query(function (testChartData) {
        $rootScope.testChartData = testChartData;
        console.log($rootScope.testChartData);
      });

    })
    .controller('StoryCtrl', function ($scope, Data, $rootScope, $location) {

      Data.query(function (testChartData) {
        $rootScope.testChartData = testChartData;
        console.log($rootScope.testChartData);
      });

    })
    .controller('PositionCtrl', function ($scope, Data, $rootScope, $location) {

      Data.query(function (testChartData) {
        $rootScope.testChartData = testChartData;
        console.log($rootScope.testChartData);
      });

    })
    .controller('ExpectancyCtrl', function ($scope, Data, $rootScope, $location) {

      Data.query(function (testChartData) {
        $rootScope.testChartData = testChartData;
        console.log($rootScope.testChartData);
      });

    })
    .controller('ShareCtrl', function ($scope, Data, $rootScope, $location) {

      Data.query(function (testChartData) {
        $rootScope.testChartData = testChartData;
        console.log($rootScope.testChartData);
      });

    })
  ;
}());