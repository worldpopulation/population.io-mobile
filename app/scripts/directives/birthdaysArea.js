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

                var bPeople = $filter('number')(continentsData[property], 0);

                var div = document.getElementsByClassName(property);
                var html = document.getElementsByTagName('html');
                var width = (html[0].clientWidth - 80);
                var numP = Math.floor(18 * continentsPercentages);
                if (numP <= 1) {
                  numP = 2;
                }

                var widthP = Math.floor(width / 18);
                var heightP = 2 * widthP;

                var relativeWidth = widthP * numP;
                var rLeft = 5 + relativeWidth;

                if(property == currentContinent){
                  var isCurrent = 'isC';
                }else {
                  var isCurrent = 'nisC';
                }
                var innerSpan = angular.element(div).append('<span class="birthdaybuddies '+isCurrent+'" style="width:'+relativeWidth+'px; height:'+heightP+'px;"><span style="left:'+ rLeft +'px; line-height: '+heightP+'px;" class="bnumber">'+bPeople+'</span></span>');


                if(property == currentContinent){
                  var spanInner = document.getElementsByClassName(isCurrent);
                  if (numP % 2 == 0) {
                    var lastSpan = angular.element(spanInner).append('<span class="isCurrentMan" style="width:'+(2 * widthP)+'px; height:'+heightP+'px;"></span>')
                  } else {
                     var lastSpan = angular.element(spanInner).append('<span class="isCurrentWoman" style="width:'+(2 * widthP)+'px; height:'+heightP+'px;"></span>')
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
