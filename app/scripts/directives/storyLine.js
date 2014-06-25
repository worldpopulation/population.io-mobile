(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('storyLine', function ($rootScope) {
      return {
        restrict: 'E',
        scope: {
          data: '=',
          selectedYear: '='
        },
        link: function ($scope, element) {
          var width = 460,
            height = 580,
            yearMax = 100,
            yearMin = 0;

          var root = d3.select(element[0])
            .append('svg')
            .attr({width: width, height: height})
            .append('g')
            .attr({transform: 'translate(-20,0)'});

          $scope.$watch('data', function(data) {
            if (data) {
              _updateGraph(data);
            }
          }, true);

          $scope.$watch('selectedYear', function(year) {
            if (year) {
              _removeAllHighlights();
              var node = d3.select('.dot[data-id="' + year + '"]')[0][0];
              _addHighlight(node);
            }
          });

          var _addHighlight = function (node) {
            node.parentNode.appendChild(node);
            d3.select(node)
              .classed('highlight', true);
          };

          var _removeAllHighlights = function () {
            var node = d3.select('.dot.highlight')[0][0];
            if (node) {
              d3.select(node)
                .classed('highlight', false);
            }
          };

          var _initGraph = function() {
            var bezierCurve = [
              'M428.75,559c0-22.092-17.658-40-39.75-40H89c-22.092,',
              '0-40-17.908-40-40s17.908-40,40-40h300c22.092,0,40-17.908,',
              '40-40s-17.908-40-40-40H89c-22.092,0-40-17.908-40-40s17.908',
              '-40,40-40h300c22.092,0,40-17.908,40-40s-17.908-40-40-40H89',
              'c-22.092,0-40-17.908-40-40s17.908-40,40-40h300c22.092,0,40-',
              '17.908,40-40s-17.908-40-40-40H169.5'
            ].join('');

            root.append('path')
              .attr({
                'class': 'line',
                d: bezierCurve
              });

            root.append('use')
              .attr({
                'class': 'ticks',
                'xlink:href': '#Layer_1'
              });

            root.append('g')
              .attr({
                'class': 'lines'
              });

            root.append('g')
              .attr({
                'class': 'circles'
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

            var lines = root.selectAll('.lines');
            lines.selectAll('path').remove();

            lines.append('path')
              .attr({
                'class': 'line highlight',
                d: pathOverlayLine(pathOverlayData)
              });
            lines.append('path')
              .attr({
                'class': 'line small',
                d: pathOverlayLine(pathOverlayData)
              });

            var circles = root.selectAll('.circles');
            circles.selectAll('.dot').remove();

            var dot = circles
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
                'class': 'dot',
                transform: function (d) {
                  var pos = pathNode.getPointAtLength(scale(_getYear(d)));
                  return 'translate(' + [ pos.x, pos.y ] + ')';
                }
              })
              .on('click', function (d) {
                $rootScope.$broadcast('selectedYearChanged', d.year);
                _removeAllHighlights();
                _addHighlight(this);
              });

            var dotWrapper = dot.append('g')
              .attr('class', 'dot-wrapper');

            dotWrapper.append('circle')
              .attr({
                'class': function(d) {
                  return d.colored ? 'colored' : '';
                },
                r: function (d) {
                  var r = 6;
                  if (_getEventCount(d.year) > 1) {
                    r = 15;
                  }
                  return r;
                }
              });

            dotWrapper.append('text')
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

          _initGraph();
        }
      };
    });

}());
