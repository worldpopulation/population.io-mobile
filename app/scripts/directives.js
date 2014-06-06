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

    .directive('positionArea', function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/position-area.html',
        link: function (scope, element, attrs, ngModel) {
          var parentWidth = window.innerWidth - 100,
            parentHeight = window.innerHeight - 100;
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
              'class': function (d) {
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

    .directive('storyLine', function (StoryService) {

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
              'class': 'line',
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

          for (var i = 0; i<todayLength; i += 20) {
            pathOverlayData.push(pathNode.getPointAtLength(i));
          }
          pathOverlayData.push(pathNode.getPointAtLength(todayLength));

          root.append('path')
            .attr({
              'class': 'line highlight',
              d: pathOverlayLine(pathOverlayData)
            });
          root.append('path')
            .attr({
              'class': 'line small',
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
              'class': 'dot',
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
            .text(function(d) {
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

    .directive('expectancyMap', function (ExpectancyMapService) {
      var root = null,
        height = 650;

      var _addDescriptionLine = function(node, type, data) {
        var d3Node = d3.select(node),
          bbox = d3Node[0][0].getBBox(),
          width = root.node().parentNode.getBBox().width,
          textCntHeight = 170,
          center = {
            x: bbox.x + bbox.width/2,
            y: bbox.y + bbox.height/2
          };

        var _textTween = function(node, label) {
          var value = node.innerHTML,
            i = d3.interpolate(0, value),
            prec = (value + '').split('.'),
            round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

          return function(t) {
            var text = Math.round(i(t) * round)/round + (label ? ' ' + label : '');
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
            'class': 'desc desc-' + type,
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
            x2: function() {
              if (type === 'ref') {
                return - center.x;
              } else {
                return width - center.x;
              }
            },
            y2: 0
          });

        var textCnt = desc.append('g')
          .attr({
            'class': 'text-' + type,
            transform: function() {
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
            'class': 'years-left'
          })
          .transition()
          .duration(1000)
          .tween('text', function() {
            return _textTween(this);
          });

        var textBlock1 = textCnt.append('g')
          .attr({
            'class': 'text-block'
          });

        textBlock1.append('text').text('years of life left');
        textBlock1.append('text')
          .text('in ')
          .append('tspan')
          .text(data.country);

        var textBlock2 = textCnt.append('g')
          .attr({
            'class': 'text-block'
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
          .tween('text', function() {
            return _textTween(this, 'years');
          });
        textBlock2.append('text').text('life expectancy');
      };

      return {
        restrict: 'E',
        controller: function($scope) {
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
            .translate([(width/2), (height/2)])
            .scale( width / 2 / Math.PI);

          var path = d3.geo.path().projection(projection);

          d3.json('scripts/world-topo-min.json', function(error, world) {

            var countries = topojson.feature(world, world.objects.countries).features;
            var country = root.selectAll('.country').data(countries);

            country.enter().insert('path')
              .attr({
                'class': 'country',
                d: path,
                'data-id': function(d) { return d.id; },
                title: function(d) { return d.properties.name; }
              });
          });
        }
      };
    })
  ;
}());
