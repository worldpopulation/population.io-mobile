(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('rankGraph', function (ProfileService) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          country: '=',
          age: '='
        },
        link: function ($scope, element, attr) {
          var width = 300,
            height = 200,
            xAxis, xAxisElement,
            yAxis, yAxisElement,
            yAxisFormat = d3.format('s');
          ;

          var root = d3.select(element[0])
            .append('svg')
            .attr({
              width: width,
              height: height + 20
            })
            .append('g')
            .attr({
              transform: 'translate(' + [ 10, -10 ] + ')'
            });

          $scope.$watch('data', function (data) {
            if (data) {
              _updateGraph(data);
            }
          });

          var _initGraph = function () {
            var frame = root.append('g')
              .attr({
                'class': 'frame'
              });

            frame.append('text')
              .text('People')
              .attr({
                'class': 'people',
                transform: function () {
                  return 'translate(' + [ 40, 70 ] + ') rotate(-90)';
                }
              });
            frame.append('text')
              .text('Age')
              .attr({
                'class': 'age',
                transform: function () {
                  return 'translate(' + [ width - 10, height + 3 ] + ')';
                }
              });

            root.append('g').attr('class', 'chart');
            root.append('g').attr('class', 'pointer');
            xAxisElement = root.append("g")
              .attr("class", "x axis")
              .attr({
                transform: 'translate(' + [0, height] + ')'
              });
            yAxisElement = root.append("g")
              .attr("class", "y axis")
              .attr({
                transform: 'translate(' + [40, 0] + ')'
              });
            yAxis = d3.svg.axis()
              .orient('left')
              .tickFormat(function (d) {return yAxisFormat(d).replace('M', ' M')})
              .ticks(5,7);


          };

          var _updateGraph = function (data) {
            var age = $scope.age;

            var peopleTotal = d3.sum(data, function (d) { return d.total; });

            var xScale = d3.scale.linear()
              .domain([
                d3.min(data, function (d) { return d.age; }),
                d3.max(data, function (d) { return d.age; })
              ])
              .range([40, width - 50]);
            var yScale = d3.scale.linear()
              .domain([ 0, d3.max(data, function (d) { return d.total; }) ])
              .range([height, 90]);

            var xAxis = d3.svg.axis()
              .scale(xScale)
              .tickFormat(function (d, i) {return d + 'y'});

            yAxis.scale(yScale)


            var area = d3.svg.area()
              .x(function (d) { return xScale(d.age); })
              .y0(function () { return height; })
              .y1(function (d) { return yScale(d.total); })
              .interpolate('basis');

            var areaNull = d3.svg.area()
              .x(function (d) { return xScale(d.age); })
              .y0(function () { return height; })
              .y1(function () { return height; })
              .interpolate('basis');

            var chart = root.select('.chart');


            var path = chart
              .selectAll('.age-line')
              .data([data]);

            path.transition()
              .duration(1000)
              .attr('d', function () {
                return area(data);
              });

            path.enter()
              .append('path')
              .attr({
                d: function () {
                  return areaNull(data);
                },
                class: 'age-line'
              })
              .transition()
              .duration(1000)
              .attr('d', function () {
                return area(data);
              });

            var bisect = d3.bisector(function (d) { return d.age; }).right;
            var item = data[bisect(data, age)];

            if (item) {
              var pointer = root.select('.pointer');

              var group = pointer.selectAll('.pointer-wrapper')
                .data([item])
                .enter()
                .append('g')
                .attr('class', 'pointer-wrapper');

              // TODO: refactore me in a good d3 way
              if (pointer.select('.percentage').empty()) {
                pointer.attr({
                  transform: function () {
                    return 'translate(' + [ xScale(age), 0 ] + ')';
                  }
                });
              }

              pointer
                .transition()
                .duration(1000)
                .attr({
                  transform: 'translate(' + [ xScale(age), 0 ] + ')'
                });

              group.append('line');

              pointer.select('line')
                .transition()
                .duration(1000)
                .attr({
                  x1: 0,
                  y1: 20,
                  x2: 0,
                  y2: (yScale(item.total))
                });
              group.append('circle')
                .attr({
                  r: 3,
                  cx: 0,
                  cy: yScale(item.total) - 1
                });

              var textBlock = group
                  .append('g')
                  .attr({
                    class: 'text-block',
                    transform: function () {
                      return 'translate(' + [15, 35] + ')';
                    }

                  })
                ;

              textBlock.append('text')
                .attr({
                  'class': 'percentage'
                });
              textBlock.append('text')
                .text('your age')
                .attr({
                  'class': 'desc',
                  transform: function () {
                    return 'translate(' + [0, 15] + ')';
                  }
                });

              root.select('.percentage')
                .transition()
                .delay(1000)
                .text(function () {
//                  var ageTxt = ProfileService.getAgeString();
//                  ageTxt = ageTxt.replace('y', 'y ');
                  return age + 'y';
                });
            }
            yAxisElement
              .transition()
              .call(yAxis);

            xAxisElement
              .transition()
              .call(xAxis);


            root.select('circle')
              .transition()
              .duration(1000)
              .attr({
                cy: yScale(item.total) - 1
              });

          };

          _initGraph();
        }
      };
    });

}());