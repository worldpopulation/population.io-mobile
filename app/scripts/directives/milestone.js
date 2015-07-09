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

        function _initArc() {

          if (typeof(Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function() {
              return this * Math.PI / 180;
            }
          }
           var maxVal = "";

          var dataSet = [{
            values: $scope.values,
            maxValue: function() {

              console.log($scope.values);

              this.values.forEach(function(value) {
                if(value > maxVal){
                maxVal = value;
                }
              });
              return maxVal;
            }
          }]

          var width = 110,
              height = 110,
              innerRadius = 98,
              outerRadius = 100;

          var drawArc = d3.svg.arc()
          .innerRadius(innerRadius/2)
          .outerRadius(outerRadius/2)
          .startAngle(0);

          var s = d3.select(element[0])
          .data(dataSet)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', '0 0 110 110')
          .append('g')
          .attr("transform", "translate(" + width/2  + "," + height/2  + ")");

          s.append('text')
          .text($scope.year)
          .attr({
            class: 'time',
            'text-anchor':'middle',
            y: -5
          });

          s.append('text')
          .text($scope.date)
          .attr({
            class: 'time',
            'text-anchor':'middle',
            y: 12
          });

          //creaeting arc path
          var arc = s.append("path")
          .attr("fill", "Black")
          .attr('class', 'arc')
          .each(function(d) {
            d.endAngle = 360*( d['maxValue']()/100) * Math.PI/180;
            d['values'].forEach(function(v){
              //calculate
              v = v / 100 * 360;

              var x = Math.sin(v.toRad()) * (outerRadius / 2);
              var y = - Math.cos(v.toRad()) * (outerRadius / 2);

              s.append('circle')
              .attr('r', 3)
              .attr('cx', x)
              .attr('cy', y)
              .style({
                'stroke-width': '1.5px'
              });
            }.bind(this));
          })
          .attr('d', drawArc);

        }
        _initArc();
      }
    }

  }]);

}());
