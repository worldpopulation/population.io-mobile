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
      return Math.round((50 * Math.random() + Math.random()) * 100) / 100;
    };

    $scope.$watch('selectedCountryRef', function(country) {
      if (country) {
        $scope.highlightCountryRef(country.originalObject.id, country.originalObject.name, _getTestValue());
      }
    });
    $scope.$watch('selectedCountryRel', function(country) {
      if (country) {
        $scope.highlightCountryRel(country.originalObject.id, country.originalObject.name, _getTestValue());
      }
    });
  })

  .controller('ShareCtrl', function ($scope, $rootScope) {
    // TODO: ShareCtrl
  })
  ;
}());