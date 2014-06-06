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
    for (var i=0; i<$scope.timeline.length; i+=1) {
      $scope.timeline[i].year = parseInt($filter('date')($scope.timeline[i].tstamp, 'yyyy'));
    }

    $scope.year = $filter('date')(new Date(), 'yyyy');

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

    d3.json('scripts/world-topo-min.json', function(error, world) {
      $scope.countries = [];
      for (var i=0; i<world.objects.countries.geometries.length; i+=1) {
        var country = world.objects.countries.geometries[i];
        $scope.countries.push({
          id: country.id,
          name: country.properties.name
        });
      }
    });

    var _getTestValue = function() {
      return Math.round((50 * Math.random() + Math.random()) * 100) / 10;
    };

    $scope.$watch('selectedCountryRef', function(country) {
      if (country) {
        $scope.highlightCountryRef(country.id || country.originalObject.id, {
          country: country.name || country.originalObject.name,
          yearsLeft: _getTestValue(),
          lifeExpectancy: _getTestValue()
        });
      }
    });
    $scope.$watch('selectedCountryRel', function(country) {
      if (country) {
        $scope.highlightCountryRel(country.id || country.originalObject.id, {
          country: country.name || country.originalObject.name,
          yearsLeft: _getTestValue(),
          lifeExpectancy: _getTestValue()
        });
      }
    });
  })

  .controller('ShareCtrl', function ($scope, $rootScope) {
    // TODO: ShareCtrl
  })
  ;
}());