(function () {
  'use strict';

  angular.module('populationioApp')
      .directive('statsArea', function () {
        return {
          restrict: 'A',
          templateUrl: 'partials/stats-area.html',
          link: function (scope, element, attrs, ngModel) {
            var parentWidth = window.innerWidth - 100,
                parentHeight = window.innerHeight - 100;


//            scope.$watch(function () {
//              if (scope.testChartData) {
//                data = _.sortBy(scope.testChartData, function (item) { return -item.deal_value; });
//              }
//            });

          }
        };
      })
      .directive('peopleArea', function () {
        return {
          restrict: 'A',
          templateUrl: 'partials/people-area.html',
          link: function (scope, element, attrs, ngModel) {
            var parentWidth = window.innerWidth - 100,
                parentHeight = window.innerHeight - 100
                ;


//            scope.$watch(function () {
//              if (scope.testChartData) {
//                data = _.sortBy(scope.testChartData, function (item) { return -item.deal_value; });
//              }
//            });

          }
        };
      })
      .directive('storyArea', function () {
        return {
          restrict: 'A',
          templateUrl: 'partials/story-area.html',
          link: function (scope, element, attrs, ngModel) {
            var parentWidth = window.innerWidth - 100,
                parentHeight = window.innerHeight - 100
                ;


//            scope.$watch(function () {
//              if (scope.testChartData) {
//                data = _.sortBy(scope.testChartData, function (item) { return -item.deal_value; });
//              }
//            });

          }
        };
      })
      .directive('positionArea', function () {
        return {
          restrict: 'A',
          templateUrl: 'partials/position-area.html',
          link: function (scope, element, attrs, ngModel) {
            var parentWidth = window.innerWidth - 100,
                parentHeight = window.innerHeight - 100
                ;


//            scope.$watch(function () {
//              if (scope.testChartData) {
//                data = _.sortBy(scope.testChartData, function (item) { return -item.deal_value; });
//              }
//            });

          }
        };
      })
      .directive('expectancyArea', function () {
        return {
          restrict: 'A',
          templateUrl: 'partials/expectancy-area.html',
          link: function (scope, element, attrs, ngModel) {
            var parentWidth = window.innerWidth - 100,
                parentHeight = window.innerHeight - 100
                ;


//            scope.$watch(function () {
//              if (scope.testChartData) {
//                data = _.sortBy(scope.testChartData, function (item) { return -item.deal_value; });
//              }
//            });

          }
        };
      })
      .directive('shareArea', function () {
        return {
          restrict: 'A',
          templateUrl: 'partials/share-area.html',
          link: function (scope, element, attrs, ngModel) {
            var parentWidth = window.innerWidth - 100,
                parentHeight = window.innerHeight - 100
                ;


//            scope.$watch(function () {
//              if (scope.testChartData) {
//                data = _.sortBy(scope.testChartData, function (item) { return -item.deal_value; });
//              }
//            });

          }
        };
      })
      .directive('scrollTracker', function () {
        return {
          restrict: 'A',
          link: function (scope, element, attrs, ngModel) {
            scope.$watch('currentPage', function (newValue, oldValue) {
              if (newValue != oldValue) {
                setTimeout(function () {
                  var el = $('section[data-order=' + newValue + ']');
                  $("body").animate({scrollTop: el.offset().top}, "slow");
                }, 100);

              }

            });
          }
        };
      });
}());