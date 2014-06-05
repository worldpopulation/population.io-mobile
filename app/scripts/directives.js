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

    .directive('worldClock', function () {
      return {
        restrict: 'E',
        link: function (scope, element, attrs, ngModel) {
          var currentValue = 0;
          var digits = ('' + currentValue).split('');
          var clockElement = d3.select(element[0])
            .append('svg')
            .attr({
              width: digits.length * 40,
              height: 40,
              style: 'margin: 60px 0 0 60px'
            })
            .append('g')
            .attr({
              transform: 'translate(0,0)'
            });

          var countElement = clockElement
            .selectAll('.count-element')
            .data(digits)
            .enter()
            .append('g')
            .attr({
              'class': 'count-element',
              transform: function (d, i) {
                return 'translate(' + [i * 40, 0] + ')';
              }
            });

          var digit = countElement
            .append('g')
            .attr('class', 'digit');

          digit.append('rect')
            .attr({
              fill: 'transparent',
              width: 39,
              height: 40
            });

          var placeholder = countElement
            .append('g')
            .attr('class', 'placeholder')
            .attr({
              transform: 'translate(0,40)'
            });

          placeholder.append('rect')
            .attr({
              fill: 'transparent',
              width: 39,
              height: 40
            });

          digit.append('text')
            .text(function (d) {
              return d;
            })
            .attr({
              transform: 'translate(20,30)'
            });

          placeholder.append('text')
            .text(function (d) {
              return d;
            })
            .attr({
              transform: 'translate(20,30)'
            });

          var updaterInterval = setInterval(function () {
            if (currentValue > 8) {
              currentValue = -1;
            }
            _updateSingleDigit(currentValue += 1);
          }, 2500);

          function _updateSingleDigit(newDigit) {
            // countElement.select('.digit')
            // console.log(countElement[0][0])
            countElement.select('.digit')
              .transition()
              .delay(2000)
              .attr({
                transform: 'translate(0,-40)'
              });
            countElement.select('.placeholder text')
              .text(newDigit);
            countElement.select('.placeholder')
              .transition()
              .ease('bounce')
              .delay(2000)
              .attr({
                transform: 'translate(0,0)'
              });

            countElement.select('.digit')
              .transition()
              .ease('bounce')
              .duration(0)
              .delay(2200)
              .attr({
                transform: 'translate(0,40)'
              });

            var a = countElement.select('.digit');
            var b = countElement.select('.placeholder');
            a.attr('class', 'placeholder');
            b.attr('class', 'digit');
          }
        }
      };
    })
    .directive('babiesFlood', function () {
      return {
        restrict: 'E',
        link: function (scope, element, attrs, ngModel) {
          var currentValue = 0;
          var digits = ('' + currentValue).split('');
          var babiesArea = d3.select(element[0])
            .append('svg')
            .attr({
              width: 100,
              height: 100,
              style: 'margin: 60px 0 0 60px'
            })
            .append('g')
            .attr({
              transform: 'translate(0,0)'
            });
          babiesArea.append("use")
            .attr({"xlink:href": "#baby-boy"})
          babiesArea.append("use")
            .attr({"xlink:href": "#baby-girl",
              transform: 'translate(60,0)'})


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
              personWidth/2,
              personHeight/2 + 4
            ] + ')'
          });
      }
    };
  })

  .directive('storyLine', function (StoryService) {

    var highlightStoryLine = function(node) {
      var translate = d3.select(node).attr('data-transform');
      node.parentNode.appendChild(node);
      d3.select(node)
        .classed('highlight', true)
        .transition()
        .attr({
          'transform': translate + ' scale(2.0)'
        });
    };

    var removeHighlightStoryLine = function(node) {
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
      controller: function($scope) {
        $scope.highlightStoryLine = function(year, highlight) {
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
          height = element.parent().height(),
          yearMax = 100,
          yearMin = 0;

        var data = StoryService.getData();

        var _getTodayLength = function(data) {
          for (var i=0; i<data.length; i+=1) {
            if (data[i].now) {
              return scale(_getYear(data[i]));
            }
          }
          return null;
        };

        var _getYear = function(d) {
          var zero = 0;
          for (var i=0; i<data.length; i+=1) {
            if (data[i].born) {
              zero = data[i].year;
            }
          }
          return d.year - zero;
        };

        var _getEventCount = function(year) {
          var count = 0;
          for (var i=0; i<data.length; i+=1) {
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
          .attr('d', bezierCurve)
          .style('stroke-width', 2)
          .style('stroke', 'grey')
          .style('fill', 'none');

        var pathNode = path.node();

          var scale = d3.scale.linear()
            .domain([yearMin, yearMax])
            .range([0, pathNode.getTotalLength()]);

        var pathOverlayLine = d3.svg.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .interpolate('linear');

        var pathOverlayData = [];

        for (var i=0; i<_getTodayLength(data); i+=10) {
          pathOverlayData.push(pathNode.getPointAtLength(i));
        }

        root.append('path')
          .attr('d', pathOverlayLine(pathOverlayData))
          .attr('stroke', 'yellow')
          .attr('stroke-width', 5)
          .attr('fill', 'none');

        var dot = root
          .selectAll('.dot')
          .data(function() {
            var years = [],
              filteredData = [];

            for (var i=0; i<data.length; i+=1) {
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
            'data-id': function(d) {
              return d.year;
            },
            'class': 'dot',
            transform: function(d) {
              var pos = pathNode.getPointAtLength(scale(_getYear(d)));
              return 'translate(' + [ pos.x, pos.y ] + ')';
            },
            'data-transform': function() {
              return d3.select(this).attr('transform');
            }
          })
          .on('mouseover', function(d) {
            highlightStoryLine(this);
            $scope.$emit('highlightStoryLine', d.year, true);
          })
          .on('mouseout', function(d) {
            removeHighlightStoryLine(this);
            $scope.$emit('highlightStoryLine', d.year, false);
          });

        dot.append('circle')
          .attr({
            r: function(d) {
              return _getEventCount(d.year) > 1 ? 12 : 7;
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
            'text-anchor': 'middle',
            y: 3
          });
      }
    };
  })

  .directive('expectancyMap', function () {
    return {
      restrict: 'E',
      controller: function($scope) {

      },
      link: function ($scope, element) {
        var width = element.parent().width(),
          height = element.parent().height();

        var data = [];

        var root = d3.select(element[0])
          .append('svg')
          .attr({width: width, height: height})
          .append('g')
          .attr({transform: 'translate(0,0)'});

        var graticule = d3.geo.graticule();


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
              id: function(d,i) { return d.id; },
              title: function(d,i) { return d.properties.name; }
            })
            .style('fill', function(d, i) { return 'lime'; });
        });
      }
    };
  })
  ;
}());
