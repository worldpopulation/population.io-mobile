(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('peopleGrid', function (PeopleGridService, PopulationIOService) {
      return {
        restrict: 'E',
        link: function (scope, element) {
          var personWidth = 30,
            personHeight = 50,
            width = element.parent().width(),
            height = 600,
            populationScale = 1000000000 * 0.68,
            gridRows = 10,
            gridCols = 32,
            person,
            celebTooltip,
            celebTooltipTitle,
            celebTooltipDetails,
            celebTooltipRank

            ;

          var root = d3.select(element[0])
            .append('svg')
            .attr({width: width, height: height})
            .append('g')
            .attr({transform: 'translate(0,0)'});

          var grid = root.append('g')
            .attr({
              transform: 'translate(0, 100)',
              class: 'grid'
            });

          var _buildBarChart = function () {
            var worldPercent = 0.5;
            var localPercent = 0.8;

            var barChart = root.append('g')
              .attr('class', 'bar-chart');

            var worldBar = barChart.append('g')
              .attr('class', 'bar world');

            worldBar.append('rect')
              .attr({
                height: 10,
                width: width
              });
            worldBar.append('rect')
              .attr({
                class: 'highlight',
                height: 10,
                width: (worldPercent * width)
              });
            worldBar.append('text')
              .text((worldPercent * 100) + '%')
              .attr({
                x: (worldPercent * width)
              });

            var localBar = barChart.append('g')
              .attr('class', 'bar local');

            localBar.append('rect')
              .attr({
                height: 10,
                width: width
              });
            localBar.append('rect')
              .attr({
                class: 'highlight',
                height: 10,
                width: (localPercent * width)
              });
            localBar.append('text')
              .text((localPercent * 100) + '%')
              .attr({
                x: (localPercent * width)
              });
          };

          var blocksPerRow = -1;

          var _buildNavigator = function () {
            var nav = root.append('g')
              .attr('class', 'navigator');

            var blockSize = 2;
            var navWidth = 180;
            var navHeight = 400;
            var lensWidth = gridCols * blockSize - 1;
            var lensHeight = gridRows * (blockSize + 1);
            var maxHuman = PeopleGridService.getWorldPopulation() / populationScale;
            blocksPerRow = parseInt(navWidth / blockSize - 1, 0);
            var blockData = [];

            for (var i = 0; i < maxHuman / blocksPerRow; i += 1) {
              blockData.push(i);
            }

            var bisect = d3.bisector(function (d) { return d; }).left,
              meBlockIdx = bisect(blockData, PopulationIOService.getRank() / populationScale);

            nav.append('rect')
              .attr({
                class: 'frame',
                height: navHeight,
                width: navWidth
              });

            nav.append('text')
              .text('People Navigator (in billions)')
              .attr('class', 'title');

            var blocks = nav.append('g')
                .attr({class: 'blocks',
                  transform: 'translate(1,30)'})
              ;

            blocks.selectAll('.block')
              .data(blockData)
              .enter()
              .append('rect')
              .attr({
                class: function (d, i) {
                  var className = 'block';
                  if (i === meBlockIdx) {
                    className += ' me';
                  }
                  return className;
                },
                transform: function (d, i) {
                  return 'translate(' + [
                    0,
                      i * 3
                  ] + ')';
                },
//                transform: function (d, i) {
//                  return 'translate(' + [
//                      parseInt(i % blocksPerRow, 0) * blockSize,
//                      parseInt(i / blocksPerRow, 0) * (blockSize + 1)
//                  ] + ')';
//                },
                width: 178,
                height: blockSize,
                fill: function (d, i) {
                  if (i % 10 === 0) {
                    return 'white';
                  }
                  else {
                    return 'white';
                  }
                }
              });

            var yAxis = nav.append('g')
              .attr('class', 'y-axis');

            for (var j = 1; j <= 7; j += 1) {
              yAxis.append('text')
                .text(j)
                .attr({
                  'transform': function () {
                    return 'translate(' + [10 + navWidth, ((navHeight - 30) / 7) * j] + ')';
                  }
                });
            }

            var drag = d3.behavior.drag()
              .on('drag', function () {
                var x = Math.max(0,
                  Math.min(navWidth - lensWidth, d3.event.x - lensWidth / 2));
                var y = Math.max(30,
                  Math.min(navHeight - lensHeight, d3.event.y - lensHeight / 2));

                this.x = x;
                this.y = y;

                d3.select(this).attr('transform', 'translate(' + [x, y] + ')');
              })
              .on('dragstart', function () {
                _fadeGrid();

              })
              .on('dragend', function () {
                _updateGrid((this.x + 1) / blockSize, (this.y - 30) / (blockSize + 1));
              });


            var lens = nav.append('g')
              .attr({
                class: 'lens'
              })
              .call(drag);

            lens.append('rect')
              .attr({
                width: lensWidth,
                height: lensHeight,
                rx: 2
              });
          };

          var _initGrid = function (startRank) {
            var data = [];

            var xScale = d3.scale.linear()
              .domain([0, gridCols])
              .range([0, personWidth * gridCols]);
            var yScale = d3.scale.linear()
              .domain([0, gridRows])
              .range([0, personHeight * gridRows]);

            var currentY, prevY, x;
            for (var i = 0; i < gridCols * gridRows; i++) {
              prevY = Math.floor((i - 1) / gridCols);
              currentY = Math.floor(i / gridCols);
              if (prevY != currentY) {
                x = 0
              }
              else {
                x++
              }
              data.push({
                name: 'Unknown',
                id: i,
                rank: startRank++,
                y: Math.floor(i / gridCols),
                x: x,
                gender: ['male', 'female'][_.random(0, 1)]
              })
            }
            var personsArea = grid.append('g').attr('class', 'persons-area');
            person = personsArea.selectAll('.person')
              .data(data)
              .enter()
              .append('g')
              .attr({
                'data-rank': function (d, i) {return d.rank},
                opacity: 1,
                class: 'person',
                transform: function (d, i) {
                  return 'translate(' + [xScale(d.x), yScale(d.y)] + ')';
                }

              });
            person.on('mouseenter', function (d, i) {
              d3.select(this).selectAll('path').transition()
                .style('fill', '#21edff')

              celebTooltip
                .attr({
                  opacity: 1,
                  transform: 'translate(' + [xScale(d.x) - (150 - personWidth / 2), yScale(d.y) + personHeight + 30] + ')'});

              celebTooltipTitle.text(function () {
                return d.name
              })
              celebTooltipDetails.text(function () {
                return d.gender + ', ' + d.country + ', ' + d.birthday
              })
              celebTooltipRank.text(function () {
                return d.rank
              })
            });
            person.on('mouseleave', function (d, i) {
              d3.select(this).selectAll('path').transition().style('fill', function (d, i) {
                return ''
              })

              celebTooltip
                .attr({
                  opacity: 0,
                  transform: 'translate(-200,-200)'})
            })
//            person.append('rect').attr({width: personWidth, height: personHeight}).style('fill', 'rgba(0,0,0,0.05)')

            person.append('rect')
              .attr({
                width: personWidth,
                height: personHeight,
                class: 'background-area',

              })
              .style('fill', 'transparent');
            var icon = person.append('g')
              .attr({
                class: 'icon',
                transform: 'translate(7.5,10)'
              });
            var maleIcon = icon.append('g')
              .attr('class', 'male')
              .attr('opacity', function (d, i) {
                return d.gender == 'male' ? 1 : 0;
              });
            var femaleIcon = icon.append('g')
              .attr('class', 'female')
              .attr('opacity', function (d, i) {
                return d.gender == 'female' ? 1 : 0;
              });

            maleIcon.append('path').attr('d', 'M7.5,5.809c-0.869,0-1.576-0.742-1.576-1.654c0-0.912,0.707-1.653,1.576-1.653 c0.87,0,1.577,0.742,1.577,1.653C9.077,5.067,8.369,5.809,7.5,5.809z')
            maleIcon.append('path').attr('d', 'M11.997,16.187c0,0.522-0.405,0.946-0.903,0.946h-0.453V9.59H9.75v16.96c0,0.522-0.405,0.946-0.903,0.946 c-0.493,0-0.895-0.416-0.903-0.931c0-0.005,0-0.01,0-0.015c0-0.004,0-0.009,0-0.012V16.187H7.054v10.364c0,0.006,0,0.01,0,0.015 c-0.007,0.515-0.41,0.931-0.903,0.931c-0.498,0-0.902-0.424-0.902-0.946V9.59H4.358v7.542H3.905c-0.498,0-0.902-0.424-0.902-0.946 V9.119c0-1.301,1.009-2.36,2.25-2.36h4.493c1.241,0,2.251,1.058,2.251,2.36L11.997,16.187L11.997,16.187z')

            femaleIcon.append('path').attr('d', 'M7.025,20.425v6.123c0,0.005,0,0.01,0,0.015c-0.008,0.515-0.437,0.931-0.964,0.931 c-0.531,0-0.963-0.424-0.963-0.946v-6.123c0-0.001,0-0.002,0-0.004h1.927C7.025,20.422,7.025,20.423,7.025,20.425z')
            femaleIcon.append('path').attr('d', 'M9.903,20.425v6.123c0,0.522-0.432,0.946-0.964,0.946c-0.526,0-0.955-0.416-0.963-0.931 c0-0.005,0-0.009,0-0.015c0-0.004,0-0.008,0-0.012v-6.111c0-0.001,0-0.002,0-0.004h1.927C9.903,20.422,9.903,20.423,9.903,20.425z')
            femaleIcon.append('path').attr('d', 'M11.777,16.874l-1.792-7.39L9.059,9.7l2.374,9.787H3.542L5.916,9.7L4.99,9.484l-1.79,7.384l-0.472-0.111 c-0.517-0.121-0.837-0.631-0.714-1.139l1.711-7.048c0,0,0,0,0.001-0.001c0.259-1.065,1.22-1.808,2.336-1.808h2.878 c1.117,0,2.078,0.744,2.337,1.809l0,0l1.711,7.046c0,0,0,0,0,0.001c0.123,0.508-0.197,1.019-0.714,1.139L11.777,16.874z')
            femaleIcon.append('path').attr('d', 'M7.501,5.812c-0.928,0-1.683-0.741-1.683-1.653c0-0.911,0.755-1.653,1.683-1.653 c0.928,0,1.683,0.741,1.683,1.653C9.184,5.071,8.429,5.812,7.501,5.812z')


//            var _addPerson = function (x, y, data) {
//              var person = grid.append('g')
//                  .attr({
//                    opacity: 0,
//                    class: function () {
//                      var className = 'person';
//                      if (meBlock && data.rank === meBlock.rank) {
//                        className += ' me';
//                      }
//                      return className;
//                    },
//                    transform: function () {
//                      return 'translate(' + [x * personWidth, y * personHeight] + ')';
//                    }
//                  })
//
//                  .on('mouseover', function () {
//                    d3.select(this).classed('highlight', true);
//                  })
//                  .on('mouseout', function () {
//                    d3.select(this).classed('highlight', false);
//                  })
//                ;
//              person
//                .transition()
//                .delay(400)
//                .attr({
//                  opacity: 1
//                })
//
//              person.append('rect')
//                .attr({
//                  width: personWidth,
//                  height: personHeight
//                });
//
//              var icon = person.append('g')
//                .attr({
//                  class: 'icon',
//                  transform: 'translate(7.5,10)'
//                });
//              if (!(Math.random() + .5 | 0)) {
//                icon.append('path').attr('d', 'M7.5,5.809c-0.869,0-1.576-0.742-1.576-1.654c0-0.912,0.707-1.653,1.576-1.653 c0.87,0,1.577,0.742,1.577,1.653C9.077,5.067,8.369,5.809,7.5,5.809z')
//                icon.append('path').attr('d', 'M11.997,16.187c0,0.522-0.405,0.946-0.903,0.946h-0.453V9.59H9.75v16.96c0,0.522-0.405,0.946-0.903,0.946 c-0.493,0-0.895-0.416-0.903-0.931c0-0.005,0-0.01,0-0.015c0-0.004,0-0.009,0-0.012V16.187H7.054v10.364c0,0.006,0,0.01,0,0.015 c-0.007,0.515-0.41,0.931-0.903,0.931c-0.498,0-0.902-0.424-0.902-0.946V9.59H4.358v7.542H3.905c-0.498,0-0.902-0.424-0.902-0.946 V9.119c0-1.301,1.009-2.36,2.25-2.36h4.493c1.241,0,2.251,1.058,2.251,2.36L11.997,16.187L11.997,16.187z')
//              }
//              else {
//                icon.append('path').attr('d', 'M7.025,20.425v6.123c0,0.005,0,0.01,0,0.015c-0.008,0.515-0.437,0.931-0.964,0.931 c-0.531,0-0.963-0.424-0.963-0.946v-6.123c0-0.001,0-0.002,0-0.004h1.927C7.025,20.422,7.025,20.423,7.025,20.425z')
//                icon.append('path').attr('d', 'M9.903,20.425v6.123c0,0.522-0.432,0.946-0.964,0.946c-0.526,0-0.955-0.416-0.963-0.931 c0-0.005,0-0.009,0-0.015c0-0.004,0-0.008,0-0.012v-6.111c0-0.001,0-0.002,0-0.004h1.927C9.903,20.422,9.903,20.423,9.903,20.425z')
//                icon.append('path').attr('d', 'M11.777,16.874l-1.792-7.39L9.059,9.7l2.374,9.787H3.542L5.916,9.7L4.99,9.484l-1.79,7.384l-0.472-0.111 c-0.517-0.121-0.837-0.631-0.714-1.139l1.711-7.048c0,0,0,0,0.001-0.001c0.259-1.065,1.22-1.808,2.336-1.808h2.878 c1.117,0,2.078,0.744,2.337,1.809l0,0l1.711,7.046c0,0,0,0,0,0.001c0.123,0.508-0.197,1.019-0.714,1.139L11.777,16.874z')
//                icon.append('path').attr('d', 'M7.501,5.812c-0.928,0-1.683-0.741-1.683-1.653c0-0.911,0.755-1.653,1.683-1.653 c0.928,0,1.683,0.741,1.683,1.653C9.184,5.071,8.429,5.812,7.501,5.812z')
//              }
////              person.append('text')
////                .text(function () { return data ? data.rank : ''; })
////                .attr({
////                  fill: '#fff',
////                  'text-anchor': 'middle',
////                  transform: 'translate(' + [
////                      personWidth / 2,
////                      personHeight / 2 + 4
////                  ] + ')'
////                });
//            };

//            var idx = 0;
//            for (var y = 0; y < gridRows; y += 1) {
//              for (var x = 0; x < gridCols; x += 1) {
//                _addPerson(x, y, data[++idx]);
//              }
//            }
          };
          var _fadeGrid = function () {
            grid.selectAll('.person')
              .transition()
              .attr('opacity', 0.2);
          };
          var _updateGrid = function () {
            grid.selectAll('.person')
              .transition()
              .attr('opacity', 1);
            _loadCelebrities(500000000)

          };

          function _initCelebTooltip() {
            celebTooltip = grid.append('g')
              .attr({
                class: 'celeb-tooltip',
                transform: 'translate(-200,-200)'
              });
            celebTooltip.append('rect')
              .style('fill', 'rgba(0,0,0,0.2)')
              .attr({
                width: 300,
                height: 100,
                rx: 10,
                ry: 10,
                x: 2,
                y: 2
              })
            celebTooltip.append('rect')
              .style('fill', 'rgba(0,0,0,0.2)')
              .attr({
                width: 40,
                height: 40,
                rx: 5,
                ry: 5,
                transform: 'translate(154,-18) rotate(45)'
              })

            celebTooltip.append('rect')
              .style('fill', '#ff6')
              .attr({
                width: 300,
                height: 100,
                rx: 10,
                ry: 10
              })
            celebTooltip.append('rect')
              .style('fill', '#ff6')
              .attr({
                width: 40,
                height: 40,
                rx: 5,
                ry: 5,
                transform: 'translate(150,-20) rotate(45)'
              })
            celebTooltip.append('line')
              .style({
                stroke: 'rgba(0,0,0,0.2)',
                'stroke-width': 1
              })
              .attr({
                x1: 60,
                y1: 60,
                x2: 280,
                y2: 60
              })
            celebTooltipTitle = celebTooltip.append('text')
              .attr({
                class: 'celeb-tooltip-title',
                transform: 'translate(60,30)'
              })
              .text('')
            celebTooltipDetails = celebTooltip.append('text')
              .attr({
                class: 'celeb-tooltip-details',
                transform: 'translate(60,50)'
              })
              .text('')
            celebTooltipRank = celebTooltip.append('text')
              .attr({
                class: 'celeb-tooltip-rank',
                transform: 'translate(60,80)'
              })
              .text('')

          }

          function _loadCelebrities(startRank) {
            var celebs = PopulationIOService.getCelebrities(startRank)

            person.each(
              function (d, i) {

                var celeb = _.find(celebs, function (celeb) {
                  return celeb.rank == d.rank;
                });

                if (celeb) {
                  var _person = d3.select(this);
                  d.gender = celeb.gender;
                  d.name = celeb.name;
                  d.birthday = celeb.birthday;
                  d.country = celeb.country;
                  _person.classed('celeb', true)
                  _person.selectAll('path').style('fill', '#333')
                  _person.select('.icon .male').attr('opacity', function (d, i) {
                    return d.gender == 'male' ? 1 : 0;
                  });
                  _person.select('.icon .female').attr('opacity', function (d, i) {
                    return d.gender == 'female' ? 1 : 0;
                  })
                }


              })
          }

          _buildBarChart();
          _buildNavigator();
          _initGrid(500000000);
          _loadCelebrities(500000000);
          _initCelebTooltip();
        }
      };
    });

}());