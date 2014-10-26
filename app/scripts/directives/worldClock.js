(function () {
    'use strict';

    angular.module('populationioApp')
      .directive('worldClock', ['$filter', 'PopulationIOService', 'HelloWords',
          function ($filter, PopulationIOService, HelloWords) {
              return {
                  restrict: 'E',
                  link: function ($scope, element) {
                      var digits, countElement, clockElement, digit, placeholder,
                        digitText, placeholderText, chart,
                        babiesArea, babiesList, lastReborn, countryTitle,
                        digitCellWidth = 26,
                        animationDuration = 400,
                        parentWidth = 1200,
                        parentHeight = 220,
                        currentValue = 0;
                      var root = d3.select(element[0])
                        .append('svg')
                        .attr({
                            height: parentHeight
                        });

                      chart = root.append('g')
                        .attr({
                            'class': 'chart-wrapper',
                            height: parentHeight
                        });

                      function updateWindow() {
                          var d = document,
                            e = d.documentElement,
                            x = e.clientWidth;
                          root.attr('width', x);
                          chart.attr({
                              transform: 'translate(' + [x / 2 - parentWidth / 2, 0] + ')'
                          });
                      }

                      window.onresize = updateWindow;
                      updateWindow();

                      $scope.$watch('worldPopulation', function (newVal, oldVal) {
                          _updateWorldClock(newVal, oldVal);
                      });
                      function _initWorldClock() {
                          currentValue = 7000000000;
                          var filteredNumber = $filter('number')(currentValue, 0);
                          digits = ('' + filteredNumber).split('');

                          chart.append('defs').append('svg:clipPath')
                            .attr('id', 'clip')
                            .append('rect')
                            .attr('id', 'clip-rect')
                            .attr('x', '0')
                            .attr('y', '0')
                            .attr('width', digits.length * digitCellWidth)
                            .attr('height', 40);

                          clockElement = chart.append('g')
                            .attr('class', 'counter')
                            .attr({
                                'clip-path': 'url(#clip)',
                                transform: 'translate(210, 112)'
                            });

                          countElement = clockElement
                            .selectAll('.count-element')
                            .data(digits)
                            .enter()
                            .append('g')
                            .attr({
                                'class': 'count-element',
                                transform: function (d, i) {
                                    var translate = 'translate(' + [(i * digitCellWidth), 0] + ')';
                                    return translate;
                                }
                            });

                          placeholder = countElement
                            .append('g')
                            .attr({
                                'class': 'placeholder',
                                'data-id': function (d, i) {return i;},
                                transform: 'translate(0,40)'
                            });

                          placeholder.append('rect')
                            .attr({
                                fill: 'transparent',
                                width: digitCellWidth,
                                height: 40
                            });

                          placeholderText = placeholder.append('text')
                            .text(function (d) {
                                return d;
                            })
                            .attr({
                                transform: 'translate(' + digitCellWidth / 2 + ',35)'
                            });

                          digit = countElement
                            .append('g')
                            .attr({
                                'class': 'digit',
                                'data-id': function (d, i) {
                                    return i;
                                }
                            });

                          digit.append('rect')
                            .attr({
                                fill: 'transparent',
                                width: digitCellWidth,
                                height: 40
                            });

                          digitText = digit.append('text')
                            .text(function (d) {
                                return d;
                            })
                            .attr({
                                transform: 'translate(' + digitCellWidth / 2 + ',35)'
                            });
                      }

                      function _updateWorldClock(newVal, oldVal) {
                          var timeDelta = newVal - oldVal;
                          currentValue = newVal;

                          var filteredNumber = $filter('number')(newVal, 0);
                          var digits = ('' + filteredNumber).split('');

                          for (var i = 0; i < timeDelta; i += 1) {
                              if (i === 0) {
                                  setTimeout(function () {
                                      _addNewBaby(true);
                                  }, i * 200);
                              } else {
                                  setTimeout(function () {
                                      _addNewBaby();
                                  }, i * 200);
                              }
                          }

                          placeholderText.text(function (d, i) { return digits[i]; });
                          digit.each(function (d, i) {
                              var _digit, _placeholder;
                              if (digits[i] !== d3.select(this).select('text').text()) {
                                  _digit = d3.select(this);
                                  _placeholder = d3.select('.placeholder[data-id="' + i + '"]');

                                  _digit
                                    .transition()
                                    .ease('bounce')
                                    .duration(animationDuration)
                                    .delay(animationDuration)
                                    .attr({
                                        transform: 'translate(0,-40)'
                                    });

                                  _placeholder
                                    .transition()
                                    .ease('bounce')
                                    .duration(animationDuration)
                                    .delay(animationDuration)
                                    .attr({
                                        transform: 'translate(0,0)'
                                    });

                                  setTimeout(function () {
                                      _digit.attr('transform', 'translate(0,0)');
                                      _placeholder.attr('transform', 'translate(0,40)');
                                      digitText.text(function (d, i) { return digits[i]; });
                                  }, animationDuration * 2 + 100);
                              }

                          });
                      }

                      var _addHelloBubble = function (baby) {
                          var helloBubble = baby
                            .append('g')
                            .attr({
                                'class': 'hello-bubble',
                                transform: 'translate(-30,-90)',
                                opacity: 0
                            });
                          helloBubble.append('use')
                            .attr({
                                'xlink:href': '#hello-bubble'
                            });
                          helloBubble.append('text')
                            .attr({
                                'fill': 'white',
                                'text-anchor': 'middle',
                                'dominant-baseline': 'middle',
                                transform: 'translate(49,45)'
                            });
                          helloBubble.select('text').text(function () {
                              var randomItem = _.random(0, HelloWords.length - 1);
                              return HelloWords[randomItem].greeting;
                          })
                            .each(function () {
                                var bbox = this.getBBox();
                                this.scale = Math.min(60 / bbox.width, 40 / bbox.height);
                            })
                            .style('font-size', function () { return (14 * this.scale) + 'px'; });
                      };

                      function _initBabiesFlood() {
                          babiesList = [];

                          for (var i = 0; i < 15; i += 1) {
                              babiesList.push({});
                          }

                          lastReborn = babiesList.length;
                          babiesArea = chart
                            .append('g')
                            .attr({
                                'class': 'babies-area'
                            });

                          chart.append('rect')
                            .attr({
                                'class': 'country-title-background',
                                transform: 'translate(' + [510, 180] + ')',
                                fill: '#fff',
                                width: 400,
                                height: 60
                            })
                            .text('hello');

                          chart.append('rect')
                            .attr({
                                'class': 'country-title-line',
                                transform: 'translate(' + [0, 180] + ')',
                                fill: '#ccc',
                                width: parentWidth,
                                height: 1
                            });

                          countryTitle = chart
                            .append('text')
                            .attr({
                                'class': 'country-title',
                                transform: 'translate(' + [697, 210] + ')'
                            })
                            .text('Hello');

                          var baby = babiesArea.selectAll('.baby')
                            .data(babiesList)
                            .enter()
                            .append('g')
                            .attr({
                                'class': 'baby',
                                opacity: function (d, i) {
                                    this.idx = i;
                                    return 1;
                                }
                            });
                          baby
                            .append('use')
                            .attr({
                                'xlink:href': function () {
                                    return ['#baby-girl', '#baby-boy'][_.random(0, 1)];
                                }
                            });

                          _addHelloBubble(baby);

                          babiesArea.attr('transform', function () {
                              return 'translate(' + [135 + parentWidth / 2, 100] + ')';
                          });

                          _addNewBaby();
                      }

                      function _addNewBaby(sayHello) {

                          if (d3.selectAll('.baby').size() > 30) {
                              var babyToRemove = d3.selectAll('.baby')[0][0];
                              d3.select(babyToRemove).remove();
                          }

                          var babies = d3.selectAll('.baby');
                          babies.transition()
                            .duration(250)
                            .attr({
                                'data-i': function (d, i) {
                                    return i;
                                },
                                opacity: 1,
                                transform: function () {
                                    var translate = 'translate(' + [this.idx * 30, 0] + ')';
                                    this.idx += 1;
                                    return translate;
                                }
                            }
                          );

                          var randomItem = _.random(0, HelloWords.length - 1);
                          var hello = HelloWords[randomItem].greeting;
                          var country = HelloWords[randomItem].language;

                          var newBaby = babiesArea
                            .append('g')
                            .attr({
                                'class': function () {
                                    this.idx = 1;
                                    this.helloWord = hello;
                                    return 'baby';
                                },
                                opacity: 0,
                                transform: 'translate(-70,90)'
                            });

                          newBaby.append('use')
                            .attr({
                                'xlink:href': function () {
                                    return ['#baby-girl', '#baby-boy'][_.random(0, 1)];
                                }
                            });

                          newBaby.transition()
                            .duration(150)
                            .attr({
                                opacity: 1,
                                transform: 'translate(-70,50)'
                            });

                          countryTitle.text(country);

                          _addHelloBubble(newBaby);
                          if (sayHello) {
                              _sayHello(newBaby);
                          }
                      }

                      function _sayHello(baby) {
                          var bubble = baby.select('.hello-bubble');
                          bubble
                            .transition()
                            .duration(400)
                            .attr({
                                opacity: 1
                            })
                            .transition()
                            .duration(200)
                            .delay(1000)
                            .attr({
                                opacity: 0
                            });
                      }

                      _initWorldClock();
                      _initBabiesFlood();
                  }
              };
          }]);

}());