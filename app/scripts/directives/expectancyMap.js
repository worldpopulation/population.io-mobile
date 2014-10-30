(function () {
    'use strict';

    angular.module('populationioApp')
      .directive('expectancyMap', function ($rootScope, ProfileService, Countries) {
          return {
              restrict: 'E',
              scope: {
                  countryRef: '=',
                  countryRel: '='
              },
              link: function ($scope, element) {
                  var width = 1200,
                    height = 500;

                  var root = d3.select(element[0])
                    .append('svg')
                    .attr({
                        width: width,
                        height: height
                    })
                    .append('g')
                    .attr({transform: 'translate(0,0)'});
                  root.append('g').attr('class', 'countries')
                  var projection = d3.geo.robinson()
                    .scale(181)
                    .translate([width / 2, height / 1.80]);

                  var path = d3.geo.path().projection(projection);

                  var _getCountryObject = function (country) {
                      return _.find(Countries, function (item) {return item.GMI_CNTRY == country});
                  };

                  var _getCountryObjectByFullName = function (country) {
                      return _.find(Countries, function (item) {return item.POPIO_NAME == country});
                  };


                  var _addDescriptionLine = function (type, data) {
                      var countryId;
                      if (typeof data.country === 'string') {
                          countryId = _getCountryObjectByFullName(data.country).GMI_CNTRY
                      }
                      else {
                          countryId = data.country.GMI_CNTRY
                      }

                      var deathYear = Math.ceil(new Date().getFullYear() + data.yearsLeft);
                      var node = d3.select('.country[data-id="' + countryId + '"]')[0][0];
                      if (!node) {
                          alert([
                              'Whoops, "' + data.country + '"', ' is not part of this map!'
                          ].join(''));
                      }

                      var d3Node = d3.select(node),
                        bbox = d3Node[0][0].getBBox(),
                        width = 1200,
                        textCntHeight = 200,
                        center = {
                            x: bbox.x + bbox.width / 2,
                            y: bbox.y + bbox.height / 2
                        };

                      var _textTween = function (data, node, label, prefix) {
                          var value = Math.round(data * 10) / 10,
                            i = d3.interpolate(0, value),
                            prec = (value + '').split('.'),
                            round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

                          return function (t) {
                              var text = (prefix ? prefix+' ' : '') + Math.round(i(t) * round) / round + (label ? ' ' + label : '');

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
                            transform: function () {
                                return 'translate(' + [center.x, center.y] + ')'
                            }
                        });

                      var textCnt = desc.append('g')
                        .attr({
                            'class': 'text-' + type,
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
                        .text(0)
                        .attr({
                            'class': 'years-left',
                            transform: 'translate(0,45)'
                        })
                        .transition()
                        .duration(1000)
                        .tween('text', function () {
                            return _textTween(data.yearsLeft, this);
                        });

                      var textBlock1 = textCnt.append('g')
                        .attr({
                            'class': 'text-block',
                            transform: 'translate(0,70)'
                        });

                      var deathDate = moment(data.dod).format('DD MMM, YYYY');

                      textBlock1.append('text').text('years of life left');
                      textBlock1.append('text')
                        .attr({y: 20})
                        .text('in ')
                        .append('tspan')
                        .text(function () {
                            var countryName;
                            if (typeof data.country === 'string') {
                                countryName = _getCountryObjectByFullName(data.country).POPIO_NAME;
                            }
                            else {
                                countryName = data.country.POPIO_NAME;
                            }

                            return countryName;
                        });

                      var textBlock2 = textCnt.append('g')
                        .attr({
                            'class': 'text-block',
                            transform: 'translate(0,120)'
                        });

                      textBlock2.append('line')
                        .attr({
                            x1: 0,
                            y1: -20,
                            x2: 100 * (type === 'ref' ? 1 : -1),
                            y2: -20
                        });

                      textBlock2.append('text').attr('y', 0).text('We estimate you will live');
                      textBlock2.append('text')
                        .text( 'until age' +  data.lifeExpectancy)
                        .transition()
                        .duration(1000)
                        .tween('text', function () {
                            return _textTween(data.lifeExpectancy, this, 'years');
                        })
                        .attr('y', 20);
                      //textBlock2.append('text').attr('y', 40).text('on your day of death');
                      textBlock2.append('text').attr('y', 45).text(deathDate)
                        .style({
                            'font-size': 20,
                            fill: '#444'
                        });
                      var descBoxHeight = desc[0][0].getBBox().height;
                      var shift = 0;
                      if (height - descBoxHeight < 100) {
                          shift = -descBoxHeight
                      }

                      desc.attr({
                          transform: function () {
                              return 'translate(' + [center.x, center.y + shift] + ')'
                          }
                      });

                      var descPointerLine = desc.append('line')
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
                            x2: function () {
                                if (type === 'ref') {
                                    return -center.x;
                                } else {
                                    return width - center.x;
                                }
                            }
                        });
                  };

                  d3.json("/data/countries_topo.json", function (error, countriestopo) {
                        if (error) return console.error(error);
                        var countries = topojson.feature(countriestopo, countriestopo.objects.populationio_countries).features;
                        var country = root.select('.countries').selectAll('.country').data(countries);
                        country
                          .enter()
                          .insert('path')
                          .attr({
                              'class': 'country',
                              d: path,
                              'data-id': function (d) { return d.properties.GMI_CNTRY; },
                              title: function (d) { return d.properties.GMI_CNTRY; }
                          })
                          .on('click', function (d) {
                              $rootScope.$emit('countryRelChanged', _getCountryObject(d.properties.GMI_CNTRY).POPIO_NAME);
                          });

                    }
                  )
                  ;


                  $scope.$watch('countryRef', function (data) {
                      if (data) {
                          _addDescriptionLine('ref', data);
                      }
                  });

                  $scope.$watch('countryRel', function (data) {
                      if (data) {
                          _addDescriptionLine('rel', data);
                      }
                      else {
                          d3.selectAll('.desc-rel').remove();
                          d3.select('.country-rel').classed('country-active', false);
                      }
                  });


                  ;
              }
          };
      })
    ;

}
()
)
;