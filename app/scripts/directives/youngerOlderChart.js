(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('youngerOlderChart', function ($filter, PopulationIOService, HelloWords) {
      return {
        restrict: 'E',
        link: function ($scope, element) {

          var chart,
            xAxis, yAxis,
            parentWidth = element[0].clientWidth,
            data, pointer,
            parentHeight = 200,
            yAxisFormat = d3.format('s'),
            xRange = d3.scale.linear(),
            yRange = d3.scale.linear().nice(),
            line = d3.svg.line(),
            area = d3.svg.area(),
            age,
            areaTotal, areaLine,
            areaYounger,
            xAxisElement, yAxisElement
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
              .attr({width: parentWidth, height: parentHeight + 60})
              .append('g')
              .attr({
                class: 'younger-older-chart',
                transform: 'translate(0,20)'
              })
            ;

            xAxis = d3.svg.axis()
              .scale(xRange)
              .tickSize(5)
              .tickSubdivide(true)
            yAxis = d3.svg.axis()
              .scale(yRange)
              .tickSize(5)
              .orient('left')
            ;
            areaTotal = chart.append('path')
            areaYounger = chart.append('path')
            areaLine = chart.append('path')
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
            xAxis.tickFormat(function (d) {return d + 'y'})
            yAxis.tickFormat(function (d) {return yAxisFormat(d).replace('M', ' M').replace('k', ' K')});
            xRange.range([120, parentWidth - 80]).domain([0, d3.max(data, function (d) { return d.age; })]);
            yRange.range([parentHeight, 0]).domain([0, d3.max(data, function (d) { return d.total; })]);


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
              .y0(parentHeight)
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
              .attr('transform', 'translate(0,' + (parentHeight) + ')')
              .call(xAxis)

            yAxisElement
              .transition()
              .attr('class', 'y axis')
              .attr('transform', 'translate(120,0)')
              .call(yAxis)

            setTimeout(function () {
              yAxisElement
                .selectAll('.tick')
                .transition()
                .style({
                  opacity: function (d, i) {
                    return d % 500000 ? 0 : 1;
                  }
                })
              /*
               xAxisElement
               .selectAll('.tick')
               .transition()
               .style({
               opacity: function (d, i) {
               return d % 20 ? 0 : 1;                  }
               })
               */

            }, 500);

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
                  return Math.floor($scope.rankLocal / ($scope.countryPopulation / 100)) + '%'
                }
                else {

                  return Math.floor($scope.rankGlobal / ($scope.worldPopulation / 100)) + '%'
                }
              })

          }
        }
      };
    });

}());