(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('worldClock', function () {
      return {
        restrict: 'E',
        link: function (scope, element, attrs, ngModel) {
          var currentValue = 12345;
          var digits = ('' + currentValue).split('');
          var countElement;
          _initWorldClock()
          setInterval(_updateWorldClock, 2500);

          function _initWorldClock() {
            var clockElement = d3.select(element[0])
              .append('svg')
              .attr({
                width: digits.length * 40,
                height: 80,
                style: 'margin: 60px 0 0 60px'
              })
              .append('g');

            countElement = clockElement
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

          }

          function _updateWorldClock() {
            var digits = ('' + currentValue).split('');
            console.log(currentValue)
            // countElement.select('.digit')
            // console.log(countElement[0][0])
            countElement.select('.digit')
              .transition()
              .delay(2000)
              .attr({
                transform: 'translate(0,-40)'
              });
            countElement.select('.placeholder text')
              .text(+currentValue++);
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

}());
