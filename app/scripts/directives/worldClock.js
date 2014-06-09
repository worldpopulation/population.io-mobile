(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('worldClock', function () {
      return {
        restrict: 'E',
        link: function (scope, element, attrs, ngModel) {
          var currentValue, digits, countElement, clockElement, digit, placeholder, digitText, placeholderText, chart,
            babiesArea, baby, babiesList, lastReborn, helloBubble, babyWidth, helloWords,
            digitCellWidth = 20,
            animationDuration = 500,
            parentWidth = element[0].offsetWidth,
            parentHeight = window.innerHeight - 300
            ;
          _initWorldClock();
          _initBabiesFlood();
          _initHelloBubble();
          _sayHello();
          setInterval(_updateBabiesFlood, 3000);
          setInterval(_updateWorldClock, 3000);
          setInterval(_sayHello, 6000);

          function _initWorldClock() {
            currentValue = 7213007260;
            digits = ('' + currentValue).split('');

            chart = d3.select(element[0])
              .append('svg')
              .attr({
                width: parentWidth,
                height: parentHeight
              });
            var clip = chart.append("defs").append("svg:clipPath")
              .attr("id", "clip")
              .append("svg:rect")
              .attr("id", "clip-rect")
              .attr("x", "0")
              .attr("y", "0")
              .attr("width", digits.length * digitCellWidth)
              .attr("height", 40);

            clockElement = chart.append('g').attr('class', 'counter')
              .attr({
                'clip-path': 'url(#clip)',
                transform: function () {
                  var xOffset = 0;
                  var yOffset = parentHeight - this.getBBox().height - 70;
                  return 'translate(' + [xOffset, yOffset] + ')'

                }
              });


            countElement = clockElement
              .selectAll('.count-element')
              .data(digits)
              .enter()
              .append('g')
              .attr({
                'class': 'count-element',
                transform: function (d, i) {
                  return 'translate(' + [i * digitCellWidth, 0] + ')';
                }
              });

            placeholder = countElement
              .append('g')
              .attr({
                class: 'placeholder',
                'data-id': function (d, i) {return i},
                transform: 'translate(0,40)'
              });

            placeholder.append('rect')
              .attr({
//                fill: 'pink',
                fill: 'transparent',
                width: digitCellWidth,
                height: 40
              });

            placeholderText = placeholder.append('text')
              .text(function (d) {
                return d;
              })
              .attr({
                transform: 'translate(' + digitCellWidth / 2 + ',30)'
              });


            digit = countElement
              .append('g')
              .attr(
              {
                class: 'digit',
                'data-id': function (d, i) {return i}
              });

            digit.append('rect')
              .attr({
//                fill: 'lightblue',
                fill: 'transparent',
                width: digitCellWidth,
                height: 40
              });


            digitText = digit.append('text')
              .text(function (d) {
                return d;
              })
              .attr({
                transform: 'translate(' + digitCellWidth / 2 + ',30)'
              });

          }

          function _updateWorldClock() {
            currentValue++;
            var digits = ('' + currentValue).split('');

            placeholderText.text(function (d, i) { return digits[i] });
            digit.each(function (d, i) {
              var _digit, _placeholder;
              if (digits[i] != d3.select(this).select('text').text()) {

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
                  _digit.attr('transform', 'translate(0,0)')
                  _placeholder.attr('transform', 'translate(0,40)')
                  digitText.text(function (d, i) { return digits[i] });
                }, animationDuration * 2 + 100)

              }

            });

          }

          function _initBabiesFlood() {
            babiesList = [
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {}
            ];
            lastReborn = babiesList.length;
            babiesArea = chart
              .append('g')
              .attr({
                class: 'babies-area',
                transform: 'translate(0,100)'
              })

            baby = babiesArea.selectAll('.baby')
              .data(babiesList)
              .enter()
              .append('g')
              .attr({
                class: 'baby',
                opacity: 1
              });

            baby
              .append("use")
              .attr({
                'xlink:href': function () {
                  return ['#baby-girl', '#baby-boy'][_.random(0, 1)]
                }
              })

            baby.each(function (d, i) {
              babyWidth = d.babyWidth = this.getBBox().width;
            }).attr({
              transform: function (d, i) {
                return 'translate(' + [i * d.babyWidth, 0] + ')'
              }
            })
            babiesArea.attr('transform', function () {
              var xOffset = parentWidth - this.getBBox().width - 50;
              var yOffset = parentHeight - this.getBBox().height - 40;
              return 'translate(' + [xOffset, yOffset] + ')'
            })
          }


          function _updateBabiesFlood() {
            var babies = d3.selectAll('.baby');

            babies.transition()
              .delay(100)
              .attr(
              {
                'data-i': function (d, i) {return i},
                transform: function (d, i) {
                  return 'translate(' + [i * d.babyWidth + d.babyWidth, 0] + ')'
                },
                opacity: function (d, i) {
                  if (i == babies[0].length - 1) {
                    return 0
                  }
                }

              }
            )
              .transition()
              .attr({
                transform: function (d, i) {
                  if (i == babies[0].length - 1) {
                    d3.select(this).moveToBack()
                    return 'translate(0,0)';

                  }
                  else {
                    return 'translate(' + [i * d.babyWidth + d.babyWidth, 0] + ')'
                  }

                }
              })
              .transition()
              .attr({
                opacity: 1
              });
          }

          function _initHelloBubble() {
            d3.json("scripts/hello-in-all-languages.json", function (error, json) {
              if (error) return console.warn(error);
              helloWords = json;
            });


            helloBubble = chart
              .append('g')
              .attr({
                class: 'hello-bubble',
                transform: 'translate(-200,-200)',
                opacity: 0
              })
            helloBubble.append("use")
              .attr({
                'xlink:href': '#hello-bubble'

              })
            helloBubble.append("text")
              .attr({
                'fill': 'white',
                'text-anchor': 'middle',
                transform: 'translate(50,45)'

              })

          }

          function _sayHello() {
            var multiplier = _.random(0, 10);
//            console.log(multiplier, babyWidth * multiplier)
            helloBubble
              .attr(
              {
                transform: function () {
                  var xOffset = parentWidth - this.getBBox().width - babyWidth * multiplier - 20;
                  var yOffset = parentHeight - this.getBBox().height - 90;
                  return 'translate(' + [xOffset, yOffset] + ')'
                }
              }
            )
              .transition()
              .delay(500)
              .attr({
                opacity: 1
              })
              .transition()
              .delay(2000)
              .attr({
                opacity: 0
              })

            helloBubble.select('text').text(function () {
              if (helloWords) {
                var randomItem = _.random(0, helloWords.length - 1)
                return helloWords[randomItem].greeting
              }
              else{
                return 'Hello'
              }


            })
          }
        }
      };
    })

}());
