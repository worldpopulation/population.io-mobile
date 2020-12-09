(function () {
  'use strict';

  angular.module('populationioApp')

  .service('ProfileService', function () {
    return {
      gender: 'female',
      birthday: {year: null, month: null, day: null, formatted: ''},
      country: '',
      active: false,
      getAge: function () {
        var ageDate = new Date(Date.now() - (new Date(this.birthday.formatted)).getTime());
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      },
      getAgeString: function () {
        var ageDate = new Date(Date.now() - (new Date(this.birthday.formatted)).getTime());
        var year = Math.abs(ageDate.getUTCFullYear() - 1970),
        months = ageDate.getMonth();
        return year + 'y' + months + 'm';
      }
    };
  })
  .service('PopulationIOService', ['$rootScope', '$http',
  function ($rootScope, $http) {

    var baseUrl = ' //d6wn6bmjj722w.population.io/1.0';

    return {
      getWorldPopulation: function (onSuccess, onError) {
        $http({
          method: 'get',
          url: baseUrl + '/population/World/today-and-tomorrow/'
        })
        .success(function (data) {
          if (data && onSuccess) {
            onSuccess(data);
          }
        })
        .error(function () {
          if (onError) {
            onError();
          }
          console.info('getWorldPopulation() error');
        });
      },

      getLocalPopulation: function (country, onSuccess, onError) {
        $http({
          method: 'get',
          url: baseUrl + '/population/' + (country == "eSwatini" ? "Swaziland" : country) + '/today-and-tomorrow/'
        })
        .success(function (data) {
          if (data && onSuccess) {
            onSuccess(data);
          }
        })
        .error(function () {
          if (onError) {
            onError();
          }
          console.info('getCountryPopulation() error');
        });
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
          console.info('loadCountries() error');
        });
      },

      // GET /1.0/mortality-distribution/World/unisex/today/
      loadMortalityDistribution: function (args, onSuccess, onError) {
        var worldDistribution, countryDistribution,
        worldChances = [], countryChances = []
        ;
        $http({
          method: 'get',
          url: baseUrl + '/mortality-distribution/World/' + args.gender + '/' + args.age + 'y/today'
        })
        .success(function (data) {
          if (data.mortality_distribution) {
            worldDistribution = data.mortality_distribution;
            var worldChancesPure = _.reduce(worldDistribution, function (acc, n) {
              acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + n.mortality_percent);
              return acc
            }, []);
            _.each(worldDistribution, function (item, index) {
              worldChances.push({age: item.age, mortality_percent: worldChancesPure[index]})
            });

            $http({
              method: 'get',
              url: baseUrl + '/mortality-distribution/' + (args.country == "eSwatini" ? "Swaziland" : args.country) + '/' + args.gender + '/' + args.age + 'y/today'
            })
            .success(function (data) {
              if (data.mortality_distribution && onSuccess) {
                countryDistribution = data.mortality_distribution;
                var countryChancesPure = _.reduce(countryDistribution, function (acc, n) {
                  acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + n.mortality_percent);
                  return acc
                }, []);

                _.each(countryDistribution, function (item, index) {
                  countryChances.push({age: item.age, mortality_percent: countryChancesPure[index]})
                });

                onSuccess({
                  worldDistribution: worldDistribution,
                  countryDistribution: countryDistribution,
                  worldChances: worldChances,
                  countryChances: countryChances
                });

              }
            })
            .error(function () {
              if (onError) {
                onError();
              }
              console.info('loadMortalityDistribution() error');
            });


          }
        })
        .error(function () {
          if (onError) {
            onError();
          }
          console.info('loadCountries() error');
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
            (args.country == "eSwatini" ? "Swaziland" : args.country),
            'today'
          ].join('/') + '/'
        })
        .success(function (data) {
          if (data.rank) {
            onSuccess(data.rank);
          }
        })
        .error(function (err) {
          if (onError) {
            onError();
          }
          console.info('loadWpRankToday() error');
        });
      },

      // GET /1.0/wp-rank/{dob}/{sex}/{country}/on/{date}/
      loadWpRankOnDate: function (args, onSuccess, onError) {
        //console.log('loadWpRankOnDate')
        $http({
          method: 'get',
          url: [
            baseUrl,
            'wp-rank',
            args.dob,
            args.sex,
            (args.country == "eSwatini" ? "Swaziland" : args.country),
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
            (args.country == "eSwatini" ? "Swaziland" : args.country),
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
            (args.country == "eSwatini" ? "Swaziland" : args.country),
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
            (args.country == "eSwatini" ? "Swaziland" : args.country),
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
            (args.country == "eSwatini" ? "Swaziland" : args.country)
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
            (args.country == "eSwatini" ? "Swaziland" : args.country),
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
  }])

  .service('BrowserService', function () {
    return {
      isSupported: function () {
        return bowser.webkit || bowser.gecko || (bowser.msie && bowser.version > 10);
      },
      isTouchDevice: function () {
        return !!('ontouchstart' in window);
      }
    };
  })
  ;
}());
