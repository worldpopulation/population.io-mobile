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
  ;
}());