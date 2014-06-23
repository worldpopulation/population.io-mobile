(function () {
  'use strict';

  angular.module('populationioApp')

    .controller('MainCtrl', function ($scope, $timeout, $http, $interval,
      $modal, $state, $location, $document, $rootScope,
      ProfileService, PopulationIOService, BrowserService) {

      if (BrowserService.isSupported()) {
        alert('This showcase is optimized for WebKit browsers (Safari, Chrome)!');
      }

      if (BrowserService.isTouchDevice()) {
        alert('The alpha version does not support touch devices, yet!');
      }

      $scope.profile = ProfileService;
      $scope.worldPopulation = PopulationIOService.getWorldPopulation();

      $timeout(function () {
        var path = $location.$$path.replace(/.+[/](.*)$/g, '$1'),
          section = angular.element(document.getElementById(path));

        if ($rootScope.currentPage > 1) {
          $document.scrollToElement(section, 80, 1000);
        }

        // TODO: check the url path for date and section
        if (path && !ProfileService.active) {
          var pathItems = $location.$$path.split('/'),
            year = pathItems[1],
            month = pathItems[2],
            day = pathItems[3],
            country = pathItems[4];

          ProfileService.birthday = [ year, month, day ].join('-');
          ProfileService.country = country;

          $rootScope.$emit('go', path);
        }
      }, 500);

      $interval(function () {
        $scope.worldPopulation = PopulationIOService.getWorldPopulation();
      }, 1000);

      $rootScope.$on('$stateChangeStart', function (e, toState) {
        $scope.state = toState.name;
      });

      $rootScope.$on('duScrollspy:becameActive', function ($event, $element) {
        var hash = $element.prop('id');
        if (hash) {
          if (hash.indexOf('stats') > -1) {
            $rootScope.currentPage = 0;
            return;
          } else {
            $rootScope.currentPage = $element.attr('data-index');
          }
          var path = $location.$$path.replace(/[^/]*$/g, '');
          $location.path(path + hash).replace();
          $rootScope.$apply();
        }
      });

      $scope.downloadICal = function () {
        alert('Feature coming soon!');
      };

      $scope.showSection = function (id) {
        var section = angular.element(document.getElementById(id));
        $document.scrollToElement(section, 79, 1000);
      };

      $scope.showHomepage = function () {
        var section = angular.element(document.getElementById('stats'));
        $document.scrollToElement(section, 79, 1000);
      };

      $scope.registerMail = function () {
        $scope.sending = true;
        $http({
          url: 'http://api.47nord.de/population.io/v1/mail.php?auth=jLFscl7E7oz85D8P',
          method: 'POST',
          data: {
            email: $scope.email
          }
        })
        .success(function () {
          alert($scope.email + ' has been registered successfully!');
          $scope.email = '';
          $scope.sending = false;
        })
        .error(function () {
          $scope.sending = false;
          alert('Whoops, An error occurred!');
        });
      };

      $scope.showAbout = function () {
        $modal.open({
          templateUrl: 'about.html'
        });
      };

      $scope.showDevelopers = function () {
        $modal.open({
          templateUrl: 'developers.html'
        });
      };

    })

    .controller('StatsCtrl', function ($scope, $document, $timeout, $filter, $location,
      $rootScope, ProfileService, PopulationIOService) {

      $scope.$watch('goForm.$invalid', function (invalid) {
        if (invalid) {
          ProfileService.active = false;
        }
      });
      $scope.$watch('profile.gender', function () {
        ProfileService.active = false;
      });

      $rootScope.$on('go', function (e, target) {
        $scope.loading = true;
        $timeout(function () {
          $scope.loading = false;
          ProfileService.active = true;

          var year = $filter('date')(ProfileService.birthday, 'yyyy'),
            month = $filter('date')(ProfileService.birthday, 'MM'),
            day = $filter('date')(ProfileService.birthday, 'dd');

          $location.path([
            year,
            month,
            day,
            ProfileService.country,
            target
          ].join('/'));

          $timeout(function () {
            var section = angular.element(document.getElementById(target));
            $document.scrollToElement(section, 79, 1000);
          }, 500);
        }, 1000);
      });

      $scope.goGoGadget = function () {
        $rootScope.$emit('go', 'people');
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

    .controller('PeopleCtrl', function ($scope, $rootScope, $interval, $anchorScroll,
      $state, $filter, PopulationIOService, ProfileService) {

      $scope.$watch(function () {
        return ProfileService.active;
      }, function (active) {
        if (active) {
          _update();
        }
      });

      var _update = function () {

        PopulationIOService.loadWpRankToday({
          dob: '1920-01-01',
          sex: 'unisex',
          country: ProfileService.country
        }, function (rankTotal) {

          $scope.rankLocalTotal = rankTotal;

          PopulationIOService.loadWpRankToday({
            dob: ProfileService.birthday,
            sex: 'unisex',
            country: ProfileService.country
          }, function (rank) {
            $scope.rankLocal = $scope.rankLocalTotal - rank;
          });

        });

        PopulationIOService.loadWpRankToday({
          dob: '1920-01-01',
          sex: 'unisex',
          country: 'World'
        }, function (rankTotal) {

          $scope.rankGlobalTotal = rankTotal;

          PopulationIOService.loadWpRankToday({
            dob: ProfileService.birthday,
            sex: 'unisex',
            country: 'World'
          }, function (rank) {
            $scope.rankGlobal = $scope.rankGlobalTotal - rank;
          });

        });

      };

      $scope.$watch(function() {
        return PopulationIOService.getWorldPopulation();
      }, function(newValue, oldValue) {
        $scope.rankGlobal += (newValue - oldValue);
        $scope.rankLocal += 2;
        $rootScope.$broadcast('ranksChanged', $scope.rankGlobal, $scope.rankLocal);
      });

    })

    .controller('StoryCtrl', function ($scope, $rootScope, $state, $filter, $sce,
      ProfileService, PopulationIOService) {

      var _getDateWithOffset = function (date, offset) {
        var year = parseInt($filter('date')(date, 'yyyy'), 0),
          month = parseInt($filter('date')(date, 'M'), 0) - 1,
          day = $filter('date')(date, 'dd');

        return new Date(parseInt(year + offset, 0), month, day);
      };

      $scope.year = $filter('date')(new Date(), 'yyyy');
      $scope.storyLineData = [];

      var _loadLifeExpectancyTotal = function (country, onSuccess) {
        PopulationIOService.loadLifeExpectancyTotal({
          sex: ProfileService.gender,
          country: country,
          dob: ProfileService.birthday
        }, function (totalLifeExpectancy) {
          $scope.storyLineData.push({
            date: $filter('date')(_getDateWithOffset(
              new Date(ProfileService.birthday),
              totalLifeExpectancy
            ), 'yyyy-MM-dd'),
            year: $filter('date')(_getDateWithOffset(
              new Date(ProfileService.birthday),
              totalLifeExpectancy
            ), 'yyyy'),
            title: 'Life expectancy in ' + country
          });
          if (onSuccess) {
            onSuccess(totalLifeExpectancy);
          }
        });
      };

      var _loadWpRankRanked = function (rank, atomicNumber, onSuccess) {
        PopulationIOService.loadWpRankRanked({
          dob: ProfileService.birthday,
          sex: 'unisex',
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
          dob: '1920-01-01',
          sex: 'unisex',
          country: ProfileService.country
        }, function (rankTotal) {

          $scope.rankLocalTotal = rankTotal;

          PopulationIOService.loadWpRankToday({
            dob: ProfileService.birthday,
            sex: 'unisex',
            country: ProfileService.country
          }, function (rank) {
            $scope.rankLocal = $scope.rankLocalTotal - rank;
          });

        });

        PopulationIOService.loadWpRankToday({
          dob: '1920-01-01',
          sex: 'unisex',
          country: 'World'
        }, function (rankTotal) {

          $scope.rankGlobalTotal = rankTotal;

          PopulationIOService.loadWpRankToday({
            dob: ProfileService.birthday,
            sex: 'unisex',
            country: 'World'
          }, function (rank) {
            $scope.rankGlobal = $scope.rankGlobalTotal - rank;
          });

        });

        $scope.$on('ranksChanged', function(e, rankGlobal, rankLocal) {
          $scope.rankGlobal = rankGlobal;
          $scope.rankLocal = rankLocal;
        });

        _loadWpRankRanked(1000000000, '1th');
        _loadWpRankRanked(2000000000, '2nd');
        _loadWpRankRanked(3000000000, '3rd', function (date) {
          $scope.titleAlive = $sce.trustAsHtml([
            'On <span>' + $filter('ordinal')($filter('date')(date, 'd')) + ' ',
            $filter('date')(date, 'MMM, yyyy') + '</span> you’ll be person <span>3rd ',
            'Billion</span> to be alive in the <span>world</span>.'
          ].join(''));
        });

        _loadLifeExpectancyTotal(ProfileService.country, function (totalLifeExpectancy) {
          var date = _getDateWithOffset(
            new Date(ProfileService.birthday),
            totalLifeExpectancy
          );
          $scope.titleDie = $sce.trustAsHtml([
            'You will die on <span>',
            $filter('ordinal')($filter('date')(date, 'd')) + ' ',
            $filter('date')(date, 'MMM, yyyy') + '</span>'
          ].join(''));
        });
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
            year: $filter('date')(_getDateWithOffset(
              new Date(ProfileService.birthday),
              18
            ), 'yyyy'),
            title: 'You turned 18!'
          }
        ];
      };
    })

    .controller('BirthdaysCtrl', function ($scope, $state, $sce, $filter, $rootScope,
      PopulationIOService, ProfileService) {

      $scope.$watch(function () {
        return ProfileService.active;
      }, function (active) {
        if (active) {
          _update();
        }
      });

      var _loadPopulation = function (args, onSuccess) {
        PopulationIOService.loadPopulation({
          year: $filter('date')(Date.now(), 'yyyy'),
          country: args.country
        }, function (data) {
          onSuccess(args.country, data[0]);
        });
      };

      var countries = [];
      d3.csv('scripts/data/country_continent.csv', function (data) {
        countries = data;
      });

      var _getCountry = function (name) {
        for (var i = 0; i < countries.length; i += 1) {
          var country = countries[i];
          if (country.country === name) {
            return country;
          }
        }
      };

      var _getCountriesByContinent = function (continent) {
        var res = [];
        for (var i = 0; i < countries.length; i += 1) {
          var country = countries[i];
          if (country.continent === continent) {
            res.push(country);
          }
        }
        return res.length > 20 ? res.splice(0, 19) : res;
      };

      $scope.continentsData = [];
      $scope.worldData = [];
      $scope.selectedContinental = 'Asia';

      $scope.$watch('selectedContinental', function (newValue, oldValue) {
        if (oldValue !== newValue) {
          _updateContinentalCountries();
        }
      });

      var _updateContinentalCountries = function () {
        $scope.loading = true;
        $scope.continentsData = [];

        var countriesContinental = _getCountriesByContinent($scope.selectedContinental);
        var responseCounter = 0;

        var _onSuccess = function(country, data) {
          if (_getCountry(country).countriy_ISO_A2) {
            var value = ProfileService.gender === 'male' ? data.males : data.females,
              birthdays = value / 365;

            if (parseInt(birthdays, 0) > 0) {
              $scope.continentsData.push({
                countryAbbr: _getCountry(country).countriy_ISO_A2,
                countryTitle: country,
                value: birthdays
              });
            }
          }

          responseCounter += 1;

          if (responseCounter === countriesContinental.length) {
            $scope.loading = false;
            $scope.$broadcast('continentsDataLoaded');
          }
        };

        for (var j = 0; j < countriesContinental.length; j += 1) {
          _loadPopulation({
            country: countriesContinental[j].country,
            age: ProfileService.getAge()
          }, _onSuccess);
        }
      };

      var _update = function () {
        $scope.worldData = [];

        var countriesAroundTheWorld = [
          'China', 'India', 'USA', 'Indonesia', 'Brazil',
          'Pakistan', 'Russia', 'Japan', 'Nigeria',
          'Bangladesh', 'Mexico'
        ];

        var _onSuccess = function (country, data) {
          var value = ProfileService.gender === 'male' ? data.males : data.females;
          $scope.worldData.push({
            countryAbbr: _getCountry(country).countriy_ISO_A2,
            countryTitle: country,
            value: value / 365
          });
          if ($scope.worldData.length === countriesAroundTheWorld.length) {
            $scope.$broadcast('worldDataLoaded');
          }
        };

        for (var i = 0; i < countriesAroundTheWorld.length; i += 1) {
          _loadPopulation({
            country: countriesAroundTheWorld[i],
            age: ProfileService.getAge()
          }, _onSuccess);
        }

        _loadPopulation({
          country: 'World',
          age: ProfileService.getAge()
        }, function (country, data) {
          var value = ProfileService.gender === 'male' ? data.males : data.females;
          $scope.birthdayShare = $sce.trustAsHtml([
            '<span>' + $filter('number')(parseInt(value / 365, 0), 0) + '</span> ',
            'people around the world and ',
            '<span>' + $filter('number')(parseInt(value / 365 / 24, 0), 0) + '</span> ',
            'people were born in the same hour'
          ].join(''));

        });

        _updateContinentalCountries();
      };
    })

    .controller('ExpectancyCtrl', function ($scope, $rootScope, $filter,
      ProfileService, PopulationIOService) {

      var date = $filter('date')(new Date(), 'yyyy-MM-dd');

      $scope.$watch(function () {
        return ProfileService.active;
      }, function (active) {
        if (active) {
          _update();
        }
      });

      $scope.countries = [];

      var _update = function () {
        PopulationIOService.loadCountries(function (countries) {
          $scope.countries = countries;
        });

        if ($scope.selectedCountryRef === ProfileService.country) {
          _updateCountryRef(date);
        }

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
          age: ProfileService.getAge() + 'y'
        }, function (remainingLife) {
          $scope.activeCountryRef = {
            country: $scope.selectedCountryRef,
            yearsLeft: remainingLife,
            lifeExpectancy: ProfileService.getAge() + remainingLife
          };
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      };

      var _updateCountryRel = function (date) {
        PopulationIOService.loadLifeExpectancyRemaining({
          sex: ProfileService.gender,
          country: $scope.selectedCountryRel,
          date: date,
          age: ProfileService.getAge()  + 'y'
        }, function (remainingLife) {
          $scope.activeCountryRel = {
            country: $scope.selectedCountryRel,
            yearsLeft: remainingLife,
            lifeExpectancy: ProfileService.getAge() + remainingLife
          };
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      };

      var _isCountryAvailable = function (country) {
        if ($scope.countries.length === 0) {
          return true;
        }

        for (var i = 0; i < $scope.countries.length; i += 1) {
          if ($scope.countries[i] === country) {
            return true;
          }
        }

        return false;
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

      $rootScope.$on('countryRelChanged', function (e, country) {
        if (country) {
          if (_isCountryAvailable(country)) {
            $scope.selectedCountryRel = country;
          } else {
            alert(country + ' not available!');
          }
        }
      });

    })
  ;
}());