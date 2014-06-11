(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('storyLine', function () {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          selectedYear: '='
        },
        link: function ($scope, element) {
          var width = element.parent().width(),
            height = 560,
            yearMax = 100,
            yearMin = 0;

          var root = d3.select(element[0])
            .append('svg')
            .attr({width: width, height: height})
            .append('g')
            .attr({transform: 'translate(-20,-40)'});

          $scope.$watch('data', function(data) {
            if (data) {
              _updateGraph(data);
            }
          }, true);

          $scope.$watch('selectedYear', function(year) {
            _removeHighlightStoryLine();
            if (year) {
              var node = d3.select('.dot[data-id="' + year + '"]')[0][0];
              _highlightStoryLine(node);
            }
          });

          var _highlightStoryLine = function (node) {
            var translate = d3.select(node).attr('data-transform');
            node.parentNode.appendChild(node);
            d3.select(node)
              .classed('highlight', true)
              .transition()
              .attr({
                'transform': translate + ' scale(2.0)'
              });
          };

          var _removeHighlightStoryLine = function () {
            var node = d3.select('.dot.highlight')[0][0];
            if (node) {
              var translate = d3.select(node).attr('data-transform');
              d3.select(node)
                .classed('highlight', false)
                .transition()
                .attr({
                  'transform': translate + ' scale(1.0)'
                });
            }
          };

          var _initGraph = function() {
            var bezierCurve = [
              'M435.75,570c0-22.092-17.658-40-39.75-40H96c-22.092,0-40-17.908-40-40s17.908-40,40-40h300c22.092,0,40-17.908,40-40s-17.908-40-40-40H96c-22.092,0-40-17.908-40-40s17.908-40,40-40h300c22.092,0,40-17.908,40-40s-17.908-40-40-40H96c-22.092,0-40-17.908-40-40s17.908-40,40-40h300c22.092,0,40-17.908,40-40s-17.908-40-40-40H155'
            ].join('');

            root.append('path')
              .attr({
                'class': 'line',
                d: bezierCurve
              });
          };

          var _updateGraph = function(data) {
            var path = root.select('.line');
            var pathNode = path.node();

            var _getYear = function (d) {
              var zero = 0;
              for (var i = 0; i < data.length; i += 1) {
                if (data[i].born) {
                  zero = data[i].year;
                }
              }
              return d.year - zero;
            };

            var _getEventCount = function (year) {
              var count = 0;
              for (var i = 0; i < data.length; i += 1) {
                if (data[i].year === year) {
                  count += 1;
                }
              }
              return count;
            };

            var scale = d3.scale.linear()
              .domain([yearMin, yearMax])
              .range([0, pathNode.getTotalLength()]);

            var pathOverlayLine = d3.svg.line()
              .x(function (d) { return d.x; })
              .y(function (d) { return d.y; })
              .interpolate('basis');

            var pathOverlayData = [];
            var todayLength = 0;
            for (var i = 0; i < data.length; i += 1) {
              if (data[i].now) {
                todayLength = scale(_getYear(data[i]));
              }
            }

            for (var j = 0; j < todayLength; j += 20) {
              pathOverlayData.push(pathNode.getPointAtLength(j));
            }
            pathOverlayData.push(pathNode.getPointAtLength(todayLength));

            root.selectAll('.line.highlight').remove();
            root.append('path')
              .attr({
                'class': 'line highlight',
                d: pathOverlayLine(pathOverlayData)
              });
            root.append('path')
              .attr({
                'class': 'line small',
                d: pathOverlayLine(pathOverlayData)
              });

            var dot = root
              .selectAll('.dot')
              .data(function () {
                var years = [],
                  filteredData = [];

                for (var i = 0; i < data.length; i += 1) {
                  if (years.indexOf(data[i].year) === -1) {
                    filteredData.push(data[i]);
                    years.push(data[i].year);
                  }
                }

                return filteredData;
              })
              .enter()
              .append('g')
              .attr({
                'data-id': function (d) {
                  return d.year;
                },
                class: 'dot',
                transform: function (d) {
                  var pos = pathNode.getPointAtLength(scale(_getYear(d)));
                  return 'translate(' + [ pos.x, pos.y ] + ')';
                },
                'data-transform': function () {
                  return d3.select(this).attr('transform');
                }
              })
              .on('mouseover', function (d) {
                $scope.selectedYear = d.year;
                _highlightStoryLine(this);
              })
              .on('mouseout', function (d) {
                $scope.selectedYear = null;
                _removeHighlightStoryLine(this);
              });

            dot.append('circle')
              .attr({
                r: function (d) {
                  return _getEventCount(d.year) > 1 ? 15 : 6;
                }
              });

            dot.append('text')
              .text(function (d) {
                var count = _getEventCount(d.year);
                if (count > 1) {
                  return count;
                }
              })
              .attr({
                'text-anchor': 'middle'
              });
          };

          _initGraph()
        }
      };
    });

}());