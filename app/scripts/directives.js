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
      })
      .directive('worldClock', function () {
        return {
          restrict: 'E',
          link: function (scope, element, attrs, ngModel) {
            var currentValue = 7213000000;
            var digits = ('' + currentValue).split('');
            var clockElement = d3.select(element[0]).append('svg')
                .attr({width: digits.length * 40, height: 80})
                .append('g')
                .attr({transform: 'translate(0,0)'});

            var digit = clockElement.selectAll('.digit')
                .data(digits)
                .enter()
                .append('g')
                .attr({class: 'digit', transform: function (d, i) {return 'translate(' + [i * 40, 0] + ')'}})

            digit.append('rect')
                .attr({fill: 'rgba(0,0,0,0.2)', width: 39, height: 100})
            digit.append('text')
                .text(function (d, i) {
                  return d
                })
                .attr({
                  transform: 'translate(20,30)'
                })

            var digitPlaceholder = clockElement.selectAll('.digit-placeholder')
                .data(digits)
                .enter()
                .append('g')
                .attr({class: 'digit-placeholder', transform: function (d, i) {return 'translate(' + [i * 40, 40] + ')'}})

            digitPlaceholder.append('rect')
                .attr({fill: 'red', width: 39, height: 100})
            digitPlaceholder.append('text')
                .text(function (d, i) {
                  return d
                })
                .attr({
                  transform: 'translate(20,30)'
                })

            var digitToChange = d3.select(digit[0][0]).select('text');
            digitToChange
                .transition()
                .delay(2000)
                .attr({transform: 'translate(20,-10)'})
            var digitPlaceholderToChange = d3.select(digitPlaceholder[0][0]).select('text');
            digitPlaceholderToChange
                .transition()
                .delay(2000)
                .attr({transform: 'translate(20,-10)'})
          }
        };
      })
}());