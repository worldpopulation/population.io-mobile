(function () {
  'use strict';

  angular.module('populationioApp')

    .directive('statsArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/stats-area.html',
        link: function (scope, element, attrs, ngModel) {
          var parentWidth = window.innerWidth - 100,
            parentHeight = window.innerHeight - 100;
        }
      };
    })

    .directive('peopleArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/people-area.html',
        link: function (scope, element, attrs, ngModel) {
          var parentWidth = window.innerWidth - 100,
            parentHeight = window.innerHeight - 100;
        }
      };
    })

    .directive('storyArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/story-area.html',
        link: function (scope, element, attrs, ngModel) {
          var parentWidth = window.innerWidth - 100,
            parentHeight = window.innerHeight - 100;
        }
      };
    })

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

    .directive('expectancyArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/expectancy-area.html',
        link: function (scope, element, attrs, ngModel) {
          var parentWidth = window.innerWidth - 100,
            parentHeight = window.innerHeight - 100;
        }
      };
    })

    .directive('shareArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/share-area.html',
        link: function (scope, element, attrs, ngModel) {
          var parentWidth = window.innerWidth - 100,
            parentHeight = window.innerHeight - 100;
        }
      };
    })

    .directive('scrollTracker', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
          scope.$watch('currentPage', function (newValue, oldValue) {
            if (newValue !== oldValue) {
              setTimeout(function () {
                var el = $('section[data-order=' + newValue + ']');
                $('body').animate({scrollTop: el.offset().top}, 'slow');
              }, 100);
            }
          });
        }
      };
    })
    .directive('peopleGrid', function (PeopleGridService, PopulationIOService) {
      return {
        restrict: 'E',
        link: function (scope, element) {
          var personWidth = 30,
            personHeight = 50,
            data = PeopleGridService.getData(),
            width = element.parent().width(),
            height = element.parent().height();

          var root = d3.select(element[0])
            .append('svg')
            .attr({width: width, height: height})
            .append('g')
            .attr({transform: 'translate(0,0)'});

          var person = root
            .selectAll('.person')
            .data(data)
            .enter()
            .append('g')
            .attr({
              class: function (d) {
                var className = 'person';
                if (d.rank === PopulationIOService.getRank()) {
                  className += ' me';
                }
                return className;
              },
              transform: function (d, i) {
                return 'translate(' + [
                    parseInt(i % parseInt(width / personWidth - 1, 0), 0) * personWidth,
                    parseInt(i / parseInt(width / personWidth - 1, 0), 0) * personHeight
                ] + ')';
              }
            })
            .on('mouseover', function () {
              d3.select(this).classed('highlight', true);
            })
            .on('mouseout', function () {
              d3.select(this).classed('highlight', false);
            });

          person.append('rect')
            .attr({
              width: personWidth,
              height: personHeight
            });

          person.append('text')
            .text(function (d, i) { return i; })
            .attr({
              fill: '#fff',
              'text-anchor': 'middle',
              transform: 'translate(' + [
                  personWidth / 2,
                  personHeight / 2 + 4
              ] + ')'
            });
        }
      };
    })

    .directive('storyLine', function ($filter, StoryService) {

      var highlightStoryLine = function (node) {
        var translate = d3.select(node).attr('data-transform');
        node.parentNode.appendChild(node);
        d3.select(node)
          .classed('highlight', true)
          .transition()
          .attr({
            'transform': translate + ' scale(2.0)'
          });
      };

      var removeHighlightStoryLine = function (node) {
        var translate = d3.select(node).attr('data-transform');
        d3.select(node)
          .classed('highlight', false)
          .transition()
          .attr({
            'transform': translate + ' scale(1.0)'
          });
      };

      return {
        restrict: 'E',
        controller: function ($scope) {
          $scope.highlightStoryLine = function (year, highlight) {
            console.log(year)
            var node = d3.select('.dot[data-id="' + year + '"]')[0][0];

            if (highlight) {
              highlightStoryLine(node);
            } else {
              removeHighlightStoryLine(node);
            }

            $scope.$emit('highlightStoryLine', year, highlight);
          };
        },
        link: function ($scope, element) {
          var width = element.parent().width(),
            height = 450,
            yearMax = 100,
            yearMin = 0;

          var data = StoryService.getData();

          for (var i = 0; i < data.length; i += 1) {
            data[i].year = parseInt($filter('date')(data[i].tstamp, 'yyyy'), 0);
          }

          var _getTodayLength = function (data) {
            for (var i = 0; i < data.length; i += 1) {
              if (data[i].now) {
                return scale(_getYear(data[i]));
              }
            }
            return null;
          };

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

          var root = d3.select(element[0])
            .append('svg')
            .attr({width: width, height: height})
            .append('g')
            .attr({transform: 'translate(0,0)'});

          var bezierCurve = [
            'M123,408c0,0,171.107,0,244,0s80.128-80,0-80s-252.637,0-309,0s-61.758-81',
            ',0-81s239.45,0,310,0s71.732-80,0-80s-241.543,0-311,0s-70.812-81,0-81s2',
            '39.121,0,310,0s74.088-80,0-80S122,6,122,6'
          ].join('');

          var path = root.append('path')
            .attr({
              class: 'line',
              d: bezierCurve
            });

          var pathNode = path.node();

          var scale = d3.scale.linear()
            .domain([yearMin, yearMax])
            .range([0, pathNode.getTotalLength()]);

          var pathOverlayLine = d3.svg.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; })
            .interpolate('basis');

          var pathOverlayData = [];
          var todayLength = _getTodayLength(data);

          for (var j = 0; j < todayLength; j += 20) {
            pathOverlayData.push(pathNode.getPointAtLength(j));
          }
          pathOverlayData.push(pathNode.getPointAtLength(todayLength));

          root.append('path')
            .attr({
              class: 'line highlight',
              d: pathOverlayLine(pathOverlayData)
            });
          root.append('path')
            .attr({
              class: 'line small',
              d: pathOverlayLine(pathOverlayData)
            });

          var dot = root
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
              class: 'dot',
              transform: function (d) {
                var pos = pathNode.getPointAtLength(scale(_getYear(d)));
                return 'translate(' + [ pos.x, pos.y ] + ')';
              },
              'data-transform': function () {
                return d3.select(this).attr('transform');
              }
            })
            .on('mouseover', function (d) {
              highlightStoryLine(this);
              $scope.$emit('highlightStoryLine', d.year, true);
            })
            .on('mouseout', function (d) {
              removeHighlightStoryLine(this);
              $scope.$emit('highlightStoryLine', d.year, false);
            });

          dot.append('circle')
            .attr({
              r: function (d) {
                return _getEventCount(d.year) > 1 ? 15 : 6;
              }
            });

          dot.append('text')
            .text(function (d) {
              var count = _getEventCount(d.year);
              if (count > 1) {
                return count;
              }
            })
            .attr({
              'text-anchor': 'middle'
            });
        }
      };
    })

    .directive('expectancyMap', function () {
      var root = null,
        height = 650;

      var _addDescriptionLine = function (node, type, data) {
        var d3Node = d3.select(node),
          bbox = d3Node[0][0].getBBox(),
          width = root.node().parentNode.getBBox().width,
          textCntHeight = 170,
          center = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2
          };

        var _textTween = function (node, label) {
          var value = node.innerHTML,
            i = d3.interpolate(0, value),
            prec = (value + '').split('.'),
            round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

          return function (t) {
            var text = Math.round(i(t) * round) / round + (label ? ' ' + label : '');
            node.textContent = text;
          };
        };

        // handle overflow issue
        if (center.y < 20) {
          center.y = 20;
        }
        if (center.y > height - 20) {
          center.y = height - 20;
        }

        // reset previous lines and highlights
        d3.selectAll('.desc-' + type).remove();
        d3.select('.country-active.country-' + type).classed('country-active', false);
        d3Node.attr('class', 'country country-active country-' + type);

        var desc = root.append('g')
          .attr({
            class: 'desc desc-' + type,
            transform: 'translate(' + [ center.x, center.y ] + ')'
          });

        desc.append('line')
          .attr({
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
          })
          .transition()
          .duration(1000)
          .attr({
            x1: 0,
            y1: 0,
            x2: function () {
              if (type === 'ref') {
                return -center.x;
              } else {
                return width - center.x;
              }
            },
            y2: 0
          });

        var textCnt = desc.append('g')
          .attr({
            class: 'text-' + type,
            transform: function () {
              var pos = [],
                y = center.y + textCntHeight > height ? -textCntHeight : 0;

              if (type === 'ref') {
                pos = [-center.x, y];
              } else {
                pos = [width - center.x, y];
              }

              return 'translate(' + pos + ')';
            }
          });

        textCnt.append('text')
          .text(data.yearsLeft)
          .attr({
            class: 'years-left'
          })
          .transition()
          .duration(1000)
          .tween('text', function () {
            return _textTween(this);
          });

        var textBlock1 = textCnt.append('g')
          .attr({
            class: 'text-block'
          });

        textBlock1.append('text').text('years of life left');
        textBlock1.append('text')
          .text('in ')
          .append('tspan')
          .text(data.country);

        var textBlock2 = textCnt.append('g')
          .attr({
            class: 'text-block'
          });

        textBlock2.append('line')
          .attr({
            x1: 0,
            y1: 0,
            x2: 100 * (type === 'ref' ? 1 : -1),
            y2: 0
          });
        textBlock2.append('text')
          .text(data.lifeExpectancy)
          .transition()
          .duration(1000)
          .tween('text', function () {
            return _textTween(this, 'years');
          });
        textBlock2.append('text').text('life expectancy');
      };

      return {
        restrict: 'E',
        controller: function ($scope) {
          $scope.highlightCountryRef = function (id, data) {
            var node = d3.select('.country[data-id="' + id + '"]')[0][0];
            _addDescriptionLine(node, 'ref', data);
          };
          $scope.highlightCountryRel = function (id, data) {
            var node = d3.select('.country[data-id="' + id + '"]')[0][0];
            _addDescriptionLine(node, 'rel', data);
          };
        },
        link: function ($scope, element) {
          var width = element.parent().width();

          root = d3.select(element[0])
            .append('svg')
            .attr({
              width: width,
              height: height
            })
            .append('g')
            .attr({transform: 'translate(0,0)'});

          var projection = d3.geo.mercator()
            .translate([(width / 2), (height / 2)])
            .scale(width / 2 / Math.PI);

          var path = d3.geo.path().projection(projection);

          d3.json('scripts/world-topo-min.json', function (error, world) {

            var countries = topojson.feature(world, world.objects.countries).features;
            var country = root.selectAll('.country').data(countries);

            country.enter().insert('path')
              .attr({
                class: 'country',
                d: path,
                'data-id': function (d) { return d.id; },
                title: function (d) { return d.properties.name; }
              });
          });
        }
      };
    })

    .directive('rankGraph', function () {
      return {
        restrict: 'E',
        link: function ($scope, element) {
          var width = 300,
            height = 150;

          var data = [
            { age: 10, people: 100 },
            { age: 20, people: 80 },
            { age: 30, people: 90 },
            { age: 33, people: 70 },
            { age: 45, people: 65 },
            { age: 50, people: 50 },
            { age: 60, people: 20 },
            { age: 80, people: 5 }
          ];

          var root = d3.select(element[0])
            .append('svg')
            .attr({
              width: width,
              height: height
            })
            .append('g')
            .attr({transform: 'translate(0,0)'});

          var x = d3.scale.linear()
            .domain([
              d3.min(data, function (d) { return d.age; }),
              d3.max(data, function (d) { return d.age; })
            ])
            .range([0, width - 90]);

          var y = d3.scale.linear()
            .domain([
              0,
              d3.max(data, function (d) { return d.people; })
            ])
            .range([height, 90]);

          var area = d3.svg.area()
            .x(function (d) { return x(d.age); })
            .y0(function () { return height; })
            .y1(function (d) { return y(d.people); })
            .interpolate('basis');

          var frame = root.append('g')
            .attr({
              class: 'frame',
              transform: 'translate(' + [ 10, -10 ] + ')'
            });

          frame.append('line')
            .attr({
              class: 'coord',
              x1: 0,
              x2: width - 50,
              y1: height,
              y2: height
            });
          frame.append('line')
            .attr({
              class: 'coord',
              x1: 0,
              x2: 0,
              y1: 70,
              y2: height
            });
          frame.append('path')
            .attr({
              d: area(data)
            });

          frame.append('text')
            .text('People')
            .attr({
              class: 'people',
              transform: function () {
                return 'translate(' + [ 3, 50 ] + ') rotate(-90)';
              }
            });
          frame.append('text')
            .text('Age')
            .attr({
              class: 'age',
              transform: function () {
                return 'translate(' + [ width - 10, height + 3 ] + ')';
              }
            });

          var pointerPos = {
            x: 40,
            y: height - 30
          };

          var pointer = frame.append('g')
            .attr({
              class: 'pointer',
              transform: function () {
                return 'translate(' + [pointerPos.x, pointerPos.y] + ')';
              }
            });

          pointer.append('line')
            .attr({
              x1: 0,
              y1: 0,
              x2: width - pointerPos.x,
              y2: 0
            });
          pointer.append('circle')
            .attr({
              r: 3
            });
          pointer.append('text')
            .text('54%')
            .attr({
              transform: function () {
                return 'translate(' + [width - pointerPos.x - 10, -10] + ')';
              }
            });
        }
      };
    })

    .directive('timeSlider', function () {
      return {
        restrict: 'E',
        link: function ($scope, element) {
          var width = 380,
            height = 80,
            handleRadius = 11,
            startYear = 1999,
            margin = 30;

          var data = [];
          for (var i=startYear; i<=parseInt((new Date()).getFullYear(), 0); i+=1) {
            data.push({
              year: i
            });
          }

          var x = d3.scale.linear()
            .domain([
              d3.min(data, function(d) { return d.year; }),
              d3.max(data, function(d) { return d.year; })
            ])
            .range([0, width - (margin*2)]);

          var stepArr = [];
          var stepWidth = (width - (margin*2))/(data.length-1);
          for (var j=0; j<data.length; j+=1) {
            stepArr.push(stepWidth*j);
          }

          // http://jsfromhell.com/array/nearest-number
          function _getNearestNumberIdx(a, n){
            if ((l = a.length) < 2)
              return l - 1;
            for (var l, p = Math.abs(a[--l] - n); l--;)
              if (p < (p = Math.abs(a[l] - n)))
                break;
            return l + 1;
          }

          var drag = d3.behavior.drag()
            .on('drag', function() {
              var idx = _getNearestNumberIdx(stepArr, d3.event.x);
              d3.select(this)
                .transition()
                .duration(100)
                .attr('transform', 'translate(' + [stepArr[idx], 0] + ')')
                .transition()
                .duration(50)
                .attr('transform', 'translate(' + [stepArr[idx], 0] + ') scale(1.2)')
                .transition()
                .duration(150)
                .attr('transform', 'translate(' + [stepArr[idx], 0] + ') scale(1)');

              d3.select(this).select('text')[0][0].textContent = data[idx].year;
            });

          var root = d3.select(element[0])
            .append('svg')
            .attr({
              width: width,
              height: height
            })
            .append('g')
            .attr({transform: 'translate(0,0)'});

          var slider = root.append('g')
            .attr({
              'class': 'slider',
              transform: 'translate(' + [margin, margin] + ')'
            });

          slider.append('rect')
            .attr({
              width: (width - (2*margin)) + 2,
              height: 4,
              transform: 'translate(-1,-2)'
            });

          var axis = slider
            .selectAll('.x-axis')
            .data(data)
            .enter()
            .append('g')
            .attr({
              'class': 'x-axis'
            });

          axis.append('line')
            .attr({
              x1: function(d) {
                return x(d.year);
              },
              y1: function(d, i) {
                if (i === 0 || i === data.length-1) {
                  return 0;
                } else {
                  return 15;
                }
              },
              x2: function(d) {
                return x(d.year);
              },
              y2: 22
            });

          var handle = slider.append('g')
            .attr({
              'class': 'handle'
            })
            .call(drag);

          handle.append('circle')
            .attr('r', handleRadius);

          handle.append('text')
            .text(data[0].year);

          axis.append('text')
            .text(function(d, i) {
              if (i%4 === 0 || i === data.length-1) {
                return d.year;
              }
            })
            .attr({
              x: function(d) {
                return x(d.year);
              }
            });
        }
      };
    })
  ;
}());
