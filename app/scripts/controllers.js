(function () {
  'use strict';

  angular.module('populationioApp')

    .controller('MainCtrl', ['$scope', '$timeout', '$http', '$interval', '$modal', '$state', '$location', '$document', '$rootScope', '$filter', 'ProfileService', 'PopulationIOService', 'BrowserService',
      function ($scope, $timeout, $http, $interval, $modal, $state, $location, $document, $rootScope, $filter, ProfileService, PopulationIOService, BrowserService) {
        if (!BrowserService.isSupported()) {
          $modal.open({
            templateUrl: 'browser-warning.html'
          });
        }
        $scope.clockType = 'world';
        $scope.profile = ProfileService;


        $scope.$on('rankGlobalChanged', function (e, rankGlobal) {
          $rootScope.rankGlobal = rankGlobal;
          console.log(123)
        });
        $interval(function () {
          $scope.worldPopulation = PopulationIOService.getWorldPopulation();
        }, 1000);

        $scope.$watch(function () {
          return ProfileService.active;
        }, function (active) {
          if (active) {
            PopulationIOService.loadWpRankToday({
              dob: ProfileService.birthday.formatted,
              sex: 'unisex',
              country: 'World'
            }, function (rank) {
              $scope.rankGlobal = rank;
              $rootScope.$emit('rankGlobalChanged', $scope.rankGlobal);
            });

            $timeout(function () {
              $scope.showSection($rootScope.target);
            }, 700);
          }
        });

        $rootScope.$on('$locationChangeSuccess', function () {
          var path = $location.$$path.replace(/.+[/](.*)$/g, '$1');
          if ($location.preventReload) {
            $location.preventReload = false;
            return;
          }

          // TODO: check the url path for date and section
          if (path && !ProfileService.active) {
            var pathItems = $location.$$path.split('/'),
              year = pathItems[1],
              month = pathItems[2],
              day = pathItems[3],
              gender = pathItems[4],
              country = pathItems[5];

            if (['female', 'male'].indexOf(gender) > -1 &&
              country && year && month && day) {
              ProfileService.gender = gender;
              ProfileService.country = country;

              if ((new Date()).getFullYear() - parseInt(year) < 5) {
                alert('You are too young!');
                return;
              }

              ProfileService.birthday = {year: year, month: month, day: day, formatted: [year, month, day].join('-')};

              $rootScope.target = path;
              $rootScope.$emit('ready');
            }
          }

          if (path && ProfileService.active) {
            $scope.showSection(path);
          }
        });

        $rootScope.$on('ready', function () {
          $scope.showSection('home');
          $scope.loading = 1;
        });
        $rootScope.$on('loadingOn', function () {
          $scope.loading = 1
        });
        $rootScope.$on('loadingOff', function () {
          $scope.loading = 0
        });
        $rootScope.$on('duScrollspy:becameActive', function ($event, $element) {
          var section = $element.prop('id');
          if (section) {
            var path = $location.$$path.replace(/[^/]*$/g, ''),
              pathItems = $location.$$path.split('/');

            if (pathItems.length > 4) {
              $location.preventReload = true;
              $location.path(path + section).replace();
              $rootScope.currentPage = $element.attr('data-index');
              $rootScope.$apply();
            }
          }
        });

        $scope.downloadICal = function () {
          if (!ProfileService.active) {
            alert([
              'Please fill out the form and press ',
              '"Go" for getting your Date of Death!'
            ].join(''));
            return;
          }

          var cal = ics(),
            dstart = $filter('date')(ProfileService.dod, 'yyyy-MM-dd'),
            dend = $filter('date')(ProfileService.dod, 'yyyy-MM-dd'),
            dob = ProfileService.birthday.formatted,
            dod = $filter('date')(ProfileService.dod, 'yyyy-MM-dd'),
            dsum = 'Your Date of Death',
            url = 'http://population.io',
            ddesc = [
                'According to your birthday ' + dob,
                ' and the life expectancy in ' + ProfileService.country,
                ' you will die on ' + dod,
              ' . http://population.io'
            ].join('');

          cal.addEvent(dsum, ddesc, '', dstart, dend, url);
          cal.download();
        };

        $scope.showSection = function (id) {
          var section = angular.element(document.getElementById(id));
          $document.scrollToElement(section, 80, 1000);
        };

        $scope.showHomepage = function () {
          $scope.showSection('home');
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
      }])
    .controller('SummaryCtrl', ['$scope', '$rootScope', '$interval', '$filter', 'PopulationIOService', 'ProfileService', '$timeout',
      function ($scope, $rootScope, $interval, $filter, PopulationIOService, ProfileService, $timeout) {
//      selectedYearconsole.log(new Date().getFullYear())
//      console.log(ProfileService)
//      console.log(parseInt($filter('date')(ProfileService.birthday, 'yyyy'), 0))
        $scope.age = new Date().getFullYear() - ProfileService.birthday.year;
        $rootScope.$on('ready', function () {
          _update();
        });

        var _getNextDay = function () {
          var tomorrow = new Date();
          tomorrow.setDate((new Date()).getDate() + 1);
          return tomorrow;
        };

        $scope.$watch(function () {
          return ProfileService.active;
        }, function (active) {
          if (active) {
            $scope.loading = 1;
            setTimeout(function () {
              $scope.loading = 0;
              $scope.isUpdated = true;
            }, 5000);
          } else {
            $scope.isUpdated = false;
          }
        });

        var _update = function () {

          PopulationIOService.loadWpRankToday({
            dob: '1920-01-01',
            sex: 'unisex',
            country: ProfileService.country
          }, function (rank) {
            $scope.rankLocal = rank;
          });

          PopulationIOService.loadWpRankToday({
            dob: '1920-01-01',
            sex: 'unisex',
            country: 'World'
          }, function (rank) {
            $scope.rankGlobal = rank;
            $rootScope.$emit('rankGlobalChanged', $scope.rankGlobal);
          });

          PopulationIOService.loadWpRankToday({
            dob: ProfileService.birthday.formatted,
            sex: 'unisex',
            country: ProfileService.country
          }, function (rank) {
            $scope.rankLocal = rank;
            $rootScope.$emit('rankLocalChanged', $scope.rankLocal);
          });

          PopulationIOService.loadWpRankToday({
            dob: ProfileService.birthday.formatted,
            sex: 'unisex',
            country: 'World'
          }, function (rank) {
            $scope.rankGlobal = rank;
            $rootScope.$emit('rankGlobalChanged', $scope.rankGlobal);
          });

          PopulationIOService.loadWpRankOnDate({
            dob: ProfileService.birthday.formatted,
            sex: 'unisex',
            country: ProfileService.country,
            date: $filter('date')(_getNextDay(), 'yyyy-MM-dd')
          }, function (rank) {
            $scope.rankLocalTomorrow = rank;
          });

          PopulationIOService.loadPopulation({
            year: new Date().getFullYear(),
            country: ProfileService.country
          }, function (data) {
            $scope.loading -= 1;

            $scope.countryPopulationData = data;
            $scope.countryPopulation = _(data).reduce(function (sum, num) {
              sum = sum | 0;
              return sum + num.total;
            });
            $scope.$broadcast('countryPopulationDataChanged', data)
          });
          PopulationIOService.loadPopulation({
            year: new Date().getFullYear(),
            country: 'World'
          }, function (data) {
            $scope.loading -= 1;

            $scope.worldPopulationData = data;
            $scope.$broadcast('worldPopulationDataChanged', data)
          });

        };

        $scope.$watch(function () {
          return PopulationIOService.getWorldPopulation();
        }, function (newValue, oldValue) {
          $scope.rankGlobal += (newValue - oldValue);

          $rootScope.$emit('rankGlobalChanged', $scope.rankGlobal);
        });

        $interval(function () {
          var diff = ($scope.rankLocalTomorrow - $scope.rankLocal) / 24 / 60 / 60;
          if (diff) {
            $scope.rankLocal += diff;
            $rootScope.$emit('rankLocalChanged', $scope.rankLocal);
          }
        }, 1000);

      }])
    .controller('DeathCtrl', ['$scope', '$timeout', '$http', '$interval', '$modal', '$state', '$location', '$document', '$rootScope', '$filter', 'ProfileService', 'PopulationIOService', 'BrowserService',
      function ($scope, $timeout, $http, $interval, $modal, $state, $location, $document, $rootScope, $filter, ProfileService, PopulationIOService, BrowserService) {


      }])

    .controller('HomeCtrl', ['$scope', '$document', '$timeout', '$filter', '$location', '$rootScope', 'ProfileService', 'PopulationIOService',
      function ($scope, $document, $timeout, $filter, $location, $rootScope, ProfileService, PopulationIOService) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var years = [];
        for (var i = 1920; i < new Date().getFullYear() + 1; i++) { years.push(i.toString()) }


        $scope.$watch('goForm.$invalid', function (invalid) {
          if (invalid) {
            ProfileService.active = false;
          }
        });
        $scope.birthdays = function (newVal, type) {
          switch (type) {
            case 'd':
              return _.filter(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], function (v) {
                return v.indexOf(parseInt(newVal)) > -1
              });
              break;
            case 'm':
              if (isNaN(parseInt(newVal))) {
                return _.filter(months, function (v) {
                  return v.toLowerCase().indexOf(newVal.toLowerCase()) > -1
                })
              }
              else {
                var monthIndex = parseInt(newVal) - 1;
                if (monthIndex < 1) {monthIndex = 0}
                if (monthIndex > 11) {monthIndex = 11}
                return [months[monthIndex]];
              }
              break;
            case 'y':
              return _.filter(years, function (v) {
                return v.indexOf(parseInt(newVal)) > -1
              });

              break;

          }
        };
        $scope.$watch('profile.birthday', function (newVal) {
          ProfileService.active = false;
        }, true);
        $scope.$watch('profile.gender', function () {
          ProfileService.active = false;
        });

        $scope.goGoGadget = function () {
          var year = moment().year(ProfileService.birthday.year).format('YYYY'),
            month = moment().month(ProfileService.birthday.month).format('MM'),
            day = moment().date(ProfileService.birthday.day).format('DD');

          $location.path([
            year,
            month,
            day,
            ProfileService.gender,
            ProfileService.country,
            'summary'
          ].join('/'));
        };

        $rootScope.$on('ready', function () {
          $scope.loading = 1;
        });

        $scope.$watch(function () {
          return ProfileService.active;
        }, function (active) {
          if (active) {
            $scope.loading = 0;
          }
        });

        $scope.showDatepicker = function ($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.isDatepickerVisible = true;
        };

        $scope.isDatepickerVisible = false;
        $scope.countries = [];

        PopulationIOService.loadCountries(function (countries) {
          $scope.countries = countries;
        });
      }])

    .controller('PeopleCtrl', ['$scope', '$rootScope', '$interval', '$anchorScroll', '$state', '$filter', 'PopulationIOService', 'ProfileService',
      function ($scope, $rootScope, $interval, $anchorScroll, $state, $filter, PopulationIOService, ProfileService) {

        $scope.isUpdated = false;

        $rootScope.$on('ready', function () {
          _update();
        });

        var _getNextDay = function () {
          var tomorrow = new Date();
          tomorrow.setDate((new Date()).getDate() + 1);
          return tomorrow;
        };

        $scope.$watch(function () {
          return ProfileService.active;
        }, function (active) {
          if (active) {
            $scope.loading = 1;
            setTimeout(function () {
              $scope.loading = 0;
              $scope.isUpdated = true;
            }, 5000);
          } else {
            $scope.isUpdated = false;
          }
        });

        var _update = function () {

          PopulationIOService.loadWpRankToday({
            dob: '1920-01-01',
            sex: 'unisex',
            country: ProfileService.country
          }, function (rank) {
            $scope.rankLocalTotal = rank;
          });

          PopulationIOService.loadWpRankToday({
            dob: '1920-01-01',
            sex: 'unisex',
            country: 'World'
          }, function (rank) {
            $scope.rankGlobal = rank;
            $rootScope.$emit('rankGlobalChanged', $scope.rankGlobal);
          });

          PopulationIOService.loadWpRankToday({
            dob: ProfileService.birthday.formatted,
            sex: 'unisex',
            country: ProfileService.country
          }, function (rank) {
            $scope.rankLocal = rank;
            $rootScope.$emit('rankLocalChanged', $scope.rankLocal);
          });

          PopulationIOService.loadWpRankToday({
            dob: ProfileService.birthday.formatted,
            sex: 'unisex',
            country: 'World'
          }, function (rank) {
            $scope.rankGlobal = rank;
            $rootScope.$emit('rankGlobalChanged', $scope.rankGlobal);
          });

          PopulationIOService.loadWpRankOnDate({
            dob: ProfileService.birthday.formatted,
            sex: 'unisex',
            country: ProfileService.country,
            date: $filter('date')(_getNextDay(), 'yyyy-MM-dd')
          }, function (rank) {
            $scope.rankLocalTomorrow = rank;
          });

        };

        $scope.$watch(function () {
          return PopulationIOService.getWorldPopulation();
        }, function (newValue, oldValue) {
          $scope.rankGlobal += (newValue - oldValue);
          $rootScope.$emit('rankGlobalChanged', $scope.rankGlobal);
        });

        $interval(function () {
          var diff = ($scope.rankLocalTomorrow - $scope.rankLocal) / 24 / 60 / 60;
          if (diff) {
            $scope.rankLocal += diff;
            $rootScope.$emit('rankLocalChanged', $scope.rankLocal);
          }
        }, 1000);

      }])

    .controller('MilestonesCtrl', ['$scope', '$rootScope', '$state', '$filter', '$sce', 'ProfileService', 'PopulationIOService',
      function ($scope, $rootScope, $state, $filter, $sce, ProfileService, PopulationIOService) {

        $rootScope.$on('ready', function () {
          _update();
        });

        var _getDateWithOffset = function (date, offset) {
          var year = parseInt($filter('date')(date, 'yyyy'), 0),
            month = parseInt($filter('date')(date, 'M'), 0) - 1,
            day = $filter('date')(date, 'dd');

          return new Date(parseInt(year + offset, 0), month, day);
        };

        var _loadLifeExpectancyRemaining = function (country, onSuccess) {

          $scope.loading += 1;

          PopulationIOService.loadLifeExpectancyRemaining({
            sex: ProfileService.gender,
            country: country,
            date: $filter('date')(new Date(), 'yyyy-MM-dd'),
            age: ProfileService.getAgeString()
          }, function (remainingLife) {

            var today = new Date();
            var date = today.setDate(today.getDate() + (remainingLife * 365));

            $scope.milestonesData.push({
              date: $filter('date')(date, 'yyyy-MM-dd'),
              year: $filter('date')(date, 'yyyy'),
              title: 'Your life expectancy in ' + (country === 'World' ? 'the World' : country)
            });

            if (onSuccess) {
              onSuccess(remainingLife);
            }

            $scope.loading -= 1;
          }, function () {
            $scope.loading -= 1;
          });
        };

        var _loadWpRankRanked = function (rank, atomicNumber) {

          var _isDateGreaterThenToday = function (date) {
            return new Date(date) >= new Date();
          };

          var _updateTitleAlive = function (date, atomicNumber) {
            $scope.titleAlive = $sce.trustAsHtml([
                'Your next milestone is <span>' + $filter('ordinal')($filter('date')(date, 'd')) + ' ',
                $filter('date')(date, 'MMM, yyyy') + '</span>, then you’ll be person <span>',
                atomicNumber + ' Billion</span> to be alive in the world.'
            ].join(''));
          };

          $scope.loading += 1;

          PopulationIOService.loadWpRankRanked({
            dob: ProfileService.birthday.formatted,
            sex: 'unisex',
            country: 'World',
            rank: rank
          }, function (date) {

            if (_isDateGreaterThenToday(date)) {
              if (new Date(date) < $scope.nextYear || !$scope.nextYear) {
                _updateTitleAlive(date, atomicNumber);
                $scope.nextYear = new Date(date);
              }
            }

            $scope.milestonesData.push({
              date: date,
              rank: true,
              year: $filter('date')(date, 'yyyy'),
              title: atomicNumber + ' billion person'
            });

            $scope.loading -= 1;
          }, function () {
            $scope.loading -= 1;
          });
        };

        var _getInitialMilestonesData = function () {
          return [
            {
              date: $filter('date')(Date.now(), 'yyyy-MM-dd'),
              year: $filter('date')(Date.now(), 'yyyy'),
              title: 'Now',
              now: true
            },
            {
              date: ProfileService.birthday.formatted,
              year: ProfileService.birthday.year,
              title: 'Born',
              born: true
            },
            {
              date: _getDateWithOffset(new Date(ProfileService.birthday.formatted), 18),
              year: $filter('date')(_getDateWithOffset(
                new Date(ProfileService.birthday.formatted),
                18
              ), 'yyyy'),
              title: 'You turned 18!'
            }
          ];
        };

        $scope.highlightMilestone = function (year) {

          $scope.selectedYear = year;
          $scope.loading += 2;
          $scope.age = $scope.selectedYear - ProfileService.birthday.year;
          PopulationIOService.loadPopulation({
            year: $scope.selectedYear,
            country: ProfileService.country
          }, function (data) {
            $scope.loading -= 1;
            $scope.localRankData = data;
          });

          PopulationIOService.loadPopulation({
            year: $scope.selectedYear,
            country: 'World'
          }, function (data) {
            $scope.loading -= 1;
            $scope.globalRankData = data;
          });
        };
        $scope.dateOrder = function (item) {
          return (new Date(item.date)).getTime();
        };

        $rootScope.$on('selectedYearChanged', function ($event, year) {
          $scope.highlightMilestone(year);
        });

        $scope.$watch(function () {
          return $scope.loading;
        }, function (loading) {
          if (loading === 0) {
            ProfileService.active = true;
          }
        });

        var _update = function () {

          $scope.age = ProfileService.getAge();
          $scope.loading = 0;
          $scope.year = $filter('date')(new Date(), 'yyyy');
          $scope.milestonesData = _getInitialMilestonesData();
          $scope.titleAlive = null;
          $scope.titleDie = null;
          $scope.localRankData = null;
          $scope.globalRankData = null;
          $scope.nextYear = null;

          $scope.$on('rankGlobalChanged', function (e, rankGlobal) {
            $scope.rankGlobal = rankGlobal;
          });

          $scope.$on('rankLocalChanged', function (e, rankLocal) {
            $scope.rankLocal = rankLocal;
          });

          _loadWpRankRanked(3000000000, '3rd');
          _loadWpRankRanked(4000000000, '4th');
          _loadWpRankRanked(5000000000, '5th');

          if (ProfileService.getAge() > 30) {
            _loadWpRankRanked(6000000000, '6th');
            _loadWpRankRanked(7000000000, '7th');
          } else {
            _loadWpRankRanked(1000000000, '1st');
            _loadWpRankRanked(2000000000, '2nd');
          }

          _loadLifeExpectancyRemaining(ProfileService.country, function (remainingLife) {

            var today = new Date();
            var date = today.setDate(today.getDate() + (remainingLife * 365));

            ProfileService.dod = date;

            $scope.titleDie = $sce.trustAsHtml([
              'You are expected to die on <span>',
                $filter('ordinal')($filter('date')(date, 'd')) + ' ',
                $filter('date')(date, 'MMM, yyyy') + '</span>'
            ].join(''));
          });
          _loadLifeExpectancyRemaining('World');

          $scope.country = ProfileService.country;
        };
      }])

    .controller('BirthdaysCtrl', ['$scope', '$state', '$sce', '$filter', '$rootScope', 'PopulationIOService', 'ProfileService',
      function ($scope, $state, $sce, $filter, $rootScope, PopulationIOService, ProfileService) {

        var countries = [];

        $rootScope.$on('ready', function () {
          d3.csv('data/country_continent.csv', function (data) {
            countries = data;
            _update();
          });
        });

        var _getCountry = function (name) {
          for (var i = 0; i < countries.length; i += 1) {
            var country = countries[i];
            if (country.country === name) {
              return country;
            }
          }
          return null;
        };

        var _getCountriesByContinent = function (continent) {
          var res = [];
          for (var i = 0; i < countries.length; i += 1) {
            var country = countries[i];
            if (country.continent === continent) {
              res.push(country);
            }
          }
          return res;
        };

        $scope.$watch('selectedContinental', function (newValue, oldValue) {
          if (ProfileService.active && oldValue !== newValue) {
            _updateContinentalCountries();
          }
        });

        var _updateContinentalCountries = function () {
          $rootScope.$broadcast('loadingOn')
          $scope.continentsData = [];

          var continentalCountries = _getCountriesByContinent($scope.selectedContinental),
            responseCounter = 0;

          $scope.loading += continentalCountries.length;

          _loadAllCountryBirthdays(continentalCountries, function (country, birthdays) {
            if (country && birthdays && parseInt(birthdays, 0) > 0) {
              $scope.continentsData.push({
                countryAbbr: _getCountry(country).countriy_ISO_A2,
                countryTitle: country,
                value: birthdays
              });
            }

            responseCounter += 1;
            $scope.loading -= 1;

            if (continentalCountries.length === responseCounter) {
              $scope.$broadcast('continentsDataLoaded');
              $rootScope.$broadcast('loadingOff')
            }
          });
        };

        var _updateCountriesAroundTheWorld = function () {

          $scope.worldData = [];

          var countriesAroundTheWorld = [
              'China', 'India', 'USA', 'Indonesia', 'Brazil',
              'Pakistan', 'Russia', 'Japan', 'Nigeria',
              'Bangladesh', 'Mexico'
            ],
            responseCounter = 0;

          $scope.loading += countriesAroundTheWorld.length;

          _loadAllCountryBirthdays(countriesAroundTheWorld, function (country, birthdays) {

            if (country && birthdays) {
              $scope.worldData.push({
                countryAbbr: _getCountry(country).countriy_ISO_A2,
                countryTitle: country,
                value: birthdays
              });
            }

            responseCounter += 1;
            $scope.loading -= 1;

            if (countriesAroundTheWorld.length === responseCounter) {
              $scope.$broadcast('worldDataLoaded');
            }
          });
        };

        var _loadAllCountryBirthdays = function (countries, callback) {

          var _loadCountryBirthdays = function (country) {
            PopulationIOService.loadPopulationByAge({
              year: $filter('date')(Date.now(), 'yyyy'),
              country: country,
              age: ProfileService.getAge()
            }, function (data) {
              if (_getCountry(country).countriy_ISO_A2) {
                callback(country, data[0].total / 365);
              }
            }, function () {
              callback();
            });

          };

          for (var j = 0; j < countries.length; j += 1) {
            _loadCountryBirthdays(countries[j].country || countries[j]);
          }
        };

        var _update = function () {

          $scope.loading = 1;
          $scope.continentsData = [];
          $scope.worldData = [];
          $scope.selectedContinental = 'Asia';
          $scope.birthdayShare = null;
          $scope.$apply();

          $scope.$broadcast('continentsDataLoaded');
          $scope.$broadcast('worldDataLoaded');

          PopulationIOService.loadPopulationByAge({
            year: $filter('date')(Date.now(), 'yyyy'),
            country: 'World',
            age: ProfileService.getAge()
          }, function (data) {
            $scope.birthdayShare = $sce.trustAsHtml([
                '<span>' + $filter('number')(parseInt(data[0].total / 365, 0), 0),
              '</span> people around the world and that',
                '<span>' + $filter('number')(parseInt(data[0].total / 365 / 24, 0), 0),
              '</span> people were born in the same hour?'
            ].join(''));

            $scope.loading -= 1;
          }, function () {
            $scope.loading -= 1;
          });

          _updateCountriesAroundTheWorld();
          _updateContinentalCountries();
        };
      }])

    .controller('ExpectancyCtrl', ['$scope', '$rootScope', '$filter', 'ProfileService', 'PopulationIOService',
      function ($scope, $rootScope, $filter, ProfileService, PopulationIOService) {

        var date = $filter('date')(new Date(), 'yyyy-MM-dd');

        $rootScope.$on('ready', function () {
          _update();
        });

        $scope.loading = 0;
        $scope.countries = [];

        var _update = function () {
          PopulationIOService.loadCountries(function (countries) {
            $scope.countries = countries;
            $scope.selectedCountryRef = ProfileService.country;
            _updateCountryRef(date);
          });
        };

        var _updateCountryRef = function (date) {

          $scope.loading += 1;

          PopulationIOService.loadLifeExpectancyRemaining({
            sex: ProfileService.gender,
            country: $scope.selectedCountryRef,
            date: date,
            age: ProfileService.getAgeString()
          }, function (remainingLife) {

            var ageDate = new Date(Date.now() - (new Date(ProfileService.birthday.formatted)).getTime());
            var lifeExpectancy = ProfileService.getAge() + remainingLife + (ageDate.getMonth() / 11);

            $scope.activeCountryRef = {
              country: $scope.selectedCountryRef,
              yearsLeft: remainingLife,
              lifeExpectancy: lifeExpectancy,
              dod: ProfileService.dod
            };
            $scope.loading -= 1;
            if (!$scope.$$phase) {
              $scope.$apply();
            }
          }, function () {
            $scope.loading -= 1;
          });
        };

        var _updateCountryRel = function (date) {

          $scope.loading += 1;

          PopulationIOService.loadLifeExpectancyRemaining({
            sex: ProfileService.gender,
            country: $scope.selectedCountryRel,
            date: date,
            age: ProfileService.getAgeString()
          }, function (remainingLife) {

            var ageDate = new Date(Date.now() - (new Date(ProfileService.birthday.formatted)).getTime());
            var lifeExpectancy = ProfileService.getAge() + remainingLife + (ageDate.getMonth() / 11);

            $scope.activeCountryRel = {
              country: $scope.selectedCountryRel,
              yearsLeft: remainingLife,
              lifeExpectancy: lifeExpectancy
            };

            $scope.loading -= 1;

            if (!$scope.$$phase) {
              $scope.$apply();
            }
          }, function () {
            $scope.loading -= 1;
          });
        };

        var _isCountryAvailable = function (country) {
          for (var i = 0; i < $scope.countries.length; i += 1) {
            if ($scope.countries[i] === country) {
              return true;
            }
          }

          return false;
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

        $scope.$watch('selectedCountryRef', function (country) {
          if (ProfileService.active && country) {
            _updateCountryRef(date);
          }
        });

        $scope.$watch('selectedCountryRel', function (country) {
          if (ProfileService.active && country) {
            _updateCountryRel(date);
          }
        });

        $rootScope.$on('countryRelChanged', function (e, country) {
          if (ProfileService.active && country) {
            if (_isCountryAvailable(country)) {
              $scope.selectedCountryRel = country;
            } else {
              alert(country + ' not available!');
            }
          }
        });

      }])
  ;
}());