(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('birthdaysChart', function ($filter, ProfileService) {
      return {
        restrict: 'E',
        scope: {
          continentsData: '=',
          worldData: '='
        },
        link: function ($scope, element) {
          var parentWidth = 1200,
            parentHeight = 700;

          $scope.$on('continentsDataLoaded', function () {
            _buildContinentsChart($scope.continentsData);
          });
          $scope.$on('worldDataLoaded', function () {
            _buildWorldChart($scope.worldData);
          });

          var chart = d3.select(element[0]).append('svg')
            .attr('width', parentWidth)
            .attr('height', parentHeight);

          var worldChart = chart.append('g')
            .attr({
              'class': 'world-chart',
              transform: 'translate(' + [parentWidth - parentWidth / 4, 350] + ') rotate(0)'
            });

          var continentsChart = chart.append('g')
            .attr('class', 'continents-chart');

          function _buildContinentsChart(continentsData) {

            var radius = d3.scale.sqrt()
              .domain([
                d3.min(continentsData, function (d) { return d.value; }),
                d3.max(continentsData, function (d) { return d.value; })
              ])
              .range([15, 60]);

            var labelSize = d3.scale.linear()
              .domain([
                d3.min(continentsData, function (d) {
                  return d.value;
                }), d3.max(continentsData, function (d) {
                  return d.value;
                })
              ])
              .range([8, 20]);

            var nodes = continentsData.map(function (d) {
                return {
                  value: d.value,
                  radius: radius(d.value),
                  countryAbbr: d.countryAbbr,
                  countryTitle: d.countryTitle
                };
              }),
              color = d3.scale.category10();

            var force = d3.layout.force()
              .gravity(0.2)
              .charge(function (d, i) { return i ? 0 : -2000; })
              .nodes(nodes)
              .size([parentWidth / 2, parentHeight - 100]);

            force.start();

            var birthdaysTotal = d3.sum(continentsData, function (d) {
              return d.value;
            });

            continentsChart.selectAll('g').remove();

            var tooltipElement = continentsChart.append('g')
              .attr({
                'class': 'tooltip',
                opacity: 0
              });
            tooltipElement.append('line')
              .attr({
                'class': 'tooltip-line',
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 0
              });
            tooltipElement.append('text')
              .attr({
                'class': 'value-label',
                x: 0,
                y: 21
              })
              .text('');

            tooltipElement.append('text')
              .attr({
                'class': 'shared-label',
                x: 0,
                y: 40
              })
              .text('shared birthdays');
            tooltipElement.append('text')
              .attr({
                'class': 'country-label',
                x: 0,
                y: 55
              })
              .text('');

            var _highlightCountry = function () {
              var _tooltip = d3.select(this);
              d3.select(this).moveToFront();
              d3.select(this).selectAll('.visual')
                .transition()
                .attr({ r: function (d) {return d.radius + 40;} })
                .style({ fill: 'rgba(0,0,0,0.9)' })
              ;

              _tooltip.select('text')
                .transition()
                .style({
                  fill: '#fff'
                })
                .attr({
                  transform: 'scale(2)'
                })
                .text(function (d) {
                  return d.countryTitle
                });

              tooltipElement.select('.value-label').
                text(function () {
                  return $filter('number')(_tooltip.data()[0].value, 0);
                });
              tooltipElement.select('.country-label').
                text(function () {
                  return 'in ' + _tooltip.data()[0].countryTitle;
                });
              tooltipElement
                .transition()
                .attr({
                  transform: 'translate(' + [0, _tooltip.data()[0].y] + ')',
                  opacity: 1
                })
                .select('line')
                .attr({
                  x2: _tooltip.data()[0].x - radius(_tooltip.data()[0].value) - 4
                });
            };

            var countryElement = continentsChart
              .selectAll('.country-element')
              .data(nodes)
              .enter()
              .append('g')
              .attr('class', 'country-element')
              .on('mouseenter', _highlightCountry);

            countryElement
              .append('circle')
              .attr({
                r: 0,
                class: 'visual'

              })
              .style({
                fill: 'yellow'
              });

            var control = countryElement
              .append('g')
              .attr({class: 'control'})
            control.append('circle')
              .attr({
                r: function (d) { return d.radius - 5; }

              })
              .style({
                fill: function () { return 'rgba(0,0,0,0.05)'; },
                stroke: function () { return 'rgba(0,0,0,0.3)'; },
                'stroke-width': 0.3
              });
            //            .style('fill', function (d, i) { return color(i % 3); });


            control
              .append('text')
              .text(function (d) {
                if (d.radius < 50) {
                  return d.countryAbbr;
                }
                else {
                  return d.countryTitle;
                }
              })
              .attr(
              {
                'class': 'country-title',
                y: function (d, i) {
                  return labelSize(d.value) / 2;
                }
              })
              .style('font-size',
              function (d, i) {
                return labelSize(d.value);
              }
            );

            force.on('tick', function () {
              var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

              while (++i < n) {
                q.visit(collide(nodes[i]));
              }

              countryElement
                .attr('transform', function (d, i) {
                  return 'translate(' + [d.x, d.y] + ')';
                });
            });

            control.on('mouseleave', function (e) {
              console.log(d3.event.target)
              tooltipElement
                .transition()
                .attr('opacity', 0);

              d3.select(this.parentNode).select('.visual')
                .transition()
                .attr('r', function (d) { return d.radius - 5; })
                .style({ fill: 'rgba(0,0,0,0)' });

              d3.select(this.parentNode).select('text')
                .transition()
                .style({ fill: '#888'
                })
                .attr({
                  transform: 'scale(1)'
                })

                .text(function (d) {
                  if (d.radius < 50) {
                    return d.countryAbbr;
                  }
                  else {
                    return d.countryTitle;
                  }

                });
            });

            function collide(node) {
              var r = node.radius + 16,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
              return function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                  var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;
                  if (l < r) {
                    l = (l - r) / l * 0.5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                  }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
              };
            }

          }

          function _buildWorldChart(worldData) {

            worldData = worldData.sort(function (a, b) {
              return a.value > b.value ? -1 : 1;
            });

            var worldBirthdaysTotal = d3.sum(worldData, function (d, i) {return d.value});
            var arc0 = d3.svg.arc()
              .outerRadius(120)
              .innerRadius(120);
            var arc = d3.svg.arc()
              .outerRadius(210)
              .innerRadius(120);
            var labelArc = d3.svg.arc()
              .outerRadius(200)
              .innerRadius(90);
            var arcBorder0 = d3.svg.arc()
              .outerRadius(120)
              .innerRadius(120);
            var arcBorder = d3.svg.arc()
              .outerRadius(130)
              .innerRadius(120);
            var pie = d3.layout.pie()
              .sort(null)
              .value(function (d) { return d.value; });

            worldChart.selectAll('g').remove();

            var human = worldChart.append('g')
              .attr({
                'class': 'human',
                'transform': 'translate(' + [-50, -115] + ')'
              })
              .attr('opacity', 0);

            human.append('use')
              .attr({
                'class': 'ticks',
                'xlink:href': function () {
                  if (ProfileService.gender === 'female') {
                    return '#female-large';
                  } else {
                    return '#male-large';
                  }
                }
              });

            human.transition()
              .delay(3000)
              .duration(1000)
              .attr('opacity', 1);

            var _highlightCountry = function () {
              worldChart
                .transition()
                .duration(2000)
                .attr('transform', 'translate(' + [parentWidth - parentWidth / 4, 350] + ') rotate(' + [-2, 2][Math.floor(Math.random() * 2)] + ')');

              var _arc = d3.select(this);

              _arc.select('line')
                .transition()
                .attr(
                {x2: function (d, i) {
                  return labelArc.centroid(d)[0] > -1 ? 145 : -145;
                }}
              );
              _arc.select('.world-chart-label-total')
                .transition()
                .delay(200)
                .attr('opacity', 1);
              _arc.select('.world-chart-shared-birthdays-label')
                .transition()
                .delay(250)
                .attr('opacity', 1);
              _arc.select('.world-chart-label-percentage')
                .transition()
                .delay(300)
                .attr('opacity', 1);

              _arc.select('path.main')
                .transition()
                .style('fill', '#6581F1');
              /* highlight-blue */
              _arc.select('path.border')
                .transition()
                .attr('opacity', 0);
            };

            var pieChart = worldChart.selectAll('.arc')
              .data(pie(worldData))
              .enter()
              .append('g')
              .attr('class', 'arc')
              .on('click', _highlightCountry)
              .on('mouseenter', _highlightCountry)
              .on('mouseleave', function () {
                worldChart
                  .transition()
                  .attr('transform', 'translate(' + [parentWidth - parentWidth / 4, 350] + ') rotate(0)');

                var _arc = d3.select(this);

                _arc.select('line')
                  .transition()
                  .attr({x2: 0});
                _arc.select('.world-chart-label-total')
                  .transition()
                  .delay(300)
                  .attr('opacity', 0);
                _arc.select('.world-chart-shared-birthdays-label')
                  .transition()
                  .delay(250)
                  .attr('opacity', 0);

                _arc.select('.world-chart-label-percentage')
                  .transition()
                  .delay(200)
                  .attr('opacity', 0);

                _arc.select('path.main')
                  .transition()
                  .style('fill', '#eee');

                d3.selectAll('.border')
                  .transition()
                  .attr('opacity', 1)
              });

            var color = d3.scale.linear()
              .domain([0, worldData.length])
              .range(['#555', '#fff']);


            pieChart.append('path')
              .attr('d', arc0)
              .attr('class', 'main')
              .style('fill', '#eee')
              .attr('opacity', 0)
              .transition()
              .delay(function (d, i) {
                return i * 100;
              })
              .duration(400)
              .attr('d', arc)
              .attr('opacity', 1);

            pieChart.append('path')
              .attr('d', arcBorder0)
              .attr('class', 'border')
              .style('fill', function (d, i) { return color(i); })
              .attr('opacity', 0)
              .transition()
              .delay(function (d, i) {
                return 1000 + i * 100;
              })
              .duration(400)
              .attr('d', arcBorder)
              .attr('opacity', 1);

            var labelArea = pieChart.append('g')
              .attr('class', 'label-area')
              .attr('opacity', 0)
              .attr('transform', function (d) { //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.outerRadius = 100; // Set Outer Coordinate
                d.innerRadius = 10; // Set Inner Coordinate
                return 'translate(' + labelArc.centroid(d) + ') rotate(' + angle(d) + ')';
              });

            labelArea.append('text')
              .attr('class', 'world-chart-label')
              .attr('dy', '.35em')
              .text(function (d) { return d.data.countryTitle; })
              .style('text-anchor', function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 'begin' : 'end';
              })
            ;
            labelArea.append('text')
              .attr('class', 'world-chart-label-total')
              .attr('opacity', 0)
              .attr('dy', '17px')
              .attr('dx', function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 145 : -145;
              })
              .text(function (d) {
                return $filter('number')(d.data.value, 0);
              })
              .style('text-anchor', function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 'end' : 'begin';
              })
              .style('font-size', 22)
            ;
            labelArea.append('text')
              .attr('class', 'world-chart-shared-birthdays-label')
              .attr('opacity', 0)
              .attr('dy', '27px')
              .attr('font-size', '9px')
              .attr('dx', function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 145 : -145;
              })
              .text('shared birthdays')
              .style('text-anchor', function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 'end' : 'begin';
              })
            ;

            labelArea.append('line')
              .attr('class', 'world-chart-label-line')
              .attr({
                x1: function (d) {
                  return labelArc.centroid(d)[0] > -1 ? 0 : 0;
                },
                y1: -10,
                x2: 0,
                y2: -10
              })
            ;
            labelArea
              .transition()
              .delay(function (d, i) {
                return 2000 + i * 100;
              })
              .attr('opacity', 1);
          }

          function angle(d) {
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
          }
        }
      };
    });

}());