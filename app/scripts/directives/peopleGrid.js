(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('peopleGrid', function (PopulationIOService, Celebrities, ProfileService, $timeout) {
      return {
        restrict: 'E',
        scope: {
          rankLocal: "=",
          rankLocalTotal: "=",
          rankGlobal: "=",
          rankGlobalTotal: "="
        },
        link: function ($scope, element) {
          var formatCommas = d3.format("0,000");
          d3.peopleGrid = {
//            chart,
//            navigatorArea,
//            person,
//            grid,
//            rollScale,
//            celebsBar,
//            prevCelebsButton,
//            nextCelebsButton,
//            peopleInOneRow,
//            personNavPointer,
//            celebsRoll,
//            rankScale,
//            rankScale2,
//            birthdayScale,
//            celebTooltipPointerShadow,
//            celebTooltipPointer,
//            lens,
//            blockData: [],
//            celebTooltipImage,

//            scaleX: this.personWidth,
//            scaleY: this.personHeight / 3,
//            lensWidth: 30,
//            lensHeight: 8 * 3,
//            ,
//            celebWidth,
//            currentCeleb: 0,
//            lensX: 0,
//            lensY: 0,
//
          };

          d3.peopleGrid.canvas = function () {
            var parentWidth = 1200,
              parentHeight = 650,
              personWidth = 30,
              personHeight = 50,
              gridWidth = personWidth * 30,
              gridHeight = personHeight * 8,
              celebsInCelebsBar = 5,
              navWidth = 180,
              navHeight = 400,
              populationTopLimit = 8000000000,
              svg,
              formatBillions = d3.format(".1s"),
              formatLeadingZeros = d3.format("03d"),
              lensWidth = 30,
              lensHeight = 8 * 3,
              lensX = 0,
              lensY = 0,
              celebs,
              rollScale = d3.scale.linear(),
              celebsRoll,
              currentCeleb = 0,
              prevCelebsButton,
              nextCelebsButton,
              celebTooltip,
              celebWidth,
              lens
              ;

            function canvas(selection) {
              svg = selection
                .append('svg')
                .attr({
                  class: 'svg canvas',
                  'shape-rendering': 'auto',
                  width: parentWidth,
                  height: parentHeight})
                .call(initDefs)
                .append('g').attr({class: 'canvas-container'})
                .attr({transform: canvas.utils.translate(0, 0)})
                .call(initGrid)
                .call(initBarChart)
                .call(initCelebsBar)
                .call(initNavigator)
                .call(initCelebTooltip)
            }

            function initGrid(selection) {
              var gridWrapper = selection
                .append('g')
                .attr({
                  class: 'grid-wrapper',
                  'clip-path': 'url(#grid-clip)',
                  transform: canvas.utils.translate(personWidth, 100)

                });
              var grid = gridWrapper.append('g')
                .attr({
                  class: 'grid',
                  opacity: 1,
                  transform: canvas.utils.translate(0, 0)
                });
              grid.append('rect')
                .attr({
                  transform: canvas.utils.translate(-personWidth * 30, -personHeight * 30)
                })
                .style({fill: "url(#ghosts-pattern)"})
                .attr({width: personWidth * 170 + personWidth * 60, height: 400 * personHeight + personHeight * 60})

            }

            function initBarChart(selection) {
              var barHeight = 17;

              var barChart = selection.append('g')
                .attr('class', 'bar-chart');

              var worldBar = barChart.append('g')
                .attr('class', 'bar world');

              worldBar.append('rect')
                .attr({
                  height: barHeight,
                  width: parentWidth
                });
              worldBar.append('rect')
                .attr({
                  'class': 'highlight',
                  height: barHeight,
                  width: 0
                });
              worldBar.append('text')
                .text('0%')
                .attr({
                  'class': 'percent',
                  x: 0
                });
              worldBar.append('g')
                .attr('class', 'x-axis');

              var localBar = barChart.append('g')
                .attr('class', 'bar local');

              localBar.append('rect')
                .attr({
                  height: barHeight,
                  width: parentWidth
                });
              localBar.append('rect')
                .attr({
                  class: 'highlight',
                  height: barHeight,
                  width: 0
                });
              localBar.append('text')
                .text('0%')
                .attr({
                  'class': 'percent',
                  x: 0
                });
              localBar.append('g')
                .attr('class', 'x-axis');
            }

            canvas.updateLocalBar = function (rank, rankTotal) {
              var bar = svg.select('.bar.local'),
                width = parseInt((rank / rankTotal) * parentWidth, 0),
                ticks = 5;

              bar.select('rect.highlight')
                .transition()
                .duration(1000)
                .attr({
                  width: width
                });
              bar.select('text')
                .text(parseInt(100 * rank / rankTotal, 0) + '%')
                .transition()
                .duration(1000)
                .attr({
                  x: width
                });

              var xScale = d3.scale.linear()
                .domain([0, rankTotal])
                .range([0, parentWidth]);

              var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(ticks)
                .tickFormat(function (d) { return formatBillions(d).replace('G', 'b');});
              ;

              bar.select('.x-axis')
                .call(xAxis)
                .selectAll('.tick')
                .attr({
                  'class': function (d, i) {
                    var className = 'tick';
                    if (i === 0) {
                      className += ' first';
                    }
                    if (i === ticks - 1) {
                      className += ' last';
                    }
                    return className;
                  }
                });
            }

            canvas.updateGlobalBar = function (rank, rankTotal) {
              var bar = svg.select('.bar.world'),
                width = (rank / rankTotal) * parentWidth,
                ticks = 5;

              bar.select('rect.highlight')
                .transition()
                .duration(1000)
                .attr({
                  width: width
                });
              bar.select('.percent')
                .text(parseInt(100 * rank / rankTotal, 0) + '%')
                .transition()
                .duration(1000)
                .attr({
                  x: width
                });

              var xScale = d3.scale.linear()
                .domain([0, rankTotal])
                .range([0, parentWidth]);

              var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('top')
                .ticks(ticks)
                .tickFormat(function (d) { return formatBillions(d).replace('G', 'B');});

              bar.select('.x-axis')
                .call(xAxis)
                .selectAll('.tick')
                .attr({
                  'class': function (d, i) {
                    var className = 'tick';
                    if (i === 0) {
                      className += ' first';
                    }
                    if (i === ticks - 1) {
                      className += ' last';
                    }
                    return className;
                  }
                });
            }

            function initDefs(selection) {
              var defs = selection.append("defs");
              var roundedCornersClip = defs.append("clipPath")
                .attr("id", "rounded-corners-clip")
                .append("circle")
                .attr("id", "clip-circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 20);
              var celebsRollClip = defs.append("clipPath")
                .attr("id", "celebs-roll-clip")
                .append("rect")
                .attr("id", "clip-rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", (parentWidth - 200 - 300))
                .attr("height", 200);
              var gridClip = defs.append("clipPath")
                .attr("id", "grid-clip")
                .append("rect")
                .attr({
                  id: "clip-rect",
                  x: 0,
                  y: 0,
                  width: gridWidth,
                  height: gridHeight
                });

              var ghostsPattern = defs.append('pattern')
                .attr({id: 'ghosts-pattern',
                  x: 0,
                  y: 0,
                  width: personWidth,
                  height: personHeight,
                  patternUnits: "userSpaceOnUse"
                });

//            ghostsPattern.append('rect').attr({x: 0, y: 0, width: personWidth - 1, height: personHeight - 1, fill: '#eee'});
              var ghostsPatternIcon = ghostsPattern.append('g').attr({class: 'icon', transform: canvas.utils.translate(7.5, 10)});
              ghostsPatternIcon.append('path').attr({d: 'M7.5,5.809c-0.869,0-1.576-0.742-1.576-1.654c0-0.912,0.707-1.653,1.576-1.653 c0.87,0,1.577,0.742,1.577,1.653C9.077,5.067,8.369,5.809,7.5,5.809z', fill: '#ccc'});
              ghostsPatternIcon.append('path').attr({d: 'M11.997,16.187c0,0.522-0.405,0.946-0.903,0.946h-0.453V9.59H9.75v16.96c0,0.522-0.405,0.946-0.903,0.946 c-0.493,0-0.895-0.416-0.903-0.931c0-0.005,0-0.01,0-0.015c0-0.004,0-0.009,0-0.012V16.187H7.054v10.364c0,0.006,0,0.01,0,0.015 c-0.007,0.515-0.41,0.931-0.903,0.931c-0.498,0-0.902-0.424-0.902-0.946V9.59H4.358v7.542H3.905c-0.498,0-0.902-0.424-0.902-0.946 V9.119c0-1.301,1.009-2.36,2.25-2.36h4.493c1.241,0,2.251,1.058,2.251,2.36L11.997,16.187L11.997,16.187z', fill: '#ccc'});
              return defs;
            }

            function initCelebsBar(selection) {
              celebWidth = (parentWidth - 200 - 300) / celebsInCelebsBar;
              var celebsBar = selection.append('g')
                .attr({
                  class: 'celebs-bar',
                  transform: canvas.utils.translate(100, 550),
                  opacity: 1
                });
              celebsBar.append('rect')
                .attr(
                {
                  fill: 'rgba(0,0,0,0.01)',
                  width: parentWidth - 200,
                  height: 100,
                  transform: canvas.utils.translate(0, 0)

                }
              );
              celebsBar.append('rect')
                .attr(
                {
                  fill: '#ccc',
                  width: parentWidth - 200,
                  height: 1,
                  transform: canvas.utils.translate(0, 0)

                }
              );
              celebsBar.append('rect')
                .attr(
                {
                  fill: '#ccc',
                  width: parentWidth - 200,
                  height: 1,
                  transform: canvas.utils.translate(0, 99)

                }
              );

              celebsBar.append('rect')
                .attr(
                {
                  fill: '#eee',
                  width: parentWidth - 200,
                  height: 1,
                  transform: canvas.utils.translate(0, 50)
                }
              );

              var celebsRollWrapper = celebsBar
                .append('g')
                .attr({
                  class: 'celebs-roll-wrapper',
                  transform: canvas.utils.translate(150, 0),
                  'clip-path': 'url(#celebs-roll-clip)'
                });

              celebsRoll = celebsRollWrapper.append('g').attr('class', 'celebs-roll');
              prevCelebsButton = celebsBar.append('g')
                .attr({
                  class: 'prev-celebs-button',
                  transform: canvas.utils.translate(70, 50)
                })
                .style('display', 'none');

              nextCelebsButton = celebsBar.append('g')
                .attr({
                  class: 'next-celebs-button',
                  transform: canvas.utils.translate(parentWidth - 200 - 70, 50)
                });

              nextCelebsButton
                .on('mouseenter', function () {
                  d3.select(this).select('circle').transition().attr('r', 24)
                })
                .on('mouseleave', function () {
                  d3.select(this).select('circle').transition().attr('r', 20)
                });
              prevCelebsButton
                .on('mouseenter', function () {
                  d3.select(this).select('circle').transition().attr('r', 24)
                })
                .on('mouseleave', function () {
                  d3.select(this).select('circle').transition().attr('r', 20)
                });
              celebsRoll.append('rect')
                .attr(
                {
                  fill: 'transparent',
                  width: parentWidth - 200 - 300,
                  height: 100

                });

              prevCelebsButton.append('circle')
                .attr(
                {
                  fill: '#fff',
                  'stroke-width': 1,
                  stroke: '#ccc',
                  r: 20,
                  cx: 0,
                  cy: 0
                }
              );
              prevCelebsButton.append('polygon')
                .attr(
                {
                  fill: '#444',
                  points: '10.002,4.503 1.906,4.503 5.224,1.198 4.519,0.496 -0.002,5 4.519,9.504 5.224,8.802 1.906,5.497 10.002,5.497',
                  transform: 'translate(-5,-5)'

                }
              );
              nextCelebsButton.append('circle')
                .attr(
                {
                  fill: '#fff',
                  'stroke-width': 1,
                  stroke: '#ccc',
                  r: 20,
                  cx: 0,
                  cy: 0
                }
              );
              nextCelebsButton.append('polygon')
                .attr(
                {
                  fill: '#444',
                  points: '-0.002,4.503 8.094,4.503 4.776,1.198 5.481,0.496 10.002,5 5.481,9.504 4.776,8.802 8.094,5.497 -0.002,5.497',
                  transform: canvas.utils.translate(-5, -5)

                }
              )

            }

            function initNavigator(selection) {
              var navigatorArea = selection
                .append('g')
                .attr({
                  class: 'navigator',
                  transform: canvas.utils.translate(950 + personWidth / 2, 100)
                });

              navigatorArea.append('rect')
                .attr({
                  opacity: 0,
                  class: 'frame',
                  height: navHeight,
                  width: navWidth
                })
                .transition()
                .delay(2000)
                .attr({
                  opacity: 1
                })
              ;

              var yAxisElement = navigatorArea.append('g')
                .attr({
                  opacity: 0,
                  class: 'y-axis',
                  transform: canvas.utils.translate(190, 0)
                })
                .transition()
                .delay(2000)
                .attr({
                  opacity: 1
                });

              var blocksArea = navigatorArea
                .append('g')
                .attr({
                  class: 'blocks',
                  transform: canvas.utils.translate(1, 1)
                });
              var celebsArea = navigatorArea
                .append('g')
                .attr({
                  class: 'celebs',
                  transform: canvas.utils.translate(1, 1)
                });
              var scaleX = 30, scaleY = 50;
              var dragLens = d3.behavior.drag()
                .on('dragstart', function () {
                  var lensTranslate = canvas.utils.getXYFromTranslate(d3.select(this).attr('transform'));
                  lensX = lensTranslate[0];
                  lensY = lensTranslate[1];
                })
                .on('drag', function () {
                  var target = d3.select('.grid');
                  d3.event.sourceEvent.stopImmediatePropagation();
                  lensX += d3.event.dx;
                  lensY += d3.event.dy;
                  if (lensX < 0) {lensX = 0}
                  if (lensY < 0) {lensY = 0}
                  if (lensX >= navWidth - lensWidth) {lensX = navWidth - lensWidth}
                  if (lensY >= navHeight - lensHeight) {lensY = navHeight - lensHeight}
                  d3.select(this).attr("transform", canvas.utils.translate(lensX, lensY));
                  var translate = [(-lensX * scaleX), (-lensY * scaleY / 3)];
                  target.attr("transform", "translate(" + translate + ")");
                });

              lens = navigatorArea.append('g')
                .attr({
                  class: 'lens',
                  opacity: 0,
                  transform: canvas.utils.translate(0, 0)
                })
                .call(dragLens);
              lens.append('rect').attr({width: lensWidth, height: lensHeight});
              lens
                .transition()
                .delay(2000)
                .attr({opacity: 1});

            }

            function initCelebTooltip(selection) {
              selection.select('.celeb-tooltip').remove();
              celebTooltip = selection.append('g')
                .attr({
                  class: 'celeb-tooltip',
                  transform: canvas.utils.translate(-200, -200)
                });

              celebTooltip.append('rect')
                .style('fill', 'rgba(0,0,0,0.2)')
                .attr({
                  class: 'box-shadow',
                  width: 270,
                  height: 100,
                  rx: 10,
                  ry: 10,
                  x: 2,
                  y: 2
                });

              celebTooltip.append('rect')
                .style('fill', '#ff6')
                .attr({
                  width: 270,
                  height: 100,
                  rx: 10,
                  ry: 10
                });
              var celebTooltipPointer = celebTooltip.append('rect')
                .style('fill', '#ff6')
                .attr({
                  class: 'pointer',
                  width: 30,
                  height: 30,
                  rx: 4,
                  ry: 4,
                  transform: 'translate(150,-15) rotate(45)'
                });
              celebTooltip.append('line')
                .style({
                  stroke: 'rgba(0,0,0,0.2)',
                  'stroke-width': 1
                })
                .attr({
                  x1: 80,
                  y1: 40,
                  x2: 240,
                  y2: 40
                });
              celebTooltip.title = celebTooltip.append('text')
                .attr({
                  class: 'celeb-tooltip-title',
                  transform: 'translate(80,30)'
                })
                .text('');
              celebTooltip.details = celebTooltip.append('text')
                .attr({
                  class: 'celeb-tooltip-details',
                  transform: 'translate(80,60)'
                })
                .text('');
              celebTooltip.rank = celebTooltip.append('text')
                .attr({
                  class: 'celeb-tooltip-rank',
                  transform: 'translate(80,80)'
                })
                .text('Loading rank...');
              celebTooltip.image = celebTooltip
                .append('image').attr(
                {
                  width: 40,
                  height: 40,
                  x: -20,
                  y: -20,
                  'clip-path': 'url(#rounded-corners-clip)',
                  transform: 'translate(40,40)'
                }
              );
            }

            function populateCelebsBar() {
              celebWidth = (parentWidth - 200 - 300) / celebsInCelebsBar;
              rollScale
                .domain([0, celebs.length])
                .range([0, -celebWidth * celebs.length]);
              celebsRoll.selectAll('.roll-celeb').remove();
              celebsRoll.attr({transform: 'translate(0,0)'});
              prevCelebsButton.style('display', 'none');

              nextCelebsButton
                .on('click', function () {
//                  console.log('currentCeleb: ' + currentCeleb)
                  if (currentCeleb >= celebs.length - celebsInCelebsBar * 2) {
                    currentCeleb = celebs.length - celebsInCelebsBar;
                    nextCelebsButton.style('display', 'none')
                  } else {
                    currentCeleb += celebsInCelebsBar;
                    nextCelebsButton.style('display', 'block')
                  }
                  if (currentCeleb > 0) {
                    prevCelebsButton.style('display', 'block')
                  } else {
                    prevCelebsButton.style('display', 'block')
                  }
                  celebsRoll
                    .transition()
                    .attr({transform: canvas.utils.translate(rollScale(currentCeleb), 0)});
                  var startRange = currentCeleb - 2;
                  var celebsInBar = celebsRoll.selectAll('.roll-celeb');
                  celebsInBar.each(function (d, i) {
                    if (i > startRange && i <= startRange + 6) {
                      d3.select(this)
                        .select('image')
                        .attr({
                          'xlink:href': function (d, i) {
                            return d.thumbnail
                          }
                        })
                    }
                  })
                });

              prevCelebsButton
                .on('click', function () {
                  if (currentCeleb < celebsInCelebsBar * 2) {
                    currentCeleb = 0;
                    prevCelebsButton.style('display', 'none')
                  }
                  else {
                    currentCeleb -= celebsInCelebsBar;
                    prevCelebsButton.style('display', 'block')
                  }

                  if (currentCeleb >= celebs.length - celebsInCelebsBar - 1) {
                    nextCelebsButton.style('display', 'none')
                  } else {
                    nextCelebsButton.style('display', 'block')
                  }


                  celebsRoll
                    .transition()
                    .attr({transform: 'translate(' + [rollScale(currentCeleb), 0] + ')'});
                  var startRange = currentCeleb - 2;
                  var celebsInBar = celebsRoll.selectAll('.roll-celeb');
                  celebsInBar.each(function (d, i) {
                    if (i > startRange && i <= startRange + 6) {
                      d3.select(this)
                        .select('image')
                        .attr({
                          'xlink:href': function (d, i) {
                            return d.thumbnail
                          }
                        })
                    }
                  })

                });

              var celeb = celebsRoll.selectAll('.roll-celeb')
                .data(celebs)
                .enter()
                .append('g')
                .attr({
                  class: 'roll-celeb',
                  'data-id': function (d, i) {return i},
                  transform: function (d, i) {
                    return 'translate(' + [i * celebWidth, 0] + ')'
                  }
                });
              celeb.append('circle').attr(
                {
                  fill: 'white',
                  r: 20,
                  cx: celebWidth / 2,
                  cy: 50,
                  'stroke-width': 1,
                  stroke: '#ccc'


                }
              );
              celeb.append('image').attr(
                {
                  width: 40,
                  height: 40,
                  x: -20,
                  y: -20,
                  'clip-path': 'url(#rounded-corners-clip)',
                  transform: 'translate(' + [celebWidth / 2, 50] + ')',
                  'xlink:href': function (d, i) {
                    return i < 10 ? d.thumbnail : '';
                  }
                }
              );


              celeb.append('text')
                .style(
                {
                  fill: '#444',
                  'font-size': 12,
                  'text-anchor': 'middle'
                }
              )
                .attr({
                  transform: 'translate(' + [celebWidth / 2, 0] + ')',
                  dy: 87
                })
                .text(function (d, i) {
                  return d.name
                });

              celeb.append('rect').attr(
                {
                  width: celebWidth,
                  height: 100,
                  x: 0,
                  y: 0
                }
              )
                .style({
                  fill: 'transparent'
                })
              ;

              celeb.on('mouseenter',
                showTooltip

//                function (d, i) {
//                showTooltip(d, xy[0], xy[1])
//
//                personInGrid.classed('highlighted', true)
//              }
              );
              celeb.on('mouseleave', function (d, i) {
                var grid = d3.select('.grid');
                d3.select(this)
                  .select('circle')
                  .transition()
                  .attr({
                    r: 20
                  });

                var allPersonsInGrid = grid.selectAll('.person');
                allPersonsInGrid.classed('highlighted', false);
                hideTooltip(d, i)
              });


              var ghost = celebsRoll.selectAll('.ghost')
                .data([0, 1, 2, 3])
                .enter()
                .append('g')
                .attr({
                  class: 'ghost',
                  transform: function (d, i) {
                    if (i < 2) {
                      return 'translate(' + [0 - (i + 1) * celebWidth, 0] + ')'
                    }
                    else {
                      return 'translate(' + [-rollScale(celebs.length - 2 + i), 0] + ')'
                    }
                  }
                });
              ghost.append('circle').attr(
                {
                  fill: '#eee',
                  r: 20,
                  cx: celebWidth / 2,
                  cy: 50,
                  'stroke-width': 1,
                  stroke: '#eee'


                }
              );
              ghost.append('rect').attr(
                {
                  width: celebWidth,
                  height: 100,
                  x: 0,
                  y: 0
                }
              )
                .style({
                  fill: 'transparent'
                })
              ;

            }

            function showTooltip(x, y) {


              d3.selectAll('.roll-celeb')
                .select('circle')
                .transition()
                .attr({
                  r: 20
                });

              var d = d3.select(this).datum();

              var navigatorArea = d3.select('.navigator');
              var grid = d3.select('.grid');
              var personItem = d3.select('.grid-celeb[data-id="' + d.id + '"]');
              var lens = d3.select('.lens');
              var xy = canvas.utils.getXYFromTranslate(personItem.attr('transform'));
              navigatorArea.select('rect[data-id="' + d.id + '"]').classed('active', true);
              var navigatorX = parseInt(navigatorArea.select('rect[data-id="' + d.id + '"]').attr('x'))
              var navigatorY = parseInt(navigatorArea.select('rect[data-id="' + d.id + '"]').attr('y'))
              grid.select('.grid-celeb[data-id="' + d.id + '"]').classed('highlighted', true);
              celebTooltip.attr({ opacity: 1 });
              var scaleX = 30, scaleY = 50;
              var gridXY = canvas.utils.getXYFromTranslate(grid.attr('transform'));

              if (d3.select(this).classed('grid-celeb')) {
//                toggleCelebInCelebsBar(d.id);
                celebTooltip.classed('me', d.name == 'You')
                var tooltipX = 0;
                if (xy[0] + gridXY[0] <= 120) {
                  tooltipX = 20
                  d3.select('.celeb-tooltip').select('.pointer').attr('transform', function () {
                    return canvas.utils.translate(xy[0] + gridXY[0] + 5, 5) + ' rotate(-45)'
                  })
                }
                else {
                  tooltipX = xy[0] + gridXY[0] - 270 / 2 + 30
                  d3.select('.celeb-tooltip').select('.pointer').attr('transform', 'translate(150, -15) rotate(45)')

                }
                celebTooltip.attr({
                  transform: canvas.utils.translate(tooltipX, xy[1] + gridXY[1] + 170)
                });

              }
              else if (d3.select(this).classed('roll-celeb')) {
                grid
                  .transition()
                  .duration(600)
                  .attr({transform: canvas.utils.translate(-xy[0] + gridWidth / 2, -xy[1] + gridHeight / 2)});
                lens
                  .transition()
                  .duration(600)
                  .attr({transform: function () {
                    var xPosition, yPosition;
                    if (lensWidth / 2 > navigatorX) {xPosition = 0;}
                    else if (navigatorX > navWidth - lensWidth) {xPosition = navWidth - lensWidth;}
                    else {xPosition = navigatorX - lensWidth / 2 + 2;}

                    if (lensHeight / 2 > navigatorY) {yPosition = 0;}
                    else {yPosition = navigatorY - lensHeight / 2 + 2;}

                    return canvas.utils.translate(xPosition, yPosition)
                  }});
                celebTooltip.attr({
                  transform: canvas.utils.translate(gridWidth / 2 - 270 / 2 + 30, gridHeight / 2 + 170)
                });
                d3.select(this)
                  .select('circle')
                  .transition()
                  .attr({
                    r: 70
                  })
              }
              celebTooltip.image.attr({
                'xlink:href': function () {
                  return d.thumbnail
                }

              });

              celebTooltip.title.text(function () {
                return d.name
              });
              PopulationIOService.loadWpRankToday({
                dob: d.birthday,
                sex: 'unisex',
                country: 'World'
              }, function (rank) {
                celebTooltip.rank.text(function () {
                  return formatCommas(rank)
                });

              });


              celebTooltip.details.text(function () {
                return d.country + ', ' + d.birthday
              });
            }

            function toggleCelebInCelebsBar(id) {
              var celebsRoll = d3.select('.celebs-roll');
              var celebs = celebsRoll.selectAll('.roll-celeb').data();


              if (id) {
                currentCeleb = _.findIndex(celebs, function (celeb, index) {
                  return celeb.id == id
                });
                celebsRoll
                  .transition()
                  .attr({
                    transform: 'translate(' + [rollScale(currentCeleb - 2), 0] + ')'
                  });
                var currentCelebElement = celebsRoll.select('.roll-celeb[data-id="' + currentCeleb + '"]');
                var currentCelebElementInGrid = celebsRoll.select('.person[data-id="' + id + '"]');
                currentCelebElement
                  .select('circle')
                  .transition()
                  .delay(500)
                  .attr({
                    r: 70
                  });
                currentCelebElement
                  .select('image')
                  .attr({
                    'xlink:href': function (d, i) {
                      return d.thumbnail
                    }
                  });

                var startRange = currentCeleb - 4;
                var celebsInBar = celebsRoll.selectAll('.roll-celeb');
                celebsInBar.each(function (d, i) {
                  if (i > startRange && i <= startRange + 10) {
                    d3.select(this)
                      .select('image')
                      .attr({
                        'xlink:href': function (d, i) {
                          return d.thumbnail
                        }
                      })
                  }
                });


                nextCelebsButton.style({
                  display: function () {
                    return currentCeleb >= celebs.length - 1 ? 'none' : 'block';
                  }
                });
                prevCelebsButton.style({
                  display: function () {
                    return currentCeleb <= 2 ? 'none' : 'block';
                  }
                })


              }
              else {
                if (currentCeleb + 2 >= celebs.length - 1) {
                  celebsRoll
                    .transition()
                    .attr({
                      transform: 'translate(' + [rollScale(celebs.length - celebsInCelebsBar), 0] + ')'
                    })
                }
                else if (currentCeleb <= 2) {
                  celebsRoll
                    .transition()
                    .attr({
                      transform: 'translate(' + [0, 0] + ')'
                    })
                }
                celebsRoll.selectAll('circle')
                  .transition()
                  .attr({r: 20})

              }
            }

            function hideTooltip() {
              var celebTooltip = d3.select('.celeb-tooltip');
              celebTooltip
                .attr({
                  opacity: 0,
                  transform: 'translate(-200,-200)'
                });
              d3.select('.celeb-tooltip-rank').text('Loading rank...');

              d3.select('.navigator').selectAll('rect').classed('active', false);
              d3.select('.grid').selectAll('.grid-celeb').classed('highlighted', false);
              toggleCelebInCelebsBar();
            }


            canvas.utils = {
              translate: function (x, y) {return 'translate(' + [x, y] + ')';},
              getXYFromTranslate: function (translateString) {
                var split = translateString.split(",");
                var x = split[0] ? ~~split[0].split("(")[1] : 0;
                var y = split[1] ? ~~split[1].split(")")[0] : 0;
                return [x, y];
              }
            };

            canvas.populate = function () {
              console.log('Populating...');

              var blockData = [];
              var rows = [];

              celebs = Celebrities.all();
              celebs.push({
                birthday: ProfileService.birthday,
                name: 'You',
                country: ProfileService.country,
                gender: ProfileService.gender,
                thumbnail: 'images/user-' + ProfileService.gender + '.png',
                id: celebs.length
              });
              celebs = _.sortBy(celebs, function (item) {return item.birthday});


              var worldPopulation = PopulationIOService.getWorldPopulation();


              var rankScale = d3.time.scale()
                .domain([new Date('1920-01-01'), new Date()])
                .range([0, worldPopulation]);

              var yScale2 = d3.scale.linear()
                .domain([0, navHeight])
                .range([0, populationTopLimit]);

              _.times(Math.floor(navHeight / 3), function (i) { blockData.push({ i: i * 2, population: yScale2(i * 3) }) });
              _.times(blockData.length, function (i) {rows.push(i * 3)});


              var peopleInOneRow = worldPopulation / blockData.length;


              var yScale = d3.scale.quantize()
                .domain([0, populationTopLimit])
                .range(rows);
              var yAxisScale = d3.scale.linear()
                .domain([0, populationTopLimit])
                .range([0, navHeight]);

              var birthdayScale = d3.time.scale()
                .domain([new Date('1920-01-01'), new Date()])
                .range([0, navHeight]);
              var yAxis = d3.svg.axis()
                .scale(yAxisScale)
                .orient('right')
                .ticks(8)
                .tickFormat(function (d) { return formatBillions(d).replace('G', 'B');});

              var xCols = [];
              for (var i = 0; i < navWidth - 3; i++) {
                xCols.push(i)
              }
              var xScale = d3.scale.quantize()
                .domain([peopleInOneRow, 0 ])
                .range(xCols);
              d3.select('.y-axis')
                .call(yAxis)
                .selectAll('text').attr('dy', '-4px');

              var lastPopulationBlock = true;
              var blocksArea = d3.select('.blocks');
              blocksArea.selectAll('.block').remove()
              blocksArea.selectAll('.block')
                .data(blockData)
                .enter()
                .append('rect')
                .attr({
                  'data-population': function (d, i) {
                    return Math.floor(d.population)
                  },
                  'data-i': function (d, i) {
                    return i
                  },
                  class: function (d, i) {
                    var limit = '';
                    if (d.population > worldPopulation) {
                      limit = ' overlimit';
                      if (lastPopulationBlock) {
                        limit += ' first';
                        lastPopulationBlock = false;
                      }
                    }
                    return 'block' + limit
                  },
                  height: 2,
                  width: 0,
                  transform: function (d, i) {
                    return 'translate(' + [0, i * 3] + ')'
                  }
                })
                .transition()
                .duration(2000)
                .delay(function (d, i) {
                  return 2000 + i * 10
                })
                .attr({
                  width: navWidth - 2
                });
              blocksArea.select('.block.overlimit.first')
                .transition()
                .delay(5000)
                .duration(2000)
                .attr(
                {
                  width: function (d, i) {
                    return xScale(d.population - worldPopulation);
                  }
                });
              var celebsArea = d3.select('.celebs');
              celebsArea.selectAll('rect').remove()
              celebsArea.selectAll('rect')
                .data(celebs)
                .enter()
                .append('rect')
                .attr({
                  'data-id': function (d, i) {return d.id},
                  opacity: 0,
                  height: 2,
                  width: 1,
                  x: function (d, i) {
                    return d.x = xScale(peopleInOneRow - rankScale(new Date(d.birthday)) % peopleInOneRow)
                  },
                  y: function (d, i) {
                    return d.y = yScale(rankScale(new Date(d.birthday)))
                  }
                });
              celebsArea.selectAll('rect')
                .transition()
                .delay(function (d, i) {
                  return 4000 + _.random(100, 1000)
                })
                .duration(function (d, i) {
                  return  _.random(300, 2000)
                })
                .attr({
                  opacity: 1
                });
              d3.select('circle.person.me').remove()
              var personNavPointer =
                celebsArea
                  .append('circle')
                  .attr({
                    'class': function () {
                      return 'person me ' + ProfileService.gender;
                    },
                    r: 0,
                    cx: function (d, i) {
                      return xScale(peopleInOneRow - rankScale(new Date(ProfileService.birthday)) % peopleInOneRow)
                    },
                    cy: yScale(rankScale(new Date(ProfileService.birthday)))
                  });
              personNavPointer
                .transition()
                .delay(4000)
                .attr({
                  r: 3
                });

              lens.attr(
                {
                  transform: function () {
                    var x = personNavPointer.attr('cx') - lensWidth / 2 + 2
                    var y = personNavPointer.attr('cy') - lensHeight / 2 + 2
                    if (x - lensWidth / 2 + 2 < 0) { x = 0 }
                    else if (x > navWidth - lensWidth) {x = navWidth - lensWidth;}
                    if (y - lensHeight / 2 + 2 < 0) {
                      y = 0
                    }

                    return canvas.utils.translate(x, y)
                  }}
              );
              var gridArea = d3.select('.grid');
              gridArea.selectAll('.grid-celeb').remove()
              var person = gridArea.selectAll('.grid-celeb')
                .data(celebs)
                .enter()
                .append('g')
                .attr({
                  class: 'grid-celeb',
                  'data-id': function (d, i) {return d.id},
                  opacity: 1,
                  x: function (d, i) {
                    return d.x = xScale(peopleInOneRow - rankScale(new Date(d.birthday)) % peopleInOneRow) * 30
                  },
                  y: function (d, i) {
                    return d.y = (yScale(rankScale(new Date(d.birthday))) * 50) / 3
                  },
                  transform: function (d, i) {return canvas.utils.translate(d.x, d.y)}

                })
                .classed('me', function (d, i) {
                  return d.name == 'You'
                });
              person.append('rect')
                .attr({
                  width: personWidth,
                  height: personHeight,
                  class: 'background-area'

                })
                .style('fill', 'white');

              var icon = person.append('g')
                .attr({
                  class: 'icon',
                  transform: canvas.utils.translate(7.5, 10)
                });

              icon.each(function (d, x) {
                var iconElement = d3.select(this);
                if (!d.gender || d.gender == 'male') {
                  iconElement.append('path').attr('d', 'M7.5,5.809c-0.869,0-1.576-0.742-1.576-1.654c0-0.912,0.707-1.653,1.576-1.653 c0.87,0,1.577,0.742,1.577,1.653C9.077,5.067,8.369,5.809,7.5,5.809z');
                  iconElement.append('path').attr('d', 'M11.997,16.187c0,0.522-0.405,0.946-0.903,0.946h-0.453V9.59H9.75v16.96c0,0.522-0.405,0.946-0.903,0.946 c-0.493,0-0.895-0.416-0.903-0.931c0-0.005,0-0.01,0-0.015c0-0.004,0-0.009,0-0.012V16.187H7.054v10.364c0,0.006,0,0.01,0,0.015 c-0.007,0.515-0.41,0.931-0.903,0.931c-0.498,0-0.902-0.424-0.902-0.946V9.59H4.358v7.542H3.905c-0.498,0-0.902-0.424-0.902-0.946 V9.119c0-1.301,1.009-2.36,2.25-2.36h4.493c1.241,0,2.251,1.058,2.251,2.36L11.997,16.187L11.997,16.187z');
                }
                else {
                  iconElement.append('path').attr('d', 'M7.025,20.425v6.123c0,0.005,0,0.01,0,0.015c-0.008,0.515-0.437,0.931-0.964,0.931 c-0.531,0-0.963-0.424-0.963-0.946v-6.123c0-0.001,0-0.002,0-0.004h1.927C7.025,20.422,7.025,20.423,7.025,20.425z');
                  iconElement.append('path').attr('d', 'M9.903,20.425v6.123c0,0.522-0.432,0.946-0.964,0.946c-0.526,0-0.955-0.416-0.963-0.931 c0-0.005,0-0.009,0-0.015c0-0.004,0-0.008,0-0.012v-6.111c0-0.001,0-0.002,0-0.004h1.927C9.903,20.422,9.903,20.423,9.903,20.425z');
                  iconElement.append('path').attr('d', 'M11.777,16.874l-1.792-7.39L9.059,9.7l2.374,9.787H3.542L5.916,9.7L4.99,9.484l-1.79,7.384l-0.472-0.111 c-0.517-0.121-0.837-0.631-0.714-1.139l1.711-7.048c0,0,0,0,0.001-0.001c0.259-1.065,1.22-1.808,2.336-1.808h2.878 c1.117,0,2.078,0.744,2.337,1.809l0,0l1.711,7.046c0,0,0,0,0,0.001c0.123,0.508-0.197,1.019-0.714,1.139L11.777,16.874z');
                  iconElement.append('path').attr('d', 'M7.501,5.812c-0.928,0-1.683-0.741-1.683-1.653c0-0.911,0.755-1.653,1.683-1.653 c0.928,0,1.683,0.741,1.683,1.653C9.184,5.071,8.429,5.812,7.501,5.812z')
                }
              });

              var personItem = d3.select('.grid-celeb.me');
              var xy = canvas.utils.getXYFromTranslate(personItem.attr('transform'));
              gridArea
                .attr({transform: canvas.utils.translate(-xy[0] + gridWidth / 2, -xy[1] + gridHeight / 2)});


              person.on('mouseenter', showTooltip);
              person.on('mouseleave', hideTooltip);
              populateCelebsBar();
              toggleCelebInCelebsBar(personItem.datum().id)

            };
            return canvas;
          };


          var canvas = d3.peopleGrid.canvas();
          d3.select(element[0]).call(canvas);


          $scope.$watch(function () {
            return ProfileService.active;
          }, function (active) {
            if (active) {
              canvas.populate()

            }
          });
          $scope.$watch('rankLocal', function (rank) {
            if (rank) {
              canvas.updateLocalBar(rank, $scope.rankLocalTotal);
            }
          });
          $scope.$watch('rankGlobal', function (rank) {
            if (rank) {
              canvas.updateGlobalBar(rank, $scope.rankGlobalTotal);
              if (d3.select('.celeb-tooltip').classed('me')) {
                d3.select('.celeb-tooltip-rank').text(formatCommas(rank))
              }
            }
          });

        }
      };
    });

}());