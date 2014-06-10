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
    })

    .directive('onePageScroll', function ($location, $routeParams) {
      return {
        restrict: 'E',
        link: function ($scope, element) {
          $(element[0]).fullpage({
            navigation: true,
            css3: true,
            scrollOverflow: true,
            verticalCentered: false
          });

          $.fn.fullpage.moveTo(2);

          $scope.$on('pageChanged', function(e, page) {
            console.info('pageChanged', page)
          });
        }
      };
    });
}());

