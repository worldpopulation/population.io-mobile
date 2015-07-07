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
        values: '='
      },
      link: function ($scope, element, attrs) {



        function radialProgress(parent) {
          var _data=null,
          vBoxWidth = 350,
          vBoxHeight = 130,
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
          i,
          _fontSize=10;

          var _values= [0,25,50,80,90,100];

          var  _currentArc= 0,  _currentValue=0;

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
              .attr('viewBox', '-5 -10 '+ vBoxWidth +' '+ vBoxHeight +' ')
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

              _arc.endAngle(_currentArc);
              enter.append("g").attr("class", "arcs");
              var path = svg.select(".arcs").selectAll(".arc").data(data);
              path.enter().append("path")
              .attr("class","arc")
              .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
              .attr("d", _arc);



              var arcenter = enter.append("g").attr("class", "circles");
              var arcradius = _width/2 ;
              var circleradius = 4;


              for (var i = 0; i < _values.length; i++) {

                var cy = _values[i] + 1.5 ;
                var cx = _width/2 - _values[i]* 0.98 ;

                arcenter.append('circle')
                .attr({
                  r: circleradius,
                  cy: cy,
                  cx: cx
                }).style({
                  fill: 'black'
                });

              }

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
                i = 0;
                _values.forEach(function(val){
                  var endAngle = (val * 360);
                  endAngle=endAngle * Math.PI/180;
                  path.datum(endAngle).append('circle').attr({r: 4});
                  path.transition().duration(_duration)
                  .attrTween("d", arcTween);
                });

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

          function measure() {
            _width=_diameter - _margin.right - _margin.left - _margin.top - _margin.bottom;
            _height=_width;
            _fontSize=(_width*.2 - 4);
            _arc.outerRadius(_width/2);
            _arc.innerRadius(_width/2 * .98);
          }

          component.render = function() {
            measure();
            component();
            return component;
          }

          component.values = function (_) {
            if (!arguments.length) return _values;
            _values = [0,25,50,80,90,100];
            _selection.datum([_values]);
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
          .date($scope.date)
          .year($scope.year)
          .values([0,25,50,80,90,100])
          .diameter(150)
          .render();

        }

        _initArc();

      }
    }
  }]);

}());
