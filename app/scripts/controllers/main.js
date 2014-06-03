'use strict';

angular.module('populationioApp')
  .controller('MainCtrl', function ($scope, Data, $rootScope, $location) {

    Data.query(function (testChartData) {
      $rootScope.testChartData = testChartData;
      console.log($rootScope.testChartData)
    });

  });
