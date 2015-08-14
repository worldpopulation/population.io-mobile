(function () {
  'use strict';

  angular.module('populationioApp')
  .directive('summaryChartLocation', ['$filter', 'PopulationIOService', 'HelloWords', '$timeout',
  function ($filter, PopulationIOService, HelloWords, $timeout) {
    return {
      restrict: 'E',
      link: function ($scope, element) {
        var chart,
        xAxis, yAxis,
        parentWidth = element[0].clientWidth,
        currentData, pointer,
        parentHeight = 40,
        yAxisFormat = d3.format('s'),
        xRange = d3.scale.linear(),
        yRange = d3.scale.linear(),
        line = d3.svg.line(),
        area = d3.svg.area(),
        age,
        areaTotal, areaLine,
        areaYounger,
        xAxisElement, yAxisElement,
        xLabel, yLabel, yLabelText, xLabelText,
        xLabelLine, yLabelLine,

        prevChartWidth = 0,
        prevChartHeight = 0,
        margin = {top: 50, right: 20, bottom: 30, left: 0};

        _initChart();
        $scope.$watch('region', function (newVal) {
          if (newVal == 'World' && $scope.worldPopulationData) {
            _updateChart($scope.worldPopulationData)
          }
          else if (newVal != 'World' && $scope.countryPopulationData) {
            _updateChart($scope.countryPopulationData)
          }
        });

        $scope.$on('worldPopulationDataChanged', function (e, population) {
          $timeout(function () {
            age = $scope.profile.getAge();
            _updateChart(population)
          }, 2000);
        });
        $scope.$on('rankGlobalChanged', function (e, rank) {
          $scope.rankGlobal = rank;

          if ($scope.region == 'World' && $scope.worldPopulationData) {
            _updateChart($scope.worldPopulationData)
          }
          else if ($scope.region != 'World' && $scope.countryPopulationData) {
            _updateChart($scope.countryPopulationData)
          }

        });
        $scope.$on('countryPopulationDataChanged', function (e, population) {
          age = $scope.profile.getAge();
          _updateChart(population);
        });



        function _initChart() {
          var vB = parentWidth + 40;

          chart = d3.select(element[0])
          .append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', '0 0 '+ vB +' 200 ')
          .attr('preserveAspectRatio','xMinYMin meet')
          .append('g')
          .attr({
            class: 'summary-chart',
            transform: 'translate(' + margin.left + ',' + margin.top + ')'
          });

          xAxis = d3.svg.axis()
          .scale(xRange)
          .tickSize(5)
          .orient('bottom')
          .tickPadding([25])
          .tickValues([100]);

          yAxis = d3.svg.axis()
          .scale(yRange)
          .tickSize(5)
          .orient('left');

          areaTotal = chart.append('path');
          areaYounger = chart.append('path');
          areaLine = chart.append('path');
          chart.select('.x-label').remove();
          chart.select('.y-label').remove();
          chart.select('.label-line').remove();

          xLabelText = $filter('translate')('MOBILE_SUMMARY_CHART_AXIS_X');
          xLabel = chart.append('text')
          .text(xLabelText)
          .attr(
            {
              class: 'x-label',
              transform: 'translate(' + [parentWidth - 6, parentHeight + 25] + ')'
            })
            .style(
              {
                'text-anchor': 'end'
              });
              xLabelLine = chart.append('line')
              .attr({
                class: 'label-line',
                x1: parentWidth,
                y1: 80,
                x2: parentWidth,
                y2: 40
              })
              .style({
                stroke: '#333',
                'stroke-width': 1
              });


              yLabelText = $filter('translate')('MOBILE_SUMMARY_CHART_AXIS_Y');

              yLabel = chart.append('text')
              .text(yLabelText)
              .attr(
                {
                  class: 'y-label',
                  transform: 'translate(' + [62, parentHeight - 70 ] + ')'
                })
                .style(
                  {
                    'text-anchor': 'end'
                  });


                  yLabelLine = chart.append('line')
                  .attr({
                    class: 'label-line',
                    x1: 20,
                    y1: -40,
                    x2: 20,
                    y2: 0
                  })
                  .style({
                    stroke: '#333',
                    'stroke-width': 1
                  });

                  xAxisElement = chart.append('g');

                  xAxisElement.append('circle').attr({
                    r: 2
                  })
                  .style({
                    fill: 'black'
                  })


                  yAxisElement = chart.append('g');

                  yAxisElement.append('circle')
                  .transition()
                  .attr({
                    r: 2
                  }).style({
                    fill: 'black'
                  });

                  pointer = chart.append('g').attr({class: 'pointer'});

                  pointer.append('text')
                  .style({
                    fill: '#333',
                    'font-size':'45px',
                    'text-anchor': 'middle'
                  });
                  pointer.append('polygon').attr({
                     points: '-20,45 0,10 20,45'
                  })
                  .style({
                    fill: 'black',
                  });
                }


                function _updateChart(data) {

                  currentData = data;
                  var ticks = [], step;
                  step = $scope.region != 'World' ? 500000 : 50000000;
                  if ($scope.country != 'World' && d3.max(data, function (d) { return d.total; }) <= 500000000) {
                    step = Math.ceil(d3.max(data, function (d) { return d.total; }) / 1000000) * 1000000
                  }
                  if ($scope.region != 'World' && d3.max(data, function (d) { return d.total; }) <= 500000) {
                    step = Math.ceil(d3.max(data, function (d) { return d.total; }) / 100000) * 100000
                  }
                  if ($scope.region != 'World' && d3.max(data, function (d) { return d.total; }) <= 2000) {
                    step = Math.ceil(d3.max(data, function (d) { return d.total; }) / 200) * 200

                  }
                  for (var i = 0; i < d3.max(data, function (d) { return d.total; }) + step; i = i + step) {
                    ticks[0] = i;
                  }
                  xAxis.tickFormat(function (d) {return d + 'y'});
                  yAxis.tickFormat(function (d) {return yAxisFormat(d).replace('k', 'K')})
                  .tickValues(ticks);

                  xRange.range([20, parentWidth]).domain([0, d3.max(data, function (d) { return d.age; })]);
                  yRange.range([parentHeight, 0]).domain([0, ticks[ticks.length - 1]]);


                  yLabelText = $filter('translate')('MOBILE_SUMMARY_CHART_AXIS_Y');
                  yLabel.text(yLabelText);

                  xLabelText = $filter('translate')('MOBILE_SUMMARY_CHART_AXIS_X');
                  xLabel.text(xLabelText);

                  yLabelLine.attr({
                    x1: 20,
                    y1: yValAtPoint(areaTotal),
                    x2: 20,
                    y2: yValAtPoint(areaTotal) - 40
                  })

                  yLabel.attr({
                    transform: 'translate(' + [62,  (yValAtPoint(areaTotal) - 30)] + ')'
                  })

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
                  var younger = data.slice(0, age+1);

                  areaTotal
                  .datum(data)
                  .transition()
                  .attr('d', area(data))
                  .attr('fill', '#997fff');

                  areaYounger
                  .transition()
                  .attr('d', area(younger))
                  .attr('fill', '#63f');
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
                  .attr('transform', 'translate('+ parentWidth +',' + (parentHeight) + ')')
                  .call(xAxis)
                    .selectAll('text')
                    .attr('y', '30')
                    .attr('x', ((parentWidth* -1) -20) );

                  yAxisElement
                  .transition()
                  .attr('class', 'y axis')
                  .attr({
                    transform: 'translate('+20+','+ 0 +')'
                  })
                  .call(yAxis)
                    .selectAll('text')
                    .attr('y', (yValAtPoint(areaTotal) - 20))
                    .attr('class', 'yte')
                    .attr('x', '7');

                  yAxisElement.select('circle')
                  .transition()
                  .attr({
                    cy: yValAtPoint(areaTotal)
                  });

                  pointer
                  .transition()
                  .attr({
                    transform: 'translate(' + [xRange(age), 40] + ')'
                  });

                  pointer.select('polygon')
                  .transition()
                  .attr({
                    cy: yRange(data[age].total) + 40
                  });
                  pointer.select('text')
                  .text(function () {
                    if ($scope.region != 'World') {

                      return $filter('number')(Math.min(100, $scope.rankLocal / ($scope.countryPopulation / 100)), '0') + '%'
                    }
                    else {
                      return $filter('number')(Math.min(100, $scope.rankGlobal / ($scope.worldPopulation / 100)), '0') + '%'
                    }
                  })
                  .attr('x', '10')
                  .attr('y', '90');

                  function yValAtPoint(path){
                    var l = path.node().getTotalLength();
                    var p = path.node().getPointAtLength(l);
                    return p.y;
                  }

                }

              }
            };
          }]);
        }());
