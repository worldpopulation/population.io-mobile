(function () {
  'use strict';

  angular.module('populationioApp')
  .directive('birthdaysChart', ['$filter', 'ProfileService',
  function ($filter, ProfileService) {
    return {
      restrict: 'E',
      scope: {
        continentsData: '=',
        worldData: '='
      },
      link: function ($scope, element) {


        $scope.$on('continentsDataLoaded', function () {
          _buildContinentsChart($scope.continentsData);
        });
        $scope.$on('worldDataLoaded', function () {
          _buildWorldChart($scope.worldData);
        });

         function _buildContinentsChart(continentsData){
        
         }

         function _buildWorldChart(worldData){

         }


      }
    };
  }]);

}());
