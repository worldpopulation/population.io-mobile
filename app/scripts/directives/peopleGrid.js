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
            height = element.parent().height(),
            populationScale = 1000000000 * 0.68,
            gridRows = 10,
            gridCols = 25;

          var root = d3.select(element[0])
            .append('svg')
            .attr({width: width, height: height})
            .append('g')
            .attr({transform: 'translate(0,0)'});

          var grid = root.append('g')
            .attr({
              transform: 'translate(0, 100)',
              'class': 'grid'
            });

          var _buildBarChart = function() {
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
                'class': 'highlight',
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
                'class': 'highlight',
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

          var _buildNavigator = function() {
            var nav = root.append('g')
              .attr('class', 'navigator');

            var blockSize = 2;
            var navWidth = 180;
            var navHeight = 400;
            var lensWidth = (gridCols*blockSize)-1;
            var lensHeight = gridRows*(blockSize+1);
            var maxHuman = PeopleGridService.getWorldPopulation()/populationScale;
            blocksPerRow = parseInt(navWidth / blockSize - 1, 0);
            var blockData = [];

            for(var i=0; i<maxHuman; i+=1) {
              blockData.push(i);
            }

            var bisect = d3.bisector(function(d) { return d; }).left,
                meBlockIdx = bisect(blockData, PopulationIOService.getRank()/populationScale);

            nav.append('rect')
              .attr({
                'class': 'frame',
                height: navHeight,
                width: navWidth
              });

            nav.append('text')
              .text('People Navigator (in billions)')
              .attr('class', 'title');

            var blocks = nav.append('g')
              .attr('class', 'blocks');

            blocks.selectAll('.block')
              .data(blockData)
              .enter()
              .append('rect')
              .attr({
                'class': function (d, i) {
                  var className = 'block';
                  if (i === meBlockIdx) {
                    className += ' me';
                  }
                  return className;
                },
                transform: function (d, i) {
                  return 'translate(' + [
                    parseInt(i % blocksPerRow, 0) * blockSize,
                    parseInt(i / blocksPerRow, 0) * (blockSize + 1)
                  ] + ')';
                },
                width: blockSize,
                height: blockSize,
                fill: function(d, i) {
                  if (i%10 === 0) {
                    return 'white';
                  }
                  else {
                    return 'white';
                  }
                }
              });

            var yAxis = nav.append('g')
              .attr('class', 'y-axis');

            for(var j=1; j<=7; j+=1) {
              yAxis.append('text')
                .text(j)
                .attr({
                  'transform': function() {
                    return 'translate(' + [10 +navWidth, ((navHeight-30)/7)*j] + ')';
                  }
                });
            }

            var drag = d3.behavior.drag()
              .on('drag', function() {
                var x = Math.max(0,
                  Math.min(navWidth - lensWidth, d3.event.x - lensWidth/2));
                var y = Math.max(30,
                  Math.min(navHeight - lensHeight, d3.event.y - lensHeight/2));

                this.x = x;
                this.y = y;

                d3.select(this).attr('transform', 'translate(' + [x, y] + ')');
              })
              .on('dragend', function() {
                _updateGrid((this.x+1)/blockSize, (this.y-30)/(blockSize+1));
              });


            var lens = nav.append('g')
              .attr({
                'class': 'lens',
                'transform': 'translate(100,200)'
              })
              .call(drag);

            lens.append('rect')
              .attr({
                width: lensWidth,
                height: lensHeight,
                rx: 2
              });
          };

          var _updateGrid = function(posX, posY) {

            var data = [];
            for(var j=posX; j<=posX+gridRows; j+=1) {
              for(var i=posY; i<=posY+gridCols; i+=1) {
                data.push({
                  rank: parseInt(i + (j*blocksPerRow))
                });
              }
            }

            var bisect = d3.bisector(function(d) { return d.rank; }).left,
                meBlock = bisect(data, PopulationIOService.getRank()/populationScale);
                console.log(meBlock, PopulationIOService.getRank()/populationScale)
            if (meBlock) {
              console.log(meBlock)
            }

            grid.selectAll('.person').remove();

            var _addPerson = function(x, y, data) {
              var person = grid.append('g')
                .attr({
                  'class': function () {
                    var className = 'person';
                    if (meBlock && data.rank === meBlock.rank) {
                      className += ' me';
                    }
                    return className;
                  },
                  transform: function () {
                    return 'translate(' + [x*personWidth, y*personHeight] + ')';
                  }
                })
                .on('mouseover', function () {
                  d3.select(this).classed('highlight', true);
                })
                .on('mouseout', function () {
                  d3.select(this).classed('highlight', false);
                });

                person.append('rect')
                  .attr({
                    width: personWidth,
                    height: personHeight
                  });

                person.append('text')
                  .text(function () { return data ? data.rank : ''; })
                  .attr({
                    fill: '#fff',
                    'text-anchor': 'middle',
                    transform: 'translate(' + [
                      personWidth / 2,
                      personHeight / 2 + 4
                    ] + ')'
                  });
            };

            var idx = 0;
            for(var y=0; y<gridRows; y+=1) {
              for(var x=0; x<gridCols; x+=1) {
                _addPerson(x, y, data[++idx]);
              }
            }
          };

          _buildBarChart();
          _buildNavigator();
          _updateGrid(20, 30);
        }
      };
    });

}());