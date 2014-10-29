(function () {
    'use strict';

    angular.module('populationioApp')
      .directive('deathChart', ['$filter', 'PopulationIOService', 'HelloWords', '$timeout', 'ProfileService',
          function ($filter, PopulationIOService, HelloWords, $timeout, ProfileService) {
              return {
                  restrict: 'E',
                  link: function ($scope, element) {
                      var chart,
                        xAxis, yAxis,
                        parentWidth = element[0].clientWidth,
                        pointerWorld, pointerCountry,
                        parentHeight = 240,
                        yAxisFormat = d3.format('.0%'),
                        ageFormat = d3.format('.2f'),
                        xRange = d3.scale.linear(),
                        yRange = d3.scale.linear().nice(),
                        line = d3.svg.line(),
                        area = d3.svg.area(),
                        age,
                        areaCountry, areaWorld,
                        areaLine,
                        xAxisElement, yAxisElement,
                        xLabel, yLabel,
                        xLabelLine, yLabelLine,
                        tooltip = d3.select('.chart-tooltip')
                        ;

                      _initChart();

                      $scope.$on('mortalityDistributionDataChanged', function (e, mortality) {
                          $timeout(function () {
                              age = $scope.profile.getAge();
                              _updateChart(mortality)
                          }, 0);
                      });

                      function _initChart() {
                          chart = d3.select(element[0])
                            .append('svg')
                            .attr({width: parentWidth, height: parentHeight + 200})
                            .append('g')
                            .attr({
                                class: 'death-chart',
                                transform: 'translate(0,180)'
                            })
                          ;

                          xAxis = d3.svg.axis()
                            .scale(xRange)
                            .tickSize(5)
                            .tickValues([5, 25, 50, 75, 100, 125, 150]);
                          yAxis = d3.svg.axis()
                            .scale(yRange)
                            .tickSize(5)
                            .orient('left')
                          ;
                          areaCountry = chart.append('path');
                          areaWorld = chart.append('path');
                          areaLine = chart.append('path');
                          chart.select('.x-label').remove();
                          chart.select('.y-label').remove();
                          chart.select('.label-line').remove();
                          xLabel = chart.append('text')
                            .text('Age')
                            .attr(
                            {
                                class: 'x-label',
                                transform: 'translate(' + [parentWidth - 100, parentHeight - 50 + 16] + ')'
                            })
                            .style(
                            {
                                'text-anchor': 'end'
                            });
                          xLabelLine = chart.append('line')
                            .attr({
                                class: 'label-line',
                                x1: parentWidth - 200,
                                y1: parentHeight - 50,
                                x2: parentWidth - 70,
                                y2: parentHeight - 50
                            })
                            .style({
                                stroke: '#d9d9d9',
                                'stroke-width': 1
                            });
                          yLabel = chart.append('text')
                            .text('Relative Death Rate')
                            .attr(
                            {
                                class: 'y-label',
                                transform: 'translate(' + [110, -20] + ') rotate(-90)'
                            })
                            .style(
                            {
                                'text-anchor': 'start'
                            });

                          yLabelLine = chart.append('line')
                            .attr({
                                class: 'label-line',
                                x1: 120,
                                y1: -130,
                                x2: 120,
                                y2: 0
                            })
                            .style({
                                stroke: '#d9d9d9',
                                'stroke-width': 1
                            });

                          xAxisElement = chart.append('g');
                          yAxisElement = chart.append('g');
                          pointerWorld = chart.append('g').attr({class: 'pointer'});
                          pointerWorld.append('line')
                            .attr({
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: parentHeight + 50,
                                'stroke-dasharray': '2,2'
                            })
                            .style({
                                stroke: '#888',
                                'stroke-width': '1px'

                            });
                          pointerWorld.append('text')
                            .style({
                                fill: '#333',
                                'text-anchor': 'start'
                            })
                            .attr({
                                class: 'region',
                                dx: 10,
                                dy: 10
                            })
                            .text('World')
                          ;
                          pointerWorld.append('text')
                            .style({
                                'font-size': '9pt',
                                fill: '#666',
                                'text-anchor': 'start'
                            })
                            .attr({
                                class: 'age',
                                dx: 10,
                                dy: 25
                            })
                            .text('World')
                          ;
                          /*
                           pointerWorld.append('circle')
                           .attr({
                           r: 4
                           })
                           .style({
                           fill: '#333'
                           });
                           */

                          pointerCountry = chart.append('g').attr({class: 'pointer'});
                          pointerCountry.append('line')
                            .attr({
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: parentHeight + 10,
                                'stroke-dasharray': '2,2'
                            })
                            .style({
                                stroke: '#888',
                                'stroke-width': '1px'

                            });
                          pointerCountry.append('text')
                            .style({
                                fill: '#333',
                                'text-anchor': 'start'
                            })
                            .attr({
                                class: 'region',
                                dx: 10,
                                dy: 10
                            })
                          ;
                          pointerCountry.append('text')
                            .style({
                                'font-size': '9pt',
                                fill: '#666',
                                'text-anchor': 'start'
                            })
                            .attr({
                                class: 'age',
                                dx: 10,
                                dy: 25
                            })
                            .text('World')
                          ;

                          /*
                           pointerCountry.append('circle')
                           .attr({
                           r: 4
                           })
                           .style({
                           fill: '#333'
                           });
                           */
                          areaWorld
                            .on('mouseenter', _showTooltip)
                            .on('mousemove', function (d) {
                                var mouse = d3.mouse(this);
                                var ageFormatted = $filter('number')(xRange.invert(mouse[0]), 2);
                                var deathRate = $filter('number')(yRange.invert(mouse[1]), 2);
                                tooltip.html(function (d, i) {
                                      return "<p><span class='tooltip-label'>Age:</span><span class='tooltip-value'>" + ageFormatted + " years</span></p>"
                                        + "<p><span class='tooltip-label'>Relative Death Rate:</span><span class='tooltip-value'>" + deathRate + "%</span></p>";
                                  }
                                );

                                tooltip
                                  .style("left", (d3.event.pageX - 100) + "px")
                                  .style("top", (d3.event.pageY - 120) + "px");

                            }
                          )
                            .on('mouseleave', _hideTooltip);
                          areaCountry
                            .on('mouseenter', _showTooltip)
                            .on('mousemove', function (d) {
                                var mouse = d3.mouse(this);

                                var ageFormatted = $filter('number')(xRange.invert(mouse[0]), 2);
                                var deathRate = $filter('number')(yRange.invert(mouse[1]), 2);
                                tooltip.html(function (d, i) {
                                      return "<p><span class='tooltip-label'>Age:</span><span class='tooltip-value'>" + ageFormatted + " years</span></p>"
                                        + "<p><span class='tooltip-label'>Relative Death Rate:</span><span class='tooltip-value'>" + deathRate + "%</span></p>";
                                  }
                                );

                                tooltip
                                  .style("left", (d3.event.pageX - 100) + "px")
                                  .style("top", (d3.event.pageY - 120) + "px");

                            }
                          )
                            .on('mouseleave', _hideTooltip);

                          function _showTooltip() {
                              tooltip
                                .transition()
                                .duration(200)
                                .style({
                                    display: 'block',
                                    opacity: 0.9
                                });
                          }

                          function _hideTooltip() {
                              tooltip
                                .transition()
                                .duration(200)
                                .style("opacity", 0)
                                .each('end', function () {
                                    d3.select(this).style({display: 'none'})
                                })
                              ;
                          }

                      }

                      function _updateChart(data) {
                          var worldMax = d3.max(data.world, function (d) { return d.mortality_percent; });
                          var countryMax = d3.max(data.country, function (d) { return d.mortality_percent; });

                          var worldMaxMortality = _.max(data.world, function (item) {return item.mortality_percent});
                          var countryMaxMortality = _.max(data.country, function (item) {return item.mortality_percent});
                          console.log(data.country)
                          var yTickStep = d3.max([worldMax, countryMax]) / 3; // To have 4 ticks total for y axis
                          xAxis.tickFormat(function (d) {return d + 'y'});
                          yAxis.tickFormat(function (d) {return yAxisFormat(d / 100)})
                            .tickValues([0, yTickStep, yTickStep * 2, d3.max([worldMax, countryMax])])

                          xRange.range([120, parentWidth - 160]).domain([5, d3.max(data.country, function (d) { return d.age; })]);
                          yRange.range([parentHeight - 50, 0]).domain([0, d3.max([worldMax, countryMax])]);


                          line
                            .x(function (d) {
                                return xRange(d.age);
                            })
                            .y(function (d) {
                                return yRange(d.mortality_percent);
                            })
                            .interpolate('linear');
                          area
                            .x(function (d) { return xRange(d.age); })
                            .y0(parentHeight - 50)
                            .y1(function (d) { return yRange(d.mortality_percent); })
                              // .interpolate('step-after')
                          ;

                          //var younger = data.slice(0, age);

                          areaCountry
                            .transition()
                            .attr('d', area(data.country))
                            .attr('fill', '#6581f1');
                          areaWorld
                            .transition()
                            .attr('d', area(data.world))
                            .attr('fill', '#98EC79')
                            .style({opacity: 0.5});

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
                            .attr('transform', 'translate(0,' + (parentHeight - 50) + ')')
                            .call(xAxis);

                          yAxisElement
                            .transition()
                            .attr('class', 'y axis')
                            .attr('transform', 'translate(120,0)')
                            .call(yAxis);

                          pointerWorld
                            .transition()
                            .attr({
                                transform: 'translate(' + [xRange($scope.totalLifeWorldInYears), -100] + ')'
                            });
                          /*
                           pointerWorld.select('line')
                           .transition()
                           .attr({
                           y2: -yRange(worldMaxMortality.mortality_percent) - 90
                           });
                           */
                          /*
                           pointerWorld.select('.region')
                           .transition()
                           .attr({
                           dy: -yRange(worldMaxMortality.mortality_percent) - 80
                           });
                           */

                          pointerWorld.select('.age')
                            .transition()
                              /*
                               .attr({
                               dy: -yRange(worldMaxMortality.mortality_percent) - 65
                               })
                               */
                            .text(function () {
                                return ageFormat($scope.totalLifeWorldInYears) + ' years'
                            });

                          pointerCountry
                            .transition()
                            .attr({
                                transform: 'translate(' + [xRange($scope.totalLifeCountryInYears), -60] + ')'
                            });
                          /*
                           pointerCountry.select('line')
                           .transition()
                           .attr({
                           y2: -yRange(countryMaxMortality.mortality_percent) - 40
                           });
                           */

                          pointerCountry.select('.region')
                            .text(ProfileService.country)
                          /*
                           .transition()
                           .attr({
                           dy: -yRange(countryMaxMortality.mortality_percent) - 30
                           });
                           */

                          pointerCountry.select('.age')
                            .transition()
                              /*
                               .attr({
                               dy: -yRange(countryMaxMortality.mortality_percent) - 15
                               })
                               */
                            .text(function () {
                                return ageFormat($scope.totalLifeCountryInYears) + ' years'
                            })

                      }
                  }
              };
          }]);
}());