(function () {
  'use strict';

  angular.module('populationioApp')
  .directive('birthdaysArea', ['$filter','$window', 'ProfileService',
  function ($filter, ProfileService, $window) {
    return {
      restrict: 'E',
      scope: {
        continentsData: '=',
        currentContinent: '=',
        cI: '='
      },
      link: function ($scope, element) {

        var continentsPercentages, maxVal = "", humansDrawen = false;

        $scope.$on('continentsDataLoaded', function () {
          if($scope.continentsData){
            maxVal = maxValFn($scope.continentsData);
            if(maxVal != 0){
              drawPeople($scope.continentsData, $scope.currentContinent, maxVal)
            }
          }
        });

        var maxValFn = function(continentsData){
          for (var property in continentsData) {
            if (continentsData.hasOwnProperty(property)) {
              continentsData[property];
              if(continentsData[property] > maxVal){
                maxVal = continentsData[property];
              }
            }
          }
          return maxVal;
        }

        var drawPeople = function(continentsData, currentContinent, max){

          if (humansDrawen) {
            var oldSpans = document.getElementsByClassName('birthdaybuddies');
            for (var i = oldSpans.length -1; 0 <= i; i--) {
              oldSpans[i].remove();
            }
          }

          for (var property in continentsData) {

            if (continentsData.hasOwnProperty(property)) {

              if (property != 'Antarctica') {
                if (!humansDrawen) {
                  angular.element(element[0]).append('<div class="'+property+' ">'+ property +'</div>');
                }

                continentsPercentages = (continentsData[property] / max);


                var div = document.getElementsByClassName(property);
                var html = document.getElementsByTagName('html');
                var width = (html[0].clientWidth - 30);

                var pxVal = Math.floor((width * continentsPercentages) / 15);

                var relativeWidth = pxVal * 15;

                if (relativeWidth <= 24) {
                  relativeWidth = 29;
                }

                if(property == currentContinent){
                  var isCurrent = 'isC';
                }else {
                  var isCurrent = 'nisC';
                }
                var innerSpan = angular.element(div).append('<span class="birthdaybuddies '+isCurrent+'" style="width:'+relativeWidth+'px"></span>');

                if(property == currentContinent){
                  var spanInner = document.getElementsByClassName(isCurrent);
                  if (relativeWidth < 30) {
                    var lastSpan = angular.element(spanInner).append('<span class="isCurrentMan"></span>')
                  } else {
                    var lastSpan = angular.element(spanInner).append('<span class="isCurrentMan"></span>')
                  }

                }

              }

            }

          }

          humansDrawen = true;

        }
      }
    };
  }]);

}());
