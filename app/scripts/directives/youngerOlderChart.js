(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('youngerOlderChart', ['$filter', 'PopulationIOService', 'HelloWords',
      function ($filter, PopulationIOService, HelloWords) {
        return {
          restrict: 'E',
          link: function ($scope, element) {
            var chart,
              xAxis, yAxis,
              parentWidth = element[0].clientWidth,
              data, pointer,
              parentHeight = 240,
              yAxisFormat = d3.format('s'),
              xRange = d3.scale.linear(),
              yRange = d3.scale.linear().nice(),
              line = d3.svg.line(),
              area = d3.svg.area(),
              age,
              areaTotal, areaLine,
              areaYounger,
              xAxisElement, yAxisElement,
              xLabel, yLabel,
              xLabelLine, yLabelLine
              ;

            _initChart();
            $scope.$watch('region', function (newVal) {
              if (newVal == 'World' && $scope.worldPopulationData) {
                _updateChart($scope.worldPopulationData)
              }
              else if (newVal != 'World' && $scope.countryPopulationData) {
                _updateChart($scope.countryPopulationData)
              }
            });
            $scope.$on('countryPopulationDataChanged', function (e, population) {
              age = $scope.profile.getAge();
              _updateChart(population)
            });

            function _initChart() {
              chart = d3.select(element[0])
                .append('svg')
                .attr({width: parentWidth, height: parentHeight + 100})
                .append('g')
                .attr({
                  class: 'younger-older-chart',
                  transform: 'translate(0,80)'
                })
              ;

              xAxis = d3.svg.axis()
                .scale(xRange)
                .tickSize(5)
                .tickValues([0, 25, 50, 75, 100, 125, 150]);
              yAxis = d3.svg.axis()
                .scale(yRange)
                .tickSize(5)
                .orient('left')
              ;
              areaTotal = chart.append('path')
              areaYounger = chart.append('path')
              areaLine = chart.append('path')
              chart.select('.x-label').remove()
              chart.select('.y-label').remove()
              chart.select('.label-line').remove()
              xLabel = chart.append('text')
                .text('Age')
                .attr(
                {
                  class: 'x-label',
                  transform: 'translate(' + [parentWidth - 100, parentHeight - 100 + 16] + ')'
                })
                .style(
                {
                  'text-anchor': 'end'
                });
              xLabelLine = chart.append('line')
                .attr({
                  class: 'label-line',
                  x1: parentWidth - 200,
                  y1: parentHeight - 100,
                  x2: parentWidth - 70,
                  y2: parentHeight - 100
                })
                .style({
                  stroke: '#d9d9d9',
                  'stroke-width': 1
                })
              yLabel = chart.append('text')
                .text('People')
                .attr(
                {
                  class: 'y-label',
                  transform: 'translate(' + [110, -20] + ')'
                })
                .style(
                {
                  'text-anchor': 'end'
                });

              yLabelLine = chart.append('line')
                .attr({
                  class: 'label-line',
                  x1: 120,
                  y1: -40,
                  x2: 120,
                  y2: 0
                })
                .style({
                  stroke: '#d9d9d9',
                  'stroke-width': 1
                })

              xAxisElement = chart.append('g')
              yAxisElement = chart.append('g')
              pointer = chart.append('g').attr({class: 'pointer'});
              pointer.append('line')
                .attr({
                  x1: 0,
                  y1: -20,
                  x2: 0,
                  y2: 0
                })
                .style({
                  stroke: '#333',
                  'stroke-width': '1px'

                });
              pointer.append('text')
                .style({
                  fill: '#333',
                  'text-anchor': 'middle'

                })
                .text('99%')
              ;
              pointer.append('circle').attr({
                r: 6
              })
                .attr('stroke-width', 2)
                .style({
                  fill: 'black',
                  stroke: 'white'
                });

            }

            function _updateChart(data) {

              var ticks = [], step;
              step = $scope.region != 'World' ? 500000 : 50000000;
              for (var i = 0; i < d3.max(data, function (d) { return d.total; }) + step; i = i + step) {
                ticks.push(i)
              }
              console.log(ticks[ticks.length - 1])
              xAxis.tickFormat(function (d) {return d + 'y'})
              yAxis.tickFormat(function (d) {return yAxisFormat(d).replace('k', 'K')})
                .tickValues(ticks);
              xRange.range([120, parentWidth - 160]).domain([0, d3.max(data, function (d) { return d.age; })]);
              yRange.range([parentHeight - 100, 0]).domain([0, ticks[ticks.length - 1]]);


              line
                .x(function (d) {
                  return xRange(d.age);
                })
                .y(function (d) {
                  return yRange(d.total);
                })
                .interpolate('linear');
              area
                .x(function (d) { return xRange(d.age); })
                .y0(parentHeight - 100)
                .y1(function (d) { return yRange(d.total); });
              var younger = data.slice(0, age);

              areaTotal
                .transition()
                .attr('d', area(data))
                .attr('fill', '#F3F3F3');

              areaYounger
                .transition()
                .attr('d', area(younger))
                .attr('fill', '#6581F1');
              /* highlight-blue */

              areaLine
                .transition()
                .attr('d', line(data))
                //.attr('stroke', '#66666F')
                //.attr('stroke-width', 3)
                .attr('fill', 'none');
              xAxisElement
                .transition()
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + (parentHeight - 100) + ')')
                .call(xAxis)

              yAxisElement
                .transition()
                .attr('class', 'y axis')
                .attr('transform', 'translate(120,0)')
                .call(yAxis)


              pointer
                .transition()
                .attr({
                  transform: 'translate(' + [xRange(age - 1), yRange(data[age].total) - 3] + ')'
                })
              pointer.select('line')
                .transition()
                .attr({
                  y2: -yRange(data[age].total) + 10
                })
              pointer.select('text')
                .transition()
                .attr({
                  dy: -yRange(data[age].total)
                })
                .text(function () {
                  if ($scope.region != 'World') {

                      return $filter('number')($scope.rankLocal / ($scope.countryPopulation / 100), '0') + '%'
                  }
                  else {
                      return $filter('number')($scope.rankGlobal / ($scope.worldPopulation / 100), '0') + '%'
                  }
                })

            }
          }
        };
      }]);

}());