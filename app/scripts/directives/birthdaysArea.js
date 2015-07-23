(function () {
  'use strict';

  angular.module('populationioApp')
  .directive('birthdaysArea', ['$filter', 'ProfileService',
  function ($filter, ProfileService) {
    return {
      restrict: 'E',
      scope: {
        continentsData: '=',
        currentContinent: '='
      },
      link: function ($scope, element) {
        
        var continentsPercentages, maxVal = "";

        $scope.$on('continentsDataLoaded', function () {
          drawPeople($scope.continentsData, $scope.currentContinent);
        });

        var drawPeople = function(continentsData, currentContinent){

          for (var property in continentsData) {
            if (continentsData.hasOwnProperty(property)) {
              continentsData[property];
              if(continentsData[property] > maxVal){
                maxVal = continentsData[property];
              }
            }
          }

          for (var property in continentsData) {
            if (continentsData.hasOwnProperty(property)) {
              continentsPercentages = (continentsData[property] / maxVal);

              angular.element(element[0]).append('<div class="'+property+'">'+ property +'</div>');
              var div = document.getElementsByClassName(property);
              var width = div[0].clientWidth;

              var pxVal = Math.floor((width * continentsPercentages) / 50);
              if (pxVal === 0) {
                pxVal = 0.5;
              }
              var relativeWidth = pxVal * 50;

              if(property == currentContinent){
                var isCurrent = 'isC';
              }
              var innerSpan = angular.element(div).append('<span class="birthdaybuddies '+isCurrent+'" style="width:'+relativeWidth+'px"></span>');

              if(property == currentContinent){
                var spanInner = document.getElementsByClassName(isCurrent);
                if (relativeWidth <= 25) {
                  var lastSpan = angular.element(spanInner).append('<span class="isCurrentWoman"></span>')
                } else {
                  var lastSpan = angular.element(spanInner).append('<span class="isCurrentMan"></span>')
                }

              }

            }

          }
        }

      }
    };
  }]);

}());
