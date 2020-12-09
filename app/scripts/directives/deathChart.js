(function () {
  'use strict';

  angular.module('populationioApp')
  .directive('deathChart', ['$filter', 'PopulationIOService', 'HelloWords', '$timeout', 'ProfileService',
  function ($filter, PopulationIOService, HelloWords, $timeout, ProfileService) {
    var worldYearReceived = false;
    var countryYearReceived = false;
    var agenowReceived = false;
    var graphDrawed = false;
    var oldage, oldworld, oldcountry;

    var tryDrawGraph = function(scope, element) {
      if(worldYearReceived && countryYearReceived && agenowReceived){
        drawGraph(scope, element);
      }
    }

    var drawGraph = function(scope, element) {
      var width = '100%',
      height = '100%',
      svgWidth = 250,
      svgHeight = 200,
      startWorld = 1 / 100,
      now = scope.agenow / 100,
      endWorld =  scope.worldyearofdeath / 100,
      startCountry = 1 / 100,
      endCountry =  scope.countryyearofdeath / 100;

      if(scope.agenow == oldage && scope.worldyearofdeath == oldworld && scope.countryyearofdeath == oldcountry){
        return;
      }

      if(graphDrawed){
        document.getElementById('death-svg').remove();
      }

      endWorld = endWorld + now;
      endCountry = endCountry + now;

      var theta = function (r) {
        return 4 * Math.PI * r;
      };

      var pieces = d3.range(startWorld, endWorld + 0.001, (endWorld - startWorld) / 1000);

      var radius = d3.scale.linear()
      .domain([startWorld, endWorld])
      .range([35, 110]);

      var svg = d3.select(element[0]).append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "0 -20 270 230")
      .attr("id", "death-svg")
      .append("g")
      .attr("transform", "translate(" + (svgWidth / 2) + "," + (svgHeight / 2 + 8) + ")");

      var spiral = d3.svg.line.radial()
      .interpolate("linear")
      .angle(theta)
      .radius(radius);

      var path = svg.selectAll(".spiral")
      .data([pieces])
      .enter()
      .append("path")
      .attr("class", "spiral")
      .attr("d", spiral)
      .attr("transform", function (d) {
        return "rotate(180)"
      });

      var circle = svg.selectAll(".circle")
      .data([spiral])
      .enter()
      .append("circle").attr({
        r: 4,
        cy: -yValAtPoint(path),
        cx: -xValAtPoint(path)
      }).style({
        fill: '#666',
        stroke: '#fff',
        'stroke-width': '1px'
      });


      var pieces2 = d3.range(startCountry, endCountry + 0.001, (endCountry - startCountry) / 1000);


      var radius2 = d3.scale.linear()
      .domain([startCountry, endCountry])
      .range([20, 95]);

      var spiral2 = d3.svg.line.radial()
      .interpolate("linear")
      .angle(theta)
      .radius(radius2);


      var path2 = svg.selectAll(".spiral2")
      .data([pieces2])
      .enter()
      .append("path")
      .attr("class", "spiral2")
      .attr("d", spiral2)
      .attr("transform", function (d) {
        return "rotate(180)"
      });


      var circle2 = svg.selectAll(".circle2")
      .data([spiral2])
      .enter()
      .append("circle").attr({
        r: 4,
        cy: -yValAtPoint(path2),
        cx: -xValAtPoint(path2)
      }).style({
        fill: '#bdaee9',
        stroke: '#fff',
        'stroke-width': '1px'
      });

      var piecesNow = d3.range(startWorld, now + 0.001, (now - startWorld) / 1000);

      var radiusNow = d3.scale.linear()
      .domain([startWorld, endWorld])
      .range([27, 102]);

      var spiralNow = d3.svg.line.radial()
      .interpolate("linear")
      .angle(theta)
      .radius(radiusNow);

      var pathNow = svg.selectAll(".spiralNow")
      .data([piecesNow])
      .enter()
      .append("path")
      .attr("class", "spiralNow")
      .attr("d", spiralNow)
      .attr("transform", function (d) {
        return "rotate(0)"
      });

      var circleNow = svg.selectAll(".circleNow")
      .data([spiralNow])
      .enter()
      .append("circle").attr({
        r: 12,
        cy: -yValAtPoint(pathNow),
        cx: -xValAtPoint(pathNow)
      }).style({
        fill: '#333',
        stroke: '#fff',
        'stroke-width': '3px'
      });

      var piecesLabel = d3.range(startWorld, now + 0.001, (now - startWorld) / 1000);

      var radiusLabel = d3.scale.linear()
      .domain([startWorld, endWorld])
      .range([45, 120]);

      var spiralLabel = d3.svg.line.radial()
      .interpolate("linear")
      .angle(theta)
      .radius(radiusLabel);

      var pathLabel = svg.selectAll(".spiralLabel")
      .data([piecesNow])
      .enter()
      .append("path")
      .attr("class", "spiralLabel")
      .attr("d", spiralLabel)
      .attr("transform", function (d) {
        return "rotate(180)"
      });


      var label = svg.selectAll('text')
      .data([piecesLabel])
      .enter()
      .append('text')
      .text("now").attr({
        transform: "translate("+ (-xValAtPoint(pathLabel))+ ","+ (-yValAtPoint(pathLabel))+") rotate(330)"
      }).style({
        'font-size': '12px',
        'text-anchor': 'middle'
      });

      function xValAtPoint(path){
        var l = path.node().getTotalLength();
        var p = path.node().getPointAtLength(l);
        return p.x;
      }

      function yValAtPoint(path){
        var l = path.node().getTotalLength();
        var p = path.node().getPointAtLength(l);
        return p.y;
      }

      graphDrawed = true;
      oldage = scope.agenow;
      oldworld = scope.worldyearofdeath;
      oldcountry = scope.countryyearofdeath;

    }

    return {
      restrict: 'E',
      scope: {
        worldyearofdeath: '=',
        countryyearofdeath: '=',
        agenow: '='
      },
      link: function ($scope, element) {
        $scope.$watch('worldyearofdeath', function(newVal){
          if(newVal)
            worldYearReceived = true;
            tryDrawGraph($scope, element);
        });

        $scope.$watch('countryyearofdeath', function(newVal){
          if(newVal)
            countryYearReceived = true;
            tryDrawGraph($scope, element);
        });

        $scope.$watch('agenow', function(newVal){
          if(newVal)
            agenowReceived = true;
            tryDrawGraph($scope, element);
        });
      }
    }
  }]);
})();
