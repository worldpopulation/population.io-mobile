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
            yRange = d3.scale.linear(),
            line = d3.svg.line(),
            area = d3.svg.area(),
            age
            ;

          _initChart();

          $scope.$on('populationDataChanged', function (e, population) {
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
              .tickSubdivide(true)
            ;

          }

          function _updateChart(data) {
            console.log(age)


            xAxis.tickFormat(function (d) {return d + 'y'});
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
            chart.append('path')
              .attr('d', area(data))
              .attr('fill', '#F3F3F3')

            chart.append('path')
              .attr('d', area(younger))
              .attr('fill', '#A5EC87')

            chart.append('path')
              .attr('d', line(data))
              //.attr('stroke', '#66666F')
              //.attr('stroke-width', 3)
              .attr('fill', 'none');
            chart.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + (parentHeight) + ')')
              .call(xAxis);

            chart.append('g')
              .attr('class', 'y axis')
              .attr('transform', 'translate(120,0)')
              .call(yAxis);
            pointer = chart.append('circle').attr({
              r: 7
            })
              .attr('stroke-width', 3)
              .style({
                fill: 'black',
                stroke: 'white'
              });

            pointer.attr({
              cx: function () {
                return xRange(age - 1) - 3
              },
              cy: function () {return yRange(data[age].total)+2}
            })

          }


        }
      };
    });

}());