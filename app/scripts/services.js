(function () {
  'use strict';

  angular.module('populationioApp')

    .service('ProfileService', function () {
      return {
        gender: 'female',
        birthday: '',
        country: '',
        active: false,
        getAge: function () {
          var ageDate = new Date(Date.now() - (new Date(this.birthday)).getTime());
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        },
        getAgeString: function() {
          var ageDate = new Date(Date.now() - (new Date(this.birthday)).getTime());
          var year = Math.abs(ageDate.getUTCFullYear() - 1970),
            months = ageDate.getMonth();
          return year + 'y' + months + 'm';
        }
      };
    })

    .service('PopulationIOService', function ($rootScope, $http) {

      var baseUrl = ' http://api.population.io/1.0';

      return {
        getWorldPopulation: function () {
          var p2013 = 7162119000;
          var p2014 = 7243784000;
          var growthRate = Math.log(p2014 / p2013) / (365 * 24 * 60 * 60);
          var start = new Date(2013, 7, 1, 12, 0, 0, 0);
          var now = new Date();
          var dif = now.getTime() - start.getTime();
          var diffSec = dif / 1000;

          return parseInt(p2013 * Math.pow((1 + growthRate), diffSec), 0);
        },

        // GET /1.0/countries/
        loadCountries: function (onSuccess, onError) {
          $http({
            method: 'get',
            url: baseUrl + '/countries/'
          })
          .success(function (data) {
            if (data.countries) {
              onSuccess(data.countries);
            }
          })
          .error(function () {
            if (onError) {
              onError();
            }
            console.info('getCountries() error');
          });
        },

        // GET /1.0/wp-rank/{dob}/{sex}/{country}/today/
        loadWpRankToday: function (args, onSuccess, onError) {
          $http({
            method: 'get',
            url: [
              baseUrl,
              'wp-rank',
              args.dob,
              args.sex,
              args.country,
              'today'
            ].join('/') + '/'
          })
          .success(function (data) {
            if (data.rank) {
              onSuccess(data.rank);
            }
          })
          .error(function (err) {
              console.log(err)
            if (onError) {
              onError();
            }
            console.info('loadWpRankToday() error');
          });
        },

        // GET /1.0/wp-rank/{dob}/{sex}/{country}/on/{date}/
        loadWpRankOnDate: function (args, onSuccess, onError) {
          $http({
            method: 'get',
            url: [
              baseUrl,
              'wp-rank',
              args.dob,
              args.sex,
              args.country,
              'on',
              args.date
            ].join('/') + '/'
          })
          .success(function (data) {
            if (data.rank) {
              onSuccess(data.rank);
            }
          })
          .error(function () {
            if (onError) {
              onError();
            }
            console.info('loadWpRankOnDate() error');
          });
        },

        // GET /1.0/wp-rank/{dob}/{sex}/{country}/ranked/{rank}

        loadWpRankRanked: function (args, onSuccess, onError) {
          $http({
            method: 'get',
            url: [
              baseUrl,
              'wp-rank',
              args.dob,
              args.sex,
              args.country,
              'ranked',
              args.rank
            ].join('/') + '/'
          })
          .success(function (data) {
            if (data.date_on_rank) {
              onSuccess(data.date_on_rank);
            }
          })
          .error(function (error) {
            if (onError) {
              onError();
            }
            console.info('loadWpRankRanked() error: ', error.detail);
          });
        },

        // GET /1.0/life-expectancy/remaining/{sex}/{country}/{date}/{age}
        loadLifeExpectancyRemaining: function (args, onSuccess, onError) {
          $http({
            method: 'get',
            url: [
              baseUrl,
              'life-expectancy/remaining',
              args.sex,
              args.country,
              args.date,
              args.age
            ].join('/') + '/'
          })
          .success(function (data) {
            if (data.remaining_life_expectancy) {
              onSuccess(data.remaining_life_expectancy);
            }
          })
          .error(function () {
            if (onError) {
              onError();
            }
            console.info('loadLifeExpectancyRemaining() error');
          });
        },

        // GET /1.0/life-expectancy/total/{sex}/{country}/{dob}
        loadLifeExpectancyTotal: function (args, onSuccess, onError) {
          $http({
            method: 'get',
            url: [
              baseUrl,
              'life-expectancy/total',
              args.sex,
              args.country,
              args.dob
            ].join('/') + '/'
          })
          .success(function (data) {
            if (data.total_life_expectancy) {
              onSuccess(data.total_life_expectancy);
            }
          })
          .error(function () {
            if (onError) {
              onError();
            }
            console.info('loadLifeExpectancyTotal() error');
          });
        },

        // GET /1.0/population/{year}/{country}
        loadPopulation: function (args, onSuccess, onError) {
          $http({
            method: 'get',
            url: [
              baseUrl,
              'population',
              args.year,
              args.country
            ].join('/') + '/'
          })
          .success(function (data) {
            if (data) {
              onSuccess(data);
            }
          })
          .error(function () {
            if (onError) {
              onError();
            }
            console.info('loadPopulation() error');
          });
        },

        // GET /1.0/population/{year}/{country}/{age}/
        loadPopulationByAge: function (args, onSuccess, onError) {
          $http({
            method: 'get',
            url: [
              baseUrl,
              'population',
              args.year,
              args.country,
              args.age
            ].join('/') + '/'
          })
          .success(function (data) {
            if (data) {
              onSuccess(data);
            }
          })
          .error(function () {
            if (onError) {
              onError();
            }
            console.info('loadPopulation() error');
          });
        }
      };
    })

    .service('BrowserService', function () {
      return {
        isSupported: function () {
          return bowser.webkit || bowser.gecko;
        },
        isTouchDevice: function () {
          return !!('ontouchstart' in window);
        }
      };
    })
  ;
}());