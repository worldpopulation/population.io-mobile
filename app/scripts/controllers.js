(function () {
  'use strict';

  angular.module('populationioApp')

  .controller('StateCtrl', function ($scope, $filter, $rootScope, $state, $stateParams, ProfileService) {

    var _getDataFromAPI = function(onSuccess) {
      ProfileService.loading = true;
      setTimeout(function() {
        ProfileService.active = true;
        ProfileService.loading = false;
        onSuccess();
      }, 3000);
    };

    if ($stateParams.state) {
      if (ProfileService.active) {
        $scope.$emit('pageChanged', $stateParams.state);
      } else {
        _getDataFromAPI(function() {
          $scope.$emit('pageChanged', $stateParams.state);
        });
      }
    } else {
      $scope.$emit('pageChanged', 'stats');
    }

    $rootScope.$on('profileChanged', function() {
      _getDataFromAPI(function() {
        // TODO: refactor me, duplicate code in directive
        var birthday = ProfileService.birthday;
        $state.go('section', {
          year: $filter('date')(birthday, 'yyyy'),
          month: $filter('date')(birthday, 'MM'),
          day: $filter('date')(birthday, 'dd'),
          country: ProfileService.country,
          state: 'people'
        });
      });
    });

  })

  .controller('MainCtrl', function ($scope, $rootScope, $state, $location, ProfileService, PopulationIOService) {

    $scope.profile = ProfileService;
    $scope.worldPopulation = PopulationIOService.getWorldPopulation();
    $scope.shareUrl = $location.absUrl();

    $scope.$watch(function() {
      return $location.absUrl();
    }, function(url) {
      $scope.shareUrl = url;
    });

    $rootScope.$on('populationChanged', function() {
      $scope.worldPopulation = PopulationIOService.getWorldPopulation();
      $scope.$apply();
    });

    $scope.showHomepage = function() {
      $state.go('root');
    };
  })

  .controller('StatsCtrl', function ($scope, $filter, $location, $state, $rootScope, ProfileService, PopulationIOService) {

    $scope.$watch('goForm.$invalid', function(invalid) {
      if (invalid) {
        ProfileService.active = false;
      }
    });

    $scope.goGoGadget = function() {
      $rootScope.$emit('profileChanged');
    };

    $scope.$watch(function() {
      return ProfileService.loading;
    }, function(value) {
      $scope.loading = value;
    });

    $scope.countries = PopulationIOService.getCountries();

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

    $scope.countryLocal = 'Germany';
    $scope.rankGlobal = 5022232119;
    $scope.rankLocal = 8372629001;
  })

  .controller('BirthdaysCtrl', function ($scope, $rootScope) {
    // TODO: BirthdaysCtrl
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
      if (country instanceof Object) {
        $scope.highlightCountryRef(country.id || country.originalObject.id, {
          country: country.name || country.originalObject.name,
          yearsLeft: _getTestValue(),
          lifeExpectancy: _getTestValue()
        });
      }
    });

    $scope.$watch('selectedCountryRel', function(country) {
      if (country instanceof Object) {
        $scope.highlightCountryRel(country.id || country.originalObject.id, {
          country: country.name || country.originalObject.name,
          yearsLeft: _getTestValue(),
          lifeExpectancy: _getTestValue()
        });
      }
    });

  })
  ;
}());