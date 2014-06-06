(function () {
  'use strict';

  angular.module('populationioApp')

  .service('PeopleGridService', function (PopulationIOService) {
    return {
      getData: function() {
        var data = [];
        for (var i=0; i<= 200; i+=1) {
          var offset = 50 - i;
          data.push({
            rank: PopulationIOService.getRank() + offset,
            sex: 'male'
          });
        }
        return data;
      }
    };
  })

  .service('PopulationIOService', function () {
    return {
      getRank: function() {
        return 1234567890;
      }
    };
  })

  .service('StoryService', function () {
    return {
      getData: function() {
        return [{
          tstamp: new Date('2051/05/12').getTime(),
          title: 'Life expactancy in Germany'
        },{
          tstamp: new Date('2044/01/23').getTime(),
          title: 'Global life expactency'
        },{
          tstamp: new Date().getTime(),
          title: 'Now',
          now: true
        },{
          tstamp: new Date('2001/09/01').getTime(),
          title: 'You turned 18!'
        },{
          tstamp: new Date('1991/07/30').getTime(),
          title: '5th billion person'
        },{
          tstamp: new Date('1986/05/12').getTime(),
          title: '4th billion person'
        },{
          tstamp: new Date('1986/12/11').getTime(),
          title: 'First man on the moon'
        },{
          tstamp: new Date('1972/10/09').getTime(),
          title: 'Born',
          born: true
        }];
      }
    };
  })

  .service('ExpectancyMapService', function() {
    // TODO: ExpectancyMapService
  })
  ;
}());