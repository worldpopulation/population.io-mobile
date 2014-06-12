(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('worldClock', function ($filter, PopulationIOService, HelloWords) {
      return {
        restrict: 'E',
        link: function ($scope, element, attrs, ngModel) {
          var currentValue, digits, countElement, clockElement, digit, placeholder, digitText, placeholderText, chart,
            babiesArea, baby, babiesList, lastReborn, helloBubble, babyWidth, countryTitle,
            digitCellWidth = 26,
            animationDuration = 300,
            parentWidth = element[0].offsetWidth,
            parentHeight = 220
            ;
          chart = d3.select(element[0])
            .append('svg')
            .attr({
              width: parentWidth,
              height: parentHeight
            });


          _initWorldClock();
          _initBabiesFlood();
          _initHelloBubble();

          setInterval(_updateWorldClock, 1000);
          setInterval(_sayHello, 6000);


          function _initWorldClock() {
            currentValue = $filter('number')(
              PopulationIOService.getWorldPopulation(), 0
            );
            digits = ('' + currentValue).split('');

            var clip = chart.append("defs").append("svg:clipPath")
              .attr("id", "clip")
              .append("rect")
              .attr("id", "clip-rect")
              .attr("x", "0")
              .attr("y", "0")
              .attr("width", digits.length * digitCellWidth)
              .attr("height", 40);

            clockElement = chart.append('g')
              .attr('class', 'counter')
              .attr({
                'clip-path': 'url(#clip)',
                transform: 'translate(160, 90)'

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
                'data-id': function (d, i) {return i},
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
                transform: 'translate(' + digitCellWidth / 2 + ',35)'
              });

          }

          function _updateWorldClock() {
            currentValue = $filter('number')(
              PopulationIOService.getWorldPopulation(), 0
            );
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
                  _updateBabiesFlood();
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
              {},
              {},
              {}
            ];
            lastReborn = babiesList.length;
            babiesArea = chart
              .append('g')
              .attr({
                class: 'babies-area'
              })
            var countryTitleBackground = chart
              .append('rect')
              .attr({class: 'country-title-background',
                transform: 'translate(' + [410, 180] + ')',
                fill: '#fff',
                width: 400,
                height: 60
              })

              .text('hello')
            var countryTitleLine = chart
              .append('rect')
              .attr({class: 'country-title-line',
                transform: 'translate(' + [0, 180] + ')',
                fill: '#ccc',
                width: parentWidth,
                height: 1
              })

              .text('hello')
            countryTitle = chart
              .append('text')
              .attr({class: 'country-title', transform: 'translate(' + [610, 210] + ')'})

              .text('hello')

            baby = babiesArea.selectAll('.baby')
              .data(babiesList)
              .enter()
              .append('g')
              .attr({
                class: 'baby',
                opacity: 1
              });
            baby
              .on('mouseenter', function () {
                d3.select(this).select('.hello-bubble').transition().attr('opacity', 1)
              })
              .on('mouseleave', function () {
                d3.select(this).select('.hello-bubble').transition().attr('opacity', 0)
              })
            baby
              .append("use")
              .attr({
                'xlink:href': function () {
                  return ['#baby-girl', '#baby-boy'][_.random(0, 1)]
                }
              });

            baby.each(function (d, i) {
              var helloWord, countryTitle;
              var randomItem = _.random(0, HelloWords.length - 1)
              helloWord = HelloWords[randomItem].greeting
              countryTitle = HelloWords[randomItem].language

              d.helloWord = helloWord;
              d.countryTitle = countryTitle;
              babyWidth = d.babyWidth = this.getBBox().width;
            }).attr({
              transform: function (d, i) {
                return 'translate(' + [i * d.babyWidth, 0] + ')'
              }
            })

            babiesArea.attr('transform', function () {
              var xOffset = parentWidth - this.getBBox().width - 20;
              var yOffset = parentHeight - this.getBBox().height - 80;
              return 'translate(' + [xOffset, yOffset] + ')'
            });
            _updateBabiesFlood();


          }


          function _updateBabiesFlood() {
            var newTitle;
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
                    var randomItem = _.random(0, HelloWords.length - 1)
                    d.helloWord = HelloWords[randomItem].greeting;
                    d.countryTitle = HelloWords[randomItem].language;


                    return 0
                  }
                }

              }
            )
              .transition()
              .attr({
                transform: function (d, i) {
                  if (i == babies[0].length - 1) {
                    newTitle = d.countryTitle
                    d3.select(this).moveToBack()
                    return 'translate(-70,50)';

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
            countryTitle
              .transition()
              .attr({opacity: 0})
              .transition()
              .delay(600)
              .attr({opacity: 1})
              .text(newTitle)
          }

          function _initHelloBubble() {

            helloBubble = baby
              .append('g')
              .attr({
                class: 'hello-bubble',
                transform: 'translate(-30,-90)',
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
            var seed = _.random(0, babiesList.length);
            helloBubble
              .transition()
              .delay(500)
              .attr({
                opacity: function (d, i) {
                  return i == seed ? 1 : 0;
                }
              })
              .transition()
              .delay(2000)
              .attr({
                opacity: 0
              })

            helloBubble.select('text').text(function (d, i) {
              return d.helloWord

            })
          }
        }
      };
    })

}());
