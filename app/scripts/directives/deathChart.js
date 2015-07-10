(function () {
  'use strict';

  angular.module('populationioApp')
  .directive('deathChart', ['$filter', 'PopulationIOService', 'HelloWords', '$timeout', 'ProfileService',
  function ($filter, PopulationIOService, HelloWords, $timeout, ProfileService) {
    return {
      restrict: 'E',
      link: function ($scope, element) {
      }
    }
  }]);
})();
