(function () {
  'use strict';

  angular.module('populationioApp')

    .directive('birthdaysArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/birthdays-area.html'
      };
    })

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

    .directive('share', function ($location) {
      return {
        link: function ($scope, elem, attrs) {
          $scope.$watch(function() {
            return $location.absUrl();
          }, function(url) {
            _update(url);
          });

          var _update = function(url) {
            var link = '#';
            switch (attrs.share) {
              case 'twitter':
                link = 'http://twitter.com/intent/tweet?text=' + attrs.shareTitle + '%20' + url;
              break;
              case 'facebook':
                link = 'http://facebook.com/sharer.php?u=' + url;
              break;
              case 'linkedin':
                link = 'http://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + attrs.shareTitle;
              break;
            }
            attrs.$set('href', link);
          }
        }
      };
    })
    ;
}());

