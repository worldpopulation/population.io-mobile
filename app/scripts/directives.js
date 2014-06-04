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
            var currentValue = 0;
            var digits = ('' + currentValue).split('');
            var clockElement = d3.select(element[0]).append('svg')
                .attr({width: digits.length * 40, height: 40, style: "margin:60px 0 0 60px"})
                .append('g')
                .attr({transform: 'translate(0,0)'});

            var countElement = clockElement.selectAll('.count-element')
                .data(digits)
                .enter()
                .append('g')
                .attr({class: 'count-element', transform: function (d, i) {return 'translate(' + [i * 40, 0] + ')'}})

            var digit = countElement.append('g').attr('class', 'digit')
            digit
                .append('rect')
                .attr({fill: 'transparent', width: 39, height: 40})

            var placeholder = countElement.append('g').attr('class', 'placeholder').
                attr({transform: 'translate(0,40)'})
            placeholder
                .append('rect')
                .attr({fill: 'transparent', width: 39, height: 40})


            digit.append('text')
                .text(function (d, i) {
                  return d
                })
                .attr({
                  transform: 'translate(20,30)'
                })

            placeholder.append('text')
                .text(function (d, i) {
                  return d
                })
                .attr({
                  transform: 'translate(20,30)'
                });

            var updaterInterval = setInterval(function () {
              if (currentValue > 8) {currentValue = -1}
              _updateSingleDigit(currentValue += 1);
            }, 2500)

            function _updateSingleDigit(newDigit) {
//              countElement.select('.digit')
//              console.log(countElement[0][0])
//
              countElement.select('.digit')
                  .transition()
                  .delay(2000)
                  .attr({transform: 'translate(0,-40)'})
              countElement.select('.placeholder text').text(newDigit)
              countElement.select('.placeholder')
                  .transition()
                  .ease("bounce")
                  .delay(2000)
                  .attr({transform: 'translate(0,0)'})

              countElement.select('.digit')
                  .transition()
                  .ease("bounce")
                  .duration(0)
                  .delay(2200)

                  .attr({transform: 'translate(0,40)'})

              var a = countElement.select('.digit')
              var b = countElement.select('.placeholder')
              a.attr('class', 'placeholder')
              b.attr('class', 'digit')

            }
          }
        };
      })

      .directive('peopleGrid', function () {
        return {
          restrict: 'E',
          link: function (scope, element, attrs, ngModel) {
            var peopleWidth = 30,
                peopleHeight = 50,
                data = attrs.data,
                width = element.parent().width(),
                height = element.parent().height();

            var gridElement = d3.select(element[0]).append('svg')
                .attr({width: width, height: height})
                .append('g')
                .attr({transform: 'translate(0,0)'});

            var peoples = gridElement.selectAll('.people')
                .append("g");

            peoples.data(data)
                .enter()
                .append("rect")
                .attr("width", peopleWidth)
                .attr("height", peopleHeight)
                .attr("x", function(d, i) {
                  return parseInt(i/peopleWidth) * (peopleWidth+ 2);
                })
                .attr("y", function(d, i) {
                  return parseInt(i/parseInt(width/peopleWidth));
                });
          }
        }
      })
}());