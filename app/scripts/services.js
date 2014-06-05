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
          year: 2051,
          title: 'Life expactancy in Germany'
        },{
          year: 2044,
          title: 'Global life expactency'
        },{
          year: 2014,
          title: 'Now',
          now: true
        },{
          year: 2001,
          title: 'You turned 18!'
        },{
          year: 1991,
          title: '5th billion person'
        },{
          year: 1986,
          title: '4th billion person'
        },{
          year: 1986,
          title: 'First man on the moon'
        },{
          year: 1972,
          title: 'Born',
          born: true
        }];
      }
    };
  })
  ;
}());