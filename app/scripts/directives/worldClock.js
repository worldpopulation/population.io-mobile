(function () {
  'use strict';

  angular.module('populationioApp')
  .directive('worldClock', ['$filter',
  function ($filter) {
    return {
      restrict: 'E',
      link: function ($scope, element) {
        var digits, countElement, clockElement, digit, placeholder,
        digitText, placeholderText, chart,
        digitCellWidth = 30,
        animationDuration = 400,
        parentWidth =  element[0].clientWidth,
        pH = element[0].clientHeight,
        parentHeight = 57,
        pW = element[0].clientWidth,
        currentValue = 0;

        var root = d3.select(element[0])
        .append('svg')
        .attr({
          height: parentHeight,
          'viewBox': '0 0 '+ (pW+10) +' '+ ((parentHeight * 2)- 20) +' '
        });

        chart = root.append('g')
        .attr({
          'class': 'chart-wrapper'
        });

        function updateWindow() {
          root.attr('width', '100%');
          chart.attr({
            transform: 'translate(' + [(parentWidth / 2), -112] + ')'
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
          .attr('height', 57);

          clockElement = chart.append('g')
          .attr('class', 'counter')
          .attr({
            'clip-path': 'url(#clip)',
            transform: 'translate('+ [- (parentWidth / 2), 120] + ')'
          });


          countElement = clockElement
          .selectAll('.count-element')
          .data(digits)
          .enter()
          .append('g')
          .attr({
            'class': 'count-element',
            transform: function (d, i) {
              return 'translate(' + [(i * digitCellWidth), 0] + ')';
            }
          });

          placeholder = countElement
          .append('g')
          .attr({
            'class': 'placeholder',
            'data-id': function (d, i) {return i;},
            transform: 'translate(0,47)'
          });

          placeholder.append('rect')
          .attr({
            fill: 'transparent',
            width: digitCellWidth,
            height: 47
          });

          placeholderText = placeholder.append('text')
          .text(function (d) {
            return d;
          })
          .attr({
            transform: 'translate(' + digitCellWidth / 3 + ',47)'
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
            height: 57
          });

          digitText = digit.append('text')
          .text(function (d) {
            return d;
          })
          .attr({
            transform: 'translate(' + digitCellWidth / 3 + ',47)'
          });
        }

        function _updateWorldClock(newVal, oldVal) {
          //var timeDelta = newVal - oldVal;
          var timeDelta = 3;

          currentValue = newVal;


          var filteredNumber = $filter('number')(newVal, 0);
          var digits = ('' + filteredNumber).split('');


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
                transform: 'translate(0,-57)'
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
                _placeholder.attr('transform', 'translate(0,57)');
                digitText.text(function (d, i) { return digits[i]; });
              }, animationDuration * 2 + 100);
            }

          });
        }






        _initWorldClock();
      }
    };
  }]);

}());
