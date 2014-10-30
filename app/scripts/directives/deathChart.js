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
                        pointerPerson, pointerWorld, pointerCountry,
                        actionBox,
                        verticalPointerLine,
                        personAreaWorld, personAreaCountry,
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
                          chart.select('.vertical-pointer').remove();
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

                          pointerPerson = chart.append('g').attr({class: 'pointer'})
                            .attr({transform: 'translate(-200,0)'});
                          pointerPerson.append('line')
                            .attr({
                                x1: 0,
                                y1: -30,
                                x2: 0,
                                y2: 30
                                //'stroke-dasharray': '2,2'
                            })
                            .style({
                                stroke: '#dedede',
                                'stroke-width': '1px'

                            });
                          pointerPerson.append('circle')
                            .attr({
                                r: 3,
                                cy: -30
                            })
                            .style({
                                fill: '#333'
                            });

                          pointerPerson.append('text')
                            .style({
                                fill: '#333',
                                'text-anchor': 'start'
                            })
                            .attr({
                                class: 'region',
                                dx: 10,
                                dy: 10
                            })
                            .text('Your age')
                          ;
                          pointerPerson.append('text')
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
                          ;

                          pointerWorld = chart.append('g').attr({class: 'pointer'}).attr({transform: 'translate(-200,0)'});
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

                          pointerCountry = chart.append('g').attr({class: 'pointer'}).attr({transform: 'translate(-200,0)'});
                          ;
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
                          actionBox = chart.append('rect')
                            .style({
                                fill: 'red',
                                opacity: 0
                            })
                            .attr({
                                transform: 'translate(120,-150)',
                                width: parentWidth - 280,
                                height: 340
                            })
                          ;

                          actionBox
                            .on('mouseenter', _showTooltip)
                            .on('mousemove', function () {
                                var mouse = d3.mouse(this);
                                var ageFormatted = $filter('number')(xRange.invert(mouse[0] + 120), 2);

                                var yPositionWorld = _.find(personAreaWorld, function (item, i) {
                                    return item.age >= xRange.invert(mouse[0] + 120) - 5;
                                }).mortality_percent;

                                var yPositionCountry = _.find(personAreaCountry, function (item, i) {
                                    return item.age >= xRange.invert(mouse[0] + 120) - 5;
                                }).mortality_percent;

                                /*
                                 var periodScale = d3.scale.linear()
                                 .domain([yPositionWorld, personAreaWorld[periodIndex + 1].mortality_percent])
                                 .range([yRange(yPositionWorld), personAreaWorld[periodIndex + 1].mortality_percent])
                                 */

                                var deathRateWorld = $filter('number')(yPositionWorld, 2);
                                var deathRateCountry = $filter('number')(yPositionCountry, 2);
                                tooltip.html(function (d, i) {
                                      return "<p><span class='tooltip-label'>Age:</span><span class='tooltip-value'>" + ageFormatted + " years</span></p>"
                                        + "<p class='tooltip-title'>Relative Death Rate</p>"
                                        + "<p><span class='tooltip-label'>World:</span><span class='tooltip-value'>" + deathRateWorld + "%</span></p>"
                                        + "<p><span class='tooltip-label'>" + ProfileService.country + ":</span><span class='tooltip-value'>" + deathRateCountry + "%</span></p>"
                                        ;
                                  }
                                );
                                tooltip
                                  .style("left", (d3.event.pageX - 100) + "px")
                                  .style("top", (d3.event.pageY - d3.mouse(this)[1]) + "px");

                            }
                          )
                            .on('mouseleave', _hideTooltip);

                          function _showTooltip() {
                              tooltip
                                .attr({class: 'chart-tooltip death'})
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
                                    d3.select(this)
                                      .style({display: 'none'})
                                      .attr({class: 'chart-tooltip'})
                                })
                              ;
                          }

                      }

                      function _updateChart(data) {

                          console.log(age)
                          personAreaCountry = _.filter(data.country, function (item) {
                              return item.age >= age - 5;

                          });
                          personAreaWorld = _.filter(data.world, function (item) {
                              return item.age >= age - 5;

                          });
                          var worldMax = d3.max(personAreaWorld, function (d) { return d.mortality_percent; });
                          var countryMax = d3.max(personAreaCountry, function (d) { return d.mortality_percent; });

                          //var worldMaxMortality = _.max(data.world, function (item) {return item.mortality_percent});
                          //var countryMaxMortality = _.max(data.country, function (item) {return item.mortality_percent});
                          var yTickStep = d3.max([worldMax, countryMax]) / 3; // To have 4 ticks total for y axis
                          xAxis.tickFormat(function (d) {return d + 'y'})
                            //.tickValues([0, 25, 50, 75, 100, 125]);
                            //.ticks(6);
                          yAxis.tickFormat(function (d) {return yAxisFormat(d / 100)})
                            .tickValues([0, yTickStep, yTickStep * 2, d3.max([worldMax, countryMax])])

                          xRange.range([120, parentWidth - 160]).domain([d3.min(personAreaCountry, function (d) { return d.age; }), d3.max(personAreaCountry, function (d) { return d.age; })]).nice([0, 25, 50, 55, 60, 75, 100, 125]);
                          yRange.range([parentHeight - 50, 0]).domain([0, d3.max([worldMax, countryMax])]);


                          line
                            .x(function (d) {
                                return xRange(d.age);
                            })
                            .y(function (d) {
                                return yRange(d.mortality_percent);
                            })
                            .interpolate('linear')
                          ;
                          area
                            .x(function (d) { return xRange(d.age); })
                            .y0(parentHeight - 50)
                            .y1(function (d) { return yRange(d.mortality_percent); })
                              // .interpolate('step-after')
                          ;

                          areaCountry
                            .transition()
                            .attr('d', area(personAreaCountry))
                            .attr('fill', '#6581f1');
                          areaWorld
                            .transition()
                            .attr('d', area(personAreaWorld))
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
                                return $filter('number')($scope.totalLifeWorldInYears, 1) + ' years'
                                //return '???' + ' years'
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
                                //return ageFormat($scope.totalLifeCountryInYears) + ' years'
                                return $filter('number')($scope.totalLifeLengthLocal, 1) + ' years'
                            })
                          pointerPerson.select('.age').text(age + ' years')

                          pointerPerson
                            .transition()
                            .attr({
                                transform: 'translate(' + [xRange(age), parentHeight - 20] + ')'
                            });

                      }
                  }
              };
          }]);
}());