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

    .directive('onePageScroll', function ($location, $state, $filter, ProfileService) {
      return {
        restrict: 'E',
        link: function ($scope, element) {
          $(element[0]).fullpage({
            navigation: true,
            css3: true,
            scrollOverflow: true,
            verticalCentered: false,
            scrollingSpeed: 500,
            afterLoad: function(anchor, index) {
              // TODO: refactor me, duplicate code in controller
              if (anchor !== 'stats') {
                var birthday = ProfileService.birthday;
                $scope.forceUrl = true;
                $state.go('section', {
                  year: $filter('date')(birthday, 'yyyy'),
                  month: $filter('date')(birthday, 'MM'),
                  day: $filter('date')(birthday, 'dd'),
                  country: ProfileService.country,
                  state: anchor
                });
              } else {
                $state.go('root');
              }
              $scope.activeIndex = index;
            }
          });

          $.fn.fullpage.setAllowScrolling(false);
          $.fn.fullpage.setKeyboardScrolling(false);

          $scope.$watch(function() {
            return ProfileService.active;
          }, function(value) {
            $.fn.fullpage.setAllowScrolling(value);
            $.fn.fullpage.setKeyboardScrolling(value);
          });
        }
      };
    });
}());

