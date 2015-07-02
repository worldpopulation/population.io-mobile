(function () {
    'use strict';

    angular.module('populationioApp')
      .directive('milestones', ['$rootScope',
          function ($rootScope) {
              return {
                  restrict: 'E',
                  scope: {
                      data: '=',
                      selectedYear: '=',
                      rankGlobal: "=",
                      rankGlobalTotal: "="
                  },
                  link: function ($scope, element) {

                    var svg,
                    parentWidth = element[0].clientWidth,
                    currentData, date, circle,line;


                    svg = d3.select(element[0])
                    .append('svg')
                    .attr('width', '100%')
                    .attr('height', '50px')
                    .attr('viewBox', '0 0 0 10 ')
                    .attr('preserveAspectRatio','xMinYMin meet')
                    .append('g')
                    .attr({
                      class: 'milestone-line'
                    });

                    line = svg.append('path')
                    .attr({
                      class: 'label-line'
                    })
                    .style({
                      stroke: '#333',
                      'stroke-width': 1
                    });




                  }
              }
            }]);

}());
