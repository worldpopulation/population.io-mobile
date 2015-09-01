(function () {
  'use strict';

  angular.module('populationioApp')

  .controller('MainCtrl', ['$translate', '$scope', '$timeout', '$http', '$interval', '$modal', '$state', '$location', '$document', '$rootScope', '$filter', 'ProfileService', 'PopulationIOService', 'BrowserService', 'Countries',
  function ($translate, $scope, $timeout, $http, $interval, $modal, $state, $location, $document, $rootScope, $filter, ProfileService, PopulationIOService, BrowserService, Countries) {

    $scope.changeLanguage = function (langKey) {
      $translate.use(langKey).then(function (langKey) {
        $scope.$broadcast('languageChange');
        $scope.updatePlaceholders();
        $scope.activeLang = langKey;
      }, function (langKey) {
        console.log("Something wrong with this language:", langKey);
      });
    };

    $scope.updatePlaceholders = function(){
      $("#inputBirthDay").attr("placeholder", $filter('translate')('LOCAL_DAY')); //LOCAL_DAY
      $("#inputBirthMonth").attr("placeholder", $filter('translate')('LOCAL_MONTH')); //LOCAL_MONTH
      $("#inputBirthYear").attr("placeholder", $filter('translate')('LOCAL_YEAR')); //LOCAL_YEAR
      $("#inputBirthCountry").attr("placeholder", $filter('translate')('LOCAL_COUNTRY')); //LOCAL_COUNTRY
    };

    $scope.changeLanguage($rootScope.defaultLanguage);

    $rootScope.countriesList = function (newVal) {
      var alternativeName = newVal;
      var aliases = [
        {alias: 'Great Britain', country: 'United Kingdom'},
        {alias: 'Britain', country: 'United Kingdom'},
        {alias: 'England', country: 'United Kingdom'},
        {alias: 'United States of America', country: 'United States'},
        {alias: 'USA', country: 'United States'},
        {alias: 'Egypt', country: 'Arab Rep of Egypt'},
        {alias: 'North Korea', country: 'Dem Peoples Rep of Korea'},
        {alias: 'South Korea', country: 'Rep of Korea'}
      ]
      ;
      var foundAlias = _.find(aliases, function (item) {
        return item.alias.toLowerCase().indexOf(newVal.toLowerCase()) > -1
      });
      if (foundAlias) {
        alternativeName = foundAlias.country
      }

      return _.filter(Countries, function (v) {
        return (v.POPIO_NAME.toLowerCase().indexOf(newVal.toLowerCase()) > -1 || v.POPIO_NAME.toLowerCase().indexOf(alternativeName.toLowerCase()) > -1)
      });
    };

    $scope.rankGlobal = 0;
    if (!BrowserService.isSupported()) {
      $modal.open({
        templateUrl: 'browser-warning.html'
      });
    }
    $scope.clockType = 'world';
    $scope.profile = ProfileService;
    $scope.worldPopulation = 0;
    PopulationIOService.getWorldPopulation(function (data) {
      $scope.worldPopulation = data.total_population[1].population;

      $scope.worldPopulationToday = data.total_population[0].population;
      $scope.worldPopulationTomorrow = data.total_population[1].population;

      $scope.peopleBornPerSecond = Math.ceil((data.total_population[1].population - data.total_population[0].population) / (24 * 60 * 60));
    });
    $scope.$watch('worldPopulation', function (newValue, oldValue) {
      $scope.rankGlobal += (newValue - oldValue);
      $rootScope.$broadcast('rankGlobalChanged', $scope.rankGlobal);
    });
    $interval(function () {
      $scope.worldPopulation += $scope.peopleBornPerSecond;
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
          $rootScope.$broadcast('rankGlobalChanged', $scope.rankGlobal);
        });
        PopulationIOService.getLocalPopulation(ProfileService.country, function (data) {
          $scope.localPopulationToday = data.total_population[0].population;
          $scope.localPopulationTomorrow = data.total_population[1].population;
        });

        $timeout(function () {
        }, 700);
      }
    });

    $rootScope.$on('$locationChangeSuccess', function () {

      var path = $location.$$path.replace(/.+[/](.*)$/g, '$1');
      if ($location.preventReload) {
        $location.preventReload = false;
        return;
      }

      if (path && !ProfileService.active) {
        $rootScope.expanded = true;
        var pathItems = $location.$$path.split('/'),
        year = parseInt(pathItems[1]),
        month = parseInt(pathItems[2]),
        day = parseInt(pathItems[3]),
        gender = pathItems[4],
        country = pathItems[5];


        if (['female', 'male'].indexOf(gender) > -1 &&
        country && year && month && day) {
          ProfileService.gender = gender;
          ProfileService.country = country;

          ProfileService.birthday = {year: year, month: month, day: day, formatted: [year, month, day].join('-')};

          $rootScope.target = path;
          $rootScope.$broadcast('ready');

          $scope.$broadcast('languageChange');

          $rootScope.expanded = false;

          $rootScope.$broadcast('go');
        }

      }

    });

    $rootScope.$on('ready', function () {
      $scope.loading = 1;
    });
    $rootScope.$on('loadingOn', function () {
      $scope.loading = 1
    });
    $rootScope.$on('loadingOff', function () {
      $scope.loading = 0
    });

    $scope.createical = function() {

      var data ="?dstart=" + $filter('date')(ProfileService.dod,'yyyy-MM-dd')
      +"&dend="+ $filter('date')(ProfileService.dod, 'yyyy-MM-dd')
      +"&dob="+ ProfileService.birthday.formatted
      +"&dod="+ $filter('date')(ProfileService.dod, 'yyyy-MM-dd')
      +"&dsum=Your Date of Death"
      +"&url=" + window.encodeURIComponent('http://population.io')
      +"&country="+ ProfileService.country;

      var link = '../php/create-ics.php' + data;
      window.open(link);
    }

    $scope.createicalMilestones = function(itemDate, itemTitle) {

      var data ="?dstart=" + $filter('date')(itemDate,'yyyy-MM-dd')
      +"&dend="+ $filter('date')(itemDate, 'yyyy-MM-dd')
      +"&dob="+ ProfileService.birthday.formatted
      +"&dod="+ $filter('date')(ProfileService.dod, 'yyyy-MM-dd')
      +"&dsum="+ $filter('htmlToPlaintext')(itemTitle)
      +"&url=" + window.encodeURIComponent('http://population.io')
      +"&country="+ ProfileService.country;

      var link = '../php/create-ics.php' + data;
      window.open(link);
    }

    $rootScope.showAbout = function () {
      $modal.open({
        templateUrl: 'about.html'
      });
    };
    $rootScope.showMethodology = function () {
      $modal.open({
        templateUrl: 'methodology.html'
      });
    };

    $rootScope.showDevelopers = function () {
      $modal.open({
        templateUrl: 'developers.html'
      });
    };

    $scope.isVisible = false;

    $scope.showMenu = function(){
      $scope.isVisible =   $scope.isVisible ? false : true;
    }

    $rootScope.gotoworldage = function(){
      $rootScope.currentIndex = 2;
      $rootScope.prev();
      $scope.showMenu();
    }

    $rootScope.gotocountryage = function(){
      $rootScope.currentIndex = 1;
      $rootScope.next();
      $scope.showMenu();
    }

    $rootScope.gotomilestones = function(){
      $rootScope.currentIndex = 2;
      $rootScope.next();
      $scope.showMenu();
    }

    $rootScope.gotobb = function(){
      $rootScope.currentIndex = 3;
      $rootScope.next();
      $scope.showMenu();
    }

    $rootScope.gotoexpectany = function(){
      $rootScope.currentIndex = 4;
      $rootScope.next();
      $scope.showMenu();
    }

    $rootScope.gotodod = function(){
      $rootScope.currentIndex = 5;
      $rootScope.next();
      $scope.showMenu();
    }

    $rootScope.home = function(){
      $rootScope.currentIndex =1;
      $rootScope.prev();
      $scope.showMenu()
    }

    $rootScope.gotohome = function(){
      if($rootScope.currentIndex === 0){
        $location.path();
      }
    }



  }])
  .controller('GoCtrl', ['$scope', '$rootScope','$location', 'ProfileService',  function($scope, $rootScope, $location, ProfileService){

    $rootScope.$on('go', function(){
      $rootScope.currentIndex = 1;
      $rootScope.currentPage = 1;
    });

    $scope.items = [{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}];

    $rootScope.next = function(){
      $rootScope.currentIndex++;
      if ($rootScope.currentIndex > 7) {
        $rootScope.currentIndex = 7;
      }
    }

    $rootScope.prev = function(){
      $rootScope.currentIndex--;
      if ($rootScope.currentIndex == 0){
        $rootScope.gotohome();
      }
    }


    $rootScope.gotoshare = function(){
      $rootScope.currentIndex = 6;
      $rootScope.next();
    }

  }])
  .controller('SummaryCtrl', ['$scope', '$rootScope', '$interval', '$filter', 'PopulationIOService', 'ProfileService', '$timeout',
  function ($scope, $rootScope, $interval, $filter, PopulationIOService, ProfileService, $timeout) {
    var rangeLoaded = false;
    $scope.region = 'World';
    $scope.age = new Date().getFullYear() - ProfileService.birthday.year;
    $rootScope.$on('ready', function () {
      _update();
    });
    var today = new Date();

    var _getNextDay = function () {
      var tomorrow = new Date();
      tomorrow.setDate((new Date()).getDate() + 1);
      return tomorrow;
    };
    var tickerYoungerGlobal = d3.scale.linear()
    .domain([today.getTime(), _getNextDay().getTime()]);

    var tickerYoungerLocal = d3.scale.linear()
    .domain([today.getTime(), _getNextDay().getTime()]);

    var tickerOlderGlobal = d3.scale.linear()
    .domain([today.getTime(), _getNextDay().getTime()]);

    var tickerOlderLocal = d3.scale.linear()
    .domain([today.getTime(), _getNextDay().getTime()]);

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

    $scope.calcWorldOlderNumber = function () {
      if (!$scope.rankGlobal || !$scope.worldPopulation) {return 0}
      return $filter('number')(Math.max(0, $scope.worldPopulation - $scope.rankGlobal), 0);
    };

    $scope.calcCountryOlderNumber = function () {
      if (!$scope.rankLocal || !$scope.countryPopulation) {return 0}
      return $filter('number')(Math.max(0, $scope.countryPopulation - $scope.rankLocal), 0);
    };

    $scope.calcCountryYoungerPercentageSimple = function () {
      return $filter('number')(Math.min(100, $scope.rankLocal / ($scope.countryPopulation / 100)), 0);
    };
    $scope.calcWorldYoungerPercentageSimple = function() {
      return $filter('number')(Math.min(100, $scope.rankGlobal / ($scope.worldPopulation / 100)), 0);
    }

    var _update = function () {

      // Local rank for country of the user
      PopulationIOService.loadWpRankToday({
        dob: ProfileService.birthday.formatted,
        sex: 'unisex',
        country: ProfileService.country
      }, function (rank) {
        $scope.rankLocal = rank;
        $rootScope.$broadcast('rankLocalChanged', $scope.rankLocal);
      });

      // Global rank for world of the user
      PopulationIOService.loadWpRankToday({
        dob: ProfileService.birthday.formatted,
        sex: 'unisex',
        country: 'World'
      }, function (rank) {
        $scope.rankGlobal = rank;
        $rootScope.$broadcast('rankGlobalChanged', $scope.rankGlobal);
      });

      // Local rank for country of the user
      PopulationIOService.loadWpRankOnDate({
        dob: ProfileService.birthday.formatted,
        sex: 'unisex',
        country: ProfileService.country,
        date: $filter('date')(_getNextDay(), 'yyyy-MM-dd')
      }, function (rank) {
        $scope.rankLocalTomorrow = rank;
      });

      // Global rank for world of the user
      PopulationIOService.loadWpRankOnDate({
        dob: ProfileService.birthday.formatted,
        sex: 'unisex',
        country: 'World',
        date: $filter('date')(_getNextDay(), 'yyyy-MM-dd')
      }, function (rank) {
        $scope.rankGlobalTomorrow = rank;
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
        if (data) {
          $scope.$broadcast('countryPopulationDataChanged', data)
        }
      });
      PopulationIOService.loadPopulation({
        year: new Date().getFullYear(),
        country: 'World'
      }, function (data) {
        $scope.loading -= 1;
        $scope.worldPopulationData = data;
        if (data) {
          $scope.$broadcast('worldPopulationDataChanged', data)
        }
      });
    };
    $scope.$watchGroup(['rankLocal', 'rankGlobal', 'rankLocalTomorrow', 'rankGlobalTomorrow', 'countryPopulation', 'worldPopulation'], function (newVals, oldVals) {
      $scope.countryYoungerPercentageSimple = $filter('number')(Math.min(100, $scope.rankLocal / ($scope.countryPopulation / 100)), 0);
      $scope.worldYoungerPercentageSimple = $filter('number')($scope.rankGlobal/($scope.worldPopulation/100),0);

      if (!_(newVals).contains(undefined) && !rangeLoaded) {

        tickerYoungerGlobal
        .range([$scope.rankGlobal, $scope.rankGlobalTomorrow]);
        tickerYoungerLocal
        .range([$scope.rankLocal, $scope.rankLocalTomorrow])

        tickerOlderGlobal
        .range([$scope.rankGlobalTomorrow, $scope.worldPopulation]);

        tickerOlderLocal
        .range([$scope.rankLocal, $scope.rankLocalTomorrow]);

        $scope.scaledRankYoungerLocal = tickerYoungerLocal(new Date().getTime());
        $scope.scaledRankYoungerGlobal = tickerYoungerGlobal(new Date().getTime());

        $scope.scaledRankOlderLocal = $scope.localPopulationToday - tickerYoungerLocal(new Date().getTime());
        $scope.scaledRankOlderGlobal = $scope.worldPopulation - tickerYoungerGlobal(new Date().getTime());

        $scope.scaledRankOlderGlobalSimple = $filter('number')($scope.worldPopulation - tickerYoungerGlobal(new Date().getTime()), 0);

        $scope.scaledRankYoungerGlobalSimple = $filter('number')(tickerYoungerGlobal(new Date().getTime()), 0);

        $scope.scaledRankYoungerLocalSimple = $filter('number')(tickerYoungerLocal(new Date().getTime()), 0);

        $scope.scaledRankOlderLocalSimple = $filter('number')($scope.countryPopulation - tickerOlderLocal(new Date().getTime()), 0);

      }


    });

  }])
  .controller('DeathCtrl',
  ['$scope', '$interpolate', '$timeout', '$http', '$interval', '$modal', '$state', '$location', '$document', '$rootScope', '$filter', 'ProfileService', 'PopulationIOService', 'BrowserService',
  function ($scope, $interpolate, $timeout, $http, $interval, $modal, $state, $location, $document, $rootScope, $filter, ProfileService, PopulationIOService, BrowserService) {
    $scope.type = 'distribution';


    var path = $location.$$path.replace(/.+[/](.*)$/g, '$1');
    if ($location.preventReload) {
      $location.preventReload = false;
      return;
    }

    if (path && !ProfileService.active) {
      var pathItems = $location.$$path.split('/'),
      year = parseInt(pathItems[1]),
      month = parseInt(pathItems[2]),
      day = parseInt(pathItems[3]);

      ProfileService.birthday.day = day;
      ProfileService.birthday.month = month;
      ProfileService.birthday.year = year;

    }

    $scope.$watch(function () {return ProfileService.active}, function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        $scope.country  = ProfileService.country;
        $scope.ageNow = new Date().getFullYear() - ProfileService.birthday.year;

        PopulationIOService.loadMortalityDistribution({
          country: ProfileService.country,
          gender: ProfileService.gender,
          age: ProfileService.getAge()
        }, function (data) {

          $scope.loading -= 1;
          $scope.mortalityDistributionData = data;
          $scope.$broadcast('mortalityDistributionDataChanged', data)

        });

        PopulationIOService.loadLifeExpectancyRemaining({
          sex: ProfileService.gender,
          country: 'World',
          date: $filter('date')(new Date(), 'yyyy-MM-dd'),
          age: ProfileService.getAgeString()
        }, function (remainingLife) {
          var today = new Date();
          $scope.dodWorld = $filter('date')(today.setDate(today.getDate() + (remainingLife * 365)), 'd MMM, yyyy');

          $scope.remainingLifeWorldInYears = parseFloat(remainingLife).toFixed(1);
          $scope.totalLifeWorldInYears = moment(today).diff(moment(ProfileService.birthday), 'years', true);
        });
        PopulationIOService.loadLifeExpectancyRemaining({
          sex: ProfileService.gender,
          country: ProfileService.country,
          date: $filter('date')(new Date(), 'yyyy-MM-dd'),
          age: ProfileService.getAgeString()
        }, function (remainingLife) {
          var today = new Date();
          $scope.dodCountry = $filter('date')(today.setDate(today.getDate() + (remainingLife * 365)), 'd MMM, yyyy');
          $scope.remainingLifeCountryInYears = parseFloat(remainingLife).toFixed(1);
          $scope.totalLifeCountryInYears = moment(today).diff(moment(ProfileService.birthday), 'years', true);
        });
        var updateValues = function(){
          var negative = false;

          var c = moment($scope.dodCountry);
          var w = moment($scope.dodWorld);
          var diffDays = c.diff(w, 'days');
          var diffYears = c.diff(w, 'years');


        };

        $scope.$on('languageChange', function () {
          updateValues();
        });

        $scope.$watchGroup(['remainingLifeCountryInYears', 'remainingLifeWorldInYears'],
        function (newVals, oldVals) {
          if ((newVals[0] && newVals[1]) && (newVals[0] !== oldVals[0] && newVals[1] !== oldVals[0])) {
            updateValues();

          }
        })
      }
    })
  }])

  .controller('HomeCtrl', ['$scope', '$document', '$timeout', '$filter', '$location', '$rootScope', 'ProfileService', 'PopulationIOService', "Countries",
  function ($scope, $document, $timeout, $filter, $location, $rootScope, ProfileService, PopulationIOService, Countries) {
    var getMonths = function(){
      var month1 = $filter('translate')('MONTH1');
      var month2 = $filter('translate')('MONTH2');
      var month3 = $filter('translate')('MONTH3');
      var month4 = $filter('translate')('MONTH4');
      var month5 = $filter('translate')('MONTH5');
      var month6 = $filter('translate')('MONTH6');
      var month7 = $filter('translate')('MONTH7');
      var month8 = $filter('translate')('MONTH8');
      var month9 = $filter('translate')('MONTH9');
      var month10 = $filter('translate')('MONTH10');
      var month11 = $filter('translate')('MONTH11');
      var month12 = $filter('translate')('MONTH12');

      return [month1, month2, month3, month4, month5, month6, month7, month8, month9, month10, month11, month12 ];

    }

    var months = getMonths();
    var days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    var years = [];
    for (var i = 1920; i < new Date().getFullYear(); i++) { years.push(i) }

    $scope.setDay = function ($item, $model, $label) {
      $scope.goForm.birthdayDay.$setValidity('validateDay', true);
    };
    $scope.setMonth = function ($item, $model, $label) {
      $scope.goForm.birthdayMonth.$setValidity('validateMonth', true);
    };
    $scope.setYear = function ($item, $model, $label) {
      $scope.goForm.birthdayYear.$setValidity('validateYear', true);
    };
    $scope.setCountry = function ($item, $model, $label) {
      $scope.goForm.country.$setValidity('validateCountry', true);
    };

    $scope.$on('languageChange', function () {
      months = getMonths();
    });

    $scope.$watch('goForm.$invalid', function (invalid) {
      if (invalid) {
        ProfileService.active = false;
      }
    });
    $scope.birthdays = function (newVal, type) {
      switch (type) {
        case 'd':
        return _.filter(days, function (v) {
          v = v.toString();
          var  reVal =  v.indexOf(newVal.toString()) > -1;
          return reVal;
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
          v = v.toString();
          var reVal = v.indexOf(newVal.toString()) > -1;
          return reVal;
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
      if ($scope.goForm.$invalid) {
        console.log($scope.goForm);
        $scope.highlightErrors = true;
        $scope.highlightExtra = true;
        $timeout(function () { $scope.highlightExtra = false}, 2000);
        return;
      }

      $rootScope.expanded = false;

      var year = moment().year(ProfileService.birthday.year).format('YYYY'),
      month = moment().month(ProfileService.birthday.month).format('MM'),
      day = moment().date(ProfileService.birthday.day).format('DD');
      ProfileService.country = _.find(Countries, function (v) {
        return v.POPIO_NAME.toLowerCase() == ProfileService.country.toLowerCase()
      }).POPIO_NAME;
      $scope.country  = ProfileService.country;

      $location.path([
        year,
        month,
        day,
        ProfileService.gender,
        ProfileService.country
      ].join('/'));

      $rootScope.$broadcast('go');

    };

    $rootScope.$on('ready', function () {
      $scope.loading = 1;
    });

    $scope.$watch(function () {
      return ProfileService.active;
    }, function (active) {
      if (active) {
        $scope.loading = 1;
      }
    });

    $scope.showDatepicker = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.isDatepickerVisible = true;
    };

    $scope.isDatepickerVisible = false;
    $scope.countries = Countries;
  }])

  .controller('MilestonesCtrl', ['$scope', '$rootScope', '$state', '$filter', '$sce', 'ProfileService', 'PopulationIOService',
  function ($scope, $rootScope, $state, $filter, $sce, ProfileService, PopulationIOService) {

    $scope.percentages = [];

    $rootScope.$on('ready', function () {
      _update();
    });
    $scope.$on('languageChange', function () {
      $scope.milestoneCounter = $filter('translate')($scope.atomicNumber);
      if($scope.milestonesData){
        for (var i = 0; i < $scope.milestonesData.length; i += 1) {
          if($scope.milestonesData[i].titleType === 'lifeExpWorld'){
            $scope.milestonesData[i].title = $sce.trustAsHtml( $filter('translate')('MOBILE_MILESTONES_MILESTONE_LIFE_EXPECTANCY') + $filter('translate')('LOCAL_WORLD')) ;
          }else if($scope.milestonesData[i].titleType === 'lifeExpCountry'){
            $scope.milestonesData[i].title = $sce.trustAsHtml( $filter('translate')('MOBILE_MILESTONES_MILESTONE_LIFE_EXPECTANCY') + ProfileService.country);
          }else if($scope.milestonesData[i].titleType === 'MOBILE_MILESTONES_MILESTONE_NOW' ){
            $scope.milestonesData[i].title = $sce.trustAsHtml( $filter('translate')('MOBILE_MILESTONES_MILESTONE_NOW'));
          }else if($scope.milestonesData[i].titleType === 'MILESTONES_MILESTONE_18' ){
            $scope.milestonesData[i].title =  $sce.trustAsHtml($filter('translate')('MOBILE_MILESTONES_MILESTONE_18'));
          }else if($scope.milestonesData[i].titleType === 'MOBILE_MILESTONES_MILESTONE_BORN' ){
            $scope.milestonesData[i].title = $sce.trustAsHtml($filter('translate')('MOBILE_MILESTONES_MILESTONE_BORN'));
          }else if($scope.milestonesData[i].titleType === 'MOBILE_ORDINAL_NUMBER_1' ){
            $scope.milestonesData[i].title = $filter('translate')('MOBILE_MILESTONES_MILESTONE_1_BILLION');
          }else if($scope.milestonesData[i].titleType === 'MOBILE_ORDINAL_NUMBER_2' ){
            $scope.milestonesData[i].title = $filter('translate')('MOBILE_MILESTONES_MILESTONE_2_BILLION');
          }else if($scope.milestonesData[i].titleType === 'MOBILE_ORDINAL_NUMBER_3' ){
            $scope.milestonesData[i].title = $filter('translate')('MOBILE_MILESTONES_MILESTONE_3_BILLION');
          }else if($scope.milestonesData[i].titleType === 'MOBILE_ORDINAL_NUMBER_4' ){
            $scope.milestonesData[i].title = $filter('translate')('MOBILE_MILESTONES_MILESTONE_4_BILLION');
          }else if($scope.milestonesData[i].titleType === 'MOBILE_ORDINAL_NUMBER_5' ){
            $scope.milestonesData[i].title = $filter('translate')('MOBILE_MILESTONES_MILESTONE_5_BILLION');
          }else if($scope.milestonesData[i].titleType === 'MOBILE_ORDINAL_NUMBER_6' ){
            $scope.milestonesData[i].title = $filter('translate')('MOBILE_MILESTONES_MILESTONE_6_BILLION');
          }else if($scope.milestonesData[i].titleType === 'MOBILE_ORDINAL_NUMBER_7' ){
            $scope.milestonesData[i].title = $filter('translate')('MOBILE_MILESTONES_MILESTONE_7_BILLION');
          }

        }
      }
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

        if (country === 'World') {
          var valueDeathWorld =  $filter('date')(date, 'yyyy') -     ProfileService.birthday.year;
          pushToArray(valueDeathWorld);
        }

        $scope.milestonesData.push({
          date: $filter('date')(date, 'yyyy-MM-dd'),
          year: $filter('date')(date, 'yyyy'),
          titleType: (country === 'World' ? 'lifeExpWorld' : 'lifeExpCountry'),
          title:  $sce.trustAsHtml(('<span class="black">')+$filter('translate')('MOBILE_MILESTONES_MILESTONE_LIFE_EXPECTANCY') + (country === 'World' ? $filter('translate')('LOCAL_WORLD') : country)+'</span>')
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
      $scope.atomicNumber = atomicNumber;
      var _isDateGreaterThenToday = function (date) {
        return new Date(date) >= new Date();
      };

      var _updateTitleAlive = function (date) {
        $scope.milestoneDate = $filter('date')(date, 'yyyy');
        $scope.milestoneDate = $scope.milestoneDate -
        $filter('date')(new Date(), 'yyyy');

        if($scope.milestoneDate > 1){
          $scope.milestoneYears = $filter('translate')('MOBILE_MILESTONES_LOCAL_YEARS');
        } else {
          $scope.milestoneYears = $filter('translate')('MOBILE_MILESTONES_LOCAL_YEAR');
        }
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
            _updateTitleAlive(date);
            $scope.nextYear = new Date(date);
          }
        }

        var valueMilestone = $filter('date')(date, 'yyyy') - ProfileService.birthday.year;

        pushToArray(valueMilestone);

        $scope.milestonesData.push({
          date: date,
          rank: true,
          titleType: atomicNumber,
          year: $filter('date')(date, 'yyyy'),
          title: $sce.trustAsHtml($filter('translate')(atomicNumber))
        });

        $scope.loading -= 1;
      }, function () {
        $scope.loading -= 1;
      });
    };

    var pushToArray = function(y){
      $scope.percentages.push(y);
    }

    var _getInitialMilestonesData = function () {
      var milestoneNow = $filter('translate')('MOBILE_MILESTONES_MILESTONE_NOW');
      var milestoneBorn = $filter('translate')('MOBILE_MILESTONES_MILESTONE_BORN');
      var milestone18 = $filter('translate')('MOBILE_MILESTONES_MILESTONE_18');

      var valueNow = $filter('date')(Date.now(), 'yyyy') - ProfileService.birthday.year;
      var valueBorn = ProfileService.birthday.year - ProfileService.birthday.year;
      var value18 = $filter('date')(_getDateWithOffset( new           Date(ProfileService.birthday.formatted),18), 'yyyy') - ProfileService.birthday.year;

      pushToArray(valueBorn);
      pushToArray(value18);
      pushToArray(valueNow);

      return [
        {
          date: $filter('date')(Date.now(), 'yyyy-MM-dd'),
          year: $filter('date')(Date.now(), 'yyyy'),
          title: $sce.trustAsHtml($filter('translate')('MOBILE_MILESTONES_MILESTONE_NOW')),
          titleType:'MOBILE_MILESTONES_MILESTONE_NOW',
          selected: true,
          now: true
        },
        {
          date: ProfileService.birthday.formatted,
          year: ProfileService.birthday.year,
          title: $sce.trustAsHtml($filter('translate')('MOBILE_MILESTONES_MILESTONE_BORN')),
          titleType:'MOBILE_MILESTONES_MILESTONE_BORN',
          born: true,
        },
        {
          date: _getDateWithOffset(new Date(ProfileService.birthday.formatted), 18),
          year: $filter('date')(_getDateWithOffset(
            new Date(ProfileService.birthday.formatted),
            18
          ), 'yyyy'),
          title: $sce.trustAsHtml($filter('translate')('MOBILE_MILESTONES_MILESTONE_18')),
          titleType:'MOBILE_MILESTONES_MILESTONE_18'
        }
      ];
    };

    $scope.dateOrder = function (item) {
      return (new Date(item.date)).getTime();
    };


    $scope.$watch(function () {
      return $scope.loading;
    }, function (loading) {
      if (loading === 0) {
        ProfileService.active = true;
        var i = 0;
        $scope.milestones = _.map($scope.milestonesData, function(md){
          return {
            date: md.date,
            percentages: $scope.percentages,
            title: md.title,
            year: md.year
          }
        });
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

      _loadWpRankRanked(3000000000, 'MOBILE_MILESTONES_MILESTONE_3_BILLION');
      _loadWpRankRanked(4000000000, 'MOBILE_MILESTONES_MILESTONE_4_BILLION');
      _loadWpRankRanked(5000000000, 'MOBILE_MILESTONES_MILESTONE_5_BILLION');

      if (ProfileService.getAge() > 30) {
        _loadWpRankRanked(6000000000, 'MOBILE_MILESTONES_MILESTONE_6_BILLION');
        _loadWpRankRanked(7000000000, 'MOBILE_MILESTONES_MILESTONE_7_BILLION');
      } else {
        _loadWpRankRanked(1000000000, 'MOBILE_MILESTONES_MILESTONE_1_BILLION');
        _loadWpRankRanked(2000000000, 'MOBILE_MILESTONES_MILESTONE_2_BILLION');
      }

      _loadLifeExpectancyRemaining(ProfileService.country, function (remainingLife) {

        var today = new Date();
        var date = today.setDate(today.getDate() + (remainingLife * 365));

        ProfileService.dod = date;

        var valueDeathCountry = $filter('date')(date, 'yyyy') - ProfileService.birthday.year;

        pushToArray(valueDeathCountry);

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

    var _getCountry = function (name) {
      for (var i = 0; i < countries.length; i += 1) {
        var country = countries[i];
        if (country.POPIO_NAME === name) {
          return country;
        }
      }
      return null;
    };

    var _getCountriesByContinent = function (continent) {
      var res = [];
      for (var i = 0; i < countries.length; i += 1) {
        var country = countries[i];
        if (country.CONTINENT === continent) {
          res.push(country);
        }
      }
      return res;
    };

    var _getAllCountries = function () {
      return countries;
    };

    var _getCurrentContinent = function() {
      for (var i = 0; i < _getAllCountries().length; i++) {
        var currentContinent = _getAllCountries()[i];
        if (currentContinent.POPIO_NAME === ProfileService.country) {
          return currentContinent.CONTINENT;
        }
      }
    }

    var _updateContinentalCountries = function () {
      $rootScope.$broadcast('loadingOn');
      $scope.continentsData = {};

      var allCountries = _getAllCountries(),
      responseCounter = 0;

      $scope.loading += allCountries.length;

      _loadAllCountryBirthdays(allCountries, function (country, birthdays) {
        if (country && birthdays && parseInt(birthdays, 0) > 0) {
          $scope.continentsData[country.CONTINENT] = $scope.continentsData[country.CONTINENT] ? $scope.continentsData[country.CONTINENT] + birthdays : birthdays;
        }

        responseCounter += 1;
        $scope.loading -= 1;

        if (allCountries.length === responseCounter) {
          $scope.$broadcast('continentsDataLoaded');
          $rootScope.$broadcast('loadingOff')
        }
      });
    };

    var _loadAllCountryBirthdays = function (countries, callback) {

      var _loadCountryBirthdays = function (country) {
        PopulationIOService.loadPopulationByAge({
          year: $filter('date')(Date.now(), 'yyyy'),
          country: country.POPIO_NAME,
          age: ProfileService.getAge()
        }, function (data) {
          if (_getCountry(country.POPIO_NAME).GMI_CNTRY) {
            callback(country, data[0].total / 365);
          }
        }, function () {
          callback();
        });

      };

      for (var j = 0; j < countries.length; j += 1) {
        _loadCountryBirthdays(countries[j] || countries[j]);
      }
    };

    var _update = function () {

      $scope.birthdayShare = null;
      $scope.$apply();
      $scope.country = ProfileService.country;
      $scope.currentContinent = _getCurrentContinent();

      PopulationIOService.loadPopulationByAge({
        year: $filter('date')(Date.now(), 'yyyy'),
        country: ProfileService.country,
        age: ProfileService.getAge()
      }, function (data) {
        $scope.sharedDayCountry = $filter('number')(parseInt(data[0].total / 365, 0),0);
      });


      PopulationIOService.loadPopulationByAge({
        year: $filter('date')(Date.now(), 'yyyy'),
        country: 'World',
        age: ProfileService.getAge()
      }, function (data) {
        $scope.sharedDay = $filter('number')(parseInt(data[0].total / 365, 0), 0);
        $scope.sharedHour = $filter('number')(parseInt(data[0].total / 365 / 24, 0), 0);

        $scope.loading -= 1;
      }, function () {
        $scope.loading -= 1;
      });

      _updateContinentalCountries();
    };

    $rootScope.$on('ready', function () {
      d3.csv('data/countries.csv', function (data) {
        countries = data;
        _update();
      });
    });


  }])

  .controller('ExpectancyCtrl', ['$scope', '$rootScope', '$filter', 'ProfileService', 'PopulationIOService', 'Countries',
  function ($scope, $rootScope, $filter, ProfileService, PopulationIOService, Countries) {

    $scope.countries = Countries;
    var date = $filter('date')(new Date(), 'yyyy-MM-dd');

    $rootScope.$on('ready', function () {
      $scope.selectedCountryRel = null;
      $scope.countryRel = null;
      $scope.activeCountryRel = null;
      _update();
    });
    $scope.loading = 0;

    $scope.$on('languageChange', function () {
      $("#countryRel").attr("placeholder", $filter('translate')('MOBILE_EXPECTANCY_INPUT'));
      $("#countryRef").attr("placeholder", $filter('translate')('MOBILE_EXPECTANCY_INPUT'));
    });

    var _update = function () {
      $("#countryRel").attr("placeholder", $filter('translate')('MOBILE_EXPECTANCY_INPUT'));
      $("#countryRef").attr("placeholder", $filter('translate')('MOBILE_EXPECTANCY_INPUT'));
      $scope.selectedCountryRef = _getCountryObjectByFullName(ProfileService.country);
      _updateCountryRef(date);
    };

    var _updateCountryRef = function (date) {
      $scope.loading += 1;
      var countryName;
      countryName = typeof $scope.selectedCountryRef !== 'string' ? $scope.selectedCountryRef.POPIO_NAME : $scope.selectedCountryRef;
      PopulationIOService.loadLifeExpectancyRemaining({
        sex: ProfileService.gender,
        country: countryName,
        date: date,
        age: ProfileService.getAgeString()
      }, function (remainingLife) {

        var ageDate = new Date(Date.now() - (new Date(ProfileService.birthday.formatted)).getTime());
        var lifeExpectancy = ProfileService.getAge() + remainingLife + (ageDate.getMonth() / 11);
        $rootScope.totalLifeLengthLocal = ProfileService.getAge() + remainingLife + (ageDate.getMonth() / 11)

        $scope.activeCountryRef = {
          country: $scope.selectedCountryRef,
          yearsLeft: remainingLife,
          lifeExpectancy: lifeExpectancy,
          dod: function () {
            var today = new Date();
            return today.setDate(today.getDate() + (remainingLife * 365));
          }()
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
        country: _getCountryObject($scope.selectedCountryRel).POPIO_NAME,
        date: date,
        age: ProfileService.getAgeString()
      }, function (remainingLife) {

        var ageDate = new Date(Date.now() - (new Date(ProfileService.birthday.formatted)).getTime());
        var lifeExpectancy = ProfileService.getAge() + remainingLife + (ageDate.getMonth() / 11);
        $rootScope.totalLifeLengthLocal = ProfileService.getAge() + remainingLife + (ageDate.getMonth() / 11)
        $scope.activeCountryRel = {
          country: $scope.selectedCountryRel,
          yearsLeft: remainingLife,
          lifeExpectancy: lifeExpectancy,
          dod: function () {
            var today = new Date();
            return today.setDate(today.getDate() + (remainingLife * 365));
          }()
        };

        $scope.loading -= 1;

        if (!$scope.$$phase) {
          $scope.$apply();
        }
      }, function () {
        $scope.loading -= 1;
      });
    };

    var _getCountryObject = function (country) {
      if (typeof country === 'object') {return country}
      ;
      return _.find($scope.countries, function (item) {return item.GMI_CNTRY == country || item.POPIO_NAME == country});
    };
    var _getCountryObjectByFullName = function (country) {
      return _.find($scope.countries, function (item) {return item.POPIO_NAME == country});
    };

    $scope.$watch('selectedCountryRef', function (newVal, oldVal) {
      if (ProfileService.active && newVal && _getCountryObjectByFullName(newVal)) {
        _updateCountryRef(date);
      }
    }, true);

    $scope.$watch('selectedCountryRel', function (newVal, oldVal) {
      if (ProfileService.active && newVal && (_getCountryObjectByFullName(newVal) || typeof newVal !== 'string')) {
        _updateCountryRel(date);
      }
    }, true);

    $rootScope.$on('countryRelChanged', function (e, country) {
      if (ProfileService.active && country) {
        var foundCountry = _getCountryObject(country);
        if (foundCountry) {
          $scope.selectedCountryRel = foundCountry;
        } else {
          alert(country + ' not available!');
        }
        if (!$scope.$$phase) {
          $scope.$apply();
        }
      }
    });
  }])

  .controller('SharingCtrl', ['$scope', '$rootScope', '$filter','$location', '$http', 'EnvironmentConfig',
  function ($scope, $rootScope, $filter, $location, $http, EnvironmentConfig) {

    $scope.registerMail = function () {
      $scope.sending = true;
      $http({
        url: 'http://api.47nord.de/population.io/v1/mail.php?auth='+EnvironmentConfig.mailauth,
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


    $scope.inviteMail = function(){
      $http({
        url: '../php/send-friend.php?auth='+EnvironmentConfig.friendmail,
        method: 'POST',
        data: {
          friendemail: $scope.friendemail,
          name: $scope.name
        }
      })
      .success(function () {
        alert('Email was successfully send');
        $scope.friendemail = "";
        $scope.name = ""
        $scope.sending = false;
      })
      .error(function () {
        $scope.sending = false;
        alert('Whoops, An error occurred!');
      });


    };



  }]);
}());
