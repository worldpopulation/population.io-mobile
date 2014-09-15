(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('timeSlider', function () {
      return {
        restrict: 'E',
        link: function ($scope, element) {
          var width = 540,
            height = 80,
            handleRadius = 11,
            range = 40,
            margin = 30,
            currentYear = parseInt((new Date()).getFullYear(), 0);

          var data = [];
          for (var i = (currentYear - range); i <= currentYear; i += 1) {
            data.push(new Date(i, 1, 1));
          }

          var grid = width / (data.length - 1);

          var x = d3.time.scale()
            .domain([
              d3.min(data, function (d) { return d; }),
              d3.max(data, function (d) { return d; })
            ])
            .range([0, width]);

          var _selectYear = function (pos) {
            var handle = root.select('.handle');

            handle.attr('transform', 'translate(' + [(pos * grid) - 1, 0] + ')');
            handle.select('text')[0][0].textContent = data[pos].getFullYear();
          };

          var drag = d3.behavior.drag()
            .on('drag', function () {
              var pos = Math.round(d3.event.x / grid);
              if (pos < 0 || pos > data.length - 1) {
                return;
              }
              this.year = data[pos].getFullYear();
              _selectYear(pos);
            })
            .on('dragend', function () {
              $scope.$emit('timesliderChanged', this.year);
            });

          var root = d3.select(element[0])
            .append('svg')
            .attr({
              width: width + (margin * 2),
              height: height
            })
            .append('g')
            .attr({transform: 'translate(0,0)'});

          var slider = root.append('g')
            .attr({
              'class': 'slider',
              transform: 'translate(' + [margin, margin] + ')'
            });

          var axis = slider.append('g')
            .attr({
              'class': 'x-axis'
            });

          axis.call(d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(range / 2)
            .tickFormat(d3.time.format('%y')));

          axis.append('g')
            .classed('tick', true)
            .append('text')
            .attr({
              'y': 9,
              'dy': '.71em'
            })
            .text(data[0].getYear());

          axis.selectAll('line')
            .attr({
              y2: function (d, i) {
                if (i === (range / 2) - 1) {
                  return 0;
                }
                if (d.getYear() % 10 === 0) {
                  return 16;
                } else {
                  return 8;
                }
              }
            });

          var handle = slider.append('g')
            .attr({
              'class': 'handle'
            })
            .call(drag);

          handle.append('circle').attr('r', handleRadius);
          handle.append('text');

          _selectYear(data.length - 1);
        }
      };
    });

}());