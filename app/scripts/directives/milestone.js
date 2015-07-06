(function () {
  'use strict';

  angular.module('populationioApp')
  .directive('milestone', ['$rootScope',
  function ($rootScope) {
    return {
      restrict: 'E',
      scope: {
        date: '=',
        year: '=',
        value: '=',
        title: '='
      },
      link: function ($scope, element, attrs) {

      function radialProgress(parent) {
          var _data=null,
              vBoxWidth = 350,
              vBoxHeight = 150,
              _duration= 1000,
              _selection,
              _margin = {top:0, right:0, bottom:30, left:0},
              _width = 300,
              _height = 300,
              _diameter,
              _label="",
              svgWidth='100%',
              svgHeight='100%',
              _date="",
              _year="",
              _fontSize=10;

          var _value= 0,
              _minValue = 0,
              _maxValue = 100;

          var  _currentArc= 0, _currentArc2= 0, _currentValue=0;

          var _arc = d3.svg.arc()
              .startAngle(0 * (Math.PI/180)); //just radians

          var _arc2 = d3.svg.arc()
              .startAngle(0 * (Math.PI/180))
              .endAngle(0); //just radians


          _selection=d3.select(parent);


          function component() {

              _selection.each(function (data) {

                  // Select the svg element, if it exists.
                  var svg = d3.select(this).selectAll("svg").data([data]);

                  var enter = svg.enter().append("svg").attr("class","radial-svg").append("g");

                  measure();

                  svg
                  .attr('viewBox', '0 0 '+ vBoxWidth +' '+ vBoxHeight +' ')
                  .attr('preserveAspectRatio','xMinYMin meet')
                  .attr("width", svgWidth)
                  .attr("height", svgHeight);


                  var background = enter.append("g").attr("class","component")
                      .attr("cursor","pointer");


                  _arc.endAngle(360 * (Math.PI/180))

                  background.append("rect")
                      .attr("class","background")
                      .attr("width", _width)
                      .attr("height", _height);

                  background.append("path")
                      .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                      .attr("d", _arc);

                  background.append("text")
                      .attr("class", "label")
                      .attr("transform", "translate(" + _width/2 + "," + (_width + _fontSize) + ")")
                      .text(_label);
                 var g = svg.select("g")
                      .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");


                  _arc.endAngle(_currentArc);
                  enter.append("g").attr("class", "arcs");
                  var path = svg.select(".arcs").selectAll(".arc").data(data);
                  path.enter().append("path")
                      .attr("class","arc")
                      .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                      .attr("d", _arc);

                  //Another path in case we exceed 100%
                  var path2 = svg.select(".arcs").selectAll(".arc2").data(data);
                  path2.enter().append("path")
                      .attr("class","arc2")
                      .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                      .attr("d", _arc2);


                  enter.append("g").attr("class", "labels");
                  var label = svg.select(".labels").selectAll(".label").data(data);
                  label.enter().append("text")
                      .attr("class","label central")
                      .attr("y",_width/2+_fontSize/3-13)
                      .attr("x",_width/2)
                      .attr("cursor","pointer")
                      .attr("width",_width)
                      .text(_year)
                      .style("font-size",_fontSize+"px");
                    label.enter().append("text")
                      .attr("class","label central")
                      .attr("y",_width/2+_fontSize/3+10)
                      .attr("x",_width/2)
                      .attr("cursor","pointer")
                      .attr("width",_width)
                      // .attr("x",(3*_fontSize/2))
                      .text(_date)
                      .style("font-size",_fontSize+"px");

                  path.exit().transition().duration(500).attr("x",1000).remove();


                  layout(svg);

                  function layout(svg) {

                      var ratio=(_value-_minValue)/(_maxValue-_minValue);
                      var endAngle=Math.min(360*ratio,360);
                      endAngle=endAngle * Math.PI/180;

                      path.datum(endAngle);
                      path.transition().duration(_duration)
                          .attrTween("d", arcTween);

                      if (ratio > 1) {
                          path2.datum(Math.min(360*(ratio-1),360) * Math.PI/180);
                          path2.transition().delay(_duration).duration(_duration)
                              .attrTween("d", arcTween2);
                      }

                      label.datum(Math.round(ratio*100));
                  }

              });
          }

          function labelTween(a) {
              var i = d3.interpolate(_currentValue, a);
              _currentValue = i(0);

              return function(t) {
                  _currentValue = i(t);
                  this.textContent = Math.round(i(t)) + "%";
              }
          }

          function arcTween(a) {
              var i = d3.interpolate(_currentArc, a);

              return function(t) {
                  _currentArc=i(t);
                  return _arc.endAngle(i(t))();
              };
          }

          function arcTween2(a) {
              var i = d3.interpolate(_currentArc2, a);

              return function(t) {
                  return _arc2.endAngle(i(t))();
              };
          }


          function measure() {
              _width=_diameter - _margin.right - _margin.left - _margin.top - _margin.bottom;
              _height=_width;
              _fontSize=(_width*.2 - 4);
              _arc.outerRadius(_width/2);
              _arc.innerRadius(_width/2 * .98);
              _arc2.outerRadius(_width/2 * .97);
              _arc2.innerRadius(_width/2 * .97 - (_width/2 * .03));

          }


          component.render = function() {
              measure();
              component();
              return component;
          }

          component.value = function (_) {
              if (!arguments.length) return _value;
              _value = [_];
              _selection.datum([_value]);
              return component;
          }


          component.margin = function(_) {
              if (!arguments.length) return _margin;
              _margin = _;
              return component;
          };

          component.diameter = function(_) {
              if (!arguments.length) return _diameter
              _diameter =  _;
              return component;
          };

          component.minValue = function(_) {
              if (!arguments.length) return _minValue;
              _minValue = _;
              return component;
          };

          component.maxValue = function(_) {
              if (!arguments.length) return _maxValue;
              _maxValue = _;
              return component;
          };

          component.label = function(_) {
              if (!arguments.length) return _label;
              _label = _;
              return component;
          };

          component.date = function(_) {
              if (!arguments.length) return _date;
              _date = _;
              return component;
          };

          component.year = function(_) {
            if (!arguments.length) return _year;
            _year = _;
            return component;
          }

          component._duration = function(_) {
              if (!arguments.length) return _duration;
              _duration = _;
              return component;
          };

          return component;

      }

        var milestone = d3.select(element[0]);

        function labelFunction(val,min,max) {

        }

      function _initArc() {

            var rp1 = radialProgress(element[0])
                    .label($scope.title)
                    .date($scope.date)
                    .year($scope.year)
                    .diameter(150)
                    .value(100)
                    .render();

        }

      _initArc();


      function _updateArc(){
        console.log('update arc');
      }

      _updateArc();

      }
    }
  }]);

}());
