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
      }, 1000);
    };

    if ($scope.forceUrl) {
      $scope.forceUrl = false;
      return;
    }

    if ($stateParams.state) {
      if (ProfileService.active) {
        $.fn.fullpage.moveTo($stateParams.state);
      } else {
        _getDataFromAPI(function() {
          $.fn.fullpage.moveTo($stateParams.state);
        });
      }
    } else {
      $.fn.fullpage.moveTo('stats');
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
          state: 'story'
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

    PopulationIOService.loadCountries(function(countries) {
      $scope.countries = countries;
    });
  })

  .controller('PeopleCtrl', function ($scope, PopulationIOService, ProfileService, $rootScope, $interval) {

    PopulationIOService.loadWpRankToday({
      dob: ProfileService.birthday,
      sex: ProfileService.gender,
      country: ProfileService.country
    }, function(rank) {
      $scope.rankLocal = rank;
    });

    PopulationIOService.loadWpRankToday({
      dob: ProfileService.birthday,
      sex: ProfileService.gender,
      country: 'World'
    }, function(rank) {
      $scope.rankGlobal = rank;
    });

  })

  .controller('StoryCtrl', function ($scope, $rootScope, $filter, ProfileService, PopulationIOService) {

    // //$scope.timeline = StoryService.getData();
    // for (var i=0; i<$scope.timeline.length; i+=1) {
    //   $scope.timeline[i].year = parseInt($filter('date')($scope.timeline[i].tstamp, 'yyyy'));
    // }

    $scope.year = $filter('date')(new Date(), 'yyyy');

    $scope.$on('highlightStoryLine', function(e, year, highlight) {
      $scope.selectedYear = highlight ? year : null;
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    });

    PopulationIOService.loadPopulation({
      year: $filter('date')(new Date(), 'yyyy'),
      country: ProfileService.country
    }, function(data) {
      $scope.localRankData = data;
    });

    PopulationIOService.loadPopulation({
      year: $filter('date')(new Date(), 'yyyy'),
      country: 'World'
    }, function(data) {
      $scope.globalRankData = data;
    });

    // TODO: refactor me, duplicate code, people controller
    PopulationIOService.loadWpRankToday({
      dob: ProfileService.birthday,
      sex: ProfileService.gender,
      country: ProfileService.country
    }, function(rank) {
      $scope.rankLocal = rank;
    });

    PopulationIOService.loadWpRankToday({
      dob: ProfileService.birthday,
      sex: ProfileService.gender,
      country: 'World'
    }, function(rank) {
      $scope.rankGlobal = rank;
    });

    $scope.country = ProfileService.country;
  })

  .controller('BirthdaysCtrl', function ($scope, $rootScope) {
    // TODO: BirthdaysCtrl
  })

  .controller('ExpectancyCtrl', function ($scope, $rootScope, $filter, ProfileService, PopulationIOService) {

    PopulationIOService.loadCountries(function(countries) {
      $scope.countries = countries;
    });

    $scope.selectedCountryRef = ProfileService.country;
    $scope.$watch(function() {
      return ProfileService.country;
    }, function() {
      $scope.selectedCountryRef = ProfileService.country;
    });

    var date = $filter('date')(new Date(), 'yyyy-MM-dd');

    $scope.$on('timesliderChanged', function(e, year) {
      date = $filter('date')(new Date(year, 1, 1), 'yyyy-MM-dd');
      if ($scope.selectedCountryRef) {
        _updateCountryRef(date);
      }
      if ($scope.selectedCountryRel) {
        _updateCountryRel(date);
      }
    });

    var _updateCountryRef = function(date) {
      PopulationIOService.loadLifeExpectancyRemaining({
        sex: ProfileService.gender,
        country: $scope.selectedCountryRef,
        date: date,
        age: ProfileService.getAge()
      },function(remainingLife) {
        $scope.highlightCountryRef({
          country: $scope.selectedCountryRef,
          yearsLeft: remainingLife,
          lifeExpectancy: ProfileService.getAge() + remainingLife
        });
      });
    };

    var _updateCountryRel = function(date) {
      PopulationIOService.loadLifeExpectancyRemaining({
        sex: ProfileService.gender,
        country: $scope.selectedCountryRel,
        date: date,
        age: ProfileService.getAge()
      },function(remainingLife) {
        $scope.highlightCountryRel({
          country: $scope.selectedCountryRel,
          yearsLeft: remainingLife,
          lifeExpectancy: ProfileService.getAge() + remainingLife
        });
      });
    };

    $scope.$watch('selectedCountryRef', function(country) {
      if (country) {
        _updateCountryRef(date);
      }
    });

    $scope.$watch('selectedCountryRel', function(country) {
      if (country) {
        _updateCountryRel(date);
      }
    });

  })
  ;
}());