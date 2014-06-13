(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('expectancyMap', function ($rootScope) {
      return {
        restrict: 'E',
        scope: {
          countryRef: '=',
          countryRel: '=',
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

          var projection = d3.geo.mercator()
            .translate([(width / 2), (height / 2)])
            .scale(width / 2 / Math.PI * 0.75);

          $scope.$watch('countryRef', function(data) {
            if (data) {
              _addDescriptionLine('ref', data);
            }
          });

          $scope.$watch('countryRel', function(data) {
            if (data) {
              _addDescriptionLine('rel', data);
            }
          });

          var path = d3.geo.path().projection(projection);

          var _addDescriptionLine = function (type, data) {
            var node = d3.select('.country[data-id="' + data.country + '"]')[0][0];

            if (!node) {
              alert([
                'Whoops "' + data.country + '"',
                ' is not existing on this map!'
              ].join(''));
            }

            var d3Node = d3.select(node),
              bbox = d3Node[0][0].getBBox(),
              width = 1200,
              textCntHeight = 170,
              center = {
                x: bbox.x + bbox.width / 2,
                y: bbox.y + bbox.height / 2
              };

            var _textTween = function (node, label) {
              var value = Math.round(node.innerHTML * 100) / 100,
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

          d3.json('scripts/data/world-topo-min.json', function (error, world) {

            var countries = topojson.feature(world, world.objects.countries).features;
            var country = root.selectAll('.country').data(countries);

            country.enter().insert('path')
              .attr({
                'class': 'country',
                d: path,
                'data-id': function (d) { return d.properties.name; },
                title: function (d) { return d.properties.name; }
              })
              .on('click', function(d) {
                $rootScope.$emit('countryRelChanged', d.properties.name);
              });
          });
        }
      };
    });

}());