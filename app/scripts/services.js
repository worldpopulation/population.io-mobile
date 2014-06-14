(function () {
  'use strict';

  angular.module('populationioApp')

    .service('PeopleGridService', function (PopulationIOService) {
      return {
        worldPopulation: (7168 * 1000000000),
        getData: function (pos) {
          var data = [];
          for (var i = pos; i <= pos + 250; i += 1) {
            if (i < this.getWorldPopulation()) {
              data.push({
                rank: i,
                sex: 'male'
              });
            }
          }
          return data;
        },
        getWorldPopulation: function() {
          return this.worldPopulation;
        }
      };
    })

    .service('ProfileService', function() {
      return {
        gender: 'male',
        birthday: '',
        country: '',
        active: false,
        getAge: function() {
          var ageDate = new Date(Date.now() - (new Date(this.birthday)).getTime());
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
      };
    })

    .service('PopulationIOService', function ($rootScope, $http) {

      var baseUrl = ' http://api.population.io/1.0',
        countries = [];

      return {
        worldPopulation: (7168 * 1000000000),
        getCelebrities: function (startRank) {
          return [
            {rank: 500000110, name: 'Britney Spears', 'birthday': '1983-04-17', gender: 'female', country: 'USA'},
            {rank: 500000136, name: 'John Doe', 'birthday': '1984-05-17', gender: 'male', country: 'Austria'},
            {rank: 500000004, name: 'Max Payne', 'birthday': '1985-03-22', gender: 'male', country: 'USA'},
            {rank: 5000000152, name: 'Patrick Bateman', 'birthday': '1974-03-22', gender: 'male', country: 'Germany'},
            {rank: 7000000000, name: 'Jane Doe', 'birthday': '1992-03-22', gender: 'female', country: 'Russia'}
          ];
          console.log(_.filter(celebs, function (celeb) {return celeb.rank >= startRank && celeb.rank <= endRank}))

          return _.filter(celebs, function (celeb) {return celeb.rank <= endRank && celeb.rank >= startRank})
        },
        getRank: function () {
          return 5040123456789;
        },
        setWorldPopulation: function(worldPopulation) {
          this.worldPopulation = worldPopulation;
          $rootScope.$emit('populationChanged');
        },
        getWorldPopulation: function () {
          var p2013 = 7203304915; // from api?
          var p2014 = 7211239210; // from api?
          var growthRate = Math.log(p2014 / p2013) / (365 * 24 * 60 * 60);
          var start = new Date(2013, 7, 1, 12, 0, 0, 0);
          var now = new Date();
          var dif = now.getTime() - start.getTime();
          var diffSec = dif / 1000;

          return parseInt(p2013 * Math.pow((1 + growthRate), diffSec), 0);
        },

        // GET /api/1.0/countries/
        loadCountries: function (onSuccess) {
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
              console.error('getCountries() error');
            });
        },

        // GET /api/1.0/wp-rank/{dob}/{sex}/{country}/today/
        loadWpRankToday: function (args, onSuccess) {
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
            .error(function () {
              console.error('loadWpRankToday() error');
            });
        },

        // GET /api/1.0/wp-rank/{dob}/{sex}/{country}/ranked/{rank}
        loadWpRankRanked: function(args, onSuccess) {
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
              } else {
                onSuccess('2050-01-01');
              }
            })
            .error(function () {
              console.error('loadWpRankRanked() error');
              onSuccess('2050-01-01');
            });
        },

        // GET /api/1.0/life-expectancy/remaining/{sex}/{country}/{date}/{age}
        loadLifeExpectancyRemaining: function(args, onSuccess) {
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
              console.error('loadLifeExpectancyRemaining() error');
            });
        },

        // GET /api/1.0/life-expectancy/total/{sex}/{country}/{dob}
        loadLifeExpectancyTotal: function(args, onSuccess) {
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
            console.error('loadLifeExpectancyTotal() error');
          });
        },

        // GET /api/1.0/population/{year}/{country}
        loadPopulation: function(args, onSuccess) {
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
              console.error('loadPopulation() error');
            });
        }
      };
    })

    .service('BrowserService', function($window) {
      return {
        isSupported: function() {
          var isWebKit = 'WebkitAppearance' in document.documentElement.style;
          return !isWebKit;
        },
        isTouchDevice: function() {
          return !!('ontouchstart' in window);
        }
      };
    })
  ;
}());