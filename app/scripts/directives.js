(function () {
  'use strict';

  angular.module('populationioApp')

    .directive('statsArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/stats-area.html'
      };
    })

    .directive('peopleArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/people-area.html'
      };
    })

    .directive('storyArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/story-area.html'
      };
    })

    .directive('expectancyArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/expectancy-area.html'
      };
    });
}());

