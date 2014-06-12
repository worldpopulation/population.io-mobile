(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('birthdaysChart', function () {
      return {
        restrict: 'E',
        link: function (scope, element, attrs, ngModel) {
          var parentWidth = 1200,
            parentHeight = 700;
          var continentsData = [
            {countryAbbr: 'PO', countryTitle: 'Poland', value: 500},
            {countryAbbr: 'UK', countryTitle: 'United Kingdom', value: 2700},
            {countryAbbr: 'HU', countryTitle: 'Hungary', value: 1000},
            {countryAbbr: 'UA', countryTitle: 'Ukraine', value: 40},

            {countryAbbr: 'IT', countryTitle: 'Italy', value: 300}
          ];
          var worldData = [
            //            {countryAbbr: 'ROOT', countryTitle: 'Root Point', value: 0},
            {countryAbbr: 'BR', countryTitle: 'Brazil', value: 100},
            {countryAbbr: 'US', countryTitle: 'USA', value: 234},
            {countryAbbr: 'GE', countryTitle: 'Germany', value: 1244},
            {countryAbbr: 'KO', countryTitle: 'Spain', value: 567},
            {countryAbbr: 'EQ', countryTitle: 'Equador', value: 862}
          ];

          var chart = d3.select(element[0]).append("svg")
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
                transform: 'translate(' + [parentWidth - parentWidth / 4, 350] + ') rotate(0)'
              });

            var worldBirthdaysTotal = d3.sum(worldData, function (d, i) {return d.value})
            var arc = d3.svg.arc()
              .outerRadius(200)
              .innerRadius(120);
            var labelArc = d3.svg.arc()
              .outerRadius(200)
              .innerRadius(90);
            var arcBorder = d3.svg.arc()
              .outerRadius(130)
              .innerRadius(120);
            var pie = d3.layout.pie()
              .sort(null)
              .value(function (d) { return d.value; });

            var pieChart = worldChart.selectAll(".arc")
              .data(pie(worldData))
              .enter().append("g")
              .attr("class", "arc")
              .on('mouseenter', function () {

                worldChart
                  .transition()
                  .duration(2000)
                  .attr('transform', 'translate(' + [parentWidth - parentWidth / 4, 350] + ') rotate(' + [-2, 2][Math.floor(Math.random() * 2)] + ')');

                var _arc = d3.select(this);

                _arc.select('line')
                  .transition()
                  .attr(
                  {x2: function (d, i) {
                    return labelArc.centroid(d)[0] > -1 ? 170 : -170;
                  }}
                )
                _arc.select('.world-chart-label-total')
                  .transition()
                  .delay(200)
                  .attr('opacity', 1)
                _arc.select('.world-chart-shared-birthdays-label')
                  .transition()
                  .delay(250)
                  .attr('opacity', 1)
                _arc.select('.world-chart-label-percentage')
                  .transition()
                  .delay(300)
                  .attr('opacity', 1)

                _arc.select('path.main')
                  .transition()
                  .style('fill', '#21edff')
                _arc.select('path.border')
                  .transition()
                  .attr('opacity', 0)
              })
              .on('mouseleave', function () {
                worldChart
                  .transition()
                  .attr('transform', 'translate(' + [parentWidth - parentWidth / 4, 350] + ') rotate(0)');


                var _arc = d3.select(this);

                _arc.select('line')
                  .transition()
                  .attr({x2: 0})
                _arc.select('.world-chart-label-total')
                  .transition()
                  .delay(300)
                  .attr('opacity', 0)
                _arc.select('.world-chart-shared-birthdays-label')
                  .transition()
                  .delay(250)
                  .attr('opacity', 0)

                _arc.select('.world-chart-label-percentage')
                  .transition()
                  .delay(200)

                  .attr('opacity', 0)


                _arc.select('path.main')
                  .transition()
                  .style('fill', '#eee')

                d3.selectAll('.border')
                  .transition()
                  .attr('opacity', 1)

              });

            var maleIcon = worldChart
              .append("use")
              .attr({
                'xlink:href': '#male-large'
              });

//            var maleIconWidth = maleIcon[0][0].getBBox().width * 6;
//            var maleIconHeight = maleIcon[0][0].getBBox().height * 6;
            maleIcon.attr('transform', 'translate(' + [-50, -115] + ')')

            var color = d3.scale.linear()
              .domain([0, continentsData.length])
              .range(['#555', '#fff']);


            pieChart.append("path")
              .attr("d", arc)
              .attr('class', 'main')
              .style("fill", function (d) { return '#eee'; });

            pieChart.append("path")
              .attr("d", arcBorder)
              .attr('class', 'border')
              .style("fill", function (d, i) { return color(i); })
              .attr('opacity', 1);
            var labelArea = pieChart.append('g')
              .attr('class', 'label-area')
              .attr("transform", function (d) { //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.outerRadius = 100; // Set Outer Coordinate
                d.innerRadius = 10; // Set Inner Coordinate
                return "translate(" + labelArc.centroid(d) + ") rotate(" + angle(d) + ")";
              })


            labelArea.append("text")
              .attr('class', 'world-chart-label')
              .attr("dy", ".35em")
              .text(function (d) { return d.data.countryTitle; })
              .style("text-anchor", function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 'begin' : 'end';
              })
            ;
            labelArea.append("text")
              .attr('class', 'world-chart-label-total')
              .attr('opacity', 0)
              .attr("dy", "12px")
              .attr("dx", function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 135 : -135;
              })
              .text(function (d) { return d.data.value; })
              .style("text-anchor", function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 'end' : 'begin';
              })
              .style('font-size', 22)
            ;
            labelArea.append("text")
              .attr('class', 'world-chart-label-percentage')
              .attr('opacity', 0)
              .style('font-size', 10)
              .attr("dy", ".35em")
              .attr("dx", function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 170 : -170;
              })
              .text(function (d) { return Math.round((d.data.value / worldBirthdaysTotal) * 100) + '%' })
              .style("text-anchor", function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 'end' : 'begin';
              })
            ;
            labelArea.append("text")
              .attr('class', 'world-chart-shared-birthdays-label')
              .attr('opacity', 0)
              .attr("dy", "24px")
              .attr('font-size', '9px')
              .attr("dx", function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 135 : -135;
              })
              .text('shared birthdays')
              .style("text-anchor", function (d, i) {
                return labelArc.centroid(d)[0] > -1 ? 'end' : 'begin';
              })
            ;

            labelArea.append("line")
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

          }

          function angle(d) {
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
          }
        }
      };
    })

}());