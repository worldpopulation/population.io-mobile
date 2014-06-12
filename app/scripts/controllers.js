(function () {
  'use strict';

  angular.module('populationioApp')

    .controller('MainCtrl', function ($scope, $rootScope, $state, $location, $document, ProfileService, PopulationIOService) {

      $rootScope.$on('duScrollspy:becameActive', function ($event, $element) {
        //Automaticly update location
        var hash = $element.prop('id');
        if (hash) {
//          $location.hash(hash.substr(1)).replace();
          var path = $location.$$path;
          path = path.replace(/[^/]*$/g, '');
          console.log(path + hash)
//          $location.hash(hash).replace();
          $location.path(path + hash).replace();
          $rootScope.$apply();
        }
      });

//      $document.on('scroll', function() {
//        console.log('Document scrolled to ', $document.scrollLeft(), $document.scrollTop());
//        console.log($location.$$path)
//      });

      $scope.profile = ProfileService;
      $scope.shareUrl = $location.absUrl();

      $scope.$watch(function () {
        return $location.absUrl();
      }, function (url) {
        $scope.shareUrl = url;
      });

      $scope.worldPopulation = PopulationIOService.getWorldPopulation();
      setInterval(function () {
        // $scope.worldPopulation = PopulationIOService.getWorldPopulation();
        // $scope.$apply();
      }, 1000);

//      $rootScope.$on('$stateChangeStart', function (e, toState) {
//        $scope.state = toState.name;
//        if ($scope.state) {
//          setTimeout(function () {
//            $('html, body').animate({
//              scrollTop: $("#" + $scope.state).offset().top - 79
//            }, 1000);
//          }, 500);
//        }
//      });

      $scope.showHomepage = function () {
        $state.go('root');
      };

      $scope.share = function () {
        alert($scope.shareUrl);
      };
    })

    .controller('StatsCtrl', function ($scope, $filter, $location, $state, $rootScope, ProfileService, PopulationIOService) {

      $scope.$watch('goForm.$invalid', function (invalid) {
        if (invalid) {
          ProfileService.active = false;
        }
      });

      $scope.goGoGadget = function () {
        ProfileService.active = true;
        $scope.loading = true;
        setTimeout(function () {
          $scope.loading = false;
          $state.go('people', {
            year: $filter('date')(ProfileService.birthday, 'yyyy'),
            month: $filter('date')(ProfileService.birthday, 'MM'),
            day: $filter('date')(ProfileService.birthday, 'dd'),
            country: ProfileService.country
          });
        }, 1000);
      };

      $scope.$watch(function () {
        return ProfileService.loading;
      }, function (value) {
        $scope.loading = value;
      });

      $scope.countries = [];
      PopulationIOService.loadCountries(function (countries) {
        $scope.countries = countries;
      });
    })

    .controller('PeopleCtrl', function ($scope, $anchorScroll, $state, $filter, PopulationIOService, ProfileService, $rootScope, $interval) {

      $scope.$watch(function () {
        return ProfileService.active;
      }, function (active) {
        if (active) {
          _update();
        }
      });

      var _update = function () {
        PopulationIOService.loadWpRankToday({
          dob: ProfileService.birthday,
          sex: ProfileService.gender,
          country: ProfileService.country
        }, function (rank) {
          $scope.rankLocal = rank;
        });

        PopulationIOService.loadWpRankToday({
          dob: ProfileService.birthday,
          sex: ProfileService.gender,
          country: 'World'
        }, function (rank) {
          $scope.rankGlobal = rank;
        });
      };
    })

    .controller('StoryCtrl', function ($scope, $rootScope, $state, $filter, $sce, ProfileService, PopulationIOService) {

      var _getDateWithOffset = function (date, offset) {
        var year = parseInt($filter('date')(date, 'yyyy'), 0),
          month = $filter('date')(date, 'MM'),
          day = $filter('date')(date, 'dd');

        return new Date(parseInt(year + offset, 0), month, day);
      };

      $scope.year = $filter('date')(new Date(), 'yyyy');
      $scope.storyLineData = [];

      var _loadLifeExpectancyTotal = function (country) {
        PopulationIOService.loadLifeExpectancyTotal({
          sex: ProfileService.gender,
          country: country,
          dob: ProfileService.birthday
        }, function (remainingLife) {
          $scope.storyLineData.push({
            date: $filter('date')(_getDateWithOffset(Date.now(), remainingLife), 'yyyy-MM-dd'),
            year: $filter('date')(_getDateWithOffset(Date.now(), remainingLife), 'yyyy'),
            title: 'Life expectancy in ' + country
          });
        });
      };

      var _loadWpRankRanked = function (rank, atomicNumber, onSuccess) {
        PopulationIOService.loadWpRankRanked({
          dob: ProfileService.birthday,
          sex: ProfileService.gender,
          country: 'World',
          rank: rank
        }, function (date) {
          $scope.storyLineData.push({
            date: date,
            year: $filter('date')(date, 'yyyy'),
            title: atomicNumber + ' billion person'
          });
          if (onSuccess) {
            onSuccess(date);
          }
        });
      };

      $scope.highlightStoryLine = function (year) {
        $scope.selectedYear = year;
      };

      $scope.$watch(function () {
        return ProfileService.active;
      }, function (active) {
        if (active) {
          _update();
        }
      });

      var _update = function () {
        PopulationIOService.loadPopulation({
          year: $filter('date')(new Date(), 'yyyy'),
          country: ProfileService.country
        }, function (data) {
          $scope.localRankData = data;
        });

        PopulationIOService.loadPopulation({
          year: $filter('date')(new Date(), 'yyyy'),
          country: 'World'
        }, function (data) {
          $scope.globalRankData = data;
        });

        // TODO: refactor me, duplicate code, people controller
        PopulationIOService.loadWpRankToday({
          dob: ProfileService.birthday,
          sex: ProfileService.gender,
          country: ProfileService.country
        }, function (rank) {
          $scope.rankLocal = rank;
        });

        PopulationIOService.loadWpRankToday({
          dob: ProfileService.birthday,
          sex: ProfileService.gender,
          country: 'World'
        }, function (rank) {
          $scope.rankGlobal = rank;
        });

        _loadWpRankRanked(1000000000, '1th');
        _loadWpRankRanked(5000000000, '5th');
        _loadWpRankRanked(7000000000, '7th', function (date) {
          $scope.title = $sce.trustAsHtml([
            'Watch out on <span>',
              $filter('ordinal')($filter('date')(date, 'd')) + ' ',
              $filter('date')(date, 'MMM, yyyy') + '</span> becoming ',
            'the <span>7th Billion</span> person on earth!'
          ].join(''));
        });

        _loadLifeExpectancyTotal(ProfileService.country);
        _loadLifeExpectancyTotal('World');

        $scope.country = ProfileService.country;

        $scope.storyLineData = [
          {
            date: $filter('date')(Date.now(), 'yyyy-MM-dd'),
            year: $filter('date')(Date.now(), 'yyyy'),
            title: 'Now',
            now: true
          },
          {
            date: ProfileService.birthday,
            year: $filter('date')(new Date(ProfileService.birthday), 'yyyy'),
            title: 'Born',
            born: true
          },
          {
            date: _getDateWithOffset(new Date(ProfileService.birthday), 18),
            year: $filter('date')(_getDateWithOffset(new Date(ProfileService.birthday), 18), 'yyyy'),
            title: 'You turned 18!'
          }
        ];
      };
    })

    .controller('BirthdaysCtrl', function ($scope, $state, $filter, $rootScope, ProfileService) {

    })

    .controller('ExpectancyCtrl', function ($scope, $rootScope, $filter, ProfileService, PopulationIOService) {

      var date = $filter('date')(new Date(), 'yyyy-MM-dd');

      $scope.$watch(function () {
        return ProfileService.active;
      }, function (active) {
        if (active) {
          _update();
        }
      });

      var _update = function () {
        PopulationIOService.loadCountries(function (countries) {
          $scope.countries = countries;
        });

        $scope.selectedCountryRef = ProfileService.country;
      };

      $scope.$on('timesliderChanged', function (e, year) {
        date = $filter('date')(new Date(year, 1, 1), 'yyyy-MM-dd');
        if ($scope.selectedCountryRef) {
          _updateCountryRef(date);
        }
        if ($scope.selectedCountryRel) {
          _updateCountryRel(date);
        }
      });

      var _updateCountryRef = function (date) {
        PopulationIOService.loadLifeExpectancyRemaining({
          sex: ProfileService.gender,
          country: $scope.selectedCountryRef,
          date: date,
          age: ProfileService.getAge()
        }, function (remainingLife) {
          $scope.highlightCountryRef({
            country: $scope.selectedCountryRef,
            yearsLeft: remainingLife,
            lifeExpectancy: ProfileService.getAge() + remainingLife
          });
        });
      };

      var _updateCountryRel = function (date) {
        PopulationIOService.loadLifeExpectancyRemaining({
          sex: ProfileService.gender,
          country: $scope.selectedCountryRel,
          date: date,
          age: ProfileService.getAge()
        }, function (remainingLife) {
          $scope.highlightCountryRel({
            country: $scope.selectedCountryRel,
            yearsLeft: remainingLife,
            lifeExpectancy: ProfileService.getAge() + remainingLife
          });
        });
      };

      $scope.$watch('selectedCountryRef', function (country) {
        if (country) {
          _updateCountryRef(date);
        }
      });

      $scope.$watch('selectedCountryRel', function (country) {
        if (country) {
          _updateCountryRel(date);
        }
      });

    })
  ;
}());