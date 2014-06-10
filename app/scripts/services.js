(function () {
  'use strict';

  angular.module('populationioApp')

    .service('PeopleGridService', function (PopulationIOService) {
      return {
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
        getWorldPopulation: function () {
          return 7168 * 1000000000;
        }
      };
    })

    .service('PopulationIOService', function () {
      return {
        getCelebrities: function (startRank) {
          console.log('startRank: ' + startRank);
          return [
            {rank: 500000110, name: 'Britney Spears', 'birthday': '1983-04-17', gender: 'female', country: 'USA'},
            {rank: 500000136, name: 'John Doe', 'birthday': '1984-05-17', gender: 'male', country: 'Austria'},
            {rank: 500000004, name: 'Max Payne', 'birthday': '1985-03-22', gender: 'male', country: 'USA'},
            {rank: 500000152, name: 'Patrick Bateman', 'birthday': '1974-03-22', gender: 'male', country: 'Germany'},
            {rank: 500000207, name: 'Jane Doe', 'birthday': '1992-03-22', gender: 'female', country: 'Russia'}
          ];
        },
        getRank: function () {
          return 5040123456789;
        },
        getWorldPopulation: function () {
          return 7168 * 1000000000;
        },
        getCountries: function() {
          return [
            'Germany', 'USA', 'Spain', 'France', 'Russia', 'Great Britian'
          ];
        }
      };
    })

    .service('RankGraphService', function () {
      return {
        getData: function (country) {
          if (country === 'ALL') {
            return [
              { age: 10, people: 80 },
              { age: 17, people: 90 },
              { age: 19, people: 90 },
              { age: 22, people: 70 },
              { age: 39, people: 30 },
              { age: 44, people: 10 },
              { age: 63, people: 9 },
              { age: 90, people: 8 }
            ];
          } else {
            return [
              { age: 10, people: 100 },
              { age: 20, people: 80 },
              { age: 30, people: 90 },
              { age: 33, people: 70 },
              { age: 45, people: 65 },
              { age: 50, people: 50 },
              { age: 60, people: 20 },
              { age: 80, people: 5 }
            ];
          }
        },
        getMyAge: function () {
          return 22;
        }
      };
    })

    .service('StoryService', function () {
      return {
        getData: function () {
          return [
            {
              tstamp: new Date('2051/05/12').getTime(),
              title: 'Life expactancy in Germany'
            },
            {
              tstamp: new Date('2044/01/23').getTime(),
              title: 'Global life expactency'
            },
            {
              tstamp: new Date().getTime(),
              title: 'Now',
              now: true
            },
            {
              tstamp: new Date('2001/09/01').getTime(),
              title: 'You turned 18!'
            },
            {
              tstamp: new Date('1991/07/30').getTime(),
              title: '5th billion person'
            },
            {
              tstamp: new Date('1986/05/12').getTime(),
              title: '4th billion person'
            },
            {
              tstamp: new Date('1986/12/11').getTime(),
              title: 'First man on the moon'
            },
            {
              tstamp: new Date('1972/10/09').getTime(),
              title: 'Born',
              born: true
            }
          ];
        }
      };
    })

    .service('ExpectancyMapService', function () {
      // TODO: ExpectancyMapService
    })
  ;
}());