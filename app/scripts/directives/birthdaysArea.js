(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('birthdaysArea', function () {
        return {
          restrict: 'A',
          templateUrl: 'partials/birthdays-area.html',
          link: function (scope, element, attrs, ngModel) {
            var parentWidth = element[0].clientWidth,
              parentHeight = 500;
            var continentsData = [
              {countryAbbr: 'PO', countryTitle: 'Poland', value: 500},
              {countryAbbr: 'UK', countryTitle: 'United Kingdom', value: 2700},
              {countryAbbr: 'HU', countryTitle: 'Hungary', value: 1000},
              {countryAbbr: 'UA', countryTitle: 'Ukraine', value: 40},

              {countryAbbr: 'IT', countryTitle: 'Italy', value: 300}
            ];
            var worldData = [
  //            {countryAbbr: 'ROOT', countryTitle: 'Root Point', value: 0},
              {countryAbbr: 'BR', countryTitle: 'Brazil', value: 1200},
              {countryAbbr: 'US', countryTitle: 'USA', value: 1500},
              {countryAbbr: 'GE', countryTitle: 'Germany', value: 1000},
              {countryAbbr: 'KO', countryTitle: 'South Korea', value: 40},
              {countryAbbr: 'EQ', countryTitle: 'Equador', value: 300}
            ];

            var chart = d3.select(element[0]).select('.chart-area').append("svg")
              .attr("width", parentWidth)
              .attr("height", parentHeight);


            _buildContinentsChart();
            _buildWorldChart();


            function _buildContinentsChart() {
              var continentsChart = chart.append('g').attr('class', 'continents-chart');
              var radius = d3.scale.linear()
                .domain([0, d3.max(continentsData, function (d, i) {return d.value})])
                .range([15, 100]);
              var labelSize = d3.scale.linear()
                .domain([0, d3.max(continentsData, function (d, i) {return d.value})])
                .range([8, 20]);

              var nodes = continentsData.map(function (d, i) { return {value: d.value, radius: radius(d.value), countryAbbr: d.countryAbbr, countryTitle: d.countryTitle}; }),
                color = d3.scale.category10();

              var force = d3.layout.force()
                .gravity(0.2)
                .charge(function (d, i) { return i ? 0 : -2000; })
                .nodes(nodes)
                .size([parentWidth / 2, parentHeight]);

              force.start();

              var birthdaysTotal = d3.sum(continentsData, function (d, i) {return d.value})


              var tooltipElement = continentsChart.append('g')
                .attr(
                {
                  class: 'tooltip',
                  opacity: 0
                })
              tooltipElement.append('line')
                .attr({
                  class: 'tooltip-line',
                  x1: 0,
                  x2: 0,
                  y1: 0,
                  y2: 0
                });
              tooltipElement.append('text')
                .attr({
                  class: 'percentage-label',
                  x: 0,
                  y: 15
                })
                .text('');
              tooltipElement.append('text')
                .attr({
                  class: 'value-label',
                  x: 50,
                  y: 21
                })
                .text('');

              tooltipElement.append('text')
                .attr({
                  class: 'shared-label',
                  x: 50,
                  y: 40
                })
                .text('shared birthdays');
              tooltipElement.append('text')
                .attr({
                  class: 'country-label',
                  x: 50,
                  y: 55
                })
                .text('');

              var countryElement = continentsChart
                .selectAll(".country-element")
                .data(nodes)
                .enter()
                .append("g")
                .attr('class', 'country-element')
                .on('mouseenter', function (d, i) {
                  var _tooltip = d3.select(this);
                  d3.select(this).select('circle')
                    .transition()
                    .attr({ r: function (d, i) {return d.radius + 3} })
                    .style({ fill: 'rgba(0,0,0,0.8)' });

                  _tooltip.select('text')
                    .transition()
                    .style({ fill: '#fff' });

                  tooltipElement.select('.percentage-label').
                    text(function (d, i) {
                      return Math.round((_tooltip.data()[0].value / birthdaysTotal) * 100) + '%'
                    })

                  tooltipElement.select('.value-label').
                    text(function (d, i) {
                      return _tooltip.data()[0].value
                    })
                  tooltipElement.select('.country-label').
                    text(function (d, i) {
                      return 'in ' + _tooltip.data()[0].countryTitle
                    })
                  tooltipElement
                    .transition()
                    .attr({
                      transform: 'translate(' + [0, _tooltip.data()[0].y] + ')',
                      opacity: 1
                    })
                    .select('line')
                    .attr({
                      x2: _tooltip.data()[0].x - radius(_tooltip.data()[0].value) - 4
                    })
                  ;
                })
                .on('mouseleave', function (d, i) {
                  tooltipElement
                    .transition()
                    .attr('opacity', 0)
  //                .attr('transform', 'translate(' + [0, d3.select(this).data()[0].y] + ')');

                  d3.select(this).select('circle')
                    .transition()
                    .attr('r', function (d, i) {return d.radius - 5})
                    .style({ fill: 'rgba(0,0,0,0.05)' });
                  d3.select(this).select('text')
                    .transition()
                    .style({ fill: '#888' });
                });
              countryElement
                .append("circle")
                .attr("r", function (d) { return d.radius - 5; })
                .style({
                  fill: function (d, i) { return 'rgba(0,0,0,0.05)'; },
                  stroke: function (d, i) { return 'rgba(0,0,0,0.3)'; },
                  'stroke-width': 0.3
                });
  //            .style("fill", function (d, i) { return color(i % 3); });

              continentsChart.selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("r", function (d) { return d.radius - 2; })
                .style("fill", function (d, i) { return color(i % 3); });

              countryElement
                .append("text")
                .text(function (d, i) {
                  if (d.radius < 50) {
                    return d.countryAbbr
                  }
                  else {
                    return d.countryTitle
                  }
                })
                .attr(
                {
                  class: 'country-title',
                  y: function (d, i) {
                    return labelSize(d.value) / 2
                  }
                })
                .style('font-size',
                function (d, i) {
                  return labelSize(d.value)
                }
              );

              force.on("tick", function (e) {
                var q = d3.geom.quadtree(nodes),
                  i = 0,
                  n = nodes.length;

                while (++i < n) {
                  q.visit(collide(nodes[i]));
                }

                countryElement
                  .attr('transform', function (d, i) {
                    return 'translate(' + [d.x, d.y] + ')'
                  });


              });

  //          svg.on("mousemove", function () {
  //            console.log(d3.svg.mouse)
  //            var p1 = d3.svg.mouse(this);
  //            root.px = p1[0];
  //            root.py = p1[1];
  //            force.resume();
  //          });

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
                      l = (l - r) / l * .5;
                      node.x -= x *= l;
                      node.y -= y *= l;
                      quad.point.x += x;
                      quad.point.y += y;
                    }
                  }
                  return x1 > nx2
                    || x2 < nx1
                    || y1 > ny2
                    || y2 < ny1;
                };
              }


            }

            function _buildWorldChart() {
              var worldChart = chart.append('g')
                .attr({
                  class: 'world-chart',
                  transform: 'translate(' + [parentWidth - parentWidth / 4, 250] + ')'
                });
              var arc = d3.svg.arc()
                .outerRadius(200)
                .innerRadius(120);
              var arcBorder = d3.svg.arc()
                .outerRadius(130)
                .innerRadius(120);
              var pie = d3.layout.pie()
                .sort(null)
                .value(function (d) { return d.value; });
              var g = worldChart.selectAll(".arc")
                .data(pie(worldData))
                .enter().append("g")
                .attr("class", "arc")
                .on('mouseenter', function () {
                  var _arc = d3.select(this);
                  _arc.select('path.main')
                    .transition()
                    .style('fill', '#21edff')
                  _arc.select('path.border')
                    .transition()
                    .attr('opacity', 0)
                })
                .on('mouseleave', function () {
                  var _arc = d3.select(this);
                  _arc.select('path.main')
                    .transition()
                    .style('fill', '#eee')

                  d3.selectAll('.border')
                    .transition()
                    .attr('opacity', 1)

                });
              var color = d3.scale.linear()
                .domain([0, continentsData.length])
                .range(['#555', '#fff']);


              g.append("path")
                .attr("d", arc)
                .attr('class', 'main')
                .style("fill", function (d) { return '#eee'; });

              g.append("path")
                .attr("d", arcBorder)
                .attr('class', 'border')
                .style("fill", function (d, i) { return color(i); })
                .attr('opacity', 1);

              g.append("text")
                .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .style("text-anchor", "left")
                .text(function (d) { return d.data.countryTitle; });

            }
          }
        };
      })

}());