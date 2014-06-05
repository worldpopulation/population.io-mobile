(function () {
  'use strict';

  angular.module('populationioApp')

  .controller('MainCtrl', function ($scope, $rootScope) {
    $scope.showNextPage = function () {
      if ($rootScope.currentPage < 5) {
        $rootScope.currentPage += 1;
      }
    };

  })

  .controller('StatsCtrl', function ($scope, $rootScope) {
    // TODO: StatsCtrl
  })

  .controller('PeopleCtrl', function ($scope, $rootScope, PopulationIOService, $interval) {

    $scope.rank = PopulationIOService.getRank();

  })

  .controller('StoryCtrl', function ($scope, $rootScope, $filter, StoryService) {

    $scope.timeline = StoryService.getData();
    $scope.year = parseInt($filter('date')(new Date(), 'yyyy'), 0);

    $scope.$on('highlightStoryLine', function(e, year, highlight) {
      $scope.selectedYear = highlight ? year : null;
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    });

  })

  .controller('PositionCtrl', function ($scope, $rootScope) {
    // TODO: PositionCtrl
  })

  .controller('ExpectancyCtrl', function ($scope, $rootScope) {
    // TODO: ExpectancyCtrl
  })

  .controller('ShareCtrl', function ($scope, $rootScope) {
    // TODO: ShareCtrl
  })
  ;
}());